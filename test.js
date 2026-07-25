
    /* ============================================================
       DENTAXY TECHNOLOGIES — SCRIPT INTERACTIVO MULTI-DISPOSITIVO
       ============================================================ */

    var patientNameClean = "Juan_Perez";
    var folderNameStr    = "Juan Perez";

    /* Base de Datos Clínica de los 32 Dientes */
    var TOOTH_INFO = {"11":{"state":"S"}, "31":{"state":"S"}};

    var STATE_COLORS = {
      S:'#1D9E75', C:'#EA4335', O:'#1A73E8', EI:'#EA4335', A:'#1A73E8', CR:'#FF6D00',
      PU:'#FF6D00', E:'#1A73E8', IM:'#607D8B', SE:'#F9AB00', F:'#EA4335', MOV:'#FF6D00',
      AOF:'#1A73E8', AOR:'#1A73E8', DES:'#795548', DIA:'#1A73E8', DIS:'#9C27B0',
      ECT:'#607D8B', CLV:'#607D8B', EXT:'#FF6D00', INT:'#FF6D00', GF:'#607D8B',
      GV:'#607D8B', MIG:'#FF6D00', RR:'#EA4335', RT:'#EA4335', OF:'#A52A2A',
      SI:'#F9AB00', SN:'#9C27B0', TR:'#607D8B', PC:'#1A73E8', PP:'#1A73E8'
    };

    var CARIES_LABELS   = { 1:'Grado I — Incipiente de esmalte', 2:'Grado II — Dentina superficial', 3:'Grado III — Dentina profunda', 4:'Grado IV — Compromiso pulpar' };
    var MATERIAL_LABELS = { AM:'Amalgama', R:'Resina compuesta', IV:'Ionómero de vidrio', IM:'Incrustación metálica', IE:'Incrustación estética' };
    var MOBILITY_LABELS = { 1:'Grado I (< 1 mm)', 2:'Grado II (1-2 mm)', 3:'Grado III (> 2 mm / eje vertical)' };

    /* Detección de Visor In-App de WhatsApp */
    (function detectApp() {
      var ua = navigator.userAgent || '';
      if (/WhatsApp|FBAN|FBAV|Instagram|Line/i.test(ua)) {
        var b = document.getElementById('whatsappWarningBanner');
        if (b) b.style.display = 'block';
        if (/Android/i.test(ua) && window.location.protocol.indexOf('http') === 0) {
          try {
            var u = 'intent://' + window.location.href.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end;';
            window.location.href = u;
          } catch(e) {}
        }
      }
    })();

    /* ── 1. MODAL E INSPECTOR DE DIENTE Y RADIOGRAFÍAS ────────────────── */
    window.showToothInfo = function(id) {
      // Resaltar visualmente el diente seleccionado
      document.querySelectorAll('.tooth-container').forEach(function(el) {
        el.classList.remove('selected-tooth');
      });
      var tEl = document.querySelector('.tooth-container[data-tooth="' + id + '"]');
      if (tEl) tEl.classList.add('selected-tooth');

      var info = TOOTH_INFO[id];
      if (!info) return;
      var color = STATE_COLORS[info.state] || '#64748B';
      var isSano = info.state === 'S';
      var extra = '';

      if (info.cariesGrade && CARIES_LABELS[info.cariesGrade]) {
        extra += '<div style="margin-top:8px;padding:8px 12px;background:#FEF2F2;border-radius:8px;font-size:12px;color:#991B1B;"><strong>Grado de Caries:</strong> ' + CARIES_LABELS[info.cariesGrade] + '</div>';
      }
      if (info.materialType && MATERIAL_LABELS[info.materialType]) {
        extra += '<div style="margin-top:6px;padding:8px 12px;background:#EFF6FF;border-radius:8px;font-size:12px;color:#1E40AF;"><strong>Material Restaurador:</strong> ' + MATERIAL_LABELS[info.materialType] + '</div>';
      }
      if (info.mobility && MOBILITY_LABELS[info.mobility]) {
        extra += '<div style="margin-top:6px;padding:8px 12px;background:#FFF7ED;border-radius:8px;font-size:12px;color:#9A3412;"><strong>Movilidad Pieza:</strong> ' + MOBILITY_LABELS[info.mobility] + '</div>';
      }
      if (info.surfaces && info.surfaces !== 'Ninguna específica') {
        extra += '<div style="margin-top:6px;padding:8px 12px;background:#F8FAFC;border-radius:8px;font-size:12px;color:#475569;"><strong>Caras / Superficies Afectadas:</strong> ' + info.surfaces + '</div>';
      }

      // Buscar radiografías asociadas a este diente (ej. OD 16 o por cuadrante)
      var quadStr = 'Q' + Math.floor(id / 10);
      var matchingRads = [];
      document.querySelectorAll('#radsGrid .rad-item').forEach(function(radEl) {
        var teethAttr = radEl.getAttribute('data-teeth') || '';
        var quadsAttr = radEl.getAttribute('data-quads') || '';
        var teethArr  = teethAttr.split(',').filter(Boolean);
        var quadsArr  = quadsAttr.split(',').filter(Boolean);
        var img       = radEl.querySelector('img');
        var nameSpan  = radEl.querySelector('span:last-child');

        if (teethArr.indexOf(String(id)) !== -1 || quadsArr.indexOf(quadStr) !== -1) {
          if (img) matchingRads.push({ src: img.src, name: nameSpan ? nameSpan.innerText : ('Radiografía OD ' + id) });
        }
      });

      var radsBlockHTML = '';
      if (matchingRads.length > 0) {
        radsBlockHTML = '<div style="margin-top:14px;padding:12px;background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;">'
          + '<div style="font-size:11px;font-weight:800;color:#0369A1;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">📁 Radiografía(s) Vinculada(s) (' + matchingRads.length + ')</div>'
          + '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;">'
          + matchingRads.map(function(r) {
            return '<div onclick="openModal(\'' + r.src + '\', \'' + r.name.replace(/'/g, "\\'") + '\')" style="cursor:pointer;flex-shrink:0;text-align:center;">'
              + '<img src="' + r.src + '" style="width:70px;height:55px;object-fit:cover;border-radius:8px;border:1.5px solid #0284C7;" />'
              + '<div style="font-size:9px;color:#0369A1;font-weight:700;margin-top:2px;">Ver Zoom</div></div>';
          }).join('')
          + '</div></div>';
      }

      var html = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">'
        + '<div style="width:48px;height:48px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:900;flex-shrink:0;box-shadow:0 4px 12px ' + color + '40;">' + id + '</div>'
        + '<div><div style="font-size:18px;font-weight:900;color:#0F172A;">Diente Órgano OD ' + id + '</div>'
        + '<div style="font-size:13px;color:#64748B;margin-top:2px;">Arcada ' + (info.arcada || 'Dental') + ' — ' + (info.label || info.state) + '</div></div></div>'
        + (isSano
          ? '<div style="padding:16px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;color:#15803D;font-weight:700;font-size:13px;text-align:center;">✅ Pieza dental sana — sin patologías ni tratamientos registrados.</div>'
          : '<div style="padding:12px 14px;background:' + color + '15;border-radius:12px;border-left:4px solid ' + color + ';font-size:14px;font-weight:800;color:' + color + ';">Diagnóstico / Hallazgo: ' + (info.label || info.state) + '</div>'
            + extra
            + '<div style="margin-top:12px;padding:10px 14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;font-size:11px;color:#92400E;">📋 Consulte los detalles del plan de tratamiento en la Sección VIII del Expediente.</div>')
        + radsBlockHTML
        + '<button onclick="closeToothModal()" style="margin-top:18px;width:100%;padding:14px;background:#0F172A;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:700;cursor:pointer;">Cerrar Ventana</button>';

      var contentEl = document.getElementById('toothModalContent');
      var modalEl   = document.getElementById('toothModal');
      if (contentEl) contentEl.innerHTML = html;
      if (modalEl)   modalEl.style.display = 'flex';
    };

    window.closeToothModal = function() {
      var modalEl = document.getElementById('toothModal');
      if (modalEl) modalEl.style.display = 'none';
    };

    /* ── 2. FILTRADO DE RADIOGRAFÍAS POR CUADRANTE ───────────────────── */
    window.filterRads = function(quad) {
      document.querySelectorAll('.rad-filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === quad);
      });
      document.querySelectorAll('#radsGrid .rad-item').forEach(function(item) {
        if (quad === 'ALL') {
          item.style.display = 'block';
        } else {
          var quadsAttr = item.getAttribute('data-quads') || '';
          item.style.display = (quadsAttr.indexOf(quad) !== -1) ? 'block' : 'none';
        }
      });
    };

    /* ── 3. MODAL RADIOGRAFÍA COMPLEMENTARIA (ZOOM / LIGHTBOX) ────────── */
    window.openModal = function(src, caption) {
      var m = document.getElementById('imgModal');
      var i = document.getElementById('modalImg');
      var c = document.getElementById('modalCaption');
      if (m && i) {
        i.src = src;
        if (c) c.innerText = caption || 'Estudio Radiográfico Adjunto';
        m.style.display = 'flex';
      }
    };
    window.closeImgModal = function() {
      var m = document.getElementById('imgModal');
      if (m) m.style.display = 'none';
    };

    /* ── 4. EXPORTAR PDF Y COMPARTIR ─────────────────────────────────── */
    async function generatePDFBlob() {
      var el = document.querySelector('.page-wrapper');
      var hide = document.querySelectorAll('.no-print');
      hide.forEach(function(n) { n.style.display = 'none'; });
      var opt = {
        margin: [8, 8, 8, 8],
        filename: 'Expediente_Firmado_' + patientNameClean + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      var blob = null;
      try {
        if (typeof html2pdf !== 'undefined')
          blob = await html2pdf().set(opt).from(el).output('blob');
      } catch(e) { console.error(e); }
      finally { hide.forEach(function(n) { n.style.display = ''; }); }
      return blob;
    }

    window.shareOrDownloadPDF = async function() {
      var btn = (event && event.currentTarget) ? event.currentTarget : null;
      var orig = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Generando PDF...'; }
      try {
        var blob = await generatePDFBlob();
        if (!blob) { window.print(); return; }
        var fname = 'Expediente_Firmado_' + patientNameClean + '.pdf';
        var file  = new File([blob], fname, { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'Expediente Clínico — ' + folderNameStr });
        } else {
          var u = URL.createObjectURL(blob); var a = document.createElement('a');
          a.href = u; a.download = fname; a.click();
          setTimeout(function() { URL.revokeObjectURL(u); }, 2500);
          alert('✅ PDF firmado generado correctamente. Puedes compartirlo desde tu carpeta de Descargas.');
        }
      } catch(e) { if (e && e.name !== 'AbortError') { console.error(e); window.print(); } }
      finally { if (btn) { btn.disabled = false; btn.innerHTML = orig; } }
    };

    window.shareViaWhatsApp = async function() {
      var blob = await generatePDFBlob();
      if (blob) {
        var u = URL.createObjectURL(blob); var a = document.createElement('a');
        a.href = u; a.download = 'Expediente_Firmado_' + patientNameClean + '.pdf'; a.click();
        setTimeout(function() { URL.revokeObjectURL(u); }, 2500);
      }
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Hola, envío Expediente Clínico Firmado de ' + folderNameStr + ' (Plataforma Dentaxy).'), '_blank');
    };

    /* ── 5. FIRMA AUTÓGRAFA — Canvas Robusto para PC + Mobile (Pointer Events) ── */
    (function() {
      var canvas, ctx, wrap;
      var isDrawing = false;
      var hasDrawn  = false;
      var lastX = 0, lastY = 0;
      var dpr = 1;

      /* Inicializa el canvas DESPUÉS de que el DOM haya pintado y el wrap tenga px reales */
      function setupCanvas() {
        canvas = document.getElementById('sigCanvas');
        wrap   = document.getElementById('sigCanvasWrap');
        if (!canvas || !wrap) return;

        dpr = window.devicePixelRatio || 1;

        /* Altura fija del lienzo: 200 px lógicos */
        var logicalW = wrap.clientWidth  || 300;
        var logicalH = 200;

        /* Ajustar el wrapper para que tenga altura visible */
        wrap.style.height = logicalH + 'px';

        /* Canvas en píxeles físicos para Retina/HDPI */
        canvas.width  = Math.round(logicalW * dpr);
        canvas.height = Math.round(logicalH * dpr);
        canvas.style.width  = logicalW + 'px';
        canvas.style.height = logicalH + 'px';

        ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        setCtxStyle();

        attachEvents();
      }

      function setCtxStyle() {
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth   = 3;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
      }

      /* Coordenadas corregidas relativas al canvas */
      function getXY(e) {
        var rect = canvas.getBoundingClientRect();
        var x, y;
        if (e.clientX !== undefined) {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else if (e.touches && e.touches.length > 0) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = lastX; y = lastY;
        }
        return { x: x, y: y };
      }

      function onStart(e) {
        e.preventDefault();
        isDrawing = true;
        hasDrawn  = true;
        var ph = document.getElementById('sigPlaceholder');
        if (ph) ph.style.opacity = '0';
        if (e.pointerId !== undefined) {
          try { canvas.setPointerCapture(e.pointerId); } catch(_) {}
        }
        var p = getXY(e);
        lastX = p.x; lastY = p.y;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
      }

      function onMove(e) {
        if (!isDrawing) return;
        e.preventDefault();
        var p = getXY(e);
        var mx = (lastX + p.x) / 2;
        var my = (lastY + p.y) / 2;
        ctx.quadraticCurveTo(lastX, lastY, mx, my);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mx, my);
        lastX = p.x; lastY = p.y;
      }

      function onEnd(e) {
        if (!isDrawing) return;
        isDrawing = false;
        ctx.closePath();
        if (e && e.pointerId !== undefined) {
          try { canvas.releasePointerCapture(e.pointerId); } catch(_) {}
        }
      }

      function attachEvents() {
        var opts = { passive: false };
        if (window.PointerEvent) {
          canvas.addEventListener('pointerdown',   onStart, opts);
          canvas.addEventListener('pointermove',   onMove,  opts);
          canvas.addEventListener('pointerup',     onEnd,   opts);
          canvas.addEventListener('pointercancel', onEnd,   opts);
        } else {
          canvas.addEventListener('mousedown', onStart, false);
          canvas.addEventListener('mousemove', onMove,  false);
          window.addEventListener('mouseup',   onEnd,   false);
          canvas.addEventListener('touchstart', onStart, opts);
          canvas.addEventListener('touchmove',  onMove,  opts);
          canvas.addEventListener('touchend',   onEnd,   opts);
          canvas.addEventListener('touchcancel',onEnd,   opts);
        }
      }

      /* Limpiar trazo */
      document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btnClear') {
          if (!canvas) return;
          ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
          hasDrawn = false;
          ctx.beginPath();
          setCtxStyle();
          var ph = document.getElementById('sigPlaceholder');
          if (ph) ph.style.opacity = '0.5';
        }
      });

      /* Guardar y sellar */
      document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btnSave') {
          var nameEl = document.getElementById('sigName');
          var idEl   = document.getElementById('sigId');
          var name   = nameEl ? nameEl.value.trim() : '';
          var idS    = idEl   ? idEl.value.trim()   : '';
          if (!name)    { alert('Por favor, ingrese su nombre completo antes de sellar.'); return; }
          if (!hasDrawn){ alert('Por favor, dibuje su firma antes de guardar.'); return; }

          var sig = canvas.toDataURL('image/png');
          var sc  = document.getElementById('signatureContainer');
          if (sc) sc.style.display = 'none';
          var li  = document.getElementById('lockedSigImg');  if (li)  li.src = sig;
          var ln  = document.getElementById('lockedSigName'); if (ln)  ln.innerText = name;
          var lid = document.getElementById('lockedSigId');   if (lid) lid.innerText = idS ? 'ID: ' + idS : '';
          var ld  = document.getElementById('lockedSigDate'); if (ld)  ld.innerText = 'Fecha de Firma: ' + new Date().toLocaleString('es-MX');
          var lb  = document.getElementById('lockedSignature'); if (lb) lb.style.display = 'block';
          /* Scroll suave a la sección de firma sellada */
          if (lb) lb.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      /* Ejecutar cuando el DOM esté listo y el layout pintado */
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          requestAnimationFrame(setupCanvas);
        });
      } else {
        requestAnimationFrame(setupCanvas);
      }
    }());
  