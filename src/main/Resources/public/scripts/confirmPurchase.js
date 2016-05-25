CheckIfLoggedIn();
var rootURL = 'http://localhost:8091/api';
var currentProductId = sessionStorage.getItem('currentProductId');
var currentUserName;
var currentUserID;
var currentProduct;
var owner;
function CheckIfLoggedIn() {
    currentUserID = sessionStorage.getItem("currentUser");
    currentUserName = sessionStorage.getItem("currentUserName");
    if(currentUserID == null){
        location.href="../webcontent/index.html";
    }
}

$(document).ready(function () {

    getProductDetails();
    document.getElementById('swishOption').style.display = 'none';
    document.getElementById('payPalOption').style.display = 'none';
    document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;


    //$(document).on("click", "#btnSwishOption", function () {
        //TODO: funktionalitet för vinst på bud istället för buyout
        
    //});

    $(document).on("click", "#btnConfirmSwish", function () {
        document.getElementById('btnConfirmSwish').disabled = true;
        setSellerRating();
        addBidIfBuyout(function () {
            setProductAsSold();
        });
    });
    
    function addBidIfBuyout(callback) {
        console.log("in addUser");
        $.ajax({
            type: 'POST',
            contentType:'application/json',
            url: rootURL + '/bids',
            data: buyoutBidFormToJSON(),
            success: function (data, textStatus, jgXHR) {
                console.log("GREAT SUCCESS!");

                callback();
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("send Error " +textStatus + "  " + errorThrown);
            },
        })
    }

    function buyoutBidFormToJSON() {
        console.log("i form to json");
        var bidDate = new Date();
        var bid = JSON.stringify({
            "currentProduct": {'id' : currentProductId},
            "bidderUserName": currentUserName,
            "bidder": {'id' : currentUserID},
            "amount": currentProduct.buyNowPrice,
            "bidDate": bidDate

        });
        console.log(bid);
        return bid;
    }
    
    function setSellerRating() {
        var sellerRating = $("input[type='radio'][name='rating']:checked").val();
        console.log("setSellerRating " + sellerRating);
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: rootURL + '/users/setsellerrating/' + currentProduct.owner,
            data:sellerRating,
            success: function (data, textStatus, jgXHR) {
                console.log("Seller rating put:" + sellerRating);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("setSellerRating error: " + textStatus);
            }
        });
        
    }
    
    

    function getProductDetails() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductId,
            success: function (data, textStatus, jgXHR) {
                currentProduct = data;
                getProductOwner();
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getProductDetails error: " + textStatus);
            }
        });
    }

    function getProductOwner() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/users/' + currentProduct.owner,
            success: function (data, textStatus, jgXHR) {
                owner = data;
                getOwnerPaymentInfo();
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }

    function getOwnerPaymentInfo(){
        document.getElementById('purchaseInfo').innerHTML = '<b>' + owner.userName + "'s " + currentProduct.title + '</b>';
        if(owner.paymentMethod == 1){
            document.getElementById('swishOption').style.display = 'inline-block';
            document.getElementById('confirmSwishAmount').innerHTML = currentProduct.buyNowPrice;
            document.getElementById('confirmSwishPhone').innerHTML = owner.mobileNumber;
        }if(owner.paymentMethod == 2){
            document.getElementById('payPalOption').style.display = 'inline-block';
            document.getElementById('payPalLink').href = "https://www.paypal.me/" + owner.payPalUserName + "/" + currentProduct.buyNowPrice;
            document.getElementById('payPalLink').innerHTML = "Länk till " + owner.userName + "'s PayPal";
        }if(owner.paymentMethod == 3){
            document.getElementById('swishOption').style.display = 'block';
            document.getElementById('confirmSwishAmount').innerHTML = currentProduct.buyNowPrice;
            document.getElementById('confirmSwishPhone').innerHTML = owner.mobileNumber;
            document.getElementById('payPalOption').style.display = 'block';
            document.getElementById('payPalLink').href = "https://www.paypal.me/" + owner.payPalUserName + "/" + currentProduct.buyNowPrice;
            document.getElementById('payPalLink').innerHTML = "Länk till " + owner.userName + "'s PayPal";
        }
    }

    function setProductAsSold() {
        document.getElementById('confirmationMessage').innerHTML = '<b>Ditt köp är nu slutfört. Du skickas nu vidare till startsidan</b>';
        console.log("Setting product as sold")
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: rootURL + '/products/issold/' + currentProductId,
            success: function (data, textStatus, jgXHR) {
                console.log("success");
                waitThenReturnHome();
            },
            error: function(jgXHR, textStatus, errorThrown) {
                console.log("setProductAsSold error: " + textStatus);
            }
        });
    }

    function waitThenReturnHome() {
        setTimeout(function () {
            location.href = "../webcontent/index.html";
        }, 1000);
    }

    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.href="../webcontent/index.html";
    });
});