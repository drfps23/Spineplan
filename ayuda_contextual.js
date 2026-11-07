// ============================================================================
// ACTUALIZACIÓN 5 V6 (ayuda_contextual.js): ENCICLOPEDIA CLÍNICA 100% SIN BACHES (❓)
// Cubre absolutamente todos los botones, módulos, T1S, T1A, NT, GAP y Perfil Teórico
// ============================================================================

(function() {
    window._lastSelectedSidebarCtx = null;
    window._manualPreviewKey = null;

    // 1. ENCICLOPEDIA CLÍNICA Y ACADÉMICA ABSOLUTA (SIN VACÍOS)
    const TOOL_GUIDES = {
        es: {
            calibrate: {
                name: "📏 Calibrar Escala Radiográfica (cm)",
                badge: "1. Herramientas Básicas • Escala Métrica Real",
                steps: [
                    "**Punto 1:** Haz clic en el extremo inicial del testigo métrico o regla visible en la radiografía.",
                    "**Punto 2:** Haz clic en el extremo final de la distancia conocida (ej. 5 cm o 10 cm) e ingresa el valor en centímetros."
                ],
                tip: "Fundamento: Elimina el sesgo de magnificación de los rayos X y convierte automáticamente el SVA, cSVA, las barras y la longitud de cada tornillo transpedicular a centímetros reales."
            },
            line: {
                name: "📏 Línea Simple (Medición Lineal)",
                badge: "1. Herramientas Básicas • Distancia Anatómica",
                steps: [
                    "**Punto 1:** Haz clic en la primera referencia anatómica.",
                    "**Punto 2:** Haz clic en la segunda referencia para obtener la distancia exacta."
                ],
                tip: "Muestra la longitud en centímetros (cm) si la placa está calibrada, o en píxeles (px)."
            },
            circle: {
                name: "⭕ Círculo (Referencia Anatómica / Cabeza Femoral)",
                badge: "1. Herramientas Básicas • Geometría Esférica",
                steps: [
                    "**Punto 1 (Centro):** Haz clic en el centro de la estructura esférica.",
                    "**Punto 2 (Contorno):** Haz clic en el borde externo para fijar el diámetro."
                ],
                tip: "Puedes arrastrar el centro o el borde del círculo en cualquier momento para ajustarlo con precisión."
            },
            cobb: {
                name: "📐 Ángulo de Cobb Libre",
                badge: "1. Herramientas Básicas • Ángulo Intervertebral",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior):** Marca el borde anterior y posterior del platillo vertebral superior.",
                    "**Puntos 3 y 4 (Platillo Inferior):** Marca el borde anterior y posterior del platillo vertebral inferior."
                ],
                tip: "Útil para medir cifosis segmentarias, acuñamientos vertebrales traumáticos o ángulos de transición."
            },
            tk: {
                name: "📐 Tk - Cifosis Torácica (T4 - T12)",
                badge: "1 y 4. Curvas Sagitales • Cifosis Torácica",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de T4):** Haz clic en el borde anterior y posterior del platillo superior de **T4**.",
                    "**Puntos 3 y 4 (Platillo Inferior de T12):** Haz clic en el borde anterior y posterior del platillo inferior de **T12**."
                ],
                tip: "Valor académico: El rango fisiológico normal es de 20° a 40°. Se integra en la tabla de resultados y se actualiza en vivo al cerrar osteotomías."
            },
            pelvis: {
                name: "🦴 Medir PI, PT y SS (Parámetros Espinopélvicos)",
                badge: "2. Parámetros Pélvicos • Base de Dubousset / Legaye",
                steps: [
                    "**Punto 1 (Cabeza Femoral 1):** Haz clic en el centro de la primera cabeza femoral.",
                    "**Punto 2 (Cabeza Femoral 2):** Haz clic en el centro de la segunda cabeza femoral.",
                    "**Punto 3 (Borde Anterior de S1):** Haz clic en el promontorio sacro (esquina anterosuperior de **S1**).",
                    "**Punto 4 (Borde Posterior de S1):** Haz clic en la esquina posterosuperior del platillo de **S1**."
                ],
                tip: "Valor académico: Cumple la ecuación geométrica PI = PT + SS. La Incidencia Pélvica (PI) es constante en el adulto y determina cuánta lordosis (LL) e inclinación necesita el paciente."
            },
            l1_pa: {
                name: "🎯 L1-PA (Ángulo Pélvico de L1)",
                badge: "3. Balance Sagital • Proporcionalidad Lumbar",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de L1**."
                ],
                tip: "Valor ideal: L1-PA = 0.5 × PI - 19°. No depende de la posición de la pelvis ni de la magnificación radiográfica."
            },
            t4_pa: {
                name: "🎯 T4-PA (Ángulo Pélvico Torácico de T4)",
                badge: "3. Balance Sagital • Armonía Espinopélvica (Hills / Lenke)",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de T4**."
                ],
                tip: "Valor académico: En una columna armónica, el T4-PA debe ser casi idéntico al L1-PA (Mismatch T4-L1 < 3° a 5° para prevenir PJK)."
            },
            c7_pa: {
                name: "🎯 C7-PA (Ángulo Pélvico de C7)",
                badge: "3. Balance Sagital • Alineación Global Angular",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de C7**."
                ],
                tip: "Une automáticamente C7 con el centro del platillo de S1 y las cabezas femorales."
            },
            c2_pa: {
                name: "🎯 C2-PA (Ángulo Pélvico de C2)",
                badge: "3. Balance Sagital • Alineación Craneocervical",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo/odontoides de C2**."
                ],
                tip: "Evalúa la alineación global desde C2 hasta la base pélvica."
            },
            l1_tilt: {
                name: "🧭 L1 Tilt (Inclinación Sagital de L1)",
                badge: "3. Balance Sagital • Orientación Vertical Lumbar",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de L1**.",
                    "**Sin Pelvis medida:** Marca el centro de L1 y luego el centro del platillo de S1."
                ],
                tip: "Mide la desviación angular de la línea S1-L1 respecto a la vertical gravitatoria."
            },
            t4_tilt: {
                name: "🧭 T4 Tilt (Inclinación Sagital de T4)",
                badge: "3. Balance Sagital • Orientación Vertical Torácica",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de T4**.",
                    "**Sin Pelvis medida:** Marca el centro de T4 y luego el centro del platillo de S1."
                ],
                tip: "Mide la inclinación del bloque toracolumbar respecto a la línea vertical."
            },
            c7_tilt: {
                name: "🧭 C7 Tilt (Inclinación Sagital Global de C7)",
                badge: "3. Balance Sagital • Inclinación del Tronco",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de C7**.",
                    "**Sin Pelvis medida:** Marca el centro de C7 y luego el centro del platillo de S1."
                ],
                tip: "Representa el ángulo de inclinación del tronco respecto a la vertical y contribuye al Global Tilt (GT) y GAP Score."
            },
            c2_tilt: {
                name: "🧭 C2 Tilt (Inclinación Sagital Global de C2)",
                badge: "3. Balance Sagital • Inclinación del Eje de la Mirada",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo/odontoides de C2**.",
                    "**Sin Pelvis medida:** Marca el centro de C2 y luego el centro del platillo de S1."
                ],
                tip: "Valor ideal entre +1° y -3°. Refleja la horizontalidad de la mirada y el balance cervical superior."
            },
            sva: {
                name: "📍 SVA (Sagittal Vertical Axis - Plomada C7 a S1)",
                badge: "3. Balance Sagital • Traslación Sagital Global",
                steps: [
                    "**Punto 1 (C7):** Haz clic en el **centro del cuerpo vertebral de C7**.",
                    "**Punto 2 (S1):** Haz clic en la **esquina posterosuperior del platillo de S1**."
                ],
                tip: "Clasificación de Schwab: SVA < 4 cm normal; 4-9.5 cm moderado; > 9.5 cm desbalance sagital severo."
            },
            gt: {
                name: "📐 Global Tilt (GT - Ángulo de Inclinación Global)",
                badge: "3. Balance Sagital • Parámetro Automático / Manual (Obeid)",
                steps: [
                    "**Cálculo Automático:** Si ya mediste la **Pelvis (PI, PT, SS)** y marcaste **C7**, el programa traza y calcula el **Global Tilt (GT)** automáticamente.",
                    "**Modo 1 Clic:** Si solo mediste la Pelvis, haz **1 clic en el centro del cuerpo de C7**."
                ],
                tip: "Fundamento académico (Obeid / Boissière): GT combina el desbalance espinal (C7 Tilt) y la compensación pélvica (PT) en un solo ángulo (GT ≈ C7 Tilt + PT). Ideal: GT ≈ 0.48 × PI - 15°."
            },
            l1_s1: {
                name: "📐 Lordosis Global (L1-S1) / L1-S1",
                badge: "4. Mediciones Lumbar / Regional • Lordosis Lumbar",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L1):** Marca el borde anterior y posterior del platillo superior de **L1**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Calcula la lordosis ideal proporcional (LL Ideal = 0.6 × PI + 30°) y evalúa el desajuste PI - LL para prevenir fallas mecánicas."
            },
            l4_s1: {
                name: "📐 LL Baja (L4-S1) / Lordosis Distal",
                badge: "4. Mediciones Lumbar • Arco Inferior Lumbar",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L4):** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "El arco L4-S1 aporta entre el 50% y 80% de la lordosis total (ideal 35°-40°). Alimenta el LDI (Índice de Distribución de Lordosis) del GAP Score."
            },
            l4_l5: {
                name: "📐 Segmentaria (L4-L5) / Ángulo Segmentario",
                badge: "4. Mediciones Lumbar • Segmento L4-L5",
                steps: [
                    "**Puntos 1 y 2:** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4:** Marca el borde anterior y posterior del platillo inferior de **L5**."
                ],
                tip: "Cuantifica la lordosis segmentaria de L4-L5 para la colocación de cajas intersomáticas o cirugías de revisión."
            },
            theory_ideal: {
                name: "📊 Calcular / Comparar Valores (Perfil Teórico Ideal / Abelin-Genevois)",
                badge: "5. Perfil Teórico Ideal • Tabla Comparativa y Mismatch",
                steps: [
                    "**Acción Automática:** Compila instantáneamente todos los parámetros basales del paciente y los cruza con los perfiles teóricos ideales (incluyendo Abelin-Genevois y Mismatch T4-L1).",
                    "**Comparativa Base vs Logrado:** Permite verificar en tiempo real si la simulación quirúrgica corrige la deformidad dentro de los objetivos ideales."
                ],
                tip: "Fundamento académico: Compara el estado preoperatorio del paciente con los algoritmos predictivos de alineación sagital para evitar sobrecorrecciones o subcorrecciones."
            },
            gap_score: {
                name: "⚖️ GAP Score (Yilgor et al., 2017)",
                badge: "5. Perfil Teórico Ideal • Calculadora de Proporcionalidad Mecánica",
                steps: [
                    "**Cálculo Automático (0 a 13 puntos):** Evalúa 4 dominios proporcionales basados en la PI y la edad del paciente: **RPV** (Versión Pélvica Relativa), **RLL** (Lordosis Lumbar Relativa), **LDI** (Índice de Distribución) y **RSA** (Alineación Espinal Relativa con GT).",
                    "**Semáforo de Riesgo:** • 0-2 pts (Proporcionado, ~6% fallo) | • 3-6 pts (Moderado, ~47% fallo) | • ≥7 pts (Severamente desproporcionado, ~95% riesgo de PJK o falla de barras)."
                ],
                tip: "Herramienta validada internacionalmente para predecir complicaciones mecánicas y falla proximal/distal postoperatoria."
            },
            cervical_set: {
                name: "🎯 T1S, T1A, NT (Conjunto Cervical / Perfil Sagital Cervical)",
                badge: "6. Perfil Sagital Cervical • Parámetros Cervicotorácicos Avanzados",
                steps: [
                    "**T1 Slope (T1S):** Inclinación del platillo superior de T1 respecto a la horizontal.\n• **T1 Angle (T1A):** Ángulo cervicotorácico.\n• **Neck Tilt (NT):** Ángulo de inclinación del cuello.",
                    "**Acción Automática:** El sistema procesa las referencias cervicales y torácicas superiores para evaluar el balance craneocervical y la horizontalidad de la mirada."
                ],
                tip: "Fundamento académico: El T1 Slope es el pilar biomecánico de la alineación cervical. La regla de armonía exige que T1 Slope menos la Lordosis Cervical (T1S - CL) se mantenga < 15° a 20° para evitar fatiga de los músculos erectores cervicales."
            },
            csva: {
                name: "📍 cSVA (Plomada Sagital Cervical C2 a C7)",
                badge: "6. Perfil Sagital Cervical • Balance Cervical Traslacional",
                steps: [
                    "**Punto 1 (C2):** Haz clic en el **centro de la odontoides / cuerpo de C2**.",
                    "**Punto 2 (C7):** Haz clic en la **esquina posterosuperior del cuerpo vertebral de C7**."
                ],
                tip: "Un cSVA > 4 cm se correlaciona con dolor cervical severo y discapacidad funcional."
            },
            cobb_coronal: {
                name: "📐 Ángulo de Cobb Coronal (Escoliosis AP)",
                badge: "7. Plano Coronal (AP) • Curvas Escolióticas",
                steps: [
                    "**Puntos 1 y 2 (Vértebra Límite Superior):** Marca los bordes izquierdo y derecho del platillo superior de la vértebra más inclinada arriba.",
                    "**Puntos 3 y 4 (Vértebra Límite Inferior):** Marca los bordes izquierdo y derecho del platillo inferior de la vértebra más inclinada abajo."
                ],
                tip: "Se reduce en tiempo real al simular la reducción y desrotación con las Barras Coronales AP."
            },
            point_marker: {
                name: "📍 Balance Coronal AP (Plomada C7 y CSVL S1)",
                badge: "7. Plano Coronal (AP) • Descompensación Coronal",
                steps: [
                    "**Botón C7:** Haz **1 clic** en el centro de **C7** en la placa AP.",
                    "**Botón S1 (CSVL):** Haz **1 clic** en el centro del sacro (**S1**) para trazar la Línea Vertical Centro-Sacra."
                ],
                tip: "Una desviación horizontal C7-CSVL > 2 a 4 cm define descompensación coronal del tronco."
            },
            osteotomy: {
                name: "✂️ 1. Colocar Osteotomía de Schwab (Trazar Cuña)",
                badge: "8. Osteotomías Correctivas • Trazado Sagital Manual",
                steps: [
                    "**Punto 1 (Corte Superior):** Haz clic en la cortical anterior del cuerpo vertebral donde inicia el corte superior.",
                    "**Punto 2 (Bisagra / Ápex):** Haz clic en el muro vertebral posterior (punto de bisagra).",
                    "**Punto 3 (Corte Inferior):** Haz clic más abajo en la cortical anterior para abrir el ángulo de la cuña."
                ],
                tip: "Permite planificar osteotomías de grado 1 a 6 en el nivel deseado."
            },
            ost_sim: {
                name: "✂️ 2. Simular Cierre de Cuña (Cinemática Automática)",
                badge: "8. Osteotomías Correctivas • Cierre Vertebral en Vivo",
                steps: [
                    "**Requisito:** Haber trazado al menos una osteotomía de 3 puntos.",
                    "**Acción Automática:** Pliega digitalmente la radiografía sobre el ápex de cada osteotomía, rotando la columna superior, las barras y los tornillos."
                ],
                tip: "Recalcula instantáneamente los valores postoperatorios de SVA, PT, SS, LL y GAP Score."
            },
            ost_modal: {
                name: "⚙️ 3. Ajustar Grados y Clasificación de Schwab (Grados 1 a 6)",
                badge: "8. Osteotomías Correctivas • Panel Anatómico Automático",
                steps: [
                    "**Clasificación de Schwab (2014):**\n• Grado 1 (SPO): ~5°-10°\n• Grado 2 (Ponte): ~10°-15°\n• Grado 3 (PSO): ~25°-35°\n• Grado 4 (PSO Ext.): ~35°-45°\n• Grado 5 (VCR): ~50°\n• Grado 6 (VCR Múltiple): >60°"
                ],
                tip: "Ajusta con precisión milimétrica la corrección angular buscada."
            },
            rod_sagittal: {
                name: "🔩 1. Barra y Tornillos Transpediculares Sagitales",
                badge: "8B. Instrumentación • Perfil con Medición en cm",
                steps: [
                    "**Colocar tornillos:** Haz clic en cada pedículo vertebral a instrumentar.",
                    "**Cerrar barra:** Haz **doble clic en el último tornillo** (o toca el botón verde).",
                    "**Medir largo (cm):** Arrastra el **punto amarillo de la punta de cualquier tornillo** hasta la cortical anterior."
                ],
                tip: "Determina la longitud exacta en centímetros de los tornillos de cada nivel."
            },
            rod_coronal: {
                name: "🔩 2. Barras Coronales AP (2 Lados)",
                badge: "8B. Instrumentación • Constructo Bilateral AP",
                steps: [
                    "**Primera Barra:** Haz clic en cada pedículo de un lado y cierra con **doble clic en el último tornillo**.",
                    "**Segunda Barra:** Traza el lado opuesto cerrando con doble clic."
                ],
                tip: "Habilita el simulador de reducción y desrotación coronal."
            },
            rod_panel: {
                name: "📐 3. Corrección Coronal AP y Pronóstico de Desrotación",
                badge: "8B. Instrumentación • Simulador Automático AP",
                steps: [
                    "**Deslizador de Reducción (0% a 100%):** Simula la traslación vertebral hacia las barras.",
                    "**Pronóstico:** Muestra la corrección del Cobb Coronal y la desrotación apical."
                ],
                tip: "Acopla el enderezamiento coronal con la desrotación axial."
            }
        },
        en: {
            calibrate: {
                name: "📏 Calibrate Radiographic Scale (cm)",
                badge: "1. Basic Tools • Real Metric Scale",
                steps: ["Point 1: Start of ruler.", "Point 2: End of known distance."],
                tip: "Converts measurements to real cm."
            },
            line: { name: "📏 Simple Line", badge: "1. Basic Tools", steps: ["Point 1", "Point 2"], tip: "Linear distance." },
            circle: { name: "⭕ Circle", badge: "1. Basic Tools", steps: ["Center", "Edge"], tip: "Spherical geometry." },
            cobb: { name: "📐 Free Cobb Angle", badge: "1. Basic Tools", steps: ["Upper endplate", "Lower endplate"], tip: "Intervertebral angle." },
            tk: { name: "📐 Tk - Thoracic Kyphosis", badge: "1 & 4. Sagittal Curves", steps: ["T4 upper", "T12 lower"], tip: "Normal range 20°-40°." },
            pelvis: { name: "🦴 Measure PI, PT & SS", badge: "2. Pelvic Parameters", steps: ["Femoral head 1", "Femoral head 2", "Anterior S1", "Posterior S1"], tip: "PI = PT + SS foundation." },
            l1_pa: { name: "🎯 L1-PA", badge: "3. Sagittal Balance", steps: ["Click L1 center"], tip: "Lumbar proportionality." },
            t4_pa: { name: "🎯 T4-PA", badge: "3. Sagittal Balance", steps: ["Click T4 center"], tip: "Thoracolumbar harmony." },
            c7_pa: { name: "🎯 C7-PA", badge: "3. Sagittal Balance", steps: ["Click C7 center"], tip: "Global angular alignment." },
            c2_pa: { name: "🎯 C2-PA", badge: "3. Sagittal Balance", steps: ["Click C2 center"], tip: "Craniocervical alignment." },
            l1_tilt: { name: "🧭 L1 Tilt", badge: "3. Sagittal Balance", steps: ["Click L1 center"], tip: "Vertical orientation." },
            t4_tilt: { name: "🧭 T4 Tilt", badge: "3. Sagittal Balance", steps: ["Click T4 center"], tip: "Thoracic vertical tilt." },
            c7_tilt: { name: "🧭 C7 Tilt", badge: "3. Sagittal Balance", steps: ["Click C7 center"], tip: "Trunk tilt." },
            c2_tilt: { name: "🧭 C2 Tilt", badge: "3. Sagittal Balance", steps: ["Click C2 center"], tip: "Gaze axis tilt." },
            sva: { name: "📍 SVA", badge: "3. Sagittal Balance", steps: ["C7 center", "S1 posterosuperior"], tip: "Global translation." },
            gt: { name: "📐 Global Tilt (GT)", badge: "3. Sagittal Balance", steps: ["Auto or 1-click on C7"], tip: "Obeid parameter (GT ≈ C7 Tilt + PT)." },
            l1_s1: { name: "📐 Global Lordosis (L1-S1)", badge: "4. Lumbar Measurements", steps: ["L1 endplate", "S1 endplate"], tip: "Proportional lumbar lordosis." },
            l4_s1: { name: "📐 Lower LL (L4-S1)", badge: "4. Lumbar Measurements", steps: ["L4 endplate", "S1 endplate"], tip: "Distal lordosis arc." },
            l4_l5: { name: "📐 Segmental (L4-L5)", badge: "4. Lumbar Measurements", steps: ["L4 & L5 endplates"], tip: "Segmental lordosis." },
            theory_ideal: { name: "📊 Calculate / Compare Values", badge: "5. Theoretical Ideal Profile", steps: ["Automatic comparison"], tip: "Pre-op vs Ideal vs Achieved table." },
            gap_score: { name: "⚖️ GAP Score", badge: "5. Theoretical Ideal Profile", steps: ["Automatic scoring (0-13 pts)"], tip: "Mechanical complication risk." },
            cervical_set: { name: "🎯 T1S, T1A, NT (Cervical Set)", badge: "6. Cervical Sagittal Profile", steps: ["Automatic cervical processing"], tip: "T1 Slope and cervical-thoracic harmony." },
            csva: { name: "📍 cSVA", badge: "6. Cervical Sagittal Profile", steps: ["C2 dens", "C7 posterosuperior"], tip: "Cervical translation." },
            cobb_coronal: { name: "📐 Coronal Cobb", badge: "7. Coronal Plane", steps: ["Upper vertebra", "Lower vertebra"], tip: "Scoliosis magnitude." },
            point_marker: { name: "📍 Coronal Balance AP", badge: "7. Coronal Plane", steps: ["C7", "S1 (CSVL)"], tip: "Trunk coronal shift." },
            osteotomy: { name: "✂️ Schwab Osteotomy", badge: "8. Corrective Osteotomies", steps: ["3 points wedge"], tip: "Wedge resection." },
            ost_sim: { name: "✂️ Simulate Wedge Closure", badge: "8. Corrective Osteotomies", steps: ["Automatic folding"], tip: "Live spinal rotation." },
            ost_modal: { name: "⚙️ Adjust Schwab Grades 1-6", badge: "8. Corrective Osteotomies", steps: ["Classification panel"], tip: "Anatomical correction angle." },
            rod_sagittal: { name: "🔩 Sagittal Rod & Screws", badge: "8B. Instrumentation", steps: ["Pedicles", "Double-click"], tip: "Screw sizing in cm." },
            rod_coronal: { name: "🔩 Coronal AP Rods", badge: "8B. Instrumentation", steps: ["Bilateral pedicles"], tip: "Bilateral AP construct." },
            rod_panel: { name: "📐 Coronal Correction AP", badge: "8B. Instrumentation", steps: ["Reduction slider"], tip: "Scoliosis correction & derotation." }
        }
    };

    // 2. CLASIFICADOR UNIVERSAL BLINDADO CONTRA BACHES
    function classifyParameterToKey(rawStr) {
        if (!rawStr) return null;
        const s = rawStr.toLowerCase();

        // Cervical avanzado (T1S, T1A, NT)
        if (s.includes('t1s') || s.includes('t1a') || s.includes('nt') || s.includes('cervical') || s.includes('conjunto')) {
            return 'cervical_set';
        }
        // Perfil Teórico Ideal / Comparar valores
        if (s.includes('calcular / comparar') || s.includes('calculate / compare') || s.includes('teórico') || s.includes('teorico') || s.includes('abelin') || s.includes('ideal')) {
            return 'theory_ideal';
        }
        // GAP Score
        if (s.includes('gap score') || s.includes('yilgor')) {
            return 'gap_score';
        }
        // Mediciones lumbares
        if (s.includes('lordosis global') || s.includes('l1-s1') || s.includes('l1_s1')) return 'l1_s1';
        if (s.includes('ll baja') || s.includes('l4-s1') || s.includes('l4_s1')) return 'l4_s1';
        if (s.includes('segmentaria') || s.includes('l4-l5') || s.includes('l4_l5')) return 'l4_l5';

        // Global Tilt
        if (s.includes('global tilt') || s.includes('calculateoractivategt') || /\bgt\b/.test(s)) return 'gt';

        // Automáticos de osteotomías y barras
        if (s.includes('toggleostsim') || s.includes('simular cierre') || s.includes('wedge closure')) return 'ost_sim';
        if (s.includes('showostmodal') || s.includes('ajustar grados') || s.includes('adjust degrees')) return 'ost_modal';
        if (s.includes('showrodpanel') || s.includes('corrección coronal') || s.includes('coronal correction')) return 'rod_panel';

        // Barras y osteotomías manuales
        if (s.includes('rod') || s.includes('barra') || s.includes('startorfinishrod')) {
            return (s.includes('coronal') || s.includes('ap ') || s.includes('2 lado') || s.includes('2 side')) ? 'rod_coronal' : 'rod_sagittal';
        }
        if (s.includes('osteo') || s.includes('schwab') || s.includes('cuña') || s.includes('wedge')) return 'osteotomy';

        // Pelvis y básicas
        if (s.includes('pelv') || s.includes('pi, pt') || s.includes('pi,pt') || s.includes('pi_pt') || s.includes('spinopelv') || /\bpi\b/.test(s)) return 'pelvis';
        if (s.includes('calibr')) return 'calibrate';
        if (s.includes('circle') || s.includes('círculo') || s.includes('circulo')) return 'circle';
        if (s.includes('simple line') || s.includes('línea simple') || s.includes('linea simple') || /\bline\b/.test(s)) return 'line';

        // Ángulos PA y Tilt
        if (s.includes('l1-pa') || s.includes('l1_pa') || s.includes('l1pa')) return 'l1_pa';
        if (s.includes('t4-pa') || s.includes('t4_pa') || s.includes('t4pa')) return 't4_pa';
        if (s.includes('c7-pa') || s.includes('c7_pa') || s.includes('c7pa')) return 'c7_pa';
        if (s.includes('c2-pa') || s.includes('c2_pa') || s.includes('c2pa')) return 'c2_pa';

        if (s.includes('l1 tilt') || s.includes('l1-tilt') || s.includes('l1_tilt')) return 'l1_tilt';
        if (s.includes('t4 tilt') || s.includes('t4-tilt') || s.includes('t4_tilt')) return 't4_tilt';
        if (s.includes('c7 tilt') || s.includes('c7-tilt') || s.includes('c7_tilt')) return 'c7_tilt';
        if (s.includes('c2 tilt') || s.includes('c2-tilt') || s.includes('c2_tilt')) return 'c2_tilt';

        // Torácica y cervical
        if (s.includes('tk') || s.includes('kypho') || s.includes('cifos') || s.includes('t4-t12') || s.includes('t1-t12')) return 'tk';
        if (s.includes('csva') || s.includes('c2-c7 sva')) return 'csva';
        if (s.includes('sva') || s.includes('plumbline') || s.includes('plomada')) {
            return (s.includes('coronal') || s.includes('csvl') || s.includes('bao')) ? 'point_marker' : 'sva';
        }

        if (s.includes('cobb_coronal') || s.includes('coronal cobb') || s.includes('escoliosis') || s.includes('scoliosis')) return 'cobb_coronal';
        if (s.includes('point_marker') || s.includes('bao') || s.includes('csvl')) return 'point_marker';

        if (/\bpa\b/.test(s)) return 'l1_pa';
        if (s.includes('tilt')) return 'c2_tilt';
        if (s.includes('cobb')) return 'cobb';

        return null;
    }

    function getCurrentSelectedParameterInfo() {
        const isToolOn = (typeof activeTool !== 'undefined' && activeTool !== null && activeTool !== '');
        if (isToolOn) {
            const tName = typeof activeTool !== 'undefined' ? activeTool : '';
            const tTitle = (typeof activeTitle !== 'undefined' && activeTitle) ? activeTitle : '';
            const tSub = (typeof activeSubType !== 'undefined' ? activeSubType : '');
            const key = classifyParameterToKey(`${tTitle} ${tSub} ${tName}`);
            if (key) {
                return { key: key, label: tTitle || tName.toUpperCase(), isLiveTool: true };
            }
        }
        if (window._lastSelectedSidebarCtx && window._lastSelectedSidebarCtx.key) {
            return window._lastSelectedSidebarCtx;
        }
        return null;
    }

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('aside button, .tool-btn');
        if (!btn) return;
        const onclickStr = btn.getAttribute('onclick') || '';
        if (onclickStr.includes('clearAllRods')) return;

        const label = (btn.innerText || '').trim();
        const i18nStr = btn.getAttribute('data-i18n') || '';
        const key = classifyParameterToKey(`${label} ${onclickStr} ${i18nStr}`);
        if (key) {
            window._lastSelectedSidebarCtx = { key: key, label: label, isLiveTool: true };
            window._manualPreviewKey = null;
            setTimeout(updateHelpButtonBadge, 20);
        }
    }, true);

    if (typeof activateTool === 'function') {
        const origActivate = activateTool;
        activateTool = function(tool, title, subType) {
            const key = classifyParameterToKey(`${title || ''} ${subType || ''} ${tool || ''}`);
            if (key) {
                window._lastSelectedSidebarCtx = { key: key, label: title || tool, isLiveTool: true };
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

    function updateHelpButtonBadge() {
        const btn = document.getElementById('btn-top-help');
        if (!btn) return;
        const hasActive = (typeof activeTool !== 'undefined' && activeTool !== null && activeTool !== '') || Boolean(window._lastSelectedSidebarCtx);
        if (hasActive) {
            btn.className = "bg-amber-500 hover:bg-amber-400 text-gray-950 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-extrabold transition-all flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.65)] animate-pulse select-none shrink-0";
        } else {
            btn.className = "bg-sky-600/25 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/60 px-2.5 py-1 rounded-md text-xs font-bold transition-colors flex items-center justify-center shadow-sm select-none shrink-0";
        }
    }

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
            ? 'Ayuda Clínica y Académica del Parámetro / Leyenda'
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
                <button id="tab-btn-mod" onclick="switchHelpTab('mod')" class="py-2 px-2 rounded-t-lg font-bold text-[11px] transition-colors border-b-2">📚 Módulos</button>
            </div>
            <div id="help-modal-content" class="p-4 overflow-y-auto space-y-3 flex-1"></div>
            <div class="bg-gray-950 px-4 py-2.5 border-t border-gray-800 flex justify-between items-center">
                <span id="help-footer-hint" class="text-[10px] text-gray-400">Selecciona cualquier parámetro y toca ❓.</span>
                <button onclick="document.getElementById('help-context-modal').classList.add('hidden')" id="help-close-btn" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors">Continuar</button>
            </div>
        </div>
    `;
    helpModal.addEventListener('click', function() { helpModal.classList.add('hidden'); });
    document.body.appendChild(helpModal);

    window.openContextualHelpModal = function() {
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
        document.getElementById('tab-btn-mod').innerText = isEs ? '📚 Módulos' : '📚 Modules';

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
            const selInfo = getCurrentSelectedParameterInfo();
            const shownKey = window._manualPreviewKey || (selInfo ? selInfo.key : null);
            const g = shownKey ? TOOL_GUIDES[langKey][shownKey] : null;

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
                            <div class="text-[10px] font-bold uppercase text-sky-400">${isEs ? 'Cómo Funciona / Pasos Anatómicos:' : 'How It Works / Anatomical Steps:'}</div>
                            <ol class="list-decimal list-inside space-y-1.5 text-gray-200 leading-relaxed whitespace-pre-line">
                                ${g.steps.map(s => `<li>${s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}</li>`).join('')}
                            </ol>
                        </div>
                        <div class="bg-sky-950/50 border border-sky-700/60 rounded p-2.5 text-[11px] text-sky-200 leading-relaxed">
                            <strong class="text-sky-400">💡 ${isEs ? 'Fundamento Académico y Clínico:' : 'Academic & Clinical Principle:'}</strong> ${g.tip.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="bg-gray-800/60 border border-gray-700 rounded-lg p-3.5 text-center space-y-1">
                        <div class="text-base">👆</div>
                        <div class="font-bold text-white">${isEs ? 'Ningún parámetro seleccionado en este momento' : 'No parameter currently selected'}</div>
                        <p class="text-[11px] text-gray-400">${isEs ? 'Selecciona cualquier botón del menú lateral y toca ❓, o haz clic en cualquiera de la enciclopedia inferior:' : 'Select any sidebar button and tap ❓, or pick any item from the encyclopedia below:'}</p>
                    </div>
                `;
            }

            html += `
                <div class="pt-1">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1.5">${isEs ? 'Enciclopedia completa de parámetros (Todos los Módulos):' : 'Complete Parameter Encyclopedia (All Modules):'}</div>
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
            const icons = [
                ['👤', 'Ficha del Paciente', 'Abre la ventana para registrar Nombre, Cédula/ID y Edad (sincronizados con el Reporte PDF).'],
                ['➡️ / ⬅️', 'Dirección de la Mirada', 'Cambia hacia dónde mira el paciente en la radiografía lateral.'],
                ['📤', 'Cargar Radiografía (Rx)', 'Sube la imagen radiográfica para la etapa actual (Pre-Op o Post-Op).'],
                ['🔆', 'Visor Radiológico (Brillo/Contraste)', 'Ajusta brillo, contraste y Modo Negativo en tiempo real.'],
                ['🔍', 'Lupa Quirúrgica Flotante', 'Activa una lupa de alta precisión que flota sobre tu dedo en celulares.'],
                ['👁️ / 🙈', 'Ver Radiografía Limpia', 'Oculta temporalmente todas las líneas y textos para apreciar la radiografía limpia.'],
                ['🔓 / 🔒', 'Candado de Bloqueo Táctil', 'Congela todos los puntos para hacer Zoom y mover la imagen con seguridad.'],
                ['💾', 'Guardar y Exportar Estudio', 'Descarga imágenes medibles (.PNG) o archivos editables del proyecto.'],
                ['📄', 'Reporte Quirúrgico (PDF)', 'Genera la hoja clínica formal con tablas, osteotomías y firma médica.'],
                ['🧹', 'Limpiar Etapa Actual', 'Borra únicamente las mediciones de la vista activa.'],
                ['🗑️', 'Reiniciar Todo el Estudio', 'Limpia por completo el programa para comenzar un caso nuevo.']
            ];
            box.innerHTML = `<div class="space-y-2">${icons.map(([ico, title, desc]) => `<div class="flex items-start space-x-3 bg-gray-800/60 border border-gray-700/80 rounded-lg p-2.5"><div class="text-base bg-gray-900 border border-gray-700 rounded px-2 py-1 shrink-0 font-bold">${ico}</div><div><div class="font-bold text-white text-xs">${title}</div><div class="text-[11px] text-gray-300 leading-snug mt-0.5">${desc}</div></div></div>`).join('')}</div>`;
        } else if (tab === 'mod') {
            const mods = [
                ['Módulo 1 • Herramientas Básicas y Calibración', 'Calibración en cm, líneas simples, círculos, ángulos de Cobb y Cifosis Torácica (Tk).'],
                ['Módulo 2 • Parámetros Pélvicos', 'PI, PT, SS (Base espinopélvica indispensable para los cálculos automáticos).'],
                ['Módulo 3 • Balance Sagital y Proporcionalidad', 'Ángulos L1-PA, T4-PA, C7-PA, C2-PA, Tilts individuales y Global Tilt (GT).'],
                ['Módulo 4 • Alineación Regional Lumbar', 'Lordosis global (L1-S1), LL baja (L4-S1) y ángulo segmentario L4-L5.'],
                ['Módulo 5 • Perfil Teórico Ideal y GAP Score', 'Algoritmos teóricos (Abelin-Genevois), tabla comparativa de valores e índice de proporcionalidad mecánica (Yilgor).'],
                ['Módulo 6 • Perfil Sagital Cervical Avanzado', 'Conjunto cervical (T1S, T1A, NT) y plomada cSVA.'],
                ['Módulo 7 • Plano Coronal (AP)', 'Ángulos de Cobb coronales y marcadores de plomada C7 - S1 (CSVL).'],
                ['Módulo 8 • Osteotomías de Schwab y Simulación', 'Trazado de cuña, simulación de cierre con rotación automática y panel de grados (1 a 6).'],
                ['Módulo 8B • Instrumentación (Tornillos y Barras)', 'Tornillos sagitales con medición en cm, barras coronales AP y simulador de reducción/desrotación escoliótica.']
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

    window.addEventListener('load', injectHelpButton);
    injectHelpButton();
})();
