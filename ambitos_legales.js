// ============================================================================
// MÓDULO INDEPENDIENTE V2 (ambitos_legales.js): ACEPTACIÓN OBLIGATORIA (CLICKWRAP) + ⚖️
// Bloquea el uso del sistema hasta que el usuario marque la casilla y pulse Continuar
// ============================================================================

(function() {
    try {
        window._spinePlanLegalAccepted = false;

        const LEGAL_TEXTS = {
            es: {
                btnTitle: "Ámbitos Legales, Uso No Diagnóstico y Privacidad",
                modalTitle: "Ámbitos Legales y Regulación de Software Médico",
                badge: "Exención Regulatoria • Privacidad Local • Propiedad Intelectual",
                loginNotice: "⚖️ Uso exclusivo para profesionales de la salud. Herramienta de cálculo geométrico y referencia académica (No diagnóstica). Tus radiografías y datos nunca salen de tu dispositivo.",
                loginLink: "Ver términos legales completos",
                checkboxLabel: "Declaro ser un profesional de la salud calificado y haber leído y aceptado los ámbitos legales, el carácter no diagnóstico del software y la responsabilidad clínica exclusiva.",
                continueDisabled: "🔒 Marca la casilla para continuar",
                continueEnabled: "Aceptar y Continuar al Sistema →",
                alreadyAcceptedBadge: "✅ Términos legales aceptados en esta sesión",
                closeBtn: "Cerrar",
                pdfDisclaimer: "AVISO LEGAL: SpinePlan Pro es una herramienta informática de cálculo geométrico y apoyo visual basada en literatura científica publicada. No constituye un dispositivo de diagnóstico autónomo. La exactitud de los puntos anatómicos marcados y la decisión quirúrgica final son responsabilidad exclusiva del médico tratante.",
                sections: [
                    {
                        icon: "🩺",
                        title: "1. Herramienta de Cálculo Geométrico (No Diagnóstica)",
                        body: "SpinePlan Pro es un software de cálculo goniométrico, trigonométrico y de referencia bibliográfica diseñado como apoyo visual y educativo para cirujanos de columna y traumatólogos. No clasifica como un dispositivo médico de diagnóstico autónomo (SaMD) bajo las normativas de la FDA, CE o ministerios de salud, ya que el programa no interpreta imágenes por sí solo ni emite diagnósticos automáticos: únicamente calcula ángulos y distancias a partir de las coordenadas marcadas manualmente por el especialista."
                    },
                    {
                        icon: "👨‍⚕️",
                        title: "2. Responsabilidad Clínica Exclusiva del Cirujano",
                        body: "Los perfiles teóricos ideales, simulaciones de osteotomías de Schwab, longitudes de tornillos en centímetros y puntajes proporcionales (como GAP Score, Roussouly, Abelin-Genevois, Bao o Meyerding) son estimaciones matemáticas orientativas basadas en publicaciones científicas indexadas. La indicación quirúrgica, la elección de los niveles de artrodesis y el acto operatorio son responsabilidad única e indelegable del médico tratante certificado."
                    },
                    {
                        icon: "🔒",
                        title: "3. Privacidad Absoluta de Pacientes (Arquitectura 100% Local)",
                        body: "En cumplimiento con los estándares internacionales de confidencialidad médica (incluyendo principios HIPAA y secreto profesional), SpinePlan Pro procesa todas las radiografías, nombres, identificaciones y reportes PDF exclusivamente en la memoria interna del dispositivo (computadora, tablet o teléfono) del usuario. Ninguna radiografía ni dato clínico de pacientes es enviado, almacenado ni compartido en servidores externos ni en la nube del desarrollador."
                    },
                    {
                        icon: "🏛️",
                        title: "4. Propiedad Intelectual y Licencia de Uso",
                        body: "El diseño, arquitectura, interfaz visual y código fuente de SpinePlan Pro están protegidos por las leyes nacionales e internacionales de Derecho de Autor y Propiedad Intelectual. Queda estrictamente prohibida su copia, distribución no autorizada, ingeniería inversa o comercialización por terceros sin autorización expresa del autor."
                    }
                ]
            },
            en: {
                btnTitle: "Legal Disclaimer, Non-Diagnostic Use & Privacy Policy",
                modalTitle: "Legal Notice & Medical Software Disclaimer",
                badge: "Regulatory Exemption • Local Privacy • Copyright",
                loginNotice: "⚖️ For qualified healthcare professionals only. Geometric calculation & academic reference tool (Non-diagnostic). All radiographs and patient data remain 100% local on your device.",
                loginLink: "View full legal terms",
                checkboxLabel: "I declare that I am a qualified healthcare professional and I have read and accept the legal terms, the non-diagnostic nature of the software, and sole clinical responsibility.",
                continueDisabled: "🔒 Check the box above to continue",
                continueEnabled: "Accept & Continue to System →",
                alreadyAcceptedBadge: "✅ Legal terms accepted for this session",
                closeBtn: "Close",
                pdfDisclaimer: "LEGAL DISCLAIMER: SpinePlan Pro is a geometric calculation and visual planning aid based on published scientific literature. It is not an autonomous diagnostic medical device. Landmark accuracy, clinical interpretation, and final surgical decisions are the sole responsibility of the attending physician.",
                sections: [
                    {
                        icon: "🩺",
                        title: "1. Geometric & Educational Calculation Tool (Non-Diagnostic)",
                        body: "SpinePlan Pro is a goniometric, trigonometric, and bibliographic reference calculator designed as a visual and educational aid for spine surgeons and orthopedic specialists. It is not an autonomous diagnostic medical device under FDA or CE regulations, as it does not autonomously interpret medical images or prescribe treatments; it strictly computes geometric angles and distances from landmarks manually placed by the clinician."
                    },
                    {
                        icon: "👨‍⚕️",
                        title: "2. Sole Clinical Responsibility of the Attending Surgeon",
                        body: "Theoretical ideal profiles, Schwab osteotomy simulations, screw length measurements, and alignment scores (GAP Score, Roussouly, Abelin-Genevois, Bao, Meyerding) are mathematical estimates derived from peer-reviewed literature. Surgical indications, fusion levels, and intraoperative execution remain the sole responsibility of the licensed physician."
                    },
                    {
                        icon: "🔒",
                        title: "3. 100% Local Patient Privacy (Zero Cloud Storage)",
                        body: "In accordance with medical data protection standards (including HIPAA principles), SpinePlan Pro processes all radiographs, patient names, IDs, and PDF reports strictly within the local memory of the user's device. No patient radiographs or clinical records are ever uploaded, transmitted, or stored on external servers."
                    },
                    {
                        icon: "🏛️",
                        title: "4. Intellectual Property & Copyright",
                        body: "The software architecture, user interface, and source code of SpinePlan Pro are protected under national and international copyright laws. Unauthorized reproduction, redistribution, or reverse engineering is strictly prohibited."
                    }
                ]
            }
        };

        function getLangKey() {
            return (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'en' : 'es';
        }

        // 1. CREAR MODAL CON BLOQUEO DE ACEPTACIÓN OBLIGATORIA Y Z-INDEX MÁXIMO
        function createLegalModal() {
            if (document.getElementById('legal-scope-modal')) return;

            const modal = document.createElement('div');
            modal.id = 'legal-scope-modal';
            modal.style.zIndex = '999999';
            modal.className = 'hidden fixed inset-0 bg-black/85 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md';
            modal.innerHTML = `
                <div class="bg-gray-900 border border-emerald-500/80 rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-xs text-gray-200" onclick="event.stopPropagation()">
                    <div class="flex justify-between items-center bg-gray-950 px-4 py-3 border-b border-gray-800">
                        <div class="flex items-center space-x-2">
                            <span class="text-base">⚖️</span>
                            <h3 id="legal-modal-title" class="text-emerald-400 font-bold text-sm">Ámbitos Legales y Regulación</h3>
                        </div>
                        <button type="button" id="legal-top-x-btn" onclick="window.tryCloseLegalModal()" class="hidden text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded px-2.5 py-1 text-xs font-bold">×</button>
                    </div>
                    <div id="legal-modal-body" class="p-4 overflow-y-auto space-y-3 flex-1"></div>
                    <div class="bg-gray-950 px-4 py-3 border-t border-gray-800 space-y-2.5">
                        <label id="legal-checkbox-container" class="flex items-start space-x-2.5 bg-gray-900/90 border border-emerald-500/40 rounded-lg p-2.5 cursor-pointer select-none hover:border-emerald-400 transition-colors">
                            <input type="checkbox" id="legal-accept-checkbox" onchange="window.toggleLegalContinueBtn(this.checked)" class="mt-0.5 w-4 h-4 accent-emerald-500 rounded cursor-pointer shrink-0">
                            <span id="legal-checkbox-text" class="text-[11px] text-gray-200 leading-snug font-medium"></span>
                        </label>
                        <div class="flex justify-between items-center pt-0.5">
                            <span class="text-[10px] text-gray-400">SpinePlan Pro • Fundescoliosis</span>
                            <button type="button" id="legal-modal-close" onclick="window.confirmAndAcceptLegalTerms()" disabled class="bg-gray-800 text-gray-500 border border-gray-700 font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-not-allowed">
                                🔒 Marca la casilla para continuar
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Solo permitir cerrar tocando afuera si ya aceptó previamente los términos
            modal.addEventListener('click', function() {
                if (window._spinePlanLegalAccepted) {
                    modal.classList.add('hidden');
                }
            });

            document.body.appendChild(modal);
        }

        window.toggleLegalContinueBtn = function(isChecked) {
            const t = LEGAL_TEXTS[getLangKey()];
            const btn = document.getElementById('legal-modal-close');
            if (!btn) return;

            if (isChecked) {
                btn.disabled = false;
                btn.innerText = t.continueEnabled;
                btn.className = 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.45)]';
            } else {
                btn.disabled = true;
                btn.innerText = t.continueDisabled;
                btn.className = 'bg-gray-800 text-gray-500 border border-gray-700 font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-not-allowed';
            }
        };

        window.confirmAndAcceptLegalTerms = function() {
            const chk = document.getElementById('legal-accept-checkbox');
            if (!window._spinePlanLegalAccepted && (!chk || !chk.checked)) return;

            window._spinePlanLegalAccepted = true;
            const modal = document.getElementById('legal-scope-modal');
            if (modal) modal.classList.add('hidden');
        };

        window.tryCloseLegalModal = function() {
            if (window._spinePlanLegalAccepted) {
                const modal = document.getElementById('legal-scope-modal');
                if (modal) modal.classList.add('hidden');
            }
        };

        window.openLegalScopeModal = function() {
            try {
                createLegalModal();
                renderLegalContent();
                document.getElementById('legal-scope-modal').classList.remove('hidden');
            } catch (e) {
                console.warn(e);
            }
        };

        function renderLegalContent() {
            const t = LEGAL_TEXTS[getLangKey()];
            const titleEl = document.getElementById('legal-modal-title');
            const bodyEl = document.getElementById('legal-modal-body');
            const chkContainer = document.getElementById('legal-checkbox-container');
            const chkText = document.getElementById('legal-checkbox-text');
            const chkInput = document.getElementById('legal-accept-checkbox');
            const closeBtn = document.getElementById('legal-modal-close');
            const topXBtn = document.getElementById('legal-top-x-btn');

            if (!bodyEl) return;
            if (titleEl) titleEl.innerText = t.modalTitle;
            if (chkText) chkText.innerText = t.checkboxLabel;

            bodyEl.innerHTML = `
                <div class="bg-emerald-950/40 border border-emerald-600/50 rounded-lg p-2.5 text-center">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">${t.badge}</span>
                </div>
                ${t.sections.map(sec => `
                    <div class="bg-gray-800/75 border border-gray-700 rounded-lg p-3 space-y-1.5">
                        <div class="font-bold text-white text-xs flex items-center space-x-1.5">
                            <span>${sec.icon}</span>
                            <span class="text-sky-400">${sec.title}</span>
                        </div>
                        <p class="text-[11px] text-gray-300 leading-relaxed">${sec.body}</p>
                    </div>
                `).join('')}
            `;

            if (window._spinePlanLegalAccepted) {
                if (topXBtn) topXBtn.classList.remove('hidden');
                if (chkContainer) {
                    chkContainer.innerHTML = `<span class="text-[11px] text-emerald-400 font-bold w-full text-center">${t.alreadyAcceptedBadge}</span>`;
                }
                if (closeBtn) {
                    closeBtn.disabled = false;
                    closeBtn.innerText = t.closeBtn;
                    closeBtn.className = 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer';
                }
            } else {
                if (topXBtn) topXBtn.classList.add('hidden');
                const isChecked = chkInput ? chkInput.checked : false;
                window.toggleLegalContinueBtn(isChecked);
            }
        }

        // 2. DETECTAR CUANDO EL USUARIO INGRESA LA CONTRASEÑA PARA MOSTRAR EL CONTRATO OBLIGATORIO
        function isLoginScreenVisible() {
            const passInput = document.querySelector('input[type="password"]');
            if (!passInput) return false;
            const style = window.getComputedStyle(passInput);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            return passInput.offsetParent !== null;
        }

        function checkPostLoginMandatoryLegalGate() {
            if (window._spinePlanLegalAccepted) return;
            if (!isLoginScreenVisible()) {
                window.openLegalScopeModal();
            }
        }

        // 3. INYECTAR BOTÓN ⚖️ EN EL HEADER PRINCIPAL
        function injectLegalHeaderButton() {
            const headerEl = document.querySelector('header');
            const helpBtn = document.getElementById('btn-top-help');
            const preOpBtn = document.querySelector('header button[onclick*="switchStage"]') ||
                             document.getElementById('btn-stage-pre');

            let btnLegal = document.getElementById('btn-top-legal');
            if (!btnLegal) {
                btnLegal = document.createElement('button');
                btnLegal.id = 'btn-top-legal';
                btnLegal.type = 'button';
                btnLegal.innerHTML = '⚖️';
                btnLegal.className = 'bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/60 px-2 py-1 rounded-md text-xs font-bold transition-colors flex items-center justify-center shadow-sm select-none shrink-0';
                btnLegal.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.openLegalScopeModal();
                });
            }

            btnLegal.title = LEGAL_TEXTS[getLangKey()].btnTitle;

            if (helpBtn && helpBtn.parentNode) {
                if (btnLegal.parentNode !== helpBtn.parentNode) {
                    helpBtn.parentNode.insertBefore(btnLegal, helpBtn);
                }
            } else if (headerEl) {
                const langSel = headerEl.querySelector('select');
                if (langSel && langSel.parentNode && btnLegal.parentNode !== langSel.parentNode) {
                    langSel.parentNode.insertBefore(btnLegal, langSel);
                }
            } else if (preOpBtn && preOpBtn.parentElement && preOpBtn.parentElement.parentNode) {
                const row = preOpBtn.parentElement.parentNode;
                if (btnLegal.parentNode !== row) {
                    row.insertBefore(btnLegal, preOpBtn.parentElement);
                }
            }
        }

        // 4. NOTA LEGAL EN LA PANTALLA DE LOGIN (Y ENLACE QUE ABRE POR ENCIMA DE LA PORTADA)
        function injectLoginLegalNotice() {
            const passInput = document.querySelector('input[type="password"]');
            if (!passInput) return;
            const loginCard = passInput.closest('div.bg-gray-900, div.rounded-xl, div.rounded-2xl, div.border') || passInput.parentElement;
            if (!loginCard) return;

            const t = LEGAL_TEXTS[getLangKey()];
            let noticeBox = document.getElementById('login-legal-disclaimer');
            if (!noticeBox) {
                noticeBox = document.createElement('div');
                noticeBox.id = 'login-legal-disclaimer';
                noticeBox.className = 'mt-3 pt-2.5 border-t border-gray-800 text-center space-y-1';
                loginCard.appendChild(noticeBox);
            }

            noticeBox.innerHTML = `
                <p class="text-[10px] text-gray-400 leading-snug">${t.loginNotice}</p>
                <button type="button" onclick="window.openLegalScopeModal()" class="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer">${t.loginLink}</button>
            `;
        }

        // 5. PIE LEGAL AUTOMÁTICO EN EL REPORTE PDF
        function injectPdfLegalFooter() {
            const pdfContainer = document.getElementById('pdf-report-paper') ||
                                 document.getElementById('report-printable-area') ||
                                 document.querySelector('[id*="pdf"][id*="content"]');
            if (!pdfContainer) return;

            let footerEl = document.getElementById('pdf-legal-non-diagnostic-footer');
            if (!footerEl) {
                footerEl = document.createElement('div');
                footerEl.id = 'pdf-legal-non-diagnostic-footer';
                footerEl.style.cssText = 'margin-top:10px; padding-top:6px; border-top:1px solid #cbd5e1; font-size:8.5px; color:#475569; text-align:justify; line-height:1.3;';
                pdfContainer.appendChild(footerEl);
            }
            footerEl.innerText = LEGAL_TEXTS[getLangKey()].pdfDisclaimer;
        }

        function initLegalModule() {
            createLegalModal();
            injectLegalHeaderButton();
            injectLoginLegalNotice();
            injectPdfLegalFooter();
            checkPostLoginMandatoryLegalGate();
        }

        // Detectar ingreso por clic en "Ingresar" o tecla Enter en la contraseña
        document.addEventListener('click', function() {
            setTimeout(function() {
                injectPdfLegalFooter();
                checkPostLoginMandatoryLegalGate();
            }, 120);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                setTimeout(checkPostLoginMandatoryLegalGate, 120);
            }
        });

        document.addEventListener('change', function(e) {
            if (e.target && e.target.tagName === 'SELECT') {
                setTimeout(function() {
                    injectLegalHeaderButton();
                    injectLoginLegalNotice();
                    injectPdfLegalFooter();
                    const modal = document.getElementById('legal-scope-modal');
                    if (modal && !modal.classList.contains('hidden')) {
                        renderLegalContent();
                    }
                }, 50);
            }
        });

        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', initLegalModule);
        } else {
            initLegalModule();
        }
        window.addEventListener('load', initLegalModule);
    } catch (err) {
        console.warn('Módulo legal aislado:', err);
    }
})();
