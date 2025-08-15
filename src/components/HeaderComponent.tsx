import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  onSignOut?: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center font-mono p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center space-x-4">
        <h1 className="text-white text-xl font-bold">MYB Plus</h1>
        <span className="text-white/70 text-sm">Dashboard</span>
      </div>
      
      <div className="flex items-center space-x-6">
        <button
          onClick={onSignOut}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
