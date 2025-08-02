
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Set body background to black on mount
    document.body.classList.add('bg-black');

    return () => {
      // Cleanup
      document.body.classList.remove('bg-black');
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div
        className="glass-card p-8 md:p-12 rounded-2xl max-w-md w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-amber-400/20 flex items-center justify-center">
            <AlertTriangle size={40} className="text-amber-400" />
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl font-bold text-[#F2A83B] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-xl text-white mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Page not found
        </motion.p>

        <motion.p
          className="text-white/70 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2 hover:bg-white/10 border-white/20 text-white"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>

          <Button
            onClick={() => navigate('/')}
            className="gap-2 bg-[#F2A83B] text-black hover:bg-[#F2A83B]/90"
          >
            <Home size={18} />
            Return Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
