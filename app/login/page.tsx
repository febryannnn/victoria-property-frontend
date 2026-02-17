"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from "@/components/auth/AuthLayout";
import { login } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleGoogleLogin() {
    // Jika backend sudah ada endpoint OAuth:
    // window.location.href = "http://localhost:8080/api/auth/google";

    // Jika belum, sementara:
    toast.info("Google login belum dikonfigurasi");
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await login({
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login berhasil!");
      console.log(res)

      if (res.data.user.role === 1) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }

    } catch (err: any) {
      toast.error(err?.message || "Login gagal")
      setError(err?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Selamat Datang Kembali!"
      subtitle="Masuk ke akun Anda untuk melihat properti favorit, riwayat pencarian, dan rekomendasi properti yang dipersonalisasi untuk Anda."
    >
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 text-muted-foreground hover:text-victoria-navy mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <h2 className="text-2xl font-bold text-victoria-navy mb-2">
          Masuk ke Akun Anda
        </h2>

        <p className="text-muted-foreground mb-6">
          Masukkan email dan password Anda untuk melanjutkan
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className="pl-10 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="pl-10 pr-10 h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Ingat saya
                </Label>
              </div>

              <button
                type="button"
                className="text-sm text-victoria-red hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">atau</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-12 flex items-center justify-center gap-3 border-gray-200 hover:border-victoria-red hover:text-victoria-red transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Masuk dengan Google
            </Button>

          </div>
          


          <Button className="w-full h-12 bg-victoria-red text-white">
            Masuk
          </Button>

          <p className="text-center text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-victoria-red font-medium hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}