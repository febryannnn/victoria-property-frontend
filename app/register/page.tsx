"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { register } from "@/lib/services/auth.service";
import { toast } from "sonner";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [phone_number, setPhone_number] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const router = useRouter();

  function formatErrorMessage(message?: string) {
    if (!message) return null;

    if (message.includes("Password") && message.includes("min")) {
      return "Password minimal 8 karakter.";
    }

    if (message.includes("Email")) {
      return "Format email tidak valid.";
    }

    if (message.includes("Username")) {
      return "Username wajib diisi.";
    }

    return message;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await register({
        email,
        password,
        username,
        phone_number
      });

      toast.success("register berhasil!")
      console.log(res)

      router.push("/login");

    } catch (err: any) {
      const message = formatErrorMessage(err?.message) || "Register gagal";

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Bergabung Bersama Kami"
      subtitle="Daftarkan diri Anda untuk mendapatkan akses penuh ke fitur pencarian properti, simpan favorit, dan notifikasi properti terbaru."
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
          Buat Akun Baru
        </h2>

        <p className="text-muted-foreground mb-6">
          Isi data berikut untuk mendaftar
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                className="pl-10 h-12"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

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
            <Label htmlFor="phone">Nomor Telepon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                className="pl-10 h-12"
                value={phone_number}
                onChange={(e) => setPhone_number(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan ulang password"
                className="pl-10 pr-10 h-12"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              className="mt-1"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal leading-relaxed"
            >
              Saya menyetujui{" "}
              <button
                type="button"
                className="text-victoria-red hover:underline"
                onClick={() => setTermsDialogOpen(true)}
              >
                Syarat & Ketentuan dan Kebijakan Privasi
              </button>
            </Label>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full h-12 bg-victoria-red text-white"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </Button>

          <p className="text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-victoria-red font-medium hover:underline"
            >
              Masuk
            </Link>
          </p>

        </form>
      </div>

      {/* Modal Syarat & Ketentuan */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-victoria-navy">
              Syarat & Ketentuan dan Kebijakan Privasi
            </DialogTitle>
            <DialogDescription>
              Harap baca dengan seksama sebelum melanjutkan registrasi
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Selamat datang di platform digital Victoria Property. Dengan melakukan registrasi atau menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di bawah ini.
              </p>

              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Definisi dan Layanan</h3>
                <p>
                  Victoria Property adalah platform agensi properti yang menyediakan layanan informasi properti di seluruh Indonesia. Website ini memfasilitasi interaksi antara:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Calon Pembeli:</strong> Pengguna yang melakukan registrasi untuk melihat detail properti dan melakukan komunikasi dengan agen.</li>
                  <li><strong>Agen Internal:</strong> Karyawan atau mitra resmi Victoria Property yang diberikan hak untuk mengelola konten properti.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Ketentuan Akun dan Registrasi</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pengguna wajib memberikan informasi yang akurat dan benar saat melakukan registrasi.</li>
                  <li>Meskipun tidak ada batasan usia untuk mengakses website, setiap tindakan hukum terkait transaksi properti tetap tunduk pada peraturan perundang-undangan yang berlaku di Indonesia mengenai usia kedewasaan atau kapasitas hukum.</li>
                  <li>Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi dan aktivitas yang dilakukan melalui akun pribadi.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Peran dan Fungsi Pengguna</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Bagi Calon Pembeli:</strong> Registrasi memungkinkan Anda melihat informasi detail properti. Fitur Call to Action (Tombol Aksi) akan mengarahkan Anda langsung ke layanan pesan instan (chat) dengan agen yang bersangkutan.</li>
                  <li><strong>Bagi Agen Internal:</strong> Agen memiliki akses untuk mengunggah informasi properti (Listing), memantau jumlah statistik pengunjung pada properti tersebut, serta menerima pesan langsung dari calon pembeli.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Tanggung Jawab Konten Properti</h3>
                <p>
                  Setiap data, foto, harga, dan deskripsi properti yang diunggah sepenuhnya merupakan tanggung jawab dari Agen Internal yang mengunggah properti tersebut. Victoria Property selaku penyedia platform tidak bertanggung jawab atas ketidaksesuaian data atau kerugian yang muncul akibat informasi yang diberikan oleh masing-masing agen. Agen wajib memastikan bahwa properti yang dipasarkan adalah sah dan tidak melanggar hukum.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Perlindungan Data Pribadi</h3>
                <p>Sesuai dengan Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP), Victoria Property berkomitmen untuk:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Melindungi data pribadi yang Anda berikan saat registrasi.</li>
                  <li>Menggunakan data tersebut hanya untuk kepentingan layanan internal dan komunikasi pemasaran terkait properti.</li>
                  <li>Tidak memberikan data pribadi kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.</li>
                  <li>Memberikan hak kepada pengguna untuk memperbarui atau meminta penghapusan data pribadi mereka dari sistem kami.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Batasan Tanggung Jawab</h3>
                <p>
                  Victoria Property bertindak sebagai fasilitator komunikasi. Kami tidak bertanggung jawab atas isi percakapan atau kesepakatan yang terjadi di luar sistem kami. Seluruh keputusan transaksi properti sepenuhnya berada di tangan calon pembeli dan agen terkait.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Perubahan Syarat dan Ketentuan</h3>
                <p>
                  Victoria Property berhak untuk mengubah, menambah, atau menghapus bagian dari syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Anda disarankan untuk memeriksa halaman ini secara berkala.
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => {
                setTermsAccepted(true);
                setTermsDialogOpen(false);
              }}
              className="bg-victoria-red text-white"
            >
              Saya Setuju
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
}