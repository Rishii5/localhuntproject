// 
import { Star, MapPin, Phone, Clock, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface BusinessCardProps {
  business: {
    id: string;
    name?: string;
    category?: string;
    rating?: number;
    reviewCount?: number;
    address?: any;   // backend may return object, not string
    phone?: string;
    image?: string;
    isOpen?: boolean;
    distance?: any;  // backend may return object, not string
    tags?: string[];
    verified?: boolean;
  };
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  // ✅ Make sure values are strings before rendering
  const displayAddress =
    typeof business.address === "string"
      ? business.address
      : business.address
        ? JSON.stringify(business.address)
        : "";

  const displayDistance =
    typeof business.distance === "string"
      ? business.distance
      : business.distance?.value
        ? `${business.distance.value} ${business.distance.unit || "m"}`
        : business.distance
          ? JSON.stringify(business.distance)
          : "";

  return (
    <Link to={`/business/${business.id}`} className="business-card group block">
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img
          src={business.image || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800"}
          alt={business.name || "Business"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Heart className="w-6 h-6 text-white/80 hover:text-red-500 cursor-pointer transition-colors duration-200" />
        </div>
        {business.verified && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-success text-success-foreground">Verified</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-1">
            {business.name || "Business"}
          </h3>
          <p className="text-sm text-muted-foreground">{business.category || ""}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(business.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            {business.rating ?? "-"}
          </span>
          <span className="text-sm text-muted-foreground">
            ({business.reviewCount ?? 0} reviews)
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">{displayAddress}</p>
            <p className="text-xs text-muted-foreground">{displayDistance} away</p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{business.phone || ""}</span>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span
            className={`text-sm font-medium ${business.isOpen ? "text-success" : "text-destructive"
              }`}
          >
            {business.isOpen ? "Open now" : "Closed"}
          </span>
        </div>

        {/* Tags */}
        {business.tags && business.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {business.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
