import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CoreLogin() {
    const [admin, setAdmin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (admin === 'BZ.1000' && password === 'Singularidad.1000') {
            // Set cookie
            document.cookie = "dentaxy_core_auth=authenticated; path=/; max-age=86400; SameSite=Strict";
            navigate('/core');
        } else {
            setError('Acceso denegado. Credenciales incorrectas.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4 font-sans">
            <div className="w-full max-w-md p-8 rounded-2xl border border-gray-100 shadow-sm bg-gray-50/50">
                <h1 className="text-2xl font-light mb-8 text-center tracking-tight text-gray-900">Acceso Dentaxy Core</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Admin</label>
                        <input
                            type="text"
                            value={admin}
                            onChange={(e) => setAdmin(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                            placeholder="BZ.1000"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs text-center font-medium uppercase tracking-wide">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-black text-white p-4 rounded-xl hover:bg-zinc-800 transition-colors duration-300 font-medium tracking-wide shadow-lg shadow-black/5"
                    >
                        ENTRAR
                    </button>
                </form>
            </div>
        </div>
    );
}
