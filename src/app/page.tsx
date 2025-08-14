'use client'
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import GlobalLoader from "@/components/GlobalLoader";
import dynamic from 'next/dynamic';
import { isValidEmail } from "@/utils/formtools";
import { toast } from "sonner"

const HomeScene = dynamic(() => import('@/components/scenes/HomeScene'), {
  ssr: false,
});

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [processing, setProcessing] = useState<boolean>(false)
  const [introAniDelay] = useState<number>(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true)
    if ( isValidEmail(email) ) {
      try {
        const res = await fetch('/api/addContacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        await res.json();

        if (!res.ok) {
          setProcessing(false)
          return;
        }
    
        setProcessing(false)
      } catch (error) {
        console.error('Error adding contact:', error);
        setProcessing(false)
      }
      setSubmitted(true);
    } else {
      toast.error("An error occured", {
        description: "Please ensure you're using a valid email.",
      })
      setProcessing(false)
    }
  };

  return (
    <>
      {isLoading ? <GlobalLoader loaded={setIsLoading} /> : null}
      <HomeScene />
      {!isLoading ? 
      <main className="relative z-[1] text-gray-200 min-h-screen flex flex-col items-center justify-center font-mono px-5 py-10 md:py-0">
        {/* HEADER */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay : introAniDelay }}
          className="max-w-3xl w-full border-b border-gray-700 pb-4 mb-8"
        >
          <h1 className="text-gray-400 tracking-widest text-sm uppercase">
            Document Ref: MYB-2025 / Rev. A
          </h1>
          <h2 className="text-4xl font-bold mt-2 text-white">MISSION - PRELAUNCH</h2>
          <p className="text-gray-400 text-sm mt-1">
            Operations Manual – Excerpt
          </p>
        </motion.header>

        {/* MAIN CONTENT */}
        <section className="max-w-3xl w-full space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay : introAniDelay + 0.15 }}
            className="text-xl text-stone-300 leading-relaxed"
          >
          Your ultimate tool for financial mastery. Offering personalized insights and recommendations to optimize spending and reach your financial goals faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay : introAniDelay + 0.3 }}
            className="border border-gray-700 p-6 space-y-4 bg-amber-500 rounded-3xl"
          >
            <h3 className="text-black text-sm tracking-widest uppercase">
              Primary Functions
            </h3>
            <ul className="list-disc list-inside text-black text-md space-y-1">
              <li>Track expenses and view trends.</li>
              <li>Strategic course adjustments - budgeting suggestions.</li>
            </ul>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay : introAniDelay + 0.45 }}
            className="text-gray-400 italic text-sm"
          >
            *Note: This document contains partial excerpts.  
            Full operational parameters classified.
          </motion.p>

          {/* EMAIL FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay : introAniDelay + 0.6 }}
            className="pt-6 border-t border-gray-700"
          >
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 items-center mt-4"
              >
                <label
                  htmlFor="email"
                  className="text-gray-400 uppercase tracking-widest text-sm"
                >
                  Notification Frequency: Launch Event Only
                </label>
                <div className="flex w-full sm:w-auto gap-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="ENTER EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black border border-gray-600 px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-300 w-full sm:w-64"
                  />
                  <button
                    type="submit"
                    className="border border-gray-500 px-6 py-2 text-sm uppercase tracking-widest hover:bg-gray-200 hover:text-black transition-colors duration-300"
                    disabled={processing ? true : false}
                  >
                    {processing ? 'Transmitting' : 'Confirm'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-amber-500 text-sm mt-4">
                Transmission received. Stand by for launch sequence.
              </p>
            )}
          </motion.div>
        </section>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay : introAniDelay + 0.75 }}
          className="mt-12 text-gray-500 text-xs uppercase tracking-widest"
        >
          &copy; 2025 - mybplus.com | coming 2025 | V 0.25
        </motion.footer>
      </main>
      : null }
    </>
  );
}