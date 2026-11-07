// ============================================================================
// ACTUALIZACIÓN 5 (ayuda_contextual.js): AYUDA CONTEXTUAL INTELIGENTE + LEYENDA (❓)
// Detecta la herramienta activa para explicar cómo medir y muestra la guía de iconos
// ============================================================================

(function() {
    window._lastToolContext = null;

    // 1. BASE DE DATOS BILINGÜE DE HERRAMIENTAS CLÍNICAS (MODO CONTEXTUAL)
    const TOOL_GUIDES = {
        es: {
            calibrate: {
                name: "📏 Calibración Radiográfica (Testigo Métrico)",
                badge: "Módulo 1 • Escala Real (cm / mm)",
                steps: [
                    "Haz clic en el **extremo inicial** de la regla o testigo radiográfico visible en la placa.",
                    "Haz clic en el **extremo final** del segmento conocido (ej. 5 cm o 10 cm).",
                    "Ingresa la medida real en centímetros cuando el programa te lo solicite."
                ],
                tip: "Una vez calibrada la placa, el SVA, el largo de las barras y la longitud de cada tornillo transpedicular se calculan automáticamente en centímetros reales."
            },
            pelvis: {
                name: "🦴 Parámetros Pélvicos (PI, PT, SS) y Base S1",
                badge: "Módulo 2 • Base Espinopélvica",
                steps: [
                    "**Puntos 1 y 2 (Cabezas Femorales):** Haz clic en el centro de cada cabeza femoral (si se ven las dos, marca ambas; si están superpuestas, marca el centro bicoxofemoral dos veces).",
                    "**Punto 3 (Borde Anterior de S1):** Haz clic en la esquina anterosuperior del platillo sacro (promontorio de S1).",
                    "**Punto 4 (Borde Posterior de S1):** Haz clic en la esquina posterosuperior del platillo de S1."
                ],
                tip: "Este trazo es la llave maestra del programa: calcula PI, PT y SS al instante y habilita el cálculo automático de L1-PA, T4-PA, Global Tilt (GT) y GAP Score."
            },
            cobb: {
                name: "📐 Ángulos de Cobb Sagitales (Lordosis / Cifosis)",
                badge: "Módulos 3, 4 y 5 • Curvas Sagitales",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior):** Haz clic en el borde anterior y posterior del platillo vertebral superior del segmento (ej. L1, L4, T4 o C2).",
                    "**Puntos 3 y 4 (Platillo Inferior):** Haz clic en el borde anterior y posterior del platillo vertebral inferior del segmento (ej. S1, L5, T12 o C7)."
                ],
                tip: "Si necesitas corregir la inclinación de una línea después de medir, solo arrastra cualquiera de sus extremos con el mouse o el dedo. Para L1-S1 y L4-S1 recuerda respetar los títulos exactos para alimentar el GAP Score."
            },
            pa: {
                name: "🎯 Ángulos Proporcionales (L1-PA / T4-PA)",
                badge: "Módulo 3 y 4 • Alineación Proporcional",
                steps: [
                    "**Requisito previo:** Debes haber medido primero la **Pelvis (PI/PT/SS)** para que el programa conozca el centro de S1 y las cabezas femorales.",
                    "**Un solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de L1** (para L1-PA) o en el **centro del cuerpo vertebral de T4** (para T4-PA)."
                ],
                tip: "El programa unirá automáticamente la vértebra con el centro del platillo de S1 y el eje bicoxofemoral, calculando también el Mismatch (T4-PA menos L1-PA) en la tabla."
            },
            tilt: {
                name: "🧭 Inclinación Vertebral Sagital (C2 Tilt / C7 Tilt)",
                badge: "Módulo 4 y 5 • Inclinación Global y Cervical",
                steps: [
                    "**Punto 1:** Haz clic en el centro o borde inferior de la vértebra superior (ej. odontoides/cuerpo de C2 o C7).",
                    "**Punto 2:** Haz clic en el punto de referencia inferior (o platillo de S1 según el parámetro seleccionado) para medir su desviación angular respecto a la vertical."
                ],
                tip: "El C2 Tilt y el Global Tilt (GT) no dependen de la calibración en centímetros y reflejan de inmediato el cierre de las osteotomías de Schwab."
            },
            sva: {
                name: "📏 Plomada Sagital (SVA / cSVA)",
                badge: "Módulo 4 y 5 • Balance Sagital Traslacional",
                steps: [
                    "**Punto 1 (Plomada Superior):** Haz clic en el **centro del cuerpo de C7** (para SVA global) o en el **centro de C2** (para cSVA cervical).",
                    "**Punto 2 (Referencia Posterosuperior):** Haz clic en la **esquina posterosuperior del platillo de S1** (para SVA) o en la esquina posterosuperior de C7 (para cSVA)."
                ],
                tip: "Si calibraste previamente la radiografía con el testigo métrico, la distancia horizontal se mostrará directamente en centímetros (cm)."
            },
            cobb_coronal: {
                name: "📐 Ángulo de Cobb Coronal (Escoliosis AP)",
                badge: "Módulo 6 • Plano Coronal (AP)",
                steps: [
                    "**Puntos 1 y 2 (Vértebra Límite Superior - UIV):** Marca los bordes izquierdo y derecho del platillo superior de la vértebra más inclinada cranealmente.",
                    "**Puntos 3 y 4 (Vértebra Límite Inferior - LIV):** Marca los bordes izquierdo y derecho del platillo inferior de la vértebra más inclinada caudalmente."
                ],
                tip: "Cuando traces las Barras Coronales AP y muevas el control de Reducción de Escoliosis (0-100%), este ángulo de Cobb se reducirá en vivo acompañando el enderezamiento de la columna."
            },
            point_marker: {
                name: "📍 Balance Coronal (C7 - CSVL)",
                badge: "Módulo 6 • Plomada Coronal AP",
                steps: [
                    "**Marcador C7:** Selecciona el botón de C7 y haz clic en el centro del proceso espinoso/cuerpo de C7 en la radiografía AP.",
                    "**Marcador S1 (CSVL):** Selecciona el botón de S1 y haz clic en el centro del sacro (Línea Vertical Centro-Sacra)."
                ],
                tip: "El programa traza ambas líneas verticales y calcula el desplazamiento coronal entre C7 y la línea media sacra."
            },
            osteotomy: {
                name: "✂️ Osteotomía Correctiva de Schwab (Grados 1 al 6)",
                badge: "Módulo 7 • Simulación Quirúrgica Sagital",
                steps: [
                    "**Punto 1 (Corte Superior):** Haz clic en la cortical anterior del cuerpo vertebral (borde superior de la cuña).",
                    "**Punto 2 (Ápex / Bisagra Posterior):** Haz clic en el muro vertebral posterior (vértice del triángulo de osteotomía).",
                    "**Punto 3 (Corte Inferior):** Haz clic más abajo en la cortical anterior para definir la apertura de la cuña."
                ],
                tip: "Puedes colocar múltiples osteotomías. Usa '⚙️ 3. Ajustar Grados' para elegir un Grado de Schwab (1 a 6) o mover los grados con el deslizador, y toca '✂️ 2. Simular Cierre' para ver cómo rota toda la columna, los tornillos y la tabla de resultados."
            },
            rod_sagittal: {
                name: "🔩 Barra y Tornillos Transpediculares Sagitales",
                badge: "Módulo 7B • Instrumentación en Perfil",
                steps: [
                    "**Colocar tornillos:** Haz clic en cada pedículo vertebral siguiendo tu construcción (ej. desde S1 hacia arriba).",
                    "**Terminar la barra:** Haz **doble clic en el último tornillo** (o vuelve a tocar el botón verde '✅ Terminar Barra Actual').",
                    "**Medir longitud del tornillo (cm):** Una vez cerrada la barra, arrastra el **punto amarillo de la punta de cualquier tornillo** hasta la cortical anterior vertebral."
                ],
                tip: "Puedes alargar e inclinar cada tornillo individualmente (ideal para dirigir S1 al promontorio o simular tornillos ilíacos). Al cerrar osteotomías, los tornillos y la barra giran solidarios con la columna."
            },
            rod_coronal: {
                name: "🔩 Barras Coronales AP y Reducción de Escoliosis",
                badge: "Módulo 7B • Instrumentación AP (2 Lados)",
                steps: [
                    "**Primera Barra (ej. Izquierda):** Haz clic en cada pedículo de un lado de la curva y haz **doble clic en el último tornillo** para terminar esa barra.",
                    "**Segunda Barra (ej. Derecha):** Vuelve a tocar el botón '🔩 2. Barras Coronales' y marca los pedículos del lado contrario, cerrando con doble clic.",
                    "**Simular Corrección:** En el panel morado que se abre, desliza **'Reducción a la Barra y Desrotación (0% a 100%)'**."
                ],
                tip: "Al deslizar el porcentaje de reducción, las barras se enderezan, la radiografía AP se alinea en vivo y el cuadro te muestra el pronóstico de corrección del Cobb Coronal y la desrotación apical estimada."
            }
        },
        en: {
            calibrate: {
                name: "📏 Radiographic Calibration (Metric Marker)",
                badge: "Module 1 • Real Scale (cm / mm)",
                steps: [
                    "Click the **start point** of the calibration ruler or marker visible on the X-Ray.",
                    "Click the **end point** of the known distance (e.g., 5 cm or 10 cm).",
                    "Enter the real length in centimeters when prompted."
                ],
                tip: "Once calibrated, SVA, rod lengths, and pedicle screw lengths are automatically calculated in real centimeters."
            },
            pelvis: {
                name: "🦴 Pelvic Parameters (PI, PT, SS) & S1 Base",
                badge: "Module 2 • Spinopelvic Foundation",
                steps: [
                    "**Points 1 & 2 (Femoral Heads):** Click the center of each femoral head (click twice on the center if overlapped).",
                    "**Point 3 (Anterior S1):** Click the anterosuperior corner of the S1 endplate (sacral promontory).",
                    "**Point 4 (Posterior S1):** Click the posterosuperior corner of the S1 endplate."
                ],
                tip: "This measurement unlocks automatic calculations for PI, PT, SS, L1-PA, T4-PA, Global Tilt (GT), and GAP Score."
            },
            cobb: {
                name: "📐 Sagittal Cobb Angles (Lordosis / Kyphosis)",
                badge: "Modules 3, 4 & 5 • Sagittal Curves",
                steps: [
                    "**Points 1 & 2 (Superior Endplate):** Click the anterior and posterior borders of the upper endplate.",
                    "**Points 3 & 4 (Inferior Endplate):** Click the anterior and posterior borders of the lower endplate."
                ],
                tip: "Drag any point later to fine-tune the angle. Keep default titles for L1-S1 and L4-S1 to feed the GAP Score table."
            },
            pa: {
                name: "🎯 Proportional Angles (L1-PA / T4-PA)",
                badge: "Modules 3 & 4 • Proportional Alignment",
                steps: [
                    "**Prerequisite:** Measure the **Pelvis (PI/PT/SS)** first so S1 and the femoral heads are registered.",
                    "**Single Click:** Click directly on the **center of the L1 vertebral body** (for L1-PA) or **T4 vertebral body** (for T4-PA)."
                ],
                tip: "Automatically connects to the S1 center and bicoxofemoral axis, computing the T4-L1 Mismatch in the table."
            },
            tilt: {
                name: "🧭 Sagittal Vertebral Tilt (C2 Tilt / C7 Tilt)",
                badge: "Modules 4 & 5 • Global & Cervical Tilt",
                steps: [
                    "**Point 1:** Click the center/inferior border of the upper vertebra (C2 or C7).",
                    "**Point 2:** Click the lower reference point to measure inclination against the vertical axis."
                ],
                tip: "Scale-free angular parameter that updates live during Schwab osteotomy closure."
            },
            sva: {
                name: "📏 Sagittal Plumbline (SVA / cSVA)",
                badge: "Modules 4 & 5 • Translational Balance",
                steps: [
                    "**Point 1:** Click the **center of C7** (for SVA) or **C2** (for cSVA).",
                    "**Point 2:** Click the **posterosuperior corner of S1** (for SVA) or C7 (for cSVA)."
                ],
                tip: "Displays real centimeters (cm) once the X-Ray is calibrated."
            },
            cobb_coronal: {
                name: "📐 Coronal Cobb Angle (AP Scoliosis)",
                badge: "Module 6 • Coronal Plane (AP)",
                steps: [
                    "**Points 1 & 2 (Upper End Vertebra):** Click the left and right borders of the upper endplate.",
                    "**Points 3 & 4 (Lower End Vertebra):** Click the left and right borders of the lower endplate."
                ],
                tip: "Dynamically reduces in real time when you use the AP Coronal Rod Reduction slider (0-100%)."
            },
            point_marker: {
                name: "📍 Coronal Balance (C7 - CSVL)",
                badge: "Module 6 • AP Coronal Plumbline",
                steps: [
                    "**C7 Marker:** Click the center of C7 on the AP radiograph.",
                    "**S1 Marker (CSVL):** Click the center of S1 (Center Sacral Vertical Line)."
                ],
                tip: "Calculates the horizontal offset between the C7 plumbline and the sacral midline."
            },
            osteotomy: {
                name: "✂️ Schwab Corrective Osteotomy (Grades 1 to 6)",
                badge: "Module 7 • Sagittal Surgical Simulation",
                steps: [
                    "**Point 1 (Upper Cut):** Click the anterior vertebral cortex at the upper edge of the wedge.",
                    "**Point 2 (Apex / Hinge):** Click the posterior vertebral wall (hinge point).",
                    "**Point 3 (Lower Cut):** Click the anterior cortex below Point 1 to set the wedge angle."
                ],
                tip: "Use '⚙️ 3. Adjust Degrees' to set Schwab Grades 1-6, and toggle '✂️ 2. Simulate Wedge Closure' to fold the X-Ray, screws, and alignment parameters."
            },
            rod_sagittal: {
                name: "🔩 Sagittal Pedicle Screws & Rod",
                badge: "Module 7B • Profile Construct",
                steps: [
                    "**Place Screws:** Click each vertebral pedicle along your planned levels.",
                    "**Finish Rod:** **Double-click the last screw** (or click the green Finish button).",
                    "**Size Screw Length (cm):** Drag the **yellow tip** of any screw to the anterior vertebral cortex to measure its length in cm."
                ],
                tip: "You can angle and stretch each screw tip independently. Screws and rods rotate automatically when osteotomies are closed."
            },
            rod_coronal: {
                name: "🔩 Coronal AP Rods & Scoliosis Reduction",
                badge: "Module 7B • Bilateral AP Construct",
                steps: [
                    "**First Rod:** Click each pedicle on one side and **double-click the last screw** to finish.",
                    "**Second Rod:** Click '🔩 2. Coronal Rods' again and trace the contralateral pedicles, finishing with a double-click.",
                    "**Simulate Reduction:** Use the **'Rod Translation & Derotation (0-100%)'** slider in the purple panel."
                ],
                tip: "Straightens both rods, warps the AP radiograph into alignment, and calculates post-reduction Cobb and apical derotation."
            }
        }
    };

    // 2. DETECTAR QUÉ CLAVE DE HERRAMIENTA CORRESPONDE AL ESTADO ACTUAL
    function resolveCurrentToolKey(tool, subType) {
        if (!tool) return null;
        if (tool === 'rod') return subType === 'coronal' ? 'rod_coronal' : 'rod_sagittal';
        if (TOOL_GUIDES.es[tool]) return tool;
        return null;
    }

    // Interceptar activateTool sin alterar su funcionamiento para recordar siempre qué tocó el usuario
    if (typeof activateTool === 'function') {
        const origActivate = activateTool;
        activateTool = function(tool, title, subType) {
            window._lastToolContext = {
                key: resolveCurrentToolKey(tool, subType),
                tool: tool,
                title: title || '',
                subType: subType || ''
            };
            const res = origActivate.apply(this, arguments);
            updateHelpButtonBadge();
            return res;
        };
    }

    if (typeof deactivateTool === 'function') {
        const origDeactivate = deactivateTool;
        deactivateTool = function() {
            const res = origDeactivate.apply(this, arguments);
            updateHelpButtonBadge();
            return res;
        };
    }

    function updateHelpButtonBadge() {
        const btn = document.getElementById('btn-top-help');
        if (!btn) return;
        const isToolActive = (typeof activeTool !== 'undefined' && activeTool !== null);
        if (isToolActive) {
            btn.className = "bg-amber-500 hover:bg-amber-400 text-gray-950 border border-amber-300 px-2 py-1 rounded-md text-xs font-extrabold transition-all flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse select-none";
        } else {
            btn.className = "bg-sky-600/25 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/60 px-2 py-1 rounded-md text-xs font-bold transition-colors flex items-center justify-center shadow-sm select-none";
        }
    }

    // 3. INYECTAR BOTÓN ❓ EN LA FILA SUPERIOR (AL LADO DEL IDIOMA) PARA NO APRETAR LOS 11 ICONOS EN CELULAR
    function injectHelpButton() {
        if (document.getElementById('btn-top-help')) return;

        const btnHelp = document.createElement('button');
        btnHelp.id = 'btn-top-help';
        btnHelp.type = 'button';
        btnHelp.innerHTML = '❓';
        btnHelp.title = (typeof currentLang !== 'undefined' && currentLang === 'es')
            ? 'Ayuda Contextual de la Herramienta Activa / Leyenda de Iconos'
            : 'Contextual Tool Help & Icon Legend';

        btnHelp.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openContextualHelpModal();
        });

        // Colocar en la fila superior justo a la izquierda del selector de idioma (EN/ES)
        const langSel = document.getElementById('lang-select') || document.querySelector('select[onchange*="setLanguage"]');
        if (langSel && langSel.parentNode) {
            langSel.parentNode.insertBefore(btnHelp, langSel);
        } else {
            const btnSave = document.querySelector('button[onclick="openSaveModal()"]');
            if (btnSave && btnSave.parentNode) {
                btnSave.parentNode.insertBefore(btnHelp, btnSave.parentNode.firstChild);
            }
        }
        updateHelpButtonBadge();
    }

    // 4. CREAR VENTANA MODAL DE AYUDA CONTEXTUAL Y LEYENDA POR PESTAÑAS
    const helpModal = document.createElement('div');
    helpModal.id = 'help-context-modal';
    helpModal.className = 'hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm';
    helpModal.innerHTML = `
        <div class="bg-gray-900 border border-sky-500 rounded-xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-xs text-gray-200" onclick="event.stopPropagation()">
            <div class="flex justify-between items-center bg-gray-950 px-4 py-3 border-b border-gray-800">
                <div class="flex items-center space-x-2">
                    <span class="text-base">❓</span>
                    <h3 id="help-modal-title" class="text-sky-400 font-bold text-sm">Centro de Ayuda y Guía Clínica</h3>
                </div>
                <button onclick="document.getElementById('help-context-modal').classList.add('hidden')" class="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded px-2.5 py-1 text-xs font-bold">&times;</button>
            </div>
            <div class="grid grid-cols-3 gap-1 bg-gray-950/70 px-3 pt-2 border-b border-gray-800">
                <button id="tab-btn-ctx" onclick="switchHelpTab('ctx')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">🎯 Herramienta</button>
                <button id="tab-btn-ico" onclick="switchHelpTab('ico')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">🎛️ Iconos (11)</button>
                <button id="tab-btn-mod" onclick="switchHelpTab('mod')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">📚 Módulos</button>
            </div>
            <div id="help-modal-content" class="p-4 overflow-y-auto space-y-3 flex-1"></div>
            <div class="bg-gray-950 px-4 py-2.5 border-t border-gray-800 flex justify-between items-center">
                <span id="help-footer-hint" class="text-[10px] text-gray-400">Tip: Selecciona cualquier herramienta y toca ❓ para ver qué marcar.</span>
                <button onclick="document.getElementById('help-context-modal').classList.add('hidden')" id="help-close-btn" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors">Entendido</button>
            </div>
        </div>
    `;
    helpModal.addEventListener('click', function() {
        helpModal.classList.add('hidden');
    });
    document.body.appendChild(helpModal);

    // 5. RENDERIZADO DE LAS 3 PESTAÑAS (HERRAMIENTA ACTIVA / ICONOS / MÓDULOS)
    window.openContextualHelpModal = function() {
        const isActiveNow = (typeof activeTool !== 'undefined' && activeTool !== null);
        if (isActiveNow) {
            window._lastToolContext = {
                key: resolveCurrentToolKey(activeTool, typeof activeSubType !== 'undefined' ? activeSubType : ''),
                tool: activeTool,
                title: (typeof activeTitle !== 'undefined' && activeTitle) ? activeTitle : '',
                subType: (typeof activeSubType !== 'undefined' && activeSubType) ? activeSubType : ''
            };
            switchHelpTab('ctx');
        } else if (window._lastToolContext && window._lastToolContext.key) {
            switchHelpTab('ctx');
        } else {
            switchHelpTab('ico');
        }
        document.getElementById('help-context-modal').classList.remove('hidden');
    };

    window.selectToolGuideFromList = function(key) {
        window._lastToolContext = { key: key, tool: key, title: '', subType: '' };
        switchHelpTab('ctx');
    };

    window.switchHelpTab = function(tab) {
        const isEs = (typeof currentLang === 'undefined' || currentLang === 'es');
        const langKey = isEs ? 'es' : 'en';

        document.getElementById('help-modal-title').innerText = isEs ? 'Centro de Ayuda y Guía Clínica' : 'Clinical Help & Quick Guide';
        document.getElementById('tab-btn-ctx').innerText = isEs ? '🎯 Herramienta' : '🎯 Active Tool';
        document.getElementById('tab-btn-ico').innerText = isEs ? '🎛️ Iconos' : '🎛️ Icons';
        document.getElementById('tab-btn-mod').innerText = isEs ? '📚 Módulos' : '📚 Modules';
        document.getElementById('help-footer-hint').innerText = isEs
            ? 'Selecciona cualquier botón del menú y toca ❓ para ver los pasos.'
            : 'Select any tool button and tap ❓ for step-by-step guidance.';
        document.getElementById('help-close-btn').innerText = isEs ? 'Continuar' : 'Got it';

        ['ctx', 'ico', 'mod'].forEach(t => {
            const b = document.getElementById(`tab-btn-${t}`);
            if (b) {
                b.className = (t === tab)
                    ? "py-2 px-2 rounded-t-lg font-bold text-[11px] bg-gray-900 text-sky-400 border-b-2 border-sky-400"
                    : "py-2 px-2 rounded-t-lg font-semibold text-[11px] text-gray-400 hover:text-gray-200 border-b-2 border-transparent";
            }
        });

        const box = document.getElementById('help-modal-content');
        if (tab === 'ctx') {
            const isNow = (typeof activeTool !== 'undefined' && activeTool !== null);
            const ctxKey = isNow
                ? resolveCurrentToolKey(activeTool, typeof activeSubType !== 'undefined' ? activeSubType : '')
                : (window._lastToolContext ? window._lastToolContext.key : null);
            const g = ctxKey ? TOOL_GUIDES[langKey][ctxKey] : null;
            const activeParamTitle = (isNow && typeof activeTitle !== 'undefined' && activeTitle)
                ? activeTitle
                : (window._lastToolContext?.title || '');

            let html = '';
            if (g) {
                const statusBadge = isNow
                    ? (isEs ? `🟢 HERRAMIENTA ACTIVA AHORA${activeParamTitle ? ': ' + activeParamTitle : ''}` : `🟢 CURRENTLY ACTIVE TOOL${activeParamTitle ? ': ' + activeParamTitle : ''}`)
                    : (isEs ? `🕒 ÚLTIMA HERRAMIENTA CONSULTADA${activeParamTitle ? ': ' + activeParamTitle : ''}` : `🕒 LAST SELECTED TOOL${activeParamTitle ? ': ' + activeParamTitle : ''}`);
                const badgeCls = isNow ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/60" : "bg-amber-900/50 text-amber-300 border-amber-500/50";

                html += `
                    <div class="bg-gray-800/80 border border-sky-500/60 rounded-lg p-3.5 space-y-2.5 shadow-lg">
                        <div class="flex flex-wrap justify-between items-center gap-1">
                            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded border ${badgeCls}">${statusBadge}</span>
                            <span class="text-[10px] text-sky-300 font-semibold">${g.badge}</span>
                        </div>
                        <h4 class="text-sm font-bold text-white">${g.name}</h4>
                        <div class="space-y-1.5 pt-1 border-t border-gray-700">
                            <div class="text-[10px] font-bold uppercase text-sky-400">${isEs ? 'Pasos Anatómicos a Marcar:' : 'Anatomical Steps:'}</div>
                            <ol class="list-decimal list-inside space-y-1.5 text-gray-200 leading-relaxed">
                                ${g.steps.map(s => `<li>${s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}</li>`).join('')}
                            </ol>
                        </div>
                        <div class="bg-sky-950/50 border border-sky-700/60 rounded p-2.5 text-[11px] text-sky-200">
                            <strong class="text-sky-400">💡 ${isEs ? 'Truco Clínico / Edición:' : 'Clinical & Editing Tip:'}</strong> ${g.tip}
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="bg-gray-800/60 border border-gray-700 rounded-lg p-3.5 text-center space-y-1">
                        <div class="text-base">👆</div>
                        <div class="font-bold text-white">${isEs ? 'Ninguna herramienta seleccionada en este momento' : 'No measurement tool currently active'}</div>
                        <p class="text-[11px] text-gray-400">${isEs ? 'Toca cualquier herramienta en el menú lateral y luego presiona ❓, o elige una de la lista inferior para ver cómo se mide:' : 'Click any tool in the sidebar and tap ❓, or choose one below to see how it works:'}</p>
                    </div>
                `;
            }

            // Selector rápido de todas las herramientas por si el usuario quiere consultar otra ahí mismo
            html += `
                <div class="pt-1">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1.5">${isEs ? 'Consultar guía rápida de otra herramienta:' : 'Browse guide for any tool:'}</div>
                    <div class="grid grid-cols-2 gap-1.5">
                        ${Object.keys(TOOL_GUIDES[langKey]).map(k => `
                            <button onclick="selectToolGuideFromList('${k}')" class="text-left px-2.5 py-1.5 rounded border ${k === ctxKey ? 'bg-sky-900/50 border-sky-400 text-white font-bold' : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-800'} text-[11px] truncate">
                                ${TOOL_GUIDES[langKey][k].name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
            box.innerHTML = html;

        } else if (tab === 'ico') {
            const icons = isEs ? [
                ['👤', 'Ficha del Paciente', 'Abre la ventana para registrar Nombre, Cédula/ID y Edad (se sincronizan automáticamente con el Reporte PDF).'],
                ['➡️ / ⬅️', 'Dirección de la Mirada', 'Cambia hacia dónde mira el paciente en la radiografía lateral (Derecha ➡️ o Izquierda ⬅️) para orientar osteotomías y tornillos.'],
                ['📤', 'Cargar Radiografía (Rx)', 'Sube la imagen radiográfica desde tu celular, tablet o computadora para la etapa actual (Pre-Op o Post-Op).'],
                ['🔆', 'Visor Radiológico (Brillo/Contraste)', 'Ajusta en vivo el brillo, el contraste y el Modo Negativo (compatible con iPhone, iPad, Android y PC).'],
                ['🔍', 'Lupa Quirúrgica Flotante', 'Activa una lupa de alta precisión que flota sobre tu dedo en el celular para marcar platillos y pedículos con exactitud.'],
                ['👁️ / 🙈', 'Ver Radiografía Limpia', 'Oculta temporalmente todas las líneas, ángulos y tornillos para apreciar la radiografía limpia sin borrar nada.'],
                ['🔓 / 🔒', 'Candado de Bloqueo Táctil', 'En rojo (🔒) congela todos los puntos, líneas y resultados para que puedas hacer Zoom y mover la imagen sin desconfigurar nada.'],
                ['💾', 'Guardar y Exportar Estudio', 'Descarga la imagen medida (.PNG) o guarda/abre el archivo editable del proyecto para continuar en otro momento.'],
                ['📄', 'Reporte Quirúrgico (PDF)', 'Genera la hoja clínica formal tamaño Carta con tabla comparativa, osteotomías, tornillos, justificación para ARS y firma médica.'],
                ['🧹', 'Limpiar Etapa Actual', 'Borra únicamente las mediciones de la vista actual (Pre-Op o Post-Op) manteniendo la radiografía cargada.'],
                ['🗑️', 'Reiniciar Todo el Estudio', 'Limpia por completo el programa (Pre-Op, Post-Op y datos) para comenzar con un paciente nuevo.']
            ] : [
                ['👤', 'Patient Information', 'Enter Patient Name, ID, and Age (automatically synced with the Surgical PDF Report).'],
                ['➡️ / ⬅️', 'Patient Gaze Direction', 'Toggle patient facing direction (Right ➡️ or Left ⬅️) to properly orient osteotomies and pedicle screws.'],
                ['📤', 'Load Radiograph (Rx)', 'Upload an X-Ray image from your phone, tablet, or computer into Pre-Op or Post-Op.'],
                ['🔆', 'X-Ray Brightness & Contrast', 'Adjust brightness, contrast, and Negative Mode in real time across mobile and desktop.'],
                ['🔍', 'Floating Precision Loupe', 'Enables a magnifying loupe that floats above your finger on mobile screens for pinpoint accuracy.'],
                ['👁️ / 🙈', 'Clean X-Ray View', 'Temporarily hides all lines, text, and implants to inspect the clean radiograph without losing data.'],
                ['🔓 / 🔒', 'Tactile Lock', 'When locked (🔒), freezes all points and labels so you can safely pan and pinch-to-zoom.'],
                ['💾', 'Save & Export Study', 'Export high-res PNG images or save/load editable project files.'],
                ['📄', 'Surgical Report (PDF)', 'Generates a formal Letter-size clinical report with spinopelvic tables, implants, surgical notes, and signature.'],
                ['🧹', 'Clear Current Traces', 'Clears measurements on the active stage while keeping the X-Ray loaded.'],
                ['🗑️', 'Reset Entire Study', 'Resets both stages and patient data to start a new case.']
            ];

            box.innerHTML = `
                <div class="space-y-2">
                    ${icons.map(([ico, title, desc]) => `
                        <div class="flex items-start space-x-3 bg-gray-800/60 border border-gray-700/80 rounded-lg p-2.5">
                            <div class="text-base bg-gray-900 border border-gray-700 rounded px-2 py-1 shrink-0 font-bold">${ico}</div>
                            <div>
                                <div class="font-bold text-white text-xs">${title}</div>
                                <div class="text-[11px] text-gray-300 leading-snug mt-0.5">${desc}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tab === 'mod') {
            const mods = isEs ? [
                ['Módulo 1 • Calibración', 'Usa una referencia conocida en la placa para que el SVA, las barras y el largo de los tornillos se expresen en centímetros (cm).'],
                ['Módulo 2 • Pelvis (PI, PT, SS)', 'Mide siempre primero la pelvis (cabezas femorales + platillo de S1). Es la base automática para calcular L1-PA, T4-PA, Global Tilt (GT) y el GAP Score.'],
                ['Módulos 3, 4 y 5 • Regional, Global y Cervical', 'Traza L1-S1, L4-S1, L4-L5, T4-T12, L1-PA, T4-PA, C2 Tilt y SVA. Puedes arrastrar cualquier etiqueta de texto para acomodarla y hacer clic derecho sobre una medición para cambiar el tamaño de letra o eliminarla.'],
                ['Módulo 6 • Plano Coronal (AP)', 'Mide los ángulos de Cobb coronales y la plomada C7-CSVL para cuantificar escoliosis y desbalance coronal.'],
                ['Módulo 7 • Osteotomías de Schwab (1 a 6)', 'Marca 3 puntos sobre el cuerpo vertebral (anterior-superior, bisagra posterior, anterior-inferior). Elige el grado de Schwab (1 al 6) y activa la simulación para plegar la columna en vivo.'],
                ['Módulo 7B • Tornillos (cm) y Barras Sagital/AP', 'En vista sagital, marca los pedículos, cierra con doble clic y estira la punta amarilla de cada tornillo para medir su longitud en cm. En vista AP, traza las 2 barras y usa el deslizador para simular la reducción de la escoliosis.'],
                ['Módulo 8 • Tabla de Resultados y GAP Score', 'Compara tus valores Base, Ideales y Logrados tras la simulación quirúrgica, incluyendo el Mismatch (T4PA - L1PA), Global Tilt y el semáforo de GAP Score.']
            ] : [
                ['Module 1 • Calibration', 'Mark a known ruler distance so SVA, rods, and pedicle screws display in real centimeters (cm).'],
                ['Module 2 • Pelvis (PI, PT, SS)', 'Always measure the pelvis first (femoral heads + S1 endplate). It powers automatic L1-PA, T4-PA, Global Tilt (GT), and GAP Score calculations.'],
                ['Modules 3, 4 & 5 • Sagittal Alignment', 'Measure L1-S1, L4-S1, T4-T12, L1-PA, T4-PA, C2 Tilt, and SVA. Drag any label to reposition it, or right-click to resize or delete.'],
                ['Module 6 • Coronal Plane (AP)', 'Measure Coronal Cobb angles and C7-CSVL plumbline offset.'],
                ['Module 7 • Schwab Osteotomies (1-6)', 'Place 3 points on the vertebra (anterior-superior, posterior hinge, anterior-inferior). Select Schwab Grades 1-6 and simulate wedge closure live.'],
                ['Module 7B • Pedicle Screws (cm) & Rods', 'In sagittal view, click pedicles, double-click to finish, and drag the yellow screw tips to measure length in cm. In AP view, trace bilateral rods and simulate scoliosis reduction.'],
                ['Module 8 • Alignment Table & GAP Score', 'Compare Base, Ideal, and Achieved values including T4-L1 Mismatch, Global Tilt, and GAP Score proportionality.']
            ];

            box.innerHTML = `
                <div class="space-y-2">
                    ${mods.map(([title, desc]) => `
                        <div class="bg-gray-800/60 border border-gray-700/80 rounded-lg p-2.5">
                            <div class="font-bold text-sky-400 text-xs">${title}</div>
                            <div class="text-[11px] text-gray-300 leading-relaxed mt-1">${desc}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    };

    const prevSetLang = typeof setLanguage === 'function' ? setLanguage : null;
    if (prevSetLang) {
        setLanguage = function(lang) {
            prevSetLang(lang);
            injectHelpButton();
            if (!document.getElementById('help-context-modal').classList.contains('hidden')) {
                switchHelpTab('ctx');
            }
        };
    }

    window.addEventListener('load', injectHelpButton);
    injectHelpButton();
})();
