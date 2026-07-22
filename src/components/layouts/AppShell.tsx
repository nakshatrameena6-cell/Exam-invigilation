import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Video, Upload, BarChart3, HelpCircle, Info, User,
  LogOut, ChevronLeft, ChevronRight, Menu, X, Search, Bell, Settings, Eye,
} from 'lucide-react';
import type { ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION, APP_VERSION } from '../../utils/constants';
import { Breadcrumb } from '../common/Breadcrumb';
import { ThemeToggleBtn } from '../common/ThemeToggle';

function getIconForNav(label: string): ElementType {
  const map: Record<string, ElementType> = {
    'Home': Home,
    'Live Monitoring': Video,
    'Upload Video': Upload,
    'Reports': BarChart3,
    'FAQ': HelpCircle,
    'About': Info,
    'Profile': User,
  };
  return map[label] || Home;
}

/* ── Sidebar ──────────────────────────────────────── */
function Sidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
  currentPath,
  userName,
  userRole,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
  currentPath: string;
  userName: string;
  userRole: string;
}) {
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-olive/10 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header with SecureX Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-olive/10 dark:border-slate-800">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="SecureX Logo" className="h-9 w-auto rounded-lg object-contain" />
              <span className="text-lg font-extrabold text-slate-900 dark:text-emerald-400 tracking-tight">Secure<span className="text-amber-500">X</span></span>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center">
              <img src="/logo.png" alt="SecureX Logo" className="h-8 w-auto rounded-lg object-contain" />
            </div>
          )}

          <button
            onClick={onCollapse}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-secondary-bg dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            onClick={onMobileClose}
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-secondary-bg dark:hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation items with Line Sidebar indicator */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {NAVIGATION.map((item) => {
            const Icon = getIconForNav(item.label);
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onMobileClose}
                className={`sidebar-item group ${isActive ? 'sidebar-item-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                {/* Line sidebar active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveLine"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-secondary-accent dark:bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-white dark:text-emerald-200' : 'text-primary dark:text-slate-400'}`} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.badge ? (
                  <span className="ml-auto rounded-full bg-warning px-2 py-0.5 text-xs font-semibold text-highlight">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-olive/10 dark:border-slate-800 p-3">
          <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-secondary-bg dark:bg-slate-800 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary dark:text-emerald-400">{initials}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{userName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Navbar ────────────────────────────────────────── */
function Navbar({
  currentLabel,
  onMenuClick,
  user,
  onLogout,
}: {
  currentLabel: string;
  onMenuClick: () => void;
  user: { name: string; role: string } | null;
  onLogout: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [profileOpen]);

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur-md border-b border-olive/10 dark:border-slate-800 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-secondary-bg dark:hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{currentLabel}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search…"
            aria-label="Search"
            className="h-10 w-64 rounded-xl border border-olive/10 dark:border-slate-800 bg-secondary-bg dark:bg-slate-800/60 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-olive transition-all"
          />
        </div>

        {/* Theme Toggle Button (Skiper UI) */}
        <ThemeToggleBtn />

        {/* Notification bell */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-secondary-bg dark:hover:bg-slate-800 transition-colors"
          aria-label="Notifications — 3 unread"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
          </span>
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-secondary-bg dark:hover:bg-slate-800 transition-colors"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Account menu"
          >
            <div className="h-8 w-8 rounded-full bg-secondary-bg dark:bg-slate-800 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary dark:text-emerald-400">{initials}</span>
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-olive/10 dark:border-slate-800 bg-white dark:bg-slate-900 py-1 shadow-soft"
                role="menu"
              >
                <div className="border-b border-olive/10 dark:border-slate-800 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                </div>

                <button
                  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-secondary-bg dark:hover:bg-slate-800 transition-colors"
                  role="menuitem"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profile
                </button>
                <button
                  onClick={() => { setProfileOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-secondary-bg dark:hover:bg-slate-800 transition-colors"
                  role="menuitem"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </button>

                <div className="border-t border-olive/10 dark:border-slate-800 mt-1 pt-1">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

/* ── Breadcrumb builder ────────────────────────────── */
function buildBreadcrumb(pathname: string): { label: string; path?: string }[] {
  if (pathname === '/') return [];
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => {
    const label = seg
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const path = '/' + segments.slice(0, i + 1).join('/');
    return { label, path: i < segments.length - 1 ? path : undefined };
  });
}

/* ── Main Shell ────────────────────────────────────── */
export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentLabel = NAVIGATION.find(
    (item) => item.path === currentPath || (item.path !== '/' && currentPath.startsWith(item.path)),
  )?.label || 'Dashboard';
  const breadcrumbItems = buildBreadcrumb(currentPath);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handler = () => {
      if (mql.matches) setMobileOpen(false);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-slate-950 transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileOpen(false)}
        currentPath={currentPath}
        userName={user?.name || 'User'}
        userRole={user?.role || 'user'}
      />

      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Navbar
          currentLabel={currentLabel}
          onMenuClick={() => setMobileOpen(true)}
          user={user ? { name: user.name, role: user.role } : null}
          onLogout={logout}
        />

        <main className="flex-1 p-4 lg:p-6">
          {breadcrumbItems.length > 0 && (
            <div className="mb-4">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-olive/10 dark:border-slate-800 px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SecureX" className="h-4 w-auto" />
              <span>© {new Date().getFullYear()} <strong>SecureX</strong>. All rights reserved.</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600 font-semibold tracking-wider uppercase text-[10px]">AI-Powered Exam Monitoring. | Fairness Ensured.</span>
            <span>v{APP_VERSION}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
