import { MapPin, DollarSign, Clock, Bookmark, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import type { JobApplication } from '../../types';
import { JobMatchSection } from './JobMatchSection';
import { CompanyInfoSection } from './CompanyInfoSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface JobDetailProps {
  job: JobApplication;
}

export function JobDetail({ job }: JobDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      alert("Auto apply script triggered in backend (mocked for frontend demo).");
    }, 1500);
  };

  // Helper to determine match score colors
  const getMatchColors = (score: number) => {
    if (score >= 80) return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', stroke: '#16a34a' }; // Green
    if (score >= 50) return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', stroke: '#ca8a04' }; // Yellow
    return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', stroke: '#dc2626' }; // Red
  };

  const matchColors = getMatchColors(job.matchScore);
  const strokeDasharray = `${job.matchScore} 100`;

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
          <div className="flex gap-4 sm:gap-5 flex-1">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-sm cursor-pointer"
            >
               <span className="text-gray-400 font-bold text-2xl sm:text-3xl">{job.company.charAt(0)}</span>
            </motion.div>
            <div className="pt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-600 mb-2">
                <span className="font-medium text-gray-900">{job.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:inline-block"></span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            {/* Donut Chart Match Score */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
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
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className={`text-[10px] sm:text-xs font-bold ${matchColors.text} leading-none`}>{job.matchScore}%</span>
                  <span className={`text-[8px] sm:text-[9px] font-bold ${matchColors.text} uppercase tracking-tighter leading-none mt-0.5`}>Match</span>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-sm font-medium transition-all ${
                  isSaved ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                disabled={isApplying}
                className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
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
                 {isApplying ? 'Applying...' : 'Auto Apply'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Grid Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            { icon: Sparkles, color: matchColors.text, label: 'Match', value: `${job.matchScore}% Match` },
            { icon: DollarSign, color: 'text-green-600', label: 'Salary', value: job.salary || 'Not specified' },
            { icon: MapPin, color: 'text-red-500', label: 'Location', value: job.location },
            { icon: Clock, color: 'text-orange-500', label: 'Job Type', value: job.jobType || 'Full-time' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
              className="bg-gray-50/80 rounded-xl p-3 sm:p-4 border border-gray-100 transition-all cursor-default"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-500 mb-1.5 sm:mb-2">
                <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`} /> {item.label}
              </div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base truncate" title={item.value}>{item.value}</div>
            </motion.div>
          ))}
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

        {/* Fixed Bottom Action Bar (if needed, simplified for desktop view) */}
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
