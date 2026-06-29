import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { Wallet, LogOut, Plus, Users } from 'lucide-react';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchGroups = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/groups', config);
        setGroups(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchGroups();
  }, [navigate, user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Wallet size={24} /> <span>SplitDev</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition">
          <LogOut size={18} /> <span className="text-sm font-medium">Log Out</span>
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
            <p className="text-slate-500 mt-1">Manage your shared expenses and settlements.</p>
          </div>
          {/* Note: In the future, this button should open a modal to create a group */}
          <button className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">
                      <Link to="/create-group"><Plus size={18} /> Create Group</Link>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link key={group._id} to={`/groups/${group._id}`} className="group block bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Users size={24} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{group.name}</h2>
              <div className="flex items-center text-sm text-slate-500 gap-4 mt-4">
                <span className="flex items-center gap-1"><Users size={14}/> {group.members?.length || 1} Members</span>
              </div>
            </Link>
          ))}
          
          <button className="flex flex-col items-center justify-center bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:bg-slate-100 hover:border-indigo-400 transition min-h-[200px]">
            <div className="p-3 bg-white shadow-sm rounded-full text-slate-400 mb-3">
              <Plus size={24} />
            </div>
            <span className="font-semibold text-slate-600">Create New Group</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;