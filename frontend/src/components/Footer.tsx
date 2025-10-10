import { Link } from "react-router-dom";
import { Search, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  const footerLinks = {
    "For Business Owners": [
      "List Your Business",
      "Business Dashboard",
      "Advertising Solutions",
      "Success Stories",
      "Support Center"
    ],
    "For Customers": [
      "How It Works",
      "Mobile App",
      "Customer Support",
      "Write a Review",
      "Report an Issue"
    ],
    "About LocalFind": [
      "About Us",
      "Careers",
      "Press",
      "Investor Relations",
      "Our Team"
    ],
    "Legal": [
      "Terms of Service",
      "Privacy Policy",
      "Cookie Policy",
      "GDPR Compliance",
      "Accessibility"
    ]
  };

  const cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville"
  ];

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">LocalFind</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your trusted local business directory. Connecting communities with verified 
              local businesses across the country.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-FIND</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">hello@localfind.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">123 Business Ave, Suite 100</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-background-alt rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Cities */}
        <div className="border-t border-card-border pt-8 mb-8">
          <h3 className="font-semibold text-foreground mb-4">Popular Cities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/city/${city.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 LocalFind. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Sitemap
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              API
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Made with</span>
              <span className="text-red-500">♥</span>
              <span className="text-sm text-muted-foreground">for local businesses</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};