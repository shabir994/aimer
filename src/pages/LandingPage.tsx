import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BarChart3, 
  MessageSquareMore, 
  Quote,
  Heart,
  Star,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react';
import EmotionGraph from '../components/EmotionGraph';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: Brain,
      title: "Emotion Detection",
      description: "Advanced AI technology to analyze emotions through multiple channels including voice, video, and photos."
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Visualize your emotional journey with detailed analytics and progress tracking."
    },
    {
      icon: MessageSquareMore,
      title: "Motivation Chatbot",
      description: "24/7 AI companion providing personalized advice and emotional support."
    },
    {
      icon: Quote,
      title: "Daily Motivation",
      description: "Receive tailored motivational content based on your emotional state."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Coach",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
      quote: "AIMER has transformed how I understand and manage my emotions. It's like having a personal emotional coach."
    },
    {
      name: "Michael Chen",
      role: "Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150",
      quote: "The daily motivational quotes and emotional tracking have helped me maintain better mental health during exams."
    },
    {
      name: "Emily Rodriguez",
      role: "Entrepreneur",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150",
      quote: "As a business owner, managing stress is crucial. AIMER helps me stay balanced and focused."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6">
              <motion.div
                className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">
                  Powered by Advanced AI
                </span>
              </motion.div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Unlock Your Emotional
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Potential with AI
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of emotional intelligence with AIMER. Our AI-powered platform helps you understand, track, and improve your emotional well-being.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => navigate('/auth/login')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try AIMER Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            {...fadeIn}
          >
            <span className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-semibold mb-6">
              About AIMER
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
              Your AI-Powered Emotional Intelligence Companion
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              AIMER is your personal AI-powered emotional intelligence companion. Using cutting-edge technology, we help you understand and manage your emotions better, leading to improved relationships, better decision-making, and enhanced overall well-being.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-50 rounded-full text-purple-600 font-semibold mb-6">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Powerful Features for Your Journey</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Graph Demo Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-semibold mb-6">
                Analytics
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Track Your Progress</h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 backdrop-blur-sm bg-white/90"
            >
              <EmotionGraph />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-50 rounded-full text-purple-600 font-semibold mb-6">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Success Stories</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                      <Quote size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                AIMER
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Empowering emotional intelligence through AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'About Us', 'Features', 'Contact'].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Features</h4>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <Heart size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      {feature.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:a.m.a.hareb2020@gmail.com"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                  >
                    <Mail size={20} className="group-hover:scale-110 transition-transform duration-200" />
                    a.m.a.hareb2020@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone size={20} />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <MapPin size={20} />
                  123 AI Street, Digital City
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-16 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} AIMER. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;