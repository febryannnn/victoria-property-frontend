import { Shield, Clock, Users, Award, CheckCircle, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Transaksi Aman',
    description: 'Setiap transaksi dijamin keamanannya dengan proses verifikasi yang ketat',
  },
  {
    icon: Clock,
    title: 'Proses Cepat',
    description: 'Temukan properti impian Anda dalam hitungan menit dengan sistem pencarian canggih',
  },
  {
    icon: Users,
    title: 'Agen Profesional',
    description: 'Didukung oleh ribuan agen properti berpengalaman dan tersertifikasi',
  },
  {
    icon: Award,
    title: 'Kualitas Terjamin',
    description: 'Semua listing diverifikasi untuk memastikan kualitas dan kebenaran informasi',
  },
  {
    icon: CheckCircle,
    title: 'Legalitas Jelas',
    description: 'Dokumen dan legalitas properti telah diperiksa oleh tim ahli kami',
  },
  {
    icon: Headphones,
    title: 'Dukungan 24/7',
    description: 'Tim customer service siap membantu Anda kapan saja, di mana saja',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-victoria-cream">
      <div className="container-victoria">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-victoria-yellow/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-victoria-yellow rounded-full" />
              <span className="text-victoria-navy text-sm font-semibold">Mengapa Victoria Property?</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mb-6 leading-tight">
              Partner Terpercaya untuk
              <span className="text-victoria-red block">Investasi Properti Anda</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8">
              Dengan pengalaman lebih dari 10 tahun di industri properti Indonesia, 
              kami berkomitmen memberikan layanan terbaik untuk membantu Anda menemukan 
              hunian atau investasi yang tepat.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-card rounded-xl shadow-victoria-sm">
                <div className="text-3xl font-bold text-victoria-red mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Kepuasan Klien</div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-victoria-sm">
                <div className="text-3xl font-bold text-victoria-red mb-1">15K+</div>
                <div className="text-sm text-muted-foreground">Properti Terjual</div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl shadow-victoria-sm">
                <div className="text-3xl font-bold text-victoria-red mb-1">10+</div>
                <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
              </div>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-victoria-light flex items-center justify-center mb-4 group-hover:bg-victoria-navy transition-colors">
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
  );
};

export default WhyChooseUs;
