import React from 'react';

const TimeSlot = ({ day, hour, task, onTimeSlotClick }) => {
  return (
    <div
      onClick={() => onTimeSlotClick(day, hour)}
      className={`relative group transition-all duration-200 ${
        task
          ? "bg-gradient-to-r from-blue-900 to-purple-900 rounded-sm m-0.5"
          : "hover:bg-gray-800/50 hover:rounded-sm hover:m-0.5"
      }`}
    >
      {task ? (
        <div className="absolute inset-0 flex items-center text-xs font-medium truncate px-2 text-white backdrop-blur-sm">
          {task.title}
        </div>
      ) : (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 flex items-center justify-center text-gray-500/30">
          +
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
