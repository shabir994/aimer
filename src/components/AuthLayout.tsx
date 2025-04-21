import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CircleUserRound, Sparkles } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import logo from '../images/logo.png';


const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[1100px] glass-effect rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* Left Side - Decorative */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')] opacity-10 bg-cover bg-center"></div>
          
          <div className="relative z-10 animate-float">
          <div className="flex items-center gap-3 mb-8 flex flex-col items-center">
              {/* <CircleUserRound size={40} className="text-blue-300" /> */}
              {/* <Sparkles className="w-6 h-6 text-yellow-300 absolute -right-2 -top-2" /> */}
              <span className="text-3xl font-bold tracking-tight">
              <img src={logo} alt="Logo" className="w-28 h-26" />
              </span>
            </div>
            
            <div className="text-center max-w-md mx-auto space-y-4">
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
                Welcome Back!
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Enter your personal details and start your journey with us. We're excited to have you on board!
              </p>
            </div>

            <div className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl"></div>
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
                alt="Decorative"
                className="relative rounded-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full md:w-1/2 p-12">
          <div className="max-w-md mx-auto">
            <Routes>
              <Route path="/login" element={<Login onRegisterClick={() => navigate('/auth/register')} onForgotClick={() => navigate('/auth/forgot')} />} />
              <Route path="/register" element={<Register onLoginClick={() => navigate('/auth/login')} />} />
              <Route path="/forgot" element={<ForgotPassword onBackToLogin={() => navigate('/auth/login')} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;