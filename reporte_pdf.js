// ============================================================================
// ACTUALIZACIÓN 4 V3 (reporte_pdf.js): GENERADOR DE REPORTE QUIRÚRGICO EN PDF
// Lectura directa y sincronizada de los datos del paciente (Nombre, ID, Edad)
// ============================================================================

(function() {
    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            pdf_btn_hdr: "📄 Surgical Report (PDF)",
            pdf_modal_title: "📄 Generate Surgical Planning Report (PDF)",
            pdf_pat_sec: "Patient Data (Synced with 👤):",
            pdf_doc_lbl: "Surgeon Name & Specialty:",
            pdf_cli_lbl: "Medical Center / Institution:",
            pdf_not_lbl: "Surgical Plan & Clinical Notes (ARS / Chart):",
            pdf_gen_btn: "🖨️ Generate Printable / Save as PDF Report"
        });
        Object.assign(I18N.es, {
            pdf_btn_hdr: "📄 Reporte Quirúrgico (PDF)",
            pdf_modal_title: "📄 Generar Reporte de Planificación Quirúrgica (PDF)",
            pdf_pat_sec: "Datos del Paciente (Sincronizados con 👤):",
            pdf_doc_lbl: "Nombre del Cirujano / Especialidad:",
            pdf_cli_lbl: "Centro Médico / Institución:",
            pdf_not_lbl: "Plan Quirúrgico y Notas Clínicas (Historia / ARS):",
            pdf_gen_btn: "🖨️ Generar Vista de Impresión / Guardar PDF"
        });
    }

    // 1. EXTRACTOR INTELIGENTE DE LOS DATOS DEL PACIENTE DESDE EL MODAL 👤
    function extractPatientDataFromApp() {
        let name = '', id = '', age = '';

        // A. Buscar en variables globales si existen
        if (typeof patientData === 'object' && patientData !== null) {
            name = patientData.name || patientData.nombre || '';
            id   = patientData.id || patientData.dni || patientData.cedula || patientData.hc || '';
            age  = patientData.age || patientData.edad || '';
        }

        // B. Buscar por IDs directos de inputs o textos en el DOM
        const tryVal = (ids) => {
            for (let i of ids) {
                const el = document.getElementById(i);
                if (el) {
                    const v = (el.value !== undefined ? el.value : el.innerText || '').trim();
                    if (v && v !== '-' && v !== 'N/A') return v;
                }
            }
            return '';
        };

        if (!name) name = tryVal(['pat-name', 'patient-name', 'p-name', 'inp-pat-name', 'display-name', 'patName']);
        if (!id)   id   = tryVal(['pat-id', 'patient-id', 'p-id', 'pat-dni', 'pat-cedula', 'pat-hc', 'display-id', 'patId']);
        if (!age)  age  = tryVal(['pat-age', 'patient-age', 'p-age', 'inp-pat-age', 'display-age', 'patAge']);

        // C. Buscar directamente todos los inputs dentro de #patient-modal (por si tienen otros IDs)
        const patModal = document.getElementById('patient-modal') || document.querySelector('[id*="patient"]');
        if (patModal) {
            const inputs = Array.from(patModal.querySelectorAll('input, select'));
            inputs.forEach(inp => {
                const val = (inp.value || '').trim();
                if (!val) return;
                const hint = ((inp.id || '') + ' ' + (inp.name || '') + ' ' + (inp.placeholder || '') + ' ' + (inp.previousElementSibling?.innerText || '')).toLowerCase();
                if (!name && /name|nombre|pacient/i.test(hint)) name = val;
                else if (!id && /id|cédula|cedula|dni|hc|hist|doc|exped/i.test(hint)) id = val;
                else if (!age && /age|edad|año|yr/i.test(hint)) age = val;
            });
            // Si aún falta alguno y hay exactamente 2 o 3 inputs con texto en el modal del paciente, tomarlos en orden
            if (!name && !id && !age && inputs.length >= 2) {
                if (inputs[0]?.value) name = inputs[0].value.trim();
                if (inputs[1]?.value) id   = inputs[1].value.trim();
                if (inputs[2]?.value) age  = inputs[2].value.trim();
            }
        }

        return { name, id, age };
    }

    // Sincronizar de vuelta hacia los inputs del modal 👤 si el usuario los edita en el modal PDF
    function syncPatientDataBackToApp(name, id, age) {
        const setIfFound = (ids, val) => {
            ids.forEach(i => {
                const el = document.getElementById(i);
                if (el) {
                    if (el.value !== undefined) el.value = val;
                    else el.innerText = val || '-';
                }
            });
        };
        setIfFound(['pat-name', 'patient-name', 'p-name', 'display-name'], name);
        setIfFound(['pat-id', 'patient-id', 'p-id', 'pat-dni', 'pat-cedula', 'display-id'], id);
        setIfFound(['pat-age', 'patient-age', 'p-age', 'display-age'], age);
        if (typeof savePatientData === 'function') {
            try { savePatientData(); } catch (e) {}
        }
    }

    // 2. AGREGAR BOTÓN 📄 EN LA BARRA SUPERIOR Y DENTRO DEL MODAL DE GUARDADO
    function injectPdfButtons() {
        const btnSave = document.querySelector('button[onclick="openSaveModal()"]');
        if (btnSave && !document.getElementById('btn-top-pdf')) {
            const btnPdf = document.createElement('button');
            btnPdf.id = 'btn-top-pdf';
            btnPdf.innerHTML = '📄';
            btnPdf.title = currentLang === 'es' ? 'Reporte Quirúrgico en PDF' : 'Surgical PDF Report';
            btnPdf.className = "bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/60 px-2.5 py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center shadow-sm";
            btnPdf.onclick = openPdfReportModal;
            btnSave.parentNode.insertBefore(btnPdf, btnSave.nextSibling);
        }

        const saveModal = document.getElementById('save-modal');
        if (saveModal && !document.getElementById('btn-modal-pdf-rep')) {
            const container = saveModal.querySelector('.space-y-3') || saveModal.firstElementChild;
            if (container) {
                const b = document.createElement('button');
                b.id = 'btn-modal-pdf-rep';
                b.className = "w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded border border-emerald-400 transition-colors flex items-center justify-center space-x-2 text-xs shadow-lg mt-2";
                b.innerHTML = `<span data-i18n="pdf_btn_hdr">${t('pdf_btn_hdr')}</span>`;
                b.onclick = function() { closeSaveModal(); openPdfReportModal(); };
                container.appendChild(b);
            }
        }
    }

    // 3. CREAR MODAL DE CONFIGURACIÓN DEL REPORTE CLÍNICO (CON PREVISUALIZACIÓN DE PACIENTE)
    const mainContainer = document.getElementById('canvas-container') || document.body;
    const pdfModal = document.createElement('div');
    pdfModal.id = 'pdf-report-modal';
    pdfModal.className = 'hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm';
    pdfModal.innerHTML = `
        <div class="bg-gray-900 border border-emerald-500 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-3 text-xs text-gray-200">
            <div class="flex justify-between items-center border-b border-gray-700 pb-2.5">
                <h3 class="text-emerald-400 font-bold text-sm" data-i18n="pdf_modal_title">📄 Generar Reporte de Planificación Quirúrgica (PDF)</h3>
                <button onclick="document.getElementById('pdf-report-modal').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 px-2 py-0.5 rounded">&times;</button>
            </div>
            <div class="space-y-2.5">
                <div class="bg-gray-800/60 border border-gray-700 rounded-lg p-2.5">
                    <label class="block text-[10px] text-emerald-400 font-bold uppercase mb-1.5" data-i18n="pdf_pat_sec">Datos del Paciente (Sincronizados con 👤):</label>
                    <div class="grid grid-cols-12 gap-1.5">
                        <input type="text" id="pdf-pat-name" placeholder="Nombre del Paciente" class="col-span-6 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-emerald-500">
                        <input type="text" id="pdf-pat-id" placeholder="ID / Cédula" class="col-span-4 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-emerald-500">
                        <input type="text" id="pdf-pat-age" placeholder="Edad" class="col-span-2 bg-gray-900 border border-gray-600 rounded px-1.5 py-1 text-center text-white focus:outline-none focus:border-emerald-500">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] text-gray-400 font-bold mb-1" data-i18n="pdf_doc_lbl">Nombre del Cirujano / Especialidad:</label>
                    <input type="text" id="pdf-surgeon-name" placeholder="Dr. ... - Cirujano de Columna" class="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-[11px] text-gray-400 font-bold mb-1" data-i18n="pdf_cli_lbl">Centro Médico / Institución:</label>
                    <input type="text" id="pdf-clinic-name" placeholder="Clínica / Hospital..." class="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-[11px] text-gray-400 font-bold mb-1" data-i18n="pdf_not_lbl">Plan Quirúrgico y Notas Clínicas (Historia / ARS):</label>
                    <textarea id="pdf-surg-notes" rows="3" placeholder="Ej: Artrodesis vertebral posterior + Osteotomías correctivas tipo Schwab..." class="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"></textarea>
                </div>
            </div>
            <button onclick="generatePrintableSurgicalPDF()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transition-colors text-xs" data-i18n="pdf_gen_btn">🖨️ Generar Vista de Impresión / Guardar PDF</button>
        </div>
    `;
    mainContainer.appendChild(pdfModal);

    window.openPdfReportModal = function() {
        if (!bgImage && !stageData.pre.bgImage && !stageData.post.bgImage) {
            updateStatus("⚠️ Load and measure an X-Ray first.", true);
            return;
        }
        const pInfo = extractPatientDataFromApp();
        document.getElementById('pdf-pat-name').value = pInfo.name || '';
        document.getElementById('pdf-pat-id').value   = pInfo.id || '';
        document.getElementById('pdf-pat-age').value  = pInfo.age || '';

        document.getElementById('pdf-surgeon-name').value = localStorage.getItem('sp_surgeon') || '';
        document.getElementById('pdf-clinic-name').value  = localStorage.getItem('sp_clinic') || '';
        document.getElementById('pdf-report-modal').classList.remove('hidden');
    };

    // 4. CAPTURAR IMAGEN LIMPIA DE CADA ETAPA Y COMPILAR EL DOCUMENTO FORMAL
    function captureStageDataURL(stKey) {
        let sData = (stKey === currentStage)
            ? { bgImage, measurements, gazeDirection, cmPerPx: window.cmPerPx, ostSimActive: window.ostSimActive }
            : stageData[stKey];
        if (!sData || !sData.bgImage) return null;
        const off = document.createElement('canvas');
        off.width = sData.bgImage.width;
        off.height = sData.bgImage.height;
        const oCtx = off.getContext('2d');
        renderStageOnContext(oCtx, sData, 0, 0, 1);
        return off.toDataURL('image/jpeg', 0.92);
    }

    window.generatePrintableSurgicalPDF = function() {
        const patName = document.getElementById('pdf-pat-name').value.trim() || '-';
        const patId   = document.getElementById('pdf-pat-id').value.trim()   || '-';
        const patAge  = document.getElementById('pdf-pat-age').value.trim()  || '-';
        syncPatientDataBackToApp(patName === '-' ? '' : patName, patId === '-' ? '' : patId, patAge === '-' ? '' : patAge);

        const surgeon = document.getElementById('pdf-surgeon-name').value.trim();
        const clinic  = document.getElementById('pdf-clinic-name').value.trim();
        const notes   = document.getElementById('pdf-surg-notes').value.trim();
        localStorage.setItem('sp_surgeon', surgeon);
        localStorage.setItem('sp_clinic', clinic);
        document.getElementById('pdf-report-modal').classList.add('hidden');

        const isEs = (currentLang === 'es');
        const dateStr = new Date().toLocaleDateString(isEs ? 'es-DO' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        const baseRes = (window.ostSimActive && window._preOstBaseResults) ? window._preOstBaseResults : (stageData.pre.results && Object.keys(stageData.pre.results).length ? stageData.pre.results : window.currentResults);
        const postRes = stageData.post.bgImage ? stageData.post.results : window.currentResults;
        const pi = baseRes['PI'] !== undefined ? baseRes['PI'] : postRes['PI'];
        const idealLL = pi !== undefined ? Math.round(pi * 0.6 + 30) + '°' : '-';
        const idealPA = pi !== undefined ? Math.round(pi * 0.5 - 19) + '°' : '-';
        const idealGT = pi !== undefined ? Math.round(pi * 0.48 - 15) + '°' : '-';
        const fv = (obj, k, u = '°') => (obj && obj[k] !== undefined) ? `${fmtInt(obj[k])}${u}` : '-';

        const osts = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        const totalOstDeg = osts.reduce((acc, o) => acc + (typeof computeOsteotomyGeometry === 'function' ? Math.round(computeOsteotomyGeometry(o, true).deg) : 0), 0);
        const ostSummary = osts.length > 0
            ? `${osts.length} ${isEs ? 'corte(s)' : 'cut(s)'} (Σα = ${totalOstDeg}° | ${osts.map(o => `${o.title}: ${Math.round(computeOsteotomyGeometry(o, true).deg)}°`).join(', ')})`
            : (isEs ? 'Sin osteotomías registradas' : 'No osteotomies recorded');

        const rods = measurements.filter(m => m.type === 'rod' && m.points && m.points.length >= 2);
        const totalScrews = rods.reduce((acc, r) => acc + r.points.length, 0);
        const rodSummary = rods.length > 0
            ? `${rods.length} ${isEs ? 'barra(s)' : 'rod(s)'} | ${totalScrews} ${isEs ? 'tornillos transpediculares' : 'pedicle screws'}${window.coronalCorrPct > 0 ? ` | Reducción AP: ${window.coronalCorrPct}%` : ''}`
            : (isEs ? 'Sin instrumentación trazada' : 'No rods traced');

        const imgPre = captureStageDataURL('pre');
        const imgPost = captureStageDataURL('post');
        const mainImg = (currentStage === 'post' && imgPost) ? imgPost : imgPre;

        const win = window.open('', '_blank');
        if (!win) { alert('Please allow pop-ups to generate the PDF report.'); return; }

        win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
        <title>SpinePlan_Report_${patName.replace(/\s+/g, '_')}</title>
        <style>
            @page { size: letter portrait; margin: 12mm 14mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 0; padding: 0 10px; font-size: 11px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding: 0 50px 8px 10px; margin-bottom: 10px; }
            .brand { font-size: 18px; font-weight: 800; color: #0284c7; letter-spacing: 0.5px; }
            .sub { font-size: 10px; color: #475569; font-weight: 600; text-transform: uppercase; }
            .doc-info { text-align: right; margin-right: 25px; }
            .pat-bar { display: grid; grid-template-columns: 1.6fr 1.2fr 0.8fr 1fr; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px; margin-bottom: 10px; font-size: 11px; }
            .grid-main { display: grid; grid-template-columns: 54% 44%; gap: 2%; align-items: start; }
            .img-box { background: #020617; border-radius: 6px; padding: 6px; text-align: center; border: 1px solid #334155; }
            .img-box img { max-width: 100%; max-height: 430px; object-fit: contain; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 10.5px; }
            th { background: #0f172a; color: #fff; text-align: left; padding: 5px 6px; font-size: 10px; text-transform: uppercase; }
            td { padding: 4.5px 6px; border-bottom: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .box-sec { border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 9px; margin-bottom: 8px; background: #fff; }
            .box-title { font-weight: 700; font-size: 10px; text-transform: uppercase; color: #0284c7; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; }
            .sig-row { margin-top: 26px; display: flex; justify-content: space-between; align-items: flex-end; padding: 12px 75px 0 15px; }
            .sig-line { width: 230px; border-top: 1.5px solid #0f172a; text-align: center; padding-top: 5px; font-weight: 700; }
            .no-print { text-align: center; padding: 10px; background: #0f172a; margin-bottom: 12px; border-radius: 6px; }
            .btn-p { background: #10b981; color: #fff; border: none; padding: 8px 18px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 12px; }
            @media print { .no-print { display: none !important; } }
        </style></head><body>
            <div class="no-print">
                <button class="btn-p" onclick="window.print()">🖨️ ${isEs ? 'Imprimir / Guardar como PDF' : 'Print / Save as PDF'}</button>
            </div>
            <div class="header">
                <div>
                    <div class="brand">SpinePlan Pro</div>
                    <div class="sub">${isEs ? 'Reporte de Planificación Quirúrgica y Balance Espinopélvico' : 'Surgical Planning & Spinopelvic Alignment Report'}</div>
                </div>
                <div class="doc-info">
                    <div style="font-weight:700;font-size:12px">${surgeon || (isEs ? 'Cirugía de Columna Vertebral' : 'Spine Surgery Department')}</div>
                    <div style="color:#475569">${clinic || ''}</div>
                    <div style="color:#64748b;font-size:10px">${dateStr}</div>
                </div>
            </div>
            <div class="pat-bar">
                <div><strong>${isEs ? 'Paciente' : 'Patient'}:</strong> ${patName}</div>
                <div><strong>ID / HC:</strong> ${patId}</div>
                <div><strong>${isEs ? 'Edad' : 'Age'}:</strong> ${patAge}</div>
                <div><strong>${isEs ? 'Estado' : 'Stage'}:</strong> ${window.ostSimActive ? (isEs ? 'Simulación Activa' : 'Simulation Active') : currentStage.toUpperCase()}</div>
            </div>
            <div class="grid-main">
                <div class="img-box">
                    ${(imgPre && imgPost)
                        ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px"><img src="${imgPre}"><img src="${imgPost}"></div>`
                        : `<img src="${mainImg}">`}
                </div>
                <div>
                    <table>
                        <thead><tr><th>${isEs ? 'Parámetro' : 'Parameter'}</th><th>Base</th><th>Ideal</th><th>${isEs ? 'Logrado' : 'Achieved'}</th></tr></thead>
                        <tbody>
                            <tr><td><strong>PI</strong></td><td>${fv(baseRes,'PI')}</td><td>${fv(baseRes,'PI')}</td><td><strong>${fv(postRes,'PI')}</strong></td></tr>
                            <tr><td><strong>PT / SS</strong></td><td>${fv(baseRes,'PT')} / ${fv(baseRes,'SS')}</td><td>-</td><td><strong>${fv(postRes,'PT')} / ${fv(postRes,'SS')}</strong></td></tr>
                            <tr><td><strong>L1-S1 (LL)</strong></td><td>${fv(baseRes,'L1-S1')}</td><td>${idealLL}</td><td><strong>${fv(postRes,'L1-S1')}</strong></td></tr>
                            <tr><td><strong>L4-S1</strong></td><td>${fv(baseRes,'L4-S1')}</td><td>35° - 40°</td><td><strong>${fv(postRes,'L4-S1')}</strong></td></tr>
                            <tr><td><strong>L1-PA</strong></td><td>${fv(baseRes,'L1-PA')}</td><td>${idealPA}</td><td><strong>${fv(postRes,'L1-PA')}</strong></td></tr>
                            <tr><td><strong>T4-PA</strong></td><td>${fv(baseRes,'T4-PA')}</td><td>${idealPA}</td><td><strong>${fv(postRes,'T4-PA')}</strong></td></tr>
                            <tr><td><strong>Mismatch (T4-L1)</strong></td><td>${baseRes['T4-PA']!==undefined && baseRes['L1-PA']!==undefined ? fmtInt(baseRes['T4-PA']-baseRes['L1-PA'])+'°' : '-'}</td><td>&lt; 3°</td><td><strong>${postRes['T4-PA']!==undefined && postRes['L1-PA']!==undefined ? fmtInt(postRes['T4-PA']-postRes['L1-PA'])+'°' : '-'}</strong></td></tr>
                            <tr><td><strong>C2 Tilt</strong></td><td>${fv(baseRes,'C2 Tilt')}</td><td>1° / -3°</td><td><strong>${fv(postRes,'C2 Tilt')}</strong></td></tr>
                            <tr><td><strong>Global Tilt (GT)</strong></td><td>${fv(baseRes,'GT')}</td><td>${idealGT}</td><td><strong>${fv(postRes,'GT')}</strong></td></tr>
                            <tr><td><strong>SVA / cSVA</strong></td><td>${fv(baseRes,'SVA','')} / ${fv(baseRes,'cSVA','')}</td><td>&lt; 4 cm</td><td><strong>${fv(postRes,'SVA','')} / ${fv(postRes,'cSVA','')}</strong></td></tr>
                        </tbody>
                    </table>
                    <div class="box-sec">
                        <div class="box-title">${isEs ? 'Osteotomías Planeadas (Schwab, 2014)' : 'Planned Osteotomies (Schwab, 2014)'}</div>
                        <div>${ostSummary}</div>
                    </div>
                    <div class="box-sec">
                        <div class="box-title">${isEs ? 'Instrumentación (Tornillos y Barras)' : 'Construct (Pedicle Screws & Rods)'}</div>
                        <div>${rodSummary}</div>
                    </div>
                    <div class="box-sec">
                        <div class="box-title">${isEs ? 'Plan Quirúrgico / Justificación Clínica (ARS)' : 'Surgical Plan & Clinical Notes'}</div>
                        <div style="min-height:45px;white-space:pre-wrap">${notes || (isEs ? 'Paciente con desbalance espinopélvico / deformidad vertebral tributario de corrección e instrumentación quirúrgica.' : 'Surgical candidate for spinopelvic realignment and instrumentation.')}</div>
                    </div>
                </div>
            </div>
            <div class="sig-row">
                <div style="color:#64748b;font-size:9.5px">Generated by <strong>SpinePlan Pro</strong> • Precision Spine Surgery Software</div>
                <div class="sig-line">${surgeon || (isEs ? 'Firma y Sello del Cirujano' : 'Surgeon Signature & Stamp')}</div>
            </div>
        </body></html>`);
        win.document.close();
    };

    const prevSetLang = setLanguage;
    setLanguage = function(lang) {
        prevSetLang(lang);
        injectPdfButtons();
    };

    injectPdfButtons();
})();
