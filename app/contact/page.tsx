'use client'
import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  const transform = { up: 'translateY(36px)', left: 'translateX(-36px)', right: 'translateX(36px)', fade: 'none' }[direction];
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transform,
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated contact info card
───────────────────────────────────────────── */
function InfoCard({
  icon: Icon,
  title,
  details,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  details: string[];
  delay: number;
}) {
  const { ref, visible } = useScrollReveal(0.2);
  return (
    <div
      ref={ref}
      className="bg-victoria-light p-6 rounded-xl group hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, translate 0.3s ease`,
      }}
    >
      <div className="relative w-12 h-12 bg-victoria-red/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
        <span
          className="absolute inset-0 rounded-full bg-victoria-red/15 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-600"
          style={{ transition: 'transform 0.6s ease, opacity 0.6s ease' }}
        />
        <Icon
          className="w-6 h-6 text-victoria-red relative z-10"
          style={{
            transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0.4) rotate(-30deg)',
            transition: `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay + 120}ms`,
          }}
        />
      </div>
      <h3 className="font-semibold text-victoria-navy mb-2">{title}</h3>
      {details.map((detail, i) => (
        <p key={i} className="text-muted-foreground text-sm">{detail}</p>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated FAQ accordion item
───────────────────────────────────────────── */
function FaqItem({
  question,
  answer,
  delay,
}: {
  question: string;
  answer: string;
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useScrollReveal(0.1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  return (
    <div
      ref={ref}
      className="bg-card rounded-xl shadow-sm overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-24px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left group"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-semibold text-victoria-navy group-hover:text-victoria-red transition-colors duration-200">
          {question}
        </h3>
        <ChevronDown
          className="w-5 h-5 text-victoria-red flex-shrink-0 ml-4 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        style={{ height, overflow: 'hidden', transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div ref={bodyRef} className="px-6 pb-6">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated form field wrapper
───────────────────────────────────────────── */
function FormField({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  const { ref, visible } = useScrollReveal(0.05);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast({
      title: 'Pesan Terkirim!',
      description: 'Tim kami akan menghubungi Anda dalam 24 jam.',
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: MapPin, title: 'Alamat Kantor', details: ['Jl. Sudirman No. 123', 'Jakarta Pusat 10220', 'Indonesia'] },
    { icon: Phone, title: 'Telepon', details: ['+62 21 123 456', '+62 812 3456 7890 (WhatsApp)'] },
    { icon: Mail, title: 'Email', details: ['info@victoriaproperty.id', 'sales@victoriaproperty.id'] },
    { icon: Clock, title: 'Jam Operasional', details: ['Senin - Jumat: 08:00 - 17:00', 'Sabtu: 09:00 - 15:00', 'Minggu: Libur'] },
  ];

  const faqs = [
    { question: 'Bagaimana cara memasang iklan properti?', answer: 'Hanya agen dan admin Victoria Property yang dapat memasang iklan. Jika Anda ingin menjual properti, silakan hubungi tim kami untuk konsultasi gratis.' },
    { question: 'Apakah ada biaya untuk konsultasi?', answer: 'Tidak, konsultasi dengan tim kami sepenuhnya gratis. Kami siap membantu Anda menemukan properti impian atau menjual properti Anda.' },
    { question: 'Berapa lama proses jual beli properti?', answer: 'Proses jual beli properti biasanya memakan waktu 1-3 bulan, tergantung pada kelengkapan dokumen dan negosiasi harga.' },
    { question: 'Apakah Victoria Property melayani seluruh Indonesia?', answer: 'Ya, kami memiliki jaringan agen di berbagai kota besar di Indonesia termasuk Jakarta, Surabaya, Bandung, Medan, dan Bali.' },
  ];

  return (
    <>
      <style>{`
        @keyframes heroFadeDown {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin-send {
          to { transform: rotate(360deg); }
        }
        .hero-title  { animation: heroFadeDown 0.9s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-sub    { animation: heroFadeUp  0.9s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .input-focus-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .input-focus-lift:focus-within { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
      `}</style>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28">
          {/* ── Hero ── */}
          <section className="relative py-20 bg-victoria-navy overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center" />
            </div>
            {/* shimmer sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 4s linear infinite',
              }}
            />
            <div className="container-victoria relative z-10 text-center">
              <h1 className="hero-title text-4xl md:text-5xl font-bold text-white mb-6">
                Hubungi Kami
              </h1>
              <p className="hero-sub text-xl text-white/80 max-w-3xl mx-auto">
                Ada pertanyaan tentang properti? Tim kami siap membantu Anda
                menemukan solusi terbaik untuk kebutuhan properti Anda.
              </p>
            </div>
          </section>

          {/* ── Contact Info Cards ── */}
          <section className="py-12 bg-card relative -mt-8">
            <div className="container-victoria">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info, i) => (
                  <InfoCard key={i} icon={info.icon} title={info.title} details={info.details} delay={i * 100} />
                ))}
              </div>
            </div>
          </section>

          {/* ── Form & Map ── */}
          <section className="section-padding">
            <div className="container-victoria">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Form */}
                <Reveal direction="left">
                  <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                    Kirim Pesan
                  </span>
                  <h2 className="text-3xl font-bold text-victoria-navy mt-2 mb-6">
                    Kami Siap Membantu
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam waktu 24 jam.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormField delay={0}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="input-focus-lift">
                          <label className="block text-sm font-medium text-foreground mb-2">Nama Lengkap *</label>
                          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Masukkan nama Anda" required className="input-search" />
                        </div>
                        <div className="input-focus-lift">
                          <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                          <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@contoh.com" required className="input-search" />
                        </div>
                      </div>
                    </FormField>

                    <FormField delay={80}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="input-focus-lift">
                          <label className="block text-sm font-medium text-foreground mb-2">Nomor Telepon</label>
                          <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62 812 3456 7890" className="input-search" />
                        </div>
                        <div className="input-focus-lift">
                          <label className="block text-sm font-medium text-foreground mb-2">Subjek *</label>
                          <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                            <SelectTrigger className="input-search"><SelectValue placeholder="Pilih subjek" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">Konsultasi Properti</SelectItem>
                              <SelectItem value="sell">Jual Properti</SelectItem>
                              <SelectItem value="buy">Beli Properti</SelectItem>
                              <SelectItem value="rent">Sewa Properti</SelectItem>
                              <SelectItem value="partnership">Kerjasama</SelectItem>
                              <SelectItem value="other">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </FormField>

                    <FormField delay={160}>
                      <div className="input-focus-lift">
                        <label className="block text-sm font-medium text-foreground mb-2">Pesan *</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tuliskan pesan atau pertanyaan Anda..."
                          rows={5}
                          required
                          className="input-search resize-none"
                        />
                      </div>
                    </FormField>

                    <FormField delay={240}>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="submit"
                          disabled={sending}
                          className="bg-victoria-red hover:bg-victoria-red/90 text-white relative overflow-hidden group"
                          style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(180,30,30,0.35)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                          {/* ripple bg */}
                          <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 rounded-md transition-transform duration-500 origin-center" />
                          {sending ? (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4" style={{ animation: 'spin-send 0.7s linear infinite' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" />
                              </svg>
                              Mengirim...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Send className="w-5 h-5 relative z-10" />
                              Kirim Pesan
                            </span>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white group"
                          style={{ transition: 'transform 0.2s ease' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                          asChild
                        >
                          <a
                            href="https://api.whatsapp.com/send/?phone=6281280269318"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                            Chat WhatsApp
                          </a>
                        </Button>
                      </div>
                    </FormField>
                  </form>
                </Reveal>

                {/* Map */}
                <Reveal direction="right" delay={150}>
                  <div
                    className="bg-victoria-light rounded-xl overflow-hidden h-[400px] mb-6"
                    style={{ boxShadow: '0 16px 48px -12px rgba(0,0,0,0.18)' }}
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.562577356477!2d112.8023194!3d-7.290505100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb003a7d43b7%3A0x11ef21b431e28446!2sN%C5%8DE%20Kost%20(Mahasiswa)!5e0!3m2!1sen!2sid!4v1767800767245!5m2!1sen!2sid"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Victoria Property Location"
                    />
                  </div>

                  <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="font-semibold text-victoria-navy mb-4">Kantor Pusat</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-victoria-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-victoria-red" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Victoria Property Indonesia</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Jl. Jenderal Sudirman No. 123<br />
                          Gedung Victoria Tower, Lt. 15<br />
                          Jakarta Pusat 10220
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="section-padding bg-victoria-light">
            <div className="container-victoria">
              <Reveal direction="up" className="text-center mb-12">
                <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">FAQ</span>
                <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mt-2">
                  Pertanyaan Umum
                </h2>
              </Reveal>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} question={faq.question} answer={faq.answer} delay={i * 100} />
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;