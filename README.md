# Kravmaga
# ISSUES
On Chrome, currentHash cookie modifies its value. Why?
# FEATURES
**LOGIN**
 
 Checks the credentials with the database and sets a cookie named 'logged' to 1, to switch the Login text in 
 the menu. Sets a cookie named 'currentHash' to identify users. **SHOULD SWITCH THE 'logged' COOKIE TO USING 
 JUST THE HASH**.
 
 **SIGNUP**

Has fields that must be completed(checked on submit), checks if passwords match, checks username to 
be available, max date is today's date, fetches *centuri* and *sali* from the database and puts the elements
available to select. **MUST ADD MININMUM PASSWORD REQUIREMENTS WITH REGEX.**


## Communication between sever and client
It is made always as JSON. Even errors. Everything is `json_encode` in PHP before it is sent to JavaScript. This
has and may cause issues in the future when interpreting the response if there are PHP errors returned that
are not treated. Please be advised and check as much of the errors as possible.
## Server Side (PHP)
### $_POST variable checks
#### $_POST['checkPrivilege']
Here we have 2 checks. One is if the privilege of the current $_SESSION['username'] corresponds with the
privilege of an administrator. Secondly, to prevent forced login over and over, we store a cookie with a hash: 
`$userHash = hash("sha256", $nume . $prenume . $username . $passwd);`. Easier, right? :D
#### $_POST['checkUsernameAvailable]
Check if the username inserted in the signup_username box is taken or not.

## Client Side (JS, JQuery)
As a cookie handler the (js-cookie)[https://github.com/js-cookie/js-cookie] plugin is used.
