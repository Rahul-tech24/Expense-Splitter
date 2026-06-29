import { Link } from 'react-router-dom';
import { Wallet, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Wallet size={28} />
          <span>SplitDev</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-[-10vh]">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Split expenses.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Zero friction.
          </span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          The mathematically perfect way for roommates, travelers, and friends to track shared expenses and settle up.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30">
            Get Started <ArrowRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Landing;