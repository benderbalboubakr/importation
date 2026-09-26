import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  BatteryMedium, 
  Signal, 
  ArrowLeftRight, 
  ShieldCheck, 
  Crown,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  userRole: UserRole;
  onToggleRole: (newRole: UserRole) => void;
  onOpenPremium: () => void;
}

export type DeviceMode = 'iphone' | 'android' | 'fullscreen';

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  userRole,
  onToggleRole,
  onOpenPremium,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('iphone');
  const [currentTime] = useState('09:41');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      {/* Top Universal Applet Control Bar */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-2.5 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
            ID
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>ImportDirect B2B</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                iOS & Android
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Réseau B2B Commerçants & Micro-Importateurs
            </div>
          </div>
        </div>

        {/* Central Switchers: Device Preview Mode & User Role */}
        <div className="flex items-center gap-2">
          {/* Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onToggleRole('retailer')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                userRole === 'retailer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Commerçant (Acheteur)</span>
            </button>
            <button
              onClick={() => onToggleRole('importer')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                userRole === 'importer'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Micro-Importateur (Vendeur)</span>
            </button>
          </div>

          {/* Quick role toggle on mobile */}
          <button
            onClick={() => onToggleRole(userRole === 'retailer' ? 'importer' : 'retailer')}
            className="sm:hidden px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1"
            title="Changer de rôle"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userRole === 'retailer' ? 'Acheteur' : 'Importateur'}</span>
          </button>

          {/* Device Frame Switcher */}
          <div className="hidden md:flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDeviceMode('iphone')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                deviceMode === 'iphone'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Aperçu iPhone 16 Pro"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>iPhone</span>
            </button>
            <button
              onClick={() => setDeviceMode('android')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                deviceMode === 'android'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Aperçu Samsung Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android</span>
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                deviceMode === 'fullscreen'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Aperçu Plein Écran Réactif"
            >
              <Monitor className="w-3.5 h-3.5 text-slate-300" />
              <span>Plein Écran</span>
            </button>
          </div>

          {/* Premium Subscription CTA Button */}
          <button
            onClick={onOpenPremium}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Passer Premium</span>
            <span className="sm:hidden">VIP</span>
          </button>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 md:p-6 lg:p-8">
        {deviceMode === 'fullscreen' ? (
          <div className="w-full max-w-5xl min-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
            {children}
          </div>
        ) : (
          /* Phone Simulator Shell */
          <div className="relative my-auto transition-all duration-300">
            {/* Outer phone bezel */}
            <div 
              className={`w-[390px] sm:w-[420px] h-[844px] sm:h-[870px] bg-black rounded-[50px] p-[10px] shadow-2xl border-[4px] relative overflow-hidden flex flex-col ${
                deviceMode === 'iphone'
                  ? 'border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-700/50'
                  : 'border-slate-800 rounded-[42px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
              }`}
            >
              {/* Inner phone screen */}
              <div className="relative w-full h-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col">
                {/* Mobile Status Bar */}
                <div className="h-11 w-full px-7 flex items-center justify-between z-30 select-none text-slate-200 text-xs font-medium shrink-0 pt-1">
                  <span>{currentTime}</span>

                  {/* iPhone Dynamic Island / Android Punch Hole */}
                  {deviceMode === 'iphone' ? (
                    <div className="h-7 w-28 bg-black rounded-full flex items-center justify-between px-2.5 mx-auto border border-slate-900/60 shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900/80 border border-slate-800"></div>
                      <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>B2B</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-4 h-4 bg-black rounded-full mx-auto border border-slate-800"></div>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Signal className="w-3.5 h-3.5" />
                    <Wifi className="w-3.5 h-3.5" />
                    <BatteryMedium className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Mobile screen app viewport */}
                <div className="flex-1 w-full overflow-hidden flex flex-col relative">
                  {children}
                </div>

                {/* Bottom Home Indicator Bar (iOS) or Navigation Pill (Android) */}
                <div className="h-5 w-full flex items-center justify-center shrink-0 bg-slate-950 select-none pb-1">
                  {deviceMode === 'iphone' ? (
                    <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
                  ) : (
                    <div className="w-20 h-1 bg-slate-700 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
