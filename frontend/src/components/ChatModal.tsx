import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";

interface Message {
    _id: string;
    sender: {
        name: string;
    };
    receiver?: {
        name: string;
    };
    text: string;
    createdAt: string;
}

interface ChatModalProps {
    businessId: string;
    businessName?: string;
    open: boolean;
    onClose: () => void;
}

export function ChatModal({ businessId, businessName, open, onClose }: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendError, setSendError] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open || !businessId) return;
        let isMounted = true;
        setLoading(true);
        setSendError("");
        api
            .get(`/api/chat/${businessId}/messages`)
            .then((res) => {
                if (!isMounted) return;
                setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
            })
            .catch((err) => {
                if (!isMounted) return;
                // Don't set error for loading - we want to show the preloaded message
                setMessages([]);
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [open, businessId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = async () => {
        if (!text.trim() || sending) return;
        setSending(true);
        setSendError("");
        try {
            const res = await api.post(`/api/chat/${businessId}/messages`, { text: text.trim() });
            setMessages((prev) => [...prev, res.data?.data]);
            setText("");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            setSendError(error?.response?.data?.message || error?.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-elegant">
                <div className="p-4 border-b border-card-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Chat with {businessName || "Business"}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                </div>

                <div className="p-4 h-80 overflow-y-auto space-y-3">
                    {loading && <div className="text-sm text-muted-foreground">Loading messages...</div>}
                    {sendError && <div className="text-sm text-destructive">{sendError}</div>}
                    {!loading && messages.length === 0 && (
                        <div className="flex items-start space-x-2">
                            <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">V</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-muted text-foreground rounded-xl px-3 py-2 max-w-[80%]">
                                    <p className="text-sm">Hi, I'm currently unavailable. Please leave a message and I'll get back to you soon.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {!loading && messages.map((m) => (
                        <div key={m._id} className="flex items-start space-x-2">
                            <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                    {m.sender?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-muted text-foreground rounded-xl px-3 py-2 max-w-[80%]">
                                    <p className="text-sm">{m.text}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(m.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="p-4 border-t border-card-border flex items-center gap-2">
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !sending) sendMessage();
                        }}
                        disabled={sending}
                    />
                    <Button onClick={sendMessage} disabled={sending || !text.trim()}>
                        {sending ? "Sending..." : "Send"}
                    </Button>
                </div>
            </div>
        </div>
    );
}



