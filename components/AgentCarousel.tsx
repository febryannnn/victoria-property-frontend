'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import agentPhoto from '@/assets/vp-agent-photo.jpeg';

const slides = [
    {
        src: agentPhoto.src,
        alt: 'Agen Victoria Property',
        caption: 'Tim Agen Profesional',
    },
    {
        src: '/images/agent-2.jpeg',
        alt: 'Senior Property Agent',
        caption: 'Konsultan Berpengalaman',
    },
];

export default function AgentCarousel() {
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [animating, setAnimating] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const go = useCallback((index: number, dir: 'left' | 'right') => {
        if (animating) return;
        setDirection(dir);
        setPrev(current);
        setCurrent(index);
        setAnimating(true);
        setTimeout(() => { setPrev(null); setAnimating(false); }, 450);
    }, [animating, current]);

    const next = useCallback(() => go((current + 1) % slides.length, 'right'), [current, go]);
    const prev_ = useCallback(() => go((current - 1 + slides.length) % slides.length, 'left'), [current, go]);

    useEffect(() => {
        timerRef.current = setTimeout(next, 4000);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [current, next]);

    const enterX = direction === 'right' ? '100%' : '-100%';
    const exitX = direction === 'right' ? '-100%' : '100%';

    return (
        <>
            <style>{`
        @keyframes slide-enter {
          from { transform: translateX(var(--enter-x)); opacity: 0; }
          to   { transform: translateX(0);              opacity: 1; }
        }
        @keyframes slide-exit {
          from { transform: translateX(0);             opacity: 1; }
          to   { transform: translateX(var(--exit-x)); opacity: 0; }
        }
        .carousel-enter {
          animation: slide-enter 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        .carousel-exit {
          animation: slide-exit 0.45s cubic-bezier(0.22,1,0.36,1) both;
          position: absolute;
          inset: 0;
        }
      `}</style>

            <div className="relative">
                {/* ── Main image frame ── */}
                <div
                    className="aspect-[4/5] rounded-2xl overflow-hidden relative"
                    style={{ boxShadow: '0 32px 64px -16px rgba(0,0,0,0.25)' }}
                >
                    {/* Exiting slide */}
                    {prev !== null && (
                        <div
                            className="carousel-exit"
                            style={{ '--exit-x': exitX } as React.CSSProperties}
                        >
                            <img src={slides[prev].src} alt={slides[prev].alt} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Entering slide */}
                    <div
                        key={current}
                        className="carousel-enter w-full h-full"
                        style={{ '--enter-x': enterX } as React.CSSProperties}
                    >
                        <img src={slides[current].src} alt={slides[current].alt} className="w-full h-full object-cover" />
                    </div>

                    {/* Caption overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-victoria-navy/80 to-transparent px-6 py-5">
                        <p className="text-white font-medium text-sm tracking-wide">
                            {slides[current].caption}
                        </p>
                    </div>

                    {/* Prev / Next buttons */}
                    <button
                        onClick={prev_}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 hover:scale-110"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 hover:scale-110"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dot indicators — inside the image, bottom center */}
                    <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => go(i, i > current ? 'right' : 'left')}
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: i === current ? '20px' : '8px',
                                    background: i === current ? 'var(--color-victoria-red)' : 'rgba(255,255,255,0.6)',
                                }}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Badge ── */}
                <div
                    className="absolute -bottom-6 -left-6 bg-victoria-red text-white p-6 rounded-xl shadow-xl z-10"
                    style={{ animation: 'heroFadeUp 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.6s both' }}
                >
                    <p className="text-4xl font-bold">10+</p>
                    <p className="text-sm">Tahun Melayani Indonesia</p>
                </div>
            </div>
        </>
    );
}