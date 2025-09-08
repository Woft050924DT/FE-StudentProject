// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


// Auth Pages
import LoginForm from './views/auth/LoginForm';
import RegisterForm from './views/auth/RegisterForm';
import MainForm from './views/Main/MainForm';
import ProfilePage from './views/Profile/ProfilePage';


function App() {
  return (
    <Router>
        <div className="App">
          
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/auth/register" element={<RegisterForm />} />


            {/* Protected Routes */}
            <Route path="/main" element={<MainForm />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="*" element={<Navigate to="/auth/register" replace />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;