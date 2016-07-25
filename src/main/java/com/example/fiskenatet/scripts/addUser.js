$(document).ready(function () {
    var rootURL ='http://localhost:8091/api';
    var userUserName;
    var userPassword;
    
    document.getElementById('payPalName').style.display ="none";

    $(document).on("click", "#regForm", function(){
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

    $('#btnAddUser').click(function () {
        console.log("klick!");
        var password = document.getElementById("tfPassword").value;
        var repeatPassword = document.getElementById("tfPasswordRepeat").value;
        var userName = document.getElementById("tfUserName").value;
        
        if(hasWhiteSpace(password)) {
            alert("lösenord får ej innehålla mellanslag");
        }else if(hasWhiteSpace(userName)){
            alert("Användarnamn får ej innehålla mellanslag");
        }else if(password == repeatPassword && password.length < 5){
            alert("För kort lösenord, lösenordet ska innehålla minst 5 tecken");
        }else if(password != repeatPassword) {
            alert("Lösenorden stämmer ej överrens");
        }else if(password == repeatPassword && password.length >= 5){
            console.log("pass ok");
            //TODO: make check lösenord-längd
            addUser();
        }else {
            alert("seriöst, försök i alla fall.");
        }
    });

    function hasWhiteSpace(s) {
        return/\s/g.test(s);
    }

    function checkResult(result) {
        if(result == "OK"){
            moveMe();
        }else{
            alert(result)
        }
    }
    
    function addUser(){
        console.log("in addUser");
        $.ajax({
            type: 'POST',
            contentType:'application/json; charset=UTF-8',
            url: rootURL + '/users/',
            data: formToJSON(),
            success: function (data, textStatus, jgXHR) {
                console.log("GREAT SUCCESS!");
                checkResult(data);

            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("send Error " +textStatus + "  " + errorThrown);
            }
        })
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
            "postCode": $('#tfPostCode').val(),
            "paymentMethod": payment,
            "payPalUserName": payPalUsername
            /*"startDate": startDate*/
        });
        console.log("i f2j: " + user);
        return user;
    }

    function moveMe() {
        console.log("i move me");
        location.href = "../webcontent/index.html"

    }
    $('#btnLogIn').click(function () {
        console.log("KLICK LOGIN!");
        userUserName = $('#UserUserName').val();
        userPassword = $('#UserPassword').val();
        console.log(userUserName);
        getUserByUserName();
    });

    function getUserByUserName() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/username/' + userUserName ,
            success: function (data, textStatus, jgXHR) {
                console.log("i sucess" + data.password);
                logInValidation(data);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                alert("Användarnamnet hittas inte");
            }
        });
    }

    function logInValidation(foundUser) {
        console.log("i validation");
        if(foundUser.password == userPassword){
            console.log("Log in success" + foundUser.firstName);
            sessionStorage.setItem('currentUser', foundUser.id);
            sessionStorage.setItem('currentUserName', foundUser.userName)
            location.href = "../webcontent/index.html"
        }else{
            alert("Fel lösenord!");
            //MAKE ALERT FEL PASS
        }
    }

});