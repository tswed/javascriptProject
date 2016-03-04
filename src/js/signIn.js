/**
 * Created by tswed on 3/2/16.
 */

window.onload = startSignInForm;

function startSignInForm() {
    document.forms["signIn"].onsubmit = checkSignInCredentials;
}

function checkSignInCredentials() {
    alert("try again");
    return false;
}
