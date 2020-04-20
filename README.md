# Kravmaga

# Configuration
## Hashids
[Hashids](https://github.com/vinkla/hashids) is used for generating unique links. Install requirements 
with `php composer install` or `php composer update` or you can install this with composer by cd-ing to the project directory 
and `composer require hashids/hashids`.

## MySQL - phpmyadmin
Table `antrenamente`, row `ID_sala` is UNIQUE. Is it intended? Changed from UNIQUE to INDEX.
Table `utilizatori_antrenamente`. rows `ID_user` and `ID_sala` are UNIQUE. Is it intended? Changed from UNIQUE to INDEX.
If they are UNIQUE, I cannot add same user to other trainings.

Created new table `parole_resetare` as such:
     
    CREATE TABLE `parole_resetare` (
      `Id` int(11) NOT NULL,
      `hash_requester` varchar(255) NOT NULL,
      `URL` varchar(255) NOT NULL,
      `Data_Expirare` datetime NOT NULL DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    ALTER TABLE `parole_resetare`
      ADD PRIMARY KEY (`Id`),
      ADD UNIQUE KEY `URL` (`URL`);
    
    ALTER TABLE `parole_resetare`
      MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
    COMMIT;
     

Using MySQL events with [this](https://stackoverflow.com/questions/6622301/can-i-set-a-mysql-event-schedule-using-phpmyadmin)
StackOverflow link and [this](https://dev.mysql.com/doc/refman/8.0/en/events-privileges.html) MySQL doc.
Created event to automatically DELETE outdated password links as such:

    CREATE EVENT password_expiration
        ON SCHEDULE
          EVERY 10 SECOND
        DO
          DELETE FROM parole_resetare WHERE Id IN (
        SELECT Id FROM (
            SELECT * FROM `parole_resetare` GROUP BY Id HAVING(DAta_Expirare < CURRENT_TIMESTAMP)
        ) AS P
    )
    

# ISSUES
* profile.html edit button does not submit to php

* `#loginProfile` will not work on index.html due to path `pages/profile.html`. Also redirect to `profile.html`
does not work on `reset.html` ??

* Select does not work if you click select the second time. Problem at hiding child `td`. It hides the child `input`.

* Delete buttons do not work anymore on antrenament.html . Have to delete with Select button. Removed them

* Edit/Delete buttons sometimes do not show and have to be refreshed

* antrenamente/evenimente Script is a lot of duplicate code

* edit buttons have no cancel function. Save state and reset input.

* PLEASE check updateEvent POST param & deleteRecord POST param

* Must test adding event and antrenament.

* ~On Chrome, currentHash cookie modifies its value. Why? It did not. Function `existsInHashArray` does not 
populate the array.~

* Note: handler.js has a lot of code in it and code for several pages. Might be good to separate code into other files.

* Note: Currently, PHP does not return a webpage and redirects are handled in .js files. Should be changed.
# FEATURES
**LOGIN**
 
 Checks the credentials with the database and sets a cookie named 'logged' to 1, to switch the Login text in 
 the menu. Sets a cookie named 'currentHash' to identify users. **SHOULD SWITCH THE 'logged' COOKIE TO USING 
 JUST THE HASH**.
 
 **SIGNUP**

Has fields that must be completed(checked on submit), checks if passwords match, checks username to 
be available, max date is today's date, fetches *centuri* and *sali* from the database and puts the elements
available to select. ~MUST ADD MININMUM PASSWORD REQUIREMENTS WITH REGEX.~(added) 

**PASSWORD RESET WITH EXPIRING LINKS**

**EVENT & ANTRENAMENT ADD WITH POPUP**
Event also has the possibility to Delete and Edit. Antrenament is implemented such that you can only update 
Instructori and Data, but not the Location.

**INDIVIDUAL ANTRENAMENT PAGE WITH SEARCH**
Individual page where, depending on the GET Param `id`, you can see the users. 

## Communication between sever and client
It is made always as JSON(using `class JSON_Response`) Even errors. Everything is wrapped in `json_encode` in PHP before it is sent to 
JavaScript. This has and may cause issues in the future when interpreting the response if there are PHP errors 
returned that are not treated. Please be advised and check as much of the errors as possible.
## Server Side (PHP)
Be advised that definitions of all codes and messages are defined at the top of the .php file. Later on, they may be 
moved to a different file. The codes and messages correspond to those of the client.

`class centuriSali` is the class necesary to fetch all of the elements from tables `sali` and `centuri`

`class JSON_Response` is the basic wrapper for a response message. This is how messages are sent to the client.

$adminHashArray is a varible that stores the hashes of all admins. Checking the existence of the currentHash in this 
array equals checking if the user is an admin.
### $_POST variable checks
If the AJAX calls have these variables set to 1, do this:
### $_POST['login']
If the login variable recieved from the AJAX call is set to 1, query the database for these credentials. If they match
with any in the database, we set the cookies 'logged' to 1 and 'currentHash' to the hash of the current user from the
database. The cookie timeout is set to 1 year.
#### $_POST['checkPrivilege']
This is used to check if a user has the right to access a page or not.
Here we have 2 checks. One is if the privilege of the current $_SESSION['username'] corresponds with the
privilege of an administrator. The second is to prevent forcing login over and over and we store a cookie with 
a hash calculated like this: 
`$userHash = hash("sha256", $nume . $prenume . $username . $passwd);`. This hash will be used in further checking
the privilege of the user.
#### $_POST['signup]
First checks if the user is admin and then adds the items into the database. Regular signup. Returns a message when done.
#### $_POST['checkUsernameAvailable]
Check if the username inserted in the box with the id="signup_username" is taken or not.
#### $_POST['getSignupInfo']
Queries for `centuri` and `sali`. Here the `class centuriSali` is used and each of its arrays is set to the values
returned from the database. E.g.: 

    $sqlcode = "SELECT ID_CENTURA, CULOARE FROM centuri"; 
    $result = mysqli_query($conn,$sqlcode);
    while($row = $result->fetch_array(MYSQLI_ASSOC)){ // for every row fetched, push it into $resp->centuri
    array_push($resp->centuri,$row);

## Client Side (JS, JQuery)
As a cookie handler the [js-cookie](https://github.com/js-cookie/js-cookie) plugin is used.

`handler.js` is used as the main script handling Sign Up and Login so far. It imports functions from `fieldChecker.js`.
 
