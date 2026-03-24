import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Left Column: Visual/Hero */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-end pb-20 justify-center flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden bg-primary">
          <img 
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200" 
            alt="Beautiful avocado bowl"
            className="w-full h-full object-cover object-center opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        {/* Hero Typography */}
        <div className="relative z-10 p-12 max-w-xl text-left pl-20">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-8">
            <ShieldCheck size={48} className="text-accent" />
          </div>
          <h1 className="text-4xl xl:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 drop-shadow-xl">
            Start Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-300">Healthy Journey</span> Today.
          </h1>
          <section className="space-y-4">
             <div className="flex items-center gap-3 text-gray-200 font-semibold"><div className="w-2 h-2 rounded-full bg-accent"></div> Hand-crafted meals by expert chefs</div>
             <div className="flex items-center gap-3 text-gray-200 font-semibold"><div className="w-2 h-2 rounded-full bg-accent"></div> Precise macro tracking aligned with your goals</div>
             <div className="flex items-center gap-3 text-gray-200 font-semibold"><div className="w-2 h-2 rounded-full bg-accent"></div> Delivery automatically scheduled to your door</div>
          </section>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-lg bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 sm:p-12 border border-gray-100 relative overflow-hidden">
          
          <div className="relative z-10 mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 font-medium tracking-wide">Join thousands eating better, exactly to their stats.</p>
          </div>
          
          {error && (
            <div className="relative z-10 mb-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="font-semibold text-sm leading-tight">{error}</span>
            </div>
          )}
          
          <form onSubmit={submitHandler} className="relative z-10 flex flex-col gap-5">
            
            {/* Name Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    type="password" 
                    className="w-full pl-11 pr-3 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 tracking-widest text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Confirm</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    type="password" 
                    className="w-full pl-11 pr-3 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 tracking-widest text-sm"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
            </Button>
          </form>
          
          <div className="relative z-10 mt-8 text-center text-gray-500 font-medium">
            Already have an account? <Link to="/user/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">Sign into your dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
