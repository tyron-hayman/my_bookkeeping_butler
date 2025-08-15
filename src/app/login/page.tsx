'use client'
import { FormEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { isValidEmail } from "@/utils/formtools";
import { toast } from "sonner"
import { supabase } from "@/app/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false)
  const [introAniDelay] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to the app
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (data.session) {
        router.replace('/dashboard');
      }
    })();
    return () => {
      isMounted = false;
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setProcessing(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed", { description: error.message });
        return;
      }

      if (!data.session) {
        toast.error("Login failed", { description: "No session returned" });
        return;
      }

      toast.success("Login successful!");
      router.replace('/dashboard');
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Login failed. Please try again.", { description: message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <main className="relative z-[1] bg-[url(/images/grad_bg.jpg)] text-gray-200 min-h-screen flex flex-col items-center justify-center font-mono px-5 py-10 md:py-0">
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay : introAniDelay }}
          className="max-w-md w-full border-b border-gray-700 pb-4 mb-8"
        >
          <h1 className="text-gray-400 tracking-widest text-sm uppercase">
            Document Ref: MYB-2025 / Rev. A
          </h1>
          <h2 className="text-4xl font-bold mt-2 text-white">LOGIN</h2>
        </motion.header>

        {/* LOGIN FORM */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay : introAniDelay + 0.15 }}
          onSubmit={handleSubmit}
          className="max-w-md w-full space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your email"
                required
                disabled={processing}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter your password"
                required
                disabled={processing}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 disabled:cursor-not-allowed text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {processing ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center">
            <a href="#" className="text-amber-400 hover:text-amber-300 text-sm transition-colors duration-200">
              Forgot your password?
            </a>
          </div>
        </motion.form>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay : introAniDelay + 0.75 }}
          className="mt-12 text-gray-300 text-xs uppercase tracking-widest"
        >
          &copy; 2025 - mybplus.com | coming 2025 | V 0.25
        </motion.footer>
      </main>
    </>
  );
}