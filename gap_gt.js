// ============================================================================
// ACTUALIZACIÓN 2 (gap_gt.js): GLOBAL TILT (GT) Y GAP SCORE (YILGOR ET AL., 2017)
// Se integra en Módulo 3 (trazo GT) y Módulo 5 (Calculadora GAP en tiempo real)
// ============================================================================

(function() {
    window.gapAgeOver60 = false;

    // 1. TRADUCCIONES BILINGÜES (EN / ES)
    if (typeof I18N !== 'undefined') {
        Object.assign(I18N.en, {
            btn_gt_tool: "📐 Global Tilt (GT)",
            btn_gap_score: "📊 GAP Score (Yilgor, 2017)",
            gap_title: "GAP Score & Global Tilt (Yilgor, 2017)",
            gap_age_lbl: "Patient Age Factor:",
            gap_age_u60: "< 60 yrs (0 pts)",
            gap_age_o60: "≥ 60 yrs (+1 pt)",
            gap_rpv: "1. Rel. Pelvic Version (RPV)",
            gap_rll: "2. Rel. Lumbar Lordosis (RLL)",
            gap_ldi: "3. Lordosis Distribution (LDI)",
            gap_rsa: "4. Rel. Spinopelvic Align (RSA)",
            gap_prop: "PROPORTIONED (0-2 pts)",
            gap_mod: "MODERATELY DISPROPORTIONED (3-6 pts)",
            gap_sev: "SEVERELY DISPROPORTIONED (≥7 pts)",
            gap_desc_prop: "Optimal biomechanical proportion. Very low risk of mechanical failure or PJK (~6%).",
            gap_desc_mod: "Moderate sagittal disproportion. Intermediate risk of mechanical failure or PJK (~47%).",
            gap_desc_sev: "Severe sagittal disproportion. High risk of PJK or rod fracture (~95%). Adjust osteotomies."
        });
        Object.assign(I18N.es, {
            btn_gt_tool: "📐 Global Tilt (GT)",
            btn_gap_score: "📊 GAP Score (Yilgor, 2017)",
            gap_title: "GAP Score y Global Tilt (Yilgor, 2017)",
            gap_age_lbl: "Factor de Edad:",
            gap_age_u60: "< 60 años (0 pts)",
            gap_age_o60: "≥ 60 años (+1 pt)",
            gap_rpv: "1. Versión Pélvica Rel. (RPV)",
            gap_rll: "2. Lordosis Lumbar Rel. (RLL)",
            gap_ldi: "3. Índice Distribución (LDI)",
            gap_rsa: "4. Alineación Espinopélvica (RSA)",
            gap_prop: "PROPORCIONADO (0-2 pts)",
            gap_mod: "MOD. DESPROPORCIONADO (3-6 pts)",
            gap_sev: "SEV. DESPROPORCIONADO (≥7 pts)",
            gap_desc_prop: "Proporción biomecánica óptima. Muy bajo riesgo de falla mecánica o PJK (~6%).",
            gap_desc_mod: "Desproporción sagital moderada. Riesgo intermedio de falla mecánica o PJK (~47%).",
            gap_desc_sev: "Desproporción sagital severa. Alto riesgo de PJK o rotura de barras (~95%). Ajuste osteotomías."
        });
    }

    // 2. INYECTAR BOTÓN "GLOBAL TILT (GT)" EN MÓDULO 3 Y "GAP SCORE" EN MÓDULO 5
    const mod3Header = document.querySelector('[data-i18n="mod_3"]');
    if (mod3Header && mod3Header.nextElementSibling) {
        const mod3Grid = mod3Header.nextElementSibling;
        const btnGT = document.createElement('button');
        btnGT.className = "tool-btn col-span-2 border border-teal-600/60 bg-teal-900/20 rounded px-2 py-1.5 text-xs text-teal-300 hover:bg-teal-800/40 flex justify-center items-center font-bold";
        btnGT.setAttribute('data-i18n', 'btn_gt_tool');
        btnGT.innerHTML = t('btn_gt_tool');
        btnGT.onclick = function() { activateTool('gt', 'GT'); };
        mod3Grid.appendChild(btnGT);
    }

    const mod5Header = document.querySelector('[data-i18n="mod_5"]');
    if (mod5Header && mod5Header.nextElementSibling) {
        const mod5Body = mod5Header.nextElementSibling;
        mod5Body.classList.add('space-y-2');
        const btnGAP = document.createElement('button');
        btnGAP.className = "w-full bg-teal-700/80 hover:bg-teal-600 text-white font-bold rounded py-2 text-xs transition-colors border border-teal-400 shadow-md flex justify-center items-center";
        btnGAP.setAttribute('data-i18n', 'btn_gap_score');
        btnGAP.innerHTML = t('btn_gap_score');
        btnGAP.onclick = function() { showGAPScore(); };
        mod5Body.appendChild(btnGAP);
    }

    // 3. CREAR CUADRO FLOTANTE DEL GAP SCORE (YILGOR, 2017)
    const mainContainer = document.getElementById('canvas-container');
    if (mainContainer) {
        const gapModal = document.createElement('div');
        gapModal.id = "gap-box";
        gapModal.className = "hidden absolute top-24 right-1/3 bg-gray-900/95 border border-teal-500 rounded-lg p-4 shadow-2xl z-40 backdrop-blur-md cursor-move select-none w-[355px]";
        gapModal.innerHTML = `
            <div class="flex justify-between items-center mb-2.5 border-b border-gray-700 pb-2 pointer-events-none">
                <h3 class="text-teal-400 font-bold text-sm" data-i18n="gap_title">GAP Score & Global Tilt (Yilgor, 2017)</h3>
                <button onclick="document.getElementById('gap-box').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 text-xs pointer-events-auto" data-i18n="btn_close">&times; Close</button>
            </div>
            <div class="pointer-events-auto text-xs text-gray-300 space-y-2.5">
                <div class="grid grid-cols-4 gap-1.5 border-b border-gray-700 pb-2 text-center bg-gray-800/50 rounded p-1.5">
                    <div><span class="text-gray-400 block text-[10px]">PI</span><span id="gap-pi" class="font-bold text-emerald-400 text-xs">-</span></div>
                    <div><span class="text-gray-400 block text-[10px]">PT</span><span id="gap-pt" class="font-bold text-white text-xs">-</span></div>
                    <div><span class="text-gray-400 block text-[10px]">Global Tilt</span><span id="gap-gt" class="font-bold text-teal-300 text-xs">-</span></div>
                    <div><span class="text-gray-400 block text-[10px]">Ideal GT</span><span id="gap-ideal-gt" class="font-bold text-emerald-400 text-xs">-</span></div>
                </div>
                <div id="gap-age-row" class="flex justify-between items-center bg-gray-800/70 border border-gray-700 rounded px-2.5 py-1.5 cursor-default">
                    <span class="text-[11px] text-gray-300 font-semibold" data-i18n="gap_age_lbl">Patient Age Factor:</span>
                    <div class="flex space-x-1">
                        <button id="btn-gap-u60" onclick="setGapAgeFactor(false)" class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white" data-i18n="gap_age_u60">&lt; 60 yrs (0 pts)</button>
                        <button id="btn-gap-o60" onclick="setGapAgeFactor(true)" class="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300" data-i18n="gap_age_o60">&ge; 60 yrs (+1 pt)</button>
                    </div>
                </div>
                <div class="space-y-1.5 border-b border-gray-700 pb-2 text-[11px]">
                    <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="gap_rpv">1. Rel. Pelvic Version (RPV)</span><span id="gap-rpv-val" class="font-bold text-white">-</span></div>
                    <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="gap_rll">2. Rel. Lumbar Lordosis (RLL)</span><span id="gap-rll-val" class="font-bold text-white">-</span></div>
                    <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="gap_ldi">3. Lordosis Distribution (LDI)</span><span id="gap-ldi-val" class="font-bold text-white">-</span></div>
                    <div class="flex justify-between items-center"><span class="text-gray-400" data-i18n="gap_rsa">4. Rel. Spinopelvic Align (RSA)</span><span id="gap-rsa-val" class="font-bold text-white">-</span></div>
                </div>
                <div class="bg-gray-800/90 border border-gray-700 rounded p-2.5 text-center">
                    <div class="text-[11px] text-gray-400 uppercase font-bold mb-1">Total GAP Score: <span id="gap-total-num" class="text-white text-sm">0 / 13</span></div>
                    <div id="gap-badge" class="bg-emerald-600 text-white font-bold py-1 px-3 rounded-full mb-1.5 inline-block text-xs shadow">PROPORTIONED</div>
                    <p id="gap-desc" class="text-[11px] text-gray-200 leading-snug font-medium"></p>
                </div>
            </div>
        `;
        mainContainer.appendChild(gapModal);
        if (typeof makeInteractivePanel === 'function') makeInteractivePanel(gapModal);

        const ageRow = document.getElementById('gap-age-row');
        ['mousedown', 'touchstart', 'pointerdown'].forEach(evt => {
            ageRow.addEventListener(evt, e => e.stopPropagation());
        });
    }

    window.setGapAgeFactor = function(isOver60) {
        window.gapAgeOver60 = !!isOver60;
        const bU = document.getElementById('btn-gap-u60');
        const bO = document.getElementById('btn-gap-o60');
        if (bU && bO) {
            bU.className = !window.gapAgeOver60 ? "px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white" : "px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300";
            bO.className = window.gapAgeOver60 ? "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white" : "px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300";
        }
        populateGAPBox();
    };

    // 4. CÁLCULO GEOMÉTRICO DEL GLOBAL TILT (GT) Y RENDERIZADO EN RADIOGRAFÍA
    function computeGTFromPelvicAndC7(pelvicMeas, c7Point, stageGaze) {
        if (!pelvicMeas || !pelvicMeas.circles || pelvicMeas.circles.length < 2 || !pelvicMeas.line || pelvicMeas.line.length < 2 || !c7Point) return null;
        let ha_x = (pelvicMeas.circles[0].x + pelvicMeas.circles[1].x) / 2;
        let ha_y = (pelvicMeas.circles[0].y + pelvicMeas.circles[1].y) / 2;
        let s1_x = (pelvicMeas.line[0].x + pelvicMeas.line[1].x) / 2;
        let s1_y = (pelvicMeas.line[0].y + pelvicMeas.line[1].y) / 2;

        // PT con signo
        let pt_mag = Math.abs(Math.atan2(s1_y - ha_y, s1_x - ha_x) * 180 / Math.PI - 90);
        if (pt_mag > 90) pt_mag = Math.abs(pt_mag - 180);
        let pt = (((s1_x - ha_x) * stageGaze) > 0) ? -pt_mag : pt_mag;

        // C7 Tilt desde S1 a C7 respecto a la vertical
        let vx = c7Point.x - s1_x;
        let vy = c7Point.y - s1_y;
        let mag = Math.hypot(vx, vy) || 1;
        let c7_ang = Math.acos(Math.max(-1, Math.min(1, -vy / mag))) * 180 / Math.PI;
        let c7_tilt = (vx * stageGaze) >= 0 ? c7_ang : -c7_ang;

        let gt = pt + c7_tilt;
        return { gt, pt, c7_tilt, ha: { x: ha_x, y: ha_y }, s1: { x: s1_x, y: s1_y }, c7: c7Point };
    }

    function drawGTOverlay(targetCtx, measList, stageGaze, sc) {
        if (!measList) return null;
        let pelvic = measList.find(m => m.type === 'pelvic' && m.circles && m.circles.length === 2 && m.line && m.line.length === 2);
        let gtMeas = measList.find(m => m.type === 'gt' && m.points && m.points.length > 0);
        let computedGT = null;

        if (gtMeas) {
            targetCtx.save();
            let c = gtMeas.color || '#2dd4bf';
            targetCtx.strokeStyle = c;
            targetCtx.fillStyle = c;
            targetCtx.lineWidth = (gtMeas.width || 1.5) / sc;
            let dotR = 4.5 / sc;

            if (pelvic) {
                let geom = computeGTFromPelvicAndC7(pelvic, gtMeas.points[0], stageGaze);
                if (geom) {
                    computedGT = Number(fmtInt(geom.gt));
                    // Línea S1 -> C7 y S1 -> Eje Bicoxofemoral (HA)
                    targetCtx.beginPath();
                    targetCtx.moveTo(geom.c7.x, geom.c7.y);
                    targetCtx.lineTo(geom.s1.x, geom.s1.y);
                    targetCtx.lineTo(geom.ha.x, geom.ha.y);
                    targetCtx.stroke();

                    targetCtx.beginPath();
                    targetCtx.arc(geom.c7.x, geom.c7.y, dotR, 0, 2 * Math.PI);
                    targetCtx.fill();

                    if (gtMeas.textPos) {
                        let fSize = gtMeas.fontSize || 14;
                        targetCtx.font = `bold ${fSize / sc}px sans-serif`;
                        targetCtx.textAlign = 'left';
                        targetCtx.textBaseline = 'top';
                        targetCtx.shadowColor = 'rgba(0,0,0,0.9)';
                        targetCtx.shadowBlur = 4 / sc;
                        targetCtx.fillText(gtMeas.title || 'GT', gtMeas.textPos.x, gtMeas.textPos.y);
                        targetCtx.fillText(`${fmtInt(geom.gt)}°`, gtMeas.textPos.x, gtMeas.textPos.y + (fSize + 4) / sc);
                        targetCtx.shadowBlur = 0;
                    }
                }
            } else if (gtMeas.textPos) {
                let fSize = gtMeas.fontSize || 14;
                targetCtx.font = `bold ${fSize / sc}px sans-serif`;
                targetCtx.fillText(t('req_pelvic'), gtMeas.textPos.x, gtMeas.textPos.y);
            }
            targetCtx.restore();
        }
        return computedGT;
    }

    // 5. MOTOR MATEMÁTICO DEL GAP SCORE (YILGOR ET AL., JBJS 2017)
    window.populateGAPBox = function() {
        // Detectar edad automáticamente de la ficha del paciente si existe
        const patAgeInput = document.getElementById('pat-age');
        if (patAgeInput && patAgeInput.value.trim() !== '') {
            let parsedAge = parseInt(patAgeInput.value.trim(), 10);
            if (!isNaN(parsedAge)) {
                window.gapAgeOver60 = (parsedAge >= 60);
                const bU = document.getElementById('btn-gap-u60');
                const bO = document.getElementById('btn-gap-o60');
                if (bU && bO) {
                    bU.className = !window.gapAgeOver60 ? "px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white" : "px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300";
                    bO.className = window.gapAgeOver60 ? "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-white" : "px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300";
                }
            }
        }

        let res = window.currentResults || {};
        let pi = res['PI'];
        let ss = res['SS'];
        let pt = res['PT'] !== undefined ? res['PT'] : (pi !== undefined && ss !== undefined ? (pi - ss) : undefined);
        let ll = res['L1-S1'] !== undefined ? Math.abs(res['L1-S1']) : undefined;
        let l4s1 = res['L4-S1'] !== undefined ? Math.abs(res['L4-S1']) : undefined;

        // Global Tilt: usa el trazo GT directo o lo deduce de PT + C7 Tilt
        let gt = res['GT'];
        if (gt === undefined && pt !== undefined && res['C7 Tilt'] !== undefined) {
            gt = pt + res['C7 Tilt'];
        }

        document.getElementById('gap-pi').innerText = pi !== undefined ? `${fmtInt(pi)}°` : '-';
        document.getElementById('gap-pt').innerText = pt !== undefined ? `${fmtInt(pt)}°` : '-';
        document.getElementById('gap-gt').innerText = gt !== undefined ? `${fmtInt(gt)}°` : '-';

        let idealGT = pi !== undefined ? (0.48 * pi - 15) : undefined;
        document.getElementById('gap-ideal-gt').innerText = idealGT !== undefined ? `${fmtInt(idealGT)}°` : '-';

        let totalScore = 0;

        // 1. RPV = Measured SS - Ideal SS (Ideal SS = 0.59 * PI + 9)
        if (pi !== undefined && ss !== undefined) {
            let rpv = ss - (0.59 * pi + 9);
            let pts = 0;
            if (rpv < -15) pts = 3;
            else if (rpv < -7) pts = 2;
            else if (rpv <= 5) pts = 0;
            else pts = 1;
            totalScore += pts;
            document.getElementById('gap-rpv-val').innerText = `${fmtInt(rpv)}° (+${pts} pt)`;
            document.getElementById('gap-rpv-val').style.color = pts === 0 ? '#10b981' : (pts <= 2 ? '#f59e0b' : '#f43f5e');
        } else {
            document.getElementById('gap-rpv-val').innerText = 'Measure PI & SS';
            document.getElementById('gap-rpv-val').style.color = '#94a3b8';
        }

        // 2. RLL = Measured LL - Ideal LL (Ideal LL = 0.62 * PI + 29)
        if (pi !== undefined && ll !== undefined) {
            let rll = ll - (0.62 * pi + 29);
            let pts = 0;
            if (rll < -25) pts = 3;
            else if (rll < -14) pts = 2;
            else if (rll <= 11) pts = 0;
            else pts = 3;
            totalScore += pts;
            document.getElementById('gap-rll-val').innerText = `${fmtInt(rll)}° (+${pts} pt)`;
            document.getElementById('gap-rll-val').style.color = pts === 0 ? '#10b981' : (pts === 2 ? '#f59e0b' : '#f43f5e');
        } else {
            document.getElementById('gap-rll-val').innerText = 'Measure L1-S1';
            document.getElementById('gap-rll-val').style.color = '#94a3b8';
        }

        // 3. LDI = (L4-S1 / L1-S1) * 100
        if (ll !== undefined && ll > 0 && l4s1 !== undefined) {
            let ldi = (l4s1 / ll) * 100;
            let pts = 0;
            if (ldi < 40) pts = 2;
            else if (ldi < 50) pts = 1;
            else if (ldi <= 80) pts = 0;
            else pts = 3;
            totalScore += pts;
            document.getElementById('gap-ldi-val').innerText = `${fmtInt(ldi)}% (+${pts} pt)`;
            document.getElementById('gap-ldi-val').style.color = pts === 0 ? '#10b981' : (pts <= 2 ? '#f59e0b' : '#f43f5e');
        } else {
            document.getElementById('gap-ldi-val').innerText = 'Measure L4-S1';
            document.getElementById('gap-ldi-val').style.color = '#94a3b8';
        }

        // 4. RSA = Measured GT - Ideal GT (Ideal GT = 0.48 * PI - 15)
        if (pi !== undefined && gt !== undefined) {
            let rsa = gt - idealGT;
            let pts = 0;
            if (rsa > 18) pts = 3;
            else if (rsa > 10) pts = 1;
            else if (rsa >= -7) pts = 0;
            else pts = 1;
            totalScore += pts;
            document.getElementById('gap-rsa-val').innerText = `${fmtInt(rsa)}° (+${pts} pt)`;
            document.getElementById('gap-rsa-val').style.color = pts === 0 ? '#10b981' : (pts === 1 ? '#f59e0b' : '#f43f5e');
        } else {
            document.getElementById('gap-rsa-val').innerText = 'Measure GT or C7 Tilt';
            document.getElementById('gap-rsa-val').style.color = '#94a3b8';
        }

        // 5. Factor Edad (≥60 años = +1 pt)
        if (window.gapAgeOver60) totalScore += 1;

        document.getElementById('gap-total-num').innerText = `${totalScore} / 13`;
        const badge = document.getElementById('gap-badge');
        const desc = document.getElementById('gap-desc');

        if (totalScore <= 2) {
            badge.innerText = t('gap_prop');
            badge.className = "bg-emerald-600 text-white font-bold py-1 px-3 rounded-full mb-1.5 inline-block text-xs shadow";
            desc.innerText = t('gap_desc_prop');
        } else if (totalScore <= 6) {
            badge.innerText = t('gap_mod');
            badge.className = "bg-amber-600 text-white font-bold py-1 px-3 rounded-full mb-1.5 inline-block text-xs shadow";
            desc.innerText = t('gap_desc_mod');
        } else {
            badge.innerText = t('gap_sev');
            badge.className = "bg-rose-600 text-white font-bold py-1 px-3 rounded-full mb-1.5 inline-block text-xs shadow";
            desc.innerText = t('gap_desc_sev');
        }
    };

    window.showGAPScore = function() {
        if (window.currentResults['PI'] === undefined) {
            updateStatus("⚠️ Measure Pelvic Parameters (PI, PT, SS) first.", true);
            return;
        }
        populateGAPBox();
        document.getElementById('gap-box').classList.remove('hidden');
        if (window.innerWidth < 768 && isMobileMenuOpen) toggleMobileMenu();
    };

    // 6. ENGANCHAR CON EL DIBUJADO DEL LIENZO Y EVENTOS DE INTERACCIÓN
    const prevDraw = draw;
    draw = function() {
        prevDraw();
        if (bgImage) {
            if (window.currentResults['PI'] !== undefined && window.currentResults['SS'] !== undefined) {
                window.currentResults['PT'] = window.currentResults['PI'] - window.currentResults['SS'];
            }
            let sc = baseScale * zoomScale;
            ctx.save();
            ctx.translate(panX, panY);
            ctx.scale(sc, sc);
            let gtVal = drawGTOverlay(ctx, measurements, gazeDirection, sc);
            ctx.restore();

            if (gtVal !== null) {
                window.currentResults['GT'] = gtVal;
            } else if (window.currentResults['PT'] !== undefined && window.currentResults['C7 Tilt'] !== undefined) {
                window.currentResults['GT'] = window.currentResults['PT'] + window.currentResults['C7 Tilt'];
            }
            if (!window.ostSimActive && currentStage === 'pre' && window._preOstBaseResults) {
                window._preOstBaseResults['PT'] = window.currentResults['PT'];
                window._preOstBaseResults['GT'] = window.currentResults['GT'];
            }
            stageData[currentStage].results = { ...window.currentResults };
            if (!document.getElementById('gap-box').classList.contains('hidden')) populateGAPBox();
        }
    };

    const prevRenderStage = renderStageOnContext;
    renderStageOnContext = function(cCtx, sData, panXVal, panYVal, sc) {
        let res = prevRenderStage(cCtx, sData, panXVal, panYVal, sc);
        if (sData && sData.bgImage && sData.measurements) {
            cCtx.save();
            cCtx.translate(panXVal, panYVal);
            cCtx.scale(sc, sc);
            let gtVal = drawGTOverlay(cCtx, sData.measurements, sData.gazeDirection || 1, sc);
            cCtx.restore();
            if (gtVal !== null) res['GT'] = gtVal;
        }
        return res;
    };

    canvas.addEventListener('mousedown', function(e) {
        if (e.button !== 0 || !bgImage || activeTool !== 'gt') return;
        const pos = getLogicalPos(e);
        measurements = measurements.filter(m => m.type !== 'gt');
        let mGT = {
            id: Date.now(),
            type: 'gt',
            title: 'GT',
            color: '#2dd4bf',
            width: 1.5,
            fontSize: 14,
            points: [{ x: pos.x, y: pos.y }],
            textPos: { x: pos.x + 22, y: pos.y - 18 }
        };
        if (window.ostSimActive) {
            mGT._basePoints = [{ x: pos.x, y: pos.y }];
        }
        measurements.push(mGT);
        deactivateTool();
        draw();
    }, true);

    const prevClear = clearCanvas;
    clearCanvas = function() {
        document.getElementById('gap-box').classList.add('hidden');
        prevClear();
    };

    const prevReset = resetAllStudy;
    resetAllStudy = function(s) {
        document.getElementById('gap-box').classList.add('hidden');
        prevReset(s);
    };

    setLanguage(currentLang);
})();
