-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 18, 2025 at 07:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `city` varchar(200) NOT NULL,
  `country` text NOT NULL,
  `address` varchar(255) NOT NULL,
  `institution_type` enum('Hospital','Clinic','Research Center','University','Medical School','Private Practice') NOT NULL DEFAULT 'Hospital'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `authentication_request`
--

CREATE TABLE `authentication_request` (
  `id` int(11) NOT NULL,
  `surgery_log_id` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `traineeId` varchar(36) DEFAULT NULL,
  `consultantId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` varchar(36) NOT NULL,
  `name` enum('student','resident','consultant','admin','nurse','surgeon','researcher','technician','hospital_admin','fellow','anesthesiologist','medical_student') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery`
--

CREATE TABLE `surgery` (
  `id` int(11) NOT NULL,
  `hospitalId` int(11) DEFAULT NULL,
  `surgeryTypeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery_equipment`
--

CREATE TABLE `surgery_equipment` (
  `id` int(11) NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `surgeryTypeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery_equipment_mapping`
--

CREATE TABLE `surgery_equipment_mapping` (
  `surgeryTypeId` int(11) NOT NULL,
  `equipmentId` int(11) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgery_type`
--

CREATE TABLE `surgery_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `departmentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `otp_secret` varchar(255) DEFAULT NULL,
  `otp_enabled` tinyint(4) NOT NULL DEFAULT 0,
  `failed_attempts` int(11) NOT NULL DEFAULT 0,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp(),
  `roleId` varchar(36) DEFAULT NULL,
  `affiliation_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_permission`
--

CREATE TABLE `user_permission` (
  `id` int(11) NOT NULL,
  `action` enum('create_surgery','edit_surgery','view_surgery_history','invite_participants','approve_participation','assign_roles','manage_hospital_settings','generate_reports','perform_surgery','update_surgery_team','access_patient_records','manage_equipment','approve_surgery') NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `roleId` varchar(36) DEFAULT NULL,
  `assignedById` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affiliations`
--
ALTER TABLE `affiliations`
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
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_c8cc87131f061d3e203a7476b56` (`departmentId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  ADD KEY `FK_6cdcde8609e4b8c0030ce7d72ac` (`affiliation_id`),
  ADD KEY `FK_afd2c87bee70dd5557f48911e66` (`department_id`);

--
-- Indexes for table `user_permission`
--
ALTER TABLE `user_permission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_502b61366d2e0e761851b9a3c9c` (`roleId`),
  ADD KEY `FK_86b3093ff472cbfc606f95a3bbf` (`assignedById`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affiliations`
--
ALTER TABLE `affiliations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `authentication_request`
--
ALTER TABLE `authentication_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery`
--
ALTER TABLE `surgery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `surgery_type`
--
ALTER TABLE `surgery_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_permission`
--
ALTER TABLE `user_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authentication_request`
--
ALTER TABLE `authentication_request`
  ADD CONSTRAINT `FK_104b860ddfa3897dae377677d7f` FOREIGN KEY (`traineeId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ac47338bb18af884db46ff2da90` FOREIGN KEY (`consultantId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `surgery`
--
ALTER TABLE `surgery`
  ADD CONSTRAINT `FK_076381f7d6c4bffa1c62306e2a3` FOREIGN KEY (`hospitalId`) REFERENCES `affiliations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b1504b632b7e4c4882d16153228` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  ADD CONSTRAINT `FK_3fd026c9f93d3c24dfc1fc6f5b1` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  ADD CONSTRAINT `FK_0f0bc8582040a025b34bf1287fe` FOREIGN KEY (`surgeryTypeId`) REFERENCES `surgery_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d4dcac1dc7b9f94883e9fd3f413` FOREIGN KEY (`equipmentId`) REFERENCES `surgery_equipment` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `surgery_type`
--
ALTER TABLE `surgery_type`
  ADD CONSTRAINT `FK_c8cc87131f061d3e203a7476b56` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_6cdcde8609e4b8c0030ce7d72ac` FOREIGN KEY (`affiliation_id`) REFERENCES `affiliations` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_afd2c87bee70dd5557f48911e66` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user_permission`
--
ALTER TABLE `user_permission`
  ADD CONSTRAINT `FK_502b61366d2e0e761851b9a3c9c` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_86b3093ff472cbfc606f95a3bbf` FOREIGN KEY (`assignedById`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
