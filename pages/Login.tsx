
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, Mail, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 mt-12">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-rose-50">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-rose-50 rounded-full mb-4">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
          </div>
          <h2 className="text-3xl font-serif-elegant font-bold text-gray-800">Admin Login</h2>
          <p className="text-rose-400 text-sm mt-2">Manage your shared journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-start text-sm animate-shake">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input 
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-rose-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300" />
              <input 
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl focus:ring-2 focus:ring-rose-200 outline-none transition-all placeholder:text-rose-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default Login;
