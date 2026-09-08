import { motion } from 'framer-motion';
import type { JobApplication } from '../../types';
import { MatchRing } from './MatchRing';
import { Heart } from 'lucide-react';

interface JobCardProps {
  job: JobApplication;
  isSelected: boolean;
  onClick: () => void;
  onToggleSave: (e: React.MouseEvent) => void;
}

export function JobCard({ job, isSelected, onClick, onToggleSave }: JobCardProps) {
  // Build tags strictly ordered: [Full-time/Part-time, Years of Experience, Entry/Mid level, Salary]
  const tags = [];
  if (job.jobType) tags.push(job.jobType);
  if (job.experienceYears) tags.push(job.experienceYears);
  if (job.experienceLevel) tags.push(job.experienceLevel);
  if (job.salary && job.salary !== 'Not specified') tags.push(job.salary);

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
      <div className="flex gap-4 sm:gap-5 items-start">
        {/* Match Ring on far left, sized 'md' to be bigger per user request */}
        <div className="pt-1">
          <MatchRing score={job.matchScore} size="md" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1.5">
            <h3 className="font-bold text-gray-900 truncate pr-4 text-base sm:text-lg leading-tight group-hover:text-indigo-700 transition-colors">
              {job.title}
            </h3>

            {/* Heart Button for saving */}
            <button
              onClick={onToggleSave}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 rounded-full hover:bg-red-50 focus:outline-none shrink-0"
            >
              <Heart className={`w-5 h-5 ${job.saved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-3 truncate font-medium">
            {job.company} • {job.location}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200/60">
                {tag}
              </span>
            ))}
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span>Posted {job.postedHoursAgo} hours ago</span>
            <span>•</span>
            <span>{job.applicantCount} applicants</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
