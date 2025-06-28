
-- Agregar términos médicos específicos basados en los componentes de la aplicación
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- Términos del Padecimiento Actual
('Motivo de consulta', 'Razón principal por la cual el paciente acude a consulta odontológica', 'Historia clínica', 'Padecimiento actual', ARRAY['chief complaint', 'queja principal'], 'Primera información que proporciona el paciente', 'padecimientoActual'),
('Historia del padecimiento', 'Relato cronológico de la evolución de los síntomas actuales', 'Historia clínica', 'Padecimiento actual', ARRAY['historia de la enfermedad actual'], 'Descripción detallada de cómo ha evolucionado el problema', 'padecimientoActual'),
('Sin síntomas', 'Ausencia de manifestaciones clínicas referidas por el paciente', 'Historia clínica', 'Padecimiento actual', ARRAY['asintomático'], 'Paciente que no refiere molestias', 'padecimientoActual'),

-- Términos de Características del Dolor
('Fecha de inicio', 'Momento específico en que comenzaron los síntomas', 'Semiología', 'Dolor', ARRAY['inicio de síntomas'], 'Cronología del padecimiento', 'padecimientoActual'),
('Condición de aparición', 'Circunstancias bajo las cuales se presenta el dolor', 'Semiología', 'Dolor', ARRAY['forma de aparición'], 'Provocado o espontáneo', 'padecimientoActual'),
('Dolor provocado', 'Dolor que aparece en respuesta a un estímulo específico', 'Semiología', 'Dolor', ARRAY['dolor inducido'], 'Dolor que requiere un desencadenante', 'padecimientoActual'),
('Dolor espontáneo', 'Dolor que aparece sin estímulo aparente', 'Semiología', 'Dolor', ARRAY['dolor de aparición súbita'], 'Dolor que surge sin causa externa evidente', 'padecimientoActual'),
('Frecuencia intermitente', 'Dolor que aparece y desaparece con intervalos', 'Semiología', 'Dolor', ARRAY['dolor episódico'], 'Dolor no continuo', 'padecimientoActual'),
('Frecuencia continua', 'Dolor constante que no cesa', 'Semiología', 'Dolor', ARRAY['dolor persistente'], 'Dolor que se mantiene sin interrupción', 'padecimientoActual'),
('Intensidad leve', 'Dolor de baja intensidad que permite actividades normales', 'Semiología', 'Dolor', ARRAY['dolor suave'], 'Escala 1-3 de intensidad', 'padecimientoActual'),
('Intensidad moderada', 'Dolor que interfiere parcialmente con actividades cotidianas', 'Semiología', 'Dolor', ARRAY['dolor medio'], 'Escala 4-6 de intensidad', 'padecimientoActual'),
('Intensidad severa', 'Dolor intenso que impide realizar actividades normales', 'Semiología', 'Dolor', ARRAY['dolor fuerte', 'dolor intenso'], 'Escala 7-10 de intensidad', 'padecimientoActual'),
('Dolor localizado', 'Dolor limitado a una zona específica', 'Semiología', 'Dolor', ARRAY['dolor focal'], 'Dolor circunscrito a un área', 'padecimientoActual'),
('Dolor irradiado', 'Dolor que se extiende desde su origen hacia otras zonas', 'Semiología', 'Dolor', ARRAY['dolor referido'], 'Dolor que se propaga', 'padecimientoActual'),
('Atenuación del dolor', 'Factores que disminuyen o aumentan la intensidad del dolor', 'Semiología', 'Dolor', ARRAY['factores modificadores'], 'Qué mejora o empeora el dolor', 'padecimientoActual'),

-- Términos de Antecedentes Heredo-Familiares
('Finado', 'Familiar que ha fallecido', 'Historia clínica', 'Antecedentes familiares', ARRAY['difunto', 'fallecido'], 'Estado vital del familiar', 'antecedentesHeredoFamiliares'),
('Causa de muerte', 'Motivo del fallecimiento del familiar', 'Historia clínica', 'Antecedentes familiares', ARRAY['causa de defunción'], 'Información sobre mortalidad familiar', 'antecedentesHeredoFamiliares'),
('Diabetes mellitus familiar', 'Antecedente de diabetes en la familia', 'Historia clínica', 'Antecedentes familiares', ARRAY['diabetes hereditaria'], 'Predisposición genética a diabetes', 'antecedentesHeredoFamiliares'),
('Hipertensión arterial familiar', 'Antecedente de presión alta en la familia', 'Historia clínica', 'Antecedentes familiares', ARRAY['HTA familiar'], 'Predisposición familiar a hipertensión', 'antecedentesHeredoFamiliares'),
('Osteoporosis familiar', 'Antecedente familiar de pérdida de densidad ósea', 'Historia clínica', 'Antecedentes familiares', ARRAY['huesos frágiles familiares'], 'Predisposición genética a osteoporosis', 'antecedentesHeredoFamiliares'),
('Artritis reumatoide familiar', 'Antecedente familiar de enfermedad autoinmune articular', 'Historia clínica', 'Antecedentes familiares', ARRAY['AR familiar'], 'Predisposición a artritis reumatoide', 'antecedentesHeredoFamiliares'),
('Parkinson familiar', 'Antecedente familiar de enfermedad neurodegenerativa', 'Historia clínica', 'Antecedentes familiares', ARRAY['enfermedad de Parkinson familiar'], 'Predisposición genética a Parkinson', 'antecedentesHeredoFamiliares'),
('Alzheimer familiar', 'Antecedente familiar de demencia', 'Historia clínica', 'Antecedentes familiares', ARRAY['demencia familiar'], 'Predisposición genética a Alzheimer', 'antecedentesHeredoFamiliares'),
('Asma familiar', 'Antecedente familiar de enfermedad respiratoria', 'Historia clínica', 'Antecedentes familiares', ARRAY['broncoespasmo familiar'], 'Predisposición genética a asma', 'antecedentesHeredoFamiliares'),
('Cáncer familiar', 'Antecedente familiar de neoplasias malignas', 'Historia clínica', 'Antecedentes familiares', ARRAY['tumor maligno familiar'], 'Predisposición genética a cáncer', 'antecedentesHeredoFamiliares'),
('Anemia familiar', 'Antecedente familiar de disminución de hemoglobina', 'Historia clínica', 'Antecedentes familiares', ARRAY['anemia hereditaria'], 'Predisposición genética a anemia', 'antecedentesHeredoFamiliares'),

-- Términos de Antecedentes Personales No Patológicos - Vivienda
('Tipo de vivienda', 'Clasificación del inmueble donde habita el paciente', 'Historia clínica', 'Factores sociales', ARRAY['tipo de casa'], 'Casa, departamento, cuarto, etc.', 'antecedentesPersonalesNoPatologicos'),
('Material de vivienda', 'Tipo de construcción del inmueble', 'Historia clínica', 'Factores sociales', ARRAY['material de construcción'], 'Adobe, ladrillo, lámina, etc.', 'antecedentesPersonalesNoPatologicos'),
('Servicios públicos', 'Infraestructura disponible en la vivienda', 'Historia clínica', 'Factores sociales', ARRAY['servicios básicos'], 'Agua, luz, drenaje, internet, etc.', 'antecedentesPersonalesNoPatologicos'),
('Condición de la calle', 'Estado de la vía pública donde vive', 'Historia clínica', 'Factores sociales', ARRAY['estado de la calle'], 'Pavimentada, empedrada, terracería', 'antecedentesPersonalesNoPatologicos'),
('Iluminación de calle', 'Disponibilidad de alumbrado público', 'Historia clínica', 'Factores sociales', ARRAY['alumbrado público'], 'Presencia de luz en la vía pública', 'antecedentesPersonalesNoPatologicos'),
('Hacinamiento', 'Número excesivo de personas por espacio habitable', 'Historia clínica', 'Factores sociales', ARRAY['sobrepoblación'], 'Más de 2.5 personas por cuarto', 'antecedentesPersonalesNoPatologicos'),
('Promiscuidad', 'Convivencia de varias personas en un mismo dormitorio', 'Historia clínica', 'Factores sociales', ARRAY['compartir cama'], 'Más de 2 personas por cama', 'antecedentesPersonalesNoPatologicos'),

-- Términos de Hábitos de Higiene
('Frecuencia de baño', 'Periodicidad del aseo corporal', 'Historia clínica', 'Hábitos de higiene', ARRAY['frecuencia de aseo'], 'Diario, semanal, quincenal', 'antecedentesPersonalesNoPatologicos'),
('Lavado de manos', 'Momentos en que se realiza higiene de manos', 'Historia clínica', 'Hábitos de higiene', ARRAY['aseo de manos'], 'Antes de comer, después del baño, etc.', 'antecedentesPersonalesNoPatologicos'),
('Cambio de ropa', 'Frecuencia de cambio de vestimenta', 'Historia clínica', 'Hábitos de higiene', ARRAY['cambio de vestimenta'], 'Diario, cada tercer día, semanal', 'antecedentesPersonalesNoPatologicos'),
('Frecuencia de cepillado', 'Veces al día que se cepilla los dientes', 'Historia clínica', 'Higiene bucal', ARRAY['cepillado dental'], 'Una, dos, tres veces al día', 'antecedentesPersonalesNoPatologicos'),
('Técnica de cepillado', 'Método empleado para el cepillado dental', 'Historia clínica', 'Higiene bucal', ARRAY['forma de cepillarse'], 'Horizontal, vertical, circular, Bass', 'antecedentesPersonalesNoPatologicos'),
('Auxiliares bucales', 'Elementos adicionales para higiene oral', 'Historia clínica', 'Higiene bucal', ARRAY['complementos de higiene'], 'Hilo dental, enjuague, palillos', 'antecedentesPersonalesNoPatologicos'),
('Última visita al odontólogo', 'Tiempo transcurrido desde la consulta dental previa', 'Historia clínica', 'Antecedentes odontológicos', ARRAY['última consulta dental'], 'Hace 6 meses, 1 año, más de 2 años', 'antecedentesPersonalesNoPatologicos'),

-- Términos de Alimentación
('Alimentos consumidos', 'Tipos de alimentos en la dieta habitual', 'Historia clínica', 'Hábitos alimentarios', ARRAY['dieta habitual'], 'Frutas, verduras, carnes, lácteos', 'antecedentesPersonalesNoPatologicos'),
('Frecuencia de frutas y verduras', 'Consumo diario de productos vegetales', 'Historia clínica', 'Hábitos alimentarios', ARRAY['consumo de vegetales'], 'Diario, 3 veces por semana, ocasional', 'antecedentesPersonalesNoPatologicos'),
('Bebidas azucaradas', 'Frecuencia de consumo de bebidas con azúcar', 'Historia clínica', 'Hábitos alimentarios', ARRAY['refrescos', 'sodas'], 'Diario, semanal, ocasional', 'antecedentesPersonalesNoPatologicos'),
('Comida chatarra', 'Frecuencia de consumo de alimentos procesados', 'Historia clínica', 'Hábitos alimentarios', ARRAY['comida rápida'], 'Hamburguesas, papitas, dulces', 'antecedentesPersonalesNoPatologicos'),
('Consumo de agua', 'Cantidad de agua ingerida diariamente', 'Historia clínica', 'Hábitos alimentarios', ARRAY['ingesta hídrica'], 'Litros de agua al día', 'antecedentesPersonalesNoPatologicos'),
('Número de comidas', 'Cantidad de tiempos de comida al día', 'Historia clínica', 'Hábitos alimentarios', ARRAY['tiempos de comida'], 'Tres, cuatro, cinco comidas', 'antecedentesPersonalesNoPatologicos'),
('Horario de comidas', 'Hora específica de cada tiempo de comida', 'Historia clínica', 'Hábitos alimentarios', ARRAY['horarios alimentarios'], 'Desayuno, almuerzo, cena', 'antecedentesPersonalesNoPatologicos'),
('Ayuno prolongado', 'Periodos largos sin ingerir alimentos', 'Historia clínica', 'Hábitos alimentarios', ARRAY['saltarse comidas'], 'Más de 12 horas sin comer', 'antecedentesPersonalesNoPatologicos'),

-- Términos de Antecedentes Patológicos por Sistemas
('Sin patología', 'Ausencia de enfermedades previas', 'Historia clínica', 'Antecedentes patológicos', ARRAY['sano'], 'Paciente sin enfermedades conocidas', 'antecedentesPersonalesPatologicos'),
('Anorexia', 'Trastorno alimentario con restricción calórica severa', 'Historia clínica', 'Trastornos nutricionales', ARRAY['anorexia nerviosa'], 'Pérdida excesiva de peso por restricción', 'antecedentesPersonalesPatologicos'),
('Bulimia', 'Trastorno alimentario con episodios de atracón y purga', 'Historia clínica', 'Trastornos nutricionales', ARRAY['bulimia nerviosa'], 'Ciclos de atracón y vómito', 'antecedentesPersonalesPatologicos'),
('Sobrepeso', 'Peso corporal por encima del ideal', 'Historia clínica', 'Trastornos nutricionales', ARRAY['exceso de peso'], 'IMC entre 25-29.9', 'antecedentesPersonalesPatologicos'),
('Obesidad', 'Acumulación excesiva de grasa corporal', 'Historia clínica', 'Trastornos nutricionales', ARRAY['obesidad mórbida'], 'IMC mayor a 30', 'antecedentesPersonalesPatologicos'),
('Enfermedad coronaria', 'Afectación de arterias del corazón', 'Historia clínica', 'Patología cardíaca', ARRAY['cardiopatía isquémica'], 'Obstrucción de arterias coronarias', 'antecedentesPersonalesPatologicos'),
('Arritmias', 'Alteraciones del ritmo cardíaco', 'Historia clínica', 'Patología cardíaca', ARRAY['trastornos del ritmo'], 'Taquicardia, bradicardia, fibrilación', 'antecedentesPersonalesPatologicos'),
('Defectos cardíacos congénitos', 'Malformaciones cardíacas de nacimiento', 'Historia clínica', 'Patología cardíaca', ARRAY['cardiopatías congénitas'], 'Comunicación interventricular, tetralogía', 'antecedentesPersonalesPatologicos');
