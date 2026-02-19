"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Clock, Users, Award, CheckCircle, Headphones } from "lucide-react";

/* ─────────────────────────────────────────
   Counter helpers
───────────────────────────────────────── */
const statsConfig = [
  { target: 98, suffix: "%", label: "Kepuasan Klien" },
  { target: 15, suffix: "K+", label: "Properti Terjual" },
  { target: 10, suffix: "+", label: "Tahun Pengalaman" },
];

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(easeOutQuart(p) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return value;
}

function StatCounter({
  target, suffix, label, delay, globalStart,
}: {
  target: number; suffix: string; label: string; delay: number; globalStart: boolean;
}) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!globalStart || active) return;
    const id = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(id);
  }, [globalStart, delay, active]);

  const value = useCountUp(target, 1800, active);

  return (
    <div className="wcu-counter text-center p-4 bg-card rounded-xl shadow-victoria-sm">
      <div className="text-3xl font-bold text-victoria-red mb-1 tabular-nums">
        {value}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Features data
───────────────────────────────────────── */
const features = [
  {
    icon: Shield,
    title: "Transaksi Aman",
    description: "Setiap transaksi dijamin keamanannya dengan proses verifikasi yang ketat",
  },
  {
    icon: Clock,
    title: "Proses Cepat",
    description: "Temukan properti impian Anda dalam hitungan menit dengan sistem pencarian canggih",
  },
  {
    icon: Users,
    title: "Agen Profesional",
    description: "Didukung oleh ribuan agen properti berpengalaman dan tersertifikasi",
  },
  {
    icon: Award,
    title: "Kualitas Terjamin",
    description: "Semua listing diverifikasi untuk memastikan kualitas dan kebenaran informasi",
  },
  {
    icon: CheckCircle,
    title: "Legalitas Jelas",
    description: "Dokumen dan legalitas properti telah diperiksa oleh tim ahli kami",
  },
  {
    icon: Headphones,
    title: "Dukungan 24/7",
    description: "Tim customer service siap membantu Anda kapan saja, di mana saja",
  },
];

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Left column — slide from left, staggered
          entry.target.querySelectorAll(".wcu-left").forEach((el, i) => {
            setTimeout(() => el.classList.add("wcu-in"), i * 110);
          });

          // Stat boxes pop up + trigger count-up
          entry.target.querySelectorAll(".wcu-counter").forEach((el) => {
            setTimeout(() => el.classList.add("wcu-in"), 350);
          });
          setTimeout(() => setCountersStarted(true), 350);

          // Feature cards — slide from right, staggered
          entry.target.querySelectorAll(".wcu-card").forEach((card, i) => {
            setTimeout(() => card.classList.add("wcu-in"), i * 90 + 180);
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .wcu-left {
          opacity: 0; transform: translateX(-28px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                      transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .wcu-left.wcu-in { opacity: 1; transform: translateX(0); }

        .wcu-counter {
          opacity: 0; transform: translateY(20px) scale(0.95);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .wcu-counter.wcu-in { opacity: 1; transform: translateY(0) scale(1); }

        .wcu-card {
          opacity: 0; transform: translateX(32px) scale(0.97);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s ease;
        }
        .wcu-card.wcu-in { opacity: 1; transform: translateX(0) scale(1); }

        .wcu-icon-wrap {
          transition: background-color 0.3s ease,
                      transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .wcu-card:hover .wcu-icon-wrap { transform: scale(1.1) rotate(-5deg); }

        @keyframes wcu-dot {
          0%, 100% { box-shadow: 0 0 0 0   hsl(45 92% 49% / 0.6); }
          50%       { box-shadow: 0 0 0 5px hsl(45 92% 49% / 0);   }
        }
        .wcu-dot { animation: wcu-dot 2.2s ease-in-out infinite; }
      `}</style>

      <section ref={sectionRef} className="section-padding bg-victoria-cream">
        <div className="container-victoria">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left ── */}
            <div>
              <div className="wcu-left inline-flex items-center gap-2 bg-victoria-yellow/20 rounded-full px-4 py-1.5 mb-6">
                <span className="wcu-dot w-2 h-2 bg-victoria-yellow rounded-full" />
                <span className="text-victoria-navy text-sm font-semibold">Mengapa Victoria Property?</span>
              </div>

              <h2 className="wcu-left text-3xl md:text-4xl font-bold text-victoria-navy mb-6 leading-tight">
                Partner Terpercaya untuk
                <span className="text-victoria-red block">Investasi Properti Anda</span>
              </h2>

              <p className="wcu-left text-muted-foreground text-lg mb-8">
                Dengan pengalaman lebih dari 10 tahun di industri properti Indonesia,
                kami berkomitmen memberikan layanan terbaik untuk membantu Anda menemukan
                hunian atau investasi yang tepat.
              </p>

              {/* Animated stat counters */}
              <div className="grid grid-cols-3 gap-6">
                {statsConfig.map((stat, i) => (
                  <StatCounter
                    key={stat.label}
                    target={stat.target}
                    suffix={stat.suffix}
                    label={stat.label}
                    delay={i * 130}
                    globalStart={countersStarted}
                  />
                ))}
              </div>
            </div>

            {/* ── Right ── */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="wcu-card bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="wcu-icon-wrap w-12 h-12 rounded-lg bg-victoria-light flex items-center justify-center mb-4 group-hover:bg-victoria-red transition-colors">
                    <feature.icon className="w-6 h-6 text-victoria-navy group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChooseUs;