export type Province = 'Sindh' | 'Punjab' | 'KPK' | 'Balochistan' | 'Federal';
export type Grade = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6' | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10';

export interface StudentProfile {
  province: Province;
  grade: Grade;
  subject: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content?: string;
  image?: string;
  solution?: string;
  explanation?: string;
  timestamp: number;
}
