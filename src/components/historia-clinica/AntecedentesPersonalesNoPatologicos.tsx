
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Maximize2, X } from "lucide-react";
import GrupoSanguineo from "./antecedentes/GrupoSanguineo";
import HigieneBucal from "./antecedentes/HigieneBucal";
import HigienePersonal from "./antecedentes/HigienePersonal";
import HigieneVivienda from "./antecedentes/HigieneVivienda";
import Inmunizaciones from "./antecedentes/Inmunizaciones";
import ServiciosDomiciliarios from "./antecedentes/ServiciosDomiciliarios";
import { useIsMobile } from "@/hooks/use-mobile";
import "./antecedentes/MobileStyles.css";

interface AntecedentesProps {
  formData: any;
  handleAntecedenteChange: (field: string, value: any) => void;
}

const AntecedentesPersonalesNoPatologicos = ({
  formData,
  handleAntecedenteChange,
}: AntecedentesProps) => {
  const [selectedAntecedente, setSelectedAntecedente] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const isMobile = useIsMobile();

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
    setSelectedAntecedente(null);
  };

  const handleAntecedenteClick = (antecedente: string) => {
    setSelectedAntecedente(antecedente === selectedAntecedente ? null : antecedente);
  };

  const renderSelectedComponent = () => {
    switch (selectedAntecedente) {
      case "grupoSanguineo":
        return (
          <GrupoSanguineo
            formData={formData.antecedentesPersonalesNoPatologicos.grupoSanguineo}
            handleAntecedenteChange={(value) =>
              handleAntecedenteChange("grupoSanguineo", value)
            }
          />
        );
      case "higieneBucal":
        return (
          <HigieneBucal
            formData={formData.antecedentesPersonalesNoPatologicos.higieneBucal}
            handleAntecedenteChange={(value) =>
              handleAntecedenteChange("higieneBucal", value)
            }
          />
        );
      case "higienePersonal":
        return (
          <HigienePersonal
            formData={formData.antecedentesPersonalesNoPatologicos.higienePersonal}
            handleAntecedenteChange={(value) =>
              handleAntecedenteChange("higienePersonal", value)
            }
          />
        );
      case "higieneVivienda":
        return (
          <HigieneVivienda
            formData={formData.antecedentesPersonalesNoPatologicos.higieneVivienda}
            handleAntecedenteChange={(value) =>
              handleAntecedenteChange("higieneVivienda", value)
            }
          />
        );
      case "inmunizaciones":
        return (
          <Inmunizaciones
            formData={formData.antecedentesPersonalesNoPatologicos.inmunizaciones}
            handleAntecedenteChange={(value) =>
              handleAntecedenteChange("inmunizaciones", value)
            }
          />
        );
      case "serviciosDomiciliarios":
        return (
          <ServiciosDomiciliarios
            formData={formData.antecedentesPersonalesNoPatologicos.serviciosDomiciliarios}
            handleAntecedenteChange={(value) =>
              handleAntecedenteChange("serviciosDomiciliarios", value)
            }
          />
        );
      default:
        return (
          <div className="p-6 text-center text-gray-500">
            Seleccione un antecedente para comenzar
          </div>
        );
    }
  };

  const getButtonClass = (antecedente: string) => {
    const isSelected = selectedAntecedente === antecedente;
    
    if (isMobile) {
      return `mobile-antecedentes-button ${
        isSelected
          ? "bg-blue-500 text-white"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`;
    }
    
    return `${
      isSelected
        ? "bg-blue-500 text-white"
        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
    } px-4 py-2 rounded-lg transition-colors`;
  };

  return (
    <div className={`max-w-4xl mx-auto transition-all duration-300 ${isMaximized ? "fixed inset-4 z-50" : ""}`}>
      <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-xl border-0 ${
        isMaximized ? "h-[calc(100vh-2rem)] overflow-y-auto" : ""
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-gray-400">III.</span> ANTECEDENTES PERSONALES NO PATOLÓGICOS
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMinimize}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              aria-label={isMinimized ? "Expandir" : "Minimizar"}
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors"
              aria-label={isMaximized ? "Restaurar" : "Maximizar"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className={`p-4 ${isMobile ? 'mobile-antecedentes-container' : 'flex flex-wrap gap-4'}`}>
              <Button
                className={getButtonClass("grupoSanguineo")}
                onClick={() => handleAntecedenteClick("grupoSanguineo")}
              >
                Grupo Sanguíneo
              </Button>
              <Button
                className={getButtonClass("higieneBucal")}
                onClick={() => handleAntecedenteClick("higieneBucal")}
              >
                Higiene Bucal
              </Button>
              <Button
                className={getButtonClass("higienePersonal")}
                onClick={() => handleAntecedenteClick("higienePersonal")}
              >
                Higiene Personal
              </Button>
              <Button
                className={getButtonClass("higieneVivienda")}
                onClick={() => handleAntecedenteClick("higieneVivienda")}
              >
                Higiene Vivienda
              </Button>
              <Button
                className={getButtonClass("inmunizaciones")}
                onClick={() => handleAntecedenteClick("inmunizaciones")}
              >
                Inmunizaciones
              </Button>
              <Button
                className={getButtonClass("serviciosDomiciliarios")}
                onClick={() => handleAntecedenteClick("serviciosDomiciliarios")}
              >
                Servicios Domiciliarios
              </Button>
            </div>

            {selectedAntecedente && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                {renderSelectedComponent()}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default AntecedentesPersonalesNoPatologicos;
