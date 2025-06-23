SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";



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


-- --------------------------------------------------------

--
-- Table structure for table `authentication_request`
--

CREATE TABLE `authentication_request` (
  `id` int NOT NULL,
  `status` enum('pending','cancelled','approved') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `traineeId` varchar(36) DEFAULT NULL,
  `consultantId` varchar(36) DEFAULT NULL,
  `surgeryId` int DEFAULT NULL,
  `approvedAt` timestamp NULL DEFAULT NULL,
  `rejectionReason` varchar(255) DEFAULT NULL,
  `requestedRoleId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `affiliationId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int NOT NULL,
  `type` enum('invite','auth_request','schedule_update','User Registration','role Update') NOT NULL,
  `message` text NOT NULL,
  `read` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int NOT NULL,
  `action` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `action`) VALUES
(62, 'access admin dashboard'),
(61, 'add surgical role'),
(64, 'approve request'),
(59, 'create equipment'),
(63, 'create request'),
(56, 'create surgery'),
(57, 'delete surgery'),
(60, 'perform surgery'),
(65, 'reject request'),
(58, 'update surgery');

-- --------------------------------------------------------

--
-- Table structure for table `procedure_type`
--

CREATE TABLE `procedure_type` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` enum('supervised','assistance','independent','observation') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `requirement`
--

CREATE TABLE `requirement` (
  `id` int NOT NULL,
  `requiredCount` int NOT NULL,
  `roleId` int DEFAULT NULL,
  `procedureId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `parentId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `parentId`) VALUES
(22, 'Admin', NULL),
(25, 'Consultant', NULL),

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `role_permission`
--

INSERT INTO `role_permission` (`roleId`, `permissionId`) VALUES
(22, 56),
(22, 57),
(22, 58),
(22, 59),
(22, 60),
(22, 61),
(22, 62),
(22, 63),
(22, 64),
(22, 65),
(25, 56),
(25, 57),
(25, 58),
(25, 59),
(25, 60),
(25, 61),
(25, 63),
(25, 64),
(25, 65),

-- --------------------------------------------------------

--
-- Table structure for table `surgery`
--

CREATE TABLE `surgery` (
  `id` int NOT NULL,
  `hospitalId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `departmentId` int DEFAULT NULL,
  `procedureId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `surgery_equipment`
--

CREATE TABLE `surgery_equipment` (
  `id` int NOT NULL,
  `equipment_name` varchar(255) NOT NULL,
  `photo` blob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `surgery_equipment_mapping`
--

CREATE TABLE `surgery_equipment_mapping` (
  `surgeryEquipmentId` int NOT NULL,
  `surgeryId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- --------------------------------------------------------

--
-- Table structure for table `surgical_role`
--

CREATE TABLE `surgical_role` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
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
  `last_login` timestamp NULL DEFAULT NULL,
  `lock_until` timestamp NULL DEFAULT NULL,
  `otp_secret` varchar(255) DEFAULT NULL,
  `failed_attempts` int NOT NULL DEFAULT '0',
  `token_version` int NOT NULL DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `roleId` int DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `affiliationId` int DEFAULT NULL,
  `account_status` enum('pending','active','inactive') NOT NULL DEFAULT 'pending',
  `activation_token` varchar(255) DEFAULT NULL,
  `token_expiry` timestamp NULL DEFAULT NULL,
  `picture` blob,
  `rejectionReason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int NOT NULL,
  `completedCount` int NOT NULL,
  `completedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` varchar(36) DEFAULT NULL,
  `procedureId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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
  ADD KEY `FK_ac47338bb18af884db46ff2da90` (`consultantId`),
  ADD KEY `FK_9c182d6b3ad519d7c85160e136b` (`surgeryId`),
  ADD KEY `FK_b5b98244d701c3aced28e16c22c` (`requestedRoleId`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_4aa8b4838778defb7da325e5bc7` (`affiliationId`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1ced25315eb974b73391fb1c81b` (`userId`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_7c14fb5b08e1176c012e2c3f19` (`action`);

--
-- Indexes for table `procedure_type`
--
ALTER TABLE `procedure_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requirement`
--
ALTER TABLE `requirement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f21ad71586a66e36166b84300fe` (`roleId`),
  ADD KEY `FK_11f68ba49cc8e9ddc72519f9111` (`procedureId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`),
  ADD KEY `FK_e69cd3e2721eaa1e70958498a85` (`parentId`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `IDX_e3130a39c1e4a740d044e68573` (`roleId`),
  ADD KEY `IDX_72e80be86cab0e93e67ed1a7a9` (`permissionId`);

--
-- Indexes for table `surgery`
--
ALTER TABLE `surgery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_076381f7d6c4bffa1c62306e2a3` (`hospitalId`),
  ADD KEY `FK_671038fd9e9d0a396efadf076cc` (`departmentId`),
  ADD KEY `FK_0323ab5d7279b17088875be58d0` (`procedureId`);

--
-- Indexes for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  ADD PRIMARY KEY (`surgeryEquipmentId`,`surgeryId`),
  ADD KEY `IDX_0005f4302c397203be567f12d7` (`surgeryEquipmentId`),
  ADD KEY `IDX_2bc27597a54b26af7598756e36` (`surgeryId`);

--
-- Indexes for table `surgical_role`
--
ALTER TABLE `surgical_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_39cfe9a5352e69dbd5377e1394` (`name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `IDX_01eea41349b6c9275aec646eee` (`phone_number`),
  ADD KEY `FK_3d6915a33798152a079997cad28` (`departmentId`),
  ADD KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  ADD KEY `FK_fc947ec2ebf98bc6d6cdf840585` (`affiliationId`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b5d0e1b57bc6c761fb49e79bf89` (`userId`),
  ADD KEY `FK_4b42805cb90ca63e82961c2df2a` (`procedureId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affiliations`
--
ALTER TABLE `affiliations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `authentication_request`
--
ALTER TABLE `authentication_request`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `procedure_type`
--
ALTER TABLE `procedure_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `requirement`
--
ALTER TABLE `requirement`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `surgery`
--
ALTER TABLE `surgery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `surgery_equipment`
--
ALTER TABLE `surgery_equipment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `surgical_role`
--
ALTER TABLE `surgical_role`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authentication_request`
--
ALTER TABLE `authentication_request`
  ADD CONSTRAINT `FK_104b860ddfa3897dae377677d7f` FOREIGN KEY (`traineeId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_9c182d6b3ad519d7c85160e136b` FOREIGN KEY (`surgeryId`) REFERENCES `surgery` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ac47338bb18af884db46ff2da90` FOREIGN KEY (`consultantId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_b5b98244d701c3aced28e16c22c` FOREIGN KEY (`requestedRoleId`) REFERENCES `surgical_role` (`id`);

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `FK_4aa8b4838778defb7da325e5bc7` FOREIGN KEY (`affiliationId`) REFERENCES `affiliations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FK_1ced25315eb974b73391fb1c81b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `requirement`
--
ALTER TABLE `requirement`
  ADD CONSTRAINT `FK_11f68ba49cc8e9ddc72519f9111` FOREIGN KEY (`procedureId`) REFERENCES `procedure_type` (`id`),
  ADD CONSTRAINT `FK_f21ad71586a66e36166b84300fe` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`);

--
-- Constraints for table `role`
--
ALTER TABLE `role`
  ADD CONSTRAINT `FK_e69cd3e2721eaa1e70958498a85` FOREIGN KEY (`parentId`) REFERENCES `role` (`id`);

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `FK_72e80be86cab0e93e67ed1a7a9a` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`),
  ADD CONSTRAINT `FK_e3130a39c1e4a740d044e685730` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `surgery`
--
ALTER TABLE `surgery`
  ADD CONSTRAINT `FK_0323ab5d7279b17088875be58d0` FOREIGN KEY (`procedureId`) REFERENCES `procedure_type` (`id`),
  ADD CONSTRAINT `FK_076381f7d6c4bffa1c62306e2a3` FOREIGN KEY (`hospitalId`) REFERENCES `affiliations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_671038fd9e9d0a396efadf076cc` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `surgery_equipment_mapping`
--
ALTER TABLE `surgery_equipment_mapping`
  ADD CONSTRAINT `FK_0005f4302c397203be567f12d78` FOREIGN KEY (`surgeryEquipmentId`) REFERENCES `surgery_equipment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_2bc27597a54b26af7598756e367` FOREIGN KEY (`surgeryId`) REFERENCES `surgery` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_3d6915a33798152a079997cad28` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_fc947ec2ebf98bc6d6cdf840585` FOREIGN KEY (`affiliationId`) REFERENCES `affiliations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `FK_4b42805cb90ca63e82961c2df2a` FOREIGN KEY (`procedureId`) REFERENCES `procedure_type` (`id`),
  ADD CONSTRAINT `FK_b5d0e1b57bc6c761fb49e79bf89` FOREIGN KEY (`userId`) REFERENCES `user` (`id`);
COMMIT;