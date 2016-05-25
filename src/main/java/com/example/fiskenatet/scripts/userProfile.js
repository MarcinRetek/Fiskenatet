var rootURL = 'http://localhost:8091/api';
var currentUserID;
var currentProductId = sessionStorage.getItem('currentProductId');
var currentUserName;
var currentUser;
var productToConfirmAsSold;


CheckIfLoggedIn();
function CheckIfLoggedIn() {
    currentUserID = sessionStorage.getItem("currentUser");
    currentUserName = sessionStorage.getItem('currentUserName');
    if(currentUserID == null){
        location.href="../webcontent/index.html";
    }
}

$(document).ready(function () {

    document.getElementById('buyerRatingDiv').style.display = 'none';

//TIMECHECKER
    window.setInterval(function(){
        var currentTime = new Date();
        if(currentTime.getHours()==16 && currentTime.getMinutes()==00){
            setTimeout(function () {
                moveExpiredAuctions();
            }, 60000);
        }
    }, 5000);


    function moveExpiredAuctions() {
        console.log("Dagens auktioner avslutade!");
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/endofday',
            success: function (data, textStatus, jgXHR) {
                location.reload();
            }
        });
    }

//TIMECHECKER END

// MENU BUTTONS & FUNCTIONS

    getUserById(function (currentUser) {
        checkCategory();
        document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;
    });

    function getUserById(callback) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/users/' + currentUserID,
            success: function (data, textStatus, jgXHR) {
                currentUser = data;
                callback(data);
                populateUserInfo();
                populateUserProducts(currentUser['listOfProducts']);
            }
        });
    }

    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.href="../webcontent/index.html";
    });

    $(document).on("click", "#selectCategory", function () {
        checkCategory();
    });

    function checkCategory() {

        var category = document.getElementById("selectCategory");
        var categoryChoice = category.options[category.selectedIndex].value;
        if(categoryChoice == 0){
            console.log("ingen kategori vald");
            populateUserProducts(currentUser['listOfProducts']);
        }else{
            console.log("kategori vald " + categoryChoice);
            listCategory(categoryChoice);
        }
    }

    function listCategory(categoryChoice) {
        console.log("I listcategory");
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/byownerandcategory/' + categoryChoice + "/" + currentUserID,
            success: function (data, textStatus, jgXHR) {
                populateUserProducts(data);
            },
            error: function(jgXHR, textStatus, errorThrown) {
                //alert('getCustomer error: ' + textStatus);
                console.log("ListCategory error: " + textStatus);
            }
        });
    }


    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.href="../webcontent/index.html";
    });

// MENU BUTTONS & FUNCTIONS END

// USER BUTTONS & FUNCTIONS

    function populateUserInfo() {
        document.getElementById('upUserName').innerHTML =currentUser.userName;
        document.getElementById('upFirstName').innerHTML =currentUser.firstName;
        document.getElementById('upLastName').innerHTML =currentUser.lastName;
        document.getElementById('upEmail').innerHTML =currentUser.email;
        document.getElementById('upMobileNumber').innerHTML =currentUser.mobileNumber;
        document.getElementById('upAddress').innerHTML = currentUser.address + " " + currentUser.postCode;
        getUserPaymentMethod();
        checkUserSellerRating();
        checkUserBuyerRating();
    }
    function getUserPaymentMethod(){
        var userPayment = currentUser.paymentMethod;
        switch (userPayment){
            case 1:
                document.getElementById('upPayment').innerHTML = "Swish";
                break;
            case 2:
                document.getElementById('upPayment').innerHTML = "PayPal";
                break;
            case 3:
                document.getElementById('upPayment').innerHTML = "Swish eller PayPal";
                break;
        }
    }

    function checkUserSellerRating() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + "/users/getsellerrating/" + currentUserID,
            success: function (data, textStatus, jgXHR) {
                console.log("sellerRating:" + data);
                populateUserSellerRating(data);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("GetSellerRating error: " + textStatus);
            }
        });
    }

    function populateUserSellerRating(sellerRating) {
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
                document.getElementById("sellerRatingStar").innerHTML="Inget säljarbetyg";
        }
    }



    function checkUserBuyerRating() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + "/users/getbuyerrating/" + currentUserID,
            success: function (data, textStatus, jgXHR) {
                console.log("buyerRating:" + data);
                populateUserBuyerRating(data);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("GetBuyerRating error: " + textStatus);
            }
        });
    }

    function populateUserBuyerRating(buyerRating) {
        switch (buyerRating){
            case "1":
//★★★★★★★★★★★★★★★
                document.getElementById("buyerRatingStar").innerHTML="★";
                break;
            case "2":
                document.getElementById("buyerRatingStar").innerHTML="★★";
                break;
            case "3":
                document.getElementById("buyerRatingStar").innerHTML="★★★";
                break;
            case "4":
                document.getElementById("buyerRatingStar").innerHTML="★★★★";
                break;
            case "5":
                document.getElementById("buyerRatingStar").innerHTML="★★★★★";
                break;
            default:
                document.getElementById("buyerRatingStar").innerHTML="Inget Köparbetyg";
                break;
        }
    }

    $(document).on("click", "#btnDeleteUser", function () {
        checkUserForActiveAuctions();

    });

    function checkUserForActiveAuctions() {
        if(currentUser['listOfProducts'].length == 0){
            deleteUser();
        }else{
            alert("Det går inte att ta bort ett konto med aktiva auktioner!");
        }
    }

    function deleteUser() {
        $.ajax({
            type: 'DELETE',
            contentType: 'application/json',
            url: rootURL + '/users/' + currentUserID,
            success: function (data, textStatus, jgXHR) {
                sessionStorage.removeItem('currentUser');
                location.href="../webcontent/index.html";
            }
        });
    }

// USER BUTTONS & FUNCTIONS END

// PRODUCTS BUTTONS & FUNCTIONS

    //THE HORROR

    function getCategory(product) {
        var category = product.category;
        switch (category){
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

    function populateUserProducts(listOfProducts) {
        document.getElementById('productList').innerHTML = "";
        $products = $('#productList');
        var productString="";
        var smallLimit = 90;
        for(i = 0; i < listOfProducts.length; i++){
            var startDate = new Date(listOfProducts[i].startDate);
            var endDate = new Date(listOfProducts[i].endDate);
            var isSold = listOfProducts[i].isSold;
            listOfBids = listOfProducts[i]['listOfBids'];
            var productCategory = getCategory(listOfProducts[i]);

            productString+='<div class="OwnerProductObject"><div class="row"><div class="col-sm-4">';
            productString+='<img class="col-sm-12" src="' + listOfProducts[i].image + '">';
            productString+='</div><div class="col-sm-8">';
            productString+='<h3 id="ownerProductTitle">' + listOfProducts[i].title + '</h3>';
            productString+='<p class="ownerProductDescription">' + listOfProducts[i].description + '</p>';
            productString+='</div></div><div class="row"><div class="col-sm-6">';
            productString+='<p id="ownerProductStartDate">Datum tillagt: <br>' + startDate.toLocaleDateString(navigator.language, {hour: '2-digit', minute: '2-digit'}) + '</p>';
            productString+='<p id="ownerProductEndDate">Slutdatum: <br>' + endDate.toLocaleDateString(navigator.language, {hour: '2-digit', minute: '2-digit'}) + '</p>';
            productString+='<p id="ownerProductCategory">Kategori: <br>' + productCategory + '</p>';
            productString+='</div><div class="col-sm-6">';
            productString+='<p id="ownerProductTotalBids">Totalt antal bud: <br>' + listOfProducts[i].listOfBids.length + '</p>';

            if(listOfBids.length != 0){
                listOfBids.sort(function (a, b) {
                    return b.amount - a.amount;
                });

                productString+='<p id="ownerProductHighestBid">Högsta bud: <br>' +  listOfBids[0].amount + " kr"  + '</p>';
            }else{
                productString+='<p id="ownerProductHighestBid">Högsta bud: <br>' +  "0 kr" + '</p>';
            }

            productString+='<p id="ownerProductBuyNowPrice">Utköpspris: <br>' + listOfProducts[i].buyNowPrice + " kr" + '</p>';
            productString+='</div></div><div class="row"><div class="col-sm-4">';
            productString+='<a id="lnkEditProduct" href="#" data-value="'+ listOfProducts[i].id +'">Redigera annons</a>';
            productString+='</div><div class="col-sm-4">';
            productString+='<a id="lnkDeleteProduct"href="#" data-value="'+ listOfProducts[i].id +'">Ta bort annons</a></div>';
            if(isSold == "yes"){
                productString+='<div class="col-sm-4">';
                productString+='<p id="confirmPurchase" data-id="'+ listOfProducts[i].id +'" data-value="'+ listOfProducts[i].title +'" data-target="#buyerRatingDiv">Bekräfta köp</p></div>';
            }
            productString+='</div></div></div>';
        }
        $products.append(productString);
    }

    $(document).on("click", "#confirmPurchase", function () {
        document.getElementById('buyerRatingDiv').style.display = 'block';
        var productTitle = $(this).data("value");
        var productID = $(this).data("id");
        document.getElementById("titleToConfirm").innerHTML = productTitle;
        productToConfirmAsSold = productID;
    });


    $(document).on("click", "#lnkEditProduct", function () {
        console.log("click, i editProduct");
        var currentProductID = $(this).data("value");
        getProductById(currentProductID, function(currentProduct){
            if(currentProduct['listOfBids'].length == 0){
                sessionStorage.setItem("productToEdit", currentProductID);
                location.href="../webcontent/editProduct.html"
            }else{
                alert("Misslyckades, Man kan inte uppdatera en annons någon budat på!");
            }
        });
    });

    $(document).on("click", "#lnkDeleteProduct", function () {
        console.log("click, i deleteproduct");
        var currentProductID = $(this).data("value");

        getProductById(currentProductID, function(currentProduct){
            if(currentProduct['listOfBids'].length == 0){
                deleteProduct(currentProduct.id);
            }else{
                alert("Misslyckades, Man kan inte ta bort en annons någon budat på!");
            }
        });
    });

    function deleteProduct(currentProductId) {
        $.ajax({
            type: 'DELETE',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductId,
            success: function (data, textStatus, jgXHR) {
                console.log("deleteProduct: " + data);
                sessionStorage.removeItem('currentProductId');
                location.reload();
            }
        });
    }

    $(document).on("click", "#lnkSetProductAsSold", function () {
        console.log("click lnkSetProductAsSold, product: " + productToConfirmAsSold);
        document.getElementById('buyerRatingDiv').style.display = 'none';
        getProductById(productToConfirmAsSold, function (currentProduct) {
            setBuyerRating(currentProduct);
            moveSoldProductToHistory(currentProduct);
        })
    });

    function getProductById(currentProductId, callBack) {
        console.log("i getProductById() " + currentProductId);
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductId,
            success: function (data, textStatus, jgXHR) {
                callBack(data);
            }
        });
    }

    function moveSoldProductToHistory(currentProduct){
        console.log("in moveSoldProductToHistory");
        console.log(currentProduct);
        $.ajax({
            type: 'POST',
            contentType:'application/json',
            url: rootURL + '/products/addtohistory/' +currentProduct.id,
            success: function (data, textStatus, jgXHR) {
                console.log("GREAT SUCCESS!");
                location.reload();
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("send Error " +textStatus + "  " + errorThrown);
            }
        })
    }


// PRODUCTS BUTTONS & FUNCTIONS END

// BUYER RATING

    function setBuyerRating(currentProduct) {
        var buyerRating = $("input[type='radio'][name='rating']:checked").val();
        console.log("setBuyerRating " + buyerRating);
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: buyerRatingURL(currentProduct),
            data:buyerRating,
            success: function (data, textStatus, jgXHR) {
                console.log("Buyer rating put:" + buyerRating);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("setBuyerRating error: " + textStatus);
            }
        });
    }

    function buyerRatingURL(currentProduct) {

        var bidList = currentProduct['listOfBids'];
        bidList.sort(function (a, b) {
            return b.amount - a.amount;
        });
        var ratingURL = 'http://localhost:8091/api/users/setbuyerrating/' + bidList[0].bidder;
        console.log(ratingURL);
        return ratingURL;
    }

//BUYER RATING END

//SELLER RATING
//TODO: FLYTTA SELLER RATING HIT!
//SELLER RATING END
});