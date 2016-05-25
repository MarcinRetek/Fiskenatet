
$(document).ready(function () {
    var rootURL = 'http://localhost:8091/api';
    var currentUserName;
    var userUserName;
    var userPassword;
    var listOfBids;
    

    checkCategory();
    //getAllProducts();
    checkIfLoggedIn();
    
    //TIMECHECKER
    window.setInterval(function(){
        var currentTime = new Date();
        if(currentTime.getHours()==16 && currentTime.getMinutes()==11){
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


    function checkCategory() {
        document.getElementById("productList").innerHTML = "";
        var category = document.getElementById("selectCategory");
        var categoryChoice = category.options[category.selectedIndex].value;
        if(categoryChoice == 0){
            getAllProducts();
        }else{
            getProductByCategory(categoryChoice);
        }
    }
    
    function checkIfLoggedIn() {
        if(sessionStorage.getItem('currentUser') != null){
            /*användare inloggad*/
            currentUserName = sessionStorage.getItem('currentUserName');
            document.getElementById("lnkAddProduct").style.display = "inline-block";
            document.getElementById("lnkProfile").style.display = "inline-block";
            document.getElementById("lnkLogOut").style.display = "inline-block";
            document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;

            document.getElementById("lnkLogIn").style.display = "none";
            document.getElementById("lnkRegUser").style.display = "none";
        }else{
            document.getElementById("lnkAddProduct").style.display = "none";
            document.getElementById("lnkProfile").style.display = "none";
            document.getElementById("lnkLogOut").style.display = "none";
            

            document.getElementById("lnkLogIn").style.display = "inline-block";
            document.getElementById("lnkRegUser").style.display = "inline-block";
        }
    }

    $('#selectCategory').change(function () {
        checkCategory();
    });


    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.reload();
    });
    
    $('#btnSearch').click(function () {

        console.log("KLICK SÖK!");
        var searchString = document.getElementById("tfSearch").value;
        if(searchString === "") {
            alert("Skriv något i sökfältet");
        }else{
            document.getElementById("productList").innerHTML = "";
            searchProduct(searchString);
        }
    });

    function searchProduct(searchString) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/productsearch/' + searchString,
            success: function (data, textStatus, jgXHR) {
                populateProductList(data);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }
    
    function getProductByCategory(categoryChoice) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/category/notsold/' + categoryChoice,
            success: function (data, textStatus, jgXHR) {
                populateProductList(data);
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }
    
    function getAllProducts() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/productissold/no',
            success: function (data, textStatus, jgXHR) {
                populateProductList(data);

            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("getAllProducts error: " + textStatus);
            }
        });
    }

    function populateProductList(allProducts) {
        $products = $('#productList');

        var productString = "";
        var smallLimit = 90;

        if (allProducts.length < 1) {
            productString += '<br><p>Hittade inga annonser</p>';
        }else{
            for (i = 0; i < allProducts.length; i++) {
                console.log("i productlistan");
                listOfBids = allProducts[i]['listOfBids'];
                var endDate = new Date(allProducts[i].endDate).toLocaleDateString(navigator.language, {hour: '2-digit', minute:'2-digit'});
                var description = allProducts[i].description;

                productString += '<div class="product"><a href="#" class="productLink" data-value="' + allProducts[i].id + '"><div class = "col-sm-8">';
                productString += '<div><img src="' + allProducts[i].image + '" class="image"></div>';
                productString += '<div class="productText"><h3>' + allProducts[i].title + '</h3>';
                productString += '<p class="description">' + description.substr(0, smallLimit) + '...' + '</p></div></a></div>';
                productString += '<div class="col-sm-4" id="productInfoDiv"><p class="endDate">Slutdatum: <br>' + endDate + '</p>';

                if (listOfBids.length != 0) {
                    listOfBids.sort(function (a, b) {
                        return b.amount - a.amount;
                    });
                    productString += '<p class="highestBid">Högsta Bud:<br>' + listOfBids[0].amount + " kr" + '</p>';
                } else {
                    productString += '<p class="highestBid">Högsta Bud:<br>' + 0 + " kr" + '</p>';
                }
                if (allProducts[i].buyNowPrice != 0) {
                    productString += '<p class="buyNowPrice">Köp Nu:<br>' + allProducts[i].buyNowPrice + " kr" + '</p>';
                } else {
                    productString += '<p class="buyNowPrice"><br><br>';
                }
                productString += '</div></div>';
            }
        }
        $products.append(productString);
    }
    
    $(document).on("click", ".productLink", function () {
        console.log("click");
        var currentProductId = $(this).data("value");
        sessionStorage.setItem('currentProductId', currentProductId);
        console.log(currentProductId);
        location.href = '../webcontent/productDetails.html';
    })

    $('#btnLogIn').click(function () {
        console.log("KLICK LOGIN!");
        userUserName = $('#UserUserName').val();
        userPassword = $('#UserPassword').val();

        userUserName = userUserName.replace(/\s+/g, '');
        userPassword = userPassword.replace(/\s+/g, '');

        if(userUserName==""||userPassword==""){
            alert("Något fält är ej ifyllt");
        }else {
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
            sessionStorage.setItem('currentUserName', foundUser.userName);
            location.reload();
        }else{
            alert("fel lösenord");
        }
    }
});

