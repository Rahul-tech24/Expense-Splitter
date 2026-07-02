import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { ArrowLeft, Receipt } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AddExpense = () => {

  const { groupId } = useParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  
  const navigate = useNavigate();

  // We need to fetch the group details so we know who is in it!
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('https://expense-splitter-8fkw.onrender.com/api/groups', config);
        const currentGroup = data.find(g => g._id === groupId);
        setGroup(currentGroup);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch group details');
        console.error('Error fetching group details:', error);
      }

    };
    if (user) fetchGroup();
  }, [user, groupId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !group) return;
    
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // MVP Logic: Logged-in user pays, splits equally among all group members
      const expenseData = {
        description,
        amount: Number(amount),
        paidBy: user._id, 
        splitAmong: group.members.map(member => member._id || member) 
      };

      await axios.post(`https://expense-splitter-8fkw.onrender.com/api/expenses/${groupId}`, expenseData, config);
      navigate(`/groups/${groupId}`); // Send them back to the group arena
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <Receipt size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Add an Expense</h2>
            <p className="text-slate-500 mt-2">
              {group ? `Splitting equally with ${group.members.length} members` : 'Loading group...'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What was it for?</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
                className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-slate-50 focus:bg-white" 
                placeholder="e.g. Dinner, Uber, Groceries" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount (₹)</label>
              <input 
                type="number" 
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required 
                className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-slate-50 focus:bg-white" 
                placeholder="0.00" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !group}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3.5 px-4 rounded-lg transition shadow-md mt-4"
            >
              {isLoading ? 'Saving...' : 'Save Expense'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddExpense;
