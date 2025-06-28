
-- Continuar agregando términos odontológicos especializados
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- Términos de Cirugía Oral y Maxilofacial
('Exodoncia', 'Extracción quirúrgica de un diente', 'Cirugía oral', 'Procedimientos básicos', ARRAY['extracción dental'], 'Procedimiento quirúrgico más común en odontología', 'diagnostico'),
('Exodoncia simple', 'Extracción dental sin complicaciones', 'Cirugía oral', 'Técnicas extractivas', ARRAY['extracción sencilla'], 'Extracción con fórceps y elevadores', 'diagnostico'),
('Exodoncia compleja', 'Extracción quirúrgica con osteotomía', 'Cirugía oral', 'Técnicas extractivas', ARRAY['extracción quirúrgica'], 'Requiere incisión y remoción ósea', 'diagnostico'),
('Tercer molar incluido', 'Muela del juicio que no erupciona completamente', 'Cirugía oral', 'Dientes incluidos', ARRAY['cordal impactado'], 'Causa común de pericoronaritis', 'examenIntrabucal'),
('Pericoronaritis', 'Inflamación del tejido que rodea corona dental', 'Cirugía oral', 'Infecciones', ARRAY['inflamación pericoronaria'], 'Infección común en terceros molares', 'padecimientoActual'),
('Alveolitis', 'Inflamación del alveolo post-extracción', 'Cirugía oral', 'Complicaciones', ARRAY['alveolo seco'], 'Complicación dolorosa post-extracción', 'padecimientoActual'),
('Osteomielitis', 'Infección del tejido óseo maxilar', 'Cirugía oral', 'Infecciones', ARRAY['osteítis'], 'Infección grave del hueso maxilar', 'padecimientoActual'),
('Quiste dentígero', 'Quiste que rodea corona de diente incluido', 'Cirugía oral', 'Quistes maxilares', ARRAY['quiste folicular'], 'Quiste más común asociado a dientes', 'examenIntrabucal'),
('Quiste radicular', 'Quiste apical por infección crónica', 'Cirugía oral', 'Quistes maxilares', ARRAY['quiste periapical'], 'Secuela de pulpitis no tratada', 'examenIntrabucal'),
('Frenectomía', 'Escisión quirúrgica de frenillo', 'Cirugía oral', 'Procedimientos menores', ARRAY['frenilectomía'], 'Corrección de frenillo patológico', 'frenillos'),

-- Términos de Prótesis y Rehabilitación
('Prótesis total', 'Dentadura completa removible', 'Prostodoncia', 'Prótesis removible', ARRAY['dentadura completa'], 'Reemplazo de todos los dientes', 'examenIntrabucal'),
('Prótesis parcial', 'Dentadura parcial removible', 'Prostodoncia', 'Prótesis removible', ARRAY['parcial removible'], 'Reemplazo de algunos dientes', 'examenIntrabucal'),
('Rebase protésico', 'Readaptación de base de prótesis', 'Prostodoncia', 'Mantenimiento', ARRAY['readaptación'], 'Ajuste por cambios en rebordes', 'examenIntrabucal'),
('Oclusión balanceada', 'Contactos múltiples en prótesis completas', 'Prostodoncia', 'Oclusión protésica', ARRAY['balance oclusal'], 'Estabilidad en prótesis totales', 'oclusion'),
('Retención protésica', 'Capacidad de la prótesis de mantenerse en posición', 'Prostodoncia', 'Biomecánica', ARRAY['adhesión protésica'], 'Factor clave en éxito protésico', 'examenIntrabucal'),
('Estabilidad protésica', 'Resistencia al desplazamiento funcional', 'Prostodoncia', 'Biomecánica', ARRAY['equilibrio protésico'], 'Función sin movimientos anómalos', 'examenIntrabucal'),
('Dimensión vertical', 'Altura facial con dientes en contacto', 'Prostodoncia', 'Relaciones verticales', ARRAY['DVO'], 'Parámetro crítico en rehabilitación', 'oclusion'),
('Espacio libre', 'Distancia entre maxilares en reposo', 'Prostodoncia', 'Relaciones verticales', ARRAY['freeway space'], 'Espacio fisiológico de reposo', 'oclusion'),

-- Términos de Periodoncia Clínica
('Índice gingival', 'Medición cuantitativa de inflamación gingival', 'Periodoncia', 'Índices periodontales', ARRAY['IG'], 'Evaluación objetiva de gingivitis', 'examenIntrabucal'),
('Índice de placa', 'Cuantificación de acumulación de placa bacteriana', 'Periodoncia', 'Índices periodontales', ARRAY['IP'], 'Medición de higiene oral', 'examenIntrabucal'),
('Destartraje', 'Remoción de cálculo supragingival', 'Periodoncia', 'Terapia básica', ARRAY['profilaxis'], 'Limpieza dental profesional', 'diagnostico'),
('Alisado radicular', 'Remoción de cálculo subgingival', 'Periodoncia', 'Terapia básica', ARRAY['curetaje'], 'Descontaminación de superficie radicular', 'diagnostico'),
('Colgajo periodontal', 'Procedimiento quirúrgico de acceso', 'Periodoncia', 'Cirugía periodontal', ARRAY['cirugía de colgajo'], 'Acceso quirúrgico a defectos periodontales', 'diagnostico'),
('Regeneración periodontal', 'Reconstitución de estructuras periodontales perdidas', 'Periodoncia', 'Terapia regenerativa', ARRAY['regeneración tisular'], 'Recuperación de soporte periodontal', 'diagnostico'),
('Injerto gingival', 'Trasplante de tejido gingival', 'Periodoncia', 'Cirugía mucogingival', ARRAY['injerto de encía'], 'Corrección de recesiones gingivales', 'diagnostico'),
('Gingivoplastia', 'Remodelado quirúrgico de encía', 'Periodoncia', 'Cirugía gingival', ARRAY['cirugía gingival'], 'Corrección de contorno gingival', 'diagnostico'),

-- Términos de Odontopediatría
('Dentición primaria', 'Primera dentición en niños', 'Odontopediatría', 'Desarrollo dental', ARRAY['dientes de leche'], 'Dentición temporal infantil', 'examenIntrabucal'),
('Dentición mixta', 'Coexistencia de dientes primarios y permanentes', 'Odontopediatría', 'Desarrollo dental', ARRAY['dentición transitoria'], 'Período de recambio dental', 'examenIntrabucal'),
('Erupción dental', 'Proceso de emergencia del diente en boca', 'Odontopediatría', 'Desarrollo dental', ARRAY['brote dental'], 'Proceso fisiológico de aparición dental', 'examenIntrabucal'),
('Caries de biberón', 'Caries severa en dentición primaria', 'Odontopediatría', 'Patología infantil', ARRAY['caries rampante'], 'Caries por alimentación inadecuada', 'examenIntrabucal'),
('Sellador de fosas', 'Material preventivo en superficies oclusales', 'Odontopediatría', 'Prevención', ARRAY['sellante'], 'Prevención de caries en molares', 'examenIntrabucal'),
('Fluorización', 'Aplicación tópica de flúor', 'Odontopediatría', 'Prevención', ARRAY['aplicación de flúor'], 'Fortalecimiento del esmalte dental', 'examenIntrabucal'),
('Mantenedor de espacio', 'Aparato para preservar espacio de diente perdido', 'Odontopediatría', 'Ortopedia', ARRAY['mantenedor'], 'Prevención de malposiciones', 'examenIntrabucal'),

-- Términos de Medicina Oral
('Síndrome de Sjögren', 'Enfermedad autoinmune con xerostomía', 'Medicina oral', 'Enfermedades sistémicas', ARRAY['síndrome seco'], 'Causa sequedad oral y ocular', 'antecedentesPersonalesPatologicos'),
('Xerostomía', 'Sensación de sequedad bucal', 'Medicina oral', 'Alteraciones salivales', ARRAY['boca seca'], 'Síntoma común por medicamentos', 'padecimientoActual'),
('Hiposalivación', 'Disminución objetiva del flujo salival', 'Medicina oral', 'Alteraciones salivales', ARRAY['hiposialia'], 'Reducción medible de saliva', 'glandulasSalivales'),
('Sialolitiasis', 'Formación de cálculos en glándulas salivales', 'Medicina oral', 'Patología glandular', ARRAY['cálculo salival'], 'Obstrucción por cálculo salival', 'glandulasSalivales'),
('Sialadenitis', 'Inflamación de glándulas salivales', 'Medicina oral', 'Patología glandular', ARRAY['inflamación glandular'], 'Infección o inflamación salival', 'glandulasSalivales'),
('Candidiasis oral', 'Infección fúngica de mucosa oral', 'Medicina oral', 'Infecciones', ARRAY['moniliasis'], 'Infección por Candida albicans', 'examenIntrabucal'),
('Herpes simple', 'Infección viral por VHS', 'Medicina oral', 'Infecciones virales', ARRAY['herpes labial'], 'Vesículas recurrentes en labios', 'examenIntrabucal'),
('Afta recurrente', 'Úlcera oral idiopática recidivante', 'Medicina oral', 'Úlceras orales', ARRAY['estomatitis aftosa'], 'Úlcera dolorosa recurrente', 'examenIntrabucal'),

-- Términos de Traumatología Dental
('Fractura coronaria', 'Ruptura de la estructura coronal', 'Traumatología', 'Fracturas dentales', ARRAY['fractura dental'], 'Lesión traumática de corona', 'examenIntrabucal'),
('Fractura radicular', 'Ruptura de la raíz dental', 'Traumatología', 'Fracturas dentales', ARRAY['fractura de raíz'], 'Lesión traumática radicular', 'examenIntrabucal'),
('Luxación dental', 'Desplazamiento del diente en alveolo', 'Traumatología', 'Lesiones traumáticas', ARRAY['dislocación'], 'Movimiento anormal por trauma', 'examenIntrabucal'),
('Avulsión dental', 'Expulsión completa del diente', 'Traumatología', 'Lesiones traumáticas', ARRAY['exarticulación'], 'Pérdida total por traumatismo', 'examenIntrabucal'),
('Subluxación', 'Lesión ligamentosa sin desplazamiento', 'Traumatología', 'Lesiones traumáticas', ARRAY['luxación parcial'], 'Trauma leve del ligamento periodontal', 'examenIntrabucal'),
('Intrusión dental', 'Desplazamiento del diente hacia el alveolo', 'Traumatología', 'Lesiones traumáticas', ARRAY['impactación'], 'Hundimiento traumático en alveolo', 'examenIntrabucal'),
('Extrusión dental', 'Desplazamiento del diente fuera del alveolo', 'Traumatología', 'Lesiones traumáticas', ARRAY['elongación'], 'Salida parcial del alveolo', 'examenIntrabucal'),

-- Términos de Anestesiología Odontológica
('Bloqueo del nervio alveolar inferior', 'Anestesia troncular mandibular', 'Anestesiología', 'Técnicas anestésicas', ARRAY['troncular mandibular'], 'Anestesia para procedimientos mandibulares', 'antecedentesPersonalesPatologicos'),
('Anestesia infiltrativa', 'Inyección anestésica local terminal', 'Anestesiología', 'Técnicas anestésicas', ARRAY['infiltración'], 'Anestesia por difusión local', 'antecedentesPersonalesPatologicos'),
('Anestesia tópica', 'Aplicación superficial de anestésico', 'Anestesiología', 'Técnicas anestésicas', ARRAY['anestesia de superficie'], 'Anestesia mucosa previa a inyección', 'antecedentesPersonalesPatologicos'),
('Vasoconstrictor', 'Agente que contrae vasos sanguíneos', 'Anestesiología', 'Aditivos anestésicos', ARRAY['constrictor vascular'], 'Prolonga y potencia anestesia', 'antecedentesPersonalesPatologicos'),
('Parestesia', 'Alteración de la sensibilidad', 'Anestesiología', 'Complicaciones', ARRAY['disestesia'], 'Complicación neurológica anestésica', 'antecedentesPersonalesPatologicos'),

-- Términos de Oclusión Avanzada
('Posición intercuspídea', 'Máximo engranaje de cúspides', 'Oclusión', 'Posiciones mandibulares', ARRAY['PIC'], 'Posición de máxima intercuspidación', 'oclusion'),
('Dimensión vertical oclusal', 'Altura facial con dientes en contacto', 'Oclusión', 'Dimensiones faciales', ARRAY['DVO'], 'Parámetro vertical de oclusión', 'oclusion'),
('Dimensión vertical de reposo', 'Altura facial con músculos relajados', 'Oclusión', 'Dimensiones faciales', ARRAY['DVR'], 'Posición de reposo mandibular', 'oclusion'),
('Trayectoria condílea', 'Recorrido del cóndilo en movimiento', 'Oclusión', 'Biomecánica mandibular', ARRAY['trayectoria articular'], 'Movimiento condilar en articulación', 'articulacionCraneomandibular'),
('Ángulo de Bennett', 'Movimiento lateral inmediato del cóndilo', 'Oclusión', 'Biomecánica mandibular', ARRAY['movimiento de Bennett'], 'Componente lateral del movimiento', 'articulacionCraneomandibular'),
('Guía incisiva', 'Trayectoria de incisivos en protrusión', 'Oclusión', 'Guías oclusales', ARRAY['guía anterior'], 'Desoclusión por incisivos centrales', 'oclusion'),
('Curva de compensación', 'Curvatura del plano oclusal', 'Oclusión', 'Morfología oclusal', ARRAY['curva oclusal'], 'Adaptación del plano de oclusión', 'oclusion');
