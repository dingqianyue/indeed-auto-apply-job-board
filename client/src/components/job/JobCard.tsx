import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { JobApplication } from '../../types';

interface JobCardProps {
  job: JobApplication;
  isSelected: boolean;
  onClick: () => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, backgroundColor: isSelected ? 'rgba(238, 242, 255, 0.7)' : '#f9fafb' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`p-5 cursor-pointer border-b border-gray-100 transition-colors relative overflow-hidden ${
        isSelected ? 'bg-indigo-50/50' : 'bg-white'
      }`}
    >
      {/* Active Indicator Bar */}
      {isSelected && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <div className="flex gap-4">
        {/* Company Logo Placeholder */}
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
          <span className="text-gray-500 font-bold text-lg">{job.company.charAt(0)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="font-bold text-gray-900 truncate pr-2 text-sm md:text-base leading-tight">{job.title}</h3>
            {/* Match Score Badge */}
            <div className="bg-indigo-50 text-indigo-700 text-[10px] md:text-xs font-bold px-2 py-1 rounded-md shrink-0 flex items-center gap-1 border border-indigo-100">
              ✨ {job.matchScore}%
            </div>
          </div>

          <div className="text-xs md:text-sm text-gray-600 mb-2 truncate font-medium">
            {job.company}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </div>
            {job.salary && (
              <div className="font-medium text-gray-700 bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                {job.salary}
              </div>
            )}
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-md">
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
