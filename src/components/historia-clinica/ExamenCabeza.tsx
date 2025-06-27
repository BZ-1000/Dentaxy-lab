
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDataState } from '@/types/historiaClinica';

interface CaracteristicaFacial {
  presente?: boolean;
  detalles?: string;
  tamanio?: string;
  color?: string;
  bordes?: string;
  localizacion?: string;
  grado?: string;
  consistencia?: string;
  tipo?: string;
  zonaAfectada?: string;
  descripcion?: string;
}

interface ExamenCabezaProps {
  formData: FormDataState;
  handleExamenCabezaChange: (part: string, value: string | boolean | object) => void;
}

const ExamenCabeza = ({ formData, handleExamenCabezaChange }: ExamenCabezaProps) => {
  const handleDetailedChange = (category: string, field: string, value: string | boolean) => {
    const currentData = (formData.examenCabeza[category as keyof typeof formData.examenCabeza] as CaracteristicaFacial) || {};
    const updatedData = {
      ...currentData,
      [field]: value
    };
    handleExamenCabezaChange(category, updatedData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Examen de Cabeza
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Tipo de Cráneo */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Tipo de Cráneo</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'mesocefalo', label: 'Mesocéfalo', image: '/lovable-uploads/mesocefalo.png' },
              { value: 'dolicocefalo', label: 'Dolicocéfalo', image: '/dolicocefalo.png' },
              { value: 'braquicefalo', label: 'Braquicéfalo', image: '/braquicefalo.png' }
            ].map((tipo) => (
              <div key={tipo.value} className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <img 
                    src={tipo.image} 
                    alt={tipo.label}
                    className="w-24 h-24 object-contain rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleExamenCabezaChange('tipoCraneo', tipo.value)}
                  />
                  {formData.examenCabeza.tipoCraneo === tipo.value && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <Label className="text-sm text-center">{tipo.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tipo de Perfil */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Tipo de Perfil</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'concavo', label: 'Cóncavo', image: '/concavo.png' },
              { value: 'recto', label: 'Recto', image: '/recto.png' },
              { value: 'convexo', label: 'Convexo', image: '/convexo.png' }
            ].map((perfil) => (
              <div key={perfil.value} className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <img 
                    src={perfil.image} 
                    alt={perfil.label}
                    className="w-24 h-24 object-contain rounded-lg border-2 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => handleExamenCabezaChange('tipoPerfil', perfil.value)}
                  />
                  {formData.examenCabeza.tipoPerfil === perfil.value && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <Label className="text-sm text-center">{perfil.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Tez */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Tez</Label>
          <Select 
            value={formData.examenCabeza.tez || ''} 
            onValueChange={(value) => handleExamenCabezaChange('tez', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de tez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clara">Clara</SelectItem>
              <SelectItem value="morena">Morena</SelectItem>
              <SelectItem value="oscura">Oscura</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado de la Piel */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Estado de la Piel</Label>
          <div className="flex flex-wrap gap-4">
            {['reseca', 'humectada'].map((estado) => (
              <div key={estado} className="flex items-center space-x-2">
                <Checkbox
                  id={`piel-${estado}`}
                  checked={formData.examenCabeza.estadoPiel === estado}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleExamenCabezaChange('estadoPiel', estado);
                    }
                  }}
                />
                <Label htmlFor={`piel-${estado}`} className="capitalize">
                  {estado}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Lunares */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lunares-presente"
              checked={(formData.examenCabeza.lunares as CaracteristicaFacial)?.presente || false}
              onCheckedChange={(checked) => 
                handleDetailedChange('lunares', 'presente', checked as boolean)
              }
            />
            <Label htmlFor="lunares-presente" className="text-base font-medium">
              Lunares
            </Label>
          </div>
          
          {(formData.examenCabeza.lunares as CaracteristicaFacial)?.presente && (
            <div className="ml-6 space-y-3">
              <div>
                <Label>Detalles</Label>
                <Textarea
                  placeholder="Describe características, ubicación, etc."
                  value={(formData.examenCabeza.lunares as CaracteristicaFacial)?.detalles || ''}
                  onChange={(e) => handleDetailedChange('lunares', 'detalles', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Tamaño</Label>
                  <Select 
                    value={(formData.examenCabeza.lunares as CaracteristicaFacial)?.tamanio || ''} 
                    onValueChange={(value) => handleDetailedChange('lunares', 'tamanio', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeno">Pequeño (&lt;5mm)</SelectItem>
                      <SelectItem value="mediano">Mediano (5-10mm)</SelectItem>
                      <SelectItem value="grande">Grande (&gt;10mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Color</Label>
                  <Select 
                    value={(formData.examenCabeza.lunares as CaracteristicaFacial)?.color || ''} 
                    onValueChange={(value) => handleDetailedChange('lunares', 'color', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marron-claro">Marrón claro</SelectItem>
                      <SelectItem value="marron-oscuro">Marrón oscuro</SelectItem>
                      <SelectItem value="negro">Negro</SelectItem>
                      <SelectItem value="rojizo">Rojizo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cicatrices */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cicatrices-presente"
              checked={(formData.examenCabeza.cicatrices as CaracteristicaFacial)?.presente || false}
              onCheckedChange={(checked) => 
                handleDetailedChange('cicatrices', 'presente', checked as boolean)
              }
            />
            <Label htmlFor="cicatrices-presente" className="text-base font-medium">
              Cicatrices
            </Label>
          </div>
          
          {(formData.examenCabeza.cicatrices as CaracteristicaFacial)?.presente && (
            <div className="ml-6 space-y-3">
              <div>
                <Label>Detalles</Label>
                <Textarea
                  placeholder="Describe ubicación, causa, características..."
                  value={(formData.examenCabeza.cicatrices as CaracteristicaFacial)?.detalles || ''}
                  onChange={(e) => handleDetailedChange('cicatrices', 'detalles', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Tamaño</Label>
                  <Select 
                    value={(formData.examenCabeza.cicatrices as CaracteristicaFacial)?.tamanio || ''} 
                    onValueChange={(value) => handleDetailedChange('cicatrices', 'tamanio', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequena">Pequeña</SelectItem>
                      <SelectItem value="mediana">Mediana</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Bordes</Label>
                  <Select 
                    value={(formData.examenCabeza.cicatrices as CaracteristicaFacial)?.bordes || ''} 
                    onValueChange={(value) => handleDetailedChange('cicatrices', 'bordes', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de bordes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regulares">Regulares</SelectItem>
                      <SelectItem value="irregulares">Irregulares</SelectItem>
                      <SelectItem value="elevados">Elevados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Localización</Label>
                  <Select 
                    value={(formData.examenCabeza.cicatrices as CaracteristicaFacial)?.localizacion || ''} 
                    onValueChange={(value) => handleDetailedChange('cicatrices', 'localizacion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frente">Frente</SelectItem>
                      <SelectItem value="mejilla-derecha">Mejilla derecha</SelectItem>
                      <SelectItem value="mejilla-izquierda">Mejilla izquierda</SelectItem>
                      <SelectItem value="menton">Mentón</SelectItem>
                      <SelectItem value="cuero-cabelludo">Cuero cabelludo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Asimetrías Faciales */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="asimetrias-presente"
              checked={(formData.examenCabeza.asimetriasFaciales as CaracteristicaFacial)?.presente || false}
              onCheckedChange={(checked) => 
                handleDetailedChange('asimetriasFaciales', 'presente', checked as boolean)
              }
            />
            <Label htmlFor="asimetrias-presente" className="text-base font-medium">
              Asimetrías Faciales
            </Label>
          </div>
          
          {(formData.examenCabeza.asimetriasFaciales as CaracteristicaFacial)?.presente && (
            <div className="ml-6 space-y-3">
              <div>
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describe la asimetría observada..."
                  value={(formData.examenCabeza.asimetriasFaciales as CaracteristicaFacial)?.descripcion || ''}
                  onChange={(e) => handleDetailedChange('asimetriasFaciales', 'descripcion', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select 
                    value={(formData.examenCabeza.asimetriasFaciales as CaracteristicaFacial)?.tipo || ''} 
                    onValueChange={(value) => handleDetailedChange('asimetriasFaciales', 'tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de asimetría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leve">Leve</SelectItem>
                      <SelectItem value="moderada">Moderada</SelectItem>
                      <SelectItem value="severa">Severa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Zona Afectada</Label>
                  <Select 
                    value={(formData.examenCabeza.asimetriasFaciales as CaracteristicaFacial)?.zonaAfectada || ''} 
                    onValueChange={(value) => handleDetailedChange('asimetriasFaciales', 'zonaAfectada', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Zona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tercio-superior">Tercio superior</SelectItem>
                      <SelectItem value="tercio-medio">Tercio medio</SelectItem>
                      <SelectItem value="tercio-inferior">Tercio inferior</SelectItem>
                      <SelectItem value="lado-derecho">Lado derecho</SelectItem>
                      <SelectItem value="lado-izquierdo">Lado izquierdo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edema */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edema-presente"
              checked={(formData.examenCabeza.edema as CaracteristicaFacial)?.presente || false}
              onCheckedChange={(checked) => 
                handleDetailedChange('edema', 'presente', checked as boolean)
              }
            />
            <Label htmlFor="edema-presente" className="text-base font-medium">
              Edema
            </Label>
          </div>
          
          {(formData.examenCabeza.edema as CaracteristicaFacial)?.presente && (
            <div className="ml-6 space-y-3">
              <div>
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describe el edema..."
                  value={(formData.examenCabeza.edema as CaracteristicaFacial)?.descripcion || ''}
                  onChange={(e) => handleDetailedChange('edema', 'descripcion', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Grado</Label>
                  <Select 
                    value={(formData.examenCabeza.edema as CaracteristicaFacial)?.grado || ''} 
                    onValueChange={(value) => handleDetailedChange('edema', 'grado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leve">Leve (+)</SelectItem>
                      <SelectItem value="moderado">Moderado (++)</SelectItem>
                      <SelectItem value="severo">Severo (+++)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Localización</Label>
                  <Select 
                    value={(formData.examenCabeza.edema as CaracteristicaFacial)?.localizacion || ''} 
                    onValueChange={(value) => handleDetailedChange('edema', 'localizacion', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parpados">Párpados</SelectItem>
                      <SelectItem value="mejillas">Mejillas</SelectItem>
                      <SelectItem value="labios">Labios</SelectItem>
                      <SelectItem value="generalizado">Generalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Consistencia</Label>
                  <Select 
                    value={(formData.examenCabeza.edema as CaracteristicaFacial)?.consistencia || ''} 
                    onValueChange={(value) => handleDetailedChange('edema', 'consistencia', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Consistencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blando">Blando</SelectItem>
                      <SelectItem value="firme">Firme</SelectItem>
                      <SelectItem value="duro">Duro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Observaciones Generales */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Observaciones Generales</Label>
          <Textarea
            placeholder="Anota cualquier observación adicional sobre el examen de cabeza..."
            value={formData.examenCabeza.observaciones || ''}
            onChange={(e) => handleExamenCabezaChange('observaciones', e.target.value)}
            rows={3}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default ExamenCabeza;
