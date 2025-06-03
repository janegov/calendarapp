import React from 'react';

export default function TodoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">To-Do List</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Add Task
          </button>
        </div>
        <div className="space-y-3">
          {/* Sample tasks - replace with actual task data */}
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span>Complete project documentation</span>
            </div>
            <button className="text-red-400 hover:text-red-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
