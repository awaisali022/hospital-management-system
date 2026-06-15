import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Fingerprint, KeyRound, Mail, ShieldAlert, ShieldCheck, Stethoscope, User, UserPlus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/auth.store';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'assistant' | 'admin' | 'super_admin';
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
}

const trustItems = [
  ['RBAC protected', ShieldCheck],
  ['Audit-ready', Activity],
  ['Secure sessions', Fingerprint]
];

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'assistant' | 'admin'>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister ? { email, password, firstName, lastName, role } : { email, password };
      const res = await api<AuthResponse>(endpoint, { method: 'POST', body: JSON.stringify(body) });

      setAuth(res.user, res.accessToken, res.refreshToken);

      if (res.user.role === 'patient') navigate('/patient');
      else if (res.user.role === 'doctor') navigate('/doctor');
      else if (res.user.role === 'assistant') navigate('/assistant');
      else if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'super_admin') navigate('/super-admin');
      else navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[78vh] items-center gap-6 py-6 lg:grid-cols-[1fr_30rem]">
      <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
        <Panel className="relative min-h-[34rem] overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,hsl(var(--primary)/0.22),transparent_22rem),radial-gradient(circle_at_90%_80%,hsl(var(--accent)/0.18),transparent_20rem)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="eyebrow">Identity Gateway</p>
              <h1 className="mt-4 max-w-xl text-5xl font-black leading-tight">
                Secure access for the whole care network.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-foreground/65">
                Patients, doctors, assistants, admins, and super admins enter role-specific dashboards through one polished authentication flow.
              </p>
            </div>

            <div className="grid gap-3">
              {trustItems.map(([label, Icon]) => (
                <div key={label as string} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/45 p-4">
                  <span className="grid size-11 place-items-center rounded-md bg-primary/15 text-primary">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="font-black">{label as string}</p>
                    <p className="text-xs text-foreground/50">Enterprise healthcare access control</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <Panel className="relative overflow-hidden border-primary/20 p-6 shadow-glow md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.18),transparent_18rem)]" />
          <div className="relative">
            <div className="mb-7 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-lg border border-primary/35 bg-primary/15 text-primary">
                {isRegister ? <UserPlus size={26} /> : <Stethoscope size={26} />}
              </span>
              <p className="eyebrow mt-5">{isRegister ? 'Create Account' : 'Welcome Back'}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">
                {isRegister ? 'Join Doctor Hub' : 'Sign in to your portal'}
              </h1>
              <p className="mt-2 text-sm text-foreground/58">
                {isRegister ? 'Register and open your role workspace.' : 'Access your healthcare command center.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-300">
                <ShieldAlert size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label>
                    <span className="text-xs font-black uppercase tracking-wider text-foreground/55">First Name</span>
                    <span className="relative mt-1 block">
                      <User className="absolute left-3 top-3.5 text-foreground/35" size={16} />
                      <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="field pl-9" placeholder="Jane" />
                    </span>
                  </label>
                  <label>
                    <span className="text-xs font-black uppercase tracking-wider text-foreground/55">Last Name</span>
                    <span className="relative mt-1 block">
                      <User className="absolute left-3 top-3.5 text-foreground/35" size={16} />
                      <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="field pl-9" placeholder="Doe" />
                    </span>
                  </label>
                </div>
              )}

              <label>
                <span className="text-xs font-black uppercase tracking-wider text-foreground/55">Email Address</span>
                <span className="relative mt-1 block">
                  <Mail className="absolute left-3 top-3.5 text-foreground/35" size={16} />
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-9" placeholder="jane@example.com" />
                </span>
              </label>

              <label>
                <span className="text-xs font-black uppercase tracking-wider text-foreground/55">Password</span>
                <span className="relative mt-1 block">
                  <KeyRound className="absolute left-3 top-3.5 text-foreground/35" size={16} />
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field pl-9" placeholder="Minimum 8 characters" />
                </span>
              </label>

              {isRegister && (
                <label>
                  <span className="text-xs font-black uppercase tracking-wider text-foreground/55">Register As</span>
                  <select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="field mt-1 capitalize">
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="assistant">Assistant</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-6 rounded-md border border-border/60 bg-background/35 p-3 text-center text-sm text-foreground/58">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="font-black text-primary hover:underline"
              >
                {isRegister ? 'Sign in' : 'Create one'}
              </button>
            </div>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}
