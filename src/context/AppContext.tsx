import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudentProfile } from '../types';

interface AppContextType {
  profile: StudentProfile | null;
  setProfile: (profile: StudentProfile) => void;
  resetProfile: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const resetProfile = () => setProfile(null);

  return (
    <AppContext.Provider value={{ profile, setProfile, resetProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
