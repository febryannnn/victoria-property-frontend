"use client";

import { useState } from "react";
import { Menu, X, Phone, Mail, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { useEffect, useRef } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Properti", href: "/properties" },
  { name: "Tentang Kami", href: "/about" },
  { name: "Kontak", href: "/contact" },
];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-999999">
      {/* Top Bar */}
      <div className="bg-victoria-navy hidden md:block py-2 text-white">
        <div className="container-victoria flex justify-center items-center text-sm gap-6">
          <span>Promosikan Properti Anda Bersama Kami</span>

          <a
            href="https://api.whatsapp.com/send/?phone=6281280269318"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-victoria-yellow transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>+62 812-8026-9318</span>
          </a>

          <a
            href="/contact"
            className="flex items-center gap-2 hover:text-victoria-yellow transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>victoriapropertycibubur@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-victoria-light backdrop-blur-md border-b border-border shadow-victoria-sm">
        <div className="container-victoria">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center relative">
                <Image
                  src="/logo-rmv-bg.png"
                  alt="Victoria Property"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl uppercase text-victoria-navy leading-tight">
                  Victoria
                </span>
                <span className="ml-1 text-xs text-muted-foreground uppercase tracking-wider">
                  Property
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium transition-colors ${pathname === link.href
                    ? "text-victoria-red underline underline-offset-8"
                    : "text-foreground hover:text-victoria-red"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3 relative">
              {!user ? (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-victoria-navy text-victoria-navy hover:bg-victoria-red hover:text-primary-foreground"
                    >
                      Log In
                    </Button>
                  </Link>

                  <Link href="/register">
                    <Button className="bg-victoria-red hover:bg-victoria-red/90 text-victoria-cream">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Heart icon for favorites */}
                  <Link
                    href="/favorites"
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Favorites"
                  >
                    <Heart className={`w-5 h-5 text-victoria-red transition-colors ${pathname === "/favorites" ? "fill-victoria-red" : "hover:fill-victoria-red"}`} />
                  </Link>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 font-medium text-victoria-navy hover:text-victoria-red transition-colors"
                    >
                      <span>{user.username}</span>
                      <User className="w-5 h-5" />
                    </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-md border border-border z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-muted"
                      >
                        Profile
                      </Link>

                      {user.role === 1 && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 hover:bg-muted"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-muted text-red-500"
                      >
                        Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`py-2 font-medium ${pathname === link.href
                      ? "text-victoria-red"
                      : "text-foreground hover:text-victoria-red"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  {!user ? (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full border-victoria-navy text-victoria-navy">
                          Log In
                        </Button>
                      </Link>

                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-victoria-red text-primary-foreground">
                          Register
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Profile
                        </Button>
                      </Link>

                      {user.role === 1 && (
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Admin Panel
                          </Button>
                        </Link>
                      )}

                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full bg-red-500"
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;