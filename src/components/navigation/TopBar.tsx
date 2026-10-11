import React, { useState } from 'react';
import { 
  Menu, 
  Sparkles, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  User, 
  GraduationCap 
} from 'lucide-react';
import { UserCredential } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { NotificationCenter } from '../common/NotificationCenter';
import { AccountDetailsModal } from '../common/AccountDetailsModal';

interface TopBarProps {
  currentUser: UserCredential;
  activeTabTitle: string;
  onOpenMobileSidebar: () => void;
  onOpenGeminiChat?: () => void;
  onLogout: () => void;
  onSwitchUser?: (user: UserCredential) => void;
  onOpenLoginModal?: () => void;
  allUsers?: UserCredential[];
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  activeTabTitle,
  onOpenMobileSidebar,
  onOpenGeminiChat,
  onLogout,
  onSwitchUser,
  onOpenLoginModal,
  allUsers = [],
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Left Section: Mobile Hamburger & Section Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-serif truncate">
                {activeTabTitle || 'Examination System'}
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Nexus Ranaji English School • Academic Session 2025-26
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: AI Assistant, Notifications & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Tutor Button */}
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open AI Study Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          )}

          {/* Institutional Notifications */}
          <NotificationCenter
            currentUserId={currentUser.id}
            currentUserRole={currentUser.role}
          />

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer"
            >
              <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[9px] text-slate-400 uppercase font-mono mt-0.5">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setProfileDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-40 space-y-1 animate-in fade-in duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email || currentUser.username}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setAccountDetailsOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Account Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out to Login Page</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </header>

      {/* Account Details Modal */}
      {accountDetailsOpen && (
        <AccountDetailsModal
          isOpen={accountDetailsOpen}
          onClose={() => setAccountDetailsOpen(false)}
          currentUser={currentUser}
          allUsers={allUsers}
          onSwitchUser={onSwitchUser || (() => {})}
          onOpenLoginModal={onOpenLoginModal || (() => {})}
          onLogout={onLogout}
        />
      )}
    </>
  );
};
