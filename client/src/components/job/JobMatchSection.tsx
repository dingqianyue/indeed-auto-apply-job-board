import { Check, X } from 'lucide-react';
import type { JobApplication } from '../../types';

interface JobMatchSectionProps {
  whyYouMatch?: JobApplication['whyYouMatch'];
}

export function JobMatchSection({ whyYouMatch }: JobMatchSectionProps) {
  if (!whyYouMatch || (whyYouMatch.pros.length === 0 && whyYouMatch.cons.length === 0)) {
    return null;
  }

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Why you match</h3>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Pros */}
        <div className="flex-1 bg-green-50/50 rounded-xl p-5 border border-green-100">
          <ul className="space-y-3">
            {whyYouMatch.pros.map((pro, index) => (
              <li key={index} className="flex gap-3 text-sm text-gray-700">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        {whyYouMatch.cons.length > 0 && (
          <div className="flex-1 bg-red-50/50 rounded-xl p-5 border border-red-100">
            <ul className="space-y-3">
              {whyYouMatch.cons.map((con, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-700">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
