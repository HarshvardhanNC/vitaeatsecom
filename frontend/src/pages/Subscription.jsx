import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, Star, CalendarDays } from 'lucide-react';
import Button from '../components/Button';
import AuthContext from '../context/AuthContext';

export default function Subscription() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(2); // default heavily to the Monthly plan

  const plans = [
    { 
      id: 1, name: 'Weekly Reboot', type: 'Weekly', meals: 5, price: 59.99, 
      popular: false, desc: 'Perfect for work lunches',
      features: ['5 chef-crafted meals', 'Delivery every Sunday', 'Cancel anytime']
    },
    { 
      id: 2, name: 'Monthly Lifestyle', type: 'Monthly', meals: 20, price: 219.99, 
      popular: true, desc: 'Complete daily nutrition',
      features: ['20 chef-crafted meals', 'Free weekly delivery', 'Dedicated nutritionist', 'Pause/skip weeks']
    },
    { 
      id: 3, name: 'Quarterly Transformation', type: 'Quarterly', meals: 60, price: 599.99, 
      popular: false, desc: 'Maximum savings & results',
      features: ['60 chef-crafted meals', 'Priority delivery', 'Full dietary customization', 'Free macro coaching']
    }
  ];

  const handleSubscribe = async (plan) => {
    if (!user) {
      alert("Please login to start a subscription");
      navigate('/user/login');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const payload = {
        planType: plan.type,
        mealsPerWeek: plan.meals,
        price: plan.price
      };

      await axios.post('/api/subscriptions', payload, config);
      
      // Auto-redirect to see the active subscription!
      navigate('/user/profile');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to initialize subscription plan.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-100 text-primary text-sm font-bold tracking-wide mb-4">
            <CalendarDays size={16} /> Subscription Plans
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Invest in Your Health.</h1>
          <p className="text-lg md:text-xl text-gray-500">
            Set your nutrition on autopilot. Fresh, organic meals delivered to your door on your schedule. 
            Pause, skip, or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer transition-all duration-300 rounded-3xl p-8 bg-white border-2 
                ${selectedPlan === plan.id ? 'border-primary shadow-xl lg:-translate-y-4' : 'border-gray-100 shadow-sm hover:border-gray-200 lg:hover:-translate-y-1'}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-accent text-white py-1 px-4 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
                  <Star size={14} fill="currentColor" /> Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-gray-900">${plan.price.toString().split('.')[0]}</span>
                  <span className="text-xl font-bold text-gray-500">.{plan.price.toString().split('.')[1]}</span>
                </div>
                <p className="text-sm text-primary font-semibold mt-2">
                  ${(plan.price / plan.meals).toFixed(2)} per meal
                </p>
              </div>

              <div className="space-y-4 mb-8 text-gray-600">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={18} className="text-accent flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={selectedPlan === plan.id ? 'primary' : 'outline'} 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan);
                }}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
