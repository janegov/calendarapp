import { useState } from "react";
import TaskCreationModal from "./TaskCreationModal";
import { UpcomingTasksBox } from "./MonthlyTasksBox";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ loggedIn, setLoggedIn, showTaskBar, setShowTaskBar, onToggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xl font-semibold hover:text-purple-400 transition-colors"
          >
            Calendar
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {isMainPage && (
            <div className="flex items-center space-x-2">
              <UpcomingTasksBox />
            </div>
          )}

          <button
            onClick={() => setShowTaskModal(true)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={() => setLoggedIn(!loggedIn)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Menu</h2>
            <nav className="space-y-2">
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">Dashboard</a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">Settings</a>
              <a href="#" className="block px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors">Help</a>
            </nav>
          </div>
        </div>
      )}

      <TaskCreationModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />
    </header>
  );
}
