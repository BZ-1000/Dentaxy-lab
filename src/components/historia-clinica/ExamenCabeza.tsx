import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface ExamenCabezaProps {
  data: any;
  handleExamenCabezaChange: (field: string, value: string) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({ data, handleExamenCabezaChange }) => {
  const [macrocefalia, setMacrocefalia] = useState(data.macrocefalia === 'true');
  const [microcefalia, setMicrocefalia] = useState(data.microcefalia === 'true');
  const [dolor, setDolor] = useState(data.dolor || '');
  const [cefalea, setCefalea] = useState(data.cefalea || '');
  const [otrosHallazgos, setOtrosHallazgos] = useState(data.otrosHallazgos || '');
  const [sinHallazgos, setSinHallazgos] = useState(data.sinHallazgos === 'true');
  const {
    theme
  } = useTheme();

  useEffect(() => {
    setMacrocefalia(data.macrocefalia === 'true');
    setMicrocefalia(data.microcefalia === 'true');
    setDolor(data.dolor || '');
    setCefalea(data.cefalea || '');
    setOtrosHallazgos(data.otrosHallazgos || '');
    setSinHallazgos(data.sinHallazgos === 'true');
  }, [data]);

  const handleMacrocefaliaChange = () => {
    const newValue = !macrocefalia;
    setMacrocefalia(newValue);
    handleExamenCabezaChange("macrocefalia", newValue ? "true" : "false");
    if (newValue) {
      setMicrocefalia(false);
      handleExamenCabezaChange("microcefalia", "false");
      setSinHallazgos(false);
      handleExamenCabezaChange("sinHallazgos", "false");
    }
  };

  const handleMicrocefaliaChange = () => {
    const newValue = !microcefalia;
    setMicrocefalia(newValue);
    handleExamenCabezaChange("microcefalia", newValue ? "true" : "false");
    if (newValue) {
      setMacrocefalia(false);
      handleExamenCabezaChange("macrocefalia", "false");
      setSinHallazgos(false);
      handleExamenCabezaChange("sinHallazgos", "false");
    }
  };

  const handleDolorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDolor(value);
    handleExamenCabezaChange("dolor", value);
    if (value) {
      setSinHallazgos(false);
      handleExamenCabezaChange("sinHallazgos", "false");
    }
  };

  const handleCefaleaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCefalea(value);
    handleExamenCabezaChange("cefalea", value);
    if (value) {
      setSinHallazgos(false);
      handleExamenCabezaChange("sinHallazgos", "false");
    }
  };

  const handleOtrosHallazgosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setOtrosHallazgos(value);
    handleExamenCabezaChange("otrosHallazgos", value);
    if (value) {
      setSinHallazgos(false);
      handleExamenCabezaChange("sinHallazgos", "false");
    }
  };

  const handleSinHallazgosChange = () => {
    const newValue = !sinHallazgos;
    setSinHallazgos(newValue);
    // Pass the boolean value directly, ensuring type compatibility
    handleExamenCabezaChange("sinHallazgos", newValue ? "true" : "false");
    
    if (newValue) {
      setMacrocefalia(false);
      handleExamenCabezaChange("macrocefalia", "false");
      setMicrocefalia(false);
      handleExamenCabezaChange("microcefalia", "false");
      setDolor('');
      handleExamenCabezaChange("dolor", "");
      setCefalea('');
      handleExamenCabezaChange("cefalea", "");
      setOtrosHallazgos('');
      handleExamenCabezaChange("otrosHallazgos", "");
    }
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Examen de Cabeza</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sinHallazgos"
            checked={sinHallazgos}
            onCheckedChange={handleSinHallazgosChange}
          />
          <Label htmlFor="sinHallazgos">Sin Hallazgos Patológicos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="macrocefalia"
            checked={macrocefalia}
            onCheckedChange={handleMacrocefaliaChange}
            disabled={sinHallazgos}
          />
          <Label htmlFor="macrocefalia">Macrocefalia</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="microcefalia"
            checked={microcefalia}
            onCheckedChange={handleMicrocefaliaChange}
            disabled={sinHallazgos}
          />
          <Label htmlFor="microcefalia">Microcefalia</Label>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dolor">Dolor</Label>
          <Input
            type="text"
            id="dolor"
            value={dolor}
            onChange={handleDolorChange}
            disabled={sinHallazgos}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cefalea">Cefalea</Label>
          <Input
            type="text"
            id="cefalea"
            value={cefalea}
            onChange={handleCefaleaChange}
            disabled={sinHallazgos}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="otrosHallazgos">Otros Hallazgos</Label>
          <Textarea
            id="otrosHallazgos"
            value={otrosHallazgos}
            onChange={handleOtrosHallazgosChange}
            disabled={sinHallazgos}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamenCabeza;
