var rootURL = 'http://localhost:8091/api';
var currentUserID;
var currentUser;
var currentUserName;

CheckIfLoggedIn();
function CheckIfLoggedIn() {
    currentUserID = sessionStorage.getItem("currentUser");
    if(currentUserID == null){
        location.href="../webcontent/index.html";
    }
}

$(document).ready(function(){

    currentUserName = sessionStorage.getItem('currentUserName');
    document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;

    document.getElementById('payPalName').style.display ="none";

    $(document).on("click", "#editUserForm", function(){
        payMentOption();
    });
    function payMentOption() {
        if(document.getElementById('payWithSwish').checked){
            document.getElementById('payPalName').style.display ="none";
        }else if(document.getElementById('payWithPaypal').checked){
            document.getElementById('payPalName').style.display ="inline-block";
        }else if(document.getElementById('payWithEither').checked) {
            document.getElementById('payPalName').style.display = "inline-block";
        }
    }
    
    getUser();

    $('#btnUpdateUser').click(function () {
        console.log("button clicked");
        var password = document.getElementById("tfPassword").value;
        var repeatPassword = document.getElementById("tfPasswordRepeat").value;
        var userName = document.getElementById("tfUserName").value;

        if(hasWhiteSpace(password)) {
            alert("lösenord får ej innehålla mellanslag");
        }else if(hasWhiteSpace(userName)){
            alert("Användarnamn får ej innehålla mellanslag");
        }else if(password == repeatPassword && password.length < 5){
            alert("För kort lösenord");
        }else if(password != repeatPassword) {
            alert("Lösenorden stämmer ej överrens");
        }else if(password == repeatPassword && password.length >= 5){
            console.log("pass ok");
            updateUser();
        }else {
            alert("seriöst, försök i alla fall.");
        }
        return false;
    });

    function hasWhiteSpace(s) {
        return/\s/g.test(s);

    }

    function getUser() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/users/' + currentUserID,
            success: function (data, textStatus, jgXHR) {
                currentUser = data;
                updateForm();
            },
            error: function(jgXHR, textStatus, errorThrown) {
                console.log("getUser error: " + textStatus);
            }
        });
    }

    function updateForm() {
        document.getElementById("tfFirstName").value = currentUser['firstName'];
        document.getElementById("tfLastName").value = currentUser['lastName'];
        document.getElementById("tfUserName").value = currentUser['userName'];
        document.getElementById("tfEmail").value = currentUser['email'];
        document.getElementById("tfMobileNumber").value = currentUser['mobileNumber'];
        document.getElementById("tfAdress").value = currentUser['address'];
        document.getElementById("tfUpdatePostCode").value = currentUser['postCode'];
        if(currentUser.paymentMethod == 1){
           document.getElementById('payWithSwish').checked = true;
        }else if(currentUser.paymentMethod == 2){
            document.getElementById('payWithPaypal').checked = true;
            document.getElementById('payPalName').style.display ="inline-block";
            document.getElementById('payPalName').value = currentUser['payPalUserName'];
        }else if(currentUser.paymentMethod == 3){
            document.getElementById('payWithEither').checked = true;
            document.getElementById('payPalName').style.display ="inline-block";
            document.getElementById('payPalName').value = currentUser['payPalUserName'];
        }

    }

    function updateUser() {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: rootURL + '/users/' + currentUserID,
            data: formToJSON(),
            success: function (data, textStatus, jgXHR) {
                console.log("success");
                checkResult(data);
            },
            error: function(jgXHR, textStatus, errorThrown) {
                console.log("editUser error: " + textStatus);
            }
        });
    }

    function checkResult(result) {
        if(result == "OK"){
            location.href="../webcontent/userProfile.html";
        }else{
            alert(result);
        }
    }

    function formToJSON() {
        console.log("i form to json");
        var payment;
        var payPalUsername;
        if(document.getElementById('payWithSwish').checked){
            payment = 1;
            payPalUsername = "-";
        }else if(document.getElementById('payWithPaypal').checked){
            document.getElementById('payPalName').style.display ="inline-block";
            payment = 2;
            payPalUsername = document.getElementById('payPalName').value;
        }else if(document.getElementById('payWithEither').checked){
            document.getElementById('payPalName').style.display ="inline-block";
            payment = 3;
            payPalUsername = document.getElementById('payPalName').value;
        }
        var user = JSON.stringify({
            "firstName": $('#tfFirstName').val(),
            "lastName": $('#tfLastName').val(),
            "userName": $('#tfUserName').val(),
            "password": $('#tfPassword').val(),
            "email": $('#tfEmail').val(),
            "mobileNumber": $('#tfMobileNumber').val(),
            "address": $('#tfAdress').val(),
            "postCode": $('#tfUpdatePostCode').val(),
            "paymentMethod": payment,
            "payPalUserName": payPalUsername
        });
        console.log(user);
        return user;
    }
    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.href="../webcontent/index.html";
    });
});
