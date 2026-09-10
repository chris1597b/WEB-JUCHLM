-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-09-2026 a las 22:13:41
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `if0_42578551_jushmchl_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas`
--

CREATE TABLE `areas` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT 'primary',
  `isMaterial` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `areas`
--

INSERT INTO `areas` (`id`, `title`, `description`, `icon`, `color`, `isMaterial`) VALUES
('administracion', 'Direccion de Administración y Finanzas', 'Se encarga de gestionar los recursos financieros, materiales y humanos de la organización, asegurando el uso eficiente y transparente de los mismos.', 'bi-coin', '#0d6efd', 0),
('area-1.78709266483E+12', 'Direccion de Desarrollo y control de Gestion', 'Planifica, coordina y supervisa los recursos y las actividades para asegurar que cumpla sus metas estratégicas de forma eficiente.', 'bi-gear', '#0d6efd', 0),
('legal', 'Direccion de Asesoria Legal', 'se encarga de brindar apoyo jurídico a la organización, asegurando que las actividades y decisiones se realicen conforme al marco normativo vigente.', 'bi-gear', '#ffc107', 0),
('mantenimiento', 'Direccion de Mantenimiento de Infraestructura Hidraulica', 'Se dedica principalmente a conservar y rehabilitar la infraestructura hidráulica menor de la Junta de Usuarios Chancay Lambayeque.', 'bi-gear', '#20c997', 1),
('operacion', 'Direccion de Operacion de la Infraestructura Hidraulica', 'Control y distribución precisa del agua según la demanda agrícola.', 'bi-gear', '#0d6efd', 0),
('proyectos', 'Direccion de Desarrollo de Infraestructura Hidraulica', 'Se encarga de planificar, elaborar y supervisar los expedientes técnicos relacionados con el mantenimiento de la infraestructura hidráulica menor.', 'bi-gear', '#20c997', 0),
('tarifare', 'Direccion de la administracion y Tarifa de agua', 'Se encarga de administrar y supervisar el cobro de las tarifas que los usuarios deben pagar por el uso del recurso hídrico.', 'bi-gear', '#ffc107', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `avisos`
--

CREATE TABLE `avisos` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `avisos`
--

INSERT INTO `avisos` (`id`, `title`, `description`, `imageUrl`, `active`, `created_at`) VALUES
('a1', 'Bienvenido a Nuestro sitio Web', 'Mantente informado sobre las actividades de la Junta de Usuarios.', 'assets/uploads/img_6a71074dd73573.04683567.jpg', 1, '2026-07-31 21:29:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comisiones`
--

CREATE TABLE `comisiones` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `presidente` varchar(255) DEFAULT '',
  `direccion` varchar(255) DEFAULT '',
  `usuarios` varchar(100) DEFAULT '',
  `area` varchar(100) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comisiones`
--

INSERT INTO `comisiones` (`id`, `name`, `logo`, `cover`, `description`, `presidente`, `direccion`, `usuarios`, `area`) VALUES
('capote', 'Capote', 'assets/img/comisiones/Logos/capote.jpg', 'assets/img/comisiones/portadas/capote.jpg', '', 'GREGORIO GERONIMO QUIROZ NÚÑEZ', 'Calle San Martín S/N, Centro Poblado Capote, distrito de Picsi, Chiclayo', '+ 694', '+ 3819.2687 ha'),
('chiclayo', 'Chiclayo', 'assets/img/comisiones/Logos/chiclayo.jpg', 'assets/img/comisiones/portadas/chiclayo.jpeg', '', 'FELIX FALEN SAMPEN', 'Calle Cajamarca N.° 410, Chiclayo', '+ 694', '+ 6596.4484 ha'),
('chongoyape', 'Chongoyape', 'assets/img/comisiones/Logos/chongoyape.jpg', 'assets/img/comisiones/portadas/chongoyape.jpg', '', 'JOSE NELSIDO ESPINOZA CHAVEZ', 'Calle Schut y Saco N.° 02, esquina Simón Bolívar, Chongoyape, Lambayeque', '+ 1205', '+ 5739.0627 ha'),
('eten', 'Eten', 'assets/img/comisiones/Logos/eten.jpg', 'assets/img/comisiones/portadas/eten.jpeg', '', 'FRANCISCO JAVIER ÑIQUEN MILLONES', 'Pedro Ruiz Nro. 648 Ciudad Eten', '+ 518', '+ 625.3509 ha'),
('ferreñafe', 'Ferreñafe', 'assets/img/comisiones/Logos/ferreñafe.jpg', 'assets/img/comisiones/portadas/ferreñafe.jpeg', '', 'ROGELIO PRIMO RAMOS', 'Av. Andrés A. Cáceres N.° 610, Urb. Ramiro Prialé, Ferreñafe', '+ 4339', '+ 14784.6498 ha'),
('lambayeque', 'Lambayeque', 'assets/img/comisiones/Logos/lambayeque.jpg', 'assets/img/comisiones/portadas/lambayeque.jpeg', '', 'MERCEDES SANTAMARIA SUCLUPE', 'Calle Huáscar N.° 720, Lambayeque', '+ 2259', '+ 7284.3419 ha'),
('laramada', 'La Ramada - Carniche', 'assets/img/comisiones/Logos/la ramada.jpg', 'assets/img/comisiones/portadas/la ramada.jpeg', '', 'DARIO SANCHEZ ZELADA', 'C.P. La Ramada Baja S/N, distrito de Llama, provincia de Chota, Cajamarca (referencia: a unos 20 minutos de Chongoyape)', '+ 493', '+ 1058.566 ha'),
('mochumi', 'Mochumí', 'assets/img/comisiones/Logos/mochumi.jpeg', 'assets/img/comisiones/portadas/mochumi.jpeg', '', 'EXEQUIEL CHAPOÑAN VIDAURRE', 'Calle Federico Villarreal N.° 098, Mochumí (Universidad Perú)', '+ 2367', '+ 4454.4083 ha'),
('monsefu', 'Monsefú', 'assets/img/comisiones/Logos/monsefu.jpg', 'assets/img/comisiones/portadas/monsefu.jpeg', '', 'JAIME ELIAS SALAZAR', 'Calle Simón Bolívar N.° 312, Monsefú', '+ 3754', '+ 7087.2347 ha'),
('morrope', 'Mórrope', 'assets/img/comisiones/Logos/morrope.jpg', 'assets/img/comisiones/portadas/morrope.jpg', '', 'VICTORIO ACTOSTA TEJADA', 'Av. Los Incas N.° 390, distrito de Mórrope', '+ 6267', '+ 12839.8507 ha'),
('muyfinca', 'Muy Finca', 'assets/img/comisiones/Logos/muy finca.jpg', 'assets/img/comisiones/portadas/muy finca.jpeg', '', 'JOSE JUSTINIANO FIGUEROA ROQUE', 'Calle 28 de Julio N.° 858, Mochumí', '+ 4321', '+ 11149.194 ha'),
('pampagrande', 'Pampagrande', 'assets/img/comisiones/Logos/pampagrande.jpg', 'assets/img/comisiones/portadas/pampagrande.jpeg', '', 'PABLO COBEÑAS SANCHEZ', 'Mz. 31, C.P. Collique Alto (3 Compuertas Collique Alto), Pucalá, Chiclayo', '+ 773', '+ 3763.0337 ha'),
('pitipo', 'Pítipo', 'assets/img/comisiones/Logos/pitipo.jpeg', 'assets/img/comisiones/portadas/pitipo.jpeg', '', 'JOSÉ DE LA CRUZ CARRANZA OLIVERA', 'Calle Augusta López Arenas N.° 106, Pítipo, Ferreñafe', '+ 839', '+ 3517.3952 ha'),
('reque', 'Reque', 'assets/img/comisiones/Logos/reque.jpg', 'assets/img/comisiones/portadas/reque.jpeg', '', 'JOSE DEL CARMEN LIZA MAZA', 'Calle Real Nro. 452', '+ 829', '+ 2031.6876 ha'),
('sasape', 'Sasape', 'assets/img/comisiones/Logos/sasape.jpeg', 'assets/img/comisiones/portadas/sasape.jpeg', '', 'NICOLAS BALDERA ROJAS', 'Car. Panamericana Norte Nro. 803 Cas. Sasape', '+ 3318', '+ 4154.5784 ha'),
('tucume', 'Túcume', 'assets/img/comisiones/Logos/tucume.jpeg', 'assets/img/comisiones/portadas/tucume.jpeg', 'Comisión de regantes de Túcume.', 'MARCIAL BANCES SANDOVAL', 'Cal. Miguel Grau Nro. 0852 P.J. Federico Villareal', '+ 1228', '+ 1698.7261 ha');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `convocatorias`
--

CREATE TABLE `convocatorias` (
  `id` varchar(50) NOT NULL,
  `title` text NOT NULL,
  `fileUrl` varchar(255) NOT NULL,
  `status` varchar(50) DEFAULT 'vigente',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `convocatorias`
--

INSERT INTO `convocatorias` (`id`, `title`, `fileUrl`, `status`, `created_at`) VALUES
('c1', 'Bases integradas de licitación pública para la contratación de bienes \"Adquisición de un volquete\".', 'assets/archivos/convocatoria/BASES INTEGRADAS DE LICITACIÓN PUBLICA PARA LA CONTRATACIÓN.pdf', 'concluido', '2026-07-31 21:29:23'),
('c2', 'Bases – Licitación Pública N.° 02-2025-JUSHMCHL – \"Adquisición de un Volquete\".', 'assets/archivos/convocatoria/BASES DE LICITACIÓN PUBLICA CONTRATACIÓN VOLQUETE.pdf', 'concluido', '2026-07-31 21:29:23'),
('c3', 'Bases del proceso de selección para la contratación de un (01) especialista en estudios, inspección y supervisión en la Dirección de Desarrollo de la Infraestructura Hidráulica.', '#', 'concluido', '2026-07-31 21:29:23'),
('c4', 'Bases del proceso de selección especialista en estudios.', 'assets/archivos/convocatoria/BASES ESPECIALISTA EN ESTUDIOS FINAL0001.pdf', 'concluido', '2026-07-31 21:29:23'),
('c5', 'Bases del proceso de selección para la contratación de un (01) contador general.', '#', 'concluido', '2026-07-31 21:29:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico`
--

CREATE TABLE `diagnostico` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `intro` text DEFAULT NULL,
  `funciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `coreBusiness` text DEFAULT NULL,
  `diagnosticoInterno` text DEFAULT NULL,
  `diagnosticoExterno` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnostico`
--

INSERT INTO `diagnostico` (`id`, `title`, `subtitle`, `intro`, `funciones`, `coreBusiness`, `diagnosticoInterno`, `diagnosticoExterno`) VALUES
(1, 'DIAGNÓSTICO DE LA JUSHMCHL', 'Análisis integral del modelo de negocio, core business y diagnóstico interno y externo institucional.', 'La Junta de Usuarios Chancay Lambayeque, en calidad de operador de la infraestructura hidráulica del Sector Hidráulico Menor Chancay Lambayeque tiene como funciones principales operar y mantener la infraestructura hidráulica a su cargo, promoviendo su desarrollo, así como cobrar las tarifas de agua y administrar estos recursos públicos.', '[\"Operar y mantener la infraestructura hidráulica a su cargo, promoviendo su desarrollo.\",\"Distribuir el agua en el sector hidráulico Menor de acuerdo a la disponibilidad de los recursos hídricos y los programas aprobados.\",\"Cobrar las tarifas de agua y administrarlas adecuadamente.\",\"Recaudar la retribución económica y transferirla a la Autoridad Nacional del Agua.\",\"Supervisar el cumplimiento de las obligaciones de los usuarios de agua del sector hidráulico.\"]', 'La Operación de la infraestructura Hidráulica: Distribución de Agua', 'La JUSHMCHL actualmente viene pasando por tiempos de cambios en la reestructuración organizacional y el marco normativo regulatorio. En el aspecto financiero, eventos extraordinarios como la pandemia COVID-19 y la tormenta tropical Yaku afectaron la recaudación de la Tarifa de Agua. Frente al cambio climático y nuevas disposiciones legales, la institución prioriza la gestión del talento humano multigeneracional, la modernización tecnológica y la optimización de la infraestructura institucional y flota vehicular.', 'Las perspectivas económicas de Perú (2024-2028) proyectan un crecimiento sostenido del Producto Interno Bruto (PIB) con estabilidad inflacionaria. El fortalecimiento del empleo y las oportunidades de inversión en sectores estratégicos como la agricultura, minería y tecnología ofrecen un marco propicio para el desarrollo productivo y la sostenibilidad del riego en la región Lambayeque.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estructura_organizacional`
--

CREATE TABLE `estructura_organizacional` (
  `id` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `badge` varchar(100) DEFAULT NULL,
  `icon` varchar(100) DEFAULT 'bi-diagram-3',
  `color` varchar(50) DEFAULT '#20c997',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estructura_organizacional`
--

INSERT INTO `estructura_organizacional` (`id`, `code`, `title`, `badge`, `icon`, `color`, `items`) VALUES
('organo-1788883029711', 'b', 'Órganos de Asesoramiento', '', 'bi-award-fill', '#0d6efd', '[{\"code\":\"b.1\",\"title\":\"Direcci\\u00f3n de Asuntos Jur\\u00eddicos y Regulatorios\"}]'),
('organo-1788883120225', 'a', 'Órganos de Apoyo', '', 'bi-award-fill', '#b10dfd', '[{\"code\":\"a.1\",\"title\":\"Direcci\\u00f3n de Administraci\\u00f3n y Finanzas\"},{\"code\":\"a.2\",\"title\":\"Direcci\\u00f3n de Control y Gesti\\u00f3n\"}]'),
('organo-c', 'c', 'Órganos de Línea', 'Línea Operativa', 'bi-gear-wide-connected', '#198754', '[{\"code\":\"c.1\",\"title\":\"Direcci\\u00f3n de Operaci\\u00f3n de la Infraestructura Hidr\\u00e1ulica\"},{\"code\":\"c.2\",\"title\":\"Direcci\\u00f3n de Mantenimiento de la Infraestructura Hidr\\u00e1ulica\"},{\"code\":\"c.3\",\"title\":\"Direcci\\u00f3n de Desarrollo de la Infraestructura Hidr\\u00e1ulica\"},{\"code\":\"c.4\",\"title\":\"Direcci\\u00f3n de Administraci\\u00f3n de la Tarifa del Agua y Retribuci\\u00f3n Econ\\u00f3mica\"}]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `eventDate` date NOT NULL,
  `day` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(100) DEFAULT 'Todo el día',
  `location` varchar(255) DEFAULT 'Sede Principal',
  `category` varchar(100) DEFAULT 'General',
  `color` varchar(50) DEFAULT '#2563eb',
  `badgeClass` varchar(50) DEFAULT 'event-blue',
  `label` varchar(100) DEFAULT 'Evento',
  `desc` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`id`, `title`, `eventDate`, `day`, `month`, `year`, `date`, `time`, `location`, `category`, `color`, `badgeClass`, `label`, `desc`, `created_at`) VALUES
('e-1788303248037', 'Asamblea General Extraordinaria', '2026-09-10', 10, 8, 2026, NULL, '09:00 AM', 'Auditorio Principal JUSHMCHL', 'Asambleas', '#2563eb', 'event-blue', 'Asamblea', 'No se olviden traer un cuarderno de apuntes', '2026-09-01 22:54:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `galeria`
--

CREATE TABLE `galeria` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `galeria`
--

INSERT INTO `galeria` (`id`, `title`, `description`, `imageUrl`, `created_at`) VALUES
('g-1.78578670591E+12', 'INSPECCIÓN DE CAMPO: PROYECTO DRENAJE PLUVIAL DE CHICLAYO', 'Inspección de drenes con representantes de la ANIN , para garantizar la adecuada integración del proyecto de drenaje pluvial con la infraestructura de riego existente', 'assets/uploads/img_6a70f10b1a1176.87720941.jpg', '2026-08-03 19:51:46'),
('g-1788368643742', 'LA PREVENCIÓN ES TAREA DE TODOS', 'Personal técnico y administrativo participó del II Simulacro Nacional Multi peligro 2026, demostrando compromiso y responsabilidad en la adopción de medidas preventivas , ante posibles emergencias', 'assets/uploads/img_6a985702430066.60482227.jpeg', '2026-09-02 17:04:03'),
('g-1788368824943', 'MANTENIMIENTO DE  CANALES', 'Personal de la Junta de Usuarios Chancay Lambayeque, realiza labores de mantenimiento en el canal Majín y Paredones, asegurando el buen funcionamiento de la infraestructura hidráulica y garantizando la distribución eficiente del recurso hídrico para los agricultores de la zona.', 'assets/uploads/img_6a9857b78294f8.44499547.jpg', '2026-09-02 17:07:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `normativas`
--

CREATE TABLE `normativas` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `documentUrl` varchar(512) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `normativas`
--

INSERT INTO `normativas` (`id`, `title`, `description`, `created_at`, `documentUrl`) VALUES
('n-1.78579117319E+12', 'Ley N.° 29338, Ley de Recursos Hídricos', 'Establece el marco legal para la gestión integrada, sostenible y participativa del agua, reconociéndola como un recurso de valor social, económico y ambiental.', '2026-08-03 21:06:12', 'https://www.minam.gob.pe/wp-content/uploads/2017/04/Ley-N%C2%B0-29338.pdf'),
('n-1.78579140127E+12', 'Ley N ° 31801', 'Ley que regula las organizaciones de usuarios de agua para el fortalecimiento de su participación en la gestión multisectorial de los recursos hídricos.', '2026-08-03 21:10:00', 'assets/uploads/img_6a96f56a674912.72047742.pdf'),
('n-1.78579143332E+12', 'Decreto Supremo N.° 001-2010-AG, Reglamento de la Ley N.° 29338, Ley de Recursos Hídricos.', 'El Decreto Supremo N.° 001-2010-AG aprueba el Reglamento de la Ley N.° 29338, Ley de Recursos Hídricos, estableciendo las normas específicas para la gestión integrada del agua en el Perú. Consta de 12 títulos, 287 artículos, 9 disposiciones complementarias finales y 10 transitorias, y es de aplicación a todas las entidades públicas y privadas que intervienen en la administración de recursos hídricos continentales.', '2026-08-03 21:10:32', 'assets/uploads/img_6a96fbbb8332e1.52091053.pdf'),
('n-1.78827881377E+12', 'Resolucion Jefatural N° 155-2022-ANA', 'Que aprueba el reglamento de Operadores de Infraestructura Hidraulica', '2026-09-01 16:06:53', 'assets/uploads/img_6a96f7eca52646.73720442.pdf'),
('n-1788883679457', 'Decreto Supremo N° 07-2024-MIDAGRI, Reglamento de la Ley N° 31801', 'Regula las organizaciones de usuarios de agua en el Perú. Su objetivo principal es fortalecer la participación de estas organizaciones en la gestión multisectorial y sostenible de los recursos hídricos.', '2026-09-08 16:07:59', ''),
('n-1788883729621', 'Estatuto de la Junta de Usuarios Chancay Lambayeque', 'El Estatuto de la Junta de Usuarios Chancay Lambayeque es el documento normativo que regula la organización interna, funciones y responsabilidades de esta institución.', '2026-09-08 16:08:49', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'Institucional',
  `date` varchar(50) DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `title`, `category`, `date`, `summary`, `imageUrl`, `created_at`) VALUES
('n1', 'Reunión de Coordinación con Presidentes de las 16 Comisiones de Usuarios', 'Institucional', '28/07/2026', 'Se abordaron los planes de distribución hídrica para el periodo de estiaje y el avance en el mantenimiento de canales de riego principales.', 'assets/img/canales.jpg', '2026-07-31 21:29:24'),
('n2', 'Capacitación en Manejo Eficiente del Agua de Riego y Tecnologías Agrícolas', 'Capacitaciones', '15/07/2026', 'Taller dirigido a pequeños y medianos agricultores del valle Chancay Lambayeque con la participación de especialistas técnicos.', 'assets/img/fondo/TINAJONES-1024x768.jpg', '2026-07-31 21:29:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `site_config`
--

CREATE TABLE `site_config` (
  `id` int(11) NOT NULL,
  `adminPasswordHash` varchar(255) NOT NULL,
  `pageTitle` varchar(255) DEFAULT 'Junta de Usuarios Chancay Lambayeque',
  `pageSubtitle` varchar(255) DEFAULT 'JUSHMCHL Clase A',
  `heroTitle` text DEFAULT NULL,
  `heroText` text DEFAULT NULL,
  `heroBg` varchar(255) DEFAULT 'assets/img/fondo/TINAJONES-1024x768.jpg',
  `contactEmail` varchar(255) DEFAULT 'contacto@jushmchl.org.pe',
  `contactPhone` varchar(50) DEFAULT '+51 74 233366',
  `contactAddress` varchar(255) DEFAULT 'Av. Salaverry 123, Chiclayo, Perú',
  `mision` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `historia` text DEFAULT NULL,
  `modalAvisosActive` tinyint(1) DEFAULT 1,
  `fireworksActive` tinyint(1) DEFAULT 1,
  `fireworksTheme` varchar(50) DEFAULT 'fiestas_patrias',
  `fireworksTitleText` varchar(255) DEFAULT '¡Fiestas Patrias!',
  `fireworksBtnText` varchar(255) DEFAULT '¡Viva el Perú!',
  `fireworksSubText` varchar(255) DEFAULT 'Celebrando con la Junta de Usuarios',
  `fireworksDuration` int(11) DEFAULT 4000,
  `fireworksSoundEnabled` tinyint(1) DEFAULT 0,
  `fireworksColor1` varchar(20) DEFAULT '#dc2626',
  `fireworksColor2` varchar(20) DEFAULT '#ffffff',
  `fireworksColor3` varchar(20) DEFAULT '#b91c1c',
  `diagnosticoSectionActive` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `site_config`
--

INSERT INTO `site_config` (`id`, `adminPasswordHash`, `pageTitle`, `pageSubtitle`, `heroTitle`, `heroText`, `heroBg`, `contactEmail`, `contactPhone`, `contactAddress`, `mision`, `vision`, `historia`, `modalAvisosActive`, `fireworksActive`, `fireworksTheme`, `fireworksTitleText`, `fireworksBtnText`, `fireworksSubText`, `fireworksDuration`, `fireworksSoundEnabled`, `fireworksColor1`, `fireworksColor2`, `fireworksColor3`, `diagnosticoSectionActive`) VALUES
(1, '$2b$10$3KPpnlmOO08J55z5Kl44/OFrCcA9zKSKyFJwE5/xoX2L6seFCc9BC', 'Junta de Usuarios Chancay Lambayeque', 'JUSHMCHL Clase A', 'Junta de Usuarios del Sector Hidráulico Menor Chancay Lambayeque Clase A', 'Gestionamos de manera sostenible el recurso hídrico para potenciar el desarrollo agropecuario de nuestra región.', 'assets/uploads/img_6a9ee2e8bfb2e9.51673072.png', 'contacto@jushmchl.org.pe', '+51 74 233366', 'Av. Salaverry 123, Chiclayo, Perú', 'Somos una organización que brinda servicios de operación, mantenimiento de la infraestructura hidráulica menor y distribución del recurso hídrico para uso multisectorial, de calidad, desarrollando proyectos y programas de alto impacto, a favor de los usuarios agrarios, para contribuir a su desarrollo productivo.', 'Consolidarnos como una organización moderna y eficiente, referente a nivel internacional, para la mejora de la calidad a favor de los usuarios agrarios, de forma sostenible.', 'La Junta de Usuarios Chancay Lambayeque fue constituida en mérito al Decreto Ley 17752, Ley General de Aguas y reconocida mediante Resolución Ministerial Nº 5257-72-AG, del 13 de Octubre de 1972. La Junta de Usuarios es la Organización representativa de todos los usuarios y usuarias del agua con fines agrarios y otros usos: poblacional, energético, industrial, etc.\n\nLa institución está constituida por dieciséis (16) Comisiones de Usuarios, Catorce (15) en la zona Regulada: Chongoyape, Pampagrande, Ferreñafe, Pítipo, Capote, Lambayeque, Chiclayo, Monsefú, Reque, Eten, Mochumí, Muy Finca, Túcume, Sasape, Mórrope y una (1) en la no regulado que es La Ramada. Nuestra organización representa a 29,146 agricultores, que en conjunto conducen una superficie total de 119,586.6353 hectáreas bajo riego. Los principales cultivos son: Arroz, algodón, caña de azúcar, maíz amarillo duro, pastos, hortalizas, menestras entre otros.\n\nLa Junta de Usuarios, en sus inicios, desarrolló actividades netamente representativas, pero a partir de 1989 se le asignan responsabilidades mayores a través del D.S. 037-89-AG, al transferirle la distribución del agua y Operación y Mantenimiento de los Sistemas de Riego y Drenaje, en el caso del Valle Chancay-Lambayeque estas se hicieron efectivas a fines de 1992. A partir del 01 de Enero del 2005, la Junta de Usuarios desempeña el encargo de Operador de la Infraestructura Hidráulica Menor y tiene por finalidad canalizar en forma ordenada, la participación de los usuarios de agua en la gestión multisectorial y uso sostenible de los recursos hídricos.', 1, 1, 'custom', '¡Colores de JUSHMCHL!', 'JUSHMCHL', 'Celebrando con la Junta de Usuarios', 4000, 0, '#80e109', '#2563eb', '#eab308', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos`
--

CREATE TABLE `videos` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `videoUrl` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'General',
  `tag` varchar(100) DEFAULT 'JUSHMCHL',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `videoUrl`, `category`, `tag`, `created_at`) VALUES
('v1', 'PLANTACIÓN DE ESPECIES FORESTALES DE PINO PATULA EN EL DISTRITO DE CHUGUR', 'RESULTADOS DEL CONVENIO DE LA JUNTA DE USUARIOS CHANCAY LAMBAYEQUE SOBRE “ADQUISICIÓN Y PLANTACIÓN DE ESPECIES FORESTALES DE PINO PATULA EN EL DISTRITO DE CHUGUR, PROVINCIA DE HUALGAYOC, REGIÓN CAJAMARCA – 2026”', 'https://www.youtube.com/embed/qDpgM2Q5_vk', 'Planificación', 'JUSHMCHL', '2026-07-31 21:29:23'),
('v2', '🚜 𝗘𝗡 𝗘𝗟 𝗖𝗔𝗠𝗣𝗢 𝗬 𝗖𝗢𝗡 𝗟𝗔 𝗚𝗘𝗡𝗧𝗘: 𝗘𝗦𝗖𝗨𝗖𝗛𝗔𝗠𝗢𝗦 𝗬 𝗥𝗘𝗦𝗢𝗟𝗩𝗘𝗠𝗢𝗦 𝗟𝗔𝗦 𝗡𝗘𝗖𝗘𝗦𝗜𝗗𝗔𝗗𝗘𝗦 𝗗𝗘 𝗡𝗨𝗘𝗦𝗧𝗥𝗢𝗦 𝗔𝗚𝗥𝗜𝗖𝗨𝗟𝗧𝗢𝗥𝗘𝗦', 'Hoy, nuestro presidente institucional lideró una importante reunión de trabajo con los agricultores del Comité de Usuarios de los sectores Adobe Recta y Adobe Brazo I, con el firme objetivo de escuchar de primera mano sus principales problemáticas y articular acciones inmediatas.', 'https://www.youtube.com/embed/OLfzYKVo4S8', 'Gestión Hídrica', 'Operaciones', '2026-07-31 21:29:23'),
('v3', 'Mantenimiento de Infraestructura', 'Trabajos de limpieza, descolmatación de canales y conservación preventiva de las obras hidráulicas menores del sector.', 'https://www.youtube.com/embed/D8wTu6F2xGM', 'Mantenimiento', 'Obras', '2026-07-31 21:29:23');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas`
--
ALTER TABLE `areas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `avisos`
--
ALTER TABLE `avisos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comisiones`
--
ALTER TABLE `comisiones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `convocatorias`
--
ALTER TABLE `convocatorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estructura_organizacional`
--
ALTER TABLE `estructura_organizacional`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `galeria`
--
ALTER TABLE `galeria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `normativas`
--
ALTER TABLE `normativas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `site_config`
--
ALTER TABLE `site_config`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `site_config`
--
ALTER TABLE `site_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
