// ============================================================================
// ACTUALIZACIÓN 1 V4 (visor_ui.js): BARRA AUTO-AJUSTABLE MÓVIL + 👁️ + 🔒 + LUPA
// 11 iconos en 1 sola fila en celulares + Ocultar trazos (👁️) + Bloqueo (🔒)
// ============================================================================

(function() {
    window.rxFilters = {
        pre: { brightness: 100, contrast: 100, invert: false },
        post: { brightness: 100, contrast: 100, invert: false }
    };
    window.loupeActive = false;
    window.hideTraces = false;
    window.lockTraces = false;

    const filterCache = {
        pre: { src: null, key: '', canvas: null },
        post: { src: null, key: '', canvas: null }
    };

    // Clase compacta elástica: en celular (px-1 text-xs flex-1) caben los 11 en 1 sola línea; en PC mantiene su tamaño normal
    const BTN_BASE_CLS = "flex-1 sm:flex-none min-w-0 px-1 sm:px-2.5 py-1.5 rounded text-xs sm:text-sm font-bold transition-colors flex items-center justify-center shadow-sm select-none";

    // 1. ICONOS MINIMALISTAS AUTO-AJUSTABLES EN LA BARRA SUPERIOR
    function applyMinimalistHeaderIcons() {
        const btnPatient = document.querySelector('button[onclick="openPatientModal()"]');
        if (btnPatient) {
            btnPatient.removeAttribute('data-i18n');
            btnPatient.innerHTML = '👤';
            btnPatient.title = currentLang === 'es' ? 'Datos del Paciente' : 'Patient Information';
            btnPatient.className = `${BTN_BASE_CLS} bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50`;
        }

        const btnGaze = document.getElementById('gaze-btn');
        if (btnGaze) {
            btnGaze.innerHTML = gazeDirection === 1 ? '➡️' : '⬅️';
            btnGaze.title = currentLang === 'es' ? 'Dirección de la Mirada' : 'Gaze Direction';
            btnGaze.className = `${BTN_BASE_CLS} bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-600/50`;
        }

        const imgInput = document.getElementById('imageLoader');
        if (imgInput && imgInput.parentElement && imgInput.parentElement.tagName === 'LABEL') {
            const lbl = imgInput.parentElement;
            Array.from(lbl.childNodes).forEach(node => {
                if (node !== imgInput) lbl.removeChild(node);
            });
            const iconSpan = document.createElement('span');
            iconSpan.textContent = '📤';
            lbl.insertBefore(iconSpan, imgInput);
            lbl.title = currentLang === 'es' ? 'Cargar Radiografía (Rx)' : 'Load X-Ray';
            lbl.className = `${BTN_BASE_CLS} bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer`;
        }

        const btnSave = document.querySelector('button[onclick="openSaveModal()"]');
        if (btnSave) {
            btnSave.removeAttribute('data-i18n');
            btnSave.innerHTML = '💾';
            btnSave.title = currentLang === 'es' ? 'Guardar y Exportar Estudio' : 'Save & Export Study';
            btnSave.className = `${BTN_BASE_CLS} bg-purple-600 hover:bg-purple-500 text-white border border-purple-500`;
        }

        const btnClear = document.querySelector('button[onclick="clearCanvas()"]');
        if (btnClear) {
            btnClear.removeAttribute('data-i18n');
            btnClear.innerHTML = '🧹';
            btnClear.title = currentLang === 'es' ? 'Limpiar trazos actuales' : 'Clear current traces';
            btnClear.className = `${BTN_BASE_CLS} bg-gray-700 hover:bg-gray-600 text-white border border-gray-600`;
        }

        const btnReset = document.querySelector('button[onclick="resetAllStudy()"]');
        if (btnReset) {
            btnReset.removeAttribute('data-i18n');
            btnReset.innerHTML = '🗑️';
            btnReset.title = currentLang === 'es' ? 'Quitar todo (Reiniciar)' : 'Reset All Study';
            btnReset.className = `${BTN_BASE_CLS} bg-red-700/80 hover:bg-red-600 text-white border border-red-500`;
        }

        const btnPdf = document.getElementById('btn-top-pdf');
        if (btnPdf) {
            btnPdf.className = `${BTN_BASE_CLS} bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/60`;
        }

        if (btnSave && !document.getElementById('btn-rx-adjust')) {
            const parentBar = btnSave.parentNode;

            const btnRx = document.createElement('button');
            btnRx.id = 'btn-rx-adjust';
            btnRx.innerHTML = '🔆';
            btnRx.title = currentLang === 'es' ? 'Brillo, Contraste y Modo Negativo' : 'Brightness, Contrast & Negative Mode';
            btnRx.className = `${BTN_BASE_CLS} bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50`;
            btnRx.onclick = toggleRxAdjustPanel;
            parentBar.insertBefore(btnRx, btnSave);

            const btnLoupe = document.createElement('button');
            btnLoupe.id = 'btn-rx-loupe';
            btnLoupe.innerHTML = '🔍';
            btnLoupe.title = currentLang === 'es' ? 'Activar/Desactivar Lupa de Precisión' : 'Toggle Precision Loupe';
            btnLoupe.onclick = togglePrecisionLoupe;
            parentBar.insertBefore(btnLoupe, btnSave);

            const btnEye = document.createElement('button');
            btnEye.id = 'btn-rx-eye';
            btnEye.onclick = toggleHideTraces;
            parentBar.insertBefore(btnEye, btnSave);

            const btnLock = document.createElement('button');
            btnLock.id = 'btn-rx-lock';
            btnLock.onclick = toggleLockTraces;
            parentBar.insertBefore(btnLock, btnSave);
        }

        // Forzar a que la fila de iconos nunca haga salto de línea en pantallas de celular
        if (btnSave && btnSave.parentNode) {
            const bar = btnSave.parentNode;
            bar.classList.remove('flex-wrap');
            bar.classList.add('flex-nowrap', 'w-full', ' sm:w-auto', 'justify-between', 'gap-1');
        }

        syncQuickButtonsUI();
    }

    function syncQuickButtonsUI() {
        const isEs = currentLang === 'es';
        const btnLoupe = document.getElementById('btn-rx-loupe');
        if (btnLoupe) {
            btnLoupe.className = window.loupeActive
                ? `${BTN_BASE_CLS} bg-sky-600 text-white border border-sky-400 shadow-lg`
                : `${BTN_BASE_CLS} bg-gray-800 hover:bg-gray-700 text-sky-400 border border-sky-600/50`;
        }

        const btnEye = document.getElementById('btn-rx-eye');
        if (btnEye) {
            btnEye.innerHTML = window.hideTraces ? '🙈' : '👁️';
            btnEye.title = isEs ? 'Mostrar / Ocultar Trazos (Ver Rx Limpia)' : 'Show / Hide Traces (Clean X-Ray)';
            btnEye.className = window.hideTraces
                ? `${BTN_BASE_CLS} bg-teal-600 text-white border border-teal-400 shadow-lg`
                : `${BTN_BASE_CLS} bg-gray-800 hover:bg-gray-700 text-teal-300 border border-teal-600/50`;
        }

        const btnLock = document.getElementById('btn-rx-lock');
        if (btnLock) {
            btnLock.innerHTML = window.lockTraces ? '🔒' : '🔓';
            btnLock.title = isEs ? 'Bloquear / Desbloquear Puntos (Zoom Seguro)' : 'Lock / Unlock Points (Safe Zoom)';
            btnLock.className = window.lockTraces
                ? `${BTN_BASE_CLS} bg-rose-600 text-white border border-rose-400 shadow-lg`
                : `${BTN_BASE_CLS} bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600`;
        }

        const btnPdf = document.getElementById('btn-top-pdf');
        if (btnPdf) {
            btnPdf.className = `${BTN_BASE_CLS} bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/60`;
        }
    }

    window.toggleHideTraces = function() {
        window.hideTraces = !window.hideTraces;
        syncQuickButtonsUI();
        draw();
        if (isCompareMode) drawCompareCanvases();
        updateStatus(window.hideTraces
            ? (currentLang === 'es' ? "🙈 Trazos ocultos temporalmente (Vista de Rx limpia)." : "🙈 Traces temporarily hidden (Clean X-Ray view).")
            : (currentLang === 'es' ? "👁️ Trazos visibles nuevamente." : "👁️ Traces visible again."));
    };

    window.toggleLockTraces = function() {
        window.lockTraces = !window.lockTraces;
        if (window.lockTraces && typeof deactivateTool === 'function') deactivateTool();
        syncQuickButtonsUI();
        updateStatus(window.lockTraces
            ? (currentLang === 'es' ? "🔒 Puntos bloqueados: Puedes hacer zoom y mover la Rx sin alterar los trazos." : "🔒 Points locked: Safe zoom and pan enabled.")
            : (currentLang === 'es' ? "🔓 Puntos desbloqueados: Edición activa." : "🔓 Points unlocked: Editing active."));
    };

    // 2. PANEL DE BRILLO/CONTRASTE Y LUPA FLOTANTE EN DOCUMENT.BODY
    const mainContainer = document.getElementById('canvas-container');
    if (mainContainer) {
        const rxPanel = document.createElement('div');
        rxPanel.id = 'rx-adjust-panel';
        rxPanel.className = 'hidden absolute top-4 right-4 bg-gray-900/95 border border-amber-500 rounded-lg p-3.5 shadow-2xl z-40 backdrop-blur-md w-64 select-none cursor-move';
        rxPanel.innerHTML = `
            <div class="flex justify-between items-center mb-2.5 border-b border-gray-700 pb-1.5 pointer-events-none">
                <h3 id="rx-panel-title" class="text-amber-400 font-bold text-xs uppercase tracking-wider">🔆 Visor Radiológico</h3>
                <button onclick="document.getElementById('rx-adjust-panel').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 rounded px-1.5 py-0.5 text-xs pointer-events-auto">&times;</button>
            </div>
            <div id="rx-controls-body" class="space-y-2.5 text-xs text-gray-200 cursor-default">
                <div>
                    <div class="flex justify-between mb-0.5"><span id="lbl-rx-bright" class="text-[11px] text-gray-400 font-semibold">Brillo</span><span id="val-rx-bright" class="text-[11px] font-bold text-amber-300">100%</span></div>
                    <input type="range" id="sl-rx-bright" min="30" max="220" value="100" class="w-full accent-amber-500 cursor-pointer">
                </div>
                <div>
                    <div class="flex justify-between mb-0.5"><span id="lbl-rx-contrast" class="text-[11px] text-gray-400 font-semibold">Contraste</span><span id="val-rx-contrast" class="text-[11px] font-bold text-amber-300">100%</span></div>
                    <input type="range" id="sl-rx-contrast" min="30" max="260" value="100" class="w-full accent-amber-500 cursor-pointer">
                </div>
                <div class="flex gap-1.5 pt-1">
                    <button id="btn-rx-invert" onclick="toggleRxInvert()" class="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-1.5 rounded text-[11px] font-bold transition-colors">🌓 Modo Negativo</button>
                    <button id="btn-rx-reset" onclick="resetRxFilters()" class="bg-gray-700 hover:bg-gray-600 text-gray-200 px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors" title="Restaurar">↺</button>
                </div>
            </div>
        `;
        mainContainer.appendChild(rxPanel);
        if (typeof makeInteractivePanel === 'function') makeInteractivePanel(rxPanel);

        const bodyWrap = document.getElementById('rx-controls-body');
        const slBright = document.getElementById('sl-rx-bright');
        const slContrast = document.getElementById('sl-rx-contrast');
        ['mousedown', 'touchstart', 'touchmove', 'pointerdown'].forEach(evt => {
            bodyWrap.addEventListener(evt, e => e.stopPropagation(), { passive: true });
            slBright.addEventListener(evt, e => e.stopPropagation(), { passive: true });
            slContrast.addEventListener(evt, e => e.stopPropagation(), { passive: true });
        });

        const onBrightChange = function() {
            window.rxFilters[currentStage].brightness = Number(this.value);
            document.getElementById('val-rx-bright').innerText = this.value + '%';
            draw(); if (isCompareMode) drawCompareCanvases();
        };
        const onContrastChange = function() {
            window.rxFilters[currentStage].contrast = Number(this.value);
            document.getElementById('val-rx-contrast').innerText = this.value + '%';
            draw(); if (isCompareMode) drawCompareCanvases();
        };

        slBright.addEventListener('input', onBrightChange);
        slBright.addEventListener('change', onBrightChange);
        slContrast.addEventListener('input', onContrastChange);
        slContrast.addEventListener('change', onContrastChange);
    }

    const loupeCanvas = document.createElement('canvas');
    loupeCanvas.id = 'loupe-canvas';
    loupeCanvas.width = 140;
    loupeCanvas.height = 140;
    loupeCanvas.className = 'hidden fixed z-50 rounded-full border-2 border-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.65)] pointer-events-none bg-black';
    document.body.appendChild(loupeCanvas);

    function syncRxPanelUI() {
        const f = window.rxFilters[currentStage] || { brightness: 100, contrast: 100, invert: false };
        const slB = document.getElementById('sl-rx-bright');
        const slC = document.getElementById('sl-rx-contrast');
        const btnInv = document.getElementById('btn-rx-invert');
        if (slB) { slB.value = f.brightness; document.getElementById('val-rx-bright').innerText = f.brightness + '%'; }
        if (slC) { slC.value = f.contrast; document.getElementById('val-rx-contrast').innerText = f.contrast + '%'; }
        if (btnInv) {
            btnInv.className = f.invert
                ? "flex-1 bg-amber-600 text-white border border-amber-400 py-1.5 rounded text-[11px] font-bold transition-colors shadow"
                : "flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-1.5 rounded text-[11px] font-bold transition-colors";
        }
        const isEs = currentLang === 'es';
        const tEl = document.getElementById('rx-panel-title');
        if (tEl) tEl.innerText = isEs ? '🔆 Visor Radiológico' : '🔆 X-Ray Controls';
        const lB = document.getElementById('lbl-rx-bright');
        if (lB) lB.innerText = isEs ? 'Brillo' : 'Brightness';
        const lC = document.getElementById('lbl-rx-contrast');
        if (lC) lC.innerText = isEs ? 'Contraste' : 'Contrast';
        if (btnInv) btnInv.innerText = isEs ? '🌓 Modo Negativo' : '🌓 Negative Mode';
    }

    window.toggleRxAdjustPanel = function() {
        const p = document.getElementById('rx-adjust-panel');
        if (!p) return;
        syncRxPanelUI();
        p.classList.toggle('hidden');
    };

    window.toggleRxInvert = function() {
        window.rxFilters[currentStage].invert = !window.rxFilters[currentStage].invert;
        syncRxPanelUI();
        draw(); if (isCompareMode) drawCompareCanvases();
    };

    window.resetRxFilters = function() {
        window.rxFilters[currentStage] = { brightness: 100, contrast: 100, invert: false };
        syncRxPanelUI();
        draw(); if (isCompareMode) drawCompareCanvases();
    };

    window.togglePrecisionLoupe = function() {
        window.loupeActive = !window.loupeActive;
        syncQuickButtonsUI();
        const lc = document.getElementById('loupe-canvas');
        if (lc && !window.loupeActive) lc.classList.add('hidden');
    };

    // 3. MOTOR DE PÍXELES UNIVERSAL (LUT) Y OCULTACIÓN TEMPORAL DE TRAZOS (👁️)
    const nativeDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    const nativeStroke    = CanvasRenderingContext2D.prototype.stroke;
    const nativeFill      = CanvasRenderingContext2D.prototype.fill;
    const nativeFillText  = CanvasRenderingContext2D.prototype.fillText;

    CanvasRenderingContext2D.prototype.stroke = function() {
        if (window.hideTraces && (this === ctx || this.canvas?.id?.includes('compare'))) return;
        return nativeStroke.apply(this, arguments);
    };
    CanvasRenderingContext2D.prototype.fill = function() {
        if (window.hideTraces && (this === ctx || this.canvas?.id?.includes('compare'))) return;
        return nativeFill.apply(this, arguments);
    };
    CanvasRenderingContext2D.prototype.fillText = function() {
        if (window.hideTraces && (this === ctx || this.canvas?.id?.includes('compare'))) return;
        return nativeFillText.apply(this, arguments);
    };

    function getFilteredRxCanvas(img) {
        let stKey = currentStage;
        if (stageData.pre && img === stageData.pre.bgImage) stKey = 'pre';
        else if (stageData.post && img === stageData.post.bgImage) stKey = 'post';

        const f = window.rxFilters[stKey] || { brightness: 100, contrast: 100, invert: false };
        if (f.brightness === 100 && f.contrast === 100 && !f.invert) return img;

        const key = `${f.brightness}_${f.contrast}_${f.invert ? 1 : 0}`;
        const cache = filterCache[stKey];
        if (cache.src === img && cache.key === key && cache.canvas) {
            return cache.canvas;
        }

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) return img;

        if (!cache.canvas) cache.canvas = document.createElement('canvas');
        cache.canvas.width = w;
        cache.canvas.height = h;
        const cCtx = cache.canvas.getContext('2d');
        nativeDrawImage.call(cCtx, img, 0, 0, w, h);

        const imgData = cCtx.getImageData(0, 0, w, h);
        const data = imgData.data;

        const lut = new Uint8Array(256);
        const bFactor = f.brightness / 100;
        const cFactor = f.contrast / 100;

        for (let i = 0; i < 256; i++) {
            let v = i * bFactor;
            v = (v - 128) * cFactor + 128;
            if (f.invert) v = 255 - v;
            lut[i] = v < 0 ? 0 : (v > 255 ? 255 : Math.round(v));
        }

        for (let p = 0, len = data.length; p < len; p += 4) {
            data[p]     = lut[data[p]];
            data[p + 1] = lut[data[p + 1]];
            data[p + 2] = lut[data[p + 2]];
        }

        cCtx.putImageData(imgData, 0, 0);
        cache.src = img;
        cache.key = key;
        return cache.canvas;
    }

    CanvasRenderingContext2D.prototype.drawImage = function(img) {
        let isRx = (img === bgImage) || (stageData.pre && img === stageData.pre.bgImage) || (stageData.post && img === stageData.post.bgImage);
        if (isRx && img) {
            const processedImg = getFilteredRxCanvas(img);
            const args = Array.prototype.slice.call(arguments);
            args[0] = processedImg;
            return nativeDrawImage.apply(this, args);
        }
        return nativeDrawImage.apply(this, arguments);
    };

    // 4. BLOQUEO TÁCTIL DE PUNTOS (🔒): PERMITE MOVER Y HACER ZOOM SIN ALTERAR TRAZOS
    window.addEventListener('load', function() {
        applyMinimalistHeaderIcons();
        if (typeof checkHit === 'function') {
            const origHit = checkHit;
            checkHit = function(x, y) {
                if (window.lockTraces || window.hideTraces) return null;
                return origHit(x, y);
            };
        }
    });

    canvas.addEventListener('contextmenu', function(e) {
        if (window.lockTraces) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }, true);

    // 5. LUPA INTELIGENTE: FLOTA SOBRE EL DEDO EN CELULAR Y EN ESQUINA SUPERIOR EN PC
    function renderLoupe(clientX, clientY, isTouch) {
        const lc = document.getElementById('loupe-canvas');
        if (!lc || !window.loupeActive || !bgImage || isCompareMode) {
            if (lc) lc.classList.add('hidden');
            return;
        }
        const rect = canvas.getBoundingClientRect();
        if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
            lc.classList.add('hidden');
            return;
        }

        const isMobileScreen = isTouch || window.innerWidth < 768;
        const lSize = isMobileScreen ? 132 : 150;
        if (lc.width !== lSize) {
            lc.width = lSize;
            lc.height = lSize;
        }

        let leftPx, topPx;
        if (isMobileScreen) {
            leftPx = clientX - lSize / 2;
            topPx  = clientY - lSize - 46;
            if (topPx < Math.max(52, rect.top + 6)) {
                topPx = Math.max(56, Math.min(window.innerHeight - lSize - 20, clientY - lSize / 2));
                leftPx = (clientX < window.innerWidth / 2) ? (clientX + 48) : (clientX - lSize - 48);
            }
            leftPx = Math.max(8, Math.min(window.innerWidth - lSize - 8, leftPx));
            topPx  = Math.max(52, Math.min(window.innerHeight - lSize - 16, topPx));
        } else {
            topPx  = rect.top + 16;
            leftPx = rect.right - lSize - 16;
            if (clientX > leftPx - 30 && clientY < topPx + lSize + 30) {
                leftPx = rect.left + 16;
            }
        }

        lc.style.left = `${Math.round(leftPx)}px`;
        lc.style.top  = `${Math.round(topPx)}px`;
        lc.classList.remove('hidden');

        const scaleX = canvas.width / (rect.width || 1);
        const scaleY = canvas.height / (rect.height || 1);
        const cx = (clientX - rect.left) * scaleX;
        const cy = (clientY - rect.top) * scaleY;

        const lCtx = lc.getContext('2d');
        const zoom = 2.6;
        const r = lSize / 2;
        const srcW = lSize / zoom;
        const srcH = lSize / zoom;

        lCtx.clearRect(0, 0, lSize, lSize);
        lCtx.fillStyle = '#020617';
        lCtx.fillRect(0, 0, lSize, lSize);
        nativeDrawImage.call(lCtx, canvas, cx - srcW / 2, cy - srcH / 2, srcW, srcH, 0, 0, lSize, lSize);

        nativeStroke.call(lCtx);
        lCtx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        lCtx.lineWidth = 1.2;
        lCtx.beginPath();
        lCtx.moveTo(r - 18, r); lCtx.lineTo(r + 18, r);
        lCtx.moveTo(r, r - 18); lCtx.lineTo(r, r + 18);
        nativeStroke.call(lCtx);
        lCtx.beginPath();
        lCtx.arc(r, r, 3, 0, 2 * Math.PI);
        lCtx.strokeStyle = '#f43f5e';
        nativeStroke.call(lCtx);
    }

    canvas.addEventListener('mousemove', function(e) {
        if (window.loupeActive) renderLoupe(e.clientX, e.clientY, false);
    });
    canvas.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1 && window.loupeActive) {
            renderLoupe(e.touches[0].clientX, e.touches[0].clientY, true);
        }
    }, { passive: true });
    canvas.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && window.loupeActive) {
            renderLoupe(e.touches[0].clientX, e.touches[0].clientY, true);
        } else if (e.touches.length > 1) {
            const lc = document.getElementById('loupe-canvas');
            if (lc) lc.classList.add('hidden');
        }
    }, { passive: true });
    canvas.addEventListener('touchend', function() {
        const lc = document.getElementById('loupe-canvas');
        if (lc) lc.classList.add('hidden');
    });

    const prevSetLang = setLanguage;
    setLanguage = function(lang) { prevSetLang(lang); applyMinimalistHeaderIcons(); syncRxPanelUI(); };
    const prevToggleGaze = toggleGaze;
    toggleGaze = function() { prevToggleGaze(); applyMinimalistHeaderIcons(); };
    const prevSwitchStage = switchStage;
    switchStage = function(st) { prevSwitchStage(st); syncRxPanelUI(); applyMinimalistHeaderIcons(); };
    const prevResetAll = resetAllStudy;
    resetAllStudy = function(s) {
        window.rxFilters = {
            pre: { brightness: 100, contrast: 100, invert: false },
            post: { brightness: 100, contrast: 100, invert: false }
        };
        window.hideTraces = false;
        window.lockTraces = false;
        filterCache.pre = { src: null, key: '', canvas: null };
        filterCache.post = { src: null, key: '', canvas: null };
        prevResetAll(s);
        syncRxPanelUI();
        applyMinimalistHeaderIcons();
    };

    applyMinimalistHeaderIcons();
    syncRxPanelUI();
})();
