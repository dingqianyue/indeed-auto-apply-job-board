import { MapPin, CheckCircle2, ChevronRight, Heart } from 'lucide-react';
import type { JobApplication } from '../../types';
import { JobMatchSection } from './JobMatchSection';
import { CompanyInfoSection } from './CompanyInfoSection';
import { MatchRing } from './MatchRing';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface JobDetailProps {
  job: JobApplication;
  onToggleSave: (url: string) => void;
}

export function JobDetail({ job, onToggleSave }: JobDetailProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch('http://localhost:3001/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: job.url })
      });
      if (response.ok) {
        alert("Auto apply script started in backend terminal.");
      } else {
        const errorData = await response.json();
        alert(`Failed to start auto apply: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("Failed to trigger auto apply. Is the backend server running?");
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  // Build tags strictly ordered: [Full-time/Part-time, Years of Experience, Entry/Mid level, Salary]
  const tags = [];
  if (job.jobType) tags.push(job.jobType);
  if (job.experienceYears) tags.push(job.experienceYears);
  if (job.experienceLevel) tags.push(job.experienceLevel);
  if (job.salary && job.salary !== 'Not specified') tags.push(job.salary);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={job.url}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white h-full overflow-y-auto p-5 sm:p-8"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="flex gap-4 sm:gap-5 flex-1 min-w-0">
            <MatchRing score={job.matchScore} size="lg" />
            <div className="pt-1 min-w-0 flex-1">
              {/* Job title is slightly smaller and forced to one line with truncation */}
              <h1 className="text-xl sm:text-[22px] font-bold text-gray-900 mb-2 truncate" title={job.title}>
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="font-medium text-gray-900 truncate max-w-[200px]">{job.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:inline-block"></span>
                <span className="flex items-center gap-1.5 truncate max-w-[250px]">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {job.location}
                </span>
              </div>

              {/* Detail tags forced to one line using flex-nowrap and overflow-x-auto, hiding scrollbar */}
              <div className="flex flex-nowrap overflow-x-auto gap-2 mb-3 pb-1 no-scrollbar items-center">
                {tags.map((tag, i) => (
                  <span key={i} className="bg-gray-50 text-gray-700 text-sm font-medium px-3 py-1 rounded-md border border-gray-200 whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta info row */}
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className="whitespace-nowrap">Posted {job.postedHoursAgo} hours ago</span>
                <span>•</span>
                <span className="whitespace-nowrap">{job.applicantCount} applicants</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleSave(job.url)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-sm font-medium transition-all ${
                  job.saved ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${job.saved ? 'fill-current text-red-500' : ''}`} />
                <span className="hidden sm:inline">{job.saved ? 'Saved' : 'Save'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                disabled={isApplying || job.status !== 'pending'}
                className={`flex-[2] sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
                  job.status !== 'pending'
                    ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed'
                }`}
              >
                 {isApplying ? (
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                     className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                   />
                 ) : (
                   <CheckCircle2 className="w-4 h-4" />
                 )}
                 {job.status !== 'pending' ? 'Applied' : isApplying ? 'Applying...' : 'Auto Apply'}
              </motion.button>
            </div>
          </div>
        </div>

        <JobMatchSection whyYouMatch={job.whyYouMatch} />

        <div className="space-y-8 mb-12 text-gray-700 text-sm sm:text-base leading-relaxed">
          {job.description && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-3">About the role</h3>
              <p>{job.description}</p>
            </motion.div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                {job.responsibilities.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualifications</h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                {job.qualifications.map((qual, i) => (
                  <li key={i}>{qual}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">Benefits</h3>
            <p className="text-gray-600 mb-6">We believe happy team members create amazing work. Here's what we offer to make that happen:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {job.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{benefit.icon}</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-0.5">{benefit.title}</span>
                    <span className="text-gray-600 text-sm">{benefit.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <CompanyInfoSection companyInfo={{...job.companyInfo, location: job.location} as any} companyName={job.company} />

        {/* Fixed Bottom Action Bar */}
        <div className="border-t border-gray-100 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-sm text-gray-500 flex items-center gap-2">
             <span>Status:</span>
             <span className="font-bold text-gray-900 capitalize bg-gray-100 px-3 py-1 rounded-md border border-gray-200">{job.status.replace('_', ' ')}</span>
           </div>
           <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 hover:translate-x-1"
           >
             View Original Posting <ChevronRight className="w-4 h-4" />
           </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
