import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { AcademyOrbInterface } from "@/components/academy/AcademyOrbInterface";

/**
 * Vista protegida /academy/app
 * Orbe DEX 3D con anillo orbital de 8 satélites en fondo blanco
 */
export default function AcademyApp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("academy_user");
    if (!user && !savedUser) {
      navigate("/academy");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen w-screen bg-white" />;
  }

  // Interfaz completa del Orbe DEX con sus 8 satélites orbitales en fondo blanco
  return <AcademyOrbInterface />;
}
