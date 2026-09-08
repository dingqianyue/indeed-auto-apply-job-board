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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={job.url}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white h-full overflow-y-auto custom-scrollbar p-5 md:p-8 pb-24 md:pb-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="flex gap-4 md:gap-5 flex-1">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 shadow-sm cursor-pointer"
            >
               <span className="text-gray-500 font-bold text-xl md:text-2xl">{job.company.charAt(0)}</span>
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-gray-600 mb-3">
                <span className="font-medium">{job.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:inline-block"></span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> {job.location}
                </span>
              </div>
              {/* Fake Job Poster info */}
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 hover:text-gray-700 cursor-pointer transition-colors group">
                 <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                   <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Poster" className="w-full h-full object-cover" />
                 </div>
                 <span className="truncate group-hover:underline">Posted by Jane Doe, Recruiter</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 shrink-0 w-full md:w-auto mt-2 md:mt-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-start md:items-end"
            >
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold text-sm md:text-lg border border-indigo-100 shadow-sm">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />
                {job.matchScore}%
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wider mt-1 hidden md:block">AI Match Score</span>
            </motion.div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm font-medium transition-all ${
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
                className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {[
            { icon: Sparkles, color: 'text-indigo-500', label: 'Match', value: `${job.matchScore}% Match` },
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
              className="bg-gray-50/80 rounded-xl p-3 md:p-4 border border-gray-100 transition-all cursor-default"
            >
              <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-gray-500 mb-1.5 md:mb-2">
                <item.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.color}`} /> {item.label}
              </div>
              <div className="font-semibold text-gray-900 text-sm md:text-base truncate">{item.value}</div>
            </motion.div>
          ))}
        </div>

        <JobMatchSection whyYouMatch={job.whyYouMatch} />

        <div className="space-y-6 md:space-y-8 mb-10 text-gray-700 text-sm leading-relaxed">
          {job.description && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">About the role</h3>
              <p>{job.description}</p>
            </motion.div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1.5 md:space-y-2 marker:text-gray-400">
                {job.responsibilities.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Qualifications</h3>
              <ul className="list-disc pl-5 space-y-1.5 md:space-y-2 marker:text-gray-400">
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
            className="mb-10"
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Benefits</h3>
            <p className="text-sm text-gray-600 mb-4 md:mb-6">We believe happy team members create amazing work. Here's what we offer to make that happen:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {job.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-3 group">
                  <span className="text-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{benefit.icon}</span>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{benefit.title}: </span>
                    <span className="text-gray-600 text-sm">{benefit.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <CompanyInfoSection companyInfo={{...job.companyInfo, location: job.location} as any} companyName={job.company} />

        {/* Mobile Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 md:static bg-white border-t border-gray-200 md:border-gray-100 p-4 md:p-0 md:pt-8 md:pb-4 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] md:shadow-none">
           <div className="text-xs md:text-sm text-gray-500 flex flex-col md:flex-row md:items-center gap-1">
             <span className="hidden md:inline">Status:</span>
             <span className="font-bold text-gray-900 capitalize bg-gray-100 px-2 py-1 rounded-md text-xs border border-gray-200">{job.status.replace('_', ' ')}</span>
           </div>
           <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 md:bg-transparent md:hover:bg-transparent px-3 py-1.5 md:px-0 md:py-0 rounded-md"
           >
             View Original <ChevronRight className="w-4 h-4 md:hidden" /> <span className="hidden md:inline hover:translate-x-1 transition-transform">&rarr;</span>
           </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
