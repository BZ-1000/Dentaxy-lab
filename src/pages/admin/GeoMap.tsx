import React from 'react';
import { Globe, MapPin, Users, Activity } from 'lucide-react';

const GeoMap = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">GeoMap Control</h1>
                    <p className="text-gray-400 font-medium mt-1">Visualización de conexiones y despliegue territorial</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50">Global View</button>
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-gray-900/20">Live Heatmap</button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden relative min-h-[600px] flex items-center justify-center bg-grid-slate-100/50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-80 pointer-events-none" />

                <div className="text-center space-y-4 relative z-10">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-12 h-12 text-blue-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Map Engine Initializing...</h2>
                    <p className="text-gray-400 font-medium">Conectando con nodos satelitales simulados</p>

                    <div className="flex items-center justify-center gap-8 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-black text-gray-900">127</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Active Nodes</div>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-gray-900">MX</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Primary Region</div>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-emerald-500">0ms</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Latency</div>
                        </div>
                    </div>
                </div>

                {/* Simulated Map Ponts */}
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-ping" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-ping delay-75" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-ping delay-150" />
            </div>
        </div>
    );
};

export default GeoMap;
