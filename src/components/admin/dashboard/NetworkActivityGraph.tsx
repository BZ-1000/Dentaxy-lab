
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export const NetworkActivityGraph: React.FC<{ className?: string }> = ({ className }) => {
    const [data, setData] = useState<{ time: string; inbound: number; outbound: number }[]>([]);

    useEffect(() => {
        // Generate initial data
        const initialData = Array.from({ length: 20 }, (_, i) => ({
            time: i.toString(),
            inbound: Math.floor(Math.random() * 50) + 20,
            outbound: Math.floor(Math.random() * 30) + 10,
        }));
        setData(initialData);

        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1)];
                newData.push({
                    time: new Date().toLocaleTimeString(),
                    inbound: Math.floor(Math.random() * 60) + 20,
                    outbound: Math.floor(Math.random() * 40) + 10,
                });
                return newData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn("rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-6 h-80 relative overflow-hidden", className)}>
            <div className="absolute top-4 left-6 z-10">
                <h3 className="text-white font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    NETWORK_TRAFFIC_ANALYSIS
                </h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="inbound"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#colorInbound)"
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="outbound"
                        stroke="#a855f7"
                        fillOpacity={1}
                        fill="url(#colorOutbound)"
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
