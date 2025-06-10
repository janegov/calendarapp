import React, { useState, useEffect, useRef } from 'react';

const TaskTrackingBox = ({ task, onComplete, onCancel, onLater }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef(null);
  const totalTime = 25 * 60; // 25 minutes in seconds

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            onComplete();
            return 0;
          }
          const newTime = prevTime - 1;
          setProgress(((totalTime - newTime) / totalTime) * 100);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, onComplete]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Here you would typically implement the actual voice recording functionality
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-300">{task?.title || 'Current Task'}</h3>
          </div>
          <div className="flex items-center mt-1">
            <svg className="w-3.5 h-3.5 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-400">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-[#6b8af5] transition-all duration-1000 ease-linear"
              strokeDasharray={150.8}
              strokeDashoffset={150.8 - (progress / 100) * 150.8}
            />
          </svg>
          <button
            onClick={toggleTimer}
            className="absolute inset-0 flex items-center justify-center text-gray-300 hover:text-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isRunning ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={onLater}
            className="px-2 py-1 bg-gray-700/50 rounded-lg hover:bg-[#6b8af5]/20 hover:text-[#6b8af5] transition-colors text-xs text-gray-300"
          >
            Later
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 bg-gray-700/50 rounded-lg hover:bg-[#6b8af5]/20 hover:text-[#6b8af5] transition-colors text-xs text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTrackingBox;
