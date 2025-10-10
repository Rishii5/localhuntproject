import { 
  Utensils, 
  Hotel, 
  Hospital, 
  ShoppingBag, 
  Scissors, 
  Dumbbell,
  Car,
  GraduationCap,
  Home,
  Wrench,
  Heart,
  Coffee
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Restaurants", icon: Utensils, count: "2,500+", color: "from-orange-400 to-red-500" },
  { name: "Hotels", icon: Hotel, count: "800+", color: "from-blue-400 to-purple-500" },
  { name: "Hospitals", icon: Hospital, count: "300+", color: "from-green-400 to-teal-500" },
  { name: "Shopping", icon: ShoppingBag, count: "1,200+", color: "from-pink-400 to-purple-500" },
  { name: "Beauty & Spa", icon: Scissors, count: "900+", color: "from-purple-400 to-pink-500" },
  { name: "Fitness", icon: Dumbbell, count: "400+", color: "from-green-400 to-blue-500" },
  { name: "Automotive", icon: Car, count: "600+", color: "from-gray-400 to-gray-600" },
  { name: "Education", icon: GraduationCap, count: "750+", color: "from-indigo-400 to-blue-500" },
  { name: "Real Estate", icon: Home, count: "1,100+", color: "from-yellow-400 to-orange-500" },
  { name: "Services", icon: Wrench, count: "2,000+", color: "from-teal-400 to-green-500" },
  { name: "Healthcare", icon: Heart, count: "450+", color: "from-red-400 to-pink-500" },
  { name: "Cafes", icon: Coffee, count: "350+", color: "from-amber-400 to-orange-500" }
];

export const CategoryGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Find exactly what you're looking for with our comprehensive business categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`category-card animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/categories"
            className="inline-flex items-center px-8 py-3 bg-background-alt border border-card-border rounded-xl font-medium text-foreground hover:bg-card-hover transition-all duration-200 hover:shadow-card"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};