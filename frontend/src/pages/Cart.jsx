import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import Button from '../components/Button';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle potential nested population differences (item.meal vs item)
  const getMealData = (item) => item.meal || item;

  const subtotal = cartItems.reduce((acc, item) => {
    const meal = getMealData(item);
    return acc + (item.quantity * (meal.price || 0));
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-50 text-primary rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-lg text-gray-500 mb-8 max-w-md">Looks like you haven't added any meals yet. Let's fix that!</p>
        <Link to="/menu">
          <Button variant="primary" size="lg">Browse Meals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {cartItems.map((item) => {
            const meal = getMealData(item);
            return (
              <div key={item._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <img 
                    src={meal.image || 'https://via.placeholder.com/150'} 
                    alt={meal.name} 
                    className="w-24 h-24 object-cover rounded-xl shadow-sm" 
                  />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{meal.name}</h3>
                    <p className="text-gray-500 font-medium">
                      <span className="text-primary">${meal.price?.toFixed(2)}</span> x {item.quantity}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                  <span className="font-bold text-xl text-gray-900">
                    ${((meal.price || 0) * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors duration-300"
                    title="Remove Item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-28">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-6 border-b border-gray-100">
            Order Summary
          </h2>
          
          <div className="flex flex-col gap-4 mb-6 text-lg">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="font-semibold text-gray-900">$5.00</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 mb-8">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-extrabold text-primary">${(subtotal + 5).toFixed(2)}</span>
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full flex items-center justify-center gap-2 group"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
