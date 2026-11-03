// src/features/verbalReasoning/pages/VerbalHome.jsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";

import { useVerbalReasoning } from "../hooks/useVerbalReasoning.js";
import VerbalGenerator from "../components/VerbalGenerator.jsx";

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

const VerbalHome = () => {
  const navigate = useNavigate();
  const { generating, createVerbal } = useVerbalReasoning();

  const handleGenerate = async (params) => {
    try {
      const data = await createVerbal(params);
      if (data?.attemptId) {
        toast.success("Verbal session started!");
        navigate(`/dashboard/verbal-reasoning/${data.attemptId}`);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to start verbal session");
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
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-text-title tracking-tight sm:text-4xl">
            Verbal Reasoning
          </h1>
          <p className="mt-2 text-sm font-semibold text-text-muted">
            Master the art of language and logic. Refine your vocabulary and comprehension skills today.
          </p>
        </div>

        <VerbalGenerator 
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

export default VerbalHome;
