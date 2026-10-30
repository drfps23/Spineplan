// ============================================================================
// ACTUALIZACIÓN 1 V2 (visor_ui.js): ICONOS + MOTOR DE PÍXELES (MÓVIL/PC) + LUPA
// Compatible 100% con iPhone (iOS), iPad, Android y PC mediante procesamiento LUT
// ============================================================================

(function() {
    window.rxFilters = {
        pre: { brightness: 100, contrast: 100, invert: false },
        post: { brightness: 100, contrast: 100, invert: false }
    };
    window.loupeActive = false;

    // Caché de imágenes procesadas píxel por píxel para máxima fluidez en celulares
    const filterCache = {
        pre: { src: null, key: '', canvas: null },
        post: { src: null, key: '', canvas: null }
    };

    // 1. ICONOS MINIMALISTAS EN LA BARRA SUPERIOR
    function applyMinimalistHeaderIcons() {
        const btnPatient = document.querySelector('button[onclick="openPatientModal()"]');
        if (btnPatient) {
            btnPatient.removeAttribute('data-i18n');
            btnPatient.innerHTML = '👤';
            btnPatient.title = currentLang === 'es' ? 'Datos del Paciente' : 'Patient Information';
            btnPatient.className = "bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 px-2.5 py-1.5 rounded text-sm font-bold transition-colors border border-blue-500/50 flex items-center justify-center shadow-sm";
        }

        const btnGaze = document.getElementById('gaze-btn');
        if (btnGaze) {
            btnGaze.innerHTML = gazeDirection === 1 ? '➡️' : '⬅️';
            btnGaze.title = currentLang === 'es' ? 'Dirección de la Mirada' : 'Gaze Direction';
            btnGaze.className = "bg-gray-800 hover:bg-gray-700 text-emerald-400 border border-emerald-600/50 px-2.5 py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center shadow-sm";
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
            lbl.className = "bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded text-sm font-bold cursor-pointer flex items-center justify-center transition-colors shadow-sm";
        }

        const btnSave = document.querySelector('button[onclick="openSaveModal()"]');
        if (btnSave) {
            btnSave.removeAttribute('data-i18n');
            btnSave.innerHTML = '💾';
            btnSave.title = currentLang === 'es' ? 'Guardar y Exportar Estudio' : 'Save & Export Study';
            btnSave.className = "bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1.5 rounded text-sm font-bold transition-colors border border-purple-500 flex items-center justify-center shadow-sm";
        }

        const btnClear = document.querySelector('button[onclick="clearCanvas()"]');
        if (btnClear) {
            btnClear.removeAttribute('data-i18n');
            btnClear.innerHTML = '🧹';
            btnClear.title = currentLang === 'es' ? 'Limpiar trazos actuales' : 'Clear current traces';
            btnClear.className = "bg-gray-700 hover:bg-gray-600 text-white px-2.5 py-1.5 rounded text-sm font-bold transition-colors border border-gray-600 flex items-center justify-center shadow-sm";
        }

        const btnReset = document.querySelector('button[onclick="resetAllStudy()"]');
        if (btnReset) {
            btnReset.removeAttribute('data-i18n');
            btnReset.innerHTML = '🗑️';
            btnReset.title = currentLang === 'es' ? 'Quitar todo (Reiniciar)' : 'Reset All Study';
            btnReset.className = "bg-red-700/80 hover:bg-red-600 text-white px-2.5 py-1.5 rounded text-sm font-bold transition-colors border border-red-500 flex items-center justify-center shadow-sm";
        }

        if (btnSave && !document.getElementById('btn-rx-adjust')) {
            const btnRx = document.createElement('button');
            btnRx.id = 'btn-rx-adjust';
            btnRx.innerHTML = '🔆';
            btnRx.title = currentLang === 'es' ? 'Brillo, Contraste y Modo Negativo' : 'Brightness, Contrast & Negative Mode';
            btnRx.className = "bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/50 px-2.5 py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center shadow-sm";
            btnRx.onclick = toggleRxAdjustPanel;
            btnSave.parentNode.insertBefore(btnRx, btnSave);

            const btnLoupe = document.createElement('button');
            btnLoupe.id = 'btn-rx-loupe';
            btnLoupe.innerHTML = '🔍';
            btnLoupe.title = currentLang === 'es' ? 'Activar/Desactivar Lupa de Precisión' : 'Toggle Precision Loupe';
            btnLoupe.className = "bg-gray-800 hover:bg-gray-700 text-sky-400 border border-sky-600/50 px-2.5 py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center shadow-sm";
            btnLoupe.onclick = togglePrecisionLoupe;
            btnSave.parentNode.insertBefore(btnLoupe, btnSave);
        }
    }

    // 2. PANEL FLOTANTE CON SOPORTE TÁCTIL DIRECTO PARA MÓVILES Y TABLETS
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

        const loupeCanvas = document.createElement('canvas');
        loupeCanvas.id = 'loupe-canvas';
        loupeCanvas.width = 150;
        loupeCanvas.height = 150;
        loupeCanvas.className = 'hidden absolute bottom-5 right-5 z-40 rounded-full border-2 border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.5)] pointer-events-none bg-black';
        mainContainer.appendChild(loupeCanvas);
    }

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
        const btn = document.getElementById('btn-rx-loupe');
        const lc = document.getElementById('loupe-canvas');
        if (btn) {
            btn.className = window.loupeActive
                ? "bg-sky-600 text-white border border-sky-400 px-2.5 py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center shadow-lg"
                : "bg-gray-800 hover:bg-gray-700 text-sky-400 border border-sky-600/50 px-2.5 py-1.5 rounded text-sm font-bold transition-colors flex items-center justify-center shadow-sm";
        }
        if (lc && !window.loupeActive) lc.classList.add('hidden');
    };

    // 3. MOTOR DE PÍXELES UNIVERSAL (LUT) PARA IPHONE, IPAD, ANDROID Y PC
    const nativeDrawImage = CanvasRenderingContext2D.prototype.drawImage;

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

        // Tabla precalculada de 256 niveles (ejecución instantánea en móviles)
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

    // 4. LUPA DE PRECISIÓN
    function renderLoupe(clientX, clientY) {
        const lc = document.getElementById('loupe-canvas');
        if (!lc || !window.loupeActive || !bgImage || isCompareMode) {
            if (lc) lc.classList.add('hidden');
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const cx = clientX - rect.left;
        const cy = clientY - rect.top;
        if (cx < 0 || cy < 0 || cx > canvas.width || cy > canvas.height) {
            lc.classList.add('hidden');
            return;
        }
        lc.classList.remove('hidden');
        const lCtx = lc.getContext('2d');
        const zoom = 2.6;
        const r = lc.width / 2;
        const srcW = lc.width / zoom;
        const srcH = lc.height / zoom;

        lCtx.clearRect(0, 0, lc.width, lc.height);
        lCtx.fillStyle = '#020617';
        lCtx.fillRect(0, 0, lc.width, lc.height);
        nativeDrawImage.call(lCtx, canvas, cx - srcW / 2, cy - srcH / 2, srcW, srcH, 0, 0, lc.width, lc.height);

        lCtx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        lCtx.lineWidth = 1;
        lCtx.beginPath();
        lCtx.moveTo(r - 18, r); lCtx.lineTo(r + 18, r);
        lCtx.moveTo(r, r - 18); lCtx.lineTo(r, r + 18);
        lCtx.stroke();
        lCtx.beginPath();
        lCtx.arc(r, r, 3, 0, 2 * Math.PI);
        lCtx.strokeStyle = '#f43f5e';
        lCtx.stroke();
    }

    canvas.addEventListener('mousemove', function(e) {
        if (window.loupeActive) renderLoupe(e.clientX, e.clientY);
    });
    canvas.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && window.loupeActive) {
            renderLoupe(e.touches[0].clientX, e.touches[0].clientY);
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
        filterCache.pre = { src: null, key: '', canvas: null };
        filterCache.post = { src: null, key: '', canvas: null };
        prevResetAll(s);
        syncRxPanelUI();
        applyMinimalistHeaderIcons();
    };

    applyMinimalistHeaderIcons();
    syncRxPanelUI();
})();
