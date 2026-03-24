import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { PackagePlus, Edit2, Trash2, Tag, DollarSign, Activity, Image as ImageIcon, Box } from 'lucide-react';
import Button from '../components/Button';

const AdminInventory = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ _id: null, name: '', price: '', calories: '', stock: '', image: '', protein: '', carbs: '', fats: '', dietTags: '', ingredients: '', oilType: 'Standard', sugarLevel: 'medium' });
  const { user } = useContext(AuthContext);

  const fetchMeals = async () => {
    try {
      const { data } = await axios.get('/api/meals');
      setMeals(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleEdit = (meal) => {
    setFormData(meal);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ _id: null, name: '', price: '', calories: '', stock: '', image: '', protein: '', carbs: '', fats: '', dietTags: '', ingredients: '', oilType: 'Standard', sugarLevel: 'medium' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = {
        ...formData,
        dietTags: typeof formData.dietTags === 'string' ? formData.dietTags.split(',').map(s=>s.trim()) : formData.dietTags,
        ingredients: typeof formData.ingredients === 'string' ? formData.ingredients.split(',').map(s=>s.trim()) : formData.ingredients
      };

      if (formData._id) {
        await axios.put(`/api/meals/${formData._id}`, payload, config);
      } else {
        await axios.post('/api/meals', payload, config);
      }
      fetchMeals();
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error saving meal');
    }
  };

  const deleteMeal = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this inventory item?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/meals/${id}`, config);
      fetchMeals();
    } catch (error) {
      console.error(error);
      alert('Error deleting meal');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Master Inventory</h1>
          <p className="text-gray-500 text-lg">Add, edit, and monitor your entire nutrition catalog.</p>
        </div>
        <Button 
          variant={showForm ? "outline" : "primary"} 
          onClick={() => { showForm ? resetForm() : setShowForm(true) }}
          className="flex items-center gap-2"
        >
          {showForm ? 'Cancel Creation' : <><PackagePlus size={20} /> New Product</>}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100 mb-12 relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-50 rounded-bl-full opacity-60 z-0"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
               <PackagePlus className="text-primary" size={28} />
               {formData._id ? 'Edit Existing Product' : 'Configure New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Product Name</label>
                  <div className="relative flex items-center group">
                    <Tag size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="text" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Spicy Quinoa Bowl" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Price (₹)</label>
                  <div className="relative flex items-center group">
                    <DollarSign size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="number" step="0.01" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="450.00" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Stock Units</label>
                  <div className="relative flex items-center group">
                    <Box size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="number" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="50" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Image Asset (URL)</label>
                  <div className="relative flex items-center group">
                    <ImageIcon size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="url" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://unsplash.com/..." required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Total Calories</label>
                  <div className="relative flex items-center group">
                    <Activity size={18} className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input type="number" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} placeholder="450" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Protein (g)</label>
                  <input type="number" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Carbs (g)</label>
                  <input type="number" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value})} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Fats (g)</label>
                  <input type="number" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.fats} onChange={e => setFormData({...formData, fats: e.target.value})} placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Diet Tags (CSV)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.dietTags} onChange={e => setFormData({...formData, dietTags: e.target.value})} placeholder="Vegan, Gluten-Free" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Ingredients (CSV)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} placeholder="Kale, Quinoa, Tofu" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Cooking Oil</label>
                  <select className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.oilType} onChange={e => setFormData({...formData, oilType: e.target.value})}>
                    <option value="None">None</option><option value="Standard">Standard</option><option value="Olive Oil">Olive Oil</option><option value="Coconut Oil">Coconut Oil</option><option value="Butter">Butter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Sugar Level</label>
                  <select className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium" value={formData.sugarLevel} onChange={e => setFormData({...formData, sugarLevel: e.target.value})}>
                    <option value="zero">Zero Sugar</option><option value="low">Low Sugar</option><option value="medium">Medium Sugar</option><option value="high">High Sugar</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-2">
                <Button type="button" variant="outline" onClick={resetForm}>Discard Changes</Button>
                <Button type="submit" variant="primary">Commit to Atlas DB</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Item Asset</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Product ID & Name</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Retail Price</th>
                <th className="px-8 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Live Stock</th>
                <th className="px-8 py-5 text-right text-xs font-extrabold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {meals.map(meal => (
                <tr key={meal._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <img src={meal.image} alt={meal.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-100" />
                  </td>
                  <td className="px-8 py-4">
                    <div className="font-bold text-gray-900 text-lg mb-0.5">{meal.name}</div>
                    <div className="text-xs text-gray-400 font-mono">#{meal._id.substring(meal._id.length - 6).toUpperCase()}</div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-primary font-extrabold text-lg">₹{meal.price.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${meal.stock > 10 ? 'bg-green-100 text-green-700' : meal.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {meal.stock} Units
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(meal)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deleteMeal(meal._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {meals.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-medium">
                    No culinary assets found in the inventory registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
