import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';

interface ShopFrameProps {
    onHomeClick: () => void;
    onAdminClick: () => void;
    waitlistCount: number;
}

const OrganicShopFrame: React.FC<ShopFrameProps> = ({ onHomeClick, onAdminClick, waitlistCount }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-white/90 backdrop-blur-sm border-b border-neutral-100">

            {/* Left: Back Link */}
            <button
                onClick={onHomeClick}
                className="group flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Volver al inicio</span>
            </button>

            {/* Right: Admin Link */}
            <button
                onClick={onAdminClick}
                className="text-sm font-medium text-neutral-400 hover:text-emerald-600 transition-colors"
            >
                Admin Access
            </button>

        </header>
    );
};

export default OrganicShopFrame;
