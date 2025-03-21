import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ExamenCabezaProps {
    hallazgos: any;
    setHallazgos: (hallazgos: any) => void;
}

const ExamenCabeza: React.FC<ExamenCabezaProps> = ({ hallazgos, setHallazgos }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setHallazgos(prevHallazgos => ({
            ...prevHallazgos,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div>
            <div className="mb-4">
                <Label htmlFor="formaCabeza" className="block text-sm font-medium text-gray-700">Forma de la Cabeza:</Label>
                <Input
                    type="text"
                    id="formaCabeza"
                    name="formaCabeza"
                    value={hallazgos.formaCabeza || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="simetriaFacial" className="block text-sm font-medium text-gray-700">Simetría Facial:</Label>
                <Input
                    type="text"
                    id="simetriaFacial"
                    name="simetriaFacial"
                    value={hallazgos.simetriaFacial || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="piel" className="block text-sm font-medium text-gray-700">Piel:</Label>
                <Input
                    type="text"
                    id="piel"
                    name="piel"
                    value={hallazgos.piel || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="cueroCabelludo" className="block text-sm font-medium text-gray-700">Cuero Cabelludo:</Label>
                <Input
                    type="text"
                    id="cueroCabelludo"
                    name="cueroCabelludo"
                    value={hallazgos.cueroCabelludo || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="cabello" className="block text-sm font-medium text-gray-700">Cabello:</Label>
                <Input
                    type="text"
                    id="cabello"
                    name="cabello"
                    value={hallazgos.cabello || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="ganglios" className="block text-sm font-medium text-gray-700">Ganglios:</Label>
                <Input
                    type="text"
                    id="ganglios"
                    name="ganglios"
                    value={hallazgos.ganglios || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="glandulasSalivales" className="block text-sm font-medium text-gray-700">Glándulas Salivales:</Label>
                <Input
                    type="text"
                    id="glandulasSalivales"
                    name="glandulasSalivales"
                    value={hallazgos.glandulasSalivales || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="ojos" className="block text-sm font-medium text-gray-700">Ojos:</Label>
                <Input
                    type="text"
                    id="ojos"
                    name="ojos"
                    value={hallazgos.ojos || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="nariz" className="block text-sm font-medium text-gray-700">Nariz:</Label>
                <Input
                    type="text"
                    id="nariz"
                    name="nariz"
                    value={hallazgos.nariz || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="senosParanasales" className="block text-sm font-medium text-gray-700">Senos Paranasales:</Label>
                <Input
                    type="text"
                    id="senosParanasales"
                    name="senosParanasales"
                    value={hallazgos.senosParanasales || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
                <Label htmlFor="articulacionTemporoMandibular" className="block text-sm font-medium text-gray-700">Articulación Temporo Mandibular:</Label>
                <div className="space-y-2">
                    <div>
                        <Label htmlFor="palpacionATM" className="inline-flex items-center">
                            <Checkbox
                                id="palpacionATM"
                                name="palpacionATM"
                                checked={hallazgos.palpacionATM || false}
                                onCheckedChange={(checked) => setHallazgos(prevHallazgos => ({
                                    ...prevHallazgos,
                                    palpacionATM: checked
                                }))}
                                className="mr-2"
                            />
                            <span>Palpación ATM</span>
                        </Label>
                        {hallazgos.palpacionATM && (
                            <Input
                                type="text"
                                id="palpacionATMDescripcion"
                                name="palpacionATMDescripcion"
                                value={hallazgos.palpacionATMDescripcion || ''}
                                onChange={handleChange}
                                placeholder="Descripción de la palpación ATM"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="ruidosArticulares" className="inline-flex items-center">
                            <Checkbox
                                id="ruidosArticulares"
                                name="ruidosArticulares"
                                checked={hallazgos.ruidosArticulares || false}
                                onCheckedChange={(checked) => setHallazgos(prevHallazgos => ({
                                    ...prevHallazgos,
                                    ruidosArticulares: checked
                                }))}
                                className="mr-2"
                            />
                            <span>Ruidos Articulares</span>
                        </Label>
                        {hallazgos.ruidosArticulares && (
                            <Input
                                type="text"
                                id="ruidosArticularesDescripcion"
                                name="ruidosArticularesDescripcion"
                                value={hallazgos.ruidosArticularesDescripcion || ''}
                                onChange={handleChange}
                                placeholder="Descripción de los ruidos articulares"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="limitacionApertura" className="inline-flex items-center">
                            <Checkbox
                                id="limitacionApertura"
                                name="limitacionApertura"
                                checked={hallazgos.limitacionApertura || false}
                                onCheckedChange={(checked) => setHallazgos(prevHallazgos => ({
                                    ...prevHallazgos,
                                    limitacionApertura: checked
                                }))}
                                className="mr-2"
                            />
                            <span>Limitación de Apertura</span>
                        </Label>
                        {hallazgos.limitacionApertura && (
                            <Input
                                type="text"
                                id="limitacionAperturaDescripcion"
                                name="limitacionAperturaDescripcion"
                                value={hallazgos.limitacionAperturaDescripcion || ''}
                                onChange={handleChange}
                                placeholder="Descripción de la limitación de apertura"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="dolorMuscular" className="inline-flex items-center">
                            <Checkbox
                                id="dolorMuscular"
                                name="dolorMuscular"
                                checked={hallazgos.dolorMuscular || false}
                                onCheckedChange={(checked) => setHallazgos(prevHallazgos => ({
                                    ...prevHallazgos,
                                    dolorMuscular: checked
                                }))}
                                className="mr-2"
                            />
                            <span>Dolor Muscular</span>
                        </Label>
                        {hallazgos.dolorMuscular && (
                            <Input
                                type="text"
                                id="dolorMuscularDescripcion"
                                name="dolorMuscularDescripcion"
                                value={hallazgos.dolorMuscularDescripcion || ''}
                                onChange={handleChange}
                                placeholder="Descripción del dolor muscular"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamenCabeza;
