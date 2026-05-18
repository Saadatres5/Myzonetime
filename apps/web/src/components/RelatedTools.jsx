import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CalendarClock } from 'lucide-react';

export default function RelatedTools({ city, relatedCity }) {
  // Helper to format camelCase or hyphenated names for display
  const formatName = (name) => {
    if (!name) return '';
    const spaced = name.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize first letter of each word just in case
    return spaced.split(/[\s-]+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayCity = formatName(city);
  const displayRelated = formatName(relatedCity);

  return (
    <section className="mt-16 mb-8">
      <h2 className="text-2xl font-semibold mb-6 tracking-tight">More Tools for {displayCity}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={`/time-difference-calculator?from=${city}&to=${relatedCity}`}
          className="group flex flex-col p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 border border-blue-100/50 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
            <Calculator className="w-6 h-6" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">Time Difference</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
            Calculate the exact time difference and hours ahead or behind between {displayCity} and {displayRelated}.
          </p>
          <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-auto">
            Open Converter 
            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>

        <Link
          to={`/meeting-planner?cities=${city},${relatedCity}`}
          className="group flex flex-col p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 border border-indigo-100/50 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
            <CalendarClock className="w-6 h-6" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">Meeting Planner</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
            Find the perfect overlapping business hours to schedule meetings across {displayCity} and {displayRelated} timezones.
          </p>
          <div className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-auto">
            Open Planner 
            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </section>
  );
}