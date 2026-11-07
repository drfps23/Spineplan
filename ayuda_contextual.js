// ============================================================================
// ACTUALIZACIÓN 5 V3 (ayuda_contextual.js): DETECCIÓN TOTAL DE PARÁMETROS + ❓
// Reconoce todos los botones seleccionables del menú lateral sin excepción
// ============================================================================

(function() {
    window._lastToolContext = null;

    // 1. GUÍAS CLÍNICAS DE TODAS LAS HERRAMIENTAS DE MEDICIÓN MANUAL
    const TOOL_GUIDES = {
        es: {
            calibrate: {
                name: "📏 Calibrar Escala (cm)",
                badge: "1. Herramientas Básicas • Escala Real",
                steps: [
                    "**Punto 1:** Haz clic en el extremo inicial del testigo métrico o regla visible en la radiografía.",
                    "**Punto 2:** Haz clic en el extremo final de la distancia conocida (ej. 5 cm o 10 cm) e ingresa el valor en centímetros."
                ],
                tip: "Al calibrar, el SVA, las líneas, las barras y el largo de los tornillos transpediculares se expresan en centímetros reales."
            },
            line: {
                name: "📏 Línea Simple (Distancia Lineal)",
                badge: "1. Herramientas Básicas • Longitud",
                steps: [
                    "**Punto 1:** Haz clic en la primera referencia anatómica.",
                    "**Punto 2:** Haz clic en la segunda referencia para medir la distancia."
                ],
                tip: "Muestra la distancia en centímetros (cm) si la placa está calibrada, o en píxeles (px)."
            },
            circle: {
                name: "⭕ Círculo (Contorno / Cabeza Femoral)",
                badge: "1. Herramientas Básicas • Geometría",
                steps: [
                    "**Punto 1 (Centro):** Haz clic en el centro de la cabeza femoral o estructura redonda.",
                    "**Punto 2 (Borde):** Haz clic en el contorno externo para fijar el radio."
                ],
                tip: "Puedes arrastrar el centro o el borde del círculo en cualquier momento para ajustarlo."
            },
            cobb: {
                name: "📐 Ángulo de Cobb Libre",
                badge: "1. Herramientas Básicas • Ángulo Intervertebral",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior):** Marca el borde anterior y posterior del platillo vertebral superior.",
                    "**Puntos 3 y 4 (Platillo Inferior):** Marca el borde anterior y posterior del platillo vertebral inferior."
                ],
                tip: "Arrastra cualquiera de los 4 puntos si deseas perfeccionar la inclinación sobre los platillos."
            },
            tk: {
                name: "📐 Tk - Cifosis Torácica (T4 - T12)",
                badge: "1 y 4. Curvas Sagitales • Cifosis Torácica",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de T4):** Haz clic en el borde anterior y posterior del platillo superior de **T4**.",
                    "**Puntos 3 y 4 (Platillo Inferior de T12):** Haz clic en el borde anterior y posterior del platillo inferior de **T12**."
                ],
                tip: "El valor de la cifosis torácica se integra automáticamente en la tabla de resultados y responde al cierre de osteotomías."
            },
            pelvis: {
                name: "🦴 Medir PI, PT y SS (Parámetros Pélvicos)",
                badge: "2. Parámetros Pélvicos • Base Espinopélvica",
                steps: [
                    "**Punto 1 (Cabeza Femoral 1):** Haz clic en el centro de la primera cabeza femoral.",
                    "**Punto 2 (Cabeza Femoral 2):** Haz clic en el centro de la segunda cabeza femoral (si están superpuestas, haz clic en el mismo centro bicoxofemoral).",
                    "**Punto 3 (Borde Anterior de S1):** Haz clic en el promontorio sacro (esquina anterosuperior de **S1**).",
                    "**Punto 4 (Borde Posterior de S1):** Haz clic en la esquina posterosuperior del platillo de **S1**."
                ],
                tip: "Al colocar el 4to punto, el programa calcula automáticamente PI, PT y SS, y deja registrada la pelvis para que los ángulos PA, Tilt, Global Tilt y GAP Score funcionen con un solo clic."
            },
            l1_pa: {
                name: "🎯 L1-PA (Ángulo Pélvico de L1)",
                badge: "3. Balance Sagital • Proporcionalidad Lumbar",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de L1**."
                ],
                tip: "Se une automáticamente al centro de S1 y al eje bicoxofemoral. Su valor ideal se calcula según la PI del paciente (0.5 × PI - 19°)."
            },
            t4_pa: {
                name: "🎯 T4-PA (Ángulo Pélvico de T4)",
                badge: "3. Balance Sagital • Alineación Toracolumbar",
                steps: [
                    "**Requisito:** Haber medido primero **PI, PT y SS**.",
                    "**1 solo clic:** Haz clic directamente en el **centro del cuerpo vertebral de T4**."
                ],
                tip: "Al tener medidos L1-PA y T4-PA, el programa calcula automáticamente el Mismatch (T4-PA menos L1-PA, ideal < 3°)."
            },
            c7_pa: {
                name: "🎯 C7-PA (Ángulo Pélvico de C7)",
                badge: "3. Balance Sagital • Alineación Global",
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
                tip: "Evalúa la alineación global desde C2 hasta la base pélvica sin depender de la calibración de la imagen."
            },
            l1_tilt: {
                name: "🧭 L1 Tilt (Inclinación Sagital de L1)",
                badge: "3. Balance Sagital • Inclinación Respecto a la Vertical",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de L1** (se conecta automáticamente al centro de S1).",
                    "**Sin Pelvis medida:** Marca el centro de L1 y luego el centro del platillo de S1."
                ],
                tip: "Mide el ángulo de inclinación de L1 respecto a la línea vertical."
            },
            t4_tilt: {
                name: "🧭 T4 Tilt (Inclinación Sagital de T4)",
                badge: "3. Balance Sagital • Inclinación Respecto a la Vertical",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de T4**.",
                    "**Sin Pelvis medida:** Marca el centro de T4 y luego el centro del platillo de S1."
                ],
                tip: "Mide la inclinación del segmento torácico superior respecto a la vertical desde S1."
            },
            c7_tilt: {
                name: "🧭 C7 Tilt (Inclinación Sagital de C7)",
                badge: "3. Balance Sagital • Inclinación Global de C7",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo de C7**.",
                    "**Sin Pelvis medida:** Marca el centro de C7 y luego el centro del platillo de S1."
                ],
                tip: "Parámetro angular equivalente a la plomada de C7 pero independiente de la magnificación radiográfica."
            },
            c2_tilt: {
                name: "🧭 C2 Tilt (Inclinación Sagital de C2)",
                badge: "3. Balance Sagital • Inclinación Global de C2",
                steps: [
                    "**Con Pelvis ya medida:** Haz **1 solo clic** en el **centro del cuerpo/odontoides de C2**.",
                    "**Sin Pelvis medida:** Marca el centro de C2 y luego el centro del platillo de S1."
                ],
                tip: "Valor ideal entre 1° y -3°. Se actualiza en vivo cuando simulas el cierre de osteotomías."
            },
            sva: {
                name: "📍 SVA (Plomada de C7 a S1)",
                badge: "3. Balance Sagital • Traslación Sagital Global",
                steps: [
                    "**Punto 1 (C7):** Haz clic en el **centro del cuerpo vertebral de C7**.",
                    "**Punto 2 (S1):** Si no has medido la pelvis, haz clic en la **esquina posterosuperior del platillo de S1** (si ya mediste la pelvis, toma S1 automáticamente o con el 2do clic)."
                ],
                tip: "Mide la distancia horizontal entre la plomada de C7 y el borde posterosuperior de S1 (valor normal < 4 cm)."
            },
            l1_s1: {
                name: "📐 L1-S1 (Lordosis Lumbar Global)",
                badge: "4. Alineación Regional • Lordosis Lumbar",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L1):** Marca el borde anterior y posterior del platillo superior de **L1**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Al medir L1-S1, el programa calcula la lordosis ideal (0.6 × PI + 30°) y alimenta automáticamente el cálculo del GAP Score."
            },
            l4_s1: {
                name: "📐 L4-S1 (Lordosis Lumbar Distal)",
                badge: "4. Alineación Regional • Arco Inferior Lumbar",
                steps: [
                    "**Puntos 1 y 2 (Platillo Superior de L4):** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4 (Platillo Superior de S1):** Marca el borde anterior y posterior del platillo de **S1**."
                ],
                tip: "Representa ~2/3 de la lordosis total (ideal 35° a 40°) y permite calcular el Índice de Distribución de Lordosis (LDI) en el GAP Score."
            },
            l4_l5: {
                name: "📐 L4-L5 (Ángulo Segmentario)",
                badge: "4. Alineación Regional • Segmento L4-L5",
                steps: [
                    "**Puntos 1 y 2:** Marca el borde anterior y posterior del platillo superior de **L4**.",
                    "**Puntos 3 y 4:** Marca el borde anterior y posterior del platillo inferior de **L5**."
                ],
                tip: "Útil para cuantificar cuánto aporta el segmento L4-L5 a la lordosis distal."
            },
            cervical_cobb: {
                name: "📐 Curva Cervical (C2-C7 / C0-C2 / T1 Slope)",
                badge: "5. Alineación Cervical • Ángulos Cervicales",
                steps: [
                    "**Puntos 1 y 2 (Referencia Superior):** Marca el borde anterior y posterior del platillo inferior de **C2** (o línea de McGregor/T1 según el botón elegido).",
                    "**Puntos 3 y 4 (Referencia Inferior):** Marca el borde anterior y posterior del platillo inferior de **C7** (o horizontal de referencia)."
                ],
                tip: "Puedes arrastrar cualquiera de los puntos posteriormente para ajustar la precisión sobre los platillos cervicales."
            },
            csva: {
                name: "📍 cSVA (Plomada Cervical C2 a C7)",
                badge: "5. Alineación Cervical • Balance Traslacional Cervical",
                steps: [
                    "**Punto 1 (C2):** Haz clic en el **centro de la odontoides / cuerpo de C2**.",
                    "**Punto 2 (C7):** Haz clic en la **esquina posterosuperior del cuerpo vertebral de C7**."
                ],
                tip: "Mide la traslación sagital cervical en centímetros cuando la placa está calibrada (normal < 4 cm)."
            },
            cobb_coronal: {
                name: "📐 Ángulo de Cobb Coronal (Escoliosis AP)",
                badge: "6. Plano Coronal (AP) • Curvas Escolióticas",
                steps: [
                    "**Puntos 1 y 2 (Vértebra Límite Superior):** Marca los bordes izquierdo y derecho del platillo superior de la vértebra más inclinada arriba.",
                    "**Puntos 3 y 4 (Vértebra Límite Inferior):** Marca los bordes izquierdo y derecho del platillo inferior de la vértebra más inclinada abajo."
                ],
                tip: "Se reduce en tiempo real cuando trazas las Barras Coronales AP y mueves el deslizador de Reducción y Desrotación."
            },
            point_marker: {
                name: "📍 Balance Coronal AP (Plomada C7 y Línea Media S1)",
                badge: "6. Plano Coronal (AP) • Balance C7 - CSVL",
                steps: [
                    "**Si seleccionaste C7:** Haz **1 clic** en el centro del cuerpo/proceso espinoso de **C7** en la placa AP.",
                    "**Si seleccionaste S1 (CSVL):** Haz **1 clic** en el centro del sacro (**S1**) para trazar la Línea Vertical Centro-Sacra."
                ],
                tip: "Al marcar ambos puntos, el programa mide automáticamente la desviación coronal del tronco respecto a la pelvis."
            },
            osteotomy: {
                name: "✂️ Colocar Osteotomía de Schwab (Cuña 1 a 6)",
                badge: "7. Osteotomías Correctivas • Simulación Sagital",
                steps: [
                    "**Punto 1 (Corte Superior):** Haz clic en el borde anterior del cuerpo vertebral donde inicia el corte superior.",
                    "**Punto 2 (Bisagra / Ápex):** Haz clic en el muro vertebral posterior (punto de bisagra).",
                    "**Punto 3 (Corte Inferior):** Haz clic más abajo en la cortical anterior para abrir el ángulo de la cuña."
                ],
                tip: "Puedes colocar varios cortes en distintos niveles. Todos los puntos son arrastrables cuando la simulación está apagada."
            },
            rod_sagittal: {
                name: "🔩 Barra y Tornillos Transpediculares Sagitales",
                badge: "7B. Instrumentación • Perfil con Largo en cm",
                steps: [
                    "**Colocar tornillos:** Haz clic en cada pedículo vertebral a instrumentar.",
                    "**Terminar barra:** Haz **doble clic en el último tornillo** (o toca el botón verde '✅ Terminar Barra Actual').",
                    "**Ajustar largo del tornillo (cm):** Arrastra el **punto amarillo de la punta de cualquier tornillo** hasta la cortical anterior vertebral."
                ],
                tip: "Cada tornillo muestra su longitud exacta en cm y permite ajustar su inclinación (ej. S1 al promontorio o tornillos ilíacos)."
            },
            rod_coronal: {
                name: "🔩 Barras Coronales AP (2 Lados)",
                badge: "7B. Instrumentación • Escoliosis AP",
                steps: [
                    "**Primera Barra:** Haz clic en cada pedículo de un lado de la curva y haz **doble clic en el último tornillo** para cerrarla.",
                    "**Segunda Barra:** Vuelve a tocar el botón y marca los pedículos del lado contrario, cerrando con doble clic."
                ],
                tip: "Al cerrar la barra en AP, se abre automáticamente el panel para simular la reducción coronal y ver el pronóstico de desrotación."
            }
        },
        en: {
            calibrate: {
                name: "📏 Calibrate Scale (cm)",
                badge: "1. Basic Tools • Real Metric Scale",
                steps: [
                    "**Point 1:** Click the start of the radiographic ruler or marker.",
                    "**Point 2:** Click the end of the known segment (e.g., 5 cm or 10 cm) and enter its value in cm."
                ],
                tip: "Converts SVA, lines, rods, and pedicle screw lengths into real centimeters."
            },
            line: {
                name: "📏 Simple Line (Linear Distance)",
                badge: "1. Basic Tools • Length",
                steps: [
                    "**Point 1:** Click the starting anatomical landmark.",
                    "**Point 2:** Click the ending landmark."
                ],
                tip: "Displays distance in cm when calibrated, or pixels (px) otherwise."
            },
            circle: {
                name: "⭕ Circle (Anatomical Reference)",
                badge: "1. Basic Tools • Geometry",
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
                tip: "Drag any of the 4 points afterward to refine alignment."
            },
            tk: {
                name: "📐 Tk - Thoracic Kyphosis (T4 - T12)",
                badge: "1 & 4. Sagittal Curves • Thoracic Kyphosis",
                steps: [
                    "**Points 1 & 2 (T4 Upper Endplate):** Click the anterior and posterior corners of the **T4** superior endplate.",
                    "**Points 3 & 4 (T12 Lower Endplate):** Click the anterior and posterior corners of the **T12** inferior endplate."
                ],
                tip: "Automatically feeds the alignment table and updates during osteotomy closure."
            },
            pelvis: {
                name: "🦴 Measure PI, PT & SS (Pelvic Parameters)",
                badge: "2. Pelvic Parameters • Spinopelvic Base",
                steps: [
                    "**Point 1 (Femoral Head 1):** Click the center of the first femoral head.",
                    "**Point 2 (Femoral Head 2):** Click the center of the second femoral head (click the same center if overlapped).",
                    "**Point 3 (Anterior S1):** Click the anterosuperior corner of **S1** (sacral promontory).",
                    "**Point 4 (Posterior S1):** Click the posterosuperior corner of the **S1** endplate."
                ],
                tip: "Calculates PI, PT, and SS automatically and unlocks 1-click measurements for all PA angles, Tilt angles, Global Tilt, and GAP Score."
            },
            l1_pa: {
                name: "🎯 L1-PA (L1 Pelvic Angle)",
                badge: "3. Sagittal Balance • Lumbar Proportionality",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the L1 vertebral body**."
                ],
                tip: "Automatically connects to the S1 center and bicoxofemoral axis (ideal = 0.5 × PI - 19°)."
            },
            t4_pa: {
                name: "🎯 T4-PA (T4 Pelvic Angle)",
                badge: "3. Sagittal Balance • Thoracolumbar Alignment",
                steps: [
                    "**Prerequisite:** Measure **PI, PT & SS** first.",
                    "**Single Click:** Click directly on the **center of the T4 vertebral body**."
                ],
                tip: "Automatically computes the T4-L1 Mismatch (T4-PA minus L1-PA, ideal < 3°)."
            },
            c7_pa: {
                name: "🎯 C7-PA (C7 Pelvic Angle)",
                badge: "3. Sagittal Balance • Global Alignment",
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
                tip: "Evaluates global spinopelvic alignment from C2 to the pelvis."
            },
            l1_tilt: {
                name: "🧭 L1 Tilt (Sagittal L1 Inclination)",
                badge: "3. Sagittal Balance • Vertical Tilt",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the L1 body** (auto-connects to S1).",
                    "**Without Pelvis:** Click the center of L1 and then the S1 endplate center."
                ],
                tip: "Measures the inclination of L1 relative to the vertical axis."
            },
            t4_tilt: {
                name: "🧭 T4 Tilt (Sagittal T4 Inclination)",
                badge: "3. Sagittal Balance • Vertical Tilt",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the T4 body**.",
                    "**Without Pelvis:** Click the center of T4 and then the S1 endplate center."
                ],
                tip: "Measures upper thoracic inclination from S1 relative to the vertical."
            },
            c7_tilt: {
                name: "🧭 C7 Tilt (Sagittal C7 Inclination)",
                badge: "3. Sagittal Balance • Global C7 Tilt",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the C7 body**.",
                    "**Without Pelvis:** Click the center of C7 and then the S1 endplate center."
                ],
                tip: "Scale-free angular equivalent of the C7 plumbline."
            },
            c2_tilt: {
                name: "🧭 C2 Tilt (Sagittal C2 Inclination)",
                badge: "3. Sagittal Balance • Global C2 Tilt",
                steps: [
                    "**With Pelvis measured:** Click **once** on the **center of the C2 body/dens**.",
                    "**Without Pelvis:** Click the center of C2 and then the S1 endplate center."
                ],
                tip: "Ideal range is 1° to -3°. Updates dynamically during osteotomy simulation."
            },
            sva: {
                name: "📍 SVA (C7 Plumbline to S1)",
                badge: "3. Sagittal Balance • Global Translation",
                steps: [
                    "**Point 1 (C7):** Click the **center of the C7 vertebral body**.",
                    "**Point 2 (S1):** Click the **posterosuperior corner of the S1 endplate** (or auto-anchors if Pelvis is measured)."
                ],
                tip: "Measures horizontal offset between C7 plumbline and posterosuperior S1 (normal < 4 cm)."
            },
            l1_s1: {
                name: "📐 L1-S1 (Global Lumbar Lordosis)",
                badge: "4. Regional Alignment • Lumbar Lordosis",
                steps: [
                    "**Points 1 & 2 (L1 Upper Endplate):** Click the anterior and posterior corners of the **L1** superior endplate.",
                    "**Points 3 & 4 (S1 Upper Endplate):** Click the anterior and posterior corners of the **S1** endplate."
                ],
                tip: "Computes ideal lordosis (0.6 × PI + 30°) and feeds the GAP Score automatically."
            },
            l4_s1: {
                name: "📐 L4-S1 (Distal Lumbar Lordosis)",
                badge: "4. Regional Alignment • Lower Lumbar Arc",
                steps: [
                    "**Points 1 & 2 (L4 Upper Endplate):** Click the anterior and posterior corners of the **L4** superior endplate.",
                    "**Points 3 & 4 (S1 Upper Endplate):** Click the anterior and posterior corners of the **S1** endplate."
                ],
                tip: "Represents ~2/3 of total lordosis (ideal 35°-40°) and powers the Lordosis Distribution Index (LDI)."
            },
            l4_l5: {
                name: "📐 L4-L5 (Segmental Lordosis)",
                badge: "4. Regional Alignment • L4-L5 Segment",
                steps: [
                    "**Points 1 & 2:** Click the anterior and posterior corners of the **L4** superior endplate.",
                    "**Points 3 & 4:** Click the anterior and posterior corners of the **L5** inferior endplate."
                ],
                tip: "Quantifies the segmental contribution of L4-L5."
            },
            cervical_cobb: {
                name: "📐 Cervical Alignment (C2-C7 / C0-C2 / T1 Slope)",
                badge: "5. Cervical Alignment • Cervical Curves",
                steps: [
                    "**Points 1 & 2 (Upper Reference):** Click the anterior and posterior corners of the **C2** inferior endplate (or T1 superior endplate).",
                    "**Points 3 & 4 (Lower Reference):** Click the anterior and posterior corners of the **C7** inferior endplate (or horizontal reference)."
                ],
                tip: "Drag any endpoint afterward to fine-tune cervical endplate alignment."
            },
            csva: {
                name: "📍 cSVA (Cervical C2-C7 Plumbline)",
                badge: "5. Cervical Alignment • Cervical Translation",
                steps: [
                    "**Point 1 (C2):** Click the **center of the C2 dens/body**.",
                    "**Point 2 (C7):** Click the **posterosuperior corner of the C7 vertebral body**."
                ],
                tip: "Measures horizontal cervical offset in cm once calibrated."
            },
            cobb_coronal: {
                name: "📐 Coronal Cobb Angle (AP Scoliosis)",
                badge: "6. Coronal Plane (AP) • Scoliotic Curves",
                steps: [
                    "**Points 1 & 2 (Upper End Vertebra):** Click the left and right borders of the upper endplate.",
                    "**Points 3 & 4 (Lower End Vertebra):** Click the left and right borders of the lower endplate."
                ],
                tip: "Reduces live when you slide the AP Coronal Rod Reduction bar (0-100%)."
            },
            point_marker: {
                name: "📍 Coronal Balance AP (C7 Plumbline & S1 CSVL)",
                badge: "6. Coronal Plane (AP) • C7 - CSVL Offset",
                steps: [
                    "**If C7 selected:** Click **once** on the center of **C7** on the AP radiograph.",
                    "**If S1 (CSVL) selected:** Click **once** on the center of the sacrum (**S1**) to set the Center Sacral Vertical Line."
                ],
                tip: "Once both markers are placed, coronal trunk shift is calculated automatically."
            },
            osteotomy: {
                name: "✂️ Place Corrective Osteotomy (Schwab 1-6)",
                badge: "7. Corrective Osteotomies • Sagittal Wedge",
                steps: [
                    "**Point 1 (Upper Cut):** Click the anterior vertebral cortex at the upper edge of the wedge.",
                    "**Point 2 (Hinge / Apex):** Click the posterior vertebral wall (hinge point).",
                    "**Point 3 (Lower Cut):** Click the anterior cortex below Point 1 to open the wedge angle."
                ],
                tip: "Place multiple cuts if needed. All 3 points of each wedge can be dragged freely when simulation is off."
            },
            rod_sagittal: {
                name: "🔩 Sagittal Pedicle Screws & Rod",
                badge: "7B. Instrumentation • Profile with cm Sizing",
                steps: [
                    "**Place Screws:** Click each vertebral pedicle along your construct.",
                    "**Finish Rod:** **Double-click the last screw** (or click the green Finish button).",
                    "**Measure Screw Length (cm):** Drag the **yellow tip** of any screw to the anterior vertebral cortex."
                ],
                tip: "Each screw displays its exact length in cm and can be angled freely."
            },
            rod_coronal: {
                name: "🔩 Coronal AP Rods (2 Sides)",
                badge: "7B. Instrumentation • AP Scoliosis",
                steps: [
                    "**First Rod:** Click each pedicle on one side of the curve and **double-click the last screw** to finish.",
                    "**Second Rod:** Click the button again and mark the contralateral pedicles, finishing with a double-click."
                ],
                tip: "Finishing an AP rod automatically opens the Coronal Reduction & Derotation prognosis panel."
            }
        }
    };

    // 2. MOTOR UNIVERSAL DE CLASIFICACIÓN (NUNCA FALLA CON NINGÚN BOTÓN DEL MENÚ)
    function classifyParameterToKey(rawStr) {
        if (!rawStr) return null;
        const s = rawStr.toLowerCase();

        // Ignorar botones de acción inmediata / automática que abren modales o simulan sin marcar puntos
        if (s.includes('toggleostsim') || s.includes('showostmodal') || s.includes('showgapmodal') || s.includes('showrodpanel') || s.includes('clearallrods')) {
            return null;
        }

        if (s.includes('rod') || s.includes('barra') || s.includes('startorfinishrod')) {
            return s.includes('coronal') || s.includes('ap ') || s.includes('2 lado') || s.includes('2 side') ? 'rod_coronal' : 'rod_sagittal';
        }
        if (s.includes('osteo') || s.includes('schwab') || s.includes('cuña') || s.includes('wedge')) return 'osteotomy';
        if (s.includes('pelv') || s.includes('pi, pt') || s.includes('pi,pt') || s.includes('pi_pt') || s.includes('spinopelv') || /\bpi\b/.test(s)) return 'pelvis';
        if (s.includes('calibr')) return 'calibrate';
        if (s.includes('circle') || s.includes('círculo') || s.includes('circulo')) return 'circle';
        if (s.includes('simple line') || s.includes('línea simple') || s.includes('linea simple') || /\bline\b/.test(s)) return 'line';

        // Parámetros Sagitales PA y Tilt específicos
        if (s.includes('l1-pa') || s.includes('l1_pa') || s.includes('l1pa')) return 'l1_pa';
        if (s.includes('t4-pa') || s.includes('t4_pa') || s.includes('t4pa')) return 't4_pa';
        if (s.includes('c7-pa') || s.includes('c7_pa') || s.includes('c7pa')) return 'c7_pa';
        if (s.includes('c2-pa') || s.includes('c2_pa') || s.includes('c2pa')) return 'c2_pa';

        if (s.includes('l1 tilt') || s.includes('l1-tilt') || s.includes('l1_tilt')) return 'l1_tilt';
        if (s.includes('t4 tilt') || s.includes('t4-tilt') || s.includes('t4_tilt')) return 't4_tilt';
        if (s.includes('c7 tilt') || s.includes('c7-tilt') || s.includes('c7_tilt')) return 'c7_tilt';
        if (s.includes('c2 tilt') || s.includes('c2-tilt') || s.includes('c2_tilt')) return 'c2_tilt';

        // Curvas regionales y cervicales
        if (s.includes('l1-s1') || s.includes('l1_s1')) return 'l1_s1';
        if (s.includes('l4-s1') || s.includes('l4_s1')) return 'l4_s1';
        if (s.includes('l4-l5') || s.includes('l4_l5')) return 'l4_l5';
        if (s.includes('tk') || s.includes('kypho') || s.includes('cifos') || s.includes('t4-t12') || s.includes('t1-t12') || s.includes('t5-t12')) return 'tk';

        if (s.includes('csva') || s.includes('c2-c7 sva') || s.includes('c2 sva')) return 'csva';
        if (s.includes('c2-c7') || s.includes('c0-c2') || s.includes('t1 slope') || s.includes('t1-slope') || s.includes('cervical')) return 'cervical_cobb';
        if (s.includes('sva') || s.includes('plumbline') || s.includes('plomada')) {
            return (s.includes('coronal') || s.includes('csvl') || s.includes('bao')) ? 'point_marker' : 'sva';
        }

        // Coronal
        if (s.includes('cobb_coronal') || s.includes('coronal cobb') || s.includes('cobb coronal') || s.includes('escoliosis') || s.includes('scoliosis')) return 'cobb_coronal';
        if (s.includes('point_marker') || s.includes('bao') || s.includes('csvl') || s.includes('coronal c7') || s.includes('coronal s1')) return 'point_marker';

        // Genéricos de respaldo
        if (/\bpa\b/.test(s)) return 'l1_pa';
        if (s.includes('tilt')) return 'c2_tilt';
        if (s.includes('cobb')) return 'cobb';

        return null;
    }

    // Buscar si hay algún botón pintado de activo (verde/seleccionado) en la barra lateral
    function detectActiveSidebarButtonContext() {
        const sidebar = document.querySelector('aside') || document.getElementById('sidebar');
        if (sidebar) {
            const buttons = Array.from(sidebar.querySelectorAll('button'));
            for (const btn of buttons) {
                const cls = (btn.className || '').toLowerCase();
                const onclickStr = btn.getAttribute('onclick') || '';
                const i18nStr = btn.getAttribute('data-i18n') || '';
                const label = (btn.innerText || '').trim();

                // Ignorar botones automáticos que abren modales o interruptores de simulación
                if (/toggleostsim|showostmodal|showgapmodal|showrodpanel|calculateoractivategt/i.test(onclickStr)) {
                    continue;
                }

                // Detectar si el botón tiene la clase de herramienta seleccionada en index.html
                const isSelectedStyle = cls.includes('active') ||
                                        cls.includes('bg-emerald-600') ||
                                        cls.includes('bg-green-600') ||
                                        cls.includes('ring-2') ||
                                        btn.innerHTML.includes('Finish Current Rod') ||
                                        btn.innerHTML.includes('Terminar Barra Actual');

                if (isSelectedStyle) {
                    const combined = `${label} ${onclickStr} ${i18nStr} ${typeof activeTool !== 'undefined' ? activeTool : ''} ${typeof activeSubType !== 'undefined' ? activeSubType : ''}`;
                    const key = classifyParameterToKey(combined) || 'cobb';
                    return { key, label, isLive: true };
                }
            }
        }

        // Si activeTool está definido en variables globales
        if (typeof activeTool !== 'undefined' && activeTool) {
            const tStr = `${activeTool} ${typeof activeSubType !== 'undefined' ? activeSubType : ''} ${typeof activeTitle !== 'undefined' ? activeTitle : ''}`;
            const key = classifyParameterToKey(tStr);
            if (key) {
                return {
                    key,
                    label: (typeof activeTitle !== 'undefined' && activeTitle) ? activeTitle : activeTool.toUpperCase(),
                    isLive: true
                };
            }
        }

        return null;
    }

    // Escuchar cualquier clic en los botones de herramientas del menú lateral izquierdo
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('aside button, .tool-btn');
        if (!btn) return;
        const onclickStr = btn.getAttribute('onclick') || '';
        // Ignorar botones que solo abren paneles automáticos
        if (/toggleostsim|showostmodal|showgapmodal|showrodpanel|calculateoractivategt/i.test(onclickStr)) return;

        const label = (btn.innerText || '').trim();
        const i18nStr = btn.getAttribute('data-i18n') || '';
        const combined = `${label} ${onclickStr} ${i18nStr}`;
        const key = classifyParameterToKey(combined);
        if (key) {
            window._lastToolContext = { key, label, isLive: true };
            setTimeout(updateHelpButtonBadge, 30);
        }
    }, true);

    if (typeof activateTool === 'function') {
        const origActivate = activateTool;
        activateTool = function(tool, title, subType) {
            const combined = `${title || ''} ${subType || ''} ${tool || ''}`;
            const key = classifyParameterToKey(combined) || 'cobb';
            window._lastToolContext = { key, label: title || tool || '', isLive: true };
            const res = origActivate.apply(this, arguments);
            updateHelpButtonBadge();
            return res;
        };
    }

    if (typeof deactivateTool === 'function') {
        const origDeactivate = deactivateTool;
        deactivateTool = function() {
            if (window._lastToolContext) window._lastToolContext.isLive = false;
            const res = origDeactivate.apply(this, arguments);
            updateHelpButtonBadge();
            return res;
        };
    }

    function updateHelpButtonBadge() {
        const btn = document.getElementById('btn-top-help');
        if (!btn) return;
        const activeCtx = detectActiveSidebarButtonContext();
        if (activeCtx && activeCtx.isLive) {
            btn.className = "bg-amber-500 hover:bg-amber-400 text-gray-950 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-extrabold transition-all flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.65)] animate-pulse select-none shrink-0";
        } else {
            btn.className = "bg-sky-600/25 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/60 px-2.5 py-1 rounded-md text-xs font-bold transition-colors flex items-center justify-center shadow-sm select-none shrink-0";
        }
    }

    // 3. INYECTAR BOTÓN ❓ EXCLUSIVAMENTE EN EL HEADER DEL ÁREA DE TRABAJO
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
            ? 'Ayuda Contextual de la Herramienta Seleccionada / Leyenda de Iconos'
            : 'Contextual Tool Help & Icon Legend';

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
                <span id="help-footer-hint" class="text-[10px] text-gray-400">Selecciona cualquier parámetro del menú y toca ❓ para ver los pasos.</span>
                <button onclick="document.getElementById('help-context-modal').classList.add('hidden')" id="help-close-btn" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-1.5 rounded text-xs transition-colors">Continuar</button>
            </div>
        </div>
    `;
    helpModal.addEventListener('click', function() {
        helpModal.classList.add('hidden');
    });
    document.body.appendChild(helpModal);

    window.openContextualHelpModal = function() {
        const liveCtx = detectActiveSidebarButtonContext();
        if (liveCtx) {
            window._lastToolContext = liveCtx;
            switchHelpTab('ctx');
        } else if (window._lastToolContext && window._lastToolContext.key) {
            switchHelpTab('ctx');
        } else {
            switchHelpTab('ico');
        }
        document.getElementById('help-context-modal').classList.remove('hidden');
    };

    window.selectToolGuideFromList = function(key) {
        window._lastToolContext = { key: key, label: '', isLive: false };
        switchHelpTab('ctx');
    };

    window.switchHelpTab = function(tab) {
        const isEs = (typeof currentLang === 'undefined' || currentLang === 'es');
        const langKey = isEs ? 'es' : 'en';

        document.getElementById('help-modal-title').innerText = isEs ? 'Centro de Ayuda y Guía Clínica' : 'Clinical Help & Quick Guide';
        document.getElementById('tab-btn-ctx').innerText = isEs ? '🎯 Parámetro Activo' : '🎯 Active Parameter';
        document.getElementById('tab-btn-ico').innerText = isEs ? '🎛️ Iconos (11)' : '🎛️ Icons (11)';
        document.getElementById('tab-btn-mod').innerText = isEs ? '📚 Módulos' : '📚 Modules';
        document.getElementById('help-footer-hint').innerText = isEs
            ? 'Selecciona cualquier parámetro del menú y toca ❓ para ver los pasos.'
            : 'Select any parameter in the sidebar and tap ❓ for step-by-step guidance.';
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
            const liveCtx = detectActiveSidebarButtonContext();
            const activeObj = liveCtx || window._lastToolContext;
            const ctxKey = activeObj ? activeObj.key : null;
            const g = ctxKey ? TOOL_GUIDES[langKey][ctxKey] : null;
            const isNow = Boolean(liveCtx && liveCtx.isLive);
            const customLabel = activeObj && activeObj.label ? activeObj.label : '';

            let html = '';
            if (g) {
                const statusBadge = isNow
                    ? (isEs ? `🟢 PARÁMETRO SELECCIONADO${customLabel ? ': ' + customLabel : ''}` : `🟢 SELECTED PARAMETER${customLabel ? ': ' + customLabel : ''}`)
                    : (isEs ? `🕒 ÚLTIMO PARÁMETRO CONSULTADO${customLabel ? ': ' + customLabel : ''}` : `🕒 LAST VIEWED PARAMETER${customLabel ? ': ' + customLabel : ''}`);
                const badgeCls = isNow ? "bg-emerald-900/60 text-emerald-300 border-emerald-500/60" : "bg-amber-900/50 text-amber-300 border-amber-500/50";

                html += `
                    <div class="bg-gray-800/80 border border-sky-500/60 rounded-lg p-3.5 space-y-2.5 shadow-lg">
                        <div class="flex flex-wrap justify-between items-center gap-1">
                            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded border ${badgeCls}">${statusBadge}</span>
                            <span class="text-[10px] text-sky-300 font-semibold">${g.badge}</span>
                        </div>
                        <h4 class="text-sm font-bold text-white">${g.name}</h4>
                        <div class="space-y-1.5 pt-1 border-t border-gray-700">
                            <div class="text-[10px] font-bold uppercase text-sky-400">${isEs ? 'Pasos Anatómicos a Marcar en la Radiografía:' : 'Anatomical Steps to Mark on X-Ray:'}</div>
                            <ol class="list-decimal list-inside space-y-1.5 text-gray-200 leading-relaxed">
                                ${g.steps.map(s => `<li>${s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}</li>`).join('')}
                            </ol>
                        </div>
                        <div class="bg-sky-950/50 border border-sky-700/60 rounded p-2.5 text-[11px] text-sky-200">
                            <strong class="text-sky-400">💡 ${isEs ? 'Nota Clínica / Edición:' : 'Clinical & Editing Tip:'}</strong> ${g.tip}
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="bg-gray-800/60 border border-gray-700 rounded-lg p-3.5 text-center space-y-1">
                        <div class="text-base">👆</div>
                        <div class="font-bold text-white">${isEs ? 'Selecciona un parámetro en el menú izquierdo' : 'Select any parameter in the left menu'}</div>
                        <p class="text-[11px] text-gray-400">${isEs ? 'Toca cualquier parámetro de medición en el menú lateral y presiona ❓, o elige uno directamente de la lista inferior:' : 'Click any measurement parameter in the sidebar and tap ❓, or pick one below:'}</p>
                    </div>
                `;
            }

            html += `
                <div class="pt-1">
                    <div class="text-[10px] font-bold uppercase text-gray-400 mb-1.5">${isEs ? 'Todos los parámetros de medición manual:' : 'All manual measurement parameters:'}</div>
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
                ['1. Herramientas Básicas y Calibración', 'Calibra la escala en cm con un testigo métrico, traza líneas simples, círculos de referencia o ángulos de Cobb libres y cifosis torácica (Tk).'],
                ['2. Parámetros Pélvicos (PI, PT y SS)', 'Mide siempre primero la pelvis (cabezas femorales + platillo de S1). Es la llave maestra para que los ángulos PA, Tilt, Global Tilt y GAP Score se calculen automáticamente.'],
                ['3, 4 y 5. Balance Sagital, Regional y Cervical', 'Mide L1-PA, T4-PA, C7-PA, C2-PA, Tilts, SVA, L1-S1, L4-S1, L4-L5, C2-C7 y cSVA. Arrastra cualquier etiqueta para acomodarla o haz clic derecho para cambiar tamaño o eliminar.'],
                ['6. Plano Coronal (Escoliosis AP)', 'Mide los ángulos de Cobb coronales y los marcadores de plomada C7 y línea media sacra S1 (CSVL).'],
                ['7. Osteotomías de Schwab (Grados 1 al 6)', 'Marca 3 puntos sobre la vértebra (anterior-superior, bisagra posterior, anterior-inferior). El cierre de la cuña y el ajuste de grados son automáticos desde sus controles.'],
                ['7B. Tornillos (cm) y Barras Sagital / AP', 'Marca los pedículos, cierra con doble clic y estira la punta amarilla de cada tornillo sagital para medir su longitud en cm. En vista AP, traza las 2 barras para habilitar el deslizador de reducción.']
            ] : [
                ['1. Basic Tools & Calibration', 'Calibrate scale in cm, draw simple lines, reference circles, or Cobb angles and Thoracic Kyphosis (Tk).'],
                ['2. Pelvic Parameters (PI, PT & SS)', 'Always measure the pelvis first (femoral heads + S1 endplate). It powers automatic PA angles, Tilts, Global Tilt, and GAP Score.'],
                ['3, 4 & 5. Sagittal, Regional & Cervical Balance', 'Measure L1-PA, T4-PA, C7-PA, C2-PA, Tilts, SVA, L1-S1, L4-S1, L4-L5, C2-C7, and cSVA. Drag any label to reposition or right-click to resize or delete.'],
                ['6. Coronal Plane (AP Scoliosis)', 'Measure Coronal Cobb angles and C7 / S1 (CSVL) plumbline markers.'],
                ['7. Schwab Osteotomies (Grades 1-6)', 'Place 3 points on the vertebra (anterior-superior, posterior hinge, anterior-inferior). Wedge closure and degree adjustments run automatically from their controls.'],
                ['7B. Pedicle Screws (cm) & Rods', 'Click pedicles, double-click to finish, and drag the yellow screw tips to measure length in cm. In AP view, trace bilateral rods to enable reduction simulation.']
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
