'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-500/5 border border-red-500/10 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}
        
        {/* Email Field */}
        <div className="space-y-2 group">
          <label
            htmlFor="email"
            className="text-[12px] font-semibold text-[#444748] uppercase tracking-[0.1em] block transition-colors group-focus-within:text-[#775a19]"
          >
            Email Address
          </label>
          <input
            id="email"
            placeholder="curator@ethereal.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-[#c4c7c7] px-0 py-3 text-[16px] text-[#1a1c1a] focus:ring-0 focus:border-[#775a19] transition-all placeholder:text-[#c4c7c7] outline-none"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-[12px] font-semibold text-[#444748] uppercase tracking-[0.1em] block transition-colors group-focus-within:text-[#775a19]"
            >
              Password
            </label>
            <Link
              href="#"
              className="text-[10px] font-semibold text-[#444748] hover:text-[#775a19] uppercase tracking-[0.15em] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-[#c4c7c7] px-0 py-3 text-[16px] text-[#1a1c1a] focus:ring-0 focus:border-[#775a19] transition-all placeholder:text-[#c4c7c7] outline-none"
            required
          />
        </div>

        {/* Primary Action */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-5 text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-secondary transition-all duration-500 rounded-none shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authorizing Access...' : 'Sign In'}
          </button>
        </div>
      </form>


      {/* Footer / Secondary Navigation */}
      <div className="mt-16 pt-8 border-t border-[#e9e8e5] flex flex-col items-center gap-4">
        <p className="text-[16px] text-[#444748]">New to the Grandeur?</p>
        <Link 
          href="/signup" 
          className="text-[14px] font-medium text-[#775a19] uppercase tracking-[0.05em] hover:border-b hover:border-[#775a19] pb-1 transition-all"
        >
          Create an Account
        </Link>
      </div>
    </>
  );
}
