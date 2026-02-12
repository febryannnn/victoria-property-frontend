import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
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

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Pesan Terkirim!',
      description: 'Tim kami akan menghubungi Anda dalam 24 jam.',
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat Kantor',
      details: ['Jl. Sudirman No. 123', 'Jakarta Pusat 10220', 'Indonesia'],
    },
    {
      icon: Phone,
      title: 'Telepon',
      details: ['+62 21 123 456', '+62 812 3456 7890 (WhatsApp)'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@victoriaproperty.id', 'sales@victoriaproperty.id'],
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      details: ['Senin - Jumat: 08:00 - 17:00', 'Sabtu: 09:00 - 15:00', 'Minggu: Libur'],
    },
  ];

  const faqs = [
    {
      question: 'Bagaimana cara memasang iklan properti?',
      answer: 'Hanya agen dan admin Victoria Property yang dapat memasang iklan. Jika Anda ingin menjual properti, silakan hubungi tim kami untuk konsultasi gratis.',
    },
    {
      question: 'Apakah ada biaya untuk konsultasi?',
      answer: 'Tidak, konsultasi dengan tim kami sepenuhnya gratis. Kami siap membantu Anda menemukan properti impian atau menjual properti Anda.',
    },
    {
      question: 'Berapa lama proses jual beli properti?',
      answer: 'Proses jual beli properti biasanya memakan waktu 1-3 bulan, tergantung pada kelengkapan dokumen dan negosiasi harga.',
    },
    {
      question: 'Apakah Victoria Property melayani seluruh Indonesia?',
      answer: 'Ya, kami memiliki jaringan agen di berbagai kota besar di Indonesia termasuk Jakarta, Surabaya, Bandung, Medan, dan Bali.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative py-20 bg-victoria-navy overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920')] bg-cover bg-center" />
          </div>
          <div className="container-victoria relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Ada pertanyaan tentang properti? Tim kami siap membantu Anda 
              menemukan solusi terbaik untuk kebutuhan properti Anda.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-card relative -mt-8">
          <div className="container-victoria">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-victoria-light p-6 rounded-xl">
                  <div className="w-12 h-12 bg-victoria-red/10 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-victoria-red" />
                  </div>
                  <h3 className="font-semibold text-victoria-navy mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="section-padding">
          <div className="container-victoria">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                  Kirim Pesan
                </span>
                <h2 className="text-3xl font-bold text-victoria-navy mt-2 mb-6">
                  Kami Siap Membantu
                </h2>
                <p className="text-muted-foreground mb-8">
                  Isi formulir di bawah ini dan tim kami akan menghubungi Anda 
                  dalam waktu 24 jam.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nama Lengkap *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama Anda"
                        required
                        className="input-search"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@contoh.com"
                        required
                        className="input-search"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nomor Telepon
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+62 812 3456 7890"
                        className="input-search"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subjek *
                      </label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger className="input-search">
                          <SelectValue placeholder="Pilih subjek" />
                        </SelectTrigger>
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pesan *
                    </label>
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

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" className="bg-victoria-red hover:bg-victoria-red/90 text-white">
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Pesan
                    </Button>
                    <Button type="button" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Chat WhatsApp
                    </Button>
                  </div>
                </form>
              </div>

              {/* Map */}
              <div>
                <div className="bg-victoria-light rounded-xl overflow-hidden h-[400px] mb-6">
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

                <div className="bg-card p-6 rounded-xl shadow-md">
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
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-victoria-light">
          <div className="container-victoria">
            <div className="text-center mb-12">
              <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mt-2">
                Pertanyaan Umum
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-victoria-navy mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
