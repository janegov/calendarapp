import React from 'react';

const TaskSidebar = ({ showTaskBar, mockTasks }) => {
  return (
    <aside
      className={`${
        showTaskBar ? "w-64" : "w-0"
      } bg-gray-800/70 backdrop-blur-sm border-r border-gray-700/50 overflow-hidden transition-all duration-300 ease-in-out`}
    >
      {showTaskBar && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-400">Your Tasks</span>
          </h2>
          <ul className="space-y-3">
            {mockTasks.map((task) => (
              <li
                key={task.id}
                className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/60 cursor-pointer transition-all"
              >
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-gray-400">
                  {task.category} • {task.duration}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default TaskSidebar;
