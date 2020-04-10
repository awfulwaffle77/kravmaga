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
define("resetURL_success",303);
define("resetURL_failed",304);
define("passwordReset_success",305);
define("passwordReset_failed",306);
define("eventsInfo_success",307);
define("eventsInfo_failed",308);
define("eventAdd_success",309);
define("eventAdd_failed",310);
define("antrntmnt_success",311);
define("antrnmnt_failed",312);
define("antrnmntUserInfo_success",313);
define("antnmntUserInfo_failed",314);

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

define("msg_updatedPassword_success","Parola a fost schimbata cu succes");
define("msg_updatedPassword_failed","Parola nu s-a putut schimba");

define("msg_eventsInfo_success","Info evenimente fetchuite cu succes");
define("msg_eventsInfo_failed","Info evenimente nu au putut fii fetchuite");

define("msg_eventAdd_success","Evenimentul a fost adaugat cu succes");
define("msg_eventAdd_failed_insert","Nu s a putut insera evenimentul");
define("msg_eventAdd_failed_privilege","Nu aveti privilegiile necesare pentru aceasta actiune");


define("msg_antrnmntInfo_success","Info antrenamente fetchuite cu succes");
define("msg_antrnmntInfo_failed","Info antrenamente nu au putut fi fetchuite");

define("msg_antrnmntUserInfo_success", "Info useri antrenamente fetchuite cu succes");
define("msg_antrnmntUserInfo_failed","Info useri antrenamente nu au putut fi fetchuite");
// CLASSES

class JSON_Response{
    public $message = "Default message";
    public $code = -1;
}

class centuriSali{
    public $sali = array();
    public $centuri = array();
}

class eventsInfo extends JSON_Response{
    public $informatii = array();
}

class profileInfo extends JSON_Response {
    public $informatii = array("nume"=>"","prenume"=>"","utilizator"=>"","email"=>"");
}

class URLResponse extends JSON_Response{
   public $urlResp = "";
}
