/**
 * Created by Marcin Retek on 2016-05-20.
 */
$(document).ready(function () {

    var rootURL = 'http://localhost:8091/api';
    var userUserName;
    var userPassword;
    var currentUserID = sessionStorage.getItem('currentUser');
    var currentProductId = sessionStorage.getItem('currentProductId');
    var currentUserName = sessionStorage.getItem('currentUserName');
    var listOfBids;
    var currentProduct;

    checkIfLoggedIn();
    
    // MENU BUTTONS & FUNCTIONS
    
    $(document).on("click", "#lnkProfile", function () {
        location.href="../webcontent/userProfile.html";
    });
    
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
            location.reload();
        }else{
            alert("Fel lösenord!");
            //MAKE ALERT FEL PASS
        }
    }
    
    
    function checkIfLoggedIn() {
        if(currentUserID != null){
            /*användare inloggad*/
            document.getElementById("lnkAddProduct").style.display = "inline-block";
            document.getElementById("lnkProfile").style.display = "inline-block";
            document.getElementById("lnkLogOut").style.display = "inline-block";
            document.getElementById("lnkRegUser").style.display = "none";
            document.getElementById("lnkLogIn").style.display = "none";
            document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;
            
        }else{
            document.getElementById("lnkAddProduct").style.display = "none";
            document.getElementById("lnkProfile").style.display = "none";
            document.getElementById("lnkLogOut").style.display = "none";
            document.getElementById("lnkRegUser").style.display = "inline-block";
            document.getElementById("lnkLogIn").style.display = "inline-block";
            document.getElementById('lnkProfileUserName').innerHTML = "";
        }
    }

// MENU BUTTONS & FUNCTIONS END
    
    // BIDLIST START

    getProductDetails();
    function getProductDetails() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductId,
            success: function (data, textStatus, jgXHR) {
                sortBidList(data, function (listOfBids) {
                    currentProduct = data;
                    populateBidList(listOfBids);
                    
                });
               

            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }

    function sortBidList(currentProduct, callBack) {
        listOfBids = currentProduct['listOfBids'];
        if(listOfBids.length != 0){
            listOfBids.sort(function (a, b) {
                return b.amount - a.amount;
            });
        }
        callBack(listOfBids);
    }
    
    function populateBidList(listOfBids) {
        $bids = $('#bidList');
        var bidString = "";

        for(i=0; i<listOfBids.length; i++){
            var bidDate = new Date(listOfBids[i].bidDate);
            bidString += '<div class="row">';
            bidString += '<div class="col-sm-4">' + '<p>' + listOfBids[i].bidderUserName+ ' </p></div>'
            bidString += '<div class="col-sm-4">' + '<p>' + listOfBids[i].amount + '</p></div>'
            bidString += '<div class="col-sm-4">' + '<p>' + bidDate.toLocaleString() + '</p></div></div>'
        }
        $bids.append(bidString);
        
    }
    
    // BIDLIST ENDS HERE   
    
});