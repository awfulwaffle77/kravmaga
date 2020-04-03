<?php

include 'php/vars.php';
//include 'php/connection.php';

define("redirect","localhost/kravmaga_v2/reset.php");

$dbServername = 'localhost';
$dbAdmin = 'root';
$dbPassword = '';
$dbName = 'kravmaga_accounts';
$conn = mysqli_connect($dbServername,$dbAdmin,$dbPassword,$dbName);
function generateUpdateResetURL(){ // GENERATES A RESET URL AND UPDATES THE DATABASE
    try {
        global $conn;

        //$hashids = new Hashids('salt');
        //$id = $hashids->encode($_COOKIE['currentHash']);
        $id = base64_encode($_COOKIE['currentHash']);
        if ($id == "")
          throw new Exception("Could not generate hashid");

        $currentHash = $_COOKIE['currentHash'];
        $currentDate = date(0);
        // ADD PASSWORD THAT EXPIRES IN 1 HOUR
        $sql = "INSERT INTO `parole_resetare`(`hash_requester`, `URL`, `Data_Expirare`) VALUES ('$currentHash','$id', DATE_ADD(now(),INTERVAL 1 HOUR ))";
        $result = mysqli_query($conn, $sql);

        if ($result) {
            return $id;
        } else {
            throw new Exception(msg_resetURL_failed);
        }
        //echo(json_encode($resp));
    }
    catch (Exception $e){
        //echo(json_encode($e->getMessage()));
        return false;
    }
}

function requestPasswordReset($email)
{
    $to = $email;
    $resetURL = redirect."?tkn=".generateUpdateResetURL();
    $subject = 'KRAVMAGA - Password reset';
    $message = 'Your password reset URL is: '.$resetURL;
    $headers = "From: beermoney234@gmail.com\r\n";
    if (mail($to, $subject, $message, $headers)) {
        echo "SUCCESS";
    } else {
        print_r("error:".error_get_last());
    }
}

function resetPassword(){
    global $conn;

    $tkn = $_GET['tkn'];

    $sql = "SELECT * FROM parole_resetare WHERE `URL`='$tkn'";
    $result = mysqli_query($conn,$sql);

    if($result){
        //$hashids = new Hashids\Hashids();
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $dcodedTkn = base64_decode($row['URL']);
        $sql = "SELECT * FROM utilizatori WHERE `hash`='$dcodedTkn'";
        $result = mysqli_query($conn,$sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $x = $row['Utilizator'];
        // TODO: Schimba parola
    }
    else{
        // TODO: Throw error
        echo "OUCH FUNCTION RESET PASSWORD";
    }
}

if(isset($_POST['sendResetPasswordEmail'])){
    try{
       $email = $_POST['email'];
       // TODO: CHECK IF EMAIL IS IN DATABASE AND RETURN ACCORDING MESSAGE

       requestPasswordReset($email);
    }
    catch (Exception $e){

    }
}

