import React from 'react';
import { BarChart3, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

const MetricCard = ({ title, value, change, trend, loading }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                }`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
            </div>
        </div>
        {loading ? (
            <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg" />
        ) : (
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">{value}</h3>
        )}
    </div>
);

const Analytics = () => {
    const { data: analytics, isLoading } = useAnalytics();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Data Engine</h1>
                    <p className="text-gray-400 font-medium mt-1">Métricas de rendimiento y adopción del ecosistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Demos"
                    value={analytics?.totalDemos.toLocaleString()}
                    change="+12.5%"
                    trend="up"
                    loading={isLoading}
                />
                <MetricCard
                    title="Active Users"
                    value={analytics?.activeUsers.toLocaleString()}
                    change="+5.2%"
                    trend="up"
                    loading={isLoading}
                />
                <MetricCard
                    title="System Load"
                    value={`${analytics?.systemLoad}%`}
                    change="-2.1%"
                    trend="down"
                    loading={isLoading}
                />
                <MetricCard
                    title="Security Events"
                    value={analytics?.securityEvents}
                    change="Stable"
                    trend="up"
                    loading={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Growth Overview</h3>
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                            +24.5% vs last week
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="h-[300px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                        </div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.growthData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        hide={true}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Regions</h3>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 bg-gray-50 animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {analytics?.topRegions.map((region) => (
                                <div key={region.name} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-600">{region.name}</span>
                                        <span className="text-gray-900">{region.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gray-900 rounded-full transition-all duration-1000"
                                            style={{ width: `${region.val}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
