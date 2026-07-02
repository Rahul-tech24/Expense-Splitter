import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowLeft, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axios.js';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axiosInstance.post('/api/groups', { name }, config);
      navigate(`/groups/${data._id}`); // Instantly redirect to the new group's page!
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Back to Dashboard</h1>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Users size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Create a Group</h2>
            <p className="text-slate-500 mt-2">Start a new space to split expenses.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-slate-50 focus:bg-white" 
                placeholder="e.g. Goa Trip 2026, Apartment 4B" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 px-4 rounded-lg transition shadow-md"
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;