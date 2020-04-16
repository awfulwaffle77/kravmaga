<?php
include 'vars.php';
include 'connection.php';

session_start();

$conn = mysqli_connect($dbServername, $dbAdmin, $dbPassword, $dbName);
$adminHashArray = array();

function initHashArray()
{
    try {
        global $adminHashArray;
        global $conn;

        $sql = "SELECT hash FROM utilizatori WHERE tip_utilizator=0";
        $result = mysqli_query($conn, $sql);

        if ($result->num_rows < 1) {
            throw new Exception("Nu a fost gasit niciun admin");
        } else {
            while ($row = mysqli_fetch_assoc($result)) {
                array_push($adminHashArray, $row['hash']);
            }
        }
    } catch (Exception $e) {
        echo(json_encode($e->getMessage()));
    }
}

function existsInHashArray($userhash)
{ // IF HASH REPRESENTS AN ADMIN
    global $adminHashArray;

    foreach ($adminHashArray as $elem) {
        if ($elem == $userhash)
            return true;
    }
    return false;
}

function getPrivilege($username)
{
    try {
        global $conn;

        $sql = "SELECT tip_utilizator FROM utilizatori WHERE utilizator='$username';";
        $result = mysqli_query($conn, $sql);

        if ($result->num_rows > 1) {
            throw new Exception('Exista mai multi utilizatori cu acelasi username!');
        } else if ($result->num_rows == 1 && $result != null) {
            $row = mysqli_fetch_assoc($result);
            return $row['tip_utilizator'];
        }
    } catch (Exception $e) {
        echo(json_encode($e->getMessage()));
    }
    return null;
}

function checkUsernameExists($username)
{
    global $conn;

    $sqlcode = "SELECT id_utilizator from utilizatori WHERE utilizator='$username'";
    $result = mysqli_query($conn, $sqlcode);
    if ($result->num_rows != 0)
        return false;
    return true;
}

function getInfo($sqlcode, $successMsg, $successCode, $errMsg, $errCode)
{
    global $conn;
    try {
        $result = mysqli_query($conn, $sqlcode);

        if ($result->num_rows == 0)
            throw new Exception($errMsg);

        $resp = new eventsInfo();
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($resp->informatii, $row);
        }

        $resp->message = $successMsg;
        $resp->code = $successCode;

        return (json_encode($resp));
    } catch (Exception $e) {
        $resp = new JSON_Response();
        $resp->message = $e->getMessage();
        $resp->code = $errCode;

        return json_encode($resp);
    }
}

function basicUpdateDeleteInsert($sqlcode, $successMsg, $successCode, $errMsg, $errCode)
{
    try {
        global $conn;
        $result = mysqli_query($conn, $sqlcode);

        $resp = new JSON_Response();
        if ($result) {
            $resp->message = $successMsg;
            $resp->code = $successCode;
        } else
            throw new Exception($errMsg);

        echo(json_encode($resp));
    } catch (Exception $e) {
        $resp = new JSON_Response();
        $resp->message = $e->getMessage();
        $resp->code = $errCode;

        echo(json_encode($resp));
    }
}

initHashArray();

// POST METHODS

if (isset($_POST['login'])) { // if login property is set, try login
    $uname = $_POST['uname'];
    $passwd = hash("sha256", $_POST['passwd']);

    try {
        $sqlcode = "SELECT * FROM utilizatori WHERE utilizator='$uname' AND parola='$passwd';";
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
            if ($_SESSION['privilege'] == SQLAdminCode)
                $_SESSION['admin'] = $uname;

            setcookie('currentHash', mysqli_fetch_assoc($result)['hash'], time() + 60 * 60 * 24 * 365, '/');

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

if (isset($_POST['checkPrivilege'])) {
    try {
        if (isset($_SESSION['username'])) { // is checked by the current session as the easier approach (probably UNNECESSARY !!)
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
        } else if (isset($_COOKIE['currentHash'])) {
            if (existsInHashArray($_COOKIE['currentHash'])) { // user is admin and got his hash as cookie
                $resp = new JSON_Response();
                $resp->message = "Utilizatorul este admin";
                $resp->code = isAdmin;

                echo(json_encode($resp));

            } else { // user is not admin // SOME MAD ERROR AT 157
                $resp = new JSON_Response();
                $resp->message = "Utilizatorul nu este admin";
                $resp->code = regularUser;

                echo(json_encode($resp));
            }
        } else
            throw new Exception("$_COOKIE[currentHash] is not set. Please login??");
    } catch (Exception $e) {
        echo(json_encode($e->getMessage()));
    }
}

if (isset($_POST['signup'])) {
    // TODO: PROBABLY ADD TO utilizatori_centuri too??
    try {
        if (existsInHashArray($_POST['currentHash'])) { // IF CURRENT USER IS ADMIN

            $nume = $_POST['nume'];
            $username = $_POST['username'];
            $email = $_POST['email'];
            $prenume = $_POST['prenume'];
            $passwd = password_hash($_POST['passwd'], PASSWORD_DEFAULT);
            $date = $_POST['date'];
            $id_sala = "'" . $_POST['id_sala'] . "'";
            $id_centura = "'" . $_POST['id_centura'] . "'";

            $userHash = password_hash($nume . $prenume . $username . $passwd, PASSWORD_DEFAULT);

            // tip_utilizator default is 1(regular user)
            $sqlcode = "INSERT INTO utilizatori(`Nume`, `Prenume`, `Utilizator`,`Email`,`Parola`, `Data_inrolare`, `ID_Sala`, `ID_Centura`, `Hash`) VALUES('$nume','$prenume','$username','$email','$passwd','$date',$id_sala,$id_centura,'$userHash')";
            $result = mysqli_query($conn, $sqlcode);

            if ($result == false) {
                throw new Exception(msg_userInsert_failed);
            } else {
                $resp = new JSON_Response();
                $resp->message = msg_userInsert_success;
                $resp->code = userInsert_good;
                echo(json_encode($resp));
            }
        } else die("Not an admin");
    } catch (Exception $e) {
        $x = $e->getMessage();
        echo(json_encode($e->getMessage()));
    }

}

if (isset($_POST['checkUsernameAvailable'])) {
    if (checkUsernameExists($_POST['username'])) {
        $resp = new JSON_Response();
        $resp->code = usernameAvailable;
        $resp->message = msg_usernameAvailable;

        echo(json_encode($resp));
    } else {
        $resp = new JSON_Response();
        $resp->code = usernameUnavailable;
        $resp->message = msg_usernameUnavailable;

        echo(json_encode($resp));
    }
}

if (isset($_POST['addEvent'])) {
    try {
        if (!existsInHashArray($_COOKIE['currentHash']))
            throw new Exception(msg_eventAdd_failed_privilege);

        $nume = $_POST['nume'];
        $locatie = $_POST['locatie'];
        $descriere = $_POST['descriere'];
        $tip_event = $_POST['tip_event'];
        $data_start = $_POST['data_start'];
        $data_stop = $_POST['data_stop'];

        $sql = "INSERT INTO `evenimente`(`ID_eveniment`, `Nume`, `Locatie`, `Descriere`, `Tip_eveniment`, `Data_start_eveniment`, `Data_stop_eveniment`) VALUES ('$nume','$locatie','$descriere','$tip_event','$data_start','$data_stop')";
        $result = mysqli_query($conn, $sql);

        if ($result->num_rows != 1) {
            throw new Exception(msg_eventAdd_failed_insert);
        }

        $resp = new JSON_Response();
        $resp->message = msg_eventAdd_success;
        $resp->code = eventAdd_success;

        echo(json_encode($resp));
    } catch (Exception $e) {
        $resp = new JSON_Response();
        $resp->message = $e->getMessage();
        $resp->code = eventAdd_failed;

        echo(json_encode($resp));
    }
}

if (isset($_POST['updateEvent'])) {
    $id = $_POST['updateEvent'] + 2; // BECAUSE ID IS OFFSETed BY 2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! BAD IMPLETMENTATION
    $info = $_POST['updatedInfo'];
    $nume = $info[0];
    $locatie = $info[1];
    $descriere = $info[2];
    $tip_event = $info[3];
    $data_start = $info[4];
    $data_stop = $info[5];

    $sql = "UPDATE `evenimente` SET `Nume`='$nume',`Locatie`='$locatie',`Descriere`='$descriere',`Tip_eveniment`='$tip_event',`Data_start_eveniment`='$data_start',`Data_stop_eveniment`='$data_stop' WHERE ID_eveniment = $id";
    basicUpdateDeleteInsert($sql, msg_updateEvent_success, updateEvent_success, msg_updateEvent_failed, updateEvent_failed);
}

if (isset($_POST['deleteRecordEvent'])) {
    $id = $_POST['id'];
    $sql = "DELETE FROM `evenimente` WHERE `id`='$id'";

    basicUpdateDeleteInsert($sqlcode, msg_deleteRecord_success, deleteRecord_success, msg_deleteRecord_failed, deleteRecord_failed);
}

if (isset($_POST['updateAntrenamente'])) {
    // IMPLEMENTATION: CAN ONLY CHANGE INSTURCTORI AND DATA, NOT THE LOCATION
    $id = $_POST['updateAntrenamente'];
    $instructori = $_POST['updatedInfo'][0];
    $data = $_POST['updatedInfo'][1];

    // UPDATING ANTRENAMENTE
    $sql = "UPDATE `antrenamente` SET `Data_antrenament`='$data',`Instructori`='$instructori' WHERE `ID_antrenament`=$id";
    basicUpdateDeleteInsert($sql, msg_updateAntrnmnt_success, updateAntrnmnt_success, msg_updateAntrnmnt_failed, updateAntrnmnt_failed);
}

if (isset($_POST['deleteRecordAntrenamente'])) {
    $id = $_POST['id'];
    $sql = "DELETE FROM `antrenamente` WHERE `id_antrenament`='$id'";

    basicUpdateDeleteInsert($sql, msg_deleteRecordAntrnmnt_success, deleteRecordAntrnmnt_success, msg_deleteRecordAntrnmnt_failed, deleteRecordAntrnmnt_failed);
}

if (isset($_POST['deleteRecordPresentUser'])) {
    $id = $_POST['id'];
    $sql = "DELETE FROM `utilizatori_antrenamente` WHERE ID_utilizator_antrenament = '$id'";

    basicUpdateDeleteInsert($sql, msg_deleteRecordPresentUser_success, deleteRecordPresentUser_success, msg_deleteRecordPresentUser_failed, deleteRecordPresentUser_failed);
}

if (isset($_POST['addUserAntrenament'])) {
    try {
    $nume = $_POST['nume'];
    $prenume = $_POST['prenume'];
    $id_antr = $_POST['id_antr'];

    $sql = "INSERT INTO utilizatori_antrenamente(ID_user) SELECT ID_Utilizator FROM utilizatori WHERE nume='$nume' AND prenume='$prenume'";
    $sql2 = "UPDATE utilizatori_antrenamente as a
            INNER JOIN utilizatori as b ON a.ID_user = b.ID_utilizator
            SET a.ID_antr = $id_antr
            WHERE b.Nume='$nume' AND b.Prenume='$prenume'";

    $result = mysqli_query($conn, $sql);
    if (!$result)
        throw new  Exception(msg_addUserAntrenament_failed);

    $result = mysqli_query($conn, $sql2);
     if (!$result)
         throw new  Exception(msg_addUserAntrenament_failed);

     $resp = new JSON_Response();
     $resp->message = msg_addUserAntrenament_success;
     $resp->code = addUserAntrenament_success;

     echo(json_encode($resp));
    }
    catch (Exception $e) {
        $resp = new JSON_Response();
        $resp->code = addUserAntrenament_failed;
        $resp->message = $e->getMessage();
        echo(json_encode($resp));
    }
}

// GET METHODS

if (isset($_GET['getSignupInfo'])) {
    try {
        $resp = new centuriSali();

        $sqlcode = "SELECT ID_CENTURA, CULOARE FROM centuri";
        $result = mysqli_query($conn, $sqlcode);
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) { // for every row fetched, push it into $resp->centuri
            array_push($resp->centuri, $row);
        }
        if ($result->num_rows == 0)
            throw new Exception(msg_getSignupInfo_failed);

        $sqlcode = "SELECT NUME, ADRESA FROM sali";
        $result = mysqli_query($conn, $sqlcode);
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            array_push($resp->sali, $row);
        }
        if ($result->num_rows == 0)
            throw new Exception(msg_getSignupInfo_failed);

        echo(json_encode($resp));
    } catch (Exception $e) {
        echo(json_encode($e->getMessage()));
    }
}

if (isset($_GET['getProfileInfo'])) {
    try {
        $currentHash = $_COOKIE['currentHash'];
        $sql = "SELECT nume, prenume, utilizator FROM utilizatori WHERE hash='$currentHash'";
        $result = mysqli_query($conn, $sql);

        if ($result->num_rows == 0)
            throw new Exception(msg_getSignupInfo_failed);

        $resp = new profileInfo();
        $resp->informatii = $result->fetch_array(MYSQLI_ASSOC);
        $resp->message = msg_profileInfo_success;
        $resp->code = profileInfo_success;

        echo(json_encode($resp));
    } catch (Exception $e) {
        echo(json_encode($e->getMessage()));
    }
}

if (isset($_GET['getEventsInfo'])) {
//    try {
    $sql = "SELECT ID_eveniment, Nume, Locatie, Descriere, Tip_eveniment, Data_start_eveniment, Data_stop_eveniment FROM evenimente";
    echo(getInfo($sql, msg_eventsInfo_success, eventsInfo_success, msg_eventsInfo_failed, eventsInfo_failed));

    /*$result = mysqli_query($conn, $sql);

    if ($result->num_rows == 0)
        throw new Exception(msg_eventsInfo_failed);

    $resp = new eventsInfo();
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($resp->informatii, $row);
    }

    $resp->message = msg_eventsInfo_success;
    $resp->code = eventsInfo_success;

    echo(json_encode($resp));
} catch (Exception $e) {
    // TODO: A NEW JSON_RESPONSE SHOULD BE MADE AND INTERPRETED
    echo(json_encode($e->getMessage()));*/
    //}
}

if (isset($_GET['getAntrenamenteInfo'])) {
    //try {
    $sql = "SELECT an.id_antrenament as 'ID_Antrenament' , s.nume as 'Nume' , s.adresa as 'Adresa' , an.instructori as 'Instructori', an.Data_Antrenament as 'Data' FROM `antrenamente` as an INNER JOIN `sali` as s ON an.id_sala = s.id_sala ";
    echo(getInfo($sql, msg_antrnmntInfo_success, antrntmnt_success, msg_antrnmntInfo_failed, antrnmnt_failed));

    //    $result = mysqli_query($conn, $sql);

    /*  if ($result->num_rows == 0)
          throw new Exception(msg_antrnmntInfo_failed);

      $resp = new eventsInfo();
      while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
          array_push($resp->informatii, $row);
      }

      $resp->message = msg_antrnmntInfo_success;
      $resp->code = antrntmnt_success;

      echo(json_encode($resp));
  } catch (Exception $e) {
      $resp = new JSON_Response();
      $resp->message = $e->getMessage();
      $resp->code = antrnmnt_failed;

  }*/

}

if (isset($_GET['getAntrenament']) && isset($_GET['id'])) {

    $id = $_GET['id'];
    $sql = "SELECT ua.id_utilizator_antrenament, u.Nume, u.Prenume FROM `utilizatori_antrenamente` as ua JOIN utilizatori as u ON u.id_utilizator = ua.id_user JOIN antrenamente as a ON ua.id_antr = a.id_antrenament";
    echo(getInfo($sql, msg_antrnmntUserInfo_success, antrnmntUserInfo_success, msg_antrnmntUserInfo_failed, antnmntUserInfo_failed));
}

if (isset($_GET['getAntrenamentTitlu'])) {
    $id = $_GET['id'];

    $sql = "SELECT an.id_antrenament as 'ID_Antrenament' , s.nume as 'Nume' , s.adresa as 'Adresa' , an.instructori as 'Instructori', an.Data_Antrenament as 'Data' FROM `antrenamente` as an INNER JOIN `sali` as s ON an.id_sala = s.id_sala WHERE `id_antrenament`='$id'";
    echo(getInfo($sql, "", "", "", ""));
}

if (isset($_GET['getAntrenamentInfo'])) { // INFO FOR A SINGLE TRAINING SESSION
    $id = $_GET['id'];

    $sql = "SELECT u.Nume, u.Prenume
            FROM utilizatori as u
            WHERE u.ID_utilizator NOT IN (SELECT ua.ID_user
            FROM utilizatori_antrenamente as ua
            WHERE ua.ID_antr = $id)"; // SELECT USERS THAT ARE NOT IN THIS TRAINING SES
    echo(getInfo($sql, msg_getAntrenamentInfo_succes, getAntrenamentInfo_succes, msg_getAntrenamentInfo_failed, getAntrenamentInfo_failed));
}



