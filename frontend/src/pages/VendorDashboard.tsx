import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  MessageSquare,
  Eye,
  Star,
  Settings,
  LogOut,
  MapPin,
  Edit,
  Plus,
  TrendingUp,
  Users
} from "lucide-react";
import api from "@/lib/api";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Message {
  _id: string;
  sender: {
    name: string;
  };
  text: string;
  createdAt: string;
}

interface RecentMessage {
  sender?: {
    name: string;
  };
  createdAt: string;
}

interface VendorDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  vendor: {
    id: string;
    name: string;
    description: string;
    category: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    rating: number;
    views: number;
    location: {
      lat: number;
      lng: number;
    };
  } | null;
  recentMessages: RecentMessage[];
  messages?: Message[];
  stats: {
    totalViews: number;
    totalMessages: number;
    businessRating: number;
  };
}

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/vendor');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Failed to load dashboard data</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">
                  {dashboardData.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {dashboardData.user.name}!</h1>
                <p className="text-muted-foreground">{dashboardData.user.email}</p>
                {dashboardData.vendor && (
                  <p className="text-sm text-primary font-medium">
                    Managing: {dashboardData.vendor.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Business Setup Warning */}
          {!dashboardData.vendor && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Complete Your Business Setup</CardTitle>
                <CardDescription className="text-orange-700">
                  You haven't set up your business profile yet. Add your business details to start receiving customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalViews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalMessages}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {dashboardData.stats.businessRating.toFixed(1)}
                  <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12%</div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Info */}
                {dashboardData.vendor && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Business Information
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold">{dashboardData.vendor.name}</h3>
                        <p className="text-sm text-muted-foreground">{dashboardData.vendor.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Category:</span>
                          <p>{dashboardData.vendor.category}</p>
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span>
                          <p>{dashboardData.vendor.phone}</p>
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>
                          <p>{dashboardData.vendor.email}</p>
                        </div>
                        <div>
                          <span className="font-medium">Website:</span>
                          <p>{dashboardData.vendor.website || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{dashboardData.vendor.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Latest customer inquiries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentMessages.length > 0 ? (
                        dashboardData.recentMessages.map((message, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {message.sender?.name?.charAt(0).toUpperCase() || 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {message.sender?.name || 'Customer'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">New</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No recent messages
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map Section */}
              {dashboardData.vendor && dashboardData.vendor.location && (
                <Card>
                  <CardHeader>
                    <CardTitle>Business Location</CardTitle>
                    <CardDescription>Your business location on the map</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 rounded-lg overflow-hidden">
                      <MapContainer
                        center={{ lat: dashboardData.vendor.location.lat, lng: dashboardData.vendor.location.lng }}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <Marker position={{ lat: dashboardData.vendor.location.lat, lng: dashboardData.vendor.location.lng }}>
                          <Popup>
                            <div className="text-center">
                              <h3 className="font-semibold">{dashboardData.vendor.name}</h3>
                              <p className="text-sm">{dashboardData.vendor.address}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Management</CardTitle>
                  <CardDescription>Manage your business profile and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <Edit className="w-5 h-5 mb-2" />
                        <div className="font-medium">Edit Business Info</div>
                        <div className="text-sm text-muted-foreground">Update name, description, contact details</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <MapPin className="w-5 h-5 mb-2" />
                        <div className="font-medium">Update Location</div>
                        <div className="text-sm text-muted-foreground">Change business address and map location</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <Building className="w-5 h-5 mb-2" />
                        <div className="font-medium">Business Hours</div>
                        <div className="text-sm text-muted-foreground">Set operating hours and availability</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <div className="text-left">
                        <Star className="w-5 h-5 mb-2" />
                        <div className="font-medium">Photos & Gallery</div>
                        <div className="text-sm text-muted-foreground">Add business photos and images</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Messages</CardTitle>
                  <CardDescription>All customer inquiries and conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.messages && dashboardData.messages.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.messages.map((message) => (
                        <div key={message._id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {message.sender?.name?.charAt(0).toUpperCase() || 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {message.sender?.name || 'Customer'}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {message.text}
                          </p>
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No messages yet. Messages from customers will appear here.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Views Over Time</CardTitle>
                    <CardDescription>Business profile views in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Views: {dashboardData.stats.totalViews}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Message Activity</CardTitle>
                    <CardDescription>Customer inquiries over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Messages: {dashboardData.stats.totalMessages}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorDashboard;
