
-- Agregar términos médicos específicos de los formularios de la aplicación
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES

-- Términos de Examen de Cabeza - Morfología Cefálica
('Mesocéfalo', 'Cráneo de proporciones normales e intermedias', 'Morfología cefálica', 'Tipo de cráneo', ARRAY['mesocefálico', 'normocéfalo'], 'Índice cefálico entre 76-80', 'examenCabeza'),
('Dolicocéfalo', 'Cráneo alargado en sentido anteroposterior', 'Morfología cefálica', 'Tipo de cráneo', ARRAY['dolicocefálico'], 'Índice cefálico menor a 76', 'examenCabeza'),
('Braquicéfalo', 'Cráneo ancho y corto en sentido anteroposterior', 'Morfología cefálica', 'Tipo de cráneo', ARRAY['braquicefálico'], 'Índice cefálico mayor a 80', 'examenCabeza'),

-- Términos de Perfil Facial
('Perfil cóncavo', 'Perfil facial con hundimiento del tercio medio', 'Morfología facial', 'Tipo de perfil', ARRAY['cóncavo', 'perfil clase III'], 'Retrognatismo maxilar o prognatismo mandibular', 'examenCabeza'),
('Perfil recto', 'Perfil facial armónico y equilibrado', 'Morfología facial', 'Tipo de perfil', ARRAY['recto', 'perfil clase I'], 'Relación normal entre maxilar y mandíbula', 'examenCabeza'),
('Perfil convexo', 'Perfil facial con proyección del tercio medio', 'Morfología facial', 'Tipo de perfil', ARRAY['convexo', 'perfil clase II'], 'Prognatismo maxilar o retrognatismo mandibular', 'examenCabeza'),

-- Términos de Características de la Piel
('Tez clara', 'Coloración cutánea de tonalidad pálida', 'Características cutáneas', 'Coloración', ARRAY['piel clara', 'tez pálida'], 'Fototipo I-II de Fitzpatrick', 'examenCabeza'),
('Tez morena', 'Coloración cutánea de tonalidad intermedia', 'Características cutáneas', 'Coloración', ARRAY['piel morena', 'tez intermedia'], 'Fototipo III-IV de Fitzpatrick', 'examenCabeza'),
('Tez oscura', 'Coloración cutánea de tonalidad pigmentada', 'Características cutáneas', 'Coloración', ARRAY['piel oscura', 'tez pigmentada'], 'Fototipo V-VI de Fitzpatrick', 'examenCabeza'),
('Piel reseca', 'Estado cutáneo con falta de hidratación', 'Características cutáneas', 'Estado de hidratación', ARRAY['piel seca', 'xerosis'], 'Disminución de la secreción sebácea', 'examenCabeza'),
('Piel humectada', 'Estado cutáneo con hidratación normal', 'Características cutáneas', 'Estado de hidratación', ARRAY['piel hidratada', 'piel normal'], 'Secreción sebácea normal', 'examenCabeza'),

-- Términos de Patología Cutánea
('Lunares pequeños', 'Nevos pigmentarios menores de 5mm', 'Patología cutánea', 'Nevos', ARRAY['nevos pequeños'], 'Lesiones benignas menores a 5mm', 'examenCabeza'),
('Lunares medianos', 'Nevos pigmentarios entre 5-10mm', 'Patología cutánea', 'Nevos', ARRAY['nevos medianos'], 'Lesiones que requieren seguimiento', 'examenCabeza'),
('Lunares grandes', 'Nevos pigmentarios mayores de 10mm', 'Patología cutánea', 'Nevos', ARRAY['nevos grandes'], 'Lesiones que requieren evaluación especializada', 'examenCabeza'),
('Cicatrices pequeñas', 'Marcas de tejido fibroso de extensión limitada', 'Patología cutánea', 'Cicatrices', ARRAY['cicatriz pequeña'], 'Proceso de reparación tisular menor', 'examenCabeza'),
('Cicatrices medianas', 'Marcas de tejido fibroso de extensión moderada', 'Patología cutánea', 'Cicatrices', ARRAY['cicatriz mediana'], 'Proceso de reparación tisular moderado', 'examenCabeza'),
('Cicatrices grandes', 'Marcas de tejido fibroso de extensión considerable', 'Patología cutánea', 'Cicatrices', ARRAY['cicatriz grande'], 'Proceso de reparación tisular extenso', 'examenCabeza'),
('Bordes regulares', 'Límites uniformes y simétricos de lesión', 'Patología cutánea', 'Características', ARRAY['bordes lisos'], 'Sugiere benignidad en lesiones', 'examenCabeza'),
('Bordes irregulares', 'Límites asimétricos y dentados de lesión', 'Patología cutánea', 'Características', ARRAY['bordes dentados'], 'Puede sugerir malignidad', 'examenCabeza'),

-- Términos de Asimetrías Faciales
('Asimetría facial leve', 'Diferencia sutil entre hemicara derecha e izquierda', 'Morfología facial', 'Asimetrías', ARRAY['asimetría menor'], 'Variación dentro de límites normales', 'examenCabeza'),
('Asimetría facial moderada', 'Diferencia evidente entre hemicaras', 'Morfología facial', 'Asimetrías', ARRAY['asimetría notable'], 'Requiere evaluación especializada', 'examenCabeza'),
('Asimetría facial severa', 'Diferencia marcada entre hemicaras', 'Morfología facial', 'Asimetrías', ARRAY['asimetría grave'], 'Requiere tratamiento multidisciplinario', 'examenCabeza'),
('Tercio superior facial', 'Región de la frente y área supraorbitaria', 'Anatomía facial', 'Regiones', ARRAY['frente', 'región frontal'], 'Desde línea capilar hasta cejas', 'examenCabeza'),
('Tercio medio facial', 'Región de mejillas y área infraorbitaria', 'Anatomía facial', 'Regiones', ARRAY['mejillas', 'región malar'], 'Desde cejas hasta comisura labial', 'examenCabeza'),
('Tercio inferior facial', 'Región de labios, mentón y mandíbula', 'Anatomía facial', 'Regiones', ARRAY['región mandibular'], 'Desde comisura labial hasta mentón', 'examenCabeza'),

-- Términos de Edema Facial
('Edema leve', 'Tumefacción facial grado I', 'Patología facial', 'Edema', ARRAY['edema grado +'], 'Aumento de volumen discreto', 'examenCabeza'),
('Edema moderado', 'Tumefacción facial grado II', 'Patología facial', 'Edema', ARRAY['edema grado ++'], 'Aumento de volumen evidente', 'examenCabeza'),
('Edema severo', 'Tumefacción facial grado III', 'Patología facial', 'Edema', ARRAY['edema grado +++'], 'Aumento de volumen marcado', 'examenCabeza'),
('Edema de párpados', 'Tumefacción en región palpebral', 'Patología facial', 'Edema', ARRAY['edema palpebral'], 'Puede indicar patología renal o alérgica', 'examenCabeza'),
('Edema de mejillas', 'Tumefacción en región malar', 'Patología facial', 'Edema', ARRAY['edema malar'], 'Puede indicar infección odontogénica', 'examenCabeza'),
('Edema de labios', 'Tumefacción en región labial', 'Patología facial', 'Edema', ARRAY['edema labial'], 'Puede indicar reacción alérgica', 'examenCabeza'),
('Consistencia blanda', 'Textura del edema que se deprime fácilmente', 'Patología facial', 'Edema', ARRAY['edema blando'], 'Signo de fóvea positivo', 'examenCabeza'),
('Consistencia firme', 'Textura del edema con resistencia moderada', 'Patología facial', 'Edema', ARRAY['edema firme'], 'Signo de fóvea variable', 'examenCabeza'),
('Consistencia dura', 'Textura del edema con gran resistencia', 'Patología facial', 'Edema', ARRAY['edema duro'], 'Signo de fóvea negativo', 'examenCabeza'),

-- Términos de Articulación Craneomandibular
('Dolor al masticar', 'Molestia durante la función masticatoria', 'Disfunción ATM', 'Síntomas', ARRAY['dolor masticatorio'], 'Puede indicar disfunción temporomandibular', 'articulacionCraneomandibular'),
('Dolor al hablar', 'Molestia durante la función fonatoria', 'Disfunción ATM', 'Síntomas', ARRAY['dolor fonatorio'], 'Limitación funcional del habla', 'articulacionCraneomandibular'),
('Dificultad al masticar', 'Limitación en la función masticatoria', 'Disfunción ATM', 'Limitaciones funcionales', ARRAY['disfunción masticatoria'], 'Altera la alimentación normal', 'articulacionCraneomandibular'),
('Dificultad al hablar', 'Limitación en la función fonatoria', 'Disfunción ATM', 'Limitaciones funcionales', ARRAY['disfunción fonatoria'], 'Altera la comunicación normal', 'articulacionCraneomandibular'),
('Ruido a la apertura', 'Sonido articular durante abertura bucal', 'Disfunción ATM', 'Ruidos articulares', ARRAY['click de apertura'], 'Puede indicar desplazamiento discal', 'articulacionCraneomandibular'),
('Ruido al cierre', 'Sonido articular durante cierre bucal', 'Disfunción ATM', 'Ruidos articulares', ARRAY['click de cierre'], 'Puede indicar reducción discal', 'articulacionCraneomandibular'),
('Apertura recta', 'Movimiento mandibular sin desviaciones', 'Función ATM', 'Patrones de apertura', ARRAY['apertura normal'], 'Función articular normal', 'articulacionCraneomandibular'),
('Desviación derecha', 'Movimiento mandibular hacia el lado derecho', 'Función ATM', 'Patrones de apertura', ARRAY['deflexión derecha'], 'Puede indicar limitación del cóndilo izquierdo', 'articulacionCraneomandibular'),
('Desviación izquierda', 'Movimiento mandibular hacia el lado izquierdo', 'Función ATM', 'Patrones de apertura', ARRAY['deflexión izquierda'], 'Puede indicar limitación del cóndilo derecho', 'articulacionCraneomandibular'),
('Forma de S', 'Movimiento mandibular con trayectoria sinuosa', 'Función ATM', 'Patrones de apertura', ARRAY['apertura en S'], 'Indica disfunción articular bilateral', 'articulacionCraneomandibular'),

-- Términos de Semiología de Labios
('Labios simétricos', 'Armonía bilateral de estructuras labiales', 'Semiología labial', 'Simetría', ARRAY['simetría labial'], 'Normalidad anatómica labial', 'articulacionCraneomandibular'),
('Desviación labial derecha', 'Asimetría labial hacia lado derecho', 'Semiología labial', 'Simetría', ARRAY['asimetría derecha'], 'Puede indicar parálisis facial izquierda', 'articulacionCraneomandibular'),
('Desviación labial izquierda', 'Asimetría labial hacia lado izquierdo', 'Semiología labial', 'Simetría', ARRAY['asimetría izquierda'], 'Puede indicar parálisis facial derecha', 'articulacionCraneomandibular'),
('Labios delgados', 'Volumen labial reducido', 'Semiología labial', 'Volumen', ARRAY['labios finos'], 'Característica anatómica individual', 'articulacionCraneomandibular'),
('Labios medianos', 'Volumen labial normal', 'Semiología labial', 'Volumen', ARRAY['labios normales'], 'Volumen dentro de parámetros normales', 'articulacionCraneomandibular'),
('Labios gruesos', 'Volumen labial aumentado', 'Semiología labial', 'Volumen', ARRAY['labios carnosos'], 'Característica anatómica individual', 'articulacionCraneomandibular'),
('Coloración rosada', 'Color labial normal y saludable', 'Semiología labial', 'Coloración', ARRAY['color normal'], 'Vascularización adecuada', 'articulacionCraneomandibular'),
('Coloración pálida', 'Color labial disminuido', 'Semiología labial', 'Coloración', ARRAY['palidez labial'], 'Puede indicar anemia o vasoconstricción', 'articulacionCraneomandibular'),
('Coloración cianótica', 'Color labial azulado', 'Semiología labial', 'Coloración', ARRAY['cianosis labial'], 'Indica hipoxemia', 'articulacionCraneomandibular'),
('Coloración eritematosa', 'Color labial enrojecido', 'Semiología labial', 'Coloración', ARRAY['eritema labial'], 'Indica inflamación o irritación', 'articulacionCraneomandibular'),
('Superficie hidratada', 'Labios con hidratación normal', 'Semiología labial', 'Superficie', ARRAY['labios hidratados'], 'Estado normal de los labios', 'articulacionCraneomandibular'),
('Superficie seca', 'Labios con falta de hidratación', 'Semiología labial', 'Superficie', ARRAY['labios secos'], 'Requiere hidratación', 'articulacionCraneomandibular'),
('Superficie agrietada', 'Labios con fisuras superficiales', 'Semiología labial', 'Superficie', ARRAY['labios fisurados'], 'Indica deshidratación severa', 'articulacionCraneomandibular'),
('Presencia de costras', 'Labios con formaciones costrosas', 'Semiología labial', 'Superficie', ARRAY['costras labiales'], 'Indica proceso inflamatorio previo', 'articulacionCraneomandibular'),
('Superficie con fisuras', 'Labios con soluciones de continuidad', 'Semiología labial', 'Superficie', ARRAY['fisuras labiales'], 'Lesiones que requieren tratamiento', 'articulacionCraneomandibular'),
('Mucosa íntegra', 'Mucosa labial sin alteraciones', 'Semiología labial', 'Integridad', ARRAY['mucosa normal'], 'Estado normal de la mucosa', 'articulacionCraneomandibular'),
('Heridas superficiales', 'Lesiones menores de la mucosa labial', 'Semiología labial', 'Integridad', ARRAY['erosiones'], 'Pérdida parcial del epitelio', 'articulacionCraneomandibular'),
('Ulceraciones labiales', 'Pérdida de sustancia en mucosa labial', 'Semiología labial', 'Integridad', ARRAY['úlceras labiales'], 'Lesiones que atraviesan la mucosa', 'articulacionCraneomandibular'),
('Comisuras normales', 'Ángulos labiales sin alteraciones', 'Semiología labial', 'Comisuras', ARRAY['comisuras sanas'], 'Estado normal de los ángulos labiales', 'articulacionCraneomandibular'),
('Comisuras erosionadas', 'Ángulos labiales con pérdida epitelial', 'Semiología labial', 'Comisuras', ARRAY['erosión comisural'], 'Lesión superficial de comisuras', 'articulacionCraneomandibular'),
('Queilitis angular', 'Inflamación e infección de comisuras', 'Semiología labial', 'Comisuras', ARRAY['boqueras', 'perleche'], 'Fisuras infectadas en comisuras', 'articulacionCraneomandibular'),
('Movimientos conservados', 'Función labial normal', 'Semiología labial', 'Función', ARRAY['función normal'], 'Movilidad labial adecuada', 'articulacionCraneomandibular'),
('Restricción de movimiento', 'Limitación en la movilidad labial', 'Semiología labial', 'Función', ARRAY['limitación funcional'], 'Disminución del rango de movimiento', 'articulacionCraneomandibular'),
('Incompetencia labial', 'Incapacidad de sellado labial', 'Semiología labial', 'Función', ARRAY['insuficiencia labial'], 'Alteración del sellado oral', 'articulacionCraneomandibular'),

-- Términos de Examen Intrabucal - Mucosas
('Mucosa yugal normal', 'Mucosa de mejilla sin alteraciones', 'Mucosas orales', 'Mucosa yugal', ARRAY['mucosa bucal normal'], 'Color rosado coral uniforme', 'examenIntrabucal'),
('Mucosa yugal eritematosa', 'Mucosa de mejilla enrojecida', 'Mucosas orales', 'Mucosa yugal', ARRAY['mucosa bucal inflamada'], 'Indica proceso inflamatorio', 'examenIntrabucal'),
('Mucosa yugal ulcerada', 'Mucosa de mejilla con úlceras', 'Mucosas orales', 'Mucosa yugal', ARRAY['úlceras bucales'], 'Pérdida de sustancia mucosa', 'examenIntrabucal'),
('Mucosa hiperqueratósica', 'Mucosa con engrosamiento queratinizado', 'Mucosas orales', 'Mucosa yugal', ARRAY['hiperqueratosis'], 'Respuesta a irritación crónica', 'examenIntrabucal'),
('Paladar duro normal', 'Paladar óseo sin alteraciones', 'Mucosas orales', 'Paladar', ARRAY['paladar normal'], 'Mucosa firmemente adherida', 'examenIntrabucal'),
('Paladar duro inflamado', 'Paladar óseo con inflamación', 'Mucosas orales', 'Paladar', ARRAY['palatitis'], 'Enrojecimiento e inflamación palatina', 'examenIntrabucal'),
('Paladar duro ulcerado', 'Paladar óseo con ulceraciones', 'Mucosas orales', 'Paladar', ARRAY['úlceras palatinas'], 'Lesiones en paladar duro', 'examenIntrabucal'),
('Torus palatino', 'Exostosis benigna del paladar', 'Mucosas orales', 'Paladar', ARRAY['toro palatino'], 'Crecimiento óseo benigno central', 'examenIntrabucal'),
('Paladar blando normal', 'Paladar muscular sin alteraciones', 'Mucosas orales', 'Paladar blando', ARRAY['velo normal'], 'Mucosa móvil y flexible', 'examenIntrabucal'),
('Paladar blando inflamado', 'Paladar muscular con inflamación', 'Mucosas orales', 'Paladar blando', ARRAY['velo inflamado'], 'Enrojecimiento del paladar blando', 'examenIntrabucal'),
('Paladar blando edematoso', 'Paladar muscular con edema', 'Mucosas orales', 'Paladar blando', ARRAY['edema del velo'], 'Tumefacción del paladar blando', 'examenIntrabucal'),
('Petequias palatinas', 'Pequeñas hemorragias puntiformes', 'Mucosas orales', 'Paladar blando', ARRAY['petequias'], 'Puntos hemorrágicos en paladar', 'examenIntrabucal'),

-- Términos de Órganos Intrabucales
('Lengua normal', 'Órgano lingual sin alteraciones', 'Órganos intrabucales', 'Lengua', ARRAY['lengua sana'], 'Superficie rosada y húmeda', 'examenIntrabucal'),
('Lengua saburral', 'Lengua con saburra o capa blanquecina', 'Órganos intrabucales', 'Lengua', ARRAY['saburra lingual'], 'Acúmulo de detritos y bacterias', 'examenIntrabucal'),
('Lengua geográfica', 'Lengua con lesiones en forma de mapa', 'Órganos intrabucales', 'Lengua', ARRAY['glositis migratoria'], 'Lesiones eritematosas con bordes blanquecinos', 'examenIntrabucal'),
('Lengua fisurada', 'Lengua con surcos o fisuras', 'Órganos intrabucales', 'Lengua', ARRAY['lengua escrotal'], 'Surcos profundos en superficie lingual', 'examenIntrabucal'),
('Lengua vellosa', 'Lengua con papilas filiformes alargadas', 'Órganos intrabucales', 'Lengua', ARRAY['lengua pilosa'], 'Alargamiento de papilas filiformes', 'examenIntrabucal'),
('Piso de boca normal', 'Región sublingual sin alteraciones', 'Órganos intrabucales', 'Piso de boca', ARRAY['suelo bucal normal'], 'Mucosa lisa y rosada', 'examenIntrabucal'),
('Piso de boca inflamado', 'Región sublingual con inflamación', 'Órganos intrabucales', 'Piso de boca', ARRAY['suelo bucal inflamado'], 'Enrojecimiento e inflamación', 'examenIntrabucal'),
('Piso de boca indurado', 'Región sublingual endurecida', 'Órganos intrabucales', 'Piso de boca', ARRAY['suelo bucal duro'], 'Consistencia aumentada por fibrosis', 'examenIntrabucal'),
('Piso de boca ulcerado', 'Región sublingual con úlceras', 'Órganos intrabucales', 'Piso de boca', ARRAY['úlceras sublinguales'], 'Lesiones en piso de boca', 'examenIntrabucal'),
('Encías sanas', 'Tejido gingival normal', 'Órganos intrabucales', 'Encías', ARRAY['gingiVa sana'], 'Color rosado coral, festoneado', 'examenIntrabucal'),
('Gingivitis', 'Inflamación del tejido gingival', 'Órganos intrabucales', 'Encías', ARRAY['inflamación gingival'], 'Enrojecimiento e inflamación sin pérdida de inserción', 'examenIntrabucal'),
('Periodontitis', 'Enfermedad periodontal con pérdida de inserción', 'Órganos intrabucales', 'Encías', ARRAY['enfermedad periodontal'], 'Inflamación con pérdida de hueso alveolar', 'examenIntrabucal'),
('Hiperplasia gingival', 'Crecimiento excesivo del tejido gingival', 'Órganos intrabucales', 'Encías', ARRAY['crecimiento gingival'], 'Aumento de volumen gingival', 'examenIntrabucal'),
('Recesión gingival', 'Retracción del margen gingival', 'Órganos intrabucales', 'Encías', ARRAY['retracción gingival'], 'Migración apical del margen gingival', 'examenIntrabucal');
