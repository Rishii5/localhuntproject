// import { 
//   Utensils, 
//   Hotel, 
//   Hospital, 
//   ShoppingBag, 
//   Scissors, 
//   Dumbbell,
//   Car,
//   GraduationCap,
//   Home,
//   Wrench,
//   Heart,
//   Coffee,
//   Briefcase,
//   Music,
//   Camera,
//   PaintBucket
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";

// const allCategories = [
//   { name: "Restaurants", icon: Utensils, count: "2,500+", color: "from-orange-400 to-red-500", description: "Best dining experiences in your area" },
//   { name: "Hotels", icon: Hotel, count: "800+", color: "from-blue-400 to-purple-500", description: "Comfortable stays and accommodations" },
//   { name: "Hospitals", icon: Hospital, count: "300+", color: "from-green-400 to-teal-500", description: "Quality healthcare providers" },
//   { name: "Shopping", icon: ShoppingBag, count: "1,200+", color: "from-pink-400 to-purple-500", description: "Retail stores and shopping centers" },
//   { name: "Beauty & Spa", icon: Scissors, count: "900+", color: "from-purple-400 to-pink-500", description: "Beauty treatments and wellness" },
//   { name: "Fitness", icon: Dumbbell, count: "400+", color: "from-green-400 to-blue-500", description: "Gyms and fitness centers" },
//   { name: "Automotive", icon: Car, count: "600+", color: "from-gray-400 to-gray-600", description: "Car services and repairs" },
//   { name: "Education", icon: GraduationCap, count: "750+", color: "from-indigo-400 to-blue-500", description: "Schools and educational institutes" },
//   { name: "Real Estate", icon: Home, count: "1,100+", color: "from-yellow-400 to-orange-500", description: "Property dealers and services" },
//   { name: "Services", icon: Wrench, count: "2,000+", color: "from-teal-400 to-green-500", description: "Professional services" },
//   { name: "Healthcare", icon: Heart, count: "450+", color: "from-red-400 to-pink-500", description: "Medical and health services" },
//   { name: "Cafes", icon: Coffee, count: "350+", color: "from-amber-400 to-orange-500", description: "Coffee shops and cafes" },
//   { name: "Business Services", icon: Briefcase, count: "850+", color: "from-slate-400 to-slate-600", description: "B2B and professional services" },
//   { name: "Entertainment", icon: Music, count: "220+", color: "from-purple-400 to-indigo-500", description: "Entertainment and recreation" },
//   { name: "Photography", icon: Camera, count: "180+", color: "from-blue-400 to-cyan-500", description: "Photography and videography" },
//   { name: "Home Services", icon: PaintBucket, count: "650+", color: "from-green-400 to-emerald-500", description: "Home improvement and maintenance" }
// ];

// export default function Categories() {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Header */}
//       <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
//             Explore All <span className="gradient-text">Categories</span>
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-1">
//             Browse through our comprehensive directory of local businesses organized by category. 
//             Find exactly what you're looking for with ease.
//           </p>
//         </div>
//       </section>

//       {/* Categories Grid */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {allCategories.map((category, index) => (
//               <Link
//                 key={category.name}
//                 to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
//                 className={`group bg-card border border-card-border rounded-2xl p-6 hover:shadow-elegant transition-all duration-300 animate-fade-in-up stagger-${Math.min(index % 6 + 1, 6)}`}
//               >
//                 <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
//                   <category.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
//                   {category.name}
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-primary">{category.count}</span>
//                   <span className="text-xs text-muted-foreground">businesses</span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };
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
  Coffee,
  Briefcase,
  Music,
  Camera,
  PaintBucket
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import api from "@/lib/api";

// 🔹 Category Type
interface Category {
  name: string;
  icon: React.ElementType;
  count: string;
  color: string;
  description: string;
}

// 🔹 Fallback static categories (used if API not ready)
const defaultCategories: Category[] = [
  { name: "Restaurants", icon: Utensils, count: "2,500+", color: "from-orange-400 to-red-500", description: "Best dining experiences in your area" },
  { name: "Hotels", icon: Hotel, count: "800+", color: "from-blue-400 to-purple-500", description: "Comfortable stays and accommodations" },
  { name: "Hospitals", icon: Hospital, count: "300+", color: "from-green-400 to-teal-500", description: "Quality healthcare providers" },
  { name: "Shopping", icon: ShoppingBag, count: "1,200+", color: "from-pink-400 to-purple-500", description: "Retail stores and shopping centers" },
  { name: "Beauty & Spa", icon: Scissors, count: "900+", color: "from-purple-400 to-pink-500", description: "Beauty treatments and wellness" },
  { name: "Fitness", icon: Dumbbell, count: "400+", color: "from-green-400 to-blue-500", description: "Gyms and fitness centers" },
  { name: "Automotive", icon: Car, count: "600+", color: "from-gray-400 to-gray-600", description: "Car services and repairs" },
  { name: "Education", icon: GraduationCap, count: "750+", color: "from-indigo-400 to-blue-500", description: "Schools and educational institutes" },
  { name: "Real Estate", icon: Home, count: "1,100+", color: "from-yellow-400 to-orange-500", description: "Property dealers and services" },
  { name: "Services", icon: Wrench, count: "2,000+", color: "from-teal-400 to-green-500", description: "Professional services" },
  { name: "Healthcare", icon: Heart, count: "450+", color: "from-red-400 to-pink-500", description: "Medical and health services" },
  { name: "Cafes", icon: Coffee, count: "350+", color: "from-amber-400 to-orange-500", description: "Coffee shops and cafes" },
  { name: "Business Services", icon: Briefcase, count: "850+", color: "from-slate-400 to-slate-600", description: "B2B and professional services" },
  { name: "Entertainment", icon: Music, count: "220+", color: "from-purple-400 to-indigo-500", description: "Entertainment and recreation" },
  { name: "Photography", icon: Camera, count: "180+", color: "from-blue-400 to-cyan-500", description: "Photography and videography" },
  { name: "Home Services", icon: PaintBucket, count: "650+", color: "from-green-400 to-emerald-500", description: "Home improvement and maintenance" }
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // 🔹 Example: Fetch categories from backend (if available)
  useEffect(() => {
    api.get<Category[]>("/api/categories")
      .then(res => setCategories(res.data))
      .catch(() => setCategories(defaultCategories)); // fallback if backend not ready
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Explore All <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
            Browse through our comprehensive directory of local businesses organized by category.
            Find exactly what you're looking for with ease.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-card border border-card-border rounded-2xl p-6 hover:shadow-elegant transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }} // ✅ stagger effect
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{category.count}</span>
                  <span className="text-xs text-muted-foreground">businesses</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
