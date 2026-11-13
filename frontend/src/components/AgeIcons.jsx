import {
  Baby,
  Smile,
  BookOpen,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const ICON_MAP = {
  '3-5': Baby,
  '6-8': Smile,
  '9-12': BookOpen,
  '13-15': Sparkles,
  '16+': GraduationCap
};

export const AgeIcon = ({ ageId, className = 'w-7 h-7', strokeWidth = 2 }) => {
  const Icon = ICON_MAP[ageId] || BookOpen;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
};
