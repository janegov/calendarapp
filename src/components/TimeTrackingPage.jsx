import React, { useState, useRef, useEffect } from 'react';

const VIEW_LABELS = { day: 'Day', week: 'Week', month: 'Month' };
const VIEW_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

// Helper to convert label to seconds (e.g., '1:30' => 5400, '50m' => 3000, '25m' => 1500)
function labelToSeconds(label) {
  if (!label) return 0;

  // Handle HH:MM format
  if (label.includes(':')) {
    const [h, m] = label.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 3600 + m * 60;
  }

  // Handle hours format (e.g., '2h')
  if (label.endsWith('h')) {
    const hours = parseFloat(label.slice(0, -1));
    if (isNaN(hours)) return 0;
    return Math.round(hours * 3600);
  }

  // Handle minutes format (e.g., '30m', '30min')
  if (label.endsWith('m') || label.endsWith('min')) {
    const minutes = parseFloat(label.replace(/[^0-9.]/g, ''));
    if (isNaN(minutes)) return 0;
    return Math.round(minutes * 60);
  }

  // Handle plain number (assume minutes)
  const minutes = parseFloat(label);
  if (isNaN(minutes)) return 0;
  return Math.round(minutes * 60);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const today = new Date();
function pad(n) { return n.toString().padStart(2, '0'); }
function dateStr(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }

const initialSections = [
  {
    name: 'Work',
    tasks: [
      { name: 'Emails', label: '30m', date: dateStr(today) },
      { name: 'Meeting', label: '1:00', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)) },
      { name: 'Coding', label: '1:30', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)) },
      { name: 'Review', label: '2h', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)) },
      { name: 'Presentation', label: '1h', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)) },
      { name: 'Report', label: '40m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)) },
      { name: 'Planning', label: '1:15', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)) },
      { name: 'Client Call', label: '35m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)) },
      { name: 'Design', label: '55m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)) },
      { name: 'Documentation', label: '1:05', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)) },
    ],
  },
  {
    name: 'Study',
    tasks: [
      { name: 'Math', label: '45m', date: dateStr(today) },
      { name: 'Physics', label: '1:00', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)) },
      { name: 'History', label: '1:10', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)) },
      { name: 'Biology', label: '30m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)) },
      { name: 'Chemistry', label: '50m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4)) },
      { name: 'Literature', label: '1:20', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)) },
      { name: 'Programming', label: '1:00', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)) },
      { name: 'Art', label: '40m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)) },
      { name: 'Geography', label: '35m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8)) },
      { name: 'Philosophy', label: '55m', date: dateStr(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9)) },
    ],
  },
];

function CircularTask({ label, progress, isRunning, remaining, onClick }) {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center cursor-pointer select-none" onClick={onClick}>
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="absolute top-0 left-0">
          <circle
            stroke="#e5e7eb"
            fill="none"
            strokeWidth={stroke}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
          />
          <circle
            stroke="#4576c9"
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <span className="absolute left-0 top-0 w-20 h-20 flex items-center justify-center">
          {isRunning || remaining !== undefined ? (
            <span className="text-base font-semibold flex items-center justify-center w-full h-full -translate-x-1 -translate-y-1">{formatTime(remaining)}</span>
          ) : (
            <span className="text-base font-semibold flex items-center justify-center w-full h-full -translate-x-1 -translate-y-1">{label}</span>
          )}
        </span>
      </div>
    </div>
  );
}

export default function TimeTrackingPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // State: sections with timer state for each task
  const [sections, setSections] = useState(() => {
    // Add timer state to each task
    return initialSections.map(section => ({
      ...section,
      tasks: section.tasks.map(task => {
        const total = labelToSeconds(task.label);
        return {
          ...task,
          total,
          remaining: total,
          isRunning: false,
          progress: 0,
        };
      })
    }));
  });
  const timersRef = useRef([]);
  const [view, setView] = useState('week');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTask, setNewTask] = useState({
    section: '',
    title: '',
    duration: '',
    date: '',
  });
  const [newSectionName, setNewSectionName] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    if (newTask.date) {
      const d = new Date(newTask.date);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date();
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [taskAction, setTaskAction] = useState(null); // {sectionIdx, taskIdx}
  const [showActionModal, setShowActionModal] = useState(false);
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [addTimeValue, setAddTimeValue] = useState(15); // minutes
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Helpers for period navigation
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  function addWeeks(date, weeks) {
    return addDays(date, weeks * 7);
  }
  function addMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }
  function getWeekRange(date) {
    const d = new Date(date);
    const day = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  }
  function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function formatMonth(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
  function formatWeekRange([start, end]) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  // Filter tasks for real date logic
  let filteredSections = sections;
  if (view === 'day') {
    const dayStr = dateStr(currentDate);
    filteredSections = sections.map(section => ({
      ...section,
      tasks: section.tasks.filter(task => task.date === dayStr)
    }));
  } else if (view === 'week') {
    const [start, end] = getWeekRange(currentDate);
    filteredSections = sections.map(section => ({
      ...section,
      tasks: section.tasks.filter(task => {
        const d = new Date(task.date);
        return d >= start && d <= end;
      })
    }));
  } else if (view === 'month') {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    filteredSections = sections.map(section => ({
      ...section,
      tasks: section.tasks.filter(task => {
        const d = new Date(task.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
    }));
  }

  // Timer effect for all running tasks
  useEffect(() => {
    // Clear all intervals first
    timersRef.current.forEach(timer => clearInterval(timer));
    timersRef.current = [];
    sections.forEach((section, sectionIdx) => {
      section.tasks.forEach((task, taskIdx) => {
        if (task.isRunning && task.remaining > 0) {
          timersRef.current.push(setInterval(() => {
            setSections(prevSections => {
              const newSections = prevSections.map((s, si) => ({
                ...s,
                tasks: s.tasks.map((t, ti) => {
                  if (si === sectionIdx && ti === taskIdx) {
                    if (!t.isRunning || t.remaining <= 0) return t;
                    const newRemaining = t.remaining - 1;
                    return {
                      ...t,
                      remaining: newRemaining,
                      progress: t.total > 0 ? (t.total - newRemaining) / t.total : 0,
                      isRunning: newRemaining > 0 ? true : false,
                    };
                  }
                  return t;
                })
              }));
              return newSections;
            });
          }, 1000));
        }
      });
    });
    return () => timersRef.current.forEach(timer => clearInterval(timer));
  }, [sections]);

  // Handle click on a circle
  const handleCircleClick = (sectionIdx, taskIdx) => {
    setSections(prevSections => prevSections.map((section, si) => ({
      ...section,
      tasks: section.tasks.map((task, ti) => {
        if (si === sectionIdx && ti === taskIdx) {
          // Toggle running state
          if (task.isRunning) {
            return { ...task, isRunning: false };
          } else if (task.remaining > 0) {
            return { ...task, isRunning: true };
          }
        }
        return task;
      })
    })));
  };

  // Add new task handler
  function handleAddTask(e) {
    e.preventDefault();
    setErrorMsg('');
    if (!newTask.section || !newTask.title || !newTask.duration || !newTask.date) return;
    let label = newTask.duration;
    if (/^\d+$/.test(label)) label = label + 'm';
    const seconds = labelToSeconds(label);
    if (seconds === 0) {
      setErrorMsg('Duration must be greater than 0.');
      return;
    }
    if (editMode && taskAction) {
      // Edit existing task
      setSections(prevSections => prevSections.map((section, si) => ({
        ...section,
        tasks: section.tasks.map((task, ti) => {
          if (si === taskAction.sectionIdx && ti === taskAction.taskIdx) {
            return {
              ...task,
              name: newTask.title,
              label,
              date: newTask.date,
              total: seconds,
              remaining: seconds,
            };
          }
          return task;
        })
      })));
      setEditMode(false);
      setTaskAction(null);
    } else {
      // Add new task
      setSections(prevSections => prevSections.map(section =>
        section.name === newTask.section
          ? {
              ...section,
              tasks: [
                ...section.tasks,
                {
                  name: newTask.title,
                  label,
                  date: newTask.date,
                  total: seconds,
                  remaining: seconds,
                  isRunning: false,
                  progress: 0,
                },
              ],
            }
          : section
      ));
    }
    setShowModal(false);
    setModalStep(1);
    setNewTask({ section: '', title: '', duration: '', date: '' });
    setErrorMsg('');
  }

  // Add new section handler
  function handleAddSection(e) {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    setSections(prevSections => [
      ...prevSections,
      {
        name: newSectionName.trim(),
        tasks: [],
      },
    ]);
    setShowModal(false);
    setModalStep(0);
    setNewSectionName('');
  }

  // Section colors for modal step 1
  const sectionColors = [
    'bg-blue-500/60',
    'bg-purple-500/60',
    'bg-green-500/60',
    'bg-pink-500/60',
    'bg-yellow-500/60',
  ];

  // Custom calendar popover for modal
  function CalendarPopover({ value, onChange, onClose }) {
    const today = new Date();
    const selected = value ? new Date(value) : null;
    const month = calendarMonth;
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function prevMonth() {
      setCalendarMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
    }
    function nextMonth() {
      setCalendarMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
    }

    return (
      <div className="absolute z-50 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 w-72">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-700/50 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium">
            {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-700/50 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-400 py-1">{day}</div>
          ))}
          {Array.from({ length: startingDay }, (_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(month.getFullYear(), month.getMonth(), i + 1);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selected && date.toDateString() === selected.toDateString();
            return (
              <button
                key={i}
                onClick={() => { onChange(dateStr(date)); onClose(); }}
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
  }

  // Task action modal logic
  function handleTaskNameClick(sectionIdx, taskIdx) {
    setTaskAction({ sectionIdx, taskIdx });
    setShowActionModal(true);
  }
  function handleAddTimeToTask() {
    setShowActionModal(false);
    setShowAddTimeModal(true);
    setAddTimeValue(15);
  }
  function handleConfirmAddTime() {
    if (!taskAction) return;
    setSections(prevSections => prevSections.map((section, si) => ({
      ...section,
      tasks: section.tasks.map((task, ti) => {
        if (si === taskAction.sectionIdx && ti === taskAction.taskIdx) {
          const addSeconds = addTimeValue * 60;
          return {
            ...task,
            total: task.total + addSeconds,
            remaining: task.remaining + addSeconds,
          };
        }
        return task;
      })
    })));
    setShowAddTimeModal(false);
    setTaskAction(null);
  }
  function handleDeleteTask() {
    if (!taskAction) return;
    setSections(prevSections => prevSections.map((section, si) => ({
      ...section,
      tasks: section.tasks.filter((_, ti) => !(si === taskAction.sectionIdx && ti === taskAction.taskIdx))
    })));
    setShowDeleteConfirm(false);
    setShowActionModal(false);
    setTaskAction(null);
  }
  function handleEditTask() {
    if (!taskAction) return;
    const task = sections[taskAction.sectionIdx].tasks[taskAction.taskIdx];
    setNewTask({
      section: sections[taskAction.sectionIdx].name,
      title: task.name,
      duration: task.label,
      date: task.date,
    });
    setShowModal(true);
    setEditMode(true);
    setModalStep(1);
    setShowActionModal(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <main className="p-8 relative">
        {/* Top Bar: Period Picker (left) and View Selector (right) */}
        <div className="flex justify-between items-center mb-4">
          {/* Period Picker */}
          <div className="flex items-center space-x-2">
            {view === 'day' && (
              <>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  onClick={() => setCurrentDate(addDays(currentDate, -1))}
                >
                  <span>&lt;</span>
                </button>
                <span className="text-base font-medium px-3 py-1 bg-gray-800 rounded">
                  {formatDate(currentDate)}
                </span>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  onClick={() => setCurrentDate(addDays(currentDate, 1))}
                >
                  <span>&gt;</span>
                </button>
              </>
            )}
            {view === 'week' && (
              <>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
                >
                  <span>&lt;</span>
                </button>
                <span className="text-base font-medium px-3 py-1 bg-gray-800 rounded">
                  {formatWeekRange(getWeekRange(currentDate))}
                </span>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                >
                  <span>&gt;</span>
                </button>
              </>
            )}
            {view === 'month' && (
              <>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  onClick={() => setCurrentDate(addMonths(currentDate, -1))}
                >
                  <span>&lt;</span>
                </button>
                <span className="text-base font-medium px-3 py-1 bg-gray-800 rounded">
                  {formatMonth(currentDate)}
                </span>
                <button
                  className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <span>&gt;</span>
                </button>
              </>
            )}
          </div>
          {/* View Selector */}
          <div className="relative">
            <button
              className="text-base px-5 py-2 border border-gray-600 rounded bg-gray-900 hover:bg-gray-700 transition-colors"
              onClick={() => setShowDropdown(v => !v)}
            >
              {VIEW_LABELS[view]}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow z-10">
                {VIEW_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`block w-full text-left px-5 py-2 text-base hover:bg-gray-700/50 ${view === opt.value ? 'bg-gray-700/30' : ''}`}
                    onClick={() => { setView(opt.value); setShowDropdown(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {view === 'day'
            ? filteredSections.map((section, sectionIdx) => (
                <div
                  key={section.name}
                  className="bg-gray-800 p-6 rounded-xl shadow mb-1"
                >
                  <h2 className="text-xl font-semibold mb-6">{section.name}</h2>
                  <div className="flex space-x-8 mt-2">
                    {section.tasks.slice(0, 2).map((task, taskIdx) => (
                      <div key={taskIdx} className="relative w-20 h-28 flex flex-col items-center justify-start">
                        <CircularTask
                          label={task.label}
                          progress={task.progress}
                          isRunning={task.isRunning}
                          remaining={task.remaining}
                          onClick={() => handleCircleClick(sectionIdx, taskIdx)}
                        />
                        <span
                          className="mt-2 text-sm text-gray-200 text-center w-full whitespace-nowrap overflow-x-auto -translate-x-1 block cursor-pointer hover:underline"
                          onClick={() => handleTaskNameClick(sectionIdx, taskIdx)}
                        >
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : view === 'week'
            ? filteredSections.map((section, sectionIdx) => (
                <div
                  key={section.name}
                  className="bg-gray-800 p-6 rounded-xl shadow mb-1"
                >
                  <h2 className="text-xl font-semibold mb-6">{section.name}</h2>
                  <div className="flex flex-wrap gap-8 mt-2">
                    {section.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="relative w-20 h-28 flex flex-col items-center justify-start">
                        <CircularTask
                          label={task.label}
                          progress={task.progress}
                          isRunning={task.isRunning}
                          remaining={task.remaining}
                          onClick={() => handleCircleClick(sectionIdx, taskIdx)}
                        />
                        <span
                          className="mt-2 text-sm text-gray-200 text-center w-full whitespace-nowrap overflow-x-auto -translate-x-1 block cursor-pointer hover:underline"
                          onClick={() => handleTaskNameClick(sectionIdx, taskIdx)}
                        >
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : filteredSections.map((section, sectionIdx) => (
                <div
                  key={section.name}
                  className="bg-gray-800 p-6 rounded-xl shadow mb-1"
                >
                  <h2 className="text-xl font-semibold mb-6">{section.name}</h2>
                  <div className="flex flex-wrap gap-8 mt-2">
                    {section.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="relative w-20 h-28 flex flex-col items-center justify-start">
                        <CircularTask
                          label={task.label}
                          progress={task.progress}
                          isRunning={task.isRunning}
                          remaining={task.remaining}
                          onClick={() => handleCircleClick(sectionIdx, taskIdx)}
                        />
                        <span
                          className="mt-2 text-sm text-gray-200 text-center w-full whitespace-nowrap overflow-x-auto -translate-x-1 block cursor-pointer hover:underline"
                          onClick={() => handleTaskNameClick(sectionIdx, taskIdx)}
                        >
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>

        {/* Add Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md mx-auto flex flex-col gap-4 shadow-lg">
              {errorMsg && <div className="text-red-400 text-sm mb-2">{errorMsg}</div>}
              {modalStep === 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">What do you want to add?</h2>
                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      className="w-full py-4 rounded-lg text-lg font-semibold bg-blue-500/60 hover:scale-105 transition-all duration-150"
                      onClick={() => setModalStep(1)}
                    >
                      Task
                    </button>
                    <button
                      type="button"
                      className="w-full py-4 rounded-lg text-lg font-semibold bg-green-500/60 hover:scale-105 transition-all duration-150"
                      onClick={() => setModalStep(3)}
                    >
                      Section
                    </button>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => { setShowModal(false); setModalStep(0); setNewTask({ section: '', title: '', duration: '', date: '' }); setNewSectionName(''); }}>Cancel</button>
                  </div>
                </>
              )}
              {modalStep === 1 && (
                <>
                  <h2 className="text-xl font-semibold mb-4">Choose Section</h2>
                  <div className="flex flex-col gap-4">
                    {sections.map((s, idx) => (
                      <button
                        key={s.name}
                        type="button"
                        className={`w-full py-4 rounded-lg text-lg font-semibold border-2 transition-all duration-150 ${sectionColors[idx % sectionColors.length]} ${newTask.section === s.name ? 'border-white scale-105' : 'border-transparent'} hover:scale-105`}
                        onClick={() => setNewTask(t => ({ ...t, section: s.name }))}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => { setShowModal(false); setModalStep(0); setNewTask({ section: '', title: '', duration: '', date: '' }); }}>Cancel</button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 ${!newTask.section ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!newTask.section}
                      onClick={() => setModalStep(2)}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {modalStep === 2 && (
                <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
                  <div className="text-sm mb-2">Section: <span className="font-bold">{newTask.section}</span></div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    className="bg-gray-700 rounded px-3 py-2 mb-2"
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
                    required
                    placeholder="Task title"
                  />
                  <label className="text-sm font-medium">Duration (minutes or hh:mm)</label>
                  <input
                    className="bg-gray-700 rounded px-3 py-2 mb-2"
                    type="text"
                    value={newTask.duration}
                    onChange={e => setNewTask(t => ({ ...t, duration: e.target.value }))}
                    required
                    placeholder="e.g. 45 or 1:30"
                  />
                  <label className="text-sm font-medium">Date</label>
                  <div className="relative mb-2">
                    <button
                      type="button"
                      className="w-full bg-gray-700 rounded px-3 py-2 text-left hover:bg-gray-700/70"
                      onClick={() => setShowDatePicker(v => !v)}
                    >
                      {newTask.date
                        ? new Date(newTask.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'Choose date'}
                    </button>
                    {showDatePicker && (
                      <CalendarPopover
                        value={newTask.date}
                        onChange={date => setNewTask(t => ({ ...t, date }))}
                        onClose={() => setShowDatePicker(false)}
                      />
                    )}
                  </div>
                  <div className="flex justify-between gap-2 mt-4">
                    <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => setModalStep(1)}>Back</button>
                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Add Task</button>
                  </div>
                </form>
              )}
              {modalStep === 3 && (
                <form onSubmit={handleAddSection} className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold mb-2">Add New Section</h2>
                  <label className="text-sm font-medium">Section Name</label>
                  <input
                    className="bg-gray-700 rounded px-3 py-2 mb-2"
                    type="text"
                    value={newSectionName}
                    onChange={e => setNewSectionName(e.target.value)}
                    required
                    placeholder="Section name"
                  />
                  <div className="flex justify-between gap-2 mt-4">
                    <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => setModalStep(0)}>Back</button>
                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">Add Section</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        <button
          className="fixed bottom-2 right-2 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg"
          onClick={() => setShowModal(true)}
        >
          <span className="text-4xl leading-none flex items-center justify-center w-full h-full">+</span>
        </button>

        {/* Task Action Modal */}
        {showActionModal && taskAction && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-xs mx-auto flex flex-col gap-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Task Options</h2>
              <button className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700" onClick={handleAddTimeToTask}>Add Time</button>
              <button className="w-full py-2 rounded bg-yellow-600 hover:bg-yellow-700" onClick={handleEditTask}>Edit Task</button>
              <button className="w-full py-2 rounded bg-red-600 hover:bg-red-700" onClick={() => { setShowDeleteConfirm(true); setShowActionModal(false); }}>Cancel Task</button>
              <button className="w-full py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => { setShowActionModal(false); setTaskAction(null); }}>Close</button>
            </div>
          </div>
        )}
        {/* Add Time Modal */}
        {showAddTimeModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-xs mx-auto flex flex-col gap-4 shadow-lg items-center">
              <h2 className="text-lg font-semibold mb-2">Add Time</h2>
              <div className="flex flex-col items-center">
                <CircularTimePicker value={addTimeValue} onChange={setAddTimeValue} />
                <div className="mt-4 text-lg font-bold">{addTimeValue} min</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => { setShowAddTimeModal(false); setTaskAction(null); }}>Cancel</button>
                <button className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700" onClick={handleConfirmAddTime}>Add</button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-xs mx-auto flex flex-col gap-4 shadow-lg items-center">
              <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete this task?</h2>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => { setShowDeleteConfirm(false); setTaskAction(null); }}>No</button>
                <button className="px-4 py-2 rounded bg-red-600 hover:bg-red-700" onClick={handleDeleteTask}>Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// CircularTimePicker component
function CircularTimePicker({ value, onChange }) {
  // value in minutes, 0-120
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const maxMinutes = 120;
  // Angle for the handle
  const angle = (value / maxMinutes) * 360;
  const handleX = radius + normalizedRadius * Math.sin((angle * Math.PI) / 180);
  const handleY = radius - normalizedRadius * Math.cos((angle * Math.PI) / 180);

  function handlePointer(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.type.startsWith('touch')
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = e.type.startsWith('touch')
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;
    const dx = x - radius;
    const dy = y - radius;
    let theta = Math.atan2(dx, -dy) * (180 / Math.PI);
    if (theta < 0) theta += 360;
    const min = Math.round((theta / 360) * maxMinutes);
    onChange(Math.max(1, Math.min(maxMinutes, min)));
  }

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      className="block cursor-pointer select-none"
      onMouseDown={e => {
        handlePointer(e);
        const move = ev => handlePointer(ev);
        const up = () => {
          window.removeEventListener('mousemove', move);
          window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
      }}
      onTouchStart={e => {
        handlePointer(e);
        const move = ev => handlePointer(ev);
        const up = () => {
          window.removeEventListener('touchmove', move);
          window.removeEventListener('touchend', up);
        };
        window.addEventListener('touchmove', move);
        window.addEventListener('touchend', up);
      }}
    >
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="#374151"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="#3b82f6"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (value / maxMinutes) * circumference}
        strokeLinecap="round"
      />
      <circle
        cx={handleX}
        cy={handleY}
        r={10}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth={2}
      />
    </svg>
  );
}
