import type { JobApplication } from '../../types';
import { JobCard } from './JobCard';
import { LayoutList } from 'lucide-react';

interface JobListProps {
  jobs: JobApplication[];
  selectedJob: JobApplication | null;
  onSelectJob: (job: JobApplication) => void;
}

export function JobList({ jobs, selectedJob, onSelectJob }: JobListProps) {
  return (
    <div className="w-full md:w-[400px] border-r border-gray-200 bg-white flex flex-col h-full shrink-0 relative z-0">
      <div className="p-5 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm md:shadow-none">
        <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <LayoutList className="w-5 h-5 text-indigo-600 md:hidden" />
          Recommended jobs
        </h2>
        <p className="text-sm text-gray-500">Based on your profile and preferences</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No recommended jobs found.
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.url}
              job={job}
              isSelected={selectedJob?.url === job.url}
              onClick={() => onSelectJob(job)}
            />
          ))
        )}
      </div>
    </div>
  );
}
