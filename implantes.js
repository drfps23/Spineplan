// ============================================================================
// ACTUALIZACIÓN 3 (implantes.js): CAJAS (ALIF/LLIF/TLIF) + MOLDEADO DE BARRA
// Integrado con Cinemática en Vivo, Perfil Teórico, Roussouly y GAP Score
// ============================================================================

(function() {
    window.selectedCageId = null;
    window.defaultCagePreset = 'ALIF';

    const CAGE_PRESETS = {
        ALIF: { angle: 16, height: 14, color: '#06b6d4', desc_en: 'Anterior Lumbar Interbody Fusion (High Lordosis & Anterior Distraction)', desc_es: 'Fusión Intercorporal Lumbar Anterior (Alta Lordosis y Distracción Anterior)' },
        LLIF: { angle: 10, height: 12, color: '#38bdf8', desc_en: 'Lateral Lumbar Interbody Fusion (Coronal Leveling & Disc Height)', desc_es: 'Fusión Intercorporal Lateral (Nivelación Coronal y Altura Discal)' },
        TLIF: { angle: 8,  height: 10, color: '#22d3ee', desc_en: 'Transforaminal Lumbar Interbody Fusion (Segmental Support & Focal Lordosis)', desc_es: 'Fusión Intercorporal Transforaminal (Soporte Segmentario y Lordosis Focal)' }
    };

    // 1. TRADUCCIONES BILINGÜES (EN / ES)
    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            mod_7b_imp: "7B. Cages (ALIF/LLIF/TLIF) & Rod",
            imp_sub: "Interbody Implants & Rod Contouring",
            btn_add_cage: "🧱 1. Place Cage (2 Disc Points)",
            btn_draw_rod: "🔩 2. Trace Screws & Rod",
            btn_finish_rod: "✅ Finish Rod Trace",
            btn_imp_panel: "📐 3. Cage & Rod Harmony (Roussouly)",
            imp_modal_title: "Interbody Cages & Rod Contouring",
            imp_cage_sec: "Interbody Cage Configuration",
            imp_sel_cage: "Active Cage:",
            imp_type_lbl: "Approach:",
            imp_ang_lbl: "Cage Lordosis (α):",
            imp_h_lbl: "Cage Height (mm):",
            imp_rod_sec: "Rod Contouring & Roussouly Harmony",
            imp_rod_len: "Contoured Rod Length:",
            imp_rod_bend: "Global / Distal Bend:",
            imp_ldi_lbl: "Distal Lordosis (LDI L4-S1):",
            imp_harm_ok: "HARMONIOUS CONTOUR (Roussouly)",
            imp_harm_low: "DISTAL HYPOLORDOSIS (<55% L4-S1)",
            imp_harm_high: "PROXIMAL OVERBENDING (>80% / PJK Risk)"
        });
        Object.assign(I18N.es, {
            mod_7b_imp: "7B. Cajas (ALIF/LLIF/TLIF) y Barra",
            imp_sub: "Implantes Intercorporales y Moldeado",
            btn_add_cage: "🧱 1. Colocar Caja (2 Pts Disco)",
            btn_draw_rod: "🔩 2. Trazar Tornillos y Barra",
            btn_finish_rod: "✅ Terminar Barra",
            btn_imp_panel: "📐 3. Panel Cajas y Barra (Roussouly)",
            imp_modal_title: "Cajas Intercorporales y Moldeado de Barra",
            imp_cage_sec: "Configuración de Caja Intercorporal",
            imp_sel_cage: "Caja Activa:",
            imp_type_lbl: "Vía / Tipo:",
            imp_ang_lbl: "Lordosis de Caja (α):",
            imp_h_lbl: "Altura de Caja (mm):",
            imp_rod_sec: "Moldeado de Barra y Armonía de Roussouly",
            imp_rod_len: "Longitud de Barra:",
            imp_rod_bend: "Curvatura Global / Distal:",
            imp_ldi_lbl: "Proporción L4-S1 (LDI):",
            imp_harm_ok: "MOLDEADO ARMÓNICO (Roussouly)",
            imp_harm_low: "HIPOLORDOSIS DISTAL (<55% L4-S1)",
            imp_harm_high: "HIPERMOLDEADO / RIESGO PJK (>80%)"
        });
    }

    // 2. INYECTAR SUB-MÓDULO 7B EN LA BARRA LATERAL
    const rsHeader = document.querySelector('[data-i18n="mod_7"]');
    if (rsHeader && rsHeader.parentElement) {
        const impCard = document.createElement('div');
        impCard.className = "border border-cyan-700 rounded-lg overflow-hidden";
        impCard.innerHTML = `
            <div class="bg-cyan-900/40 px-3 py-2 text-sm font-semibold text-cyan-400" data-i18n="mod_7b_imp">7B. Cages (ALIF/LLIF/TLIF) & Rod</div>
            <div class="p-3 bg-gray-900/50 space-y-2">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider block" data-i18n="imp_sub">Interbody Implants & Rod Contouring</span>
                <div class="grid grid-cols-3 gap-1">
                    <button id="preset-btn-ALIF" onclick="selectCagePreset('ALIF')" class="py-1 rounded text-[11px] font-bold bg-cyan-600 text-white border border-cyan-400">ALIF</button>
                    <button id="preset-btn-LLIF" onclick="selectCagePreset('LLIF')" class="py-1 rounded text-[11px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700">LLIF</button>
                    <button id="preset-btn-TLIF" onclick="selectCagePreset('TLIF')" class="py-1 rounded text-[11px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700">TLIF</button>
                </div>
                <button id="btn-tool-cage" onclick="activateTool('cage', window.defaultCagePreset)" class="tool-btn w-full border border-cyan-600/60 bg-cyan-950/30 rounded px-2 py-2 text-xs text-cyan-300 hover:bg-cyan-900/50 font-bold flex justify-center items-center" data-i18n="btn_add_cage">🧱 1. Place Cage (2 Disc Points)</button>
                <button id="btn-tool-rod" onclick="handleRodButtonClick()" class="tool-btn w-full border border-indigo-600/60 bg-indigo-950/30 rounded px-2 py-2 text-xs text-indigo-300 hover:bg-indigo-900/50 font-bold flex justify-center items-center" data-i18n="btn_draw_rod">🔩 2. Trace Screws & Rod</button>
                <button onclick="showImplantsModal()" class="w-full border border-cyan-500 bg-cyan-600/20 rounded px-2 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-600 hover:text-white transition-colors flex justify-center items-center shadow-lg" data-i18n="btn_imp_panel">📐 3. Cage & Rod Harmony (Roussouly)</button>
            </div>
        `;
        rsHeader.parentElement.parentNode.insertBefore(impCard, rsHeader.parentElement);
    }

    // 3. CREAR MODAL FLOTANTE DE CAJAS INTERCORPORALES Y MOLDEADO DE BARRA
    const mainContainer = document.getElementById('canvas-container');
    if (mainContainer) {
        const impModal = document.createElement('div');
        impModal.id = "implants-box";
        impModal.className = "hidden absolute top-20 left-1/4 bg-gray-900/95 border border-cyan-500 rounded-lg p-4 shadow-2xl z-40 backdrop-blur-md cursor-move select-none w-[360px]";
        impModal.innerHTML = `
            <div class="flex justify-between items-center mb-2.5 border-b border-gray-700 pb-2 pointer-events-none">
                <h3 class="text-cyan-400 font-bold text-sm" data-i18n="imp_modal_title">Interbody Cages & Rod Contouring</h3>
                <button onclick="document.getElementById('implants-box').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 text-xs pointer-events-auto" data-i18n="btn_close">&times; Close</button>
            </div>
            <div id="imp-modal-body" class="pointer-events-auto text-xs text-gray-300 space-y-3 cursor-default">
                <!-- SECCIÓN CAJAS -->
                <div class="bg-gray-800/70 border border-gray-700 rounded p-2.5 space-y-2">
                    <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block" data-i18n="imp_cage_sec">Interbody Cage Configuration</span>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-[10px] text-gray-400 font-bold uppercase shrink-0" data-i18n="imp_sel_cage">Active Cage:</span>
                        <select id="imp-cage-select" class="flex-1 bg-gray-900 border border-gray-600 rounded text-xs text-white p-1 font-semibold focus:outline-none focus:border-cyan-500" onchange="selectCageFromDropdown(this.value)"></select>
                        <button onclick="deleteSelectedCage()" class="bg-red-700/80 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold border border-red-500" title="Delete Cage">🗑️</button>
                    </div>
                    <div class="grid grid-cols-3 gap-1 pt-0.5">
                        <button id="mod-cage-ALIF" onclick="changeActiveCageType('ALIF')" class="py-1 rounded text-[10px] font-bold bg-cyan-600 text-white">ALIF</button>
                        <button id="mod-cage-LLIF" onclick="changeActiveCageType('LLIF')" class="py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300">LLIF</button>
                        <button id="mod-cage-TLIF" onclick="changeActiveCageType('TLIF')" class="py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300">TLIF</button>
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-0.5">
                            <span class="text-[10px] text-amber-300 font-bold uppercase" data-i18n="imp_ang_lbl">Cage Lordosis (α):</span>
                            <span id="imp-ang-val" class="text-xs font-bold text-cyan-300">16°</span>
                        </div>
                        <input type="range" id="imp-ang-slider" min="2" max="30" value="16" class="w-full accent-cyan-500 cursor-pointer">
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-0.5">
                            <span class="text-[10px] text-emerald-300 font-bold uppercase" data-i18n="imp_h_lbl">Cage Height (mm):</span>
                            <span id="imp-h-val" class="text-xs font-bold text-emerald-300">14 mm</span>
                        </div>
                        <input type="range" id="imp-h-slider" min="6" max="20" value="14" class="w-full accent-emerald-500 cursor-pointer">
                    </div>
                </div>

                <!-- SECCIÓN MOLDEADO DE BARRA Y ARMONÍA DE ROUSSOULY -->
                <div class="bg-gray-800/70 border border-gray-700 rounded p-2.5 space-y-1.5">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider" data-i18n="imp_rod_sec">Rod Contouring & Roussouly Harmony</span>
                        <button onclick="deleteAllRods()" class="text-[10px] text-red-400 hover:text-red-300 font-bold">🗑️ Rod</button>
                    </div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_rod_len">Contoured Rod Length:</span><span id="imp-rod-len-val" class="font-bold text-white">-</span></div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_rod_bend">Global / Distal Bend:</span><span id="imp-rod-bend-val" class="font-bold text-indigo-300">-</span></div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_ldi_lbl">Distal Lordosis (LDI L4-S1):</span><span id="imp-ldi-val" class="font-bold text-emerald-400">-</span></div>
                    <div class="bg-gray-900/90 border border-gray-700 rounded p-2 text-center mt-1">
                        <div id="imp-harm-badge" class="bg-emerald-600 text-white font-bold py-0.5 px-2.5 rounded-full text-[10px] inline-block mb-1 shadow">HARMONIOUS CONTOUR</div>
                        <p id="imp-harm-desc" class="text-[10px] text-gray-300 leading-tight"></p>
                    </div>
                </div>

                <button onclick="toggleOsteotomySim()" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow">✂️ Simulate Cages, Osteotomies & Rod</button>
            </div>
        `;
        mainContainer.appendChild(impModal);
        if (typeof makeInteractivePanel === 'function') makeInteractivePanel(impModal);

        const bodyEl = document.getElementById('imp-modal-body');
        const angSl = document.getElementById('imp-ang-slider');
        const hSl = document.getElementById('imp-h-slider');
        const selEl = document.getElementById('imp-cage-select');
        ['mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
            bodyEl.addEventListener(evt, e => e.stopPropagation());
            angSl.addEventListener(evt, e => e.stopPropagation());
            hSl.addEventListener(evt, e => e.stopPropagation());
            selEl.addEventListener(evt, e => e.stopPropagation());
        });

        angSl.addEventListener('input', function() { updateSelectedCageGeometry(Number(this.value), null); });
        hSl.addEventListener('input', function() { updateSelectedCageGeometry(null, Number(this.value)); });
    }

    // 4. FUNCIONES DE CONFIGURACIÓN DE CAJAS INTERCORPORALES
    window.selectCagePreset = function(presetKey) {
        if (!CAGE_PRESETS[presetKey]) return;
        window.defaultCagePreset = presetKey;
        ['ALIF', 'LLIF', 'TLIF'].forEach(k => {
            const b = document.getElementById(`preset-btn-${k}`);
            if (b) {
                b.className = (k === presetKey)
                    ? "py-1 rounded text-[11px] font-bold bg-cyan-600 text-white border border-cyan-400 shadow"
                    : "py-1 rounded text-[11px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700";
            }
        });
        if (activeTool === 'cage') activeTitle = presetKey;
    };

    function getAllCages(measList) {
        return (measList || measurements).filter(m => m.type === 'osteotomy' && m.isCage && m.points && m.points.length === 3);
    }

    function getSelectedCage() {
        let cages = getAllCages(measurements);
        if (cages.length === 0) return null;
        let found = cages.find(c => String(c.id) === String(window.selectedCageId));
        if (!found) {
            found = cages[cages.length - 1];
            window.selectedCageId = found.id;
        }
        return found;
    }

    window.selectCageFromDropdown = function(idVal) {
        window.selectedCageId = idVal;
        window.selectedOstId = idVal;
        populateImplantsModal();
        draw();
    };

    window.changeActiveCageType = function(newType) {
        window.selectCagePreset(newType);
        let cage = getSelectedCage();
        if (!cage) return;
        cage.cageType = newType;
        cage.color = CAGE_PRESETS[newType].color;
        let cages = getAllCages(measurements);
        let idx = cages.indexOf(cage) + 1;
        cage.title = `${newType} #${idx}`;
        updateSelectedCageGeometry(CAGE_PRESETS[newType].angle, CAGE_PRESETS[newType].height);
    };

    window.updateSelectedCageGeometry = function(newAngle, newHeight) {
        let cage = getSelectedCage();
        if (!cage) return;
        if (newAngle !== null && !isNaN(newAngle)) cage.cageAngle = Math.max(2, Math.min(30, newAngle));
        if (newHeight !== null && !isNaN(newHeight)) cage.cageHeight = Math.max(6, Math.min(20, newHeight));

        document.getElementById('imp-ang-val').innerText = `${Math.round(cage.cageAngle)}°`;
        document.getElementById('imp-h-val').innerText = `${Math.round(cage.cageHeight)} mm`;
        document.getElementById('imp-ang-slider').value = Math.round(cage.cageAngle);
        document.getElementById('imp-h-slider').value = Math.round(cage.cageHeight);

        if (!cage._basePoints || cage._basePoints.length !== 3) {
            cage._basePoints = cage.points.map(p => ({ x: p.x, y: p.y }));
        }
        // p1 (índice 1) es el borde anterior del disco; pInf (índice 2) es el borde posterior del disco
        let pAnt = cage._basePoints[1];
        let pPost = cage._basePoints[2];
        let discLen = Math.hypot(pPost.x - pAnt.x, pPost.y - pAnt.y) || 60;
        let angInf = Math.atan2(pPost.y - pAnt.y, pPost.x - pAnt.x);
        let rad = (cage.cageAngle * Math.PI) / 180;
        let dir = (pPost.x >= pAnt.x) ? -1 : 1;
        let newAngSup = angInf + dir * rad;
        cage._basePoints[0] = {
            x: pAnt.x + Math.cos(newAngSup) * discLen,
            y: pAnt.y + Math.sin(newAngSup) * discLen
        };
        if (!window.ostSimActive) {
            cage.points = cage._basePoints.map(p => ({ x: p.x, y: p.y }));
        }
        draw();
    };

    window.deleteSelectedCage = function() {
        let cage = getSelectedCage();
        if (!cage) return;
        measurements = measurements.filter(m => m.id !== cage.id);
        stageData[currentStage].measurements = measurements;
        let remCages = getAllCages(measurements);
        window.selectedCageId = remCages.length > 0 ? remCages[remCages.length - 1].id : null;
        populateImplantsModal();
        draw();
    };

    window.deleteAllRods = function() {
        measurements = measurements.filter(m => m.type !== 'rod');
        stageData[currentStage].measurements = measurements;
        populateImplantsModal();
        draw();
    };

    window.handleRodButtonClick = function() {
        if (activeTool === 'rod' && currentMeasurement && currentMeasurement.type === 'rod') {
            if (currentMeasurement.points.length >= 2) {
                currentMeasurement.closed = true;
                delete currentMeasurement.tempPoint;
                currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                deactivateTool();
                updateRodButtonUI(false);
                draw();
                showImplantsModal();
                return;
            }
        }
        activateTool('rod', 'Rod');
        updateRodButtonUI(true);
        updateStatus(currentLang === 'es'
            ? "🔩 Haz clic en cada pedículo (de S1 hacia arriba). Doble clic en el último para terminar."
            : "🔩 Click each pedicle (from S1 upward). Double-click last screw to finish.");
    };

    function updateRodButtonUI(isDrawingRod) {
        const b = document.getElementById('btn-tool-rod');
        if (!b) return;
        if (isDrawingRod) {
            b.innerHTML = t('btn_finish_rod');
            b.className = "tool-btn active w-full border border-emerald-500 bg-emerald-700 rounded px-2 py-2 text-xs text-white font-bold flex justify-center items-center shadow-lg";
        } else {
            b.innerHTML = t('btn_draw_rod');
            b.className = "tool-btn w-full border border-indigo-600/60 bg-indigo-950/30 rounded px-2 py-2 text-xs text-indigo-300 hover:bg-indigo-900/50 font-bold flex justify-center items-center";
        }
    }

    // 5. GEOMETRÍA Y RENDERIZADO DE CAJA PROTÉSICA Y BARRA CON TORNILLOS PEDICULARES
    function getSplinePoints(pts, segmentsPerSpan = 16) {
        if (!pts || pts.length < 2) return pts || [];
        if (pts.length === 2) return [pts[0], pts[1]];
        let out = [];
        for (let i = 0; i < pts.length - 1; i++) {
            let p0 = pts[Math.max(0, i - 1)];
            let p1 = pts[i];
            let p2 = pts[i + 1];
            let p3 = pts[Math.min(pts.length - 1, i + 2)];
            for (let s = 0; s < segmentsPerSpan; s++) {
                let t = s / segmentsPerSpan;
                let t2 = t * t, t3 = t2 * t;
                let x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
                let y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
                out.push({ x, y });
            }
        }
        out.push(pts[pts.length - 1]);
        return out;
    }

    function computeRodMetrics(rodMeas, cmPerPxVal) {
        if (!rodMeas || !rodMeas.points || rodMeas.points.length < 2) return null;
        let sorted = rodMeas.points.slice().sort((a, b) => b.y - a.y); // Caudal (S1) a Craneal
        let spline = getSplinePoints(sorted, 16);
        let lenPx = 0;
        for (let i = 1; i < spline.length; i++) {
            lenPx += Math.hypot(spline[i].x - spline[i - 1].x, spline[i].y - spline[i - 1].y);
        }
        let realLen = cmPerPxVal ? (lenPx * cmPerPxVal) : lenPx;
        let unit = cmPerPxVal ? 'cm' : 'px';

        // Ángulo de moldeado global y del arco inferior (primer tercio caudal)
        let vStart = { x: spline[1].x - spline[0].x, y: spline[1].y - spline[0].y };
        let nEnd = spline.length - 1;
        let vEnd = { x: spline[nEnd].x - spline[nEnd - 1].x, y: spline[nEnd].y - spline[nEnd - 1].y };
        let nDistal = Math.max(1, Math.floor(spline.length * 0.45));
        let vDistal = { x: spline[nDistal].x - spline[nDistal - 1].x, y: spline[nDistal].y - spline[nDistal - 1].y };

        let angStart = Math.atan2(vStart.y, vStart.x);
        let angEnd = Math.atan2(vEnd.y, vEnd.x);
        let angDistal = Math.atan2(vDistal.y, vDistal.x);

        let globalBend = Math.abs((angEnd - angStart) * 180 / Math.PI);
        if (globalBend > 180) globalBend = 360 - globalBend;
        let distalBend = Math.abs((angDistal - angStart) * 180 / Math.PI);
        if (distalBend > 180) distalBend = 360 - distalBend;

        return { len: realLen, unit, globalBend: Math.round(globalBend), distalBend: Math.round(distalBend), spline, sorted };
    }

    function drawCagesAndRods(targetCtx, measList, stageGaze, stageCm, sc) {
        if (!measList) return;

        // A. DIBUJAR CAJAS INTERCORPORALES PROTÉSICAS (ALIF / LLIF / TLIF)
        let cages = getAllCages(measList);
        cages.forEach(cage => {
            let pAnt = cage.points[1];  // Borde anterior del disco
            let pPost = cage.points[2]; // Borde posterior del disco
            let dx = pPost.x - pAnt.x, dy = pPost.y - pAnt.y;
            let discLen = Math.hypot(dx, dy) || 40;
            let ux = dx / discLen, uy = dy / discLen;
            // Normal apuntando hacia craneal (arriba)
            let nx = -uy, ny = ux;
            if (ny > 0) { nx = -nx; ny = -ny; }

            // Espesor visual proporcional a los mm de la caja y la longitud del disco
            let hRatio = (cage.cageHeight || 12) / 38;
            let hAnt = discLen * hRatio * (1 + (cage.cageAngle || 12) / 45);
            let hPost = discLen * hRatio * 0.55;

            let cAntInf = { x: pAnt.x + ux * (discLen * 0.06), y: pAnt.y + uy * (discLen * 0.06) };
            let cPostInf = { x: pAnt.x + ux * (discLen * 0.86), y: pAnt.y + uy * (discLen * 0.86) };
            let cAntSup = { x: cAntInf.x + nx * hAnt, y: cAntInf.y + ny * hAnt };
            let cPostSup = { x: cPostInf.x + nx * hPost, y: cPostInf.y + ny * hPost };

            targetCtx.save();
            // Cuerpo trapezoidal de titanio/PEEK
            targetCtx.beginPath();
            targetCtx.moveTo(cAntInf.x, cAntInf.y);
            targetCtx.lineTo(cPostInf.x, cPostInf.y);
            targetCtx.lineTo(cPostSup.x, cPostSup.y);
            targetCtx.lineTo(cAntSup.x, cAntSup.y);
            targetCtx.closePath();
            targetCtx.fillStyle = 'rgba(6, 182, 212, 0.48)';
            targetCtx.fill();
            targetCtx.lineWidth = 2.2 / sc;
            targetCtx.strokeStyle = cage.color || '#06b6d4';
            targetCtx.stroke();

            // Marcadores radiopacos verticales internos (estilo PEEK/Titanio)
            [0.28, 0.55, 0.78].forEach(tPos => {
                let bx = cAntInf.x + (cPostInf.x - cAntInf.x) * tPos;
                let by = cAntInf.y + (cPostInf.y - cAntInf.y) * tPos;
                let tx = cAntSup.x + (cPostSup.x - cAntSup.x) * tPos;
                let ty = cAntSup.y + (cPostSup.y - cAntSup.y) * tPos;
                targetCtx.beginPath();
                targetCtx.moveTo(bx, by);
                targetCtx.lineTo(tx, ty);
                targetCtx.strokeStyle = '#f8fafc';
                targetCtx.lineWidth = 1.6 / sc;
                targetCtx.stroke();
            });

            // Etiqueta de la caja (Ej: ALIF #1 | 16° • 14mm)
            let off = cage._cageTextOffset || { dx: -55, dy: -28 };
            let tx = pAnt.x + off.dx, ty = pAnt.y + off.dy;
            cage._renderedTextPos = { x: tx, y: ty };
            let fSize = cage.fontSize || 13;
            targetCtx.font = `bold ${fSize / sc}px sans-serif`;
            targetCtx.textAlign = 'left';
            targetCtx.textBaseline = 'top';
            targetCtx.shadowColor = 'rgba(0,0,0,0.95)';
            targetCtx.shadowBlur = 4 / sc;
            targetCtx.fillStyle = cage.color || '#22d3ee';
            targetCtx.fillText(`🧱 ${cage.title || cage.cageType || 'ALIF'}`, tx, ty);
            targetCtx.fillStyle = '#e2e8f0';
            targetCtx.fillText(`${Math.round(cage.cageAngle || 12)}° | ${Math.round(cage.cageHeight || 12)}mm`, tx, ty + (fSize + 3) / sc);
            targetCtx.shadowBlur = 0;
            targetCtx.restore();
        });

        // B. DIBUJAR TORNILLOS PEDICULARES Y BARRA MOLDEADA (SPLINE)
        let rods = measList.filter(m => m.type === 'rod' && m.points && m.points.length > 0);
        rods.forEach(rod => {
            targetCtx.save();
            let pts = rod.points.slice();
            if (!rod.closed && rod.tempPoint) pts.push(rod.tempPoint);

            // Dibujar tornillos pediculares orientados hacia la cortical anterior vertebral
            rod.points.forEach((pt, idx) => {
                let nextPt = rod.points[Math.min(rod.points.length - 1, idx + 1)];
                let prevPt = rod.points[Math.max(0, idx - 1)];
                let ty = nextPt.y - prevPt.y, tx = nextPt.x - prevPt.x;
                let tLen = Math.hypot(tx, ty) || 1;
                // Vector perpendicular hacia adelante (según gazeDirection)
                let sx = stageGaze, sy = -(tx * stageGaze) / (Math.abs(ty) > 5 ? ty : 20);
                let sMag = Math.hypot(sx, sy) || 1;
                sx /= sMag; sy /= sMag;

                let screwLen = 36 / sc;
                let tipX = pt.x + sx * screwLen;
                let tipY = pt.y + sy * screwLen;

                // Cuerpo del tornillo pedicular
                targetCtx.beginPath();
                targetCtx.moveTo(pt.x, pt.y);
                targetCtx.lineTo(tipX, tipY);
                targetCtx.strokeStyle = '#94a3b8';
                targetCtx.lineWidth = 3.2 / sc;
                targetCtx.stroke();

                // Tulipán del tornillo (cabeza poliaxial)
                targetCtx.beginPath();
                targetCtx.arc(pt.x, pt.y, 5.2 / sc, 0, 2 * Math.PI);
                targetCtx.fillStyle = '#38bdf8';
                targetCtx.fill();
                targetCtx.lineWidth = 1.5 / sc;
                targetCtx.strokeStyle = '#0f172a';
                targetCtx.stroke();
            });

            // Dibujar la barra continua moldeada (Spline suave)
            if (pts.length >= 2) {
                let spline = getSplinePoints(pts, 16);
                targetCtx.beginPath();
                targetCtx.moveTo(spline[0].x, spline[0].y);
                for (let i = 1; i < spline.length; i++) {
                    targetCtx.lineTo(spline[i].x, spline[i].y);
                }
                targetCtx.strokeStyle = '#818cf8';
                targetCtx.lineWidth = 4.2 / sc;
                targetCtx.lineCap = 'round';
                targetCtx.stroke();

                // Brillo metálico central de la barra
                targetCtx.strokeStyle = '#e0e7ff';
                targetCtx.lineWidth = 1.4 / sc;
                targetCtx.stroke();

                let metrics = computeRodMetrics(rod, stageCm);
                if (metrics && rod.textPos) {
                    let fSize = rod.fontSize || 13;
                    targetCtx.font = `bold ${fSize / sc}px sans-serif`;
                    targetCtx.textAlign = 'left';
                    targetCtx.textBaseline = 'top';
                    targetCtx.shadowColor = 'rgba(0,0,0,0.95)';
                    targetCtx.shadowBlur = 4 / sc;
                    targetCtx.fillStyle = '#a5b4fc';
                    targetCtx.fillText(`🔩 Rod (${ fmtInt(metrics.len) } ${metrics.unit})`, rod.textPos.x, rod.textPos.y);
                    targetCtx.fillStyle = '#e2e8f0';
                    targetCtx.fillText(`Bend: ${metrics.globalBend}°`, rod.textPos.x, rod.textPos.y + (fSize + 3) / sc);
                    targetCtx.shadowBlur = 0;
                }
            }
            targetCtx.restore();
        });
    }

    // 6. PANEL DE ARMONÍA DE ROUSSOULY Y ESTADO DE IMPLANTES
    window.populateImplantsModal = function() {
        let cages = getAllCages(measurements);
        const selEl = document.getElementById('imp-cage-select');
        let selCage = getSelectedCage();

        if (selEl) {
            if (cages.length === 0) {
                selEl.innerHTML = `<option value="">-- No Cages Placed --</option>`;
            } else {
                selEl.innerHTML = cages.map((c, idx) => {
                    let lbl = c.title || `${c.cageType || 'ALIF'} #${idx + 1}`;
                    return `<option value="${c.id}" ${selCage && String(c.id) === String(selCage.id) ? 'selected' : ''}>${lbl} (${Math.round(c.cageAngle || 12)}° | ${Math.round(c.cageHeight || 12)}mm)</option>`;
                }).join('');
            }
        }

        if (selCage) {
            ['ALIF', 'LLIF', 'TLIF'].forEach(k => {
                const b = document.getElementById(`mod-cage-${k}`);
                if (b) {
                    b.className = (selCage.cageType === k)
                        ? "py-1 rounded text-[10px] font-bold bg-cyan-600 text-white shadow"
                        : "py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300";
                }
            });
            document.getElementById('imp-ang-val').innerText = `${Math.round(selCage.cageAngle || 12)}°`;
            document.getElementById('imp-h-val').innerText = `${Math.round(selCage.cageHeight || 12)} mm`;
            document.getElementById('imp-ang-slider').value = Math.round(selCage.cageAngle || 12);
            document.getElementById('imp-h-slider').value = Math.round(selCage.cageHeight || 12);
        }

        // Métricas de la barra y Armonía de Roussouly
        let rod = measurements.find(m => m.type === 'rod' && m.points && m.points.length >= 2);
        let rodMetrics = rod ? computeRodMetrics(rod, window.cmPerPx) : null;
        document.getElementById('imp-rod-len-val').innerText = rodMetrics ? `${fmtInt(rodMetrics.len)} ${rodMetrics.unit}` : '-';
        document.getElementById('imp-rod-bend-val').innerText = rodMetrics ? `${rodMetrics.globalBend}° (Distal: ${rodMetrics.distalBend}°)` : '-';

        let res = window.currentResults || {};
        let pi = res['PI'];
        let ll = res['L1-S1'] !== undefined ? Math.abs(res['L1-S1']) : undefined;
        let l4s1 = res['L4-S1'] !== undefined ? Math.abs(res['L4-S1']) : undefined;
        let ldi = (ll && ll > 0 && l4s1 !== undefined) ? Math.round((l4s1 / ll) * 100) : (rodMetrics && rodMetrics.globalBend > 0 ? Math.round((rodMetrics.distalBend / rodMetrics.globalBend) * 100) : null);

        document.getElementById('imp-ldi-val').innerText = ldi !== null ? `${ldi}% (Target: 60-75%)` : 'Measure L1-S1 & L4-S1';

        const badge = document.getElementById('imp-harm-badge');
        const desc = document.getElementById('imp-harm-desc');
        let isEs = currentLang === 'es';

        if (ldi !== null) {
            if (ldi < 55) {
                badge.innerText = t('imp_harm_low');
                badge.className = "bg-amber-600 text-white font-bold py-0.5 px-2.5 rounded-full text-[10px] inline-block mb-1 shadow";
                desc.innerText = isEs
                    ? "Arco inferior L4-S1 insuficiente (<55%). Roussouly recomienda aumentar lordosis distal (Caja ALIF/TLIF L4-S1 o mayor moldeado distal de la barra) para no subir el ápex."
                    : "Insufficient lower arc L4-S1 (<55%). Increase distal lordosis (L4-S1 ALIF/TLIF cage or distal rod bend) to avoid cranial apex shift.";
            } else if (ldi <= 80) {
                badge.innerText = t('imp_harm_ok');
                badge.className = "bg-emerald-600 text-white font-bold py-0.5 px-2.5 rounded-full text-[10px] inline-block mb-1 shadow";
                desc.innerText = isEs
                    ? `Distribución armónica de Roussouly (${ldi}% en L4-S1). La barra y las cajas respetan el arco inferior fisiológico, minimizando el riesgo de PJK.`
                    : `Harmonious Roussouly distribution (${ldi}% in L4-S1). Rod contour and cages respect physiological lower arc, minimizing PJK risk.`;
            } else {
                badge.innerText = t('imp_harm_high');
                badge.className = "bg-rose-600 text-white font-bold py-0.5 px-2.5 rounded-full text-[10px] inline-block mb-1 shadow";
                desc.innerText = isEs
                    ? "Hiperlordosis concentrada o desproporción (>80%). Verifique el punto de inflexión y evite hipermoldear la barra proximal."
                    : "Excessive lordosis concentration (>80%). Verify inflection point and avoid proximal rod overbending.";
            }
        } else {
            badge.innerText = isEs ? "LISTO PARA EVALUAR" : "READY TO EVALUATE";
            badge.className = "bg-cyan-700 text-white font-bold py-0.5 px-2.5 rounded-full text-[10px] inline-block mb-1";
            desc.innerText = isEs
                ? "Coloque una caja (ALIF/LLIF/TLIF) o trace la barra pedicular y mida L1-S1 / L4-S1 para verificar la armonía de Roussouly."
                : "Place a cage (ALIF/LLIF/TLIF) or trace the pedicle rod and measure L1-S1 / L4-S1 to verify Roussouly harmony.";
        }
    };

    window.showImplantsModal = function() {
        populateImplantsModal();
        document.getElementById('implants-box').classList.remove('hidden');
        if (window.innerWidth < 768 && isMobileMenuOpen) toggleMobileMenu();
    };

    // 7. INTEGRAR CON EL MOTOR DE DIBUJO, INTERACCIÓN Y ARRASTRE
    const prevDraw = draw;
    draw = function() {
        prevDraw();
        if (bgImage) {
            let sc = baseScale * zoomScale;
            ctx.save();
            ctx.translate(panX, panY);
            ctx.scale(sc, sc);
            drawCagesAndRods(ctx, measurements, gazeDirection, window.cmPerPx, sc);
            ctx.restore();
            if (!document.getElementById('implants-box').classList.contains('hidden')) populateImplantsModal();
        }
    };

    const prevRenderStage = renderStageOnContext;
    renderStageOnContext = function(cCtx, sData, panXVal, panYVal, sc) {
        let res = prevRenderStage(cCtx, sData, panXVal, panYVal, sc);
        if (sData && sData.bgImage && sData.measurements) {
            cCtx.save();
            cCtx.translate(panXVal, panYVal);
            cCtx.scale(sc, sc);
            drawCagesAndRods(cCtx, sData.measurements, sData.gazeDirection || 1, sData.cmPerPx, sc);
            cCtx.restore();
        }
        return res;
    };

    const prevCheckHit = checkHit;
    checkHit = function(x, y) {
        const sc = baseScale * zoomScale;
        const baseRadius = 15 / sc;

        // Verificar etiquetas de cajas intercorporales
        let cages = getAllCages(measurements);
        for (let i = cages.length - 1; i >= 0; i--) {
            let cg = cages[i];
            let tp = cg._renderedTextPos;
            if (tp && x >= tp.x - 15 / sc && x <= tp.x + 140 / sc && y >= tp.y - 10 / sc && y <= tp.y + 50 / sc) {
                window.selectedCageId = cg.id;
                window.selectedOstId = cg.id;
                if (!document.getElementById('implants-box').classList.contains('hidden')) populateImplantsModal();
                return { type: 'cageText', item: cg, startX: x, startY: y };
            }
        }

        // Verificar puntos y etiqueta de la barra
        let rods = measurements.filter(m => m.type === 'rod');
        for (let i = rods.length - 1; i >= 0; i--) {
            let r = rods[i];
            if (r.textPos && x >= r.textPos.x - 15 / sc && x <= r.textPos.x + 150 / sc && y >= r.textPos.y - 10 / sc && y <= r.textPos.y + 50 / sc) {
                return { type: 'text', item: r };
            }
            for (let p = 0; p < r.points.length; p++) {
                if (Math.hypot(x - r.points[p].x, y - r.points[p].y) < baseRadius) {
                    return { type: 'point', item: r, index: p };
                }
            }
        }
        return prevCheckHit(x, y);
    };

    // Permitir mover la etiqueta de la caja libremente
    canvas.addEventListener('mousemove', function(e) {
        if (!bgImage || !dragObj || dragObj.type !== 'cageText' || e.buttons !== 1) return;
        const pos = getLogicalPos(e);
        let cg = dragObj.item;
        let pAnt = cg.points[1];
        cg._cageTextOffset = { dx: pos.x - pAnt.x, dy: pos.y - pAnt.y };
        draw();
    }, true);

    // 8. EVENTOS DE TRAZADO PARA CAJA (2 CLICS EN DISCO) Y BARRA (PEDÍCULOS)
    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0 || !bgImage || (activeTool !== 'cage' && activeTool !== 'rod')) return;
        const pos = getLogicalPos(e);
        clickIntent = { tool: activeTool, startX: e.clientX, startY: e.clientY, logX: pos.x, logY: pos.y };
    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (!bgImage || !currentMeasurement) return;
        if (activeTool === 'cage' && currentMeasurement._tempCageStart) {
            currentMeasurement._tempCageEnd = getLogicalPos(e);
            draw();
            // Vista previa de la línea discal mientras se coloca la caja
            let sc = baseScale * zoomScale;
            ctx.save(); ctx.translate(panX, panY); ctx.scale(sc, sc);
            ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 2 / sc; ctx.setLineDash([4 / sc, 4 / sc]);
            ctx.beginPath();
            ctx.moveTo(currentMeasurement._tempCageStart.x, currentMeasurement._tempCageStart.y);
            ctx.lineTo(currentMeasurement._tempCageEnd.x, currentMeasurement._tempCageEnd.y);
            ctx.stroke(); ctx.restore();
        } else if (activeTool === 'rod' && currentMeasurement.type === 'rod') {
            currentMeasurement.tempPoint = getLogicalPos(e);
            draw();
        }
    }, true);

    canvas.addEventListener('mouseup', function(e) {
        if (!clickIntent || (clickIntent.tool !== 'cage' && clickIntent.tool !== 'rod')) return;
        if (Math.hypot(e.clientX - clickIntent.startX, e.clientY - clickIntent.startY) < 10) {
            // A. TRAZADO DE CAJA EN 2 CLICS SOBRE EL ESPACIO DISCAL
            if (clickIntent.tool === 'cage') {
                if (!currentMeasurement) {
                    if (window.ostSimActive) {
                        window.ostSimActive = false;
                        stageData[currentStage].ostSimActive = false;
                        if (typeof updateOsteotomySimButtonUI === 'function') updateOsteotomySimButtonUI();
                        draw();
                    }
                    currentMeasurement = {
                        _tempCageStart: { x: clickIntent.logX, y: clickIntent.logY },
                        _tempCageEnd: { x: clickIntent.logX, y: clickIntent.logY }
                    };
                    updateStatus(currentLang === 'es'
                        ? "🧱 Punto 1 del disco fijado. Haz clic en el otro extremo del espacio discal."
                        : "🧱 Disc Point 1 set. Click the opposite border of the disc space.");
                } else if (currentMeasurement._tempCageStart) {
                    let ptA = currentMeasurement._tempCageStart;
                    let ptB = { x: clickIntent.logX, y: clickIntent.logY };
                    // Identificar cuál punto es Anterior y cuál es Posterior según gazeDirection
                    let pAnt = (gazeDirection === 1) ? (ptA.x >= ptB.x ? ptA : ptB) : (ptA.x <= ptB.x ? ptA : ptB);
                    let pPost = (pAnt === ptA) ? ptB : ptA;

                    let presetKey = window.defaultCagePreset || 'ALIF';
                    let preset = CAGE_PRESETS[presetKey];
                    let discLen = Math.hypot(pPost.x - pAnt.x, pPost.y - pAnt.y) || 60;
                    let angInf = Math.atan2(pPost.y - pAnt.y, pPost.x - pAnt.x);
                    let rad = (preset.angle * Math.PI) / 180;
                    let dir = (pPost.x >= pAnt.x) ? -1 : 1;
                    let pSup = {
                        x: pAnt.x + Math.cos(angInf + dir * rad) * discLen,
                        y: pAnt.y + Math.sin(angInf + dir * rad) * discLen
                    };

                    let cageCount = getAllCages(measurements).length + 1;
                    let newCage = {
                        id: Date.now(),
                        type: 'osteotomy',
                        isCage: true,
                        cageType: presetKey,
                        cageAngle: preset.angle,
                        cageHeight: preset.height,
                        title: `${presetKey} #${cageCount}`,
                        color: preset.color,
                        width: 1.5,
                        fontSize: 13,
                        apexIndex: 1,
                        supIndex: 0,
                        infIndex: 2,
                        points: [pSup, { x: pAnt.x, y: pAnt.y }, { x: pPost.x, y: pPost.y }],
                        _basePoints: [{ x: pSup.x, y: pSup.y }, { x: pAnt.x, y: pAnt.y }, { x: pPost.x, y: pPost.y }],
                        textPos: null,
                        _cageTextOffset: { dx: gazeDirection === 1 ? 25 : -115, dy: -20 }
                    };
                    measurements.push(newCage);
                    window.selectedCageId = newCage.id;
                    window.selectedOstId = newCage.id;
                    currentMeasurement = null;
                    deactivateTool();
                    draw();
                    showImplantsModal();
                }
            }
            // B. TRAZADO DE TORNILLOS PEDICULARES Y BARRA MOLDEADA
            else if (clickIntent.tool === 'rod') {
                if (!currentMeasurement || currentMeasurement.type !== 'rod') {
                    measurements = measurements.filter(m => m.type !== 'rod');
                    currentMeasurement = {
                        id: Date.now(),
                        type: 'rod',
                        title: 'Rod',
                        color: '#818cf8',
                        width: 3,
                        fontSize: 13,
                        points: [{ x: clickIntent.logX, y: clickIntent.logY }],
                        closed: false,
                        textPos: { x: clickIntent.logX - 95, y: clickIntent.logY - 30 }
                    };
                    measurements.push(currentMeasurement);
                } else {
                    let lastPt = currentMeasurement.points[currentMeasurement.points.length - 1];
                    let distToLast = Math.hypot(clickIntent.logX - lastPt.x, clickIntent.logY - lastPt.y);
                    // Si hace clic sobre el último tornillo (doble clic), finaliza la barra
                    if (currentMeasurement.points.length >= 2 && distToLast < (18 / (baseScale * zoomScale))) {
                        currentMeasurement.closed = true;
                        delete currentMeasurement.tempPoint;
                        currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                        deactivateTool();
                        updateRodButtonUI(false);
                        draw();
                        showImplantsModal();
                    } else {
                        currentMeasurement.points.push({ x: clickIntent.logX, y: clickIntent.logY });
                    }
                }
            }
        }
        clickIntent = null;
        draw();
    }, true);

    const prevDeactivate = deactivateTool;
    deactivateTool = function() {
        prevDeactivate();
        updateRodButtonUI(false);
    };

    const prevClear = clearCanvas;
    clearCanvas = function() {
        window.selectedCageId = null;
        document.getElementById('implants-box').classList.add('hidden');
        prevClear();
    };

    const prevReset = resetAllStudy;
    resetAllStudy = function(s) {
        window.selectedCageId = null;
        document.getElementById('implants-box').classList.add('hidden');
        prevReset(s);
    };

    setLanguage(currentLang);
})();
