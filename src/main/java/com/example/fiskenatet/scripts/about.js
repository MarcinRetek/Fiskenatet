$(document).ready(function () {
    var rootURL = 'http://localhost:8091/api';
    var userUserName;
    var userPassword;
    
    checkIfLoggedIn();
    function checkIfLoggedIn() {
        var currentUserName = sessionStorage.getItem('currentUserName');

        if (sessionStorage.getItem('currentUser') != null) {
            /*användare inloggad*/
            document.getElementById("lnkAddProduct").style.display = "inline-block";
            document.getElementById("lnkProfile").style.display = "inline-block";
            document.getElementById("lnkLogOut").style.display = "inline-block";
            document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;

            document.getElementById("lnkLogIn").style.display = "none";
            document.getElementById("lnkRegUser").style.display = "none";
        } else {
            document.getElementById("lnkAddProduct").style.display = "none";
            document.getElementById("lnkProfile").style.display = "none";
            document.getElementById("lnkLogOut").style.display = "none";

            document.getElementById("lnkLogIn").style.display = "inline-block";
            document.getElementById("lnkRegUser").style.display = "inline-block";
        }
        
    }
    
    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.reload();
    });
    
    $('#btnLogIn').click(function () {
        console.log("KLICK LOGIN!");
        userUserName = $('#UserUserName').val();
        userPassword = $('#UserPassword').val();

        userUserName = userUserName.replace(/\s+/g, '');
        userPassword = userPassword.replace(/\s+/g, '');

        if (userUserName == "" || userPassword == "") {
            alert("Något fält är ej ifyllt");
        } else {
            getUserByUserName();
        }
    });

    function getUserByUserName() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/username/' + userUserName,
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
        if (foundUser.password == userPassword) {
            console.log("Log in success" + foundUser.firstName);
            sessionStorage.setItem('currentUser', foundUser.id);
            sessionStorage.setItem('currentUserName', foundUser.userName);
            location.reload();
        } else {
            alert("fel lösenord");
        }
    }
});