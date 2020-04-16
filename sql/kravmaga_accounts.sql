-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2020 at 08:50 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kravmaga_accounts`
--

-- --------------------------------------------------------

--
-- Table structure for table `antrenamente`
--

CREATE TABLE `antrenamente` (
  `ID_antrenament` int(11) NOT NULL,
  `ID_sala` int(11) NOT NULL,
  `Data_antrenament` date NOT NULL,
  `Instructori` varchar(100) COLLATE utf8mb4_romanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Dumping data for table `antrenamente`
--

INSERT INTO `antrenamente` (`ID_antrenament`, `ID_sala`, `Data_antrenament`, `Instructori`) VALUES
(1, 2, '2020-10-02', 'Vasian'),
(2, 2, '0000-00-00', 'Axioma');

-- --------------------------------------------------------

--
-- Table structure for table `centuri`
--

CREATE TABLE `centuri` (
  `ID_centura` int(11) NOT NULL,
  `Denumire` varchar(20) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Culoare` varchar(50) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Semnificatie` varchar(1000) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Cost` varchar(20) COLLATE utf8mb4_romanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Dumping data for table `centuri`
--

INSERT INTO `centuri` (`ID_centura`, `Denumire`, `Culoare`, `Semnificatie`, `Cost`) VALUES
(3, 'Nivel 8', 'Galbenă', 'Această centură reprezintă culoarea „Soarelui Răsare”, a spiritului deschis spre cunoaștere și fragilitate. Este culoarea focului ce mocnește în trupul luptătorului de Stick Fight, mistuind tot ce-i stă în cale.\r\n', '200 RON'),
(4, 'Nivel 7', 'Portocalie', 'Nivelul portocaliu reprezintă culoarea soarelui de zenit, a spiritului copt, capabil de mai multă înțelegere și acceptare a rigorilor din antrenamente. Ea reprezintă începutul maturizării pe tărâmul „Stick Fight”.\r\n', '250 RON'),
(5, 'Nivel 6', 'Verde', 'Aceasta reprezintă starea spiritului ce începe să dea roade după antrenemente intense. Pe masură ce culoarea centurii se închide, ea devine dovada acumulării psiho-fizice și morale, ce-l va caracteriza pe tot parcursul ascensiunii lui în lumea Artelor Marțiale.', '300 RON'),
(6, 'Nivel 5', 'Verde cu capăt Albastru', 'Aceasta centură reprezintă culoarea vegetației ce rodește în zbuciumul cerului și al oceanului, năpădind trupul practicantului de Stick Fight.', '350 RON'),
(7, 'Nivel 4', 'Albastră', 'Această centură reprezintă trupul călit al practicantului de Stick Fight în zbuciumul necontenit al cerului și al oceanului, ce împletește bunătatea cu voința într-o simbioză aproape perfectă.', '350 RON'),
(8, 'Nivel 3', 'Albastră cu capăt Maro', 'Acestă centură reprezintă spiritul matur al practicantului de Stick Fight și dorința lui necontenită de cunoaștere și autodepășire ce se dezvoltă în zbuciumul cerului și al oceanului, făcându-l de neînvins.', '400 RON'),
(9, 'Nivel 2', 'Maro', 'Centura maro reprezintă culoarea pământului roditor și solid. Ea subliniază spiritul ajuns la maturitate, dorința acerbă de afirmare a practicantului de Stick Fight și depășirea propriilor limite.', '100 EURO'),
(10, 'Nivel 1', 'Maro cu capăt Negru', 'Această centură reprezintă spiritual matur al practicantului de Stick Fight ce și-a depășit propriile limite, prin reunirea experienței cu maturitatea, făcându-l mai puternic și impenetrabil.', '100 EURO'),
(11, '1 DAN', 'Neagră', 'Reprezintă concentrarea tuturor culorilor într-una singură, unde experiența practicantului de Stick Fight atinge cote maxime. Centura neagră reprezintă în același timp puterea de întelegere a valorilor umane și universale.', '450 EURO'),
(12, '2 DAN', 'Neagră', 'Reprezintă concentrarea tuturor culorilor într-una singură, unde experiența practicantului de Stick Fight atinge cote maxime. Centura neagră reprezintă în același timp puterea de întelegere a valorilor umane și universale.', '550 EURO'),
(13, '3 DAN', 'Neagră', 'Reprezintă concentrarea tuturor culorilor într-una singură, unde experiența practicantului de Stick Fight atinge cote maxime. Centura neagră reprezintă în același timp puterea de întelegere a valorilor umane și universale.', '800 EURO'),
(14, '4 DAN', 'Neagră cu capat Roșu / pătrat Negru cu pătrat Roșu', 'Această centură reprezintă focul devastator ce mocnește în sufletul practicantului de Stick Fight. Experiența acumulată și maturitatea lui îl fac să devină extrem de curajos și combativ.', '1000 EURO'),
(15, '5 DAN', 'Neagră cu capat Roșu / pătrat Negru cu pătrat Roșu', 'Această centură reprezintă focul devastator ce mocnește în sufletul practicantului de Stick Fight. Experiența acumulată și maturitatea lui îl fac să devină extrem de curajos și combativ.', '1000 EURO'),
(16, '6 DAN', 'Pătrat Alb și un pătrat Roșu, capetele fiind Albe', 'Aceste centuri reprezintă puritatea spiritului, absența egoismului și aprecierea profundă a valorilor vieții și implicit a Artelor Marțiale. Reprezintă și eliminarea totală a falselor valori și transformarea Stick Fight într-un mod de viață.', ''),
(17, '7 DAN', 'Pătrat Alb și un pătrat Roșu, capetele fiind Albe', 'Aceste centuri reprezintă puritatea spiritului, absența egoismului și aprecierea profundă a valorilor vieții și implicit a Artelor Marțiale. Reprezintă și eliminarea totală a falselor valori și transformarea Stick Fight într-un mod de viață.', ''),
(18, '8 DAN', 'Pătrat Roșu și un pătrat Alb, capetele fiind Roșii', '', ''),
(19, '9 DAN', 'Roșie', 'Centura roșie reprezintă cel mai înalt stadiu de pregatire în Stick Fight. La acest nivel practicantul stăpânește total controlul de sine prin dominarea propriilor impulsuri ale fizicului și moralului. Roșul este simbol al energiei vibrante din sufletul practicantului de Stick Fight, al forței dragostei și pasiunii pentru artele marțiale. Este generator al câmpului vital ce face legatura ființei cu pământul. Cel care are onoarea să poarte această centură înseamnă că a ajuns la maturizare și a înțeles lecțiile vieții.', '');

-- --------------------------------------------------------

--
-- Table structure for table `cotizatii`
--

CREATE TABLE `cotizatii` (
  `ID_cotizatie` int(11) NOT NULL,
  `Cuantum` int(11) NOT NULL,
  `Data_cotizatie` date NOT NULL,
  `ID_user` int(11) NOT NULL,
  `ID_sala` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evenimente`
--

CREATE TABLE `evenimente` (
  `ID_eveniment` int(11) NOT NULL,
  `Nume` varchar(50) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Locatie` varchar(200) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Descriere` varchar(200) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Tip_eveniment` varchar(20) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Data_start_eveniment` date NOT NULL,
  `Data_stop_eveniment` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Dumping data for table `evenimente`
--

INSERT INTO `evenimente` (`ID_eveniment`, `Nume`, `Locatie`, `Descriere`, `Tip_eveniment`, `Data_start_eveniment`, `Data_stop_eveniment`) VALUES
(3, 'Seminar de Krav Maga – Stick Fight şi alte stiluri', 'Sc. Constantin Paunescu nr.10\n', '', 'Seminar', '2016-05-28', '2016-05-29'),
(4, 'Seminar de Krav Maga – Stick Fight şi alte stiluri', 'Sc. Constantin Paunescu nr.10\r\n', '', 'Seminar', '2016-05-28', '2016-05-29'),
(5, 'Examen Centură Nov.2016', 'Sc. Constantin Paunescu nr.10\r\n', '', 'Examen Centură', '2016-11-23', '2016-11-23'),
(6, 'Cupa Hanshi', 'Club Extreme', '', 'Concurs', '2016-12-17', '2016-12-17'),
(7, 'Seminar semi-militarizat', 'Gura Diham', '', 'Cantonament', '2017-02-03', '2017-02-06'),
(8, 'Seminar seniori – Lupta de strada', 'Sc. Constantin Paunescu nr.10', '', 'Seminar', '2017-02-10', '2017-02-11'),
(9, 'Examen Centură Mar.2017', 'Sc. Constantin Paunescu nr.10', '', 'Examen Centură', '2017-03-29', '2017-03-29'),
(10, 'Seminar dedicat armelor', 'Valcea - Brezoi', '', 'Cantonament', '2017-04-28', '2017-05-01'),
(11, 'Seminar Tehnici de apărare contra cuțitului ', 'Sc. Constantin Paunescu nr.10', '', 'Seminar', '2017-07-15', '2017-07-16'),
(12, 'Seminar Krav Maga Stick Fight - Costinești', 'Costinesti', '', 'Cantonament', '2017-08-04', '2017-08-08'),
(13, 'Examen Centură Nov.2017', 'Sc. Constantin Paunescu nr.10', '', 'Examen Centură', '2017-11-18', '2017-11-18'),
(14, 'Cupa Hanshi Stick Fight 2017', 'Club Extreme', '', 'Concurs', '2017-12-17', '2017-12-17'),
(15, 'Seminar de Kick Boxing Full Contact', 'Sc. Constantin Paunescu nr.10', '', 'Seminar', '2018-02-17', '2018-02-17'),
(16, 'Seminar De Krav Maga Stick Fight', 'Sc. Constantin Paunescu nr.10', '', 'Seminar', '2018-03-17', '2018-03-17'),
(17, 'Examen Centură Mar.2018', 'Sc. Constantin Paunescu nr.10', '', 'Examen Centură', '2018-03-17', '2018-03-17'),
(18, 'Seminar De Krav Maga Stick Fight', 'Gura Diham', '', 'Cantonament', '2018-07-19', '2018-07-22'),
(19, 'Seminarul Recapitulativ de Stick Fight', 'Sc. Constantin Paunescu nr.10', '', 'Seminar', '2018-10-21', '2018-10-21'),
(20, 'Examen Centură Nov.2018', 'Sc. Constantin Paunescu nr.10', '', 'Examen Centură', '2018-11-18', '2018-11-18'),
(21, 'Cupa Hanshi', 'Club Extreme', '', 'Concurs', '2018-12-15', '2018-12-15');

-- --------------------------------------------------------

--
-- Table structure for table `parole_resetare`
--

CREATE TABLE `parole_resetare` (
  `Id` int(11) NOT NULL,
  `hash_requester` varchar(255) NOT NULL,
  `URL` varchar(255) NOT NULL,
  `Data_Expirare` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sali`
--

CREATE TABLE `sali` (
  `ID_sala` int(11) NOT NULL,
  `Nume` varchar(50) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Adresa` varchar(200) COLLATE utf8mb4_romanian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Dumping data for table `sali`
--

INSERT INTO `sali` (`ID_sala`, `Nume`, `Adresa`) VALUES
(1, 'Ioana', 'str. mea'),
(2, 'Johanna', 'str. ta');

-- --------------------------------------------------------

--
-- Table structure for table `utilizatori`
--

CREATE TABLE `utilizatori` (
  `ID_utilizator` int(11) NOT NULL,
  `Nume` varchar(50) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Prenume` varchar(50) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Utilizator` varchar(20) COLLATE utf8mb4_romanian_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Parola` varchar(400) COLLATE utf8mb4_romanian_ci NOT NULL,
  `Tip_utilizator` int(11) NOT NULL DEFAULT 1,
  `Data_inrolare` date NOT NULL,
  `ID_Sala` int(11) NOT NULL,
  `ID_Centura` int(11) NOT NULL,
  `hash` varchar(256) COLLATE utf8mb4_romanian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Dumping data for table `utilizatori`
--

INSERT INTO `utilizatori` (`ID_utilizator`, `Nume`, `Prenume`, `Utilizator`, `email`, `Parola`, `Tip_utilizator`, `Data_inrolare`, `ID_Sala`, `ID_Centura`, `hash`) VALUES
(1, 'andi', 'andi', 'andi2', 'heroidorin@mta.ro', 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b', 0, '2019-11-30', 1, 4, '4a60ee46955d91db1541bd39ef2820d1a0caeef5a4fcc5e91814944e1e1daaaa'),
(5, 'Andrei', 'Markov', 'amkv', 'heroidorin@gmail.com', 'a80b568a237f50391d2f1f97beaf99564e33d2e1c8a2e5cac21ceda701570312', 1, '2020-04-03', 0, 0, '0264f9833c5db2414e1461b4a68ce7921bf7dd2a0ffdca137dbcd3367e9764e8');

-- --------------------------------------------------------

--
-- Table structure for table `utilizatori_antrenamente`
--

CREATE TABLE `utilizatori_antrenamente` (
  `ID_utilizator_antrenament` int(11) NOT NULL,
  `ID_user` int(11) NOT NULL,
  `ID_antr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Dumping data for table `utilizatori_antrenamente`
--

INSERT INTO `utilizatori_antrenamente` (`ID_utilizator_antrenament`, `ID_user`, `ID_antr`) VALUES
(3, 1, 1),
(4, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `utilizatori_centuri`
--

CREATE TABLE `utilizatori_centuri` (
  `ID_utilizator_centura` int(11) NOT NULL,
  `ID_user` int(11) NOT NULL,
  `ID_centura` int(11) NOT NULL,
  `Data_obtinere` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilizatori_evenimente`
--

CREATE TABLE `utilizatori_evenimente` (
  `ID_utilizator_eveniment` int(11) NOT NULL,
  `ID_user` int(11) NOT NULL,
  `ID_event` int(11) NOT NULL,
  `Provomat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_romanian_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `antrenamente`
--
ALTER TABLE `antrenamente`
  ADD PRIMARY KEY (`ID_antrenament`),
  ADD KEY `ID_sala` (`ID_sala`) USING BTREE;

--
-- Indexes for table `centuri`
--
ALTER TABLE `centuri`
  ADD PRIMARY KEY (`ID_centura`);

--
-- Indexes for table `cotizatii`
--
ALTER TABLE `cotizatii`
  ADD PRIMARY KEY (`ID_cotizatie`),
  ADD UNIQUE KEY `ID_sala` (`ID_sala`),
  ADD UNIQUE KEY `ID_user` (`ID_user`);

--
-- Indexes for table `evenimente`
--
ALTER TABLE `evenimente`
  ADD PRIMARY KEY (`ID_eveniment`);

--
-- Indexes for table `parole_resetare`
--
ALTER TABLE `parole_resetare`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `URL` (`URL`);

--
-- Indexes for table `sali`
--
ALTER TABLE `sali`
  ADD PRIMARY KEY (`ID_sala`);

--
-- Indexes for table `utilizatori`
--
ALTER TABLE `utilizatori`
  ADD PRIMARY KEY (`ID_utilizator`);

--
-- Indexes for table `utilizatori_antrenamente`
--
ALTER TABLE `utilizatori_antrenamente`
  ADD PRIMARY KEY (`ID_utilizator_antrenament`),
  ADD KEY `ID_user` (`ID_user`) USING BTREE,
  ADD KEY `ID_antr` (`ID_antr`) USING BTREE;

--
-- Indexes for table `utilizatori_centuri`
--
ALTER TABLE `utilizatori_centuri`
  ADD PRIMARY KEY (`ID_utilizator_centura`),
  ADD UNIQUE KEY `ID_user` (`ID_user`),
  ADD UNIQUE KEY `ID_centura` (`ID_centura`);

--
-- Indexes for table `utilizatori_evenimente`
--
ALTER TABLE `utilizatori_evenimente`
  ADD PRIMARY KEY (`ID_utilizator_eveniment`),
  ADD UNIQUE KEY `ID_user` (`ID_user`),
  ADD UNIQUE KEY `ID_event` (`ID_event`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `antrenamente`
--
ALTER TABLE `antrenamente`
  MODIFY `ID_antrenament` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `centuri`
--
ALTER TABLE `centuri`
  MODIFY `ID_centura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `cotizatii`
--
ALTER TABLE `cotizatii`
  MODIFY `ID_cotizatie` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evenimente`
--
ALTER TABLE `evenimente`
  MODIFY `ID_eveniment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `parole_resetare`
--
ALTER TABLE `parole_resetare`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `sali`
--
ALTER TABLE `sali`
  MODIFY `ID_sala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `utilizatori`
--
ALTER TABLE `utilizatori`
  MODIFY `ID_utilizator` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `utilizatori_antrenamente`
--
ALTER TABLE `utilizatori_antrenamente`
  MODIFY `ID_utilizator_antrenament` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `utilizatori_centuri`
--
ALTER TABLE `utilizatori_centuri`
  MODIFY `ID_utilizator_centura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `utilizatori_evenimente`
--
ALTER TABLE `utilizatori_evenimente`
  MODIFY `ID_utilizator_eveniment` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `antrenamente`
--
ALTER TABLE `antrenamente`
  ADD CONSTRAINT `antrenamente_ibfk_1` FOREIGN KEY (`ID_sala`) REFERENCES `sali` (`ID_sala`);

--
-- Constraints for table `cotizatii`
--
ALTER TABLE `cotizatii`
  ADD CONSTRAINT `cotizatii_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `utilizatori` (`ID_utilizator`),
  ADD CONSTRAINT `cotizatii_ibfk_2` FOREIGN KEY (`ID_sala`) REFERENCES `sali` (`ID_sala`);

--
-- Constraints for table `utilizatori_antrenamente`
--
ALTER TABLE `utilizatori_antrenamente`
  ADD CONSTRAINT `utilizatori_antrenamente_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `utilizatori` (`ID_utilizator`);

--
-- Constraints for table `utilizatori_centuri`
--
ALTER TABLE `utilizatori_centuri`
  ADD CONSTRAINT `utilizatori_centuri_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `utilizatori` (`ID_utilizator`),
  ADD CONSTRAINT `utilizatori_centuri_ibfk_2` FOREIGN KEY (`ID_centura`) REFERENCES `centuri` (`ID_centura`);

--
-- Constraints for table `utilizatori_evenimente`
--
ALTER TABLE `utilizatori_evenimente`
  ADD CONSTRAINT `utilizatori_evenimente_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `utilizatori` (`ID_utilizator`),
  ADD CONSTRAINT `utilizatori_evenimente_ibfk_2` FOREIGN KEY (`ID_event`) REFERENCES `evenimente` (`ID_eveniment`);

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `password_expiration` ON SCHEDULE EVERY 10 SECOND STARTS '2020-04-10 13:39:40' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM parole_resetare WHERE Id IN (
    SELECT Id FROM (
        SELECT * FROM `parole_resetare` GROUP BY Id HAVING(DAta_Expirare < CURRENT_TIMESTAMP)
    ) AS P
)$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
