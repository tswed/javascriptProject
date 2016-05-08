/**
 * Created by tswed on 3/2/16.
 */

window.onload = startSignInForm;

function startSignInForm() {
    if (document.cookie) {
        var usrName = retrieveMCookie("signinInfo", "userName");
        var pass = retrieveMCookie("signinInfo", "Password");

        document.getElementById("inputUserName").value = usrName;
        document.getElementById("inputPassword").value = pass;
    }
    document.forms["signIn"].onsubmit = checkSignInCredentials;
}

function checkSignInCredentials() {
    if (document.getElementById("inputUserName").value == "tswed" &&
        document.getElementById("inputPassword").value == "crossway1300") {

        if (document.getElementById("rememberMe").checked == true) {
            var usrName = document.getElementById("inputUserName");
            var pass = document.getElementById("inputPassword");

            var expire = new Date();
            expire.setFullYear(expire.getFullYear() + 1);

            //Write input box value to a cookie
            writeMCookie("signinInfo", "userName", usrName.value, expire);
            writeMCookie("signinInfo", "Password", pass.value, expire);
        }
        return true;
    } else {
        alert("Incorrect UserName/Password, please try again");
        return false;
    }
}
