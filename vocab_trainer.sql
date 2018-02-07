-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2018 at 09:11 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 7.2.1

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
-- Table structure for table `animals`
--

CREATE TABLE `animals` (
  `id` int(11) NOT NULL,
  `wordInEnglish` varchar(255) NOT NULL,
  `wordInGerman` varchar(255) NOT NULL,
  `gener` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `animals`
--

INSERT INTO `animals` (`id`, `wordInEnglish`, `wordInGerman`, `gener`) VALUES
(1, 'Dog', 'Hund', 'Der'),
(2, 'Cat', 'Katze', 'Die'),
(3, 'Mouse', 'Maus', 'Die'),
(4, 'Bear', 'Bar', 'Der'),
(5, 'Shark', 'Hai', 'Der'),
(6, 'Rabbit', 'Kaninchen', 'Das'),
(7, 'Lion', 'Lowe', 'Der'),
(8, 'Tortoise', 'Schildkrote', 'Die'),
(9, 'Bird', 'Vogel', 'Der'),
(10, 'Snake', 'Schlange', 'Die');

-- --------------------------------------------------------

--
-- Table structure for table `clothes`
--

CREATE TABLE `clothes` (
  `id` int(11) NOT NULL,
  `wordInEnglish` varchar(255) NOT NULL,
  `wordInGerman` varchar(255) NOT NULL,
  `gener` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clothes`
--

INSERT INTO `clothes` (`id`, `wordInEnglish`, `wordInGerman`, `gener`) VALUES
(1, 'Dress', 'Kleid', 'Das'),
(2, 'Trousers', 'Hose', 'Die'),
(3, 'Shirt', 'Hemd', 'Das'),
(4, 'Blouse', 'Bluse', 'Die'),
(5, 'Skirt', 'Rock', 'Der');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `wordInEnglish` varchar(255) NOT NULL,
  `wordInGerman` varchar(255) NOT NULL,
  `gener` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `wordInEnglish`, `wordInGerman`, `gener`) VALUES
(1, 'Apple', 'Apfel', 'Der'),
(2, 'Food', 'Essen', 'Das'),
(3, 'Starter', 'Vorspeise', 'Die'),
(4, 'Pineapple', 'Ananas', 'Die'),
(5, 'Pear', 'Birne', 'Die'),
(6, 'Meat', 'Fleisch', 'Das'),
(7, 'Dessert', 'Nachtisch', 'Der'),
(8, 'Meat Balls', 'Boulette', 'Die'),
(9, 'Bread', 'Brot', 'Das');

-- --------------------------------------------------------

--
-- Table structure for table `work _place`
--

CREATE TABLE `work _place` (
  `id` int(11) NOT NULL,
  `wordInEnglish` varchar(255) NOT NULL,
  `wordInGerman` varchar(255) NOT NULL,
  `gener` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clothes`
--
ALTER TABLE `clothes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work _place`
--
ALTER TABLE `work _place`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `clothes`
--
ALTER TABLE `clothes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `work _place`
--
ALTER TABLE `work _place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
