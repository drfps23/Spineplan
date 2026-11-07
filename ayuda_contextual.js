// ============================================================================
// ACTUALIZACIÓN 5 V5 (ayuda_contextual.js): GUÍA CLÍNICA Y ACADÉMICA COMPLETA (❓)
// Incluye todos los parámetros manuales y automáticos (GT, GAP, Schwab 1-6, etc.)
// ============================================================================

(function() {
    window._lastSelectedSidebarCtx = null;
    window._manualPreviewKey = null;

    // 1. ENCICLOPEDIA CLÍNICA Y ACADÉMICA DE TODOS LOS PARÁMETROS (MANUALES Y AUTOMÁTICOS)
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
                    "**Punto 1:** Haz clic en la primera referencia anatómica (ej. altura de disco, cuerpo vertebral o listesis).",
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
                    "**Punto 2 (Cabeza Femoral 2):** Haz clic en el centro de la segunda cabeza femoral (si están superpuestas, haz clic de nuevo en el mismo centro).",
                    "**Punto 3 (Borde Anterior de S1):** Haz clic en el promontorio sacro (esquina anterosuperior de **S1**).",
                    "**Punto 4 (Borde Posterior de S1):** Haz clic en la esquina posterosuperior del platillo de **S1**."
                ],
                tip: "Valor académico: Cumple la ecuación geométrica PI = PT + SS. La Incidencia Pélvica (PI) es constante en el adulto y determina cuánta lordosis (LL) e inclinación (PA / GT) necesita el paciente. Además, habilita todos los cálculos automáticos del programa."
            },
            l1_pa: {
                name: "🎯 L1-PA (Ángulo Pélvico de L1)",
                badge: "3. Balance Sagital • Proporcionalidad Lumbar",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de L1**."
                ],
                tip: "Valor académico: Formado por la línea del centro de L1 al centro de S1 y la línea al eje bicoxofemoral. No depende de la posición de la pelvis ni de la calibración. Valor ideal: L1-PA = 0.5 × PI - 19°."
            },
            t4_pa: {
                name: "🎯 T4-PA (Ángulo Pélvico Torácico de T4)",
                badge: "3. Balance Sagital • Armonía Espinopélvica (Hills / Lenke)",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de T4**."
                ],
                tip: "Valor académico: En una columna armónica, el T4-PA debe ser casi idéntico al L1-PA. Una diferencia (Mismatch T4-PA menos L1-PA) < 3° a 5° se asocia con menor riesgo de falla mecánica y PJK."
            },
            c7_pa: {
                name: "🎯 C7-PA (Ángulo Pélvico de C7)",
                badge: "3. Balance Sagital • Alineación Global Angular",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de C7**."
                ],
                tip: "Une automáticamente C7 con el centro del platillo de S1 y las cabezas femorales para evaluar el balance global sin sesgo de magnificación."
            },
            c2_pa: {
                name: "🎯 C2-PA (Ángulo Pélvico de C2)",
                badge: "3. Balance Sagital • Alineación Craneocervical",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo/odontoides de C2**."
                ],
                tip: "Evalúa la cadena cinemática completa desde la columna cervical alta (C2) hasta el eje coxofemoral."
            },
            l1_tilt: {
                name: "🧭 L1 Tilt (Inclinación Sagital de L1)",
                badge: "3. Balance Sagital • Orientación Vertical Lumbar",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de L1** (se conecta automáticamente al centro de S1).",
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
                tip: "Mide la inclinación del bloque toracolumbar (S1-T4) respecto a la línea vertical."
            },
            c7_tilt: {
                name: "🧭 C7 Tilt (Inclinación Sagital Global de C7)",
                badge: "3. Balance Sagital • Inclinación del Tronco",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de C7**.",
                    "**Sin Pelvis medida:** Marca el centro de C7 y luego el centro del platillo de S1."
                ],
                tip: "Valor académico: Representa el ángulo de inclinación del tronco respecto a la vertical y forma parte directa de la ecuación del Global Tilt (GT) y del GAP Score."
            },
            c2_tilt: {
                name: "🧭 C2 Tilt (Inclinación Sagital Global de C2)",
                badge: "3. Balance Sagital • Inclinación del Eje de la Mirada",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo/odontoides de C2**.",
                    "**Sin Pelvis medida:** Marca el centro de C2 y luego el centro del platillo de S1."
                ],
                tip: "Valor académico: Rango normal entre +1° y -3°. Refleja de forma directa la alineación del conducto auditivo externo y la horizontalidad de la mirada."
            },
            sva: {
                name: "📍 SVA (Sagittal Vertical Axis - Plomada C7 a S1)",
                badge: "3. Balance Sagital • Traslación Sagital Global",
                steps: [
                    "**Punto 1 (C7):** Haz clic en el **centro del cuerpo vertebral de C7**.",
                    "**Punto 2 (S1):** Haz clic en la **esquina posterosuperior del platillo de S1** (o se ancla automáticamente si ya mediste la pelvis)."
                ],
                tip: "Valor académico (Clasificación de Schwab): SVA < 4 cm es normal; de 4 a 9.5 cm es desbalance moderado; > 9.5 cm es desbalance sagital severo."
            },
            gt: {
                name: "📐 Global Tilt (GT - Ángulo de Inclinación Global)",
                badge: "3. Balance Sagital • Parámetro Automático / Manual (Obeid)",
                steps: [
                    "**Cálculo 100% Automático:** Si ya mediste la **Pelvis (PI, PT, SS)** y marcaste **C7** (en SVA, C7-PA o C7 Tilt), al presionar este botón el programa traza y calcula el **Global Tilt (GT)** automáticamente.",
                    "**Modo de 1 Clic:** Si solo has medido la Pelvis, presiona este botón y haz **1 clic en el centro del cuerpo de C7**."
                ],
                tip: "Fundamento académico (Obeid / Boissière): Combina el desbalance espinal (C7 Tilt) y la compensación pélvica (PT) en un solo ángulo (GT ≈ C7 Tilt + PT). No se altera por la posición de los pies ni requiere calibración. Ideal según PI: GT ≈ 0.48 × PI - 15°."
            },
            l1_s1: {
                name: "📐 L1-S1 (Lordosis Lumbar Global - LL)",
                badge: "4. Alineación Regional • Lordosis Lumbar",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L1):** Marca el borde anterior y posterior del platillo superior de **L1**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Fundamento académico: El programa calcula la Lordosis Ideal proporcional (LL Ideal = 0.6 × PI + 30°) y evalúa la relación PI - LL (< 10° en Schwab) además de alimentar el GAP Score."
            },
            l4_s1: {
                name: "📐 L4-S1 (Lordosis Lumbar Distal)",
                badge: "4. Alineación Regional • Base Lordótica Inferior",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L4):** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Fundamento académico (Roussouly / Yilgor): El arco L4-S1 debe aportar entre el 50% y el 80% de toda la lordosis lumbar (ideal 35° a 40°). Alimenta automáticamente el Índice de Distribución de Lordosis (LDI) del GAP Score."
            },
            l4_l5: {
                name: "📐 L4-L5 (Ángulo Segmentario Lumbar)",
                badge: "4. Alineación Regional • Segmento L4-L5",
                steps: [
                    "**Puntos 1 y 2:** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4:** Marca el borde anterior y posterior del platillo inferior de **L5**."
                ],
                tip: "Permite planificar cuánta lordosis segmentaria se ganará mediante liberación posterior o caja intersomática (TLIF / ALIF) en L4-L5."
            },
            cervical_cobb: {
                name: "📐 Alineación Cervical (C2-C7 / C0-C2 / T1 Slope)",
                badge: "5. Alineación Cervical • Balance Craneocervical",
                steps: [
                    "**Puntos 1 y 2 (Referencia Superior):** Marca el platillo superior/inferior de referencia (ej. **C2** o platillo superior de **T1**).",
                    "**Puntos 3 y 4 (Referencia Inferior):** Marca el platillo inferior de **C7** (o línea horizontal para el T1 Slope)."
                ],
                tip: "Fundamento académico: La lordosis cervical C2-C7 está directamente gobernada por el T1 Slope (T1S - CL < 15° a 20°) para mantener la mirada horizontal."
            },
            csva: {
                name: "📍 cSVA (Plomada Sagital Cervical C2 a C7)",
                badge: "5. Alineación Cervical • Traslación Cervical",
                steps: [
                    "**Punto 1 (C2):** Haz clic en el **centro de la odontoides / cuerpo de C2**.",
                    "**Punto 2 (C7):** Haz clic en la **esquina posterosuperior del cuerpo vertebral de C7**."
                ],
                tip: "Fundamento académico: Un cSVA > 4 cm se correlaciona fuertemente con discapacidad funcional cervical y mayor requerimiento energético de la musculatura extensora."
            },
            cobb_coronal: {
                name: "📐 Ángulo de Cobb Coronal (Escoliosis AP)",
                badge: "6. Plano Coronal (AP) • Magnitud de la Curva",
                steps: [
                    "**Puntos 1 y 2 (Vértebra Límite Superior - UIV):** Marca los bordes izquierdo y derecho del platillo superior de la vértebra más inclinada cranealmente.",
                    "**Puntos 3 y 4 (Vértebra Límite Inferior - LIV):** Marca los bordes izquierdo y derecho del platillo inferior de la vértebra más inclinada caudalmente."
                ],
                tip: "Se vincula dinámicamente con el simulador de Barras Coronales AP para mostrar cuántos grados de escoliosis se corrigen al reducir la columna a las barras."
            },
            point_marker: {
                name: "📍 Balance Coronal AP (Plomada C7 y CSVL S1)",
                badge: "6. Plano Coronal (AP) • Descompensación Coronal",
                steps: [
                    "**Botón C7:** Haz **1 clic** en el centro del proceso espinoso/cuerpo de **C7** en la radiografía AP.",
                    "**Botón S1 (CSVL):** Haz **1 clic** en el centro del sacro (**S1**) para trazar la Línea Vertical Centro-Sacra."
                ],
                tip: "Fundamento académico: Una distancia horizontal C7-CSVL > 2 cm a 4 cm define descompensación coronal del tronco."
            },
            osteotomy: {
                name: "✂️ 1. Colocar Osteotomía de Schwab (Trazar Cuña)",
                badge: "7. Osteotomías Correctivas • Trazado Manual",
                steps: [
                    "**Punto 1 (Corte Superior):** Haz clic en la cortical anterior del cuerpo vertebral donde inicia la resección.",
                    "**Punto 2 (Bisagra / Ápex):** Haz clic en el muro vertebral posterior (punto de bisagra).",
                    "**Punto 3 (Corte Inferior):** Haz clic más abajo en la cortical anterior para abrir el ángulo de la cuña."
                ],
                tip: "Puedes trazar múltiples osteotomías en distintos niveles (ej. osteotomías de Ponte multinivel o una PSO en L3). Arrastra los puntos para ajustar la geometría."
            },
            ost_sim: {
                name: "✂️ 2. Simular Cierre de Cuña (Cinemática Automática)",
                badge: "7. Osteotomías Correctivas • Botón Automático",
                steps: [
                    "**Requisito:** Haber trazado al menos una osteotomía de 3 puntos en la radiografía.",
                    "**Acción Automática:** Al tocar este botón, el programa pliega digitalmente la radiografía sobre el ápex de cada osteotomía y rota solidariamente toda la columna superior, las barras y los tornillos."
                ],
                tip: "Fundamento biomecánico: No solo cierra el ángulo local, sino que recalcula automáticamente cuánto mejoran el SVA, PT, SS, L1-S1, L1-PA, T4-PA, C2 Tilt, Global Tilt y el GAP Score tras la cirugía."
            },
            ost_modal: {
                name: "⚙️ 3. Ajustar Grados y Clasificación de Schwab (1 a 6)",
                badge: "7. Osteotomías Correctivas • Panel Anatómico Automático",
                steps: [
                    "**Selector de Grados de Schwab (2014):** Elige el tipo de osteotomía para que la cuña adopte automáticamente su angulación anatómica:",
                    "• **Grado 1 (SPO - Facetectomía Parcial):** ~5° a 10° por nivel.\n• **Grado 2 (Ponte / Facetectomía Completa):** ~10° a 15° por nivel.\n• **Grado 3 (PSO - Sustracción Pedicular):** ~25° a 35° (cuña transpedicular).\n• **Grado 4 (PSO Extendida + Disco):** ~35° a 45°.\n• **Grado 5 (VCR - Resección Vertebral):** ~50°.\n• **Grado 6 (VCR Múltiple):** > 60°."
                ],
                tip: "También puedes ajustar los grados exactos con el deslizador o escribiendo el número directamente para alcanzar el objetivo espinopélvico ideal."
            },
            rod_sagittal: {
                name: "🔩 1. Barra y Tornillos Transpediculares Sagitales",
                badge: "7B. Instrumentación • Perfil con Medición en cm",
                steps: [
                    "**Colocar tornillos:** Haz clic en cada pedículo vertebral a lo largo de los niveles planeados.",
                    "**Cerrar la barra:** Haz **doble clic en el último tornillo** (o toca el botón verde de Terminar Barra).",
                    "**Medir longitud del tornillo (cm):** Arrastra el **punto amarillo de la punta de cualquier tornillo** hasta la cortical anterior vertebral."
                ],
                tip: "Permite determinar de antemano la longitud en centímetros de los tornillos de cada nivel y orientar su angulación (ej. paralelo al platillo, S1 al promontorio o trayectoria ilíaca)."
            },
            rod_coronal: {
                name: "🔩 2. Barras Coronales AP (2 Lados)",
                badge: "7B. Instrumentación • Constructo Bilateral AP",
                steps: [
                    "**Primera Barra:** Haz clic en cada pedículo de un lado (cóncavo o convexo) y cierra con **doble clic en el último tornillo**.",
                    "**Segunda Barra:** Vuelve a tocar el botón y traza los pedículos del lado opuesto, cerrando con doble clic."
                ],
                tip: "Calcula la longitud de ambas barras en centímetros y habilita la simulación de maniobras de reducción coronal y desrotación."
            },
            rod_panel: {
                name: "📐 3. Corrección Coronal AP y Pronóstico de Desrotación",
                badge: "7B. Instrumentación • Simulador Automático AP",
                steps: [
                    "**Deslizador de Reducción (0% a 100%):** Al mover la barra, el programa simula la traslación vertebral hacia las barras moldeadas.",
                    "**Cálculo Automático en Vivo:** Muestra la reducción del ángulo de Cobb Coronal (Base → Logrado), el porcentaje de corrección escoliótica y la desrotación vertebral apical estimada."
                ],
                tip: "Fundamento biomecánico: Durante la maniobra de traducción y desrotación en barra (Cotrel-Dubousset / reducción directa), el enderezamiento en el plano coronal se acopla cinemáticamente con la corrección de la rotación axial apical."
            },
            gap_score: {
                name: "⚖️ Evaluar GAP Score (Global Alignment & Proportion)",
                badge: "8. Resultados • Calculadora Automática (Yilgor et al.)",
                steps: [
                    "**Requisitos en la Placa:** Tener medidos **PI/PT/SS**, **L1-S1**, **L4-S1** y **Global Tilt (GT)** (además de la edad en la ficha 👤).",
                    "**Evaluación Automática (0 a 13 puntos):** El panel cruza 4 dominios proporcionales respecto a la PI del paciente: **RPV** (Versión Pélvica Relativa), **RLL** (Lordosis Lumbar Relativa), **LDI** (Índice de Distribución L4-S1/L1-S1) y **RSA** (Alineación Espinal Relativa con GT)."
                ],
                tip: "Interpretación académica (Yilgor et al., JBJS): • **0 a 2 pts (🟢 Proporcionado):** Baja tasa de complicaciones mecánicas (~6%). • **3 a 6 pts (🟡 Moderadamente Desproporcionado):** Riesgo intermedio (~47%). • **≥ 7 pts (🔴 Severamente Desproporcionado):** Alto riesgo de PJK / falla de instrumentación (~95%)."
            },
            results_table: {
                name: "📊 Calcular / Comparar Valores y Mismatch (T4-L1)",
                badge: "8. Resultados • Tabla Biomecánica Automática",
                steps: [
                    "**Acción Automática:** Compila instantáneamente todos los parámetros medidos y los compara en 3 columnas: **Base (Pre-Op)**, **Ideal (según PI)** y **Logrado (Simulación de Osteotomía / Post-Op)**.",
                    "**Cálculo de Mismatch (T4-PA - L1-PA):** Resta automáticamente el L1-PA del T4-PA para verificar la armonía toracolumbar."
                ],
                tip: "Fundamento académico: Permite verificar de un vistazo si las osteotomías planeadas llevan al paciente dentro de sus rangos ideales personalizados antes de pasar a quirófano o exportar el Reporte PDF."
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
                tip: "Eliminates X-Ray magnification bias and converts SVA, cSVA, rods, and pedicle screw lengths into real centimeters."
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
                name: "📐 Free Cobb Angle",
                badge: "1. Basic Tools • Intervertebral Angle",
                steps: [
                    "**Points 1 & 2 (Upper Endplate):** Click the anterior and posterior corners of the superior endplate.",
                    "**Points 3 & 4 (Lower Endplate):** Click the anterior and posterior corners of the inferior endplate."
                ],
                tip: "Useful for segmental kyphosis, wedge fractures, or transitional angles."
            },
            tk: {
                name: "📐 Tk - Thoracic Kyphosis (T4 - T12)",
                badge: "1 & 4. Sagittal Curves • Thoracic Kyphosis",
                steps: [
                    "**Points 1 & 2 (T4 Upper Endplate):** Click the anterior and posterior corners of the **T4** superior endplate.",
                    "**Points 3 & 4 (T12 Lower Endplate):** Click the anterior and posterior corners of the **T12** inferior endplate."
                ],
                tip: "Normal physiological range is 20° to 40°. Automatically feeds the alignment table and updates during osteotomy closure."
            },
            pelvis: {
                name: "🦴 Measure PI, PT & SS (Spinopelvic Parameters)",
                badge: "2. Pelvic Parameters • Spinopelvic Foundation",
                steps: [
                    "**Point 1 (Femoral Head 1):** Click the center of the first femoral head.",
                    "**Point 2 (Femoral Head 2):** Click the center of the second femoral head (click the same center if overlapped).",
                    "**Point 3 (Anterior S1):** Click the anterosuperior corner of **S1** (sacral promontory).",
                    "**Point 4 (Posterior S1):** Click the posterosuperior corner of the **S1** endplate."
                ],
                tip: "Academic principle: PI = PT + SS. Pelvic Incidence (PI) is a morphological constant that dictates ideal lumbar lordosis and pelvic angles, unlocking all automatic calculations in the app."
            },
            l1_pa: {
                name: "🎯 L1-PA (L1 Pelvic Angle)",
                badge: "3. Sagittal Balance • Lumbar Proportionality",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the L1 vertebral body**."
                ],
                tip: "Academic principle: Angle between L1-S1 line and femoral head-S1 line. Independent of pelvic retroversion and magnification (Ideal = 0.5 × PI - 19°)."
            },
            t4_pa: {
                name: "🎯 T4-PA (T4 Pelvic Angle)",
                badge: "3. Sagittal Balance • Spinopelvic Harmony (Hills / Lenke)",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the T4 vertebral body**."
                ],
                tip: "Academic principle: T4-PA should closely match L1-PA. Maintaining a T4-L1 PA Mismatch < 3° to 5° minimizes proximal junctional kyphosis (PJK) risk."
            },
            c7_pa: {
                name: "🎯 C7-PA (C7 Pelvic Angle)",
                badge: "3. Sagittal Balance • Global Angular Alignment",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the C7 vertebral body**."
                ],
                tip: "Connects C7 to the S1 endplate center and bicoxofemoral axis."
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
                    "**With Pelvis measured:** Click **once** on the **center of the L1 body** (auto-connects to S1).",
                    "**Without Pelvis:** Click the center of L1 and then the S1 endplate center."
                ],
                tip: "Measures the inclination of the S1-L1 segment relative to the vertical axis."
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
                    "**Point 2 (S1):** Click the **posterosuperior corner of the S1 endplate** (or auto-anchors if Pelvis is measured)."
                ],
                tip: "Academic principle (Schwab): SVA < 4 cm is normal; 4 to 9.5 cm is moderate; > 9.5 cm indicates severe sagittal malalignment."
            },
            gt: {
                name: "📐 Global Tilt (GT - Obeid / Boissière Angle)",
                badge: "3. Sagittal Balance • Automatic / 1-Click Parameter",
                steps: [
                    "**100% Automatic Mode:** If **Pelvis (PI, PT, SS)** and **C7** are already marked, clicking this button automatically traces and calculates **Global Tilt (GT)**.",
                    "**1-Click Mode:** If only Pelvis is measured, click this button and then click **once on the center of C7**."
                ],
                tip: "Academic principle: Combines spinal inclination (C7 Tilt) and pelvic retroversion (PT) into a single magnification-free angle (GT ≈ C7 Tilt + PT). Ideal value: GT ≈ 0.48 × PI - 15°."
            },
            l1_s1: {
                name: "📐 L1-S1 (Global Lumbar Lordosis - LL)",
                badge: "4. Regional Alignment • Lumbar Lordosis",
                steps: [
                    "**Points 1 & 2 (L1 Upper Endplate):** Click the anterior and posterior corners of the **L1** superior endplate.",
                    "**Points 3 & 4 (S1 Upper Endplate):** Click the anterior and posterior corners of the **S1** endplate."
                ],
                tip: "Computes ideal proportional lordosis (Ideal LL = 0.6 × PI + 30°) and feeds the GAP Score."
            },
            l4_s1: {
                name: "📐 L4-S1 (Distal Lumbar Lordosis)",
                badge: "4. Regional Alignment • Lower Lumbar Arc",
                steps: [
                    "**Points 1 & 2 (L4 Upper Endplate):** Click the anterior and posterior corners of the **L4** superior endplate.",
                    "**Points 3 & 4 (S1 Upper Endplate):** Click the anterior and posterior corners of the **S1** endplate."
                ],
                tip: "Academic principle: L4-S1 should account for 50% to 80% of total lordosis (ideal 35°-40°) and powers the Lordosis Distribution Index (LDI) in GAP Score."
            },
            l4_l5: {
                name: "📐 L4-L5 (Segmental Lordosis)",
                badge: "4. Regional Alignment • L4-L5 Segment",
                steps: [
                    "**Points 1 & 2:** Click the anterior and posterior corners of the **L4** superior endplate.",
                    "**Points 3 & 4:** Click the anterior and posterior corners of the **L5** inferior endplate."
                ],
                tip: "Quantifies segmental lordosis at L4-L5 for interbody cage or osteotomy planning."
            },
            cervical_cobb: {
                name: "📐 Cervical Alignment (C2-C7 / C0-C2 / T1 Slope)",
                badge: "5. Cervical Alignment • Cervical Curves",
                steps: [
                    "**Points 1 & 2 (Upper Reference):** Click the anterior and posterior corners of the **C2** inferior endplate (or T1 superior endplate).",
                    "**Points 3 & 4 (Lower Reference):** Click the anterior and posterior corners of the **C7** inferior endplate (or horizontal reference)."
                ],
                tip: "Academic principle: Cervical lordosis adapts to T1 Slope (T1S - CL < 15°-20°) to maintain horizontal gaze."
            },
            csva: {
                name: "📍 cSVA (Cervical C2-C7 Plumbline)",
                badge: "5. Cervical Alignment • Cervical Translation",
                steps: [
                    "**Point 1 (C2):** Click the **center of the C2 dens/body**.",
                    "**Point 2 (C7):** Click the **posterosuperior corner of the C7 vertebral body**."
                ],
                tip: "Academic principle: cSVA > 4 cm correlates with poor clinical outcomes in cervical deformity."
            },
            cobb_coronal: {
                name: "📐 Coronal Cobb Angle (AP Scoliosis)",
                badge: "6. Coronal Plane (AP) • Curve Magnitude",
                steps: [
                    "**Points 1 & 2 (Upper End Vertebra):** Click the left and right borders of the upper endplate.",
                    "**Points 3 & 4 (Lower End Vertebra):** Click the left and right borders of the lower endplate."
                ],
                tip: "Dynamically linked with the AP Coronal Rod Reduction simulator to display live scoliosis correction."
            },
            point_marker: {
                name: "📍 Coronal Balance AP (C7 Plumbline & S1 CSVL)",
                badge: "6. Coronal Plane (AP) • C7 - CSVL Offset",
                steps: [
                    "**C7 Button:** Click **once** on the center of **C7** on the AP radiograph.",
                    "**S1 (CSVL) Button:** Click **once** on the center of the sacrum (**S1**) to set the Center Sacral Vertical Line."
                ],
                tip: "A horizontal offset > 2 to 4 cm between C7 and CSVL defines coronal trunk decompensation."
            },
            osteotomy: {
                name: "✂️ 1. Place Corrective Osteotomy (Trace Wedge)",
                badge: "7. Corrective Osteotomies • Manual Wedge Tracing",
                steps: [
                    "**Point 1 (Upper Cut):** Click the anterior vertebral cortex at the upper edge of the wedge.",
                    "**Point 2 (Hinge / Apex):** Click the posterior vertebral wall (hinge point).",
                    "**Point 3 (Lower Cut):** Click the anterior cortex below Point 1 to open the wedge angle."
                ],
                tip: "You can place multiple osteotomies across levels. Drag any vertex to refine the wedge geometry."
            },
            ost_sim: {
                name: "✂️ 2. Simulate Wedge Closure (Automatic Kinematics)",
                badge: "7. Corrective Osteotomies • Automatic Simulation",
                steps: [
                    "**Prerequisite:** Have at least one 3-point osteotomy wedge placed on the spine.",
                    "**Automatic Action:** Folds the radiograph around each osteotomy hinge, rotating the cranial spine, pedicle screws, rods, and anatomical landmarks in real time."
                ],
                tip: "Biomechanics: Automatically recalculates postoperative SVA, PT, SS, L1-S1, L1-PA, T4-PA, C2 Tilt, Global Tilt, and GAP Score."
            },
            ost_modal: {
                name: "⚙️ 3. Adjust Degrees & Schwab Classification (Grades 1-6)",
                badge: "7. Corrective Osteotomies • Anatomical Classification",
                steps: [
                    "**Schwab Osteotomy Classification (2014):** Select a grade to automatically set the anatomical wedge angle:",
                    "• **Grade 1 (Partial Facetectomy / SPO):** ~5°-10°.\n• **Grade 2 (Ponte / Complete Facetectomy):** ~10°-15°.\n• **Grade 3 (PSO - Pedicle Subtraction):** ~25°-35°.\n• **Grade 4 (Extended PSO + Disc):** ~35°-45°.\n• **Grade 5 (VCR - Vertebral Column Resection):** ~50°.\n• **Grade 6 (Multiple VCR):** > 60°."
                ],
                tip: "Use the slider or numeric input to fine-tune the exact correction needed to match ideal spinopelvic targets."
            },
            rod_sagittal: {
                name: "🔩 1. Sagittal Pedicle Screws & Rod",
                badge: "7B. Instrumentation • Profile with cm Sizing",
                steps: [
                    "**Place Screws:** Click each vertebral pedicle along your planned construct.",
                    "**Finish Rod:** **Double-click the last screw** (or click the green Finish button).",
                    "**Size Screw Length (cm):** Drag the **yellow tip** of any screw to the anterior vertebral cortex."
                ],
                tip: "Measures individual screw length in centimeters and allows custom angulation (e.g., S1 tricortical promontory or iliac trajectory)."
            },
            rod_coronal: {
                name: "🔩 2. Coronal AP Rods (2 Sides)",
                badge: "7B. Instrumentation • Bilateral AP Construct",
                steps: [
                    "**First Rod:** Click each pedicle on one side and **double-click the last screw** to finish.",
                    "**Second Rod:** Click the button again and trace the contralateral pedicles, finishing with a double-click."
                ],
                tip: "Computes bilateral rod length in cm and unlocks the AP scoliosis reduction simulator."
            },
            rod_panel: {
                name: "📐 3. Coronal Correction AP & Derotation Prognosis",
                badge: "7B. Instrumentation • Automatic AP Simulator",
                steps: [
                    "**Reduction Slider (0% to 100%):** Simulates translation of the scoliotic spine toward the contoured rods.",
                    "**Live Prognosis:** Automatically calculates residual Coronal Cobb angle, correction percentage, and coupled apical vertebral derotation."
                ],
                tip: "Biomechanics: Rod translation and derotation maneuvers couple coronal straightening with axial apical derotation."
            },
            gap_score: {
                name: "⚖️ Evaluate GAP Score (Global Alignment & Proportion)",
                badge: "8. Results • Automatic Calculator (Yilgor et al.)",
                steps: [
                    "**Inputs:** Uses **PI/PT/SS**, **L1-S1**, **L4-S1**, **Global Tilt (GT)**, and Patient Age.",
                    "**Automatic Scoring (0 to 13 pts):** Evaluates 4 PI-proportional domains: **RPV** (Relative Pelvic Version), **RLL** (Relative Lumbar Lordosis), **LDI** (Lordosis Distribution Index), and **RSA** (Relative Spinopelvic Alignment)."
                ],
                tip: "Academic interpretation (Yilgor et al., JBJS): • **0-2 pts (🟢 Proportioned):** ~6% mechanical failure risk. • **3-6 pts (🟡 Moderately Disproportioned):** ~47% risk. • **≥ 7 pts (🔴 Severely Disproportioned):** ~95% risk of PJK / mechanical failure."
            },
            results_table: {
                name: "📊 Calculate / Compare Values & T4-L1 Mismatch",
                badge: "8. Results • Automatic Biomechanical Summary",
                steps: [
                    "**Automatic Action:** Compiles all parameters into **Base (Pre-Op)**, **Ideal (PI-based)**, and **Achieved (Simulated / Post-Op)** columns.",
                    "**T4-L1 Mismatch:** Automatically computes `T4-PA minus L1-PA` (target < 3°) to verify global spinopelvic harmony."
                ],
                tip: "Verify that your simulated osteotomies bring achieved values within ideal patient-specific targets before exporting the Surgical PDF Report."
            }
        }
    };

    // 2. CLASIFICADOR PRECISO DE TODOS LOS BOTONES (MANUALES Y AUTOMÁTICOS)
    function classifyParameterToKey(rawStr) {
        if (!rawStr) return null;
        const s = rawStr.toLowerCase();

        // 1. Verificar PRIMERO Global Tilt (GT) antes que cualquier otro "Tilt"
        if (s.includes('global tilt') || s.includes('calculateoractivategt') || /\bgt\b/.test(s)) {
            return 'gt';
        }

        // 2. Botones automáticos de simulación, paneles y resultados
        if (s.includes('toggleostsim') || s.includes('simular cierre') || s.includes('wedge closure')) return 'ost_sim';
        if (s.includes('showostmodal') || s.includes('ajustar grados') || s.includes('adjust degrees')) return 'ost_modal';
        if (s.includes('showrodpanel') || s.includes('corrección coronal') || s.includes('coronal correction')) return 'rod_panel';
        if (s.includes('showgapmodal') || s.includes('gap score')) return 'gap_score';
        if (s.includes('showresults') || s.includes('calcular / comparar') || s.includes('calculate / compare')) return 'results_table';

        // 3. Herramientas de instrumentación y osteotomía manual
        if (s.includes('rod') || s.includes('barra') || s.includes('startorfinishrod')) {
            return (s.includes('coronal') || s.includes('ap ') || s.includes('2 lado') || s.includes('2 side')) ? 'rod_coronal' : 'rod_sagittal';
        }
        if (s.includes('osteo') || s.includes('schwab') || s.includes('cuña') || s.includes('wedge')) return 'osteotomy';

        // 4. Pelvis y herramientas básicas
        if (s.includes('pelv') || s.includes('pi, pt') || s.includes('pi,pt') || s.includes('pi_pt') || s.includes('spinopelv') || /\bpi\b/.test(s)) return 'pelvis';
        if (s.includes('calibr')) return 'calibrate';
        if (s.includes('circle') || s.includes('círculo') || s.includes('circulo')) return 'circle';
        if (s.includes('simple line') || s.includes('línea simple') || s.includes('linea simple') || /\bline\b/.test(s)) return 'line';

        // 5. Ángulos PA y Tilt individuales
        if (s.includes('l1-pa') || s.includes('l1_pa') || s.includes('l1pa')) return 'l1_pa';
        if (s.includes('t4-pa') || s.includes('t4_pa') || s.includes('t4pa')) return 't4_pa';
        if (s.includes('c7-pa') || s.includes('c7_pa') || s.includes('c7pa')) return 'c7_pa';
        if (s.includes('c2-pa') || s.includes('c2_pa') || s.includes('c2pa')) return 'c2_pa';

        if (s.includes('l1 tilt') || s.includes('l1-tilt') || s.includes('l1_tilt')) return 'l1_tilt';
        if (s.includes('t4 tilt') || s.includes('t4-tilt') || s.includes('t4_tilt')) return 't4_tilt';
        if (s.includes('c7 tilt') || s.includes('c7-tilt') || s.includes('c7_tilt')) return 'c7_tilt';
        if (s.includes('c2 tilt') || s.includes('c2-tilt') || s.includes('c2_tilt')) return 'c2_tilt';

        // 6. Regional, Cervical y Coronal
        if (s.includes('l1-s1') || s.includes('l1_s1')) return 'l1_s1';
        if (s.includes('l4-s1') || s.includes('l4_s1')) return 'l4_s1';
        if (s.includes('l4-l5') || s.includes('l4_l5')) return 'l4_l5';
        if (s.includes('tk') || s.includes('kypho') || s.includes('cifos') || s.includes('t4-t12') || s.includes('t1-t12') || s.includes('t5-t12')) return 'tk';

        if (s.includes('csva') || s.includes('c2-c7 sva') || s.includes('c2 sva')) return 'csva';
        if (s.includes('c2-c7') || s.includes('c0-c2') || s.includes('t1 slope') || s.includes('t1-slope') || s.includes('cervical')) return 'cervical_cobb';
        if (s.includes('sva') || s.includes('plumbline') || s.includes('plomada')) {
            return (s.includes('coronal') || s.includes('csvl') || s.includes('bao')) ? 'point_marker' : 'sva';
        }

        if (s.includes('cobb_coronal') || s.includes('coronal cobb') || s.includes('cobb coronal') || s.includes('escoliosis') || s.includes('scoliosis')) return 'cobb_coronal';
        if (s.includes('point_marker') || s.includes('bao') || s.includes('csvl') || s.includes('coronal c7') || s.includes('coronal s1')) return 'point_marker';

        if (/\bpa\b/.test(s)) return 'l1_pa';
        if (s.includes('tilt')) return 'c2_tilt';
        if (s.includes('cobb')) return 'cobb';

        return null;
    }

    // 3. OBTENER EL PARÁMETRO SELECCIONADO (SEA HERRAMIENTA MANUAL O BOTÓN AUTOMÁTICO)
    function getCurrentSelectedParameterInfo() {
        const isToolOn = (typeof activeTool !== 'undefined' && activeTool !== null && activeTool !== '');
        if (isToolOn) {
            const tName = typeof activeTool !== 'undefined' ? activeTool : '';
            const tTitle = (typeof activeTitle !== 'undefined' && activeTitle) ? activeTitle : '';
            const tSub = (typeof activeSubType !== 'undefined' ? activeSubType : '');
            const key = classifyParameterToKey(`${tTitle} ${tSub} ${tName}`);
            if (key) {
                return {
                    key: key,
                    label: tTitle || (window._lastSelectedSidebarCtx ? window._lastSelectedSidebarCtx.label : tName.toUpperCase()),
                    isLiveTool: true
                };
            }
        }
        // Si tocó un botón automático (como Global Tilt automático, GAP Score, Simular Cierre, etc.), devolver ese último botón tocado
        if (window._lastSelectedSidebarCtx && window._lastSelectedSidebarCtx.key) {
            return window._lastSelectedSidebarCtx;
        }
        return null;
    }

    // Capturar cualquier clic en cualquier botón del panel lateral izquierdo (manual o automático)
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('aside button, .tool-btn');
        if (!btn) return;
        const onclickStr = btn.getAttribute('onclick') || '';
        if (onclickStr.includes('clearAllRods')) return;

        const label = (btn.innerText || '').trim();
        const i18nStr = btn.getAttribute('data-i18n') || '';
        const key = classifyParameterToKey(`${label} ${onclickStr} ${i18nStr}`);
        if (key) {
            window._lastSelectedSidebarCtx = {
                key: key,
                label: label,
                isLiveTool: true
            };
            window._manualPreviewKey = null;
            setTimeout(updateHelpButtonBadge, 20);
        }
    }, true);

    if (typeof activateTool === 'function') {
        const origActivate = activateTool;
        activateTool = function(tool, title, subType) {
            const key = classifyParameterToKey(`${title || ''} ${subType || ''} ${tool || ''}`);
            if (key) {
                window._lastSelectedSidebarCtx = {
                    key: key,
                    label: title || (window._lastSelectedSidebarCtx ? window._lastSelectedSidebarCtx.label : tool),
                    isLiveTool: true
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
            ? 'Ayuda Clínica y Académica del Parámetro Seleccionado / Leyenda'
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

    // 5. MODAL DE AYUDA CONTEXTUAL Y ACADÉMICA
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
                <span id="help-footer-hint" class="text-[10px] text-gray-400">Selecciona cualquier parámetro (manual o automático) y toca ❓.</span>
                <button onclick="document.getElementById('help-context-modal').classList.add('hidden')" id="help-close-btn" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors">Continuar</button>
            </div>
        </div>
    `;
    helpModal.addEventListener('click', function() {
        helpModal.classList.add('hidden');
    });
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
        document.getElementById('help-footer-hint').innerText = isEs
            ? 'Selecciona cualquier botón del menú (manual o automático) y toca ❓.'
            : 'Select any sidebar button (manual or automatic) and tap ❓.';
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
            const selInfo = getCurrentSelectedParameterInfo();
            const shownKey = window._manualPreviewKey || (selInfo ? selInfo.key : null);
            const g = shownKey ? TOOL_GUIDES[langKey][shownKey] : null;

            let html = '';
            if (g) {
                const isShowingSelected = Boolean(selInfo && (!window._manualPreviewKey || window._manualPreviewKey === selInfo.key));
                const statusBadge = isShowingSelected
                    ? (isEs ? `🟢 PARÁMETRO SELECCIONADO: ${selInfo.label}` : `🟢 SELECTED PARAMETER: ${selInfo.label}`)
                    : (isEs ? `📖 CONSULTA ACADÉMICA Y CLÍNICA` : `📖 ACADEMIC & CLINICAL REFERENCE`);
                const badgeCls = isShowingSelected
                    ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/60"
                    : "bg-sky-900/50 text-sky-300 border-sky-500/50";

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
                        <p class="text-[11px] text-gray-400">${isEs ? 'Selecciona cualquier botón del menú lateral (manual o automático) y toca ❓, o haz clic en cualquiera de la enciclopedia inferior:' : 'Select any button in the left sidebar (manual or automatic) and tap ❓, or pick any item from the encyclopedia below:'}</p>
                    </div>
                `;
            }

            html += `
                <div class="pt-1">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1.5">${isEs ? 'Enciclopedia completa de parámetros (Manuales y Automáticos):' : 'Complete Parameter Encyclopedia (Manual & Automatic):'}</div>
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
                ['1. Herramientas Básicas y Calibración', 'Calibra la escala en cm con un testigo métrico, traza líneas simples, círculos de referencia o ángulos de Cobb libres y cifosis torácica (Tk).'],
                ['2. Parámetros Pélvicos (PI, PT y SS)', 'Mide siempre primero la pelvis (cabezas femorales + platillo de S1). Es la llave maestra para que los ángulos PA, Tilt, Global Tilt y GAP Score funcionen automáticamente.'],
                ['3, 4 y 5. Balance Sagital, Regional y Cervical', 'Incluye L1-PA, T4-PA, C7-PA, C2-PA, Tilts, SVA, Global Tilt (GT), L1-S1, L4-S1, L4-L5, C2-C7 y cSVA.'],
                ['6. Plano Coronal (Escoliosis AP)', 'Mide los ángulos de Cobb coronales y los marcadores de plomada C7 y línea media sacra S1 (CSVL).'],
                ['7. Osteotomías de Schwab (Grados 1 al 6)', 'Marca 3 puntos sobre la vértebra, elige el Grado de Schwab (1 a 6) y simula el cierre de la cuña con rotación automática de la columna.'],
                ['7B. Tornillos (cm) y Barras Sagital / AP', 'Coloca tornillos pediculares, estira su punta amarilla para medir el largo en cm y simula la reducción coronal y desrotación en AP.'],
                ['8. Tabla Comparativa, Mismatch y GAP Score', 'Evalúa valores Base, Ideales y Logrados, el Mismatch (T4PA - L1PA) y la proporcionalidad mecánica mediante el GAP Score.']
            ] : [
                ['1. Basic Tools & Calibration', 'Calibrate scale in cm, draw simple lines, reference circles, or Cobb angles and Thoracic Kyphosis (Tk).'],
                ['2. Pelvic Parameters (PI, PT & SS)', 'Always measure the pelvis first (femoral heads + S1 endplate). It powers automatic PA angles, Tilts, Global Tilt, and GAP Score.'],
                ['3, 4 & 5. Sagittal, Regional & Cervical Balance', 'Includes L1-PA, T4-PA, C7-PA, C2-PA, Tilts, SVA, Global Tilt (GT), L1-S1, L4-S1, L4-L5, C2-C7, and cSVA.'],
                ['6. Coronal Plane (AP Scoliosis)', 'Measure Coronal Cobb angles and C7 / S1 (CSVL) plumbline markers.'],
                ['7. Schwab Osteotomies (Grades 1-6)', 'Place 3 points on the vertebra, select Schwab Grades 1-6, and simulate wedge closure with automatic spinal rotation.'],
                ['7B. Pedicle Screws (cm) & Rods', 'Place pedicle screws, drag yellow tips to measure length in cm, and simulate AP coronal reduction and derotation.'],
                ['8. Alignment Table, Mismatch & GAP Score', 'Compare Base, Ideal, and Achieved values, T4-L1 Mismatch, and mechanical proportionality via GAP Score.']
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
