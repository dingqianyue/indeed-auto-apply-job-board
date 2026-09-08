import { motion } from 'framer-motion';

interface MatchRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MatchRing({ score, size = 'md' }: MatchRingProps) {
  // Helper to determine match score colors
  const getMatchColors = (s: number) => {
    if (s >= 80) return { text: 'text-green-600', stroke: '#16a34a' }; // Green
    if (s >= 50) return { text: 'text-yellow-600', stroke: '#ca8a04' }; // Yellow
    return { text: 'text-red-600', stroke: '#dc2626' }; // Red
  };

  const matchColors = getMatchColors(score);
  const strokeDasharray = `${score} 100`;

  let dimensions = "w-16 h-16 sm:w-20 sm:h-20"; // md default
  let textClass = "text-[10px] sm:text-xs";
  let subTextClass = "text-[8px] sm:text-[9px]";

  if (size === 'sm') {
    dimensions = "w-12 h-12";
    textClass = "text-[9px]";
    subTextClass = "text-[7px]";
  } else if (size === 'lg') {
    dimensions = "w-20 h-20 sm:w-24 sm:h-24";
    textClass = "text-xs sm:text-sm";
    subTextClass = "text-[9px] sm:text-[10px]";
  }

  return (
    <div className={`relative ${dimensions} shrink-0`}>
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <path
          className="text-gray-100"
          strokeWidth="4"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <motion.path
          initial={{ strokeDasharray: "0 100" }}
          animate={{ strokeDasharray: strokeDasharray }}
          transition={{ duration: 1, ease: "easeOut" }}
          stroke={matchColors.stroke}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`${textClass} font-bold ${matchColors.text} leading-none`}>{score}%</span>
        <span className={`${subTextClass} font-bold ${matchColors.text} uppercase tracking-tighter leading-none mt-0.5`}>Match</span>
      </div>
    </div>
  );
}
