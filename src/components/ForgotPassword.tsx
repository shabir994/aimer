import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Forgot Password</h2>
        <p className="text-gray-600 text-lg">Don't worry! It happens. Please enter your email address.</p>
      </div>

      <form className="space-y-6">
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send Reset Link
        </button>
      </form>

      <button
        onClick={onBackToLogin}
        className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 w-full group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;