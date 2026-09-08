import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { JobList } from './components/job/JobList';
import { JobDetail } from './components/job/JobDetail';
import type { JobApplication } from './types';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('/applications.json');
      const data = await response.json();
      setJobs(data);
      
      // Use functional state updates to avoid unnecessary dependency on selectedJob
      setSelectedJob(prevSelectedJob => {
        if (!prevSelectedJob && data.length > 0) {
          return data[0];
        } else if (prevSelectedJob) {
          const current = data.find((j: JobApplication) => j.url === prevSelectedJob.url);
          return current || prevSelectedJob;
        }
        return null;
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
    setIsMobileDetailView(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <MainLayout>
      <div className="flex-1 flex overflow-hidden relative">
        {/* List View - Hidden on mobile when viewing detail */}
        <div className={`w-full md:w-auto h-full flex flex-col shrink-0 transition-transform ${isMobileDetailView ? 'hidden md:flex' : 'flex'}`}>
          <JobList
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={handleJobSelect}
          />
        </div>

        {/* Detail View - Takes full width on mobile, right pane on desktop */}
        <div className={`flex-1 bg-white overflow-hidden absolute md:relative inset-0 z-10 transition-transform transform ${isMobileDetailView ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} md:block border-l border-gray-200 shadow-[rgba(0,0,0,0.02)_0px_0px_15px]`}>

          {/* Mobile Back Button */}
          {isMobileDetailView && (
            <div className="md:hidden p-4 border-b border-gray-100 bg-white sticky top-0 z-20 flex items-center">
               <button
                onClick={() => setIsMobileDetailView(false)}
                className="flex items-center gap-2 text-gray-600 font-medium text-sm hover:text-gray-900"
               >
                 <ArrowLeft className="w-5 h-5" />
                 Back to Recommended Jobs
               </button>
            </div>
          )}

          <div className="h-full">
            {selectedJob ? (
              <JobDetail job={selectedJob} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
