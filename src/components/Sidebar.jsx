  <div className="flex flex-col gap-1.5">
    <button
      onClick={() => onNavigate('calendar')}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
        currentPage === 'calendar'
          ? 'bg-gray-700/50 text-white'
          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-300'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span className="text-sm">Calendar</span>
    </button>

    <button
      onClick={() => onNavigate('todo')}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
        currentPage === 'todo'
          ? 'bg-gray-700/50 text-white'
          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-300'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <span className="text-sm">To-Do</span>
    </button>

    <button
      onClick={() => onNavigate('tracking')}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors -mt-3 ${
        currentPage === 'tracking'
          ? 'bg-gray-700/50 text-white'
          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-300'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm">Time Tracking</span>
    </button>

    <button
      onClick={() => onNavigate('analytics')}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
        currentPage === 'analytics'
          ? 'bg-gray-700/50 text-white'
          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-300'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <span className="text-sm">Analytics</span>
    </button>

    <button
      onClick={() => onNavigate('settings')}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
        currentPage === 'settings'
          ? 'bg-gray-700/50 text-white'
          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-300'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="text-sm">Settings</span>
    </button>
  </div>
