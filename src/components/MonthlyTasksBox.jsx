import { useState, useEffect, useRef } from 'react';

export function UpcomingTasksBox() {
  const [upcomingTasks, setUpcomingTasks] = useState([
    {
      id: 1,
      title: "Team Meeting",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 2,
      title: "Project Deadline",
      date: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: new Date(Date.now() + 14 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 3,
      title: "Client Call",
      date: new Date(Date.now() + 5 * 60 * 1000).toISOString().split('T')[0],
      time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskTime, setNewTaskTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  const [timeRemaining, setTimeRemaining] = useState({});

  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sort tasks by date and time
  const sortedTasks = [...upcomingTasks].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const newTimeRemaining = {};

      upcomingTasks.forEach(task => {
        const [hours, minutes] = task.time.split(':');
        const [ampm] = task.time.split(' ').slice(-1);
        const taskDate = new Date(task.date);
        taskDate.setHours(ampm === 'PM' ? parseInt(hours) + 12 : parseInt(hours), parseInt(minutes), 0);

        const diff = taskDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          if (days > 0) {
            newTimeRemaining[task.id] = `${days}d left`;
          } else if (hours > 0) {
            newTimeRemaining[task.id] = `${hours}:${minutes.toString().padStart(2, '0')}h left`;
          } else {
            newTimeRemaining[task.id] = `${minutes}:${seconds.toString().padStart(2, '0')}min left`;
          }
        } else {
          newTimeRemaining[task.id] = "Overdue";
        }
      });

      setTimeRemaining(newTimeRemaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [upcomingTasks]);

  const handlePreviousTask = () => {
    setCurrentTaskIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : upcomingTasks.length - 1;
      scrollToTask(newIndex);
      return newIndex;
    });
  };

  const handleNextTask = () => {
    setCurrentTaskIndex(prev => {
      const newIndex = prev < upcomingTasks.length - 1 ? prev + 1 : 0;
      scrollToTask(newIndex);
      return newIndex;
    });
  };

  const scrollToTask = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const taskElement = container.children[0].children[index];
    if (!taskElement) return;

    const containerWidth = container.offsetWidth;
    const taskLeft = taskElement.offsetLeft;
    const taskWidth = taskElement.offsetWidth;
    const scrollPosition = taskLeft - (containerWidth / 2) + (taskWidth / 2);

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handleAddTask = () => {
    if (newTaskTitle && newTaskDate && newTaskTime) {
      const newTask = {
        id: Math.max(...upcomingTasks.map(t => t.id), 0) + 1,
        title: newTaskTitle,
        date: newTaskDate,
        time: newTaskTime
      };
      setUpcomingTasks([...upcomingTasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDate('');
      setNewTaskTime('');
      setShowNewTaskForm(false);
    }
  };

  return (
    <div className="mt-20">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 w-[400px]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="h3 text-gray-300">Upcoming</h3>
          <button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => handlePreviousTask()}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors group"
            disabled={currentTaskIndex === 0}
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                currentTaskIndex === 0 ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-300'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{
              cursor: 'grab',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
          >
            <div className="flex space-x-2 min-w-max px-1">
              {sortedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`bg-gray-700/30 rounded-lg p-2 min-w-[120px] flex-shrink-0 transition-all duration-300 ${
                    index === currentTaskIndex ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="body-medium text-gray-300 mb-1">{task.title}</div>
                  <div className="flex items-center caption text-gray-400">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeRemaining[task.id] || "Loading..."}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleNextTask()}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors group"
            disabled={currentTaskIndex === sortedTasks.length - 1}
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                currentTaskIndex === sortedTasks.length - 1 ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-300'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {showNewTaskForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-300">Add New Task</h3>
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task title..."
                className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-700 rounded-lg p-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 focus:outline-none w-full [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                  />
                </div>
                <div className="flex-1 bg-gray-700 rounded-lg p-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 focus:outline-none w-full [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                  />
                </div>
              </div>
              <button
                onClick={handleAddTask}
                className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TodoListBox() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Math Project",
      completed: false,
      subtasks: [
        { id: 1.1, title: "Complete algebra exercises", completed: false },
        { id: 1.2, title: "Review calculus formulas", completed: false }
      ],
      showSubtasks: false,
      isEditing: false
    },
    {
      id: 2,
      title: "Business Plan",
      completed: false,
      subtasks: [
        { id: 2.1, title: "Market research", completed: false },
        { id: 2.2, title: "Financial projections", completed: false }
      ],
      showSubtasks: false,
      isEditing: false
    },
    {
      id: 3,
      title: "Team Meeting",
      completed: false,
      subtasks: [
        { id: 3.1, title: "Prepare presentation", completed: false },
        { id: 3.2, title: "Send agenda", completed: false }
      ],
      showSubtasks: false,
      isEditing: false
    },
  ]);

  const [editingTask, setEditingTask] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleSubtasks = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, showSubtasks: !task.showSubtasks } : task
    ));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    ));
  };

  const startEditingTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: true } : task
    ));
    setEditingTask(taskId);
  };

  const saveTaskEdit = (taskId, newTitle) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle, isEditing: false } : task
    ));
    setEditingTask(null);
  };

  const addSubtask = (taskId, newSubtaskTitle) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: [...task.subtasks, {
              id: Math.max(...task.subtasks.map(st => st.id), 0) + 0.1,
              title: newSubtaskTitle,
              completed: false
            }]
          }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
          }
        : task
    ));
  };

  const openSubtaskModal = (taskId) => {
    setActiveTaskId(taskId);
    setShowSubtaskModal(true);
  };

  const closeSubtaskModal = () => {
    setShowSubtaskModal(false);
    setNewSubtaskText('');
    setActiveTaskId(null);
  };

  const handleAddSubtask = () => {
    if (newSubtaskText.trim() && activeTaskId) {
      addSubtask(activeTaskId, newSubtaskText.trim());
      closeSubtaskModal();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">To-Do List</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-700/30 rounded-lg overflow-hidden mb-3">
                  <div className="flex items-center p-4">
                    <div
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer
                        ${task.completed ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 ml-4">
                      {task.isEditing ? (
                        <input
                          type="text"
                          defaultValue={task.title}
                          className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onBlur={(e) => saveTaskEdit(task.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveTaskEdit(task.id, e.target.value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <span
                            onClick={() => toggleSubtasks(task.id)}
                            className={`text-sm cursor-pointer ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}
                          >
                            {task.title}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSubtasks(task.id)}
                              className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                              <svg
                                className={`w-3.5 h-3.5 transform transition-transform ${task.showSubtasks ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => startEditingTask(task.id)}
                              className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {task.showSubtasks && (
                    <div className="border-t border-gray-700/50 bg-gray-800/50">
                      {task.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center p-3 pl-12 hover:bg-gray-700/30 transition-colors"
                        >
                          <div
                            onClick={() => toggleSubtask(task.id, subtask.id)}
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer
                              ${subtask.completed ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}
                          >
                            {subtask.completed && (
                              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`ml-3 text-xs flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-400'}`}>
                            {subtask.title}
                          </span>
                          <button
                            onClick={() => deleteSubtask(task.id, subtask.id)}
                            className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <div className="px-2 py-1.5">
                        <div className="bg-gray-700/30 rounded-lg p-1 flex items-center justify-center">
                          <button
                            onClick={() => openSubtaskModal(task.id)}
                            className="p-1 rounded-full hover:bg-gray-700/50 transition-colors text-gray-400 hover:text-gray-300"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              className="w-full mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              onClick={() => {/* TODO: Handle new task creation */}}
            >
              Add New Task
            </button>
          </div>
        </div>
      )}

      {/* Custom Subtask Modal */}
      {showSubtaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-80 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-300">Add Subtask</h3>
              <button
                onClick={closeSubtaskModal}
                className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              placeholder="Enter subtask title..."
              className="w-full bg-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSubtask();
                } else if (e.key === 'Escape') {
                  closeSubtaskModal();
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeSubtaskModal}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-700/50 transition-colors text-sm text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Add Subtask
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
