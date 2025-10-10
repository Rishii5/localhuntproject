import { useState, useEffect } from "react";
import { BusinessCard } from "./BusinessCard";
import { getBusinesses, Business } from "../lib/business";

export const FeaturedBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (err) {
        setError("Failed to load businesses");
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
              <span className="gradient-text">Featured</span> Businesses
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Loading businesses...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
              <span className="gradient-text">Featured</span> Businesses
            </h2>
            <p className="text-red-500 text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            <span className="gradient-text">Featured</span> Businesses
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Top-rated businesses recommended by our community
          </p>
        </div>

        {businesses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.slice(0, 4).map((business, index) => (
              <div
                key={business._id}
                className={`animate-fade-in-up stagger-${index + 2}`}
              >
                <BusinessCard business={{
                  id: business._id,
                  name: business.shopName,
                  category: business.category,
                  rating: 4.5, // Default rating since not in backend yet
                  reviewCount: 0, // Default review count
                  address: business.location,
                  phone: "+1 (555) 000-0000", // Default phone
                  image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop", // Default image
                  isOpen: true, // Default open status
                  distance: "1.0 km", // Default distance
                  tags: [business.category], // Use category as tag
                  verified: true // Default verified status
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              No businesses found. Be the first to add a business!
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <button className="btn-hero">
            View All Featured Businesses
          </button>
        </div>
      </div>
    </section>
  );
};