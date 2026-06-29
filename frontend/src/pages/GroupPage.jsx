import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { ArrowLeft, Plus } from 'lucide-react';

const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchGroupData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const expenseRes = await axios.get(`http://localhost:5000/api/expenses/${groupId}`, config);
        const settlementRes = await axios.get(`http://localhost:5000/api/expenses/${groupId}/settle`, config); // Fixed endpoint from 'settlements' to 'settle' based on your backend route

        setExpenses(expenseRes.data);
        setSettlements(settlementRes.data);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [navigate, user, groupId]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Group Overview</h1>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT COLUMN: EXPENSES */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Recent Expenses</h2>
              <Link to={`/groups/${groupId}/add-expense`} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
  <Plus size={16} /> Add Expense
</Link>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {expenses.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No expenses yet.</div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {expenses.map((expense) => (
                    <li key={expense._id} className="p-5 hover:bg-slate-50 transition flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                          {expense.paidBy?.name ? expense.paidBy.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{expense.description}</p>
                          <p className="text-sm text-slate-500">Paid by {expense.paidBy?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{expense.amount}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SETTLEMENTS */}
          <div className="w-full md:w-96 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">How to Settle Up</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              {settlements.length === 0 ? (
                <p className="text-slate-500 text-center py-4">You are all settled up!</p>
              ) : (
                <div className="space-y-4">
                  {settlements.map((settlement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <div>
                       <p className="text-sm text-black-900">
  <span className="font-bold">{settlement.fromName}</span>
  {' '}owes{' '}
  <span className="font-bold">{settlement.toName}</span>
</p>
                      </div>
                      <div className="font-bold text-orange-600 text-lg">
                        ₹{Math.round(settlement.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          
        </div>
      </main>
    </div>
  );
};

export default GroupPage;
