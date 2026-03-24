import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import MealCard from '../components/MealCard';
import CartContext from '../context/CartContext';

export default function Menu() {
  const [filter, setFilter] = useState('All');
  const [allMeals, setAllMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data } = await axios.get('/api/meals');
        if (data && data.length > 0) {
          setAllMeals(data);
        } else {
          throw new Error("Empty DB");
        }
      } catch (error) {
        console.warn('Backend unavailable or empty. Loading premium fallback data...');
        const fallbackMeals = [
          { _id: '64a2f8b5f3d4b6c8a291f0c1', name: 'Grilled Salmon Bowl', calories: 420, price: 14.99, protein: 35, category: 'High Protein', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c2', name: 'High-Protein Quinoa Salad', calories: 380, price: 11.50, protein: 22, category: 'Weight Loss', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c3', name: 'Teriyaki Chicken & Broccoli', calories: 510, price: 13.00, protein: 40, category: 'High Protein', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c4', name: 'Zucchini Noodles with Pesto', calories: 290, price: 10.99, protein: 12, category: 'Weight Loss', image: 'https://images.unsplash.com/photo-1621226068285-05d15eb5b057?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c5', name: 'Keto Power Bowl', calories: 550, price: 15.50, protein: 45, category: 'High Protein', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c6', name: 'Matcha Energy Bites', calories: 210, price: 6.50, protein: 8, category: 'Snacks', image: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c7', name: 'Spicy Mango Tofu Wraps', calories: 340, price: 12.00, protein: 18, category: 'Weight Loss', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c8', name: 'Greek Yogurt Peanut Butter Parfait', calories: 280, price: 7.50, protein: 16, category: 'Snacks', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f0c9', name: 'Avocado Toast with Poached Egg', calories: 350, price: 9.99, protein: 14, category: 'Weight Loss', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800' },
          { _id: '64a2f8b5f3d4b6c8a291f010', name: 'Turkey Meatballs with Sweet Potato', calories: 460, price: 13.50, protein: 38, category: 'High Protein', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=800' }
        ];
        setAllMeals(fallbackMeals);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const categories = ['All', 'High Protein', 'Weight Loss', 'Snacks'];

  const filteredMeals = filter === 'All' 
    ? allMeals 
    : allMeals.filter(m => m.category === filter);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Our Premium Menu</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Explore our chef-crafted meals, designed to hit your macros without sacrificing taste.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-20 text-xl font-bold text-gray-300 animate-pulse">
            Loading our delicious menu...
          </div>
        )}

        {/* Meals Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMeals.map((meal) => (
              <MealCard 
                key={meal._id} 
                meal={meal} 
                onAddToCart={(m, quantity) => addToCart(m._id, quantity)} 
              />
            ))}
          </div>
        )}

        {!loading && filteredMeals.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-lg">
            No meals found in this category.
          </div>
        )}

      </div>
    </div>
  );
}
