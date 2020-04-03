<?php
// CODES
define("isAdmin", 100);
define("regularUser",101);

define("SQLAdminCode", 0);
define("userInsert_good",200);
define("userInsert_failed",201);
define("usernameAvailable",300);
define("usernameUnavailable",301);
define("profileInfo_success",302);
define("resetURL_succes",303);
define("resetURL_failed",304);

// MESSAGES
define("msg_userInsert_success","Utilizator inserat cu succes.");
define("msg_userInsert_failed","Utilizatorul nu a putut fi adaugat. Eroare la query");
define("msg_userInsert_failed_userExists", "Utilizatorul exista deja");

define("msg_usernameAvailable","Username poate fi folosit");
define("msg_usernameUnavailable","Username-ul este deja in uz");

define("msg_getSignupInfo_failed","Nu am putut gasi ID_SALA, ID_CENTURA");

define("msg_profileInfo_failed","Nu s-au putut lua informatiile de la sever");
define("msg_profileInfo_success","Informatiile au fost fetchuite cu succes");

define("msg_resetURL_success","URL a fost generat si trimis cu succes");
define("msg_resetURL_failed", "Nu s-a putut trimite URL-ul");

// CLASSES

class JSON_Response{
    public $message = "Default message";
    public $code = -1;
}

class centuriSali{
    public $sali = array();
    public $centuri = array();
}

class profileInfo extends JSON_Response {
    public $informatii = array("nume"=>"","prenume"=>"","utilizator"=>"","email"=>"");
}

class URLResponse extends JSON_Response{
   public $urlResp = "";
}
