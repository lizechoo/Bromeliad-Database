-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jan 23, 2016 at 02:46 AM
-- Server version: 5.5.42
-- PHP Version: 5.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `bwg`
--

-- --------------------------------------------------------

--
-- Table structure for table `abundances`
--

CREATE TABLE `abundances` (
  `bromeliad_id` int(11) NOT NULL,
  `measurement_id` int(11) NOT NULL,
  `count` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `bromeliads`
--

CREATE TABLE `bromeliads` (
  `bromeliad_id` int(11) NOT NULL,
  `visit_id` int(11) NOT NULL,
  `original_id` varchar(45) DEFAULT NULL,
  `species` varchar(45) NOT NULL DEFAULT 'NA',
  `actual_water` float DEFAULT NULL,
  `max_water` float DEFAULT NULL,
  `longest_leaf` float DEFAULT NULL,
  `num_leaf` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `diameter` float DEFAULT NULL,
  `detritus_dry_mass` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `bromeliads_attr`
--

CREATE TABLE `bromeliads_attr` (
  `bromeliad_id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL,
  `value` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `datasets`
--

CREATE TABLE `datasets` (
  `dataset_id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `year` varchar(45) DEFAULT NULL,
  `group_id` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `dataset_measurements`
--

CREATE TABLE `dataset_measurements` (
  `dataset_id` int(11) NOT NULL,
  `measurement_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `file_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `extension` varchar(10) NOT NULL,
  `size` bigint(20) NOT NULL,
  `unique_name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `measurements`
--

CREATE TABLE `measurements` (
  `measurement_id` int(11) NOT NULL,
  `species_id` int(11) NOT NULL,
  `category_range` enum('category','range') DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  `biomass` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `measurements_attr`
--

CREATE TABLE `measurements_attr` (
  `taxon_attr_id` int(11) NOT NULL,
  `measurement_id` int(11) DEFAULT NULL,
  `trait` varchar(45) DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `species`
--

CREATE TABLE `species` (
  `species_id` int(11) NOT NULL,
  `bwg_name` varchar(45) DEFAULT 'NA',
  `domain` varchar(45) DEFAULT 'NA',
  `kingdom` varchar(45) DEFAULT 'NA',
  `phylum` varchar(45) DEFAULT 'NA',
  `subphylum` varchar(45) DEFAULT 'NA',
  `class` varchar(45) DEFAULT 'NA',
  `subclass` varchar(45) DEFAULT 'NA',
  `ord` varchar(45) DEFAULT 'NA',
  `subord` varchar(45) DEFAULT 'NA',
  `family` varchar(45) DEFAULT 'NA',
  `subfamily` varchar(45) DEFAULT 'NA',
  `tribe` varchar(45) DEFAULT 'NA',
  `genus` varchar(45) DEFAULT 'NA',
  `species` varchar(45) DEFAULT 'NA',
  `subspecies` varchar(45) DEFAULT 'NA',
  `functional_group` varchar(45) DEFAULT 'NA',
  `predation` varchar(45) DEFAULT 'NA',
  `realm` varchar(45) DEFAULT 'NA',
  `micro_macro` varchar(45) DEFAULT 'NA',
  `barcode` varchar(45) DEFAULT 'NA'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `species_names`
--

CREATE TABLE `species_names` (
  `species_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `species_traits`
--

CREATE TABLE `species_traits` (
  `species_id` int(11) NOT NULL,
  `type` varchar(45) NOT NULL,
  `value` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(45) CHARACTER SET utf8 NOT NULL,
  `password` char(64) CHARACTER SET utf8 NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 NOT NULL,
  `email` varchar(45) CHARACTER SET utf8 NOT NULL,
  `role` enum('admin','user') CHARACTER SET utf8 NOT NULL DEFAULT 'user',
  `token` char(64) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `visits`
--

CREATE TABLE `visits` (
  `visit_id` int(11) NOT NULL,
  `dataset_id` int(11) NOT NULL,
  `habitat` varchar(45) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `min_rainfall` float DEFAULT NULL,
  `max_rainfall` float DEFAULT NULL,
  `min_temperature` float DEFAULT NULL,
  `max_temperature` float DEFAULT NULL,
  `min_elevation` float DEFAULT NULL,
  `max_elevation` float DEFAULT NULL,
  `collection_method` varchar(45) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abundances`
--
ALTER TABLE `abundances`
  ADD PRIMARY KEY (`bromeliad_id`,`measurement_id`),
  ADD UNIQUE KEY `bromeliad_id` (`bromeliad_id`,`measurement_id`),
  ADD KEY `measurement_id` (`measurement_id`);

--
-- Indexes for table `bromeliads`
--
ALTER TABLE `bromeliads`
  ADD PRIMARY KEY (`bromeliad_id`),
  ADD UNIQUE KEY `original_id` (`original_id`),
  ADD KEY `visit_id` (`visit_id`);

--
-- Indexes for table `bromeliads_attr`
--
ALTER TABLE `bromeliads_attr`
  ADD UNIQUE KEY `bromeliad_id` (`bromeliad_id`,`type`);

--
-- Indexes for table `datasets`
--
ALTER TABLE `datasets`
  ADD PRIMARY KEY (`dataset_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `dataset_measurements`
--
ALTER TABLE `dataset_measurements`
  ADD UNIQUE KEY `dataset_id_2` (`dataset_id`,`measurement_id`),
  ADD KEY `measurement_id` (`measurement_id`),
  ADD KEY `dataset_id` (`dataset_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`file_id`);

--
-- Indexes for table `measurements`
--
ALTER TABLE `measurements`
  ADD PRIMARY KEY (`measurement_id`),
  ADD KEY `species_id` (`species_id`);

--
-- Indexes for table `measurements_attr`
--
ALTER TABLE `measurements_attr`
  ADD PRIMARY KEY (`taxon_attr_id`);

--
-- Indexes for table `species`
--
ALTER TABLE `species`
  ADD PRIMARY KEY (`species_id`),
  ADD UNIQUE KEY `species_id` (`species_id`),
  ADD UNIQUE KEY `bwg_name` (`bwg_name`);

--
-- Indexes for table `species_names`
--
ALTER TABLE `species_names`
  ADD UNIQUE KEY `species_name_unique` (`species_id`,`name`),
  ADD KEY `species_names_ibfk_1` (`species_id`);

--
-- Indexes for table `species_traits`
--
ALTER TABLE `species_traits`
  ADD UNIQUE KEY `species_id_2` (`species_id`,`type`),
  ADD KEY `species_id` (`species_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`visit_id`),
  ADD UNIQUE KEY `dataset_id_2` (`dataset_id`,`habitat`),
  ADD KEY `dataset_id` (`dataset_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bromeliads`
--
ALTER TABLE `bromeliads`
  MODIFY `bromeliad_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `datasets`
--
ALTER TABLE `datasets`
  MODIFY `dataset_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `measurements`
--
ALTER TABLE `measurements`
  MODIFY `measurement_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `species`
--
ALTER TABLE `species`
  MODIFY `species_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `visits`
--
ALTER TABLE `visits`
  MODIFY `visit_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `abundances`
--
ALTER TABLE `abundances`
  ADD CONSTRAINT `abundances_ibfk_1` FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`measurement_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `abundances_ibfk_2` FOREIGN KEY (`bromeliad_id`) REFERENCES `bromeliads` (`bromeliad_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `bromeliads`
--
ALTER TABLE `bromeliads`
  ADD CONSTRAINT `bromeliads_ibfk_1` FOREIGN KEY (`visit_id`) REFERENCES `visits` (`visit_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dataset_measurements`
--
ALTER TABLE `dataset_measurements`
  ADD CONSTRAINT `dataset_measurements_ibfk_1` FOREIGN KEY (`measurement_id`) REFERENCES `measurements` (`measurement_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `dataset_measurements_ibfk_2` FOREIGN KEY (`dataset_id`) REFERENCES `datasets` (`dataset_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `measurements`
--
ALTER TABLE `measurements`
  ADD CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `species` (`species_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `species_names`
--
ALTER TABLE `species_names`
  ADD CONSTRAINT `species_names_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `species` (`species_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `species_traits`
--
ALTER TABLE `species_traits`
  ADD CONSTRAINT `species_traits_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `species` (`species_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `visits`
--
ALTER TABLE `visits`
  ADD CONSTRAINT `visits_ibfk_1` FOREIGN KEY (`dataset_id`) REFERENCES `datasets` (`dataset_id`) ON DELETE CASCADE ON UPDATE CASCADE;
