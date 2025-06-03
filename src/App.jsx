import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SidebarMenu from './components/SidebarMenu';
import CalendarView from './components/CalendarView';
import TodoList from './pages/TodoList';
import TimeTracking from './pages/TimeTracking';
import AIAssistant from './pages/AIAssistant';
import Statistics from './pages/Statistics';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTaskBar, setShowTaskBar] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeView, setActiveView] = useState('week');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          showTaskBar={showTaskBar}
          setShowTaskBar={setShowTaskBar}
          onToggleSidebar={toggleSidebar}
        />
        <SidebarMenu
          isOpen={isSidebarOpen}
          onPageChange={handlePageChange}
        />
        <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Routes>
            <Route path="/" element={<CalendarView activeView={activeView} setActiveView={setActiveView} />} />
            <Route path="/todo" element={<TodoList />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
