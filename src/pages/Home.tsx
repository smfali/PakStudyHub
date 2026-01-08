import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PROVINCES, GRADES, getSubjects } from '../data/curriculum';
import { Province, Grade } from '../types';
import { Layout } from '../components/Layout';
import { ChevronRight, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile } = useApp();

  const [province, setProvince] = useState<Province | ''>('');
  const [grade, setGrade] = useState<Grade | ''>('');
  const [subject, setSubject] = useState<string>('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (province && grade) {
      const subjects = getSubjects(grade, province);
      setAvailableSubjects(subjects);
      setSubject(''); // Reset subject when dependencies change
    }
  }, [province, grade]);

  const handleNext = () => {
    if (province && grade && subject) {
      setProfile({ province, grade, subject });
      navigate('/question');
    }
  };

  const isFormValid = province && grade && subject;

  return (
    <Layout className="p-6">
      <header className="mt-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center bg-green-100 p-3 rounded-full mb-4">
            <BookOpen className="text-green-700" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Student Setup</h1>
        <p className="text-gray-500 text-sm mt-1">Tell us about your curriculum</p>
      </header>

      <div className="space-y-6 flex-1">
        {/* Province Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Province / Region</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value as Province)}
            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          >
            <option value="" disabled>Select Province</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Grade Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Grade Level</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as Grade)}
            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          >
            <option value="" disabled>Select Grade</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!province || !grade}
            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="" disabled>
              {!province || !grade ? 'Select Grade & Province first' : 'Select Subject'}
            </option>
            {availableSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!isFormValid}
        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mt-8 mb-4
          ${isFormValid 
            ? 'bg-green-700 text-white shadow-lg shadow-green-200 active:scale-95' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
      >
        Next Step <ChevronRight size={20} />
      </button>
    </Layout>
  );
};
