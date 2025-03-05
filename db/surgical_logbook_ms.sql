-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 05, 2025 at 03:10 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `surgical_logbook_ms`
--

-- --------------------------------------------------------

--
-- Table structure for table `affiliations`
--

CREATE TABLE `affiliations` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(200) NOT NULL,
  `country` text NOT NULL,
  `address` varchar(255) NOT NULL,
  `institution_type` enum('Hospital','Clinic','Research Center','University','Medical School','Private Practice') NOT NULL DEFAULT 'Hospital'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `affiliations`
--

INSERT INTO `affiliations` (`id`, `name`, `city`, `country`, `address`, `institution_type`) VALUES
(1, 'Cairo General Hospital', 'Cairo', 'Egypt', '123 Nile Street', 'Hospital'),
(2, 'Alexandria Medical Center', 'Alexandria', 'Egypt', '456 Corniche Road', 'Clinic'),
(3, 'Luxor Health Institute', 'Luxor', 'Egypt', '789 Temple Avenue', 'University'),
(4, 'Giza Research Hospital', 'Giza', 'Egypt', '321 Pyramid Street', 'Research Center');

-- --------------------------------------------------------

--
-- Table structure for table `audit_trail`
--

CREATE TABLE `audit_trail` (
  `id` int NOT NULL,
  `userId` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `entityName` varchar(255) NOT NULL,
  `entityId` varchar(255) DEFAULT NULL,
  `oldValue` json DEFAULT NULL,
  `newValue` json DEFAULT NULL,
  `ipAddress` varchar(255) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `audit_trail`
--

INSERT INTO `audit_trail` (`id`, `userId`, `action`, `entityName`, `entityId`, `oldValue`, `newValue`, `ipAddress`, `userAgent`, `timestamp`) VALUES
(1, 'UnKnown', 'INSERT', 'users', NULL, NULL, '{\"email\": \"joe.smith@example.com\", \"phone\": \"+201207643420\", \"lastname\": \"smith\", \"password\": \"[REDACTED]\", \"firstname\": \"joe\"}', '::ffff:172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', '2025-03-05 13:46:42.860663'),
(2, 'UnKnown', 'INSERT', 'users', NULL, NULL, '{\"email\": \"joe.smith@example.com\", \"password\": \"[REDACTED]\", \"last_name\": \"smith\", \"first_name\": \"joe\", \"phone_number\": \"+201207643420\", \"confirm_password\": \"joe.30\"}', '::ffff:172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', '2025-03-05 13:50:42.127431'),
(3, 'UnKnown', 'INSERT', 'users', NULL, NULL, '{\"email\": \"joe.smith@example.com\", \"password\": \"[REDACTED]\", \"last_name\": \"smith\", \"first_name\": \"joe\", \"phone_number\": \"+201206534320\", \"confirm_password\": \"joe.30\"}', '::ffff:172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', '2025-03-05 13:51:34.554816'),
(4, 'UnKnown', 'INSERT', 'users', NULL, NULL, '{\"email\": \"joe.smith@example.com\", \"password\": \"[REDACTED]\", \"last_name\": \"smith\", \"first_name\": \"joe\", \"phone_number\": \"+201206534320\", \"confirm_password\": \"joe.30\"}', '::ffff:172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', '2025-03-05 13:52:37.292273'),
(5, 'UnKnown', 'INSERT', 'users', NULL, NULL, '{\"email\": \"joe.smith@example.com\", \"password\": \"[REDACTED]\", \"last_name\": \"smith\", \"first_name\": \"joe\", \"phone_number\": \"+201206534320\", \"confirm_password\": \"joe.30\"}', '::ffff:172.18.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', '2025-03-05 13:52:45.088736'),
(6, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"HOSPITAL\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:28:36.936845'),
(7, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"HOSPITAL\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:37:15.040914'),
(8, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"HOSPITAL\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:37:22.275903'),
(9, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"HOSPITAL\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:38:24.410509'),
(10, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"HOSPITAL\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:41:35.094254'),
(11, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"Hospital\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:42:37.315128'),
(12, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Cairo\", \"name\": \"Cairo General Hospital\", \"address\": \"123 Nile Street\", \"country\": \"Egypt\", \"institution_type\": \"Hospital\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 14:46:54.570016'),
(13, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Alexandria\", \"name\": \"Alexandria Medical Center\", \"address\": \"456 Corniche Road\", \"country\": \"Egypt\", \"institution_type\": \"CLINIC\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 15:07:46.212496'),
(14, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Alexandria\", \"name\": \"Alexandria Medical Center\", \"address\": \"456 Corniche Road\", \"country\": \"Egypt\", \"institution_type\": \"Clinic\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 15:07:57.032641'),
(15, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Luxor\", \"name\": \"Luxor Health Institute\", \"address\": \"789 Temple Avenue\", \"country\": \"Egypt\", \"institution_type\": \"University\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 15:08:23.410815'),
(16, 'UnKnown', 'INSERT', 'affiliation', NULL, NULL, '{\"city\": \"Giza\", \"name\": \"Giza Research Hospital\", \"address\": \"321 Pyramid Street\", \"country\": \"Egypt\", \"institution_type\": \"Research Center\"}', '::ffff:172.18.0.1', 'PostmanRuntime/7.43.0', '2025-03-05 15:08:59.550974');

-- --------------------------------------------------------

--
-- Table structure for table `authentication_request`
--

CREATE TABLE `authentication_request` (
  `id` int NOT NULL,
  `surgery_id` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `traineeId` varchar(36) DEFAULT NULL,
  `consultantId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department_surgery_types_surgery_type`
--

CREATE TABLE `department_surgery_types_surgery_type` (
  `departmentId` int NOT NULL,
  `surgeryTypeId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int NOT NULL,
  `action` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions_permission`
--

CREATE TABLE `role_permissions_permission` (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery`
--

CREATE TABLE `surgery` (
  `id` int NOT NULL,
  `hospitalId` int DEFAULT NULL,
  `surgeryTypeId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery_equipment`
--

CREATE TABLE `surgery_equipment` (
  `id` int NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `surgeryTypeId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery_equipment_mapping`
--

CREATE TABLE `surgery_equipment_mapping` (
  `id` int NOT NULL,
  `surgeryTypeId` int NOT NULL,
  `equipmentId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery_type`
--

CREATE TABLE `surgery_type` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lock_until` timestamp NULL DEFAULT NULL,
  `otp_secret` varchar(255) DEFAULT NULL,
  `failed_attempts` int NOT NULL DEFAULT '0',
  `token_version` int NOT NULL DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `roleId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `phone_number`, `last_login`, `lock_until`, `otp_secret`, `failed_attempts`, `token_version`, `reset_token`, `reset_token_expires`, `created_at`, `updated_at`, `roleId`, `departmentId`) VALUES
('4f213b66-366f-4152-95dc-9550b1face9a', 'joe', 'smith', 'joe.smith@example.com', '$2b$10$B6hUetXsHEhAHOmVd8.waO1nhCUJ5Mj3ehXnQExXLwMTC0VoWafZu', '+201206534320', '2025-03-05 13:52:37', NULL, '$2b$10$.TuKNrJgzsxZrb/j6BFgEuY2GJ247St8W5ImIrsSE0JWoxmGkU5LC', 0, 0, NULL, NULL, '2025-03-05 13:52:37.541694', '2025-03-05 13:52:37.541694', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affiliations`
--
ALTER TABLE `affiliations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `authentication_request`
--
ALTER TABLE `authentication_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_104b860ddfa3897dae377677d7f` (`traineeId`),
  ADD KEY `FK_ac47338bb18af884db46ff2da90` (`consultantId`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department_surgery_types_surgery_type`
--
ALTER TABLE `department_surgery_types_surgery_type`
  ADD PRIMARY KEY (`departmentId`,`surgeryTypeId`),
  ADD KEY `IDX_7a8f914cd051b77a3d8129d664` (`departmentId`),
  ADD KEY `IDX_2c45436f1d77061942eaa60275` (`surgeryTypeId`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_7c14fb5b08e1176c012e2c3f19` (`action`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`);

--
-- Indexes for table `role_permissions_permission`
--
ALTER TABLE `role_permissions_permission`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `IDX_b36cb2e04bc353ca4ede00d87b` (`roleId`),
  ADD KEY `IDX_bfbc9e263d4cea6d7a8c9eb3ad` (`permissionId`);

--
-- Indexes for table `surgery`
--
ALTER TABLE `surgery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_076381f7d6c4bffa1c62306e2a3` (`hospitalId`),
  ADD KEY `FK_b1504b632b7e4c4882d16153228` (`surgeryTypeId`);

--
-- Indexes for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3fd026c9f93d3c24dfc1fc6f5b1` (`surgeryTypeId`);

--
-- Indexes for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_0f0bc8582040a025b34bf1287fe` (`surgeryTypeId`),
  ADD KEY `FK_d4dcac1dc7b9f94883e9fd3f413` (`equipmentId`);

--
-- Indexes for table `surgery_type`
--
ALTER TABLE `surgery_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `IDX_01eea41349b6c9275aec646eee` (`phone_number`),
  ADD KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  ADD KEY `FK_3d6915a33798152a079997cad28` (`departmentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affiliations`
--
ALTER TABLE `affiliations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `audit_trail`
--
ALTER TABLE `audit_trail`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `authentication_request`
--
ALTER TABLE `authentication_request`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery`
--
ALTER TABLE `surgery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery_type`
--
ALTER TABLE `surgery_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authentication_request`
--
ALTER TABLE `authentication_request`
  ADD CONSTRAINT `FK_104b860ddfa3897dae377677d7f` FOREIGN KEY (`traineeId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_ac47338bb18af884db46ff2da90` FOREIGN KEY (`consultantId`) REFERENCES `user` (`id`);

--
-- Constraints for table `department_surgery_types_surgery_type`
--
ALTER TABLE `department_surgery_types_surgery_type`
  ADD CONSTRAINT `FK_2c45436f1d77061942eaa602755` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`),
  ADD CONSTRAINT `FK_7a8f914cd051b77a3d8129d6646` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions_permission`
--
ALTER TABLE `role_permissions_permission`
  ADD CONSTRAINT `FK_b36cb2e04bc353ca4ede00d87b9` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_bfbc9e263d4cea6d7a8c9eb3ad2` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `surgery`
--
ALTER TABLE `surgery`
  ADD CONSTRAINT `FK_076381f7d6c4bffa1c62306e2a3` FOREIGN KEY (`hospitalId`) REFERENCES `affiliations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_b1504b632b7e4c4882d16153228` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`);

--
-- Constraints for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  ADD CONSTRAINT `FK_3fd026c9f93d3c24dfc1fc6f5b1` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`);

--
-- Constraints for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  ADD CONSTRAINT `FK_0f0bc8582040a025b34bf1287fe` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_d4dcac1dc7b9f94883e9fd3f413` FOREIGN KEY (`equipmentId`) REFERENCES `surgery_equipment` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_3d6915a33798152a079997cad28` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
