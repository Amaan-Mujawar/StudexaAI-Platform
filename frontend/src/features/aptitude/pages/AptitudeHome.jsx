// src/features/aptitude/pages/AptitudeHome.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LayoutGrid } from "lucide-react";

import { useAptitude } from "../hooks/useAptitude.js";
import AptitudeGenerator from "../components/AptitudeGenerator.jsx";

const containerAnim = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      staggerChildren: 0.1 
    },
  },
};

const AptitudeHome = () => {
  const navigate = useNavigate();
  const { generating, createAptitude } = useAptitude();

  const handleGenerate = async (params) => {
    try {
      const data = await createAptitude(params);
      if (data?.attemptId) {
        toast.success("Practice session started!");
        navigate(`/dashboard/aptitude/${data.attemptId}`);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to start practice");
    }
  };

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center p-4">
      <motion.div
        variants={containerAnim}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue shadow-brand shadow-brand-blue/10">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-text-title tracking-tight sm:text-4xl">
            Aptitude
          </h1>
          <p className="mt-2 text-sm font-semibold text-text-muted">
            Sharpen your quantitative reasoning with timed challenges and adaptive problem sets.
          </p>
        </div>

        <AptitudeGenerator 
          onGenerate={handleGenerate} 
          loading={generating} 
        />
        
        <p className="mt-6 text-center text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-50">
          Your recent attempts are available in the sidebar history
        </p>
      </motion.div>
    </div>
  );
};

export default AptitudeHome;
