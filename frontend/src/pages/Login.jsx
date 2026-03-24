import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Left Column: Visual/Hero */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-end pb-20 justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200" 
            alt="Healthy meal prep"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        {/* Hero Typography */}
        <div className="relative z-10 p-12 max-w-xl text-center">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-widest mb-6 uppercase border border-white/10 shadow-lg">
            Welcome Back
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
            Fuel Your Body. <br /><span className="text-accent underline decoration-4 decoration-accent/50 underline-offset-4">Achieve Your Goals.</span>
          </h1>
          <p className="text-gray-200 text-lg">
            Sign in to access your custom meal plans, track your nutrition, and seamlessly manage your weekly deliveries.
          </p>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 sm:p-12 border border-gray-100 relative overflow-hidden">
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full opacity-50 z-0"></div>

          <div className="relative z-10 mb-10 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Sign In</h2>
            <p className="text-gray-500 font-medium tracking-wide">Enter your details to access your account.</p>
          </div>
          
          {error && (
            <div className="relative z-10 mb-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={submitHandler} className="relative z-10 flex flex-col gap-6">
            
            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 tracking-widest"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-[-0.5rem] mb-2">
              <span className="text-sm font-bold text-primary hover:text-gray-900 cursor-pointer transition-colors">Forgot Password?</span>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full group" disabled={isSubmitting}>
              {isSubmitting ? 'Authenticating...' : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="relative z-10 mt-8 text-center text-gray-500 font-medium">
            Don't have an account? <Link to="/user/register" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">Create one now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
