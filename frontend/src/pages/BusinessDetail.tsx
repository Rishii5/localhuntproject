import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Clock, Star, MessageCircle, Share2, Heart, Camera, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatModal } from "@/components/ChatModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";

interface Business {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  website?: string;
  email?: string;
  openingHours?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  distance: string;
  tags: string[];
  verified: boolean;
  description: string;
  services?: string[];
  photos: string[];
  reviews: {
    rating: number;
    comment: string;
    user: string;
    date: string;
  }[];
  isOpen: boolean;
}

// Mock data for detailed business information - includes all businesses from CategoryDetail.tsx
const mockBusinesses: Record<string, Business> = {
  "1": {
    id: "1",
    name: "City General Hospital",
    category: "Hospitals",
    subcategory: "Multi-Specialty Hospital",
    rating: 4.7,
    reviewCount: 1248,
    address: "123 Medical Center Drive, Downtown",
    phone: "+1 (555) 123-4567",
    website: "www.citygeneralhospital.com",
    email: "info@citygeneralhospital.com",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "0.8 km",
    tags: ["Emergency", "Insurance", "24/7"],
    verified: true,
    description: "A leading multi-specialty hospital providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.",
    services: [
      "Emergency Care",
      "Cardiology",
      "Neurology",
      "Orthopedics",
      "Maternity Care",
      "Diagnostic Imaging",
      "Pharmacy"
    ],
    photos: [
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Excellent care and professional staff. Highly recommended!", user: "John D.", date: "2024-01-15" },
      { rating: 4, comment: "Good emergency services, but waiting times can be long.", user: "Sarah M.", date: "2024-01-10" },
      { rating: 5, comment: "State-of-the-art facilities and compassionate doctors.", user: "Mike R.", date: "2024-01-08" }
    ],
    isOpen: true
  },
  "2": {
    id: "2",
    name: "Heart Care Specialty Center",
    category: "Hospitals",
    subcategory: "Cardiology Clinic",
    rating: 4.9,
    reviewCount: 567,
    address: "456 Heart Avenue, Medical District",
    phone: "+1 (555) 987-6543",
    website: "www.heartcarespecialty.com",
    email: "contact@heartcarespecialty.com",
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    distance: "1.2 km",
    tags: ["Cardiology", "Insurance", "Specialist"],
    verified: true,
    description: "Specialized cardiology center offering comprehensive heart care including diagnostics, treatment, and preventive services.",
    services: [
      "Cardiac Consultations",
      "Echocardiography",
      "Stress Testing",
      "Angioplasty",
      "Heart Surgery",
      "Cardiac Rehabilitation"
    ],
    photos: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Outstanding cardiology care. Dr. Smith is exceptional.", user: "Lisa K.", date: "2024-01-12" },
      { rating: 5, comment: "Advanced cardiac procedures with excellent outcomes.", user: "Tom W.", date: "2024-01-05" },
      { rating: 4, comment: "Great facility and caring staff.", user: "Anna P.", date: "2024-01-03" }
    ],
    isOpen: true
  },
  "3": {
    id: "3",
    name: "Children's Medical Center",
    category: "Hospitals",
    subcategory: "Pediatric Hospital",
    rating: 4.8,
    reviewCount: 892,
    address: "789 Kids Health Boulevard, Family District",
    phone: "+1 (555) 456-7890",
    website: "www.childrensmedicalcenter.com",
    email: "info@childrensmedicalcenter.com",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "2.1 km",
    tags: ["Pediatric", "NICU", "Emergency"],
    verified: true,
    description: "Dedicated pediatric hospital providing specialized medical care for children from newborns to adolescents with a child-friendly environment.",
    services: [
      "Pediatric Emergency Care",
      "Neonatal Intensive Care",
      "Pediatric Surgery",
      "Child Psychology",
      "Vaccination Services",
      "Developmental Assessments"
    ],
    photos: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Amazing pediatric care. My child felt safe and well-cared for.", user: "Maria G.", date: "2024-01-14" },
      { rating: 5, comment: "Excellent NICU facilities and dedicated staff.", user: "David L.", date: "2024-01-09" },
      { rating: 4, comment: "Child-friendly environment and professional care.", user: "Emma S.", date: "2024-01-07" }
    ],
    isOpen: true
  },
  "4": {
    id: "4",
    name: "Advanced Diagnostic Center",
    category: "Hospitals",
    subcategory: "Diagnostic Center",
    rating: 4.6,
    reviewCount: 234,
    address: "321 Scan Street, Medical Plaza",
    phone: "+1 (555) 111-2222",
    website: "www.advanceddiagnostic.com",
    email: "appointments@advanceddiagnostic.com",
    openingHours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "Closed"
    },
    distance: "1.5 km",
    tags: ["MRI", "CT Scan", "Lab Tests"],
    verified: true,
    description: "Advanced diagnostic imaging center offering MRI, CT scans, X-rays, and comprehensive laboratory testing with quick turnaround times.",
    services: [
      "MRI Scanning",
      "CT Scanning",
      "X-Ray Services",
      "Ultrasound",
      "Blood Tests",
      "Urine Analysis",
      "ECG"
    ],
    photos: [
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 4, comment: "Quick and accurate diagnostic services.", user: "Robert T.", date: "2024-01-11" },
      { rating: 5, comment: "State-of-the-art equipment and professional technicians.", user: "Jennifer M.", date: "2024-01-06" },
      { rating: 4, comment: "Convenient location and efficient service.", user: "Chris B.", date: "2024-01-04" }
    ],
    isOpen: false
  },
  "5": {
    id: "5",
    name: "Sunrise Rehabilitation Hospital",
    category: "Hospitals",
    subcategory: "Rehabilitation Center",
    rating: 4.5,
    reviewCount: 156,
    address: "654 Recovery Road, Wellness District",
    phone: "+1 (555) 333-4444",
    website: "www.sunriserehab.com",
    email: "info@sunriserehab.com",
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    distance: "3.2 km",
    tags: ["Physiotherapy", "Speech Therapy", "Recovery"],
    verified: false,
    description: "Specialized rehabilitation hospital offering physiotherapy, occupational therapy, and speech therapy in a supportive recovery environment.",
    services: [
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
      "Pain Management",
      "Sports Rehabilitation",
      "Post-Surgical Recovery"
    ],
    photos: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 4, comment: "Excellent rehabilitation programs and dedicated therapists.", user: "Patricia H.", date: "2024-01-13" },
      { rating: 5, comment: "Helped me recover from surgery with personalized care.", user: "George F.", date: "2024-01-08" },
      { rating: 4, comment: "Comprehensive therapy services in a supportive environment.", user: "Linda C.", date: "2024-01-02" }
    ],
    isOpen: true
  },
  "6": {
    id: "6",
    name: "Emergency Care Plus",
    category: "Hospitals",
    subcategory: "Emergency Clinic",
    rating: 4.4,
    reviewCount: 678,
    address: "987 Urgent Care Lane, Quick Response Zone",
    phone: "+1 (555) 555-6666",
    website: "www.emergencycareplus.com",
    email: "urgent@emergencycareplus.com",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "0.9 km",
    tags: ["Emergency", "Walk-in", "24/7"],
    verified: true,
    description: "24/7 emergency clinic providing immediate medical care for urgent conditions with walk-in availability and experienced emergency physicians.",
    services: [
      "Emergency Care",
      "Urgent Care",
      "Minor Injuries",
      "Infections",
      "X-Ray Services",
      "Laboratory Testing",
      "Prescription Services"
    ],
    photos: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 4, comment: "Fast emergency care when I needed it most.", user: "Kevin R.", date: "2024-01-16" },
      { rating: 5, comment: "24/7 availability and quick response times.", user: "Rachel D.", date: "2024-01-11" },
      { rating: 4, comment: "Professional staff and well-equipped facility.", user: "Mark S.", date: "2024-01-09" }
    ],
    isOpen: true
  },
  "7": {
    id: "7",
    name: "Bella Italia",
    category: "Restaurants",
    subcategory: "Italian Restaurant",
    rating: 4.8,
    reviewCount: 892,
    address: "456 Pasta Street, Downtown",
    phone: "+1 (555) 234-5678",
    website: "www.bellaitalia.com",
    email: "reservations@bellaitalia.com",
    openingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM"
    },
    distance: "0.5 km",
    tags: ["Italian", "Romantic", "Wine"],
    verified: true,
    description: "Experience authentic Italian cuisine in an elegant setting with traditional recipes passed down through generations.",
    services: [
      "Dining In",
      "Takeout",
      "Catering",
      "Private Events",
      "Wine Tasting",
      "Delivery"
    ],
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Authentic Italian cuisine with amazing pasta dishes. Highly recommended!", user: "Sophia L.", date: "2024-01-20" },
      { rating: 4, comment: "Romantic atmosphere and excellent wine selection.", user: "Marco R.", date: "2024-01-18" },
      { rating: 5, comment: "Best Italian restaurant in town. Service is impeccable.", user: "Elena M.", date: "2024-01-15" }
    ],
    isOpen: true
  },
  "8": {
    id: "8",
    name: "Dragon Palace",
    category: "Restaurants",
    subcategory: "Chinese Restaurant",
    rating: 4.6,
    reviewCount: 654,
    address: "789 Wok Way, Chinatown",
    phone: "+1 (555) 345-6789",
    website: "www.dragonpalace.com",
    email: "orders@dragonpalace.com",
    openingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM"
    },
    distance: "1.1 km",
    tags: ["Chinese", "Takeout", "Family"],
    verified: true,
    description: "Authentic Chinese cuisine featuring traditional dishes from various regions, perfect for family gatherings and takeout.",
    services: [
      "Dining In",
      "Takeout",
      "Delivery",
      "Catering",
      "Buffet",
      "Private Rooms"
    ],
    photos: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Delicious dim sum and authentic Chinese flavors. Family favorite!", user: "Li Wei.", date: "2024-01-22" },
      { rating: 4, comment: "Great takeout options and friendly staff.", user: "John K.", date: "2024-01-19" },
      { rating: 5, comment: "Traditional Chinese dishes prepared with care.", user: "Anna T.", date: "2024-01-17" }
    ],
    isOpen: true
  },
  "9": {
    id: "9",
    name: "Taco Fiesta",
    category: "Restaurants",
    subcategory: "Mexican Restaurant",
    rating: 4.7,
    reviewCount: 432,
    address: "321 Salsa Boulevard, South District",
    phone: "+1 (555) 456-7890",
    website: "www.tacofiesta.com",
    email: "info@tacofiesta.com",
    openingHours: {
      monday: "10:00 AM - 10:00 PM",
      tuesday: "10:00 AM - 10:00 PM",
      wednesday: "10:00 AM - 10:00 PM",
      thursday: "10:00 AM - 10:00 PM",
      friday: "10:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "11:00 AM - 9:00 PM"
    },
    distance: "2.3 km",
    tags: ["Mexican", "Spicy", "Authentic"],
    verified: true,
    description: "Vibrant Mexican restaurant offering traditional tacos, enchiladas, and margaritas with authentic flavors from Mexico.",
    services: [
      "Dining In",
      "Takeout",
      "Delivery",
      "Catering",
      "Happy Hour",
      "Live Music"
    ],
    photos: [
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Spicy and flavorful Mexican food. Love the authentic taste!", user: "Carlos M.", date: "2024-01-21" },
      { rating: 4, comment: "Great margaritas and friendly atmosphere.", user: "Maria S.", date: "2024-01-16" },
      { rating: 5, comment: "Best tacos in the city. Fresh ingredients.", user: "David P.", date: "2024-01-14" }
    ],
    isOpen: false
  },
  "10": {
    id: "10",
    name: "Burger Joint",
    category: "Restaurants",
    subcategory: "American Restaurant",
    rating: 4.5,
    reviewCount: 321,
    address: "654 Grill Street, West End",
    phone: "+1 (555) 567-8901",
    website: "www.burgerjoint.com",
    email: "orders@burgerjoint.com",
    openingHours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "12:00 PM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM"
    },
    distance: "1.8 km",
    tags: ["Burgers", "American", "Casual"],
    verified: false,
    description: "Classic American diner serving juicy burgers, fries, and milkshakes in a casual, welcoming atmosphere.",
    services: [
      "Dining In",
      "Takeout",
      "Delivery",
      "Drive-Thru",
      "Kids Menu",
      "Outdoor Seating"
    ],
    photos: [
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 4, comment: "Juicy burgers and casual vibe. Perfect for a quick meal.", user: "Tom H.", date: "2024-01-23" },
      { rating: 5, comment: "Best fries in town and great milkshakes.", user: "Lisa G.", date: "2024-01-20" },
      { rating: 4, comment: "Classic American diner with friendly service.", user: "Mike D.", date: "2024-01-18" }
    ],
    isOpen: true
  },
  "11": {
    id: "11",
    name: "Grand Plaza Hotel",
    category: "Hotels",
    subcategory: "Luxury Hotel",
    rating: 4.9,
    reviewCount: 756,
    address: "123 Luxury Lane, Downtown",
    phone: "+1 (555) 678-9012",
    website: "www.grandplazahotel.com",
    email: "reservations@grandplazahotel.com",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "0.3 km",
    tags: ["Luxury", "Spa", "Pool"],
    verified: true,
    description: "Experience unparalleled luxury at Grand Plaza Hotel, featuring world-class amenities, elegant rooms, and exceptional service in the heart of downtown.",
    services: [
      "Luxury Rooms",
      "Spa Services",
      "Swimming Pool",
      "Fine Dining",
      "Concierge",
      "Fitness Center",
      "Business Center"
    ],
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Exceptional luxury experience with top-notch service and amenities.", user: "Alex R.", date: "2024-01-18" },
      { rating: 5, comment: "Spa was amazing and the pool area is stunning.", user: "Maria L.", date: "2024-01-15" },
      { rating: 4, comment: "Great location and comfortable rooms.", user: "John D.", date: "2024-01-12" }
    ],
    isOpen: true
  },
  "12": {
    id: "12",
    name: "Budget Inn",
    category: "Hotels",
    subcategory: "Budget Hotel",
    rating: 4.2,
    reviewCount: 234,
    address: "456 Economy Street, North District",
    phone: "+1 (555) 789-0123",
    website: "www.budgetinn.com",
    email: "frontdesk@budgetinn.com",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "2.5 km",
    tags: ["Budget", "Clean", "WiFi"],
    verified: true,
    description: "Affordable accommodation with clean rooms, reliable WiFi, and essential amenities for budget-conscious travelers.",
    services: [
      "Clean Rooms",
      "Free WiFi",
      "Continental Breakfast",
      "Parking",
      "Laundry Facilities",
      "24/7 Front Desk"
    ],
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 4, comment: "Clean and affordable with good WiFi. Perfect for budget travelers.", user: "Sarah K.", date: "2024-01-20" },
      { rating: 4, comment: "Basic but comfortable stay. Staff was friendly.", user: "Mike T.", date: "2024-01-17" },
      { rating: 5, comment: "Great value for money and convenient location.", user: "Emma W.", date: "2024-01-14" }
    ],
    isOpen: true
  },
  "13": {
    id: "13",
    name: "Mountain View Resort",
    category: "Hotels",
    subcategory: "Resort Hotel",
    rating: 4.8,
    reviewCount: 543,
    address: "789 Scenic Drive, Mountain Area",
    phone: "+1 (555) 890-1234",
    website: "www.mountainviewresort.com",
    email: "bookings@mountainviewresort.com",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "15.2 km",
    tags: ["Resort", "Nature", "Activities"],
    verified: true,
    description: "Escape to nature at Mountain View Resort, offering stunning mountain vistas, outdoor activities, and luxurious accommodations.",
    services: [
      "Mountain Views",
      "Outdoor Activities",
      "Spa Services",
      "Fine Dining",
      "Hiking Trails",
      "Swimming Pool",
      "Conference Facilities"
    ],
    photos: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Breathtaking mountain views and excellent outdoor activities.", user: "David H.", date: "2024-01-19" },
      { rating: 5, comment: "Perfect resort for nature lovers with amazing hiking trails.", user: "Lisa P.", date: "2024-01-16" },
      { rating: 4, comment: "Beautiful scenery and relaxing atmosphere.", user: "Tom G.", date: "2024-01-13" }
    ],
    isOpen: true
  },
  "14": {
    id: "14",
    name: "Glow Beauty Salon",
    category: "Beauty & Spa",
    subcategory: "Beauty Salon",
    rating: 4.7,
    reviewCount: 345,
    address: "321 Beauty Boulevard, Shopping District",
    phone: "+1 (555) 901-2345",
    website: "www.glowbeautysalon.com",
    email: "appointments@glowbeautysalon.com",
    openingHours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "10:00 AM - 5:00 PM"
    },
    distance: "1.4 km",
    tags: ["Hair", "Makeup", "Nails"],
    verified: true,
    description: "Full-service beauty salon offering hair styling, makeup, and nail services with experienced professionals in a relaxing environment.",
    services: [
      "Hair Styling",
      "Hair Coloring",
      "Makeup Services",
      "Nail Services",
      "Facial Treatments",
      "Waxing",
      "Bridal Services"
    ],
    photos: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Amazing hair styling and friendly staff. Highly recommend!", user: "Sophia M.", date: "2024-01-22" },
      { rating: 4, comment: "Great makeup services for special occasions.", user: "Emma L.", date: "2024-01-19" },
      { rating: 5, comment: "Professional nail art and excellent service.", user: "Olivia R.", date: "2024-01-16" }
    ],
    isOpen: true
  },
  "15": {
    id: "15",
    name: "Tranquil Spa",
    category: "Beauty & Spa",
    subcategory: "Day Spa",
    rating: 4.9,
    reviewCount: 267,
    address: "654 Relaxation Road, Wellness Center",
    phone: "+1 (555) 012-3456",
    website: "www.tranquilspa.com",
    email: "bookings@tranquilspa.com",
    openingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 9:00 PM",
      saturday: "8:00 AM - 7:00 PM",
      sunday: "10:00 AM - 6:00 PM"
    },
    distance: "2.1 km",
    tags: ["Massage", "Facials", "Relaxation"],
    verified: true,
    description: "Luxurious day spa offering massages, facials, and relaxation treatments in a serene environment designed for ultimate wellness.",
    services: [
      "Swedish Massage",
      "Deep Tissue Massage",
      "Facial Treatments",
      "Body Scrubs",
      "Aromatherapy",
      "Hot Stone Therapy",
      "Reflexology"
    ],
    photos: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Incredible massage experience. Completely rejuvenated!", user: "Isabella T.", date: "2024-01-21" },
      { rating: 5, comment: "Best facial treatment I've ever had. Skin feels amazing.", user: "Ava K.", date: "2024-01-18" },
      { rating: 4, comment: "Peaceful atmosphere and skilled therapists.", user: "Mia S.", date: "2024-01-15" }
    ],
    isOpen: true
  },
  "16": {
    id: "16",
    name: "Power Fitness Gym",
    category: "Fitness",
    subcategory: "Fitness Center",
    rating: 4.6,
    reviewCount: 423,
    address: "987 Strength Street, Fitness District",
    phone: "+1 (555) 123-4567",
    website: "www.powerfitness.com",
    email: "membership@powerfitness.com",
    openingHours: {
      monday: "5:00 AM - 11:00 PM",
      tuesday: "5:00 AM - 11:00 PM",
      wednesday: "5:00 AM - 11:00 PM",
      thursday: "5:00 AM - 11:00 PM",
      friday: "5:00 AM - 11:00 PM",
      saturday: "6:00 AM - 10:00 PM",
      sunday: "7:00 AM - 9:00 PM"
    },
    distance: "1.7 km",
    tags: ["Gym", "Weights", "Cardio"],
    verified: true,
    description: "State-of-the-art fitness center offering comprehensive workout facilities, personal training, and group fitness classes in a motivating environment.",
    services: [
      "Weight Training",
      "Cardio Equipment",
      "Group Classes",
      "Personal Training",
      "Yoga Classes",
      "Swimming Pool",
      "Sauna"
    ],
    photos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Excellent gym with modern equipment and great trainers. Highly recommended!", user: "Alex J.", date: "2024-01-20" },
      { rating: 4, comment: "Clean facilities and good variety of classes.", user: "Sarah P.", date: "2024-01-17" },
      { rating: 5, comment: "Perfect place to stay in shape with friendly staff.", user: "Mike T.", date: "2024-01-14" }
    ],
    isOpen: true
  },
  "17": {
    id: "17",
    name: "Yoga Bliss Studio",
    category: "Fitness",
    subcategory: "Yoga Studio",
    rating: 4.8,
    reviewCount: 198,
    address: "147 Zen Lane, Wellness Area",
    phone: "+1 (555) 234-5678",
    website: "www.yogabliss.com",
    email: "info@yogabliss.com",
    openingHours: {
      monday: "6:00 AM - 9:00 PM",
      tuesday: "6:00 AM - 9:00 PM",
      wednesday: "6:00 AM - 9:00 PM",
      thursday: "6:00 AM - 9:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 8:00 PM",
      sunday: "8:00 AM - 6:00 PM"
    },
    distance: "2.8 km",
    tags: ["Yoga", "Meditation", "Wellness"],
    verified: true,
    description: "Tranquil yoga studio offering various yoga styles, meditation classes, and wellness workshops in a calming, supportive environment.",
    services: [
      "Hatha Yoga",
      "Vinyasa Flow",
      "Meditation Classes",
      "Wellness Workshops",
      "Private Sessions",
      "Yoga Teacher Training",
      "Sound Healing"
    ],
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Peaceful yoga classes that rejuvenate the mind and body. Love the instructors!", user: "Emma R.", date: "2024-01-19" },
      { rating: 5, comment: "Excellent meditation sessions and yoga flows.", user: "David L.", date: "2024-01-16" },
      { rating: 4, comment: "Serene atmosphere perfect for wellness practices.", user: "Lisa M.", date: "2024-01-13" }
    ],
    isOpen: true
  },
  "18": {
    id: "18",
    name: "Quick Fix Auto",
    category: "Automotive",
    subcategory: "Auto Repair",
    rating: 4.5,
    reviewCount: 312,
    address: "258 Mechanic Street, Industrial Area",
    phone: "+1 (555) 345-6789",
    website: "www.quickfixauto.com",
    email: "info@quickfixauto.com",
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    distance: "3.1 km",
    tags: ["Repair", "Maintenance", "Quick"],
    verified: true,
    description: "Professional auto repair shop offering comprehensive vehicle maintenance, diagnostics, and repair services with experienced mechanics and quality parts.",
    services: [
      "Oil Changes",
      "Brake Repair",
      "Engine Repair",
      "Transmission Service",
      "Tire Replacement",
      "Battery Replacement",
      "Diagnostics"
    ],
    photos: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Reliable and skilled technicians. Fixed our car quickly and professionally!", user: "John D.", date: "2024-01-19" },
      { rating: 4, comment: "Good work and fair pricing. Would use again for auto repairs.", user: "Maria S.", date: "2024-01-16" },
      { rating: 5, comment: "Comprehensive auto services with excellent customer service. Highly recommend!", user: "Robert L.", date: "2024-01-13" }
    ],
    isOpen: true
  },
  "19": {
    id: "19",
    name: "Elite Auto Service",
    category: "Automotive",
    subcategory: "Automotive",
    rating: 4.7,
    reviewCount: 456,
    address: "789 Car Care Boulevard, Auto District",
    phone: "+1 (555) 456-7890",
    website: "www.eliteautoservice.com",
    email: "info@eliteautoservice.com",
    openingHours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "Closed"
    },
    distance: "2.8 km",
    tags: ["Service", "Maintenance", "Premium"],
    verified: true,
    description: "Elite Auto Service provides premium automotive care with certified technicians, state-of-the-art equipment, and comprehensive vehicle servicing.",
    services: [
      "Full Service Maintenance",
      "Engine Diagnostics",
      "Brake Systems",
      "Transmission Repair",
      "Air Conditioning",
      "Electrical Systems",
      "Fleet Services"
    ],
    photos: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Professional service and excellent knowledge of vehicles. Helped maintain our fleet!", user: "Tom R.", date: "2024-01-18" },
      { rating: 4, comment: "Great maintenance services and responsive technicians.", user: "Lisa M.", date: "2024-01-15" },
      { rating: 5, comment: "Expert automotive care with modern equipment. Highly recommend!", user: "David P.", date: "2024-01-12" }
    ],
    isOpen: true
  },
  "20": {
    id: "20",
    name: "Bright Future Academy",
    category: "Education",
    subcategory: "Private School",
    rating: 4.8,
    reviewCount: 456,
    address: "147 Learning Lane, Education District",
    phone: "+1 (555) 567-8901",
    website: "www.brightfutureacademy.com",
    email: "admissions@brightfutureacademy.com",
    openingHours: {
      monday: "8:00 AM - 4:00 PM",
      tuesday: "8:00 AM - 4:00 PM",
      wednesday: "8:00 AM - 4:00 PM",
      thursday: "8:00 AM - 4:00 PM",
      friday: "8:00 AM - 4:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    distance: "2.3 km",
    tags: ["K-12", "STEM", "Sports"],
    verified: true,
    description: "Premier private school offering comprehensive K-12 education with emphasis on STEM, arts, and sports in a nurturing environment.",
    services: [
      "K-12 Education",
      "STEM Programs",
      "Arts Education",
      "Sports Programs",
      "After-School Care",
      "Summer Programs",
      "College Counseling"
    ],
    photos: [
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Excellent education with dedicated teachers and modern facilities. My child loves going here!", user: "Sarah M.", date: "2024-01-20" },
      { rating: 5, comment: "Great STEM programs and extracurricular activities. Highly recommend for quality education.", user: "John P.", date: "2024-01-17" },
      { rating: 4, comment: "Safe environment and caring staff. Good balance of academics and sports.", user: "Lisa K.", date: "2024-01-14" }
    ],
    isOpen: true
  },
  "21": {
    id: "21",
    name: "Tech University",
    category: "Education",
    subcategory: "University",
    rating: 4.7,
    reviewCount: 892,
    address: "258 Knowledge Boulevard, Campus Area",
    phone: "+1 (555) 678-9012",
    website: "www.techuniversity.edu",
    email: "admissions@techuniversity.edu",
    openingHours: {
      monday: "24/7",
      tuesday: "24/7",
      wednesday: "24/7",
      thursday: "24/7",
      friday: "24/7",
      saturday: "24/7",
      sunday: "24/7"
    },
    distance: "4.1 km",
    tags: ["Engineering", "Research", "Campus"],
    verified: true,
    description: "Leading technology university offering undergraduate and graduate programs in engineering, computer science, and related fields with state-of-the-art facilities.",
    services: [
      "Undergraduate Programs",
      "Graduate Programs",
      "Research Facilities",
      "Library Services",
      "Student Housing",
      "Career Services",
      "Athletics"
    ],
    photos: [
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Outstanding engineering programs with cutting-edge research facilities. Best decision for my career!", user: "Mike T.", date: "2024-01-19" },
      { rating: 4, comment: "Great campus life and supportive faculty. Excellent research opportunities.", user: "Anna R.", date: "2024-01-16" },
      { rating: 5, comment: "Innovative curriculum and modern labs. Highly recommended for tech enthusiasts.", user: "David L.", date: "2024-01-13" }
    ],
    isOpen: true
  },
  "22": {
    id: "22",
    name: "Little Stars Preschool",
    category: "Education",
    subcategory: "Preschool",
    rating: 4.9,
    reviewCount: 234,
    address: "369 Play Street, Family District",
    phone: "+1 (555) 789-0123",
    website: "www.littlestarspreschool.com",
    email: "info@littlestarspreschool.com",
    openingHours: {
      monday: "7:00 AM - 6:00 PM",
      tuesday: "7:00 AM - 6:00 PM",
      wednesday: "7:00 AM - 6:00 PM",
      thursday: "7:00 AM - 6:00 PM",
      friday: "7:00 AM - 6:00 PM",
      saturday: "Closed",
      sunday: "Closed"
    },
    distance: "1.8 km",
    tags: ["Early Learning", "Play-based", "Safe"],
    verified: true,
    description: "Nurturing preschool offering play-based early childhood education in a safe, stimulating environment designed for children's development.",
    services: [
      "Early Childhood Education",
      "Play-Based Learning",
      "Music Classes",
      "Art Activities",
      "Outdoor Play",
      "Nutritious Meals",
      "Parent Involvement"
    ],
    photos: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Wonderful preschool with caring teachers and engaging activities. My child has thrived here!", user: "Emma S.", date: "2024-01-21" },
      { rating: 5, comment: "Safe and nurturing environment with excellent early learning programs.", user: "Robert K.", date: "2024-01-18" },
      { rating: 4, comment: "Play-based learning approach is perfect for young children. Highly recommend!", user: "Maria G.", date: "2024-01-15" }
    ],
    isOpen: true
  },
  "23": {
    id: "23",
    name: "Prime Properties",
    category: "Real Estate",
    subcategory: "Real Estate Agency",
    rating: 4.6,
    reviewCount: 567,
    address: "147 Property Plaza, Business District",
    phone: "+1 (555) 890-1234",
    website: "www.primeproperties.com",
    email: "info@primeproperties.com",
    openingHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    distance: "2.7 km",
    tags: ["Sales", "Rentals", "Commercial"],
    verified: true,
    description: "Full-service real estate agency specializing in commercial properties, sales, and rentals with experienced agents and market expertise.",
    services: [
      "Commercial Sales",
      "Property Rentals",
      "Property Management",
      "Market Analysis",
      "Investment Consulting",
      "Property Valuation",
      "Legal Support"
    ],
    photos: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Professional service and excellent knowledge of the market. Helped me find my dream commercial space!", user: "Tom R.", date: "2024-01-18" },
      { rating: 4, comment: "Great rental options and responsive agents. Smooth transaction process.", user: "Lisa M.", date: "2024-01-15" },
      { rating: 5, comment: "Expert advice on commercial properties. Highly recommend for business investments.", user: "David P.", date: "2024-01-12" }
    ],
    isOpen: true
  },
  "24": {
    id: "24",
    name: "Home Sweet Home Realty",
    category: "Real Estate",
    subcategory: "Real Estate Broker",
    rating: 4.8,
    reviewCount: 345,
    address: "258 Realty Road, Residential Area",
    phone: "+1 (555) 901-2345",
    website: "www.homesweethomerealty.com",
    email: "contact@homesweethomerealty.com",
    openingHours: {
      monday: "8:00 AM - 7:00 PM",
      tuesday: "8:00 AM - 7:00 PM",
      wednesday: "8:00 AM - 7:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 7:00 PM",
      saturday: "9:00 AM - 5:00 PM",
      sunday: "10:00 AM - 4:00 PM"
    },
    distance: "3.2 km",
    tags: ["Residential", "Family Homes", "Local"],
    verified: true,
    description: "Dedicated real estate brokerage specializing in residential properties with a focus on family homes and local community expertise.",
    services: [
      "Home Sales",
      "Residential Rentals",
      "Property Search",
      "Market Updates",
      "Home Staging",
      "Mortgage Assistance",
      "Neighborhood Tours"
    ],
    photos: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Found our perfect family home through them. Knowledgeable and patient throughout the process.", user: "Sarah L.", date: "2024-01-20" },
      { rating: 5, comment: "Excellent local market knowledge and great communication. Very satisfied!", user: "Mike K.", date: "2024-01-17" },
      { rating: 4, comment: "Helped us sell our home quickly. Professional and reliable service.", user: "Anna T.", date: "2024-01-14" }
    ],
    isOpen: true
  },
  "25": {
    id: "25",
    name: "AllFix Services",
    category: "Services",
    subcategory: "Home Services",
    rating: 4.5,
    reviewCount: 678,
    address: "369 Service Street, Maintenance District",
    phone: "+1 (555) 012-3456",
    website: "www.allfixservices.com",
    email: "info@allfixservices.com",
    openingHours: {
      monday: "7:00 AM - 8:00 PM",
      tuesday: "7:00 AM - 8:00 PM",
      wednesday: "7:00 AM - 8:00 PM",
      thursday: "7:00 AM - 8:00 PM",
      friday: "7:00 AM - 8:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "9:00 AM - 4:00 PM"
    },
    distance: "2.9 km",
    tags: ["Plumbing", "Electrical", "Repairs"],
    verified: true,
    description: "Professional home repair and maintenance services including plumbing, electrical work, and general repairs with licensed technicians.",
    services: [
      "Plumbing Services",
      "Electrical Repairs",
      "General Repairs",
      "Maintenance Contracts",
      "Emergency Services",
      "Home Inspections",
      "Renovations"
    ],
    photos: [
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Reliable and skilled technicians. Fixed our plumbing issue quickly and professionally!", user: "John D.", date: "2024-01-19" },
      { rating: 4, comment: "Good electrical work and fair pricing. Would use again for home repairs.", user: "Maria S.", date: "2024-01-16" },
      { rating: 5, comment: "Comprehensive home services with excellent customer service. Highly recommend!", user: "Robert L.", date: "2024-01-13" }
    ],
    isOpen: true
  },
  "26": {
    id: "26",
    name: "Clean Sweep Cleaning",
    category: "Services",
    subcategory: "Cleaning Services",
    rating: 4.7,
    reviewCount: 432,
    address: "147 Clean Avenue, Service Center",
    phone: "+1 (555) 123-4567",
    website: "www.cleansweepcleaning.com",
    email: "bookings@cleansweepcleaning.com",
    openingHours: {
      monday: "6:00 AM - 9:00 PM",
      tuesday: "6:00 AM - 9:00 PM",
      wednesday: "6:00 AM - 9:00 PM",
      thursday: "6:00 AM - 9:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 8:00 PM",
      sunday: "8:00 AM - 6:00 PM"
    },
    distance: "1.6 km",
    tags: ["House Cleaning", "Office", "Eco-friendly"],
    verified: false,
    description: "Eco-friendly cleaning services for homes and offices using sustainable products and professional cleaning techniques.",
    services: [
      "House Cleaning",
      "Office Cleaning",
      "Deep Cleaning",
      "Move-in/Move-out",
      "Carpet Cleaning",
      "Window Cleaning",
      "Eco-Friendly Products"
    ],
    photos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Thorough cleaning and eco-friendly products. My home has never looked better!", user: "Lisa P.", date: "2024-01-21" },
      { rating: 4, comment: "Reliable office cleaning service with professional staff. Great attention to detail.", user: "Tom K.", date: "2024-01-18" },
      { rating: 5, comment: "Excellent value and consistent quality. Eco-friendly approach is a plus!", user: "Anna M.", date: "2024-01-15" }
    ],
    isOpen: true
  },
  "27": {
    id: "27",
    name: "Wellness Medical Center",
    category: "Healthcare",
    subcategory: "General Practice",
    rating: 4.6,
    reviewCount: 789,
    address: "258 Health Boulevard, Medical District",
    phone: "+1 (555) 234-5678",
    website: "www.wellnessmedicalcenter.com",
    email: "appointments@wellnessmedicalcenter.com",
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    distance: "2.4 km",
    tags: ["Primary Care", "Preventive", "Family"],
    verified: true,
    description: "Comprehensive primary care medical center offering preventive services, family medicine, and wellness programs in a patient-centered environment.",
    services: [
      "Primary Care",
      "Preventive Care",
      "Family Medicine",
      "Health Screenings",
      "Vaccinations",
      "Chronic Disease Management",
      "Wellness Programs"
    ],
    photos: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606811951340-0116b4d29c5c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Caring doctors and comprehensive primary care. Great for family health needs!", user: "Sarah T.", date: "2024-01-20" },
      { rating: 4, comment: "Excellent preventive care services and patient education. Very satisfied.", user: "Mike R.", date: "2024-01-17" },
      { rating: 5, comment: "Professional staff and convenient location. Highly recommend for primary care.", user: "Lisa K.", date: "2024-01-14" }
    ],
    isOpen: true
  },
  "28": {
    id: "28",
    name: "Dental Care Plus",
    category: "Healthcare",
    subcategory: "Dental Clinic",
    rating: 4.8,
    reviewCount: 567,
    address: "369 Smile Street, Dental Plaza",
    phone: "+1 (555) 345-6789",
    website: "www.dentalcareplus.com",
    email: "info@dentalcareplus.com",
    openingHours: {
      monday: "8:00 AM - 7:00 PM",
      tuesday: "8:00 AM - 7:00 PM",
      wednesday: "8:00 AM - 7:00 PM",
      thursday: "8:00 AM - 7:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    distance: "3.1 km",
    tags: ["Dentistry", "Cosmetic", "Emergency"],
    verified: true,
    description: "Full-service dental clinic offering general dentistry, cosmetic procedures, and emergency care with experienced dentists and modern facilities.",
    services: [
      "General Dentistry",
      "Cosmetic Dentistry",
      "Emergency Dental Care",
      "Teeth Whitening",
      "Dental Implants",
      "Orthodontics",
      "Periodontal Care"
    ],
    photos: [
      "https://images.unsplash.com/photo-1606811951340-0116b4d29c5c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Gentle and skilled dentists. My cosmetic work looks amazing and feels great!", user: "Emma L.", date: "2024-01-19" },
      { rating: 5, comment: "Excellent emergency dental care. Fast response and professional treatment.", user: "David P.", date: "2024-01-16" },
      { rating: 4, comment: "Comprehensive dental services with modern equipment. Very pleased with the results.", user: "Anna S.", date: "2024-01-13" }
    ],
    isOpen: true
  },
  "29": {
    id: "29",
    name: "Morning Brew Cafe",
    category: "Cafes",
    subcategory: "Coffee Shop",
    rating: 4.7,
    reviewCount: 345,
    address: "147 Coffee Corner, Downtown",
    phone: "+1 (555) 456-7890",
    website: "www.morningbrewcafe.com",
    email: "info@morningbrewcafe.com",
    openingHours: {
      monday: "6:00 AM - 8:00 PM",
      tuesday: "6:00 AM - 8:00 PM",
      wednesday: "6:00 AM - 8:00 PM",
      thursday: "6:00 AM - 8:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 9:00 PM",
      sunday: "7:00 AM - 7:00 PM"
    },
    distance: "0.8 km",
    tags: ["Coffee", "Pastries", "WiFi"],
    verified: true,
    description: "Cozy coffee shop serving premium coffee, fresh pastries, and light meals in a comfortable atmosphere with free WiFi.",
    services: [
      "Specialty Coffee",
      "Fresh Pastries",
      "Breakfast Items",
      "Free WiFi",
      "Outdoor Seating",
      "Catering",
      "Coffee Beans for Sale"
    ],
    photos: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Best coffee in town with amazing pastries. Perfect spot for morning meetings!", user: "John M.", date: "2024-01-22" },
      { rating: 4, comment: "Great WiFi and cozy atmosphere. My go-to place for remote work.", user: "Lisa R.", date: "2024-01-19" },
      { rating: 5, comment: "Freshly brewed coffee and delicious baked goods. Highly recommend!", user: "Tom K.", date: "2024-01-16" }
    ],
    isOpen: true
  },
  "30": {
    id: "30",
    name: "Sweet Treats Bakery",
    category: "Cafes",
    subcategory: "Bakery Cafe",
    rating: 4.9,
    reviewCount: 234,
    address: "258 Bakery Boulevard, Shopping District",
    phone: "+1 (555) 567-8901",
    website: "www.sweettreatsbakery.com",
    email: "info@sweettreatsbakery.com",
    openingHours: {
      monday: "7:00 AM - 8:00 PM",
      tuesday: "7:00 AM - 8:00 PM",
      wednesday: "7:00 AM - 8:00 PM",
      thursday: "7:00 AM - 8:00 PM",
      friday: "7:00 AM - 9:00 PM",
      saturday: "8:00 AM - 9:00 PM",
      sunday: "8:00 AM - 7:00 PM"
    },
    distance: "1.9 km",
    tags: ["Bakery", "Cakes", "Coffee"],
    verified: true,
    description: "Artisan bakery cafe offering freshly baked cakes, pastries, and specialty breads alongside premium coffee and light meals.",
    services: [
      "Fresh Pastries",
      "Cakes",
      "Specialty Breads",
      "Coffee",
      "Light Meals",
      "Catering",
      "Custom Orders"
    ],
    photos: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Heavenly cakes and pastries! Every bite is pure delight. Best bakery in the area!", user: "Sarah L.", date: "2024-01-21" },
      { rating: 5, comment: "Fresh baked goods daily with excellent coffee. Perfect for special occasions.", user: "Mike P.", date: "2024-01-18" },
      { rating: 4, comment: "Delicious treats and friendly service. Great place for dessert lovers.", user: "Anna T.", date: "2024-01-15" }
    ],
    isOpen: true
  },
  "31": {
    id: "31",
    name: "Fashion Central Mall",
    category: "Shopping",
    subcategory: "Shopping Mall",
    rating: 4.5,
    reviewCount: 1234,
    address: "369 Mall Drive, Shopping Center",
    phone: "+1 (555) 678-9012",
    website: "www.fashioncentralmall.com",
    email: "info@fashioncentralmall.com",
    openingHours: {
      monday: "10:00 AM - 9:00 PM",
      tuesday: "10:00 AM - 9:00 PM",
      wednesday: "10:00 AM - 9:00 PM",
      thursday: "10:00 AM - 9:00 PM",
      friday: "10:00 AM - 10:00 PM",
      saturday: "10:00 AM - 10:00 PM",
      sunday: "11:00 AM - 7:00 PM"
    },
    distance: "2.2 km",
    tags: ["Fashion", "Electronics", "Food Court"],
    verified: true,
    description: "Modern shopping mall featuring fashion boutiques, electronics stores, and a diverse food court in a convenient downtown location.",
    services: [
      "Fashion Boutiques",
      "Electronics Stores",
      "Food Court",
      "Entertainment",
      "Parking",
      "Customer Service",
      "Events"
    ],
    photos: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Amazing shopping experience with great variety of stores. Love the food court too!", user: "Emma R.", date: "2024-01-20" },
      { rating: 4, comment: "Convenient location with excellent electronics and fashion stores. Clean and well-maintained.", user: "David L.", date: "2024-01-17" },
      { rating: 5, comment: "Perfect place for shopping sprees. Wide selection and friendly atmosphere.", user: "Lisa M.", date: "2024-01-14" }
    ],
    isOpen: true
  },
  "32": {
    id: "32",
    name: "Local Market Square",
    category: "Shopping",
    subcategory: "Local Market",
    rating: 4.6,
    reviewCount: 567,
    address: "147 Market Street, Downtown",
    phone: "+1 (555) 789-0123",
    website: "www.localmarketsquare.com",
    email: "info@localmarketsquare.com",
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "7:00 AM - 5:00 PM",
      sunday: "Closed"
    },
    distance: "1.4 km",
    tags: ["Fresh Produce", "Local", "Weekly"],
    verified: true,
    description: "Weekly local market featuring fresh produce, artisanal goods, and community vendors in a vibrant downtown square.",
    services: [
      "Fresh Produce",
      "Artisanal Goods",
      "Local Vendors",
      "Farmers Market",
      "Community Events",
      "Seasonal Items",
      "Food Stalls"
    ],
    photos: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
    ],
    reviews: [
      { rating: 5, comment: "Fresh local produce and friendly vendors. Love supporting our community farmers!", user: "Sarah K.", date: "2024-01-19" },
      { rating: 4, comment: "Great weekly market with variety of goods. Always find something interesting.", user: "Tom P.", date: "2024-01-16" },
      { rating: 5, comment: "Authentic local market experience with high-quality products. Highly recommend!", user: "Anna S.", date: "2024-01-13" }
    ],
    isOpen: false
  }
};

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      try {
        // Try to fetch from API first
        const response = await api.get(`/businesses/${id}`);
        setBusiness(response.data);
      } catch (error) {
        // Fallback to mock data
        const mockBusiness = mockBusinesses[id];
        if (mockBusiness) {
          setBusiness(mockBusiness);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  const nextImage = () => {
    if (business) {
      setCurrentImageIndex((prev) => (prev + 1) % business.photos.length);
    }
  };

  const prevImage = () => {
    if (business) {
      setCurrentImageIndex((prev) => (prev - 1 + business.photos.length) % business.photos.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [business?.photos.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
            <p className="text-gray-600 mb-4">The business you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
            <p className="text-gray-600">{business.category} • {business.subcategory}</p>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-8 relative">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Main Image Container */}
            <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden bg-gray-200">
              <img
                src={business.photos[currentImageIndex]}
                alt={`${business.name} - Image ${currentImageIndex + 1} of ${business.photos.length}`}
                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                loading="lazy"
              />

              {/* Navigation Buttons */}
              {business.photos.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Dot Indicators */}
            {business.photos.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {business.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      index === currentImageIndex
                        ? 'bg-blue-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Image Counter */}
            <div className="text-center mt-2 text-sm text-gray-600">
              {currentImageIndex + 1} of {business.photos.length}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overview</span>
                  <div className="flex items-center space-x-2">
                    {business.verified && (
                      <Badge variant="secondary" className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant={business.isOpen ? "default" : "secondary"}>
                      {business.isOpen ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Open
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Closed
                        </>
                      )}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {renderStars(business.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {business.rating} ({business.reviewCount} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{business.distance}</span>
                </div>
                <p className="text-gray-700 mb-4">{business.description}</p>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            {business.services && business.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {business.services.map((service, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {business.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-3">
                            <AvatarFallback>
                              {review.user.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-sm">{business.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-3" />
                  <a href={`tel:${business.phone}`} className="text-sm text-blue-600 hover:underline">
                    {business.phone}
                  </a>
                </div>
                {business.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-3" />
                    <a
                      href={`https://${business.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {business.website}
                    </a>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-3" />
                    <a href={`mailto:${business.email}`} className="text-sm text-blue-600 hover:underline">
                      {business.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {business.openingHours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(business.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize">{day}</span>
                        <span className={hours === 'Closed' ? 'text-red-500' : 'text-gray-700'}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setShowChat(true)} disabled={!business.isOpen}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Business
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                Save to Favorites
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <ChatModal
          businessId={business.id}
          businessName={business.name}
          onClose={() => setShowChat(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default BusinessDetail;
