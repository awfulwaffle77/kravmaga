<?php
session_start();

// CODES
define("isAdmin", 100);
define("regularUser",101);

define("SQLAdminCode", 0);
define("userInsert_good",200);
define("userInsert_failed",201);
define("usernameAvailable",300);
define("usernameUnavailable",301);

// MESSAGES
define("msg_userInsert_good","Utilizator inserat cu succes.");
define("msg_userInsert_failed","Utilizatorul nu a putut fi adaugat. Eroare la query");
define("msg_userInsert_failed_userExists", "Utilizatorul exista deja");

define("msg_usernameAvailable","Username poate fi folosit");
define("msg_usernameUnavailable","Username-ul este deja in uz");

$dbServername = 'localhost';
$dbAdmin = 'root';
$dbPassword = '';
$dbName = 'kravmaga_accounts';

$conn = mysqli_connect($dbServername,$dbAdmin,$dbPassword,$dbName);
$adminHashArray = array();

function initHashArray(){
    try {
        global $adminHashArray;
        global $conn;

        $sql = "SELECT hash FROM utilizatori WHERE tip_utilizator=0";
        $result = mysqli_query($conn, $sql);

        if ($result->num_rows > 1) {
            throw new Exception("Nu a fost gasit niciun admin");
        } else if ($result->num_rows > 1) {
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($adminHashArray, $row);
            }
        }
    }
    catch(Exception $e){
        echo(json_encode($e->getMessage()));
    }
}

function existsInHashArray($userhash){
    global $adminHashArray;

    foreach($adminHashArray as $elem){
        if($elem == $userhash)
            return true;
    }
    return false;
}

function getPrivilege($username){
    try {
        global $conn;

        $sql = "SELECT tip_utilizator FROM utilizatori WHERE utilizator='$username';";
        $result = mysqli_query($conn, $sql);

        if ($result->num_rows > 1) {
            throw new Exception('Exista mai multi utilizatori cu acelasi username!');
        }
        else if ($result->num_rows == 1 && $result != null){
            $row = mysqli_fetch_assoc($result);
            return $row['tip_utilizator'];
        }
    }
    catch (Exception $e)
    {
        echo(json_encode($e->getMessage()));
    }
    return null;
}

function checkUsernameExists($username){
    global $conn;

    $sqlcode = "SELECT id_utilizator from utilizatori WHERE utilizator='$username'";
    $result = mysqli_query($conn, $sqlcode);
    if($result->num_rows != 0)
       return false;
    return true;
}

class JSON_Response{
    public $message = "Default message";
    public $code = -1;
}

initHashArray();
// TODO: Add cookie hash when logging
if(isset($_POST['login'])) { // if login property is set, try login
    $uname = $_POST['uname'];
    $passwd = hash("sha256",$_POST['passwd']);

    try {
        $sqlcode = "SELECT * FROM utilizatori WHERE utilizator='$uname' AND parola='$passwd';"; // !! PASSWORD IS NOT HASHED HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        $result = mysqli_query($conn, $sqlcode);

        if ($result->num_rows > 1) {
            throw new Exception('Exista mai multi utilizatori cu acelasi username!');
        } else if ($result->num_rows == 1) { // Utilizator logat cu succes.
            $resp = new JSON_Response();
            $resp->message = "Utilizator logat cu succes.";
            $resp->code = 1;

            setcookie('logged', 1, time() + 60 * 60 * 24 * 365, '/');
            $_SESSION['logged'] = 1;
            $_SESSION['username'] = $uname;
            $_SESSION['privilege'] = getPrivilege($uname);

            // If user is admin, set the session var (redundant?)
            if($_SESSION['privilege'] == SQLAdminCode)
                $_SESSION['admin'] = $uname;

            $_COOKIE['currentHash'] = mysqli_fetch_assoc($result)['hash'];

            echo(json_encode($resp));
        } else { // Utilizator inexistent
            $resp = new JSON_Response();
            $resp->message = "Utilizator inexistent";
            $resp->code = 2;

            echo(json_encode($resp));
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}

if(isset($_POST['checkPrivilege'])) {
    try{
        if(isset($_SESSION['username'])) { // is checked by the current session as the easier approach (probably UNNECESSARY !!)
            if (getPrivilege($_SESSION["username"]) == SQLAdminCode) {
                $resp = new JSON_Response();
                $resp->message = "Utilizatorul este admin";
                $resp->code = isAdmin;

                echo(json_encode($resp));
                //readfile("profile.html");
            } else {
                $resp = new JSON_Response();
                $resp->message = "Utilizatorul nu este admin";
                $resp->code = regularUser;

                echo(json_encode($resp));
            }
        }
        else if(isset($_COOKIE['currentHash'])) {
            if (existsInHashArray($_COOKIE['currentHash'])) { // user is admin and got his hash as cookie
                $resp = new JSON_Response();
                $resp->message = "Utilizatorul este admin";
                $resp->code = isAdmin;

                echo(json_encode($resp));

            }
        else{ // user is not admin // SOME MAD ERROR AT 157
                $resp = new JSON_Response();
                $resp->message = "Utilizatorul nu este admin";
                $resp->code = regularUser;

                echo(json_encode($resp));
            }
        }
        else
            throw new Exception("$_COOKIE[currentHash] is not set. Please login??");
    }
    catch(Exception $e){
        echo(json_encode($e->getMessage()));
    }
}

if(isset($_POST['signup'])) {
    try {
        $nume = $_POST['nume'];
        $username = $_POST['username'];
        $prenume = $_POST['prenume'];
        $passwd = hash("sha256", $_POST['passwd']);
        $date = $_POST['date'];
        $id_sala = $_POST['id_sala'];
        $id_centura = $_POST['id_centura'];

        $userHash = hash("sha256", $nume . $prenume . $username . $passwd);

        // tip_utilizator default is 1(regular user)
        $sqlcode = "INSERT INTO utilizatori(`Nume`, `Prenume`, `Utilizator`, `Parola`, `Data_inrolare`, `ID_Sala`, `ID_Centura`, `Hash`) VALUES('$nume','$prenume','$username','$passwd','$date',$id_sala,$id_centura,'$userHash')";
        $result = mysqli_query($conn, $sqlcode);

        if ($result == false) {
            throw new Exception(msg_userInsert_failed);
        }
        else{
            $resp = new JSON_Response();
            $resp->message = msg_userInsert_good;
            $resp->code = userInsert_good;
            echo(json_encode($resp));
        }

    }
    catch (Exception $e){
        echo(json_encode($e->getMessage()));
    }

}

if(isset($_POST['checkUsernameAvailable'])){
    if(checkUsernameExists($_POST['username'])){
        $resp = new JSON_Response();
        $resp->code = usernameAvailable;
        $resp->message = msg_usernameAvailable;

        echo(json_encode($resp));
    }
    else{
        $resp = new JSON_Response();
        $resp->code = usernameUnavailable;
        $resp->message = msg_usernameUnavailable;

        echo(json_encode($resp));
    }

}
