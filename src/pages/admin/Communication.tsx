import React from 'react';
import { Megaphone, MessageSquare, History, Loader2, Clock } from 'lucide-react';
import { BroadcastMessageForm } from '@/components/admin/communication/BroadcastMessageForm';
import { useTableQuery } from '@/hooks/supabase-hooks';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Communication = () => {
    // Obtener historial de mensajes
    // Usamos cast a 'any' porque broadcast_messages podría no estar generado en los tipos aún
    const { data: messages, isLoading } = useTableQuery('broadcast_messages' as any, {
        orderBy: { column: 'created_at', ascending: false },
        range: { from: 0, to: 9 }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Broadcast System</h1>
                    <p className="text-gray-400 font-medium mt-1">Torre de control de mensajería global</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* New Broadcast Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <Megaphone className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">New Broadcast</h3>
                        </div>

                        <BroadcastMessageForm />
                    </div>
                </div>

                {/* Recent History */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <History className="w-5 h-5" /> Recent Logs
                    </h3>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                        </div>
                    ) : (messages as any[]) && (messages as any[]).length > 0 ? (
                        <div className="space-y-6">
                            {(messages as any[])?.map((msg: any) => (
                                <div key={msg.id} className="flex gap-4 items-start group hover:bg-gray-50 p-2 rounded-xl transition-colors -mx-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 leading-tight mb-1 truncate">{msg.title}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{msg.content}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {msg.target_audience}
                                            </span>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {msg.message_type}
                                            </span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No hay mensajes recientes
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Communication;
