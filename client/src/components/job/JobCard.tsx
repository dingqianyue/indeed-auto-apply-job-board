import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { JobApplication } from '../../types';

interface JobCardProps {
  job: JobApplication;
  isSelected: boolean;
  onClick: () => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  // Helper to determine match score color
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const matchColorClass = getMatchColor(job.matchScore);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: '#f8fafc' }}
      whileTap={{ scale: 0.995 }}
      onClick={onClick}
      className={`p-5 sm:p-6 cursor-pointer transition-colors relative overflow-hidden group ${
        isSelected ? 'bg-indigo-50/30' : 'bg-white'
      }`}
    >
      <div className="flex gap-4 sm:gap-5">
        {/* Company Logo Placeholder */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
          <span className="text-gray-400 font-bold text-xl sm:text-2xl">{job.company.charAt(0)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="font-bold text-gray-900 truncate pr-4 text-base sm:text-lg leading-tight group-hover:text-indigo-700 transition-colors">{job.title}</h3>
            {/* Match Score Badge (Small version for list) */}
            <div className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 flex items-center gap-1 border ${matchColorClass}`}>
              {job.matchScore}% Match
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3 truncate font-medium">
            {job.company}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[200px]">{job.location}</span>
            </div>
            {job.salary && job.salary !== 'Not specified' && (
              <div className="font-medium text-gray-700 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs border border-green-100">
                {job.salary}
              </div>
            )}
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200/60">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
