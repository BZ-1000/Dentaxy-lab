import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CoreDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const authCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('dentaxy_core_auth='));

        if (!authCookie || authCookie.split('=')[1] !== 'authenticated') {
            navigate('/core/login');
        }
    }, [navigate]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white p-24">
            <h1 className="text-5xl font-light tracking-tighter text-zinc-900 sm:text-7xl">
                Dentaxy Core
            </h1>
        </main>
    );
}
