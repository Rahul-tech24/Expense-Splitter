import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      login(response.data); 
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
      console.error('Registration failed:', error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
          <p className="text-slate-500 mt-2">Start splitting expenses today.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-slate-50 focus:bg-white" 
              placeholder="David Goggins" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-slate-50 focus:bg-white" 
              placeholder="david@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-slate-50 focus:bg-white" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-lg transition shadow-md">
            Create Account
          </button>
        </form>
        <p className="text-center mt-8 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;