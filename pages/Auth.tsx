import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-victoria-light flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-victoria-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-victoria-navy via-victoria-navy/95 to-victoria-red/20" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-victoria-red rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl leading-tight">Victoria</span>
              <span className="text-sm text-victoria-grey/70 uppercase tracking-wider">Property</span>
            </div>
          </Link>
          
          <h1 className="text-4xl font-bold mb-6">
            {isLogin ? 'Selamat Datang Kembali!' : 'Bergabung Bersama Kami'}
          </h1>
          <p className="text-lg text-victoria-grey/80 mb-8 leading-relaxed">
            {isLogin 
              ? 'Masuk ke akun Anda untuk melihat properti favorit, riwayat pencarian, dan rekomendasi properti yang dipersonalisasi untuk Anda.'
              : 'Daftarkan diri Anda untuk mendapatkan akses penuh ke fitur pencarian properti, simpan favorit, dan notifikasi properti terbaru.'
            }
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-victoria-red/20 flex items-center justify-center">
                <span className="text-victoria-yellow">✓</span>
              </div>
              <span className="text-victoria-grey/90">Akses ribuan listing properti</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-victoria-red/20 flex items-center justify-center">
                <span className="text-victoria-yellow">✓</span>
              </div>
              <span className="text-victoria-grey/90">Simpan properti favorit Anda</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-victoria-red/20 flex items-center justify-center">
                <span className="text-victoria-yellow">✓</span>
              </div>
              <span className="text-victoria-grey/90">Notifikasi properti terbaru</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-victoria-red/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-victoria-yellow/10 rounded-full blur-2xl" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Back Link */}
          <Link to="/" className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-victoria-navy mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-victoria-red rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-victoria-navy leading-tight">Victoria</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Property</span>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isLogin 
                  ? 'bg-card text-victoria-navy shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !isLogin 
                  ? 'bg-card text-victoria-navy shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-victoria-navy mb-2">
            {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isLogin 
              ? 'Masukkan email dan password Anda untuk melanjutkan'
              : 'Isi data berikut untuk mendaftar'
            }
          </p>

          <form className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="pl-10 h-12 border-border focus:border-victoria-navy"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10 h-12 border-border focus:border-victoria-navy"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="+62 812 3456 7890"
                    className="pl-10 h-12 border-border focus:border-victoria-navy"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10 h-12 border-border focus:border-victoria-navy"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Masukkan ulang password"
                    className="pl-10 pr-10 h-12 border-border focus:border-victoria-navy"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Ingat saya
                  </Label>
                </div>
                <button type="button" className="text-sm text-victoria-red hover:underline">
                  Lupa Password?
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-1" />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                  Saya menyetujui{' '}
                  <button type="button" className="text-victoria-red hover:underline">
                    Syarat & Ketentuan
                  </button>
                  {' '}dan{' '}
                  <button type="button" className="text-victoria-red hover:underline">
                    Kebijakan Privasi
                  </button>
                </Label>
              </div>
            )}

            <Button 
              type="submit"
              className="w-full h-12 bg-victoria-red hover:bg-victoria-red/90 text-primary-foreground font-semibold text-base"
            >
              {isLogin ? 'Masuk' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-victoria-light px-4 text-muted-foreground">atau lanjutkan dengan</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 border-border hover:bg-muted">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-12 border-border hover:bg-muted">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            {' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-victoria-red font-medium hover:underline"
            >
              {isLogin ? 'Daftar Sekarang' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
