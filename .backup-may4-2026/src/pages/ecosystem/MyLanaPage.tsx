import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Banknote, ArrowRight, Sparkles, PieChart, TrendingUp,
  Receipt, Wallet, Lock, X, Mail, User, Loader2, CheckCircle, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OrganicShopFrame from "@/components/shop/OrganicShopFrame";
import WaitlistMasterModal from "@/components/waitlist/WaitlistMasterModal";
import "../ecosystem/EcosystemPage.css";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };
type ModalState = "none" | "admin";

export default function MyLanaPage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<ModalState>("none");
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistCount] = useState(742);

  return (
    <div className="mylana-theme min-h-screen w-full relative bg-white overflow-hidden font-sans">
      <WaitlistMasterModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} preselectedModule="MyLana" />
      <OrganicShopFrame
        onHomeClick={() => navigate("/")}
        onAdminClick={() => setOpenModal("admin")}
        waitlistCount={waitlistCount}
      />

      <main className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center p-6 pt-24">
        <motion.div
          initial="hidden" animate="visible" variants={staggerContainer}
          className="flex flex-col items-center text-center space-y-12 max-w-4xl w-full"
        >
          {/* Counter Pill */}
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-3 px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-full shadow-sm"
          >
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center">
                  <User className="w-3 h-3 text-neutral-400" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500" />
              </span>
              <p className="text-sm font-medium text-neutral-600">
                <span className="text-neutral-900 font-bold">{waitlistCount}</span> en espera
              </p>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="text-gray-900">Dentaxy</span>{" "}
            <span className="eco-gradient-text">MyLana</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl eco-accent-text font-medium">
            Tu control financiero con flow
          </motion.p>

          <motion.p variants={fadeUp} className="text-lg text-gray-500 max-w-2xl mx-auto">
            Gestiona ingresos, egresos, honorarios y visualiza el crecimiento real de tu patrimonio clínico. Finanzas claras, sin contadores externos.
          </motion.p>

          {/* Action Cards */}
          <motion.div variants={staggerContainer} className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
            <motion.button variants={scaleIn} onClick={() => setWaitlistOpen(true)}
              className="flex-1 group relative bg-white border border-neutral-100 p-6 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(101,163,13,0.25)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-lime-600 -rotate-45" />
              </div>
              <div className="bg-lime-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Wallet className="w-7 h-7 text-lime-600" />
              </div>
              <h3 className="font-bold text-neutral-900 text-xl group-hover:text-lime-700 transition-colors">Lista de Espera</h3>
              <p className="text-sm text-neutral-500">Controlar mi patrimonio clínico</p>
            </motion.button>

            <motion.button variants={scaleIn} onClick={() => navigate("/hub")}
              className="flex-1 group relative bg-white border border-neutral-100 p-6 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-12px_rgba(101,163,13,0.1)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-7 h-7 text-gray-500" />
              </div>
              <h3 className="font-bold text-neutral-900 text-xl group-hover:text-gray-700 transition-colors">Ver Ecosistema</h3>
              <p className="text-sm text-neutral-500">Explorar todos los productos Dentaxy</p>
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}
            className="grid sm:grid-cols-3 gap-4 w-full max-w-3xl"
          >
            {[
              { icon: BarChart3, label: "Dashboard Financiero", color: "text-lime-600", bg: "bg-lime-50" },
              { icon: Receipt, label: "Control de Honorarios", color: "text-green-600", bg: "bg-green-50" },
              { icon: TrendingUp, label: "Proyecciones de Crecimiento", color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((f, i) => (
              <motion.div key={i} variants={scaleIn}
                className="eco-glass-card eco-glow-box rounded-2xl p-4 text-center flex flex-col items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <p className="text-sm font-semibold text-gray-700">{f.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Modal */}
      {openModal !== "none" && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-neutral-900/20 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setOpenModal("none")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl w-full max-w-[400px] p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative"
          >
            <button onClick={() => setOpenModal("none")} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200">
              <X className="w-4 h-4 text-neutral-600" />
            </button>
            {openModal === "admin" && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto"><Lock className="w-6 h-6 text-neutral-900" /></div>
                <h2 className="text-2xl font-bold">Admin MyLana</h2>
                <p className="text-sm text-neutral-500">Próximamente disponible</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
