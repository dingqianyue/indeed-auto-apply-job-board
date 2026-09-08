import { Briefcase, Bookmark, Settings, User, Heart } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
  activeView: 'recommended' | 'applied' | 'saved';
  setActiveView: (view: 'recommended' | 'applied' | 'saved') => void;
}

export function Sidebar({ onClose, activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { name: 'Recommended', id: 'recommended', icon: Briefcase },
    { name: 'Applied', id: 'applied', icon: Bookmark },
    { name: 'Saved', id: 'saved', icon: Heart },
    { name: 'Settings', id: 'settings', icon: Settings },
  ];

  const handleMenuClick = (id: string) => {
    if (id === 'settings') return; // Mock settings
    setActiveView(id as any);
    if (onClose) onClose();
  };

  return (
    <aside className="flex flex-col w-64 md:w-64 max-w-[80vw] bg-white border-r border-gray-200 h-screen py-6 px-4 shrink-0 shadow-xl md:shadow-none relative">
      {/* Mobile close button inside the sidebar (optional, but good UX) */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-md"
      >
        <span className="sr-only">Close sidebar</span>
      </button>

      <div className="hidden md:flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          J
        </div>
        <span className="font-bold text-xl tracking-tight">Jobnova</span>
      </div>

      <div className="md:hidden h-4"></div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-200 pt-4 px-2">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900">User Profile</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
