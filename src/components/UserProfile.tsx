
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.username) {
        setUsername(data.username);
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUsername = async (newUsername: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          username: newUsername,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Nombre de usuario guardado');
      setUsername(newUsername);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el nombre de usuario');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-4 p-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
      <Avatar className="h-12 w-12 border-2 border-primary/20">
        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} />
        <AvatarFallback className="bg-primary/5">
          {username?.charAt(0)?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      
      {!username ? (
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tu nombre"
            className="px-3 py-1 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full max-w-[200px]"
            onBlur={(e) => {
              if (e.target.value) {
                updateUsername(e.target.value);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                updateUsername(e.currentTarget.value);
              }
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{username}</span>
          <span className="text-sm text-gray-500">En línea</span>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
