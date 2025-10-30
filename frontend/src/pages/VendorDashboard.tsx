import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

interface VendorDashboardProps {
  isDemo?: boolean;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ isDemo = true }) => {
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (isDemo) {
        // Mock data for demo mode
        setDashboardData({
          user: {
            id: 'demo-user',
            name: 'Mike Johnson',
            email: 'mike@quickfixhandyman.com',
            role: 'vendor',
            createdAt: new Date().toISOString()
          },
          vendor: {
            id: 'demo-vendor',
            name: 'Quick Fix Handyman Services',
            description: 'Reliable handyman services for all your home repair needs. From minor fixes to major renovations, we handle it all with professionalism and care.',
            category: 'Home Services',
            address: '789 Oak Avenue, Rivertown, CA 90210',
            phone: '+1-888-555-7890',
            email: 'contact@quickfixhandyman.com',
            website: 'https://quickfixhandyman.com',
            rating: 4.7,
            views: 245,
            location: { lat: 34.0522, lng: -118.2437 }
          },
          recentMessages: [
            { sender: { name: 'Sarah Martinez' }, createdAt: new Date().toISOString() },
            { sender: { name: 'David Chen' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { sender: { name: 'Lisa Thompson' }, createdAt: new Date(Date.now() - 172800000).toISOString() }
          ],
          services: [
            {
              _id: 'demo-service-1',
              name: 'Basic Home Repair',
              description: 'General home repairs including minor fixes, painting, and maintenance.',
              price: 75,
              duration: '1-2 hours',
              category: 'Home Services',
              isActive: true,
              images: [],
              tags: ['repair', 'maintenance', 'home'],
              createdAt: new Date().toISOString()
            },
            {
              _id: 'demo-service-2',
              name: 'Plumbing Service',
              description: 'Professional plumbing repairs, installations, and emergency services.',
              price: 120,
              duration: '1 hour',
              category: 'Plumbing',
              isActive: true,
              images: [],
              tags: ['plumbing', 'emergency', 'installation'],
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: 'demo-service-3',
              name: 'Electrical Work',
              description: 'Safe and reliable electrical installations, repairs, and upgrades.',
              price: 95,
              duration: '1-3 hours',
              category: 'Electrical',
              isActive: true,
              images: [],
              tags: ['electrical', 'safety', 'installation'],
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ],
          reviews: [
            {
              _id: 'demo-review-1',
              customer: { name: 'Sarah Martinez', email: 'sarah@email.com' },
              service: { name: 'Basic Home Repair' },
              rating: 5,
              title: 'Outstanding Service!',
              comment: 'Mike and his team were professional, punctual, and did excellent work on our kitchen repairs. Highly recommend!',
              createdAt: new Date().toISOString()
            },
            {
              _id: 'demo-review-2',
              customer: { name: 'David Chen', email: 'david@email.com' },
              service: { name: 'Plumbing Service' },
              rating: 4,
              title: 'Good Work',
              comment: 'Fixed our leaky faucet quickly. Would use again.',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
              _id: 'demo-review-3',
              customer: { name: 'Lisa Thompson', email: 'lisa@email.com' },
              service: { name: 'Electrical Work' },
              rating: 5,
              title: 'Reliable and Skilled',
              comment: 'Installed new lighting fixtures perfectly. Very satisfied with the quality and timeliness.',
              createdAt: new Date(Date.now() - 172800000).toISOString()
            }
          ],
          stats: {
            totalViews: 245,
            totalMessages: 8,
            businessRating: 4.7,
            totalReviews: 3,
            averageRating: 4.7
          }
        });
      } else {
        const response = await api.get('/dashboard/vendor');
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (!isDemo) navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleRespondToReview = async () => {
    if (!selectedReview || !responseText.trim()) return;

    setOperationLoading(true);
    try {
      await api.post(`/reviews/${selectedReview._id}/respond`, { text: responseText });
      toast({
        title: "Response sent",
        description: "Your response has been posted to the review.",
      });
      setReviewResponseModal(false);
      setResponseText('');
      setSelectedReview(null);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleServiceSubmit = async () => {
    if (!serviceForm.name || !serviceForm.description || !serviceForm.price) return;

    setOperationLoading(true);
    try {
      const serviceData = {
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        tags: serviceForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: true
      };

      if (isDemo) {
        // Demo mode: Update local state
        const newService = {
          _id: selectedService ? selectedService._id : 'demo-service-' + Date.now(),
          ...serviceData,
          images: [],
          createdAt: selectedService ? selectedService.createdAt : new Date().toISOString()
        };

        setDashboardData(prev => ({
          ...prev,
          services: selectedService
            ? prev.services?.map(s => s._id === selectedService._id ? newService : s)
            : [...(prev.services || []), newService]
        }));

        toast({
          title: selectedService ? "Service updated" : "Service created",
          description: selectedService ? "Your service has been updated successfully." : "Your new service has been added successfully.",
        });
      } else {
        // Real API calls
        if (selectedService) {
          // Update existing service
          await api.put(`/services/${selectedService._id}`, serviceData);
          toast({
            title: "Service updated",
            description: "Your service has been updated successfully.",
          });
        } else {
          // Create new service
          await api.post('/services', serviceData);
          toast({
            title: "Service created",
            description: "Your new service has been added successfully.",
          });
        }
        fetchDashboardData(); // Refresh data
      }

      setServiceModal(false);
      setServiceForm({ name: '', description: '', price: '', duration: '', category: '', tags: '' });
      setSelectedService(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleServiceDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    setOperationLoading(true);
    try {
      await api.delete(`/services/${serviceId}`);
      toast({
        title: "Service deleted",
        description: "The service has been removed successfully.",
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleToggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    setOperationLoading(true);
    try {
      await api.put(`/services/${serviceId}`, { isActive: !currentStatus });
      toast({
        title: "Status updated",
        description: `Service has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update service status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const openServiceModal = (service?: Service) => {
    if (service) {
      setSelectedService(service);
      setServiceForm({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration,
        category: service.category,
        tags: service.tags.join(', ')
      });
    } else {
      setSelectedService(null);
      setServiceForm({ name: '', description: '', price: '', duration: '', category: '', tags: '' });
    }
    setServiceModal(true);
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
                      <CardTitle className="flex items-center justify-between">
                        Business Information
                        <Button variant="outline" size="sm" onClick={() => setBusinessModal(true)}>
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

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Services Management
                    </div>
                    <Button onClick={() => openServiceModal()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </CardTitle>
                  <CardDescription>Manage your business services and offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.services && dashboardData.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dashboardData.services.map((service) => (
                        <Card key={service._id} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{service.name}</CardTitle>
                              <Badge variant={service.isActive ? "default" : "secondary"}>
                                {service.isActive ? "Active" : "Inactive"}
                              </Badge>
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
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm" variant="outline" onClick={() => openServiceModal(service)}>
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleToggleServiceStatus(service._id, service.isActive)}>
                                Toggle Status
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No services yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first service to showcase what you offer to customers.
                      </p>
                      <Button onClick={() => openServiceModal()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Service
                      </Button>
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
                  <CardDescription>View and respond to customer reviews</CardDescription>
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
                            {review.vendorResponse ? (
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm font-medium mb-1">Your Response:</p>
                                <p className="text-sm">{review.vendorResponse}</p>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => {
                                setSelectedReview(review);
                                setReviewResponseModal(true);
                              }}>
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Respond to Review
                              </Button>
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
                        Reviews from customers will appear here once they start leaving feedback.
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

      {/* Modals */}
      {/* Review Response Modal */}
      <Dialog open={reviewResponseModal} onOpenChange={setReviewResponseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>
              Respond to {selectedReview?.customer.name}'s review for {selectedReview?.service?.name || 'your business'}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {selectedReview?.customer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedReview?.customer.name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (selectedReview?.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm">{selectedReview?.rating}/5</span>
                  </div>
                </div>
              </div>
              <h4 className="font-medium mb-1">{selectedReview?.title}</h4>
              <p className="text-sm text-muted-foreground">{selectedReview?.comment}</p>
            </div>
            <div>
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                placeholder="Write your response to this review..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setReviewResponseModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRespondToReview} disabled={operationLoading || !responseText.trim()}>
              {operationLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Send Response
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Modal */}
      <Dialog open={serviceModal} onOpenChange={setServiceModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {selectedService ? 'Update your service details.' : 'Create a new service for your business.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service-name">Service Name *</Label>
              <Input
                id="service-name"
                placeholder="e.g., Basic Consultation"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="service-category">Category</Label>
              <Input
                id="service-category"
                placeholder="e.g., Consultation, Repair"
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="service-price">Price ($) *</Label>
              <Input
                id="service-price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="service-duration">Duration</Label>
              <Input
                id="service-duration"
                placeholder="e.g., 1 hour, 30 minutes"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="service-description">Description *</Label>
              <Textarea
                id="service-description"
                placeholder="Describe your service..."
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="service-tags">Tags (comma-separated)</Label>
              <Input
                id="service-tags"
                placeholder="e.g., consultation, basic, premium"
                value={serviceForm.tags}
                onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setServiceModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleServiceSubmit} disabled={operationLoading || !serviceForm.name || !serviceForm.description || !serviceForm.price}>
              {operationLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedService ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Business Modal */}
      <Dialog open={businessModal} onOpenChange={setBusinessModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Business Information</DialogTitle>
            <DialogDescription>
              Update your business profile details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="business-name">Business Name *</Label>
              <Input
                id="business-name"
                placeholder="Your business name"
                value={businessForm.name}
                onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-category">Category</Label>
              <Input
                id="business-category"
                placeholder="e.g., Restaurant, Services"
                value={businessForm.category}
                onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-phone">Phone</Label>
              <Input
                id="business-phone"
                placeholder="+1 (555) 123-4567"
                value={businessForm.phone}
                onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-email">Email</Label>
              <Input
                id="business-email"
                type="email"
                placeholder="contact@yourbusiness.com"
                value={businessForm.email}
                onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="business-website">Website</Label>
              <Input
                id="business-website"
                placeholder="https://yourwebsite.com"
                value={businessForm.website}
                onChange={(e) => setBusinessForm({ ...businessForm, website: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="business-description">Description</Label>
              <Textarea
                id="business-description"
                placeholder="Describe your business..."
                value={businessForm.description}
                onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="business-address">Address</Label>
              <Textarea
                id="business-address"
                placeholder="Your business address"
                value={businessForm.address}
                onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setBusinessModal(false)}>
              Cancel
            </Button>
            <Button disabled={operationLoading}>
              {operationLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Business
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default VendorDashboard;
