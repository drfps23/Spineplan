// ============================================================================
// MÓDULO CONECTABLE: 7. OSTEOTOMÍAS MÚLTIPLES (SCHWAB, 2014) + CINEMÁTICA V3
// Soporta múltiples cortes por niveles, suma armónica en cadena y tabla única
// ============================================================================

(function() {
    window.ostSimActive = false;
    window._preOstBaseResults = null;
    window.selectedOstId = null;

    // 1. TRADUCCIONES Y RENUMERACIÓN AUTOMÁTICA DE MÓDULOS 8 AL 13
    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            mod_7_ost: "7. Osteotomies (Schwab, 2014)",
            ost_sub: "Multi-Level Wedge & Live Kinematics",
            btn_draw_ost: "📐 1. Add Wedge Cut (3 Points)",
            btn_sim_ost: "✂️ 2. Simulate Wedge Closure (OFF)",
            btn_sim_ost_on: "✅ 2. Wedge Closure Active (ON)",
            btn_calc_schwab: "📊 3. Schwab (2014) & Degrees",
            schwab_title: "Schwab Osteotomy Classification (2014)",
            sw_active_cut: "Selected Osteotomy:",
            sw_set_deg: "Selected Cut Angle (α):",
            sw_grade_lbl: "Grades of Vertebral Resection (Schwab, 2014):",
            mod_7: "8. Roussouly (2018)",
            mod_8: "9. Abelin-Genevois (AIS)",
            mod_9: "10. Coronal Plane",
            mod_10: "11. Bao Classification (2016)",
            mod_11: "12. Spondylolisthesis & AO",
            mod_12: "13. Vertebral Mapping"
        });
        Object.assign(I18N.es, {
            mod_7_ost: "7. Osteotomías (Schwab, 2014)",
            ost_sub: "Multicorte en Cuña y Cinemática en Vivo",
            btn_draw_ost: "📐 1. Agregar Corte en Cuña (3 Pts)",
            btn_sim_ost: "✂️ 2. Simular Cierre de Cuñas (OFF)",
            btn_sim_ost_on: "✅ 2. Cierre de Cuñas Activo (ON)",
            btn_calc_schwab: "📊 3. Schwab (2014) y Grados",
            schwab_title: "Clasificación de Osteotomías de Schwab (2014)",
            sw_active_cut: "Osteotomía Seleccionada:",
            sw_set_deg: "Grados del Corte Seleccionado (α):",
            sw_grade_lbl: "Grados de Resección Vertebral (Schwab, 2014):",
            mod_7: "8. Roussouly (2018)",
            mod_8: "9. Abelin-Genevois (EIA)",
            mod_9: "10. Plano Coronal",
            mod_10: "11. Clasificación de Bao (2016)",
            mod_11: "12. Espondilolistesis y AO",
            mod_12: "13. Mapeo Vertebral"
        });
    }

    // 2. INYECTAR MÓDULO 7 EN LA BARRA LATERAL Y CUADRO FLOTANTE DE SCHWAB
    const rsHeader = document.querySelector('[data-i18n="mod_7"]');
    if (rsHeader && rsHeader.parentElement) {
        const mod7Card = document.createElement('div');
        mod7Card.className = "border border-rose-700 rounded-lg overflow-hidden";
        mod7Card.innerHTML = `
            <div class="bg-rose-900/40 px-3 py-2 text-sm font-semibold text-rose-400" data-i18n="mod_7_ost">7. Osteotomies (Schwab, 2014)</div>
            <div class="p-3 bg-gray-900/50 space-y-2">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider block" data-i18n="ost_sub">Multi-Level Wedge & Live Kinematics</span>
                <button onclick="activateTool('osteotomy', 'Ost')" class="tool-btn w-full border border-rose-700/60 bg-rose-950/30 rounded px-2 py-2 text-xs text-rose-300 hover:bg-rose-900/50 font-bold flex justify-center items-center" data-i18n="btn_draw_ost">📐 1. Add Wedge Cut (3 Points)</button>
                <button id="btn-sim-ost" onclick="toggleOsteotomySim()" class="w-full border border-amber-600/60 bg-amber-900/20 rounded px-2 py-2 text-xs text-amber-300 hover:bg-amber-700 hover:text-white font-bold transition-colors flex justify-center items-center" data-i18n="btn_sim_ost">✂️ 2. Simulate Wedge Closure (OFF)</button>
                <button onclick="showSchwab()" class="w-full border border-rose-500 bg-rose-600/20 rounded px-2 py-2 text-xs font-bold text-rose-300 hover:bg-rose-600 hover:text-white transition-colors flex justify-center items-center shadow-lg" data-i18n="btn_calc_schwab">📊 3. Schwab (2014) & Degrees</button>
            </div>
        `;
        rsHeader.parentElement.parentNode.insertBefore(mod7Card, rsHeader.parentElement);
    }

    const mainContainer = document.getElementById('canvas-container');
    if (mainContainer) {
        const schwabModal = document.createElement('div');
        schwabModal.id = "schwab-box";
        schwabModal.className = "hidden absolute top-20 left-1/3 bg-gray-900/95 border border-rose-500 rounded-lg p-4 shadow-2xl z-40 backdrop-blur-md cursor-move select-none w-[350px]";
        schwabModal.innerHTML = `
            <div class="flex justify-between items-center mb-2.5 border-b border-gray-700 pb-2 pointer-events-none">
                <h3 class="text-rose-400 font-bold text-sm" data-i18n="schwab_title">Schwab Osteotomy Classification (2014)</h3>
                <button onclick="document.getElementById('schwab-box').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 text-xs pointer-events-auto" data-i18n="btn_close">&times; Close</button>
            </div>
            <div class="pointer-events-auto text-xs text-gray-300 space-y-2.5">
                <div class="grid grid-cols-3 gap-2 border-b border-gray-700 pb-2 text-center">
                    <div><span class="text-gray-400 block text-[10px]">Total Wedge (Σα)</span><span id="sw-wedge" class="font-bold text-rose-400 text-sm">0°</span></div>
                    <div><span class="text-gray-400 block text-[10px]">Ideal LL</span><span id="sw-ideal-ll" class="font-bold text-emerald-400 text-sm">-</span></div>
                    <div><span class="text-gray-400 block text-[10px]">Sim. Post-LL</span><span id="sw-sim-ll" class="font-bold text-sky-400 text-sm">-</span></div>
                </div>
                <div id="sw-cut-selector-row" class="flex items-center space-x-1.5">
                    <span class="text-[10px] text-gray-400 font-bold uppercase shrink-0" data-i18n="sw_active_cut">Selected Osteotomy:</span>
                    <select id="sw-ost-select" class="flex-1 bg-gray-800 border border-gray-600 rounded text-xs text-white p-1 font-semibold focus:outline-none focus:border-rose-500" onchange="selectOsteotomyFromDropdown(this.value)"></select>
                    <button onclick="deleteSelectedOsteotomy()" title="Delete Selected Osteotomy" class="bg-red-700/80 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold border border-red-500">🗑️</button>
                </div>
                <div id="sw-controls-wrap" class="bg-gray-800/70 border border-gray-700 rounded p-2 cursor-default">
                    <div class="flex justify-between items-center mb-1.5">
                        <span class="text-[10px] text-amber-300 font-bold uppercase" data-i18n="sw_set_deg">Selected Cut Angle (α):</span>
                        <div class="flex items-center space-x-1">
                            <input type="number" id="sw-angle-input" min="1" max="85" value="15" class="w-16 bg-gray-950 border border-gray-600 rounded px-1.5 py-0.5 text-center text-white font-bold text-xs focus:outline-none focus:border-rose-500">
                            <span class="text-xs font-bold text-white">°</span>
                        </div>
                    </div>
                    <input type="range" id="sw-angle-slider" min="1" max="75" value="15" class="w-full accent-rose-500 cursor-pointer">
                </div>
                <div>
                    <label class="text-[10px] text-rose-300 uppercase font-bold block mb-1" data-i18n="sw_grade_lbl">Grades of Vertebral Resection (Schwab, 2014):</label>
                    <select id="sw-selector" class="w-full bg-gray-800 border border-gray-600 rounded text-xs text-white p-1.5 focus:outline-none focus:border-rose-500" onchange="updateSchwabGradeInfo(this.value)">
                        <option value="1">1: Partial facet joint (~5°-10°)</option>
                        <option value="2">2: Complete facet joint (~10°-15°)</option>
                        <option value="3">3: Pedicle / partial body (~25°-35°)</option>
                        <option value="4">4: Pedicle / disc / partial body (~35°-45°)</option>
                        <option value="5">5: Complete vertebra and discs (~40°-60°)</option>
                        <option value="6">6: Multiple vertebrae and discs (>60°)</option>
                    </select>
                </div>
                <div class="bg-gray-800/80 border border-gray-700 rounded p-2.5 text-center">
                    <div id="sw-badge" class="bg-rose-600 text-white font-bold py-0.5 px-3 rounded-full mb-1 inline-block text-xs shadow">Grade 2</div>
                    <p id="sw-desc" class="text-[11px] text-gray-200 leading-snug font-medium"></p>
                </div>
                <button id="btn-modal-sim-ost" onclick="toggleOsteotomySim()" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow">✂️ Simulate / Close Wedge on X-Ray</button>
            </div>
        `;
        mainContainer.appendChild(schwabModal);
        if (typeof makeInteractivePanel === 'function') makeInteractivePanel(schwabModal);

        const ctrlWrap = document.getElementById('sw-controls-wrap');
        const sliderEl = document.getElementById('sw-angle-slider');
        const inputEl = document.getElementById('sw-angle-input');
        const ostSelEl = document.getElementById('sw-ost-select');
        ['mousedown', 'touchstart', 'pointerdown'].forEach(evtName => {
            ctrlWrap.addEventListener(evtName, (ev) => ev.stopPropagation());
            sliderEl.addEventListener(evtName, (ev) => ev.stopPropagation());
            inputEl.addEventListener(evtName, (ev) => ev.stopPropagation());
            ostSelEl.addEventListener(evtName, (ev) => ev.stopPropagation());
        });
        sliderEl.addEventListener('input', function() { setOsteotomyCustomAngle(this.value); });
        inputEl.addEventListener('input', function() { if (this.value !== '') setOsteotomyCustomAngle(this.value); });
        inputEl.addEventListener('change', function() { setOsteotomyCustomAngle(this.value); });
    }

    // 3. GEOMETRÍA BASE Y CADENA CINEMÁTICA MULTICORTE (CAUDAL -> CRANEAL)
    function detectWedgeApexAndRaysOnPoints(m, pts) {
        if (!pts || pts.length < 3) return null;
        if (typeof m.apexIndex !== 'number') {
            let d01 = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
            let d12 = Math.hypot(pts[1].x - pts[2].x, pts[1].y - pts[2].y);
            let d20 = Math.hypot(pts[2].x - pts[0].x, pts[2].y - pts[0].y);
            if (d12 <= d01 && d12 <= d20) m.apexIndex = 0;
            else if (d20 <= d01 && d20 <= d12) m.apexIndex = 1;
            else m.apexIndex = 2;

            let others = [0, 1, 2].filter(i => i !== m.apexIndex);
            m.supIndex = pts[others[0]].y < pts[others[1]].y ? others[0] : others[1];
            m.infIndex = m.supIndex === others[0] ? others[1] : others[0];
        }
        let others = [0, 1, 2].filter(i => i !== m.apexIndex);
        let supIdx = (typeof m.supIndex === 'number') ? m.supIndex : (pts[others[0]].y < pts[others[1]].y ? others[0] : others[1]);
        let infIdx = (typeof m.infIndex === 'number') ? m.infIndex : (supIdx === others[0] ? others[1] : others[0]);
        return { apexIdx: m.apexIndex, supIdx, infIdx };
    }

    window.computeOsteotomyGeometry = function(m, useBase = true) {
        if (!m || !m.points || m.points.length < 3) return null;
        let pts = (useBase && m._basePoints && m._basePoints.length === 3) ? m._basePoints : m.points;
        let idxs = detectWedgeApexAndRaysOnPoints(m, pts);
        let p1 = pts[idxs.apexIdx];
        let pSup = pts[idxs.supIdx];
        let pInf = pts[idxs.infIdx];

        let angSup = Math.atan2(pSup.y - p1.y, pSup.x - p1.x);
        let angInf = Math.atan2(pInf.y - p1.y, pInf.x - p1.x);
        let rotAngle = angInf - angSup;
        while (rotAngle > Math.PI) rotAngle -= 2 * Math.PI;
        while (rotAngle < -Math.PI) rotAngle += 2 * Math.PI;
        let deg = Math.abs(rotAngle * 180 / Math.PI);
        if (deg > 120) deg = 180 - deg;

        let vx = pInf.x - p1.x, vy = pInf.y - p1.y, len = Math.hypot(vx, vy) || 1;
        vx /= len; vy /= len;
        let nx = -vy, ny = vx;
        if (ny > 0) { nx = -nx; ny = -ny; }
        let pMid = { x: (pSup.x + pInf.x) / 2, y: (pSup.y + pInf.y) / 2 };
        let levelY = (p1.y + pMid.y) / 2;

        return { item: m, id: m.id, p1, pSup, pInf, pMid, levelY, rotAngle, deg, vx, vy, nx, ny, apexIdx: idxs.apexIdx, supIdx: idxs.supIdx, infIdx: idxs.infIdx };
    };

    // Obtiene todas las osteotomías completadas ordenadas de Caudal a Craneal (abajo hacia arriba)
    function getSortedOsteotomyGeoms(measList) {
        if (!measList) return [];
        let osts = measList.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        let geoms = osts.map(m => computeOsteotomyGeometry(m, true)).filter(Boolean);
        geoms.sort((a, b) => b.levelY - a.levelY); // Mayor Y (más caudal) primero
        return geoms;
    }

    function renumberOsteotomies(measList) {
        if (!measList) return;
        let osts = measList.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        osts.forEach((m, idx) => {
            if (!m.title || /^Ost(eotomy)?(\s*#\d+)?$/i.test(m.title)) {
                m.title = `Ost #${idx + 1}`;
            }
        });
    }

    function rotatePoint(pt, center, angleRad) {
        let dx = pt.x - center.x, dy = pt.y - center.y;
        let c = Math.cos(angleRad), s = Math.sin(angleRad);
        return { x: center.x + dx * c - dy * s, y: center.y + dx * s + dy * c };
    }

    // Evalúa si una estructura anatómica en coordenadas base está craneal al corte g
    function isPointCranialToCut(refBasePt, g) {
        let dx = refBasePt.x - g.p1.x;
        let dy = refBasePt.y - g.p1.y;
        return (dx * g.nx + dy * g.ny) > 0;
    }

    // Aplica la cadena de rotaciones acumulativas a un punto base según su punto de referencia vertebral
    function forwardChainPoint(basePt, refBasePt, geomsCaudalToCranial) {
        let cur = { x: basePt.x, y: basePt.y };
        // Aplicamos de Craneal a Caudal en coordenadas base (matemáticamente idéntico a Caudal->Craneal con bisagras móviles)
        for (let i = geomsCaudalToCranial.length - 1; i >= 0; i--) {
            let g = geomsCaudalToCranial[i];
            if (isPointCranialToCut(refBasePt, g)) {
                cur = rotatePoint(cur, g.p1, g.rotAngle);
            }
        }
        return cur;
    }

    // Invierte la cadena de rotaciones (de pantalla simulada a coordenada base en la radiografía original)
    function inverseChainPoint(simPt, geomsCaudalToCranial, knownRefBasePt = null) {
        let cur = { x: simPt.x, y: simPt.y };
        for (let i = 0; i < geomsCaudalToCranial.length; i++) {
            let g = geomsCaudalToCranial[i];
            let isCranial = knownRefBasePt ? isPointCranialToCut(knownRefBasePt, g) : isPointCranialToCut(cur, g);
            if (isCranial) {
                cur = rotatePoint(cur, g.p1, -g.rotAngle);
            }
        }
        return cur;
    }

    function getAnchorPoint(pts) {
        if (!pts || pts.length === 0) return { x: 0, y: 0 };
        return pts[0];
    }

    // Sincroniza cuando el cirujano mueve un texto o punto con el mouse
    function syncDraggedItemToBase(item, geomsCaudalToCranial) {
        if (!item || item.type === 'pelvic' || item.type === 'coronal_cf') return;
        if (item.type === 'osteotomy') {
            if (item.points && item.points.length === 3) {
                if (!window.ostSimActive) {
                    item._basePoints = item.points.map(p => ({ x: p.x, y: p.y }));
                }
                if (item.textPos) {
                    let anchor = item.points[item.apexIndex || 0] || item.points[0];
                    item._textOffset = { dx: item.textPos.x - anchor.x, dy: item.textPos.y - anchor.y };
                }
            }
            return;
        }
        if (item.points && item._basePoints) {
            if (!window.ostSimActive) {
                item._basePoints = item.points.map(p => ({ x: p.x, y: p.y }));
            } else {
                item._basePoints = item.points.map((curPt, idx) => {
                    let origBase = item._basePoints[idx] || curPt;
                    return inverseChainPoint(curPt, geomsCaudalToCranial, origBase);
                });
            }
        }
        if (item.textPos && item.points && item.points.length > 0) {
            let anchor = getAnchorPoint(item.points);
            item._textOffset = { dx: item.textPos.x - anchor.x, dy: item.textPos.y - anchor.y };
        }
    }

    function applyOsteotomyKinematics(measList, simActive) {
        if (!measList) return;
        renumberOsteotomies(measList);

        // Asegurar que toda osteotomía completada tenga sus _basePoints inicializados
        measList.forEach(m => {
            if (m.type === 'osteotomy' && m.points && m.points.length === 3) {
                if (!m._basePoints || m._basePoints.length !== 3) {
                    m._basePoints = m.points.map(p => ({ x: p.x, y: p.y }));
                }
                detectWedgeApexAndRaysOnPoints(m, m._basePoints);
                if (m.textPos && !m._textOffset) {
                    let anchor = m.points[m.apexIndex || 0] || m.points[0];
                    m._textOffset = { dx: m.textPos.x - anchor.x, dy: m.textPos.y - anchor.y };
                }
            }
        });

        let geoms = getSortedOsteotomyGeoms(measList);
        let activeDragItem = (typeof dragObj !== 'undefined' && dragObj && dragObj.item) ? dragObj.item : null;
        if (activeDragItem) {
            syncDraggedItemToBase(activeDragItem, geoms);
            geoms = getSortedOsteotomyGeoms(measList);
        }

        if (!simActive || geoms.length === 0) {
            measList.forEach(m => {
                if (m.type === 'osteotomy') {
                    if (m._basePoints && m.points.length === 3) {
                        m.points = m._basePoints.map(p => ({ x: p.x, y: p.y }));
                        if (m.textPos && m._textOffset) {
                            let anchor = m.points[m.apexIndex || 0] || m.points[0];
                            m.textPos = { x: anchor.x + m._textOffset.dx, y: anchor.y + m._textOffset.dy };
                        }
                    }
                    m._isRotated = false;
                    return;
                }
                if (m._isRotated) {
                    if (m._basePoints) m.points = m._basePoints.map(p => ({ x: p.x, y: p.y }));
                    if (m._baseSternum && m.sternum) m.sternum = { x: m._baseSternum.x, y: m._baseSternum.y };
                    if (m._baseSlipPoint && m.slipPoint) m.slipPoint = { x: m._baseSlipPoint.x, y: m._baseSlipPoint.y };
                    if (m.textPos && m._textOffset && m.points && m.points.length > 0) {
                        let anchor = getAnchorPoint(m.points);
                        m.textPos = { x: anchor.x + m._textOffset.dx, y: anchor.y + m._textOffset.dy };
                    }
                    m._isRotated = false;
                } else {
                    if (m.points) m._basePoints = m.points.map(p => ({ x: p.x, y: p.y }));
                    if (m.sternum) m._baseSternum = { x: m.sternum.x, y: m.sternum.y };
                    if (m.slipPoint) m._baseSlipPoint = { x: m.slipPoint.x, y: m.slipPoint.y };
                    if (m.textPos && m.points && m.points.length > 0) {
                        let anchor = getAnchorPoint(m.points);
                        m._textOffset = { dx: m.textPos.x - anchor.x, dy: m.textPos.y - anchor.y };
                    }
                }
            });
            return;
        }

        // 1. Actualizar posiciones en pantalla de las propias osteotomías (una osteotomía superior se mueve si hay otra inferior)
        geoms.forEach((g, idx) => {
            let m = g.item;
            let lowerGeoms = geoms.slice(0, idx); // Cortes más caudales que este corte
            m.points = m._basePoints.map(bp => forwardChainPoint(bp, g.p1, lowerGeoms));
            if (m.textPos && m._textOffset && m !== activeDragItem) {
                let anchor = m.points[m.apexIndex || 0] || m.points[0];
                m.textPos = { x: anchor.x + m._textOffset.dx, y: anchor.y + m._textOffset.dy };
            }
            m._isRotated = true;
        });

        // 2. Actualizar todas las mediciones anatómicas según la cadena completa de osteotomías
        measList.forEach(m => {
            if (m.type === 'osteotomy' || m.type === 'pelvic' || m.type === 'coronal_cf') return;
            if (!m._isRotated) {
                if (m.points) m._basePoints = m.points.map(p => ({ x: p.x, y: p.y }));
                if (m.sternum) m._baseSternum = { x: m.sternum.x, y: m.sternum.y };
                if (m.slipPoint) m._baseSlipPoint = { x: m.slipPoint.x, y: m.slipPoint.y };
                if (m.textPos && m.points && m.points.length > 0 && !m._textOffset) {
                    let anchor = getAnchorPoint(m.points);
                    m._textOffset = { dx: m.textPos.x - anchor.x, dy: m.textPos.y - anchor.y };
                }
            }
            if (m === activeDragItem && dragObj && dragObj.type === 'text') {
                m._isRotated = true;
                return;
            }
            if (m._basePoints) {
                if ((m.type === 'cobb' || m.type === 'cobb_coronal') && m._basePoints.length === 4) {
                    // Cada platillo vertebral (p0-p1 y p2-p3) rota como bloque rígido según su punto medio vertebral
                    let mid1 = { x: (m._basePoints[0].x + m._basePoints[1].x) / 2, y: (m._basePoints[0].y + m._basePoints[1].y) / 2 };
                    let mid2 = { x: (m._basePoints[2].x + m._basePoints[3].x) / 2, y: (m._basePoints[2].y + m._basePoints[3].y) / 2 };
                    m.points = [
                        forwardChainPoint(m._basePoints[0], mid1, geoms),
                        forwardChainPoint(m._basePoints[1], mid1, geoms),
                        forwardChainPoint(m._basePoints[2], mid2, geoms),
                        forwardChainPoint(m._basePoints[3], mid2, geoms)
                    ];
                } else {
                    m.points = m._basePoints.map(bp => forwardChainPoint(bp, bp, geoms));
                }
            }
            if (m._baseSternum && m.sternum) {
                m.sternum = forwardChainPoint(m._baseSternum, m._baseSternum, geoms);
            }
            if (m._baseSlipPoint && m.slipPoint) {
                m.slipPoint = forwardChainPoint(m._baseSlipPoint, m._baseSlipPoint, geoms);
            }
            if (m.textPos && m._textOffset && m.points && m.points.length > 0) {
                let anchor = getAnchorPoint(m.points);
                m.textPos = { x: anchor.x + m._textOffset.dx, y: anchor.y + m._textOffset.dy };
            }
            m._isRotated = true;
        });
    }

    function getSelectedOsteotomy() {
        let osts = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        if (osts.length === 0) return null;
        let found = osts.find(m => String(m.id) === String(window.selectedOstId));
        if (!found) {
            found = osts[osts.length - 1];
            window.selectedOstId = found.id;
        }
        return found;
    }

    window.selectOsteotomyFromDropdown = function(idVal) {
        window.selectedOstId = idVal;
        populateSchwabBox();
        draw();
    };

    window.deleteSelectedOsteotomy = function() {
        let sel = getSelectedOsteotomy();
        if (!sel) return;
        measurements = measurements.filter(m => m.id !== sel.id);
        stageData[currentStage].measurements = measurements;
        let remaining = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        if (remaining.length === 0) {
            window.ostSimActive = false;
            stageData[currentStage].ostSimActive = false;
            window.selectedOstId = null;
            updateOsteotomySimButtonUI();
            document.getElementById('schwab-box').classList.add('hidden');
        } else {
            window.selectedOstId = remaining[remaining.length - 1].id;
        }
        draw();
    };

    window.setOsteotomyCustomAngle = function(val) {
        let deg = Math.max(1, Math.min(85, Number(val) || 1));
        const inEl = document.getElementById('sw-angle-input');
        const slEl = document.getElementById('sw-angle-slider');
        if (inEl && document.activeElement !== inEl) inEl.value = Math.round(deg);
        if (slEl && document.activeElement !== slEl) slEl.value = Math.round(deg);

        let ost = getSelectedOsteotomy();
        if (!ost) return;
        if (!ost._basePoints || ost._basePoints.length !== 3) {
            ost._basePoints = ost.points.map(p => ({ x: p.x, y: p.y }));
        }
        let idxs = detectWedgeApexAndRaysOnPoints(ost, ost._basePoints);
        let p1 = ost._basePoints[idxs.apexIdx];
        let pSup = ost._basePoints[idxs.supIdx];
        let pInf = ost._basePoints[idxs.infIdx];

        let lenSup = Math.hypot(pSup.x - p1.x, pSup.y - p1.y) || 80;
        let angInf = Math.atan2(pInf.y - p1.y, pInf.x - p1.x);
        let rad = deg * Math.PI / 180;
        let dir = (pInf.x >= p1.x) ? -1 : 1;
        let newAngSup = angInf + dir * rad;
        ost._basePoints[idxs.supIdx] = { x: p1.x + Math.cos(newAngSup) * lenSup, y: p1.y + Math.sin(newAngSup) * lenSup };
        if (!window.ostSimActive) {
            ost.points = ost._basePoints.map(p => ({ x: p.x, y: p.y }));
        }
        draw();
    };

    window.updateOsteotomySimButtonUI = function() {
        const b1 = document.getElementById('btn-sim-ost');
        const b2 = document.getElementById('btn-modal-sim-ost');
        if (b1) {
            if (window.ostSimActive) {
                b1.innerHTML = t('btn_sim_ost_on');
                b1.className = "w-full border border-emerald-500 bg-emerald-700 text-white rounded px-2 py-2 text-xs font-bold transition-colors flex justify-center items-center shadow-lg";
            } else {
                b1.innerHTML = t('btn_sim_ost');
                b1.className = "w-full border border-amber-600/60 bg-amber-900/20 rounded px-2 py-2 text-xs text-amber-300 hover:bg-amber-700 hover:text-white font-bold transition-colors flex justify-center items-center";
            }
        }
        if (b2) {
            b2.innerHTML = window.ostSimActive ? "✅ Return to Original X-Ray (Sim ON)" : "✂️ Simulate / Close Wedges on X-Ray";
            b2.className = window.ostSimActive
                ? "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow"
                : "w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow";
        }
    };

    window.toggleOsteotomySim = function() {
        let osts = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        if (osts.length === 0) { updateStatus("⚠️ Draw at least one 3-point Osteotomy Wedge first.", true); return; }
        if (!window.ostSimActive && currentStage === 'pre') {
            window._preOstBaseResults = { ...window.currentResults };
        }
        window.ostSimActive = !window.ostSimActive;
        stageData[currentStage].ostSimActive = window.ostSimActive;
        updateOsteotomySimButtonUI();
        draw();
    };

    window.updateSchwabGradeInfo = function(grade) {
        const badge = document.getElementById('sw-badge');
        const desc = document.getElementById('sw-desc');
        const info = {
            "1": { b: "Grade 1 (Schwab, 2014)", en: "Partial facet joint resection (SPO). Expected correction: ~5° to 10° per level.", es: "1: Partial facet joint (Resección facetaria parcial / SPO). Corrección: ~5° a 10° por nivel." },
            "2": { b: "Grade 2 (Schwab, 2014)", en: "Complete facet joint resection (Ponte). Expected correction: ~10° to 15° per level.", es: "2: Complete facet joint (Resección facetaria completa / Ponte). Corrección: ~10° a 15° por nivel." },
            "3": { b: "Grade 3 (Schwab, 2014)", en: "Pedicle and partial body wedge resection (PSO). Expected correction: ~25° to 35°.", es: "3: Pedicle/partial body (Cuña transpedicular / PSO). Corrección esperada: ~25° a 35°." },
            "4": { b: "Grade 4 (Schwab, 2014)", en: "Pedicle, disc, and partial body resection. Expected correction: ~35° to 45°.", es: "4: Pedicle/disc/partial body (PSO extendida con disco). Corrección esperada: ~35° a 45°." },
            "5": { b: "Grade 5 (Schwab, 2014)", en: "Complete vertebra and discs resection (VCR). Expected correction: ~40° to 60°.", es: "5: Complete vertebra and discs (Vertebrectomía completa / VCR). Corrección: ~40° a 60°." },
            "6": { b: "Grade 6 (Schwab, 2014)", en: "Multiple vertebrae and discs resection. Expected correction: >60°.", es: "6: Multiple vertebrae and discs (VCR multinivel). Corrección esperada: >60°." }
        };
        if (info[grade]) {
            badge.innerText = info[grade].b;
            desc.innerText = currentLang === 'es' ? info[grade].es : info[grade].en;
        }
    };

    function predictSimulatedL1S1(geoms) {
        let llMeas = measurements.find(m => m.type === 'cobb' && m.title === 'L1-S1' && m.points.length === 4);
        if (!llMeas || !geoms || geoms.length === 0) return null;
        let basePts = llMeas._basePoints || llMeas.points;
        let mid1 = { x: (basePts[0].x + basePts[1].x) / 2, y: (basePts[0].y + basePts[1].y) / 2 };
        let mid2 = { x: (basePts[2].x + basePts[3].x) / 2, y: (basePts[2].y + basePts[3].y) / 2 };
        let p0 = forwardChainPoint(basePts[0], mid1, geoms);
        let p1 = forwardChainPoint(basePts[1], mid1, geoms);
        let p2 = forwardChainPoint(basePts[2], mid2, geoms);
        let p3 = forwardChainPoint(basePts[3], mid2, geoms);
        let a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        let a2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
        let diff = Math.abs((a1 - a2) * 180 / Math.PI);
        if (diff > 180) diff = 360 - diff;
        if (diff > 90) diff = 180 - diff;
        return Math.round(diff);
    }

    window.populateSchwabBox = function() {
        let osts = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        if (osts.length === 0) return;
        renumberOsteotomies(measurements);

        let selOst = getSelectedOsteotomy();
        let selGeom = selOst ? computeOsteotomyGeometry(selOst, true) : null;
        let selDeg = selGeom ? Number(fmtInt(selGeom.deg)) : 0;

        let allGeoms = getSortedOsteotomyGeoms(measurements);
        let totalWedge = allGeoms.reduce((acc, g) => acc + Number(fmtInt(g.deg)), 0);

        const selDropdown = document.getElementById('sw-ost-select');
        if (selDropdown) {
            selDropdown.innerHTML = osts.map((o, idx) => {
                let g = computeOsteotomyGeometry(o, true);
                let d = g ? fmtInt(g.deg) : '0';
                let lbl = o.title || `Ost #${idx + 1}`;
                return `<option value="${o.id}" ${String(o.id) === String(selOst.id) ? 'selected' : ''}>${lbl} (${d}°)</option>`;
            }).join('');
        }

        let baseRes = (window.ostSimActive && window._preOstBaseResults) ? window._preOstBaseResults : window.currentResults;
        let pi = baseRes['PI'] !== undefined ? baseRes['PI'] : window.currentResults['PI'];
        let idealLL = pi !== undefined ? Math.round((pi * 0.6) + 30) : null;
        let simLL = window.ostSimActive && window.currentResults['L1-S1'] !== undefined
            ? Math.abs(window.currentResults['L1-S1'])
            : predictSimulatedL1S1(allGeoms);

        document.getElementById('sw-wedge').innerText = osts.length > 1 ? `${fmtInt(totalWedge)}° (${osts.length})` : `${fmtInt(totalWedge)}°`;
        document.getElementById('sw-ideal-ll').innerText = idealLL !== null ? `${fmtInt(idealLL)}°` : '-';
        document.getElementById('sw-sim-ll').innerText = simLL !== null ? `${fmtInt(simLL)}°` : '-';

        const inEl = document.getElementById('sw-angle-input');
        const slEl = document.getElementById('sw-angle-slider');
        if (inEl && document.activeElement !== inEl) inEl.value = Math.round(selDeg);
        if (slEl && document.activeElement !== slEl) slEl.value = Math.round(selDeg);

        let autoGrade = selDeg <= 10 ? "1" : selDeg <= 18 ? "2" : selDeg <= 35 ? "3" : selDeg <= 45 ? "4" : selDeg <= 60 ? "5" : "6";
        document.getElementById('sw-selector').value = autoGrade;
        updateSchwabGradeInfo(autoGrade);
    };

    window.showSchwab = function() {
        let osts = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
        if (osts.length === 0) { updateStatus("⚠️ Draw at least one 3-point Osteotomy Wedge first.", true); return; }
        populateSchwabBox();
        document.getElementById('schwab-box').classList.remove('hidden');
        if (window.innerWidth < 768 && isMobileMenuOpen) toggleMobileMenu();
    };

    // 4. INTERCEPTOR GRÁFICO MULTICORTE EN ESLABONES (SIN COSTURAS NI SOLAPAMIENTOS)
    function clipHalfPlane(cCtx, g, sign) {
        let M = 18000;
        let ax = g.p1.x - g.vx * M, ay = g.p1.y - g.vy * M;
        let bx = g.p1.x + g.vx * M, by = g.p1.y + g.vy * M;
        let nx = g.nx * sign, ny = g.ny * sign;
        cCtx.beginPath();
        cCtx.moveTo(ax, ay);
        cCtx.lineTo(bx, by);
        cCtx.lineTo(bx + nx * M, by + ny * M);
        cCtx.lineTo(ax + nx * M, ay + ny * M);
        cCtx.closePath();
        cCtx.clip();
    }

    const origDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, x, y) {
        if (arguments.length === 3 && x === 0 && y === 0) {
            let isMain = (img === bgImage && this === ctx);
            let stData = isMain ? { measurements, ostSimActive: window.ostSimActive } :
                         (stageData.pre && img === stageData.pre.bgImage ? stageData.pre :
                         (stageData.post && img === stageData.post.bgImage ? stageData.post : null));
            let geoms = (stData && stData.ostSimActive && stData.measurements) ? getSortedOsteotomyGeoms(stData.measurements) : [];
            if (geoms.length > 0) {
                let K = geoms.length;
                for (let m = 0; m <= K; m++) {
                    this.save();
                    for (let i = 0; i < m; i++) {
                        clipHalfPlane(this, geoms[i], +1); // Lado craneal del corte i
                        this.translate(geoms[i].p1.x, geoms[i].p1.y);
                        this.rotate(geoms[i].rotAngle);
                        this.translate(-geoms[i].p1.x, -geoms[i].p1.y);
                    }
                    if (m < K) {
                        clipHalfPlane(this, geoms[m], -1); // Lado caudal del siguiente corte m
                    }
                    origDrawImage.call(this, img, 0, 0);
                    this.restore();
                }
                return;
            }
        }
        return origDrawImage.apply(this, arguments);
    };

    function drawOsteotomyOverlay(targetCtx, measList, simFlag, sc) {
        let osts = measList.filter(item => item.type === 'osteotomy' && item.points && item.points.length > 0);
        if (osts.length === 0) return;

        osts.forEach(m => {
            let isSel = (String(m.id) === String(window.selectedOstId));
            targetCtx.save();
            targetCtx.strokeStyle = m.color || '#f43f5e';
            targetCtx.fillStyle = m.color || '#f43f5e';
            targetCtx.lineWidth = ((m.width || 1.5) + (isSel ? 0.8 : 0)) / sc;
            let dotR = 4.5 / sc;

            if (m.points.length < 3) {
                targetCtx.beginPath();
                targetCtx.moveTo(m.points[0].x, m.points[0].y);
                if (m.points.length === 2) targetCtx.lineTo(m.points[1].x, m.points[1].y);
                if (m.tempPoint) targetCtx.lineTo(m.tempPoint.x, m.tempPoint.y);
                targetCtx.stroke();
                m.points.forEach(pt => { targetCtx.beginPath(); targetCtx.arc(pt.x, pt.y, dotR, 0, 2 * Math.PI); targetCtx.fill(); });
            } else {
                let baseGeom = computeOsteotomyGeometry(m, true);
                let dispGeom = computeOsteotomyGeometry(m, false);
                if (!simFlag) {
                    targetCtx.beginPath();
                    targetCtx.moveTo(dispGeom.pSup.x, dispGeom.pSup.y);
                    targetCtx.lineTo(dispGeom.p1.x, dispGeom.p1.y);
                    targetCtx.lineTo(dispGeom.pInf.x, dispGeom.pInf.y);
                    targetCtx.closePath();
                    targetCtx.fillStyle = (m.color || '#f43f5e') + (isSel ? '55' : '33');
                    targetCtx.fill();
                    targetCtx.stroke();
                    m.points.forEach((pt, idx) => {
                        targetCtx.fillStyle = (idx === dispGeom.apexIdx) ? '#facc15' : (m.color || '#f43f5e');
                        targetCtx.beginPath();
                        targetCtx.arc(pt.x, pt.y, (idx === dispGeom.apexIdx) ? dotR * 1.3 : dotR, 0, 2 * Math.PI);
                        targetCtx.fill();
                    });
                } else {
                    targetCtx.strokeStyle = isSel ? '#34d399' : '#10b981';
                    targetCtx.lineWidth = (isSel ? 2.5 : 1.8) / sc;
                    targetCtx.setLineDash([6 / sc, 4 / sc]);
                    targetCtx.beginPath();
                    targetCtx.moveTo(dispGeom.p1.x, dispGeom.p1.y);
                    targetCtx.lineTo(dispGeom.pInf.x, dispGeom.pInf.y);
                    targetCtx.stroke();
                    targetCtx.setLineDash([]);
                    targetCtx.fillStyle = '#facc15';
                    targetCtx.beginPath();
                    targetCtx.arc(dispGeom.p1.x, dispGeom.p1.y, dotR * 1.3, 0, 2 * Math.PI);
                    targetCtx.fill();
                }
                if (m.textPos) {
                    let lbl = `${simFlag ? 'Closed: ' : 'Wedge: '}${fmtInt(baseGeom.deg)}°`;
                    let fSize = m.fontSize || 14;
                    targetCtx.font = `bold ${fSize / sc}px sans-serif`;
                    targetCtx.textAlign = 'left';
                    targetCtx.textBaseline = 'top';
                    targetCtx.shadowColor = 'rgba(0,0,0,0.9)';
                    targetCtx.shadowBlur = 4 / sc;
                    targetCtx.fillStyle = simFlag ? '#10b981' : (m.color || '#f43f5e');
                    targetCtx.fillText(m.title || 'Ost', m.textPos.x, m.textPos.y);
                    targetCtx.fillText(lbl, m.textPos.x, m.textPos.y + (fSize + 4) / sc);
                    targetCtx.shadowBlur = 0;
                }
            }
            targetCtx.restore();
        });
    }

    // Tabla única: Base (Pre-osteotomías) vs Ideal vs Achieved (Resultado acumulado de todas las osteotomías)
    const origUpdateTheo = updateTheoreticalTableContent;
    updateTheoreticalTableContent = function() {
        if (currentStage === 'pre' && window.ostSimActive && window._preOstBaseResults && !stageData.post.bgImage) {
            let baseRes = window._preOstBaseResults;
            let simRes = window.currentResults;
            let pi = baseRes['PI'] !== undefined ? baseRes['PI'] : simRes['PI'];
            if (pi === undefined) return false;
            let ideal_L1S1 = (pi * 0.6) + 30;
            let ideal_PA = (pi * 0.5) - 19;
            let fVal = (v) => v !== undefined ? fmtInt(v) + '°' : '-';
            document.getElementById('theo-tbody').innerHTML = `
                <tr class="border-b border-gray-700/50"><td class="py-2 pr-2 font-medium text-emerald-400">PI</td><td class="py-2 pr-2 text-gray-300">${fVal(baseRes['PI'])}</td><td class="py-2 pr-2 font-bold text-emerald-400">${fmtInt(pi)}°</td><td class="py-2 font-bold text-sky-400">${fVal(simRes['PI'])}</td></tr>
                <tr class="border-b border-gray-700/50"><td class="py-2 pr-2 font-medium text-white">L1-S1</td><td class="py-2 pr-2 text-gray-300">${fVal(baseRes['L1-S1'])}</td><td class="py-2 pr-2 font-bold text-emerald-400">${fmtInt(ideal_L1S1)}°</td><td class="py-2 font-bold text-sky-400">${fVal(simRes['L1-S1'])}</td></tr>
                <tr class="border-b border-gray-700/50"><td class="py-2 pr-2 font-medium text-white">L4-S1</td><td class="py-2 pr-2 text-gray-300">${fVal(baseRes['L4-S1'])}</td><td class="py-2 pr-2 font-bold text-emerald-400">35° - 40°</td><td class="py-2 font-bold text-sky-400">${fVal(simRes['L4-S1'])}</td></tr>
                <tr class="border-b border-gray-700/50"><td class="py-2 pr-2 font-medium text-white">L1-PA</td><td class="py-2 pr-2 text-gray-300">${fVal(baseRes['L1-PA'])}</td><td class="py-2 pr-2 font-bold text-emerald-400">${fmtInt(ideal_PA)}°</td><td class="py-2 font-bold text-sky-400">${fVal(simRes['L1-PA'])}</td></tr>
                <tr class="border-b border-gray-700/50"><td class="py-2 pr-2 font-medium text-white">T4-PA</td><td class="py-2 pr-2 text-gray-300">${fVal(baseRes['T4-PA'])}</td><td class="py-2 pr-2 font-bold text-emerald-400">${fmtInt(ideal_PA)}°</td><td class="py-2 font-bold text-sky-400">${fVal(simRes['T4-PA'])}</td></tr>
                <tr><td class="py-2 pr-2 font-medium text-white">C2 Tilt</td><td class="py-2 pr-2 text-gray-300">${fVal(baseRes['C2 Tilt'])}</td><td class="py-2 pr-2 font-bold text-emerald-400">1° / -3°</td><td class="py-2 font-bold text-sky-400">${fVal(simRes['C2 Tilt'])}</td></tr>
            `;
            return true;
        }
        return origUpdateTheo();
    };

    const origDraw = draw;
    draw = function() {
        if (bgImage) {
            let osts = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3);
            if (osts.length === 0 && window.ostSimActive) {
                window.ostSimActive = false;
                stageData[currentStage].ostSimActive = false;
                updateOsteotomySimButtonUI();
            }
            applyOsteotomyKinematics(measurements, window.ostSimActive);
        }
        origDraw();
        if (bgImage) {
            if (!window.ostSimActive && currentStage === 'pre') {
                window._preOstBaseResults = { ...window.currentResults };
            }
            let sc = baseScale * zoomScale;
            ctx.save(); ctx.translate(panX, panY); ctx.scale(sc, sc);
            drawOsteotomyOverlay(ctx, measurements, window.ostSimActive, sc);
            ctx.restore();

            let allGeoms = getSortedOsteotomyGeoms(measurements);
            if (allGeoms.length > 0) {
                let totalDeg = allGeoms.reduce((acc, g) => acc + Number(fmtInt(g.deg)), 0);
                window.currentResults['Osteotomy'] = totalDeg;
                stageData[currentStage].results = { ...window.currentResults };
            }
            if (!document.getElementById('theoretical-table').classList.contains('hidden')) updateTheoreticalTableContent();
            if (!document.getElementById('schwab-box').classList.contains('hidden')) populateSchwabBox();
        }
    };

    const origRenderStage = renderStageOnContext;
    renderStageOnContext = function(cCtx, sData, panXVal, panYVal, sc) {
        if (sData && sData.measurements) applyOsteotomyKinematics(sData.measurements, sData.ostSimActive);
        let res = origRenderStage(cCtx, sData, panXVal, panYVal, sc);
        if (sData && sData.bgImage && sData.measurements) {
            cCtx.save(); cCtx.translate(panXVal, panYVal); cCtx.scale(sc, sc);
            drawOsteotomyOverlay(cCtx, sData.measurements, sData.ostSimActive, sc);
            cCtx.restore();
        }
        return res;
    };

    // Hitbox mejorado para poder mover libremente cualquier etiqueta o seleccionar cualquier osteotomía
    const origCheckHit = checkHit;
    checkHit = function(x, y) {
        const sc = baseScale * zoomScale;
        const baseRadius = 15 / sc;
        let osts = measurements.filter(m => m.type === 'osteotomy');
        for (let i = osts.length - 1; i >= 0; i--) {
            let ost = osts[i];
            if (ost.textPos && x >= ost.textPos.x - 20 / sc && x <= ost.textPos.x + 150 / sc && y >= ost.textPos.y - 15 / sc && y <= ost.textPos.y + 55 / sc) {
                window.selectedOstId = ost.id;
                if (!document.getElementById('schwab-box').classList.contains('hidden')) populateSchwabBox();
                return { type: 'text', item: ost };
            }
            for (let p = 0; p < ost.points.length; p++) {
                if (Math.hypot(x - ost.points[p].x, y - ost.points[p].y) < baseRadius) {
                    window.selectedOstId = ost.id;
                    if (!document.getElementById('schwab-box').classList.contains('hidden')) populateSchwabBox();
                    return { type: 'point', item: ost, index: p };
                }
            }
        }
        for (let i = measurements.length - 1; i >= 0; i--) {
            let m = measurements[i];
            if (m.textPos && x >= m.textPos.x - 20 / sc && x <= m.textPos.x + 160 / sc && y >= m.textPos.y - 15 / sc && y <= m.textPos.y + 65 / sc) {
                return { type: 'text', item: m };
            }
        }
        return origCheckHit(x, y);
    };

    // 5. EVENTOS DE TRAZADO PARA MÚLTIPLES OSTEOTOMÍAS (CON SIMULACIÓN EN OFF U ON)
    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0 || !bgImage || activeTool !== 'osteotomy') return;
        const pos = getLogicalPos(e);
        clickIntent = { tool: 'osteotomy', startX: e.clientX, startY: e.clientY, logX: pos.x, logY: pos.y };
    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (!bgImage || activeTool !== 'osteotomy' || !currentMeasurement) return;
        currentMeasurement.tempPoint = getLogicalPos(e);
        draw();
    }, true);

    canvas.addEventListener('mouseup', function(e) {
        if (!clickIntent || clickIntent.tool !== 'osteotomy') return;
        if (Math.hypot(e.clientX - clickIntent.startX, e.clientY - clickIntent.startY) < 10) {
            if (!currentMeasurement) {
                let completedCount = measurements.filter(m => m.type === 'osteotomy' && m.points && m.points.length === 3).length;
                if (completedCount === 0 && !window.ostSimActive && currentStage === 'pre') {
                    window._preOstBaseResults = { ...window.currentResults };
                }
                const ostColors = ['#f43f5e', '#fb923c', '#e879f9', '#38bdf8', '#a3e635'];
                let c = ostColors[completedCount % ostColors.length];
                currentMeasurement = {
                    id: Date.now(),
                    type: 'osteotomy',
                    title: `Ost #${completedCount + 1}`,
                    color: c,
                    width: 1.5,
                    fontSize: 14,
                    points: [{ x: clickIntent.logX, y: clickIntent.logY }],
                    textPos: null
                };
                measurements.push(currentMeasurement);
                updateStatus(`📍 ${currentMeasurement.title}: Point 1 set. Click Point 2.`);
            } else if (currentMeasurement.points.length === 1) {
                currentMeasurement.points.push({ x: clickIntent.logX, y: clickIntent.logY });
                updateStatus(`📍 ${currentMeasurement.title}: Point 2 set. Click Point 3 to complete.`);
            } else if (currentMeasurement.points.length === 2) {
                currentMeasurement.points.push({ x: clickIntent.logX, y: clickIntent.logY });
                delete currentMeasurement.tempPoint;

                // Si se trazó mientras la simulación ya estaba activa, convertir sus 3 puntos al espacio base original
                if (window.ostSimActive) {
                    let prevMeas = measurements.filter(m => m !== currentMeasurement);
                    let prevGeoms = getSortedOsteotomyGeoms(prevMeas);
                    currentMeasurement._basePoints = currentMeasurement.points.map(pt => inverseChainPoint(pt, prevGeoms));
                } else {
                    currentMeasurement._basePoints = currentMeasurement.points.map(pt => ({ x: pt.x, y: pt.y }));
                }

                detectWedgeApexAndRaysOnPoints(currentMeasurement, currentMeasurement._basePoints);
                let apexPt = currentMeasurement.points[currentMeasurement.apexIndex];
                currentMeasurement.textPos = { x: apexPt.x + 25, y: apexPt.y - 15 };
                currentMeasurement._textOffset = { dx: 25, dy: -15 };

                window.selectedOstId = currentMeasurement.id;
                deactivateTool();
                draw();
                showSchwab();
            }
        }
        clickIntent = null;
        draw();
    }, true);

    const origClear = clearCanvas;
    clearCanvas = function() { window.ostSimActive = false; window._preOstBaseResults = null; window.selectedOstId = null; updateOsteotomySimButtonUI(); document.getElementById('schwab-box').classList.add('hidden'); origClear(); };
    const origReset = resetAllStudy;
    resetAllStudy = function(s) { window.ostSimActive = false; window._preOstBaseResults = null; window.selectedOstId = null; updateOsteotomySimButtonUI(); document.getElementById('schwab-box').classList.add('hidden'); origReset(s); };
    const origSwitch = switchStage;
    switchStage = function(st) { stageData[currentStage].ostSimActive = window.ostSimActive; origSwitch(st); window.ostSimActive = !!stageData[currentStage].ostSimActive; updateOsteotomySimButtonUI(); draw(); };

    setLanguage(currentLang);
})();
