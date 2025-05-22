import React, { useState } from 'react';
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Provider } from '@supabase/supabase-js';

interface LoginProps {
  onRegisterClick: () => void;
  onForgotClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick, onForgotClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { signIn, signInWithProvider, error: authError, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }

    await signIn(formData.email, formData.password);
  };

  const handleSocialSignIn = async (provider: Provider) => {
    await signInWithProvider(provider);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Login</h2>
        <p className="text-gray-600 text-lg">Welcome back! Please sign in to continue</p>
      </div>

      {(validationError || authError) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{validationError || authError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
            />
          </div>

          <div className="relative group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotClick}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSocialSignIn('google')}
          className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="text-gray-600 font-medium">Google</span>
        </button>
        <button
          onClick={() => handleSocialSignIn('apple')}
          className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-5 h-5" />
          <span className="text-gray-600 font-medium">Apple</span>
        </button>
        <button
          onClick={() => handleSocialSignIn('github')}
          className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5" />
          <span className="text-gray-600 font-medium">GitHub</span>
        </button>
        <button
          onClick={() => handleSocialSignIn('facebook')}
          className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
          <span className="text-gray-600 font-medium">Facebook</span>
        </button>
      </div>

      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onRegisterClick}
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
        >
          Register Now
        </button>
      </p>
    </div>
  );
};

export default Login;