// ============================================================================
// ACTUALIZACIÓN 3 (implantes.js): TORNILLOS TRANSPEDICULARES Y BARRAS (SAG/AP)
// Sagital: Solo barra/tornillos (sin modal). Coronal: Modal de Reducción AP.
// ============================================================================

(function() {
    window.coronalCorrPct = 0;

    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            mod_7b_imp: "7B. Pedicle Screws & Rods",
            imp_sub: "Sagittal & Coronal (AP) Deformity Construct",
            btn_rod_sag: "🔩 1. Sagittal Rod (Profile)",
            btn_rod_cor: "🔩 2. Coronal Rods (AP - 2 Sides)",
            btn_rod_end: "✅ Finish Current Rod",
            btn_rod_panel: "📐 3. Coronal Correction (AP)",
            imp_title: "Coronal Reduction & Derotation (AP)",
            imp_len_lbl: "AP Rod Length(s):",
            imp_bend_lbl: "AP Alignment:",
            imp_cor_sec: "Coronal Reduction & Derotation Prognosis",
            imp_cor_pct: "Rod Translation & Derotation:",
            imp_cobb_lbl: "Coronal Cobb (Pre → Post):",
            imp_gain_lbl: "Correction / Apical Derotation:",
            imp_bal_lbl: "Coronal Balance (C7-CSVL):"
        });
        Object.assign(I18N.es, {
            mod_7b_imp: "7B. Tornillos Transpediculares y Barras",
            imp_sub: "Instrumentación Sagital y Coronal (AP)",
            btn_rod_sag: "🔩 1. Barra Sagital (Perfil)",
            btn_rod_cor: "🔩 2. Barras Coronales (AP - 2 Lados)",
            btn_rod_end: "✅ Terminar Barra Actual",
            btn_rod_panel: "📐 3. Corrección Coronal (AP)",
            imp_title: "Reducción Coronal y Desrotación (AP)",
            imp_len_lbl: "Longitud Barra(s) AP:",
            imp_bend_lbl: "Alineación AP:",
            imp_cor_sec: "Reducción Coronal y Pronóstico de Desrotación",
            imp_cor_pct: "Reducción a la Barra y Desrotación:",
            imp_cobb_lbl: "Cobb Coronal (Base → Logrado):",
            imp_gain_lbl: "Corrección / Desrotación Apical:",
            imp_bal_lbl: "Balance Coronal (C7-CSVL):"
        });
    }

    const rsHeader = document.querySelector('[data-i18n="mod_7"]');
    if (rsHeader && rsHeader.parentElement) {
        const impCard = document.createElement('div');
        impCard.className = "border border-indigo-700 rounded-lg overflow-hidden";
        impCard.innerHTML = `
            <div class="bg-indigo-900/40 px-3 py-2 text-sm font-semibold text-indigo-300" data-i18n="mod_7b_imp">7B. Pedicle Screws & Rods</div>
            <div class="p-3 bg-gray-900/50 space-y-2">
                <span class="text-[10px] text-gray-400 uppercase tracking-wider block" data-i18n="imp_sub">Sagittal & Coronal (AP) Deformity Construct</span>
                <button id="btn-rod-sag" onclick="startOrFinishRod('sagittal')" class="tool-btn w-full border border-indigo-600/60 bg-indigo-950/30 rounded px-2 py-2 text-xs text-indigo-300 hover:bg-indigo-900/50 font-bold flex justify-center items-center" data-i18n="btn_rod_sag">🔩 1. Sagittal Rod (Profile)</button>
                <button id="btn-rod-cor" onclick="startOrFinishRod('coronal')" class="tool-btn w-full border border-purple-600/60 bg-purple-950/30 rounded px-2 py-2 text-xs text-purple-300 hover:bg-purple-900/50 font-bold flex justify-center items-center" data-i18n="btn_rod_cor">🔩 2. Coronal Rods (AP - 2 Sides)</button>
                <button onclick="showRodPanel()" class="w-full border border-purple-500 bg-purple-600/20 rounded px-2 py-2 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white transition-colors flex justify-center items-center shadow-lg" data-i18n="btn_rod_panel">📐 3. Coronal Correction (AP)</button>
            </div>
        `;
        rsHeader.parentElement.parentNode.insertBefore(impCard, rsHeader.parentElement);
    }

    const mainContainer = document.getElementById('canvas-container');
    if (mainContainer) {
        const rodModal = document.createElement('div');
        rodModal.id = "implants-box";
        rodModal.className = "hidden absolute top-20 left-1/4 bg-gray-900/95 border border-purple-500 rounded-lg p-4 shadow-2xl z-40 backdrop-blur-md cursor-move select-none w-[350px]";
        rodModal.innerHTML = `
            <div class="flex justify-between items-center mb-2.5 border-b border-gray-700 pb-2 pointer-events-none">
                <h3 class="text-purple-400 font-bold text-sm" data-i18n="imp_title">Coronal Reduction & Derotation (AP)</h3>
                <button onclick="document.getElementById('implants-box').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 text-xs pointer-events-auto" data-i18n="btn_close">&times; Close</button>
            </div>
            <div id="rod-modal-body" class="pointer-events-auto text-xs text-gray-300 space-y-3 cursor-default">
                <div class="bg-gray-800/70 border border-gray-700 rounded p-2.5 space-y-1.5">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] text-purple-300 font-bold uppercase">AP Construct</span>
                        <button onclick="clearAllRods()" class="text-[10px] bg-red-700/80 hover:bg-red-600 text-white px-2 py-0.5 rounded font-bold">🗑️ Clear Rods</button>
                    </div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_len_lbl">AP Rod Length(s):</span><span id="imp-len-val" class="font-bold text-white">-</span></div>
                    <div class="flex justify-between text-[11px]"><span class="text-gray-400" data-i18n="imp_bend_lbl">AP Alignment:</span><span id="imp-bend-val" class="font-bold text-purple-300">-</span></div>
                </div>
                <div class="bg-gray-800/70 border border-purple-700/60 rounded p-2.5 space-y-2">
                    <span class="text-[10px] text-purple-300 font-bold uppercase tracking-wider block" data-i18n="imp_cor_sec">Coronal Reduction & Derotation Prognosis</span>
                    <div>
                        <div class="flex justify-between mb-1"><span class="text-[11px] text-gray-300" data-i18n="imp_cor_pct">Rod Translation & Derotation:</span><span id="imp-cor-val" class="font-bold text-purple-300">0%</span></div>
                        <input type="range" id="imp-cor-slider" min="0" max="100" value="0" class="w-full accent-purple-500 cursor-pointer">
                    </div>
                    <div class="space-y-1 pt-1.5 border-t border-gray-700 text-[11px]">
                        <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="imp_cobb_lbl">Coronal Cobb (Pre → Post):</span><span id="imp-cobb-val" class="font-bold text-emerald-400">-</span></div>
                        <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="imp_gain_lbl">Correction / Apical Derotation:</span><span id="imp-gain-val" class="font-bold text-sky-400">-</span></div>
                        <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="imp_bal_lbl">Coronal Balance (C7-CSVL):</span><span id="imp-bal-val" class="font-bold text-amber-300">-</span></div>
                    </div>
                </div>
            </div>
        `;
        mainContainer.appendChild(rodModal);
        if (typeof makeInteractivePanel === 'function') makeInteractivePanel(rodModal);

        const bodyEl = document.getElementById('rod-modal-body');
        const corSl = document.getElementById('imp-cor-slider');
        ['mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
            bodyEl.addEventListener(evt, e => e.stopPropagation());
            corSl.addEventListener(evt, e => e.stopPropagation());
        });
        corSl.addEventListener('input', function() {
            window.coronalCorrPct = Number(this.value) || 0;
            document.getElementById('imp-cor-val').innerText = `${window.coronalCorrPct}%`;
            draw();
        });
    }

    function getSpline(pts) {
        if (!pts || pts.length < 2) return pts || [];
        if (pts.length === 2) return [pts[0], pts[1]];
        let out = [];
        for (let i = 0; i < pts.length - 1; i++) {
            let p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
            for (let s = 0; s < 14; s++) {
                let t = s / 14, t2 = t * t, t3 = t2 * t;
                out.push({
                    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
                });
            }
        }
        out.push(pts[pts.length - 1]);
        return out;
    }

    function getCoronalShiftAtY(y, measList) {
        let corRods = (measList || measurements).filter(m => m.type === 'rod' && m.subType === 'coronal' && m.points && m.points.length >= 2);
        if (!corRods.length || !window.coronalCorrPct) return 0;
        let alpha = window.coronalCorrPct / 100;
        let shifts = [];
        corRods.forEach(r => {
            let basePts = (r._corBasePoints && r._corBasePoints.length === r.points.length) ? r._corBasePoints : r.points;
            let sorted = basePts.slice().sort((a, b) => a.y - b.y);
            let top = sorted[0], bot = sorted[sorted.length - 1];
            if (y < top.y - 40 || y > bot.y + 40) return;
            let dy = (bot.y - top.y) || 1;
            let t = Math.max(0, Math.min(1, (y - top.y) / dy));
            let targetX = top.x + (bot.x - top.x) * t;
            let curX = targetX;
            for (let i = 0; i < sorted.length - 1; i++) {
                if (y >= sorted[i].y && y <= sorted[i + 1].y) {
                    let segT = (y - sorted[i].y) / ((sorted[i + 1].y - sorted[i].y) || 1);
                    curX = sorted[i].x + (sorted[i + 1].x - sorted[i].x) * segT;
                    break;
                }
            }
            shifts.push((targetX - curX) * alpha);
        });
        if (!shifts.length) return 0;
        return shifts.reduce((a, b) => a + b, 0) / shifts.length;
    }

    function applyCoronalKinematics(measList) {
        if (!measList) return;
        let alpha = (window.coronalCorrPct || 0) / 100;
        let corRods = measList.filter(m => m.type === 'rod' && m.subType === 'coronal' && m.points && m.points.length >= 2);

        let activeDragItem = (typeof dragObj !== 'undefined' && dragObj && dragObj.item) ? dragObj.item : null;
        if (activeDragItem && activeDragItem.type === 'rod' && alpha === 0) {
            activeDragItem._corBasePoints = activeDragItem.points.map(p => ({ x: p.x, y: p.y }));
            activeDragItem._basePoints = activeDragItem.points.map(p => ({ x: p.x, y: p.y }));
        }

        corRods.forEach(r => {
            if (!r._corBasePoints || r._corBasePoints.length !== r.points.length) {
                r._corBasePoints = r.points.map(p => ({ x: p.x, y: p.y }));
            }
            if (alpha === 0) {
                r.points = r._corBasePoints.map(p => ({ x: p.x, y: p.y }));
                return;
            }
            let sorted = r._corBasePoints.slice().sort((a, b) => a.y - b.y);
            let top = sorted[0], bot = sorted[sorted.length - 1], dy = (bot.y - top.y) || 1;
            r.points = r._corBasePoints.map(bp => {
                let t = Math.max(0, Math.min(1, (bp.y - top.y) / dy));
                let straightX = top.x + (bot.x - top.x) * t;
                return { x: bp.x + (straightX - bp.x) * alpha, y: bp.y };
            });
        });

        // Solo modifica ángulos de Cobb del plano Coronal (cobb_coronal)
        measList.forEach(m => {
            if (m.type === 'cobb_coronal' && m.points && m.points.length === 4 && corRods.length > 0) {
                if (!m._corBasePoints || alpha === 0) {
                    if (alpha === 0 && m._corBasePoints) m.points = m._corBasePoints.map(p => ({ x: p.x, y: p.y }));
                    m._corBasePoints = m.points.map(p => ({ x: p.x, y: p.y }));
                    return;
                }
                let bp = m._corBasePoints;
                [[0, 1], [2, 3]].forEach(pair => {
                    let pA = bp[pair[0]], pB = bp[pair[1]];
                    let midY = (pA.y + pB.y) / 2;
                    let shiftX = getCoronalShiftAtY(midY, measList);
                    let midX = (pA.x + pB.x) / 2 + shiftX;
                    let ang = Math.atan2(pB.y - pA.y, pB.x - pA.x);
                    let newAng = ang * (1 - alpha * 0.85);
                    let halfL = Math.hypot(pB.x - pA.x, pB.y - pA.y) / 2;
                    m.points[pair[0]] = { x: midX - Math.cos(newAng) * halfL, y: midY - Math.sin(newAng) * halfL };
                    m.points[pair[1]] = { x: midX + Math.cos(newAng) * halfL, y: midY + Math.sin(newAng) * halfL };
                });
            } else if (m.type === 'point_marker' && m.subType === 'bao_c7' && m.points && m.points.length === 1 && corRods.length > 0) {
                if (!m._corBasePt || alpha === 0) {
                    if (alpha === 0 && m._corBasePt) m.points[0] = { x: m._corBasePt.x, y: m._corBasePt.y };
                    m._corBasePt = { x: m.points[0].x, y: m.points[0].y };
                    return;
                }
                let s1Meas = measList.find(x => x.type === 'point_marker' && x.subType === 'bao_s1');
                if (s1Meas && s1Meas.points[0]) {
                    let targetX = s1Meas.points[0].x;
                    m.points[0] = { x: m._corBasePt.x + (targetX - m._corBasePt.x) * (alpha * 0.8), y: m._corBasePt.y };
                }
            }
        });
    }

    const prevDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(img, x, y) {
        if (arguments.length === 3 && x === 0 && y === 0 && img === bgImage && this === ctx && window.coronalCorrPct > 0) {
            let corRods = measurements.filter(m => m.type === 'rod' && m.subType === 'coronal' && m.points && m.points.length >= 2);
            if (corRods.length > 0) {
                let strips = 70, stripH = img.height / strips;
                for (let i = 0; i < strips; i++) {
                    let sy = i * stripH, midY = sy + stripH / 2;
                    let dx = getCoronalShiftAtY(midY, measurements);
                    prevDrawImage.call(this, img, 0, sy, img.width, stripH + 1.2, dx, sy, img.width, stripH + 1.2);
                }
                return;
            }
        }
        return prevDrawImage.apply(this, arguments);
    };

    function computeRodStats(rod, cmVal) {
        if (!rod || !rod.points || rod.points.length < 2) return null;
        let sp = getSpline(rod.points.slice().sort((a, b) => b.y - a.y));
        let lenPx = 0;
        for (let i = 1; i < sp.length; i++) lenPx += Math.hypot(sp[i].x - sp[i - 1].x, sp[i].y - sp[i - 1].y);
        let n = sp.length - 1;
        let a1 = Math.atan2(sp[1].y - sp[0].y, sp[1].x - sp[0].x), a2 = Math.atan2(sp[n].y - sp[n - 1].y, sp[n].x - sp[n - 1].x);
        let bend = Math.abs((a2 - a1) * 180 / Math.PI);
        if (bend > 180) bend = 360 - bend;
        return { len: cmVal ? lenPx * cmVal : lenPx, unit: cmVal ? 'cm' : 'px', bend: Math.round(bend) };
    }

    function drawAllRods(targetCtx, measList, stageGaze, stageCm, sc) {
        if (!measList) return;
        let corRods = measList.filter(m => m.type === 'rod' && m.subType === 'coronal' && m.points && m.points.length >= 2);
        let alpha = (window.coronalCorrPct || 0) / 100;

        measList.filter(m => m.type === 'rod' && m.points && m.points.length > 0).forEach(rod => {
            targetCtx.save();
            let pts = rod.points.slice();
            if (!rod.closed && rod.tempPoint) pts.push(rod.tempPoint);
            let isCor = (rod.subType === 'coronal');

            if (!isCor) {
                rod.points.forEach((pt, idx) => {
                    let next = rod.points[Math.min(rod.points.length - 1, idx + 1)];
                    let prev = rod.points[Math.max(0, idx - 1)];
                    let ty = next.y - prev.y, tx = next.x - prev.x;
                    let sx = stageGaze, sy = -(tx * stageGaze) / (Math.abs(ty) > 5 ? ty : 20);
                    let mag = Math.hypot(sx, sy) || 1; sx /= mag; sy /= mag;
                    let sLen = 36 / sc;
                    targetCtx.beginPath(); targetCtx.moveTo(pt.x, pt.y); targetCtx.lineTo(pt.x + sx * sLen, pt.y + sy * sLen);
                    targetCtx.strokeStyle = '#94a3b8'; targetCtx.lineWidth = 3.2 / sc; targetCtx.stroke();
                });
            }

            if (pts.length >= 2) {
                let sp = getSpline(pts);
                targetCtx.beginPath(); targetCtx.moveTo(sp[0].x, sp[0].y);
                for (let i = 1; i < sp.length; i++) targetCtx.lineTo(sp[i].x, sp[i].y);
                targetCtx.strokeStyle = isCor ? '#c084fc' : '#818cf8';
                targetCtx.lineWidth = 4.2 / sc; targetCtx.lineCap = 'round'; targetCtx.stroke();
                targetCtx.strokeStyle = '#f8fafc'; targetCtx.lineWidth = 1.2 / sc; targetCtx.stroke();
            }

            rod.points.forEach(pt => {
                if (isCor) {
                    let rOut = 7.2 / sc, rIn = 3.2 / sc;
                    targetCtx.beginPath(); targetCtx.arc(pt.x, pt.y, rOut, 0, 2 * Math.PI);
                    targetCtx.fillStyle = 'rgba(15,23,42,0.85)'; targetCtx.fill();
                    targetCtx.lineWidth = 2 / sc; targetCtx.strokeStyle = alpha > 0 ? '#34d399' : '#e879f9'; targetCtx.stroke();
                    targetCtx.beginPath(); targetCtx.arc(pt.x, pt.y, rIn, 0, 2 * Math.PI);
                    targetCtx.fillStyle = '#38bdf8'; targetCtx.fill();
                } else {
                    targetCtx.beginPath(); targetCtx.arc(pt.x, pt.y, 5 / sc, 0, 2 * Math.PI);
                    targetCtx.fillStyle = '#38bdf8'; targetCtx.fill();
                    targetCtx.lineWidth = 1.4 / sc; targetCtx.strokeStyle = '#0f172a'; targetCtx.stroke();
                }
            });

            if (pts.length >= 2 && rod.textPos) {
                let st = computeRodStats(rod, stageCm);
                if (st) {
                    let fSize = rod.fontSize || 13;
                    targetCtx.font = `bold ${fSize / sc}px sans-serif`;
                    targetCtx.fillStyle = isCor ? '#e879f9' : '#a5b4fc';
                    targetCtx.shadowColor = 'rgba(0,0,0,0.9)'; targetCtx.shadowBlur = 4 / sc;
                    targetCtx.fillText(`🔩 ${rod.title} (${fmtInt(st.len)}${st.unit} | ${st.bend}°)`, rod.textPos.x, rod.textPos.y);
                    targetCtx.shadowBlur = 0;
                }
            }
            targetCtx.restore();
        });

        if (corRods.length >= 2) {
            let r1 = corRods[0].points.slice().sort((a, b) => a.y - b.y);
            let r2 = corRods[1].points.slice().sort((a, b) => a.y - b.y);
            targetCtx.save();
            targetCtx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
            targetCtx.lineWidth = 2 / sc;
            targetCtx.setLineDash([4 / sc, 4 / sc]);
            [0, Math.floor(r1.length / 2), r1.length - 1].forEach(idx => {
                let pA = r1[Math.min(idx, r1.length - 1)];
                let pB = r2[Math.min(idx, r2.length - 1)];
                if (pA && pB) {
                    targetCtx.beginPath(); targetCtx.moveTo(pA.x, pA.y); targetCtx.lineTo(pB.x, pB.y); targetCtx.stroke();
                }
            });
            targetCtx.restore();
        }
    }

    window.startOrFinishRod = function(planeMode) {
        if (activeTool === 'rod' && currentMeasurement && currentMeasurement.type === 'rod') {
            if (currentMeasurement.points.length >= 2) {
                let finishedMode = currentMeasurement.subType;
                currentMeasurement.closed = true; delete currentMeasurement.tempPoint;
                currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                currentMeasurement._corBasePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                deactivateTool(); updateRodBtns(null); draw();
                // SOLO abrir el cuadro si la barra trazada es CORONAL (AP)
                if (finishedMode === 'coronal') showRodPanel();
                return;
            }
        }
        activateTool('rod', planeMode === 'coronal' ? 'AP Rod' : 'Sag Rod', planeMode);
        updateRodBtns(planeMode);
        updateStatus(planeMode === 'coronal'
            ? (currentLang === 'es' ? "🔩 AP: Haz clic en cada pedículo de un lado. Doble clic en el último para cerrar (puedes trazar las 2 barras)." : "🔩 AP: Click pedicles on one side. Double-click last screw to finish (supports 2 rods).")
            : (currentLang === 'es' ? "🔩 Sagital: Haz clic en cada pedículo. Doble clic en el último tornillo para cerrar la barra." : "🔩 Sagittal: Click each pedicle. Double-click last screw to finish."));
    };

    function updateRodBtns(mode) {
        const bS = document.getElementById('btn-rod-sag'), bC = document.getElementById('btn-rod-cor');
        if (bS) bS.innerHTML = mode === 'sagittal' ? t('btn_rod_end') : t('btn_rod_sag');
        if (bC) bC.innerHTML = mode === 'coronal' ? t('btn_rod_end') : t('btn_rod_cor');
    }

    window.clearAllRods = function() {
        window.coronalCorrPct = 0;
        const sl = document.getElementById('imp-cor-slider'); if (sl) sl.value = 0;
        document.getElementById('imp-cor-val').innerText = '0%';
        applyCoronalKinematics(measurements);
        measurements = measurements.filter(m => m.type !== 'rod');
        stageData[currentStage].measurements = measurements;
        populateRodPanel(); draw();
    };

    window.populateRodPanel = function() {
        let corRods = measurements.filter(m => m.type === 'rod' && m.subType === 'coronal' && m.points && m.points.length >= 2);
        document.getElementById('imp-len-val').innerText = corRods.length
            ? corRods.map(r => { let s = computeRodStats(r, window.cmPerPx); return `${r.title}: ${fmtInt(s.len)}${s.unit}`; }).join(' | ')
            : '-';
        document.getElementById('imp-bend-val').innerText = corRods.length
            ? corRods.map(r => `${r.title}: ${computeRodStats(r, window.cmPerPx).bend}°`).join(' | ')
            : '-';

        // Solo lee el Cobb Coronal (cobb_coronal)
        let cobbMeas = measurements.find(m => m.type === 'cobb_coronal' && m.points && m.points.length === 4);
        if (cobbMeas) {
            let bp = cobbMeas._corBasePoints || cobbMeas.points;
            let ba1 = Math.atan2(bp[1].y - bp[0].y, bp[1].x - bp[0].x), ba2 = Math.atan2(bp[3].y - bp[2].y, bp[3].x - bp[2].x);
            let baseCobb = Math.abs((ba1 - ba2) * 180 / Math.PI); if (baseCobb > 90) baseCobb = 180 - baseCobb;

            let cp = cobbMeas.points;
            let ca1 = Math.atan2(cp[1].y - cp[0].y, cp[1].x - cp[0].x), ca2 = Math.atan2(cp[3].y - cp[2].y, cp[3].x - cp[2].x);
            let curCobb = Math.abs((ca1 - ca2) * 180 / Math.PI); if (curCobb > 90) curCobb = 180 - curCobb;

            let corrPct = baseCobb > 0.5 ? Math.round(((baseCobb - curCobb) / baseCobb) * 100) : 0;
            let derotDeg = Math.round((baseCobb * 0.35) * (window.coronalCorrPct / 100));

            document.getElementById('imp-cobb-val').innerText = `${fmtInt(baseCobb)}° → ${fmtInt(curCobb)}°`;
            document.getElementById('imp-gain-val').innerText = `${corrPct}% | Derot: ~${derotDeg}°`;
        } else {
            document.getElementById('imp-cobb-val').innerText = 'Measure Coronal Cobb';
            document.getElementById('imp-gain-val').innerText = '-';
        }

        let c7x = window.currentResults['BaoC7_X'], s1x = window.currentResults['BaoS1_X'];
        if (c7x !== undefined && s1x !== undefined) {
            let shift = Math.abs(c7x - s1x) * (window.cmPerPx || 1);
            let unit = window.cmPerPx ? 'cm' : 'px';
            document.getElementById('imp-bal-val').innerText = `${fmtInt(shift)} ${unit}`;
        } else {
            document.getElementById('imp-bal-val').innerText = '-';
        }
    };

    window.showRodPanel = function() { populateRodPanel(); document.getElementById('implants-box').classList.remove('hidden'); };

    const prevDraw = draw;
    draw = function() {
        if (bgImage) applyCoronalKinematics(measurements);
        prevDraw();
        if (bgImage) {
            let sc = baseScale * zoomScale;
            ctx.save(); ctx.translate(panX, panY); ctx.scale(sc, sc);
            drawAllRods(ctx, measurements, gazeDirection, window.cmPerPx, sc);
            ctx.restore();
            if (!document.getElementById('implants-box').classList.contains('hidden')) populateRodPanel();
        }
    };

    const prevRenderStage = renderStageOnContext;
    renderStageOnContext = function(cCtx, sData, panXVal, panYVal, sc) {
        let res = prevRenderStage(cCtx, sData, panXVal, panYVal, sc);
        if (sData && sData.bgImage && sData.measurements) {
            cCtx.save(); cCtx.translate(panXVal, panYVal); cCtx.scale(sc, sc);
            drawAllRods(cCtx, sData.measurements, sData.gazeDirection || 1, sData.cmPerPx, sc);
            cCtx.restore();
        }
        return res;
    };

    const prevCheckHit = checkHit;
    checkHit = function(x, y) {
        const sc = baseScale * zoomScale, r = 15 / sc;
        for (let rod of measurements.filter(m => m.type === 'rod')) {
            if (rod.textPos && x >= rod.textPos.x - 10 / sc && x <= rod.textPos.x + 160 / sc && y >= rod.textPos.y - 10 / sc && y <= rod.textPos.y + 35 / sc) return { type: 'text', item: rod };
            for (let i = 0; i < rod.points.length; i++) {
                if (Math.hypot(x - rod.points[i].x, y - rod.points[i].y) < r) return { type: 'point', item: rod, index: i };
            }
        }
        return prevCheckHit(x, y);
    };

    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0 || !bgImage || activeTool !== 'rod') return;
        const pos = getLogicalPos(e);
        clickIntent = { tool: 'rod', subType: activeSubType, startX: e.clientX, startY: e.clientY, logX: pos.x, logY: pos.y };
    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if (!bgImage || activeTool !== 'rod' || !currentMeasurement || currentMeasurement.type !== 'rod') return;
        currentMeasurement.tempPoint = getLogicalPos(e);
        draw();
    }, true);

    canvas.addEventListener('mouseup', function(e) {
        if (!clickIntent || clickIntent.tool !== 'rod') return;
        if (Math.hypot(e.clientX - clickIntent.startX, e.clientY - clickIntent.startY) < 10) {
            let mode = activeSubType || 'sagittal';
            if (!currentMeasurement || currentMeasurement.type !== 'rod') {
                if (mode === 'sagittal') measurements = measurements.filter(m => !(m.type === 'rod' && m.subType !== 'coronal'));
                let cnt = measurements.filter(m => m.type === 'rod' && m.subType === 'coronal').length + 1;
                currentMeasurement = {
                    id: Date.now(), type: 'rod', subType: mode,
                    title: mode === 'coronal' ? `AP Rod #${cnt}` : 'Sag Rod',
                    color: mode === 'coronal' ? '#c084fc' : '#818cf8', fontSize: 13,
                    points: [{ x: clickIntent.logX, y: clickIntent.logY }], closed: false,
                    textPos: { x: clickIntent.logX + 22, y: clickIntent.logY - 20 }
                };
                measurements.push(currentMeasurement);
            } else {
                let last = currentMeasurement.points[currentMeasurement.points.length - 1];
                if (currentMeasurement.points.length >= 2 && Math.hypot(clickIntent.logX - last.x, clickIntent.logY - last.y) < 18 / (baseScale * zoomScale)) {
                    let finishedMode = currentMeasurement.subType;
                    currentMeasurement.closed = true; delete currentMeasurement.tempPoint;
                    currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                    currentMeasurement._corBasePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                    deactivateTool(); updateRodBtns(null); draw();
                    // SOLO abre el modal si se terminó una barra CORONAL (AP)
                    if (finishedMode === 'coronal') showRodPanel();
                } else {
                    currentMeasurement.points.push({ x: clickIntent.logX, y: clickIntent.logY });
                    currentMeasurement._basePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                    currentMeasurement._corBasePoints = currentMeasurement.points.map(p => ({ x: p.x, y: p.y }));
                }
            }
        }
        clickIntent = null; draw();
    }, true);

    const prevDeact = deactivateTool;
    deactivateTool = function() { prevDeact(); updateRodBtns(null); };
    setLanguage(currentLang);
})();
