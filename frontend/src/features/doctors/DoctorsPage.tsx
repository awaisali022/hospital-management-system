import { CalendarPlus, CheckCircle2, Clock, Filter, HeartPulse, MapPin, Search, ShieldCheck, Sparkles, Star, Video } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';

const doctors = [
  {
    name: 'Dr. Ayesha Khan',
    spec: 'Cardiology',
    city: 'Lahore',
    rating: 4.9,
    fee: 4500,
    exp: 12,
    slots: 'Today, 6:30 PM',
    mode: 'Clinic + Video',
    focus: ['Chest pain', 'Hypertension', 'ECG review'],
    color: 'from-rose-400/24'
  },
  {
    name: 'Dr. Hamza Ali',
    spec: 'Neurology',
    city: 'Karachi',
    rating: 4.8,
    fee: 5200,
    exp: 10,
    slots: 'Tomorrow, 11:00 AM',
    mode: 'Video consult',
    focus: ['Migraine', 'Seizures', 'Nerve pain'],
    color: 'from-blue-400/24'
  },
  {
    name: 'Dr. Sana Malik',
    spec: 'Dermatology',
    city: 'Islamabad',
    rating: 4.7,
    fee: 3800,
    exp: 8,
    slots: 'Fri, 4:00 PM',
    mode: 'Clinic visit',
    focus: ['Acne', 'Eczema', 'Skin allergy'],
    color: 'from-emerald-400/24'
  }
];

const quickFilters = ['Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 'Mental Health'];

export function DoctorsPage() {
  return (
    <div className="space-y-6">
      <Panel className="relative overflow-hidden p-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,hsl(var(--primary)/0.2),transparent_30rem)]" />
        <div className="relative grid gap-6 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
          <div>
            <p className="eyebrow">Doctor Discovery</p>
            <h1 className="page-title mt-3">Find the right specialist faster</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/68 md:text-base">
              Search by disease, specialty, treatment type, city, availability, consultation mode, experience, and rating.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {quickFilters.map((item) => (
                <span key={item} className="rounded-md border border-border/70 bg-background/45 px-3 py-2 text-xs font-black text-foreground/70">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid content-end gap-3">
            <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary" />
                <div>
                  <p className="font-black">AI match ready</p>
                  <p className="text-xs text-foreground/58">Recommendation engine can map symptoms to specialists.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['120+', 'Doctors'],
                ['18', 'Cities'],
                ['4.8', 'Avg rating']
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-border/60 bg-background/45 p-3">
                  <p className="text-xl font-black text-primary">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/45">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          <h2 className="text-lg font-black">Smart Filters</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-[1.3fr_0.8fr_0.8fr_0.7fr_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-3.5 text-foreground/40" size={18} />
            <input className="field pl-10" placeholder="Disease, treatment, doctor, symptom..." />
          </label>
          <input className="field" placeholder="City" />
          <input className="field" placeholder="Specialization" />
          <select className="field">
            <option>Any time</option>
            <option>Today</option>
            <option>This week</option>
          </select>
          <Button>
            <Search size={16} />
            Search
          </Button>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <Panel key={doctor.name} className="soft-card-hover p-0">
            <div className={`h-24 bg-gradient-to-br ${doctor.color} via-primary/12 to-transparent`} />
            <div className="-mt-10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-end gap-3">
                  <div className="grid size-16 place-items-center rounded-lg border border-primary/30 bg-background text-xl font-black text-primary shadow-glow">
                    {doctor.name.split(' ')[1]?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{doctor.name}</h2>
                    <p className="font-bold text-primary">{doctor.spec}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-md border border-yellow-400/25 bg-yellow-400/10 px-2 py-1 text-sm font-black text-yellow-300">
                  <Star size={14} /> {doctor.rating}
                </span>
              </div>

              <div className="mt-5 grid gap-2 text-sm">
                <div className="flex items-center justify-between rounded-md border border-border/50 bg-background/35 px-3 py-2">
                  <span className="flex items-center gap-2 text-foreground/58"><MapPin size={15} /> City</span>
                  <strong>{doctor.city}</strong>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border/50 bg-background/35 px-3 py-2">
                  <span className="flex items-center gap-2 text-foreground/58"><Clock size={15} /> Next slot</span>
                  <strong>{doctor.slots}</strong>
                </div>
                <div className="flex items-center justify-between rounded-md border border-border/50 bg-background/35 px-3 py-2">
                  <span className="flex items-center gap-2 text-foreground/58"><Video size={15} /> Mode</span>
                  <strong>{doctor.mode}</strong>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {doctor.focus.map((item) => (
                  <span key={item} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {item}
                  </span>
                ))}
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-md border border-border/50 bg-white/[0.04] p-3">
                  <dt className="text-[10px] font-bold uppercase text-foreground/42">Fee</dt>
                  <dd className="mt-1 font-black">Rs {doctor.fee}</dd>
                </div>
                <div className="rounded-md border border-border/50 bg-white/[0.04] p-3">
                  <dt className="text-[10px] font-bold uppercase text-foreground/42">Exp</dt>
                  <dd className="mt-1 font-black">{doctor.exp} yrs</dd>
                </div>
                <div className="rounded-md border border-border/50 bg-white/[0.04] p-3">
                  <dt className="text-[10px] font-bold uppercase text-foreground/42">Status</dt>
                  <dd className="mt-1 flex justify-center text-green-400"><CheckCircle2 size={18} /></dd>
                </div>
              </dl>

              <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                <Button>
                  <CalendarPlus size={16} />
                  Book
                </Button>
                <Button variant="ghost" title="Verified profile">
                  <ShieldCheck size={17} />
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <span className="grid size-12 place-items-center rounded-lg bg-primary/15 text-primary">
          <HeartPulse />
        </span>
        <div>
          <h2 className="text-lg font-black">Need help choosing?</h2>
          <p className="text-sm text-foreground/62">Use the AI assistant to convert symptoms into the right specialist category.</p>
        </div>
        <Button variant="ghost">Open AI Assistant</Button>
      </Panel>
    </div>
  );
}
