import React from 'react';

export default function TimeTrackingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Time Tracking</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Current Session</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="125.6"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">25:00</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Start
            </button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Stop
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Time</span>
              <span className="font-semibold">2h 30m</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Completed Tasks</span>
              <span className="font-semibold">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Productivity Score</span>
              <span className="font-semibold text-green-400">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
