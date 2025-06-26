
-- Insertar términos de Información Principal
INSERT INTO dental_terms (termino, definicion, categoria, subcategoria, sinonimos, contexto_uso, seccion_formulario) VALUES
('Nombre', 'Identificación personal del paciente para el registro de la historia clínica', 'Datos Personales', 'Identificación', ARRAY['nombre completo', 'apellidos', 'identificación'], 'Se utiliza para identificar únicamente al paciente en todos los registros médicos', 'informacion_principal'),
('Edad', 'Tiempo transcurrido desde el nacimiento del paciente, factor importante en el diagnóstico dental', 'Datos Personales', 'Demografía', ARRAY['años', 'fecha nacimiento'], 'La edad influye en el tipo de tratamientos y en la prevalencia de ciertas patologías dentales', 'informacion_principal'),
('Sexo', 'Característica biológica que puede influir en ciertos tratamientos dentales', 'Datos Personales', 'Demografía', ARRAY['género', 'masculino', 'femenino'], 'Algunos tratamientos y condiciones dentales pueden verse influenciados por el sexo del paciente', 'informacion_principal'),
('Teléfono', 'Medio de contacto para citas, recordatorios y comunicación con el paciente', 'Datos Personales', 'Contacto', ARRAY['celular', 'móvil', 'número'], 'Esencial para mantener comunicación efectiva con el paciente', 'informacion_principal'),
('Dirección', 'Ubicación residencial del paciente para contacto y referencias geográficas', 'Datos Personales', 'Contacto', ARRAY['domicilio', 'residencia', 'ubicación'], 'Importante para contacto de emergencia y referencias del paciente', 'informacion_principal'),
('Ocupación', 'Actividad laboral que puede influir en la salud dental y riesgo de traumatismos', 'Datos Personales', 'Sociolaboral', ARRAY['trabajo', 'profesión', 'empleo'], 'La ocupación puede predisponer a ciertos riesgos dentales y determinar horarios de atención', 'informacion_principal'),

-- Términos de Padecimiento Actual
('Padecimiento Actual', 'Descripción detallada del problema principal que motiva la consulta odontológica', 'Anamnesis', 'Motivo Consulta', ARRAY['problema actual', 'queja principal', 'motivo consulta'], 'Es el punto de partida para establecer un diagnóstico diferencial', 'padecimiento_actual'),
('Motivo de Consulta', 'Razón específica por la cual el paciente solicita atención odontológica', 'Anamnesis', 'Motivo Consulta', ARRAY['problema principal', 'queja', 'consulta'], 'Determina el enfoque inicial del examen y tratamiento', 'padecimiento_actual'),
('Sin Síntomas', 'Paciente que acude a consulta preventiva sin molestias específicas', 'Anamnesis', 'Asintomático', ARRAY['asintomático', 'sin molestias', 'revisión'], 'Consulta preventiva o de rutina sin sintomatología específica', 'padecimiento_actual'),

-- Características del Dolor
('Dolor Punzante', 'Dolor agudo y penetrante que se siente como una aguja o pinchazo', 'Sintomatología', 'Dolor', ARRAY['punzadas', 'como aguja', 'pinchazo'], 'Típico de pulpitis aguda o neuralgia del trigémino', 'dolor'),
('Dolor Pulsátil', 'Dolor que late al ritmo del corazón, típico de inflamación', 'Sintomatología', 'Dolor', ARRAY['latente', 'pulsante', 'latido'], 'Característico de pulpitis irreversible o absceso periapical', 'dolor'),
('Dolor Sordo', 'Dolor constante de baja intensidad pero persistente', 'Sintomatología', 'Dolor', ARRAY['constante', 'opaco', 'persistente'], 'Puede indicar inflamación crónica o periodontitis', 'dolor'),
('Dolor Agudo', 'Dolor intenso y repentino de alta intensidad', 'Sintomatología', 'Dolor', ARRAY['fulminante', 'intenso', 'severo'], 'Sugiere patología pulpar aguda o fractura dental', 'dolor'),
('Dolor Constante', 'Dolor que no desaparece y permanece durante todo el tiempo', 'Sintomatología', 'Dolor', ARRAY['continuo', 'permanente', 'persistente'], 'Indica inflamación severa o necrosis pulpar', 'dolor'),
('Dolor Intermitente', 'Dolor que aparece y desaparece con intervalos', 'Sintomatología', 'Dolor', ARRAY['va y viene', 'episódico', 'ocasional'], 'Puede indicar pulpitis reversible o bruxismo', 'dolor'),
('Dolor Irradiado', 'Dolor que se extiende a otras zonas como oído, cabeza o cuello', 'Sintomatología', 'Dolor', ARRAY['se extiende', 'se corre', 'propagado'], 'Típico de molares inferiores que irradian al oído', 'dolor'),
('Dolor Localizado', 'Dolor que se siente específicamente en un punto', 'Sintomatología', 'Dolor', ARRAY['en un punto', 'específico', 'exacto'], 'Permite identificar con precisión el diente afectado', 'dolor'),

-- Desencadenantes del Dolor
('Dolor al Morder', 'Dolor que aparece al ejercer presión oclusal', 'Sintomatología', 'Desencadenantes', ARRAY['al masticar', 'al apretar', 'al ocluir'], 'Sugiere periodontitis apical o fractura dental', 'dolor'),
('Dolor con Frío', 'Dolor desencadenado por estímulos fríos', 'Sintomatología', 'Desencadenantes', ARRAY['con hielo', 'bebidas frías', 'aire frío'], 'Típico de hipersensibilidad dentinaria o caries', 'dolor'),
('Dolor con Calor', 'Dolor provocado por estímulos calientes', 'Sintomatología', 'Desencadenantes', ARRAY['bebidas calientes', 'comida caliente'], 'Indica pulpitis irreversible avanzada', 'dolor'),
('Dolor con Dulces', 'Dolor al consumir azúcares o dulces', 'Sintomatología', 'Desencadenantes', ARRAY['con azúcar', 'con miel', 'dulces'], 'Característico de caries dental activa', 'dolor'),
('Dolor con Ácidos', 'Dolor provocado por sustancias ácidas', 'Sintomatología', 'Desencadenantes', ARRAY['con limón', 'con vinagre', 'ácido'], 'Indica exposición dentinaria o erosión dental', 'dolor'),
('Dolor Espontáneo', 'Dolor que aparece sin estímulo aparente', 'Sintomatología', 'Desencadenantes', ARRAY['sin causa', 'de la nada', 'repentino'], 'Sugiere pulpitis irreversible o necrosis', 'dolor'),
('Dolor Nocturno', 'Dolor que aparece o empeora por la noche', 'Sintomatología', 'Desencadenantes', ARRAY['al acostarse', 'en la noche'], 'Típico de pulpitis irreversible', 'dolor'),

-- Problemas Estéticos
('Dientes Amarillos', 'Coloración amarillenta de los dientes por diversos factores', 'Estética', 'Color', ARRAY['amarillentos', 'color amarillo'], 'Puede deberse a edad, medicamentos o hábitos', 'estetica'),
('Dientes Oscurecidos', 'Pérdida del color natural hacia tonos más oscuros', 'Estética', 'Color', ARRAY['oscuros', 'grises', 'opacos'], 'Puede indicar necrosis pulpar o tinción externa', 'estetica'),
('Manchas Blancas', 'Lesiones hipocalcificadas de color blanco en el esmalte', 'Estética', 'Color', ARRAY['manchas opacas', 'hipocalcificación'], 'Pueden ser caries incipientes o fluorosis', 'estetica'),
('Dientes Apiñados', 'Falta de espacio que causa malposición dental', 'Estética', 'Posición', ARRAY['amontonados', 'chuecos', 'encimados'], 'Requiere tratamiento ortodóncico', 'estetica'),
('Diastema', 'Espacio entre dientes, especialmente incisivos centrales', 'Estética', 'Posición', ARRAY['separación', 'espacio', 'hueco'], 'Puede ser congénito o adquirido', 'estetica'),
('Sonrisa Gingival', 'Exposición excesiva de encía al sonreír', 'Estética', 'Sonrisa', ARRAY['mucha encía', 'encía visible'], 'Puede requerir cirugía periodontal o ortodóncica', 'estetica'),

-- Problemas Funcionales
('Dificultad para Masticar', 'Limitación en la función masticatoria', 'Función', 'Masticación', ARRAY['no puede masticar', 'masticación difícil'], 'Afecta la digestión y nutrición del paciente', 'funcion'),
('Contacto Prematuro', 'Diente que toca primero al cerrar la boca', 'Función', 'Oclusión', ARRAY['choca primero', 'toca antes'], 'Causa trauma oclusal y desgaste', 'funcion'),
('Mordida no Encaja', 'Falta de armonía en el cierre dental', 'Función', 'Oclusión', ARRAY['no cierra bien', 'desajuste'], 'Puede causar disfunción temporomandibular', 'funcion'),
('Chasquido Mandibular', 'Ruido articular al abrir o cerrar la boca', 'Función', 'ATM', ARRAY['tronido', 'clic', 'ruido mandíbula'], 'Signo de disfunción temporomandibular', 'funcion'),
('Mandíbula se Traba', 'Limitación súbita del movimiento mandibular', 'Función', 'ATM', ARRAY['luxación', 'se atora', 'no abre'], 'Requiere atención inmediata', 'funcion'),
('Trismo', 'Dificultad para abrir la boca completamente', 'Función', 'ATM', ARRAY['apertura limitada', 'no abre bien'], 'Puede ser por inflamación o disfunción', 'funcion'),

-- Movilidad Dental
('Diente Flojo', 'Pérdida de la estabilidad natural del diente', 'Patología', 'Movilidad', ARRAY['movilidad dental', 'se mueve'], 'Indica pérdida de soporte periodontal', 'movilidad'),
('Empaste Caído', 'Pérdida de una restauración dental', 'Patología', 'Restauraciones', ARRAY['curación caída', 'relleno perdido'], 'Expone la estructura dental a caries', 'restauraciones'),
('Corona Floja', 'Pérdida de retención de una corona dental', 'Patología', 'Prótesis', ARRAY['funda floja', 'corona suelta'], 'Puede permitir filtración bacteriana', 'protesis'),

-- Tejidos Blandos
('Llaga Bucal', 'Lesión ulcerosa en mucosa oral', 'Patología', 'Mucosas', ARRAY['afta', 'úlcera', 'herida'], 'Puede ser traumática, infecciosa o autoinmune', 'tejidos_blandos'),
('Absceso Dental', 'Acumulación de pus por infección', 'Patología', 'Infección', ARRAY['flemón', 'postemilla', 'granito pus'], 'Requiere tratamiento antibiótico y drenaje', 'tejidos_blandos'),
('Mal Aliento', 'Halitosis persistente de origen oral', 'Patología', 'Halitosis', ARRAY['halitosis', 'mal olor boca'], 'Puede indicar enfermedad periodontal', 'tejidos_blandos'),
('Boca Seca', 'Disminución de la producción salival', 'Patología', 'Glándulas', ARRAY['xerostomía', 'poca saliva'], 'Aumenta el riesgo de caries y enfermedad periodontal', 'tejidos_blandos'),

-- Antecedentes Heredofamiliares
('Diabetes Mellitus', 'Enfermedad metabólica que afecta la salud periodontal', 'Antecedentes', 'Endocrino', ARRAY['diabetes', 'azúcar alta'], 'Complica la cicatrización y aumenta riesgo periodontal', 'antecedentes_familiares'),
('Hipertensión Arterial', 'Presión sanguínea elevada que puede complicar tratamientos', 'Antecedentes', 'Cardiovascular', ARRAY['presión alta', 'hipertensión'], 'Puede contraindicar ciertos medicamentos', 'antecedentes_familiares'),
('Cáncer', 'Antecedente oncológico relevante para tratamientos dentales', 'Antecedentes', 'Oncológico', ARRAY['tumor maligno', 'neoplasia'], 'Puede afectar la capacidad de cicatrización', 'antecedentes_familiares'),

-- Hábitos
('Bruxismo', 'Hábito de apretar o rechinar los dientes', 'Hábitos', 'Parafuncional', ARRAY['rechinar dientes', 'apretar dientes'], 'Causa desgaste dental y problemas de ATM', 'habitos'),
('Tabaquismo', 'Hábito de fumar que afecta la salud oral', 'Hábitos', 'Nocivo', ARRAY['fumar', 'cigarrillo'], 'Aumenta el riesgo de enfermedad periodontal y cáncer oral', 'habitos'),
('Onicofagia', 'Hábito de morderse las uñas', 'Hábitos', 'Parafuncional', ARRAY['comerse uñas', 'morderse uñas'], 'Puede causar desgaste y malposición dental', 'habitos');
