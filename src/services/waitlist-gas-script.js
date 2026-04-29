/**
 * ═══════════════════════════════════════════════════════════════════
 * DENTAXY WAITLIST — Google Apps Script v2.1
 * ═══════════════════════════════════════════════════════════════════
 *
 * Flujo:
 *  1. Cliente envía POST (Content-Type: text/plain, mode: no-cors)
 *  2. doPost() parsea el JSON del body
 *  3. saveToSheet() guarda el lead en la hoja correspondiente
 *  4. sendConfirmationEmail() envía email de bienvenida al lead
 *  5. sendAdminNotification() notifica al admin internamente
 *
 * Deploy URL v3.0 (PRODUCCIÓN):
 *   https://script.google.com/macros/s/AKfycbzl6GEDxzlJddLzqJbq8ApTlLoNBOo5W2OOFEvIAKA7yu80aXSKZqjw4YP3w5brh7Pe/exec
 *
 * Implementar: Extensiones > Apps Script > Implementar > Nueva implementación
 *   - Tipo: Aplicación web
 *   - Ejecutar como: Yo (bz1000@dentaxy.com)
 *   - Quién tiene acceso: Cualquier usuario
 *
 * IMPORTANTE: Cada vez que modifiques este script, crea una
 *   NUEVA IMPLEMENTACIÓN (no actualices la existente) para obtener
 *   el mismo URL y evitar caché de versiones antiguas.
 * ═══════════════════════════════════════════════════════════════════
 */

// ─── Configuración Central ─────────────────────────────────────────────────

/** ID del Google Spreadsheet donde se guardan los leads.
 *  Obtener de la URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit */
var SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

/** Email del administrador para notificaciones internas */
var ADMIN_EMAIL = 'bz1000@dentaxy.com';

/** Nombre del remitente en los correos */
var SENDER_NAME = 'Dentaxy Technologies';

/** Dominio principal (para links en los emails) */
var DENTAXY_URL = 'https://dentaxy.com';

// ─── Configuración visual por módulo ──────────────────────────────────────

var MODULE_CONFIG = {
  'Seed': {
    color: '#2563EB',
    emoji: '🌱',
    tagline: 'El software que transforma tu práctica clínica',
    description: 'Dentaxy Seed es el punto de partida de tu consultorio digital. Generación de historias clínicas con el motor neuronal de Dentaxy, sin papel, sin complicaciones.',
    ctaText: 'Aprender más sobre Seed',
    ctaUrl: 'https://dentaxy.com/seed',
    sheet: 'Seed',
  },
  'Shop': {
    color: '#16A34A',
    emoji: '🛒',
    tagline: 'Insumos dentales al mejor precio, directo a tu consultorio',
    description: 'Dentaxy Shop es tu marketplace de insumos dentales. Precios preferenciales, logística integrada y entrega directa a tu clínica.',
    ctaText: 'Explorar Dentaxy Shop',
    ctaUrl: 'https://dentaxy.com/shop',
    sheet: 'Shop',
  },
  'Lab': {
    color: '#7C3AED',
    emoji: '🔬',
    tagline: 'Tu puente digital con el laboratorio',
    description: 'Dentaxy Lab conecta tu consultorio con laboratorios de protésica. Gestión de trabajos, envío de archivos 3D y comunicación directa, sin llamadas ni papeles.',
    ctaText: 'Conocer Dentaxy Lab',
    ctaUrl: 'https://dentaxy.com/lab',
    sheet: 'Lab',
  },
  'Club': {
    color: '#EA580C',
    emoji: '👥',
    tagline: 'La comunidad del gremio dental mexicano',
    description: 'Dentaxy Club es tu red profesional. Debate casos clínicos, haz networking real y crece con el gremio odontológico en tiempo real.',
    ctaText: 'Unirme a Dentaxy Club',
    ctaUrl: 'https://dentaxy.com/club',
    sheet: 'Club',
  },
  'News': {
    color: '#0284C7',
    emoji: '📰',
    tagline: 'El pulso de la odontología moderna',
    description: 'Dentaxy News filtra por ti las noticias, tendencias globales y actualizaciones científicas más relevantes. Solo lo que importa, cuando importa.',
    ctaText: 'Ver Dentaxy News',
    ctaUrl: 'https://dentaxy.com/news',
    sheet: 'News',
  },
  'Aura': {
    color: '#D97706',
    emoji: '🏆',
    tagline: 'Tu portafolio de prestigio profesional',
    description: 'Dentaxy Aura es el altar digital de tu carrera. Exhibe títulos, certificaciones, especialidades y casos de éxito con la credibilidad que mereces.',
    ctaText: 'Construir mi Aura',
    ctaUrl: 'https://dentaxy.com/aura',
    sheet: 'Aura',
  },
  'Space': {
    color: '#DB2777',
    emoji: '🌐',
    tagline: 'Tu consultorio en la nube',
    description: 'Dentaxy Space genera tu página web profesional en minutos. Diseño premium, totalmente integrada con tu agenda Seed, sin código.',
    ctaText: 'Crear mi Space',
    ctaUrl: 'https://dentaxy.com/space',
    sheet: 'Space',
  },
  'MyLana': {
    color: '#65A30D',
    emoji: '💰',
    tagline: 'Tu control financiero con flow',
    description: 'Dentaxy MyLana te da visibilidad total sobre tus finanzas clínicas. Ingresos, egresos, honorarios y proyecciones de crecimiento, en un solo lugar.',
    ctaText: 'Controlar mis finanzas',
    ctaUrl: 'https://dentaxy.com/mylana',
    sheet: 'MyLana',
  },
};

/** Configuración por defecto para módulos no reconocidos o múltiples */
var MODULE_DEFAULT = {
  color: '#10B981',
  emoji: '✨',
  tagline: 'El ecosistema odontológico más avanzado de México',
  description: 'Dentaxy Technologies está revolucionando la odontología con tecnología propietaria que reemplaza el papel y optimiza cada aspecto de tu práctica clínica.',
  ctaText: 'Explorar el ecosistema Dentaxy',
  ctaUrl: 'https://dentaxy.com',
  sheet: 'General',
};

// ─── Punto de entrada POST ─────────────────────────────────────────────────

/**
 * Manejador principal. Recibe el lead o prospecto, lo guarda y envía emails.
 * Compatible con mode: 'no-cors' del frontend (no requiere headers CORS).
 */
function doPost(e) {
  try {
    // Parsear el JSON del body (enviado como text/plain)
    var rawBody = e.postData ? e.postData.contents : '{}';
    var data = JSON.parse(rawBody);

    var timestamp = new Date();

    // Detección de tipo de payload: "prospecto_seed" vs "waitlist"
    if (data.type === 'prospecto_seed') {
      // 1. Manejo de archivos a Drive
      var folderName = "Dentaxy Seed / Prospectos / " + data.nombre;
      var folder = getOrCreateFolder(folderName);
      var logoUrl = "—";
      var historiaUrl = "—";

      if (data.logoBase64) {
        var logoBlob = Utilities.newBlob(Utilities.base64Decode(data.logoBase64), data.logoMime, data.logoNombre);
        var logoFile = folder.createFile(logoBlob);
        logoUrl = logoFile.getUrl();
      }
      if (data.historiaBase64) {
        var historiaBlob = Utilities.newBlob(Utilities.base64Decode(data.historiaBase64), data.historiaMime, data.historiaNombre);
        var historiaFile = folder.createFile(historiaBlob);
        historiaUrl = historiaFile.getUrl();
      }

      // 2. Guardar en Sheet
      saveProspectToSheet(data, logoUrl, historiaUrl, timestamp);

      // 3. Notificar Admin
      sendProspectAdminNotification(data, logoUrl, historiaUrl, timestamp);

      return jsonResponse({ success: true, timestamp: timestamp.toISOString() });
    }

    // Flujo normal de Waitlist
    // Validación básica
    if (!data.email || !data.nombre) {
      return jsonResponse({ success: false, error: 'Datos incompletos: nombre y email son requeridos.' });
    }

    // 1. Guardar lead en el Sheet
    saveToSheet(data, timestamp);

    // 2. Enviar email de confirmación al lead
    sendConfirmationEmail(data, timestamp);

    // 3. Notificar al admin
    sendAdminNotification(data, timestamp);

    return jsonResponse({ success: true, timestamp: timestamp.toISOString() });

  } catch (err) {
    console.error('[Dentaxy Waitlist] Error en doPost:', err.toString());
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ─── Funciones para Prospectos Seed (Onboarding) ─────────────────────────

function getOrCreateFolder(folderPath) {
  var parts = folderPath.split('/');
  var parent = DriveApp.getRootFolder();
  for (var i = 0; i < parts.length; i++) {
    var name = parts[i].trim();
    if (!name) continue;
    var folders = parent.getFoldersByName(name);
    if (folders.hasNext()) {
      parent = folders.next();
    } else {
      parent = parent.createFolder(name);
    }
  }
  return parent;
}

function saveProspectToSheet(data, logoUrl, historiaUrl, timestamp) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheetName = 'Prospectos Seed';
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = ['Timestamp', 'Nombre', 'Email', 'Especialidad', 'Clínica', 'Subdominio', 'Logo URL', 'Historia URL'];
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#2563EB');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    timestamp,
    data.nombre,
    data.email,
    data.especialidad,
    data.clinica,
    data.subdominio,
    logoUrl,
    historiaUrl
  ]);
}

function sendProspectAdminNotification(data, logoUrl, historiaUrl, timestamp) {
  try {
    var fechaStr = Utilities.formatDate(timestamp, 'America/Mexico_City', 'dd/MM/yyyy HH:mm:ss');
    var subject = '🌱 Nuevo Prospecto Seed Onboarding — ' + data.nombre;
    var body = [
      '══════════════════════════════════',
      'NUEVO PROSPECTO DENTAXY SEED',
      '══════════════════════════════════',
      '',
      '📅 Fecha: ' + fechaStr,
      '👤 Doctor: ' + data.nombre,
      '📧 Email: ' + data.email,
      '🦷 Especialidad: ' + data.especialidad,
      '🏥 Clínica: ' + data.clinica,
      '🌐 Subdominio Elegido: ' + data.subdominio + '.dentaxy.com',
      '',
      '📁 Archivos en Drive:',
      '- Logo: ' + logoUrl,
      '- Historia Clínica: ' + historiaUrl,
      '══════════════════════════════════',
    ].join('\n');

    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      body: body,
      name: 'Dentaxy Seed Bot',
    });
  } catch(e) {}
}

/** Para pruebas GET desde el navegador */
function doGet(e) {
  return HtmlService.createHtmlOutput(
    '<h2>✅ Dentaxy Waitlist API v2.1</h2>' +
    '<p>El endpoint está activo. Usa POST para registrar leads.</p>' +
    '<p><b>Timestamp:</b> ' + new Date().toISOString() + '</p>'
  );
}

// ─── Guardar en Google Sheet ───────────────────────────────────────────────

/**
 * Guarda el lead en la hoja correspondiente al módulo.
 * Si la hoja no existe, la crea automáticamente con cabeceras.
 */
function saveToSheet(data, timestamp) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Determinar el nombre de la hoja según el módulo
  // Si hay múltiples módulos, usar 'General'
  var moduleName = data.modulo || 'General';
  var modules = moduleName.split(',').map(function(m) { return m.trim(); });
  var sheetName = modules.length === 1 && MODULE_CONFIG[modules[0]]
    ? MODULE_CONFIG[modules[0]].sheet
    : 'General';

  var sheet = ss.getSheetByName(sheetName);

  // Crear la hoja si no existe
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Agregar cabeceras
    var headers = [
      'Timestamp', 'Nombre', 'Email', 'Teléfono', 'Módulo(s)',
      'Tiene Historia Clínica', 'Nombre Archivo', 'Email Enviado'
    ];
    sheet.appendRow(headers);

    // Dar formato a las cabeceras
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1e293b');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180); // Timestamp
    sheet.setColumnWidth(2, 200); // Nombre
    sheet.setColumnWidth(3, 220); // Email
    sheet.setColumnWidth(4, 130); // Telefono
    sheet.setColumnWidth(5, 200); // Módulo
  }

  // Verificar si el email ya existe (deduplicación)
  var existingData = sheet.getDataRange().getValues();
  for (var i = 1; i < existingData.length; i++) {
    if (existingData[i][2] === data.email && existingData[i][4] === moduleName) {
      console.log('[Dentaxy Waitlist] Lead duplicado detectado:', data.email, '- Módulo:', moduleName);
      // No guardamos duplicado pero sí enviamos el email
      return;
    }
  }

  // Insertar la fila del nuevo lead
  var tieneArchivo = data.archivoData ? 'Sí' : 'No';
  var nombreArchivo = data.archivoNombre || '—';

  sheet.appendRow([
    timestamp,
    data.nombre,
    data.email,
    data.telefono || '—',
    moduleName,
    tieneArchivo,
    nombreArchivo,
    'Enviando...',  // Se actualiza después del envío
  ]);

  // Dar formato a la fila nueva (alternado)
  var lastRow = sheet.getLastRow();
  var isOdd = (lastRow % 2 === 0);
  if (isOdd) {
    sheet.getRange(lastRow, 1, 1, 8).setBackground('#f8fafc');
  }

  console.log('[Dentaxy Waitlist] Lead guardado en hoja:', sheetName, '| Email:', data.email);
}

/**
 * Actualiza la columna "Email Enviado" para el lead recién guardado.
 */
function markEmailSent(email, moduleName, status) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    var modules = (moduleName || '').split(',').map(function(m) { return m.trim(); });
    var sheetName = modules.length === 1 && MODULE_CONFIG[modules[0]]
      ? MODULE_CONFIG[modules[0]].sheet
      : 'General';

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;

    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][2] === email) {
        sheet.getRange(i + 1, 8).setValue(status); // Columna H = Email Enviado
        break;
      }
    }
  } catch (err) {
    console.error('[Dentaxy Waitlist] Error actualizando markEmailSent:', err);
  }
}

// ─── Email de Confirmación al Lead ────────────────────────────────────────

/**
 * Envía un email de bienvenida al lead.
 * Personalizado por módulo con íconos, colores y CTAs relevantes.
 */
function sendConfirmationEmail(data, timestamp) {
  try {
    var email = data.email;
    var nombre = data.nombre;
    var moduloRaw = data.modulo || 'Dentaxy';

    // Determinar configuración del módulo
    var modules = moduloRaw.split(',').map(function(m) { return m.trim(); });
    var config = modules.length === 1 && MODULE_CONFIG[modules[0]]
      ? MODULE_CONFIG[modules[0]]
      : MODULE_DEFAULT;

    // Si hay múltiples módulos, personalizar el mensaje
    var moduloDisplay = modules.length > 1
      ? modules.join(' + ')
      : moduloRaw;

    var subject = config.emoji + ' ' + nombre.split(' ')[0] + ', tu lugar en Dentaxy ' +
      (modules.length === 1 ? modules[0] : 'está reservado');

    var htmlBody = buildConfirmationEmailHtml(nombre, moduloDisplay, modules, config, timestamp);
    var plainText = buildConfirmationEmailPlain(nombre, moduloDisplay, config);

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: plainText,
      htmlBody: htmlBody,
      name: SENDER_NAME,
      replyTo: ADMIN_EMAIL,
    });

    console.log('[Dentaxy Waitlist] Email de confirmación enviado a:', email);
    markEmailSent(email, moduloRaw, 'Sí ✅ ' + Utilities.formatDate(timestamp, 'America/Mexico_City', 'HH:mm'));
  } catch (err) {
    console.error('[Dentaxy Waitlist] Error enviando confirmación a:', data.email, err.toString());
    markEmailSent(data.email, data.modulo, 'Error ❌');
  }
}

// ─── Email de Notificación al Admin ───────────────────────────────────────

/**
 * Envía una notificación interna al admin con todos los datos del lead.
 */
function sendAdminNotification(data, timestamp) {
  try {
    var fechaStr = Utilities.formatDate(timestamp, 'America/Mexico_City', 'dd/MM/yyyy HH:mm:ss');
    var tieneArchivo = data.archivoData ? '✅ Sí — ' + (data.archivoNombre || 'sin nombre') : '❌ No';

    var subject = '🔔 Nuevo Lead Waitlist — ' + data.modulo + ' | ' + data.nombre;
    var body = [
      '══════════════════════════════════',
      'DENTAXY WAITLIST — NUEVO LEAD',
      '══════════════════════════════════',
      '',
      '📅 Fecha: ' + fechaStr + ' (CDMX)',
      '👤 Nombre: ' + data.nombre,
      '📧 Email: ' + data.email,
      '📱 Teléfono: ' + (data.telefono || 'No proporcionado'),
      '📦 Módulo(s): ' + data.modulo,
      '📄 Historia Clínica: ' + tieneArchivo,
      '',
      '──────────────────────────────────',
      'Ver Sheet de leads:',
      'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID,
      '══════════════════════════════════',
    ].join('\n');

    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      body: body,
      name: 'Dentaxy Waitlist Bot',
    });

    console.log('[Dentaxy Waitlist] Notificación admin enviada.');
  } catch (err) {
    console.error('[Dentaxy Waitlist] Error enviando notificación admin:', err.toString());
    // No relanzamos — no debe bloquear el flujo principal
  }
}

// ─── Builders de HTML ─────────────────────────────────────────────────────

/**
 * Construye el HTML del email de confirmación.
 * Diseño responsivo, compatible con Gmail, Outlook y Apple Mail.
 */
function buildConfirmationEmailHtml(nombre, moduloDisplay, modules, config, timestamp) {
  var primerNombre = nombre.split(' ')[0];
  var anio = timestamp.getFullYear();

  // Construir lista de módulos si hay múltiples
  var modulesListHtml = '';
  if (modules.length > 1) {
    modulesListHtml = '<div style="margin: 16px 0;">';
    modules.forEach(function(mod) {
      var mc = MODULE_CONFIG[mod] || MODULE_DEFAULT;
      modulesListHtml += [
        '<div style="display:inline-block; margin: 4px; padding: 6px 14px;',
        'background:' + mc.color + '15; border: 1px solid ' + mc.color + '30;',
        'border-radius:20px; color:' + mc.color + '; font-size:13px; font-weight:600;">',
        mc.emoji + ' ' + mod,
        '</div>',
      ].join('');
    });
    modulesListHtml += '</div>';
  }

  return [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>Dentaxy — Tu lugar está reservado</title>',
    '</head>',
    '<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif;">',

    '  <!-- Wrapper -->',
    '  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9; padding: 40px 20px;">',
    '    <tr><td align="center">',

    '    <!-- Card principal -->',
    '    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">',

    '      <!-- Header con color del módulo -->',
    '      <tr>',
    '        <td style="background: linear-gradient(135deg, ' + config.color + ', ' + config.color + 'cc); padding: 40px 40px 32px; text-align:center;">',
    '          <!-- Logo / Nombre -->',
    '          <div style="display:inline-block; background: rgba(255,255,255,0.2); border-radius:16px; padding: 10px 20px; margin-bottom:20px;">',
    '            <span style="color:#ffffff; font-size:13px; font-weight:800; letter-spacing:3px; text-transform:uppercase;">DENTAXY TECHNOLOGIES</span>',
    '          </div>',
    '          <!-- Emoji grande del módulo -->',
    '          <div style="font-size:52px; margin: 8px 0;">' + config.emoji + '</div>',
    '          <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; line-height:1.2;">',
    '            ¡Tu lugar está<br>reservado, ' + primerNombre + '!',
    '          </h1>',
    '          <p style="margin: 12px 0 0; color:rgba(255,255,255,0.85); font-size:16px; line-height:1.5;">',
    '            ' + config.tagline,
    '          </p>',
    '        </td>',
    '      </tr>',

    '      <!-- Cuerpo -->',
    '      <tr>',
    '        <td style="padding: 36px 40px;">',

    '          <!-- Confirmación de módulo -->',
    '          <div style="background:' + config.color + '08; border:1px solid ' + config.color + '20; border-radius:16px; padding:20px; margin-bottom:28px;">',
    '            <p style="margin:0 0 6px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:' + config.color + ';">',
    '              Módulo(s) en tu lista de espera',
    '            </p>',
    '            <p style="margin:0; font-size:22px; font-weight:800; color:#0f172a;">',
    '              ' + config.emoji + ' Dentaxy ' + moduloDisplay,
    '            </p>',
    '            ' + (modulesListHtml || ''),
    '          </div>',

    '          <!-- Descripción del módulo -->',
    '          <p style="margin:0 0 24px; font-size:16px; line-height:1.7; color:#475569;">',
    '            ' + config.description,
    '          </p>',

    '          <!-- Datos registrados -->',
    '          <div style="background:#f8fafc; border-radius:16px; padding:20px; margin-bottom:28px;">',
    '            <p style="margin:0 0 12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94a3b8;">Datos registrados</p>',
    '            <table width="100%" cellpadding="0" cellspacing="0">',
    '              <tr>',
    '                <td style="padding:4px 0; font-size:13px; color:#64748b; width:30%;">Nombre</td>',
    '                <td style="padding:4px 0; font-size:13px; color:#0f172a; font-weight:600;">' + nombre + '</td>',
    '              </tr>',
    '              <tr>',
    '                <td style="padding:4px 0; font-size:13px; color:#64748b;">Módulo(s)</td>',
    '                <td style="padding:4px 0; font-size:13px; color:#0f172a; font-weight:600;">' + moduloDisplay + '</td>',
    '              </tr>',
    '              <tr>',
    '                <td style="padding:4px 0; font-size:13px; color:#64748b;">Lista</td>',
    '                <td style="padding:4px 0; font-size:13px; color:#16a34a; font-weight:600;">✅ Confirmado</td>',
    '              </tr>',
    '            </table>',
    '          </div>',

    '          <!-- Qué sigue -->',
    '          <div style="margin-bottom:28px;">',
    '            <p style="margin:0 0 16px; font-size:15px; font-weight:700; color:#0f172a;">¿Qué sigue?</p>',
    '            <div style="display:flex; flex-direction:column; gap:12px;">',
    buildStepHtml('1', config.color, 'Acceso anticipado', 'Recibirás una invitación exclusiva antes del lanzamiento oficial.'),
    buildStepHtml('2', config.color, 'Precio fundador', 'Los primeros en la lista obtienen condiciones especiales garantizadas.'),
    buildStepHtml('3', config.color, 'Soporte prioritario', 'Tu onboarding será guiado por el equipo Dentaxy directamente.'),
    '            </div>',
    '          </div>',

    '          <!-- CTA -->',
    '          <div style="text-align:center; margin: 32px 0 8px;">',
    '            <a href="' + config.ctaUrl + '"',
    '               style="display:inline-block; background:' + config.color + '; color:#ffffff; text-decoration:none;',
    '                      font-size:15px; font-weight:700; padding: 14px 32px; border-radius:14px;',
    '                      letter-spacing:0.3px; box-shadow: 0 4px 12px ' + config.color + '40;">',
    '              ' + config.ctaText + ' →',
    '            </a>',
    '          </div>',

    '        </td>',
    '      </tr>',

    '      <!-- Footer -->',
    '      <tr>',
    '        <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:24px 40px; text-align:center;">',
    '          <p style="margin:0 0 8px; font-size:12px; color:#94a3b8;">',
    '            © ' + anio + ' Dentaxy Technologies · Zacatecas, México',
    '          </p>',
    '          <p style="margin:0; font-size:11px; color:#cbd5e1;">',
    '            Recibiste este correo porque te registraste en la lista de espera de Dentaxy.<br>',
    '            <a href="' + DENTAXY_URL + '/privacy" style="color:#94a3b8; text-decoration:underline;">Política de Privacidad</a>',
    '            &nbsp;·&nbsp;',
    '            <a href="' + DENTAXY_URL + '/terms" style="color:#94a3b8; text-decoration:underline;">Términos</a>',
    '          </p>',
    '        </td>',
    '      </tr>',

    '    </table>',
    '    </td></tr>',
    '  </table>',
    '</body>',
    '</html>',
  ].join('\n');
}

/**
 * Construye un paso numerado en el email.
 */
function buildStepHtml(num, color, title, description) {
  return [
    '<div style="display:flex; align-items:flex-start; gap:14px; padding:12px; background:#f8fafc; border-radius:12px; margin-bottom:8px;">',
    '  <div style="min-width:28px; height:28px; background:' + color + '; border-radius:50%; display:flex; align-items:center; justify-content:center; text-align:center; flex-shrink:0;">',
    '    <span style="color:#fff; font-size:13px; font-weight:800; line-height:28px; display:block; width:28px;">' + num + '</span>',
    '  </div>',
    '  <div>',
    '    <p style="margin:0 0 2px; font-size:14px; font-weight:700; color:#0f172a;">' + title + '</p>',
    '    <p style="margin:0; font-size:13px; color:#64748b; line-height:1.5;">' + description + '</p>',
    '  </div>',
    '</div>',
  ].join('');
}

/**
 * Versión de texto plano del email (fallback para clientes sin HTML).
 */
function buildConfirmationEmailPlain(nombre, moduloDisplay, config) {
  var primerNombre = nombre.split(' ')[0];
  return [
    '¡Hola ' + primerNombre + '!',
    '',
    'Tu lugar en Dentaxy ' + moduloDisplay + ' está confirmado.',
    '══════════════════════════════════',
    '',
    config.tagline,
    '',
    config.description,
    '',
    '¿QUÉ SIGUE?',
    '1. Recibirás una invitación exclusiva antes del lanzamiento oficial.',
    '2. Los primeros en la lista obtienen condiciones especiales garantizadas.',
    '3. Tu onboarding será guiado por el equipo Dentaxy directamente.',
    '',
    '→ ' + config.ctaText + ': ' + config.ctaUrl,
    '',
    '──────────────────────────────────',
    '© Dentaxy Technologies · Zacatecas, México',
    'Política de Privacidad: https://dentaxy.com/privacy',
    '══════════════════════════════════',
  ].join('\n');
}

// ─── Utilidades ────────────────────────────────────────────────────────────

/**
 * Retorna una respuesta JSON estándar.
 * Nota: con mode: 'no-cors' el cliente no puede leer esta respuesta,
 * pero GAS la genera correctamente para futuros usos con CORS configurado.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Función de prueba manual ──────────────────────────────────────────────

/**
 * Ejecuta desde el editor de Apps Script para probar sin el frontend.
 * Cambia los datos según necesites. No la uses en producción.
 */
function testWaitlistFlow() {
  var mockData = {
    nombre: 'Dr. Juan Pérez',
    email: ADMIN_EMAIL,  // Se envía al admin para no spamear clientes reales
    telefono: '+52 555 123 4567',
    modulo: 'Seed',
    archivoNombre: null,
    archivoData: null,
  };

  var timestamp = new Date();

  console.log('=== INICIANDO TEST WAIRLIST ===');
  console.log('Datos:', JSON.stringify(mockData));

  saveToSheet(mockData, timestamp);
  console.log('✅ saveToSheet OK');

  sendConfirmationEmail(mockData, timestamp);
  console.log('✅ sendConfirmationEmail OK');

  sendAdminNotification(mockData, timestamp);
  console.log('✅ sendAdminNotification OK');

  console.log('=== TEST COMPLETADO ===');
}

/**
 * Prueba con múltiples módulos.
 */
function testMultipleModules() {
  var mockData = {
    nombre: 'Dra. María González',
    email: ADMIN_EMAIL,
    telefono: '+52 492 100 0000',
    modulo: 'Seed, Lab, MyLana',
    archivoNombre: null,
    archivoData: null,
  };

  sendConfirmationEmail(mockData, new Date());
}
