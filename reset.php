<?php
include 'php/mailAgent.php';
resetPassword();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Krav Maga - Autoaparare si autocontrol</title>
    <link rel="shortcut icon" type="image/png" href="img/logo.png"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script type="module" src="js/js-cookie/js.cookie.js"></script>
    <script src="js/windowChanges.js"></script>
    <script type="module" src="js/fieldChecker.js"></script>
    <script type="module" src="js/handler.js"></script>
    <link rel="stylesheet" href="styles/base.css" />
    <link rel="stylesheet" href="styles/extended.css" />
</head>

<header>
    <ul class="navbar sticky">
        <li class="navbar"><a class="navbar" href="index.html">Home</a></li>
        <li class="navbar"><a class="navbar active" href="login.html">Login</a></li>
        <li><a class="navbar" href="index.html">
                <span class="logo_text">Krav</span>
                <img class="logo_img" src="img/logo_kravmaga.png" alt="Imagine indisponibila." title="Home">
                <span class="logo_text">Maga</span>
            </a></li>
        <li class="navbar"><a class="navbar" href="contact.asp">Contact</a></li>
        <li class="navbar"><a class="navbar" href="about.asp">About</a></li>
    </ul>
</header>

<body>
