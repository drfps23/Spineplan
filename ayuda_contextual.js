// ============================================================================
// ACTUALIZACIÓN 5 V7 (ayuda_contextual.js): ENCICLOPEDIA TOTAL MÓDULOS 1 AL 12 (❓)
// Cubre el 100% de los parámetros (C.A, Osborne, CF, Bao, Abelin, Meyerding, AO, etc.)
// ============================================================================

(function() {
    window._lastSelectedSidebarCtx = null;
    window._manualPreviewKey = null;

    // 1. BASE DE DATOS COMPLETA DE TODOS LOS MÓDULOS (1 AL 12 + OSTEOTOMÍAS E IMPLANTES)
    const TOOL_GUIDES = {
        es: {
            // --- MÓDULO 1: HERRAMIENTAS BÁSICAS ---
            calibrate: {
                name: "📏 Calibrar Escala Radiográfica (cm)",
                badge: "1. Herramientas Básicas • Escala Métrica Real",
                steps: [
                    "**Punto 1:** Haz clic en el extremo inicial del testigo métrico o regla visible en la radiografía.",
                    "**Punto 2:** Haz clic en el extremo final de la distancia conocida (ej. 5 cm o 10 cm) e ingresa el valor en centímetros."
                ],
                tip: "Elimina el sesgo de magnificación radiográfica y convierte automáticamente el SVA, cSVA, la plomada de Bao (C7-CSVL), las barras y el largo de los tornillos a centímetros reales."
            },
            line: {
                name: "📏 Línea Simple (Distancia Lineal)",
                badge: "1. Herramientas Básicas • Longitud Anatómica",
                steps: [
                    "**Punto 1:** Haz clic en el punto anatómico inicial que deseas medir.",
                    "**Punto 2:** Haz clic en el punto final para obtener la distancia exacta."
                ],
                tip: "Si calibraste la placa previamente, muestra la distancia en centímetros (cm); de lo contrario, en píxeles (px)."
            },
            circle: {
                name: "⭕ Círculo (Referencia Anatómica / Cabeza Femoral)",
                badge: "1. Herramientas Básicas • Geometría Esférica",
                steps: [
                    "**Punto 1 (Centro):** Haz clic en el centro de la estructura circular o cabeza femoral.",
                    "**Punto 2 (Contorno):** Haz clic en el borde externo para fijar el diámetro."
                ],
                tip: "Puedes arrastrar el centro o el punto del borde en cualquier momento para ajustarlo con precisión."
            },
            cobb: {
                name: "📐 Ángulo de Cobb Libre (Sagital)",
                badge: "1. Herramientas Básicas • Ángulo Intervertebral",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior):** Marca el borde anterior y posterior del platillo vertebral superior.",
                    "**Puntos 3 y 4 (Platillo Inferior):** Marca el borde anterior y posterior del platillo vertebral inferior."
                ],
                tip: "Permite medir cualquier curva segmentaria libre. Arrastra cualquiera de los 4 puntos si deseas refinar la inclinación."
            },
            tk: {
                name: "📐 Tk - Cifosis Torácica (T4 - T12)",
                badge: "1. Herramientas Básicas • Cifosis Torácica",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de T4):** Haz clic en el borde anterior y posterior del platillo superior de **T4**.",
                    "**Puntos 3 y 4 (Platillo Inferior de T12):** Haz clic en el borde anterior y posterior del platillo inferior de **T12**."
                ],
                tip: "Fundamento académico: El valor normal oscila entre 20° y 40°. Es indispensable para evaluar la adaptación sagital de Abelin-Genevois y la tabla de perfil teórico ideal."
            },

            // --- MÓDULO 2: PARÁMETROS PÉLVICOS ---
            pelvis: {
                name: "🦴 Medir PI, PT y SS (Parámetros Pélvicos)",
                badge: "2. Parámetros Pélvicos • Base Espinopélvica (Legaye / Dubousset)",
                steps: [
                    "**Punto 1 (Cabeza Femoral 1):** Haz clic en el centro de la primera cabeza femoral.",
                    "**Punto 2 (Cabeza Femoral 2):** Haz clic en el centro de la segunda cabeza femoral (si están superpuestas, haz clic de nuevo en el mismo centro).",
                    "**Punto 3 (Borde Anterior de S1):** Haz clic en el promontorio sacro (esquina anterosuperior del platillo de **S1**).",
                    "**Punto 4 (Borde Posterior de S1):** Haz clic en la esquina posterosuperior del platillo de **S1**."
                ],
                tip: "Fundamento académico: Calcula PI (Incidencia Pélvica), PT (Versión Pélvica) y SS (Pendiente Sacra), cumpliendo PI = PT + SS. Es la llave maestra que habilita L1-PA, T4-PA, Global Tilt, GAP Score, Roussouly y Abelin-Genevois."
            },

            // --- MÓDULO 3: BALANCE SAGITAL ---
            l1_pa: {
                name: "🎯 L1-PA (Ángulo Pélvico de L1)",
                badge: "3. Balance Sagital • Proporcionalidad Lumbar",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de L1**."
                ],
                tip: "Fundamento académico: Ángulo entre el centro de L1, el centro del platillo de S1 y el eje bicoxofemoral. No se altera por la magnificación radiográfica (Valor ideal = 0.5 × PI - 19°)."
            },
            t4_pa: {
                name: "🎯 T4-PA (Ángulo Pélvico Torácico de T4)",
                badge: "3. Balance Sagital • Armonía Toracolumbar (Hills / Lenke)",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de T4**."
                ],
                tip: "Fundamento académico: En una columna armónica, el T4-PA debe igualar al L1-PA. Un Mismatch (T4-PA menos L1-PA) < 3° a 5° minimiza el riesgo de cifosis de la unión proximal (PJK)."
            },
            c7_pa: {
                name: "🎯 C7-PA (Ángulo Pélvico de C7)",
                badge: "3. Balance Sagital • Alineación Global Angular",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de C7**."
                ],
                tip: "Conecta automáticamente el centro de C7 con el platillo de S1 y el eje bicoxofemoral."
            },
            c2_pa: {
                name: "🎯 C2-PA (Ángulo Pélvico de C2)",
                badge: "3. Balance Sagital • Alineación Craneocervical",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo/odontoides de C2**."
                ],
                tip: "Evalúa la alineación global desde el eje craneocervical (C2) hasta la base pélvica."
            },
            l1_tilt: {
                name: "🧭 L1 Tilt (Inclinación Sagital de L1)",
                badge: "3. Balance Sagital • Orientación Vertical de L1",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de L1** (se une automáticamente a S1).",
                    "**Sin Pelvis medida:** Marca el centro de L1 y luego el centro del platillo de S1."
                ],
                tip: "Mide el ángulo de inclinación del segmento S1-L1 respecto a la línea vertical."
            },
            t4_tilt: {
                name: "🧭 T4 Tilt (Inclinación Sagital de T4)",
                badge: "3. Balance Sagital • Orientación Vertical de T4",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de T4**.",
                    "**Sin Pelvis medida:** Marca el centro de T4 y luego el centro del platillo de S1."
                ],
                tip: "Mide la inclinación del bloque toracolumbar respecto al eje vertical."
            },
            c7_tilt: {
                name: "🧭 C7 Tilt (Inclinación Sagital Global de C7)",
                badge: "3. Balance Sagital • Inclinación Angular del Tronco",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de C7**.",
                    "**Sin Pelvis medida:** Marca el centro de C7 y luego el centro del platillo de S1."
                ],
                tip: "Fundamento académico: Equivalente angular del SVA que no requiere calibración; expresa la inclinación global del tronco respecto a la vertical e integra la fórmula del Global Tilt."
            },
            c2_tilt: {
                name: "🧭 C2 Tilt (Inclinación Sagital Global de C2)",
                badge: "3. Balance Sagital • Eje de la Mirada",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo/odontoides de C2**.",
                    "**Sin Pelvis medida:** Marca el centro de C2 y luego el centro del platillo de S1."
                ],
                tip: "Fundamento académico: Su rango fisiológico es de +1° a -3° y se correlaciona con la posición de los conductos auditivos externos."
            },
            sva: {
                name: "📍 SVA (Plomada de C7 a S1)",
                badge: "3. Balance Sagital • Traslación Sagital Global",
                steps: [
                    "**Punto 1 (C7):** Haz clic en el **centro del cuerpo vertebral de C7**.",
                    "**Punto 2 (S1):** Haz clic en la **esquina posterosuperior del platillo de S1** (o se ancla automáticamente si ya mediste la pelvis)."
                ],
                tip: "Fundamento académico (Schwab): SVA < 4 cm es normal; de 4 a 9.5 cm es desbalance moderado; > 9.5 cm define desbalance sagital severo."
            },
            gt: {
                name: "📐 Global Tilt (GT - Ángulo de Inclinación Global)",
                badge: "3. Balance Sagital • Parámetro Automático / 1 Clic (Obeid)",
                steps: [
                    "**Cálculo Automático:** Si ya mediste **PI, PT y SS** y marcaste **C7**, al tocar este botón el programa traza y calcula el **Global Tilt (GT)** automáticamente.",
                    "**Modo de 1 Clic:** Si solo has medido la Pelvis, toca este botón y haz **1 clic en el centro del cuerpo de C7**."
                ],
                tip: "Fundamento académico (Obeid / Boissière): Suma la inclinación del tronco (C7 Tilt) y la retroversión pélvica (PT) en un solo ángulo (GT ≈ C7 Tilt + PT). Valor ideal según PI: GT ≈ 0.48 × PI - 15°."
            },

            // --- MÓDULO 4: MEDICIONES LUMBARES ---
            l1_s1: {
                name: "📐 Lordosis Global (L1-S1)",
                badge: "4. Mediciones Lumbares • Lordosis Lumbar Total (LL)",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L1):** Marca el borde anterior y posterior del platillo superior de **L1**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Fundamento académico: Calcula la lordosis ideal proporcional (LL Ideal = 0.6 × PI + 30°) y el desajuste PI - LL (< 10°), alimentando el GAP Score, Roussouly y Abelin-Genevois."
            },
            l4_s1: {
                name: "📐 LL Baja (L4-S1) / Lordosis Distal",
                badge: "4. Mediciones Lumbares • Arco Lumbar Inferior",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L4):** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Fundamento académico: L4-S1 debe representar del 50% al 80% de la lordosis lumbar total (ideal 35° a 40°). Alimenta automáticamente el Índice de Distribución de Lordosis (LDI) en el GAP Score."
            },
            l4_l5: {
                name: "📐 Segmentaria (L4-L5)",
                badge: "4. Mediciones Lumbares • Ángulo Segmentario L4-L5",
                steps: [
                    "**Puntos 1 y 2:** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4:** Marca el borde anterior y posterior del platillo inferior de **L5**."
                ],
                tip: "Cuantifica el aporte segmentario de L4-L5 a la lordosis distal para planificar cajas intersomáticas o liberaciones posteriores."
            },

            // --- MÓDULO 5: PERFIL TEÓRICO IDEAL Y GAP SCORE ---
            theory_ideal: {
                name: "📊 Calcular / Comparar Valores (Perfil Teórico Ideal)",
                badge: "5. Perfil Teórico Ideal • Tabla Biomecánica Automática",
                steps: [
                    "**Acción Automática:** Cruza todas las mediciones realizadas en la radiografía y abre la tabla comparativa con 3 columnas: **Base (Pre-Op)**, **Ideal (según la PI del paciente)** y **Logrado (Simulación / Post-Op)**.",
                    "**Mismatch (T4-PA - L1-PA):** Calcula automáticamente la diferencia entre T4-PA y L1-PA (objetivo < 3°)."
                ],
                tip: "Permite comprobar en segundos cuántos grados de corrección faltan o sobran en cada segmento antes de entrar a quirófano."
            },
            gap_score: {
                name: "⚖️ GAP Score (Yilgor et al., 2017)",
                badge: "5. Perfil Teórico Ideal • Proporcionalidad Espinopélvica",
                steps: [
                    "**Requisitos a medir primero:** **PI/PT/SS**, **Lordosis Global (L1-S1)**, **LL Baja (L4-S1)** y **Global Tilt (GT)**.",
                    "**Cálculo Automático (0 a 13 pts):** Evalúa 4 factores proporcionales a la PI y edad: **RPV** (Versión Pélvica Relativa), **RLL** (Lordosis Lumbar Relativa), **LDI** (Distribución L4-S1/L1-S1) y **RSA** (Alineación Espinal Relativa)."
                ],
                tip: "Escala de riesgo de complicaciones mecánicas (Yilgor et al., JBJS): • **0-2 pts (🟢 Proporcionado):** ~6% riesgo. • **3-6 pts (🟡 Moderadamente Desproporcionado):** ~47% riesgo. • **≥ 7 pts (🔴 Severamente Desproporcionado):** ~95% riesgo de PJK o rotura de implantes."
            },

            // --- MÓDULO 6: PERFIL SAGITAL CERVICAL ---
            cervical_set: {
                name: "🎯 T1S, TIA, NT (Conjunto Cervical Torácico)",
                badge: "6. Perfil Sagital Cervical • Entrada Torácica (Lee et al.)",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de T1):** Haz clic en el borde anterior y posterior del platillo superior de **T1** (calcula el **T1 Slope - T1S** respecto a la horizontal).",
                    "**Punto 3 (Manubrio Esternal):** Haz clic en el extremo superior del manubrio del esternón.",
                    "**Cálculo Conjunto Automático:** El programa traza el triángulo cervicotorácico y calcula simultáneamente **T1S** (T1 Slope), **NT** (Neck Tilt, respecto a la vertical del esternón) y **TIA** (Thoracic Inlet Angle)."
                ],
                tip: "Fundamento académico (Lee et al.): El **TIA (Thoracic Inlet Angle)** es constante morfológica equivalente a la PI para la columna cervical y cumple la ecuación geométrica **TIA = T1S + NT** (normal TIA ~70°, T1S ~25°, NT ~45°)."
            },
            c0_c2: {
                name: "📐 C0-C2 (Ángulo Occipitocervical / McGregor)",
                badge: "6. Perfil Sagital Cervical • Unión Craneocervical",
                steps: [
                    "**Puntos 1 y 2 (Línea de McGregor - C0):** Marca el borde posterosuperior del paladar duro y el punto más caudal de la escama occipital.",
                    "**Puntos 3 y 4 (Platillo Inferior de C2):** Marca el borde anterior y posterior del platillo inferior de **C2**."
                ],
                tip: "Fundamento académico: Representa el ~75% de la lordosis cervical total (valor fisiológico 15° a 25°). Guarda relación inversa con C2-C7: si se fija C0-C2 en cifosis, C2-C7 hiperlordosa compensatoriamente."
            },
            c2_c7: {
                name: "📐 C2-C7 (Lordosis Cervical Subaxial)",
                badge: "6. Perfil Sagital Cervical • Curva Cervical C2-C7",
                steps: [
                    "**Puntos 1 y 2 (C2):** Marca el borde anterior y posterior del platillo inferior de **C2** (o tangente posterior del cuerpo de C2 según técnica de Jackson/Harrison).",
                    "**Puntos 3 y 4 (C7):** Marca el borde anterior y posterior del platillo inferior de **C7**."
                ],
                tip: "Fundamento académico: La lordosis C2-C7 depende directamente del T1 Slope. El desajuste **T1S - CL debe ser < 15° a 20°** para mantener la mirada horizontal sin sobrecarga muscular."
            },
            csva: {
                name: "📍 cSVA (Plomada Sagital Cervical C2 a C7)",
                badge: "6. Perfil Sagital Cervical • Traslación Cervical",
                steps: [
                    "**Punto 1 (C2):** Haz clic en el **centro de la odontoides / cuerpo de C2**.",
                    "**Punto 2 (C7):** Haz clic en la **esquina posterosuperior del platillo superior de C7**."
                ],
                tip: "Fundamento académico: Valor normal < 2 cm; un **cSVA > 4 cm** se asocia directamente con discapacidad cervical severa (NDI elevado) y peor pronóstico postoperatorio."
            },

            // --- MÓDULO 7 Y 7B: OSTEOTOMÍAS DE SCHWAB E INSTRUMENTACIÓN ---
            osteotomy: {
                name: "✂️ 1. Colocar Osteotomía de Schwab (Trazar Cuña)",
                badge: "7. Osteotomías Correctivas • Trazado Manual en Perfil",
                steps: [
                    "**Punto 1 (Corte Superior):** Haz clic en el muro anterior del cuerpo vertebral donde inicia el corte superior.",
                    "**Punto 2 (Ápex / Bisagra):** Haz clic en el muro vertebral posterior (vértice de bisagra).",
                    "**Punto 3 (Corte Inferior):** Haz clic más abajo en la cortical anterior para fijar la apertura de la cuña."
                ],
                tip: "Puedes colocar múltiples osteotomías en distintos niveles y arrastrar cualquiera de sus 3 puntos cuando la simulación está apagada."
            },
            ost_sim: {
                name: "✂️ 2. Simular Cierre de Cuña (Cinemática en Vivo)",
                badge: "7. Osteotomías Correctivas • Simulación Automática",
                steps: [
                    "**Requisito:** Haber trazado al menos una osteotomía de 3 puntos sobre la columna.",
                    "**Acción Automática:** Pliega la radiografía sobre el ápex de cada osteotomía y rota solidariamente toda la columna craneal, los tornillos, las barras y los parámetros espinopélvicos."
                ],
                tip: "Recalcula en tiempo real los nuevos valores logrados de L1-S1, PT, SS, SVA, L1-PA, T4-PA, C2 Tilt, Global Tilt y GAP Score."
            },
            ost_modal: {
                name: "⚙️ 3. Ajustar Grados y Clasificación de Schwab (1 a 6)",
                badge: "7. Osteotomías Correctivas • Grados Anatómicos de Schwab",
                steps: [
                    "**Selector de Grados de Schwab (2014):**\n• **Grado 1 (Facetectomía Parcial / SPO):** ~5° a 10° por nivel.\n• **Grado 2 (Osteotomía de Ponte / Facetectomía Completa):** ~10° a 15° por nivel.\n• **Grado 3 (PSO - Sustracción Pedicular):** ~25° a 35°.\n• **Grado 4 (PSO Extendida + Disco):** ~35° a 45°.\n• **Grado 5 (VCR - Resección de Columna Vertebral):** ~50°.\n• **Grado 6 (VCR Múltiple):** > 60°."
                ],
                tip: "Ajusta con el deslizador o escribe los grados exactos para alcanzar los valores ideales en la tabla."
            },
            rod_sagittal: {
                name: "🔩 1. Barra y Tornillos Transpediculares Sagitales",
                badge: "7B. Instrumentación • Perfil con Longitud en cm",
                steps: [
                    "**Colocar tornillos:** Haz clic en cada pedículo vertebral a instrumentar.",
                    "**Cerrar la barra:** Haz **doble clic en el último tornillo** (o toca el botón verde de Terminar Barra).",
                    "**Medir longitud del tornillo (cm):** Arrastra el **punto amarillo de la punta de cualquier tornillo** hasta la cortical anterior vertebral."
                ],
                tip: "Mide el largo real de cada tornillo en centímetros (una vez calibrada la placa) y permite orientar su trayectoria hacia el platillo, promontorio sacro o ilíaco."
            },
            rod_coronal: {
                name: "🔩 2. Barras Coronales AP (2 Lados)",
                badge: "7B. Instrumentación • Constructo Bilateral AP",
                steps: [
                    "**Primera Barra:** Haz clic en cada pedículo de un lado de la escoliosis y cierra con **doble clic en el último tornillo**.",
                    "**Segunda Barra:** Vuelve a tocar el botón y marca los pedículos del lado opuesto, cerrando con doble clic."
                ],
                tip: "Calcula el largo de ambas barras en cm y habilita el simulador de reducción coronal y desrotación."
            },
            rod_panel: {
                name: "📐 3. Corrección Coronal AP y Pronóstico de Desrotación",
                badge: "7B. Instrumentación • Simulador Automático AP",
                steps: [
                    "**Deslizador de Reducción (0% a 100%):** Simula la traslación de la columna escoliótica hacia las barras.",
                    "**Cálculo en Vivo:** Muestra el Cobb Coronal corregido, el porcentaje de reducción y la desrotación vertebral apical acoplada."
                ],
                tip: "Reproduce biomecánicamente la maniobra de traducción y desrotación en bloque sobre las barras."
            },

            // --- MÓDULO 8: CLASIFICACIÓN DE ROUSSOULY ---
            roussouly_apex: {
                name: "📍 Ápex Lumbar (Apex L - Roussouly)",
                badge: "8. Clasificación de Roussouly • Vértice Lordótico",
                steps: [
                    "**1 solo clic:** Haz clic en el **punto más anterior de la lordosis lumbar** (centro del cuerpo vertebral o disco más prominente hacia adelante, usualmente entre L3 y L5)."
                ],
                tip: "Fundamento académico (Roussouly): En curvas Tipo 1 el ápex es muy bajo (L5); en Tipo 2 es plano; en Tipo 3 y 4 el ápex se sitúa en L4 o L3 con un arco superior más largo."
            },
            roussouly_inflection: {
                name: "📍 Punto de Inflexión (Inflection Point - Roussouly)",
                badge: "8. Clasificación de Roussouly • Transición Cifosis-Lordosis",
                steps: [
                    "**1 solo clic:** Haz clic en el cuerpo vertebral o disco donde la **cifosis torácica cambia de curvatura para convertirse en lordosis lumbar** (usualmente entre T12 y L2)."
                ],
                tip: "Define cuántas vértebras integran funcionalmente la lordosis lumbar (arco superior + arco inferior de Roussouly) y dónde debe ubicarse el cambio de contorno de la barra."
            },
            roussouly_eval: {
                name: "🏛️ Evaluar Clasificación de Roussouly (Tipos 1 a 4)",
                badge: "8. Clasificación de Roussouly • Morfotipo Espinopélvico",
                steps: [
                    "**Requisitos previos:** Haber medido **PI, PT y SS**, **Lordosis Global (L1-S1)**, **Ápex Lumbar** y **Punto de Inflexión**.",
                    "**Clasificación Automática:** Determina el morfotipo de Roussouly según la Pendiente Sacra (SS), Incidencia Pélvica (PI) y geometría del arco lumbar."
                ],
                tip: "Morfotipos de Roussouly (2005 / Laouissat 2018):\n• **Tipo 1 (SS < 35°, PI baja):** Arco corto hiperlordótico distal (L4-S1) con cifosis toracolumbar.\n• **Tipo 2 (SS < 35°, PI baja):** Espalda plana armónica (Flatback).\n• **Tipo 3 (35° ≤ SS ≤ 45°):** Curva armónica bien balanceada.\n• **Tipo 3AP (SS > 35° con PI baja):** Pelvis antevertida.\n• **Tipo 4 (SS > 45°, PI alta):** Hiperlordosis global larga."
            },

            // --- MÓDULO 9: ADAPTACIÓN SAGITAL EN ESCOLIOSIS (ABELIN-GENEVOIS) ---
            cobb_tl: {
                name: "📐 Ángulo Cobb TL (Transición Toracolumbar T10 - L2)",
                badge: "9. Adaptación Sagital Escoliosis • Unión Toracolumbar",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de T10):** Marca el borde anterior y posterior del platillo superior de **T10**.",
                    "**Puntos 3 y 4 (Platillo Inferior de L2):** Marca el borde anterior y posterior del platillo inferior de **L2**."
                ],
                tip: "Fundamento académico (Abelin-Genevois): Normalmente la unión T10-L2 es neutra (0° a +5°). Una cifosis toracolumbar (> 10°) o inversión lordótica define los subtipos patológicos 2b en Escoliosis Idiopática del Adolescente."
            },
            c7_slope: {
                name: "📐 Pendiente C7 (C7S - C7 Slope)",
                badge: "9. Adaptación Sagital Escoliosis • Pendiente Cervicotorácica",
                steps: [
                    "**Puntos 1 y 2 (Platillo de C7):** Haz clic en el borde Posterior y en el borde Anterior del platillo vertebral de **C7**."
                ],
                tip: "Fundamento académico (Abelin-Genevois, 2018): El C7 Slope refleja la orientación de la transición cervicotorácica. En pacientes con hipocifosis torácica severa (EIA), un C7S negativo o disminuido induce cifosis cervical reactiva (Tipo 3)."
            },
            abelin_genevois: {
                name: "🧬 Evaluar Abelin-Genevois (Perfil Sagital en EIA)",
                badge: "9. Adaptación Sagital Escoliosis • Clasificación Abelin-Genevois (2018)",
                steps: [
                    "**Parámetros integrados:** Cruza automáticamente **PI, SS, Cifosis Torácica (Tk T4-T12), Lordosis Lumbar (L1-S1), Ángulo Cobb TL (T10-L2)** y **Pendiente C7 (C7S)**.",
                    "**Acción Automática:** Clasifica el perfil sagital del paciente con Escoliosis Idiopática del Adolescente (EIA) y define los objetivos teóricos de restauración sagital."
                ],
                tip: "Clasificación de Abelin-Genevois et al. (Eur Spine J, 2018):\n• **Tipo 1 (Sagital Normal):** Cifosis torácica conservada (> 20°) y balance armónico con la PI.\n• **Tipo 2a (Hipocifosis Torácica Aislada):** TK < 20° con unión toracolumbar recta.\n• **Tipo 2b (Hipocifosis Torácica + Cifosis TL):** TK < 20° combinada con cifosis toracolumbar T10-L2 patológica.\n• **Tipo 3 (Cifosis Cervicotorácica):** Alteración proximal con inversión de C7S y cifosis cervical; exige restaurar la TK intraoperatoria para corregir la columna cervical."
            },

            // --- MÓDULO 10: PLANO CORONAL (AP) ---
            cobb_coronal: {
                name: "📐 Ángulo Cobb (Plano Coronal - Escoliosis AP)",
                badge: "10. Plano Coronal • Magnitud de la Curva Escoliótica",
                steps: [
                    "**Puntos 1 y 2 (Vértebra Límite Superior - UIV):** Marca los extremos izquierdo y derecho del platillo superior de la vértebra más inclinada cranealmente.",
                    "**Puntos 3 y 4 (Vértebra Límite Inferior - LIV):** Marca los extremos izquierdo y derecho del platillo inferior de la vértebra más inclinada caudalmente."
                ],
                tip: "Puedes medir múltiples curvas (Torácica Proximal, Torácica Principal y Toracolumbar/Lumbar). Se actualiza en vivo al usar el simulador de reducción coronal."
            },
            clavicle_angle: {
                name: "📐 C.A (Clavicle Angle / Ángulo Clavicular)",
                badge: "10. Plano Coronal • Balance de Hombros (Kuklo / Lenke)",
                steps: [
                    "**Punto 1 (Clavícula Izquierda):** Haz clic en el punto más cefálico (más alto) de la clavícula izquierda (donde cruza la jaula costal externa).",
                    "**Punto 2 (Clavícula Derecha):** Haz clic en el punto más alto de la clavícula derecha."
                ],
                tip: "Fundamento académico (Kuklo et al.): Mide el ángulo entre la línea tangente bi-clavicular y la horizontal. Es el predictor radiográfico más confiable del balance clínico de los hombros (Normal < 2° a 3°; positivo cuando el hombro izquierdo está elevado)."
            },
            osborne: {
                name: "📐 Osborne (Oblicuidad Pélvica / Ángulo Bi-Cresta Ilíaca)",
                badge: "10. Plano Coronal • Nivelación Pélvica Coronal",
                steps: [
                    "**Punto 1 (Cresta Ilíaca 1):** Haz clic en el punto más alto (cúpula) de la cresta ilíaca de un lado en la radiografía AP.",
                    "**Punto 2 (Cresta Ilíaca 2):** Haz clic en el punto más alto de la cresta ilíaca contralateral."
                ],
                tip: "Fundamento académico: Mide el ángulo de oblicuidad pélvica coronal respecto a la línea horizontal (y la asimetría en cm/px). Es clave para diferenciar oblicuidad pélvica suprapélvica (escoliosis neuromuscular/degenerativa) de discrepancia infrapélvica."
            },
            femoral_heads_cor: {
                name: "📐 CF (Cefálicas Femorales - Oblicuidad Bicoxofemoral AP)",
                badge: "10. Plano Coronal • Discrepancia de Miembros Inferiores",
                steps: [
                    "**Punto 1 (Cabeza Femoral 1):** Haz clic en el punto más superior (techo articular) de una cabeza femoral en la radiografía AP.",
                    "**Punto 2 (Cabeza Femoral 2):** Haz clic en el punto más superior de la cabeza femoral contralateral."
                ],
                tip: "Fundamento académico: Evalúa la inclinación de la línea inter-femoral respecto a la horizontal para cuantificar dismetría de miembros inferiores (LLD) y compararla con el ángulo de Osborne (asimetría intrínseca sacropélvica vs dismetría)."
            },

            // --- MÓDULO 11: CLASIFICACIÓN DE BAO (2016) ---
            bao_c7: {
                name: "📍 C7 (Plomada Coronal de C7 - Clasificación de Bao)",
                badge: "11. Clasificación de Bao (2016) • Plomada Coronal C7",
                steps: [
                    "**1 solo clic:** Haz clic en el **centro del cuerpo / proceso espinoso de C7** en la radiografía AP."
                ],
                tip: "Traza la línea de plomada coronal de C7. Una vez marcada también la CSVL en S1, el programa calcula la desviación coronal en centímetros."
            },
            bao_csvl: {
                name: "📍 CSVL (Center Sacral Vertical Line - Línea Media S1)",
                badge: "11. Clasificación de Bao (2016) • Línea Vertical Centro-Sacra",
                steps: [
                    "**1 solo clic:** Haz clic en el **centro del platillo superior de S1** (entre ambos pedículos de S1) en la radiografía AP."
                ],
                tip: "Traza la Línea Vertical Centro-Sacra (CSVL), referencia fundamental para identificar la vértebra estable (SV) y cuantificar el desbalance coronal C7-CSVL."
            },
            bao_eval: {
                name: "⚖️ Evaluar Bao (Coronal) - Clasificación de Bao (2016)",
                badge: "11. Clasificación de Bao (2016) • Riesgo de Descompensación Coronal",
                steps: [
                    "**Requisitos previos:** Haber marcado **📍 C7**, **📍 CSVL** y el **Ángulo Cobb Coronal**.",
                    "**Evaluación Automática:** Cruza la distancia horizontal C7-CSVL con la orientación de la convexidad/concavidad de la curva escoliótica principal."
                ],
                tip: "Clasificación de Bao et al. (Eur Spine J, 2016) y Obeid (2019):\n• **Tipo A (Balanceado):** Distancia C7-CSVL < 3 cm.\n• **Tipo B (Shift hacia la Concavidad):** C7-CSVL > 3 cm desplazada hacia el lado **cóncavo** de la curva lumbar.\n• **Tipo C (Shift hacia la Convexidad):** C7-CSVL > 3 cm desplazada hacia el lado **convexo** de la curva principal. ⚠️ Alto riesgo de empeorar el desbalance coronal al corregir la curva si no se nivela la unión lumbosacra (L4-S1) con osteotomía o liberación."
            },

            // --- MÓDULO 12: ESPONDILOLISTESIS Y AO SPINE ---
            meyerding: {
                name: "🦴 Espondilolistesis según Meyerding (Grados I al V)",
                badge: "12. Espondilolistesis y AO • Porcentaje de Traslación Vertebral",
                steps: [
                    "**Puntos 1 y 2 (Platillo de la Vértebra Inferior, ej. S1):** Haz clic en el **borde posterior** y luego en el **borde anterior** del platillo superior de la vértebra inferior (S1 o nivel subyacente).",
                    "**Punto 3 (Muro Posterior de la Vértebra Desplazada, ej. L5):** Haz clic en la **esquina posteroinferior** del cuerpo vertebral deslizado."
                ],
                tip: "Clasificación de Meyerding (1932) por porcentaje de deslizamiento:\n• **Grado I:** 0% a 25%.\n• **Grado II:** 26% a 50% (Bajo grado: Grados I y II).\n• **Grado III:** 51% a 75% (Alto grado: > 50%).\n• **Grado IV:** 76% a 100%.\n• **Grado V (Espondiloptosis):** > 100% (caída completa del cuerpo vertebral por delante del sacro)."
            },
            ao_spine: {
                name: "📐 Parámetros AO Spine (Cifosis Postraumática / Compresión / Traslación)",
                badge: "12. Espondilolistesis y AO • Deformidad Traumática AO Spine",
                steps: [
                    "**Para Cifosis Regional / Local AO (4 puntos):** Marca el **platillo superior de la vértebra intacta craneal** (Puntos 1 y 2) y el **platillo inferior de la vértebra intacta caudal** a la fractura (Puntos 3 y 4).",
                    "**Para Acuñamiento / Altura Vertebral o Traslación:** Marca los bordes del cuerpo vertebral fracturado según te indique la barra de estado superior."
                ],
                tip: "Fundamento académico (AO Spine Thoracolumbar Injury Classification): Una cifosis regional traumática > 15° a 20°, un acuñamiento del cuerpo vertebral > 50% o la traslación vertebral (Tipo C) son determinantes biomecánicos de fallo del complejo ligamentario e indicación de estabilización quirúrgica."
            }
        },
        en: {
            calibrate: {
                name: "📏 Calibrate Radiographic Scale (cm)",
                badge: "1. Basic Tools • Real Metric Scale",
                steps: [
                    "**Point 1:** Click the start of the radiographic ruler or marker.",
                    "**Point 2:** Click the end of the known segment (e.g., 5 cm or 10 cm) and enter its value in cm."
                ],
                tip: "Converts SVA, cSVA, Bao coronal plumbline, rods, and pedicle screw lengths into real centimeters."
            },
            line: {
                name: "📏 Simple Line (Linear Distance)",
                badge: "1. Basic Tools • Anatomical Length",
                steps: [
                    "**Point 1:** Click the starting anatomical landmark.",
                    "**Point 2:** Click the ending landmark."
                ],
                tip: "Displays distance in cm when calibrated, or pixels (px) otherwise."
            },
            circle: {
                name: "⭕ Circle (Anatomical Reference)",
                badge: "1. Basic Tools • Spherical Geometry",
                steps: [
                    "**Point 1 (Center):** Click the center of the femoral head or circular structure.",
                    "**Point 2 (Radius):** Click the outer margin to set the diameter."
                ],
                tip: "Drag the center or edge point at any time to adjust."
            },
            cobb: {
                name: "📐 Free Cobb Angle (Sagittal)",
                badge: "1. Basic Tools • Intervertebral Angle",
                steps: [
                    "**Points 1 & 2 (Upper Endplate):** Click the anterior and posterior corners of the superior endplate.",
                    "**Points 3 & 4 (Lower Endplate):** Click the anterior and posterior corners of the inferior endplate."
                ],
                tip: "Drag any of the 4 points afterward to refine alignment."
            },
            tk: {
                name: "📐 Tk - Thoracic Kyphosis (T4 - T12)",
                badge: "1. Basic Tools • Thoracic Kyphosis",
                steps: [
                    "**Points 1 & 2 (T4 Upper Endplate):** Click the anterior and posterior corners of the **T4** superior endplate.",
                    "**Points 3 & 4 (T12 Lower Endplate):** Click the anterior and posterior corners of the **T12** inferior endplate."
                ],
                tip: "Normal physiological range is 20° to 40°. Required for Abelin-Genevois sagittal profiling and the theoretical ideal table."
            },
            pelvis: {
                name: "🦴 Measure PI, PT & SS (Pelvic Parameters)",
                badge: "2. Pelvic Parameters • Spinopelvic Base (Legaye / Dubousset)",
                steps: [
                    "**Point 1 (Femoral Head 1):** Click the center of the first femoral head.",
                    "**Point 2 (Femoral Head 2):** Click the center of the second femoral head (click the same center if overlapped).",
                    "**Point 3 (Anterior S1):** Click the anterosuperior corner of **S1** (sacral promontory).",
                    "**Point 4 (Posterior S1):** Click the posterosuperior corner of the **S1** endplate."
                ],
                tip: "Computes PI, PT, and SS (PI = PT + SS) and unlocks L1-PA, T4-PA, Global Tilt, GAP Score, Roussouly, and Abelin-Genevois."
            },
            l1_pa: {
                name: "🎯 L1-PA (L1 Pelvic Angle)",
                badge: "3. Sagittal Balance • Lumbar Proportionality",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the L1 vertebral body**."
                ],
                tip: "Angle between L1 center, S1 endplate center, and bicoxofemoral axis (Ideal = 0.5 × PI - 19°)."
            },
            t4_pa: {
                name: "🎯 T4-PA (T4 Pelvic Angle)",
                badge: "3. Sagittal Balance • Thoracolumbar Harmony (Hills / Lenke)",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the T4 vertebral body**."
                ],
                tip: "Maintaining a T4-L1 PA Mismatch < 3° to 5° minimizes proximal junctional kyphosis (PJK) risk."
            },
            c7_pa: {
                name: "🎯 C7-PA (C7 Pelvic Angle)",
                badge: "3. Sagittal Balance • Global Angular Alignment",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the C7 vertebral body**."
                ],
                tip: "Connects C7 to the S1 endplate center and femoral heads."
            },
            c2_pa: {
                name: "🎯 C2-PA (C2 Pelvic Angle)",
                badge: "3. Sagittal Balance • Craniocervical Alignment",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the C2 body/dens**."
                ],
                tip: "Evaluates full-body spinopelvic alignment from C2 to the femoral heads."
            },
            l1_tilt: {
                name: "🧭 L1 Tilt (Sagittal L1 Inclination)",
                badge: "3. Sagittal Balance • Vertical Orientation",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the L1 body**.",
                    "**Without Pelvis:** Click the center of L1 and then the S1 endplate center."
                ],
                tip: "Measures the inclination of the S1-L1 line relative to the vertical axis."
            },
            t4_tilt: {
                name: "🧭 T4 Tilt (Sagittal T4 Inclination)",
                badge: "3. Sagittal Balance • Vertical Orientation",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the T4 body**.",
                    "**Without Pelvis:** Click the center of T4 and then the S1 endplate center."
                ],
                tip: "Measures thoracolumbar inclination from S1 relative to the vertical."
            },
            c7_tilt: {
                name: "🧭 C7 Tilt (Sagittal C7 Inclination)",
                badge: "3. Sagittal Balance • Global Trunk Tilt",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the C7 body**.",
                    "**Without Pelvis:** Click the center of C7 and then the S1 endplate center."
                ],
                tip: "Scale-free angular equivalent of the C7 plumbline; directly contributes to Global Tilt (GT)."
            },
            c2_tilt: {
                name: "🧭 C2 Tilt (Sagittal C2 Inclination)",
                badge: "3. Sagittal Balance • Gaze Axis Inclination",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the C2 body/dens**.",
                    "**Without Pelvis:** Click the center of C2 and then the S1 endplate center."
                ],
                tip: "Ideal range is +1° to -3°. Updates dynamically during osteotomy closure."
            },
            sva: {
                name: "📍 SVA (Sagittal Vertical Axis - C7 to S1)",
                badge: "3. Sagittal Balance • Global Translation",
                steps: [
                    "**Point 1 (C7):** Click the **center of the C7 vertebral body**.",
                    "**Point 2 (S1):** Click the **posterosuperior corner of the S1 endplate**."
                ],
                tip: "Schwab classification: SVA < 4 cm normal; 4-9.5 cm moderate; > 9.5 cm severe sagittal malalignment."
            },
            gt: {
                name: "📐 Global Tilt (GT - Obeid / Boissière Angle)",
                badge: "3. Sagittal Balance • Automatic / 1-Click Parameter",
                steps: [
                    "**Automatic Mode:** If **Pelvis** and **C7** are already marked, clicking this button automatically traces and calculates **Global Tilt (GT)**.",
                    "**1-Click Mode:** If only Pelvis is measured, click this button and then click **once on the center of C7**."
                ],
                tip: "Combines trunk inclination (C7 Tilt) and pelvic retroversion (PT) into one angle (GT ≈ C7 Tilt + PT). Ideal: GT ≈ 0.48 × PI - 15°."
            },
            l1_s1: {
                name: "📐 Global Lordosis (L1-S1)",
                badge: "4. Lumbar Measurements • Total Lumbar Lordosis (LL)",
                steps: [
                    "**Points 1 & 2 (L1 Upper Endplate):** Click the anterior and posterior corners of the **L1** superior endplate.",
                    "**Points 3 & 4 (S1 Upper Endplate):** Click the anterior and posterior corners of the **S1** endplate."
                ],
                tip: "Computes ideal proportional lordosis (Ideal LL = 0.6 × PI + 30°) and feeds GAP Score, Roussouly, and Abelin-Genevois."
            },
            l4_s1: {
                name: "📐 Lower LL (L4-S1) / Distal Lordosis",
                badge: "4. Lumbar Measurements • Lower Lumbar Arc",
                steps: [
                    "**Points 1 & 2 (L4 Upper Endplate):** Click the anterior and posterior corners of the **L4** superior endplate.",
                    "**Points 3 & 4 (S1 Upper Endplate):** Click the anterior and posterior corners of the **S1** endplate."
                ],
                tip: "L4-S1 should represent 50% to 80% of total lordosis (ideal 35°-40°) and powers the LDI in GAP Score."
            },
            l4_l5: {
                name: "📐 Segmental (L4-L5)",
                badge: "4. Lumbar Measurements • L4-L5 Segment",
                steps: [
                    "**Points 1 & 2:** Click the anterior and posterior corners of the **L4** superior endplate.",
                    "**Points 3 & 4:** Click the anterior and posterior corners of the **L5** inferior endplate."
                ],
                tip: "Quantifies segmental lordosis at L4-L5."
            },
            theory_ideal: {
                name: "📊 Calculate / Compare Values (Theoretical Ideal Profile)",
                badge: "5. Theoretical Ideal Profile • Automatic Biomechanical Summary",
                steps: [
                    "**Automatic Action:** Compiles all parameters into **Base (Pre-Op)**, **Ideal (PI-based)**, and **Achieved (Simulated / Post-Op)** columns, including T4-L1 PA Mismatch."
                ],
                tip: "Verify that your simulated surgical plan brings all parameters within patient-specific ideal targets."
            },
            gap_score: {
                name: "⚖️ GAP Score (Yilgor et al., 2017)",
                badge: "5. Theoretical Ideal Profile • Spinopelvic Proportionality",
                steps: [
                    "**Prerequisites:** Measure **PI/PT/SS**, **L1-S1**, **L4-S1**, and **Global Tilt (GT)**.",
                    "**Automatic Scoring (0-13 pts):** Evaluates RPV, RLL, LDI, and RSA adjusted for age."
                ],
                tip: "Mechanical failure risk: • **0-2 pts (🟢 Proportioned):** ~6% risk. • **3-6 pts (🟡 Moderate):** ~47% risk. • **≥ 7 pts (🔴 Severe):** ~95% risk."
            },
            cervical_set: {
                name: "🎯 T1S, TIA, NT (Cervicothoracic Inlet Set)",
                badge: "6. Cervical Sagittal Profile • Thoracic Inlet (Lee et al.)",
                steps: [
                    "**Points 1 & 2 (T1 Upper Endplate):** Click the anterior and posterior corners of the **T1** superior endplate (computes **T1 Slope - T1S**).",
                    "**Point 3 (Sternal Tip):** Click the superior tip of the manubrium sterni.",
                    "**Automatic Set Calculation:** Simultaneously computes **T1S**, **NT** (Neck Tilt), and **TIA** (Thoracic Inlet Angle)."
                ],
                tip: "Academic principle (Lee et al.): **TIA = T1S + NT**. Thoracic Inlet Angle (TIA) is the morphological constant governing cervical sagittal alignment."
            },
            c0_c2: {
                name: "📐 C0-C2 (Occipitocervical Angle)",
                badge: "6. Cervical Sagittal Profile • Upper Cervical",
                steps: [
                    "**Points 1 & 2 (McGregor Line - C0):** Mark the posterior hard palate and lowest point of the occiput.",
                    "**Points 3 & 4 (C2 Lower Endplate):** Mark the anterior and posterior corners of the **C2** inferior endplate."
                ],
                tip: "Accounts for ~75% of total cervical lordosis (normal 15° to 25°)."
            },
            c2_c7: {
                name: "📐 C2-C7 (Subaxial Cervical Lordosis)",
                badge: "6. Cervical Sagittal Profile • C2-C7 Curve",
                steps: [
                    "**Points 1 & 2 (C2):** Mark the anterior and posterior corners of the **C2** inferior endplate.",
                    "**Points 3 & 4 (C7):** Mark the anterior and posterior corners of the **C7** inferior endplate."
                ],
                tip: "Governed by T1 Slope; **T1S - CL should remain < 15° to 20°** for horizontal gaze."
            },
            csva: {
                name: "📍 cSVA (Cervical C2-C7 Plumbline)",
                badge: "6. Cervical Sagittal Profile • Cervical Translation",
                steps: [
                    "**Point 1 (C2):** Click the **center of the C2 dens/body**.",
                    "**Point 2 (C7):** Click the **posterosuperior corner of C7**."
                ],
                tip: "A cSVA > 4 cm strongly correlates with cervical disability."
            },
            osteotomy: {
                name: "✂️ 1. Place Corrective Osteotomy (Trace Wedge)",
                badge: "7. Corrective Osteotomies • Manual Wedge Tracing",
                steps: [
                    "**Point 1 (Upper Cut):** Click the anterior vertebral cortex at the upper edge.",
                    "**Point 2 (Hinge / Apex):** Click the posterior vertebral wall.",
                    "**Point 3 (Lower Cut):** Click the anterior cortex below Point 1."
                ],
                tip: "Place multiple cuts if needed and drag vertices to refine."
            },
            ost_sim: {
                name: "✂️ 2. Simulate Wedge Closure (Live Kinematics)",
                badge: "7. Corrective Osteotomies • Automatic Simulation",
                steps: [
                    "**Automatic Action:** Folds the radiograph around each osteotomy hinge, rotating the cranial spine, screws, rods, and alignment values."
                ],
                tip: "Recalculates postoperative SVA, PT, SS, LL, L1-PA, T4-PA, GT, and GAP Score live."
            },
            ost_modal: {
                name: "⚙️ 3. Adjust Degrees & Schwab Classification (1-6)",
                badge: "7. Corrective Osteotomies • Anatomical Grades",
                steps: [
                    "**Schwab Grades (2014):** Grade 1 (SPO ~10°), Grade 2 (Ponte ~15°), Grade 3 (PSO ~30°), Grade 4 (Ext. PSO ~40°), Grade 5 (VCR ~50°), Grade 6 (>60°)."
                ],
                tip: "Fine-tune exact correction degrees with the slider."
            },
            rod_sagittal: {
                name: "🔩 1. Sagittal Pedicle Screws & Rod",
                badge: "7B. Instrumentation • Profile with cm Sizing",
                steps: [
                    "**Place Screws:** Click each pedicle.",
                    "**Finish Rod:** Double-click the last screw.",
                    "**Size Screw Length (cm):** Drag the **yellow tip** of any screw to the anterior cortex."
                ],
                tip: "Displays exact screw length in centimeters."
            },
            rod_coronal: {
                name: "🔩 2. Coronal AP Rods (2 Sides)",
                badge: "7B. Instrumentation • Bilateral AP Construct",
                steps: [
                    "**Trace both sides:** Click pedicles on one side and double-click to finish; repeat for the opposite side."
                ],
                tip: "Unlocks the Coronal Reduction & Derotation simulator."
            },
            rod_panel: {
                name: "📐 3. Coronal Correction AP & Derotation Prognosis",
                badge: "7B. Instrumentation • Automatic AP Simulator",
                steps: [
                    "**Reduction Slider (0-100%):** Simulates translation to the rods and calculates corrected Cobb and apical derotation."
                ],
                tip: "Couples coronal straightening with axial derotation."
            },
            roussouly_apex: {
                name: "📍 Lumbar Apex (Apex L - Roussouly)",
                badge: "8. Roussouly Classification • Lordotic Apex",
                steps: [
                    "**Single Click:** Click the **most anterior point of the lumbar lordosis** (usually between L3 and L5)."
                ],
                tip: "Defines the apex dividing the upper and lower lumbar arcs."
            },
            roussouly_inflection: {
                name: "📍 Inflection Point (Roussouly)",
                badge: "8. Roussouly Classification • Thoracolumbar Transition",
                steps: [
                    "**Single Click:** Click the transition point where **thoracic kyphosis turns into lumbar lordosis** (usually T12 to L2)."
                ],
                tip: "Determines the functional length of the lumbar lordosis."
            },
            roussouly_eval: {
                name: "🏛️ Evaluate Roussouly Classification (Types 1 to 4)",
                badge: "8. Roussouly Classification • Spinopelvic Morphotype",
                steps: [
                    "**Prerequisites:** Measure **PI, PT, SS**, **L1-S1**, **Apex L**, and **Inflection Point** first.",
                    "**Automatic Classification:** Identifies Type 1, Type 2, Type 3, Type 3AP, or Type 4."
                ],
                tip: "Guides restoration of the patient's native sagittal apex and inflection point."
            },
            cobb_tl: {
                name: "📐 TL Cobb Angle (Thoracolumbar T10 - L2)",
                badge: "9. Scoliosis Sagittal Adaptation • Thoracolumbar Junction",
                steps: [
                    "**Points 1 & 2 (T10 Upper Endplate):** Mark the anterior and posterior corners of **T10**.",
                    "**Points 3 & 4 (L2 Lower Endplate):** Mark the anterior and posterior corners of **L2**."
                ],
                tip: "Identifies thoracolumbar kyphosis (Type 2b in Abelin-Genevois)."
            },
            c7_slope: {
                name: "📐 C7 Slope (C7S)",
                badge: "9. Scoliosis Sagittal Adaptation • Cervicothoracic Slope",
                steps: [
                    "**Points 1 & 2 (C7 Endplate):** Click the posterior and anterior corners of the **C7** endplate."
                ],
                tip: "Governs cervical alignment in Adolescent Idiopathic Scoliosis (Abelin-Genevois)."
            },
            abelin_genevois: {
                name: "🧬 Evaluate Abelin-Genevois (AIS Sagittal Profile)",
                badge: "9. Scoliosis Sagittal Adaptation • Abelin-Genevois (2018)",
                steps: [
                    "**Automatic Evaluation:** Integrates **PI, SS, TK (T4-T12), LL (L1-S1), TL Cobb (T10-L2)**, and **C7 Slope (C7S)**.",
                    "**Classification:** Categorizes AIS sagittal profile into **Type 1 (Normal)**, **Type 2a (Isolated Hypokyphosis)**, **Type 2b (Hypokyphosis + TL Kyphosis)**, or **Type 3 (Cervicothoracic Kyphosis)**."
                ],
                tip: "Provides the theoretical postoperative sagittal profile target in Adolescent Idiopathic Scoliosis."
            },
            cobb_coronal: {
                name: "📐 Coronal Cobb Angle (AP Scoliosis)",
                badge: "10. Coronal Plane • Scoliotic Curve Magnitude",
                steps: [
                    "**Points 1 & 2 (UIV):** Click the left and right corners of the upper end vertebra's superior endplate.",
                    "**Points 3 & 4 (LIV):** Click the left and right corners of the lower end vertebra's inferior endplate."
                ],
                tip: "Updates dynamically during AP rod reduction simulation."
            },
            clavicle_angle: {
                name: "📐 C.A (Clavicle Angle - Shoulder Balance)",
                badge: "10. Coronal Plane • Radiographic Shoulder Balance (Kuklo)",
                steps: [
                    "**Point 1 (Left Clavicle):** Click the highest point of the left clavicle (where it intersects the outer rib cage).",
                    "**Point 2 (Right Clavicle):** Click the highest point of the right clavicle."
                ],
                tip: "Measures the angle between the bi-clavicular line and the horizontal (normal < 2°-3°)."
            },
            osborne: {
                name: "📐 Osborne (Pelvic Obliquity / Bi-Iliac Crest Angle)",
                badge: "10. Coronal Plane • Coronal Pelvic Obliquity",
                steps: [
                    "**Point 1 (Iliac Crest 1):** Click the highest point of the left iliac crest on the AP radiograph.",
                    "**Point 2 (Iliac Crest 2):** Click the highest point of the right iliac crest."
                ],
                tip: "Measures coronal pelvic obliquity relative to the horizontal axis."
            },
            femoral_heads_cor: {
                name: "📐 CF (Femoral Heads Coronal Obliquity)",
                badge: "10. Coronal Plane • Leg Length Discrepancy (LLD)",
                steps: [
                    "**Point 1 (Femoral Head 1):** Click the superior roof of the left femoral head on the AP view.",
                    "**Point 2 (Femoral Head 2):** Click the superior roof of the right femoral head."
                ],
                tip: "Quantifies inter-femoral tilt and leg length discrepancy relative to the horizontal."
            },
            bao_c7: {
                name: "📍 C7 (Coronal C7 Plumbline - Bao Classification)",
                badge: "11. Bao Classification (2016) • C7 Plumbline",
                steps: [
                    "**Single Click:** Click the **center of the C7 vertebral body/spinous process** on the AP radiograph."
                ],
                tip: "Sets the coronal C7 plumbline to measure offset against CSVL."
            },
            bao_csvl: {
                name: "📍 CSVL (Center Sacral Vertical Line - S1)",
                badge: "11. Bao Classification (2016) • Sacral Midline",
                steps: [
                    "**Single Click:** Click the **center of the S1 superior endplate** on the AP radiograph."
                ],
                tip: "Establishes the Center Sacral Vertical Line (CSVL)."
            },
            bao_eval: {
                name: "⚖️ Evaluate Bao (Coronal Alignment Classification, 2016)",
                badge: "11. Bao Classification (2016) • Coronal Decompensation Risk",
                steps: [
                    "**Prerequisites:** Mark **📍 C7**, **📍 CSVL**, and the **Coronal Cobb Angle**.",
                    "**Automatic Classification:** Classifies into **Type A (< 3 cm)**, **Type B (> 3 cm shift toward concavity)**, or **Type C (> 3 cm shift toward convexity)**."
                ],
                tip: "Type C curves carry the highest risk of postoperative coronal decompensation."
            },
            meyerding: {
                name: "🦴 Spondylolisthesis - Meyerding Grading (Grades I to V)",
                badge: "12. Spondylolisthesis & AO • Anterior Translation Percentage",
                steps: [
                    "**Points 1 & 2 (Lower Vertebra Endplate, e.g., S1):** Click the **posterior corner** and **anterior corner** of the inferior vertebra's upper endplate.",
                    "**Point 3 (Slipped Vertebra, e.g., L5):** Click the **posteroinferior corner** of the slipped upper vertebra."
                ],
                tip: "Meyerding Classification (1932): Grade I (0-25%), Grade II (26-50%), Grade III (51-75%), Grade IV (76-100%), Grade V / Spondyloptosis (>100%)."
            },
            ao_spine: {
                name: "📐 AO Spine Parameters (Post-Traumatic Kyphosis / Compression)",
                badge: "12. Spondylolisthesis & AO • AO Spine Trauma Assessment",
                steps: [
                    "**Regional / Local Kyphosis (4 points):** Mark the **superior endplate of the intact cranial vertebra** and **inferior endplate of the intact caudal vertebra**.",
                    "**Vertebral Compression / Translation:** Mark the anterior and posterior vertebral body heights as prompted."
                ],
                tip: "Evaluates post-traumatic kyphosis (>15°-20°) and vertebral body collapse (>50%) per AO Spine criteria."
            }
        }
    };

    // 2. CLASIFICADOR EXHAUSTIVO QUE CONOCE EL BOTÓN Y SU MÓDULO (NUNCA SE QUEDA PEGADO)
    function classifyButtonAndModule(btnText, onclickStr, i18nStr, moduleTitle) {
        const s = `${btnText || ''} ${onclickStr || ''} ${i18nStr || ''}`.toLowerCase();
        const mod = (moduleTitle || '').toLowerCase();

        // --- MÓDULO 12: ESPONDILOLISTESIS Y AO ---
        if (s.includes('meyerding') || s.includes('listesis') || s.includes('spondylo')) return 'meyerding';
        if (/\bao\b/.test(s) || s.includes('ao spine') || s.includes('aospine') || s.includes('trauma') || s.includes('compresión') || s.includes('compresion') || (mod.includes('12') && !s.includes('meyerding'))) {
            return 'ao_spine';
        }

        // --- MÓDULO 11: CLASIFICACIÓN DE BAO (2016) ---
        if (s.includes('evaluar bao') || s.includes('evaluate bao') || s.includes('evalbao') || s.includes('classifybao') || (s.includes('bao') && !s.includes('c7') && !s.includes('csvl') && !s.includes('s1'))) {
            return 'bao_eval';
        }
        if (s.includes('csvl') || (mod.includes('bao') && s.includes('s1')) || s.includes('baos1')) return 'bao_csvl';
        if ((mod.includes('bao') && s.includes('c7')) || s.includes('baoc7')) return 'bao_c7';

        // --- MÓDULO 10: PLANO CORONAL (C.A, OSBORNE, CF, COBB CORONAL) ---
        if (/\bc\.a\b/.test(s) || /\bca\b/.test(btnText.toLowerCase().trim()) || s.includes('clavic') || s.includes('clavícula') || s.includes('hombro')) {
            return 'clavicle_angle';
        }
        if (s.includes('osborne') || s.includes('cresta') || s.includes('iliac') || s.includes('oblicuidad')) {
            return 'osborne';
        }
        if (/\bcf\b/.test(s) || s.includes('cefálicas') || s.includes('cefalicas') || (mod.includes('coronal') && s.includes('femoral'))) {
            return 'femoral_heads_cor';
        }
        if (s.includes('cobb_coronal') || s.includes('coronal cobb') || (mod.includes('coronal') && s.includes('cobb'))) {
            return 'cobb_coronal';
        }

        // --- MÓDULO 9: ADAPTACIÓN SAGITAL ESCOLIOSIS (ABELIN-GENEVOIS, COBB TL, C7S) ---
        if (s.includes('abelin') || s.includes('genevois')) return 'abelin_genevois';
        if (s.includes('cobb tl') || s.includes('cobb_tl') || s.includes('tl cobb') || s.includes('t10-l2') || s.includes('toracolumbar')) return 'cobb_tl';
        if (s.includes('c7s') || s.includes('pendiente c7') || s.includes('c7 slope') || s.includes('c7_slope')) return 'c7_slope';

        // --- MÓDULO 8: CLASIFICACIÓN DE ROUSSOULY ---
        if (s.includes('inflex') || s.includes('inflection')) return 'roussouly_inflection';
        if (s.includes('apex') || s.includes('ápex') || s.includes('vertice') || s.includes('vértice')) return 'roussouly_apex';
        if (s.includes('roussouly')) return 'roussouly_eval';

        // --- MÓDULO 7 Y 7B: OSTEOTOMÍAS E IMPLANTES ---
        if (s.includes('toggleostsim') || s.includes('simular cierre') || s.includes('wedge closure')) return 'ost_sim';
        if (s.includes('showostmodal') || s.includes('ajustar grados') || s.includes('adjust degrees')) return 'ost_modal';
        if (s.includes('showrodpanel') || s.includes('corrección coronal') || s.includes('coronal correction')) return 'rod_panel';
        if (s.includes('rod') || s.includes('barra') || s.includes('startorfinishrod')) {
            return (s.includes('coronal') || s.includes('ap ') || s.includes('2 lado') || s.includes('2 side')) ? 'rod_coronal' : 'rod_sagittal';
        }
        if (s.includes('osteo') || s.includes('schwab') || s.includes('cuña') || s.includes('wedge')) return 'osteotomy';

        // --- MÓDULO 6: PERFIL SAGITAL CERVICAL (T1S, TIA, NT, C0-C2, C2-C7, cSVA) ---
        if (s.includes('t1s') || s.includes('tia') || s.includes('t1a') || /\bnt\b/.test(s) || s.includes('conjunto') || s.includes('inlet')) {
            return 'cervical_set';
        }
        if (s.includes('c0-c2') || s.includes('c0_c2') || s.includes('mcgregor') || s.includes('occip')) return 'c0_c2';
        if (s.includes('c2-c7') || s.includes('c2_c7') || (mod.includes('cervical') && s.includes('cobb'))) return 'c2_c7';
        if (s.includes('csva') || s.includes('c2-c7 sva') || s.includes('c2 sva') || (mod.includes('cervical') && s.includes('sva'))) return 'csva';

        // --- MÓDULO 5: PERFIL TEÓRICO IDEAL Y GAP SCORE ---
        if (s.includes('gap score') || s.includes('showgapmodal') || s.includes('yilgor')) return 'gap_score';
        if (s.includes('calcular / comparar') || s.includes('calculate / compare') || s.includes('showresults') || s.includes('teórico') || s.includes('teorico')) {
            return 'theory_ideal';
        }

        // --- MÓDULO 4: MEDICIONES LUMBARES ---
        if (s.includes('lordosis global') || s.includes('l1-s1') || s.includes('l1_s1')) return 'l1_s1';
        if (s.includes('ll baja') || s.includes('l4-s1') || s.includes('l4_s1') || s.includes('lower ll')) return 'l4_s1';
        if (s.includes('segmentaria') || s.includes('l4-l5') || s.includes('l4_l5') || s.includes('segmental')) return 'l4_l5';

        // --- MÓDULO 3: BALANCE SAGITAL (PA, TILT, SVA, GT) ---
        if (s.includes('global tilt') || s.includes('calculateoractivategt') || /\bgt\b/.test(s)) return 'gt';
        if (s.includes('l1-pa') || s.includes('l1_pa') || s.includes('l1pa')) return 'l1_pa';
        if (s.includes('t4-pa') || s.includes('t4_pa') || s.includes('t4pa')) return 't4_pa';
        if (s.includes('c7-pa') || s.includes('c7_pa') || s.includes('c7pa')) return 'c7_pa';
        if (s.includes('c2-pa') || s.includes('c2_pa') || s.includes('c2pa')) return 'c2_pa';

        if (s.includes('l1 tilt') || s.includes('l1-tilt') || s.includes('l1_tilt')) return 'l1_tilt';
        if (s.includes('t4 tilt') || s.includes('t4-tilt') || s.includes('t4_tilt')) return 't4_tilt';
        if (s.includes('c7 tilt') || s.includes('c7-tilt') || s.includes('c7_tilt')) return 'c7_tilt';
        if (s.includes('c2 tilt') || s.includes('c2-tilt') || s.includes('c2_tilt')) return 'c2_tilt';
        if (s.includes('sva') || s.includes('plumbline') || s.includes('plomada')) return 'sva';

        // --- MÓDULO 2: PELVIS ---
        if (s.includes('pelv') || s.includes('pi, pt') || s.includes('pi,pt') || s.includes('pi_pt') || s.includes('spinopelv') || /\bpi\b/.test(s)) return 'pelvis';

        // --- MÓDULO 1: BÁSICAS ---
        if (s.includes('calibr')) return 'calibrate';
        if (s.includes('circle') || s.includes('círculo') || s.includes('circulo')) return 'circle';
        if (s.includes('simple line') || s.includes('línea simple') || s.includes('linea simple') || /\bline\b/.test(s)) return 'line';
        if (s.includes('tk') || s.includes('kypho') || s.includes('cifos') || s.includes('t4-t12') || s.includes('t1-t12')) return 'tk';
        if (s.includes('cobb')) return 'cobb';

        return null;
    }

    // Generador dinámico de respaldo si existiera cualquier otro botón adicional en el menú lateral
    function ensureDynamicGuideForSidebarButton(btn, keyCandidate) {
        if (keyCandidate && TOOL_GUIDES.es[keyCandidate]) return keyCandidate;

        const label = (btn.innerText || '').trim();
        if (!label) return null;

        const card = btn.closest('.border') || btn.parentElement;
        const modHeader = card ? (card.querySelector('div')?.innerText || '').trim() : 'Módulo Clínico';
        const dynKey = 'dyn_' + label.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

        if (!TOOL_GUIDES.es[dynKey]) {
            TOOL_GUIDES.es[dynKey] = {
                name: `📐 ${label}`,
                badge: `${modHeader} • Parámetro Clínico`,
                steps: [
                    `Selecciona **${label}** y sigue la instrucción paso a paso que aparece en la barra superior de estado (arriba a la izquierda del lienzo).`,
                    `Haz clic sobre las referencias anatómicas solicitadas en la radiografía para obtener el cálculo automático.`
                ],
                tip: `Puedes ajustar cualquiera de los puntos trazados arrastrándolos con el mouse o el dedo, o hacer clic derecho sobre su etiqueta para cambiar el tamaño o eliminar.`
            };
            TOOL_GUIDES.en[dynKey] = {
                name: `📐 ${label}`,
                badge: `${modHeader} • Clinical Parameter`,
                steps: [
                    `Select **${label}** and follow the step-by-step prompt shown in the top-left status bar.`,
                    `Click the requested anatomical landmarks on the radiograph to compute the value.`
                ],
                tip: `Drag any point afterward to fine-tune placement, or right-click its label to resize or delete.`
            };
        }
        return dynKey;
    }

    // 3. ESCUCHAR EN TIEMPO REAL TODOS LOS BOTONES DEL PANEL LATERAL (JAMÁS SE QUEDA PEGADO)
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('aside button, .tool-btn');
        if (!btn) return;
        const onclickStr = btn.getAttribute('onclick') || '';
        if (onclickStr.includes('clearAllRods')) return;

        const label = (btn.innerText || '').trim();
        const i18nStr = btn.getAttribute('data-i18n') || '';
        const card = btn.closest('.border') || btn.parentElement;
        const modHeader = card ? (card.querySelector('div')?.innerText || '').trim() : '';

        const matchedKey = classifyButtonAndModule(label, onclickStr, i18nStr, modHeader);
        const finalKey = ensureDynamicGuideForSidebarButton(btn, matchedKey);

        if (finalKey) {
            window._lastSelectedSidebarCtx = {
                key: finalKey,
                label: label,
                modHeader: modHeader
            };
            window._manualPreviewKey = null;
            setTimeout(updateHelpButtonBadge, 20);
        }
    }, true);

    if (typeof activateTool === 'function') {
        const origActivate = activateTool;
        activateTool = function(tool, title, subType) {
            const matchedKey = classifyButtonAndModule(title || '', tool || '', subType || '', '');
            if (matchedKey) {
                window._lastSelectedSidebarCtx = {
                    key: matchedKey,
                    label: title || (window._lastSelectedSidebarCtx ? window._lastSelectedSidebarCtx.label : tool)
                };
            }
            window._manualPreviewKey = null;
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

    const prevResetAll = typeof resetAllStudy === 'function' ? resetAllStudy : null;
    if (prevResetAll) {
        resetAllStudy = function(s) {
            window._lastSelectedSidebarCtx = null;
            window._manualPreviewKey = null;
            prevResetAll(s);
            updateHelpButtonBadge();
        };
    }

    // Escanear al inicio todos los botones del menú lateral para asegurar que el 100% esté en la enciclopedia
    function scanAllSidebarButtonsOnLoad() {
        const sidebar = document.querySelector('aside') || document.getElementById('sidebar');
        if (!sidebar) return;
        const buttons = Array.from(sidebar.querySelectorAll('button'));
        buttons.forEach(btn => {
            const onclickStr = btn.getAttribute('onclick') || '';
            if (onclickStr.includes('clearAllRods')) return;
            const label = (btn.innerText || '').trim();
            const i18nStr = btn.getAttribute('data-i18n') || '';
            const card = btn.closest('.border') || btn.parentElement;
            const modHeader = card ? (card.querySelector('div')?.innerText || '').trim() : '';
            const matchedKey = classifyButtonAndModule(label, onclickStr, i18nStr, modHeader);
            ensureDynamicGuideForSidebarButton(btn, matchedKey);
        });
    }

    function updateHelpButtonBadge() {
        const btn = document.getElementById('btn-top-help');
        if (!btn) return;
        const hasActive = Boolean(window._lastSelectedSidebarCtx) || (typeof activeTool !== 'undefined' && activeTool !== null && activeTool !== '');
        if (hasActive) {
            btn.className = "bg-amber-500 hover:bg-amber-400 text-gray-950 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-extrabold transition-all flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.65)] animate-pulse select-none shrink-0";
        } else {
            btn.className = "bg-sky-600/25 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/60 px-2.5 py-1 rounded-md text-xs font-bold transition-colors flex items-center justify-center shadow-sm select-none shrink-0";
        }
    }

    // 4. INYECTAR BOTÓN ❓ EN EL HEADER PRINCIPAL
    function injectHelpButton() {
        const headerEl = document.querySelector('header');
        const preOpBtn = document.querySelector('header button[onclick*="switchStage"]') ||
                         document.querySelector('button[onclick*="switchStage(\'pre\')"]') ||
                         document.getElementById('btn-stage-pre');

        let headerLangSelect = null;
        if (headerEl) headerLangSelect = headerEl.querySelector('select');
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
            ? 'Ayuda Clínica y Académica de Todos los Parámetros / Leyenda'
            : 'Clinical & Academic Parameter Guide / Icon Legend';

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

    // 5. MODAL DE AYUDA CONTEXTUAL Y ENCICLOPEDIA COMPLETA (MÓDULOS 1 AL 12)
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
                <button id="tab-btn-ctx" onclick="switchHelpTab('ctx')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">🎯 Parámetro Activo</button>
                <button id="tab-btn-ico" onclick="switchHelpTab('ico')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">🎛️ Iconos (11)</button>
                <button id="tab-btn-mod" onclick="switchHelpTab('mod')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">📚 Módulos (1-12)</button>
            </div>
            <div id="help-modal-content" class="p-4 overflow-y-auto space-y-3 flex-1"></div>
            <div class="bg-gray-950 px-4 py-2.5 border-t border-gray-800 flex justify-between items-center">
                <span id="help-footer-hint" class="text-[10px] text-gray-400">Selecciona cualquier parámetro del menú (1 al 12) y toca ❓.</span>
                <button onclick="document.getElementById('help-context-modal').classList.add('hidden')" id="help-close-btn" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors">Continuar</button>
            </div>
        </div>
    `;
    helpModal.addEventListener('click', function() { helpModal.classList.add('hidden'); });
    document.body.appendChild(helpModal);

    window.openContextualHelpModal = function() {
        scanAllSidebarButtonsOnLoad();
        window._manualPreviewKey = null;
        switchHelpTab('ctx');
        document.getElementById('help-context-modal').classList.remove('hidden');
    };

    window.selectToolGuideFromList = function(key) {
        window._manualPreviewKey = key;
        switchHelpTab('ctx');
    };

    window.switchHelpTab = function(tab) {
        const isEs = (typeof currentLang === 'undefined' || currentLang === 'es');
        const langKey = isEs ? 'es' : 'en';

        document.getElementById('help-modal-title').innerText = isEs ? 'Centro de Ayuda y Guía Clínica' : 'Clinical & Academic Help Center';
        document.getElementById('tab-btn-ctx').innerText = isEs ? '🎯 Parámetro Activo' : '🎯 Active Parameter';
        document.getElementById('tab-btn-ico').innerText = isEs ? '🎛️ Iconos (11)' : '🎛️ Icons (11)';
        document.getElementById('tab-btn-mod').innerText = isEs ? '📚 Módulos (1-12)' : '📚 Modules (1-12)';
        document.getElementById('help-footer-hint').innerText = isEs
            ? 'Selecciona cualquier botón del menú (Módulos 1 al 12) y toca ❓.'
            : 'Select any sidebar button (Modules 1 to 12) and tap ❓.';
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
            // Priorizar SIEMPRE el último botón tocado por el usuario en la barra lateral
            const selInfo = window._lastSelectedSidebarCtx;
            const shownKey = window._manualPreviewKey || (selInfo ? selInfo.key : null);
            const g = shownKey ? (TOOL_GUIDES[langKey][shownKey] || TOOL_GUIDES.es[shownKey]) : null;

            let html = '';
            if (g) {
                const isShowingSelected = Boolean(selInfo && (!window._manualPreviewKey || window._manualPreviewKey === selInfo.key));
                const statusBadge = isShowingSelected
                    ? (isEs ? `🟢 PARÁMETRO SELECCIONADO: ${selInfo.label}` : `🟢 SELECTED PARAMETER: ${selInfo.label}`)
                    : (isEs ? `📖 CONSULTA ACADÉMICA Y CLÍNICA` : `📖 ACADEMIC & CLINICAL REFERENCE`);
                const badgeCls = isShowingSelected ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/60" : "bg-sky-900/50 text-sky-300 border-sky-500/50";

                html += `
                    <div class="bg-gray-800/80 border border-sky-500/60 rounded-lg p-3.5 space-y-2.5 shadow-lg">
                        <div class="flex flex-wrap justify-between items-center gap-1">
                            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded border ${badgeCls}">${statusBadge}</span>
                            <span class="text-[10px] text-sky-300 font-semibold">${g.badge}</span>
                        </div>
                        <h4 class="text-sm font-bold text-white">${g.name}</h4>
                        <div class="space-y-1.5 pt-1 border-t border-gray-700">
                            <div class="text-[10px] font-bold uppercase text-sky-400">${isEs ? 'Cómo Medir / Cómo Funciona Paso a Paso:' : 'How to Measure / Step-by-Step Guide:'}</div>
                            <ol class="list-decimal list-inside space-y-1.5 text-gray-200 leading-relaxed whitespace-pre-line">
                                ${g.steps.map(s => `<li>${s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}</li>`).join('')}
                            </ol>
                        </div>
                        <div class="bg-sky-950/50 border border-sky-700/60 rounded p-2.5 text-[11px] text-sky-200 leading-relaxed whitespace-pre-line">
                            <strong class="text-sky-400">💡 ${isEs ? 'Fundamento Académico y Clínico:' : 'Academic & Clinical Principle:'}</strong> ${g.tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="bg-gray-800/60 border border-gray-700 rounded-lg p-3.5 text-center space-y-1">
                        <div class="text-base">👆</div>
                        <div class="font-bold text-white">${isEs ? 'Ningún parámetro seleccionado en este momento' : 'No parameter currently selected'}</div>
                        <p class="text-[11px] text-gray-400">${isEs ? 'Selecciona cualquier botón del menú lateral (Módulos 1 al 12) y toca ❓, o haz clic en cualquiera de la enciclopedia completa aquí abajo:' : 'Select any button in the sidebar (Modules 1 to 12) and tap ❓, or pick any item from the encyclopedia below:'}</p>
                    </div>
                `;
            }

            html += `
                <div class="pt-1">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1.5">${isEs ? 'Enciclopedia completa de parámetros (Módulos 1 al 12):' : 'Complete Parameter Encyclopedia (Modules 1 to 12):'}</div>
                    <div class="grid grid-cols-2 gap-1.5">
                        ${Object.keys(TOOL_GUIDES[langKey]).map(k => `
                            <button onclick="selectToolGuideFromList('${k}')" class="text-left px-2.5 py-1.5 rounded border ${k === shownKey ? 'bg-sky-900/50 border-sky-400 text-white font-bold' : 'bg-gray-800/70 border-gray-700 text-gray-300 hover:bg-gray-800'} text-[11px] truncate">
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
            box.innerHTML = `<div class="space-y-2">${icons.map(([ico, title, desc]) => `<div class="flex items-start space-x-3 bg-gray-800/60 border border-gray-700/80 rounded-lg p-2.5"><div class="text-base bg-gray-900 border border-gray-700 rounded px-2 py-1 shrink-0 font-bold">${ico}</div><div><div class="font-bold text-white text-xs">${title}</div><div class="text-[11px] text-gray-300 leading-snug mt-0.5">${desc}</div></div></div>`).join('')}</div>`;
        } else if (tab === 'mod') {
            const mods = isEs ? [
                ['Módulo 1 • Herramientas Básicas y Calibración', 'Calibración métrica en cm, líneas simples, círculos de referencia, ángulos de Cobb libres y Cifosis Torácica (Tk).'],
                ['Módulo 2 • Parámetros Pélvicos (PI, PT y SS)', 'Medición fundamental de cabezas femorales y platillo de S1. Desbloquea todos los cálculos automáticos del sistema.'],
                ['Módulo 3 • Balance Sagital Global y Proporcional', 'Ángulos pélvico-vertebrales (L1-PA, T4-PA, C7-PA, C2-PA), inclinaciones verticales (Tilts), Plomada SVA y Global Tilt (GT).'],
                ['Módulo 4 • Mediciones Lumbares Regionales', 'Lordosis Lumbar Global (L1-S1), Lordosis Lumbar Baja (L4-S1) y Lordosis Segmentaria (L4-L5).'],
                ['Módulo 5 • Perfil Teórico Ideal y GAP Score', 'Tabla comparativa automática (Base vs Ideal vs Logrado), Mismatch (T4PA - L1PA) y calculadora de GAP Score (Yilgor, 2017).'],
                ['Módulo 6 • Perfil Sagital Cervical', 'Conjunto cervicotorácico (T1 Slope, Thoracic Inlet Angle TIA y Neck Tilt NT), ángulos C0-C2, C2-C7 y plomada cSVA.'],
                ['Módulo 7 y 7B • Osteotomías de Schwab e Instrumentación', 'Trazado y cierre dinámico de osteotomías (Grados 1-6), tornillos sagitales medibles en cm y reducción de barras coronales AP.'],
                ['Módulo 8 • Clasificación de Roussouly', 'Marcaje del Ápex Lumbar, Punto de Inflexión y clasificación automática del morfotipo espinopélvico (Tipos 1, 2, 3, 3AP y 4).'],
                ['Módulo 9 • Adaptación Sagital en Escoliosis (Abelin-Genevois)', 'Medición del Ángulo Cobb Toracolumbar (TL), Pendiente C7 (C7S) y clasificación automática de Abelin-Genevois (Tipos 1, 2a, 2b y 3).'],
                ['Módulo 10 • Plano Coronal (Escoliosis y Pelvis AP)', 'Ángulo de Cobb Coronal, Ángulo Clavicular (C.A), Oblicuidad Pélvica de Osborne y Cefálicas Femorales (CF).'],
                ['Módulo 11 • Clasificación de Bao (2016)', 'Plomada Coronal de C7, Línea Vertical Centro-Sacra (CSVL) y clasificación del balance coronal global (Tipos A, B y C).'],
                ['Módulo 12 • Espondilolistesis (Meyerding) y AO Spine', 'Porcentaje y grado de traslación vertebral según Meyerding (Grados I al V) y evaluación de cifosis/compresión postraumática AO Spine.']
            ] : [
                ['Module 1 • Basic Tools & Calibration', 'Metric calibration in cm, simple lines, reference circles, free Cobb angles, and Thoracic Kyphosis (Tk).'],
                ['Module 2 • Pelvic Parameters (PI, PT & SS)', 'Core measurement of femoral heads and S1 endplate. Unlocks all automatic spinopelvic calculations.'],
                ['Module 3 • Sagittal Balance & Proportionality', 'Pelvic angles (L1-PA, T4-PA, C7-PA, C2-PA), vertical Tilts, SVA plumbline, and Global Tilt (GT).'],
                ['Module 4 • Regional Lumbar Measurements', 'Global Lumbar Lordosis (L1-S1), Lower Lumbar Arc (L4-S1), and Segmental Lordosis (L4-L5).'],
                ['Module 5 • Theoretical Ideal Profile & GAP Score', 'Automatic comparison table (Base vs Ideal vs Achieved), T4-L1 Mismatch, and GAP Score calculator (Yilgor, 2017).'],
                ['Module 6 • Cervical Sagittal Profile', 'Cervicothoracic inlet set (T1S, TIA, NT), C0-C2 angle, C2-C7 lordosis, and cervical cSVA.'],
                ['Module 7 & 7B • Schwab Osteotomies & Instrumentation', 'Dynamic osteotomy closure (Grades 1-6), sagittal pedicle screws with cm sizing, and AP rod scoliosis reduction.'],
                ['Module 8 • Roussouly Classification', 'Lumbar Apex, Inflection Point, and automatic Roussouly morphotype classification (Types 1, 2, 3, 3AP, and 4).'],
                ['Module 9 • Scoliosis Sagittal Adaptation (Abelin-Genevois)', 'Thoracolumbar Cobb (TL), C7 Slope (C7S), and automatic Abelin-Genevois classification (Types 1, 2a, 2b, and 3).'],
                ['Module 10 • Coronal Plane (AP Scoliosis & Pelvis)', 'Coronal Cobb Angle, Clavicle Angle (C.A), Osborne Pelvic Obliquity, and Femoral Heads (CF) tilt.'],
                ['Module 11 • Bao Classification (2016)', 'Coronal C7 plumbline, Center Sacral Vertical Line (CSVL), and global coronal balance classification (Types A, B, and C).'],
                ['Module 12 • Spondylolisthesis (Meyerding) & AO Spine', 'Meyerding slip percentage and grading (Grades I-V) and AO Spine post-traumatic kyphosis/compression assessment.']
            ];
            box.innerHTML = `<div class="space-y-2">${mods.map(([title, desc]) => `<div class="bg-gray-800/60 border border-gray-700/80 rounded-lg p-2.5"><div class="font-bold text-sky-400 text-xs">${title}</div><div class="text-[11px] text-gray-300 leading-relaxed mt-1">${desc}</div></div>`).join('')}</div>`;
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

    window.addEventListener('load', function() {
        injectHelpButton();
        scanAllSidebarButtonsOnLoad();
    });
    injectHelpButton();
})();
