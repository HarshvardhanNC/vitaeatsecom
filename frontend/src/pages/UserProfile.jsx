import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, RotateCcw, Activity, Target, Shield, Settings, AlertCircle, Users, Database, Gift, CalendarDays } from 'lucide-react';

const UserProfile = () => {
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  
  // Health Dashboard States
  const [nutritionData, setNutritionData] = useState({ totalCalories: 0, totalProtein: 0, targetCalories: 2000 });
  const [healthProfile, setHealthProfile] = useState({ age: '', weight: '', height: '', activityLevel: 'low', goal: 'maintenance' });
  const [isUpdatingHealth, setIsUpdatingHealth] = useState(false);
  const [healthMessage, setHealthMessage] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  const { user } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: ordersData } = await axios.get('/api/orders/myorders', config);
        setOrders(ordersData);
        
        try {
          const { data: subsData } = await axios.get('/api/subscriptions/mine', config);
          setSubscriptions(subsData);
        } catch (subErr) {
          console.error("No subscriptions found", subErr);
        }
        
        const { data: dashData } = await axios.get('/api/users/dashboard/nutrition', config);
        setNutritionData(dashData);
        
        const { data: profileData } = await axios.get('/api/users/profile', config);
        setWalletBalance(profileData.walletBalance || 0);
        if (profileData.healthProfile) {
          setHealthProfile({
            age: profileData.healthProfile.age || '',
            weight: profileData.healthProfile.weight || '',
            height: profileData.healthProfile.height || '',
            activityLevel: profileData.healthProfile.activityLevel || 'low',
            goal: profileData.healthProfile.goal || 'maintenance'
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'user') fetchUserData();
  }, [user]);

  const handleHealthUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingHealth(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/users/profile/health', healthProfile, config);
      setHealthMessage(data.message);
      
      const { data: dashData } = await axios.get('/api/users/dashboard/nutrition', config);
      setNutritionData(dashData);
      setTimeout(() => setHealthMessage(''), 3000);
    } catch (error) {
       setHealthMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsUpdatingHealth(false);
    }
  };

  const activeOrders = orders.filter(o => o.status !== 'Delivered');
  const pastOrders = orders.filter(o => o.status === 'Delivered');

  const getStepProgress = (status) => {
    switch(status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const toggleExpand = (id) => {
    if (expandedOrderId === id) setExpandedOrderId(null);
    else setExpandedOrderId(id);
  };

  const handleReorder = async (order) => {
    setIsReordering(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      for (const item of order.orderItems) {
        await axios.post('/api/cart', { mealId: item.meal, quantity: item.quantity }, config);
      }
      await fetchCart();
      navigate('/cart');
    } catch (error) {
      console.error('Error reordering', error);
      alert(error.response?.data?.message || 'Failed to reorder. Items may be out of stock.');
    } finally {
      setIsReordering(false);
    }
  };

  const handleSubscriptionStatus = async (subId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/subscriptions/${subId}/status`, { status: newStatus }, config);
      
      // Instantly refresh the local subscription state from DB
      const { data: subsData } = await axios.get('/api/subscriptions/mine', config);
      setSubscriptions(subsData);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update subscription status');
    }
  };

  const caloriePercentage = Math.min((nutritionData.totalCalories / nutritionData.targetCalories) * 100, 100);
  const isOverLimit = caloriePercentage >= 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 p-8 rounded-3xl shadow-sm flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
          <p className="text-gray-500 text-lg">{user.email}</p>
        </div>
      </div>

      {user && user.role === 'user' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Daily Nutrition Tracker */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="text-primary" /> Today's Nutrition Dashboard
           </h2>
           
           <div className="mb-8">
             <div className="flex justify-between items-end mb-2">
               <span className="font-semibold text-gray-500">Calories Consumed</span>
               <span className={`text-2xl font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-900'}`}>
                 {Math.round(nutritionData.totalCalories)} <span className="text-sm text-gray-400">/ {nutritionData.targetCalories} kcal</span>
               </span>
             </div>
             <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-500 ${isOverLimit ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${caloriePercentage}%` }}></div>
             </div>
             <p className="text-sm text-gray-400 mt-2 text-right font-medium">
               {isOverLimit ? "Daily Limit Reached" : `${Math.round(nutritionData.targetCalories - nutritionData.totalCalories)} kcal remaining`}
             </p>
           </div>

           <div>
             <div className="flex justify-between items-end mb-2">
               <span className="font-semibold text-gray-500">Protein Consumed</span>
               <span className="text-xl font-bold text-gray-900">
                 {Math.round(nutritionData.totalProtein)}g
               </span>
             </div>
             <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((nutritionData.totalProtein / 150) * 100, 100)}%` }}></div>
             </div>
             <p className="text-xs text-gray-400 mt-2">*Accumulated from active deliveries natively</p>
           </div>
        </div>

        {/* Biometric Health Form */}
        <div className="bg-white p-8 rounded-3xl border-t-4 border-t-primary shadow-sm">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="text-primary" /> Target Biometrics
           </h2>
           <form onSubmit={handleHealthUpdate} className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</label>
                    <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all" value={healthProfile.age} onChange={e => setHealthProfile({...healthProfile, age: e.target.value})} placeholder="yrs" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Weight</label>
                    <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all" value={healthProfile.weight} onChange={e => setHealthProfile({...healthProfile, weight: e.target.value})} placeholder="kg" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Height</label>
                    <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all" value={healthProfile.height} onChange={e => setHealthProfile({...healthProfile, height: e.target.value})} placeholder="cm" required />
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Activity</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-gray-700" value={healthProfile.activityLevel} onChange={e => setHealthProfile({...healthProfile, activityLevel: e.target.value})}>
                      <option value="low">Low (Sedentary)</option>
                      <option value="moderate">Moderate (Active)</option>
                      <option value="high">High (Athlete)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Goal</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all font-medium text-gray-700" value={healthProfile.goal} onChange={e => setHealthProfile({...healthProfile, goal: e.target.value})}>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="muscle-gain">Muscle Gain</option>
                    </select>
                  </div>
              </div>

              <button type="submit" className="w-full py-3 mt-2 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors" disabled={isUpdatingHealth}>
                {isUpdatingHealth ? 'Calculating BMR...' : 'Calibrate Mathematics'}
              </button>
              {healthMessage && <p className="text-center text-sm text-primary font-bold mt-2">{healthMessage}</p>}
           </form>
        </div>
      </div>
      )}

      {/* Subscription Block */}
      {user && user.role === 'user' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CalendarDays className="text-primary" /> Manage Subscriptions
          </h2>
          {subscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <div key={sub._id} className="bg-white border-2 border-primary rounded-3xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full opacity-50"></div>
                  <div className="mb-6 relative z-10">
                    <span className="inline-block px-3 py-1 bg-green-100 text-primary uppercase tracking-wider font-extrabold text-xs rounded-lg mb-3">
                      {sub.status}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900">{sub.planType} Plan</h3>
                    <p className="text-gray-500 mt-1 font-medium">{sub.mealsPerWeek} Signature Meals / Week</p>
                    <p className="text-sm font-semibold text-gray-400 mt-2">Arrives: {new Date(sub.nextDelivery).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3 relative z-10">
                    {sub.status === 'Active' && (
                      <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors text-sm" onClick={() => handleSubscriptionStatus(sub._id, 'Paused')}>Pause Plan</button>
                    )}
                    {sub.status === 'Paused' && (
                      <button className="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-800 font-bold rounded-xl transition-colors text-sm shadow-sm" onClick={() => handleSubscriptionStatus(sub._id, 'Active')}>Resume Deliveries</button>
                    )}
                    {sub.status !== 'Cancelled' && (
                      <button className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-100 transition-colors text-sm" onClick={() => { if(window.confirm('Terminate this subscription permanently?')) handleSubscriptionStatus(sub._id, 'Cancelled') }}>Cancel Plan</button>
                    )}
                    {sub.status === 'Cancelled' && (
                      <span className="flex-1 py-2 text-center text-gray-400 font-bold text-sm bg-gray-50 rounded-xl border border-gray-100">Plan Terminated</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
              <CalendarDays size={48} className="text-gray-300 mb-4" />
              <p className="text-lg text-gray-600 font-medium mb-6">You have no active Subscriptions protecting your dietary goals.</p>
              <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-700 transition-colors" onClick={() => navigate('/subscription')}>
                Explore Meal Plans
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rewards System */}
      {user && user.role === 'user' && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Gift className="text-primary" /> Refer & Earn Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Give 20%, Get ₹150</h3>
              <p className="text-gray-500 mb-6">Share your unique code with friends. They get 20% off their first order, and you get ₹150 added to your wallet automatically!</p>
              
              <div className="flex bg-gray-50 rounded-xl border border-gray-200 p-2 items-center">
                <span className="flex-grow pl-4 font-mono font-bold text-lg text-primary tracking-widest text-center md:text-left">
                  VITA-{user._id.substring(user._id.length - 6).toUpperCase()}
                </span>
                <button className="px-6 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-lg transition-colors" onClick={() => { navigator.clipboard.writeText(`VITA-${user._id.substring(user._id.length - 6).toUpperCase()}`); alert("Copied to clipboard!"); }}>
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl shadow-xl border border-gray-800 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-gray-800 rounded-full blur-3xl opacity-50"></div>
               <div className="text-5xl font-extrabold mb-2 relative z-10 text-primary drop-shadow-lg">₹{walletBalance}<span className="text-xl text-gray-400">.00</span></div>
               <h3 className="font-bold text-lg relative z-10">Available Wallet Balance</h3>
               <p className="text-gray-400 text-sm mt-2 relative z-10">Wallet credits instantly apply during checkout.</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Orders Tracker */}
      {activeOrders.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-red-200"></span> Live Active Deliveries
          </h2>
          <div className="flex flex-col gap-6">
            {activeOrders.map(order => {
              const step = getStepProgress(order.status);
              return (
                <div key={order._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-8 border-b border-gray-50 pb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                      <p className="text-primary font-medium mt-1">Status: {order.status}</p>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                  </div>

                  {/* Progress Pipeline */}
                  <div className="relative pt-4">
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 h-1.5 bg-primary rounded-full -translate-y-1/2 transition-all duration-700" style={{ width: `${(step - 1) * 33.33}%` }}></div>
                    
                    <div className="relative flex justify-between z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}><Clock size={18} /></div>
                        <span className={`text-xs font-bold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Verifying</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}><CheckCircle size={18} /></div>
                        <span className={`text-xs font-bold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Confirmed</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-400'} ${step === 3 ? 'ring-4 ring-green-100 animate-pulse' : ''}`}><Truck size={18} /></div>
                        <span className={`text-xs font-bold ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Dispatch</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 4 ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}><Package size={18} /></div>
                        <span className={`text-xs font-bold ${step >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Order History */}
      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Order History Log</h2>
          <div className="flex flex-col gap-4">
            {pastOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-colors hover:border-gray-300">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center bg-transparent hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex -space-x-3 isolate">
                       {order.orderItems.slice(0, 3).map((item, idx) => (
                         <img key={idx} src={item.image} alt={item.name} className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100" />
                       ))}
                       {order.orderItems.length > 3 && (
                         <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-sm shadow-sm z-10">
                           +{order.orderItems.length - 3}
                         </div>
                       )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">#{order._id.substring(order._id.length - 6).toUpperCase()}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
                        <CheckCircle size={14} className="text-primary" /> Delivered {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="font-extrabold text-xl text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                    <div className="text-gray-400">
                      {expandedOrderId === order._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Receipt */}
                {expandedOrderId === order._id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Detailed Receipt</h4>
                    
                    <div className="space-y-3 mb-6 bg-white p-4 rounded-xl border border-gray-100">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-medium">
                          <div className="flex items-center gap-3 text-gray-800">
                            <span className="text-primary font-bold">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          <div className="text-gray-500">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="w-64 ml-auto space-y-2 text-sm">
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Items Subtotal</span>
                        <span>₹{(order.totalAmount - 40).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-medium pb-2 border-b border-gray-200">
                        <span>Delivery Vector</span>
                        <span>₹40.00</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-lg text-gray-900 pt-1">
                        <span>Final Paid</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button 
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-colors shadow-md disabled:bg-gray-400"
                        onClick={() => handleReorder(order)}
                        disabled={isReordering}
                      >
                        {isReordering ? 'Rebuilding Matrix...' : <><RotateCcw size={16} /> Reorder Identical Sequence</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;
