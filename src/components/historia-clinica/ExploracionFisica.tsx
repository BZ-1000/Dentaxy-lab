import React from 'react';
import { Card } from "@/components/ui/card";
import { Minus, Maximize2, X } from "lucide-react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const ExploracionFisica = ({ formData, handleExploracionFisicaChange }) => {
  const signosVitalesLabels = ["Presión Arterial", "Frecuencia Cardíaca", "Frecuencia Respiratoria", "Temperatura", "Peso", "Talla", "IMC"];
  const examenGeneralLabels = ["Estado General", "Estado de Conciencia", "Orientación", "Cooperación", "Actitud", "Decúbito", "Fascies", "Piel y Mucosas", "Tejido Celular Subcutáneo", "Sistema Linfático", "Faneras"];
  const cabezaYCuelloLabels = ["Cráneo", "Cara", "Cuero Cabelludo", "Ojos", "Oídos", "Nariz", "Boca", "Faringe", "Cuello", "Tiroides", "Tráquea"];
  const toraxYPulmonesLabels = ["Inspección", "Palpación", "Percusión", "Auscultación", "Ruidos Agregados"];
  const cardiovascularLabels = ["Inspección", "Palpación", "Auscultación", "Ruidos Cardiacos", "Soplos", "Pulsos Periféricos"];
  const abdomenLabels = ["Inspección", "Auscultación", "Percusión", "Palpación", "Visceromegalias", "Masas", "Dolor", "Hernias", "Ruidos Hidroaéreos"];
  const genitourinarioLabels = ["Inspección", "Palpación", "Percusión", "Auscultación", "Dolor", "Masas"];
  const musculoesqueleticoLabels = ["Inspección", "Palpación", "Movilidad", "Fuerza", "Dolor", "Deformidades"];
  const neurologicoLabels = ["Estado Mental", "Pares Craneales", "Fuerza Motora", "Sensibilidad", "Reflejos", "Marcha", "Equilibrio", "Coordinación"];
  const pielYFanerasLabels = ["Color", "Textura", "Lesiones", "Distribución del Pelo", "Uñas"];
  const mentalLabels = ["Estado de Conciencia", "Orientación", "Atención", "Memoria", "Lenguaje", "Pensamiento", "Afecto", "Juicio", "Introspección"];

  const chartData = {
    labels: ['Consulta 1', 'Consulta 2', 'Consulta 3', 'Consulta 4', 'Consulta 5'],
    datasets: [
      {
        label: 'Peso (kg)',
        data: [70, 72, 71, 73, 74],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Talla (cm)',
        data: [175, 175, 176, 176, 177],
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const handleSignosVitalesChange = (label, value) => {
    const updatedSignosVitales = {
      ...formData.exploracionFisica.signosVitales,
      [label]: value
    };
    handleExploracionFisicaChange('signosVitales', updatedSignosVitales);
  };

  const handleExamenGeneralChange = (label, value) => {
    const updatedExamenGeneral = {
      ...formData.exploracionFisica.examenGeneral,
      [label]: value
    };
    handleExploracionFisicaChange('examenGeneral', updatedExamenGeneral);
  };

  const handleCabezaYCuelloChange = (label, value) => {
    const updatedCabezaYCuello = {
      ...formData.exploracionFisica.cabezaYCuello,
      [label]: value
    };
    handleExploracionFisicaChange('cabezaYCuello', updatedCabezaYCuello);
  };

  const handleToraxYPulmonesChange = (label, value) => {
    const updatedToraxYPulmones = {
      ...formData.exploracionFisica.toraxYPulmones,
      [label]: value
    };
    handleExploracionFisicaChange('toraxYPulmones', updatedToraxYPulmones);
  };

  const handleCardiovascularChange = (label, value) => {
    const updatedCardiovascular = {
      ...formData.exploracionFisica.cardiovascular,
      [label]: value
    };
    handleExploracionFisicaChange('cardiovascular', updatedCardiovascular);
  };

  const handleAbdomenChange = (label, value) => {
    const updatedAbdomen = {
      ...formData.exploracionFisica.abdomen,
      [label]: value
    };
    handleExploracionFisicaChange('abdomen', updatedAbdomen);
  };

  const handleGenitourinarioChange = (label, value) => {
    const updatedGenitourinario = {
      ...formData.exploracionFisica.genitourinario,
      [label]: value
    };
    handleExploracionFisicaChange('genitourinario', updatedGenitourinario);
  };

  const handleMusculoesqueleticoChange = (label, value) => {
    const updatedMusculoesqueletico = {
      ...formData.exploracionFisica.musculoesqueletico,
      [label]: value
    };
    handleExploracionFisicaChange('musculoesqueletico', updatedMusculoesqueletico);
  };

  const handleNeurologicoChange = (label, value) => {
    const updatedNeurologico = {
      ...formData.exploracionFisica.neurologico,
      [label]: value
    };
    handleExploracionFisicaChange('neurologico', updatedNeurologico);
  };

  const handlePielYFanerasChange = (label, value) => {
    const updatedPielYFaneras = {
      ...formData.exploracionFisica.pielYFaneras,
      [label]: value
    };
    handleExploracionFisicaChange('pielYFaneras', updatedPielYFaneras);
  };

  const handleMentalChange = (label, value) => {
    const updatedMental = {
      ...formData.exploracionFisica.mental,
      [label]: value
    };
    handleExploracionFisicaChange('mental', updatedMental);
  };

  const updateVitalSigns = (vitalSign, value) => {
    const updatedSignosVitales = {
      ...formData.exploracionFisica.signosVitales,
      [vitalSign]: value
    };
    handleExploracionFisicaChange('signosVitales', updatedSignosVitales);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Signos Vitales */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Signos Vitales</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {signosVitalesLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.signosVitales[label] || ''}
                  onChange={(e) => handleSignosVitalesChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Examen General */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Examen General</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {examenGeneralLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.examenGeneral[label] || ''}
                  onChange={(e) => handleExamenGeneralChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Cabeza y Cuello */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Cabeza y Cuello</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {cabezaYCuelloLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.cabezaYCuello[label] || ''}
                  onChange={(e) => handleCabezaYCuelloChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Tórax y Pulmones */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Tórax y Pulmones</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {toraxYPulmonesLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.toraxYPulmones[label] || ''}
                  onChange={(e) => handleToraxYPulmonesChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Cardiovascular */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Cardiovascular</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {cardiovascularLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.cardiovascular[label] || ''}
                  onChange={(e) => handleCardiovascularChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Abdomen */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Abdomen</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {abdomenLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.abdomen[label] || ''}
                  onChange={(e) => handleAbdomenChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Genitourinario */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Genitourinario</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {genitourinarioLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.genitourinario[label] || ''}
                  onChange={(e) => handleGenitourinarioChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Musculoesquelético */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Musculoesquelético</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {musculoesqueleticoLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.musculoesqueletico[label] || ''}
                  onChange={(e) => handleMusculoesqueleticoChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Neurológico */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Neurológico</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {neurologicoLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.neurologico[label] || ''}
                  onChange={(e) => handleNeurologicoChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Piel y Faneras */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Piel y Faneras</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {pielYFanerasLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.pielYFaneras[label] || ''}
                  onChange={(e) => handlePielYFanerasChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Mental */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Mental</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <ScrollArea className="h-[300px] p-4">
          <div className="grid grid-cols-2 gap-4">
            {mentalLabels.map((label) => (
              <div key={label} className="space-y-2">
                <Label htmlFor={label} className="text-sm font-medium">{label}</Label>
                <Input
                  type="text"
                  id={label}
                  value={formData.exploracionFisica.mental[label] || ''}
                  onChange={(e) => handleMentalChange(label, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Gráfico de Signos Vitales */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Gráfico de Signos Vitales</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>

      {/* Observaciones */}
      <Card className="col-span-1">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Observaciones</h2>
          <div className="space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Maximize2 className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <Textarea
            placeholder="Ingrese sus observaciones aquí..."
            value={formData.exploracionFisica.observaciones || ''}
            onChange={(e) => handleExploracionFisicaChange('observaciones', e.target.value)}
            className="w-full h-32 text-sm"
          />
        </div>
      </Card>
    </div>
  );
};

export default ExploracionFisica;
