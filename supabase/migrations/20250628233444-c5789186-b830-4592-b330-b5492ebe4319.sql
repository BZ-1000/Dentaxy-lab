
-- Continuar agregando términos odontológicos especializados
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- Términos de Patología Oral Específica
('Liquen plano oral', 'Enfermedad mucocutánea crónica autoinmune', 'Patología oral', 'Enfermedades autoinmunes', ARRAY['liquen plano'], 'Lesiones reticulares blanquecinas en mucosa', 'examenIntrabucal'),
('Pénfigo vulgar', 'Enfermedad ampollosa autoinmune grave', 'Patología oral', 'Enfermedades ampollosas', ARRAY['pénfigo'], 'Ampollas intraepiteliales que se rompen fácilmente', 'examenIntrabucal'),
('Penfigoide cicatricial', 'Enfermedad ampollosa subepitelial', 'Patología oral', 'Enfermedades ampollosas', ARRAY['penfigoide mucoso'], 'Ampollas subepiteliales con cicatrización', 'examenIntrabucal'),
('Eritema migrans', 'Lesión con bordes migratorios', 'Patología oral', 'Alteraciones inflamatorias', ARRAY['glositis migratoria'], 'Lesión que cambia de localización', 'examenIntrabucal'),
('Hiperplasia fibrosa', 'Crecimiento reactivo de tejido fibroso', 'Patología oral', 'Lesiones reactivas', ARRAY['fibroma traumático'], 'Respuesta a irritación crónica', 'examenIntrabucal'),
('Papiloma escamoso', 'Tumor benigno de epitelio escamoso', 'Patología oral', 'Tumores benignos', ARRAY['verruga oral'], 'Crecimiento verrugoso por VPH', 'examenIntrabucal'),
('Leucoedema', 'Variación normal con aspecto opalescente', 'Anatomía oral', 'Variaciones normales', ARRAY['edema blanco'], 'Hallazgo normal en mucosa yugal', 'examenIntrabucal'),
('Línea alba', 'Línea blanquecina en mucosa yugal', 'Anatomía oral', 'Variaciones normales', ARRAY['línea oclusal'], 'Marca normal del plano oclusal', 'examenIntrabucal'),
('Várices linguales', 'Dilataciones venosas en lengua', 'Anatomía oral', 'Variaciones por edad', ARRAY['várices sublinguales'], 'Hallazgo normal en ancianos', 'examenIntrabucal'),

-- Términos de Endodoncia Avanzada
('Conducto radicular', 'Espacio interno de la raíz dental', 'Endodoncia', 'Anatomía endodóntica', ARRAY['canal radicular'], 'Contiene tejido pulpar y vasos', 'examenIntrabucal'),
('Ápice radicular', 'Extremo de la raíz dental', 'Endodoncia', 'Anatomía endodóntica', ARRAY['vértice radicular'], 'Zona crítica para éxito endodóntico', 'examenIntrabucal'),
('Foramen apical', 'Abertura en el ápice radicular', 'Endodoncia', 'Anatomía endodóntica', ARRAY['agujero apical'], 'Comunicación pulpo-periodontal', 'examenIntrabucal'),
('Instrumentación endodóntica', 'Preparación mecánica del conducto', 'Endodoncia', 'Procedimientos', ARRAY['preparación biomecánica'], 'Limpieza y conformación radicular', 'diagnostico'),
('Obturación endodóntica', 'Sellado hermético del conducto', 'Endodoncia', 'Procedimientos', ARRAY['relleno radicular'], 'Cierre tridimensional del sistema', 'diagnostico'),
('Gutapercha', 'Material de obturación endodóntica', 'Endodoncia', 'Materiales', ARRAY['gutapercha'], 'Material estándar para obturación', 'examenIntrabucal'),
('Reendodoncia', 'Retratamiento de conducto fallido', 'Endodoncia', 'Procedimientos', ARRAY['retratamiento endodóntico'], 'Segunda oportunidad terapéutica', 'diagnostico'),
('Apicectomía', 'Resección quirúrgica del ápice', 'Endodoncia', 'Cirugía endodóntica', ARRAY['cirugía periapical'], 'Tratamiento quirúrgico del ápice', 'diagnostico'),

-- Términos de Implantología
('Osteointegración', 'Unión directa hueso-implante', 'Implantología', 'Biología de implantes', ARRAY['integración ósea'], 'Proceso de cicatrización del implante', 'examenIntrabucal'),
('Implante endoóseo', 'Implante colocado dentro del hueso', 'Implantología', 'Tipos de implantes', ARRAY['implante intraóseo'], 'Tipo más común de implante dental', 'examenIntrabucal'),
('Abutment', 'Pilar de conexión implante-corona', 'Implantología', 'Componentes protésicos', ARRAY['pilar protésico'], 'Conexión entre implante y prótesis', 'examenIntrabucal'),
('Injerto óseo', 'Aumento de volumen óseo', 'Implantología', 'Técnicas regenerativas', ARRAY['regeneración ósea'], 'Preparación del sitio implantario', 'diagnostico'),
('Elevación sinusal', 'Aumento óseo en seno maxilar', 'Implantología', 'Técnicas avanzadas', ARRAY['sinus lift'], 'Técnica para implantes posteriores superiores', 'diagnostico'),
('Carga inmediata', 'Colocación de prótesis al momento del implante', 'Implantología', 'Protocolos de carga', ARRAY['carga precoz'], 'Función inmediata del implante', 'diagnostico'),
('Periimplantitis', 'Inflamación destructiva alrededor del implante', 'Implantología', 'Complicaciones', ARRAY['infección del implante'], 'Enfermedad que amenaza el implante', 'examenIntrabucal'),

-- Términos de Ortodoncia Detallada
('Brackets', 'Dispositivos adheridos a dientes', 'Ortodoncia', 'Aparatología fija', ARRAY['brackets ortodóncicos'], 'Elementos básicos de aparatología fija', 'examenIntrabucal'),
('Arco ortodóncico', 'Alambre que conecta brackets', 'Ortodoncia', 'Aparatología fija', ARRAY['alambre ortodóncico'], 'Genera fuerzas para movimiento dental', 'examenIntrabucal'),
('Elásticos ortodóncicos', 'Gomas para aplicar fuerzas', 'Ortodoncia', 'Aparatología fija', ARRAY['ligas ortodóncicas'], 'Generan fuerzas intermaxilares', 'examenIntrabucal'),
('Retención ortodóncica', 'Mantenimiento de posición dental post-tratamiento', 'Ortodoncia', 'Fases del tratamiento', ARRAY['contención'], 'Prevención de recidiva', 'examenIntrabucal'),
('Retenedor fijo', 'Alambre cementado permanentemente', 'Ortodoncia', 'Tipos de retención', ARRAY['barra lingual'], 'Retención permanente de dientes anteriores', 'examenIntrabucal'),
('Retenedor removible', 'Aparato removible de retención', 'Ortodoncia', 'Tipos de retención', ARRAY['placa de retención'], 'Retención removible post-tratamiento', 'examenIntrabucal'),
('Distalización', 'Movimiento dental hacia distal', 'Ortodoncia', 'Movimientos dentales', ARRAY['movimiento distal'], 'Retroceso de dientes posteriores', 'relacionDientes'),
('Mesialización', 'Movimiento dental hacia mesial', 'Ortodoncia', 'Movimientos dentales', ARRAY['movimiento mesial'], 'Avance de dientes posteriores', 'relacionDientes'),

-- Términos de Periodoncia Quirúrgica
('Colgajo de Widman', 'Técnica quirúrgica periodontal', 'Periodoncia', 'Técnicas quirúrgicas', ARRAY['colgajo modificado'], 'Acceso quirúrgico conservador', 'diagnostico'),
('Gingivectomía', 'Escisión quirúrgica de encía', 'Periodoncia', 'Cirugía gingival', ARRAY['resección gingival'], 'Eliminación de tejido gingival', 'diagnostico'),
('Gingivoplastia', 'Remodelado estético de encía', 'Periodoncia', 'Cirugía estética', ARRAY['contorneado gingival'], 'Mejora del contorno gingival', 'diagnostico'),
('Alargamiento coronario', 'Exposición de mayor estructura dental', 'Periodoncia', 'Cirugía pre-protésica', ARRAY['alargamiento de corona'], 'Preparación para restauraciones', 'diagnostico'),
('Injerto de tejido conectivo', 'Trasplante de tejido conectivo subepitelial', 'Periodoncia', 'Cirugía mucogingival', ARRAY['injerto conectivo'], 'Cobertura radicular y aumento gingival', 'diagnostico'),
('Regeneración tisular guiada', 'Técnica de regeneración periodontal', 'Periodoncia', 'Regeneración', ARRAY['RTG'], 'Uso de membranas para regeneración', 'diagnostico'),
('Proteínas de la matriz del esmalte', 'Factores de crecimiento para regeneración', 'Periodoncia', 'Biomateriales', ARRAY['EMD'], 'Estimulación de regeneración periodontal', 'diagnostico'),

-- Términos de Farmacología Clínica
('Penicilina', 'Antibiótico beta-lactámico', 'Farmacología', 'Antibióticos', ARRAY['penicilina G'], 'Antibiótico histórico para infecciones', 'antecedentesPersonalesPatologicos'),
('Cefalexina', 'Antibiótico cefalosporina de primera generación', 'Farmacología', 'Antibióticos', ARRAY['cefalosporina'], 'Alternativa a penicilina', 'antecedentesPersonalesPatologicos'),
('Clindamicina', 'Antibiótico lincosamida', 'Farmacología', 'Antibióticos', ARRAY['lincomicina'], 'Antibiótico para anaerobios', 'antecedentesPersonalesPatologicos'),
('Dexametasona', 'Corticosteroide potente', 'Farmacología', 'Antiinflamatorios', ARRAY['corticoide'], 'Antiinflamatorio potente', 'antecedentesPersonalesPatrologicos'),
('Prednisolona', 'Corticosteroide sistémico', 'Farmacología', 'Antiinflamatorios', ARRAY['corticosteroide'], 'Antiinflamatorio sistémico', 'antecedentesPersonalesPatologicos'),
('Ketorolaco', 'AINE potente para dolor severo', 'Farmacología', 'Analgésicos', ARRAY['AINE potente'], 'Analgésico para dolor postoperatorio', 'antecedentesPersonalesPatologicos'),
('Tramadol', 'Analgésico opioide sintético', 'Farmacología', 'Analgésicos', ARRAY['opioide sintético'], 'Analgésico para dolor moderado-severo', 'antecedentesPersonalesPatologicos'),

-- Términos de Diagnóstico por Imagen
('Tomografía computarizada', 'Imagen tridimensional por rayos X', 'Radiología', 'Técnicas avanzadas', ARRAY['TC', 'TAC'], 'Diagnóstico tridimensional de estructuras', 'examenIntrabucal'),
('Cone beam CT', 'Tomografía de haz cónico dental', 'Radiología', 'Técnicas especializadas', ARRAY['CBCT'], 'Imagen 3D específica para odontología', 'examenIntrabucal'),
('Resonancia magnética', 'Imagen por campos magnéticos', 'Radiología', 'Técnicas avanzadas', ARRAY['RM', 'MRI'], 'Diagnóstico de tejidos blandos', 'examenIntrabucal'),
('Ecografía', 'Imagen por ultrasonido', 'Radiología', 'Técnicas no ionizantes', ARRAY['ultrasonido'], 'Diagnóstico de glándulas salivales', 'glandulasSalivales'),
('Sialografía', 'Radiografía con contraste de glándulas salivales', 'Radiología', 'Técnicas especializadas', ARRAY['sialografía con contraste'], 'Estudio de conductos salivales', 'glandulasSalivales'),

-- Términos de Medicina Oral Avanzada
('Síndrome de Burning Mouth', 'Sensación de ardor oral idiopática', 'Medicina oral', 'Síndromes neurológicos', ARRAY['síndrome de boca ardiente'], 'Dolor neuropático oral crónico', 'padecimientoActual'),
('Neuralgia del trigémino', 'Dolor neuropático del V par craneal', 'Medicina oral', 'Neuralgias', ARRAY['tic doloroso'], 'Dolor facial severo paroxístico', 'padecimientoActual'),
('Parálisis facial', 'Pérdida de función del VII par craneal', 'Medicina oral', 'Neuropatías', ARRAY['parálisis de Bell'], 'Pérdida de función facial unilateral', 'examenCabeza'),
('Trismo', 'Limitación de apertura bucal', 'Medicina oral', 'Alteraciones funcionales', ARRAY['limitación mandibular'], 'Restricción del movimiento mandibular', 'articulacionCraneomandibular'),
('Bruxismo', 'Rechinar o apretar dientes involuntariamente', 'Medicina oral', 'Parafunction', ARRAY['rechinamiento dental'], 'Hábito parafuncional destructivo', 'interrogatorioSistemas'),
('Respiración bucal', 'Respiración predominante por boca', 'Medicina oral', 'Alteraciones funcionales', ARRAY['respirador bucal'], 'Patrón respiratorio anormal', 'interrogatorioSistemas');
