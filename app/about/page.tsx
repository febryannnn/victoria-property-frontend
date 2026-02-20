'use client';

import { Users, Target, Award, TrendingUp, CheckCircle, Building2, Handshake, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import agentPhoto from '@/assets/vp-agent-photo.jpeg';
import housePhoto from '@/assets/perumahan.jpg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   Counter hook — counts up when element enters viewport
───────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000, suffix = '') {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [started, target, duration]);

  return { count, ref, suffix };
}

/* ─────────────────────────────────────────────
   Scroll-reveal hook
───────────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─────────────────────────────────────────────
   Animated stat card
───────────────────────────────────────────── */
function StatCard({
  targetValue,
  suffix,
  label,
  icon: Icon,
  delay,
}: {
  targetValue: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
}) {
  const { count, ref } = useCountUp(targetValue, 2000);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-xl bg-victoria-light"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <Icon
        className="w-10 h-10 text-victoria-red mx-auto mb-3"
        style={{
          transform: visible ? 'scale(1)' : 'scale(0.4)',
          transition: `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay + 100}ms`,
        }}
      />
      <p className="text-3xl md:text-4xl font-bold text-victoria-navy">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Reveal wrapper
───────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'fade';
  className?: string;
}) {
  const { ref, visible } = useScrollReveal();

  const transform = {
    up: 'translateY(40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
    fade: 'none',
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transform,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const About = () => {
  const stats = [
    { value: 5000, suffix: '+', label: 'Properti Terjual', icon: Building2 },
    { value: 10, suffix: '+', label: 'Tahun Pengalaman', icon: TrendingUp },
    { value: 50, suffix: '+', label: 'Agen Profesional', icon: Users },
    { value: 98, suffix: '%', label: 'Kepuasan Klien', icon: Award },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Kepercayaan',
      description:
        'Kami membangun hubungan jangka panjang dengan klien melalui transparansi dan integritas dalam setiap transaksi.',
    },
    {
      icon: Target,
      title: 'Profesionalisme',
      description:
        'Tim agen kami terlatih secara profesional untuk memberikan layanan terbaik dalam setiap proses jual beli properti.',
    },
    {
      icon: Handshake,
      title: 'Komitmen',
      description:
        'Kami berkomitmen untuk membantu setiap klien menemukan properti impian mereka dengan harga terbaik.',
    },
  ];

  const team = [
    {
      name: 'Budi Santoso',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      description: 'Berpengalaman lebih dari 15 tahun di industri properti Indonesia.',
    },
    {
      name: 'Siti Rahayu',
      position: 'Director of Sales',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      description: 'Ahli dalam strategi penjualan dan pengembangan bisnis properti.',
    },
    {
      name: 'Ahmad Wijaya',
      position: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Mengelola operasional dan memastikan layanan berkualitas tinggi.',
    },
    {
      name: 'Diana Putri',
      position: 'Marketing Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      description: 'Spesialis pemasaran digital dan branding properti.',
    },
  ];

  return (
    <>
      {/* ── Global keyframe styles ── */}
      <style>{`
        @keyframes heroFadeDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .hero-title {
          animation: heroFadeDown 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }
        .hero-sub {
          animation: heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both;
        }
        .icon-pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(200,30,30,0.35);
          animation: pulse-ring 1.8s ease-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28">
          {/* ── Hero ── */}
          <section className="relative py-20 bg-victoria-navy overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Image src={housePhoto} alt="House" fill className="object-cover" />
            </div>
            {/* Animated gradient sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 4s linear infinite',
              }}
            />
            <div className="container-victoria relative z-10 text-center">
              <h1 className="hero-title text-4xl md:text-5xl font-bold text-white mb-6">
                Tentang Victoria Property
              </h1>
              <p className="hero-sub text-xl text-white/80 max-w-3xl mx-auto">
                Partner terpercaya Anda dalam menemukan hunian impian sejak 2014.
                Melayani seluruh Indonesia dengan profesionalisme tinggi.
              </p>
            </div>
          </section>

          {/* ── Stats (counter) ── */}
          <section className="py-12 bg-card relative -mt-8">
            <div className="container-victoria">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <StatCard
                    key={i}
                    targetValue={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    icon={stat.icon}
                    delay={i * 100}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Story ── */}
          <section className="section-padding">
            <div className="container-victoria">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Reveal direction="left">
                  <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                    Cerita Kami
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mt-2 mb-6">
                    Lebih dari Sekedar Agen Properti
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Victoria Property didirikan pada tahun 2014 dengan visi menjadi mitra terpercaya
                      dalam industri properti Indonesia. Berawal dari kantor kecil di Jakarta,
                      kami kini telah berkembang menjadi salah satu agen properti terkemuka di Indonesia.
                    </p>
                    <p>
                      Dengan lebih dari 50 agen profesional yang tersebar di berbagai kota,
                      kami berkomitmen untuk membantu setiap klien menemukan properti impian mereka.
                    </p>
                    <p>
                      Kami percaya bahwa membeli properti adalah keputusan besar dalam hidup.
                      Oleh karena itu, kami selalu memberikan layanan terbaik dengan transparansi
                      penuh dan pendekatan yang personal untuk setiap klien.
                    </p>
                  </div>

                  <div className="mt-8 space-y-3">
                    {[
                      'Listing properti terverifikasi',
                      'Proses transaksi yang aman dan transparan',
                      'Dukungan agen 24/7',
                      'Konsultasi gratis untuk klien',
                    ].map((item, i) => (
                      <Reveal key={i} delay={i * 80} direction="left">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-victoria-red flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </Reveal>

                <Reveal direction="right" delay={150}>
                  <div className="relative">
                    <div
                      className="aspect-[4/5] rounded-2xl overflow-hidden"
                      style={{
                        boxShadow: '0 32px 64px -16px rgba(0,0,0,0.25)',
                      }}
                    >
                      <Image src={agentPhoto} alt="Agent" fill className="object-cover" />
                    </div>
                    {/* Badge with its own bounce-in */}
                    <div
                      className="absolute -bottom-6 -left-6 bg-victoria-red text-white p-6 rounded-xl shadow-xl"
                      style={{
                        animation: 'heroFadeUp 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.6s both',
                      }}
                    >
                      <p className="text-4xl font-bold">10+</p>
                      <p className="text-sm">Tahun Melayani Indonesia</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── Values ── */}
          <section className="section-padding bg-victoria-light">
            <div className="container-victoria">
              <Reveal direction="up" className="text-center mb-12">
                <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                  Visi & Misi
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mt-2">
                  Nilai-Nilai Kami
                </h2>
              </Reveal>

              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, i) => (
                  <Reveal key={i} delay={i * 120} direction="up">
                    <div className="bg-card p-8 rounded-xl shadow-md text-center group hover:-translate-y-2 transition-transform duration-300">
                      <div className="relative w-16 h-16 bg-victoria-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        {/* Pulse ring on hover */}
                        <span className="absolute inset-0 rounded-full bg-victoria-red/20 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
                        <value.icon className="w-8 h-8 text-victoria-red relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-victoria-navy mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── Team ── */}
          <section className="section-padding">
            <div className="container-victoria">
              <Reveal direction="up" className="text-center mb-12">
                <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                  Tim Kami
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mt-2 mb-4">
                  Dipimpin oleh Para Ahli
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Tim manajemen kami terdiri dari profesional berpengalaman yang berkomitmen
                  untuk memberikan layanan terbaik kepada setiap klien.
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, i) => (
                  <Reveal key={i} delay={i * 100} direction="up">
                    <div className="group">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-victoria-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-white text-sm">{member.description}</p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg text-victoria-navy">{member.name}</h3>
                      <p className="text-muted-foreground">{member.position}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="section-padding bg-victoria-navy text-white">
            <div className="container-victoria text-center">
              <Reveal direction="up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Siap Menemukan Properti Impian Anda?
                </h2>
                <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                  Hubungi tim kami hari ini untuk konsultasi gratis dan mulai perjalanan
                  Anda menuju hunian impian.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/properties"
                    className="btn-victoria-primary hover:scale-105 transition-transform duration-200"
                  >
                    Lihat Properti
                  </a>
                  <a
                    href="/contact"
                    className="btn-victoria border-2 border-white text-white hover:bg-white hover:text-victoria-navy hover:scale-105 transition-all duration-200"
                  >
                    Hubungi Kami
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;