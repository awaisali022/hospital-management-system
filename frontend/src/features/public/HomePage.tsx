import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, HeartPulse, ShieldCheck, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Button } from '../../components/ui/Button';
import { Panel } from '../../components/ui/Panel';

/* ───────── helpers ───────── */

/** Parse an HSL CSS variable string like "174 91% 48%" into a THREE.Color */
function hslVarToColor(varName: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const parts = raw.split(/\s+/);
  if (parts.length < 3) return new THREE.Color(0x00ddbb);
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  return new THREE.Color().setHSL(h, s, l);
}

/** Build a red‑cross shape from two intersecting boxes */
function createCross(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  const arm = new THREE.BoxGeometry(0.25, 1.0, 0.25);
  const v = new THREE.Mesh(arm, material);
  const h = new THREE.Mesh(arm, material);
  h.rotation.z = Math.PI / 2;
  group.add(v, h);
  return group;
}

/** Build a pill capsule (cylinder + two hemisphere caps) */
function createPill(material: THREE.Material): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 24);
  const cap = new THREE.SphereGeometry(0.25, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const bodyMesh = new THREE.Mesh(body, material);
  const topCap = new THREE.Mesh(cap, material);
  topCap.position.y = 0.4;
  const botCap = new THREE.Mesh(cap, material);
  botCap.rotation.x = Math.PI;
  botCap.position.y = -0.4;
  group.add(bodyMesh, topCap, botCap);
  group.rotation.z = Math.PI / 6;
  return group;
}

/* ───────── data ───────── */

const stats = [
  { value: '5', label: 'Roles' },
  { value: '23', label: 'Collections' },
  { value: '6', label: 'AI Flows' },
  { value: '24/7', label: 'Operations' },
];

const features = [
  { Icon: HeartPulse, title: 'Smart Care Network', desc: 'Intelligent doctor matching with real-time availability tracking across specialties.' },
  { Icon: Brain, title: 'AI Diagnostics', desc: 'Advanced AI-powered symptom analysis and treatment recommendation engine.' },
  { Icon: Video, title: 'Video Consultations', desc: 'HD telehealth sessions with integrated medical records and prescriptions.' },
  { Icon: ShieldCheck, title: 'Secure Records', desc: 'End-to-end encrypted health records with role-based access controls.' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

/* ───────── component ───────── */

export function HomePage() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  /* ── Three.js setup ── */
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(3, 5, 4);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-3, -2, 2);
    scene.add(ambient, dir, fillLight);

    // ── Materials
    const primaryColor = hslVarToColor('--primary');
    const accentColor = hslVarToColor('--accent');

    const crossMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xff3355),
      emissive: new THREE.Color(0xff1133),
      emissiveIntensity: 0.3,
      metalness: 0.2,
      roughness: 0.35,
    });

    const pillMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor.clone().multiplyScalar(0.15),
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.3,
    });

    const dnaMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor.clone().multiplyScalar(0.15),
      emissiveIntensity: 0.4,
      metalness: 0.4,
      roughness: 0.25,
    });

    // ── Meshes
    const cross = createCross(crossMat);
    cross.position.set(-1.8, 0.6, 0);
    cross.scale.setScalar(0.9);

    const pill = createPill(pillMat);
    pill.position.set(1.9, -0.4, 0.5);
    pill.scale.setScalar(0.85);

    const dna = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.18, 128, 24, 2, 3), dnaMat);
    dna.position.set(0.2, 1.2, -1);
    dna.scale.setScalar(0.75);

    scene.add(cross, pill, dna);

    // ── Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop
    const clock = new THREE.Clock();
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate meshes
      cross.rotation.y = t * 0.5;
      cross.rotation.x = Math.sin(t * 0.3) * 0.2;
      pill.rotation.y = t * 0.4;
      pill.rotation.x = t * 0.25;
      dna.rotation.y = t * 0.35;
      dna.rotation.x = t * 0.2;

      // Floating (sin wave on Y)
      cross.position.y = 0.6 + Math.sin(t * 0.8) * 0.25;
      pill.position.y = -0.4 + Math.sin(t * 0.7 + 1.5) * 0.3;
      dna.position.y = 1.2 + Math.sin(t * 0.6 + 3.0) * 0.2;

      // Camera parallax
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      crossMat.dispose();
      pillMat.dispose();
      dnaMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  /* ── Render ── */
  return (
    <div className="space-y-16">
      {/* ━━━ Hero Section ━━━ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* 3D Canvas (background) */}
        <div
          ref={canvasContainerRef}
          className="absolute inset-0 z-0"
          aria-hidden="true"
        />

        {/* Gradient overlays for readability */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--background))]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.7)_80%)]" />

        {/* Text content */}
        <div className="relative z-[2] flex flex-col items-center text-center px-4 py-20 max-w-4xl mx-auto">
          <motion.span
            {...fadeUp(0)}
            className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-sm"
          >
            Enterprise AI Healthcare Ecosystem
          </motion.span>

          <motion.h1
            {...fadeUp(0.15)}
            className="mb-6 text-5xl font-black leading-[1.1] tracking-tight md:text-7xl lg:text-8xl"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-shift_6s_ease_infinite]">
              DoctorHub AI
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="mb-8 max-w-2xl text-lg leading-relaxed text-foreground/70 md:text-xl"
          >
            Search doctors, manage appointments, preserve medical history, and guide patients
            with AI-assisted healthcare navigation — all in one unified platform.
          </motion.p>

          <motion.div {...fadeUp(0.45)} className="mb-12 flex flex-wrap items-center justify-center gap-4">
            <Button>
              <Link to="/doctors" className="inline-flex items-center gap-2">
                Find Doctors <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="ghost">
              <Link to="/ai" className="inline-flex items-center gap-2">
                <Brain size={18} /> AI Assistant
              </Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            {...fadeUp(0.6)}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="rounded-lg border border-border bg-white/[0.06] p-4 backdrop-blur-xl">
                <p className="text-2xl font-black text-primary md:text-3xl">{value}</p>
                <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ━━━ Features Section ━━━ */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-black md:text-4xl">Platform Features</h2>
          <p className="mt-2 text-foreground/60">Production-grade healthcare workflow modules</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Panel className="group relative h-full overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]">
                {/* Glow on hover */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative space-y-4">
                  <span className="grid size-12 place-items-center rounded-lg bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/25">
                    <Icon size={24} />
                  </span>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/60">{desc}</p>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
