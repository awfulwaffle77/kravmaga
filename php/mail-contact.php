<?php
$to = "gabrielavram1234@gmail.com";
$subject = $_POST["subj"];
$txt = $_POST["text"];
$from=$_POST["Email"];
$headers = "From: ".$from. "\r\n".
"CC: gabrielavram1234@gmail.com";

mail($to,$subject,$txt,$headers);
header("Location: https://localhost/krav_me/index.html");

?>