
-- Crear tabla para términos dentales extraídos del formulario
CREATE TABLE public.dental_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  termino TEXT NOT NULL,
  definicion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  subcategoria TEXT,
  sinonimos TEXT[],
  contexto_uso TEXT,
  seccion_formulario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para permitir lectura pública
ALTER TABLE public.dental_terms ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública (sin autenticación)
CREATE POLICY "Anyone can view dental terms" 
  ON public.dental_terms 
  FOR SELECT 
  USING (true);

-- Crear índices para mejorar la búsqueda
CREATE INDEX idx_dental_terms_termino ON public.dental_terms USING gin(to_tsvector('spanish', termino));
CREATE INDEX idx_dental_terms_definicion ON public.dental_terms USING gin(to_tsvector('spanish', definicion));
CREATE INDEX idx_dental_terms_categoria ON public.dental_terms (categoria);
CREATE INDEX idx_dental_terms_seccion ON public.dental_terms (seccion_formulario);

-- Insertar todos los términos del formulario
INSERT INTO public.dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- PADECIMIENTO ACTUAL
('Dolor dental', 'Sensación molesta y aflictiva en las estructuras dentales causada por diferentes factores como caries, inflamación pulpar, traumatismos o enfermedad periodontal.', 'Sintomatología', 'Dolor', ARRAY['odontalgia', 'dolor de diente', 'dolor bucal'], 'Motivo principal de consulta odontológica', 'Padecimiento Actual'),
('Dolor localizado', 'Dolor que se presenta en un área específica y bien delimitada de la cavidad oral.', 'Sintomatología', 'Localización', ARRAY['dolor focal', 'dolor específico'], 'Descripción de la ubicación del dolor', 'Padecimiento Actual'),
('Dolor irradiado', 'Dolor que se origina en un punto pero se extiende hacia otras áreas anatómicas.', 'Sintomatología', 'Localización', ARRAY['dolor referido', 'dolor difuso'], 'Cuando el dolor se extiende más allá del sitio original', 'Padecimiento Actual'),
('Dolor continuo', 'Dolor que se mantiene constante en el tiempo sin períodos de alivio.', 'Sintomatología', 'Frecuencia', ARRAY['dolor persistente', 'dolor constante'], 'Patrón temporal del dolor', 'Padecimiento Actual'),
('Dolor intermitente', 'Dolor que aparece y desaparece en intervalos de tiempo.', 'Sintomatología', 'Frecuencia', ARRAY['dolor esporádico', 'dolor ocasional'], 'Dolor que no es constante', 'Padecimiento Actual'),
('Dolor punzante', 'Dolor agudo y penetrante que se siente como pinchazos.', 'Sintomatología', 'Carácter', ARRAY['dolor lancinante', 'dolor como puñalada'], 'Descripción del tipo de sensación dolorosa', 'Padecimiento Actual'),
('Dolor sordo', 'Dolor de intensidad moderada, constante y profundo.', 'Sintomatología', 'Carácter', ARRAY['dolor opaco', 'dolor gravativo'], 'Dolor menos agudo pero persistente', 'Padecimiento Actual'),
('Dolor pulsátil', 'Dolor que se presenta siguiendo el ritmo del pulso cardíaco.', 'Sintomatología', 'Carácter', ARRAY['dolor pulsante', 'dolor latente'], 'Dolor sincronizado con el latido cardíaco', 'Padecimiento Actual'),
('Provocado por frío', 'Dolor desencadenado por estímulos térmicos fríos.', 'Sintomatología', 'Estímulo', ARRAY['sensibilidad al frío', 'dolor térmico'], 'Respuesta a bebidas o alimentos fríos', 'Padecimiento Actual'),
('Provocado por calor', 'Dolor desencadenado por estímulos térmicos calientes.', 'Sintomatología', 'Estímulo', ARRAY['sensibilidad al calor'], 'Respuesta a bebidas o alimentos calientes', 'Padecimiento Actual'),
('Provocado por dulces', 'Dolor desencadenado por el consumo de azúcares.', 'Sintomatología', 'Estímulo', ARRAY['sensibilidad osmótica'], 'Respuesta a alimentos azucarados', 'Padecimiento Actual'),

-- ANTECEDENTES HEREDO-FAMILIARES
('Diabetes Mellitus', 'Enfermedad metabólica caracterizada por niveles elevados de glucosa en sangre que puede afectar la salud periodontal.', 'Enfermedades Sistémicas', 'Endocrinológicas', ARRAY['diabetes', 'DM'], 'Factor de riesgo para enfermedad periodontal', 'Antecedentes Heredo-Familiares'),
('Hipertensión Arterial', 'Presión arterial persistentemente elevada que puede afectar el tratamiento dental.', 'Enfermedades Sistémicas', 'Cardiovasculares', ARRAY['HTA', 'presión alta'], 'Consideración importante para procedimientos dentales', 'Antecedentes Heredo-Familiares'),
('Osteoporosis', 'Enfermedad que causa pérdida de densidad ósea, relevante para implantes dentales.', 'Enfermedades Sistémicas', 'Metabólicas', ARRAY['descalcificación ósea'], 'Afecta la calidad del hueso alveolar', 'Antecedentes Heredo-Familiares'),
('Artritis Reumatoide', 'Enfermedad autoinmune que puede afectar la articulación temporomandibular.', 'Enfermedades Sistémicas', 'Autoinmunes', ARRAY['AR', 'artritis'], 'Puede causar disfunción de ATM', 'Antecedentes Heredo-Familiares'),
('Parkinson', 'Enfermedad neurodegenerativa que puede dificultar la higiene oral.', 'Enfermedades Sistémicas', 'Neurológicas', ARRAY['enfermedad de Parkinson'], 'Afecta la capacidad de autocuidado oral', 'Antecedentes Heredo-Familiares'),
('Alzheimer', 'Demencia que puede comprometer el autocuidado dental.', 'Enfermedades Sistémicas', 'Neurológicas', ARRAY['demencia senil'], 'Requiere cuidados especiales de higiene oral', 'Antecedentes Heredo-Familiares'),
('Asma', 'Enfermedad respiratoria que puede influir en el tratamiento dental.', 'Enfermedades Sistémicas', 'Respiratorias', ARRAY['asma bronquial'], 'Consideración para sedación y medicamentos', 'Antecedentes Heredo-Familiares'),
('Cáncer', 'Neoplasias malignas que pueden requerir cuidados dentales especiales.', 'Enfermedades Sistémicas', 'Oncológicas', ARRAY['neoplasia', 'tumor maligno'], 'Requiere coordinación con oncología', 'Antecedentes Heredo-Familiares'),
('Anemia', 'Disminución de glóbulos rojos que puede causar palidez en mucosas orales.', 'Enfermedades Sistémicas', 'Hematológicas', ARRAY['anemia ferropénica'], 'Se manifiesta en mucosas orales', 'Antecedentes Heredo-Familiares'),

-- ANTECEDENTES PERSONALES NO PATOLÓGICOS
('Frecuencia de cepillado', 'Número de veces que el paciente realiza higiene dental diaria.', 'Higiene Oral', 'Técnicas', ARRAY['cepillado dental'], 'Indicador de hábitos de higiene', 'Antecedentes Personales No Patológicos'),
('Técnica de cepillado', 'Método empleado para la limpieza de dientes y encías.', 'Higiene Oral', 'Técnicas', ARRAY['método de cepillado'], 'Evaluación de efectividad de higiene', 'Antecedentes Personales No Patológicos'),
('Uso de hilo dental', 'Empleo de hilo dental para limpieza interdental.', 'Higiene Oral', 'Auxiliares', ARRAY['higiene interdental'], 'Prevención de caries y gingivitis', 'Antecedentes Personales No Patológicos'),
('Enjuague bucal', 'Uso de colutorios para complementar la higiene oral.', 'Higiene Oral', 'Auxiliares', ARRAY['colutorio', 'enjuague'], 'Complemento de la higiene oral', 'Antecedentes Personales No Patológicos'),
('Visita al odontólogo', 'Frecuencia de consultas dentales preventivas o curativas.', 'Atención Dental', 'Preventiva', ARRAY['consulta dental'], 'Indicador de cuidado preventivo', 'Antecedentes Personales No Patológicos'),

-- ANTECEDENTES PERSONALES PATOLÓGICOS
('Caries dental', 'Destrucción de los tejidos duros del diente por bacterias acidogénicas.', 'Patología Dental', 'Infecciosa', ARRAY['cavidades dentales'], 'Enfermedad dental más común', 'Antecedentes Personales Patológicos'),
('Gingivitis', 'Inflamación de las encías causada por acumulación de placa bacteriana.', 'Patología Periodontal', 'Inflamatoria', ARRAY['inflamación gingival'], 'Estadio inicial de enfermedad periodontal', 'Antecedentes Personales Patológicos'),
('Periodontitis', 'Enfermedad inflamatoria que afecta los tejidos de soporte del diente.', 'Patología Periodontal', 'Inflamatoria', ARRAY['piorrea', 'enfermedad periodontal'], 'Causa principal de pérdida dental en adultos', 'Antecedentes Personales Patológicos'),
('Hepatitis B', 'Infección viral del hígado que requiere precauciones especiales.', 'Enfermedades Infecciosas', 'Virales', ARRAY['HBV'], 'Requiere medidas de bioseguridad', 'Antecedentes Personales Patológicos'),
('VIH', 'Virus de inmunodeficiencia humana que compromete el sistema inmune.', 'Enfermedades Infecciosas', 'Virales', ARRAY['SIDA'], 'Requiere cuidados especiales y precauciones', 'Antecedentes Personales Patológicos'),

-- ANTECEDENTES ALÉRGICOS
('Alergia a penicilina', 'Reacción adversa a antibióticos del grupo penicilina.', 'Alergias', 'Medicamentosas', ARRAY['hipersensibilidad a penicilina'], 'Contraindicación absoluta para penicilinas', 'Antecedentes Alérgicos'),
('Alergia al látex', 'Reacción adversa al caucho natural presente en guantes.', 'Alergias', 'Contacto', ARRAY['hipersensibilidad al látex'], 'Requiere uso de guantes libres de látex', 'Antecedentes Alérgicos'),
('Alergia a anestésicos', 'Reacción adversa a anestésicos locales odontológicos.', 'Alergias', 'Medicamentosas', ARRAY['hipersensibilidad anestésica'], 'Requiere pruebas de sensibilidad', 'Antecedentes Alérgicos'),

-- EXPLORACIÓN FÍSICA - SIGNOS VITALES
('Presión arterial', 'Fuerza ejercida por la sangre contra las paredes arteriales.', 'Signos Vitales', 'Cardiovascular', ARRAY['tensión arterial', 'PA'], 'Indicador cardiovascular importante', 'Exploración Física'),
('Frecuencia cardíaca', 'Número de latidos cardíacos por minuto.', 'Signos Vitales', 'Cardiovascular', ARRAY['pulso', 'FC'], 'Indicador de función cardíaca', 'Exploración Física'),
('Frecuencia respiratoria', 'Número de respiraciones por minuto.', 'Signos Vitales', 'Respiratorio', ARRAY['FR'], 'Indicador de función respiratoria', 'Exploración Física'),
('Temperatura corporal', 'Medida del calor corporal que indica normalidad o fiebre.', 'Signos Vitales', 'General', ARRAY['temperatura'], 'Indicador de procesos infecciosos', 'Exploración Física'),
('Índice de masa corporal', 'Relación entre peso y talla que indica estado nutricional.', 'Signos Vitales', 'Nutricional', ARRAY['IMC'], 'Indicador de estado nutricional', 'Exploración Física'),

-- EXAMEN DE CABEZA
('Normocéfalo', 'Cabeza de forma y tamaño normales.', 'Anatomía Craneal', 'Morfología', ARRAY['cabeza normal'], 'Descripción de normalidad craneal', 'Examen de Cabeza'),
('Dolicocéfalo', 'Cabeza alargada en sentido anteroposterior.', 'Anatomía Craneal', 'Morfología', ARRAY['cabeza alargada'], 'Variante morfológica craneal', 'Examen de Cabeza'),
('Braquicéfalo', 'Cabeza ancha y corta.', 'Anatomía Craneal', 'Morfología', ARRAY['cabeza ancha'], 'Variante morfológica craneal', 'Examen de Cabeza'),
('Perfil recto', 'Perfil facial armónico sin protrusiones.', 'Anatomía Facial', 'Perfil', ARRAY['perfil normal'], 'Análisis de perfil facial', 'Examen de Cabeza'),
('Perfil convexo', 'Perfil con protrusión del tercio medio facial.', 'Anatomía Facial', 'Perfil', ARRAY['perfil abombado'], 'Variante del perfil facial', 'Examen de Cabeza'),
('Perfil cóncavo', 'Perfil con retrusión del tercio medio facial.', 'Anatomía Facial', 'Perfil', ARRAY['perfil hundido'], 'Variante del perfil facial', 'Examen de Cabeza'),
('Asimetría facial', 'Falta de simetría entre los lados derecho e izquierdo de la cara.', 'Anatomía Facial', 'Morfología', ARRAY['asimetría'], 'Alteración de la simetría facial', 'Examen de Cabeza'),

-- ARTICULACIÓN CRANEOMANDIBULAR
('Apertura bucal', 'Distancia máxima entre los incisivos superiores e inferiores.', 'ATM', 'Función', ARRAY['abertura oral'], 'Medida de función mandibular', 'Articulación Craneomandibular'),
('Chasquidos articulares', 'Ruidos tipo click en la ATM durante movimientos mandibulares.', 'ATM', 'Disfunción', ARRAY['clicks articulares'], 'Signo de disfunción temporomandibular', 'Articulación Craneomandibular'),
('Crepitación', 'Ruido como arena en la ATM durante movimientos.', 'ATM', 'Disfunción', ARRAY['crepitación articular'], 'Signo de degeneración articular', 'Articulación Craneomandibular'),
('Dolor articular', 'Molestia en la región de la ATM.', 'ATM', 'Sintomatología', ARRAY['dolor de ATM'], 'Síntoma de disfunción temporomandibular', 'Articulación Craneomandibular'),
('Trismus', 'Limitación de la apertura bucal.', 'ATM', 'Disfunción', ARRAY['apertura limitada'], 'Restricción del movimiento mandibular', 'Articulación Craneomandibular'),

-- EXAMEN INTRABUCAL
('Mucosa yugal', 'Membrana mucosa que recubre el interior de las mejillas.', 'Anatomía Oral', 'Mucosas', ARRAY['mucosa bucal'], 'Tejido blando intrabucal', 'Examen Intrabucal'),
('Paladar duro', 'Porción anterior del techo de la boca formada por hueso.', 'Anatomía Oral', 'Paladar', ARRAY['bóveda palatina'], 'Estructura ósea del paladar', 'Examen Intrabucal'),
('Paladar blando', 'Porción posterior del techo de la boca formada por músculo.', 'Anatomía Oral', 'Paladar', ARRAY['velo del paladar'], 'Estructura muscular del paladar', 'Examen Intrabucal'),
('Lengua', 'Órgano muscular móvil que participa en masticación, deglución y habla.', 'Anatomía Oral', 'Órganos', ARRAY['órgano lingual'], 'Órgano móvil de la cavidad oral', 'Examen Intrabucal'),
('Piso de boca', 'Región inferior de la cavidad oral bajo la lengua.', 'Anatomía Oral', 'Regiones', ARRAY['suelo bucal'], 'Región anatómica sublingual', 'Examen Intrabucal'),
('Encías', 'Tejido blando que rodea y protege los dientes.', 'Anatomía Oral', 'Periodonto', ARRAY['gingi'], 'Tejido de soporte dental', 'Examen Intrabucal'),

-- OCLUSIÓN
('Clase I de Angle', 'Relación molar normal con cúspide mesiovestibular del primer molar superior ocluyendo en el surco del inferior.', 'Oclusión', 'Clasificación', ARRAY['neutroclusión'], 'Oclusión normal según Angle', 'Oclusión'),
('Clase II de Angle', 'Relación molar donde el primer molar inferior está en posición distal respecto al superior.', 'Oclusión', 'Clasificación', ARRAY['distoclusión'], 'Maloclusión posterior según Angle', 'Oclusión'),
('Clase III de Angle', 'Relación molar donde el primer molar inferior está en posición mesial respecto al superior.', 'Oclusión', 'Clasificación', ARRAY['mesioclusión'], 'Maloclusión anterior según Angle', 'Oclusión'),
('Overjet', 'Distancia horizontal entre los incisivos superiores e inferiores.', 'Oclusión', 'Medidas', ARRAY['resalte'], 'Medida sagital de la oclusión', 'Oclusión'),
('Overbite', 'Distancia vertical entre los incisivos superiores e inferiores.', 'Oclusión', 'Medidas', ARRAY['sobremordida'], 'Medida vertical de la oclusión', 'Oclusión'),
('Mordida cruzada', 'Relación anormal donde los dientes superiores quedan por lingual de los inferiores.', 'Oclusión', 'Maloclusiones', ARRAY['crossbite'], 'Maloclusión transversal', 'Oclusión'),
('Mordida abierta', 'Falta de contacto entre dientes anteriores superiores e inferiores.', 'Oclusión', 'Maloclusiones', ARRAY['openbite'], 'Maloclusión vertical', 'Oclusión'),

-- DIAGNÓSTICO
('Caries dental', 'Proceso infeccioso que destruye los tejidos duros del diente.', 'Diagnósticos', 'Patología Dental', ARRAY['cavidades'], 'Diagnóstico dental más frecuente', 'Diagnóstico'),
('Gingivitis crónica', 'Inflamación persistente de las encías sin pérdida de inserción.', 'Diagnósticos', 'Patología Periodontal', ARRAY['inflamación gingival'], 'Diagnóstico periodontal inicial', 'Diagnóstico'),
('Periodontitis crónica', 'Enfermedad inflamatoria destructiva del periodonto.', 'Diagnósticos', 'Patología Periodontal', ARRAY['piorrea'], 'Diagnóstico periodontal avanzado', 'Diagnóstico'),
('Pulpitis reversible', 'Inflamación pulpar que puede resolverse con tratamiento adecuado.', 'Diagnósticos', 'Patología Pulpar', ARRAY['pulpitis'], 'Diagnóstico endodóntico inicial', 'Diagnóstico'),
('Pulpitis irreversible', 'Inflamación pulpar que requiere tratamiento endodóntico.', 'Diagnósticos', 'Patología Pulpar', ARRAY['pulpitis severa'], 'Diagnóstico endodóntico avanzado', 'Diagnóstico'),
('Necrosis pulpar', 'Muerte del tejido pulpar por infección o trauma.', 'Diagnósticos', 'Patología Pulpar', ARRAY['pulpa necrótica'], 'Diagnóstico endodóntico severo', 'Diagnóstico');
