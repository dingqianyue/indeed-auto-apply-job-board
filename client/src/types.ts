export interface JobApplication {
  url: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'failed' | 'manual_action_required';
  title: string;
  company: string;
  location: string;
  matchScore: number;
  salary?: string;
  jobType?: string; // e.g. Full-time
  experienceLevel?: string; // e.g. Entry level
  experienceYears?: string; // e.g. 0-2 years
  postedHoursAgo?: number;
  applicantCount?: number;
  saved?: boolean;
  tags?: string[];
  benefits?: { icon: string; title: string; description: string }[];
  companyInfo?: { name: string; founded: string; size: string; website: string; description: string; location?: string };
  whyYouMatch?: { pros: string[]; cons: string[] };
  description?: string;
  responsibilities?: string[];
  qualifications?: string[];
  aboutCompany?: string;
}
