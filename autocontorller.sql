-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2022-08-12 15:42:50
-- 服务器版本： 5.6.50-log
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `autocontorller`
--

-- --------------------------------------------------------

--
-- 表的结构 `autophone`
--

CREATE TABLE IF NOT EXISTS `autophone` (
  `id` int(11) NOT NULL,
  `phonename` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `phoneip` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phoneaddress` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phonestatus` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `time` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phoneunique` varchar(255) COLLATE utf8_bin NOT NULL,
  `scriptid` varchar(255) COLLATE utf8_bin NOT NULL,
  `isrun` tinyint(45) NOT NULL,
  `phonescript` varchar(45) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `autophone`
--

INSERT INTO `autophone` (`id`, `phonename`, `phoneip`, `phoneaddress`, `phonestatus`, `time`, `phoneunique`, `scriptid`, `isrun`, `phonescript`) VALUES
(1, 'iphone13', '2', '5', '离线', '5', '9', '1', 1, '');

-- --------------------------------------------------------

--
-- 表的结构 `autoscript`
--

CREATE TABLE IF NOT EXISTS `autoscript` (
  `scriptid` int(45) NOT NULL,
  `name` varchar(45) COLLATE utf8_bin NOT NULL,
  `path` varchar(45) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `autoscript`
--

INSERT INTO `autoscript` (`scriptid`, `name`, `path`) VALUES
(1, '抖音', '../script/tolead.js'),
(2, '淘宝', '../script/tabao.js');

-- --------------------------------------------------------

--
-- 表的结构 `loginerror`
--

CREATE TABLE IF NOT EXISTS `loginerror` (
  `id` int(11) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `count` varchar(45) NOT NULL,
  `time` varchar(45) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `loginerror`
--

INSERT INTO `loginerror` (`id`, `ip`, `count`, `time`) VALUES
(1, '127.0.0.1', '3', '2022-7-5 14:1:31');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `IP` varchar(45) NOT NULL,
  `address` varchar(45) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `IP`, `address`) VALUES
(1, 'admin', '123456', '127.0.0.1', '保留地址--');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `autophone`
--
ALTER TABLE `autophone`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `autoscript`
--
ALTER TABLE `autoscript`
  ADD PRIMARY KEY (`scriptid`);

--
-- Indexes for table `loginerror`
--
ALTER TABLE `loginerror`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `autoscript`
--
ALTER TABLE `autoscript`
  MODIFY `scriptid` int(45) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `loginerror`
--
ALTER TABLE `loginerror`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
