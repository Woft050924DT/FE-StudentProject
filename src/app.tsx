// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


// Auth Pages
import LoginForm from './views/auth/LoginForm';
import RegisterForm from './views/auth/RegisterForm';
import MainForm from './views/Main/MainForm';
import ReportForm from './views/Layout/ReportForm';
import ReviewForm from "./views/Layout/Review";

function App() {
  return (
    <Router>
        <div className="App">
          
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="Layout/report" element={<ReportForm />} />
            <Route path="/auth/login" element={<LoginForm />} />
            <Route path="/auth/register" element={<RegisterForm />} />
            <Route path='/Layout/review' element={<ReviewForm />} />

            {/* Protected Routes */}
            <Route path="/main" element={<MainForm />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="Layout/review" replace />} />
            {/* <Route path="*" element={<Navigate to="/auth/register" replace />} /> */}
          </Routes>
        </div>
    </Router>
  );
}

export default App;