import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, UtensilsCrossed, Leaf } from 'lucide-react';
import Button from '../components/Button';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const INGREDIENT_DATA = {
  bases: [
    { id: 'b1', name: 'Brown Rice', price: 2.0, cal: 150, prot: 3 },
    { id: 'b2', name: 'Quinoa', price: 2.5, cal: 120, prot: 4 },
    { id: 'b3', name: 'Mixed Greens', price: 1.5, cal: 20, prot: 1 }
  ],
  proteins: [
    { id: 'p1', name: 'Grilled Chicken', price: 4.0, cal: 160, prot: 25 },
    { id: 'p2', name: 'Tofu', price: 3.0, cal: 100, prot: 10 },
    { id: 'p3', name: 'Baked Salmon', price: 6.0, cal: 200, prot: 22 }
  ],
  toppings: [
    { id: 't1', name: 'Avocado', price: 1.5, cal: 120, prot: 2 },
    { id: 't2', name: 'Edamame', price: 1.0, cal: 60, prot: 5 },
    { id: 't3', name: 'Cherry Tomatoes', price: 0.5, cal: 15, prot: 0.5 },
    { id: 't4', name: 'Roasted Almonds', price: 1.0, cal: 80, prot: 3 }
  ],
  dressings: [
    { id: 'd1', name: 'Olive Oil & Lemon', price: 0.0, cal: 100, prot: 0 },
    { id: 'd2', name: 'Tahini', price: 0.5, cal: 90, prot: 2 },
    { id: 'd3', name: 'Spicy Mayo', price: 0.5, cal: 120, prot: 0 }
  ]
};

export default function BuildBowl() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [selections, setSelections] = useState({
    base: null,
    protein: null,
    toppings: [],
    dressing: null
  });

  const handleSelect = (category, item) => {
    if (category === 'toppings') {
      const exists = selections.toppings.find(t => t.id === item.id);
      if (exists) {
        setSelections({ ...selections, toppings: selections.toppings.filter(t => t.id !== item.id) });
      } else {
        if (selections.toppings.length >= 4) return alert("Maximum 4 toppings allowed");
        setSelections({ ...selections, toppings: [...selections.toppings, item] });
      }
    } else {
      setSelections({ ...selections, [category]: item });
    }
  };

  const calculateNutrition = () => {
    let price = 0, cal = 0, prot = 0;
    const items = [selections.base, selections.protein, selections.dressing, ...selections.toppings].filter(Boolean);
    
    items.forEach(item => {
      price += item.price;
      cal += item.cal;
      prot += item.prot;
    });
    return { price, cal, prot };
  };

  const macros = calculateNutrition();

  const handleAddToCart = async () => {
    if (!selections.base || !selections.protein) {
      return alert("Please select at least a Base and a Protein.");
    }
    if (!user) return alert('Please login first to add custom bowls to cart');

    const ingredientsList = [selections.base, selections.protein, selections.dressing, ...selections.toppings]
      .filter(Boolean)
      .map(i => i.name);
      
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const { data: newMeal } = await axios.post('/api/meals/custom', {
        price: macros.price,
        calories: macros.cal,
        protein: macros.prot,
        ingredients: ingredientsList
      }, config);
      
      await addToCart(newMeal._id, 1);
      alert("Custom Bowl successfully added to your Cart! 🥗");
      navigate('/cart');
    } catch (error) {
      console.error(error);
      alert("Failed to build custom bowl. Please try again.");
    }
  };

  const OptionCard = ({ item, isSelected, onClick, isMultiple }) => (
    <div 
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ${isSelected ? 'border-primary bg-green-50' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
    >
      <div>
        <h4 className="font-bold text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-500">+${item.price.toFixed(2)} | {item.cal} cal</p>
      </div>
      {isSelected && <CheckCircle2 className="text-primary w-6 h-6" />}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 w-full">
      
      {/* Selection Area */}
      <div className="flex-grow w-full lg:w-2/3">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
          <UtensilsCrossed className="text-accent w-10 h-10" /> Build Your Bowl
        </h1>
        <p className="text-gray-500 mb-10 text-lg">Customize every ingredient to fit your exact diet.</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">1. Choose a Base <span className="text-sm text-red-500 font-normal">*Required</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INGREDIENT_DATA.bases.map(item => (
              <OptionCard key={item.id} item={item} isSelected={selections.base?.id === item.id} onClick={() => handleSelect('base', item)} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">2. Choose a Protein <span className="text-sm text-red-500 font-normal">*Required</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INGREDIENT_DATA.proteins.map(item => (
              <OptionCard key={item.id} item={item} isSelected={selections.protein?.id === item.id} onClick={() => handleSelect('protein', item)} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Select Toppings <span className="text-sm text-gray-400 font-normal">(Up to 4)</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INGREDIENT_DATA.toppings.map(item => (
              <OptionCard key={item.id} item={item} isSelected={selections.toppings.some(t => t.id === item.id)} onClick={() => handleSelect('toppings', item)} isMultiple />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Add Dressing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INGREDIENT_DATA.dressings.map(item => (
              <OptionCard key={item.id} item={item} isSelected={selections.dressing?.id === item.id} onClick={() => handleSelect('dressing', item)} />
            ))}
          </div>
        </section>
      </div>

      {/* Live Preview / Macros Sticky Box */}
      <div className="w-full lg:w-1/3">
        <div className="sticky top-28 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Your Creation</h3>
          
          <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-6">
            <div className="absolute inset-0 bg-green-50 rounded-full blur-xl scale-90"></div>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400" 
              alt="Bowl Preview" 
              className="relative rounded-full border-4 border-white shadow-lg w-full h-full object-cover transition-transform hover:rotate-6 duration-500"
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center bg-gray-50 py-2 px-3 rounded-lg text-sm">
              <span className="text-gray-500">Base</span>
              <span className="font-semibold">{selections.base?.name || '--'}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 py-2 px-3 rounded-lg text-sm">
              <span className="text-gray-500">Protein</span>
              <span className="font-semibold">{selections.protein?.name || '--'}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 py-2 px-3 rounded-lg text-sm">
              <span className="text-gray-500">Toppings</span>
              <span className="font-semibold">{selections.toppings.length} selected</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 py-2 px-3 rounded-lg text-sm">
              <span className="text-gray-500">Dressing</span>
              <span className="font-semibold">{selections.dressing?.name || '--'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-primary/5 rounded-xl p-3 text-center border border-primary/10">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1"><Leaf size={14}/> Calories</p>
              <p className="text-xl font-bold text-gray-900">{macros.cal} kcal</p>
            </div>
            <div className="bg-accent/5 rounded-xl p-3 text-center border border-accent/10">
              <p className="text-sm text-gray-500">Protein</p>
              <p className="text-xl font-bold text-gray-900">{macros.prot}g</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total</span>
            <span className="text-3xl font-extrabold text-primary">${macros.price.toFixed(2)}</span>
          </div>

          <Button variant="primary" size="lg" className="w-full flex justify-center gap-2" onClick={handleAddToCart}>
            Add Custom Bowl <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
