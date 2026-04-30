import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen font-sans bg-[#faf9f6] text-[#1a1c1a]">
      {/* Left Side: Atmospheric Hero Image */}
      <section className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBGYXVhj_S2_EiHWGftQGoznnwFsHfCBjUVoYDVO4DCoKKVxQxSEu8F6n0XtnmED4aL4_2mNEk80KGLAMamEVUpNB17Ws0LQmUdW0la3veZpqnFA2_LEFtJVWOhD__KPbohpiHeiN5WPpl3y3o1-JEdvyTBpj_c-S6Kb00A7DizirNPAyrbga7WUFVz51wZMub0n3S-00ic3vZ4MYEiwqXeqB4oTSGLTtTFsEkWOeKWNfyJ-fIanRAh2ABFHqtFiUKCCBQt48E61ig')" }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
        
        {/* Brand Overlay */}
        <div className="absolute top-12 left-12 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="font-serif text-[48px] leading-[1.2] tracking-[0.2em] text-white opacity-90 uppercase">
            ETHEREAL
          </span>
        </div>
        
        {/* Atmospheric Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-12 left-12 max-w-md">
          <p className="font-serif text-[48px] leading-[1.2] text-white mb-4">
            Timeless Architecture for the Modern Soul.
          </p>
          <p className="text-[16px] leading-[1.6] text-white/80 uppercase tracking-[0.1em]">
            Est. 1924
          </p>
        </div>
      </section>

      {/* Right Side: Form Canvas */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#faf9f6] relative">
        {/* Mobile Brand Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[#1a1c1a]/60 hover:text-[#1a1c1a] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="font-serif text-[24px] uppercase tracking-[0.2em] text-[#1a1c1a]">
            ETHEREAL
          </span>
        </div>
        
        <div className="w-full max-w-[440px] px-8 py-12 flex flex-col">
          {children}
        </div>

        {/* Absolute Footer Text */}
        <footer className="absolute bottom-8 w-full px-8 flex justify-between items-center opacity-40">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">© 2026 ROYALROOT INTERIORS</p>
          <div className="flex gap-4">
            <Link href="#" className="text-[10px] font-semibold uppercase tracking-[0.2em]">Legal</Link>
            <Link href="#" className="text-[10px] font-semibold uppercase tracking-[0.2em]">Privacy</Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
