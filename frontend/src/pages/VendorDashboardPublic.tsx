import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  Users,
  Briefcase,
  MessageCircle,
  Loader2,
  Trash2
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

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  isActive: boolean;
  images: string[];
  tags: string[];
  createdAt: string;
}

interface Review {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
  service?: {
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  vendorResponse?: string;
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
  services?: Service[];
  reviews?: Review[];
  stats: {
    totalViews: number;
    totalMessages: number;
    businessRating: number;
    totalReviews: number;
    averageRating: number;
  };
}

interface VendorDashboardPublicProps {
  isDemo?: boolean;
}

const VendorDashboardPublic: React.FC<VendorDashboardPublicProps> = ({ isDemo = true }) => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewResponseModal, setReviewResponseModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [businessModal, setBusinessModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [responseText, setResponseText] = useState('');
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    tags: ''
  });
  const [businessForm, setBusinessForm] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });
  const [operationLoading, setOperationLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [vendorId]);

  const fetchDashboardData = async () => {
    try {
      if (isDemo || !vendorId) {
        // Demo mode data or public view
        setDashboardData({
          user: {
            id: 'demo-user',
            name: 'Demo Vendor',
            email: 'demo@vendor.com',
            role: 'vendor',
            createdAt: new Date().toISOString()
          },
          vendor: {
            id: 'demo-vendor',
            name: 'Bella Vista Restaurant',
            description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations. Family-owned restaurant serving pasta, pizza, and seafood dishes.',
            category: 'Restaurants',
            address: '456 Main Street, Downtown City, NY 10001',
            phone: '+1-555-0123',
            email: 'info@bellavista.com',
            website: 'https://bellavista-restaurant.com',
            rating: 4.7,
            views: 1250,
            location: { lat: 40.7589, lng: -73.9851 }
          },
          recentMessages: [
            { sender: { name: 'John Doe' }, createdAt: new Date().toISOString() },
            { sender: { name: 'Jane Smith' }, createdAt: new Date(Date.now() - 86400000).toISOString() }
          ],
          services: [
            {
              _id: 'demo-service-1',
              name: 'Traditional Pasta Carbonara',
              description: 'Authentic Roman pasta dish with pancetta, eggs, Pecorino Romano cheese, and black pepper. A classic Italian favorite.',
              price: 24.99,
              duration: '15-20 minutes',
              category: 'Main Courses',
              isActive: true,
              images: [],
              tags: ['pasta', 'italian', 'traditional', 'main-course'],
              createdAt: new Date().toISOString()
            },
            {
              _id: 'demo-service-2',
              name: 'Margherita Pizza',
              description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil.',
              price: 18.99,
              duration: '12-15 minutes',
              category: 'Pizza',
              isActive: true,
              images: [],
              tags: ['pizza', 'vegetarian', 'classic', 'margherita'],
              createdAt: new Date().toISOString()
            }
          ],
          reviews: [
            {
              _id: 'demo-review-1',
              customer: { name: 'Alice Johnson', email: 'alice@example.com' },
              service: { name: 'Basic Service' },
              rating: 5,
              title: 'Excellent Service!',
              comment: 'Very satisfied with the service provided.',
              createdAt: new Date().toISOString()
            }
          ],
          stats: {
            totalViews: 150,
            totalMessages: 5,
            businessRating: 4.5,
            totalReviews: 3,
            averageRating: 4.5
          },
          messages: []
        });
      } else {
        // Fetch public vendor data
        const response = await api.get(`/vendors/${vendorId}/public`);
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                  {dashboardData.vendor?.name.charAt(0).toUpperCase() || 'B'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{dashboardData.vendor?.name || 'Business Dashboard'}</h1>
                <p className="text-muted-foreground">Public Business Profile</p>
                {dashboardData.vendor && (
                  <p className="text-sm text-primary font-medium">
                    {dashboardData.vendor.category}
                  </p>
                )}
              </div>
            </div>
          </div>

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
                  {dashboardData.stats.averageRating?.toFixed(1) || dashboardData.stats.businessRating.toFixed(1)}
                  <Star className="w-4 h-4 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalReviews || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Info */}
                {dashboardData.vendor && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
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
                    <CardDescription>Business location on the map</CardDescription>
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
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Learn more about this business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.vendor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{dashboardData.vendor.name}</h3>
                          <p className="text-muted-foreground">{dashboardData.vendor.description}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Category: {dashboardData.vendor.category}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{dashboardData.vendor.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <p>Phone: {dashboardData.vendor.phone}</p>
                            <p>Email: {dashboardData.vendor.email}</p>
                            {dashboardData.vendor.website && (
                              <p>Website: <a href={dashboardData.vendor.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{dashboardData.vendor.website}</a></p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Services Offered
                  </CardTitle>
                  <CardDescription>Available services and offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.services && dashboardData.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dashboardData.services.filter(service => service.isActive).map((service) => (
                        <Card key={service._id} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <Badge variant="default">Active</Badge>
                            </div>
                            <CardDescription>{service.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Price:</span>
                                <span className="font-medium">${service.price}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Duration:</span>
                                <span>{service.duration}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Category:</span>
                                <span>{service.category}</span>
                              </div>
                              {service.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {service.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No services available</h3>
                      <p className="text-muted-foreground">
                        This business hasn't listed any services yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Customer Reviews
                  </CardTitle>
                  <CardDescription>What customers are saying</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.reviews && dashboardData.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.reviews.map((review) => (
                        <Card key={review._id} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>
                                    {review.customer.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{review.customer.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <h4 className="font-medium mb-2">{review.title}</h4>
                            <p className="text-muted-foreground mb-4">{review.comment}</p>
                            {review.service && (
                              <p className="text-sm text-muted-foreground mb-4">
                                Service: {review.service.name}
                              </p>
                            )}
                            {review.vendorResponse && (
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm font-medium mb-1">Business Response:</p>
                                <p className="text-sm">{review.vendorResponse}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                      <p className="text-muted-foreground">
                        This business hasn't received any reviews yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Messages</CardTitle>
                  <CardDescription>Recent customer inquiries</CardDescription>
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No messages available.
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
                      Views: {dashboardData.stats.totalViews}
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
                      Messages: {dashboardData.stats.totalMessages}
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

export default VendorDashboardPublic;
