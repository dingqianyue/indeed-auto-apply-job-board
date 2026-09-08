import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { JobList } from './components/job/JobList';
import { JobDetail } from './components/job/JobDetail';
import type { JobApplication } from './types';
import { ArrowLeft, Sparkles, Video } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'recommended' | 'applied' | 'saved'>('recommended');

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('/applications.json');
      const data = await response.json();

      // Merge with local state to preserve "saved" status across polls if we wanted to,
      // but for this take-home we just rely on updating the state directly here.
      setJobs(prevJobs => {
        if (prevJobs.length === 0) return data;

        // Preserve saved state
        return data.map((newJob: JobApplication) => {
          const existingJob = prevJobs.find(j => j.url === newJob.url);
          return {
            ...newJob,
            saved: existingJob ? existingJob.saved : newJob.saved
          };
        });
      });
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

  const handleToggleSave = (url: string) => {
    setJobs(prevJobs => prevJobs.map(job =>
      job.url === url ? { ...job, saved: !job.saved } : job
    ));

    // Update selected job if it's the one being modified
    if (selectedJob && selectedJob.url === url) {
      setSelectedJob(prev => prev ? { ...prev, saved: !prev.saved } : null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading dashboard...</div>;
  }

  // Filter jobs based on active view
  const displayedJobs = jobs.filter(job => {
    if (activeView === 'applied') {
      return job.status !== 'pending';
    }
    if (activeView === 'saved') {
      return job.saved;
    }
    return job.status === 'pending'; // recommended only shows pending jobs
  });

  return (
    <MainLayout activeView={activeView} setActiveView={(view) => { setActiveView(view); setSelectedJob(null); }}>
      <div className="flex-1 overflow-y-auto bg-gray-50 relative custom-scrollbar flex">
        <div className="flex-1 max-w-4xl mx-auto py-6 px-4 sm:px-6 w-full">
          <AnimatePresence mode="wait">
            {!selectedJob ? (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-[600px]">
                  <JobList
                    jobs={displayedJobs}
                    selectedJob={selectedJob}
                    onSelectJob={handleJobSelect}
                    onToggleSave={handleToggleSave}
                    title={activeView}
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
              >
                <button
                  onClick={handleBack}
                  className="mb-4 flex items-center gap-2 text-gray-600 font-medium text-sm hover:text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-fit transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to {activeView} Jobs
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <JobDetail job={selectedJob} onToggleSave={handleToggleSave} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Promo Panel (Visible only on large screens) */}
        <div className="hidden xl:block w-80 p-6 shrink-0 border-l border-gray-200 bg-white">
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100/50 shadow-sm sticky top-6">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-indigo-600">
               <Video className="w-6 h-6" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Ace your interviews with AI-powered Mock Sessions!</h3>
             <p className="text-sm text-gray-600 mb-6 leading-relaxed">
               Practice answering real questions from hiring managers with our advanced AI agents. Get instant feedback on your performance.
             </p>
             <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
               <Sparkles className="w-4 h-4" /> Start Mock Interview
             </button>
           </div>
        </div>
      </div>
    </MainLayout>
  );
}
