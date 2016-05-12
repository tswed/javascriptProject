function writeMCookie(cName, fName, fValue, expDate, cPath, cDomain, cSecure) {
    if (cName && fName && fValue != "") {
        //Create the subkey
        var subkey = fName + "=" + encodeURI(fValue);

        //Retrieve the current cookie value
        var cValue = null;
        var cookiesArray = document.cookie.split("; ");

        for (var i = 0; i < cookiesArray.length; i++) {
            if (cookiesArray[i].split("=")[0] == cName) {
                var valueIndex = cookiesArray[i].indexOf("=") + 1;
                cValue = cookiesArray[i].slice(valueIndex);
                break;
            }
        }

        if (cValue) {
            var fieldExists = false;
            var cValueArray = cValue.split("&");
            for (var k = 0; k < cValueArray.length; k++) {
                if (cValueArray[k].split("=")[0] == fName) {
                    fieldExists = true;
                    cValueArray[k] = subkey;
                    break;
                }
            }

            if (fieldExists) cValue = cValueArray.join("&");
            else cValue += "&" + subkey;
        } else {
            cValue = subkey;
        }

        var cString = cName + "=" + cValue;

        if (expDate) cString += ";expires=" + expDate.toGMTString();
        if (cPath) cString += ";path=" + cPath;
        if (cDomain) cString += ";domain=" + cDomain;
        if (cSecure) cString += ";secure";

        document.cookie = cString;
    }
}

function retrieveMCookie(cName, fName) {
    if (document.cookie) {
        //Retrieve the cookie value
        var cValue = null;
        var cookiesArray = document.cookie.split("; ");

        for (var i = 0; i <cookiesArray.length; i++) {
            if (cookiesArray[i].split("=")[0] == cName) {
                var valueIndex = cookiesArray[i].indexOf("=") + 1;
                cValue = cookiesArray[i].slice(valueIndex);
            }
        }

        //Retrieve the field value within the cookie
        if (cValue) {
            var cValueArray = cValue.split("&");
            for (var k = 0; k < cValueArray.length; k++) {
                if (cValueArray[k].split("=")[0] == fName) {
                    return decodeURI(cValueArray[k].split("=")[1]);
                }
            }
        }
    }
}
