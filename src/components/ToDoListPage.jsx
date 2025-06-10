import React, { useState } from 'react';

const SECTIONS = [
  { name: 'Work', color: 'bg-blue-500/60' },
  { name: 'Study', color: 'bg-purple-500/60' },
  { name: 'Family', color: 'bg-green-500/60' },
  { name: 'Language', color: 'bg-pink-500/60' },
  { name: 'Meals', color: 'bg-yellow-500/60' },
];

const initialTasks = {
  Work: [
    { name: 'Finish report', subtasks: ['Draft', 'Review', 'Submit'], done: false },
    { name: 'Team meeting', subtasks: [], done: false },
  ],
  Study: [
    { name: 'Read chapter 5', subtasks: ['Take notes'], done: false },
  ],
  Family: [
    { name: 'Call mom', subtasks: [], done: false },
  ],
  Language: [],
  Meals: [],
};

const COLOR_OPTIONS = [
  { name: 'Blue', value: 'bg-blue-500/60', circle: 'bg-blue-500' },
  { name: 'Purple', value: 'bg-purple-500/60', circle: 'bg-purple-500' },
  { name: 'Green', value: 'bg-green-500/60', circle: 'bg-green-500' },
  { name: 'Pink', value: 'bg-pink-500/60', circle: 'bg-pink-500' },
  { name: 'Yellow', value: 'bg-yellow-500/60', circle: 'bg-yellow-500' },
  { name: 'Red', value: 'bg-red-500/60', circle: 'bg-red-500' },
  { name: 'Orange', value: 'bg-orange-500/60', circle: 'bg-orange-500' },
  { name: 'Teal', value: 'bg-teal-500/60', circle: 'bg-teal-500' },
];

// Helper to get time options in 5-min increments
function getTimeOptions() {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      const hour = h.toString().padStart(2, '0');
      const min = m.toString().padStart(2, '0');
      options.push(`${hour}:${min}`);
    }
  }
  return options;
}
const TIME_OPTIONS = getTimeOptions();

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

function Sidebar({ sections, selected, onSelect, onAddSection }) {
  return (
    <aside className="w-56 min-w-56 max-w-56 bg-gray-800 p-4 flex flex-col min-h-screen border-r border-gray-700">
      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-gray-700/60 ${selected === '__all__' ? 'bg-gray-700/80 font-bold' : ''}`}
              onClick={() => onSelect('__all__')}
            >
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              Overview
            </button>
          </li>
          {sections.map((s, idx) => (
            <li key={s.name}>
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-gray-700/60 ${selected === s.name ? 'bg-gray-700/80 font-bold' : ''}`}
                onClick={() => onSelect(s.name)}
              >
                <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
                {s.name}
              </button>
            </li>
          ))}
        </ul>
        {/* Add Section Box always after last section */}
        <div className="mt-4 flex items-center justify-center">
          <button
            className="w-full h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
            onClick={onAddSection}
          >
            <span className="text-2xl text-gray-300">+</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

function TaskCard({ task, onToggleTask, onToggleSubtask, onEdit }) {
  // Sort subtasks: incomplete first, then completed
  const sortedSubtasks = task.subtasks
    ? [...task.subtasks].sort((a, b) => {
        const aDone = !!a.done;
        const bDone = !!b.done;
        return aDone - bDone;
      })
    : [];

  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-3 shadow flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Main task title, clickable to cross out */}
        <span
          className={`h3 cursor-pointer transition-colors ${task.done ? 'line-through text-gray-400' : ''}`}
          onClick={onToggleTask}
        >
          {task.name}
        </span>
        <button className="ml-auto text-xs text-blue-400 hover:underline" onClick={onEdit}>Edit</button>
      </div>
      {sortedSubtasks.length > 0 && (
        <ul className="ml-6 list-disc text-sm text-gray-300">
          {sortedSubtasks.map((sub, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!sub.done}
                onChange={() => onToggleSubtask(i)}
                className="accent-blue-500"
              />
              <span className={sub.done ? 'line-through text-gray-400 body-small' : 'body-small'}>{sub.name || sub}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// CalendarPopover for custom calendar style
function CalendarPopover({ value, onChange, onClose }) {
  const [calendarMonth, setCalendarMonth] = useState(() => value ? new Date(value) : new Date());
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
              onClick={() => { onChange(date.toISOString().slice(0, 10)); onClose(); }}
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

export default function ToDoListPage() {
  const [sections, setSections] = useState(SECTIONS);
  const [selectedSection, setSelectedSection] = useState('__all__');
  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState({ name: '', subtasks: [''], date: '', start: '', end: '', days: [], color: '', tracking: false });
  const [editIdx, setEditIdx] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionColor, setNewSectionColor] = useState('bg-blue-500/60');
  const [newSectionNotes, setNewSectionNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  function handleAddTask() {
    setModalTask({ name: '', subtasks: [''], date: '', start: getDefaultStartTime(), end: '', days: [], color: '', tracking: false });
    setEditIdx(null);
    setShowModal(true);
  }
  function handleEditTask(idx) {
    const t = tasks[selectedSection][idx];
    setModalTask({ ...t, subtasks: t.subtasks.length ? t.subtasks : [''] });
    setEditIdx(idx);
    setShowModal(true);
  }
  function handleSaveTask() {
    setTasks(prev => {
      const updated = { ...prev };
      const newTask = { ...modalTask, subtasks: modalTask.subtasks.filter(Boolean), done: false };
      if (editIdx !== null) {
        updated[selectedSection][editIdx] = newTask;
      } else {
        updated[selectedSection] = [...(updated[selectedSection] || []), newTask];
      }
      return updated;
    });
    setShowModal(false);
  }
  function handleToggleTask(sectionName, idx) {
    setTasks(prev => {
      const updated = { ...prev };
      if (!Array.isArray(updated[sectionName])) return updated;
      const sectionTasks = [...updated[sectionName]];
      const task = { ...sectionTasks[idx], done: !sectionTasks[idx].done };
      // Move completed to end
      const newTasks = [
        ...sectionTasks.slice(0, idx),
        ...sectionTasks.slice(idx + 1),
        task
      ].sort((a, b) => a.done - b.done);
      updated[sectionName] = newTasks;
      return updated;
    });
  }
  function handleToggleSubtask(sectionName, taskIdx, subIdx) {
    setTasks(prev => {
      const updated = { ...prev };
      if (!Array.isArray(updated[sectionName])) return updated;
      const sectionTasks = [...updated[sectionName]];
      const task = { ...sectionTasks[taskIdx] };
      let subtasks = task.subtasks.map((sub, i) => {
        if (typeof sub === 'string') {
          return { name: sub, done: false };
        }
        return { ...sub };
      });
      subtasks[subIdx].done = !subtasks[subIdx].done;
      // Move completed to end
      subtasks = subtasks.sort((a, b) => a.done - b.done);
      task.subtasks = subtasks;
      sectionTasks[taskIdx] = task;
      updated[sectionName] = sectionTasks;
      return updated;
    });
  }
  function handleAddSection() {
    setShowSectionModal(true);
    setNewSectionName('');
    setNewSectionColor('bg-blue-500/60');
    setNewSectionNotes('');
  }
  function handleSaveSection() {
    if (!newSectionName.trim()) return;
    const newSection = { name: newSectionName.trim(), color: newSectionColor, notes: newSectionNotes };
    setSections(prev => [...prev, newSection]);
    setTasks(prev => ({ ...prev, [newSection.name]: [] }));
    setShowSectionModal(false);
    setSelectedSection(newSection.name);
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar sections={sections} selected={selectedSection} onSelect={setSelectedSection} onAddSection={handleAddSection} />
      <main className="flex-1 p-8">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(selectedSection === '__all__'
            ? sections
            : sections.filter(section => section.name === selectedSection)
          ).map(section => (
            <div key={section.name} className="flex-1 min-w-[220px]">
              <h2 className="h2 mb-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${section.color}`}></span>
                {section.name}
              </h2>
              <div>
                {(tasks[section.name] || []).map((task, idx) => (
                  <TaskCard
                    key={idx}
                    task={task}
                    onToggleTask={() => handleToggleTask(section.name, idx)}
                    onToggleSubtask={subIdx => handleToggleSubtask(section.name, idx, subIdx)}
                    onEdit={() => handleEditTask(idx)}
                  />
                ))}
                <button
                  className="w-full py-2 mt-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm"
                  onClick={handleAddTask}
                >
                  + Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Floating Add Button */}
        <button
          className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg z-50"
          onClick={handleAddTask}
        >
          <span className="text-4xl leading-none flex items-center justify-center w-full h-full">+</span>
        </button>
        {/* Modal for Add/Edit Task */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md mx-auto flex flex-col gap-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{editIdx !== null ? 'Edit Task' : 'Add Task'}</h2>
              {/* Category/Section first */}
              <label className="text-sm font-medium">Category</label>
              <select
                className="bg-gray-700 rounded px-3 py-2 mb-2"
                value={modalTask.section || sections[0]?.name}
                onChange={e => setModalTask(t => ({ ...t, section: e.target.value }))}
                required
              >
                {sections.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
              <label className="text-sm font-medium">Task Name</label>
              <input
                className="bg-gray-700 rounded px-3 py-2 mb-2"
                type="text"
                value={modalTask.name}
                onChange={e => setModalTask(t => ({ ...t, name: e.target.value }))}
                required
                placeholder="Task name"
              />
              <label className="text-sm font-medium">Subtasks</label>
              {modalTask.subtasks.map((sub, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    className="bg-gray-700 rounded px-3 py-2 flex-1"
                    type="text"
                    value={sub}
                    onChange={e => setModalTask(t => {
                      const arr = [...t.subtasks];
                      arr[i] = e.target.value;
                      return { ...t, subtasks: arr };
                    })}
                    placeholder={`Subtask ${i + 1}`}
                  />
                  <button
                    type="button"
                    className="text-red-400 px-2"
                    onClick={() => setModalTask(t => ({ ...t, subtasks: t.subtasks.filter((_, idx) => idx !== i) }))}
                    disabled={modalTask.subtasks.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-blue-400 text-sm mb-2 hover:underline"
                onClick={() => setModalTask(t => ({ ...t, subtasks: [...t.subtasks, ''] }))}
              >
                + Add Subtask
              </button>
              <label className="text-sm font-medium">Date</label>
              <div className="relative mb-2">
                <button
                  type="button"
                  className="w-full bg-gray-700 rounded px-3 py-2 text-left hover:bg-gray-700/70"
                  onClick={() => setShowDatePicker(v => !v)}
                >
                  {modalTask.date
                    ? new Date(modalTask.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Choose date'}
                </button>
                {showDatePicker && (
                  <CalendarPopover
                    value={modalTask.date}
                    onChange={date => setModalTask(t => ({ ...t, date }))}
                    onClose={() => setShowDatePicker(false)}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium">Start</label>
                  <div className="relative mb-2">
                    <button
                      type="button"
                      className="w-full bg-gray-700 rounded px-3 py-2 text-left hover:bg-gray-700/70"
                      onClick={() => setShowStartTimePicker(v => !v)}
                    >
                      {modalTask.start || '--:--'}
                    </button>
                    {showStartTimePicker && (
                      <div className="absolute z-50 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 w-32 max-h-64 overflow-y-auto">
                        {TIME_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-700/50 ${modalTask.start === opt ? 'bg-blue-600 text-white' : ''}`}
                            onClick={() => { setModalTask(t => ({ ...t, start: opt })); setShowStartTimePicker(false); }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">End</label>
                  <div className="relative mb-2">
                    <button
                      type="button"
                      className="w-full bg-gray-700 rounded px-3 py-2 text-left hover:bg-gray-700/70"
                      onClick={() => setShowEndTimePicker(v => !v)}
                    >
                      {modalTask.end || '--:--'}
                    </button>
                    {showEndTimePicker && (
                      <div className="absolute z-50 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 w-32 max-h-64 overflow-y-auto">
                        {TIME_OPTIONS.map(opt => (
                          <button
                            key={opt}
                            className={`block w-full text-left px-3 py-1 rounded hover:bg-gray-700/50 ${modalTask.end === opt ? 'bg-blue-600 text-white' : ''}`}
                            onClick={() => { setModalTask(t => ({ ...t, end: opt })); setShowEndTimePicker(false); }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <label className="text-sm font-medium">Days of Week</label>
              <div className="flex gap-2 mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                  <label key={day} className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={modalTask.days.includes(day)}
                      onChange={e => setModalTask(t => ({
                        ...t,
                        days: e.target.checked
                          ? [...t.days, day]
                          : t.days.filter(d => d !== day)
                      }))}
                    />
                    {day}
                  </label>
                ))}
              </div>
              <label className="text-sm font-medium">Color/Category</label>
              <select
                className="bg-gray-700 rounded px-3 py-2 mb-2"
                value={modalTask.color}
                onChange={e => setModalTask(t => ({ ...t, color: e.target.value }))}
              >
                <option value="">Select</option>
                {sections.map(s => (
                  <option key={s.name} value={s.color}>{s.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <input
                  type="checkbox"
                  checked={modalTask.tracking}
                  onChange={e => setModalTask(t => ({ ...t, tracking: e.target.checked }))}
                />
                Start tracking from here
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700" onClick={handleSaveTask}>{editIdx !== null ? 'Save' : 'Add'}</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for Add Section */}
        {showSectionModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-xs mx-auto flex flex-col gap-4 shadow-lg">
              <h2 className="text-xl font-semibold mb-2">Add New Section</h2>
              <label className="text-sm font-medium">Section Title</label>
              <input
                className="bg-gray-700 rounded px-3 py-2 mb-2"
                type="text"
                value={newSectionName}
                onChange={e => setNewSectionName(e.target.value)}
                required
                placeholder="Section title"
              />
              <label className="text-sm font-medium mb-1">Color</label>
              <div className="flex gap-2 mb-2">
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center focus:outline-none transition-all ${opt.circle} ${newSectionColor === opt.value ? 'border-white ring-2 ring-blue-400' : 'border-gray-500'}`}
                    onClick={() => setNewSectionColor(opt.value)}
                    aria-label={opt.name}
                  >
                    {newSectionColor === opt.value && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <label className="text-sm font-medium">AI Notes</label>
              <textarea
                className="bg-gray-700 rounded px-3 py-2 mb-2 min-h-[60px]"
                value={newSectionNotes}
                onChange={e => setNewSectionNotes(e.target.value)}
                placeholder="AI notes or suggestions for this section"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700" onClick={() => setShowSectionModal(false)}>Cancel</button>
                <button type="button" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700" onClick={handleSaveSection}>Add</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
