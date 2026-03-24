import React, { useState, useEffect, useContext, Fragment } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { ChevronDown, ChevronUp, PackageCheck, AlertCircle, Clock, Truck, MoreVertical } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  };

  const StatusIcon = ({ status }) => {
    switch(status) {
      case 'Pending': return <Clock size={16} className="text-orange-500" />;
      case 'Confirmed': return <PackageCheck size={16} className="text-blue-500" />;
      case 'Out for Delivery': return <Truck size={16} className="text-purple-500" />;
      case 'Delivered': return <AlertCircle size={16} className="text-green-500" />;
      default: return null;
    }
  };

  const StatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Out for Delivery': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Order Fulfillment</h1>
          <p className="text-gray-500 text-lg">Track, manage, and dispatch all active customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-5 text-left w-12 text-xs font-extrabold text-gray-400 uppercase tracking-wider"></th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-5 text-left text-xs font-extrabold text-gray-500 uppercase tracking-wider">Live Status</th>
                <th className="px-6 py-5 text-right w-32 text-xs font-extrabold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <Fragment key={order._id}>
                  <tr className={`hover:bg-gray-50/50 transition-colors ${expandedId === order._id ? 'bg-gray-50/80 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}>
                    <td className="px-6 py-4 cursor-pointer text-gray-400 hover:text-primary transition-colors" onClick={() => toggleExpand(order._id)}>
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                        {expandedId === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 font-bold tracking-wide">
                      ...{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                          {order.user?.name ? order.user.name.charAt(0) : '?'}
                        </div>
                        <span className="font-semibold text-gray-800">{order.user?.name || 'Guest User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium tracking-wide">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-extrabold text-lg">₹{order.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border ${StatusColor(order.status)}`}>
                        <StatusIcon status={order.status} /> {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl focus:ring-primary focus:border-primary block w-full p-2.5 shadow-sm transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for Delivery">Dispatching</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                  
                  {expandedId === order._id && (
                    <tr className="bg-gray-50/50 border-b-2 border-primary/20">
                      <td colSpan="7" className="px-8 py-8">
                        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-4xl">
                          <h4 className="font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                            <MoreVertical size={20} className="text-primary"/> Official Order Manifest
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Line Items</h5>
                                <div className="flex flex-col gap-4">
                                  {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-200" />
                                      <div className="flex-1">
                                        <div className="font-bold text-gray-900">{item.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">₹{item.price.toFixed(2)} / unit</div>
                                      </div>
                                      <div className="w-8 h-8 rounded-full bg-white text-primary border border-gray-200 font-extrabold flex items-center justify-center text-sm shadow-sm">{item.quantity}x</div>
                                    </div>
                                  ))}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Delivery Demographics</h5>
                                    {order.shippingAddress ? (
                                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm font-medium text-gray-700">
                                        {order.shippingAddress.street}<br/>
                                        {order.shippingAddress.city}, {order.shippingAddress.zip}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-500 italic">No address bound (Legacy Order)</div>
                                    )}
                                </div>
                                
                                <div>
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Financial Breakdown</h5>
                                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2">
                                        <div className="flex justify-between text-sm font-bold text-gray-500">
                                            <span>Subtotal</span>
                                            <span>₹{((order.totalAmount + (order.discountAmount||0)) - 40).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-gray-500">
                                            <span>Delivery Fee</span>
                                            <span>₹40.00</span>
                                        </div>
                                        {order.discountAmount > 0 && (
                                          <div className="flex justify-between text-sm font-bold text-green-600">
                                              <span>Coupon Discount</span>
                                              <span>-₹{order.discountAmount.toFixed(2)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between text-lg font-extrabold text-gray-900 mt-2 pt-2 border-t border-gray-100">
                                            <span>Final Settlement</span>
                                            <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-8 py-16 text-center text-gray-400 font-medium">
                    No global orders have been injected into the system yet.
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

export default AdminOrders;
