document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.custom-navbar');

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(18, 63, 154, 0.55)';
        } else {
            navbar.style.background = 'rgba(18, 63, 154, 0.55)';
        }
    });

    // Simple smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                history.replaceState(null, '', this.getAttribute('href'));
                updateActiveNav();
            }
        });
    });

    const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link[href]'));
    const sectionIds = ['areas', 'noticias', 'contacto'];
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    function clearActiveNav() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    function normalizePath(path) {
        if (!path || path === '' || path === '/') {
            return 'index.html';
        }
        return path.replace(/^.*\//, '');
    }

    function updateActiveNav() {
        clearActiveNav();
        const currentPath = normalizePath(window.location.pathname);
        const currentHash = window.location.hash;

        // Highlight exact page link first
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            if (href === currentPath || href === './' + currentPath || href === '/' + currentPath) {
                link.classList.add('active');
                return;
            }

            const [linkPath, linkHash] = href.split('#');
            const normalizedLinkPath = normalizePath(linkPath);

            if (linkHash && normalizedLinkPath === currentPath && '#' + linkHash === currentHash) {
                link.classList.add('active');
            }
        });

        // On pages with sections, highlight the section visible in viewport
        if (sections.length > 0) {
            let visibleSection = null;
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.15) {
                    visibleSection = section.id;
                }
            });

            if (visibleSection) {
                const sectionLink = navLinks.find(link => link.hash === '#' + visibleSection);
                if (sectionLink) {
                    clearActiveNav();
                    sectionLink.classList.add('active');
                }
            }
        }
    }

    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('hashchange', updateActiveNav);

    // Manejar envío del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const dni = document.getElementById('dni').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const asuntoInput = document.getElementById('asunto').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const mensajeEstado = document.getElementById('mensajeEstado');

            // Validar que los campos no estén vacíos
            if (!nombre || !dni || !telefono || !asuntoInput || !mensaje) {
                mostrarMensaje('Por favor completa todos los campos', 'error', mensajeEstado);
                return;
            }

            if (!/^\d{8}$/.test(dni)) {
                mostrarMensaje('El DNI debe tener exactamente 8 dígitos', 'error', mensajeEstado);
                return;
            }

            if (!/^\d{9}$/.test(telefono)) {
                mostrarMensaje('El número de teléfono debe tener exactamente 9 dígitos', 'error', mensajeEstado);
                return;
            }

            // Crear el contenido del email
            const asunto = asuntoInput;
            const cuerpoEmail = `Hola mi nombre es: ${nombre}
Con DNI: ${dni}
Mi número de contacto es: ${telefono}

Mensaje:
${mensaje}`;

            // Crear URL encoded content
            const asuntoEncoded = encodeURIComponent(asunto);
            const cuerpoEncoded = encodeURIComponent(cuerpoEmail);

            // Copiar el contenido completo al portapapeles
            navigator.clipboard.writeText(cuerpoEmail).then(() => {
                // Abrir Gmail en una nueva pestaña con los parámetros correctos
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=chancaylambayeque@juchl.org.pe&su=${asuntoEncoded}&body=${cuerpoEncoded}`;

                // Intentar abrir con todos los parámetros
                window.open(gmailUrl, '_blank');

                // Mostrar instrucciones detalladas con opción de copiar
                const btnCopiar = '<button id="btnCopiarAgain" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">📋 Copiar nuevamente</button>';

                mostrarMensajePersonalizado(
                    '✉️ <strong>Gmail se abrirá en una nueva pestaña</strong><br><br>' +
                    '📋 <strong>El contenido ya está copiado</strong><br><br>' +
                    '<strong>En Gmail:</strong><br>' +
                    '1️⃣ Haz clic en el área de composición (campo de mensaje)<br>' +
                    '2️⃣ Pega el contenido (Ctrl+V en Windows o Cmd+V en Mac)<br>' +
                    '3️⃣ Revisa que todo esté correcto<br>' +
                    '4️⃣ Haz clic en "Enviar"<br><br>' +
                    btnCopiar,
                    'exito',
                    mensajeEstado
                );

                // Agregar funcionalidad al botón de copiar
                document.getElementById('btnCopiarAgain').addEventListener('click', () => {
                    navigator.clipboard.writeText(cuerpoEmail).then(() => {
                        mostrarMensaje('✅ Contenido copiado nuevamente', 'exito', mensajeEstado);
                    });
                });

                // Limpiar formulario después de 4 segundos
                setTimeout(() => {
                    contactForm.reset();
                }, 4000);
            }).catch(err => {
                mostrarMensaje('Error al copiar. Por favor intenta nuevamente.', 'error', mensajeEstado);
                console.error('Error al copiar:', err);
            });
        });
    }

    // Función para mostrar mensajes normales
    function mostrarMensaje(texto, tipo, elemento) {
        elemento.innerHTML = texto;
        elemento.style.display = 'block';

        if (tipo === 'exito') {
            elemento.style.background = 'rgba(76, 175, 80, 0.2)';
            elemento.style.color = '#4CAF50';
            elemento.style.border = '1px solid rgba(76, 175, 80, 0.5)';
        } else {
            elemento.style.background = 'rgba(244, 67, 54, 0.2)';
            elemento.style.color = '#f44336';
            elemento.style.border = '1px solid rgba(244, 67, 54, 0.5)';
        }

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }

    // Función para mostrar mensajes con HTML
    function mostrarMensajePersonalizado(html, tipo, elemento) {
        elemento.innerHTML = html;
        elemento.style.display = 'block';
        elemento.style.lineHeight = '1.8';
        elemento.style.fontSize = '14px';

        if (tipo === 'exito') {
            elemento.style.background = 'rgba(76, 175, 80, 0.2)';
            elemento.style.color = '#4CAF50';
            elemento.style.border = '1px solid rgba(76, 175, 80, 0.5)';
        } else {
            elemento.style.background = 'rgba(244, 67, 54, 0.2)';
            elemento.style.color = '#f44336';
            elemento.style.border = '1px solid rgba(244, 67, 54, 0.5)';
        }

        // NO ocultar automáticamente, el usuario debe verlo
    }

    // --- INTEGRACIÓN DINÁMICA CON LA BASE DE DATOS (ADMIN PANEL) ---
    window.getApiUrl = function(route, id = null) {
        // Detectar si estamos en el entorno de desarrollo Node o en un hosting PHP
        const isDev = window.location.port === "3000" || window.location.hostname.includes("run.app") || window.location.hostname.includes("aistudio");
        if (isDev) {
            return id ? `/api/admin/${route}/${id}` : `/api/admin/${route}`;
        } else {
            const phpFile = route === "change-password" ? "change-password.php" : `${route}.php`;
            return id ? `php-api/${phpFile}?id=${id}` : `php-api/${phpFile}`;
        }
    };
    function getApiUrl(route, id = null) {
        return window.getApiUrl(route, id);
    }

    async function initDynamicContent() {
        try {
            // 1. Cargar Configuración General
            const configRes = await fetch(getApiUrl("config"));
            if (configRes.ok) {
                const config = await configRes.json();
                
                // Actualizar títulos del sitio
                if (config.pageTitle) {
                    document.title = config.pageTitle;
                }
                
                const navTitle = document.querySelector(".navbar-brand span");
                if (navTitle && config.pageSubtitle) {
                    navTitle.innerText = config.pageSubtitle;
                }

                // Actualizar Nosotros (Misión, Visión, Reseña Histórica)
                const misionEl = document.getElementById("mision-text");
                const visionEl = document.getElementById("vision-text");
                const historiaEl = document.getElementById("historia-text");
                if (misionEl && config.mision) {
                    misionEl.innerText = config.mision;
                }
                if (visionEl && config.vision) {
                    visionEl.innerText = config.vision;
                }
                if (historiaEl && config.historia) {
                    historiaEl.innerHTML = config.historia.split('\n\n').map(p => `
                        <p class="text-white mb-3" style="font-size: 15px; line-height: 1.8;">
                            ${p.replace(/\n/g, '<br>')}
                        </p>
                    `).join('');
                }

                // Cambiar el fondo del body manteniendo los gradientes de diseño
                if (config.heroBg) {
                    document.body.style.backgroundImage = `
                        radial-gradient(ellipse at 20% 50%, rgba(130, 207, 255, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 30%, rgba(183, 245, 104, 0.1) 0%, transparent 50%),
                        radial-gradient(ellipse at 60% 80%, rgba(200, 160, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(ellipse at 60% 80%, rgba(200, 160, 255, 0.1) 0%, transparent 50%),
                        url('${config.heroBg}')
                    `;
                }

                // Actualizar datos de contacto en el pie de página / sección contacto
                const contactEmails = document.querySelectorAll("a[href^='mailto:']");
                contactEmails.forEach(el => {
                    if (config.contactEmail) {
                        el.href = `mailto:${config.contactEmail}`;
                        el.innerText = config.contactEmail;
                    }
                });

                const contactPhones = document.querySelectorAll("a[href^='tel:']");
                contactPhones.forEach(el => {
                    if (config.contactPhone) {
                        el.href = `tel:${config.contactPhone}`;
                        el.innerText = config.contactPhone;
                    }
                });
            }
        } catch (e) {
            console.error("Error cargando configuración dinámica:", e);
        }

        try {
            // 2. Convocatorias Dinámicas
            const convRes = await fetch(getApiUrl("convocatorias"));
            if (convRes.ok) {
                const convocatorias = await convRes.json();
                const modalElement = document.getElementById("exampleModal");
                if (modalElement) {
                    const modalBody = modalElement.querySelector(".modal-body");
                    if (modalBody) {
                        const vigentes = convocatorias.filter(c => c.status === "vigente");
                        const concluidos = convocatorias.filter(c => c.status === "concluido");

                        let html = `<h5 class="text-primary-custom mb-3">Vigentes:</h5>`;
                        if (vigentes.length === 0) {
                            html += `<p class="text-white opacity-75 mb-4">Actualmente no hay ninguna convocatoria vigente.</p>`;
                        } else {
                            html += `<div class="table-responsive mb-4"><table class="table table-borderless align-middle"><tbody>`;
                            vigentes.forEach(c => {
                                const btnClass = c.fileUrl === "#" || !c.fileUrl ? "btn bg-terceary-custom btn-sm" : "btn bg-secondary-custom btn-sm";
                                const target = c.fileUrl === "#" || !c.fileUrl ? "" : 'target="_blank"';
                                html += `
                                    <tr>
                                        <td><p class="bg-terceary-custom mb-0 text-white">${c.title}</p></td>
                                        <td class="text-end" style="width: 100px;">
                                            <a href="${c.fileUrl || '#'}" ${target} class="${btnClass}">Ver</a>
                                        </td>
                                    </tr>`;
                            });
                            html += `</tbody></table></div>`;
                        }

                        html += `<h5 class="text-primary-custom mb-3">Concluidos:</h5>`;
                        if (concluidos.length === 0) {
                            html += `<p class="text-white opacity-75">No hay convocatorias concluidas registradas.</p>`;
                        } else {
                            html += `<div class="table-responsive"><table class="table table-borderless align-middle"><tbody>`;
                            concluidos.forEach(c => {
                                const btnClass = c.fileUrl === "#" || !c.fileUrl ? "btn bg-terceary-custom btn-sm" : "btn bg-secondary-custom btn-sm";
                                const target = c.fileUrl === "#" || !c.fileUrl ? "" : 'target="_blank"';
                                html += `
                                    <tr>
                                        <td><p class="bg-terceary-custom mb-0 text-white">${c.title}</p></td>
                                        <td class="text-end" style="width: 100px;">
                                            <a href="${c.fileUrl || '#'}" ${target} class="${btnClass}">Ver</a>
                                        </td>
                                    </tr>`;
                            });
                            html += `</tbody></table></div>`;
                        }

                        modalBody.innerHTML = html;
                    }
                }
            }
        } catch (e) {
            console.error("Error cargando convocatorias dinámicas:", e);
        }

        try {
            // 3. Avisos Importantes (Carrusel)
            const announcementModal = document.getElementById('importantAnnouncementModal');
            if (announcementModal && window.bootstrap) {
                const [avisosRes, configRes] = await Promise.all([
                    fetch(getApiUrl("avisos")).catch(() => null),
                    fetch(getApiUrl("config")).catch(() => null)
                ]);

                let isModalGlobalActive = true;
                if (configRes && configRes.ok) {
                    const cfg = await configRes.json();
                    if (cfg.modalAvisosActive === false) {
                        isModalGlobalActive = false;
                    }
                }

                if (isModalGlobalActive && avisosRes && avisosRes.ok) {
                    const rawAvisos = await avisosRes.json();
                    if (Array.isArray(rawAvisos)) {
                        const avisos = rawAvisos.filter(a => a.active !== false);
                        const carouselElement = document.getElementById("importantAnnouncementCarousel");
                        if (carouselElement && avisos.length > 0) {
                            const indicatorsContainer = carouselElement.querySelector(".carousel-indicators");
                            const innerContainer = carouselElement.querySelector(".carousel-inner");

                            if (indicatorsContainer && innerContainer) {
                                indicatorsContainer.innerHTML = "";
                                innerContainer.innerHTML = "";

                                avisos.forEach((a, index) => {
                                    // Indicator
                                    const btn = document.createElement("button");
                                    btn.type = "button";
                                    btn.setAttribute("data-bs-target", "#importantAnnouncementCarousel");
                                    btn.setAttribute("data-bs-slide-to", index);
                                    btn.ariaLabel = `Anuncio ${index + 1}`;
                                    if (index === 0) {
                                        btn.className = "active";
                                        btn.setAttribute("aria-current", "true");
                                    }
                                    indicatorsContainer.appendChild(btn);

                                    // Item
                                    const item = document.createElement("div");
                                    item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                                    item.innerHTML = `
                                        <img src="${a.imageUrl}" class="d-block w-100" alt="${a.title}" style="height: min(52vh, 400px); object-fit: cover; border-radius: 8px;">
                                        <div class="carousel-caption d-none d-md-block p-3 rounded" style="background: rgba(0,0,0,0.65); backdrop-filter: blur(5px);">
                                            <h3 class="fs-5 text-white fw-bold mb-1" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${a.title}</h3>
                                            <p class="text-white-50 small mb-0" style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">${a.description || ''}</p>
                                        </div>
                                    `;
                                    innerContainer.appendChild(item);
                                });

                                // Mostrar el modal automáticamente solo si está activo globalmente y hay anuncios
                                setTimeout(() => {
                                    try {
                                        const modal = new bootstrap.Modal(announcementModal, {
                                            backdrop: true,
                                            keyboard: true,
                                            focus: true
                                        });
                                        modal.show();
                                    } catch (err) {
                                        console.error("Error mostrando modal de anuncios:", err);
                                    }
                                }, 300);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error cargando avisos del carrusel:", e);
        }

        try {
            // 4. Comisiones (en comisiones.html)
            const comisionesContainer = document.getElementById("comisiones-container");
            if (comisionesContainer) {
                const comRes = await fetch(getApiUrl("comisiones"));
                if (comRes.ok) {
                    const comisiones = await comRes.json();
                    if (Array.isArray(comisiones)) {
                        comisiones.sort((a, b) => (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" }));
                    }
                    comisionesContainer.innerHTML = "";
                    
                    // Actualizar el título de la sección de comisiones
                    const comisionesCountHeader = document.querySelector("#comisiones h2");
                    if (comisionesCountHeader) {
                        comisionesCountHeader.innerText = `${comisiones.length} Comisiones de Usuarios`;
                    }
                    
                     comisiones.forEach(com => {
                        const coverUrl = com.cover || 'assets/img/fondo/TINAJONES-1024x768.jpg';
                        const logoUrl = com.logo || 'assets/img/juchl.png';
                        const desc = com.description || '';
                        
                        let extraDetailsHtml = "";
                        if (com.presidente) {
                            extraDetailsHtml += `
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="bi bi-person-check-fill text-primary-custom"></i>
                                    <span class="text-white" style="font-size: 12px;">
                                        <strong class="text-secondary-custom">Presidente: </strong>${com.presidente}
                                    </span>
                                </div>
                            `;
                        }
                        if (com.direccion) {
                            extraDetailsHtml += `
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="bi bi-geo-alt-fill text-primary-custom"></i>
                                    <span class="text-white" style="font-size: 12px;">
                                        <strong class="text-secondary-custom">Direccion: </strong>${com.direccion}
                                    </span>
                                </div>
                            `;
                        }
                        if (com.usuarios) {
                            extraDetailsHtml += `
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="bi bi-person-arms-up text-primary-custom"></i>
                                    <span class="text-white" style="font-size: 12px;">
                                        <strong class="text-secondary-custom">Usuarios: </strong>${com.usuarios}
                                    </span>
                                </div>
                            `;
                        }
                        if (com.area) {
                            extraDetailsHtml += `
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <i class="bi bi-pin-map text-primary-custom"></i>
                                    <span class="text-white" style="font-size: 12px;">
                                        <strong class="text-secondary-custom">Area: </strong>${com.area}
                                    </span>
                                </div>
                            `;
                        }

                        const col = document.createElement("div");
                        col.className = "col-md-6 col-lg-4";
                        col.innerHTML = `
                            <a href="#" class="text-decoration-none h-100 d-block">
                                <div class="glass-card p-4 p-md-5 d-flex flex-column gap-4 ambient-glow h-100" style="position: relative;">
                                    <img src="${coverUrl}" alt="${com.name}"
                                        style="width: 100%; height: 20rem; border-radius: 12px; object-fit: cover; filter: brightness(0.8);"
                                        onerror="this.onerror=null; this.src='assets/img/fondo/TINAJONES-1024x768.jpg';">
                                    <img src="${logoUrl}" alt="${com.name} Logo"
                                        style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; position: absolute; top: 2rem; left: 2rem; border: 2px solid rgba(255,255,255,0.8);"
                                        onerror="this.onerror=null; this.src='assets/img/juchl.png';">
                                    <div class="bg-primary-custom text-white py-1 px-3 rounded-pill"
                                        style="position: absolute; top: 4rem; right: 3.5rem; transform: translateY(-50%); font-size: 10px;">
                                        <strong>INSTITUCIÓN</strong>
                                    </div>
                                    <div>
                                        <h3 class="font-heading text-white fs-5 fw-bold mb-3 text-primary-custom">${com.name}</h3>
                                        <div class="mb-3">
                                            ${extraDetailsHtml}
                                        </div>
                                        <p class="comision-custom-desc text-white opacity-75 mb-0" style="font-size: 13px; text-align: justify; text-shadow: none;">
                                            ${desc}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        `;
                        comisionesContainer.appendChild(col);
                    });
                }
            }
        } catch (e) {
            console.error("Error cargando comisiones dinámicas:", e);
        }

        try {
            // 5. Áreas Dinámicas (en areas.html)
            const areasContainer = document.getElementById("areas-container");
            if (areasContainer) {
                const areasRes = await fetch(getApiUrl("areas"));
                if (areasRes.ok) {
                    const areas = await areasRes.json();
                    areasContainer.innerHTML = "";
                    
                    // Actualizar cantidad de áreas en el título
                    const areasCountHeader = document.querySelector("#areas h2");
                    if (areasCountHeader) {
                        areasCountHeader.innerText = `${areas.length} Direcciones`;
                    }
                    
                    areas.forEach(area => {
                        let color = area.color || '#a6e358';
                        if (color === 'primary') color = '#a6e358';
                        if (color === 'secondary') color = '#82cfff';
                        
                        const rawIcon = area.icon || 'bi-gear';
                        // Detect if it's a Bootstrap icon (starts with 'bi-') or Material icon
                        const isBootstrap = rawIcon.startsWith('bi-') || rawIcon.startsWith('bi ');
                        let iconHtml = "";
                        if (isBootstrap) {
                            const finalIcon = rawIcon.startsWith('bi-') ? rawIcon : `bi-${rawIcon}`;
                            iconHtml = `<i class="bi ${finalIcon}" style="color: ${color}; font-size: 1.75rem;"></i>`;
                        } else {
                            iconHtml = `<span class="material-symbols-outlined" style="color: ${color}; font-size: 1.75rem;">${rawIcon}</span>`;
                        }
                        
                        const col = document.createElement("div");
                        col.className = "col-md-6 col-lg-4";
                        col.innerHTML = `
                            <a href="#" class="text-decoration-none h-100 d-block">
                                <div class="glass-card p-4 p-md-5 d-flex flex-column gap-4 ambient-glow h-100" data-area-id="${area.id}">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 56px; height: 56px; background: ${color}1A;">
                                        ${iconHtml}
                                    </div>
                                    <div>
                                        <h3 class="font-heading fs-5 fw-bold mb-2" style="color: ${color} !important">${area.title}</h3>
                                        <p class="text-white mb-0" style="text-shadow: none;">${area.description}</p>
                                    </div>
                                </div>
                            </a>
                        `;
                        areasContainer.appendChild(col);
                    });
                }
            }
        } catch (e) {
            console.error("Error cargando áreas:", e);
        }

        try {
            // 6. Normativas Dinámicas (en normativa.html)
            const normativasContainer = document.getElementById("normativas-container");
            if (normativasContainer) {
                const normativasRes = await fetch(getApiUrl("normativas"));
                if (normativasRes.ok) {
                    const normativas = await normativasRes.json();
                    normativasContainer.innerHTML = "";
                    
                    normativas.forEach(n => {
                        const desc = n.description || "";
                        const hasQuote = desc.startsWith("“") || desc.startsWith("“") || desc.startsWith("\"") || desc.startsWith("'");
                        const finalDesc = hasQuote ? desc : `“${desc}”`;
                        
                        const li = document.createElement("li");
                        li.className = "p-3 rounded-3";
                        li.setAttribute("data-normativa-id", n.id);
                        li.style.background = "rgba(255,255,255,0.03)";
                        li.style.border = "1px solid var(--glass-stroke)";
                        const docUrl = n.documentUrl || "";
                        const verBtn = docUrl ? `
                            <a href="${docUrl}" target="_blank" rel="noopener noreferrer"
                               class="btn btn-sm flex-shrink-0 ms-2 px-3 fw-bold"
                               style="background: rgba(130,207,255,0.15); border: 1px solid rgba(130,207,255,0.4); color: #82cfff; border-radius: 8px; font-size: 12px; white-space: nowrap;"
                               onmouseover="this.style.background='rgba(130,207,255,0.3)'"
                               onmouseout="this.style.background='rgba(130,207,255,0.15)'">
                               <span class="material-symbols-outlined" style="font-size:14px; vertical-align: middle;">open_in_new</span> Ver
                            </a>` : "";
                        li.innerHTML = `
                            <div class="d-flex gap-3 align-items-center justify-content-between">
                                <div class="d-flex gap-3 align-items-start flex-grow-1">
                                    <span class="material-symbols-outlined text-secondary-custom flex-shrink-0" style="margin-top:2px;">description</span>
                                    <p class="text-white mb-0">
                                        <strong class="text-primary-custom">${n.title}</strong> ${finalDesc}
                                    </p>
                                </div>
                                ${verBtn}
                            </div>
                        `;
                        normativasContainer.appendChild(li);
                    });
                }
            }
        } catch (e) {
            console.error("Error cargando normativas:", e);
        }
    }

    // Iniciar carga de contenido dinámico
    initDynamicContent();
});
