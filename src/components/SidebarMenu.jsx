import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TaskTrackingBox from './TaskTrackingBox';

export default function SidebarMenu({ isOpen }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTask, setActiveTask] = useState({
    title: "Sample Task",
    date: new Date()
  });
  const location = useLocation();

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setActiveTask({
      title: "New Task",
      date: newDate.toISOString().split('T')[0]
    });
  };

  const handleTaskComplete = () => {
    setActiveTask(null);
  };

  const handleTaskCancel = () => {
    setActiveTask(null);
  };

  const handleTaskLater = () => {
    setActiveTask(null);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() &&
           currentDate.getMonth() === selectedDate.getMonth() &&
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700/50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 space-y-4">
        {/* Calendar Section */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{getMonthName(currentDate)}</h2>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-600/50 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={handleNextMonth} className="p-1 hover:bg-gray-600/50 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center caption text-gray-400">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square flex items-center justify-center text-sm hover:bg-gray-600/50 rounded-lg cursor-pointer
                  ${isToday(day) ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${isSelected(day) ? 'bg-purple-500/20 text-purple-400' : ''}
                `}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Task Tracking Box */}
        <TaskTrackingBox
          task={activeTask}
          onComplete={handleTaskComplete}
          onCancel={handleTaskCancel}
          onLater={handleTaskLater}
        />

        {/* Time Tracking Box */}
        <Link
          to="/time-tracking"
          className={`w-full bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3 transition-colors ${
            isActive('/time-tracking') ? 'bg-gray-700/50' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-medium text-sm">Time Tracking</h3>
            <p className="text-xs text-gray-400">Track your productivity</p>
          </div>
        </Link>

        {/* Other Navigation Sections */}
        <div className="space-y-2">
          <Link
            to="/todo"
            className={`w-full bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3 transition-colors ${
              isActive('/todo') ? 'bg-gray-700/50' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-sm">To-Do</h3>
              <p className="text-xs text-gray-400">Manage your tasks</p>
            </div>
          </Link>

          <Link
            to="/ai-assistant"
            className={`w-full bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3 transition-colors ${
              isActive('/ai-assistant') ? 'bg-gray-700/50' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-sm">AI Assistant</h3>
              <p className="text-xs text-gray-400">Get smart suggestions</p>
            </div>
          </Link>

          <Link
            to="/statistics"
            className={`w-full bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 flex items-center space-x-3 transition-colors ${
              isActive('/statistics') ? 'bg-gray-700/50' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-sm">Statistics</h3>
              <p className="text-xs text-gray-400">View your progress</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
