-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 10, 2018 at 10:19 PM
-- Server version: 10.1.29-MariaDB
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vocab_trainer`
--

-- --------------------------------------------------------

--
-- Table structure for table `vocab`
--

CREATE TABLE `vocab` (
  `id` int(11) NOT NULL,
  `wordInEnglish` text NOT NULL,
  `wordInGerman` text NOT NULL,
  `gender` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vocab`
--

INSERT INTO `vocab` (`id`, `wordInEnglish`, `wordInGerman`, `gender`) VALUES
(1, 'Keyboard', 'Tastatur', 'Der'),
(2, 'Slide Show', 'Diashow', 'Die'),
(7, 'Monitor', 'Bildschirm', 'Der'),
(8, 'Reception', 'Empfang', 'Der'),
(9, 'Branch /store', 'Filiale', 'Die'),
(10, 'Staff Member (sg/m)', 'Mitarbeiter', 'Der'),
(11, 'Staff Member(sg f)', 'Mitarbeiterin', 'Die'),
(12, 'Telephone System', 'Telefonanlage', 'Die'),
(13, 'Sister Company', 'Tochterunternehmen', 'Das'),
(14, 'Department', 'Abteilung', 'Die'),
(15, 'Purchase', 'Einkauf', 'Der'),
(16, 'Management', 'Geschaeftsleitung', 'Die');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `vocab`
--
ALTER TABLE `vocab`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vocab`
--
ALTER TABLE `vocab`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
