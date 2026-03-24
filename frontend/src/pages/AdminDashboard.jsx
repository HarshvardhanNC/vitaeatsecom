import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Database, 
  ArrowRight, 
  Activity, 
  Clock, 
  CheckCircle, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/admin/dashboard', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user && user.role === 'admin') fetchStats();
  }, [user]);

  if (!stats) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">Synchronizing Global Metrics...</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...stats.last7Days.map(d => d.revenue), 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Executive Control</h1>
              <p className="text-gray-500 font-medium">Real-time platform analytics and operational oversight.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-50 text-primary border border-green-100 rounded-xl flex items-center gap-2 text-sm font-bold">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                System Live
              </div>
              <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Revenue Card - Primary Brand Color */}
          <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100%] transition-all group-hover:scale-110"></div>
            <div className="relative z-10">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                 <DollarSign size={24} className="text-white" />
               </div>
               <h3 className="text-white/80 font-black text-xs uppercase tracking-widest mb-1">Gross Revenue</h3>
               <p className="text-4xl font-black">₹{stats.totalRevenue.toLocaleString()}</p>
               <div className="mt-4 flex items-center gap-2 text-accent text-sm font-black">
                 <TrendingUp size={16} /> +12.5% from last month
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                 <Users size={24} />
               </div>
               <span className="text-xs font-black text-accent bg-accent/5 px-2 py-1 rounded-lg">LIVE</span>
             </div>
             <div>
               <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-1">Total Clientele</h3>
               <p className="text-4xl font-black text-gray-900">{stats.usersCount}</p>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                 <ShoppingBag size={24} />
               </div>
               <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">ALL TIME</span>
             </div>
             <div>
               <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-1">Total Orders</h3>
               <p className="text-4xl font-black text-gray-900">{stats.ordersCount}</p>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-primary/10 text-accent rounded-2xl flex items-center justify-center">
                 <Activity size={24} />
               </div>
               <span className="text-xs font-black text-accent bg-accent/5 px-2 py-1 rounded-lg">PENDING</span>
             </div>
             <div>
               <h3 className="text-gray-500 font-black text-xs uppercase tracking-widest mb-1">Active Logistics</h3>
               <p className="text-4xl font-black text-gray-900">{stats.activeOrders}</p>
             </div>
          </div>
        </div>

        {/* Main Section: Trend & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Revenue Trend Visualizer */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-10">
               <div>
                 <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                   <TrendingUp size={20} className="text-primary" /> Financial Momentum
                 </h2>
                 <p className="text-gray-400 text-sm font-medium">Daily revenue scaling over the last 7 cycles.</p>
               </div>
               <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500">
                 WEEKLY SCALE
               </div>
             </div>

             <div className="flex items-end justify-between h-64 gap-2 px-2">
                {stats.last7Days.map((day, idx) => {
                  const barHeight = Math.max((day.revenue / maxRevenue) * 100, 5);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      <div className="absolute bottom-full mb-4 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                        ₹{day.revenue.toLocaleString()}
                      </div>
                      <div 
                        className="w-full max-w-[40px] bg-gradient-to-t from-primary to-accent rounded-t-xl transition-all duration-1000 group-hover:from-accent relative overflow-hidden" 
                        style={{ height: `${barHeight}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="mt-4 text-xs font-bold text-gray-400 uppercase">{day.day}</span>
                    </div>
                  )
                })}
             </div>
          </div>

          {/* Performance Leaderboard */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col divide-y divide-gray-50">
             <div className="pb-6">
               <h2 className="text-xl font-black text-gray-900 mb-2">Alpha Performance</h2>
               <p className="text-gray-400 text-sm">Quantifying top meal velocity.</p>
             </div>
             <div className="py-6 flex flex-col gap-6 flex-grow">
               {stats.topMeals.map((meal, index) => {
                 const scale = (meal.count / stats.topMeals[0].count) * 100;
                 return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-gray-700 truncate max-w-[150px]">{meal.name}</span>
                        <span className="font-black text-gray-900">₹{meal.revenue.toFixed(0)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${scale}%` }}></div>
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{meal.count} Verified Orders</div>
                    </div>
                 )
               })}
             </div>
             <div className="pt-6">
                <Link to="/admin/inventory" className="w-full py-3 bg-gray-50 text-gray-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                  Inventory Mapping <ArrowRight size={14} />
                </Link>
             </div>
          </div>
        </div>

        {/* Bottom Section: Activity & Logistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Activity Stream */}
           <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Activity size={20} className="text-accent" /> Activity Stream
                </h2>
                <Link to="/admin/orders" className="text-primary text-sm font-bold hover:underline">Full Audit Logs</Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-widest font-black border-b border-gray-50">
                      <th className="pb-4 pr-4">Identity</th>
                      <th className="pb-4 pr-4">Chronology</th>
                      <th className="pb-4 pr-4">Status</th>
                      <th className="pb-4 text-right">Magnitude</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                              {order.user?.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-700">{order.user?.name}</span>
                          </div>
                        </td>
                        <td className="py-5 pr-4 text-sm text-gray-400 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-5 pr-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-accent/10 text-accent' :
                            order.status === 'Confirmed' ? 'bg-primary/10 text-primary' :
                            'bg-primary/5 text-gray-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-5 text-right font-black text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           {/* Quick Link Module */}
           <div className="flex flex-col gap-6">
              <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-2 leading-tight">Operational Support Engaged</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">Direct control over logistics pipelines and algorithmic inventory nodes.</p>
                </div>
                <Link to="/admin/orders" className="bg-white text-primary font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-50 transition-colors shadow-2xl relative z-10">
                  Audit Logistics <Package size={18} />
                </Link>
                {/* Decorative Pattern */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[20px] border-white/10 rounded-full"></div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center gap-5">
                 <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <AlertCircle size={28} />
                 </div>
                 <div>
                    <h4 className="font-black text-gray-900 leading-none">Security Protocol</h4>
                    <p className="text-gray-400 text-xs mt-1">Master Account: admin@vitaeats.com</p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
