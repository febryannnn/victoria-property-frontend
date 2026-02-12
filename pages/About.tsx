import { Users, Target, Award, TrendingUp, CheckCircle, Building2, Handshake, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  const stats = [
    { value: '5000+', label: 'Properti Terjual', icon: Building2 },
    { value: '10+', label: 'Tahun Pengalaman', icon: TrendingUp },
    { value: '50+', label: 'Agen Profesional', icon: Users },
    { value: '98%', label: 'Kepuasan Klien', icon: Award },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Kepercayaan',
      description: 'Kami membangun hubungan jangka panjang dengan klien melalui transparansi dan integritas dalam setiap transaksi.',
    },
    {
      icon: Target,
      title: 'Profesionalisme',
      description: 'Tim agen kami terlatih secara profesional untuk memberikan layanan terbaik dalam setiap proses jual beli properti.',
    },
    {
      icon: Handshake,
      title: 'Komitmen',
      description: 'Kami berkomitmen untuk membantu setiap klien menemukan properti impian mereka dengan harga terbaik.',
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative py-20 bg-victoria-navy overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center" />
          </div>
          <div className="container-victoria relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tentang Victoria Property
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Partner terpercaya Anda dalam menemukan hunian impian sejak 2014. 
              Melayani seluruh Indonesia dengan profesionalisme tinggi.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card relative -mt-8">
          <div className="container-victoria">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-victoria-light">
                  <stat.icon className="w-10 h-10 text-victoria-red mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-bold text-victoria-navy">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding">
          <div className="container-victoria">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
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
                    Baik itu rumah pertama, investasi properti, atau properti komersial.
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
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-victoria-red flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                    alt="Victoria Property Office"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-victoria-red text-white p-6 rounded-xl shadow-xl">
                  <p className="text-4xl font-bold">10+</p>
                  <p className="text-sm">Tahun Melayani Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section-padding bg-victoria-light">
          <div className="container-victoria">
            <div className="text-center mb-12">
              <span className="text-victoria-red font-semibold uppercase tracking-wider text-sm">
                Visi & Misi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mt-2">
                Nilai-Nilai Kami
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-card p-8 rounded-xl shadow-md text-center">
                  <div className="w-16 h-16 bg-victoria-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-victoria-red" />
                  </div>
                  <h3 className="text-xl font-bold text-victoria-navy mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding">
          <div className="container-victoria">
            <div className="text-center mb-12">
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
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="group">
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
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-victoria-navy text-white">
          <div className="container-victoria text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Menemukan Properti Impian Anda?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Hubungi tim kami hari ini untuk konsultasi gratis dan mulai perjalanan 
              Anda menuju hunian impian.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/properties" className="btn-victoria-primary">
                Lihat Properti
              </a>
              <a href="/contact" className="btn-victoria border-2 border-white text-white hover:bg-white hover:text-victoria-navy">
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
