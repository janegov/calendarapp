import React from 'react';

const WeekNavigation = ({ currentDate, onPreviousWeek, onNextWeek }) => {
  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onPreviousWeek}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
          aria-label="Previous week"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
          aria-label="Next week"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-200">
          {formatMonth(currentDate)}
        </h2>
      </div>
    </div>
  );
};

export default WeekNavigation;
