import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Layout } from '../components/Layout';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout className="bg-green-700 items-center justify-center text-white">
      <div className="flex flex-col items-center animate-pulse">
        <div className="bg-white p-4 rounded-full mb-6">
            <BookOpen size={64} className="text-green-700" />
        </div>
        <h1 className="text-3xl font-bold tracking-wider">PakStudy Hub</h1>
        <p className="mt-2 text-green-100 text-sm">Your AI Study Companion</p>
      </div>
    </Layout>
  );
};
