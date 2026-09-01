import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

let memoryDb = null;

export function getDatabase() {
    if (!memoryDb) {
        memoryDb = JSON.parse(JSON.stringify(initialData));
        const salt = bcrypt.genSaltSync(10);
        memoryDb.config.adminPasswordHash = bcrypt.hashSync("admin123", salt);
    }
    return memoryDb;
}

export function saveDatabase(data) {
    memoryDb = data;
}
const initialData = {
    config: {
        adminPasswordHash: "", // Will be set to hash of 'admin123'
        pageTitle: "Junta de Usuarios Chancay Lambayeque",
        pageSubtitle: "JUSHMCHL Clase A",
        heroBg: "assets/img/fondo/TINAJONES-1024x768.jpg",
        contactEmail: "contacto@jushmchl.org.pe",
        contactPhone: "+51 74 233366",
        contactAddress: "Av. Salaverry 123, Chiclayo, Perú",
        modalAvisosActive: true,
        mision: "Somos una organización que brinda servicios de operación, mantenimiento de la infraestructura hidráulica menor y distribución del recurso hídrico para uso multisectorial, de calidad, desarrollando proyectos y programas de alto impacto, a favor de los usuarios agrarios, para contribuir a su desarrollo productivo.",
        vision: "Consolidarnos como una organización moderna y eficiente, referente a nivel internacional, para la mejora de la calidad a favor de los usuarios agrarios, de forma sostenible.",
        historia: `La Junta de Usuarios Chancay Lambayeque fue constituida en mérito al Decreto Ley 17752, Ley General de Aguas y reconocida mediante Resolución Ministerial Nº 5257-72-AG, del 13 de Octubre de 1972. La Junta de Usuarios es la Organización representativa de todos los usuarios y usuarias del agua con fines agrarios y otros usos: poblacional, energético, industrial, etc.

La institución está constituida por dieciséis (16) Comisiones de Usuarios, Catorce (15) en la zona Regulada: Chongoyape, Pampagrande, Ferreñafe, Pítipo, Capote, Lambayeque, Chiclayo, Monsefú, Reque, Eten, Mochumí, Muy Finca, Túcume, Sasape, Mórrope y una (1) en la no regulado que es La Ramada. Nuestra organización representa a 29,146 agricultores, que en conjunto conducen una superficie total de 119,586.6353 hectáreas bajo riego. Los principales cultivos son: Arroz, algodón, caña de azúcar, maíz amarillo duro, pastos, hortalizas, menestras entre otros.

La Junta de Usuarios, en sus inicios, desarrolló actividades netamente representativas, pero a partir de 1989 se le asignan responsabilidades mayores a través del D.S. 037-89-AG, al transferirle la distribución del agua y Operación y Mantenimiento de los Sistemas de Riego y Drenaje, en el caso del Valle Chancay-Lambayeque estas se hicieron efectivas a fines de 1992. A partir del 01 de Enero del 2005, la Junta de Usuarios desempeña el encargo de Operador de la Infraestructura Hidráulica Menor y tiene por finalidad canalizar en forma ordenada, la participación de los usuarios de agua en la gestión multisectorial y uso sostenible de los recursos hídricos.`
    },
    convocatorias: [
        {
            id: "c1",
            title: "Bases integradas de licitación pública para la contratación de bienes 'Adquisición de un volquete'.",
            fileUrl: "assets/archivos/convocatoria/BASES INTEGRADAS DE LICITACIÓN PUBLICA PARA LA CONTRATACIÓN.pdf",
            status: "concluido"
        },
        {
            id: "c2",
            title: "Bases – Licitación Pública N.° 02-2025-JUSHMCHL – 'Adquisición de un Volquete'.",
            fileUrl: "assets/archivos/convocatoria/BASES DE LICITACIÓN PUBLICA CONTRATACIÓN VOLQUETE.pdf",
            status: "concluido"
        },
        {
            id: "c3",
            title: "Bases del proceso de selección para la contratación de un (01) especialista en estudios, inspección y supervisión en la Dirección de Desarrollo de la Infraestructura Hidráulica.",
            fileUrl: "#",
            status: "concluido"
        },
        {
            id: "c4",
            title: "Bases del proceso de selección especialista en estudios.",
            fileUrl: "assets/archivos/convocatoria/BASES ESPECIALISTA EN ESTUDIOS FINAL0001.pdf",
            status: "concluido"
        },
        {
            id: "c5",
            title: "Bases del proceso de selección para la contratación de un (01) contador general.",
            fileUrl: "#",
            status: "concluido"
        }
    ],
    comisiones: [
        { id: "capote", name: "Capote", logo: "assets/img/comisiones/Logos/capote.jpg", cover: "assets/img/comisiones/portadas/capote.jpg", description: "Comisión de regantes del sector Capote, promoviendo el uso eficiente del agua.", presidente: "GREGORIO GERONIMO QUIROZ NÚÑEZ", direccion: "Calle San Martín S/N, Centro Poblado Capote, distrito de Picsi, Chiclayo", usuarios: "+ 694", area: "+ 3819.2687 ha" },
        { id: "chiclayo", name: "Chiclayo", logo: "assets/img/comisiones/Logos/chiclayo.jpg", cover: "assets/img/comisiones/portadas/chiclayo.jpeg", description: "Comisión de regantes de Chiclayo, abasteciendo de agua para la agricultura local.", presidente: "FELIX FALEN SAMPEN", direccion: "Calle Cajamarca N.° 410, Chiclayo", usuarios: "+ 694", area: "+ 6596.4484 ha" },
        { id: "chongoyape", name: "Chongoyape", logo: "assets/img/comisiones/Logos/chongoyape.jpg", cover: "assets/img/comisiones/portadas/chongoyape.jpg", description: "Comisión de regantes de Chongoyape, trabajando por el desarrollo del agro.", presidente: "JOSE NELSIDO ESPINOZA CHAVEZ", direccion: "Calle Schut y Saco N.° 02, esquina Simón Bolívar, Chongoyape, Lambayeque", usuarios: "+ 1205", area: "+ 5739.0627 ha" },
        { id: "eten", name: "Eten", logo: "assets/img/comisiones/Logos/eten.jpg", cover: "assets/img/comisiones/portadas/eten.jpeg", description: "Comisión de regantes de Eten, protegiendo los canales del valle.", presidente: "FRANCISCO JAVIER ÑIQUEN MILLONES", direccion: "Pedro Ruiz Nro. 648 Ciudad Eten", usuarios: "+ 518", area: "+ 625.3509 ha" },
        { id: "ferreñafe", name: "Ferreñafe", logo: "assets/img/comisiones/Logos/ferreñafe.jpg", cover: "assets/img/comisiones/portadas/ferreñafe.jpeg", description: "Comisión de regantes de Ferreñafe, optimizando la distribución hídrica.", presidente: "ROGELIO PRIMO RAMOS", direccion: "Av. Andrés A. Cáceres N.° 610, Urb. Ramiro Prialé, Ferreñafe", usuarios: "+ 4339", area: "+ 14784.6498 ha" },
        { id: "laramada", name: "La Ramada - Carniche", logo: "assets/img/comisiones/Logos/la ramada.jpg", cover: "assets/img/comisiones/portadas/la ramada.jpeg", description: "Comisión de regantes de La Ramada, unida para el progreso agrícola.", presidente: "DARIO SANCHEZ ZELADA", direccion: "C.P. La Ramada Baja S/N, distrito de Llama, provincia de Chota, Cajamarca (referencia: a unos 20 minutos de Chongoyape)", usuarios: "+ 493", area: "+ 1058.566 ha" },
        { id: "lambayeque", name: "Lambayeque", logo: "assets/img/comisiones/Logos/lambayeque.jpg", cover: "assets/img/comisiones/portadas/lambayeque.jpeg", description: "Comisión de regantes de Lambayeque, cuidando el recurso hídrico.", presidente: "MERCEDES SANTAMARIA SUCLUPE", direccion: "Calle Huáscar N.° 720, Lambayeque", usuarios: "+ 2259", area: "+ 7284.3419 ha" },
        { id: "mochumi", name: "Mochumí", logo: "assets/img/comisiones/Logos/mochumi.jpeg", cover: "assets/img/comisiones/portadas/mochumi.jpeg", description: "Comisión de regantes de Mochumí, apoyando el cultivo de arroz y legumbres.", presidente: "EXEQUIEL CHAPOÑAN VIDAURRE", direccion: "Calle Federico Villarreal N.° 098, Mochumí (Universidad Perú)", usuarios: "+ 2367", area: "+ 4454.4083 ha" },
        { id: "monsefu", name: "Monsefú", logo: "assets/img/comisiones/Logos/monsefu.jpg", cover: "assets/img/comisiones/portadas/monsefu.jpeg", description: "Comisión de regantes de Monsefú, herederos de una tradición agrícola.", presidente: "JAIME ELIAS SALAZAR", direccion: "Calle Simón Bolívar N.° 312, Monsefú", usuarios: "+ 3754", area: "+ 7087.2347 ha" },
        { id: "morrope", name: "Mórrope", logo: "assets/img/comisiones/Logos/morrope.jpg", cover: "assets/img/comisiones/portadas/morrope.jpg", description: "Comisión de regantes de Mórrope, cultivando en tierras féltiles con tecnología.", presidente: "VICTORIO ACTOSTA TEJADA", direccion: "Av. Los Incas N.° 390, distrito de Mórrope", usuarios: "+ 6267", area: "+ 12839.8507 ha" },
        { id: "muyfinca", name: "Muy Finca", logo: "assets/img/comisiones/Logos/muy finca.jpg", cover: "assets/img/comisiones/portadas/muy finca.jpeg", description: "Comisión de regantes de Muy Finca, garantizando agua oportuna para el campo.", presidente: "JOSE JUSTINIANO FIGUEROA ROQUE", direccion: "Calle 28 de Julio N.° 858, Mochumí", usuarios: "+ 4321", area: "+ 11149.194 ha" },
        { id: "pampagrande", name: "Pampagrande", logo: "assets/img/comisiones/Logos/pampagrande.jpg", cover: "assets/img/comisiones/portadas/pampagrande.jpeg", description: "Comisión de regantes de Pampagrande, gestionando sistemas de riego eficientes.", presidente: "PABLO COBEÑAS SANCHEZ", direccion: "Mz. 31, C.P. Collique Alto (3 Compuertas Collique Alto), Pucalá, Chiclayo", usuarios: "+ 773", area: "+ 3763.0337 ha" },
        { id: "pitipo", name: "Pítipo", logo: "assets/img/comisiones/Logos/pitipo.jpeg", cover: "assets/img/comisiones/portadas/pitipo.jpeg", description: "Comisión de regantes de Pítipo, impulsando la agroexportación sostenible.", presidente: "JOSÉ DE LA CRUZ CARRANZA OLIVERA", direccion: "Calle Augusta López Arenas N.° 106, Pítipo, Ferreñafe", usuarios: "+ 839", area: "+ 3517.3952 ha" },
        { id: "reque", name: "Reque", logo: "assets/img/comisiones/Logos/reque.jpg", cover: "assets/img/comisiones/portadas/reque.jpeg", description: "Comisión de regantes de Reque, comprometida con la distribución transparente del agua.", presidente: "JOSE DEL CARMEN LIZA MAZA", direccion: "Calle Real Nro. 452", usuarios: "+ 829", area: "+ 2031.6876 ha" },
        { id: "sasape", name: "Sasape", logo: "assets/img/comisiones/Logos/sasape.jpeg", cover: "assets/img/comisiones/portadas/sasape.jpeg", description: "Comisión de regantes de Sasape, trabajando de la mano con cada agricultor.", presidente: "NICOLAS BALDERA ROJAS", direccion: "Car. Panamericana Norte Nro. 803 Cas. Sasape", usuarios: "+ 3318", area: "+ 4154.5784 ha" },
        { id: "tucume", name: "Túcume", logo: "assets/img/comisiones/Logos/tucume.jpeg", cover: "assets/img/comisiones/portadas/tucume.jpeg", description: "Comisión de regantes de Túcume, preservando las fuentes de riego ancestrales.", presidente: "MARCIAL BANCES SANDOVAL", direccion: "Cal. Miguel Grau Nro. 0852 P.J. Federico Villareal", usuarios: "+ 1228", area: "+ 1698.7261 ha" }
    ],
    avisos: [
        {
            id: "a1",
            title: "Información institucional",
            description: "Mantente informado sobre las actividades de la Junta de Usuarios.",
            imageUrl: "assets/img/canales.jpg"
        },
        {
            id: "a2",
            title: "Distribución de agua",
            description: "Programación semanal de riego y turnos para comisiones de usuarios.",
            imageUrl: "assets/img/fondo/TINAJONES-1024x768.jpg"
        }
    ],
    areas: [
        { id: "operacion", title: "Operacion Infraestructura Hidraulica Menor", description: "Control y distribución precisa del agua según la demanda agrícola.", icon: "bi-gear-wide-connected", color: "primary" },
        { id: "capacitacion", title: "Capacitación y Comunicación", description: "Orientada a fortalecer las competencias de los miembros y garantizar una comunicación efectiva dentro de la organización.", icon: "bi-clipboard-pulse", color: "secondary" },
        { id: "sistemas", title: "Unidad de Sistemas e Informática", description: "Garantiza el soporte tecnológico y la gestión eficiente de la información dentro de la organización.", icon: "bi-cpu", color: "primary" },
        { id: "administracion", title: "Área de Administración", description: "Se encarga de gestionar los recursos financieros, materiales y humanos de la organización, asegurando el uso eficiente y transparente de los mismos.", icon: "bi-graph-up-arrow", color: "secondary" },
        { id: "mantenimiento", title: "Área de Mantenimiento", description: "Se dedica principalmente a conservar y rehabilitar la infraestructura hidráulica menor de la Junta de Usuarios Chancay Lambayeque.", icon: "eco", isMaterial: true, color: "primary" },
        { id: "tarifare", title: "Unidad de Tarifa R.E", description: "Se encarga de administrar y supervisar el cobro de las tarifas que los usuarios deben pagar por el uso del recurso hídrico.", icon: "payments", isMaterial: true, color: "secondary" },
        { id: "proyectos", title: "Area de Proyectos", description: "Se encarga de planificar, elaborar y supervisar los expedientes técnicos relacionados con el mantenimiento de la infraestructura hidráulica menor.", icon: "bi-kanban", color: "primary" },
        { id: "supervision", title: "Area de Supervisión", description: "Se encarga de verificar y controlar que las actividades y proyectos de la organización se ejecuten de acuerdo con los planes establecidos y las normativas vigentes.", icon: "bi-binoculars", color: "secondary" },
        { id: "planificacion", title: "Oficina de Planificación y Presupuesto", description: "se encarga de organizar, coordinar y evaluar los planes y proyectos de la institución, asegurando que los recursos económicos se asignen de manera eficiente y alineada con los objetivos estratégicos.", icon: "bi-bar-chart", color: "primary" },
        { id: "logistica", title: "Area de Logistica", description: "se encarga de gestionar la adquisición, almacenamiento y distribución de bienes y servicios necesarios para el funcionamiento de la organización.", icon: "bi-journal-arrow-up", color: "secondary" },
        { id: "legal", title: "Asesoria Legal", description: "se encarga de brindar apoyo jurídico a la organización, asegurando que las actividades y decisiones se realicen conforme al marco normativo vigente.", icon: "bi-bank", color: "primary" }
    ],
    estructura: [
        {
            id: "organo-a",
            code: "a",
            title: "Órganos de Dirección",
            badge: "Dirección",
            icon: "bi-award-fill",
            color: "#0d6efd",
            items: [
                { code: "a.1", title: "Asamblea General" },
                { code: "a.2", title: "Consejo Directivo" },
                { code: "a.3", title: "De la Presidencia" },
                { code: "a.4", title: "De la Gerencia" }
            ]
        },
        {
            id: "organo-b",
            code: "b",
            title: "Órganos de Asesoramiento",
            badge: "Asesoramiento",
            icon: "bi-shield-check",
            color: "#20c997",
            items: [
                { code: "b.1", title: "Dirección de Regulación y Asesoramiento Jurídico" },
                { code: "b.2", title: "Órganos de Apoyo" },
                { code: "b.3", title: "Dirección de Desarrollo Humano y Responsabilidad Social" },
                { code: "b.4", title: "Dirección de Administración de Servicios" }
            ]
        },
        {
            id: "organo-c",
            code: "c",
            title: "Órganos de Línea",
            badge: "Línea Operativa",
            icon: "bi-gear-wide-connected",
            color: "#198754",
            items: [
                { code: "c.1", title: "Dirección de Operación de la Infraestructura Hidráulica" },
                { code: "c.2", title: "Dirección de Mantenimiento de la Infraestructura Hidráulica" },
                { code: "c.3", title: "Dirección de Desarrollo de la Infraestructura Hidráulica" },
                { code: "c.4", title: "Dirección de Administración de la Tarifa del Agua" }
            ]
        },
        {
            id: "organo-d",
            code: "d",
            title: "Órganos Desconcentrados",
            badge: "Desconcentrados",
            icon: "bi-building-fill-gear",
            color: "#6f42c1",
            items: [
                { code: "d.1", title: "Escuela Técnica del Agro" },
                { code: "d.2", title: "Unidades de Negocio" }
            ]
        }
    ],
    normativas: [
        { id: "n1", title: "RJ 327-2018-ANA", description: "“Reglamento Operadores Infraestructura Hidráulica”" },
        { id: "n2", title: "R.J.041-2018-ANA", description: "“Lineamientos para la supervisión y fiscalización de las Juntas de Usuarios y sus (11) anexos adjuntos”" },
        { id: "n3", title: "R.J.058-2018-ANA", description: "“Disposiciones para facilitar la Formalización del Uso del Agua a las Organizaciones de Usuarios de Agua y Prestadoras de Servicios de Saneamiento, otorgando licencias de uso de agua a través de un procedimiento de oficio, simplificado, masivo y gratuito”" },
        { id: "n4", title: "D.S 018-2018 PCM", description: "“Prorroga el Estado de Emergencia, por peligro inminente ante el periodo de lluvias 2017-2018”" },
        { id: "n5", title: "R.J 078-2018-ANA", description: "“Encargan funciones de Administradores de las administraciones Locales de agua ALA-Chancay Lambayeque y Motupe- Olmos- La Leche”" }
    ],
    galeria: [
        {
            id: "g1",
            title: "Canales de Distribución",
            description: "Operación y entrega continua del recurso hídrico a las distintas comisiones de usuarios.",
            imageUrl: "assets/img/canales.jpg"
        },
        {
            id: "g2",
            title: "Reservorio Tinajones",
            description: "La gran obra de infraestructura que regula y asegura el riego del fértil valle.",
            imageUrl: "assets/img/fondo/TINAJONES-1024x768.jpg"
        },
        {
            id: "g3",
            title: "Desarrollo Sostenible",
            description: "Impulsando la producción sustentable del sector agropecuario de Lambayeque.",
            imageUrl: "assets/img/comisiones/portadas/lambayeque.jpeg"
        },
        {
            id: "g4",
            title: "Trabajo e Innovación",
            description: "Mantenimiento y mejoramiento técnico constante de la red hidráulica menor.",
            imageUrl: "assets/img/comisiones/portadas/ferreñafe.jpeg"
        }
    ],
    videos: [
        {
            id: "v1",
            title: "50 Años de Tinajones",
            description: "Documental conmemorativo sobre la gran obra del Reservorio de Tinajones, su diseño, construcción y el rol vital en la irrigación del valle.",
            videoUrl: "https://www.youtube.com/embed/H0D8z-A8W60",
            category: "Documental",
            tag: "JUSHMCHL"
        },
        {
            id: "v2",
            title: "Gestión y Distribución Hídrica",
            description: "Explicación detallada de cómo se realiza el reparto racional y técnico de agua a las 16 comisiones del valle Chancay Lambayeque.",
            videoUrl: "https://www.youtube.com/embed/U9O38S6Dk9k",
            category: "Gestión Hídrica",
            tag: "Operaciones"
        },
        {
            id: "v3",
            title: "Mantenimiento de Infraestructura",
            description: "Trabajos de limpieza, descolmatación de canales y conservación preventiva de las obras hidráulicas menores del sector.",
            videoUrl: "https://www.youtube.com/embed/E-0tB1h-9dI",
            category: "Mantenimiento",
            tag: "Obras"
        }
    ],
    eventos: [
        {
            id: "e1",
            day: 15,
            month: 5,
            year: 2026,
            eventDate: "2026-06-15",
            title: "Taller: Uso Eficiente del Recurso Hídrico",
            date: "Lunes, 15 de Junio de 2026",
            time: "11:00 AM",
            location: "Sede Comisional Lambayeque",
            category: "Capacitación",
            color: "#ea580c",
            badgeClass: "event-orange",
            label: "Taller",
            desc: "Sesión demostrativa teórica y práctica sobre las mejores técnicas de dosificación del agua de riego para mejorar el rendimiento de los cultivos locales y mitigar pérdidas."
        },
        {
            id: "e2",
            day: 28,
            month: 6,
            year: 2026,
            eventDate: "2026-07-28",
            title: "Asamblea General Extraordinaria de Delegados",
            date: "Martes, 28 de Julio de 2026",
            time: "09:00 AM",
            location: "Auditorio Principal JUSHMCHL (Av. Juan Buendía N° 145)",
            category: "Asambleas",
            color: "#2563eb",
            badgeClass: "event-blue",
            label: "Asamblea",
            desc: "Reunión ordinaria para la aprobación de informes de gestión del primer semestre y evaluación del presupuesto extraordinario para mantenimiento de obras hidráulicas menores del valle Chancay-Lambayeque."
        },
        {
            id: "e3",
            day: 5,
            month: 7,
            year: 2026,
            eventDate: "2026-08-05",
            title: "Campaña de Descolmatación y Limpieza de Canales",
            date: "Miércoles, 05 de Agosto de 2026",
            time: "07:00 AM",
            location: "Canales principales de las Comisiones Muy Finca y Túcume",
            category: "Mantenimiento",
            color: "#16a34a",
            badgeClass: "event-green",
            label: "Limpieza",
            desc: "Jornada participativa con la presencia de directivos, ingenieros técnicos y usuarios agrícolas para erradicar malezas y sedimentos acumulados, garantizando la fluidez óptima del recurso hídrico."
        },
        {
            id: "e4",
            day: 12,
            month: 7,
            year: 2026,
            eventDate: "2026-08-12",
            title: "Taller Práctico: Optimización de Riego Tecnificado",
            date: "Miércoles, 12 de Agosto de 2026",
            time: "10:30 AM",
            location: "Fundo Experimental Ferreñafe (Sector El Algodonal)",
            category: "Capacitación",
            color: "#ea580c",
            badgeClass: "event-orange",
            label: "Taller",
            desc: "Taller de transferencia tecnológica enfocado en el manejo de presiones en riego localizado, dosificación óptima de fertilizantes mediante venturi y prácticas sostenibles de conservación de suelos."
        },
        {
            id: "e5",
            day: 20,
            month: 7,
            year: 2026,
            eventDate: "2026-08-20",
            title: "Vencimiento de Pago de Tarifa por Uso de Agua",
            date: "Jueves, 20 de Agosto de 2026",
            time: "Hasta las 06:00 PM (Cierre de Caja)",
            location: "Sedes Chiclayo, Lambayeque y Ferreñafe",
            category: "Vencimientos",
            color: "#dc2626",
            badgeClass: "event-red",
            label: "Tarifa",
            desc: "Último plazo reglamentario para cancelar la cuota correspondiente a la tarifa de agua de la Campaña Chica 2026. Evite penalidades, cortes del suministro temporal e intereses moratorios."
        },
        {
            id: "e6",
            day: 10,
            month: 8,
            year: 2026,
            eventDate: "2026-09-10",
            title: "Campaña de Conservación de Canales Alimentadores",
            date: "Lunes, 10 de Septiembre de 2026",
            time: "08:00 AM",
            location: "Canales de Distribución Chiclayo",
            category: "Mantenimiento",
            color: "#16a34a",
            badgeClass: "event-green",
            label: "Limpieza",
            desc: "Actividad comunal para deshierbe, retiro de malezas y mantenimiento integral de compuertas y tomas secundarias en el sector Chiclayo."
        },
        {
            id: "e7",
            day: 25,
            month: 8,
            year: 2026,
            eventDate: "2026-09-25",
            title: "Último Plazo para Declaración de Intención de Cultivos",
            date: "Viernes, 25 de Septiembre de 2026",
            time: "Todo el día",
            location: "Oficina Técnica de Planificación Agraria",
            category: "Vencimientos",
            color: "#dc2626",
            badgeClass: "event-red",
            label: "Declaración",
            desc: "Fecha límite impuesta para presentar la declaración obligatoria del plan de cultivos para el próximo ciclo. Requisito indispensable para la asignación de volumen de agua."
        }
    ],
    diagnostico: {
        title: "2. DIAGNÓSTICO DE LA JUSHMCHL",
        subtitle: "Análisis integral del modelo de negocio, core business y diagnóstico interno y externo institucional.",
        descripcionNegocio: {
            intro: "La Junta de Usuarios Chancay Lambayeque, en calidad de operador de la infraestructura hidráulica del Sector Hidráulico Menor Chancay Lambayeque tiene como funciones principales operar y mantener la infraestructura hidráulica a su cargo, promoviendo su desarrollo, así como cobrar las tarifas de agua y administrar estos recursos públicos.",
            funciones: [
                "Operar y mantener la infraestructura hidráulica a su cargo, promoviendo su desarrollo.",
                "Distribuir el agua en el sector hidráulico Menor de acuerdo a la disponibilidad de los recursos hídricos y los programas aprobados.",
                "Cobrar las tarifas de agua y administrarlas adecuadamente.",
                "Recaudar la retribución económica y transferirla a la Autoridad Nacional del Agua.",
                "Supervisar el cumplimiento de las obligaciones de los usuarios de agua del sector hidráulico."
            ]
        },
        coreBusiness: "La Operación de la infraestructura Hidráulica: Distribución de Agua",
        diagnosticoInterno: "La JUSHMCHL actualmente viene pasando por tiempos de cambios en la reestructuración organizacional y el marco normativo regulatorio. En el aspecto financiero, eventos extraordinarios como la pandemia COVID-19 y la tormenta tropical Yaku afectaron la recaudación de la Tarifa de Agua. Frente al cambio climático y nuevas disposiciones legales, la institución prioriza la gestión del talento humano multigeneracional, la modernización tecnológica y la optimización de la infraestructura institucional y flota vehicular.",
        diagnosticoExterno: "Las perspectivas económicas de Perú (2024-2028) proyectan un crecimiento sostenido del Producto Interno Bruto (PIB) con estabilidad inflacionaria. El fortalecimiento del empleo y las oportunidades de inversión en sectores estratégicos como la agricultura, minería y tecnología ofrecen un marco propicio para el desarrollo productivo y la sostenibilidad del riego en la región Lambayeque."
    },
    noticias: [
        {
            id: "n1",
            title: "Reunión de Coordinación con Presidentes de las 16 Comisiones de Usuarios",
            category: "Institucional",
            date: "28/07/2026",
            summary: "Se abordaron los planes de distribución hídrica para el periodo de estiaje y el avance en el mantenimiento de canales de riego principales.",
            imageUrl: "assets/img/canales.jpg"
        },
        {
            id: "n2",
            title: "Capacitación en Manejo Eficiente del Agua de Riego y Tecnologías Agrícolas",
            category: "Capacitaciones",
            date: "15/07/2026",
            summary: "Taller dirigido a pequeños y medianos agricultores del valle Chancay Lambayeque con la participación de especialistas técnicos.",
            imageUrl: "assets/img/fondo/TINAJONES-1024x768.jpg"
        }
    ]
};
