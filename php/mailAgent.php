<?php

require "../vendor/autoload.php"; // NEEDED FOR Hashids
include 'vars.php';
//include 'php/connection.php';
use Hashids\Hashids;

define("redirect","localhost/kravmaga_v2/reset.html");

$dbServername = 'localhost';
$dbAdmin = 'root';
$dbPassword = '';
$dbName = 'kravmaga_accounts';
$conn = mysqli_connect($dbServername,$dbAdmin,$dbPassword,$dbName);
function generateUpdateResetURL(){ // GENERATES A RESET URL AND UPDATES THE DATABASE
    try {
        global $conn;

        // AS HASHIDS ENCODES ONLY NUMBERS, WE GET THE USER'S ID FROM HIS HASH
        $hashids = new Hashids();
        $currentHash = $_COOKIE['currentHash'];
        $url = $hashids->encodeHex($currentHash);
        //
        //$id = base64_encode($_COOKIE['currentHash']);
        if ($url == "")
          throw new Exception("Could not generate hashid");

        // ADD PASSWORD THAT EXPIRES IN 1 HOUR
        // TODO: VERIFY IF LINK IS EXPIRED
        $sql = "INSERT INTO `parole_resetare`(`hash_requester`, `URL`, `Data_Expirare`) VALUES ('$currentHash','$url', DATE_ADD(now(),INTERVAL 1 HOUR ))";
        $result = mysqli_query($conn, $sql);


        if ($result) {
            return $url;
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

function resetPassword($newPasswd){
    global $conn;

    $tkn = $_POST['tkn'];
    $updatedPasswd = hash("sha256",$newPasswd);

    $sql = "SELECT * FROM parole_resetare WHERE `URL`='$tkn'";
    $result = mysqli_query($conn,$sql);

    if($result){
        $hashids = new Hashids();
        $row = $result->fetch_array(MYSQLI_ASSOC);
        // dcodedTkn IS ID_utilizator
        $dcodedTkn = $hashids->decodeHex($row['URL']);
        $sql = "UPDATE `utilizatori` SET `parola`='$updatedPasswd' WHERE `hash`='$dcodedTkn'";
        $result = mysqli_query($conn,$sql);

        $resp = new JSON_Response();
        if($result){
            $resp->message = msg_updatedPassword_success;
            $resp->code = passwordReset_success;

            echo(json_encode($resp));
        }
        else{
            $resp->message = msg_updatedPassword_failed;
            $resp->code = passwordReset_failed;

            echo(json_encode($resp));
        }
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

if(isset($_POST['sendPasswordReset'])){
    resetPassword($_POST['newPasswd']);
}

