
-- Continuar agregando términos específicos de las siguientes secciones de la aplicación
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- Términos de Signos Vitales y Somatometría
('Presión arterial sistólica', 'Presión máxima durante la contracción cardíaca', 'Signos vitales', 'Presión arterial', ARRAY['PAS', 'sistólica'], 'Valor superior de la presión arterial', 'exploracionFisica'),
('Presión arterial diastólica', 'Presión mínima durante la relajación cardíaca', 'Signos vitales', 'Presión arterial', ARRAY['PAD', 'diastólica'], 'Valor inferior de la presión arterial', 'exploracionFisica'),
('Frecuencia cardíaca', 'Número de latidos cardíacos por minuto', 'Signos vitales', 'Pulso', ARRAY['FC', 'pulso'], 'Entre 60-100 latidos por minuto', 'exploracionFisica'),
('Frecuencia respiratoria', 'Número de respiraciones por minuto', 'Signos vitales', 'Respiración', ARRAY['FR', 'respiraciones'], 'Entre 12-20 respiraciones por minuto', 'exploracionFisica'),
('Temperatura corporal', 'Medición del calor corporal', 'Signos vitales', 'Temperatura', ARRAY['temp', 'fiebre'], 'Normal 36.5-37.5°C', 'exploracionFisica'),
('Saturación de oxígeno', 'Porcentaje de oxígeno en sangre', 'Signos vitales', 'Oxigenación', ARRAY['SpO2', 'saturación'], 'Normal mayor a 95%', 'exploracionFisica'),
('Peso corporal', 'Masa corporal del paciente en kilogramos', 'Somatometría', 'Antropometría', ARRAY['peso', 'masa corporal'], 'Medición en kilogramos', 'exploracionFisica'),
('Talla', 'Altura del paciente en centímetros', 'Somatometría', 'Antropometría', ARRAY['estatura', 'altura'], 'Medición en centímetros', 'exploracionFisica'),
('Índice de masa corporal', 'Relación entre peso y talla al cuadrado', 'Somatometría', 'Índices', ARRAY['IMC', 'BMI'], 'Peso/talla²', 'exploracionFisica'),

-- Términos de Exploración de Cabeza y Cuello
('Cabeza normocéfala', 'Cabeza de forma y tamaño normal', 'Exploración física', 'Cabeza', ARRAY['normocefalica'], 'Cabeza sin alteraciones morfológicas', 'exploracionFisica'),
('Cabeza mesocéfala', 'Cabeza de proporciones intermedias', 'Exploración física', 'Cabeza', ARRAY['mesocefálica'], 'Índice cefálico entre 76-80', 'exploracionFisica'),
('Cabeza dolicocéfala', 'Cabeza alargada anteroposterior', 'Exploración física', 'Cabeza', ARRAY['dolicocefálica'], 'Índice cefálico menor a 76', 'exploracionFisica'),
('Cabeza braquicéfala', 'Cabeza ancha y corta', 'Exploración física', 'Cabeza', ARRAY['braquicefálica'], 'Índice cefálico mayor a 80', 'exploracionFisica'),
('Implantación del cabello', 'Línea de inicio del crecimiento capilar', 'Exploración física', 'Cabeza', ARRAY['línea capilar'], 'Normal, alta o baja', 'exploracionFisica'),
('Fontanelas', 'Espacios membranosos del cráneo infantil', 'Exploración física', 'Cabeza', ARRAY['molleras'], 'Anterior y posterior en bebés', 'exploracionFisica'),
('Cicatrices cefálicas', 'Marcas de heridas previas en cabeza', 'Exploración física', 'Cabeza', ARRAY['marcas quirúrgicas'], 'Evidencia de traumatismos previos', 'exploracionFisica'),
('Cuello cilíndrico', 'Cuello de forma normal y simétrica', 'Exploración física', 'Cuello', ARRAY['cuello normal'], 'Sin alteraciones morfológicas', 'exploracionFisica'),
('Pulsos carotídeos', 'Pulsaciones de arterias del cuello', 'Exploración física', 'Cuello', ARRAY['pulso carotídeo'], 'Palpables y simétricos', 'exploracionFisica'),
('Adenopatías cervicales', 'Aumento de ganglios linfáticos del cuello', 'Exploración física', 'Cuello', ARRAY['ganglios inflamados'], 'Ganglios palpables aumentados', 'exploracionFisica'),
('Tiroides palpable', 'Glándula tiroides que se puede palpar', 'Exploración física', 'Cuello', ARRAY['bocio'], 'Aumento del tamaño tiroideo', 'exploracionFisica'),
('Movilidad cervical', 'Capacidad de movimiento del cuello', 'Exploración física', 'Cuello', ARRAY['flexión cervical'], 'Flexión, extensión, rotación', 'exploracionFisica'),

-- Términos de Glándulas Salivales
('Glándulas parótidas', 'Glándulas salivales mayores laterales', 'Exploración física', 'Glándulas salivales', ARRAY['parótida'], 'Ubicadas delante del oído', 'glandulasSalivales'),
('Glándulas submandibulares', 'Glándulas salivales bajo la mandíbula', 'Exploración física', 'Glándulas salivales', ARRAY['submaxilares'], 'Ubicadas en piso de boca', 'glandulasSalivales'),
('Glándulas sublinguales', 'Glándulas salivales menores bajo la lengua', 'Exploración física', 'Glándulas salivales', ARRAY['sublingual'], 'Ubicadas bajo la lengua', 'glandulasSalivales'),
('Conducto de Stenon', 'Conducto excretor de glándula parótida', 'Anatomía', 'Conductos salivales', ARRAY['conducto parotídeo'], 'Desemboca en mejilla', 'glandulasSalivales'),
('Conducto de Wharton', 'Conducto excretor de glándula submandibular', 'Anatomía', 'Conductos salivales', ARRAY['conducto submandibular'], 'Desemboca en carúncula', 'glandulasSalivales'),
('Carúncula sublingual', 'Pequeña elevación donde desemboca Wharton', 'Anatomía', 'Piso de boca', ARRAY['papila sublingual'], 'Estructura en piso de boca', 'glandulasSalivales'),
('Sialorrea', 'Producción excesiva de saliva', 'Patología', 'Glándulas salivales', ARRAY['hipersalivación'], 'Exceso de producción salival', 'glandulasSalivales'),
('Xerostomía', 'Disminución de la producción salival', 'Patología', 'Glándulas salivales', ARRAY['boca seca'], 'Sequedad bucal', 'glandulasSalivales'),
('Sialolitiasis', 'Presencia de cálculos en conductos salivales', 'Patología', 'Glándulas salivales', ARRAY['piedras salivales'], 'Obstrucción por cálculos', 'glandulasSalivales'),
('Sialoadenitis', 'Inflamación de glándulas salivales', 'Patología', 'Glándulas salivales', ARRAY['inflamación glandular'], 'Inflamación aguda o crónica', 'glandulasSalivales'),

-- Términos de Articulación Temporomandibular
('Articulación temporomandibular', 'Articulación entre temporal y mandíbula', 'Anatomía', 'ATM', ARRAY['ATM'], 'Articulación que permite masticación', 'articulacionCraneomandibular'),
('Disco articular', 'Fibrocartílago entre cóndilo y fosa', 'Anatomía', 'ATM', ARRAY['menisco articular'], 'Estructura amortiguadora de ATM', 'articulacionCraneomandibular'),
('Cóndilo mandibular', 'Proceso articular de la mandíbula', 'Anatomía', 'ATM', ARRAY['cabeza condilar'], 'Parte móvil de la ATM', 'articulacionCraneomandibular'),
('Fosa glenoidea', 'Cavidad temporal donde articula cóndilo', 'Anatomía', 'ATM', ARRAY['cavidad glenoidea'], 'Parte fija de la ATM', 'articulacionCraneomandibular'),
('Apertura bucal', 'Capacidad de abrir la boca', 'Función', 'ATM', ARRAY['abertura oral'], 'Normal 40-45mm entre incisivos', 'articulacionCraneomandibular'),
('Lateralidad mandibular', 'Movimiento lateral de la mandíbula', 'Función', 'ATM', ARRAY['excursión lateral'], 'Movimiento hacia los lados', 'articulacionCraneomandibular'),
('Protrusión mandibular', 'Movimiento hacia adelante de mandíbula', 'Función', 'ATM', ARRAY['propulsión'], 'Proyección anterior de mandíbula', 'articulacionCraneomandibular'),
('Retrusión mandibular', 'Movimiento hacia atrás de mandíbula', 'Función', 'ATM', ARRAY['retropulsión'], 'Movimiento posterior de mandíbula', 'articulacionCraneomandibular'),
('Clic articular', 'Ruido durante movimientos mandibulares', 'Patología', 'ATM', ARRAY['click', 'chasquido'], 'Sonido al abrir o cerrar boca', 'articulacionCraneomandibular'),
('Crepitación', 'Ruido áspero durante movimientos de ATM', 'Patología', 'ATM', ARRAY['crujido articular'], 'Sonido como papel arrugado', 'articulacionCraneomandibular'),
('Limitación de apertura', 'Restricción en la abertura bucal', 'Patología', 'ATM', ARRAY['trismus'], 'Apertura menor a 35mm', 'articulacionCraneomandibular'),
('Desviación mandibular', 'Movimiento irregular al abrir boca', 'Patología', 'ATM', ARRAY['deflexión'], 'Mandíbula se desvía al abrir', 'articulacionCraneomandibular'),
('Dolor articular', 'Molestia en región de ATM', 'Patología', 'ATM', ARRAY['artralgia'], 'Dolor en articulación', 'articulacionCraneomandibular'),
('Bloqueo articular', 'Imposibilidad de movimiento normal', 'Patología', 'ATM', ARRAY['luxación'], 'Atascamiento de la articulación', 'articulacionCraneomandibular'),

-- Términos de Oclusión
('Relación céntrica', 'Posición de referencia mandibular', 'Oclusión', 'Relaciones intermaxilares', ARRAY['RC'], 'Posición más retruída de cóndilos', 'oclusion'),
('Oclusión céntrica', 'Máxima intercuspidación dental', 'Oclusión', 'Relaciones oclusales', ARRAY['OC', 'máxima intercuspidación'], 'Mayor contacto entre dientes', 'oclusion'),
('Dimensión vertical', 'Altura facial inferior en oclusión', 'Oclusión', 'Dimensiones', ARRAY['DV', 'altura facial'], 'Distancia entre puntos faciales', 'oclusion'),
('Espacio libre', 'Distancia entre dientes en reposo', 'Oclusión', 'Dimensiones', ARRAY['freeway space'], 'Espacio de 2-4mm en reposo', 'oclusion'),
('Sobremordida horizontal', 'Distancia horizontal entre incisivos', 'Oclusión', 'Mediciones', ARRAY['overjet'], 'Proyección anterior de incisivos', 'oclusion'),
('Sobremordida vertical', 'Solapamiento vertical de incisivos', 'Oclusión', 'Mediciones', ARRAY['overbite'], 'Cubrimiento de incisivos inferiores', 'oclusion'),
('Clase I de Angle', 'Relación molar normal', 'Oclusión', 'Clasificaciones', ARRAY['normoclusión'], 'Cúspide mesiovestibular del primer molar superior ocluyendo en surco vestibular del primer molar inferior', 'oclusion'),
('Clase II de Angle', 'Relación molar distal', 'Oclusión', 'Clasificaciones', ARRAY['distoclusión'], 'Primer molar inferior por distal del superior', 'oclusion'),
('Clase III de Angle', 'Relación molar mesial', 'Oclusión', 'Clasificaciones', ARRAY['mesioclusión'], 'Primer molar inferior por mesial del superior', 'oclusion'),

-- Términos de Interrogatorio por Sistemas
('Aparato digestivo', 'Sistema encargado de digestión y absorción', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['sistema digestivo'], 'Boca, esófago, estómago, intestinos', 'interrogatorioSistemas'),
('Aparato respiratorio', 'Sistema encargado del intercambio gaseoso', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['sistema respiratorio'], 'Nariz, tráquea, bronquios, pulmones', 'interrogatorioSistemas'),
('Aparato cardiovascular', 'Sistema circulatorio del organismo', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['sistema cardiovascular'], 'Corazón, arterias, venas, capilares', 'interrogatorioSistemas'),
('Aparato genitourinario', 'Sistema reproductor y urinario', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['sistema genitourinario'], 'Riñones, vejiga, órganos reproductivos', 'interrogatorioSistemas'),
('Sistema nervioso', 'Sistema de control y coordinación corporal', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['aparato nervioso'], 'Cerebro, médula espinal, nervios', 'interrogatorioSistemas'),
('Sistema endocrino', 'Sistema de glándulas de secreción interna', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['aparato endocrino'], 'Tiroides, páncreas, suprarrenales', 'interrogatorioSistemas'),
('Sistema musculoesquelético', 'Sistema de movimiento y soporte', 'Interrogatorio por sistemas', 'Sistemas orgánicos', ARRAY['aparato locomotor'], 'Huesos, músculos, articulaciones', 'interrogatorioSistemas'),
('Dispepsia', 'Molestias digestivas altas', 'Interrogatorio por sistemas', 'Síntomas digestivos', ARRAY['indigestión'], 'Dolor epigástrico, llenura precoz', 'interrogatorioSistemas'),
('Pirosis', 'Sensación de ardor retroesternal', 'Interrogatorio por sistemas', 'Síntomas digestivos', ARRAY['acidez', 'agruras'], 'Sensación de quemadura en pecho', 'interrogatorioSistemas'),
('Disnea', 'Dificultad para respirar', 'Interrogatorio por sistemas', 'Síntomas respiratorios', ARRAY['falta de aire'], 'Sensación de ahogo', 'interrogatorioSistemas'),
('Palpitaciones', 'Percepción anormal de latidos cardíacos', 'Interrogatorio por sistemas', 'Síntomas cardiovasculares', ARRAY['taquicardia'], 'Sensación de latidos irregulares', 'interrogatorioSistemas'),
('Disuria', 'Dolor o molestia al orinar', 'Interrogatorio por sistemas', 'Síntomas genitourinarios', ARRAY['dolor al orinar'], 'Ardor o dolor miccional', 'interrogatorioSistemas'),
('Poliuria', 'Aumento en la cantidad de orina', 'Interrogatorio por sistemas', 'Síntomas genitourinarios', ARRAY['orina abundante'], 'Más de 2.5 litros de orina al día', 'interrogatorioSistemas'),
('Cefalea', 'Dolor de cabeza', 'Interrogatorio por sistemas', 'Síntomas neurológicos', ARRAY['dolor de cabeza'], 'Dolor craneal de cualquier tipo', 'interrogatorioSistemas'),
('Parestesias', 'Sensaciones anormales en piel', 'Interrogatorio por sistemas', 'Síntomas neurológicos', ARRAY['hormigueo'], 'Sensación de entumecimiento', 'interrogatorioSistemas');
