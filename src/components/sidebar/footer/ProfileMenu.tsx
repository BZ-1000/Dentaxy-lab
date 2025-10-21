import { LogOut, CreditCard, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

interface ProfileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileMenu = ({ open, onOpenChange }: ProfileMenuProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { openCustomerPortal } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleViewPlans = () => {
    navigate('/plans');
    onOpenChange(false);
  };

  const handleOpenPortal = async () => {
    await openCustomerPortal();
    onOpenChange(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <div className="hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleViewPlans}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Planes y suscripciones</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenPortal}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Portal de cliente</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          <p>Versión 1.4.2</p>
          <p>© 2025 DENTAXY</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
