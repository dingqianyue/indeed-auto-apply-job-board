import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { JobList } from './components/job/JobList';
import { JobDetail } from './components/job/JobDetail';
import type { JobApplication } from './types';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('/applications.json');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load applications.json", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const handleJobSelect = (job: JobApplication) => {
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedJob(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto bg-gray-50 relative custom-scrollbar">
        <AnimatePresence mode="wait">
          {!selectedJob ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto py-8 px-4 sm:px-6 h-full flex flex-col"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-[600px]">
                <JobList
                  jobs={jobs}
                  selectedJob={selectedJob}
                  onSelectJob={handleJobSelect}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto py-8 px-4 sm:px-6"
            >
              <button
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-gray-600 font-medium text-sm hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-fit transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Recommended Jobs
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <JobDetail job={selectedJob} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
