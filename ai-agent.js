/**
 * MACCIELL AI - Asesor de Estilo & Agendamiento
 * Agente de Inteligencia Artificial para Macciell Barber
 */

(function () {
    'use strict';

    // Base de Conocimiento y Configuración de Macciell Barber
    const BARBER_CONFIG = {
        phone: '56996155254',
        name: 'Macciell Barber',
        location: 'Sindempart, Coquimbo, Chile',
        schedule: 'Lunes a Sábado de 09:00 a 18:00 hrs | Domingos de 10:00 a 01:00 hrs',
        paymentMethods: 'Efectivo, Transferencia Electrónica, Tarjetas de Débito y Crédito',
        services: [
            {
                id: 'corte',
                name: 'Corte Clásico & Moderno',
                price: '$10.000',
                duration: '45 min',
                desc: 'Asesoría de estilo y corte de cabello adaptado a la forma de tu rostro (Fades, Taper, Clásicos, Texturizados).',
                image: 'assets/service_corte.png'
            }
        ],
        products: [
            {
                id: 'aftershave-antarctica',
                name: 'After Shave Nishman 01 Antarctica (400ml)',
                price: '$12.990',
                desc: 'Colonia refrescante y calmante con fragancia glacial de larga duración. Alivia irritaciones y cierra poros.',
                type: 'aftershave',
                image: 'https://http2.mlstatic.com/D_Q_NP_900669-MLA110823298623_042026-N.webp'
            },
            {
                id: 'aftershave-storm',
                name: 'After Shave Nishman 02 Storm (400ml)',
                price: '$12.990',
                desc: 'Fragancia deportiva y energizante para uso diario con efecto hidratante y revitalizante post-afeitado.',
                type: 'aftershave',
                image: 'https://http2.mlstatic.com/D_Q_NP_806781-MLC89095777887_082025-N.webp'
            },
            {
                id: 'aftershave-gold',
                name: 'After Shave Nishman 07 Gold One (400ml)',
                price: '$12.990',
                desc: 'Aroma amaderado cálido y especiado de lujo. Calma e hidrata pieles exigentes.',
                type: 'aftershave',
                image: 'https://http2.mlstatic.com/D_Q_NP_982262-MLA109936682862_042026-N.webp'
            },
            {
                id: 'wax-matte',
                name: 'Cera Moldeadora Nishman Matte Clay',
                price: '$10.990',
                desc: 'Fijación fuerte y acabado 100% mate sin brillo. Ideal para peinados con volumen y textura moderna.',
                type: 'wax',
                image: 'assets/gallery_3.jpg'
            }
        ],
        faceShapes: {
            ovalado: {
                name: 'Rostro Ovalado',
                desc: 'Es la forma más simétrica y versátil. Prácticamente cualquier corte te favorece.',
                recommended: ['Low/Mid Fade Texturizado', 'Pompadour Clásico', 'Buzz Cut con Barba Corta'],
                service: 'Corte Clásico & Moderno'
            },
            cuadrado: {
                name: 'Rostro Cuadrado',
                desc: 'Tienes una mandíbula fuerte y angular. Los cortes con volumen arriba y laterales degradados destacan tu estructura.',
                recommended: ['High Fade con Textura', 'Quiff / Tupé Moderno', 'Perfilado Marcado de Barba'],
                service: 'Combo Master (Corte + Barba)'
            },
            redondo: {
                name: 'Rostro Redondo',
                desc: 'Buscamos estilizar y alargar visualmente tu rostro con volumen en la cúspide y laterales bien rebajados.',
                recommended: ['Skin Fade / Mid Fade', 'Crop Francés con Desvanecido', 'Barba Cuadrada o Perfilada en Punta'],
                service: 'Corte Clásico & Moderno'
            },
            alargado: {
                name: 'Rostro Alargado o Diamante',
                desc: 'Evitamos demasiado volumen arriba y equilibramos los costados para no estirar las facciones.',
                recommended: ['Taper Fade Clásico', 'Corte con Caída Natural', 'Barba Llena y Perfilada'],
                service: 'Combo Master (Corte + Barba)'
            }
        }
    };

    // Estado del Asistente
    const state = {
        isOpen: false,
        conversationStep: 'idle', // idle, quiz_face, quiz_hair, quiz_style, booking_name, booking_service, booking_date, booking_time
        bookingData: {
            name: '',
            service: '',
            date: '',
            time: '',
            notes: ''
        },
        quizData: {
            faceShape: '',
            hairType: '',
            stylePreference: ''
        }
    };

    // Helper: Generador de Enlaces de WhatsApp
    function generateWhatsAppLink(text) {
        return `https://api.whatsapp.com/send?phone=${BARBER_CONFIG.phone}&text=${encodeURIComponent(text)}`;
    }

    // Inicializar UI del Agente
    function initAgentUI() {
        // Crear Widget si no existe
        if (document.getElementById('macciellAiWidget')) return;

        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'macciellAiWidget';
        widgetContainer.className = 'ai-agent-container';

        widgetContainer.innerHTML = `
            <!-- Botón Disparador Flotante (Launcher) -->
            <button class="ai-agent-launcher" id="aiLauncherBtn" aria-label="Abrir Asesor de IA Macciell">
                <div class="ai-launcher-glow"></div>
                <div class="ai-launcher-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
                        <path d="M18 14v1a6 6 0 0 1-12 0v-1"/>
                        <path d="M12 20v2"/>
                        <path d="M8 22h8"/>
                        <circle cx="12" cy="7" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <span class="ai-launcher-badge">IA</span>
                <div class="ai-launcher-tooltip">
                    <span class="ai-tooltip-dot"></span>
                    <span>¿Buscas tu corte ideal? <strong>Pregúntale a la IA</strong></span>
                </div>
            </button>

            <!-- Ventana de Chat Modal -->
            <div class="ai-agent-modal" id="aiChatModal" aria-hidden="true" role="dialog">
                <!-- Header del Chat -->
                <div class="ai-chat-header">
                    <div class="ai-header-profile">
                        <div class="ai-avatar-box">
                            <span class="ai-avatar-icon">💈</span>
                            <span class="ai-status-indicator"></span>
                        </div>
                        <div class="ai-header-info">
                            <h3 class="ai-header-title">MACCIELL AI</h3>
                            <span class="ai-header-subtitle">Asesor de Estilo & Agendamiento</span>
                        </div>
                    </div>
                    <div class="ai-header-actions">
                        <button class="ai-header-btn" id="aiResetBtn" title="Reiniciar conversación" aria-label="Reiniciar conversación">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                                <path d="M21 3v5h-5"/>
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                                <path d="M8 16H3v5"/>
                            </svg>
                        </button>
                        <button class="ai-header-btn" id="aiCloseBtn" title="Cerrar chat" aria-label="Cerrar chat">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Cuerpo de Mensajes -->
                <div class="ai-chat-body" id="aiChatBody">
                    <!-- Los mensajes se inyectan dinámicamente -->
                </div>

                <!-- Input y Acciones Rápidas -->
                <div class="ai-chat-footer">
                    <div class="ai-quick-replies" id="aiQuickReplies">
                        <!-- Chips rápidos inyectados dinámicamente -->
                    </div>
                    <form class="ai-input-form" id="aiInputForm">
                        <input type="text" class="ai-text-input" id="aiUserInput" placeholder="Escribe tu consulta o pide una recomendación..." autocomplete="off" />
                        <button type="submit" class="ai-send-btn" id="aiSendBtn" aria-label="Enviar mensaje">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(widgetContainer);

        // Bindings de Eventos
        const launcher = document.getElementById('aiLauncherBtn');
        const modal = document.getElementById('aiChatModal');
        const closeBtn = document.getElementById('aiCloseBtn');
        const resetBtn = document.getElementById('aiResetBtn');
        const inputForm = document.getElementById('aiInputForm');
        const userInput = document.getElementById('aiUserInput');

        launcher.addEventListener('click', () => toggleChat());
        closeBtn.addEventListener('click', () => toggleChat(false));
        resetBtn.addEventListener('click', () => resetConversation());

        inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = userInput.value.trim();
            if (!text) return;
            handleUserMessage(text);
            userInput.value = '';
        });

        // Iniciar conversación de bienvenida
        sendWelcomeMessage();
    }

    // Alternar visibilidad de la ventana de chat
    function toggleChat(forceState) {
        const modal = document.getElementById('aiChatModal');
        const launcher = document.getElementById('aiLauncherBtn');

        state.isOpen = forceState !== undefined ? forceState : !state.isOpen;

        if (state.isOpen) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            launcher.classList.add('chat-open');
            // Scroll al último mensaje
            scrollChatToBottom();
            // Foco en el input si es desktop
            if (window.innerWidth > 768) {
                setTimeout(() => {
                    document.getElementById('aiUserInput')?.focus();
                }, 300);
            }
        } else {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            launcher.classList.remove('chat-open');
        }
    }

    // Scroll suave al fondo del chat
    function scrollChatToBottom() {
        const body = document.getElementById('aiChatBody');
        if (body) {
            setTimeout(() => {
                body.scrollTop = body.scrollHeight;
            }, 50);
        }
    }

    // Renderizar indicador de escritura (Typing indicator)
    function showTypingIndicator() {
        const body = document.getElementById('aiChatBody');
        const typingEl = document.createElement('div');
        typingEl.className = 'ai-message ai-agent-msg typing-msg';
        typingEl.id = 'aiTypingIndicator';
        typingEl.innerHTML = `
            <div class="ai-msg-avatar">💈</div>
            <div class="ai-msg-bubble typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        body.appendChild(typingEl);
        scrollChatToBottom();
    }

    function hideTypingIndicator() {
        const typingEl = document.getElementById('aiTypingIndicator');
        if (typingEl) typingEl.remove();
    }

    // Añadir mensaje al chat
    function appendMessage(sender, content, options = {}) {
        const body = document.getElementById('aiChatBody');
        const msgEl = document.createElement('div');
        msgEl.className = `ai-message ${sender === 'agent' ? 'ai-agent-msg' : 'ai-user-msg'} animate-msg`;

        let html = '';
        if (sender === 'agent') {
            html += `<div class="ai-msg-avatar">💈</div>`;
        }

        html += `<div class="ai-msg-bubble">${content}</div>`;
        msgEl.innerHTML = html;
        body.appendChild(msgEl);

        scrollChatToBottom();

        // Actualizar chips de respuestas rápidas si se proporcionan
        if (options.quickReplies) {
            renderQuickReplies(options.quickReplies);
        } else if (sender === 'user') {
            renderQuickReplies([]);
        }
    }

    // Renderizar botones de respuesta rápida (Quick Chips)
    function renderQuickReplies(replies) {
        const container = document.getElementById('aiQuickReplies');
        if (!container) return;

        container.innerHTML = '';
        if (!replies || replies.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = `ai-chip-btn ${reply.variant ? 'chip-' + reply.variant : ''}`;
            btn.type = 'button';
            btn.innerHTML = reply.label;
            btn.addEventListener('click', () => {
                if (reply.action) {
                    reply.action();
                } else if (reply.text) {
                    handleUserMessage(reply.text, reply.payload);
                }
            });
            container.appendChild(btn);
        });

        scrollChatToBottom();
    }

    // Mensaje de bienvenida inicial
    function sendWelcomeMessage() {
        const body = document.getElementById('aiChatBody');
        body.innerHTML = '';

        const welcomeText = `
            👋 ¡Hola! Bienvenido a <strong>Macciell Barber</strong>. Soy tu asesor inteligente de imagen y agendamiento.
            <br><br>
            ¿En qué puedo ayudarte hoy para elevar tu estilo?
        `;

        appendMessage('agent', welcomeText, {
            quickReplies: [
                { label: '💈 Asesor de Corte Ideal', text: 'Quiero asesoría de corte', payload: 'start_quiz' },
                { label: '📅 Agendar Cita Rápida', text: 'Quiero agendar una cita', payload: 'start_booking' },
                { label: '🧴 Recomendador de Productos', text: 'Ver productos recomendados', payload: 'show_products' },
                { label: '📍 Horarios y Ubicación', text: '¿Dónde están ubicados y qué horarios tienen?', payload: 'info_faq' }
            ]
        });
    }

    // Reiniciar conversación
    function resetConversation() {
        state.conversationStep = 'idle';
        state.bookingData = { name: '', service: '', date: '', time: '', notes: '' };
        state.quizData = { faceShape: '', hairType: '', stylePreference: '' };
        sendWelcomeMessage();
    }

    // Manejar flujo del Asesor de Imagen (Quiz)
    function startStyleQuiz() {
        state.conversationStep = 'quiz_face';
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('agent', 'Para recomendarte el corte que mejor resalte tus facciones, <strong>¿cuál es la forma aproximada de tu rostro?</strong>', {
                quickReplies: [
                    { label: '📐 Ovalado', text: 'Tengo rostro Ovalado', payload: 'face_ovalado' },
                    { label: '⏹️ Cuadrado / Mandíbula ancha', text: 'Tengo rostro Cuadrado', payload: 'face_cuadrado' },
                    { label: '⚪ Redondo', text: 'Tengo rostro Redondo', payload: 'face_redondo' },
                    { label: '💎 Alargado o Diamante', text: 'Tengo rostro Alargado', payload: 'face_alargado' }
                ]
            });
        }, 400);
    }

    function handleQuizFace(faceKey) {
        state.quizData.faceShape = faceKey;
        state.conversationStep = 'quiz_hair';

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('agent', 'Excelente. Ahora cuéntame, <strong>¿qué tipo de cabello tienes?</strong>', {
                quickReplies: [
                    { label: '✨ Lacio / Liso', text: 'Tengo cabello Lacio', payload: 'hair_lacio' },
                    { label: '🌊 Ondulado', text: 'Tengo cabello Ondulado', payload: 'hair_ondulado' },
                    { label: '🌀 Rizado / Crespo', text: 'Tengo cabello Rizado', payload: 'hair_rizado' },
                    { label: '⚡ Con entradas / Fino', text: 'Tengo cabello Fino con entradas', payload: 'hair_fino' }
                ]
            });
        }, 400);
    }

    function handleQuizHair(hairType) {
        state.quizData.hairType = hairType;
        state.conversationStep = 'quiz_style';

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('agent', '¡Casi listo! <strong>¿Qué estilo o vibra buscas proyectar?</strong>', {
                quickReplies: [
                    { label: '🔥 Urbano / Moderno (Fade marcado)', text: 'Busco estilo Urbano con Fade', payload: 'style_urbano' },
                    { label: '👔 Elegante / Ejecutivo Clásico', text: 'Busco estilo Ejecutivo Elegante', payload: 'style_clasico' },
                    { label: '🧔 Completo con Perfilado de Barba', text: 'Corte completo con arreglo de Barba', payload: 'style_barba' }
                ]
            });
        }, 400);
    }

    function finishStyleQuiz(stylePref) {
        state.quizData.stylePreference = stylePref;
        state.conversationStep = 'idle';

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();

            const faceInfo = BARBER_CONFIG.faceShapes[state.quizData.faceShape] || BARBER_CONFIG.faceShapes.ovalado;
            const cutsList = faceInfo.recommended.map(c => `<li>✂️ <strong>${c}</strong></li>`).join('');

            const waMsg = `Hola Macciell Barber 💈, el Asesor de IA me recomendó para mi tipo de rostro (${faceInfo.name}) el servicio: ${faceInfo.service}. Cortes sugeridos: ${faceInfo.recommended.join(', ')}. ¿Podemos agendar una hora?`;
            const waUrl = generateWhatsAppLink(waMsg);

            const resultHtml = `
                🎯 <strong>¡Diagnóstico de Estilo Completado!</strong>
                <br><br>
                <strong>Morfología:</strong> ${faceInfo.name}
                <br>
                <em>${faceInfo.desc}</em>
                <br><br>
                <strong>Cortes ideales recomendados para ti:</strong>
                <ul class="ai-cuts-list">
                    ${cutsList}
                </ul>
                <div class="ai-product-suggestion">
                    🧴 <strong>Producto de peinado recomendado:</strong><br>
                    ${state.quizData.hairType === 'hair_lacio' || stylePref === 'style_urbano' ? '<strong>Cera Matte Clay Nishman</strong> (Fijación fuerte y textura sin brillo).' : '<strong>After Shave 01 Antarctica</strong> para frescura total.'}
                </div>
                <div class="ai-card-cta">
                    <a href="${waUrl}" target="_blank" class="ai-action-btn btn-whatsapp-agent">
                        📲 Agendar este Corte por WhatsApp
                    </a>
                </div>
            `;

            appendMessage('agent', resultHtml, {
                quickReplies: [
                    { label: '📅 Iniciar Agendamiento aquí', text: 'Quiero agendar mi hora ahora', payload: 'start_booking' },
                    { label: '🧴 Ver Productos Nishman', text: 'Ver productos', payload: 'show_products' },
                    { label: '🔄 Probar otro estilo', text: 'Quiero reiniciar el test', payload: 'start_quiz' }
                ]
            });
        }, 600);
    }

    // Manejar flujo de Agendamiento Rápido
    function startBookingFlow() {
        state.conversationStep = 'booking_service';
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();

            const serviceChips = BARBER_CONFIG.services.map(s => ({
                label: `${s.name} (${s.price})`,
                text: `Elijo ${s.name}`,
                payload: `service_${s.id}`
            }));

            appendMessage('agent', '📅 ¡Excelente decisión! ¿Qué servicio deseas realizarte?', {
                quickReplies: serviceChips
            });
        }, 400);
    }

    function handleBookingService(serviceId) {
        const found = BARBER_CONFIG.services.find(s => s.id === serviceId) || BARBER_CONFIG.services[0];
        state.bookingData.service = found.name;
        state.conversationStep = 'booking_name';

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('agent', `Perfecto: <strong>${found.name}</strong> (${found.price} - ${found.duration}).<br><br>¿Cuál es tu <strong>Nombre y Apellido</strong>? (Escríbelo abajo en el chat)`, {
                quickReplies: []
            });
        }, 400);
    }

    function handleBookingDate() {
        state.conversationStep = 'booking_time';
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('agent', `Anotado. ¿En qué <strong>horario</strong> prefieres tu cita?<br><small>(Recuerda: Lun a Sáb: 09:00 a 18:00 | Dom: 10:00 a 01:00)</small>`, {
                quickReplies: [
                    { label: '🌅 Mañana (10:00 - 13:00)', text: 'Prefiero en la mañana (10:00 - 13:00)', payload: 'time_morning' },
                    { label: '☀️ Tarde (14:00 - 17:00)', text: 'Prefiero en la tarde (14:00 - 17:00)', payload: 'time_afternoon' },
                    { label: '🌙 Tarde/Noche (17:00 - 19:00)', text: 'Prefiero tarde/noche (17:00 - 19:00)', payload: 'time_evening' }
                ]
            });
        }, 400);
    }

    function finishBookingFlow() {
        state.conversationStep = 'idle';

        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();

            const b = state.bookingData;
            const waMsg = `Hola Macciell Barber 💈, quiero agendar una hora asistida por la web:\n\n👤 Nombre: ${b.name || 'Cliente'}\n✂️ Servicio: ${b.service || 'Corte Clásico'}\n📅 Día/Preferencia: ${b.date || 'Lo antes posible'}\n⏰ Horario: ${b.time || 'A coordinar'}`;
            const waUrl = generateWhatsAppLink(waMsg);

            const summaryHtml = `
                ✅ <strong>¡Solicitud de Reserva Preparada!</strong>
                <br><br>
                📋 <strong>Resumen de tu cita:</strong><br>
                • <strong>Cliente:</strong> ${b.name || 'No especificado'}<br>
                • <strong>Servicio:</strong> ${b.service}<br>
                • <strong>Preferencia:</strong> ${b.date} - ${b.time}<br>
                • <strong>Ubicación:</strong> Sindempart, Coquimbo.
                <br><br>
                Toca el botón siguiente para enviar tu cita directamente al WhatsApp de Macciell y confirmar disponibilidad al instante:
                <div class="ai-card-cta">
                    <a href="${waUrl}" target="_blank" class="ai-action-btn btn-whatsapp-agent">
                        📲 Confirmar y Enviar por WhatsApp
                    </a>
                </div>
            `;

            appendMessage('agent', summaryHtml, {
                quickReplies: [
                    { label: '💈 Hacer consulta de estilo', text: 'Quiero asesoría de corte', payload: 'start_quiz' },
                    { label: '🧴 Ver Ceras & Aftershaves', text: 'Ver productos', payload: 'show_products' },
                    { label: '❓ Otra consulta', text: 'Tengo otra pregunta', payload: 'info_faq' }
                ]
            });
        }, 600);
    }

    // Mostrar catálogo de productos dentro del chat
    function showProductsShowcase() {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();

            let productsHtml = `🧴 <strong>Línea Profesional Nishman disponible en Macciell Barber:</strong><br><br>`;

            BARBER_CONFIG.products.forEach(prod => {
                const buyMsg = `Hola Macciell Barber 💈, me interesa comprar el producto: ${prod.name} (${prod.price}).`;
                const buyUrl = generateWhatsAppLink(buyMsg);

                productsHtml += `
                    <div class="ai-product-card">
                        <div class="ai-prod-details">
                            <h4 class="ai-prod-name">${prod.name}</h4>
                            <p class="ai-prod-desc">${prod.desc}</p>
                            <span class="ai-prod-price">${prod.price}</span>
                        </div>
                        <a href="${buyUrl}" target="_blank" class="ai-prod-buy-btn">Pedir 💵</a>
                    </div>
                `;
            });

            appendMessage('agent', productsHtml, {
                quickReplies: [
                    { label: '💈 Asesoría de Corte', text: 'Quiero asesoría de corte', payload: 'start_quiz' },
                    { label: '📅 Agendar Cita', text: 'Quiero agendar una cita', payload: 'start_booking' },
                    { label: '📍 Ubicación y Horarios', text: '¿Dónde están ubicados?', payload: 'info_faq' }
                ]
            });
        }, 500);
    }

    // Respuestas Frecuentes e Inteligencia NLP
    function handleNLPQuery(query) {
        const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();

            // 1. Precios / Valores
            if (q.includes('precio') || q.includes('cuanto cuesta') || q.includes('valor') || q.includes('tarifa') || q.includes('cobran')) {
                let servicesList = BARBER_CONFIG.services.map(s => `• <strong>${s.name}:</strong> ${s.price} (${s.duration})`).join('<br>');
                appendMessage('agent', `💈 <strong>Precios de Servicios en Macciell Barber:</strong><br><br>${servicesList}<br><br>Todos los servicios incluyen perfilado de precisión y acabado profesional.`, {
                    quickReplies: [
                        { label: '📅 Agendar una cita', text: 'Quiero agendar una cita', payload: 'start_booking' },
                        { label: '💈 Asesor de Estilo', text: 'Quiero asesoría de corte', payload: 'start_quiz' }
                    ]
                });
                return;
            }

            // 2. Ubicación / Dirección / Dónde queda
            if (q.includes('donde') || q.includes('ubicacion') || q.includes('direccion') || q.includes('queda') || q.includes('como llegar') || q.includes('lugar')) {
                appendMessage('agent', `📍 Estamos ubicados en <strong>${BARBER_CONFIG.location}</strong>.<br><br>Atendemos con reserva previa para brindarte una experiencia exclusiva y sin esperas innecesarias.`, {
                    quickReplies: [
                        { label: '📅 Agendar mi hora', text: 'Quiero agendar una cita', payload: 'start_booking' },
                        { label: '⏰ Ver horarios de atención', text: '¿Qué horarios tienen?', payload: 'info_hours' }
                    ]
                });
                return;
            }

            // 3. Horarios / Días de atención
            if (q.includes('horario') || q.includes('hora') || q.includes('dias') || q.includes('abierto') || q.includes('abren') || q.includes('domingo')) {
                appendMessage('agent', `⏰ <strong>Horarios de Atención:</strong><br><br>• <strong>Lunes a Sábado:</strong> 09:00 - 18:00 hrs<br>• <strong>Domingos:</strong> 10:00 - 01:00 hrs (Atención especial)<br><br>¿Te gustaría reservar para hoy o esta semana?`, {
                    quickReplies: [
                        { label: '📅 Reservar ahora', text: 'Quiero agendar una cita', payload: 'start_booking' }
                    ]
                });
                return;
            }

            // 4. Medios de Pago
            if (q.includes('pago') || q.includes('tarjeta') || q.includes('transferencia') || q.includes('efectivo') || q.includes('redcompra') || q.includes('debito')) {
                appendMessage('agent', `💳 <strong>Métodos de Pago Aceptados:</strong><br><br>Aceptamos ${BARBER_CONFIG.paymentMethods}. Puedes pagar cómodamente al finalizar tu sesión.`, {
                    quickReplies: [
                        { label: '📅 Agendar Cita', text: 'Quiero agendar una cita', payload: 'start_booking' }
                    ]
                });
                return;
            }

            // 5. Cortes / Fades / Barba
            if (q.includes('fade') || q.includes('degradado') || q.includes('barba') || q.includes('taper') || q.includes('perfilado') || q.includes('corte')) {
                appendMessage('agent', `✂️ En <strong>Macciell Barber</strong> somos especialistas en todo tipo de Fades (Low, Mid, High, Skin, Taper), cortes clásicos a tijera y rituales completos de barba con toalla caliente y navaja libre.<br><br>¿Quieres que evaluemos cuál te queda mejor según tu tipo de rostro?`, {
                    quickReplies: [
                        { label: '💈 Sí, evaluar mi corte ideal', text: 'Quiero asesoría de corte', payload: 'start_quiz' },
                        { label: '📅 Agendar Cita', text: 'Quiero agendar una cita', payload: 'start_booking' }
                    ]
                });
                return;
            }

            // 6. Productos / Ceras / Aftershave
            if (q.includes('cera') || q.includes('aftershave') || q.includes('after shave') || q.includes('pomada') || q.includes('nishman') || q.includes('producto')) {
                showProductsShowcase();
                return;
            }

            // 7. Contacto directo / Teléfono
            if (q.includes('whatsapp') || q.includes('telefono') || q.includes('numero') || q.includes('contacto') || q.includes('hablar con')) {
                const waUrl = generateWhatsAppLink('Hola Macciell, me comunico desde la página web para una consulta.');
                appendMessage('agent', `📱 Puedes contactar directamente a Macciell al WhatsApp oficial:<br><br><strong>+56 9 9615 5254</strong><br><br><div class="ai-card-cta"><a href="${waUrl}" target="_blank" class="ai-action-btn btn-whatsapp-agent">Abrir WhatsApp de Macciell</a></div>`, {
                    quickReplies: [
                        { label: '💈 Asesor de Corte', text: 'Quiero asesoría de corte', payload: 'start_quiz' },
                        { label: '📅 Agendar Cita', text: 'Quiero agendar una cita', payload: 'start_booking' }
                    ]
                });
                return;
            }

            // Respuesta por defecto con asistencia guiada
            appendMessage('agent', `Comprendo. En <strong>Macciell Barber</strong> nos enfocamos en brindarte la máxima calidad, precisión y estilo personalizado.<br><br>¿En qué puedo orientarte en este momento?`, {
                quickReplies: [
                    { label: '💈 Descubrir mi corte ideal', text: 'Quiero asesoría de corte', payload: 'start_quiz' },
                    { label: '📅 Agendar una cita', text: 'Quiero agendar una cita', payload: 'start_booking' },
                    { label: '💵 Ver lista de precios', text: '¿Cuáles son los precios?', payload: 'info_prices' },
                    { label: '📍 Ver ubicación', text: '¿Dónde están ubicados?', payload: 'info_location' }
                ]
            });

        }, 450);
    }

    // Manejador central de mensajes de usuario
    function handleUserMessage(text, payload) {
        appendMessage('user', text);

        // Procesar según el estado actual de la conversación
        if (payload === 'start_quiz') {
            startStyleQuiz();
            return;
        }

        if (payload && payload.startsWith('face_')) {
            const face = payload.replace('face_', '');
            handleQuizFace(face);
            return;
        }

        if (payload && payload.startsWith('hair_')) {
            handleQuizHair(payload);
            return;
        }

        if (payload && payload.startsWith('style_')) {
            finishStyleQuiz(payload);
            return;
        }

        if (payload === 'start_booking') {
            startBookingFlow();
            return;
        }

        if (payload && payload.startsWith('service_')) {
            const sId = payload.replace('service_', '');
            handleBookingService(sId);
            return;
        }

        if (state.conversationStep === 'booking_name') {
            state.bookingData.name = text;
            state.conversationStep = 'booking_date';
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                appendMessage('agent', `Mucho gusto, <strong>${text}</strong>. ¿Para qué <strong>día</strong> te gustaría tu hora?`, {
                    quickReplies: [
                        { label: '📅 Hoy mismo', text: 'Para hoy mismo', payload: 'date_today' },
                        { label: '📅 Mañana', text: 'Para mañana', payload: 'date_tomorrow' },
                        { label: '📅 Este Fin de Semana', text: 'Para este fin de semana', payload: 'date_weekend' }
                    ]
                });
            }, 400);
            return;
        }

        if (state.conversationStep === 'booking_date') {
            state.bookingData.date = text;
            handleBookingDate();
            return;
        }

        if (state.conversationStep === 'booking_time') {
            state.bookingData.time = text;
            finishBookingFlow();
            return;
        }

        if (payload === 'show_products') {
            showProductsShowcase();
            return;
        }

        if (payload === 'info_faq' || payload === 'info_prices' || payload === 'info_location' || payload === 'info_hours') {
            handleNLPQuery(text);
            return;
        }

        // Si no es un paso de wizard específico, procesar con NLP
        handleNLPQuery(text);
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAgentUI);
    } else {
        initAgentUI();
    }

})();
