
-- First, let's add all the dental terms from the current form to the dental_terms table

-- Términos de Examen Intrabucal
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES
('Mucosa yugal', 'Membrana mucosa que recubre la superficie interna de las mejillas', 'Anatomía oral', 'Tejidos blandos', ARRAY['mucosa bucal', 'mucosa de las mejillas'], 'Examen clínico intraoral para evaluar estado de tejidos blandos', 'examenIntrabucal'),
('Eritematosa', 'Caracterizada por enrojecimiento debido a dilatación vascular', 'Patología', 'Alteraciones mucosas', ARRAY['enrojecida', 'inflamada'], 'Descripción de mucosas con signos de inflamación', 'examenIntrabucal'),
('Ulcerada', 'Que presenta úlceras o pérdida de continuidad del epitelio', 'Patología', 'Lesiones mucosas', ARRAY['con úlceras', 'erosionada'], 'Descripción de mucosas con solución de continuidad', 'examenIntrabucal'),
('Hiperqueratósica', 'Con exceso de queratina, aspecto blanquecino y engrosado', 'Patología', 'Alteraciones epiteliales', ARRAY['queratósica', 'leucoplásica'], 'Mucosa con alteración del proceso de queratinización', 'examenIntrabucal'),
('Paladar duro', 'Porción anterior del paladar formada por hueso maxilar y palatino', 'Anatomía oral', 'Estructuras óseas', ARRAY['paladar óseo'], 'Examen de la bóveda palatina y sus características', 'examenIntrabucal'),
('Torus palatino', 'Crecimiento óseo benigno en la línea media del paladar duro', 'Anatomía', 'Variaciones normales', ARRAY['exostosis palatina'], 'Hallazgo anatómico normal en algunos pacientes', 'examenIntrabucal'),
('Paladar blando', 'Porción posterior móvil del paladar formada por tejido muscular', 'Anatomía oral', 'Tejidos blandos', ARRAY['velo del paladar'], 'Evaluación de movilidad y características del paladar blando', 'examenIntrabucal'),
('Petequias', 'Pequeñas hemorragias puntiformes en mucosas', 'Patología', 'Alteraciones vasculares', ARRAY['hemorragias petequiales'], 'Signos de alteraciones hemostáticas o traumáticas', 'examenIntrabucal'),
('Lengua saburral', 'Lengua con saburra o capa blanquecina en el dorso', 'Patología', 'Alteraciones linguales', ARRAY['lengua con saburra'], 'Acumulación de detritus y bacterias en dorso lingual', 'examenIntrabucal'),
('Lengua geográfica', 'Glositis migratoria benigna con parches irregulares', 'Patología', 'Alteraciones linguales', ARRAY['glositis migratoria'], 'Condición benigna con áreas de descamación', 'examenIntrabucal'),
('Lengua fisurada', 'Lengua con surcos o fisuras en su superficie', 'Anatomía', 'Variaciones normales', ARRAY['lengua escrotal'], 'Variación anatómica normal en algunos individuos', 'examenIntrabucal'),
('Lengua vellosa', 'Hipertrofia de papilas filiformes con aspecto piloso', 'Patología', 'Alteraciones linguales', ARRAY['lengua pilosa'], 'Hipertrofia papilar por diversos factores', 'examenIntrabucal'),
('Piso de boca', 'Región inferior de la cavidad oral bajo la lengua', 'Anatomía oral', 'Regiones anatómicas', ARRAY['suelo de boca'], 'Área importante para detección de patologías', 'examenIntrabucal'),
('Indurado', 'Endurecido, con consistencia firme a la palpación', 'Semiología', 'Características palpatorias', ARRAY['endurecido', 'firme'], 'Hallazgo palpatorio que sugiere patología', 'examenIntrabucal'),
('Gingivitis', 'Inflamación de las encías sin pérdida de inserción', 'Patología periodontal', 'Enfermedades gingivales', ARRAY['inflamación gingival'], 'Enfermedad periodontal inicial reversible', 'examenIntrabucal'),
('Periodontitis', 'Enfermedad periodontal con pérdida de inserción y hueso', 'Patología periodontal', 'Enfermedades periodontales', ARRAY['piorrea'], 'Enfermedad periodontal destructiva irreversible', 'examenIntrabucal'),
('Hiperplasia gingival', 'Crecimiento excesivo del tejido gingival', 'Patología periodontal', 'Alteraciones gingivales', ARRAY['hiperplasia de encías'], 'Aumento de volumen gingival por diversos factores', 'examenIntrabucal'),
('Recesión gingival', 'Migración apical del margen gingival', 'Patología periodontal', 'Alteraciones gingivales', ARRAY['retracción gingival'], 'Exposición radicular por pérdida de encía', 'examenIntrabucal'),

-- Términos de Examen de Cabeza
('Mesocefálico', 'Tipo de cráneo con proporciones normales', 'Antropología dental', 'Tipos craneales', ARRAY['normocefálico'], 'Clasificación morfológica del cráneo', 'examenCabeza'),
('Dolicocéfalo', 'Tipo de cráneo alargado en sentido anteroposterior', 'Antropología dental', 'Tipos craneales', ARRAY['cráneo alargado'], 'Clasificación morfológica del cráneo', 'examenCabeza'),
('Braquicéfalo', 'Tipo de cráneo ancho y corto', 'Antropología dental', 'Tipos craneales', ARRAY['cráneo ancho'], 'Clasificación morfológica del cráneo', 'examenCabeza'),
('Perfil cóncavo', 'Perfil facial con tercio medio hundido', 'Cefalometría', 'Tipos de perfil', ARRAY['perfil clase III'], 'Característica facial asociada a maloclusión', 'examenCabeza'),
('Perfil convexo', 'Perfil facial con protrusión del tercio medio', 'Cefalometría', 'Tipos de perfil', ARRAY['perfil clase II'], 'Característica facial asociada a maloclusión', 'examenCabeza'),
('Perfil recto', 'Perfil facial armonioso y equilibrado', 'Cefalometría', 'Tipos de perfil', ARRAY['perfil clase I'], 'Característica facial ideal', 'examenCabeza'),
('Asimetría facial', 'Falta de simetría entre los lados de la cara', 'Patología', 'Alteraciones morfológicas', ARRAY['asimetría'], 'Desproporción facial que puede indicar patología', 'examenCabeza'),
('Edema facial', 'Acumulación de líquido en tejidos faciales', 'Patología', 'Alteraciones inflamatorias', ARRAY['hinchazón facial'], 'Signo de inflamación o alteración sistémica', 'examenCabeza'),

-- Términos de Articulación Craneomandibular
('Ruido articular', 'Sonidos anormales en la articulación temporomandibular', 'Patología ATM', 'Disfunción temporomandibular', ARRAY['chasquido', 'crepitación'], 'Signo de disfunción de la ATM', 'articulacionCraneomandibular'),
('Patrón de apertura', 'Trayectoria que sigue la mandíbula al abrir la boca', 'Función ATM', 'Cinemática mandibular', ARRAY['movimiento de apertura'], 'Evaluación de la función articular', 'articulacionCraneomandibular'),
('Desviación mandibular', 'Movimiento lateral anormal de la mandíbula', 'Patología ATM', 'Disfunción temporomandibular', ARRAY['lateralización'], 'Signo de disfunción articular o muscular', 'articulacionCraneomandibular'),
('Trismo', 'Limitación de la apertura bucal', 'Patología ATM', 'Disfunción temporomandibular', ARRAY['limitación de apertura'], 'Restricción del movimiento mandibular', 'articulacionCraneomandibular'),

-- Términos de Dolor y Padecimiento Actual
('Dolor localizado', 'Dolor circunscrito a una zona específica', 'Semiología', 'Características del dolor', ARRAY['dolor focal'], 'Tipo de dolor con ubicación precisa', 'padecimientoActual'),
('Dolor irradiado', 'Dolor que se extiende desde su origen hacia otras áreas', 'Semiología', 'Características del dolor', ARRAY['dolor referido'], 'Dolor que se propaga por vías nerviosas', 'padecimientoActual'),
('Dolor provocado', 'Dolor que aparece ante estímulos específicos', 'Semiología', 'Características del dolor', ARRAY['dolor estimulado'], 'Dolor desencadenado por factores externos', 'padecimientoActual'),
('Dolor espontáneo', 'Dolor que aparece sin estímulo aparente', 'Semiología', 'Características del dolor', ARRAY['dolor idiopático'], 'Dolor sin causa desencadenante evidente', 'padecimientoActual'),
('Dolor punzante', 'Dolor agudo y penetrante', 'Semiología', 'Características del dolor', ARRAY['dolor lancinante'], 'Tipo de dolor neuropático característico', 'padecimientoActual'),
('Dolor pulsátil', 'Dolor que late siguiendo el ritmo cardíaco', 'Semiología', 'Características del dolor', ARRAY['dolor latiente'], 'Dolor vascular o inflamatorio', 'padecimientoActual'),
('Dolor sordo', 'Dolor profundo y constante de baja intensidad', 'Semiología', 'Características del dolor', ARRAY['dolor mate'], 'Dolor de origen profundo o visceral', 'padecimientoActual'),
('Dolor ardoroso', 'Dolor con sensación de quemadura', 'Semiología', 'Características del dolor', ARRAY['dolor urente'], 'Dolor neuropático característico', 'padecimientoActual'),

-- Términos de Antecedentes Médicos
('Anorexia', 'Trastorno alimentario con restricción de ingesta', 'Patología sistémica', 'Trastornos alimentarios', ARRAY['anorexia nerviosa'], 'Enfermedad con repercusiones orales', 'antecedentesPersonalesPatologicos'),
('Bulimia', 'Trastorno alimentario con episodios de atracón y purga', 'Patología sistémica', 'Trastornos alimentarios', ARRAY['bulimia nerviosa'], 'Enfermedad que causa erosión dental', 'antecedentesPersonalesPatologicos'),
('Enfermedad coronaria', 'Patología de las arterias coronarias', 'Patología sistémica', 'Enfermedades cardíacas', ARRAY['cardiopatía isquémica'], 'Antecedente relevante para procedimientos dentales', 'antecedentesPersonalesPatologicos'),
('Arritmias', 'Alteraciones del ritmo cardíaco', 'Patología sistémica', 'Enfermedades cardíacas', ARRAY['disritmias'], 'Condición que afecta el manejo odontológico', 'antecedentesPersonalesPatologicos'),
('Hepatitis', 'Inflamación del hígado', 'Patología sistémica', 'Enfermedades hepáticas', ARRAY['hepatitis viral'], 'Enfermedad infecciosa de importancia odontológica', 'antecedentesPersonalesPatologicos'),
('Cirrosis', 'Enfermedad hepática crónica con fibrosis', 'Patología sistémica', 'Enfermedades hepáticas', ARRAY['cirrosis hepática'], 'Enfermedad que afecta la hemostasia', 'antecedentesPersonalesPatologicos'),
('EPOC', 'Enfermedad pulmonar obstructiva crónica', 'Patología sistémica', 'Enfermedades respiratorias', ARRAY['enfermedad pulmonar obstructiva crónica'], 'Enfermedad que limita la capacidad respiratoria', 'antecedentesPersonalesPatologicos'),
('Tuberculosis', 'Enfermedad infecciosa causada por Mycobacterium', 'Patología sistémica', 'Enfermedades infecciosas', ARRAY['TBC'], 'Enfermedad transmisible de importancia odontológica', 'antecedentesPersonalesPatologicos'),

-- Términos de Interrogatorio por Sistemas
('Halitosis', 'Mal aliento persistente', 'Patología oral', 'Alteraciones del aliento', ARRAY['mal aliento'], 'Síntoma frecuente en patología oral', 'interrogatorioSistemas'),
('Disgeusia', 'Alteración del sentido del gusto', 'Patología oral', 'Alteraciones sensoriales', ARRAY['disgeusia'], 'Alteración gustativa por diversas causas', 'interrogatorioSistemas'),
('Hipogeusia', 'Disminución del sentido del gusto', 'Patología oral', 'Alteraciones sensoriales', ARRAY['hipogeusia'], 'Reducción de la capacidad gustativa', 'interrogatorioSistemas'),
('Xerostomía', 'Sensación de sequedad bucal', 'Patología oral', 'Alteraciones salivales', ARRAY['boca seca'], 'Síntoma de disfunción de glándulas salivales', 'interrogatorioSistemas'),
('Sialorrea', 'Exceso de saliva', 'Patología oral', 'Alteraciones salivales', ARRAY['hipersalivación'], 'Aumento anormal de la producción salival', 'interrogatorioSistemas'),
('Apnea del sueño', 'Interrupción de la respiración durante el sueño', 'Patología sistémica', 'Trastornos respiratorios', ARRAY['SAHS'], 'Trastorno con implicaciones odontológicas', 'interrogatorioSistemas'),
('Disnea', 'Dificultad respiratoria', 'Patología sistémica', 'Síntomas respiratorios', ARRAY['dificultad para respirar'], 'Síntoma de compromiso respiratorio', 'interrogatorioSistemas'),
('Epistaxis', 'Sangrado nasal', 'Patología sistémica', 'Alteraciones hemostáticas', ARRAY['hemorragia nasal'], 'Signo de alteración de la coagulación', 'interrogatorioSistemas'),
('Lipotimia', 'Desvanecimiento o desmayo', 'Patología sistémica', 'Síntomas cardiovasculares', ARRAY['síncope'], 'Síntoma de hipotensión o arritmia', 'interrogatorioSistemas'),
('Parestesias', 'Sensación anormal de hormigueo', 'Patología neurológica', 'Alteraciones sensoriales', ARRAY['hormigueo'], 'Síntoma de alteración nerviosa', 'interrogatorioSistemas'),
('Artralgia', 'Dolor articular', 'Patología musculoesquelética', 'Síntomas articulares', ARRAY['dolor de articulaciones'], 'Dolor en articulaciones sin inflamación', 'interrogatorioSistemas'),
('Mialgia', 'Dolor muscular', 'Patología musculoesquelética', 'Síntomas musculares', ARRAY['dolor muscular'], 'Dolor en músculos por diversas causas', 'interrogatorioSistemas'),

-- Términos de Oclusión y Relación de Dientes
('Clase I de Angle', 'Relación molar normal', 'Ortodoncia', 'Clasificación oclusal', ARRAY['normoclusión'], 'Relación oclusal ideal según Angle', 'oclusion'),
('Clase II de Angle', 'Relación molar con protrusión maxilar', 'Ortodoncia', 'Clasificación oclusal', ARRAY['distoclusión'], 'Maloclusión con retrusión mandibular', 'oclusion'),
('Clase III de Angle', 'Relación molar con protrusión mandibular', 'Ortodoncia', 'Clasificación oclusal', ARRAY['mesioclusión'], 'Maloclusión con prognatismo mandibular', 'oclusion'),
('Sobremordida', 'Traslape vertical excesivo de incisivos', 'Ortodoncia', 'Alteraciones oclusales', ARRAY['overbite'], 'Superposición vertical anormal', 'relacionDientes'),
('Resalte', 'Proyección horizontal de incisivos superiores', 'Ortodoncia', 'Alteraciones oclusales', ARRAY['overjet'], 'Distancia horizontal entre incisivos', 'relacionDientes'),
('Mordida cruzada', 'Relación oclusal invertida', 'Ortodoncia', 'Alteraciones oclusales', ARRAY['crossbite'], 'Malposición dental con inversión oclusal', 'relacionDientes'),
('Mordida abierta', 'Falta de contacto entre dientes anteriores', 'Ortodoncia', 'Alteraciones oclusales', ARRAY['open bite'], 'Ausencia de contacto incisal', 'relacionDientes'),
('Apiñamiento', 'Falta de espacio para alineación dental', 'Ortodoncia', 'Alteraciones de posición', ARRAY['crowding'], 'Malposición por discrepancia alveolodentaria', 'relacionDientes'),
('Diastema', 'Espacio entre dientes', 'Ortodoncia', 'Alteraciones de posición', ARRAY['separación dental'], 'Espacio interdental anormal', 'relacionDientes'),

-- Términos de Glándulas Salivales
('Glándula parótida', 'Glándula salival mayor lateral', 'Anatomía', 'Glándulas salivales', ARRAY['parótida'], 'Mayor glándula salival productora de saliva serosa', 'glandulasSalivales'),
('Glándula submandibular', 'Glándula salival mayor en piso de boca', 'Anatomía', 'Glándulas salivales', ARRAY['submaxilar'], 'Glándula salival mixta en región sublingual', 'glandulasSalivales'),
('Glándula sublingual', 'Glándula salival menor en piso de boca', 'Anatomía', 'Glándulas salivales', ARRAY['sublingual'], 'Glándula salival mucosa bajo la lengua', 'glandulasSalivales'),
('Sialolitiasis', 'Formación de cálculos en conductos salivales', 'Patología', 'Enfermedades salivales', ARRAY['cálculos salivales'], 'Obstrucción por cálculos en glándulas salivales', 'glandulasSalivales'),
('Sialadenitis', 'Inflamación de glándulas salivales', 'Patología', 'Enfermedades salivales', ARRAY['inflamación glandular'], 'Proceso inflamatorio de glándulas salivales', 'glandulasSalivales'),

-- Términos de Línea Media y Frenillos
('Línea media dental', 'Línea imaginaria entre incisivos centrales', 'Ortodoncia', 'Referencias anatómicas', ARRAY['línea media'], 'Referencia para evaluación estética', 'lineaMedia'),
('Desviación de línea media', 'Alteración de la línea media dental', 'Ortodoncia', 'Alteraciones estéticas', ARRAY['asimetría dental'], 'Discrepancia entre líneas medias', 'lineaMedia'),
('Frenillo labial superior', 'Pliegue mucoso entre labio y encía superior', 'Anatomía oral', 'Frenillos', ARRAY['frenillo maxilar'], 'Estructura anatómica normal del labio superior', 'frenillos'),
('Frenillo labial inferior', 'Pliegue mucoso entre labio y encía inferior', 'Anatomía oral', 'Frenillos', ARRAY['frenillo mandibular'], 'Estructura anatómica normal del labio inferior', 'frenillos'),
('Frenillo lingual', 'Pliegue mucoso que une lengua con piso de boca', 'Anatomía oral', 'Frenillos', ARRAY['frenillo de la lengua'], 'Estructura que limita movimientos linguales', 'frenillos'),
('Anquiloglosia', 'Frenillo lingual corto que limita movimiento', 'Patología', 'Alteraciones anatómicas', ARRAY['lengua atada'], 'Alteración congénita del frenillo lingual', 'frenillos');
