import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import MealCard from '../components/MealCard';
import { ArrowRight, Leaf, TrendingDown, Target, Check } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [featuredMeals, setFeaturedMeals] = React.useState([]);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/meals');
        if (data && data.length > 0) {
          setFeaturedMeals(data.slice(0, 3));
        } else {
          throw new Error("Empty DB");
        }
      } catch (err) {
        console.warn('Backend unavailable, loading local featured meals.');
        const fallbackMeals = [
          { _id: '64a2f8b5f3d4b6c8a291f0c1', name: 'Grilled Salmon Bowl', calories: 420, price: 14.99, protein: 35, category: 'High Protein', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c2', name: 'High-Protein Quinoa Salad', calories: 380, price: 11.50, protein: 22, category: 'Weight Loss', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c3', name: 'Teriyaki Chicken & Broccoli', calories: 510, price: 13.00, protein: 40, category: 'High Protein', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800' },
        ];
        setFeaturedMeals(fallbackMeals);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'High Protein', icon: <Target className="text-primary w-8 h-8" />, desc: 'Build muscle with 30g+ protein meals' },
    { name: 'Weight Loss', icon: <TrendingDown className="text-accent w-8 h-8" />, desc: 'Low calorie, high volume portions' },
    { name: 'Healthy Snacks', icon: <Leaf className="text-green-500 w-8 h-8" />, desc: 'Guilt-free treats for your cravings' }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] sm:h-[700px] flex items-center bg-gradient-to-br from-green-50 to-white overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem] shadow-sm mb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-100 text-primary text-sm font-bold tracking-wide mb-6">
              <Check size={16} /> 100% Organic Ingredients
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Healthy Food That <br/><span className="text-primary">Actually Tastes Good.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Chef-crafted, nutritionist-approved meals delivered right to your door. Fuel your life with premium ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/menu">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-green-900/20 group">
                  Order Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link to="/subscription">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto bg-white border border-gray-200">
                  Meal Plans
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            {/* Hero Image / Plate */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-75 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" 
              alt="Fresh salad bowl" 
              className="relative z-10 w-full max-w-lg mx-auto rounded-full shadow-2xl border-white border-8 hover:rotate-3 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Focus On Your Goals</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">We've categorized our menu to help you hit your macros easily.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{cat.name}</h3>
              <p className="text-gray-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Meals Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-gray-50/50 rounded-3xl mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Popular Dishes</h2>
            <p className="text-gray-500 text-lg">Our community's favorite healthy meals.</p>
          </div>
          <Link to="/menu">
            <Button variant="outline" className="rounded-full">View Full Menu</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMeals.length > 0 ? (
            featuredMeals.map(meal => (
              <MealCard key={meal._id} meal={meal} onAddToCart={() => window.location.href = '/menu'} />
            ))
          ) : (
            <div className="text-center col-span-3 py-10 text-gray-400">Loading popular dishes...</div>
          )}
        </div>
      </section>

    </div>
  );
}
