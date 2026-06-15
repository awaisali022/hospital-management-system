import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, CalendarDays, CheckCircle2, CreditCard, FileText, 
  LockKeyhole, Settings, Users, PlusCircle, Check, X, Search, 
  Sparkles, ShieldCheck, Stethoscope, Video, HeartPulse, Send,
  Play, ShieldAlert, Cpu, ToggleLeft, ToggleRight, Globe, Database,
  Wifi, Clock, Shield, Activity
} from 'lucide-react';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { ThemeSettings } from '../../components/ui/ThemeSettings';
import { LiveChatPanel, VideoConsultRoom } from '../../components/realtime/ChatAndVideo';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../lib/api';

const roleConfig = {
  patient: {
    title: 'Patient Portal',
    items: ['Book Doctor', 'My Appointments', 'Medical History', 'Prescriptions', 'Upload Reports', 'AI Nav Room', 'Chat Cabinet', 'My Profile']
  },
  doctor: {
    title: 'Doctor Console',
    items: ['Manage Schedule', 'Appointments', 'Patient Records', 'Prescriptions Manager', 'Video Consult Room', 'Analytics Cabinet', 'My Clinics', 'My Profile']
  },
  assistant: {
    title: 'Assistant Panel',
    items: ['Payment Verification', 'Appointment Dispatch', 'Queue Management', 'Analytics Reports']
  },
  admin: {
    title: 'Admin Command',
    items: ['User Control', 'Verify Doctors', 'Security Center', 'Audit logs']
  },
  superAdmin: {
    title: 'Super Admin Shield',
    items: ['Global Dashboard', 'Security Center', 'Permissions Control', 'System Settings', 'Audit Stream']
  }
};

const tabIcons: Record<string, any> = {
  'Book Doctor': Search,
  'My Appointments': CalendarCheckSquare,
  'Medical History': HeartPulse,
  'Prescriptions': FileText,
  'Upload Reports': PlusCircle,
  'AI Nav Room': Sparkles,
  'Chat Cabinet': Stethoscope,
  'My Profile': Settings,
  'Manage Schedule': CalendarDays,
  'Appointments': CalendarCheckSquare,
  'Patient Records': Users,
  'Prescriptions Manager': FileText,
  'Video Consult Room': Video,
  'Analytics Cabinet': BarChart3,
  'My Clinics': HeartPulse,
  'Payment Verification': CreditCard,
  'Appointment Dispatch': CheckCircle2,
  'Queue Management': Users,
  'Analytics Reports': BarChart3,
  'User Control': Users,
  'Verify Doctors': ShieldCheck,
  'Security Center': LockKeyhole,
  'Audit logs': FileText,
  'Global Dashboard': BarChart3,
  'Permissions Control': LockKeyhole,
  'System Settings': Settings,
  'Audit Stream': FileText
};

function CalendarCheckSquare(props: any) {
  return <CalendarDays {...props} />;
}

export function DashboardPage({ role }: { role: keyof typeof roleConfig }) {
  const config = roleConfig[role];
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(config.items[0]);

  // Mock State for UI simulations
  const [doctorsList, setDoctorsList] = useState<any[]>([
    { id: 'd1', name: 'Dr. Ayesha Khan', spec: 'Cardiology', city: 'Lahore', rating: 4.9, fee: 3500, exp: 12 },
    { id: 'd2', name: 'Dr. Hamza Ali', spec: 'Neurology', city: 'Karachi', rating: 4.8, fee: 4000, exp: 10 },
    { id: 'd3', name: 'Dr. Sana Malik', spec: 'Dermatology', city: 'Islamabad', rating: 4.7, fee: 2500, exp: 8 }
  ]);
  const [appointments, setAppointments] = useState<any[]>([
    { id: 'a1', doctorName: 'Dr. Ayesha Khan', spec: 'Cardiology', date: '2026-06-10', type: 'clinic', status: 'pending_payment', fee: 3500, complaint: 'Mild chest heaviness' },
    { id: 'a2', doctorName: 'Dr. Hamza Ali', spec: 'Neurology', date: '2026-06-15', type: 'video', status: 'confirmed', fee: 4000, complaint: 'Frequent migraine spells' }
  ]);
  const [medicalHistories, setMedicalHistories] = useState<any[]>([
    { id: 'h1', doctorName: 'Dr. Sana Malik', date: '2026-05-20', diagnosis: 'Mild Eczema', symptoms: ['Itchiness', 'Redness'], treatment: 'Apply Hydrocortisone cream twice daily' }
  ]);
  const [prescriptions, setPrescriptions] = useState<any[]>([
    { id: 'pr1', doctorName: 'Dr. Hamza Ali', date: '2026-06-02', medications: [{ name: 'Sumatriptan', dosage: '50mg', frequency: 'Once daily', duration: '5 days', instructions: 'Take during aura onset' }] }
  ]);
  
  // Interactive state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchSpec, setSearchSpec] = useState('');
  
  // Booking Form State
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingType, setBookingType] = useState<'clinic' | 'video' | 'home'>('clinic');
  const [bookingComplaint, setBookingComplaint] = useState('');
  
  // Payment upload Form State
  const [selectedApptForPay, setSelectedApptForPay] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'card' | 'cash' | 'wallet'>('bank_transfer');
  const [payProofUrl, setPayProofUrl] = useState('https://res.cloudinary.com/demo/image/upload/payment_proof.jpg');

  // AI assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Chat Cabinet state
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState<any[]>([
    { sender: 'doctor', text: 'Hello Jane, I reviewed your previous migraine records. Let me know when you register the payment.', time: '10:15 AM' }
  ]);

  // Doctor availability state
  const [scheduleSlots, setScheduleSlots] = useState<any[]>([
    { day: 'Monday', starts: '09:00 AM', ends: '01:00 PM', clinic: 'MidCity Hospital' },
    { day: 'Wednesday', starts: '02:00 PM', ends: '06:00 PM', clinic: 'Teal Cardiology Wing' }
  ]);
  const [newSlotDay, setNewSlotDay] = useState('Monday');
  const [newSlotStart, setNewSlotStart] = useState('09:00 AM');
  const [newSlotEnd, setNewSlotEnd] = useState('12:00 PM');
  const [newSlotClinic, setNewSlotClinic] = useState('Central Clinic');

  // Doctor Append History State
  const [selectedApptForDiag, setSelectedApptForDiag] = useState<any>(null);
  const [diagText, setDiagText] = useState('');
  const [symptomTags, setSymptomTags] = useState('');
  const [treatmentText, setTreatmentText] = useState('');
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDur, setMedDur] = useState('');
  const [medsList, setMedsList] = useState<any[]>([]);

  // Assistant Audit queues
  const [payQueue, setPayQueue] = useState<any[]>([
    { id: 'p1', patientName: 'Jane Doe', appointmentId: 'a1', amount: 3500, method: 'bank_transfer', proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', status: 'submitted' }
  ]);
  const [dispatchQueue, setDispatchQueue] = useState<any[]>([
    { id: 'appt1', patientName: 'Jane Doe', doctorName: 'Dr. Ayesha Khan', date: '2026-06-10', complaint: 'Mild chest heaviness', status: 'payment_verified' }
  ]);

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<any[]>([
    { id: 'u1', name: 'Jane Doe', email: 'jane@example.com', role: 'patient', active: true },
    { id: 'u2', name: 'Dr. Ayesha Khan', email: 'ayesha@example.com', role: 'doctor', active: true },
    { id: 'u3', name: 'Bob Assistant', email: 'bob@example.com', role: 'assistant', active: true }
  ]);

  // Super Admin security audit stream
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { actor: 'Jane Doe', action: 'auth.login', resource: 'User', date: '2026-06-02 08:58 AM' },
    { actor: 'Dr. Hamza Ali', action: 'prescription.created', resource: 'Prescription', date: '2026-06-02 08:30 AM' },
    { actor: 'Super Admin', action: 'security.rbac_modify', resource: 'Role', date: '2026-06-01 10:12 PM' }
  ]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    const newAppt = {
      id: `a${Date.now()}`,
      doctorName: selectedDoc.name,
      spec: selectedDoc.spec,
      date: bookingDate,
      type: bookingType,
      status: 'pending_payment',
      fee: selectedDoc.fee,
      complaint: bookingComplaint
    };
    setAppointments([newAppt, ...appointments]);
    
    // Add transaction audit log
    setAuditLogs([{ actor: user?.firstName || 'Patient', action: 'appointment.booked', resource: 'Appointment', date: new Date().toLocaleString() }, ...auditLogs]);

    // Reset Form
    setSelectedDoc(null);
    setBookingComplaint('');
    setBookingDate('');
    alert('Appointment booked successfully! Pls check My Appointments to submit proof of payment.');
  };

  const handleUploadPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptForPay) return;
    // Update appointment status to payment_submitted
    setAppointments(appointments.map(a => a.id === selectedApptForPay.id ? { ...a, status: 'payment_submitted' } : a));
    // Append to payment verification queue
    const newPayProof = {
      id: `p${Date.now()}`,
      patientName: `${user?.firstName} ${user?.lastName}`,
      appointmentId: selectedApptForPay.id,
      amount: Number(payAmount),
      method: payMethod,
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      status: 'submitted'
    };
    setPayQueue([newPayProof, ...payQueue]);

    setSelectedApptForPay(null);
    alert('Payment proof uploaded successfully! Awaiting Assistant verification.');
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSlots([...scheduleSlots, { day: newSlotDay, starts: newSlotStart, ends: newSlotEnd, clinic: newSlotClinic }]);
    alert('Availability slot added!');
  };

  const handleAddMed = () => {
    if (!medName || !medDosage) return;
    setMedsList([...medsList, { name: medName, dosage: medDosage, frequency: medFreq, duration: medDur }]);
    setMedName(''); setMedDosage(''); setMedFreq(''); setMedDur('');
  };

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApptForDiag) return;

    // Create append-only history
    const newHist = {
      id: `h${Date.now()}`,
      doctorName: user ? `Dr. ${user.lastName}` : 'Dr. Self',
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagText,
      symptoms: symptomTags.split(',').map(s => s.trim()),
      treatment: treatmentText
    };
    setMedicalHistories([newHist, ...medicalHistories]);

    // Create immutable prescription
    if (medsList.length > 0) {
      const newPresc = {
        id: `pr${Date.now()}`,
        doctorName: user ? `Dr. ${user.lastName}` : 'Dr. Self',
        date: new Date().toISOString().split('T')[0],
        medications: medsList
      };
      setPrescriptions([newPresc, ...prescriptions]);
    }

    // Complete appointment
    setAppointments(appointments.map(a => a.id === selectedApptForDiag.id ? { ...a, status: 'completed' } : a));

    setSelectedApptForDiag(null);
    setDiagText('');
    setSymptomTags('');
    setTreatmentText('');
    setMedsList([]);
    alert('Medical diagnosis recorded and prescription finalized! Patient record appended.');
  };

  // AI Service Simulation
  const handleAiPrompt = async (mode: string) => {
    if (!aiPrompt && mode !== 'trends') return;
    setAiLoading(true);
    setAiResponse(null);

    // Dynamic NLP mock simulations
    setTimeout(() => {
      let ans = '';
      if (mode === 'chat') {
        ans = `Based on your symptoms: "${aiPrompt}", you describe patterns of primary healthcare concern. There are no sudden high-risk flags detected. I recommend arranging a clinic consult with a General Physician to review vitals.`;
      } else if (mode === 'symptom') {
        const isUrgent = /chest pain|breath|faint|stroke/i.test(aiPrompt);
        ans = `SYMPTOM ANALYSIS REPORT:\n- Input: ${aiPrompt}\n- Risk level: ${isUrgent ? 'URGENT/CRITICAL' : 'ROUTINE/EDUCATIONAL'}\n- Suggested Specialist: ${isUrgent ? 'Cardiologist/Emergency' : 'General Practitioner'}\n- Guidance: Acceptable education guidance only. If severity increases, visit the nearest emergency room.`;
      } else if (mode === 'recommend') {
        ans = `RECOMMENDED CARE DIRECTORY SPECIALIZATION:\n- Disease match: ${aiPrompt}\n- Specialized Area: Gastroenterology or Internal Medicine\n- Direct match in Lahore: Dr. Ayesha Khan (Cardiology / Medicine).`;
      } else if (mode === 'report') {
        ans = `CLINICAL REPORT COMPREHENSION:\n- Document context: ${aiPrompt}\n- Primary values highlighted: Glucose Levels: 110mg/dL (pre-diabetic boundary), HbA1c: 5.8%.\n- Critical notes: Marginally elevated metabolic indicators. Suggest scheduling a physician review.`;
      } else if (mode === 'prescription') {
        ans = `MEDICATION DOSAGE SUMMARY:\n- Sumatriptan 50mg: Migraine specific relief. Do not exceed 100mg in 24 hours. Take with water immediately upon headache aura onset. Avoid trigger lights.`;
      } else if (mode === 'trends') {
        ans = `HEALTH ANALYTICS DASHBOARD SUMMARY:\n- Overall health trend index: 92/100 (Optimal)\n- Previous diagnoses: Mild Eczema\n- Scheduled review intervals: Monthly cardiac screening slots verified.`;
      }
      setAiResponse(ans);
      setAiLoading(false);
    }, 1000);
  };

  // Chat sending
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage) return;
    setChatLogs([...chatLogs, { sender: 'patient', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMessage('');
  };

  // Assistant triggers
  const handleVerifyPayment = (payId: string, verify: boolean) => {
    const pay = payQueue.find(p => p.id === payId);
    if (!pay) return;
    // Remove from payQueue
    setPayQueue(payQueue.filter(p => p.id !== payId));
    if (verify) {
      // Update appointment status to payment_verified
      setAppointments(appointments.map(a => a.id === pay.appointmentId ? { ...a, status: 'payment_verified' } : a));
      // Add to dispatch queue
      const appt = appointments.find(a => a.id === pay.appointmentId);
      setDispatchQueue([...dispatchQueue, {
        id: pay.appointmentId,
        patientName: pay.patientName,
        doctorName: appt ? appt.doctorName : 'Dr. Hub Expert',
        date: appt ? appt.date : 'Pending date',
        complaint: appt ? appt.complaint : 'General checkup',
        status: 'payment_verified'
      }]);
      alert('Proof of payment verified! Ticket forwarded to Dispatch panel.');
    } else {
      setAppointments(appointments.map(a => a.id === pay.appointmentId ? { ...a, status: 'pending_payment' } : a));
      alert('Proof of payment rejected.');
    }
  };

  const handleDispatchAppt = (apptId: string) => {
    setDispatchQueue(dispatchQueue.filter(d => d.id !== apptId));
    setAppointments(appointments.map(a => a.id === apptId ? { ...a, status: 'confirmed' } : a));
    alert('Appointment officially confirmed and dispatched to Doctor queue!');
  };

  const filteredDocs = doctorsList.filter(d => {
    const matchesQ = searchQuery ? (d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.spec.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    const matchesCity = searchCity ? d.city.toLowerCase() === searchCity.toLowerCase() : true;
    const matchesSpec = searchSpec ? d.spec.toLowerCase() === searchSpec.toLowerCase() : true;
    return matchesQ && matchesCity && matchesSpec;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
      {/* Tab Select Sidebar */}
      <Panel className="sticky top-20 flex h-fit max-h-[calc(100vh-6rem)] flex-col gap-1 overflow-y-auto p-3">
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
          <p className="eyebrow">{roleConfig[role].title}</p>
          <p className="mt-2 text-lg font-black text-foreground">{user?.firstName} {user?.lastName}</p>
          <p className="mt-1 text-xs leading-5 text-foreground/58">Live operational workspace with RBAC-aware healthcare tools.</p>
        </div>
        {config.items.map((item) => {
          const Icon = tabIcons[item] || Settings;
          const isActive = activeTab === item;
          return (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-black transition ${
                isActive
                  ? 'bg-primary text-slate-950 shadow-glow'
                  : 'text-foreground/70 hover:bg-white/10 hover:text-foreground'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{item}</span>
            </button>
          );
        })}
      </Panel>

      {/* Main Tab Dashboard Canvas */}
      <div className="space-y-6">
        <Panel className="relative overflow-hidden p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.22),transparent_26rem)]" />
          <div className="relative grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow">Active Workspace</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">{activeTab}</h1>
              <p className="mt-2 text-sm leading-6 text-foreground/62">Secure dashboard mode connected to role permissions, audit actions, and care operations.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ['RBAC', 'Guard'],
                ['Live', 'Socket'],
                ['AI', 'Ready']
              ].map(([value, label]) => (
                <div key={label} className="rounded-md border border-border/60 bg-background/45 px-4 py-3">
                  <p className="text-sm font-black text-primary">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/45">{label}</p>
                </div>
              ))}
            </div>
            <Cpu size={84} className="absolute -right-4 -top-5 text-primary/10" />
          </div>
        </Panel>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* ======================================================== */}
            {/* PATIENT PORTAL TABS */}
            {/* ======================================================== */}
            
            {activeTab === 'Book Doctor' && (
              <div className="space-y-4">
                <Panel className="grid gap-3 md:grid-cols-4">
                  <label className="relative block">
                    <Search className="absolute left-3 top-3 text-foreground/30" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Doctor name, specialization..."
                      className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </label>
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder="City (e.g. Lahore)"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={searchSpec}
                    onChange={(e) => setSearchSpec(e.target.value)}
                    placeholder="Spec (e.g. Cardiology)"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <Button onClick={() => { setSearchQuery(''); setSearchCity(''); setSearchSpec(''); }}>Reset Filters</Button>
                </Panel>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocs.map((doc) => (
                    <Panel key={doc.id} className="border border-border/50 bg-background/40">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-lg">{doc.name}</h3>
                          <p className="text-primary text-xs uppercase font-bold">{doc.spec}</p>
                        </div>
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">{doc.rating} ★</span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs border-t border-border/20 pt-3">
                        <div>
                          <p className="text-foreground/50">City</p>
                          <p className="font-bold">{doc.city}</p>
                        </div>
                        <div>
                          <p className="text-foreground/50">Fee</p>
                          <p className="font-bold">Rs {doc.fee}</p>
                        </div>
                        <div>
                          <p className="text-foreground/50">Exp</p>
                          <p className="font-bold">{doc.exp} yrs</p>
                        </div>
                      </div>
                      <Button onClick={() => setSelectedDoc(doc)} className="mt-4 w-full">Book Consult</Button>
                    </Panel>
                  ))}
                </div>

                {selectedDoc && (
                  <Panel className="border border-primary/20 bg-background/60">
                    <h3 className="text-lg font-black mb-3">Booking Consult with {selectedDoc.name}</h3>
                    <form onSubmit={handleBookAppointment} className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Preferred Date</label>
                          <input required type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Consultation Type</label>
                          <select value={bookingType} onChange={(e: any) => setBookingType(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none">
                            <option value="clinic">In-Clinic Visit</option>
                            <option value="video">Virtual Video Consultation</option>
                            <option value="home">Home Service</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Consultation Fee</label>
                          <input disabled type="text" value={`Rs ${selectedDoc.fee}`} className="mt-1 w-full rounded-md border border-border bg-background/50 p-2 text-sm text-foreground/50 cursor-not-allowed" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-foreground/60">Chief Complaint / Notes</label>
                        <textarea required value={bookingComplaint} onChange={(e) => setBookingComplaint(e.target.value)} rows={3} placeholder="Briefly explain your health concern..." className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={() => setSelectedDoc(null)}>Cancel</Button>
                        <Button type="submit">Confirm & Request</Button>
                      </div>
                    </form>
                  </Panel>
                )}
              </div>
            )}

            {activeTab === 'My Appointments' && (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <Panel className="text-center py-8 text-foreground/50">You have no registered appointments.</Panel>
                ) : (
                  appointments.map((appt) => (
                    <Panel key={appt.id} className="border border-border/40 bg-background/20">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-black text-lg">{appt.doctorName}</h3>
                          <p className="text-xs text-foreground/50 capitalize">{appt.type} consult • {appt.date}</p>
                          <p className="mt-2 text-sm text-foreground/80"><span className="font-bold text-foreground/60">Complaint:</span> {appt.complaint}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            appt.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            appt.status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-primary/10 text-primary border border-primary/20'
                          }`}>
                            {appt.status.replace('_', ' ')}
                          </span>
                          <p className="mt-1 text-sm font-black text-foreground">Rs {appt.fee}</p>
                        </div>
                      </div>

                      {appt.status === 'pending_payment' && (
                        <div className="mt-4 border-t border-border/20 pt-4 flex justify-end">
                          <Button onClick={() => setSelectedApptForPay(appt)}>Upload Proof of Payment</Button>
                        </div>
                      )}
                    </Panel>
                  ))
                )}

                {selectedApptForPay && (
                  <Panel className="border border-primary/20 bg-background/60">
                    <h3 className="text-lg font-black mb-3">Upload Payment Receipt for {selectedApptForPay.doctorName}</h3>
                    <form onSubmit={handleUploadPayment} className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Verified Amount (PKR)</label>
                          <input required type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" placeholder={selectedApptForPay.fee} />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Transfer Channel</label>
                          <select value={payMethod} onChange={(e: any) => setPayMethod(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none">
                            <option value="bank_transfer">Direct Bank Transfer</option>
                            <option value="card">Credit / Debit Card</option>
                            <option value="wallet">Mobile Wallet (EasyPaisa/JazzCash)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-foreground/60">Receipt Image / Transaction ID Proof</label>
                        <input type="text" value={payProofUrl} onChange={(e) => setPayProofUrl(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none font-mono" />
                        <p className="text-xs text-foreground/40 mt-1">Provide image URL context simulating Cloudinary receipt storage upload.</p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={() => setSelectedApptForPay(null)}>Cancel</Button>
                        <Button type="submit">Submit Verification</Button>
                      </div>
                    </form>
                  </Panel>
                )}
              </div>
            )}

            {activeTab === 'Medical History' && (
              <div className="space-y-4">
                {medicalHistories.length === 0 ? (
                  <Panel className="text-center py-8 text-foreground/50">No clinical history records found.</Panel>
                ) : (
                  medicalHistories.map((hist) => (
                    <Panel key={hist.id} className="border border-border/30 bg-background/10">
                      <div className="flex justify-between items-start border-b border-border/20 pb-3 mb-3">
                        <div>
                          <h3 className="font-black text-lg">{hist.doctorName}</h3>
                          <p className="text-xs text-foreground/50">{hist.date}</p>
                        </div>
                        <span className="rounded bg-green-500/10 text-green-400 text-xs px-2 py-0.5 font-bold uppercase border border-green-500/20">Immutable</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-bold text-foreground/60 uppercase text-xs tracking-wider">Diagnosis:</span> {hist.diagnosis}</p>
                        <p><span className="font-bold text-foreground/60 uppercase text-xs tracking-wider">Symptoms:</span> {hist.symptoms.join(', ')}</p>
                        <p><span className="font-bold text-foreground/60 uppercase text-xs tracking-wider">Treatment Plan:</span> {hist.treatment}</p>
                      </div>
                    </Panel>
                  ))
                )}
              </div>
            )}

            {activeTab === 'Prescriptions' && (
              <div className="space-y-4">
                {prescriptions.length === 0 ? (
                  <Panel className="text-center py-8 text-foreground/50">No prescriptions issued.</Panel>
                ) : (
                  prescriptions.map((p) => (
                    <Panel key={p.id} className="border border-border/30 bg-background/10">
                      <div className="flex justify-between items-start border-b border-border/20 pb-3 mb-3">
                        <div>
                          <h3 className="font-black text-lg">{p.doctorName}</h3>
                          <p className="text-xs text-foreground/50">{p.date}</p>
                        </div>
                        <span className="rounded bg-primary/10 text-primary text-xs px-2 py-0.5 font-bold uppercase border border-primary/20">Immutable</span>
                      </div>
                      <div className="space-y-3">
                        {p.medications.map((m: any, idx: number) => (
                          <div key={idx} className="rounded bg-background/50 p-3 border border-border/20 text-sm">
                            <div className="flex justify-between font-black text-foreground">
                              <span>{m.name}</span>
                              <span className="text-primary">{m.dosage}</span>
                            </div>
                            <div className="mt-1 text-xs text-foreground/60 flex gap-4">
                              <span>Freq: {m.frequency}</span>
                              <span>Duration: {m.duration}</span>
                            </div>
                            {m.instructions && (
                              <p className="mt-2 text-xs italic text-foreground/50">Inst: {m.instructions}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </Panel>
                  ))
                )}
              </div>
            )}

            {activeTab === 'Upload Reports' && (
              <div className="space-y-4">
                <Panel className="border border-border/40 bg-background/10">
                  <h3 className="text-lg font-black mb-3">Submit Health Report Context</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-foreground/60">Upload lab PDF reports (blood panels, glucose tolerances, MRIs) to trigger instantaneous AI analysis summarization.</p>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Paste report text context or pathology findings here to analyze... (e.g. Glucose: 110 mg/dL, HbA1c: 5.8%)"
                      rows={5}
                      className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleAiPrompt('report')} disabled={aiLoading}>
                        {aiLoading ? 'AI Summarizing...' : 'Analyze Pathology Report'}
                      </Button>
                      <Button variant="ghost" onClick={() => setAiPrompt('')}>Clear</Button>
                    </div>
                  </div>
                </Panel>

                {aiResponse && (
                  <Panel className="border border-primary/30 bg-primary/5 relative">
                    <div className="absolute top-2 right-2"><Sparkles className="text-primary shrink-0 animate-bounce" size={18} /></div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Doctor Hub AI Clinical Review</h3>
                    <p className="text-sm text-foreground/90 whitespace-pre-line font-mono">{aiResponse}</p>
                    <p className="mt-3 text-xs text-foreground/40 italic">Safety Disclaimer: Generative summary context only. Medical diagnostics require clinical pmc licensure review.</p>
                  </Panel>
                )}
              </div>
            )}

            {activeTab === 'AI Nav Room' && (
              <div className="space-y-4">
                <Panel className="border border-primary/20 bg-background/50">
                  <p className="text-xs font-black uppercase text-primary mb-1">AI clinical support engine</p>
                  <h2 className="text-lg font-black mb-3">Interactive Healthcare AI Navigator</h2>
                  <div className="space-y-3">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe symptoms, question prescription guidance, or seek specialist category matches..."
                      rows={3}
                      className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => handleAiPrompt('symptom')} disabled={aiLoading}>Check Symptoms</Button>
                      <Button onClick={() => handleAiPrompt('recommend')} disabled={aiLoading}>Recommend Doctor</Button>
                      <Button onClick={() => handleAiPrompt('prescription')} disabled={aiLoading}>Explain Medicine</Button>
                      <Button variant="ghost" onClick={() => handleAiPrompt('trends')} disabled={aiLoading}>My Health Trends</Button>
                    </div>
                  </div>
                </Panel>

                {aiLoading && (
                  <Panel className="text-center py-4 text-primary animate-pulse">Running AI analysis, please wait...</Panel>
                )}

                {aiResponse && !aiLoading && (
                  <Panel className="border border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-2 mb-3 text-primary text-xs font-black uppercase tracking-wider">
                      <Sparkles size={16} />
                      <span>AI Care Navigation Result</span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-mono">{aiResponse}</p>
                  </Panel>
                )}
              </div>
            )}

            {activeTab === 'Chat Cabinet' && (
              <LiveChatPanel
                chatId={`patient-${user?.id ?? 'demo'}-doctor-d2`}
                participantName="Dr. Hamza Ali"
              />
            )}

            {activeTab === 'My Profile' && (
              <div className="space-y-6">
                <Panel className="border border-border/40 bg-background/15 space-y-3">
                  <h3 className="text-lg font-black">Clinical Profile</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-foreground/50 uppercase font-bold">Email Address</p>
                      <p className="font-semibold text-sm">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 uppercase font-bold">User Role</p>
                      <p className="font-semibold text-sm capitalize">{user?.role}</p>
                    </div>
                  </div>
                </Panel>
                <ThemeSettings />
              </div>
            )}

            {/* ======================================================== */}
            {/* DOCTOR WORKSPACE TABS */}
            {/* ======================================================== */}

            {activeTab === 'Manage Schedule' && (
              <div className="space-y-4">
                <Panel className="border border-border/40 bg-background/20">
                  <h3 className="text-lg font-black mb-3">Add Available Schedule Slots</h3>
                  <form onSubmit={handleAddSlot} className="grid gap-3 md:grid-cols-4 items-end">
                    <div>
                      <label className="text-xs font-bold uppercase text-foreground/60">Day of Week</label>
                      <select value={newSlotDay} onChange={(e) => setNewSlotDay(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none">
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-foreground/60">Start Time</label>
                      <input type="text" value={newSlotStart} onChange={(e) => setNewSlotStart(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-foreground/60">End Time</label>
                      <input type="text" value={newSlotEnd} onChange={(e) => setNewSlotEnd(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" />
                    </div>
                    <Button type="submit">Add New Slot</Button>
                  </form>
                </Panel>

                <Panel className="border border-border/30 bg-background/10">
                  <h3 className="font-black mb-3">Current Active Availability</h3>
                  <div className="space-y-2">
                    {scheduleSlots.map((slot, idx) => (
                      <div key={idx} className="flex justify-between items-center rounded bg-background/50 border border-border/20 p-3 text-sm">
                        <div>
                          <p className="font-bold">{slot.day}</p>
                          <p className="text-xs text-foreground/50">{slot.starts} - {slot.ends}</p>
                        </div>
                        <span className="text-xs text-primary font-bold">{slot.clinic || 'Central Hospital'}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === 'Appointments' && (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <Panel key={appt.id} className="border border-border/40 bg-background/20">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-lg">Patient checkup</h3>
                        <p className="text-xs text-foreground/50 capitalize">{appt.type} consult • {appt.date}</p>
                        <p className="mt-2 text-sm text-foreground/80"><span className="font-bold text-foreground/60">Complaint:</span> {appt.complaint}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          appt.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {appt.status === 'confirmed' && (
                      <div className="mt-4 border-t border-border/20 pt-4 flex gap-2 justify-end">
                        <Button variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => setSelectedApptForDiag(appt)}>Append Medical Diagnosis</Button>
                      </div>
                    )}
                  </Panel>
                ))}

                {selectedApptForDiag && (
                  <Panel className="border border-primary/20 bg-background/60">
                    <h3 className="text-lg font-black mb-3">Record Visit Diagnosis & Issue Prescriptions</h3>
                    <form onSubmit={handleDiagnose} className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Diagnosis (Immutable)</label>
                          <input required type="text" value={diagText} onChange={(e) => setDiagText(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" placeholder="e.g. Chronic Migraines" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-foreground/60">Symptoms Tags (comma separated)</label>
                          <input required type="text" value={symptomTags} onChange={(e) => setSymptomTags(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" placeholder="Itchiness, Inflammation" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-foreground/60">Clinical Treatment Plan</label>
                        <textarea required value={treatmentText} onChange={(e) => setTreatmentText(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none" placeholder="Avoid dark trigger environments, hydrate, take medication during symptom warnings." />
                      </div>

                      {/* Meds List Seeder */}
                      <div className="rounded border border-border/20 p-3 bg-background/30 space-y-3">
                        <h4 className="text-xs font-black uppercase text-primary">Issue Immutable Medications</h4>
                        <div className="grid gap-2 md:grid-cols-4">
                          <input type="text" placeholder="Med Name" value={medName} onChange={(e) => setMedName(e.target.value)} className="rounded border border-border bg-background p-1.5 text-xs focus:outline-none" />
                          <input type="text" placeholder="Dosage (e.g. 50mg)" value={medDosage} onChange={(e) => setMedDosage(e.target.value)} className="rounded border border-border bg-background p-1.5 text-xs focus:outline-none" />
                          <input type="text" placeholder="Frequency" value={medFreq} onChange={(e) => setMedFreq(e.target.value)} className="rounded border border-border bg-background p-1.5 text-xs focus:outline-none" />
                          <input type="text" placeholder="Duration (e.g. 5 days)" value={medDur} onChange={(e) => setMedDur(e.target.value)} className="rounded border border-border bg-background p-1.5 text-xs focus:outline-none" />
                        </div>
                        <Button type="button" variant="ghost" className="w-full text-xs" onClick={handleAddMed}>+ Append Medication</Button>

                        {medsList.length > 0 && (
                          <div className="mt-2 space-y-1 text-xs">
                            <p className="font-bold text-foreground/60">Meds Queue:</p>
                            {medsList.map((m, idx) => (
                              <div key={idx} className="flex justify-between bg-white/5 p-1 rounded">
                                <span>{m.name} ({m.dosage})</span>
                                <span className="text-foreground/50">{m.frequency} • {m.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="ghost" onClick={() => setSelectedApptForDiag(null)}>Cancel</Button>
                        <Button type="submit">Sign & Finalize Record</Button>
                      </div>
                    </form>
                  </Panel>
                )}
              </div>
            )}

            {activeTab === 'Patient Records' && (
              <div className="space-y-4">
                <Panel className="border border-border/40 bg-background/20">
                  <h3 className="text-lg font-black mb-3">Clinical Charts Database</h3>
                  <div className="space-y-3">
                    {medicalHistories.map((hist) => (
                      <div key={hist.id} className="border border-border/20 rounded bg-background/40 p-4 space-y-2">
                        <div className="flex justify-between items-center font-black">
                          <span className="text-lg">Jane Doe</span>
                          <span className="text-xs text-foreground/50">{hist.date}</span>
                        </div>
                        <p className="text-sm"><span className="font-bold text-foreground/60">Diagnosis:</span> {hist.diagnosis}</p>
                        <p className="text-sm"><span className="font-bold text-foreground/60">Plan:</span> {hist.treatment}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === 'Prescriptions Manager' && (
              <div className="space-y-4">
                {prescriptions.map((p) => (
                  <Panel key={p.id} className="border border-border/30 bg-background/10">
                    <div className="flex justify-between items-start border-b border-border/20 pb-3 mb-3">
                      <div>
                        <h3 className="font-black text-lg">Jane Doe Prescription</h3>
                        <p className="text-xs text-foreground/50">{p.date}</p>
                      </div>
                      <span className="rounded bg-primary/10 text-primary text-xs px-2 py-0.5 font-bold uppercase border border-primary/20">Signed</span>
                    </div>
                    <div className="space-y-2">
                      {p.medications.map((m: any, idx: number) => (
                        <div key={idx} className="flex justify-between bg-white/5 p-2 rounded text-sm">
                          <span>{m.name} ({m.dosage})</span>
                          <span className="text-foreground/50">{m.frequency} • {m.duration}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                ))}
              </div>
            )}

            {activeTab === 'Video Consult Room' && (
              <div className="space-y-4">
                <VideoConsultRoom
                  appointmentId={appointments.find(a => a.status === 'confirmed')?.id ?? 'demo-apt-001'}
                  participantName="Patient"
                />
                <LiveChatPanel
                  chatId={`doctor-${user?.id ?? 'demo'}-patient-p1`}
                  participantName="Patient"
                  compact
                />
              </div>
            )}

            {activeTab === 'Analytics Cabinet' && (
              <Panel className="border border-border/40 bg-background/20 space-y-6">
                <h3 className="text-lg font-black">Earnings & Operational Insights</h3>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <Panel className="border border-border bg-white/5">
                    <p className="text-2xl font-black text-primary">Rs 7,500</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Today Earnings</p>
                  </Panel>
                  <Panel className="border border-border bg-white/5">
                    <p className="text-2xl font-black text-primary">3</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Pending Visits</p>
                  </Panel>
                  <Panel className="border border-border bg-white/5">
                    <p className="text-2xl font-black text-primary">4.9 ★</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Clinical Rating</p>
                  </Panel>
                </div>

                {/* Simulated GSAP/CSS dynamic bar charts */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-foreground/60">Weekly Patients Volume</h4>
                  <div className="flex items-end gap-3 h-32 pt-4">
                    {[30, 45, 60, 25, 90, 65, 40].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div style={{ height: `${val}%` }} className="w-full bg-primary/30 hover:bg-primary rounded-t transition-all shadow-glow" />
                        <span className="text-[10px] text-foreground/40 mt-1">{'MTWTFSS'[idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {activeTab === 'My Clinics' && (
              <div className="space-y-4">
                <Panel className="border border-border/30 bg-background/10">
                  <h3 className="font-black mb-3">Clinic Affiliations</h3>
                  <div className="space-y-2">
                    <div className="rounded bg-background/50 border border-border/20 p-3 text-sm">
                      <p className="font-bold">MidCity Hospital Cardiology Wing</p>
                      <p className="text-xs text-foreground/50">Lahore, Jail Road</p>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {/* ======================================================== */}
            {/* ASSISTANT PORTAL TABS */}
            {/* ======================================================== */}

            {activeTab === 'Payment Verification' && (
              <div className="space-y-4">
                {payQueue.length === 0 ? (
                  <Panel className="text-center py-8 text-foreground/50">No payment receipts pending audit verification.</Panel>
                ) : (
                  payQueue.map((pay) => (
                    <Panel key={pay.id} className="border border-border/40 bg-background/20">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <h3 className="font-black text-lg">Submitted by {pay.patientName}</h3>
                          <p className="text-xs text-foreground/50">Appointment ID: {pay.appointmentId} • Method: {pay.method}</p>
                          <p className="mt-2 text-sm font-black text-primary">Amount Audited: Rs {pay.amount}</p>
                          <div className="mt-3">
                            <p className="text-xs text-foreground/60 mb-1">Uploaded receipt screenshot:</p>
                            <img src={pay.proofUrl} alt="Receipt Proof" className="max-w-xs rounded border border-border/20 h-28 object-cover" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" className="text-red-400 border-red-500/20 hover:bg-red-500/10" onClick={() => handleVerifyPayment(pay.id, false)}><X size={16} /></Button>
                          <Button onClick={() => handleVerifyPayment(pay.id, true)}><Check size={16} /></Button>
                        </div>
                      </div>
                    </Panel>
                  ))
                )}
              </div>
            )}

            {activeTab === 'Appointment Dispatch' && (
              <div className="space-y-4">
                {dispatchQueue.length === 0 ? (
                  <Panel className="text-center py-8 text-foreground/50">No verified slots awaiting final dispatch.</Panel>
                ) : (
                  dispatchQueue.map((disp) => (
                    <Panel key={disp.id} className="border border-border/40 bg-background/20 flex justify-between items-center">
                      <div>
                        <h3 className="font-black text-lg">{disp.patientName}</h3>
                        <p className="text-xs text-foreground/50">Assigned to: {disp.doctorName} • Date: {disp.date}</p>
                        <p className="text-sm text-foreground/80 mt-1">Complaint: {disp.complaint}</p>
                      </div>
                      <Button onClick={() => handleDispatchAppt(disp.id)}>Confirm & Dispatch</Button>
                    </Panel>
                  ))
                )}
              </div>
            )}

            {activeTab === 'Queue Management' && (
              <Panel className="border border-border/40 bg-background/20">
                <h3 className="text-lg font-black mb-3">Live Dispatch Queues</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded bg-background/40 border border-border/20 text-sm flex justify-between">
                    <span>Jane Doe</span>
                    <span className="text-green-400 font-bold">Active in Queue #1</span>
                  </div>
                </div>
              </Panel>
            )}

            {activeTab === 'Analytics Reports' && (
              <Panel className="border border-border/40 bg-background/20 space-y-6">
                <h3 className="text-lg font-black">Operational Analytics Reports</h3>
                <div className="grid gap-4 md:grid-cols-3 text-center">
                  <Panel className="border border-border bg-white/5">
                    <p className="text-2xl font-black text-primary">{payQueue.length === 0 ? 4 : payQueue.length + 3}</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Payments Verified Today</p>
                  </Panel>
                  <Panel className="border border-border bg-white/5">
                    <p className="text-2xl font-black text-primary">{dispatchQueue.length === 0 ? 6 : dispatchQueue.length + 5}</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Total Dispatched</p>
                  </Panel>
                  <Panel className="border border-border bg-white/5">
                    <p className="text-2xl font-black text-primary">{payQueue.length}</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Pending Queue Size</p>
                  </Panel>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-foreground/60">Weekly Verification Volume</h4>
                  <div className="flex items-end gap-3 h-32 pt-4">
                    {[55, 70, 40, 85, 60, 30, 50].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div style={{ height: `${val}%` }} className="w-full bg-primary/30 hover:bg-primary rounded-t transition-all shadow-glow" />
                        <span className="text-[10px] text-foreground/40 mt-1">{'MTWTFSS'[idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-foreground/60">Resolution Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Approved', pct: 78, color: 'bg-green-500/60' },
                      { label: 'Rejected', pct: 12, color: 'bg-red-500/60' },
                      { label: 'Escalated', pct: 10, color: 'bg-yellow-500/60' }
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3 text-sm">
                        <span className="w-20 text-xs text-foreground/60 font-bold">{row.label}</span>
                        <div className="flex-1 h-4 rounded bg-white/5 overflow-hidden">
                          <div style={{ width: `${row.pct}%` }} className={`h-full ${row.color} rounded transition-all`} />
                        </div>
                        <span className="text-xs font-black text-foreground/80 w-10 text-right">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {/* ======================================================== */}
            {/* ADMIN PORTAL TABS */}
            {/* ======================================================== */}

            {activeTab === 'User Control' && (
              <Panel className="border border-border/40 bg-background/20">
                <h3 className="text-lg font-black mb-3">SaaS Platform Users</h3>
                <div className="space-y-3">
                  {adminUsers.map((u) => (
                    <div key={u.id} className="flex justify-between items-center p-3 rounded bg-background/50 border border-border/20 text-sm">
                      <div>
                        <p className="font-bold">{u.name}</p>
                        <p className="text-xs text-foreground/50">{u.email} • <span className="capitalize text-primary">{u.role}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={u.active ? 'danger' : 'primary'}
                          className="!min-h-8 text-xs"
                          onClick={() => {
                            setAdminUsers(adminUsers.map(x => x.id === u.id ? { ...x, active: !x.active } : x));
                            alert(`${u.name} state successfully updated.`);
                          }}
                        >
                          {u.active ? 'Block User' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {activeTab === 'Verify Doctors' && (
              <Panel className="border border-border/40 bg-background/20">
                <h3 className="text-lg font-black mb-3">Licensure Audits (PMC Validations)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded bg-background/50 border border-border/20 text-sm">
                    <div>
                      <p className="font-bold">Dr. Ayesha Khan</p>
                      <p className="text-xs text-foreground/50">PMC Reg No: 88122-M • cardiology</p>
                    </div>
                    <span className="text-green-400 font-bold">✓ PMC Verified</span>
                  </div>
                </div>
              </Panel>
            )}

            {activeTab === 'Security Center' && role === 'admin' && (
              <div className="space-y-4">
                <Panel className="border border-border/40 bg-white/[0.06] backdrop-blur-xl">
                  <h3 className="text-lg font-black mb-4">Security Settings</h3>
                  <div className="space-y-5">
                    {/* 2FA Enforcement */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-primary" />
                        <div>
                          <p className="font-bold text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-foreground/50">Enforce 2FA for all platform users</p>
                        </div>
                      </div>
                      <button
                        className="text-primary hover:opacity-80 transition"
                        onClick={() => alert('2FA enforcement toggled (mock)')}
                      >
                        <ToggleRight size={32} />
                      </button>
                    </div>

                    {/* Session Timeout */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-primary" />
                        <div>
                          <p className="font-bold text-sm">Session Timeout</p>
                          <p className="text-xs text-foreground/50">Auto-logout idle sessions after configured interval</p>
                        </div>
                      </div>
                      <select
                        defaultValue="30"
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>

                    {/* IP Whitelist */}
                    <div className="p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe size={18} className="text-primary" />
                        <div>
                          <p className="font-bold text-sm">IP Whitelist</p>
                          <p className="text-xs text-foreground/50">Only allow admin access from trusted IPs</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {['192.168.1.0/24', '10.0.0.1', '203.0.113.42'].map((ip) => (
                          <div key={ip} className="flex items-center justify-between rounded bg-white/5 px-3 py-1.5 text-sm font-mono">
                            <span className="text-foreground/80">{ip}</span>
                            <span className="text-green-400 text-xs font-bold">Active</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === 'Audit logs' && (
              <Panel className="border border-border/40 bg-background/20">
                <h3 className="text-lg font-black mb-3">Admin Audit Logs</h3>
                <div className="space-y-2">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded bg-background/50 border border-border/20 font-mono">
                      <div>
                        <span className="text-primary font-bold">{log.actor}</span>
                        <span className="text-foreground/60"> performed </span>
                        <span className="text-foreground font-bold">{log.action}</span>
                        <span className="text-foreground/60"> on {log.resource}</span>
                      </div>
                      <span className="text-foreground/40">{log.date}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* ======================================================== */}
            {/* SUPER ADMIN PORTAL TABS */}
            {/* ======================================================== */}

            {activeTab === 'Global Dashboard' && (
              <Panel className="border border-border/40 bg-background/20 space-y-4">
                <h3 className="text-lg font-black">System Infrastructure</h3>
                <div className="grid gap-3 md:grid-cols-4 text-center">
                  <Panel className="border border-border/30 bg-white/5">
                    <p className="text-2xl font-black text-primary">99.98%</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Uptime SLA</p>
                  </Panel>
                  <Panel className="border border-border/30 bg-white/5">
                    <p className="text-2xl font-black text-primary">12ms</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">DB latency</p>
                  </Panel>
                  <Panel className="border border-border/30 bg-white/5">
                    <p className="text-2xl font-black text-primary">3</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Active Sockets</p>
                  </Panel>
                  <Panel className="border border-border/30 bg-white/5">
                    <p className="text-2xl font-black text-primary">23</p>
                    <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Collections</p>
                  </Panel>
                </div>
              </Panel>
            )}

            {activeTab === 'Security Center' && role === 'superAdmin' && (
              <div className="space-y-4">
                <Panel className="border border-border/40 bg-white/[0.06] backdrop-blur-xl space-y-4">
                  <h3 className="text-lg font-black">System Security Overview</h3>
                  <div className="grid gap-4 md:grid-cols-3 text-center">
                    <Panel className="border border-red-500/20 bg-red-500/5">
                      <ShieldAlert size={24} className="text-red-400 mx-auto mb-2" />
                      <p className="text-2xl font-black text-red-400">47</p>
                      <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Failed Logins (24h)</p>
                    </Panel>
                    <Panel className="border border-green-500/20 bg-green-500/5">
                      <Activity size={24} className="text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-black text-green-400">18</p>
                      <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Active Sessions</p>
                    </Panel>
                    <Panel className="border border-primary/20 bg-primary/5">
                      <Shield size={24} className="text-primary mx-auto mb-2" />
                      <p className="text-2xl font-black text-primary">Active</p>
                      <p className="text-xs text-foreground/50 uppercase font-bold mt-1">Rate Limiting</p>
                    </Panel>
                  </div>
                </Panel>

                <Panel className="border border-border/40 bg-background/20">
                  <h4 className="font-black mb-3">Recent Failed Login Attempts</h4>
                  <div className="space-y-2">
                    {[
                      { ip: '185.43.210.88', email: 'unknown@spam.net', time: '2 min ago', geo: 'Russia' },
                      { ip: '91.234.12.3', email: 'admin@doctorhub.pk', time: '18 min ago', geo: 'Ukraine' },
                      { ip: '203.0.113.50', email: 'jane@example.com', time: '1 hour ago', geo: 'Pakistan' }
                    ].map((attempt, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded bg-background/50 border border-border/20 font-mono">
                        <div className="flex gap-4">
                          <span className="text-red-400 font-bold">{attempt.ip}</span>
                          <span className="text-foreground/60">{attempt.email}</span>
                          <span className="text-foreground/40">{attempt.geo}</span>
                        </div>
                        <span className="text-foreground/40">{attempt.time}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === 'Permissions Control' && (
              <Panel className="border border-border/40 bg-white/[0.06] backdrop-blur-xl space-y-4">
                <h3 className="text-lg font-black">RBAC Permissions Matrix</h3>
                <p className="text-sm text-foreground/50">Role-based access control map across all platform operations.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30">
                        <th className="text-left py-3 px-4 text-xs uppercase font-black text-foreground/60">Permission</th>
                        {['Patient', 'Doctor', 'Assistant', 'Admin'].map((r) => (
                          <th key={r} className="py-3 px-4 text-xs uppercase font-black text-primary text-center">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { perm: 'appointments:create', patient: true, doctor: false, assistant: false, admin: false },
                        { perm: 'appointments:read_own', patient: true, doctor: true, assistant: true, admin: true },
                        { perm: 'appointments:dispatch', patient: false, doctor: false, assistant: true, admin: true },
                        { perm: 'payments:submit', patient: true, doctor: false, assistant: false, admin: false },
                        { perm: 'payments:verify', patient: false, doctor: false, assistant: true, admin: true },
                        { perm: 'prescriptions:create', patient: false, doctor: true, assistant: false, admin: false },
                        { perm: 'prescriptions:read', patient: true, doctor: true, assistant: false, admin: true },
                        { perm: 'medical_history:append', patient: false, doctor: true, assistant: false, admin: false },
                        { perm: 'medical_history:read', patient: true, doctor: true, assistant: false, admin: true },
                        { perm: 'users:manage', patient: false, doctor: false, assistant: false, admin: true },
                        { perm: 'doctors:verify', patient: false, doctor: false, assistant: false, admin: true },
                        { perm: 'audit:read', patient: false, doctor: false, assistant: false, admin: true },
                        { perm: 'system:configure', patient: false, doctor: false, assistant: false, admin: false },
                        { perm: 'rbac:modify', patient: false, doctor: false, assistant: false, admin: false }
                      ].map((row) => (
                        <tr key={row.perm} className="border-b border-border/10 hover:bg-white/[0.02] transition">
                          <td className="py-2.5 px-4 font-mono text-xs text-foreground/80">{row.perm}</td>
                          {[row.patient, row.doctor, row.assistant, row.admin].map((granted, idx) => (
                            <td key={idx} className="py-2.5 px-4 text-center">
                              {granted ? (
                                <Check size={16} className="text-green-400 mx-auto" />
                              ) : (
                                <X size={14} className="text-foreground/15 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {activeTab === 'System Settings' && (
              <div className="space-y-4">
                <Panel className="border border-border/40 bg-white/[0.06] backdrop-blur-xl space-y-4">
                  <h3 className="text-lg font-black">System Configuration</h3>

                  <div className="space-y-3">
                    {/* API Endpoint Status */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3">
                        <Wifi size={18} className="text-green-400" />
                        <div>
                          <p className="font-bold text-sm">API Gateway</p>
                          <p className="text-xs text-foreground/50 font-mono">https://api.doctorhub.pk/v1</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-500/10 text-green-400 text-xs px-3 py-1 font-bold uppercase border border-green-500/20">Operational</span>
                    </div>

                    {/* Database Connection */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3">
                        <Database size={18} className="text-green-400" />
                        <div>
                          <p className="font-bold text-sm">MongoDB Atlas Cluster</p>
                          <p className="text-xs text-foreground/50 font-mono">cluster0.doctorhub.mongodb.net • 23 collections</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-500/10 text-green-400 text-xs px-3 py-1 font-bold uppercase border border-green-500/20">Connected</span>
                    </div>

                    {/* AI Service */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3">
                        <Sparkles size={18} className="text-primary" />
                        <div>
                          <p className="font-bold text-sm">AI Clinical Engine</p>
                          <p className="text-xs text-foreground/50 font-mono">Gemini Pro • Symptom analysis + NLP pipeline</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/10 text-primary text-xs px-3 py-1 font-bold uppercase border border-primary/20">Active</span>
                    </div>

                    {/* WebSocket */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/20">
                      <div className="flex items-center gap-3">
                        <Activity size={18} className="text-green-400" />
                        <div>
                          <p className="font-bold text-sm">WebSocket Server</p>
                          <p className="text-xs text-foreground/50 font-mono">wss://ws.doctorhub.pk • 3 active connections</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-500/10 text-green-400 text-xs px-3 py-1 font-bold uppercase border border-green-500/20">Live</span>
                    </div>
                  </div>
                </Panel>

                <ThemeSettings />
              </div>
            )}

            {activeTab === 'Audit Stream' && (
              <Panel className="border border-border/40 bg-background/20">
                <h3 className="text-lg font-black mb-3">Enterprise Audit Logs Stream (Immutable)</h3>
                <div className="space-y-2">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded bg-background/50 border border-border/20 font-mono">
                      <div>
                        <span className="text-primary font-bold">{log.actor}</span>
                        <span className="text-foreground/60"> performed </span>
                        <span className="text-foreground font-bold">{log.action}</span>
                        <span className="text-foreground/60"> on {log.resource}</span>
                      </div>
                      <span className="text-foreground/40">{log.date}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
