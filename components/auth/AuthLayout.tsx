"use client";

import Link from "next/link";

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
      <div className="hidden lg:flex lg:w-1/2 bg-victoria-navy relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-victoria-navy via-victoria-navy/95 to-victoria-red/20" />

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