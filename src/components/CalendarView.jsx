import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalendarView({ activeView = 'week', setActiveView }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#97add3');
  const [customColors, setCustomColors] = useState([]);
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const taskInputRef = useRef(null);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const navigate = useNavigate();

  const defaultColors = [
    '#97add3', // blue
    '#2e4f84', // green
    '#4576c9', // red
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsViewDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getGMT = () => {
    const offset = new Date().getTimezoneOffset();
    const sign = offset <= 0 ? '+' : '-';
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate);
    switch (activeView) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    switch (activeView) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleScheduleTask = (day, hour) => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: 'Task description',
      day,
      hour,
      duration: 1
    };
    setScheduledTasks([...scheduledTasks, newTask]);
  };

  const handleTimeSlotClick = (day, hour) => {
    setSelectedTimeSlot({ day, hour });
    setShowTaskModal(true);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const renderDatePicker = () => {
    const today = new Date();
    const currentMonth = selectedDate ? new Date(selectedDate) : new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const prevMonth = () => {
      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
      <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 z-50">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-700/50 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-700/50 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs text-gray-400 py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: startingDay }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={i}
                onClick={() => handleDateSelect(date)}
                className={`aspect-square flex items-center justify-center text-sm rounded-full hover:bg-gray-700/50
                  ${isToday ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${isSelected ? 'bg-blue-500 text-white' : ''}
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      day: selectedTimeSlot.day,
      startHour: selectedTimeSlot.hour,
      date: selectedDate || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + days.indexOf(selectedTimeSlot.day) - currentDate.getDay()),
    };
    setScheduledTasks([...scheduledTasks, newTask]);
    setShowTaskModal(false);
    setSelectedDate(null);
  };

  const handleAddCustomColor = () => {
    const newColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    setCustomColors([...customColors, newColor]);
    setSelectedColor(newColor);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (selectedTask) {
      handleEditTask({ ...selectedTask, color });
    }
  };

  const handleColorEdit = (color, index, isCustom = false) => {
    if (isCustom) {
      const newCustomColors = [...customColors];
      newCustomColors[index] = color;
      setCustomColors(newCustomColors);
    } else {
      const newDefaultColors = [...defaultColors];
      newDefaultColors[index] = color;
      setDefaultColors(newDefaultColors);
    }
    setSelectedColor(color);
    if (selectedTask) {
      handleEditTask({ ...selectedTask, color });
    }
    setEditingColorIndex(null);
  };

  const renderViewTitle = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    };

    switch (activeView) {
      case 'year':
        return currentDate.getFullYear();
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      default:
        return '';
    }
  };

  const renderCalendarGrid = () => {
    switch (activeView) {
      case 'year':
        return (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  {new Date(currentDate.getFullYear(), i, 1).toLocaleString('default', { month: 'long' })}
                </h3>
                <div className="grid grid-cols-7 gap-1">
                  {days.map(day => (
                    <div key={day} className="text-center text-sm text-gray-400">
                      {day[0]}
                    </div>
                  ))}
                  {Array.from({ length: new Date(currentDate.getFullYear(), i + 1, 0).getDate() }, (_, j) => (
                    <div
                      key={j}
                      className={`aspect-square flex items-center justify-center text-sm hover:bg-gray-600/50 rounded-lg cursor-pointer
                        ${j + 1 === new Date().getDate() && i === new Date().getMonth() ? 'bg-blue-500/20 text-blue-400' : ''}
                      `}
                    >
                      {j + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'month':
        const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
        return (
          <div className="grid grid-cols-7 gap-px bg-gray-700/50 rounded-lg overflow-hidden">
            {days.map(day => (
              <div key={day} className="bg-gray-800/50 p-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="bg-gray-800/50 aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div
                key={i}
                className={`bg-gray-800/50 aspect-square flex items-center justify-center text-sm hover:bg-gray-600/50 rounded-lg cursor-pointer
                  ${i + 1 === new Date().getDate() ? 'bg-blue-500/20 text-blue-400' : ''}
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>
        );

      case 'week':
        return (
          <div className="grid grid-cols-8 gap-px bg-gray-700/50 rounded-lg overflow-hidden">
            <div className="bg-gray-800/50">
              <div className="h-12 flex items-center justify-center text-sm font-medium">
                {getGMT()}
              </div>
              {hours.map(hour => (
                <div key={hour} className="h-16 flex items-center justify-center text-sm text-gray-400">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            {days.map((day, index) => {
              const date = new Date(currentDate);
              date.setDate(currentDate.getDate() - currentDate.getDay() + index);
              return (
                <div key={day} className="bg-gray-800/50">
                  <div className="h-12 flex flex-col items-center justify-center text-sm">
                    <div className="font-medium">{day}</div>
                    <div className="text-xs text-gray-400">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  {hours.map(hour => renderTimeSlot(day, hour))}
                </div>
              );
            })}
          </div>
        );

      case 'day':
        return (
          <div className="grid grid-cols-2 gap-px bg-gray-700/50 rounded-lg overflow-hidden">
            <div className="bg-gray-800/50">
              <div className="h-12 flex items-center justify-center text-sm font-medium">
                {getGMT()}
              </div>
              {hours.map(hour => (
                <div key={hour} className="h-16 flex items-center justify-center text-sm text-gray-400">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            <div className="bg-gray-800/50">
              <div className="h-12 flex flex-col items-center justify-center text-sm">
                <div className="font-medium">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-xs text-gray-400">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              {hours.map(hour => renderTimeSlot(days[currentDate.getDay()], hour))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const handleTaskClick = (task, e) => {
    e.stopPropagation();
    setSelectedTask(task);
    setShowTaskDetailsModal(true);
    setIsEditingTask(false);
  };

  const handleEditTask = (taskData) => {
    const updatedTasks = scheduledTasks.map(task =>
      task.id === selectedTask.id ? { ...task, ...taskData } : task
    );
    setScheduledTasks(updatedTasks);
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
    setIsEditingTask(false);
  };

  const handleDeleteTask = (task = selectedTask) => {
    if (!task) return;
    const updatedTasks = scheduledTasks.filter(t => t.id !== task.id);
    setScheduledTasks(updatedTasks);
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
    setIsEditingTask(false);
  };

  const renderTimeSlot = (day, hour) => {
    const tasks = scheduledTasks.filter(task => {
      const taskDate = new Date(task.date);
      const taskDay = days[taskDate.getDay()];
      return taskDay === day && task.startHour === hour;
    });

    return (
      <div
        key={`${day}-${hour}`}
        onClick={() => handleTimeSlotClick(day, hour)}
        className="h-16 border-t border-gray-700/50 hover:bg-gray-700/30 cursor-pointer group relative"
      >
        {tasks.map(task => (
          <div
            key={task.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
              setIsEditingTask(true);
              setShowTaskDetailsModal(true);
            }}
            className="m-1 p-2 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity group/task relative"
            style={{
              backgroundColor: task.color || 'rgba(59, 130, 246, 0.2)',
              color: task.color ? '#fff' : '#60A5FA'
            }}
          >
            <div className="font-medium">{task.title}</div>
            <div className="text-xs opacity-75">
              {task.startTime} - {task.endTime}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task);
              }}
              className="absolute top-1 right-1 opacity-0 group-hover/task:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-gray-700/50 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Add useEffect for date picker click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedTask && !isEditingTask) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          handleDeleteTask();
        } else if (e.key === 'Enter') {
          setIsEditingTask(true);
          // Focus the title input after a short delay to ensure the modal is rendered
          setTimeout(() => {
            if (taskInputRef.current) {
              taskInputRef.current.focus();
            }
          }, 100);
        } else if (e.key === 'Escape') {
          setShowTaskDetailsModal(false);
          setSelectedTask(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTask, isEditingTask]);

  return (
    <div className="flex-1 p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={handlePrevPeriod} className="p-2 hover:bg-gray-700/50 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {renderViewTitle()}
            </h2>
          </div>
          <button onClick={handleNextPeriod} className="p-2 hover:bg-gray-700/50 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/todo')}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>

        {/* View Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
            className="bg-gray-700/30 hover:bg-gray-700/50 rounded-lg px-4 py-2 flex items-center space-x-2"
          >
            <span className="text-sm font-medium">Week</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isViewDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isViewDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 w-32 z-50">
              <button
                onClick={() => setIsViewDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50"
              >
                Year
              </button>
              <button
                onClick={() => setIsViewDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50"
              >
                Month
              </button>
              <button
                onClick={() => setIsViewDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50"
              >
                Week
              </button>
              <button
                onClick={() => setIsViewDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50"
              >
                Day
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      {renderCalendarGrid()}

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[500px]">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const startTime = formData.get('startTime');
              const endTime = formData.get('endTime');

              const [startHours, startMinutes] = startTime.split(':').map(Number);
              const [endHours, endMinutes] = endTime.split(':').map(Number);
              const duration = (endHours - startHours) + (endMinutes - startMinutes) / 60;

              handleCreateTask({
                title: formData.get('title'),
                description: formData.get('description'),
                startTime,
                endTime,
                duration,
                isAllDay: formData.get('isAllDay') === 'on',
                color: selectedColor,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Name</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="relative" ref={datePickerRef}>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full bg-gray-700/50 rounded-lg px-4 py-2 text-left hover:bg-gray-700/70"
                  >
                    {(selectedDate || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + days.indexOf(selectedTimeSlot.day) - currentDate.getDay())).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </button>
                  {showDatePicker && renderDatePicker()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={`${selectedTimeSlot.hour.toString().padStart(2, '0')}:00`}
                      className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={`${(selectedTimeSlot.hour + 1).toString().padStart(2, '0')}:00`}
                      className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAllDay"
                    id="isAllDay"
                    className="rounded bg-gray-700/50 border-gray-600"
                  />
                  <label htmlFor="isAllDay" className="text-sm">All Day Event</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {defaultColors.map((color, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          onDoubleClick={() => setEditingColorIndex(index)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                        {editingColorIndex === index && (
                          <div className="absolute top-0 left-0 z-10">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => handleColorEdit(e.target.value, index)}
                              className="w-8 h-8 opacity-0 absolute cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {customColors.map((color, index) => (
                      <div key={`custom-${index}`} className="relative">
                        <button
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          onDoubleClick={() => setEditingColorIndex(`custom-${index}`)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                        {editingColorIndex === `custom-${index}` && (
                          <div className="absolute top-0 left-0 z-10">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => handleColorEdit(e.target.value, index, true)}
                              className="w-8 h-8 opacity-0 absolute cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Task</h2>
              <button
                onClick={() => {
                  setShowTaskDetailsModal(false);
                  setSelectedTask(null);
                  setIsEditingTask(false);
                }}
                className="p-2 hover:bg-gray-700/50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const startTime = formData.get('startTime');
              const endTime = formData.get('endTime');

              const [startHours, startMinutes] = startTime.split(':').map(Number);
              const [endHours, endMinutes] = endTime.split(':').map(Number);
              const duration = (endHours - startHours) + (endMinutes - startMinutes) / 60;

              handleEditTask({
                title: formData.get('title'),
                description: formData.get('description'),
                startTime,
                endTime,
                duration,
                isAllDay: formData.get('isAllDay') === 'on',
                color: selectedColor,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Name</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedTask.title}
                    className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    ref={taskInputRef}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedTask.description}
                    className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={selectedTask.startTime}
                      className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={selectedTask.endTime}
                      className="w-full bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAllDay"
                    id="isAllDay"
                    defaultChecked={selectedTask.isAllDay}
                    className="rounded bg-gray-700/50 border-gray-600"
                  />
                  <label htmlFor="isAllDay" className="text-sm">All Day Event</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {defaultColors.map((color, index) => (
                      <div key={index} className="relative">
                        <button
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          onDoubleClick={() => setEditingColorIndex(index)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                        {editingColorIndex === index && (
                          <div className="absolute top-0 left-0 z-10">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => handleColorEdit(e.target.value, index)}
                              className="w-8 h-8 opacity-0 absolute cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {customColors.map((color, index) => (
                      <div key={`custom-${index}`} className="relative">
                        <button
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          onDoubleClick={() => setEditingColorIndex(`custom-${index}`)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                        {editingColorIndex === `custom-${index}` && (
                          <div className="absolute top-0 left-0 z-10">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) => handleColorEdit(e.target.value, index, true)}
                              className="w-8 h-8 opacity-0 absolute cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(selectedTask)}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete Task
                  </button>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTaskDetailsModal(false);
                        setSelectedTask(null);
                        setIsEditingTask(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
