$(document).ready(function () {

    var rootURL = 'http://localhost:8091/api';
    var userUserName;
    var userPassword;
    var currentUserID = sessionStorage.getItem('currentUser');
    var currentProductId = sessionStorage.getItem('currentProductId');
    var currentUserName = sessionStorage.getItem('currentUserName');
    var owner;
    var listOfBids;
    var currentProduct;

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

            if(currentUserID == owner.id){
                document.getElementById("lnkAddBid").style.display = "none";
                document.getElementById("addBidDetails").style.display = "none";
            }else{
                document.getElementById("lnkAddBid").style.display = "inline-block";
                document.getElementById("addBidDetails").style.display = "inline-block";
            }
        }else{
            document.getElementById("lnkAddProduct").style.display = "none";
            document.getElementById("lnkProfile").style.display = "none";
            document.getElementById("lnkLogOut").style.display = "none";
            document.getElementById("lnkAddBid").style.display = "none";
            document.getElementById("addBidDetails").style.display = "none";
            document.getElementById('buyNowPriceDetails').style.display = "none";
            document.getElementById("lnkRegUser").style.display = "inline-block";
            document.getElementById("lnkLogIn").style.display = "inline-block";
        }
    }

// MENU BUTTONS & FUNCTIONS END

    getProductDetails();
    function getProductDetails() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductId,
            success: function (data, textStatus, jgXHR) {
                currentProduct = data;
                getHighestBid();
                getProductOwner();

            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }

    function getHighestBid() {
        listOfBids = currentProduct['listOfBids'];
        if(listOfBids.length != 0){
            listOfBids.sort(function (a, b) {
                return b.amount - a.amount;
            });
            document.getElementById('highestBidDetails').innerHTML = "Högsta Bud: <br>" +  listOfBids[0].amount + " kr";
        }else{
            document.getElementById('highestBidDetails').innerHTML = "Högsta Bud: <br>" +  0 + " kr";
        }
    }

    function getProductOwner() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/users/' + currentProduct.owner,
            success: function (data, textStatus, jgXHR) {
                owner = data;
                checkIfLoggedIn();
                populateProductDetails();
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }

    function getCategory() {
        var category;
        switch (currentProduct.category){
            case "1":
                category = "Torsk";
                break;
            case "2":
                category = "Makrill";
                break;
            case "3":
                category = "Kolja";
                break;
            case "4":
                category = "Lax";
                break;
            case "5":
                category = "Gråsej";
                break;
            case "6":
                category = "Sill";
                break;
            case "7":
                category = "Vitling";
                break;
            case "8":
                category = "Rödspotta";
                break;
            case "9":
                category = "Skaldjur";
                break;
            case "10":
                category = "Övrigt";
                break;
            default:
                category = "ERROR"
        }
        
        return category;
    }

    function populateProductDetails() {
        var startDate= new Date(currentProduct.startDate).toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        var endDate = new Date(currentProduct.endDate).toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'});
        checkUserSellerRating();

        var productCategory = getCategory();

        document.getElementById('productImage').src = currentProduct.image;
        document.getElementById('productTextDetails').innerHTML  = currentProduct.title;
        document.getElementById('ownerDetails').innerHTML = "Säljs av: " + owner.userName;
        document.getElementById('startDateDetails').innerHTML = "Skapad: " + startDate;
        document.getElementById('categoryDetails').innerHTML = "Kategori: " + productCategory;
        document.getElementById('descriptionDetails').innerHTML = currentProduct.description;
        document.getElementById('endDateDetails').innerHTML = "Slutdatum: <br> " + endDate;
        document.getElementById('lnkAddBid').innerHTML = "Lägg ett bud";
        document.getElementById('startPriceDetails').innerHTML = "Utropspris: <br> " + currentProduct.startPrice + " kr";
        document.getElementById('buyNowPriceDetails').innerHTML = "Köp nu: <br> " + currentProduct.buyNowPrice + " kr";
        if(currentProduct.buyNowPrice == 0||currentUserID == owner.id||currentUserID == null){
            document.getElementById('buyNowPriceDetails').style.display = "none";
        }else if(currentProduct.listOfBids.length !=0){
            if(currentProduct['listOfBids'][0].amount>(currentProduct.buyNowPrice/2)) {
                document.getElementById('buyNowPriceDetails').style.display = "none";
            }else {
                document.getElementById('buyNowPriceDetails').style.display = "inline-block";
            }
        }else{
            document.getElementById('buyNowPriceDetails').style.display = "inline-block";
        }
    }

    function checkUserSellerRating() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + "/users/getsellerrating/" + currentProduct.owner,
            success: function (data, textStatus, jgXHR) {
                populateSellerRating(data);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("GetBuyerRating error: " + textStatus);
            }
        });
    }

    function populateSellerRating(sellerRating) {
        switch (sellerRating){
            case "1":
//★★★★★★★★★★★★★★★
                document.getElementById("sellerRatingStar").innerHTML="★";
                break;
            case "2":
                document.getElementById("sellerRatingStar").innerHTML="★★";
                break;
            case "3":
                document.getElementById("sellerRatingStar").innerHTML="★★★";
                break;
            case "4":
                document.getElementById("sellerRatingStar").innerHTML="★★★★";
                break;
            case "5":
                document.getElementById("sellerRatingStar").innerHTML="★★★★★";
                break;
            default:
                document.getElementById("sellerRatingStar").innerHTML="Inget betyg!";
        }
    }

//Buy Now & Add Bid

    $(document).on("click", "#highestBidDetails", function () {
        location.href="../webcontent/bidHistory.html"
    });
    
    $(document).on("click", "#buyNowPriceDetails", function () {
        location.href="../webcontent/confirmPurchase.html"
    });

    $('#lnkAddBid').click(function () {
        console.log("klick!");
        var startPrice = currentProduct.startPrice;
        var newBid = document.getElementById('addBidDetails').value;
        console.log(newBid);
        try{
            var oldBid = listOfBids[0].amount;
        }catch(Exception){
            oldBid = startPrice -1
        }
        if(newBid > oldBid){
            addBid();
        }else{
            alert("För lågt bud");
        }
    });

    function addBid(){
        console.log("in addBid");
        $.ajax({
            type: 'POST',
            contentType:'application/json',
            url: rootURL + '/bids',
            data: formToJSON(),
            success: function (data, textStatus, jgXHR) {
                console.log("GREAT SUCCESS!");
                location.reload();
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("send Error " +textStatus + "  " + errorThrown);
            }
        })
    }

    function formToJSON() {
        console.log("i form to json");

        var date = new Date();
        var product = JSON.stringify({
            "currentProduct": {'id' : currentProductId},
            "bidder": {'id' : currentUserID},
            "bidderUserName": currentUserName,
            "amount": $('#addBidDetails').val(),
            "bidDate": date
        });
        return product;
    }

//Buy Now & Add Bid END
});