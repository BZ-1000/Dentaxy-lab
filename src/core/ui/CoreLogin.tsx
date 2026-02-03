"use client";

import React, { useState } from 'react';

interface CoreLoginProps {
    onLogin: () => void;
}

export const CoreLogin: React.FC<CoreLoginProps> = ({ onLogin }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulación de Auth básica - En producción esto validaría contra auth real
        // Para el prototipo, cualquier entrada no vacía (o un código específico) pasa
        // La UX debe sentirse "segura"
        if (pin.trim().length > 0) {
            onLogin();
        } else {
            setError(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Acceso Restringido</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Dentaxy Core Environment
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="pin-code" className="sr-only">Código de Acceso</label>
                            <input
                                id="pin-code"
                                name="pin"
                                type="password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-4 border ${error ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-lg text-center tracking-widest`}
                                placeholder="INGRESE CÓDIGO"
                                value={pin}
                                onChange={(e) => { setPin(e.target.value); setError(false); }}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                🔒
                            </span>
                            Entrar al Núcleo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
