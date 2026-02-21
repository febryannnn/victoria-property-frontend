"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen bg-victoria-light flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-victoria-red/50 relative overflow-hidden text-white">
        {/* Background Image with low opacity */}
        <div className="absolute inset-0">
          <Image
            src="/perumahan.jpg" // Update with your image path
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        {/* Gradient overlay to maintain red theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-victoria-maroon via-victoria-red/95 to-victoria-red/20" />

        {/* Back to Home Link */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-victoria-red rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">
                V
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl leading-tight">
                Victoria
              </span>
              <span className="text-sm text-victoria-grey/70 uppercase tracking-wider">
                Property
              </span>
            </div>
          </Link>

          <h1 className="text-4xl font-bold mb-6">{title}</h1>

          <p className="text-lg text-victoria-grey/80 mb-8 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}