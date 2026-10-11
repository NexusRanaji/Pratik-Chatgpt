import React, { useState, useEffect } from 'react';
import { UserCredential } from './types';
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { LoginModal } from './components/auth/LoginModal';
import { GeminiChatbot } from './components/chat/GeminiChatbot';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { 
  ShieldCheck, 
  GraduationCap, 
  Smartphone, 
  Server, 
  ExternalLink 
} from 'lucide-react';

const DEFAULT_USERS: UserCredential[] = [
  {
    id: 'usr-admin-1',
    name: 'Dr. R. K. Deshmukh',
    username: 'admin',
    email: 'admin@nexusrana.edu',
    role: 'superadmin',
    employeeId: 'NRES-DIR-001',
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'usr-teach-1',
    name: 'Prof. Vikram Sharma',
    username: 'teacher.sharma',
    email: 'vikram.sharma@nexusrana.edu',
    role: 'teacher',
    employeeId: 'NRES-FAC-104',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'usr-stud-1',
    name: 'Aarav Sharma',
    username: 'student.aarav',
    email: 'aarav.sharma@student.nexusrana.edu',
    role: 'student',
    rollNo: 'NRES-10A-01',
    classId: 'cls-10',
    divisionId: 'div-10a',
    parentId: 'usr-parent-1',
    bonusPoints: 260,
    createdAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'usr-stud-2',
    name: 'Rohan Patel',
    username: 'student.rohan',
    email: 'rohan.patel@student.nexusrana.edu',
    role: 'student',
    rollNo: 'NRES-10A-02',
    classId: 'cls-10',
    divisionId: 'div-10a',
    parentId: 'usr-parent-2',
    bonusPoints: 175,
    createdAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'usr-parent-1',
    name: 'Mr. Rajesh Sharma',
    username: 'parent.sharma',
    email: 'rajesh.sharma@parent.nexusrana.edu',
    role: 'parent',
    childrenIds: ['usr-stud-1', 'usr-stud-3'],
    phone: '+91 98201 44521',
    createdAt: '2025-02-01T08:30:00Z',
  },
];

export default function App() {
  const [allUsers, setAllUsers] = useState<UserCredential[]>(DEFAULT_USERS);
  
  // Read stored user from localStorage if previously authenticated; otherwise initial state is null (shows LoginPage)
  const [currentUser, setCurrentUser] = useState<UserCredential | null>(() => {
    try {
      const stored = localStorage.getItem('nexus_authenticated_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.role) return parsed;
      }
    } catch (e) {
      console.warn('Could not read cached session:', e);
    }
    // Return null so the Login Page is the initial web page as requested!
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [roleTabs, setRoleTabs] = useState<Record<string, string>>({
    student: 'home',
    teacher: 'home',
    superadmin: 'home',
    parent: 'home',
  });

  const getRoleHashPrefix = (role: string) => (role === 'superadmin' ? 'admin' : role);
  const getRoleFromPrefix = (prefix: string) => (prefix === 'admin' ? 'superadmin' : prefix);

  const handleTabChange = (newTab: string) => {
    if (!currentUser) return;
    setRoleTabs((prev) => ({
      ...prev,
      [currentUser.role]: newTab,
    }));
    const prefix = getRoleHashPrefix(currentUser.role);
    const targetHash = newTab === 'home' ? `#/${prefix}` : `#/${prefix}/${newTab}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState({ role: currentUser.role, tab: newTab }, '', targetHash);
    }
  };

  const fetchUsers = async () => {
    try {
      let users: UserCredential[] = [];
      const res = await fetch('/api/admin/credentials');
      const contentType = res.headers.get('content-type') || '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        users = data.users || [];
      } else {
        const altRes = await fetch('/api/auth/users');
        const altContentType = altRes.headers.get('content-type') || '';
        if (altRes.ok && altContentType.includes('application/json')) {
          const altData = await altRes.json();
          users = altData.users || [];
        }
      }

      if (users.length > 0) {
        const uniqueUsers = Array.from(new Map(users.map((u) => [u.id, u])).values());
        setAllUsers(uniqueUsers);
        if (currentUser) {
          const found = uniqueUsers.find((u) => u.id === currentUser.id);
          if (found) setCurrentUser(found);
        }
      }
    } catch (err) {
      console.error('Failed to load user list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Listen to browser navigation (back/forward button, Android hardware back, URL hash updates)
  useEffect(() => {
    const handleUrlSync = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!hash) return;
      const [rolePrefix, tabSegment] = hash.split('/');
      const role = getRoleFromPrefix(rolePrefix);
      const tab = tabSegment || 'home';

      setRoleTabs((prev) => ({
        ...prev,
        [role]: tab,
      }));

      // If URL specifies a role different from current user, switch to a user with that role
      if (currentUser && currentUser.role !== role) {
        const matchingUser = allUsers.find((u) => u.role === role);
        if (matchingUser) {
          setCurrentUser(matchingUser);
          localStorage.setItem('nexus_authenticated_user', JSON.stringify(matchingUser));
        }
      }
    };

    window.addEventListener('hashchange', handleUrlSync);
    window.addEventListener('popstate', handleUrlSync);

    handleUrlSync();

    return () => {
      window.removeEventListener('hashchange', handleUrlSync);
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, [allUsers, currentUser]);

  const handleSwitchUser = (user: UserCredential) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nexus_authenticated_user', JSON.stringify(user));
    } catch (e) {}
    const prefix = getRoleHashPrefix(user.role);
    const currentRoleTab = roleTabs[user.role] || 'home';
    const targetHash = currentRoleTab === 'home' ? `#/${prefix}` : `#/${prefix}/${currentRoleTab}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState({ role: user.role, tab: currentRoleTab }, '', targetHash);
    }
  };

  const handleLoginSuccess = (user: UserCredential) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nexus_authenticated_user', JSON.stringify(user));
    } catch (e) {}
    const prefix = getRoleHashPrefix(user.role);
    const targetHash = `#/${prefix}`;
    window.history.pushState({ role: user.role, tab: 'home' }, '', targetHash);
    setLoginModalOpen(false);
    fetchUsers();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('nexus_authenticated_user');
    } catch (e) {}
    setCurrentUser(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // Human-readable titles for the active tab
  const getActiveTabTitle = () => {
    if (!currentUser) return 'Nexus Ranaji Portal';
    const activeTab = roleTabs[currentUser.role] || 'home';

    if (currentUser.role === 'student') {
      switch (activeTab) {
        case 'exams': return 'Examinations & Timed Tests';
        case 'materials': return 'Curriculum Study Materials';
        case 'achievements': return 'Scholastic Honors & Completion Certificate';
        case 'chatbot': return 'AI Study Assistant Tutor';
        case 'notices': return 'Official Circulars & Notice Board';
        default: return 'Student Academic Workspace';
      }
    } else if (currentUser.role === 'teacher') {
      switch (activeTab) {
        case 'exams': return 'Exam Authoring & Assessments';
        case 'questionBank': return 'Institutional Question Bank';
        case 'submissions': return 'Examinee Grading & Review';
        case 'students': return 'Student Class Rosters';
        case 'materials': return 'Study Resource Management';
        case 'standings': return 'Academic Standing Rules';
        case 'tickets': return 'Parent-Teacher Helpdesk';
        case 'notices': return 'Notice Board Administration';
        default: return 'Faculty Examination Workspace';
      }
    } else if (currentUser.role === 'superadmin') {
      switch (activeTab) {
        case 'stats': return 'Institutional Analytics & School Reports';
        case 'academic': return 'Classes, Divisions & Curriculums';
        case 'credentials': return 'User Directory & Password Management';
        case 'audits': return 'Security Audits & Anti-Cheating Logs';
        case 'notices': return 'Notice Board Administration';
        default: return 'Directorate Super Administrator Workspace';
      }
    } else if (currentUser.role === 'parent') {
      switch (activeTab) {
        case 'submissions': return 'Ward Examination Results & Scorecards';
        case 'overview': return 'Academic Progress & Attendance';
        case 'helpdesk': return 'Parent-Teacher Inquiry Desk';
        case 'notices': return 'School Notices & Circulars';
        default: return 'Parent & Family Portal';
      }
    }
    return 'Nexus Ranaji Portal';
  };

  // INITIAL WEB PAGE: If user is not authenticated, display the dedicated full-page LoginPage!
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        allUsers={allUsers}
      />
    );
  }

  const activeTab = roleTabs[currentUser.role] || 'home';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200">
      
      {/* Desktop Persistent Side Menu Bar */}
      <Sidebar
        currentUser={currentUser}
        allUsers={allUsers}
        activeTab={activeTab}
        onNavigateTab={handleTabChange}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        onOpenGeminiChat={() => setIsChatOpen((prev) => !prev)}
        isMobile={false}
      />

      {/* Mobile Slide-Over Drawer Side Menu Bar */}
      <Sidebar
        currentUser={currentUser}
        allUsers={allUsers}
        activeTab={activeTab}
        onNavigateTab={handleTabChange}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        onOpenGeminiChat={() => setIsChatOpen((prev) => !prev)}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isMobile={true}
      />

      {/* Main Content Area beside the Side Menu Bar */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <TopBar
          currentUser={currentUser}
          activeTabTitle={getActiveTabTitle()}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenGeminiChat={() => setIsChatOpen((prev) => !prev)}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
          allUsers={allUsers}
        />

        {/* Dynamic Role Workspaces */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
          {currentUser.role === 'superadmin' && (
            <AdminDashboard 
              currentUser={currentUser} 
              onRefreshUsers={fetchUsers} 
              activeTab={roleTabs.superadmin as any}
              onTabChange={(t) => handleTabChange(t)}
            />
          )}

          {currentUser.role === 'teacher' && (
            <TeacherDashboard 
              currentUser={currentUser} 
              activeTab={roleTabs.teacher as any}
              onTabChange={(t) => handleTabChange(t)}
            />
          )}

          {currentUser.role === 'student' && (
            <StudentDashboard
              currentUser={currentUser}
              onRefreshUser={fetchUsers}
              activeTab={roleTabs.student as any}
              onTabChange={(t) => handleTabChange(t)}
            />
          )}

          {currentUser.role === 'parent' && (
            <ParentDashboard 
              currentUser={currentUser} 
              activeTab={roleTabs.parent as any}
              onTabChange={(t) => handleTabChange(t)}
            />
          )}
        </main>

        {/* Institutional Footer */}
        <footer className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 py-4 sm:py-6 px-4 sm:px-6 lg:px-8 mt-auto mb-16 md:mb-0 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-serif font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Nexus Ranaji English School &bull; Online Examination System
                </p>
                <p className="text-[10px] text-slate-400">
                  CBSE Affiliated Institutional Code #41029 &bull; Academic Year 2025–2026
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Server className="w-3 h-3" />
                REST API Ready
              </span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <ShieldCheck className="w-3 h-3" />
                Anti-Cheating Guard
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                <Smartphone className="w-3 h-3" />
                Mobile Responsive
              </span>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar for 1-Thumb Reachability */}
        <MobileBottomNav
          currentUser={currentUser}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenChat={() => setIsChatOpen((prev) => !prev)}
          isChatOpen={isChatOpen}
        />

        {/* Modal for In-App Credential Changes */}
        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Gemini Multi-Turn AI Chatbot Component */}
        <GeminiChatbot
          currentUser={currentUser}
          isOpen={isChatOpen}
          onToggleOpen={() => setIsChatOpen((prev) => !prev)}
        />

      </div>

    </div>
  );
}
