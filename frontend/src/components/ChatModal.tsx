import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface ChatModalProps {
    vendorId: string;
    open: boolean;
    onClose: () => void;
}

export function ChatModal({ vendorId, open, onClose }: ChatModalProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open || !vendorId) return;
        let isMounted = true;
        setLoading(true);
        setError("");
        api
            .get(`/api/chat/${vendorId}/messages`)
            .then((res) => {
                if (!isMounted) return;
                setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err?.response?.data?.message || err?.message || "Failed to load messages");
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [open, vendorId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = async () => {
        if (!text.trim()) return;
        try {
            const res = await api.post(`/api/chat/${vendorId}/messages`, { text: text.trim() });
            setMessages((prev) => [...prev, res.data?.data]);
            setText("");
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to send message");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-elegant">
                <div className="p-4 border-b border-card-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Chat with Vendor</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
                </div>

                <div className="p-4 h-80 overflow-y-auto space-y-3">
                    {loading && <div className="text-sm text-muted-foreground">Loading messages...</div>}
                    {error && <div className="text-sm text-destructive">{error}</div>}
                    {!loading && !error && messages.map((m) => (
                        <div key={m._id} className="flex">
                            <div className="bg-muted text-foreground rounded-xl px-3 py-2 max-w-[80%]">
                                {m.text}
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
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <Button onClick={sendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
}



