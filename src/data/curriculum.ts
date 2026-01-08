import { Province, Grade } from '../types';

export const PROVINCES: Province[] = ['Sindh', 'Punjab', 'KPK', 'Balochistan', 'Federal'];

export const GRADES: Grade[] = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'
];

// Simplified curriculum mapping
export const getSubjects = (grade: Grade, province: Province): string[] => {
  const common = ['Mathematics', 'English', 'Urdu', 'Islamiyat'];
  
  const gradeNum = parseInt(grade.split(' ')[1]);
  
  if (gradeNum <= 5) {
    return [...common, 'General Science', 'Social Studies'];
  } else if (gradeNum <= 8) {
    return [...common, 'General Science', 'History', 'Geography', 'Computer Science'];
  } else {
    // Grade 9-10
    return [...common, 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Pakistan Studies'];
  }
};
