<?php
session_start();

define("isAdmin", 100);
define("SQLAdminCode", 0);
define("regularUser",101);

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

        $sql = "SELECT adminhash FROM utilizatori WHERE tip_utilizator=0";
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

function existsInHashArray($username){
    global $adminHashArray;

    foreach($adminHashArray as $elem){
        if($elem == $_COOKIE["username"])
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

class JSON_Response{
    public $message = "Default message";
    public $code = -1;
}

initHashArray();

if(isset($_POST['login'])) { // if login property is set, try login
    $uname = $_POST['uname'];
    $passwd = $_POST['passwd'];

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

            // If user is admin, set the session var
            if($_SESSION['privilege'] == SQLAdminCode)
                $_SESSION['admin'] = $uname;

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

if(isset($_POST['checkUsername'])) {
    try{
        if(isset($_SESSION['username'])) {
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
        else if(existsInHashArray($_COOKIE['currentHash'])){ // user is admin and got his hash as cookie
            $resp = new JSON_Response();
            $resp->message = "Utilizatorul este admin";
            $resp->code = isAdmin;

            echo(json_encode($resp));
        }
        else{ // user is not admin
            $resp = new JSON_Response();
            $resp->message = "Utilizatorul nu este admin";
            $resp->code = regularUser;

            echo(json_encode($resp));
        }
    }
    catch(Exception $e){
        echo(json_encode($e->getMessage()));
    }
}

if(isset($_POST['signup'])){
    $nume = $_POST['nume'];
    $prenume = $_POST['prenume'];
    $username = $_POST['username'];
    $passwd = $_POST['passwd'];
    $date = $_POST['date'];

    $userHash = hash("sha256",$nume.$prenume.$username.$passwd);

    $sqlcode = "INSERT INTO utlizatori(nume,prenume,utilizator,parola,data_inrolare) VALUES($nume,$prenume,$username,$passwd,$date)"; // !! PASSWORD IS NOT HASHED HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
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

        // If user is admin, set the session var
        if($_SESSION['privilege'] == SQLAdminCode)
            $_SESSION['admin'] = $uname;

        echo(json_encode($resp));
}
