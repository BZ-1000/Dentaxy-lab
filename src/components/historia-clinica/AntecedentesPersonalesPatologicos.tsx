import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import SelectableText from '@/components/ui/SelectableText';

interface OtraCondicion {
  nombre: string;
  descripcion: string;
  activa: boolean;
}

interface AntecedentesPersonalesPatologicosProps {
  formData: {
    alergias: string;
    medicamentosActuales: string;
    cirugiasPrevias: string;
    hospitalizacionesPrevias: string;
    transfusionesSanguineas: boolean;
    enfermedadesCronicas: string;
    otrasCondiciones: OtraCondicion[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AntecedentesPersonalesPatologicos = ({ formData, setFormData }: AntecedentesPersonalesPatologicosProps) => {
  const [transfusion, setTransfusion] = useState(formData.transfusionesSanguineas);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setTransfusion(checked);
  };

  const handleOtraCondicionChange = (index: number, field: keyof OtraCondicion, value: string | boolean) => {
    const nuevasCondiciones = [...formData.otrasCondiciones];
    if (field === 'activa') {
      nuevasCondiciones[index] = { ...nuevasCondiciones[index], [field]: value as boolean };
    } else {
      nuevasCondiciones[index] = { ...nuevasCondiciones[index], [field]: value as string };
    }
    setFormData({ ...formData, otrasCondiciones: nuevasCondiciones });
  };

  const handleAddOtraCondicion = () => {
    setFormData({
      ...formData,
      otrasCondiciones: [...formData.otrasCondiciones, { nombre: '', descripcion: '', activa: false }],
    });
  };

  const handleRemoveOtraCondicion = (index: number) => {
    const nuevasCondiciones = [...formData.otrasCondiciones];
    nuevasCondiciones.splice(index, 1);
    setFormData({ ...formData, otrasCondiciones: nuevasCondiciones });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <SelectableText text="Antecedentes Personales Patológicos" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="alergias"><SelectableText text="Alergias" /></Label>
            <Input
              type="text"
              id="alergias"
              name="alergias"
              value={formData.alergias}
              onChange={handleInputChange}
              placeholder="Alergias a medicamentos, alimentos, etc."
            />
          </div>
          <div>
            <Label htmlFor="medicamentosActuales"><SelectableText text="Medicamentos Actuales" /></Label>
            <Input
              type="text"
              id="medicamentosActuales"
              name="medicamentosActuales"
              value={formData.medicamentosActuales}
              onChange={handleInputChange}
              placeholder="Medicamentos que está tomando actualmente"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cirugiasPrevias"><SelectableText text="Cirugías Previas" /></Label>
            <Textarea
              id="cirugiasPrevias"
              name="cirugiasPrevias"
              value={formData.cirugiasPrevias}
              onChange={handleInputChange}
              placeholder="Listado de cirugías previas"
            />
          </div>
          <div>
            <Label htmlFor="hospitalizacionesPrevias"><SelectableText text="Hospitalizaciones Previas" /></Label>
            <Textarea
              id="hospitalizacionesPrevias"
              name="hospitalizacionesPrevias"
              value={formData.hospitalizacionesPrevias}
              onChange={handleInputChange}
              placeholder="Listado de hospitalizaciones previas"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="transfusionesSanguineas"
            name="transfusionesSanguineas"
            checked={transfusion}
            onCheckedChange={(checked) => {
              setTransfusion(!!checked);
              setFormData({ ...formData, transfusionesSanguineas: !!checked });
            }}
          />
          <Label htmlFor="transfusionesSanguineas"><SelectableText text="Transfusiones Sanguíneas" /></Label>
        </div>

        <div>
          <Label htmlFor="enfermedadesCronicas"><SelectableText text="Enfermedades Crónicas" /></Label>
          <Textarea
            id="enfermedadesCronicas"
            name="enfermedadesCronicas"
            value={formData.enfermedadesCronicas}
            onChange={handleInputChange}
            placeholder="Enfermedades crónicas diagnosticadas"
          />
        </div>

        <div>
          <Label><SelectableText text="Otras Condiciones" /></Label>
          {formData.otrasCondiciones.map((condicion, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <Label htmlFor={`nombre-${index}`}><SelectableText text="Nombre" /></Label>
                <Input
                  type="text"
                  id={`nombre-${index}`}
                  value={condicion.nombre}
                  onChange={(e) => handleOtraCondicionChange(index, 'nombre', e.target.value)}
                  placeholder="Nombre de la condición"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`descripcion-${index}`}><SelectableText text="Descripción" /></Label>
                <Input
                  type="text"
                  id={`descripcion-${index}`}
                  value={condicion.descripcion}
                  onChange={(e) => handleOtraCondicionChange(index, 'descripcion', e.target.value)}
                  placeholder="Descripción de la condición"
                />
              </div>
              <div>
                <Label htmlFor={`activa-${index}`}><SelectableText text="Activa" /></Label>
                <Checkbox
                  id={`activa-${index}`}
                  checked={condicion.activa}
                  onCheckedChange={(checked) => handleOtraCondicionChange(index, 'activa', !!checked)}
                />
              </div>
              <div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveOtraCondicion(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={handleAddOtraCondicion}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Otra Condición
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AntecedentesPersonalesPatologicos;
