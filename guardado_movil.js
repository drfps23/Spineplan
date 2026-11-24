// ============================================================================
// MÓDULO INDEPENDIENTE (guardado_movil.js): GUARDADO Y APERTURA EDITABLE EN CELULARES
// 100% aislado: No altera archivos previos. Agrega Bóveda Local (IndexedDB) + Share Nativo
// ============================================================================

(function() {
    try {
        const DB_NAME = 'SpinePlanMobileVaultDB';
        const STORE_NAME = 'studies';
        const blobRegistry = new Map();
        let pendingVaultFile = null;

        function isMobileDevice() {
            return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        }

        // --------------------------------------------------------------------
        // 1. BÓVEDA LOCAL EN EL DISPOSITIVO (IndexedDB - 100% privada/offline)
        // --------------------------------------------------------------------
        function openVaultDB() {
            return new Promise((resolve, reject) => {
                const req = indexedDB.open(DB_NAME, 1);
                req.onupgradeneeded = function(e) {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        }

        async function saveToMobileVault(filename, textContent) {
            const db = await openVaultDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const cleanName = filename || `SpinePlan_${new Date().toISOString().slice(0, 10)}.spine`;
                const record = {
                    id: 'sp_' + Date.now(),
                    name: cleanName,
                    date: new Date().toLocaleString(),
                    sizeKB: Math.max(1, Math.round((textContent.length * 1) / 1024)),
                    content: textContent
                };
                store.put(record);
                tx.oncomplete = () => resolve(record);
                tx.onerror = () => reject(tx.error);
            });
        }

        async function listMobileVault() {
            const db = await openVaultDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const req = tx.objectStore(STORE_NAME).getAll();
                req.onsuccess = () => {
                    const items = (req.result || []).sort((a, b) => (b.id > a.id ? 1 : -1));
                    resolve(items);
                };
                req.onerror = () => reject(req.error);
            });
        }

        async function deleteFromMobileVault(id) {
            const db = await openVaultDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).delete(id);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error);
            });
        }

        // --------------------------------------------------------------------
        // 2. PROTEGER BLOBS Y RETRASAR REVOCACIÓN (FIX CRÍTICO PARA SAFARI iOS)
        // --------------------------------------------------------------------
        const origCreateObjectURL = URL.createObjectURL.bind(URL);
        const origRevokeObjectURL = URL.revokeObjectURL.bind(URL);

        URL.createObjectURL = function(obj) {
            const url = origCreateObjectURL(obj);
            if (obj instanceof Blob) {
                blobRegistry.set(url, obj);
            }
            return url;
        };

        URL.revokeObjectURL = function(url) {
            if (blobRegistry.has(url)) {
                // Dar 60 segundos a Safari/Android para completar la lectura del archivo
                setTimeout(() => {
                    blobRegistry.delete(url);
                    try { origRevokeObjectURL(url); } catch (e) {}
                }, 60000);
                return;
            }
            return origRevokeObjectURL(url);
        };

        async function extractTextFromAnchor(anchor) {
            const href = anchor.getAttribute('href') || anchor.href || '';
            if (blobRegistry.has(href)) {
                return await blobRegistry.get(href).text();
            }
            if (href.startsWith('blob:') || href.startsWith('data:')) {
                const res = await fetch(href);
                return await res.text();
            }
            return null;
        }

        // --------------------------------------------------------------------
        // 3. INTERCEPTAR DESCARGA DE .spine EN MÓVILES (NO ALTERA PC)
        // --------------------------------------------------------------------
        const origAnchorClick = HTMLAnchorElement.prototype.click;
        let bypassAnchorHook = false;

        HTMLAnchorElement.prototype.click = function() {
            if (bypassAnchorHook) {
                return origAnchorClick.apply(this, arguments);
            }

            const dlName = (this.getAttribute('download') || this.download || '').trim();
            const isSpineFile = dlName.toLowerCase().endsWith('.spine') ||
                                dlName.toLowerCase().includes('.spine.');

            if (isSpineFile && isMobileDevice()) {
                const anchorEl = this;
                const finalName = dlName || `Estudio_SpinePlan_${Date.now()}.spine`;

                extractTextFromAnchor(anchorEl).then(async (textContent) => {
                    if (!textContent) {
                        triggerDirectDownload(anchorEl);
                        return;
                    }
                    let savedRecord = null;
                    try {
                        savedRecord = await saveToMobileVault(finalName, textContent);
                        updateVaultBadgeCount();
                    } catch (err) {
                        console.warn('No se pudo guardar en bóveda local:', err);
                    }
                    showMobileSaveSheet(finalName, textContent, savedRecord);
                }).catch(() => {
                    triggerDirectDownload(anchorEl);
                });
                return;
            }

            return origAnchorClick.apply(this, arguments);
        };

        function triggerDirectDownload(anchorOrBlob, filename) {
            try {
                let a;
                let createdUrl = null;
                if (anchorOrBlob instanceof HTMLAnchorElement) {
                    a = anchorOrBlob;
                } else {
                    createdUrl = origCreateObjectURL(anchorOrBlob);
                    a = document.createElement('a');
                    a.href = createdUrl;
                    a.download = filename || 'Estudio_SpinePlan.spine';
                }
                const wasInDom = document.body.contains(a);
                if (!wasInDom) {
                    a.style.display = 'none';
                    document.body.appendChild(a);
                }
                bypassAnchorHook = true;
                origAnchorClick.call(a);
                bypassAnchorHook = false;
                if (!wasInDom) {
                    setTimeout(() => a.remove(), 2000);
                }
                if (createdUrl) {
                    setTimeout(() => origRevokeObjectURL(createdUrl), 60000);
                }
            } catch (e) {
                bypassAnchorHook = false;
                console.warn('Error descarga directa:', e);
            }
        }

        async function shareOrSaveFileNative(filename, textContent) {
            const safeName = filename.toLowerCase().endsWith('.spine') ? filename : (filename + '.spine');
            const blob = new Blob([textContent], { type: 'application/json' });

            if (navigator.share) {
                // Intento 1: compartir como .spine nativo
                const spineFile = new File([textContent], safeName, { type: 'application/octet-stream' });
                if (!navigator.canShare || navigator.canShare({ files: [spineFile] })) {
                    try {
                        await navigator.share({
                            title: 'Estudio Editable SpinePlan Pro',
                            files: [spineFile]
                        });
                        return true;
                    } catch (err) {
                        if (err && err.name === 'AbortError') return false;
                    }
                }
                // Intento 2: iOS a veces exige extensión .json en el menú Compartir
                const jsonFile = new File([textContent], safeName + '.json', { type: 'application/json' });
                if (!navigator.canShare || navigator.canShare({ files: [jsonFile] })) {
                    try {
                        await navigator.share({
                            title: 'Estudio Editable SpinePlan Pro',
                            files: [jsonFile]
                        });
                        return true;
                    } catch (err) {
                        if (err && err.name === 'AbortError') return false;
                    }
                }
            }

            // Respaldo: descarga directa por navegador
            triggerDirectDownload(blob, safeName);
            return true;
        }

        // --------------------------------------------------------------------
        // 4. INTERCEPTAR <input type="file"> PARA DESBLOQUEAR .spine EN iOS/ANDROID
        //    Y PERMITIR REABRIR DIRECTO DESDE LA BÓVEDA DEL CELULAR
        // --------------------------------------------------------------------
        function tagProjectInputs() {
            const inputs = document.querySelectorAll('input[type="file"]');
            inputs.forEach(inp => {
                const acc = (inp.getAttribute('accept') || '').toLowerCase();
                const idCls = ((inp.id || '') + ' ' + (inp.className || '') + ' ' + (inp.getAttribute('onchange') || '')).toLowerCase();
                const isImageOnly = acc.includes('image') && !acc.includes('spine') && !acc.includes('json');

                if (!isImageOnly && (acc.includes('spine') || acc.includes('json') || idCls.includes('project') || idCls.includes('spine') || idCls.includes('study') || idCls.includes('load'))) {
                    inp.dataset.spineProjectInput = 'true';
                    // En iOS/Android quitar accept=".spine" evita que el archivo salga bloqueado en gris
                    if (isMobileDevice() && acc.includes('spine')) {
                        inp.removeAttribute('accept');
                    }
                }
            });
        }

        const origInputClick = HTMLInputElement.prototype.click;
        HTMLInputElement.prototype.click = function() {
            if (this.type === 'file') {
                // Si venimos de abrir un estudio desde la Bóveda del Celular, inyectarlo directo
                if (pendingVaultFile) {
                    const fileToInject = pendingVaultFile;
                    pendingVaultFile = null;
                    try {
                        const dt = new DataTransfer();
                        dt.items.add(fileToInject);
                        this.files = dt.files;
                        this.dispatchEvent(new Event('change', { bubbles: true }));
                        return;
                    } catch (e) {
                        console.warn('Error inyectando archivo desde bóveda:', e);
                    }
                }

                // Desbloquear extensión .spine en el selector de archivos móvil
                const acc = (this.getAttribute('accept') || '').toLowerCase();
                if (isMobileDevice() && acc.includes('spine')) {
                    this.dataset.spineProjectInput = 'true';
                    this.removeAttribute('accept');
                }
            }
            return origInputClick.apply(this, arguments);
        };

        function loadRecordIntoSpinePlan(record) {
            try {
                tagProjectInputs();
                const file = new File([record.content], record.name, { type: 'application/json' });

                // Opción A: Usar input[type="file"] ya existente del proyecto
                const existingInput = document.querySelector('input[type="file"][data-spine-project-input="true"]');
                if (existingInput) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    existingInput.files = dt.files;
                    existingInput.dispatchEvent(new Event('change', { bubbles: true }));
                    closeAllMobileVaultModals();
                    return true;
                }

                // Opción B: Pulsar internamente el botón "Abrir Estudio Guardado (.spine)" para que nuestro hook inyecte el archivo
                const openBtn = findModalButtonByText(['abrir estudio guardado', 'open saved', '.spine']);
                if (openBtn) {
                    pendingVaultFile = file;
                    openBtn.click();
                    setTimeout(() => { pendingVaultFile = null; }, 1500);
                    closeAllMobileVaultModals();
                    return true;
                }

                alert('No se encontró el cargador de estudios en esta pantalla. Abre primero el menú Guardar y Exportar.');
                return false;
            } catch (err) {
                console.warn('Error cargando estudio en SpinePlan:', err);
                return false;
            }
        }

        function findModalButtonByText(keywords) {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.find(b => {
                if (b.id && b.id.startsWith('sp-mobile-')) return false;
                const txt = (b.innerText || '').toLowerCase();
                return keywords.some(k => txt.includes(k)) && (txt.includes('abrir') || txt.includes('open'));
            });
        }

        // --------------------------------------------------------------------
        // 5. INTERFAZ VISUAL: HOJA DE GUARDADO MÓVIL + BÓVEDA DE ESTUDIOS
        // --------------------------------------------------------------------
        function closeAllMobileVaultModals() {
            const m1 = document.getElementById('sp-mobile-save-sheet');
            const m2 = document.getElementById('sp-mobile-vault-modal');
            if (m1) m1.remove();
            if (m2) m2.remove();
        }

        function showMobileSaveSheet(filename, textContent, savedRecord) {
            closeAllMobileVaultModals();
            const sizeKB = savedRecord ? savedRecord.sizeKB : Math.max(1, Math.round(textContent.length / 1024));

            const overlay = document.createElement('div');
            overlay.id = 'sp-mobile-save-sheet';
            overlay.style.zIndex = '2147483646';
            overlay.className = 'fixed inset-0 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm';
            overlay.innerHTML = `
                <div class="bg-gray-900 border border-purple-500 rounded-xl max-w-sm w-full p-4 space-y-3 text-xs text-gray-200 shadow-2xl" onclick="event.stopPropagation()">
                    <div class="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span class="text-purple-400 font-bold text-sm">📱 Guardar Estudio en Celular</span>
                        <button type="button" id="sp-mobile-sheet-x" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2 py-0.5 font-bold">&times;</button>
                    </div>
                    <div class="bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-2.5 text-[11px] text-emerald-200">
                        ✅ <strong>Guardado en el celular:</strong> El estudio <span class="text-white font-semibold">${filename}</span> (${sizeKB} KB) ya quedó respaldado en la bóveda local de tu teléfono para reabrirlo cuando quieras.
                    </div>
                    <p class="text-[11px] text-gray-400 leading-snug">
                        Si además deseas guardar el archivo físico en <strong>Archivos (iPhone)</strong>, <strong>Descargas</strong> o <strong>Google Drive</strong>, elige una opción:
                    </p>
                    <div class="space-y-2 pt-1">
                        <button type="button" id="sp-mobile-btn-share" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors">
                            📤 Guardar en Archivos / Drive / Compartir
                        </button>
                        <button type="button" id="sp-mobile-btn-dl" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors">
                            ⬇️ Descargar Archivo (.spine) al Teléfono
                        </button>
                        <button type="button" id="sp-mobile-btn-done" class="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-2 px-3 rounded-lg text-xs transition-colors">
                            Listo (Solo mantener en Bóveda Local)
                        </button>
                    </div>
                </div>
            `;

            overlay.addEventListener('click', () => overlay.remove());
            document.body.appendChild(overlay);

            document.getElementById('sp-mobile-sheet-x').onclick = () => overlay.remove();
            document.getElementById('sp-mobile-btn-done').onclick = () => overlay.remove();
            document.getElementById('sp-mobile-btn-share').onclick = async () => {
                await shareOrSaveFileNative(filename, textContent);
            };
            document.getElementById('sp-mobile-btn-dl').onclick = () => {
                const blob = new Blob([textContent], { type: 'application/octet-stream' });
                triggerDirectDownload(blob, filename);
            };
        }

        async function openMobileVaultModal() {
            closeAllMobileVaultModals();
            let items = [];
            try {
                items = await listMobileVault();
            } catch (e) {
                console.warn(e);
            }

            const overlay = document.createElement('div');
            overlay.id = 'sp-mobile-vault-modal';
            overlay.style.zIndex = '2147483646';
            overlay.className = 'fixed inset-0 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm';

            const listHtml = items.length === 0
                ? `<div class="bg-gray-800/60 border border-gray-700 rounded-lg p-4 text-center text-gray-400 text-[11px]">
                        Todavía no hay estudios guardados en la memoria local de este dispositivo.<br><br>
                        Toca <strong>💾 Descargar Estudio Editable (.spine)</strong> en tu celular para guardarlo aquí automáticamente.
                   </div>`
                : items.map(item => `
                    <div class="bg-gray-800/80 border border-gray-700 rounded-lg p-2.5 flex flex-col gap-2">
                        <div class="flex justify-between items-start gap-2">
                            <div class="min-w-0">
                                <div class="font-bold text-white text-xs truncate">🦴 ${item.name}</div>
                                <div class="text-[10px] text-gray-400">${item.date} • ${item.sizeKB} KB</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-1.5">
                            <button type="button" data-vault-open="${item.id}" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-1.5 px-2 rounded text-[11px]">📂 Abrir</button>
                            <button type="button" data-vault-share="${item.id}" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 px-2 rounded text-[11px]">📤 Archivo</button>
                            <button type="button" data-vault-del="${item.id}" class="bg-red-900/70 hover:bg-red-700 text-red-200 font-bold py-1.5 px-2 rounded text-[11px]">🗑️ Borrar</button>
                        </div>
                    </div>
                `).join('');

            overlay.innerHTML = `
                <div class="bg-gray-900 border border-sky-500 rounded-xl max-w-md w-full max-h-[85vh] flex flex-col text-xs text-gray-200 shadow-2xl overflow-hidden" onclick="event.stopPropagation()">
                    <div class="flex justify-between items-center bg-gray-950 px-4 py-3 border-b border-gray-800">
                        <span class="text-sky-400 font-bold text-sm">📱 Estudios Guardados en el Dispositivo</span>
                        <button type="button" id="sp-vault-close-x" class="text-gray-400 hover:text-white bg-gray-800 rounded px-2.5 py-1 font-bold">&times;</button>
                    </div>
                    <div class="p-3.5 overflow-y-auto space-y-2.5 flex-1">
                        ${listHtml}
                    </div>
                    <div class="bg-gray-950 px-4 py-2.5 border-t border-gray-800 flex justify-between items-center">
                        <span class="text-[10px] text-gray-400">100% local en tu dispositivo (privado)</span>
                        <button type="button" id="sp-vault-close-btn" class="bg-gray-800 hover:bg-gray-700 text-white font-bold px-3.5 py-1.5 rounded text-xs">Cerrar</button>
                    </div>
                </div>
            `;

            overlay.addEventListener('click', () => overlay.remove());
            document.body.appendChild(overlay);

            document.getElementById('sp-vault-close-x').onclick = () => overlay.remove();
            document.getElementById('sp-vault-close-btn').onclick = () => overlay.remove();

            overlay.querySelectorAll('[data-vault-open]').forEach(btn => {
                btn.onclick = () => {
                    const rec = items.find(i => i.id === btn.getAttribute('data-vault-open'));
                    if (rec) loadRecordIntoSpinePlan(rec);
                };
            });

            overlay.querySelectorAll('[data-vault-share]').forEach(btn => {
                btn.onclick = async () => {
                    const rec = items.find(i => i.id === btn.getAttribute('data-vault-share'));
                    if (rec) await shareOrSaveFileNative(rec.name, rec.content);
                };
            });

            overlay.querySelectorAll('[data-vault-del]').forEach(btn => {
                btn.onclick = async () => {
                    const id = btn.getAttribute('data-vault-del');
                    await deleteFromMobileVault(id);
                    updateVaultBadgeCount();
                    openMobileVaultModal();
                };
            });
        }

        // --------------------------------------------------------------------
        // 6. INYECTAR BOTÓN DE BÓVEDA DENTRO DEL MODAL "GUARDAR Y EXPORTAR"
        // --------------------------------------------------------------------
        async function updateVaultBadgeCount() {
            const btn = document.getElementById('sp-mobile-vault-trigger');
            if (!btn) return;
            try {
                const items = await listMobileVault();
                btn.innerText = `📱 Estudios en Memoria del Celular (${items.length})`;
            } catch (e) {}
        }

        function injectMobileVaultButtonInExportModal() {
            tagProjectInputs();
            if (document.getElementById('sp-mobile-vault-trigger')) {
                updateVaultBadgeCount();
                return;
            }

            const openBtn = findModalButtonByText(['abrir estudio guardado', 'open saved', '.spine']);
            if (!openBtn || !openBtn.parentNode) return;

            const vaultBtn = document.createElement('button');
            vaultBtn.id = 'sp-mobile-vault-trigger';
            vaultBtn.type = 'button';
            vaultBtn.className = 'w-full mt-2 bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors border border-indigo-400/50 flex items-center justify-center gap-1.5';
            vaultBtn.innerText = '📱 Estudios en Memoria del Celular';
            vaultBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openMobileVaultModal();
            });

            openBtn.parentNode.insertBefore(vaultBtn, openBtn.nextSibling);
            updateVaultBadgeCount();
        }

        document.addEventListener('click', function() {
            setTimeout(injectMobileVaultButtonInExportModal, 120);
        });

        window.addEventListener('load', function() {
            tagProjectInputs();
            injectMobileVaultButtonInExportModal();
        });
    } catch (err) {
        console.warn('Módulo guardado móvil:', err);
    }
})();
