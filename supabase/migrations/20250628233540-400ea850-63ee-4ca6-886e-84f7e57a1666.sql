
-- Agregar más términos especializados de odontología y medicina
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- Términos de Patología Oral Avanzada
('Leucoplasia', 'Lesión blanca que no se desprende al raspado y no corresponde a otra patología', 'Patología oral', 'Lesiones premalignas', ARRAY['placa blanca', 'queratosis'], 'Lesión potencialmente maligna que requiere biopsia', 'examenIntrabucal'),
('Eritroplasia', 'Lesión roja de la mucosa oral con alto potencial de malignización', 'Patología oral', 'Lesiones premalignas', ARRAY['placa roja', 'eritroplakia'], 'Lesión con mayor riesgo de malignidad que leucoplasia', 'examenIntrabucal'),
('Carcinoma escamocelular', 'Neoplasia maligna más común de la cavidad oral', 'Patología oral', 'Neoplasias malignas', ARRAY['carcinoma epidermoide', 'cáncer oral'], 'Tumor maligno que requiere tratamiento oncológico', 'examenIntrabucal'),
('Melanoma oral', 'Neoplasia maligna de melanocitos en mucosa oral', 'Patología oral', 'Neoplasias malignas', ARRAY['melanoma de mucosa'], 'Tumor maligno poco frecuente con mal pronóstico', 'examenIntrabucal'),
('Fibroma', 'Tumor benigno de tejido conectivo fibroso', 'Patología oral', 'Neoplasias benignas', ARRAY['hiperplasia fibrosa'], 'Lesión reactiva común en mucosa oral', 'examenIntrabucal'),
('Granuloma piógeno', 'Lesión reactiva vascular de rápido crecimiento', 'Patología oral', 'Lesiones reactivas', ARRAY['granuloma telangiectásico'], 'Lesión reactiva sangrante en encías', 'examenIntrabucal'),
('Épulis', 'Lesión reactiva localizada en encía', 'Patología oral', 'Lesiones reactivas', ARRAY['granuloma periférico'], 'Crecimiento gingival reactivo', 'examenIntrabucal'),
('Mucocele', 'Pseudoquiste por ruptura de conducto salival menor', 'Patología oral', 'Quistes', ARRAY['fenómeno de retención mucosa'], 'Lesión común en labio inferior por trauma', 'examenIntrabucal'),
('Ránula', 'Mucocele de gran tamaño en piso de boca', 'Patología oral', 'Quistes', ARRAY['quiste de retención'], 'Lesión quística en región sublingual', 'examenIntrabucal'),

-- Términos de Periodoncia Avanzada
('Bolsa periodontal', 'Profundización patológica del surco gingival', 'Periodoncia', 'Diagnóstico periodontal', ARRAY['saco periodontal'], 'Signo característico de periodontitis', 'examenIntrabucal'),
('Sondaje periodontal', 'Medición de la profundidad del surco gingival', 'Periodoncia', 'Diagnóstico periodontal', ARRAY['sondeo periodontal'], 'Procedimiento diagnóstico fundamental', 'examenIntrabucal'),
('Sangrado al sondaje', 'Hemorragia provocada por el sondaje periodontal', 'Periodoncia', 'Signos clínicos', ARRAY['BOP'], 'Indicador de inflamación gingival', 'examenIntrabucal'),
('Movilidad dental', 'Desplazamiento anormal del diente en su alveolo', 'Periodoncia', 'Signos clínicos', ARRAY['movilidad dentaria'], 'Indica pérdida de soporte periodontal', 'examenIntrabucal'),
('Furcación', 'Zona de bifurcación o trifurcación radicular', 'Periodoncia', 'Anatomía periodontal', ARRAY['furca'], 'Área crítica en molares multirradiculares', 'examenIntrabucal'),
('Recesión periodontal', 'Migración apical del margen gingival libre', 'Periodoncia', 'Alteraciones gingivales', ARRAY['retracción periodontal'], 'Exposición radicular por pérdida gingival', 'examenIntrabucal'),
('Inserción clínica', 'Distancia desde unión cemento-esmalte a fondo de bolsa', 'Periodoncia', 'Medidas periodontales', ARRAY['nivel de inserción'], 'Medida del verdadero soporte periodontal', 'examenIntrabucal'),
('Placa bacteriana', 'Biofilm microbiano adherido a superficies dentales', 'Periodoncia', 'Etiología periodontal', ARRAY['biofilm dental'], 'Factor etiológico primario de enfermedad periodontal', 'examenIntrabucal'),
('Cálculo dental', 'Placa bacteriana mineralizada adherida al diente', 'Periodoncia', 'Factores locales', ARRAY['tártaro dental', 'sarro'], 'Factor irritante local en enfermedad periodontal', 'examenIntrabucal'),

-- Términos de Endodoncia
('Pulpa dental', 'Tejido conectivo vascularizado del interior del diente', 'Endodoncia', 'Anatomía pulpar', ARRAY['nervio dental'], 'Tejido vital que puede necrosarse', 'examenIntrabucal'),
('Pulpitis', 'Inflamación de la pulpa dental', 'Endodoncia', 'Patología pulpar', ARRAY['inflamación pulpar'], 'Dolor dental de origen pulpar', 'padecimientoActual'),
('Pulpitis reversible', 'Inflamación pulpar que puede resolverse', 'Endodoncia', 'Patología pulpar', ARRAY['pulpitis aguda'], 'Dolor provocado que cede al retirar estímulo', 'padecimientoActual'),
('Pulpitis irreversible', 'Inflamación pulpar que requiere tratamiento radical', 'Endodoncia', 'Patología pulpar', ARRAY['pulpitis crónica'], 'Dolor espontáneo severo persistente', 'padecimientoActual'),
('Necrosis pulpar', 'Muerte del tejido pulpar', 'Endodoncia', 'Patología pulpar', ARRAY['pulpa necrótica'], 'Ausencia de respuesta a pruebas de vitalidad', 'examenIntrabucal'),
('Periodontitis apical', 'Inflamación de tejidos periapicales', 'Endodoncia', 'Patología periapical', ARRAY['periodontitis periapical'], 'Infección en ápice radicular', 'examenIntrabucal'),
('Absceso periapical', 'Colección purulenta en región apical', 'Endodoncia', 'Patología periapical', ARRAY['absceso dental'], 'Infección aguda con formación de pus', 'padecimientoActual'),
('Granuloma periapical', 'Lesión inflamatoria crónica periapical', 'Endodoncia', 'Patología periapical', ARRAY['granuloma apical'], 'Lesión crónica sin síntomas agudos', 'examenIntrabucal'),
('Quiste radicular', 'Quiste odontogénico de origen endodóntico', 'Endodoncia', 'Patología periapical', ARRAY['quiste periapical'], 'Lesión quística por irritation crónica', 'examenIntrabucal'),

-- Términos de Ortodoncia Avanzada
('Maloclusión', 'Alteración en la relación oclusal normal', 'Ortodoncia', 'Clasificaciones', ARRAY['mala oclusión'], 'Desviación de la oclusión ideal', 'relacionDientes'),
('Discrepancia alveolodentaria', 'Desproporción entre tamaño dental y arco alveolar', 'Ortodoncia', 'Análisis espacial', ARRAY['discrepancia de espacio'], 'Causa principal de apiñamiento', 'relacionDientes'),
('Curva de Spee', 'Curvatura sagital del plano oclusal', 'Ortodoncia', 'Anatomía oclusal', ARRAY['curva compensatoria'], 'Curvatura normal del plano de oclusión', 'oclusion'),
('Curva de Wilson', 'Curvatura transversal del plano oclusal', 'Ortodoncia', 'Anatomía oclusal', ARRAY['curva transversal'], 'Inclinación lingual de dientes posteriores', 'oclusion'),
('Guía canina', 'Contacto de caninos en movimientos laterales', 'Ortodoncia', 'Función oclusal', ARRAY['protección canina'], 'Función protectora de caninos', 'oclusion'),
('Función de grupo', 'Contacto múltiple en movimientos laterales', 'Ortodoncia', 'Función oclusal', ARRAY['guía de grupo'], 'Contactos múltiples en lado de trabajo', 'oclusion'),
('Interferencia oclusal', 'Contacto prematuro que altera función', 'Ortodoncia', 'Alteraciones oclusales', ARRAY['contacto prematuro'], 'Contacto que interfiere con función normal', 'oclusion'),
('Relación céntrica', 'Posición condilar más retruída y superior', 'Ortodoncia', 'Relaciones intermaxilares', ARRAY['RC'], 'Posición de referencia mandibular', 'articulacionCraneomandibular'),

-- Términos de Patología Sistémica Relevante
('Diabetes mellitus', 'Enfermedad metabólica con hiperglucemia crónica', 'Medicina interna', 'Endocrinología', ARRAY['diabetes'], 'Enfermedad que afecta cicatrización y periodonto', 'antecedentesPersonalesPatologicos'),
('Hipertensión arterial', 'Elevación sostenida de la presión arterial', 'Medicina interna', 'Cardiología', ARRAY['HTA', 'presión alta'], 'Factor de riesgo cardiovascular', 'antecedentesPersonalesPatologicos'),
('Cardiopatía isquémica', 'Enfermedad coronaria por isquemia miocárdica', 'Medicina interna', 'Cardiología', ARRAY['enfermedad coronaria'], 'Requiere precauciones en tratamiento dental', 'antecedentesPersonalesPatologicos'),
('Anticoagulación', 'Terapia farmacológica anticoagulante', 'Farmacología', 'Hematología', ARRAY['anticoagulantes'], 'Aumenta riesgo de hemorragia', 'antecedentesPersonalesPatologicos'),
('Osteoporosis', 'Enfermedad ósea con pérdida de densidad', 'Medicina interna', 'Reumatología', ARRAY['osteopenia'], 'Afecta metabolismo óseo maxilar', 'antecedentesPersonalesPatologicos'),
('Hipotiroidismo', 'Deficiencia de hormonas tiroideas', 'Medicina interna', 'Endocrinología', ARRAY['tiroides hipoactiva'], 'Puede causar xerostomía', 'antecedentesPersonalesPatologicos'),
('Hipertiroidismo', 'Exceso de hormonas tiroideas', 'Medicina interna', 'Endocrinología', ARRAY['tiroides hiperactiva'], 'Puede causar taquicardia', 'antecedentesPersonalesPatologicos'),
('Insuficiencia renal', 'Deterioro de la función renal', 'Medicina interna', 'Nefrología', ARRAY['falla renal'], 'Afecta eliminación de fármacos', 'antecedentesPersonalesPatologicos'),

-- Términos de Farmacología Odontológica
('Anestesia local', 'Bloqueo temporal de conducción nerviosa', 'Farmacología', 'Anestésicos', ARRAY['anestesia regional'], 'Procedimiento básico en odontología', 'antecedentesPersonalesPatologicos'),
('Lidocaína', 'Anestésico local tipo amida', 'Farmacología', 'Anestésicos', ARRAY['xilocaína'], 'Anestésico más utilizado en odontología', 'antecedentesPersonalesPatologicos'),
('Epinefrina', 'Vasoconstrictor adrenérgico', 'Farmacología', 'Vasoconstrictores', ARRAY['adrenalina'], 'Prolonga efecto anestésico', 'antecedentesPersonalesPatologicos'),
('Antibiótico profiláctico', 'Antibiótico preventivo antes de procedimientos', 'Farmacología', 'Antibióticos', ARRAY['profilaxis antimicrobiana'], 'Prevención de endocarditis bacteriana', 'antecedentesPersonalesPatologicos'),
('Amoxicilina', 'Antibiótico beta-lactámico de amplio espectro', 'Farmacología', 'Antibióticos', ARRAY['amoxil'], 'Antibiótico de primera línea en odontología', 'antecedentesPersonalesPatologicos'),
('Ibuprofeno', 'Antiinflamatorio no esteroideo', 'Farmacología', 'AINES', ARRAY['AINE'], 'Analgésico antiinflamatorio común', 'antecedentesPersonalesPatologicos'),
('Paracetamol', 'Analgésico y antipirético', 'Farmacología', 'Analgésicos', ARRAY['acetaminofén'], 'Analgésico de primera línea', 'antecedentesPersonalesPatologicos'),

-- Términos de Materiales Dentales
('Composite', 'Material restaurador de resina compuesta', 'Materiales dentales', 'Restauradores', ARRAY['resina compuesta'], 'Material estético para restauraciones', 'examenIntrabucal'),
('Amalgama', 'Aleación de mercurio para restauraciones', 'Materiales dentales', 'Restauradores', ARRAY['amalgama dental'], 'Material restaurador tradicional', 'examenIntrabucal'),
('Ionómero de vidrio', 'Material restaurador con liberación de flúor', 'Materiales dentales', 'Restauradores', ARRAY['GIC'], 'Material con propiedades anticariogénicas', 'examenIntrabucal'),
('Cemento temporal', 'Material de restauración provisional', 'Materiales dentales', 'Cementos', ARRAY['obturación temporal'], 'Restauración transitoria', 'examenIntrabucal'),
('Corona dental', 'Prótesis que recubre completamente el diente', 'Prostodoncia', 'Prótesis fija', ARRAY['corona protésica'], 'Restauración de gran destrucción', 'examenIntrabucal'),
('Puente dental', 'Prótesis fija que reemplaza dientes perdidos', 'Prostodoncia', 'Prótesis fija', ARRAY['puente fijo'], 'Reemplazo protésico de dientes ausentes', 'examenIntrabucal'),
('Implante dental', 'Raíz artificial de titanio', 'Implantología', 'Rehabilitación', ARRAY['implante osteointegrado'], 'Reemplazo radicular para corona', 'examenIntrabucal'),

-- Términos de Radiología Dental
('Radiografía periapical', 'Imagen radiográfica de diente completo y tejidos periapicales', 'Radiología', 'Técnicas radiográficas', ARRAY['Rx periapical'], 'Estudio completo de diente y estructuras de soporte', 'examenIntrabucal'),
('Radiografía bite-wing', 'Imagen radiográfica de coronas y crestas alveolares', 'Radiología', 'Técnicas radiográficas', ARRAY['aleta de mordida'], 'Detección de caries interproximales', 'examenIntrabucal'),
('Ortopantomografía', 'Radiografía panorámica de maxilares', 'Radiología', 'Técnicas radiográficas', ARRAY['panorámica'], 'Visión general de estructuras craneofaciales', 'examenIntrabucal'),
('Radiolucidez', 'Zona oscura en imagen radiográfica', 'Radiología', 'Interpretación', ARRAY['radiotransparencia'], 'Área de menor densidad radiográfica', 'examenIntrabucal'),
('Radiopacidad', 'Zona clara en imagen radiográfica', 'Radiología', 'Interpretación', ARRAY['radioopacidad'], 'Área de mayor densidad radiográfica', 'examenIntrabucal');
