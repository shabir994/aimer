import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, KeyRound, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterProps {
  onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLoginClick }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp, error: authError, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setValidationError('Email is required');
      return;
    }

    if (!formData.password) {
      setValidationError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setValidationError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(formData.email, formData.password, formData.name.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h2>
        <p className="text-gray-600 text-lg">Join us today! Fill in your details below</p>
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
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
              disabled={loading || isSubmitting}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
              disabled={loading || isSubmitting}
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
              disabled={loading || isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading || isSubmitting}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
              disabled={loading || isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={loading || isSubmitting}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
            disabled={loading || isSubmitting}
          />
          <span className="text-gray-600 text-sm">
            I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-800 font-medium">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</Link>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {(loading || isSubmitting) ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onLoginClick}
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register;