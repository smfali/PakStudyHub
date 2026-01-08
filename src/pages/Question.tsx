import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateAnswer } from '../services/gemini';
import { Layout } from '../components/Layout';
import { 
  Camera, 
  Image as ImageIcon, 
  Send, 
  Home as HomeIcon, 
  PlusCircle, 
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';

export const Question: React.FC = () => {
  const { profile, resetProfile } = useApp();
  const navigate = useNavigate();
  
  const [questionText, setQuestionText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ solution: string; explanation: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) {
      navigate('/home');
    }
  }, [profile, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if ((!questionText.trim() && !imagePreview) || !profile) {
      setError("Please enter a question or upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const promptText = questionText || (imagePreview ? "Solve this problem in the image" : "");
      const response = await generateAnswer(promptText, imagePreview, profile);
      setResult(response);
      
      // Scroll to result after a short delay to allow rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetQuestion = () => {
    setQuestionText('');
    setImagePreview(null);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    resetProfile();
    navigate('/home');
  };

  if (!profile) return null;

  return (
    <Layout>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10">
        <h1 className="text-center font-bold text-lg text-green-800">PakStudy Hub</h1>
        <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500 bg-gray-50 py-1 px-3 rounded-full mx-auto w-fit">
          <span className="font-medium text-gray-700">{profile.province}</span>
          <span>•</span>
          <span className="font-medium text-gray-700">{profile.grade}</span>
          <span>•</span>
          <span className="font-medium text-green-600">{profile.subject}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Question Input Area */}
        <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all ${result ? 'opacity-50 pointer-events-none' : ''}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ask a Question</label>
          
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-green-500 resize-none h-24 text-gray-800 placeholder-gray-400"
          />

          {imagePreview && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <ImageIcon size={18} /> Gallery
            </button>
            <button 
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
            >
              <Camera size={18} /> Camera
            </button>
          </div>

          {/* Hidden Inputs */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
          />
          <input 
            type="file" 
            ref={cameraInputRef} 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleImageUpload} 
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || (!questionText && !imagePreview)}
            className="w-full mt-4 py-3 bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-green-100 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Get Answer</>}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div ref={resultRef} className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                <h3 className="font-bold text-green-800 flex items-center gap-2">
                   Right Solution
                </h3>
              </div>
              <div className="p-4 text-gray-800 leading-relaxed whitespace-pre-wrap">
                {result.solution}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h3 className="font-bold text-blue-800">Explanation</h3>
              </div>
              <div className="p-4 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                {result.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={handleHome}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-700 transition-colors w-20"
        >
          <HomeIcon size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button 
          onClick={handleResetQuestion}
          className="flex flex-col items-center gap-1 text-green-700 w-20"
        >
          <div className="bg-green-100 p-2 rounded-full mb-0.5">
            <PlusCircle size={24} />
          </div>
          <span className="text-[10px] font-medium">New Question</span>
        </button>
      </div>
    </Layout>
  );
};
