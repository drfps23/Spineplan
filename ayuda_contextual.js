// ============================================================================
// ACTUALIZACIÓN 5 V2 (ayuda_contextual.js): AYUDA CONTEXTUAL EN BARRA PRINCIPAL
// Se ubica exclusivamente junto a "EN / Pre-Op" dentro del área de trabajo
// ============================================================================

(function() {
    window._lastToolContext = null;

    // 1. BASE DE DATOS BILINGÜE DE HERRAMIENTAS CLÍNICAS (MODO CONTEXTUAL)
    const TOOL_GUIDES = {
        es: {
            calibrate: {
                name: "📏 Calibración de Escala (cm)",
                badge: "1. Herramientas Básicas • Escala Real",
                steps: [
                    "Haz clic en el **extremo inicial** de la regla o testigo métrico de la radiografía.",
                    "Haz clic en el **extremo final** de la medida conocida (ej. 5 cm o 10 cm).",
                    "Ingresa el valor en centímetros cuando aparezca el cuadro."
                ],
                tip: "Al calibrar la placa, el SVA, las líneas simples, las barras y el largo de cada tornillo se calculan en centímetros reales."
            },
            line: {
                name: "📏 Línea Simple (Medición de Distancia)",
                badge: "1. Herramientas Básicas • Longitud",
                steps: [
                    "**Punto 1:** Haz clic en el punto anatómico inicial que deseas medir.",
                    "**Punto 2:** Haz clic en el punto final para obtener la distancia lineal."
                ],
                tip: "Si ya calibraste la radiografía, te mostrará la distancia exacta en centímetros (cm); de lo contrario, en píxeles (px)."
            },
            circle: {
                name: "⭕ Círculo (Referencia Anatómica / Cabeza Femoral)",
                badge: "1. Herramientas Básicas • Geometría",
                steps: [
                    "**Punto 1 (Centro):** Haz clic en el centro de la estructura esférica o vertebral.",
                    "**Punto 2 (Radio):** Desliza y haz clic en el borde para fijar el diámetro del círculo."
                ],
                tip: "Puedes arrastrar el centro o el borde del círculo en cualquier momento para ajustarlo con precisión."
            },
            cobb: {
                name: "📐 Ángulos de Cobb Sagitales (Lordosis / Cifosis TK)",
                badge: "Módulos 1 y 3 • Curvas Sagitales",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior):** Haz clic en el borde anterior y posterior del platillo vertebral superior del segmento (ej. L1, L4, T4 o C2).",
                    "**Puntos 3 y 4 (Platillo Inferior):** Haz clic en el borde anterior y posterior del platillo vertebral inferior del segmento (ej. S1, L5, T12 o C7)."
                ],
                tip: "Si necesitas corregir la inclinación de una línea después de medir, solo arrastra cualquiera de sus extremos con el mouse o el dedo."
            },
            pelvis: {
                name: "🦴 Parámetros Pélvicos (PI, PT y SS)",
                badge: "2. Parámetros Pélvicos • Base S1",
                steps: [
                    "**Puntos 1 y 2 (Cabezas Femorales):** Haz clic en el centro de cada cabeza femoral (si están superpuestas, haz clic dos veces en el centro bicoxofemoral).",
                    "**Punto 3 (Borde Anterior de S1):** Haz clic en la esquina anterosuperior del platillo sacro (promontorio de S1).",
                    "**Punto 4 (Borde Posterior de S1):** Haz clic en la esquina posterosuperior del platillo de S1."
                ],
                tip: "Mide siempre la Pelvis primero: calcula PI, PT y SS al instante y habilita el cálculo automático de L1-PA, T4-PA, C7-PA, C2-PA, Global Tilt (GT) y GAP Score."
            },
            pa: {
                name: "🎯 Ángulos Proporcionales (L1-PA / T4-PA / C7-PA / C2-PA)",
                badge: "3. Balance Sagital • Ángulos Pélvico-Vertebrales",
                steps: [
                    "**Requisito previo:** Haber medido primero **PI, PT y SS** para registrar el platillo de S1 y las cabezas femorales.",
                    "**Un solo clic:** Haz clic directamente en el **centro del cuerpo vertebral** correspondiente (L1, T4, C7 o C2)."
                ],
                tip: "El programa une automáticamente la vértebra con el centro de S1 y el eje bicoxofemoral, y calcula el Mismatch (T4-PA menos L1-PA) en la tabla."
            },
            tilt: {
                name: "🧭 Inclinación Vertebral Sagital (L1 / T4 / C7 / C2 Tilt)",
                badge: "3. Balance Sagital • Inclinación respecto a la Vertical",
                steps: [
                    "**Si ya mediste la Pelvis (S1):** Solo haz **1 clic** en el centro del cuerpo vertebral (L1, T4, C7 o C2) y se unirá automáticamente al centro de S1.",
                    "**Si es independiente:** Marca el punto superior y el punto inferior de referencia respecto al eje vertical."
                ],
                tip: "Los ángulos Tilt no dependen de la calibración en centímetros y se actualizan en tiempo real al cerrar las osteotomías de Schwab."
            },
            sva: {
                name: "📍 Plomada Sagital (SVA: C7 a S1 / cSVA)",
                badge: "3. Balance Sagital • Traslación Horizontal",
                steps: [
                    "**Punto 1 (Plomada):** Haz clic en el **centro del cuerpo vertebral de C7** (o C2 para cSVA).",
                    "**Punto 2 (Referencia S1):** Haz clic en la **esquina posterosuperior del platillo de S1** (si ya mediste la Pelvis, se ancla automáticamente o con el segundo clic)."
                ],
                tip: "Con la radiografía calibrada, el SVA te muestra la distancia horizontal exacta en centímetros (normal < 4 cm)."
            },
            gt: {
                name: "📐 Global Tilt (GT - Inclinación Global C7-S1-Fémures)",
                badge: "3. Balance Sagital • Ángulo Global Espinopélvico",
                steps: [
                    "**Requisito previo:** Haber medido primero los **Parámetros Pélvicos (PI, PT y SS)**.",
                    "**Un solo clic:** Haz clic en el **centro del cuerpo vertebral de C7**."
                ],
                tip: "El Global Tilt (GT) combina la anteversión del tronco (SVA) y la retroversión pélvica (PT) en un solo ángulo que no se altera si la radiografía no está calibrada."
            },
            cobb_coronal: {
                name: "📐 Ángulo de Cobb Coronal (Escoliosis AP)",
                badge: "Plano Coronal (AP) • Curvas Escolióticas",
                steps: [
                    "**Puntos 1 y 2 (Vértebra Límite Superior):** Marca los bordes izquierdo y derecho del platillo superior de la vértebra más inclinada arriba.",
                    "**Puntos 3 y 4 (Vértebra Límite Inferior):** Marca los bordes izquierdo y derecho del platillo inferior de la vértebra más inclinada abajo."
                ],
                tip: "Cuando traces las Barras Coronales AP y deslices 'Reducción a la Barra (0-100%)', este ángulo de Cobb disminuirá en vivo mostrando la corrección."
            },
            point_marker: {
                name: "📍 Balance Coronal (Plomada C7 - CSVL)",
                badge: "Plano Coronal (AP) • Alineación Media",
                steps: [
                    "**Marcador C7:** Selecciona el botón de C7 y haz clic en el centro de C7 en la radiografía AP.",
                    "**Marcador S1 (CSVL):** Selecciona el botón de S1 y haz clic en el centro del sacro (Línea Vertical Centro-Sacra)."
                ],
                tip: "Calcula automáticamente el desplazamiento lateral del tronco respecto a la línea media sacra."
            },
            osteotomy: {
                name: "✂️ Osteotomía Correctiva de Schwab (Grados 1 al 6)",
                badge: "Módulo 7 • Simulación Quirúrgica Sagital",
                steps: [
                    "**Punto 1 (Corte Superior):** Haz clic en la cortical anterior del cuerpo vertebral (borde superior de la cuña).",
                    "**Punto 2 (Ápex / Bisagra Posterior):** Haz clic en el muro vertebral posterior (vértice de bisagra).",
                    "**Punto 3 (Corte Inferior):** Haz clic más abajo en la cortical anterior para fijar la apertura de la cuña."
                ],
                tip: "Abre '⚙️ 3. Ajustar Grados' para elegir un Grado de Schwab (1 a 6) y presiona '✂️ 2. Simular Cierre' para plegar la radiografía, los tornillos y recalcular toda la tabla."
            },
            rod_sagittal: {
                name: "🔩 Barra y Tornillos Transpediculares Sagitales",
                badge: "Módulo 7B • Instrumentación en Perfil",
                steps: [
                    "**Colocar tornillos:** Haz clic en cada pedículo vertebral siguiendo tu planificación.",
                    "**Cerrar la barra:** Haz **doble clic en el último tornillo** (o toca el botón verde de Terminar Barra).",
                    "**Medir largo del tornillo (cm):** Arrastra el **punto amarillo de la punta de cualquier tornillo** hasta la cortical anterior del cuerpo vertebral."
                ],
                tip: "Puedes estirar e inclinar cada tornillo individualmente. Al activar el cierre de osteotomías, los tornillos y la barra rotan solidarios con la columna."
            },
            rod_coronal: {
                name: "🔩 Barras Coronales AP y Reducción de Escoliosis",
                badge: "Módulo 7B • Instrumentación AP (2 Lados)",
                steps: [
                    "**Primera Barra:** Haz clic en cada pedículo de un lado de la columna y cierra con **doble clic en el último tornillo**.",
                    "**Segunda Barra:** Vuelve a tocar '🔩 2. Barras Coronales' y traza el lado opuesto, cerrando con doble clic.",
                    "**Simular Corrección:** En la ventana morada, mueve el deslizador **'Reducción a la Barra y Desrotación (0% a 100%)'**."
                ],
                tip: "Endereza progresivamente las dos barras, alinea la radiografía AP en vivo y calcula el Cobb Coronal corregido y la desrotación apical."
            }
        },
        en: {
            calibrate: {
                name: "📏 Calibrate Scale (cm)",
                badge: "1. Basic Tools • Real Metric Scale",
                steps: [
                    "Click the **start point** of the radiographic ruler or marker.",
                    "Click the **end point** of the known distance (e.g., 5 cm or 10 cm).",
                    "Enter the real length in centimeters when prompted."
                ],
                tip: "Once calibrated, SVA, simple lines, rod lengths, and pedicle screw lengths are automatically displayed in real centimeters."
            },
            line: {
                name: "📏 Simple Line (Distance Measurement)",
                badge: "1. Basic Tools • Linear Distance",
                steps: [
                    "**Point 1:** Click the starting anatomical landmark.",
                    "**Point 2:** Click the ending landmark to measure distance."
                ],
                tip: "Displays real centimeters (cm) once the radiograph is calibrated."
            },
            circle: {
                name: "⭕ Circle (Anatomical Reference)",
                badge: "1. Basic Tools • Geometry",
                steps: [
                    "**Point 1 (Center):** Click the center of the femoral head or structure.",
                    "**Point 2 (Radius):** Click the outer edge to set the diameter."
                ],
                tip: "Drag the center or edge point anytime to adjust."
            },
            cobb: {
                name: "📐 Sagittal Cobb Angle & TK (Kyphosis)",
                badge: "Modules 1 & 3 • Sagittal Curves",
                steps: [
                    "**Points 1 & 2 (Superior Endplate):** Click the anterior and posterior corners of the upper endplate.",
                    "**Points 3 & 4 (Inferior Endplate):** Click the anterior and posterior corners of the lower endplate."
                ],
                tip: "Drag any endpoint afterward to fine-tune the angle."
            },
            pelvis: {
                name: "🦴 Measure PI, PT & SS (Pelvic Parameters)",
                badge: "2. Pelvic Parameters • S1 Base",
                steps: [
                    "**Points 1 & 2 (Femoral Heads):** Click the center of each femoral head (click twice if overlapped).",
                    "**Point 3 (Anterior S1):** Click the anterosuperior corner of the S1 endplate.",
                    "**Point 4 (Posterior S1):** Click the posterosuperior corner of the S1 endplate."
                ],
                tip: "Always measure Pelvis first: it unlocks automatic calculations for L1-PA, T4-PA, C7-PA, C2-PA, Global Tilt (GT), and GAP Score."
            },
            pa: {
                name: "🎯 Proportional Angles (L1-PA / T4-PA / C7-PA / C2-PA)",
                badge: "3. Sagittal Balance • Pelvic-Vertebral Angles",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first so S1 and the femoral heads are registered.",
                    "**Single Click:** Click directly on the **center of the target vertebral body** (L1, T4, C7, or C2)."
                ],
                tip: "Automatically connects to the S1 center and bicoxofemoral axis, computing the T4-L1 Mismatch."
            },
            tilt: {
                name: "🧭 Sagittal Vertebral Tilt (L1 / T4 / C7 / C2 Tilt)",
                badge: "3. Sagittal Balance • Vertical Inclination",
                steps: [
                    "**If Pelvis is already measured:** Simply click **once** on the center of the vertebral body (L1, T4, C7, or C2).",
                    "**If standalone:** Click the upper and lower reference points."
                ],
                tip: "Scale-free angular parameter that updates live during Schwab osteotomy closure."
            },
            sva: {
                name: "📍 SVA (C7 Plumbline to S1) & cSVA",
                badge: "3. Sagittal Balance • Translational Offset",
                steps: [
                    "**Point 1:** Click the **center of the C7 body** (or C2 for cSVA).",
                    "**Point 2:** Click the **posterosuperior corner of S1**."
                ],
                tip: "Displays real centimeters (cm) once the X-Ray is calibrated."
            },
            gt: {
                name: "📐 Global Tilt (GT)",
                badge: "3. Sagittal Balance • Global Spinopelvic Angle",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click the **center of the C7 vertebral body**."
                ],
                tip: "Combines trunk inclination and pelvic retroversion into a single angle independent of radiographic magnification."
            },
            cobb_coronal: {
                name: "📐 Coronal Cobb Angle (AP Scoliosis)",
                badge: "Coronal Plane (AP) • Scoliotic Curves",
                steps: [
                    "**Points 1 & 2 (Upper End Vertebra):** Click the left and right borders of the upper endplate.",
                    "**Points 3 & 4 (Lower End Vertebra):** Click the left and right borders of the lower endplate."
                ],
                tip: "Dynamically reduces in real time when you slide the AP Coronal Rod Reduction control (0-100%)."
            },
            point_marker: {
                name: "📍 Coronal Balance (C7 - CSVL)",
                badge: "Coronal Plane (AP) • Plumbline Offset",
                steps: [
                    "**C7 Marker:** Click the center of C7 on the AP radiograph.",
                    "**S1 Marker (CSVL):** Click the center of S1 (Center Sacral Vertical Line)."
                ],
                tip: "Calculates horizontal offset between the C7 plumbline and sacral midline."
            },
            osteotomy: {
                name: "✂️ Schwab Corrective Osteotomy (Grades 1 to 6)",
                badge: "Module 7 • Sagittal Surgical Simulation",
                steps: [
                    "**Point 1 (Upper Cut):** Click the anterior vertebral cortex at the upper edge of the wedge.",
                    "**Point 2 (Apex / Hinge):** Click the posterior vertebral wall (hinge apex).",
                    "**Point 3 (Lower Cut):** Click the anterior cortex below Point 1 to set the wedge angle."
                ],
                tip: "Use '⚙️ 3. Adjust Degrees' to pick Schwab Grades 1-6, and toggle '✂️ 2. Simulate Wedge Closure' to fold the X-Ray, screws, and alignment table."
            },
            rod_sagittal: {
                name: "🔩 Sagittal Pedicle Screws & Rod",
                badge: "Module 7B • Profile Construct",
                steps: [
                    "**Place Screws:** Click each vertebral pedicle along your construct.",
                    "**Finish Rod:** **Double-click the last screw** (or click the green Finish button).",
                    "**Size Screw Length (cm):** Drag the **yellow tip** of any screw to the anterior vertebral cortex to measure its length in cm."
                ],
                tip: "Angle and stretch each screw tip independently. Screws and rods rotate automatically with osteotomy closure."
            },
            rod_coronal: {
                name: "🔩 Coronal AP Rods & Scoliosis Reduction",
                badge: "Module 7B • Bilateral AP Construct",
                steps: [
                    "**First Rod:** Click each pedicle on one side and **double-click the last screw** to finish.",
                    "**Second Rod:** Click '🔩 2. Coronal Rods' again and trace the opposite pedicles, finishing with a double-click.",
                    "**Simulate Reduction:** Slide **'Rod Translation & Derotation (0-100%)'** in the purple panel."
                ],
                tip: "Straightens both rods, aligns the AP radiograph live, and computes post-reduction Cobb and apical derotation."
            }
        }
    };

    // 2. IDENTIFICAR LA HERRAMIENTA ACTIVA CON PRECISIÓN
    function resolveCurrentToolKey(tool, subType, title) {
        if (!tool) return null;
        const tLow = (tool || '').toLowerCase();
        const sLow = (subType || '').toLowerCase();
        const tiLow = (title || '').toLowerCase();

        if (tLow === 'rod') return sLow === 'coronal' ? 'rod_coronal' : 'rod_sagittal';
        if (tLow === 'gt' || sLow === 'gt' || tiLow.includes('global tilt') || tiLow === 'gt') return 'gt';
        if (tLow === 'line' || tLow === 'simple_line' || tiLow.includes('simple line') || tiLow.includes('línea')) return 'line';
        if (tLow === 'circle' || tiLow.includes('circle') || tiLow.includes('círculo')) return 'circle';
        if (tLow === 'tk' || tiLow.includes('tk') || tiLow.includes('kyphosis')) return 'cobb';
        if (TOOL_GUIDES.es[tLow]) return tLow;
        return null;
    }

    if (typeof activateTool === 'function') {
        const origActivate = activateTool;
        activateTool = function(tool, title, subType) {
            window._lastToolContext = {
                key: resolveCurrentToolKey(tool, subType, title),
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
            btn.className = "bg-amber-500 hover:bg-amber-400 text-gray-950 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-extrabold transition-all flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.65)] animate-pulse select-none shrink-0";
        } else {
            btn.className = "bg-sky-600/25 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/60 px-2.5 py-1 rounded-md text-xs font-bold transition-colors flex items-center justify-center shadow-sm select-none shrink-0";
        }
    }

    // 3. UBICAR EL BOTÓN ❓ EXCLUSIVAMENTE EN EL HEADER DEL ÁREA DE TRABAJO (NUNCA EN EL LOGIN)
    function injectHelpButton() {
        // Buscar primero el botón Pre-Op o el selector de idioma que está DENTRO de <header>
        const headerEl = document.querySelector('header');
        const preOpBtn = document.querySelector('header button[onclick*="switchStage"]') ||
                         document.querySelector('button[onclick*="switchStage(\'pre\')"]') ||
                         document.getElementById('btn-stage-pre');

        // Buscar el <select> de idioma que pertenece al header principal (no al login)
        let headerLangSelect = null;
        if (headerEl) {
            headerLangSelect = headerEl.querySelector('select');
        }
        if (!headerLangSelect && preOpBtn && preOpBtn.parentElement && preOpBtn.parentElement.parentElement) {
            headerLangSelect = preOpBtn.parentElement.parentElement.querySelector('select');
        }

        let btnHelp = document.getElementById('btn-top-help');
        if (!btnHelp) {
            btnHelp = document.createElement('button');
            btnHelp.id = 'btn-top-help';
            btnHelp.type = 'button';
            btnHelp.innerHTML = '❓';
            btnHelp.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openContextualHelpModal();
            });
        }

        btnHelp.title = (typeof currentLang !== 'undefined' && currentLang === 'es')
            ? 'Ayuda Contextual de la Herramienta Activa / Leyenda de Iconos'
            : 'Contextual Tool Help & Icon Legend';

        // Insertar justo a la izquierda del selector "us EN" del Header principal
        if (headerLangSelect && headerLangSelect.parentNode) {
            if (btnHelp.parentNode !== headerLangSelect.parentNode) {
                headerLangSelect.parentNode.insertBefore(btnHelp, headerLangSelect);
            }
        } else if (preOpBtn && preOpBtn.parentElement && preOpBtn.parentElement.parentNode) {
            const row = preOpBtn.parentElement.parentNode;
            if (btnHelp.parentNode !== row) {
                row.insertBefore(btnHelp, preOpBtn.parentElement);
            }
        }

        updateHelpButtonBadge();
    }

    // 4. MODAL DE AYUDA CONTEXTUAL Y LEYENDA POR PESTAÑAS
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

    window.openContextualHelpModal = function() {
        const isActiveNow = (typeof activeTool !== 'undefined' && activeTool !== null);
        if (isActiveNow) {
            const curTitle = (typeof activeTitle !== 'undefined' && activeTitle) ? activeTitle : '';
            const curSub = (typeof activeSubType !== 'undefined' && activeSubType) ? activeSubType : '';
            window._lastToolContext = {
                key: resolveCurrentToolKey(activeTool, curSub, curTitle),
                tool: activeTool,
                title: curTitle,
                subType: curSub
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
        document.getElementById('tab-btn-ico').innerText = isEs ? '🎛️ Iconos (11)' : '🎛️ Icons (11)';
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
            const curTitle = (isNow && typeof activeTitle !== 'undefined' && activeTitle) ? activeTitle : (window._lastToolContext?.title || '');
            const curSub = (isNow && typeof activeSubType !== 'undefined' && activeSubType) ? activeSubType : (window._lastToolContext?.subType || '');
            const ctxKey = isNow
                ? resolveCurrentToolKey(activeTool, curSub, curTitle)
                : (window._lastToolContext ? window._lastToolContext.key : null);
            const g = ctxKey ? TOOL_GUIDES[langKey][ctxKey] : null;

            let html = '';
            if (g) {
                const statusBadge = isNow
                    ? (isEs ? `🟢 HERRAMIENTA ACTIVA AHORA${curTitle ? ': ' + curTitle : ''}` : `🟢 CURRENTLY ACTIVE TOOL${curTitle ? ': ' + curTitle : ''}`)
                    : (isEs ? `🕒 ÚLTIMA HERRAMIENTA CONSULTADA${curTitle ? ': ' + curTitle : ''}` : `🕒 LAST SELECTED TOOL${curTitle ? ': ' + curTitle : ''}`);
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
                        <p class="text-[11px] text-gray-400">${isEs ? 'Toca cualquier herramienta en el menú lateral izquierdo y luego presiona ❓, o elige una de la lista inferior para ver cómo se mide:' : 'Click any tool in the left sidebar and tap ❓, or choose one below to see how it works:'}</p>
                    </div>
                `;
            }

            html += `
                <div class="pt-1">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1.5">${isEs ? 'Consultar guía paso a paso de cualquier herramienta:' : 'Browse step-by-step guide for any tool:'}</div>
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
                ['1. Herramientas Básicas y Calibración', 'Calibra la escala en cm con un testigo métrico, traza líneas simples, círculos de referencia o ángulos de Cobb libres y cifosis torácica (TK).'],
                ['2. Parámetros Pélvicos (PI, PT y SS)', 'Mide siempre primero la pelvis (cabezas femorales + platillo de S1). Es la llave maestra para calcular L1-PA, T4-PA, C7-PA, C2-PA, Global Tilt (GT) y GAP Score.'],
                ['3, 4 y 5. Balance Sagital, Regional y Cervical', 'Mide L1-PA, T4-PA, C2 Tilt, SVA, Global Tilt, L1-S1 y L4-S1. Arrastra cualquier etiqueta para acomodarla o haz clic derecho para cambiar tamaño de fuente o eliminar.'],
                ['6. Plano Coronal (Escoliosis AP)', 'Mide los ángulos de Cobb coronales y la plomada C7-CSVL para evaluar deformidades escolióticas.'],
                ['7. Osteotomías de Schwab (Grados 1 al 6)', 'Marca 3 puntos sobre la vértebra (anterior-superior, bisagra posterior, anterior-inferior). Ajusta el grado de Schwab (1 a 6) y simula el cierre de la cuña en vivo.'],
                ['7B. Tornillos (cm) y Barras Sagital / AP', 'En vista sagital, marca los pedículos, cierra con doble clic y estira la punta amarilla de cada tornillo para medir su longitud en cm. En vista AP, traza las 2 barras y simula la reducción coronal.'],
                ['8. Tabla de Resultados y GAP Score', 'Compara valores Base, Ideales y Logrados tras la simulación quirúrgica, incluyendo el Mismatch (T4PA - L1PA), Global Tilt y el semáforo de GAP Score.']
            ] : [
                ['1. Basic Tools & Calibration', 'Calibrate scale in cm, draw simple lines, reference circles, or Cobb angles and Thoracic Kyphosis (TK).'],
                ['2. Pelvic Parameters (PI, PT & SS)', 'Always measure the pelvis first (femoral heads + S1 endplate). It unlocks automatic L1-PA, T4-PA, C7-PA, C2-PA, Global Tilt (GT), and GAP Score.'],
                ['3, 4 & 5. Sagittal, Regional & Cervical Balance', 'Measure L1-PA, T4-PA, C2 Tilt, SVA, Global Tilt, L1-S1, and L4-S1. Drag any label to reposition or right-click to resize or delete.'],
                ['6. Coronal Plane (AP Scoliosis)', 'Measure Coronal Cobb angles and C7-CSVL plumbline offset.'],
                ['7. Schwab Osteotomies (Grades 1-6)', 'Place 3 points on the vertebra (anterior-superior, posterior hinge, anterior-inferior). Select Schwab Grades 1-6 and simulate wedge closure live.'],
                ['7B. Pedicle Screws (cm) & Rods', 'In sagittal view, click pedicles, double-click to finish, and drag the yellow screw tips to measure length in cm. In AP view, trace bilateral rods and simulate scoliosis reduction.'],
                ['8. Alignment Table & GAP Score', 'Compare Base, Ideal, and Achieved values including T4-L1 Mismatch, Global Tilt, and GAP Score proportionality.']
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
