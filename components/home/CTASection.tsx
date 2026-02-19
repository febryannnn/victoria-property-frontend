"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import footerImage from "@/assets/footer.jpg";

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const heading = entry.target.querySelector(".cta-heading");
            const subtitle = entry.target.querySelector(".cta-subtitle");
            const buttons = entry.target.querySelector(".cta-buttons");
            const trust = entry.target.querySelector(".cta-trust");

            if (heading) heading.classList.add("cta-in");
            if (subtitle) setTimeout(() => subtitle.classList.add("cta-in"), 150);
            if (buttons) setTimeout(() => buttons.classList.add("cta-in"), 300);
            if (trust) setTimeout(() => trust.classList.add("cta-in"), 480);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* Shared fade-up */
        .cta-heading, .cta-subtitle, .cta-buttons, .cta-trust {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                      transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .cta-in { opacity: 1 !important; transform: translateY(0) !important; }

        /* Background image zoom-in on section enter */
        @keyframes cta-img-zoom {
          from { transform: scale(1.06); }
          to   { transform: scale(1); }
        }
        .cta-bg-img { animation: cta-img-zoom 1.6s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* Button hover lift */
        .cta-btn-primary {
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.25s ease;
          position: relative; overflow: hidden;
        }
        .cta-btn-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
          background-size: 200% 100%; background-position: 200% center;
        }
        .cta-btn-primary:hover::after {
          animation: cta-shimmer 0.45s ease forwards;
        }
        @keyframes cta-shimmer {
          from { background-position:  200% center; }
          to   { background-position: -200% center; }
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px hsl(0 70% 37% / 0.45);
        }
        .cta-btn-primary:active { transform: translateY(0); }

        .cta-btn-outline {
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
                      background-color 0.25s ease, color 0.25s ease;
        }
        .cta-btn-outline:hover { transform: translateY(-2px); }
        .cta-btn-outline:active { transform: translateY(0); }

        /* Trust badges slide in */
        .cta-bank {
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1),
                      transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cta-trust.cta-in .cta-bank:nth-child(1) { opacity:1; transform:translateY(0); transition-delay: 0.0s; }
        .cta-trust.cta-in .cta-bank:nth-child(2) { opacity:1; transform:translateY(0); transition-delay: 0.08s; }
        .cta-trust.cta-in .cta-bank:nth-child(3) { opacity:1; transform:translateY(0); transition-delay: 0.16s; }
        .cta-trust.cta-in .cta-bank:nth-child(4) { opacity:1; transform:translateY(0); transition-delay: 0.24s; }
        .cta-trust.cta-in .cta-bank:nth-child(5) { opacity:1; transform:translateY(0); transition-delay: 0.32s; }
      `}</style>

      <section ref={sectionRef} className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={footerImage}
            alt="CTA Background"
            fill
            className="hero-image cta-bg-img"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-victoria-navy/70 via-victoria-navy/50 to-victoria-navy/100" />
        </div>

        <div className="relative z-10 container-victoria">
          <div className="max-w-3xl mx-auto text-center">

            <h2 className="cta-heading text-3xl md:text-4xl lg:text-5xl text-victoria-yellow mb-6" style={{ fontWeight: 800 }}>
              Siap Menemukan <span className="block">Properti Impian Anda?</span>
            </h2>

            <p className="cta-subtitle text-lg md:text-xl text-white mb-10" style={{ fontWeight: 500 }}>
              Hubungi tim kami sekarang untuk konsultasi gratis dan temukan
              properti yang sesuai dengan kebutuhan dan budget Anda.
            </p>

            <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center">
              {/* CTA 1 */}
              <Button
                asChild
                size="lg"
                className="cta-btn-primary bg-victoria-red hover:bg-victoria-red/90 text-victoria-cream font-semibold text-lg px-8 h-14 gap-2 shadow-lg"
              >
                <Link href="/properties">
                  Mulai Pencarian
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              {/* CTA 2 */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="cta-btn-outline bg-transparent border-2 border-primary-foreground text-victoria-cream hover:bg-primary-foreground hover:text-victoria-navy font-semibold text-lg px-8 h-14 gap-2"
              >
                <Link href="/contact">
                  <Phone className="w-5 h-5" />
                  Hubungi Kami
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="cta-trust flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-primary-foreground/20">
              <div className="cta-bank text-victoria-cream text-sm">Dipercaya oleh:</div>
              {["Bank Mandiri", "BCA", "BRI", "BTN"].map((bank) => (
                <div key={bank} className="cta-bank text-victoria-cream font-bold">{bank}</div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default CTASection;