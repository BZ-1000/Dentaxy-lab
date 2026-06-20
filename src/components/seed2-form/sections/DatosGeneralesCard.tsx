import React from 'react';
import { DatosGeneralesPaciente } from '@/core/packages/clinical-form/components/DatosGeneralesPaciente';
import { FormDataState } from '@/types/historiaClinica';

interface DatosGeneralesCardProps {
  formData: FormDataState;
  handleDatosGeneralesChange: (field: string, value: string) => void;
  onToggleViewMode: () => void;
  onSeccionGenerada: (seccionId: string, textoResumen: string) => void;
}

export const DatosGeneralesCard: React.FC<DatosGeneralesCardProps> = ({
  formData,
  handleDatosGeneralesChange,
  onToggleViewMode,
  onSeccionGenerada
}) => {
  const generarTextoFormateado = () => {
    const data = formData.datosGenerales;

    // Tabla estilo expediente clínico de referencia (field-table)
    const filas = [
      { key: 'Nombre completo',          val: data.nombreCompleto    || 'No especificado' },
      { key: 'Fecha de nacimiento',       val: data.fechaNacimiento   || 'No especificado' },
      { key: 'Sexo',                      val: data.sexo              || 'No especificado' },
      { key: 'Estado civil',              val: data.estadoCivil       || 'No especificado' },
      { key: 'Ocupación',                 val: data.ocupacion         || 'No especificada'  },
      { key: 'Domicilio',                 val: data.domicilio         || 'No especificado' },
      { key: 'Teléfono',                  val: data.telefono          || 'No especificado' },
      { key: 'Correo electrónico',        val: data.correo            || 'No especificado' },
      { key: 'Contacto de emergencia',    val: data.contactoEmergencia|| 'No especificado' },
    ];

    const filaHTML = filas.map((f, i) => {
      const bg = i % 2 !== 0 ? ' style="background:#f9fafb;"' : '';
      return `<tr${bg}>
        <td style="font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:0.04em;color:#555;text-transform:uppercase;width:38%;padding:11px 16px 11px 0;vertical-align:top;border-bottom:1px solid #e5e7eb;">${f.key}</td>
        <td style="font-size:14px;font-weight:300;color:#3a3a3a;padding:11px 0 11px 16px;vertical-align:top;border-bottom:1px solid #e5e7eb;">${f.val}</td>
      </tr>`;
    }).join('');

    const html = `<table style="width:100%;border-collapse:collapse;">
      <tbody>${filaHTML}</tbody>
    </table>`;

    onSeccionGenerada('datosGenerales', html);
  };

  return (
    <div className="w-full">
      <DatosGeneralesPaciente 
        data={formData.datosGenerales}
        onChange={handleDatosGeneralesChange}
      />
      {/* Botón oculto requerido por el sistema de automatización DentaxyFormPanel */}
      <button 
        className="hidden data-trigger-generation"
        onClick={generarTextoFormateado}
      >
        Generar Redacción
      </button>
    </div>
  );
};
