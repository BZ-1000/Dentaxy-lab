
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormDataState } from '@/types/historiaClinica';

interface ArticulacionCraneomandibularProps {
  formData: FormDataState;
  handleArticulacionCraneomandibularChange: (part: string, value: string | boolean) => void;
}

const ArticulacionCraneomandibular: React.FC<ArticulacionCraneomandibularProps> = ({
  formData,
  handleArticulacionCraneomandibularChange
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Articulación Craneomandibular</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dolor-articular"
                checked={formData.articulacionCraneomandibular?.dolorArticular || false}
                onCheckedChange={(checked) => 
                  handleArticulacionCraneomandibularChange('dolorArticular', checked)
                }
              />
              <label htmlFor="dolor-articular" className="text-sm">Dolor articular</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="chasquidos"
                checked={formData.articulacionCraneomandibular?.chasquidos || false}
                onCheckedChange={(checked) => 
                  handleArticulacionCraneomandibularChange('chasquidos', checked)
                }
              />
              <label htmlFor="chasquidos" className="text-sm">Chasquidos</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="limitacion-apertura"
                checked={formData.articulacionCraneomandibular?.limitacionApertura || false}
                onCheckedChange={(checked) => 
                  handleArticulacionCraneomandibularChange('limitacionApertura', checked)
                }
              />
              <label htmlFor="limitacion-apertura" className="text-sm">Limitación de apertura</label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Observaciones adicionales:</label>
            <Textarea
              value={formData.articulacionCraneomandibular?.observaciones || ''}
              onChange={(e) => 
                handleArticulacionCraneomandibularChange('observaciones', e.target.value)
              }
              placeholder="Describa cualquier observación adicional..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticulacionCraneomandibular;
