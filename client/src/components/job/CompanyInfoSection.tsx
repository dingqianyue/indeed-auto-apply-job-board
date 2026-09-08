import { Building2, Calendar, MapPin, Users, Globe } from 'lucide-react';
import type { JobApplication } from '../../types';

interface CompanyInfoSectionProps {
  companyInfo?: JobApplication['companyInfo'];
  companyName: string;
}

export function CompanyInfoSection({ companyInfo, companyName }: CompanyInfoSectionProps) {
  if (!companyInfo) {
    return null;
  }

  return (
    <div className="mb-10 bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Company</h3>
      <div className="flex flex-col sm:flex-row gap-5 md:gap-6 items-start">
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
           <Building2 className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{companyInfo.name || companyName}</h4>

          <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs md:text-sm text-gray-500 mb-4">
            {companyInfo.founded && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                Founded in {companyInfo.founded}
              </div>
            )}
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
              {companyInfo.location || 'Location not specified'}
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
            {companyInfo.size && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
                {companyInfo.size}
              </div>
            )}
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
            {companyInfo.website && (
              <div className="flex items-center gap-1.5 text-indigo-600 hover:underline cursor-pointer">
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {companyInfo.website}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {companyInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
}
