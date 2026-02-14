/**
 * Admin Login Page
 * Entry point for administrative access with biometric authentication
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiometricLogin } from '@/components/admin/BiometricLogin';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLoginPage() {
    const navigate = useNavigate();

    // Check if user is already authenticated
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Already logged in, redirect to admin panel
                navigate('/admin/dashboard');
            }
        };

        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate('/admin/dashboard');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [navigate]);

    return <BiometricLogin />;
}
