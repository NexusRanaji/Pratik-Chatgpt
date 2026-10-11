import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Users, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Award,
  Smartphone
} from 'lucide-react';
import { UserCredential } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface LoginPageProps {
  onLoginSuccess: (user: UserCredential) => void;
  allUsers?: UserCredential[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, allUsers = [] }) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'superadmin' | 'parent'>('student');
  const [identifier, setIdentifier] = useState('student.rohan');
  const [password, setPassword] = useState('StudentPass#101');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick preset logins for fast testing across all roles & legacy accounts
  const quickPresets = [
    {
      role: 'student',
      label: 'Student (Rohan - Class 10A)',
      id: 'student.rohan',
      pass: 'StudentPass#101',
      badge: 'SSC Candidate',
      accent: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    },
    {
      role: 'student',
      label: 'Student (Aarav - Class 10A)',
      id: 'student.aarav',
      pass: 'StudentPass#101',
      badge: 'SSC Candidate',
      accent: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    },
    {
      role: 'student',
      label: 'Student Legacy (John Doe)',
      id: 'john@student.com',
      pass: 'student123',
      badge: 'Legacy Student',
      accent: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
    },
    {
      role: 'teacher',
      label: 'Faculty (Prof. Sharma - Physics)',
      id: 'teacher.sharma',
      pass: 'NexusTeacher#2025',
      badge: 'Senior Faculty',
      accent: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    },
    {
      role: 'teacher',
      label: 'Faculty Legacy (Examiner)',
      id: 'teacher@school.com',
      pass: 'teacher123',
      badge: 'Legacy Faculty',
      accent: 'border-teal-500/40 text-teal-600 dark:text-teal-400 bg-teal-500/10',
    },
    {
      role: 'superadmin',
      label: 'Super Admin (Dr. Deshmukh)',
      id: 'admin',
      pass: 'Admin@Nexus2025!',
      badge: 'Principal & Director',
      accent: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10',
    },
    {
      role: 'superadmin',
      label: 'Admin Legacy (Principal)',
      id: 'admin@school.com',
      pass: 'admin123',
      badge: 'Legacy Admin',
      accent: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10',
    },
    {
      role: 'parent',
      label: 'Parent (Mr. Rajesh Sharma)',
      id: 'parent.sharma',
      pass: 'ParentPass#2025',
      badge: 'Guardian of Rohan & Ananya',
      accent: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    },
  ];

  const handleRoleSelect = (role: 'student' | 'teacher' | 'superadmin' | 'parent') => {
    setSelectedRole(role);
    setError(null);
    if (role === 'student') {
      setIdentifier('student.rohan');
      setPassword('StudentPass#101');
    } else if (role === 'teacher') {
      setIdentifier('teacher.sharma');
      setPassword('NexusTeacher#2025');
    } else if (role === 'superadmin') {
      setIdentifier('admin');
      setPassword('Admin@Nexus2025!');
    } else if (role === 'parent') {
      setIdentifier('parent.sharma');
      setPassword('ParentPass#2025');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your institutional ID and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      if (rememberMe) {
        localStorage.setItem('nexus_remembered_user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      console.error('Login error:', err);
      // Fallback: check allUsers for matching credential
      const fallbackUser = allUsers.find(
        (u) =>
          (u.username && u.username.toLowerCase() === identifier.trim().toLowerCase()) ||
          (u.email && u.email.toLowerCase() === identifier.trim().toLowerCase()) ||
          (u.rollNo && u.rollNo.toLowerCase() === identifier.trim().toLowerCase()) ||
          (u.employeeId && u.employeeId.toLowerCase() === identifier.trim().toLowerCase())
      );

      if (fallbackUser) {
        onLoginSuccess(fallbackUser);
      } else {
        setError(err.message || 'Invalid school credentials or network connection issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Institutional Top Brand Bar */}
      <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-800 to-indigo-900 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-purple-950/50 shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-black text-sm sm:text-base text-slate-100 tracking-wide uppercase flex items-center gap-1.5">
              Nexus Ranaji English School
            </h1>
            <p className="text-[10px] text-amber-400 font-mono tracking-wider font-semibold">
              CBSE AFFILIATION #41029 • SCHOOL CODE: 10482
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Portal Active 2025-26
          </span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Institutional Value & Live Badges */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Proctored Online Examination System
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-100 tracking-tight leading-tight">
                Nexus Ranaji Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Examination Portal</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Authorized academic management and timed examination engine for students, faculty, and administrative leadership of Nexus Ranaji English High School.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Anti-Cheating Guard</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Window-blur &amp; browser tab-switching infraction audit.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">AI Exam Generator</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Instant quiz creation and AI tutor chat powered by Gemini.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">KaTeX Mathematical ($\LaTeX$)</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Full scientific formula, optics, and algebra equations.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Verified Certificates</h4>
                <p className="text-[11px] text-slate-400 leading-tight">Authentic PDF completion credentials with school seal.</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-slate-400" /> Mobile &amp; Desktop Optimized</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-slate-400" /> 256-bit Encrypted Sessions</span>
            </div>
          </div>

          {/* Right Column: Interactive Login Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-purple-950/20 backdrop-blur-xl space-y-5">
              
              {/* Role Selection Tabs */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Your Institutional Role:
                </p>
                <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('student')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'student'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px] truncate">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('teacher')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'teacher'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] truncate">Faculty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('superadmin')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'superadmin'
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] truncate">Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('parent')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      selectedRole === 'parent'
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-[10px] truncate">Parent</span>
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>Username, Roll No, or Institutional Email</span>
                    <span className="text-[10px] text-slate-500 font-mono">e.g. student.rohan</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter username or institutional ID"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>Password</span>
                    <span className="text-[10px] text-slate-500">Case-sensitive</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Remember this station</span>
                  </label>

                  <span className="text-[11px] text-amber-400/80">Authorized access only</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Examination Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Fill Section for Testing & Evaluators */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ⚡ Instant Demo Fill Accounts:
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1-Click Test</span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedRole(preset.role as any);
                        setIdentifier(preset.id);
                        setPassword(preset.pass);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between hover:scale-101 ${preset.accent}`}
                    >
                      <div className="font-bold text-[11px] truncate">{preset.label}</div>
                      <div className="flex items-center justify-between mt-1 text-[9px] opacity-80 font-mono">
                        <span className="truncate">{preset.id}</span>
                        <span className="font-sans px-1 rounded bg-black/20 text-[8px]">{preset.badge}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 px-4 sm:px-8 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-10">
        <div>
          © 2025–2026 Nexus Ranaji English High School. All rights reserved.
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>CBSE Curriculum Standard</span>
          <span>•</span>
          <span>Anti-Malpractice Monitored</span>
          <span>•</span>
          <span>Terms &amp; Academic Regulations</span>
        </div>
      </footer>

    </div>
  );
};
