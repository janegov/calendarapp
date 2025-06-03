import React from 'react';

export default function StatisticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Productivity Score Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Productivity Score</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
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
                  className="text-green-500"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="50.24"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">80%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Distribution Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Time Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="flex-1">Work</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="flex-1">Study</span>
              <span className="font-semibold">30%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="flex-1">Exercise</span>
              <span className="font-semibold">25%</span>
            </div>
          </div>
        </div>

        {/* Task Completion Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Task Completion</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Completed</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span>In Progress</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Overdue</span>
              <span className="font-semibold text-red-400">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mt-6 bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
        <div className="h-64 flex items-end justify-between">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="flex flex-col items-center">
              <div
                className="w-12 bg-blue-500 rounded-t-lg"
                style={{ height: `${Math.random() * 100}%` }}
              ></div>
              <span className="mt-2 text-sm">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
