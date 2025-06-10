import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ loggedIn, setLoggedIn, showTaskBar, setShowTaskBar, onToggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  // Restore filteredEvents logic
  const now = new Date();
  const filteredEvents = upcomingEvents
    .filter(e => new Date(e.date + 'T' + e.time) > now)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

  // Optionally, restore countdown logic if you want live countdowns
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedEvents = upcomingEvents.map(event => {
        const eventDate = new Date(event.date + 'T' + event.time);
        const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000); // Assume 1-hour duration
        const diff = endDate - now;
        let countdown = '';
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          if (days > 0) {
            countdown = `${days}d`;
          } else if (hours > 0) {
            countdown = `${hours}h`;
          } else if (minutes > 0) {
            countdown = `${minutes}m`;
          } else {
            countdown = `${seconds}s`;
          }
        } else {
          countdown = 'Ended';
        }
        return { ...event, countdown };
      });
      setUpcomingEvents(updatedEvents);
    }, 1000);
    return () => clearInterval(interval);
  }, [upcomingEvents]);

  // Optionally, add a handler for adding events (for demo/testing)
  // const handleAddEvent = (eventData) => setUpcomingEvents(prev => [...prev, eventData]);

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
            className="h1 hover:text-purple-400 transition-colors"
          >
            Calendar
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Upcoming Events Boxes */}
          {filteredEvents.map((event, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-lg shadow text-sm font-medium" style={{ background: event.color, color: '#fff', minWidth: 80 }}>
              <span className="label truncate max-w-[80px]">{event.title}</span>
              <span className="ml-2 caption">{event.countdown}</span>
            </div>
          ))}
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
    </header>
  );
}
