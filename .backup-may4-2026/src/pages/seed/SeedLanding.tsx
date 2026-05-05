
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SeedOnboardingModal } from "./SeedOnboardingModal";
import { supabase } from '@/integrations/supabase/client';
import {
    FileText,
    Shield,
    Cpu,
    Download,
    Upload,
    CheckCircle,
    Lock,
    MapPin,
    HardDrive,
    Globe,
    Zap,
    ArrowRight,
    Sparkles,
    FileCheck,
    PenTool,
    FolderOpen,
    Settings,
    Package,
    Users,
    Calendar,
    Layers,
    ArrowLeft,
    FolderSync
} from "lucide-react";
import heroImage from "@/assets/seed/hero-seed.jpg";
import "./Seed.css";

// Simple animation variants without complex ease types
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

// Helper: icon bg that matches the icon color
const iconBgMap: Record<string, string> = {
    "text-icon-blue": "bg-zinc-900/10",
    "text-icon-amber": "bg-amber-500/10",
    "text-icon-indigo": "bg-indigo-500/10",
    "text-icon-teal": "bg-teal-500/10",
    "text-icon-rose": "bg-zinc-300/10",
    "text-icon-slate": "bg-slate-500/10",
    "text-primary": "bg-primary/10",
};

// Hero Section
const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8">
            {/* Background Image with Parallax */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Dentaxy Seed"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 container mx-auto px-6 text-center"
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        variants={fadeUp}
                        custom={0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-500">
                            Transformación clínica inteligente
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
                    >
                        <span className="text-gray-900">Dentaxy</span>{" "}
                        <span className="seed-text">Seed</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="text-xl md:text-2xl seed-text font-medium mb-4"
                    >
                        La semilla inteligente de tu consultorio
                    </motion.p>

                    <motion.p
                        variants={fadeUp}
                        custom={3}
                        className="text-lg text-gray-500 max-w-2xl mx-auto mb-12"
                    >
                        Transforma tu historia clínica en un sistema inteligente, privado y
                        seguro que escribe, organiza y protege tu práctica clínica.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        className="flex justify-center"
                    >
                        <motion.button
                            onClick={() => document.getElementById('que-es')?.scrollIntoView({ behavior: 'smooth' })}
                            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59, 130, 246, 0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-zinc-800 to-black text-white font-semibold text-lg flex items-center gap-2 justify-center shadow-lg animate-glow-pulse relative overflow-hidden"
                        >
                            {/* Inner Light Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                            Explorar más
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1"
                >
                    <motion.div className="w-1.5 h-3 rounded-full bg-zinc-900" />
                </motion.div>
            </motion.div>
        </section>
    );
};

// What Is Section
const WhatIsSection = () => (
    <section id="que-es" className="py-32 relative">
        <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="max-w-4xl mx-auto text-center mb-20"
            >
                <motion.div variants={fadeUp} className="mb-6">
                    <span className="text-zinc-500 text-sm font-semibold tracking-widest uppercase">
                        ¿Qué es Dentaxy Seed?
                    </span>
                </motion.div>
                <motion.h2
                    variants={fadeUp}
                    className="text-4xl md:text-5xl font-bold mb-8"
                >
                    No es un software.{" "}
                    <span className="gradient-text">Es una transformación.</span>
                </motion.h2>
            </motion.div>

            {/* Not This Cards */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
            >
                {[
                    { text: "No es un software genérico", icon: Cpu, color: "text-slate-500" },
                    { text: "No es una plantilla", icon: FileText, color: "text-slate-500" },
                    { text: "No es un sistema masivo", icon: Users, color: "text-slate-500" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        variants={scaleIn}
                        className="glass-card rounded-2xl p-6 text-center"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center mx-auto mb-4`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <p className="text-gray-400 line-through">{item.text}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* This Is */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="max-w-3xl mx-auto"
            >
                <div className="glass-card glow-box rounded-3xl p-8 md:p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xl md:text-2xl text-gray-900 leading-relaxed">
                        Es la <span className="text-zinc-900 font-semibold">transformación</span> de tu historia
                        clínica actual en un sistema inteligente que{" "}
                        <span className="text-zinc-800 font-semibold">trabaja por ti</span>, desde tu propio
                        consultorio, respetando tu forma real de ejercer la clínica.
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

// What It Does Section
const WhatItDoesSection = () => {
    const features = [
        { icon: FileCheck, title: "Formularios clínicos", description: "Claros, estructurados y profesionales", color: "text-zinc-500" },
        { icon: PenTool, title: "Redacciones automáticas", description: "Precisas y listas para expediente", color: "text-zinc-500" },
        { icon: Download, title: "Documentos descargables", description: "Finales en formato PDF", color: "text-zinc-500" },
        { icon: FolderOpen, title: "Sistema ordenado", description: "Organiza y archiva automáticamente", color: "text-zinc-500" },
        { icon: Cpu, title: "Lógica clínica digital", description: "Basada en tu propio estilo de trabajo", color: "text-zinc-500" },
    ];

    return (
        <section className="py-32 relative bg-gray-50/50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.span
                        variants={fadeUp}
                        className="text-zinc-900 text-sm font-semibold tracking-widest uppercase"
                    >
                        Capacidades
                    </motion.span>
                    <motion.h2
                        variants={fadeUp}
                        className="text-4xl md:text-5xl font-bold mt-4"
                    >
                        ¿Qué hace realmente{" "}
                        <span className="text-gray-900">Dentaxy</span> <span className="seed-text">Seed</span>?
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-gray-500 mt-4 max-w-2xl mx-auto">
                        Toma lo que ya usas hoy —tu historia clínica en PDF, imagen, papel o
                        formato antiguo— y la convierte en:
                    </motion.p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={scaleIn}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="glass-card rounded-2xl p-6 text-center group"
                        >
                            <div className={`w-14 h-14 rounded-xl ${iconBgMap[feature.color.replace('text-', 'text-icon-')] || 'bg-zinc-900/10'} flex items-center justify-center mx-auto mb-4 transition-colors`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-lg text-gray-500 mt-12"
                >
                    Todo esto{" "}
                    <span className="text-zinc-800 font-medium">sin cambiar tu forma de trabajar</span>, solo
                    llevándola a un nivel más eficiente, seguro y profesional.
                </motion.p>
            </div>
        </section>
    );
};

// Problem Section
const ProblemSection = () => {
    const problems = [
        "Escriben todo a mano",
        "Repiten las mismas redacciones",
        "Usan formatos desordenados o poco claros",
        "Pierden tiempo en papeleo",
        "Tienen expedientes difíciles de interpretar",
        "Dependen de sistemas externos o nubes que no controlan",
        "No tienen una estructura digital propia",
    ];

    return (
        <section className="py-32 relative">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.span
                            variants={fadeUp}
                            className="text-zinc-500 text-sm font-semibold tracking-widest uppercase"
                        >
                            El problema
                        </motion.span>
                        <motion.h2
                            variants={fadeUp}
                            className="text-4xl md:text-5xl font-bold mt-4 mb-8"
                        >
                            La realidad de la mayoría de los consultorios
                        </motion.h2>
                        <motion.div variants={staggerContainer} className="space-y-4">
                            {problems.map((problem, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200"
                                >
                                    <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                    <span className="text-gray-500">{problem}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="glass-card glow-box rounded-3xl p-8 md:p-12">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                Dentaxy Seed elimina todo eso{" "}
                                <span className="gradient-text">desde la raíz</span>
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                No te obliga a cambiar tu método. Lo traduce a un sistema digital
                                estructurado que respeta tu forma real de ejercer la clínica.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// How It Works Section
const HowItWorksSection = () => {
    const stepColors = ["text-zinc-500", "text-zinc-500", "text-zinc-500", "text-slate-500", "text-zinc-500"];
    const steps = [
        {
            number: "01",
            icon: Upload,
            title: "Envías tu historia clínica actual",
            description:
                "Subes un PDF, imagen o formato de tu historia clínica real. No importa si está vieja, escaneada o escrita a mano.",
            highlight: "No partes de cero. Partes de lo que ya usas.",
        },
        {
            number: "02",
            icon: Cpu,
            title: "Transformación clínica con Dentaxy",
            description:
                "Tu historia clínica se analiza y se interpreta clínicamente. Identificamos cada apartado, convertimos tu narrativa en formularios estructurados y ajustamos cada sección.",
            highlight: "Nada genérico. Nada improvisado.",
        },
        {
            number: "03",
            icon: PenTool,
            title: "Redacción automática optimizada",
            description:
                "A partir de esos formularios, Dentaxy genera redacciones clínicas completas, apartado por apartado, con lenguaje profesional.",
            highlight: "El doctor llena el formulario. Dentaxy hace la redacción.",
        },
        {
            number: "04",
            icon: Settings,
            title: "Preparación e implementación personalizada",
            description:
                "Entras a un proceso de preparación donde tu sistema se configura internamente y se valida la estructura clínica.",
            highlight: "Tú no tienes que configurar nada técnico.",
        },
        {
            number: "05",
            icon: FolderSync,
            title: "Sincronización automática con tu Google Drive",
            description:
                "Cada expediente clínico se guarda automáticamente en tu propia Google Drive bajo la carpeta Dentaxy Seed / Expedientes / [Folio] - [Nombre]. Sin configurar nada técnico. Sin que tus datos toquen nuestros servidores.",
            highlight: "Soberanía de datos garantizada desde el primer día.",
        },
    ];

    return (
        <section id="como-funciona" className="py-32 relative bg-gray-50/50">
            <div className="container mx-auto px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="text-center mb-20"
                >
                    <motion.span
                        variants={fadeUp}
                        className="text-zinc-900 text-sm font-semibold tracking-widest uppercase"
                    >
                        Proceso
                    </motion.span>
                    <motion.h2
                        variants={fadeUp}
                        className="text-4xl md:text-5xl font-bold mt-4"
                    >
                        ¿Cómo funciona{" "}
                        <span className="text-gray-900">Dentaxy</span> <span className="seed-text">Seed</span>?
                    </motion.h2>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="relative flex gap-6 mb-12 last:mb-0"
                        >
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-black text-white font-bold text-sm shrink-0">
                                    {step.number}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-0.5 h-full bg-gradient-to-b from-blue-600/50 to-transparent mt-4" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="glass-card rounded-2xl p-6 md:p-8 flex-1 group hover:glow-box transition-shadow duration-500">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${iconBgMap[stepColors[i].replace('text-', 'text-icon-')] || 'bg-zinc-900/10'} flex items-center justify-center shrink-0 transition-colors`}>
                                        <step.icon className={`w-6 h-6 ${stepColors[i]}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-gray-500">{step.description}</p>
                                    </div>
                                </div>
                                <div className="ml-16 mt-4 px-4 py-3 rounded-lg bg-zinc-900/10 border-l-2 border-blue-500">
                                    <p className="text-zinc-900 font-medium text-sm">
                                        👉 {step.highlight}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Environment Section
const EnvironmentSection = () => (
    <section className="py-32 relative">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-zinc-900 text-sm font-semibold tracking-widest uppercase">
                        Tu espacio
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        Tu propio{" "}
                        <span className="gradient-text">entorno clínico</span>
                    </h2>
                    <p className="text-gray-500 text-lg mb-8">
                        Cada doctor recibe su propio entorno de trabajo privado:
                    </p>

                    <div className="glass-card rounded-2xl p-6 mb-8 inline-block">
                        <div className="flex items-center gap-2 text-lg">
                            <Globe className="w-5 h-5 text-zinc-500" />
                            <span className="text-gray-500">tu-consultorio</span>
                            <span className="gradient-text font-bold">.dentaxy.com</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Solo tú y tu equipo autorizado pueden entrar",
                            "Tus formularios y documentos viven ahí",
                            "Tu lógica clínica se mantiene intacta",
                            "Tu sistema es independiente de otros consultorios",
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3"
                            >
                                <CheckCircle className="w-5 h-5 text-zinc-800 shrink-0" />
                                <span>{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card glow-box rounded-3xl p-8 text-center"
                >
                    <p className="text-xl font-medium mb-2">No compartes sistema.</p>
                    <p className="text-xl font-medium mb-2">No compartes datos.</p>
                    <p className="text-xl gradient-text font-bold">
                        No dependes de terceros.
                    </p>
                </motion.div>
            </div>
        </div>
    </section>
);

// Security Section
const SecuritySection = () => (
    <section id="seguridad" className="py-32 relative bg-gray-50/50">
        <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-16"
            >
                <motion.span
                    variants={fadeUp}
                    className="text-zinc-900 text-sm font-semibold tracking-widest uppercase"
                >
                    Protección
                </motion.span>
                <motion.h2
                    variants={fadeUp}
                    className="text-4xl md:text-5xl font-bold mt-4"
                >
                    Seguridad por <span className="gradient-text">ubicación</span>
                </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
                {[
                    { icon: MapPin, title: "Validación por ubicación", description: "El acceso se valida desde tu consultorio autorizado", color: "text-zinc-500" },
                    { icon: Lock, title: "Reconocimiento clínico", description: "El sistema reconoce cuándo estás dentro de tu clínica", color: "text-zinc-500" },
                    { icon: Shield, title: "Restricción externa", description: "Fuera de esa zona, el acceso se restringe automáticamente", color: "text-zinc-500" },
                    { icon: CheckCircle, title: "Validación adicional", description: "En accesos externos, se solicita validación del doctor", color: "text-zinc-500" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-2xl p-6 text-center"
                    >
                        <div className={`w-14 h-14 rounded-xl ${iconBgMap[item.color.replace('text-', 'text-icon-')] || 'bg-zinc-900/10'} flex items-center justify-center mx-auto mb-4`}>
                            <item.icon className={`w-7 h-7 ${item.color}`} />
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Google Drive Storage */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <div className="glass-card glow-box rounded-3xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center shrink-0 shadow-xl shadow-zinc-500/10">
                            <FolderSync className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-4">
                                ¿Dónde viven tus expedientes?
                            </h3>
                            <ul className="space-y-3 text-gray-500">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                                    <span>Se <strong className="text-gray-700">generan localmente</strong> en tu dispositivo — sin conexión a nuestros servidores</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                                    <span>Se guardan automáticamente en <strong className="text-zinc-900">tu Google Drive personal</strong> bajo la carpeta <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-900">Dentaxy Seed / Expedientes /</code></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                                    <span>Organizados por <strong className="text-gray-700">folio de expediente y nombre del paciente</strong> automáticamente</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
                                    <span>Dentaxy <strong className="text-gray-700">nunca almacena</strong> los datos clínicos de tus pacientes</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            {[
                                { label: 'Tu Google Drive', desc: 'Tus datos, tu nube', color: 'text-zinc-900' },
                                { label: 'Soberanía Total', desc: 'Nunca en nuestros servidores', color: 'text-zinc-800' },
                                { label: 'Sin instalaciones', desc: 'Todo desde el navegador', color: 'text-zinc-800' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-gray-50">
                                    <p className={`font-bold ${item.color}`}>{item.label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
);

// Growth Section
const GrowthSection = () => (
    <section id="crecimiento" className="py-32 relative">
        <div className="container mx-auto px-6">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-16"
            >
                <motion.span
                    variants={fadeUp}
                    className="text-zinc-900 text-sm font-semibold tracking-widest uppercase"
                >
                    Escalabilidad
                </motion.span>
                <motion.h2
                    variants={fadeUp}
                    className="text-4xl md:text-5xl font-bold mt-4"
                >
                    <span className="text-gray-900">Dentaxy</span> <span className="seed-text">Seed</span> es solo el{" "}
                    <span className="gradient-text">inicio</span>
                </motion.h2>
                <motion.p
                    variants={fadeUp}
                    className="text-gray-500 mt-4 max-w-2xl mx-auto"
                >
                    Tu sistema puede crecer contigo. Si no, Dentaxy Seed funciona
                    perfectamente como solución completa.
                </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                    { icon: Zap, title: "Automatización avanzada", color: "text-zinc-500" },
                    { icon: Layers, title: "Nuevos módulos Dentaxy", color: "text-zinc-500" },
                    { icon: Calendar, title: "Agenda clínica", color: "text-zinc-500" },
                    { icon: Users, title: "Usuarios adicionales", color: "text-zinc-500" },
                    { icon: Settings, title: "Expansión de funciones", color: "text-slate-500" },
                    { icon: Globe, title: "Integración con otros sistemas", color: "text-zinc-500" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="glass-card rounded-2xl p-6 flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center shrink-0`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <span className="font-medium">{item.title}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

// CTA Section
type CTASectionProps = { onCTA?: () => void };
const CTASection = ({ onCTA }: CTASectionProps) => (
    <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-500/5 to-white" />
        <div className="container mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
            >
                <div className="glass-card glow-box rounded-3xl p-8 md:p-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full mb-6">
                        <span className="animate-ping inline-flex h-2 w-2 rounded-full bg-zinc-900 opacity-75" />
                        <span className="text-zinc-900 text-sm font-bold tracking-wide">PREVENTA ACTIVA · CUPOS LIMITADOS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        <span className="text-gray-900">Dentaxy</span>{" "}
                        <span className="seed-text">Seed</span> convierte tu
                        historia clínica en un sistema inteligente, privado y seguro
                    </h2>
                    <p className="text-xl text-gray-500 mb-4">
                        Que escribe, organiza y protege tu práctica clínica —
                        sincronizado silenciosamente con <strong className="text-zinc-900">tu Google Drive</strong>.
                    </p>
                    <p className="text-sm text-gray-400 mb-10">Sin instalar nada. Sin cambiar tu forma de trabajar. Sin almacenar nada en nuestros servidores.</p>
                    <motion.button
                        onClick={onCTA}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(59, 130, 246, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 rounded-full bg-gradient-to-r from-zinc-800 to-black text-white font-bold text-lg shadow-xl animate-glow-pulse relative overflow-hidden inline-flex items-center gap-3"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                        <Sparkles className="w-5 h-5" />
                        Obtener mi Dentaxy Seed exclusivo
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <p className="text-xs text-gray-400 mt-6">Precio de preventa · Incluye configuración personalizada de tu historia clínica</p>
                </div>
            </motion.div>
        </div>
    </section>
);

// Main Component
const SeedLanding = () => {
    const navigate = useNavigate();
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [seedUser, setSeedUser] = useState<any>(null);

    // Leer usuario logeado desde Supabase Auth en lugar de sessionStorage
    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session?.user) {
                navigate('/seed', { replace: true });
            } else {
                setSeedUser({
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email
                });
            }
        };
        getSession();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setSeedUser({
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email
                });
            } else {
                setSeedUser(null);
                navigate('/seed', { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className="seed-theme min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans">
            {/* Modal de Onboarding */}
            <SeedOnboardingModal
                isOpen={onboardingOpen}
                onClose={() => setOnboardingOpen(false)}
                userEmail={seedUser?.email || ''}
                userName={seedUser?.name || ''}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 z-50 p-6">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Volver al inicio</span>
                </button>
            </header>

            <HeroSection />
            <WhatIsSection />
            <WhatItDoesSection />
            <ProblemSection />
            <HowItWorksSection />
            <EnvironmentSection />
            <SecuritySection />
            <GrowthSection />
            <CTASection onCTA={() => setOnboardingOpen(true)} />

            {/* Back to Home Link */}
            <div className="py-12 text-center">
                <a href="/" className="text-zinc-500 font-bold hover:underline">Volver a Dentaxy Principal</a>
            </div>
        </div>
    );
};

export default SeedLanding;
