import type { JobApplication } from '../../types';
import { JobCard } from './JobCard';
import { LayoutList } from 'lucide-react';

interface JobListProps {
  jobs: JobApplication[];
  selectedJob: JobApplication | null;
  onSelectJob: (job: JobApplication) => void;
  onToggleSave: (url: string) => void;
  title: string;
}

export function JobList({ jobs, selectedJob, onSelectJob, onToggleSave, title }: JobListProps) {
  return (
    <div className="w-full bg-white flex flex-col h-full shrink-0 relative z-0">
      <div className="p-6 border-b border-gray-100 bg-white z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2 capitalize">
          <LayoutList className="w-6 h-6 text-indigo-600 hidden md:block" />
          {title} Jobs
        </h2>
        <p className="text-sm text-gray-500">
          {title === 'recommended' ? 'Based on your profile and preferences' :
           title === 'saved' ? 'Jobs you have saved for later' :
           'Jobs you have applied to'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white divide-y divide-gray-100">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No {title.toLowerCase()} jobs found.
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.url}
              job={job}
              isSelected={selectedJob?.url === job.url}
              onClick={() => onSelectJob(job)}
              onToggleSave={(e) => {
                e.stopPropagation(); // prevent card click
                onToggleSave(job.url);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
