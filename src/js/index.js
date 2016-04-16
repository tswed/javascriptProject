/**
 * Created by tswed on 3/2/16.
 */

window.onload = startSignInForm;

function startSignInForm() {
    document.forms["signIn"].onsubmit = checkSignInCredentials;
}

function checkSignInCredentials() {
    if (document.getElementById("inputUserName").value == "tswed" &&
        document.getElementById("inputPassword").value == "crossway1300") {
        return true;
    } else {
        alert("Incorrect UserName/Password, please try again");
        return false;
    }
}
