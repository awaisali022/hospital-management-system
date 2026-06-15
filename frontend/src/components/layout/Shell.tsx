import { Activity, Bell, Bot, CalendarCheck, ChevronRight, LayoutDashboard, LogOut, Menu, Shield, Sparkles, Stethoscope, User, Users } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { themes, useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from '../ui/Button';

const nav = [
  { to: '/', label: 'Home', icon: Activity, public: true },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope, public: true },
  { to: '/patient', label: 'Patient', icon: CalendarCheck, role: 'patient' },
  { to: '/doctor', label: 'Doctor', icon: LayoutDashboard, role: 'doctor' },
  { to: '/assistant', label: 'Assistant', icon: Bell, role: 'assistant' },
  { to: '/admin', label: 'Admin', icon: Users, role: 'admin' },
  { to: '/super-admin', label: 'Super Admin', icon: Shield, role: 'super_admin' },
  { to: '/ai', label: 'AI', icon: Bot, protected: true }
];

export function Shell({ children }: PropsWithChildren) {
  const { theme, setTheme, customThemeColors } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Filter links based on user status
  const visibleNav = nav.filter((item) => {
    if (item.public) return true;
    if (!isAuthenticated) return false;
    if (item.protected) return true;
    return item.role === user?.role;
  });

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const customStyles = theme === 'custom' ? {
    '--background': customThemeColors.background,
    '--foreground': customThemeColors.foreground,
    '--primary': customThemeColors.primary,
    '--accent': customThemeColors.accent,
    '--border': customThemeColors.border,
  } as React.CSSProperties : undefined;

  return (
    <div data-theme={theme} style={customStyles} className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="group flex items-center gap-3 text-lg font-black tracking-wide">
            <span className="grid size-11 place-items-center rounded-lg border border-primary/40 bg-primary text-slate-950 shadow-glow transition group-hover:-rotate-3">
              <Stethoscope size={20} />
            </span>
            <span>
              <span className="block leading-none">Doctor Hub</span>
              <span className="hidden text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:block">AI Healthcare OS</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as typeof theme)}
              className="hidden rounded-md border border-border/80 bg-background/75 px-3 py-2 text-sm font-bold capitalize outline-none transition focus:border-primary md:block"
              aria-label="Theme"
            >
              {themes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-sm font-semibold">
                  {user.firstName} {user.lastName} ({user.role})
                </span>
                <span className="grid size-9 place-items-center rounded-full border border-primary/30 bg-primary/15 text-primary">
                  <User size={16} />
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="!min-h-9 !px-2 !py-0 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/auth')} className="!min-h-9">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[92rem] gap-5 px-4 py-5 lg:grid-cols-[17rem_1fr]">
        <nav className="glass-panel flex gap-2 overflow-x-auto p-2 lg:sticky lg:top-20 lg:block lg:h-[calc(100vh-6.5rem)] lg:overflow-y-auto">
          <div className="mb-3 hidden rounded-md border border-primary/20 bg-primary/10 p-3 lg:block">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={16} />
              <p className="text-xs font-black uppercase tracking-[0.18em]">Care Modules</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-foreground/60">Role-aware navigation for patients, doctors, assistants, and admins.</p>
          </div>
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group mb-1 flex min-w-fit items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-primary text-slate-950 shadow-glow' : 'text-foreground/72 hover:bg-white/10 hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </span>
                  {isActive ? <ChevronRight size={15} /> : <ChevronRight size={15} className="hidden opacity-35 group-hover:block" />}
                </>
              )}
            </NavLink>
          ))}
          <div className="mt-3 hidden rounded-md border border-border/50 bg-background/35 p-3 lg:block">
            <div className="flex items-center gap-2 text-foreground/70">
              <Menu size={15} />
              <p className="text-xs font-black uppercase tracking-[0.16em]">System</p>
            </div>
            <div className="mt-3 space-y-2 text-xs text-foreground/55">
              <div className="flex justify-between"><span>API</span><span className="text-green-400">Live</span></div>
              <div className="flex justify-between"><span>MongoDB</span><span className="text-green-400">Atlas</span></div>
              <div className="flex justify-between"><span>Security</span><span className="text-primary">RBAC</span></div>
            </div>
          </div>
        </nav>
        <main className="min-w-0 pb-10">{children}</main>
      </div>
    </div>
  );
}
