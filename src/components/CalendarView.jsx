import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Add Chopin font import
const chopinFont = new FontFace('Chopin', 'url(/fonts/Chopin.ttf)');
chopinFont.load().then((font) => {
  document.fonts.add(font);
});

// Add these styles at the top of your component
const timeGridStyles = {
  container: "relative flex-1 overflow-y-auto",
  timeColumn: "w-20 flex-shrink-0 border-r border-gray-700",
  timeSlot: "h-12 border-b border-gray-700/50 text-xs text-gray-400 flex items-center justify-end pr-2",
  mainGrid: "flex-1 grid grid-cols-7 gap-px bg-gray-700",
  dayColumn: "min-w-0 bg-gray-800",
  hourMarker: "absolute left-0 right-0 border-t border-gray-700/30",
  event: "absolute left-0 right-0 mx-1 rounded-md p-1 text-xs overflow-hidden shadow-sm",
  eventTitle: "font-medium truncate",
  eventTime: "text-xs opacity-75",
  eventDuration: "text-xs opacity-75 mt-0.5"
};

export default function CalendarView({ activeView = 'week', setActiveView }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledTasks, setScheduledTasks] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      description: 'Weekly team sync',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString(),
      time: '10:00',
      color: '#97add3',
      startHour: 10,
      duration: 1
    },
    {
      id: 2,
      title: 'Project Deadline',
      description: 'Submit final deliverables',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).toISOString(),
      time: '15:00',
      color: '#2e4f84',
      startHour: 15,
      duration: 2
    },
    {
      id: 3,
      title: 'Client Call',
      description: 'Discuss new requirements',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1).toISOString(),
      time: '14:00',
      color: '#4576c9',
      startHour: 14,
      duration: 1
    },
    {
      id: 4,
      title: 'Lunch with Team',
      description: 'Team building',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toISOString(),
      time: '12:00',
      color: '#97add3',
      startHour: 12,
      duration: 1
    },
    {
      id: 5,
      title: 'Code Review',
      description: 'Review new features',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3).toISOString(),
      time: '11:00',
      color: '#2e4f84',
      startHour: 11,
      duration: 2
    },
    {
      id: 6,
      title: 'Product Demo',
      description: 'Show new features to stakeholders',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5).toISOString(),
      time: '13:00',
      color: '#4576c9',
      startHour: 13,
      duration: 1
    }
  ]);
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
  const [nextUpcoming, setNextUpcoming] = useState(null);
  const [countdown, setCountdown] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskColor, setTaskColor] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    start: '',
    end: '',
    notes: '',
    color: '#3b82f6',
  });
  const [eventColors, setEventColors] = useState([
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a21caf', '#f472b6', '#facc15', '#64748b'
  ]);
  const [editingColorIdx, setEditingColorIdx] = useState(null);
  const colorInputRef = useRef();
  const [taskEndTime, setTaskEndTime] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTargetIdx, setColorPickerTargetIdx] = useState(null);
  const [colorPickerAdd, setColorPickerAdd] = useState(false);
  const [weekData, setWeekData] = useState({
    Sun: { tasks: [] },
    Mon: { tasks: [] },
    Tue: { tasks: [] },
    Wed: { tasks: [] },
    Thu: { tasks: [] },
    Fri: { tasks: [] },
    Sat: { tasks: [] }
  });
  const [cellHeight, setCellHeight] = useState(30);
  // Add state for taskDescription
  const [taskDescription, setTaskDescription] = useState('');
  // Add state for To-Do modal and its fields
  const [showToDoModal, setShowToDoModal] = useState(false);
  const [todoTitle, setToDoTitle] = useState('');
  const [todoDate, setToDoDate] = useState('');
  const [todoTime, setToDoTime] = useState('');
  const [todoNotes, setToDoNotes] = useState('');
  const [todoColor, setToDoColor] = useState('#3b82f6');

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
      date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString(),
      time: '10:00',
      color: '#97add3',
      startHour: 10,
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
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="absolute z-10 mt-1 bg-gray-800 rounded-lg shadow-lg p-2 w-64">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1 hover:bg-gray-700/50 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1 hover:bg-gray-700/50 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs text-gray-400 py-0.5">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => {
                if (day) {
                  const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  setTaskDate(selectedDate.toISOString().split('T')[0]);
                  setShowDatePicker(false);
                }
              }}
              className={`p-1 rounded-lg text-center text-sm ${
                day
                  ? 'hover:bg-gray-700/50'
                  : ''
              } ${
                day && taskDate && new Date(taskDate).getDate() === day
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}
              disabled={!day}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleQuickAction = (action) => {
    if (action === 'todo') {
      setShowToDoModal(true);
      setShowTaskModal(false);
      setShowEventModal(false);
      // Set default time and date
      const now = new Date();
      setToDoTime(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'));
      setToDoDate(now.toISOString().split('T')[0]);
    } else if (action === 'schedule') {
      setShowEventModal(true);
      setShowToDoModal(false);
      setShowTaskModal(false);
    }
  };

  const handleCreateTask = () => {
    if (!taskTitle || !taskDate || !taskTime || !taskColor) return;

    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
      end: taskEndTime || '',
      notes: taskNotes || '',
      color: taskColor,
      type: 'todo',
      day: new Date(taskDate).getDay(),
      startHour: parseInt(taskTime.split(':')[0])
    };

    // Add to scheduledTasks
    setScheduledTasks(prevTasks => [...prevTasks, newTask]);

    // Update weekData
    setWeekData(prevData => {
      const dayName = days[new Date(taskDate).getDay()];
      const newData = { ...prevData };
      if (!newData[dayName].tasks) {
        newData[dayName].tasks = [];
      }
      newData[dayName].tasks = [...newData[dayName].tasks, newTask];
      return newData;
    });

    // Reset form
    setTaskTitle('');
    setTaskDate('');
    setTaskTime('');
    setTaskEndTime('');
    setTaskNotes('');
    setTaskColor('');
    setTaskDescription('');
    setShowTaskModal(false);
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
    const getEventsForDate = (date) => {
      return scheduledTasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getDate() === date.getDate() &&
               taskDate.getMonth() === date.getMonth() &&
               taskDate.getFullYear() === date.getFullYear();
      });
    };

    if (activeView === 'month') {
      const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
      const today = new Date();
      return (
        <div className="flex flex-col items-center w-full h-full min-h-[90vh]">
          <div className="w-full flex-1 flex items-stretch justify-center p-8">
            <div className="grid grid-cols-7 gap-0.5 bg-gray-900 rounded-xl shadow border border-gray-800 w-full h-full min-h-[90vh]" style={{ minHeight: '90vh' }}>
              {/* Day headers */}
              {days.map(day => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-semibold text-gray-300 bg-gray-800/70 border-b border-gray-700/50"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {day}
                </div>
              ))}
              {/* Empty cells before first day */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="bg-gray-900 border-b border-r border-gray-700/50 min-h-[200px]" />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                const allItems = getEventsForDate(date).sort((a, b) => {
                  const timeA = a.time.split(':').map(Number);
                  const timeB = b.time.split(':').map(Number);
                  return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
                });
                const todos = allItems.filter(item => item.type === 'todo');
                const events = allItems.filter(item => item.type !== 'todo');
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={i}
                    className={`relative bg-gray-900 border-b border-r border-gray-700/50 min-h-[200px] p-4 flex flex-col rounded-none group transition-shadow ${isToday ? 'border-2 border-blue-500 bg-gray-800/80 z-10' : ''}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {/* Date number and plus button */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-base font-bold ${isToday ? 'text-blue-400' : 'text-gray-200'}`}>{i + 1}</span>
                      <button
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 text-blue-400 text-lg font-bold shadow transition-colors"
                        onClick={() => {
                          setEventForm({ title: '', description: '', date: date.toISOString().split('T')[0], start: '', end: '', color: '#3b82f6' });
                          setShowEventModal(true);
                          setShowTaskModal(false);
                          setShowToDoModal(false);
                        }}
                        title="Add event"
                        tabIndex={0}
                      >
                        +
                      </button>
                    </div>
                    {/* To-Dos */}
                    <div className="flex flex-col gap-1">
                      {todos.map((todo, idx) => (
                        <div
                          key={todo.id}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium cursor-pointer bg-gray-700/80 border border-dashed border-blue-400 text-blue-200 mb-1 hover:brightness-110 transition-all max-w-[320px]"
                          style={{ minHeight: 16 }}
                          onClick={e => { e.stopPropagation(); setSelectedTask(todo); setShowTaskDetailsModal(true); }}
                        >
                          {/* Clipboard/Task icon */}
                          <svg className="w-3.5 h-3.5 mr-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="2" rx="1" fill="currentColor" /><rect x="4" y="4" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 8h6M9 12h6M9 16h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                          <span className="truncate max-w-[140px]">{todo.title}</span>
                          <span className="ml-1 text-[10px] text-blue-300">{todo.time}</span>
                        </div>
                      ))}
                    </div>
                    {/* Events */}
                    <div className="flex flex-col gap-2 mt-2 items-start">
                      {events.map((event, idx) => {
                        const timeLabel = event.end ? `${event.time}–${event.end}` : event.time;
                        return (
                          <div
                            key={event.id}
                            className="flex items-center w-40 max-w-[180px] px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:brightness-110 transition-all"
                            style={{ background: event.color, color: '#fff', minHeight: 22 }}
                            onClick={e => { e.stopPropagation(); setSelectedTask(event); setShowTaskDetailsModal(true); }}
                          >
                            <span className="mr-2 font-bold truncate">{timeLabel}</span>
                            <span className="truncate">{event.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

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
                  {Array.from({ length: new Date(currentDate.getFullYear(), i + 1, 0).getDate() }, (_, j) => {
                    const date = new Date(currentDate.getFullYear(), i, j + 1);
                    const events = getEventsForDate(date);
                    return (
                      <div
                        key={j}
                        className={`aspect-square flex flex-col items-center justify-center text-sm hover:bg-gray-600/50 rounded-lg cursor-pointer relative
                          ${j + 1 === new Date().getDate() && i === new Date().getMonth() ? 'bg-blue-500/20 text-blue-400' : ''}
                        `}
                      >
                        <span>{j + 1}</span>
                        {events.length > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {events.map((event, index) => (
                              <div
                                key={index}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: event.color || '#97add3' }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
          <div className="grid grid-cols-12 gap-px bg-gray-700/50 rounded-lg overflow-hidden">
            <div className="bg-gray-800/50 col-span-1">
              <div className="h-12 flex items-center justify-center text-sm font-medium">
                {getGMT()}
              </div>
              {hours.map(hour => (
                <div key={hour} className="h-16 flex items-center justify-center text-sm text-gray-400">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            <div className="bg-gray-800/50 col-span-11">
              <div className="h-12 flex flex-col items-center justify-center text-sm">
                <div className="font-medium text-lg">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-sm text-gray-400">
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
    // Find all tasks for this day and hour
    const tasks = scheduledTasks.filter(task => {
      const taskDate = new Date(task.date);
      const taskDay = days[taskDate.getDay()];
      return taskDay === day && task.startHour === hour && task.type !== 'todo';
    });
    // Find all to-dos for this day and hour
    const todos = scheduledTasks.filter(task => {
      const taskDate = new Date(task.date);
      const taskDay = days[taskDate.getDay()];
      return taskDay === day && task.type === 'todo' && task.startHour === hour;
    });

    return (
      <div
        key={`${day}-${hour}`}
        className="h-16 border-t border-gray-700/50 relative group cursor-pointer"
        style={{ minHeight: 64 }}
      >
        {/* To-Do chips at the top, side by side */}
        {todos.length > 0 && (
          <div className="absolute left-1 right-1 top-1 z-20 flex flex-wrap gap-1">
            {todos.map(todo => (
              <div
                key={todo.id}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium cursor-pointer bg-gray-700/80 border border-dashed border-blue-400 text-blue-200 mb-1 hover:brightness-110 transition-all max-w-[320px]"
                style={{ minHeight: 16 }}
                onClick={e => { e.stopPropagation(); setSelectedTask(todo); setShowTaskDetailsModal(true); }}
              >
                <svg className="w-3.5 h-3.5 mr-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="2" rx="1" fill="currentColor" /><rect x="4" y="4" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 8h6M9 12h6M9 16h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                <span className="truncate max-w-[140px]">{todo.title}</span>
                <span className="ml-1 text-[10px] text-blue-300">{todo.time}</span>
              </div>
            ))}
          </div>
        )}
        {/* Highlight and centered plus on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <div className="w-full h-full bg-blue-500/10 rounded-md absolute top-0 left-0 z-0" />
          <button
            className="relative z-10 w-7 h-7 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 pointer-events-auto"
            onClick={e => {
              e.stopPropagation();
              // Prefill date and time for the modal
              const now = new Date(currentDate);
              const dayIdx = days.indexOf(day);
              now.setDate(currentDate.getDate() - currentDate.getDay() + dayIdx);
              setTaskDate(now.toISOString().split('T')[0]);
              setTaskTime(hour.toString().padStart(2, '0') + ':00');
              setShowTaskModal(true);
            }}
            title="Add task"
            tabIndex={0}
          >
            +
          </button>
        </div>
        {tasks.map(task => {
          if (task.type === 'event') {
            const [startHour, startMin] = task.time.split(':').map(Number);
            let endHour = task.end ? parseInt(task.end.split(':')[0]) : startHour + 1;
            let endMin = task.end ? parseInt(task.end.split(':')[1] || '0') : startMin;
            if (endHour < startHour || (endHour === startHour && endMin <= startMin)) {
              endHour = startHour + 1;
              endMin = startMin;
            }
            const duration = (endHour + endMin / 60) - (startHour + startMin / 60);
            const blockHeight = duration * 64; // 64px per hour slot
            const topOffset = (startMin / 60) * 64;
            return (
              <div
                key={task.id}
                className="absolute left-1 right-1 rounded-md px-2 py-1 text-xs font-medium cursor-pointer shadow-md hover:brightness-110 transition-all flex flex-col justify-start"
                style={{
                  top: topOffset,
                  height: blockHeight,
                  background: task.color,
                  color: '#fff',
                  zIndex: 10,
                  borderLeft: `4px solid ${task.color}`
                }}
                onClick={e => { e.stopPropagation(); setSelectedTask(task); setShowTaskDetailsModal(true); }}
              >
                <span className="truncate font-bold text-xs mb-1">{task.title}</span>
                <span className="text-xs">{task.time}{task.end ? `–${task.end}` : ''}</span>
              </div>
            );
          }
          // ...existing rendering for other task types (e.g., to-do)...
        })}
      </div>
    );
  };

  // Add Task Details Modal
  const renderTaskDetailsModal = () => {
    if (!selectedTask) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
          <button
            onClick={() => {
              setShowTaskDetailsModal(false);
              setSelectedTask(null);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-xl font-semibold mb-4">Task Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Task Name</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={selectedTask.description || ''}
                onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
              <input
                type="time"
                value={selectedTask.time}
                onChange={e => setSelectedTask({ ...selectedTask, time: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
              <input
                type="time"
                value={selectedTask.end || ''}
                onChange={e => setSelectedTask({ ...selectedTask, end: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {defaultColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTask({ ...selectedTask, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedTask.color === color ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => handleDeleteTask(selectedTask)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Delete Task
              </button>
              <button
                onClick={() => {
                  handleEditTask(selectedTask);
                  setShowTaskDetailsModal(false);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Save Changes
              </button>
            </div>
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

  useEffect(() => {
    if (!scheduledTasks.length) {
      setNextUpcoming(null);
      setCountdown('');
      return;
    }
    // Find the soonest upcoming event
    const now = new Date();
    const sorted = [...scheduledTasks].filter(t => t.date).sort((a, b) => new Date(a.date) - new Date(b.date));
    const next = sorted.find(t => new Date(t.date) > now);
    setNextUpcoming(next || null);
    if (!next) {
      setCountdown('');
      return;
    }
    // Countdown logic
    const updateCountdown = () => {
      const deadline = new Date(next.date);
      const diff = deadline - new Date();
      if (diff <= 0) {
        setCountdown('Overdue');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if (days > 0) setCountdown(`${days}d ${hours}h left`);
      else if (hours > 0) setCountdown(`${hours}h ${minutes}m left`);
      else if (minutes > 0) setCountdown(`${minutes}m ${seconds}s left`);
      else setCountdown(`${seconds}s left`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [scheduledTasks]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = [...chatMessages, { type: 'user', content: inputMessage }];
    setChatMessages(newMessages);
    setInputMessage('');

    // Check if we're in the To-Do task creation flow
    const lastAiMessage = chatMessages[chatMessages.length - 1]?.content;
    if (lastAiMessage?.includes('Let me know when you\'re done')) {
      // User has filled out the form
      setTimeout(() => {
        setChatMessages([
          ...newMessages,
          { type: 'ai', content: 'Great! I see you\'ve filled out the task form. Is there anything else you\'d like to do?' }
        ]);
      }, 500);
    } else {
      // Regular chat response
      setTimeout(() => {
        setChatMessages([
          ...newMessages,
          { type: 'ai', content: 'I understand. How can I help you further?' }
        ]);
      }, 500);
    }
  };

  const renderAIChatModal = () => {
    if (!showAIChat) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg w-[600px] h-[700px] flex flex-col relative">
          {/* Close Button */}
          <button
            onClick={() => setShowAIChat(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          {chatMessages.length === 0 && (
            <div className="flex justify-center items-center py-4 mt-64">
              <h2 className="text-4xl font-semibold relative">
                <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 bg-clip-text text-transparent">Your AI Assistant</span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent bg-clip-text text-transparent"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
                    maskSize: '200% 100%',
                    WebkitMaskSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >Your AI Assistant</span>
              </h2>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 pt-16 space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? message.content.toLowerCase().includes('todo') || message.content.toLowerCase().includes('task')
                        ? 'bg-blue-500/20 text-blue-400'
                        : message.content.toLowerCase().includes('schedule') || message.content.toLowerCase().includes('event')
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                      : 'bg-gray-700/50 text-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2 flex gap-4">
            <button
              onClick={() => handleQuickAction('todo')}
              className="flex-1 text-blue-400 rounded-lg p-3 flex items-center justify-center gap-2 transition-all relative overflow-hidden group hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 11l3 3L22 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add To-Do Task
            </button>
            <button
              onClick={() => handleQuickAction('event')}
              className="flex-1 text-purple-400 rounded-lg p-3 flex items-center justify-center gap-2 transition-all relative overflow-hidden group hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.2) 100%)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 14h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 18h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 18h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Schedule Event
            </button>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="text-blue-400 rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all relative overflow-hidden group hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  `;

  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);

  const shimmerStyle = document.createElement('style');
  shimmerStyle.textContent = `
    @keyframes shimmer {
      0% {
        mask-position: 200% center;
        -webkit-mask-position: 200% center;
      }
      100% {
        mask-position: -200% center;
        -webkit-mask-position: -200% center;
      }
    }
  `;
  document.head.appendChild(shimmerStyle);

  // Helper to get current time rounded to 5 min
  function getDefaultStartTime() {
    const now = new Date();
    let min = now.getMinutes();
    min = Math.ceil(min / 5) * 5;
    if (min === 60) {
      now.setHours(now.getHours() + 1);
      min = 0;
    }
    const hour = now.getHours().toString().padStart(2, '0');
    const minStr = min.toString().padStart(2, '0');
    return `${hour}:${minStr}`;
  }

  // When opening the modal, set default start time
  const openTaskModal = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setTaskTime(`${hours}:${minutes}`);
    setShowTaskModal(true);
  };

  // Custom calendar date picker component
  function CustomDatePicker({ value, onChange, onClose }) {
    const today = new Date();
    const [month, setMonth] = useState(() => value ? new Date(value) : new Date());
    const selected = value ? new Date(value) : null;
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 w-80">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="p-1 rounded hover:bg-gray-700/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-medium text-gray-200">{month.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="p-1 rounded hover:bg-gray-700/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-400 py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startingDay }, (_, i) => <div key={`empty-${i}`} className="h-8" />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selected && date.toDateString() === selected.toDateString();
            return (
              <button
                key={day}
                onClick={() => { onChange(date.toISOString().split('T')[0]); onClose(); }}
                className={`h-8 w-8 rounded-lg text-xs transition-colors
                  ${isToday ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${isSelected ? 'bg-blue-500 text-white' : ''}
                  ${!isToday && !isSelected ? 'text-gray-300 hover:bg-gray-700/50' : ''}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Update the renderTask function for Google Calendar-like appearance
  const renderTask = (task) => {
    const startTime = task.time.split(':').map(Number);
    const endTime = task.end ? task.end.split(':').map(Number) : [startTime[0] + 1, 0];

    let endMinutes = endTime[0] * 60 + endTime[1];
    let startMinutes = startTime[0] * 60 + startTime[1];

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const duration = endMinutes - startMinutes;
    const top = (startMinutes - 8 * 60) * (cellHeight / 30);
    const height = Math.max(duration * (cellHeight / 30), 20); // Minimum height of 20px

    return (
      <div
        key={task.id}
        className={`${timeGridStyles.event} transition-all duration-200 hover:shadow-md`}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          backgroundColor: task.color,
          color: '#fff',
          zIndex: 10,
          borderLeft: `4px solid ${task.color}`
        }}
      >
        <div className={timeGridStyles.eventTitle}>{task.title}</div>
        <div className={timeGridStyles.eventTime}>
          {task.time} - {task.end || `${startTime[0] + 1}:00`}
        </div>
        {duration >= 60 && (
          <div className={timeGridStyles.eventDuration}>
            {Math.floor(duration / 60)}h {duration % 60}m
          </div>
        )}
      </div>
    );
  };

  // Update the time grid rendering
  const renderTimeGrid = () => {
    return (
      <div className={timeGridStyles.container}>
        <div className="flex">
          {/* Time column */}
          <div className={timeGridStyles.timeColumn}>
            {Array.from({ length: 17 }, (_, i) => {
              const hour = i + 8;
              return (
                <div key={hour} className={timeGridStyles.timeSlot}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
              );
            })}
          </div>

          {/* Main grid */}
          <div className={timeGridStyles.mainGrid}>
            {days.map((day, dayIndex) => (
              <div key={day} className={timeGridStyles.dayColumn}>
                <div className="h-12 border-b border-gray-700/50 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-300">{day}</span>
                </div>
                <div className="relative" style={{ height: `${17 * cellHeight}px` }}>
                  {/* Hour markers */}
                  {Array.from({ length: 17 }, (_, i) => (
                    <div
                      key={i}
                      className={timeGridStyles.hourMarker}
                      style={{ top: `${i * cellHeight}px` }}
                    />
                  ))}

                  {/* Tasks for this day */}
                  {weekData[day]?.tasks?.map(task => renderTask(task))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      <div className={`${showAIChat ? 'pointer-events-none filter blur-md transition-all duration-300' : 'transition-all duration-300'}`}>
        <div className={showTaskModal ? 'pointer-events-none filter blur-md transition-all duration-300' : 'transition-all duration-300'}>
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-2 py-2 mt-2">
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
            <div className="relative mr-4" ref={dropdownRef}>
              <button
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="bg-gray-700/30 hover:bg-gray-700/50 rounded-lg px-4 py-2 flex items-center space-x-2"
              >
                <span className="text-sm font-medium">
                  {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                </span>
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
                    onClick={() => { setActiveView('year'); setIsViewDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 ${activeView === 'year' ? 'bg-gray-700/70 font-bold' : ''}`}
                  >
                    Year
                  </button>
                  <button
                    onClick={() => { setActiveView('month'); setIsViewDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 ${activeView === 'month' ? 'bg-gray-700/70 font-bold' : ''}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => { setActiveView('week'); setIsViewDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 ${activeView === 'week' ? 'bg-gray-700/70 font-bold' : ''}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => { setActiveView('day'); setIsViewDropdownOpen(false); }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700/50 ${activeView === 'day' ? 'bg-gray-700/70 font-bold' : ''}`}
                  >
                    Day
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Grid */}
          {renderCalendarGrid()}
        </div>
      </div>

      {/* AI Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <style>
          {`
          .magic-button {
            position: relative;
            overflow: hidden;
            background: linear-gradient(90deg, #1f2937 0%, #374151 100%);
            transition: background 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }

          .magic-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 25%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(69, 118, 201, 0.2), transparent);
            transform: skewX(-20deg);
            transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 0;
          }

          .magic-button:hover {
            background: linear-gradient(90deg, #374151 0%, #4b5563 100%);
            box-shadow: 0 0 15px rgba(69, 118, 201, 0.4), 0 0 30px rgba(69, 118, 201, 0.2);
          }

          .magic-button:hover::before {
            left: 100%;
          }

          .magic-button-content {
            position: relative;
            z-index: 1;
            transition: text-shadow 0.3s ease;
          }

          .magic-button-content span {
            font-family: 'Chopin', sans-serif;
            font-size: 1.1rem;
            letter-spacing: 0.5px;
          }

          .magic-button:hover .magic-button-content {
            text-shadow: 0 0 8px rgba(69, 118, 201, 0.6), 0 0 15px rgba(69, 118, 201, 0.3);
          }

          .star-container {
            position: relative;
            display: flex;
            align-items: center;
            height: 24px;
          }

          .star {
            position: absolute;
            animation: twinkle 2s infinite;
            color: #60A5FA;
          }

          .star:nth-child(1) {
            width: 4px;
            height: 4px;
            top: 2px;
            left: 0;
            animation-delay: 0s;
          }

          .star:nth-child(2) {
            width: 5px;
            height: 5px;
            top: 14px;
            left: 10px;
            animation-delay: 0.4s;
          }

          .star:nth-child(3) {
            width: 3px;
            height: 3px;
            top: 5px;
            left: 20px;
            animation-delay: 0.8s;
          }

          .star:nth-child(4) {
            width: 4px;
            height: 4px;
            top: 16px;
            left: 30px;
            animation-delay: 1.2s;
          }

          .star:nth-child(5) {
            width: 3px;
            height: 3px;
            top: 7px;
            left: 40px;
            animation-delay: 1.6s;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          `}
        </style>
        <button
          onClick={() => setShowAIChat(true)}
          className="magic-button h-12 px-6 rounded-full flex items-center justify-center text-white"
          aria-label="Chat with AI"
        >
          <span className="magic-button-content flex items-center space-x-2">
            <span className="star-container">
              <svg className="star" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
              </svg>
              <svg className="star" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
              </svg>
              <svg className="star" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
              </svg>
              <svg className="star" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
              </svg>
              <svg className="star" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" />
              </svg>
            </span>
            <span className="text-sm font-medium">AI Chat</span>
          </span>
        </button>
      </div>

      {/* Add AI Chat Modal */}
      {renderAIChatModal()}

      {/* Task Details Modal */}
      {showTaskDetailsModal && renderTaskDetailsModal()}

      {/* Task/Event Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <form onSubmit={e => {
              e.preventDefault();
              handleCreateTask();
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Add description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <button
                  type="button"
                  onClick={() => setShowCustomDatePicker(true)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {taskDate || 'Select date'}
                </button>
                {showCustomDatePicker && (
                  <div className="absolute z-50 mt-2 left-0 right-0 flex justify-center">
                    <CustomDatePicker
                      value={taskDate}
                      onChange={date => setTaskDate(date)}
                      onClose={() => setShowCustomDatePicker(false)}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={e => setTaskTime(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={taskEndTime || ''}
                    onChange={e => setTaskEndTime(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes for AI</label>
                <textarea
                  value={taskNotes || ''}
                  onChange={e => setTaskNotes(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Add notes for AI..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  {defaultColors.map((color, idx) => (
                    <button
                      key={color + idx}
                      type="button"
                      onClick={() => setTaskColor(color)}
                      onDoubleClick={() => {
                        setColorPickerTargetIdx(idx);
                        setShowColorPicker(true);
                        setColorPickerAdd(false);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${taskColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setColorPickerAdd(true);
                      setShowColorPicker(true);
                    }}
                    className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 hover:bg-gray-700 ml-2"
                    title="Add color"
                  >
                    +
                  </button>
                  {showColorPicker && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-gray-800 rounded-lg p-4">
                        <input
                          type="color"
                          autoFocus
                          onChange={e => {
                            if (colorPickerAdd) {
                              setDefaultColors([...defaultColors, e.target.value]);
                              setTaskColor(e.target.value);
                            } else if (colorPickerTargetIdx !== null) {
                              const newColors = [...defaultColors];
                              newColors[colorPickerTargetIdx] = e.target.value;
                              setDefaultColors(newColors);
                              setTaskColor(e.target.value);
                            }
                            setShowColorPicker(false);
                            setColorPickerTargetIdx(null);
                            setColorPickerAdd(false);
                          }}
                          onBlur={() => {
                            setShowColorPicker(false);
                            setColorPickerTargetIdx(null);
                            setColorPickerAdd(false);
                          }}
                          className="w-64 h-64"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
            <form onSubmit={e => {
              e.preventDefault();
              const newEvent = {
                id: Date.now(),
                title: eventForm.title,
                description: eventForm.description || '',
                date: eventForm.date,
                time: eventForm.start,
                end: eventForm.end,
                color: eventForm.color,
                type: 'event',
                startHour: eventForm.start ? parseInt(eventForm.start.split(':')[0]) : 0,
              };
              setScheduledTasks(prev => [...prev, newEvent]);
              setShowEventModal(false);
              setEventForm({ title: '', description: '', date: '', start: '', end: '', color: '#3b82f6' });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={eventForm.description || ''}
                  onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Add description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventForm.start}
                    onChange={e => setEventForm(f => ({ ...f, start: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventForm.end}
                    onChange={e => setEventForm(f => ({ ...f, end: e.target.value }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <input
                  type="color"
                  value={eventForm.color}
                  onChange={e => setEventForm(f => ({ ...f, color: e.target.value }))}
                  className="w-10 h-10 p-0 border-0 bg-transparent"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showToDoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowToDoModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New To-Do Task</h2>
            <form onSubmit={e => {
              e.preventDefault();
              // Add to scheduledTasks as a todo
              setScheduledTasks(prev => [
                ...prev,
                {
                  id: Date.now(),
                  title: todoTitle,
                  date: todoDate,
                  time: todoTime,
                  notes: todoNotes,
                  color: todoColor,
                  type: 'todo',
                  startHour: parseInt(todoTime.split(':')[0])
                }
              ]);
              setShowToDoModal(false);
              setToDoTitle('');
              setToDoDate('');
              setToDoTime('');
              setToDoNotes('');
              setToDoColor('#3b82f6');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={todoTitle}
                  onChange={e => setToDoTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter to-do title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={todoDate}
                  onChange={e => setToDoDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={todoTime}
                    onChange={e => setToDoTime(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  value={todoNotes}
                  onChange={e => setToDoNotes(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Add notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                <input
                  type="color"
                  value={todoColor}
                  onChange={e => setToDoColor(e.target.value)}
                  className="w-10 h-10 p-0 border-0 bg-transparent"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  Create To-Do
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
