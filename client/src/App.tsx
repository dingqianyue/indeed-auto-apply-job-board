import { useState, useEffect } from 'react';

interface JobApplication {
  url: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'failed' | 'manual_action_required';
  title: string;
  company: string;
  location: string;
  matchScore: number;
}

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/applications.json');
      const data = await response.json();
      
      // Directly map the fields straight from applications.json
      const enrichedJobs = data.map((job: any) => ({
        url: job.url,
        status: job.status,
        title: job.title,
        company: job.company,
        location: job.location,
        matchScore: job.matchScore
      }));

      setJobs(enrichedJobs);
      if (!selectedJob && enrichedJobs.length > 0) {
        setSelectedJob(enrichedJobs[0]);
      } else if (selectedJob) {
        const current = enrichedJobs.find((j: JobApplication) => j.url === selectedJob.url);
        if (current) setSelectedJob(current);
      }
    } catch (error) {
      console.error("Failed to load applications.json", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Poll every 3 seconds to auto-sync with backend changes if running
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Submitted</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'manual_action_required':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Review Needed</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pending</span>;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">
            JA
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Jobnova AI Job Board</h1>
            <p className="text-xs text-gray-500">Live Synchronized Application Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchJobs}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer"
          >
            Sync State
          </button>
          <span className="text-sm text-gray-600">
            Queue Status: <strong className="text-gray-900">{jobs.filter(j => j.status === 'submitted').length} / {jobs.length} Submitted</strong>
          </span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Job List */}
        <aside className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-100 font-semibold text-sm text-gray-700 flex justify-between items-center">
            <span>Application Queue</span>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{jobs.length} Jobs</span>
          </div>
          <div className="divide-y divide-gray-100">
            {jobs.map((job, index) => (
              <div 
                key={index}
                onClick={() => setSelectedJob(job)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedJob?.url === job.url ? 'bg-blue-50/50 border-l-4 border-blue-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[200px]">{job.title}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <p className="text-xs text-gray-600 mb-2">{job.company}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{job.location}</span>
                  <span className="font-medium text-blue-600">{job.matchScore}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Panel: Detail View & Control Center */}
        <main className="flex-1 bg-white p-8 overflow-y-auto flex flex-col justify-between">
          {selectedJob ? (
            <div>
              <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{selectedJob.company}</span>
                    <span>{selectedJob.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{selectedJob.matchScore}%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">AI Match Score</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Automation Status</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Current State: <span className="capitalize font-semibold text-blue-600">{selectedJob.status.replace(/_/g, ' ')}</span></p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-md">Target URL: {selectedJob.url}</p>
                    </div>
                    {getStatusBadge(selectedJob.status)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Execution Commands</h3>
                  <div className="bg-gray-900 text-gray-200 p-4 rounded-lg font-mono text-xs space-y-2">
                    <p className="text-gray-400"># Run backend automation queue from root terminal:</p>
                    <p className="text-green-400">node apply.js</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-20">Select a job from the queue to view details.</div>
          )}

          {selectedJob && (
            <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
              <a 
                href={selectedJob.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Open Direct Indeed Link &rarr;
              </a>
              <button 
                onClick={() => alert("To run automation, execute `node apply.js` in your root terminal window.")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Trigger Apply Script
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
