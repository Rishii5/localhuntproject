import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Filter, MapPin, SlidersHorizontal, Grid, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { ChatModal } from "@/components/ChatModal";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Vendor {
  _id: string;
  shopName?: string;
  name?: string;
  category?: string;
  address?: string;
  phone?: string;
  images?: string[];
  reviews?: { rating: number; comment: string; user: string; date: string }[];
  description?: string;
  subcategory?: string;
}

// Mock data for different categories
const mockBusinessData = {
  hospitals: [
    {
      id: "1",
      name: "City General Hospital",
      category: "Multi-Specialty Hospital",
      rating: 4.7,
      reviewCount: 1248,
      address: "123 Medical Center Drive, Downtown",
      phone: "+1 (555) 123-4567",
      image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "0.8 km",
      tags: ["Emergency", "Insurance", "24/7"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Excellent care and professional staff. Highly recommended!", user: "John D.", date: "2024-01-15" },
        { rating: 4, comment: "Good emergency services, but waiting times can be long.", user: "Sarah M.", date: "2024-01-10" },
        { rating: 5, comment: "State-of-the-art facilities and compassionate doctors.", user: "Mike R.", date: "2024-01-08" }
      ],
      description: "A leading multi-specialty hospital providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.",
      subcategory: "General Hospital"
    },
    {
      id: "2",
      name: "Heart Care Specialty Center",
      category: "Cardiology Clinic",
      rating: 4.9,
      reviewCount: 567,
      address: "456 Heart Avenue, Medical District",
      phone: "+1 (555) 987-6543",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.2 km",
      tags: ["Cardiology", "Insurance", "Specialist"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Outstanding cardiology care. Dr. Smith is exceptional.", user: "Lisa K.", date: "2024-01-12" },
        { rating: 5, comment: "Advanced cardiac procedures with excellent outcomes.", user: "Tom W.", date: "2024-01-05" },
        { rating: 4, comment: "Great facility and caring staff.", user: "Anna P.", date: "2024-01-03" }
      ],
      description: "Specialized cardiology center offering comprehensive heart care including diagnostics, treatment, and preventive services.",
      subcategory: "Cardiology"
    },
    {
      id: "3",
      name: "Children's Medical Center",
      category: "Pediatric Hospital",
      rating: 4.8,
      reviewCount: 892,
      address: "789 Kids Health Boulevard, Family District",
      phone: "+1 (555) 456-7890",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.1 km",
      tags: ["Pediatric", "NICU", "Emergency"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Amazing pediatric care. My child felt safe and well-cared for.", user: "Maria G.", date: "2024-01-14" },
        { rating: 5, comment: "Excellent NICU facilities and dedicated staff.", user: "David L.", date: "2024-01-09" },
        { rating: 4, comment: "Child-friendly environment and professional care.", user: "Emma S.", date: "2024-01-07" }
      ],
      description: "Dedicated pediatric hospital providing specialized medical care for children from newborns to adolescents with a child-friendly environment.",
      subcategory: "Pediatrics"
    },
    {
      id: "4",
      name: "Advanced Diagnostic Center",
      category: "Diagnostic Center",
      rating: 4.6,
      reviewCount: 234,
      address: "321 Scan Street, Medical Plaza",
      phone: "+1 (555) 111-2222",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
      isOpen: false,
      distance: "1.5 km",
      tags: ["MRI", "CT Scan", "Lab Tests"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 4, comment: "Quick and accurate diagnostic services.", user: "Robert T.", date: "2024-01-11" },
        { rating: 5, comment: "State-of-the-art equipment and professional technicians.", user: "Jennifer M.", date: "2024-01-06" },
        { rating: 4, comment: "Convenient location and efficient service.", user: "Chris B.", date: "2024-01-04" }
      ],
      description: "Advanced diagnostic imaging center offering MRI, CT scans, X-rays, and comprehensive laboratory testing with quick turnaround times.",
      subcategory: "Diagnostics"
    },
    {
      id: "5",
      name: "Sunrise Rehabilitation Hospital",
      category: "Rehabilitation Center",
      rating: 4.5,
      reviewCount: 156,
      address: "654 Recovery Road, Wellness District",
      phone: "+1 (555) 333-4444",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "3.2 km",
      tags: ["Physiotherapy", "Speech Therapy", "Recovery"],
      verified: false,
      photos: [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 4, comment: "Excellent rehabilitation programs and dedicated therapists.", user: "Patricia H.", date: "2024-01-13" },
        { rating: 5, comment: "Helped me recover from surgery with personalized care.", user: "George F.", date: "2024-01-08" },
        { rating: 4, comment: "Comprehensive therapy services in a supportive environment.", user: "Linda C.", date: "2024-01-02" }
      ],
      description: "Specialized rehabilitation hospital offering physiotherapy, occupational therapy, and speech therapy in a supportive recovery environment.",
      subcategory: "Rehabilitation"
    },
    {
      id: "6",
      name: "Emergency Care Plus",
      category: "Emergency Clinic",
      rating: 4.4,
      reviewCount: 678,
      address: "987 Urgent Care Lane, Quick Response Zone",
      phone: "+1 (555) 555-6666",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "0.9 km",
      tags: ["Emergency", "Walk-in", "24/7"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 4, comment: "Fast emergency care when I needed it most.", user: "Kevin R.", date: "2024-01-16" },
        { rating: 5, comment: "24/7 availability and quick response times.", user: "Rachel D.", date: "2024-01-11" },
        { rating: 4, comment: "Professional staff and well-equipped facility.", user: "Mark S.", date: "2024-01-09" }
      ],
      description: "24/7 emergency clinic providing immediate medical care for urgent conditions with walk-in availability and experienced emergency physicians.",
      subcategory: "Emergency Care"
    }
  ],
  restaurants: [
    {
      id: "7",
      name: "Bella Italia",
      category: "Italian Restaurant",
      rating: 4.8,
      reviewCount: 892,
      address: "456 Pasta Street, Downtown",
      phone: "+1 (555) 234-5678",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "0.5 km",
      tags: ["Italian", "Romantic", "Wine"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Authentic Italian cuisine with amazing pasta dishes. Highly recommended!", user: "Sophia L.", date: "2024-01-20" },
        { rating: 4, comment: "Romantic atmosphere and excellent wine selection.", user: "Marco R.", date: "2024-01-18" },
        { rating: 5, comment: "Best Italian restaurant in town. Service is impeccable.", user: "Elena M.", date: "2024-01-15" }
      ],
      description: "Experience authentic Italian cuisine in an elegant setting with traditional recipes passed down through generations.",
      subcategory: "Fine Dining"
    },
    {
      id: "8",
      name: "Dragon Palace",
      category: "Chinese Restaurant",
      rating: 4.6,
      reviewCount: 654,
      address: "789 Wok Way, Chinatown",
      phone: "+1 (555) 345-6789",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.1 km",
      tags: ["Chinese", "Takeout", "Family"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Delicious dim sum and authentic Chinese flavors. Family favorite!", user: "Li Wei.", date: "2024-01-22" },
        { rating: 4, comment: "Great takeout options and friendly staff.", user: "John K.", date: "2024-01-19" },
        { rating: 5, comment: "Traditional Chinese dishes prepared with care.", user: "Anna T.", date: "2024-01-17" }
      ],
      description: "Authentic Chinese cuisine featuring traditional dishes from various regions, perfect for family gatherings and takeout.",
      subcategory: "Chinese Cuisine"
    },
    {
      id: "9",
      name: "Taco Fiesta",
      category: "Mexican Restaurant",
      rating: 4.7,
      reviewCount: 432,
      address: "321 Salsa Boulevard, South District",
      phone: "+1 (555) 456-7890",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      isOpen: false,
      distance: "2.3 km",
      tags: ["Mexican", "Spicy", "Authentic"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Spicy and flavorful Mexican food. Love the authentic taste!", user: "Carlos M.", date: "2024-01-21" },
        { rating: 4, comment: "Great margaritas and friendly atmosphere.", user: "Maria S.", date: "2024-01-16" },
        { rating: 5, comment: "Best tacos in the city. Fresh ingredients.", user: "David P.", date: "2024-01-14" }
      ],
      description: "Vibrant Mexican restaurant offering traditional tacos, enchiladas, and margaritas with authentic flavors from Mexico.",
      subcategory: "Mexican Cuisine"
    },
    {
      id: "10",
      name: "Burger Joint",
      category: "American Restaurant",
      rating: 4.5,
      reviewCount: 321,
      address: "654 Grill Street, West End",
      phone: "+1 (555) 567-8901",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.8 km",
      tags: ["Burgers", "American", "Casual"],
      verified: false,
      photos: [
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 4, comment: "Juicy burgers and casual vibe. Perfect for a quick meal.", user: "Tom H.", date: "2024-01-23" },
        { rating: 5, comment: "Best fries in town and great milkshakes.", user: "Lisa G.", date: "2024-01-20" },
        { rating: 4, comment: "Classic American diner with friendly service.", user: "Mike D.", date: "2024-01-18" }
      ],
      description: "Classic American diner serving juicy burgers, fries, and milkshakes in a casual, welcoming atmosphere.",
      subcategory: "American Diner"
    }
  ],
  hotels: [
    {
      id: "11",
      name: "Grand Plaza Hotel",
      category: "Luxury Hotel",
      rating: 4.9,
      reviewCount: 756,
      address: "123 Luxury Lane, Downtown",
      phone: "+1 (555) 678-9012",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "0.3 km",
      tags: ["Luxury", "Spa", "Pool"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Exceptional luxury experience with top-notch service and amenities.", user: "Alex R.", date: "2024-01-18" },
        { rating: 5, comment: "Spa was amazing and the pool area is stunning.", user: "Maria L.", date: "2024-01-15" },
        { rating: 4, comment: "Great location and comfortable rooms.", user: "John D.", date: "2024-01-12" }
      ],
      description: "Experience unparalleled luxury at Grand Plaza Hotel, featuring world-class amenities, elegant rooms, and exceptional service in the heart of downtown.",
      subcategory: "Luxury Accommodation"
    },
    {
      id: "12",
      name: "Budget Inn",
      category: "Budget Hotel",
      rating: 4.2,
      reviewCount: 234,
      address: "456 Economy Street, North District",
      phone: "+1 (555) 789-0123",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.5 km",
      tags: ["Budget", "Clean", "WiFi"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 4, comment: "Clean and affordable with good WiFi. Perfect for budget travelers.", user: "Sarah K.", date: "2024-01-20" },
        { rating: 4, comment: "Basic but comfortable stay. Staff was friendly.", user: "Mike T.", date: "2024-01-17" },
        { rating: 5, comment: "Great value for money and convenient location.", user: "Emma W.", date: "2024-01-14" }
      ],
      description: "Affordable accommodation with clean rooms, reliable WiFi, and essential amenities for budget-conscious travelers.",
      subcategory: "Budget Accommodation"
    },
    {
      id: "13",
      name: "Mountain View Resort",
      category: "Resort Hotel",
      rating: 4.8,
      reviewCount: 543,
      address: "789 Scenic Drive, Mountain Area",
      phone: "+1 (555) 890-1234",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "15.2 km",
      tags: ["Resort", "Nature", "Activities"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Breathtaking mountain views and excellent outdoor activities.", user: "David H.", date: "2024-01-19" },
        { rating: 5, comment: "Perfect resort for nature lovers with amazing hiking trails.", user: "Lisa P.", date: "2024-01-16" },
        { rating: 4, comment: "Beautiful scenery and relaxing atmosphere.", user: "Tom G.", date: "2024-01-13" }
      ],
      description: "Escape to nature at Mountain View Resort, offering stunning mountain vistas, outdoor activities, and luxurious accommodations.",
      subcategory: "Nature Resort"
    }
  ],
  beautyspa: [
    {
      id: "14",
      name: "Glow Beauty Salon",
      category: "Beauty Salon",
      rating: 4.7,
      reviewCount: 345,
      address: "321 Beauty Boulevard, Shopping District",
      phone: "+1 (555) 901-2345",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.4 km",
      tags: ["Hair", "Makeup", "Nails"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Amazing hair styling and friendly staff. Highly recommend!", user: "Sophia M.", date: "2024-01-22" },
        { rating: 4, comment: "Great makeup services for special occasions.", user: "Emma L.", date: "2024-01-19" },
        { rating: 5, comment: "Professional nail art and excellent service.", user: "Olivia R.", date: "2024-01-16" }
      ],
      description: "Full-service beauty salon offering hair styling, makeup, and nail services with experienced professionals in a relaxing environment.",
      subcategory: "Beauty Salon"
    },
    {
      id: "15",
      name: "Tranquil Spa",
      category: "Day Spa",
      rating: 4.9,
      reviewCount: 267,
      address: "654 Relaxation Road, Wellness Center",
      phone: "+1 (555) 012-3456",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.1 km",
      tags: ["Massage", "Facials", "Relaxation"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Incredible massage experience. Completely rejuvenated!", user: "Isabella T.", date: "2024-01-21" },
        { rating: 5, comment: "Best facial treatment I've ever had. Skin feels amazing.", user: "Ava K.", date: "2024-01-18" },
        { rating: 4, comment: "Peaceful atmosphere and skilled therapists.", user: "Mia S.", date: "2024-01-15" }
      ],
      description: "Luxurious day spa offering massages, facials, and relaxation treatments in a serene environment designed for ultimate wellness.",
      subcategory: "Day Spa"
    }
  ],
  fitness: [
    {
      id: "16",
      name: "Power Fitness Gym",
      category: "Fitness Center",
      rating: 4.6,
      reviewCount: 423,
      address: "987 Strength Street, Fitness District",
      phone: "+1 (555) 123-4567",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.7 km",
      tags: ["Gym", "Weights", "Cardio"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Excellent gym with modern equipment and great trainers. Highly recommended!", user: "Alex J.", date: "2024-01-20" },
        { rating: 4, comment: "Clean facilities and good variety of classes.", user: "Sarah P.", date: "2024-01-17" },
        { rating: 5, comment: "Perfect place to stay in shape with friendly staff.", user: "Mike T.", date: "2024-01-14" }
      ],
      description: "State-of-the-art fitness center offering comprehensive workout facilities, personal training, and group fitness classes in a motivating environment.",
      subcategory: "Fitness Center"
    },
    {
      id: "17",
      name: "Yoga Bliss Studio",
      category: "Yoga Studio",
      rating: 4.8,
      reviewCount: 198,
      address: "147 Zen Lane, Wellness Area",
      phone: "+1 (555) 234-5678",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.8 km",
      tags: ["Yoga", "Meditation", "Wellness"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Peaceful yoga classes that rejuvenate the mind and body. Love the instructors!", user: "Emma R.", date: "2024-01-19" },
        { rating: 5, comment: "Excellent meditation sessions and yoga flows.", user: "David L.", date: "2024-01-16" },
        { rating: 4, comment: "Serene atmosphere perfect for wellness practices.", user: "Lisa M.", date: "2024-01-13" }
      ],
      description: "Tranquil yoga studio offering various yoga styles, meditation classes, and wellness workshops in a calming, supportive environment.",
      subcategory: "Yoga Studio"
    }
  ],
  automotive: [
    {
      id: "18",
      name: "Quick Fix Auto",
      category: "Auto Repair",
      rating: 4.5,
      reviewCount: 312,
      address: "258 Mechanic Street, Industrial Area",
      phone: "+1 (555) 345-6789",
      website: "www.quickfixauto.com",
      email: "info@quickfixauto.com",
      isOpen: true,
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
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
      ]
    },
    {
      id: "19",
      name: "Elite Auto Service",
      category: "Automotive",
      rating: 4.7,
      reviewCount: 456,
      address: "789 Car Care Boulevard, Auto District, New York 10019",
      phone: "+1 (555) 456-7890",
      website: "www.eliteautoservice.com",
      email: "info@eliteautoservice.com",
      isOpen: true,
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
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
      ]
    }
  ],
  education: [
    {
      id: "20",
      name: "Bright Future Academy",
      category: "Private School",
      rating: 4.8,
      reviewCount: 456,
      address: "147 Learning Lane, Education District",
      phone: "+1 (555) 567-8901",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.3 km",
      tags: ["K-12", "STEM", "Sports"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Excellent education with dedicated teachers and modern facilities. My child loves going to school here!", user: "Sarah M.", date: "2024-01-20" },
        { rating: 5, comment: "Great STEM programs and extracurricular activities. Highly recommend for quality education.", user: "John P.", date: "2024-01-17" },
        { rating: 4, comment: "Safe environment and caring staff. Good balance of academics and sports.", user: "Lisa K.", date: "2024-01-14" }
      ],
      description: "Premier private school offering comprehensive K-12 education with emphasis on STEM, arts, and sports in a nurturing environment.",
      subcategory: "K-12 Education"
    },
    {
      id: "21",
      name: "Tech University",
      category: "University",
      rating: 4.7,
      reviewCount: 892,
      address: "258 Knowledge Boulevard, Campus Area",
      phone: "+1 (555) 678-9012",
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "4.1 km",
      tags: ["Engineering", "Research", "Campus"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Outstanding engineering programs with cutting-edge research facilities. Best decision for my career!", user: "Mike T.", date: "2024-01-19" },
        { rating: 4, comment: "Great campus life and supportive faculty. Excellent research opportunities.", user: "Anna R.", date: "2024-01-16" },
        { rating: 5, comment: "Innovative curriculum and modern labs. Highly recommended for tech enthusiasts.", user: "David L.", date: "2024-01-13" }
      ],
      description: "Leading technology university offering undergraduate and graduate programs in engineering, computer science, and related fields with state-of-the-art facilities.",
      subcategory: "Engineering University"
    },
    {
      id: "22",
      name: "Little Stars Preschool",
      category: "Preschool",
      rating: 4.9,
      reviewCount: 234,
      address: "369 Play Street, Family District",
      phone: "+1 (555) 789-0123",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.8 km",
      tags: ["Early Learning", "Play-based", "Safe"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Wonderful preschool with caring teachers and engaging activities. My child has thrived here!", user: "Emma S.", date: "2024-01-21" },
        { rating: 5, comment: "Safe and nurturing environment with excellent early learning programs.", user: "Robert K.", date: "2024-01-18" },
        { rating: 4, comment: "Play-based learning approach is perfect for young children. Highly recommend!", user: "Maria G.", date: "2024-01-15" }
      ],
      description: "Nurturing preschool offering play-based early childhood education in a safe, stimulating environment designed for children's development.",
      subcategory: "Early Childhood Education"
    }
  ],
  "real estate": [
    {
      id: "23",
      name: "Prime Properties",
      category: "Real Estate Agency",
      rating: 4.6,
      reviewCount: 567,
      address: "147 Property Plaza, Business District",
      phone: "+1 (555) 890-1234",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.7 km",
      tags: ["Sales", "Rentals", "Commercial"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Professional service and excellent knowledge of the market. Helped me find my dream commercial space!", user: "Tom R.", date: "2024-01-18" },
        { rating: 4, comment: "Great rental options and responsive agents. Smooth transaction process.", user: "Lisa M.", date: "2024-01-15" },
        { rating: 5, comment: "Expert advice on commercial properties. Highly recommend for business investments.", user: "David P.", date: "2024-01-12" }
      ],
      description: "Full-service real estate agency specializing in commercial properties, sales, and rentals with experienced agents and market expertise.",
      subcategory: "Commercial Real Estate"
    },
    {
      id: "24",
      name: "Home Sweet Home Realty",
      category: "Real Estate Broker",
      rating: 4.8,
      reviewCount: 345,
      address: "258 Realty Road, Residential Area",
      phone: "+1 (555) 901-2345",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "3.2 km",
      tags: ["Residential", "Family Homes", "Local"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Found our perfect family home through them. Knowledgeable and patient throughout the process.", user: "Sarah L.", date: "2024-01-20" },
        { rating: 5, comment: "Excellent local market knowledge and great communication. Highly satisfied!", user: "Mike K.", date: "2024-01-17" },
        { rating: 4, comment: "Helped us sell our home quickly. Professional and reliable service.", user: "Anna T.", date: "2024-01-14" }
      ],
      description: "Dedicated real estate brokerage specializing in residential properties with a focus on family homes and local community expertise.",
      subcategory: "Residential Real Estate"
    }
  ],
  services: [
    {
      id: "25",
      name: "AllFix Services",
      category: "Home Services",
      rating: 4.5,
      reviewCount: 678,
      address: "369 Service Street, Maintenance District",
      phone: "+1 (555) 012-3456",
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.9 km",
      tags: ["Plumbing", "Electrical", "Repairs"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Reliable and skilled technicians. Fixed our plumbing issue quickly and professionally!", user: "John D.", date: "2024-01-19" },
        { rating: 4, comment: "Good electrical work and fair pricing. Would use again for home repairs.", user: "Maria S.", date: "2024-01-16" },
        { rating: 5, comment: "Comprehensive home services with excellent customer service. Highly recommend!", user: "Robert L.", date: "2024-01-13" }
      ],
      description: "Professional home repair and maintenance services including plumbing, electrical work, and general repairs with licensed technicians.",
      subcategory: "Home Repair"
    },
    {
      id: "26",
      name: "Clean Sweep Cleaning",
      category: "Cleaning Services",
      rating: 4.7,
      reviewCount: 432,
      address: "147 Clean Avenue, Service Center",
      phone: "+1 (555) 123-4567",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.6 km",
      tags: ["House Cleaning", "Office", "Eco-friendly"],
      verified: false,
      photos: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Thorough cleaning and eco-friendly products. My home has never looked better!", user: "Lisa P.", date: "2024-01-21" },
        { rating: 4, comment: "Reliable office cleaning service with professional staff. Great attention to detail.", user: "Tom K.", date: "2024-01-18" },
        { rating: 5, comment: "Excellent value and consistent quality. Eco-friendly approach is a plus!", user: "Anna M.", date: "2024-01-15" }
      ],
      description: "Eco-friendly cleaning services for homes and offices using sustainable products and professional cleaning techniques.",
      subcategory: "House Cleaning"
    }
  ],
  healthcare: [
    {
      id: "27",
      name: "Wellness Medical Center",
      category: "General Practice",
      rating: 4.6,
      reviewCount: 789,
      address: "258 Health Boulevard, Medical District",
      phone: "+1 (555) 234-5678",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.4 km",
      tags: ["Primary Care", "Preventive", "Family"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606811951340-0116b4d29c5c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Caring doctors and comprehensive primary care. Great for family health needs!", user: "Sarah T.", date: "2024-01-20" },
        { rating: 4, comment: "Excellent preventive care services and patient education. Very satisfied.", user: "Mike R.", date: "2024-01-17" },
        { rating: 5, comment: "Professional staff and convenient location. Highly recommend for primary care.", user: "Lisa K.", date: "2024-01-14" }
      ],
      description: "Comprehensive primary care medical center offering preventive services, family medicine, and wellness programs in a patient-centered environment.",
      subcategory: "Family Medicine"
    },
    {
      id: "28",
      name: "Dental Care Plus",
      category: "Dental Clinic",
      rating: 4.8,
      reviewCount: 567,
      address: "369 Smile Street, Dental Plaza",
      phone: "+1 (555) 345-6789",
      image: "https://images.unsplash.com/photo-1606811951340-0116b4d29c5c?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "3.1 km",
      tags: ["Dentistry", "Cosmetic", "Emergency"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1606811951340-0116b4d29c5c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Gentle and skilled dentists. My cosmetic work looks amazing and feels great!", user: "Emma L.", date: "2024-01-19" },
        { rating: 5, comment: "Excellent emergency dental care. Fast response and professional treatment.", user: "David P.", date: "2024-01-16" },
        { rating: 4, comment: "Comprehensive dental services with modern equipment. Very pleased with the results.", user: "Anna S.", date: "2024-01-13" }
      ],
      description: "Full-service dental clinic offering general dentistry, cosmetic procedures, and emergency care with experienced dentists and modern facilities.",
      subcategory: "Dentistry"
    }
  ],
  cafes: [
    {
      id: "29",
      name: "Morning Brew Cafe",
      category: "Coffee Shop",
      rating: 4.7,
      reviewCount: 345,
      address: "147 Coffee Corner, Downtown",
      phone: "+1 (555) 456-7890",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "0.8 km",
      tags: ["Coffee", "Pastries", "WiFi"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Best coffee in town with amazing pastries. Perfect spot for morning meetings!", user: "John M.", date: "2024-01-22" },
        { rating: 4, comment: "Great WiFi and cozy atmosphere. My go-to place for remote work.", user: "Lisa R.", date: "2024-01-19" },
        { rating: 5, comment: "Freshly brewed coffee and delicious baked goods. Highly recommend!", user: "Tom K.", date: "2024-01-16" }
      ],
      description: "Cozy coffee shop serving premium coffee, fresh pastries, and light meals in a comfortable atmosphere with free WiFi.",
      subcategory: "Coffee Shop"
    },
    {
      id: "30",
      name: "Sweet Treats Bakery",
      category: "Bakery Cafe",
      rating: 4.9,
      reviewCount: 234,
      address: "258 Bakery Boulevard, Shopping District",
      phone: "+1 (555) 567-8901",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "1.9 km",
      tags: ["Bakery", "Cakes", "Coffee"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Heavenly cakes and pastries! Every bite is pure delight. Best bakery in the area!", user: "Sarah L.", date: "2024-01-21" },
        { rating: 5, comment: "Fresh baked goods daily with excellent coffee. Perfect for special occasions.", user: "Mike P.", date: "2024-01-18" },
        { rating: 4, comment: "Delicious treats and friendly service. Great place for dessert lovers.", user: "Anna T.", date: "2024-01-15" }
      ],
      description: "Artisan bakery cafe offering freshly baked cakes, pastries, and specialty breads alongside premium coffee and light meals.",
      subcategory: "Bakery"
    }
  ],
  shopping: [
    {
      id: "31",
      name: "Fashion Central Mall",
      category: "Shopping Mall",
      rating: 4.5,
      reviewCount: 1234,
      address: "369 Mall Drive, Shopping Center",
      phone: "+1 (555) 678-9012",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      isOpen: true,
      distance: "2.2 km",
      tags: ["Fashion", "Electronics", "Food Court"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Amazing shopping experience with great variety of stores. Love the food court too!", user: "Emma R.", date: "2024-01-20" },
        { rating: 4, comment: "Convenient location with excellent electronics and fashion stores. Clean and well-maintained.", user: "David L.", date: "2024-01-17" },
        { rating: 5, comment: "Perfect place for shopping sprees. Wide selection and friendly atmosphere.", user: "Lisa M.", date: "2024-01-14" }
      ],
      description: "Modern shopping mall featuring fashion boutiques, electronics stores, and a diverse food court in a convenient downtown location.",
      subcategory: "Department Store"
    },
    {
      id: "32",
      name: "Local Market Square",
      category: "Local Market",
      rating: 4.6,
      reviewCount: 567,
      address: "147 Market Street, Downtown",
      phone: "+1 (555) 789-0123",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop",
      isOpen: false,
      distance: "1.4 km",
      tags: ["Fresh Produce", "Local", "Weekly"],
      verified: true,
      photos: [
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop"
      ],
      reviews: [
        { rating: 5, comment: "Fresh local produce and friendly vendors. Love supporting our community farmers!", user: "Sarah K.", date: "2024-01-19" },
        { rating: 4, comment: "Great weekly market with variety of goods. Always find something interesting.", user: "Tom P.", date: "2024-01-16" },
        { rating: 5, comment: "Authentic local market experience with high-quality products. Highly recommend!", user: "Anna S.", date: "2024-01-13" }
      ],
      description: "Weekly local market featuring fresh produce, artisanal goods, and community vendors in a vibrant downtown square.",
      subcategory: "Farmers Market"
    }
  ]
};
const categoryInfo = {
  hospitals: {
    title: "Hospitals",
    description: "Find the best hospitals and medical centers in your area",
    totalCount: "300+",
    subtitle: "Quality healthcare providers"
  },
  restaurants: {
    title: "Restaurants",
    description: "Discover amazing dining experiences",
    totalCount: "2,500+",
    subtitle: "Best dining experiences"
  },
  hotels: {
    title: "Hotels",
    description: "Comfortable stays and accommodations",
    totalCount: "800+",
    subtitle: "Luxury and budget options"
  },
  beautyspa: {
    title: "Beauty & Spa",
    description: "Beauty treatments and wellness services",
    totalCount: "900+",
    subtitle: "Relaxation and beauty care"
  },
  fitness: {
    title: "Fitness",
    description: "Gyms and fitness centers",
    totalCount: "400+",
    subtitle: "Stay fit and healthy"
  },
  automotive: {
    title: "Automotive",
    description: "Car services and repairs",
    totalCount: "600+",
    subtitle: "Vehicle maintenance and care"
  },
  education: {
    title: "Education",
    description: "Schools and educational institutes",
    totalCount: "750+",
    subtitle: "Quality education for all"
  },
  "real estate": {
    title: "Real Estate",
    description: "Property dealers and services",
    totalCount: "1,100+",
    subtitle: "Find your dream property"
  },
  services: {
    title: "Services",
    description: "Professional services",
    totalCount: "2,000+",
    subtitle: "Expert services for your needs"
  },
  healthcare: {
    title: "Healthcare",
    description: "Medical and health services",
    totalCount: "450+",
    subtitle: "Comprehensive health care"
  },
  cafes: {
    title: "Cafes",
    description: "Coffee shops and cafes",
    totalCount: "350+",
    subtitle: "Great coffee and ambiance"
  },
  shopping: {
    title: "Shopping",
    description: "Retail stores and shopping centers",
    totalCount: "1,200+",
    subtitle: "Shop till you drop"
  }
};

export default function CategoryDetail() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatVendorId, setChatVendorId] = useState<string>("");
  const [chatVendorName, setChatVendorName] = useState<string>("");

  const categoryData = categoryInfo[category as keyof typeof categoryInfo] || {
    title: category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Category",
    description: "Find the best businesses in this category",
    totalCount: "100+",
    subtitle: "Quality service providers"
  };

  const normalizedCategory = useMemo(() => (category || "").replace(/-/g, " "), [category]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    api
      .get(`/api/vendors`, { params: { category: normalizedCategory } })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setVendors(list);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load vendors");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [normalizedCategory]);

  const businesses = useMemo(() => {
    // Check if we have mock data for this category and no real vendors loaded
    const mockData = mockBusinessData[normalizedCategory as keyof typeof mockBusinessData];
    let businessList;
    if (mockData && vendors.length === 0) {
      businessList = mockData;
    } else {
      // Otherwise, use real vendor data
      businessList = vendors.map((v) => ({
        id: v._id,
        name: v.shopName || v.name || "Business",
        category: v.category || normalizedCategory,
        rating: 4.6,
        reviewCount: 0,
        address: v.address || "",
        phone: v.phone || "",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
        isOpen: true,
        distance: "",
        tags: [],
        verified: true,
        images: v.images || [],
        reviews: v.reviews || [],
        description: v.description || "",
        subcategory: v.subcategory || "",
      }));
    }

    // Apply filtering
    let filteredBusinesses = businessList;
    switch (filterBy) {
      case "open":
        filteredBusinesses = businessList.filter(business => business.isOpen);
        break;
      case "verified":
        filteredBusinesses = businessList.filter(business => business.verified);
        break;
      case "emergency":
        filteredBusinesses = businessList.filter(business =>
          business.tags && business.tags.some(tag => tag.toLowerCase().includes("emergency"))
        );
        break;
      case "all":
      default:
        // No filtering
        break;
    }

    // Apply sorting
    const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance": {
          // Parse distance strings like "0.8 km" to numbers
          const aDistance = parseFloat(a.distance.replace(/[^\d.]/g, '')) || 0;
          const bDistance = parseFloat(b.distance.replace(/[^\d.]/g, '')) || 0;
          return aDistance - bDistance;
        }
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sortedBusinesses;
  }, [vendors, normalizedCategory, filterBy, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-card-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              {categoryData.title} <span className="gradient-text">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 animate-fade-in-up stagger-1">
              {categoryData.description}
            </p>
            <div className="flex items-center justify-center space-x-6 animate-fade-in-up stagger-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{categoryData.totalCount}</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="w-px h-12 bg-card-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.6★</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div className="w-px h-12 bg-card-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-card border-b border-card-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open Now</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode and Results Count */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Showing {businesses.length} results
              </span>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Within 5km</span>
            </Badge>
            <Badge variant="secondary">Open Now</Badge>
          </div>
        </div>
      </section>

      {/* Business Listings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className={`grid ${viewMode === "grid"
            ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "grid-cols-1 gap-4"
            }`}>
            {loading && (
              <div className="text-center col-span-full text-muted-foreground">Loading businesses...</div>
            )}
            {error && !loading && (
              <div className="text-center col-span-full text-destructive">{error}</div>
            )}
            {!loading && !error && businesses.map((business, index) => (
              <div
                key={business.id}
                className={`animate-fade-in-up stagger-${Math.min(index % 6 + 1, 6)}`}
              >
                <div className="space-y-2">
                  <BusinessCard business={business} />
                  <Button variant="outline" size="sm" onClick={() => { setChatVendorId(String(business.id)); setChatVendorName(business.name); setChatOpen(true); }}>
                    Chat with Vendor
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button className="btn-hero">
              Load More Results
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ChatModal businessId={chatVendorId} businessName={chatVendorName} open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};