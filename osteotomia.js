// ============================================================================
// MÓDULO CONECTABLE: 7. OSTEOTOMÍAS (SCHWAB, 2014) + MOTOR CINEMÁTICO EN VIVO
// Rota la Rx, arrastra los puntos craneales al corte y recalcula valores ideales
// ============================================================================

(function() {
    window.ostSimActive = false;
    window._preOstBaseResults = null;

    // 1. TRADUCCIONES Y RENUMERACIÓN AUTOMÁTICA DE MÓDULOS 8 AL 13
    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            mod_7_ost: "7. Osteotomies (Schwab, 2014)",
            ost_sub: "Wedge Resection & Live Kinematics",
            btn_draw_ost: "📐 1. Draw Wedge (3 Points)",
            btn_sim_ost: "✂️ 2. Simulate Wedge Closure (OFF)",
            btn_sim_ost_on: "✅ 2. Wedge Closure Active (ON)",
            btn_calc_schwab: "📊 3. Schwab (2014) & Degrees",
            schwab_title: "Schwab Osteotomy Classification (2014)",
            sw_set_deg: "Target Osteotomy Angle (α):",
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
            ost_sub: "Corte en Cuña y Cinemática en Vivo",
            btn_draw_ost: "📐 1. Trazar Cuña (3 Puntos)",
            btn_sim_ost: "✂️ 2. Simular Cierre de Cuña (OFF)",
            btn_sim_ost_on: "✅ 2. Cierre de Cuña Activo (ON)",
            btn_calc_schwab: "📊 3. Schwab (2014) y Grados",
            schwab_title: "Clasificación de Osteotomías de Schwab (2014)",
            sw_set_deg: "Ajustar Grados de Osteotomía (α):",
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
                <span class="text-[10px] text-gray-400 uppercase tracking-wider block" data-i18n="ost_sub">Wedge Resection & Live Kinematics</span>
                <button onclick="activateTool('osteotomy', 'Osteotomy')" class="tool-btn w-full border border-rose-700/60 bg-rose-950/30 rounded px-2 py-2 text-xs text-rose-300 hover:bg-rose-900/50 font-bold flex justify-center items-center" data-i18n="btn_draw_ost">📐 1. Draw Wedge (3 Points)</button>
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
        schwabModal.className = "hidden absolute top-20 left-1/3 bg-gray-900/95 border border-rose-500 rounded-lg p-4 shadow-2xl z-40 backdrop-blur-md cursor-move select-none w-[340px]";
        schwabModal.innerHTML = `
            <div class="flex justify-between items-center mb-3 border-b border-gray-700 pb-2 pointer-events-none">
                <h3 class="text-rose-400 font-bold text-sm" data-i18n="schwab_title">Schwab Osteotomy Classification (2014)</h3>
                <button onclick="document.getElementById('schwab-box').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 text-xs pointer-events-auto" data-i18n="btn_close">&times; Close</button>
            </div>
            <div class="pointer-events-auto text-xs text-gray-300 space-y-2.5">
                <div class="grid grid-cols-3 gap-2 border-b border-gray-700 pb-2 text-center">
                    <div><span class="text-gray-400 block text-[10px]">Wedge (α)</span><span id="sw-wedge" class="font-bold text-rose-400 text-sm">0°</span></div>
                    <div><span class="text-gray-400 block text-[10px]">Ideal LL</span><span id="sw-ideal-ll" class="font-bold text-emerald-400 text-sm">-</span></div>
                    <div><span class="text-gray-400 block text-[10px]">Sim. Post-LL</span><span id="sw-sim-ll" class="font-bold text-sky-400 text-sm">-</span></div>
                </div>
                <div class="bg-gray-800/70 border border-gray-700 rounded p-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[10px] text-amber-300 font-bold uppercase" data-i18n="sw_set_deg">Target Osteotomy Angle (α):</span>
                        <div class="flex items-center space-x-1">
                            <input type="number" id="sw-angle-input" min="1" max="90" value="25" class="w-14 bg-gray-950 border border-gray-600 rounded px-1.5 py-0.5 text-center text-white font-bold text-xs" onchange="setOsteotomyCustomAngle(this.value)">
                            <span class="text-xs font-bold text-white">°</span>
                        </div>
                    </div>
                    <input type="range" id="sw-angle-slider" min="1" max="75" value="25" class="w-full accent-rose-500 cursor-pointer" oninput="setOsteotomyCustomAngle(this.value)">
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
                    <div id="sw-badge" class="bg-rose-600 text-white font-bold py-0.5 px-3 rounded-full mb-1 inline-block text-xs shadow">Grade 3</div>
                    <p id="sw-desc" class="text-[11px] text-gray-200 leading-snug font-medium"></p>
                </div>
                <button onclick="toggleOsteotomySim()" class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow">✂️ Simulate / Close Wedge on X-Ray</button>
            </div>
        `;
        mainContainer.appendChild(schwabModal);
        if (typeof makeInteractivePanel === 'function') makeInteractivePanel(schwabModal);
    }

    // 3. MOTOR GEOMÉTRICO Y CINEMÁTICO (ROTA PUNTOS CRANEALES JUNTO CON LA VÉRTEBRA)
    window.computeOsteotomyGeometry = function(m) {
        if (!m || !m.points || m.points.length < 3) return null;
        let p1 = m.points[1]; // Bisagra / Ápex anterior
        let pSup = m.points[0].y < m.points[2].y ? m.points[0] : m.points[2];
        let pInf = m.points[0].y < m.points[2].y ? m.points[2] : m.points[0];
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
        if (ny > 0) { nx = -nx; ny = -ny; } // Normal apuntando hacia craneal (arriba)
        return { p1, pSup, pInf, rotAngle, deg, vx, vy, nx, ny };
    };

    function rotatePoint(pt, center, angleRad) {
        let dx = pt.x - center.x, dy = pt.y - center.y;
        let c = Math.cos(angleRad), s = Math.sin(angleRad);
        return { x: center.x + dx * c - dy * s, y: center.y + dx * s + dy * c };
    }

    function isPointCranialToCut(pt, geom) {
        return ((pt.x - geom.p1.x) * geom.nx + (pt.y - geom.p1.y) * geom.ny) > 0;
    }

    // Guarda las coordenadas originales antes de simular o aplica la rotación a los puntos craneales
    function applyOsteotomyKinematics(measList, simActive) {
        if (!measList) return;
        let ost = measList.find(m => m.type === 'osteotomy' && m.points.length === 3);
        if (!simActive || !ost) {
            measList.forEach(m => {
                if (m.type === 'osteotomy') return;
                if (m._isRotated) {
                    if (m._basePoints) m.points = m._basePoints.map(p => ({ x: p.x, y: p.y }));
                    if (m._baseTextPos && m.textPos) m.textPos = { x: m._baseTextPos.x, y: m._baseTextPos.y };
                    if (m._baseSternum && m.sternum) m.sternum = { x: m._baseSternum.x, y: m._baseSternum.y };
                    if (m._baseSlipPoint && m.slipPoint) m.slipPoint = { x: m._baseSlipPoint.x, y: m._baseSlipPoint.y };
                    m._isRotated = false;
                } else {
                    if (m.points) m._basePoints = m.points.map(p => ({ x: p.x, y: p.y }));
                    if (m.textPos) m._baseTextPos = { x: m.textPos.x, y: m.textPos.y };
                    if (m.sternum) m._baseSternum = { x: m.sternum.x, y: m.sternum.y };
                    if (m.slipPoint) m._baseSlipPoint = { x: m.slipPoint.x, y: m.slipPoint.y };
                }
            });
            return;
        }

        let geom = computeOsteotomyGeometry(ost);
        if (!geom) return;

        measList.forEach(m => {
            if (m.type === 'osteotomy' || m.type === 'pelvic' || m.type === 'coronal_cf') return;
            if (!m._isRotated) {
                if (m.points) m._basePoints = m.points.map(p => ({ x: p.x, y: p.y }));
                if (m.textPos) m._baseTextPos = { x: m.textPos.x, y: m.textPos.y };
                if (m.sternum) m._baseSternum = { x: m.sternum.x, y: m.sternum.y };
                if (m.slipPoint) m._baseSlipPoint = { x: m.slipPoint.x, y: m.slipPoint.y };
            }
            let anyPointRotated = false;
            if (m._basePoints) {
                m.points = m._basePoints.map(bp => {
                    if (isPointCranialToCut(bp, geom)) {
                        anyPointRotated = true;
                        return rotatePoint(bp, geom.p1, geom.rotAngle);
                    }
                    return { x: bp.x, y: bp.y };
                });
            }
            if (m._baseSternum && m.sternum) {
                m.sternum = isPointCranialToCut(m._baseSternum, geom) ? rotatePoint(m._baseSternum, geom.p1, geom.rotAngle) : { x: m._baseSternum.x, y: m._baseSternum.y };
            }
            if (m._baseSlipPoint && m.slipPoint) {
                m.slipPoint = isPointCranialToCut(m._baseSlipPoint, geom) ? rotatePoint(m._baseSlipPoint, geom.p1, geom.rotAngle) : { x: m._baseSlipPoint.x, y: m._baseSlipPoint.y };
            }
            if (m._baseTextPos && m.textPos) {
                m.textPos = anyPointRotated ? rotatePoint(m._baseTextPos, geom.p1, geom.rotAngle) : { x: m._baseTextPos.x, y: m._baseTextPos.y };
            }
            m._isRotated = true;
        });
    }

    window.setOsteotomyCustomAngle = function(val) {
        let deg = Math.max(1, Math.min(85, Number(val) || 1));
        document.getElementById('sw-angle-input').value = Math.round(deg);
        document.getElementById('sw-angle-slider').value = Math.round(deg);
        let ost = measurements.find(m => m.type === 'osteotomy' && m.points.length === 3);
        if (!ost) return;
        let p1 = ost.points[1];
        let supIdx = ost.points[0].y < ost.points[2].y ? 0 : 2;
        let infIdx = supIdx === 0 ? 2 : 0;
        let pSup = ost.points[supIdx], pInf = ost.points[infIdx];
        let lenSup = Math.hypot(pSup.x - p1.x, pSup.y - p1.y) || 80;
        let angInf = Math.atan2(pInf.y - p1.y, pInf.x - p1.x);
        let rad = deg * Math.PI / 180;
        let dir = (pInf.x >= p1.x) ? -1 : 1;
        let newAngSup = angInf + dir * rad;
        ost.points[supIdx] = { x: p1.x + Math.cos(newAngSup) * lenSup, y: p1.y + Math.sin(newAngSup) * lenSup };
        draw();
    };

    window.updateOsteotomySimButtonUI = function() {
        const b1 = document.getElementById('btn-sim-ost');
        if (!b1) return;
        if (window.ostSimActive) {
            b1.innerHTML = t('btn_sim_ost_on');
            b1.className = "w-full border border-emerald-500 bg-emerald-700 text-white rounded px-2 py-2 text-xs font-bold transition-colors flex justify-center items-center shadow-lg";
        } else {
            b1.innerHTML = t('btn_sim_ost');
            b1.className = "w-full border border-amber-600/60 bg-amber-900/20 rounded px-2 py-2 text-xs text-amber-300 hover:bg-amber-700 hover:text-white font-bold transition-colors flex justify-center items-center";
        }
    };

    window.toggleOsteotomySim = function() {
        let ost = measurements.find(m => m.type === 'osteotomy' && m.points.length === 3);
        if (!ost) { updateStatus("⚠️ Draw the 3-point Osteotomy Wedge first.", true); return; }
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

    window.populateSchwabBox = function() {
        let ost = measurements.find(m => m.type === 'osteotomy' && m.points.length === 3);
        let wedgeAngle = ost ? Number(fmtInt(computeOsteotomyGeometry(ost).deg)) : 0;
        let baseRes = (window.ostSimActive && window._preOstBaseResults) ? window._preOstBaseResults : window.currentResults;
        let pi = baseRes['PI'] !== undefined ? baseRes['PI'] : window.currentResults['PI'];
        let baseLL = baseRes['L1-S1'];
        let idealLL = pi !== undefined ? Math.round((pi * 0.6) + 30) : null;
        let simLL = window.ostSimActive && window.currentResults['L1-S1'] !== undefined
            ? window.currentResults['L1-S1']
            : (baseLL !== undefined ? (baseLL + wedgeAngle) : null);

        document.getElementById('sw-wedge').innerText = `${fmtInt(wedgeAngle)}°`;
        document.getElementById('sw-ideal-ll').innerText = idealLL !== null ? `${fmtInt(idealLL)}°` : '-';
        document.getElementById('sw-sim-ll').innerText = simLL !== null ? `${fmtInt(simLL)}°` : '-';
        document.getElementById('sw-angle-input').value = Math.round(wedgeAngle);
        document.getElementById('sw-angle-slider').value = Math.round(wedgeAngle);

        let autoGrade = wedgeAngle <= 10 ? "1" : wedgeAngle <= 18 ? "2" : wedgeAngle <= 35 ? "3" : wedgeAngle <= 45 ? "4" : wedgeAngle <= 60 ? "5" : "6";
        document.getElementById('sw-selector').value = autoGrade;
        updateSchwabGradeInfo(autoGrade);
    };

    window.showSchwab = function() {
        let ost = measurements.find(m => m.type === 'osteotomy' && m.points.length === 3);
        if (!ost) { updateStatus("⚠️ Draw the 3-point Osteotomy Wedge first.", true); return; }
        populateSchwabBox();
        document.getElementById('schwab-box').classList.remove('hidden');
        if (window.innerWidth < 768 && isMobileMenuOpen) toggleMobileMenu();
    };

    // 4. INTERCEPTOR DE IMAGEN Y SINCRONIZACIÓN CON TABLA DE PERFIL TEÓRICO
    const origDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, x, y) {
        if (arguments.length === 3 && x === 0 && y === 0) {
            let isMain = (img === bgImage && this === ctx);
            let stData = isMain ? { measurements, ostSimActive: window.ostSimActive } :
                         (stageData.pre && img === stageData.pre.bgImage ? stageData.pre :
                         (stageData.post && img === stageData.post.bgImage ? stageData.post : null));
            let ostMeas = stData && stData.measurements ? stData.measurements.find(m => m.type === 'osteotomy' && m.points.length === 3) : null;
            if (stData && stData.ostSimActive && ostMeas) {
                let geom = computeOsteotomyGeometry(ostMeas);
                if (geom) {
                    let { p1, rotAngle, vx, vy, nx, ny } = geom;
                    let M = 15000, ax = p1.x - vx * M, ay = p1.y - vy * M, bx = p1.x + vx * M, by = p1.y + vy * M;

                    this.save();
                    this.beginPath(); this.moveTo(ax, ay); this.lineTo(bx, by); this.lineTo(bx - nx * M, by - ny * M); this.lineTo(ax - nx * M, ay - ny * M); this.closePath();
                    this.clip(); origDrawImage.call(this, img, 0, 0); this.restore();

                    this.save();
                    this.beginPath(); this.moveTo(ax, ay); this.lineTo(bx, by); this.lineTo(bx + nx * M, by + ny * M); this.lineTo(ax + nx * M, ay + ny * M); this.closePath();
                    this.clip(); this.translate(p1.x, p1.y); this.rotate(rotAngle); this.translate(-p1.x, -p1.y);
                    origDrawImage.call(this, img, 0, 0); this.restore();
                    return;
                }
            }
        }
        return origDrawImage.apply(this, arguments);
    };

    function drawOsteotomyOverlay(targetCtx, measList, simFlag, sc) {
        let m = measList.find(item => item.type === 'osteotomy');
        if (!m || !m.points || m.points.length === 0) return;
        targetCtx.save();
        targetCtx.strokeStyle = m.color; targetCtx.fillStyle = m.color; targetCtx.lineWidth = (m.width || 1.5) / sc;
        let dotR = 4.5 / sc;
        if (m.points.length < 3) {
            targetCtx.beginPath(); targetCtx.moveTo(m.points[0].x, m.points[0].y);
            if (m.points.length === 2) targetCtx.lineTo(m.points[1].x, m.points[1].y);
            if (m.tempPoint) targetCtx.lineTo(m.tempPoint.x, m.tempPoint.y);
            targetCtx.stroke();
            m.points.forEach(pt => { targetCtx.beginPath(); targetCtx.arc(pt.x, pt.y, dotR, 0, 2 * Math.PI); targetCtx.fill(); });
        } else {
            let geom = computeOsteotomyGeometry(m);
            if (!simFlag) {
                targetCtx.beginPath(); targetCtx.moveTo(m.points[0].x, m.points[0].y); targetCtx.lineTo(m.points[1].x, m.points[1].y); targetCtx.lineTo(m.points[2].x, m.points[2].y); targetCtx.closePath();
                targetCtx.fillStyle = m.color + '4D'; targetCtx.fill(); targetCtx.stroke();
                m.points.forEach((pt, idx) => { targetCtx.fillStyle = idx === 1 ? '#facc15' : m.color; targetCtx.beginPath(); targetCtx.arc(pt.x, pt.y, dotR, 0, 2 * Math.PI); targetCtx.fill(); });
            } else {
                targetCtx.strokeStyle = '#10b981'; targetCtx.setLineDash([6 / sc, 4 / sc]);
                targetCtx.beginPath(); targetCtx.moveTo(geom.p1.x, geom.p1.y); targetCtx.lineTo(geom.pInf.x, geom.pInf.y); targetCtx.stroke();
                targetCtx.setLineDash([]); targetCtx.fillStyle = '#facc15'; targetCtx.beginPath(); targetCtx.arc(geom.p1.x, geom.p1.y, dotR * 1.2, 0, 2 * Math.PI); targetCtx.fill();
            }
            if (m.textPos) {
                let lbl = `${simFlag ? 'Closed: ' : 'Wedge: '}${fmtInt(geom.deg)}°`;
                targetCtx.font = `bold ${(m.fontSize || 14) / sc}px sans-serif`;
                targetCtx.fillStyle = simFlag ? '#10b981' : m.color;
                targetCtx.fillText(m.title || 'Osteotomy', m.textPos.x, m.textPos.y);
                targetCtx.fillText(lbl, m.textPos.x, m.textPos.y + ((m.fontSize || 14) + 4) / sc);
            }
        }
        targetCtx.restore();
    }

    // Actualiza la tabla teórica mostrando Base (Pre-corte) vs Ideal vs Logrado (Simulación Post-corte)
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
            let ost = measurements.find(m => m.type === 'osteotomy' && m.points.length === 3);
            if (ost) {
                window.currentResults['Osteotomy'] = Number(fmtInt(computeOsteotomyGeometry(ost).deg));
                stageData[currentStage].results = { ...window.currentResults };
                if (!document.getElementById('theoretical-table').classList.contains('hidden')) updateTheoreticalTableContent();
                if (!document.getElementById('schwab-box').classList.contains('hidden')) populateSchwabBox();
            }
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

    const origCheckHit = checkHit;
    checkHit = function(x, y) {
        const baseRadius = 15 / (baseScale * zoomScale);
        let ost = measurements.find(m => m.type === 'osteotomy');
        if (ost) {
            if (ost.textPos && x >= ost.textPos.x - 20 && x <= ost.textPos.x + 180 && y >= ost.textPos.y - 15 && y <= ost.textPos.y + 70) return { type: 'text', item: ost };
            for (let p = 0; p < ost.points.length; p++) {
                if (Math.hypot(x - ost.points[p].x, y - ost.points[p].y) < baseRadius) return { type: 'point', item: ost, index: p };
            }
        }
        return origCheckHit(x, y);
    };

    // 5. EVENTOS DE TRAZADO DE LOS 3 PUNTOS DE LA CUÑA EN EL LIENZO
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
                if (window.ostSimActive) { window.ostSimActive = false; applyOsteotomyKinematics(measurements, false); updateOsteotomySimButtonUI(); }
                measurements = measurements.filter(m => m.type !== 'osteotomy');
                currentMeasurement = { id: Date.now(), type: 'osteotomy', title: 'Osteotomy', color: '#f43f5e', width: 1.5, fontSize: 14, points: [{ x: clickIntent.logX, y: clickIntent.logY }], textPos: null };
                measurements.push(currentMeasurement);
                updateStatus("📍 Point 1 set. Click Anterior Hinge / Apex (Point 2).");
            } else if (currentMeasurement.points.length === 1) {
                currentMeasurement.points.push({ x: clickIntent.logX, y: clickIntent.logY });
                updateStatus("📍 Hinge set. Click Posterior Inferior border (Point 3).");
            } else if (currentMeasurement.points.length === 2) {
                currentMeasurement.points.push({ x: clickIntent.logX, y: clickIntent.logY });
                delete currentMeasurement.tempPoint;
                currentMeasurement.textPos = { x: currentMeasurement.points[1].x + 25, y: currentMeasurement.points[1].y - 15 };
                deactivateTool(); draw(); showSchwab();
            }
        }
        clickIntent = null; draw();
    }, true);

    const origClear = clearCanvas;
    clearCanvas = function() { window.ostSimActive = false; window._preOstBaseResults = null; updateOsteotomySimButtonUI(); document.getElementById('schwab-box').classList.add('hidden'); origClear(); };
    const origReset = resetAllStudy;
    resetAllStudy = function(s) { window.ostSimActive = false; window._preOstBaseResults = null; updateOsteotomySimButtonUI(); document.getElementById('schwab-box').classList.add('hidden'); origReset(s); };
    const origSwitch = switchStage;
    switchStage = function(st) { stageData[currentStage].ostSimActive = window.ostSimActive; origSwitch(st); window.ostSimActive = !!stageData[currentStage].ostSimActive; updateOsteotomySimButtonUI(); draw(); };

    setLanguage(currentLang);
})();
