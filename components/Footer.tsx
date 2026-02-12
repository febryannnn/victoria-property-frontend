import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const quickLinks = [
    { name: "Cari Properti", href: "/properties" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Hubungi Kami", href: "/contact" },
  ];

  const propertyTypes = [
    { name: "Rumah Dijual", href: "/properties" },
    { name: "Rumah Disewa", href: "/properties" },
    { name: "Apartemen", href: "/properties" },
    { name: "Ruko & Komersial", href: "/properties" },
    { name: "Tanah", href: "/properties" },
    { name: "Gedung", href: "/properties" },
    { name: "Hotel", href: "/properties" },
  ];

  const popularLocations = [
    { name: "Jakarta Selatan", href: "/properties?location=jakarta-selatan" },
    { name: "Tangerang Selatan", href: "/properties?location=tangerang-selatan" },
    { name: "Bogor", href: "/properties?location=bogor" },
    { name: "Bekasi", href: "/properties?location=bekasi" },
    { name: "Depok", href: "/properties?location=depok" },
  ];

  return (
    <footer className="bg-victoria-navy text-victoria-cream">
      {/* Main Footer */}
      <div className="container-victoria py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-victoria-cream rounded-full flex items-center justify-center overflow-hidden p-1">
                <img
                  src="/logo-rmv-bg.png"
                  alt="Victoria Property"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-tight">
                  Victoria
                </span>
                <span className="text-xs text-primary-foreground/70 uppercase tracking-wider">
                  Property
                </span>
              </div>
            </Link>

            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Partner terpercaya Anda dalam menemukan hunian impian. Melayani
              seluruh Indonesia dengan profesionalisme tinggi.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  Jl. Sudirman No. 123, Jakarta Pusat
                </span>
              </div>

              <a
                href="https://api.whatsapp.com/send/?phone=6281280269318"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-victoria-yellow transition-colors"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">+62 812-8026-9318</span>
              </a>

              <a
                href="mailto:victoriapropertycibubur@gmail.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-victoria-yellow transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  victoriapropertycibubur@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Tautan Cepat</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-primary-foreground/70 hover:text-victoria-yellow transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Tipe Properti</h4>
            <ul className="space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-primary-foreground/70 hover:text-victoria-yellow transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Lokasi Populer</h4>
            <ul className="space-y-3">
              {popularLocations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-primary-foreground/70 hover:text-victoria-yellow transition-colors text-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-victoria py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2024 Victoria Property. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-victoria-red transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;