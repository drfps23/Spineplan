// ============================================================================
// ACTUALIZACIÓN 3 V2 (implantes.js): CAJAS (ACDF/ALIF/LLIF/TLIF) + BARRAS 2D
// Modo Regional Compensado (Degenerativo) y Tornillos/Barras Sagital y Coronal
// ============================================================================

(function() {
    window.selectedCageId = null;
    window.defaultCagePreset = 'TLIF';
    window.cageSimActive = false;

    const CAGE_PRESETS = {
        ACDF: { angle: 7,  height: 6,  color: '#38bdf8', region: 'cervical' },
        TLIF: { angle: 8,  height: 10, color: '#22d3ee', region: 'lumbar' },
        LLIF: { angle: 10, height: 12, color: '#06b6d4', region: 'lumbar' },
        ALIF: { angle: 15, height: 14, color: '#14b8a6', region: 'lumbar' }
    };

    // 1. TRADUCCIONES LIMPIAS (SIN ROUSSOULY, INCLUYENDO CERVICAL Y CORONAL)
    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            mod_7b_imp: "7B. Interbody Cages & Rods",
            imp_sub: "Cervical / Lumbar Cages & Pedicle Rods",
            btn_add_cage: "🧱 1. Place Cage (2 Disc Points)",
            btn_draw_rod_sag: "🔩 2. Sagittal Rod (Profile)",
            btn_draw_rod_cor: "🔩 3. Coronal Rods (AP Pedicles)",
            btn_finish_rod: "✅ Finish Current Rod",
            btn_sim_cage_off: "⚡ 4. Simulate Cage Effect (OFF)",
            btn_sim_cage_on: "✅ 4. Cage Simulation Active (ON)",
            btn_imp_panel: "⚙️ 5. Cage & Rod Settings",
            imp_modal_title: "Interbody Cages & Rod Specs",
            imp_cage_sec: "Interbody Cage Parameters",
            imp_sel_cage: "Selected Cage:",
            imp_mode_lbl: "Biomechanical Effect:",
            imp_mode_reg: "Regional (Degenerative)",
            imp_mode_glob: "Global (Long Fusion)",
            imp_ang_lbl: "Segmental Lordosis (α):",
            imp_h_lbl: "Cage Height (mm):",
            imp_rod_sec: "Pedicle Screws & Rod Measurements",
            imp_rod_len: "Rod Length(s):",
            imp_rod_bend: "Rod Contour / Alignment:"
        });
        Object.assign(I18N.es, {
            mod_7b_imp: "7B. Cajas Intersomáticas y Barras",
            imp_sub: "Cajas Cervical/Lumbar y Barras Sagital/AP",
            btn_add_cage: "🧱 1. Colocar Caja (2 Pts Disco)",
            btn_draw_rod_sag: "🔩 2. Barra Sagital (Perfil)",
            btn_draw_rod_cor: "🔩 3. Barras Coronales (AP Pedículos)",
            btn_finish_rod: "✅ Terminar Barra Actual",
            btn_sim_cage_off: "⚡ 4. Simular Efecto de Caja (OFF)",
            btn_sim_cage_on: "✅ 4. Simulación de Caja Activa (ON)",
            btn_imp_panel: "⚙️ 5. Ajustes de Cajas y Barras",
            imp_modal_title: "Ajustes de Cajas Intersomáticas y Barras",
            imp_cage_sec: "Parámetros de la Caja Intersomática",
            imp_sel_cage: "Caja Seleccionada:",
            imp_mode_lbl: "Efecto Biomecánico:",
            imp_mode_reg: "Regional (Degenerativo)",
            imp_mode_glob: "Global (Fusión Larga)",
            imp_ang_lbl: "Lordosis Segmentaria (α):",
            imp_h_lbl: "Altura de Caja (mm):",
            imp_rod_sec: "Medición de Tornillos y Barras",
            imp_rod_len: "Longitud de Barra(s):",
            imp_rod_bend: "Moldeado / Alineación:"
        });
    }

    // 2. INYECTAR MÓDULO 7B EN LA BARRA LATERAL
    const rsHeader = document.querySelector('[data-i18n="mod_7"]');
    if (rsHeader && rsHeader.parentElement) {
        const impCard = document.createElement('div');
        impCard.className = "border border-cyan-700 rounded-lg overflow-hidden";
        impCard.innerHTML = `
            <div class="bg-cyan-900/40 px-3 py-2 text-sm font-semibold text-cyan-400" data-i18n="mod_7b_imp">7B. Interbody Cages & Rods</div>
            <div class="p-3 bg-gray-900/50 space-y-2">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider block" data-i18n="imp_sub">Cervical / Lumbar Cages & Pedicle Rods</span>
                <div class="grid grid-cols-4 gap-1">
                    <button id="preset-btn-ACDF" onclick="selectCagePreset('ACDF')" class="py-1 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700" title="Cervical (ACDF)">ACDF</button>
                    <button id="preset-btn-TLIF" onclick="selectCagePreset('TLIF')" class="py-1 rounded text-[10px] font-bold bg-cyan-600 text-white border border-cyan-400 shadow" title="Posterior/Transforaminal">TLIF</button>
                    <button id="preset-btn-LLIF" onclick="selectCagePreset('LLIF')" class="py-1 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700" title="Lateral (LLIF/XLIF)">LLIF</button>
                    <button id="preset-btn-ALIF" onclick="selectCagePreset('ALIF')" class="py-1 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700" title="Anterior (ALIF)">ALIF</button>
                </div>
                <button id="btn-tool-cage" onclick="activateTool('cage', window.defaultCagePreset)" class="tool-btn w-full border border-cyan-600/60 bg-cyan-950/30 rounded px-2 py-2 text-xs text-cyan-300 hover:bg-cyan-900/50 font-bold flex justify-center items-center" data-i18n="btn_add_cage">🧱 1. Place Cage (2 Disc Points)</button>
                <div class="grid grid-cols-2 gap-1.5">
                    <button id="btn-tool-rod-sag" onclick="handleRodButtonClick('sagittal')" class="tool-btn border border-indigo-600/60 bg-indigo-950/30 rounded px-1.5 py-2 text-[11px] text-indigo-300 hover:bg-indigo-900/50 font-bold flex justify-center items-center" data-i18n="btn_draw_rod_sag">🔩 2. Sagittal Rod</button>
                    <button id="btn-tool-rod-cor" onclick="handleRodButtonClick('coronal')" class="tool-btn border border-purple-600/60 bg-purple-950/30 rounded px-1.5 py-2 text-[11px] text-purple-300 hover:bg-purple-900/50 font-bold flex justify-center items-center" data-i18n="btn_draw_rod_cor">🔩 3. Coronal Rods</button>
                </div>
                <button id="btn-sim-cage" onclick="toggleCageSimulation()" class="w-full border border-amber-600/60 bg-amber-900/20 rounded px-2 py-2 text-xs text-amber-300 hover:bg-amber-700 hover:text-white font-bold transition-colors flex justify-center items-center" data-i18n="btn_sim_cage_off">⚡ 4. Simulate Cage Effect (OFF)</button>
                <button onclick="showImplantsModal()" class="w-full border border-cyan-500 bg-cyan-600/20 rounded px-2 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-600 hover:text-white transition-colors flex justify-center items-center shadow-lg" data-i18n="btn_imp_panel">⚙️ 5. Cage & Rod Settings</button>
            </div>
        `;
        rsHeader.parentElement.parentNode.insertBefore(impCard, rsHeader.parentElement);
    }

    // 3. MODAL TÉCNICO DE CAJAS Y BARRAS (SIN ROUSSOULY)
    const mainContainer = document.getElementById('canvas-container');
    if (mainContainer) {
        const impModal = document.createElement('div');
        impModal.id = "implants-box";
        impModal.className = "hidden absolute top-20 left-1/4 bg-gray-900/95 border border-cyan-500 rounded-lg p-4 shadow-2xl z-40 backdrop-blur-md cursor-move select-none w-[355px]";
        impModal.innerHTML = `
            <div class="flex justify-between items-center mb-2.5 border-b border-gray-700 pb-2 pointer-events-none">
                <h3 class="text-cyan-400 font-bold text-sm" data-i18n="imp_modal_title">Interbody Cages & Rod Specs</h3>
                <button onclick="document.getElementById('implants-box').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 text-xs pointer-events-auto" data-i18n="btn_close">&times; Close</button>
            </div>
            <div id="imp-modal-body" class="pointer-events-auto text-xs text-gray-300 space-y-3 cursor-default">
                <div class="bg-gray-800/70 border border-gray-700 rounded p-2.5 space-y-2">
                    <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block" data-i18n="imp_cage_sec">Interbody Cage Parameters</span>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-[10px] text-gray-400 font-bold uppercase shrink-0" data-i18n="imp_sel_cage">Selected Cage:</span>
                        <select id="imp-cage-select" class="flex-1 bg-gray-900 border border-gray-600 rounded text-xs text-white p-1 font-semibold focus:outline-none focus:border-cyan-500" onchange="selectCageFromDropdown(this.value)"></select>
                        <button onclick="deleteSelectedCage()" class="bg-red-700/80 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold border border-red-500" title="Delete Cage">🗑️</button>
                    </div>
                    <div class="grid grid-cols-4 gap-1 pt-0.5">
                        <button id="mod-cage-ACDF" onclick="changeActiveCageType('ACDF')" class="py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300">ACDF</button>
                        <button id="mod-cage-TLIF" onclick="changeActiveCageType('TLIF')" class="py-1 rounded text-[10px] font-bold bg-cyan-600 text-white">TLIF</button>
                        <button id="mod-cage-LLIF" onclick="changeActiveCageType('LLIF')" class="py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300">LLIF</button>
                        <button id="mod-cage-ALIF" onclick="changeActiveCageType('ALIF')" class="py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300">ALIF</button>
                    </div>
                    <div class="pt-1">
                        <span class="text-[10px] text-gray-400 font-bold uppercase block mb-1" data-i18n="imp_mode_lbl">Biomechanical Effect:</span>
                        <div class="grid grid-cols-2 gap-1">
                            <button id="btn-cagemode-reg" onclick="setActiveCageMode('regional')" class="py-1 px-1.5 rounded text-[10px] font-bold bg-emerald-600 text-white border border-emerald-400 shadow" data-i18n="imp_mode_reg">Regional (Degenerative)</button>
                            <button id="btn-cagemode-glob" onclick="setActiveCageMode('global')" class="py-1 px-1.5 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-600" data-i18n="imp_mode_glob">Global (Long Fusion)</button>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-0.5">
                            <span class="text-[10px] text-amber-300 font-bold uppercase" data-i18n="imp_ang_lbl">Segmental Lordosis (α):</span>
                            <span id="imp-ang-val" class="text-xs font-bold text-cyan-300">8°</span>
                        </div>
                        <input type="range" id="imp-ang-slider" min="2" max="25" value="8" class="w-full accent-cyan-500 cursor-pointer">
                    </div>
                    <div>
                        <div class="flex justify-between items-center mb-0.5">
                            <span class="text-[10px] text-emerald-300 font-bold uppercase" data-i18n="imp_h_lbl">Cage Height (mm):</span>
                            <span id="imp-h-val" class="text-xs font-bold text-emerald-300">10 mm</span>
                        </div>
                        <input type="range" id="imp-h-slider" min="4" max="20" value="10" class="w-full accent-emerald-500 cursor-pointer">
                    </div>
                </div>

                <div class="bg-gray-800/70 border border-gray-700 rounded p-2.5 space-y-1.5">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider" data-i18n="imp_rod_sec">Pedicle Screws & Rod Measurements</span>
                        <button onclick="deleteAllRods()" class="text-[10px] text-red-400 hover:text-red-300 font-bold">🗑️ Rods</button>
                    </div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_rod_len">Rod Length(s):</span><span id="imp-rod-len-val" class="font-bold text-white">-</span></div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_rod_bend">Rod Contour / Alignment:</span><span id="imp-rod-bend-val" class="font-bold text-indigo-300">-</span></div>
                </div>

                <button id="btn-modal-sim-cage" onclick="toggleCageSimulation()" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow">⚡ Simulate Cage Segmental Lordosis</button>
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

    // 4. SINCRONIZACIÓN DE CAJAS INTERSOMÁTICAS (REGIONAL COMPENSADO vs GLOBAL)
    // Limpia cualquier pivote compensatorio viejo antes de recalcular
    function syncCageCompensatoryHinges(measList, simActive) {
        if (!measList) return;
        for (let i = measList.length - 1; i >= 0; i--) {
            if (measList[i].isCageComp) measList.splice(i, 1);
        }
        let cages = measList.filter(m => m.isCage && m.points && m.points.length === 3);
        cages.forEach(cg => {
            cg.type = simActive ? 'osteotomy' : 'cage_idle';
            if (simActive && (cg.cageMode || 'regional') === 'regional') {
                // Crear contra-bisagra de absorción en los discos móviles superiores (1.8 cuerpos vertebrales arriba)
                let basePts = (cg._basePoints && cg._basePoints.length === 3) ? cg._basePoints : cg.points;
                let pAnt = basePts[1];
                let pPost = basePts[2];
                let discLen = Math.hypot(pPost.x - pAnt.x, pPost.y - pAnt.y) || 55;
                let compY = pAnt.y - discLen * 1.85;
                let compAnt = { x: pAnt.x, y: compY };
                let compPost = { x: pPost.x, y: compY };

                // Contra-rotación en sentido opuesto para mantener el tronco superior erguido
                let rad = ((cg.cageAngle || 8) * 0.92 * Math.PI) / 180;
                let dir = (pPost.x >= pAnt.x) ? 1 : -1;
                let compSup = {
                    x: compAnt.x + Math.cos(dir * rad) * (compPost.x - compAnt.x) - Math.sin(dir * rad) * (compPost.y - compAnt.y),
                    y: compAnt.y + Math.sin(dir * rad) * (compPost.x - compAnt.x) + Math.cos(dir * rad) * (compPost.y - compAnt.y)
                };

                // Si pSup quedó por debajo de compPost, asegurar el orden correcto para que gire en sentido contrario a la caja
                measList.push({
                    id: cg.id + '_comp',
                    type: 'osteotomy',
                    isCageComp: true,
                    parentCageId: cg.id,
                    color: 'rgba(0,0,0,0)',
                    width: 0.001,
                    apexIndex: 1,
                    supIndex: compSup.y < compPost.y ? 0 : 2,
                    infIndex: compSup.y < compPost.y ? 2 : 0,
                    points: [compSup, compAnt, compPost],
                    _basePoints: [compSup, compAnt, compPost],
                    textPos: null
                });
            }
        });
    }

    function getAllCages(measList) {
        return (measList || measurements).filter(m => m.isCage && !m.isCageComp && m.points && m.points.length === 3);
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

    window.selectCagePreset = function(presetKey) {
        if (!CAGE_PRESETS[presetKey]) return;
        window.defaultCagePreset = presetKey;
        ['ACDF', 'TLIF', 'LLIF', 'ALIF'].forEach(k => {
            const b = document.getElementById(`preset-btn-${k}`);
            if (b) {
                b.className = (k === presetKey)
                    ? "py-1 rounded text-[10px] font-bold bg-cyan-600 text-white border border-cyan-400 shadow"
                    : "py-1 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700";
            }
        });
        if (activeTool === 'cage') activeTitle = presetKey;
    };

    window.selectCageFromDropdown = function(idVal) {
        window.selectedCageId = idVal;
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

    window.setActiveCageMode = function(modeStr) {
        let cage = getSelectedCage();
        if (cage) cage.cageMode = modeStr;
        populateImplantsModal();
        draw();
    };

    window.updateSelectedCageGeometry = function(newAngle, newHeight) {
        let cage = getSelectedCage();
        if (!cage) return;
        if (newAngle !== null && !isNaN(newAngle)) cage.cageAngle = Math.max(2, Math.min(25, newAngle));
        if (newHeight !== null && !isNaN(newHeight)) cage.cageHeight = Math.max(4, Math.min(20, newHeight));

        document.getElementById('imp-ang-val').innerText = `${Math.round(cage.cageAngle)}°`;
        document.getElementById('imp-h-val').innerText = `${Math.round(cage.cageHeight)} mm`;
        document.getElementById('imp-ang-slider').value = Math.round(cage.cageAngle);
        document.getElementById('imp-h-slider').value = Math.round(cage.cageHeight);

        if (!cage._basePoints || cage._basePoints.length !== 3) {
            cage._basePoints = cage.points.map(p => ({ x: p.x, y: p.y }));
        }
        let pAnt = cage._basePoints[1];
        let pPost = cage._basePoints[2];
        let discLen = Math.hypot(pPost.x - pAnt.x, pPost.y - pAnt.y) || 55;
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

    window.toggleCageSimulation = function() {
        let cages = getAllCages(measurements);
        let osts = measurements.filter(m => m.type === 'osteotomy' && !m.isCage && !m.isCageComp && m.points && m.points.length === 3);
        if (cages.length === 0 && osts.length === 0) {
            updateStatus(currentLang === 'es' ? "⚠️ Coloca primero una caja intersomática en el espacio discal." : "⚠️ Place an interbody cage in the disc space first.", true);
            return;
        }
        if (!window.ostSimActive && currentStage === 'pre') {
            window._preOstBaseResults = { ...window.currentResults };
        }
        window.ostSimActive = !window.ostSimActive;
        window.cageSimActive = window.ostSimActive;
        stageData[currentStage].ostSimActive = window.ostSimActive;
        syncCageCompensatoryHinges(measurements, window.ostSimActive);
        if (typeof updateOsteotomySimButtonUI === 'function') updateOsteotomySimButtonUI();
        updateCageSimButtonUI();
        draw();
    };

    function updateCageSimButtonUI() {
        const b1 = document.getElementById('btn-sim-cage');
        const b2 = document.getElementById('btn-modal-sim-cage');
        if (b1) {
            b1.innerHTML = window.ostSimActive ? t('btn_sim_cage_on') : t('btn_sim_cage_off');
            b1.className = window.ostSimActive
                ? "w-full border border-emerald-500 bg-emerald-700 text-white rounded px-2 py-2 text-xs font-bold transition-colors flex justify-center items-center shadow-lg"
                : "w-full border border-amber-600/60 bg-amber-900/20 rounded px-2 py-2 text-xs text-amber-300 hover:bg-amber-700 hover:text-white font-bold transition-colors flex justify-center items-center";
        }
        if (b2) {
            b2.innerHTML = window.ostSimActive ? "✅ Return to Original Disc Space (ON)" : "⚡ Simulate Cage Segmental Lordosis";
            b2.className = window.ostSimActive
                ? "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow"
                : "w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow";
        }
    }

    window.deleteSelectedCage = function() {
        let cage = getSelectedCage();
        if (!cage) return;
        measurements = measurements.filter(m => m.id !== cage.id && m.parentCageId !== cage.id);
        stageData[currentStage].measurements = measurements;
        let remCages = getAllCages(measurements);
        window.selectedCageId = remCages.length > 0 ? remCages[remCages.length - 1].id : null;
        if (remCages.length === 0 && measurements.filter(m => m.type === 'osteotomy' && !m.isCageComp).length === 0) {
            window.ostSimActive = false;
            stageData[currentStage].ostSimActive = false;
            updateCageSimButtonUI();
        }
        populateImplantsModal();
        draw();
    };

    window.deleteAllRods = function() {
        measurements = measurements.filter(m => m.type !== 'rod');
        stageData[currentStage].measurements = measurements;
        populateImplantsModal();
        draw();
    };

    // 5. TRAZADO DE BARRAS EN PLANO SAGITAL Y EN PLANO CORONAL (AP - 2 BARRAS)
    window.handleRodButtonClick = function(planeMode) {
        if (activeTool === 'rod' && currentMeasurement && currentMeasurement.type === 'rod') {
            if (currentMeasurement.points.length >= 2) {
                currentMeasurement.closed = true;
                delete currentMeasurement.tempPoint;
                currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                deactivateTool();
                updateRodButtonsUI(null);
                draw();
                showImplantsModal();
                return;
            }
        }
        activateTool('rod', planeMode === 'coronal' ? 'Coronal Rod' : 'Sagittal Rod', planeMode);
        updateRodButtonsUI(planeMode);
        updateStatus(planeMode === 'coronal'
            ? (currentLang === 'es' ? "🔩 Vista Coronal (AP): Haz clic en los pedículos de un lado. Doble clic en el último para cerrar (puedes trazar 2 barras: Izq y Der)." : "🔩 Coronal View (AP): Click pedicles on one side. Double-click last screw to finish (supports Left & Right rods).")
            : (currentLang === 'es' ? "🔩 Vista Sagital: Haz clic en cada pedículo. Doble clic en el último tornillo para terminar la barra." : "🔩 Sagittal View: Click each pedicle. Double-click last screw to finish the rod."));
    };

    function updateRodButtonsUI(activePlane) {
        const bSag = document.getElementById('btn-tool-rod-sag');
        const bCor = document.getElementById('btn-tool-rod-cor');
        if (bSag) {
            bSag.innerHTML = activePlane === 'sagittal' ? t('btn_finish_rod') : t('btn_draw_rod_sag');
            bSag.className = activePlane === 'sagittal'
                ? "tool-btn active border border-emerald-500 bg-emerald-700 rounded px-1.5 py-2 text-[11px] text-white font-bold flex justify-center items-center shadow-lg"
                : "tool-btn border border-indigo-600/60 bg-indigo-950/30 rounded px-1.5 py-2 text-[11px] text-indigo-300 hover:bg-indigo-900/50 font-bold flex justify-center items-center";
        }
        if (bCor) {
            bCor.innerHTML = activePlane === 'coronal' ? t('btn_finish_rod') : t('btn_draw_rod_cor');
            bCor.className = activePlane === 'coronal'
                ? "tool-btn active border border-emerald-500 bg-emerald-700 rounded px-1.5 py-2 text-[11px] text-white font-bold flex justify-center items-center shadow-lg"
                : "tool-btn border border-purple-600/60 bg-purple-950/30 rounded px-1.5 py-2 text-[11px] text-purple-300 hover:bg-purple-900/50 font-bold flex justify-center items-center";
        }
    }

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
        let sorted = rodMeas.points.slice().sort((a, b) => b.y - a.y);
        let spline = getSplinePoints(sorted, 16);
        let lenPx = 0;
        for (let i = 1; i < spline.length; i++) {
            lenPx += Math.hypot(spline[i].x - spline[i - 1].x, spline[i].y - spline[i - 1].y);
        }
        let realLen = cmPerPxVal ? (lenPx * cmPerPxVal) : lenPx;
        let unit = cmPerPxVal ? 'cm' : 'px';

        let vStart = { x: spline[1].x - spline[0].x, y: spline[1].y - spline[0].y };
        let nEnd = spline.length - 1;
        let vEnd = { x: spline[nEnd].x - spline[nEnd - 1].x, y: spline[nEnd].y - spline[nEnd - 1].y };
        let angStart = Math.atan2(vStart.y, vStart.x);
        let angEnd = Math.atan2(vEnd.y, vEnd.x);
        let globalBend = Math.abs((angEnd - angStart) * 180 / Math.PI);
        if (globalBend > 180) globalBend = 360 - globalBend;

        return { len: realLen, unit, globalBend: Math.round(globalBend), spline };
    }

    // 6. DIBUJAR CAJAS Y BARRAS (SAGITAL EN PERFIL / CORONAL EN OJO DE PEDÍCULO)
    function drawCagesAndRods(targetCtx, measList, stageGaze, stageCm, sc) {
        if (!measList) return;

        // A. CAJAS INTERSOMÁTICAS (ACDF / TLIF / LLIF / ALIF)
        let cages = getAllCages(measList);
        cages.forEach(cage => {
            let pAnt = cage.points[1];
            let pPost = cage.points[2];
            let dx = pPost.x - pAnt.x, dy = pPost.y - pAnt.y;
            let discLen = Math.hypot(dx, dy) || 40;
            let ux = dx / discLen, uy = dy / discLen;
            let nx = -uy, ny = ux;
            if (ny > 0) { nx = -nx; ny = -ny; }

            let hRatio = (cage.cageHeight || 10) / (cage.cageType === 'ACDF' ? 24 : 38);
            let hAnt = discLen * hRatio * (1 + (cage.cageAngle || 8) / 45);
            let hPost = discLen * hRatio * 0.58;

            let cAntInf = { x: pAnt.x + ux * (discLen * 0.06), y: pAnt.y + uy * (discLen * 0.06) };
            let cPostInf = { x: pAnt.x + ux * (discLen * 0.86), y: pAnt.y + uy * (discLen * 0.86) };
            let cAntSup = { x: cAntInf.x + nx * hAnt, y: cAntInf.y + ny * hAnt };
            let cPostSup = { x: cPostInf.x + nx * hPost, y: cPostInf.y + ny * hPost };

            targetCtx.save();
            targetCtx.beginPath();
            targetCtx.moveTo(cAntInf.x, cAntInf.y);
            targetCtx.lineTo(cPostInf.x, cPostInf.y);
            targetCtx.lineTo(cPostSup.x, cPostSup.y);
            targetCtx.lineTo(cAntSup.x, cAntSup.y);
            targetCtx.closePath();
            targetCtx.fillStyle = 'rgba(6, 182, 212, 0.50)';
            targetCtx.fill();
            targetCtx.lineWidth = 2.2 / sc;
            targetCtx.strokeStyle = cage.color || '#06b6d4';
            targetCtx.stroke();

            // Marcadores radiopacos internos de titanio/PEEK
            [0.28, 0.55, 0.78].forEach(tPos => {
                let bx = cAntInf.x + (cPostInf.x - cAntInf.x) * tPos;
                let by = cAntInf.y + (cPostInf.y - cAntInf.y) * tPos;
                let tx = cAntSup.x + (cPostSup.x - cAntSup.x) * tPos;
                let ty = cAntSup.y + (cPostSup.y - cAntSup.y) * tPos;
                targetCtx.beginPath();
                targetCtx.moveTo(bx, by);
                targetCtx.lineTo(tx, ty);
                targetCtx.strokeStyle = '#f8fafc';
                targetCtx.lineWidth = 1.5 / sc;
                targetCtx.stroke();
            });

            let off = cage._cageTextOffset || { dx: -65, dy: -28 };
            let tx = pAnt.x + off.dx, ty = pAnt.y + off.dy;
            cage._renderedTextPos = { x: tx, y: ty };
            let fSize = cage.fontSize || 13;
            targetCtx.font = `bold ${fSize / sc}px sans-serif`;
            targetCtx.textAlign = 'left';
            targetCtx.textBaseline = 'top';
            targetCtx.shadowColor = 'rgba(0,0,0,0.95)';
            targetCtx.shadowBlur = 4 / sc;
            targetCtx.fillStyle = cage.color || '#22d3ee';
            targetCtx.fillText(`🧱 ${cage.title || cage.cageType || 'TLIF'}`, tx, ty);
            targetCtx.fillStyle = '#e2e8f0';
            targetCtx.fillText(`${Math.round(cage.cageAngle || 8)}° | ${Math.round(cage.cageHeight || 10)}mm`, tx, ty + (fSize + 3) / sc);
            targetCtx.shadowBlur = 0;
            targetCtx.restore();
        });

        // B. TORNILLOS Y BARRAS (VISTA SAGITAL DE PERFIL vs VISTA CORONAL AP)
        let rods = measList.filter(m => m.type === 'rod' && m.points && m.points.length > 0);
        rods.forEach(rod => {
            targetCtx.save();
            let pts = rod.points.slice();
            if (!rod.closed && rod.tempPoint) pts.push(rod.tempPoint);
            let isCoronal = (rod.subType === 'coronal');

            // 1. Dibujar la barra primero en vista Coronal para que los tulipanes queden encima
            if (pts.length >= 2) {
                let spline = getSplinePoints(pts, 16);
                targetCtx.beginPath();
                targetCtx.moveTo(spline[0].x, spline[0].y);
                for (let i = 1; i < spline.length; i++) {
                    targetCtx.lineTo(spline[i].x, spline[i].y);
                }
                targetCtx.strokeStyle = isCoronal ? '#c084fc' : '#818cf8';
                targetCtx.lineWidth = 4.2 / sc;
                targetCtx.lineCap = 'round';
                targetCtx.stroke();

                targetCtx.strokeStyle = '#f3e8ff';
                targetCtx.lineWidth = 1.3 / sc;
                targetCtx.stroke();
            }

            // 2. Dibujar tornillos según el plano (Sagital vs Coronal AP)
            rod.points.forEach((pt, idx) => {
                if (isCoronal) {
                    // Vista Coronal (AP): Tornillo coaxial dentro del "ojo del pedículo"
                    let rOuter = 7.5 / sc;
                    let rInner = 3.8 / sc;
                    targetCtx.beginPath();
                    targetCtx.arc(pt.x, pt.y, rOuter, 0, 2 * Math.PI);
                    targetCtx.fillStyle = 'rgba(15, 23, 42, 0.75)';
                    targetCtx.fill();
                    targetCtx.lineWidth = 2 / sc;
                    targetCtx.strokeStyle = '#e879f9';
                    targetCtx.stroke();

                    // Núcleo coaxial del tornillo y ranura del tulipán
                    targetCtx.beginPath();
                    targetCtx.arc(pt.x, pt.y, rInner, 0, 2 * Math.PI);
                    targetCtx.fillStyle = '#f8fafc';
                    targetCtx.fill();
                    targetCtx.beginPath();
                    targetCtx.moveTo(pt.x - rOuter * 0.7, pt.y);
                    targetCtx.lineTo(pt.x + rOuter * 0.7, pt.y);
                    targetCtx.strokeStyle = '#38bdf8';
                    targetCtx.lineWidth = 1.5 / sc;
                    targetCtx.stroke();
                } else {
                    // Vista Sagital (Perfil): Cuerpo del tornillo entrando al soma + Tulipán posterior
                    let nextPt = rod.points[Math.min(rod.points.length - 1, idx + 1)];
                    let prevPt = rod.points[Math.max(0, idx - 1)];
                    let ty = nextPt.y - prevPt.y, tx = nextPt.x - prevPt.x;
                    let sx = stageGaze, sy = -(tx * stageGaze) / (Math.abs(ty) > 5 ? ty : 20);
                    let sMag = Math.hypot(sx, sy) || 1;
                    sx /= sMag; sy /= sMag;

                    let screwLen = 35 / sc;
                    let tipX = pt.x + sx * screwLen;
                    let tipY = pt.y + sy * screwLen;

                    targetCtx.beginPath();
                    targetCtx.moveTo(pt.x, pt.y);
                    targetCtx.lineTo(tipX, tipY);
                    targetCtx.strokeStyle = '#94a3b8';
                    targetCtx.lineWidth = 3.2 / sc;
                    targetCtx.stroke();

                    targetCtx.beginPath();
                    targetCtx.arc(pt.x, pt.y, 5 / sc, 0, 2 * Math.PI);
                    targetCtx.fillStyle = '#38bdf8';
                    targetCtx.fill();
                    targetCtx.lineWidth = 1.5 / sc;
                    targetCtx.strokeStyle = '#0f172a';
                    targetCtx.stroke();
                }
            });

            if (pts.length >= 2) {
                let metrics = computeRodMetrics(rod, stageCm);
                if (metrics && rod.textPos) {
                    let fSize = rod.fontSize || 13;
                    targetCtx.font = `bold ${fSize / sc}px sans-serif`;
                    targetCtx.textAlign = 'left';
                    targetCtx.textBaseline = 'top';
                    targetCtx.shadowColor = 'rgba(0,0,0,0.95)';
                    targetCtx.shadowBlur = 4 / sc;
                    targetCtx.fillStyle = isCoronal ? '#e879f9' : '#a5b4fc';
                    targetCtx.fillText(`🔩 ${rod.title || 'Rod'} (${fmtInt(metrics.len)} ${metrics.unit})`, rod.textPos.x, rod.textPos.y);
                    targetCtx.fillStyle = '#e2e8f0';
                    targetCtx.fillText(`${isCoronal ? 'Align' : 'Bend'}: ${metrics.globalBend}°`, rod.textPos.x, rod.textPos.y + (fSize + 3) / sc);
                    targetCtx.shadowBlur = 0;
                }
            }
            targetCtx.restore();
        });
    }

    // 7. ACTUALIZAR PANEL DE AJUSTES DE CAJAS Y BARRAS
    window.populateImplantsModal = function() {
        let cages = getAllCages(measurements);
        const selEl = document.getElementById('imp-cage-select');
        let selCage = getSelectedCage();

        if (selEl) {
            if (cages.length === 0) {
                selEl.innerHTML = `<option value="">-- No Cages Placed --</option>`;
            } else {
                selEl.innerHTML = cages.map((c, idx) => {
                    let lbl = c.title || `${c.cageType || 'TLIF'} #${idx + 1}`;
                    return `<option value="${c.id}" ${selCage && String(c.id) === String(selCage.id) ? 'selected' : ''}>${lbl} (${Math.round(c.cageAngle || 8)}° | ${Math.round(c.cageHeight || 10)}mm)</option>`;
                }).join('');
            }
        }

        if (selCage) {
            ['ACDF', 'TLIF', 'LLIF', 'ALIF'].forEach(k => {
                const b = document.getElementById(`mod-cage-${k}`);
                if (b) {
                    b.className = (selCage.cageType === k)
                        ? "py-1 rounded text-[10px] font-bold bg-cyan-600 text-white shadow"
                        : "py-1 rounded text-[10px] font-bold bg-gray-700 text-gray-300";
                }
            });
            let mode = selCage.cageMode || 'regional';
            const bReg = document.getElementById('btn-cagemode-reg');
            const bGlob = document.getElementById('btn-cagemode-glob');
            if (bReg && bGlob) {
                bReg.className = mode === 'regional'
                    ? "py-1 px-1.5 rounded text-[10px] font-bold bg-emerald-600 text-white border border-emerald-400 shadow"
                    : "py-1 px-1.5 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-600";
                bGlob.className = mode === 'global'
                    ? "py-1 px-1.5 rounded text-[10px] font-bold bg-amber-600 text-white border border-amber-400 shadow"
                    : "py-1 px-1.5 rounded text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-600";
            }
            document.getElementById('imp-ang-val').innerText = `${Math.round(selCage.cageAngle || 8)}°`;
            document.getElementById('imp-h-val').innerText = `${Math.round(selCage.cageHeight || 10)} mm`;
            document.getElementById('imp-ang-slider').value = Math.round(selCage.cageAngle || 8);
            document.getElementById('imp-h-slider').value = Math.round(selCage.cageHeight || 10);
        }

        let rods = measurements.filter(m => m.type === 'rod' && m.points && m.points.length >= 2);
        if (rods.length > 0) {
            let lenStrs = [];
            let bendStrs = [];
            rods.forEach((r, idx) => {
                let m = computeRodMetrics(r, window.cmPerPx);
                if (m) {
                    lenStrs.push(`#${idx + 1}: ${fmtInt(m.len)}${m.unit}`);
                    bendStrs.push(`#${idx + 1}: ${m.globalBend}°`);
                }
            });
            document.getElementById('imp-rod-len-val').innerText = lenStrs.join(' | ');
            document.getElementById('imp-rod-bend-val').innerText = bendStrs.join(' | ');
        } else {
            document.getElementById('imp-rod-len-val').innerText = '-';
            document.getElementById('imp-rod-bend-val').innerText = '-';
        }
        updateCageSimButtonUI();
    };

    window.showImplantsModal = function() {
        populateImplantsModal();
        document.getElementById('implants-box').classList.remove('hidden');
        if (window.innerWidth < 768 && isMobileMenuOpen) toggleMobileMenu();
    };

    // 8. CONECTAR AL CICLO DE DIBUJO Y APLICAR COMPENSACIÓN REGIONAL A LAS MEDICIONES
    const prevDraw = draw;
    draw = function() {
        if (bgImage) {
            syncCageCompensatoryHinges(measurements, window.ostSimActive);
        }
        prevDraw();
        if (bgImage) {
            // En Modo Regional, asegurar que los ángulos regionales (L4-S1, L1-S1, C2-C7) sumen la lordosis de la caja aunque L1 esté arriba del pivote de compensación
            if (window.ostSimActive) {
                let regCages = getAllCages(measurements).filter(c => (c.cageMode || 'regional') === 'regional');
                if (regCages.length > 0) {
                    measurements.forEach(m => {
                        if (m.type === 'cobb' && m.points && m.points.length === 4) {
                            let yTop = Math.min(m.points[0].y, m.points[1].y, m.points[2].y, m.points[3].y);
                            let yBot = Math.max(m.points[0].y, m.points[1].y, m.points[2].y, m.points[3].y);
                            let addedDeg = 0;
                            regCages.forEach(cg => {
                                let cy = cg.points[1].y;
                                // Si la caja está dentro del segmento medido (ej. L5-S1 dentro de L1-S1 o L4-S1, o C5-C6 dentro de C2-C7)
                                if (cy >= yTop - 25 && cy <= yBot + 25) {
                                    let compY = cy - (Math.hypot(cg.points[2].x - cg.points[1].x, cg.points[2].y - cg.points[1].y) || 55) * 1.85;
                                    // Si el platillo superior del Cobb quedó por encima del pivote de compensación, restituir la ganancia lordótica regional
                                    if (yTop < compY) {
                                        addedDeg += Math.round((cg.cageAngle || 8) * 0.92);
                                    }
                                }
                            });
                            if (addedDeg > 0 && window._preOstBaseResults && window._preOstBaseResults[m.title] !== undefined) {
                                let baseVal = Math.abs(window._preOstBaseResults[m.title]);
                                window.currentResults[m.title] = baseVal + addedDeg;
                            }
                        }
                    });
                    stageData[currentStage].results = { ...window.currentResults };
                    if (!document.getElementById('theoretical-table').classList.contains('hidden') && typeof updateTheoreticalTableContent === 'function') {
                        updateTheoreticalTableContent();
                    }
                }
            }

            let sc = baseScale * zoomScale;
            ctx.save();
            ctx.translate(panX, panY);
            ctx.scale(sc, sc);
            drawCagesAndRods(ctx, measurements, gazeDirection, window.cmPerPx, sc);
            ctx.restore();
            updateCageSimButtonUI();
            if (!document.getElementById('implants-box').classList.contains('hidden')) populateImplantsModal();
        }
    };

    const prevRenderStage = renderStageOnContext;
    renderStageOnContext = function(cCtx, sData, panXVal, panYVal, sc) {
        if (sData && sData.measurements) syncCageCompensatoryHinges(sData.measurements, sData.ostSimActive);
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

        let cages = getAllCages(measurements);
        for (let i = cages.length - 1; i >= 0; i--) {
            let cg = cages[i];
            let tp = cg._renderedTextPos;
            if (tp && x >= tp.x - 15 / sc && x <= tp.x + 145 / sc && y >= tp.y - 10 / sc && y <= tp.y + 50 / sc) {
                window.selectedCageId = cg.id;
                if (!document.getElementById('implants-box').classList.contains('hidden')) populateImplantsModal();
                return { type: 'cageText', item: cg };
            }
        }

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

    canvas.addEventListener('mousemove', function(e) {
        if (!bgImage || !dragObj || dragObj.type !== 'cageText' || e.buttons !== 1) return;
        const pos = getLogicalPos(e);
        let cg = dragObj.item;
        let pAnt = cg.points[1];
        cg._cageTextOffset = { dx: pos.x - pAnt.x, dy: pos.y - pAnt.y };
        draw();
    }, true);

    // 9. EVENTOS DE CLIC PARA COLOCAR CAJAS (2 PUNTOS) Y BARRAS SAGITAL / CORONAL
    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0 || !bgImage || (activeTool !== 'cage' && activeTool !== 'rod')) return;
        const pos = getLogicalPos(e);
        clickIntent = { tool: activeTool, subType: activeSubType, startX: e.clientX, startY: e.clientY, logX: pos.x, logY: pos.y };
    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (!bgImage || !currentMeasurement) return;
        if (activeTool === 'cage' && currentMeasurement._tempCageStart) {
            currentMeasurement._tempCageEnd = getLogicalPos(e);
            draw();
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
            if (clickIntent.tool === 'cage') {
                if (!currentMeasurement) {
                    if (window.ostSimActive) {
                        window.ostSimActive = false;
                        stageData[currentStage].ostSimActive = false;
                        syncCageCompensatoryHinges(measurements, false);
                        updateCageSimButtonUI();
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
                    let pAnt = (gazeDirection === 1) ? (ptA.x >= ptB.x ? ptA : ptB) : (ptA.x <= ptB.x ? ptA : ptB);
                    let pPost = (pAnt === ptA) ? ptB : ptA;

                    let presetKey = window.defaultCagePreset || 'TLIF';
                    let preset = CAGE_PRESETS[presetKey];
                    let discLen = Math.hypot(pPost.x - pAnt.x, pPost.y - pAnt.y) || 55;
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
                        type: 'cage_idle',
                        isCage: true,
                        cageMode: 'regional', // Por defecto Regional (Degenerativo)
                        cageType: presetKey,
                        cageAngle: preset.angle,
                        cageHeight: preset.height,
                        title: `${presetKey} #${cageCount}`,
                        color: 'rgba(0,0,0,0)',
                        width: 0.001,
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
                    currentMeasurement = null;
                    deactivateTool();
                    draw();
                    showImplantsModal();
                }
            } else if (clickIntent.tool === 'rod') {
                let planeMode = activeSubType || 'sagittal';
                if (!currentMeasurement || currentMeasurement.type !== 'rod') {
                    // En modo Sagital se reemplaza la barra única; en modo Coronal permite trazar 2 barras (Izquierda y Derecha)
                    if (planeMode === 'sagittal') {
                        measurements = measurements.filter(m => !(m.type === 'rod' && m.subType !== 'coronal'));
                    }
                    let corCount = measurements.filter(m => m.type === 'rod' && m.subType === 'coronal').length + 1;
                    currentMeasurement = {
                        id: Date.now(),
                        type: 'rod',
                        subType: planeMode,
                        title: planeMode === 'coronal' ? `AP Rod #${corCount}` : 'Rod',
                        color: planeMode === 'coronal' ? '#c084fc' : '#818cf8',
                        width: 3,
                        fontSize: 13,
                        points: [{ x: clickIntent.logX, y: clickIntent.logY }],
                        closed: false,
                        textPos: { x: clickIntent.logX + (planeMode === 'coronal' ? 22 : -95), y: clickIntent.logY - 25 }
                    };
                    measurements.push(currentMeasurement);
                } else {
                    let lastPt = currentMeasurement.points[currentMeasurement.points.length - 1];
                    let distToLast = Math.hypot(clickIntent.logX - lastPt.x, clickIntent.logY - lastPt.y);
                    if (currentMeasurement.points.length >= 2 && distToLast < (18 / (baseScale * zoomScale))) {
                        currentMeasurement.closed = true;
                        delete currentMeasurement.tempPoint;
                        currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                        deactivateTool();
                        updateRodButtonsUI(null);
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
        updateRodButtonsUI(null);
    };

    const prevClear = clearCanvas;
    clearCanvas = function() {
        window.selectedCageId = null;
        window.cageSimActive = false;
        document.getElementById('implants-box').classList.add('hidden');
        prevClear();
        updateCageSimButtonUI();
    };

    const prevReset = resetAllStudy;
    resetAllStudy = function(s) {
        window.selectedCageId = null;
        window.cageSimActive = false;
        document.getElementById('implants-box').classList.add('hidden');
        prevReset(s);
        updateCageSimButtonUI();
    };

    setLanguage(currentLang);
})();
