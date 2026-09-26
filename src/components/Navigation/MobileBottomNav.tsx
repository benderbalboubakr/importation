import React from 'react';
import { 
  PackageSearch, 
  MapPin, 
  MessageSquare, 
  Truck, 
  BarChart3, 
  Store 
} from 'lucide-react';
import { UserRole } from '../../types';

export type TabKey = 'explorer' | 'locator' | 'messages' | 'orders' | 'dashboard';

interface MobileBottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  userRole: UserRole;
  unreadCount?: number;
  activeOrdersCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  unreadCount = 1,
  activeOrdersCount = 1,
}) => {
  const tabs = [
    {
      key: 'explorer' as TabKey,
      label: 'Lots B2B',
      icon: PackageSearch,
    },
    {
      key: 'locator' as TabKey,
      label: 'Localiser',
      icon: MapPin,
    },
    {
      key: 'messages' as TabKey,
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      key: 'orders' as TabKey,
      label: 'Suivi',
      icon: Truck,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      badgeColor: 'bg-emerald-500',
    },
    {
      key: 'dashboard' as TabKey,
      label: userRole === 'importer' ? 'Analytics' : 'Mon Espace',
      icon: userRole === 'importer' ? BarChart3 : Store,
    },
  ];

  return (
    <nav className="w-full bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-lg px-2 py-1 flex items-center justify-around shrink-0 z-40 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => onSelectTab(tab.key)}
            className={`flex-1 min-h-[48px] flex flex-col items-center justify-center relative py-1 transition-all rounded-xl ${
              isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <IconComponent className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              
              {tab.badge && (
                <span
                  className={`absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center leading-none ${
                    tab.badgeColor || 'bg-rose-500'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
              {tab.label}
            </span>

            {isActive && (
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-0.5 shadow-sm shadow-emerald-400/50"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
