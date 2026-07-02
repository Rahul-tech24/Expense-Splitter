import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axios.js';

const AddMember = () => {
  const { groupId } = useParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Hit the endpoint you built on Day 5!
      await axiosInstance.post(`/api/groups/${groupId}/members`, { email }, config);
      
      navigate(`/groups/${groupId}`); // Send them back to the group arena
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error.response?.data?.message || 'Failed to add member. Ensure they are registered.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to={`/groups/${groupId}`} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Back to Group</h1>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <UserPlus size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Add a Member</h2>
            <p className="text-slate-500 mt-2">Invite a friend to split expenses with you.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Friend's Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white" 
                placeholder="friend@example.com" 
              />
              <p className="text-xs text-slate-400 mt-2">
                * Note: Your friend must already have an account created.
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-lg transition shadow-md mt-4"
            >
              {isLoading ? 'Adding...' : 'Add Member'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddMember;