
-- Agregar términos adicionales extraídos directamente de la aplicación
INSERT INTO public.dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- PADECIMIENTO ACTUAL Y DOLOR (términos adicionales)
('Motivo de consulta', 'Razón principal por la cual el paciente busca atención odontológica, describiendo el síntoma o problema que lo llevó a la consulta.', 'Historia Clínica', 'Anamnesis', ARRAY['motivo de visita', 'causa de consulta'], 'Punto de partida para el diagnóstico odontológico', 'Padecimiento Actual'),
('Manchas oscuras', 'Alteraciones en la coloración dental que pueden indicar caries, tinciones extrínsecas o intrínsecas, o procesos patológicos.', 'Patología Dental', 'Alteraciones del color', ARRAY['pigmentaciones', 'decoloraciones'], 'Signo clínico importante en el diagnóstico dental', 'Padecimiento Actual'),
('Dientes frontales', 'Grupo de dientes anteriores compuesto por incisivos centrales y laterales, importantes para la estética y fonética.', 'Anatomía Dental', 'Dientes anteriores', ARRAY['incisivos', 'dientes de adelante'], 'Zona de mayor importancia estética', 'Padecimiento Actual'),
('Sintomatología', 'Conjunto de síntomas que presenta el paciente y que orientan hacia un diagnóstico específico.', 'Semiología', 'Síntomas', ARRAY['síntomas', 'manifestaciones clínicas'], 'Base para el diagnóstico clínico', 'Padecimiento Actual'),
('Fecha de inicio', 'Momento temporal en que comenzaron los síntomas, fundamental para determinar la evolución del padecimiento.', 'Historia Clínica', 'Cronología', ARRAY['inicio de síntomas', 'comienzo'], 'Dato crucial para el diagnóstico diferencial', 'Padecimiento Actual'),
('Condición de aparición', 'Circunstancias o factores que desencadenan o provocan la aparición de los síntomas.', 'Semiología', 'Factores desencadenantes', ARRAY['factor provocador', 'causa aparición'], 'Ayuda a identificar el origen del problema', 'Padecimiento Actual'),
('Ubicación', 'Localización anatómica específica donde se presenta el síntoma o signo clínico.', 'Semiología', 'Localización', ARRAY['localización', 'sitio'], 'Fundamental para el diagnóstico topográfico', 'Padecimiento Actual'),
('Atenuación', 'Factores o medidas que disminuyen o alivian la intensidad de los síntomas.', 'Semiología', 'Factores de alivio', ARRAY['alivio', 'mejora'], 'Orienta sobre la naturaleza del padecimiento', 'Padecimiento Actual'),

-- ANTECEDENTES HEREDO FAMILIARES (términos adicionales)
('Finado', 'Familiar fallecido cuyas causas de muerte pueden tener relevancia hereditaria para el paciente.', 'Historia Familiar', 'Estado vital', ARRAY['fallecido', 'muerto'], 'Importante para identificar factores de riesgo hereditarios', 'Antecedentes Heredo-Familiares'),
('Vivo y Sano', 'Familiar que se encuentra con vida y sin padecimientos significativos conocidos.', 'Historia Familiar', 'Estado vital', ARRAY['sano', 'sin enfermedades'], 'Indica ausencia de factores de riesgo familiares', 'Antecedentes Heredo-Familiares'),

-- HIGIENE Y VIVIENDA
('Tipo de Vivienda', 'Clasificación del lugar de habitación que puede influir en las condiciones de salud del paciente.', 'Determinantes Sociales', 'Vivienda', ARRAY['casa', 'hogar'], 'Factor socioeconómico relevante para la salud', 'Antecedentes Personales No Patológicos'),
('Hacinamiento', 'Condición de sobrepoblación en el hogar que puede favorecer la transmisión de enfermedades.', 'Determinantes Sociales', 'Condiciones habitacionales', ARRAY['sobrepoblación', 'muchas personas'], 'Factor de riesgo para enfermedades infecciosas', 'Antecedentes Personales No Patológicos'),
('Mascotas', 'Animales domésticos que pueden ser fuente de infecciones zoonóticas o alergias.', 'Determinantes Sociales', 'Exposición animal', ARRAY['animales', 'mascotas domésticas'], 'Posible fuente de patógenos o alérgenos', 'Antecedentes Personales No Patológicos'),
('Irrigador dental', 'Dispositivo que utiliza un chorro de agua a presión para limpiar espacios interdentales.', 'Higiene Oral', 'Auxiliares', ARRAY['waterpik', 'irrigador bucal'], 'Complemento útil para higiene interdental', 'Antecedentes Personales No Patológicos'),
('Halitosis', 'Mal aliento causado por diversos factores bucales o sistémicos.', 'Patología Oral', 'Alteraciones del aliento', ARRAY['mal aliento', 'mal olor bucal'], 'Síntoma que requiere evaluación de causas', 'Antecedentes Personales No Patológicos'),

-- ANTECEDENTES PATOLÓGICOS
('Anorexia', 'Trastorno alimentario caracterizado por restricción severa de la ingesta de alimentos.', 'Trastornos Nutricionales', 'Alimentarios', ARRAY['anorexia nerviosa'], 'Puede causar deficiencias nutricionales que afecten la salud oral', 'Antecedentes Personales Patológicos'),
('Bulimia', 'Trastorno alimentario con episodios de ingesta excesiva seguidos de conductas compensatorias.', 'Trastornos Nutricionales', 'Alimentarios', ARRAY['bulimia nerviosa'], 'Causa erosión dental por vómitos frecuentes', 'Antecedentes Personales Patológicos'),
('Enfermedad coronaria', 'Patología de las arterias que irrigan el corazón, importante para procedimientos dentales.', 'Enfermedades Cardiovasculares', 'Cardíacas', ARRAY['cardiopatía isquémica'], 'Requiere precauciones en tratamientos dentales', 'Antecedentes Personales Patológicos'),
('Hepatitis A', 'Infección viral del hígado transmitida por vía fecal-oral.', 'Enfermedades Infecciosas', 'Hepáticas', ARRAY['hepatitis viral A'], 'Requiere medidas de bioseguridad específicas', 'Antecedentes Personales Patológicos'),
('Sífilis', 'Infección de transmisión sexual que puede manifestarse en cavidad oral.', 'Enfermedades de Transmisión Sexual', 'Bacterianas', ARRAY['lúes'], 'Puede presentar lesiones orales características', 'Antecedentes Personales Patológicos'),
('Parotiditis', 'Inflamación de las glándulas salivales parotídeas, comúnmente viral.', 'Enfermedades Virales', 'Glándulas salivales', ARRAY['paperas'], 'Afecta glándulas salivales importantes', 'Antecedentes Personales Patológicos'),

-- ALERGIAS Y ADICCIONES
('Reacción alérgica', 'Respuesta inmunitaria exagerada a sustancias normalmente inocuas.', 'Alergias', 'Reacciones inmunológicas', ARRAY['hipersensibilidad', 'alergia'], 'Información crucial antes de prescribir medicamentos', 'Antecedentes Alérgicos'),
('Anestesia general', 'Procedimiento anestésico que produce pérdida completa de la conciencia.', 'Anestesiología', 'Tipos de anestesia', ARRAY['anestesia total'], 'Importante para procedimientos quirúrgicos mayores', 'Antecedentes Alérgicos'),

-- INTERROGATORIO POR SISTEMAS
('Masticación unilateral', 'Hábito de masticar predominantemente de un solo lado.', 'Función Oral', 'Masticación', ARRAY['masticación de un lado'], 'Puede indicar dolor o disfunción en un lado', 'Interrogatorio Sistemas'),
('Disminución del gusto', 'Pérdida parcial de la capacidad gustativa.', 'Función Oral', 'Gusto', ARRAY['hipogeusia'], 'Puede relacionarse con problemas orales', 'Interrogatorio Sistemas'),
('Obstrucción nasal', 'Dificultad para el paso del aire por las fosas nasales.', 'Sistema Respiratorio', 'Vías aéreas superiores', ARRAY['nariz tapada'], 'Puede causar respiración bucal', 'Interrogatorio Sistemas'),
('Epistaxis', 'Sangrado nasal espontáneo o traumático.', 'Sistema Respiratorio', 'Hemorragias', ARRAY['sangrado nasal'], 'Puede indicar trastornos de coagulación', 'Interrogatorio Sistemas'),
('Lipotimia', 'Pérdida transitoria de la conciencia por disminución del flujo cerebral.', 'Sistema Cardiovascular', 'Síncope', ARRAY['desmayo', 'síncope'], 'Importante para manejo dental de pacientes', 'Interrogatorio Sistemas'),
('Disuria', 'Dolor o dificultad para orinar.', 'Sistema Genitourinario', 'Micción', ARRAY['dolor al orinar'], 'Puede relacionarse con infecciones', 'Interrogatorio Sistemas'),
('Polidipsia', 'Sed excesiva y aumento del consumo de líquidos.', 'Sistema Endocrino', 'Diabetes', ARRAY['sed excesiva'], 'Síntoma clásico de diabetes', 'Interrogatorio Sistemas'),
('Exoftalmos', 'Protrusión anormal de los ojos.', 'Sistema Endocrino', 'Tiroides', ARRAY['ojos saltones'], 'Signo de hipertiroidismo', 'Interrogatorio Sistemas'),
('Hirsutismo', 'Crecimiento excesivo de vello en mujeres en patrón masculino.', 'Sistema Endocrino', 'Hormonas', ARRAY['vello excesivo'], 'Puede indicar trastornos hormonales', 'Interrogatorio Sistemas'),

-- EXPLORACIÓN FÍSICA
('Mesocéfalo', 'Cabeza de proporciones normales y armónicas.', 'Anatomía Craneal', 'Morfología', ARRAY['cabeza normal'], 'Descripción antropométrica normal', 'Examen de Cabeza'),
('Queilitis angular', 'Inflamación y fisuración de las comisuras labiales.', 'Patología Labial', 'Inflamación', ARRAY['boqueras', 'comisura irritada'], 'Puede indicar deficiencias nutricionales', 'Examen de Cabeza'),
('Incompetencia labial', 'Incapacidad para el cierre labial completo en reposo.', 'Disfunción Oral', 'Labios', ARRAY['labios entreabiertos'], 'Puede causar sequedad bucal y gingivitis', 'Examen de Cabeza'),

-- VOCABULARIO DEL PACIENTE
('Picazón', 'Sensación que provoca deseo de rascarse.', 'Síntomas', 'Sensaciones', ARRAY['comezón', 'prurito'], 'Descripción común de irritación', 'Síntomas'),
('Hinchazón', 'Aumento de volumen de un tejido por acumulación de líquido.', 'Síntomas', 'Inflamación', ARRAY['inflamación', 'edema'], 'Signo clínico de proceso inflamatorio', 'Síntomas'),
('Adormecimiento', 'Pérdida de sensibilidad en una zona específica.', 'Síntomas', 'Neurológicos', ARRAY['entumecimiento', 'anestesia'], 'Puede indicar daño nervioso', 'Síntomas'),
('Postemilla', 'Término popular para absceso dental con drenaje de pus.', 'Patología Dental', 'Infecciones', ARRAY['flemón', 'absceso'], 'Infección dental con formación de pus', 'Síntomas'),

-- ANATOMÍA ORAL
('Muela del juicio', 'Tercer molar que erupciona habitualmente entre los 17-25 años.', 'Anatomía Dental', 'Molares', ARRAY['tercer molar', 'cordal'], 'Frecuentemente causa problemas por falta de espacio', 'Anatomía Oral'),
('Frenillo', 'Pliegue de mucosa que limita el movimiento de labios y lengua.', 'Anatomía Oral', 'Tejidos blandos', ARRAY['frenillo labial', 'frenillo lingual'], 'Puede requerir cirugía si es muy corto', 'Anatomía Oral'),
('Cuello del diente', 'Zona de transición entre la corona y la raíz dental.', 'Anatomía Dental', 'Estructuras', ARRAY['línea cervical'], 'Zona vulnerable a caries cervicales', 'Anatomía Oral'),

-- PATOLOGÍAS COMUNES
('Diente picado', 'Término popular para describir un diente con caries.', 'Patología Dental', 'Caries', ARRAY['diente cariado', 'caries'], 'Descripción coloquial de destrucción dental', 'Patologías'),
('Piorrea', 'Término popular para periodontitis avanzada con supuración.', 'Patología Periodontal', 'Enfermedad periodontal', ARRAY['periodontitis', 'enfermedad de encías'], 'Estadio avanzado de enfermedad periodontal', 'Patologías'),
('Rechinar los dientes', 'Movimiento involuntario de fricción dental, especialmente nocturno.', 'Parafunciones', 'Bruxismo', ARRAY['bruxismo', 'apretar dientes'], 'Puede causar desgaste dental y disfunción de ATM', 'Patologías'),
('Algodoncillo', 'Término popular para candidiasis oral.', 'Infecciones Fúngicas', 'Candidiasis', ARRAY['candidiasis oral', 'hongos bucales'], 'Infección fúngica común en bebés e inmunodeprimidos', 'Patologías'),
('Llagas', 'Úlceras dolorosas en mucosa oral.', 'Patología Oral', 'Úlceras', ARRAY['aftas', 'úlceras bucales'], 'Lesiones dolorosas de la mucosa oral', 'Patologías'),
('Mordida chueca', 'Término popular para maloclusión dental.', 'Ortodoncia', 'Maloclusión', ARRAY['dientes chuecos', 'maloclusión'], 'Alteración en la posición y relación dental', 'Patologías'),
('Diente flojo', 'Movilidad dental anormal.', 'Patología Periodontal', 'Movilidad', ARRAY['movilidad dental'], 'Signo de pérdida de soporte periodontal', 'Patologías'),

-- TRATAMIENTOS
('Empaste', 'Restauración dental con material de obturación.', 'Odontología Restaurativa', 'Obturaciones', ARRAY['relleno', 'curación', 'resina'], 'Tratamiento conservador para caries', 'Tratamientos'),
('Matar el nervio', 'Término popular para tratamiento endodóntico.', 'Endodoncia', 'Tratamiento pulpar', ARRAY['endodoncia', 'tratamiento de conducto'], 'Eliminación del tejido pulpar infectado', 'Tratamientos'),
('Sacar una muela', 'Término popular para extracción dental.', 'Cirugía Oral', 'Exodoncia', ARRAY['extracción', 'exodoncia'], 'Remoción quirúrgica de un diente', 'Tratamientos'),
('Funda', 'Término popular para corona dental.', 'Prótesis Dental', 'Coronas', ARRAY['corona dental'], 'Restauración que cubre completamente un diente', 'Tratamientos'),
('Placa', 'Término popular para prótesis dental removible.', 'Prótesis Dental', 'Removible', ARRAY['dentadura postiza', 'prótesis'], 'Aparato removible para reemplazar dientes perdidos', 'Tratamientos'),
('Frenos', 'Término popular para aparatos de ortodoncia.', 'Ortodoncia', 'Aparatología', ARRAY['brackets', 'aparatos'], 'Dispositivos para corregir malposiciones dentales', 'Tratamientos'),

-- TÉRMINOS MÉDICOS GENERALES
('Agudo', 'Proceso patológico de inicio súbito y evolución rápida.', 'Medicina General', 'Evolución temporal', ARRAY['súbito', 'repentino'], 'Descripción temporal de enfermedades', 'Términos Médicos'),
('Crónico', 'Proceso patológico de larga duración y evolución lenta.', 'Medicina General', 'Evolución temporal', ARRAY['prolongado', 'persistente'], 'Enfermedad de evolución prolongada', 'Términos Médicos'),
('Analgésico', 'Medicamento que alivia o elimina el dolor.', 'Farmacología', 'Medicamentos', ARRAY['calmante', 'para el dolor'], 'Fármaco usado para control del dolor', 'Términos Médicos'),
('Antiinflamatorio', 'Medicamento que reduce la inflamación.', 'Farmacología', 'Medicamentos', ARRAY['para inflamación'], 'Fármaco que controla procesos inflamatorios', 'Términos Médicos'),
('Historial clínico', 'Documento médico que registra la información del paciente.', 'Documentación Médica', 'Registros', ARRAY['expediente', 'historia clínica'], 'Registro completo de la atención médica', 'Términos Médicos');
