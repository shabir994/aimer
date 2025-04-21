import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import {
  Camera,
  Mic,
  MessageSquare,
  Play,
  Pause,
  RefreshCw,
  Brain,
  Smile,
  Frown,
  Meh,
  Heart,
  Activity,
  AlertCircle,
  ChevronRight,
  Send,
  X,
  Loader2
} from 'lucide-react';
import { dashboardAPI } from '../lib/api/mockData';

interface EmotionData {
  happiness: number;
  sadness: number;
  neutral: number;
  stress: number;
  energy: number;
}

interface Suggestion {
  title: string;
  description: string;
  type: string;
}

const WEBCAM_CONSTRAINTS = {
  width: 640,
  height: 480,
  facingMode: "user",
  aspectRatio: 1.333333
};

const RealTimeAssistance = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'voice' | 'text'>('camera');
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showExercise, setShowExercise] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData>({
    happiness: 0,
    sadness: 0,
    neutral: 0,
    stress: 0,
    energy: 0
  });
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analysisIntervalRef = useRef<number | null>(null);

  // Handle webcam initialization
  const handleUserMedia = () => {
    setIsCameraReady(true);
    setError(null);
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Webcam error:', error);
    setError('Failed to access camera. Please check your camera permissions.');
    setIsCameraReady(false);
  };

  // Camera handling
  const handleCameraAnalysis = async () => {
    if (!webcamRef.current || !isCameraReady) {
      setError('Camera is not ready. Please wait or check permissions.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        throw new Error('Failed to capture screenshot. Please ensure camera access is granted.');
      }

      // Convert screenshot to base64
      const base64Data = screenshot.replace(/^data:image\/jpeg;base64,/, '');
      if (!base64Data) {
        throw new Error('Invalid screenshot format');
      }

      const result = await dashboardAPI.analyzeEmotion('image', base64Data);
      setEmotionData(result.emotions);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      stopContinuousAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Voice handling
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setError(null);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          try {
            setIsAnalyzing(true);
            const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
            const reader = new FileReader();
            
            reader.onloadend = async () => {
              const base64Audio = reader.result as string;
              const result = await dashboardAPI.analyzeEmotion('voice', base64Audio);
              setEmotionData(result.emotions);
              setSuggestions(result.suggestions);
              setIsAnalyzing(false);
            };

            reader.readAsDataURL(audioBlob);
          } catch (error) {
            console.error('Error analyzing voice:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            setIsAnalyzing(false);
          }
        };

        mediaRecorder.start();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setError('Failed to access microphone');
        setIsRecording(false);
      });
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  // Text analysis
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const result = await dashboardAPI.analyzeEmotion('text', textInput);
      setEmotionData(result.emotions);
      setSuggestions(result.suggestions);
      setTextInput('');
    } catch (error) {
      console.error('Error analyzing text:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle continuous analysis
  const startContinuousAnalysis = () => {
    if (!isCameraReady) {
      setError('Camera is not ready. Please wait or check permissions.');
      return;
    }
    setIsRecording(true);
    setError(null);
    handleCameraAnalysis();
    analysisIntervalRef.current = window.setInterval(handleCameraAnalysis, 5000);
  };

  const stopContinuousAnalysis = () => {
    setIsRecording(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Reset analysis
  const resetAnalysis = () => {
    stopContinuousAnalysis();
    setEmotionData({
      happiness: 0,
      sadness: 0,
      neutral: 0,
      stress: 0,
      energy: 0
    });
    setSuggestions([]);
    setError(null);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  const exercises = [
    {
      title: "Mindful Breathing",
      steps: [
        "Find a comfortable position",
        "Close your eyes",
        "Breathe in slowly through your nose for 4 counts",
        "Hold for 4 counts",
        "Exhale slowly through your mouth for 4 counts",
        "Repeat 5 times"
      ],
      duration: "2 minutes"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-Time Assistance</h1>
          <p className="text-gray-600">Get instant emotional analysis and personalized recommendations</p>
        </div>
        <button
          onClick={() => setShowExercise(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg"
        >
          Start Exercise
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Input Methods */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex p-4 gap-4">
              {[
                { id: 'camera', icon: Camera, label: 'Camera' },
                { id: 'voice', icon: Mic, label: 'Voice' },
                { id: 'text', icon: MessageSquare, label: 'Text' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setActiveTab(method.id as 'camera' | 'voice' | 'text')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === method.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <method.icon size={20} />
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'camera' && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={WEBCAM_CONSTRAINTS}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                    mirrored
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  {!isCameraReady && !error && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Initializing camera...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      if (isRecording) {
                        stopContinuousAnalysis();
                      } else {
                        startContinuousAnalysis();
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
                      isRecording
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                    disabled={isAnalyzing || !isCameraReady}
                  >
                    {isRecording ? (
                      <>
                        <Pause size={20} />
                        Stop Analysis
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Start Analysis
                      </>
                    )}
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors duration-200"
                    onClick={resetAnalysis}
                  >
                    <RefreshCw size={20} />
                    Reset
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="space-y-4">
                <div className="aspect-[2/1] bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    {isRecording ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                          <Mic size={32} className="text-white" />
                        </div>
                        <p className="text-gray-600">Recording in progress...</p>
                      </div>
                    ) : (
                      <>
                        <Mic size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Click Start to begin voice analysis</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      if (isRecording) {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${
                      isRecording
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                    disabled={isAnalyzing}
                  >
                    {isRecording ? (
                      <>
                        <Pause size={20} />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        Start Recording
                      </>
                    )}
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => {
                      stopRecording();
                      setEmotionData({
                        happiness: 0,
                        sadness: 0,
                        neutral: 0,
                        stress: 0,
                        energy: 0
                      });
                      setSuggestions([]);
                      setError(null);
                    }}
                  >
                    <RefreshCw size={20} />
                    Reset
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your thoughts here..."
                  className="w-full h-40 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                  disabled={isAnalyzing}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                    disabled={isAnalyzing || !textInput.trim()}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    Analyze Text
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Panel - Analysis Results */}
        <div className="space-y-6">
          {/* Emotion Indicators */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Emotional State</h2>
            <div className="space-y-4">
              {[
                { label: 'Happiness', value: emotionData.happiness, icon: Smile, color: 'text-green-500' },
                { label: 'Sadness', value: emotionData.sadness, icon: Frown, color: 'text-blue-500' },
                { label: 'Neutral', value: emotionData.neutral, icon: Meh, color: 'text-gray-500' },
                { label: 'Stress', value: emotionData.stress, icon: AlertCircle, color: 'text-red-500' },
                { label: 'Energy', value: emotionData.energy, icon: Activity, color: 'text-purple-500' }
              ].map((emotion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <emotion.icon className={`w-5 h-5 ${emotion.color}`} />
                      <span className="text-gray-700">{emotion.label}</span>
                    </div>
                    <span className="font-medium text-gray-900">{Math.round(emotion.value)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${emotion.value}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        emotion.label === 'Happiness' ? 'bg-green-500' :
                        emotion.label === 'Sadness' ? 'bg-blue-500' :
                        emotion.label === 'Neutral' ? 'bg-gray-500' :
                        emotion.label === 'Stress' ? 'bg-red-500' :
                        'bg-purple-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h2>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {suggestion.type === 'Exercise' ? (
                        <Activity className="w-5 h-5 text-blue-600" />
                      ) : suggestion.type === 'Mental' ? (
                        <Brain className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Heart className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <span className="inline-block mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {suggestion.type}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {showExercise && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Mindfulness Exercise</h2>
                </div>
                <button
                  onClick={() => setShowExercise(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{exercises[0].title}</h3>
                    <span className="text-sm text-gray-600">Duration: {exercises[0].duration}</span>
                  </div>
                  <ol className="space-y-4">
                    {exercises[0].steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="text-gray-700">{step}</p>
                      </li>
                    ))}
                  </ol>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowExercise(false)}
                      className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                      Close
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg">
                      Start Exercise
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeAssistance;