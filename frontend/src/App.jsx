

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GroupPage from './pages/GroupPage.jsx';
import Landing from './pages/Landing.jsx';
import CreateGroup from './pages/CreateGroup.jsx';
import AddExpense from './pages/AddExpense.jsx';

function App() {
 

  return (
    <BrowserRouter>
      
    <Routes>
      <Route path="/" element={<Landing />} />
        
        {/* Auth Flow */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected App Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups/:groupId" element={<GroupPage />} />
       <Route path="/create-group" element={<CreateGroup />} />
<Route path="/groups/:groupId/add-expense" element={<AddExpense />} />


    </Routes>
      
    </BrowserRouter>
  )
}

export default App;