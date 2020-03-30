# Kravmaga
Current features: **LOGIN**, **SIGNUP**

## Server Side (PHP)
### $_POST variable checks
#### $_POST['checkPrivilege']
Here we have 2 checks. One is if the privilege of the current $_SESSION['username'] corresponds with the
privilege of an administrator. Secondly, to prevent forced login over and over, we store a cookie with a hash: 
`$userHash = hash("sha256", $nume . $prenume . $username . $passwd);`. Easier, right? :D
#### $_POST['checkUsernameAvailable]
Check if the username inserted in the signup_username box is taken or not.

## Client Side (JS, JQuery)
