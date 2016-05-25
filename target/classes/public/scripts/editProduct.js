CheckIfLoggedIn();

function CheckIfLoggedIn() {
    currentUserID = sessionStorage.getItem("currentUser");
    if(currentUserID == null){
        location.href="../webcontent/index.html";
    }
}

$(document).ready(function() {
    var rootURL = 'http://localhost:8091/api';
    var currentProductID = sessionStorage.getItem('productToEdit');
    var currentProduct;
    var imageString = "";
    
    imageOptions();

    var currentUserName = sessionStorage.getItem('currentUserName');
    document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;
    
    
    getProduct();

    $(document).on("click", "#imageDiv", function () {
        imageOptions();
    });

    function imageOptions() {

        if(document.getElementById('imageOptionUrl').checked){
            document.getElementById("tfProductImage").style.display = "inline-block";
            document.getElementById("selectImage").style.display = "none";
        }else if(document.getElementById('imgOptionSelect').checked){
            document.getElementById("tfProductImage").style.display = "none";
            document.getElementById("selectImage").style.display = "inline-block";
        }
    }

    $('#btnUpdateProduct').click(function () {
        console.log("button clicked");
        updateProduct();
        return false;
    });

    function getProduct() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductID,
            success: function (data, textStatus, jgXHR) {
                currentProduct = data;
                updateForm();
            },
            error: function(jgXHR, textStatus, errorThrown) {
                //alert('getCustomer error: ' + textStatus);
                console.log("getCustomer error: " + textStatus);
            }
        });
    }

    function updateForm() {
        $image = $('#previewImage');

        imageString +='<img id="previewImage" src="' + currentProduct['image'] + '">';
        document.getElementById("tfProductTitle").value = currentProduct['title'];
        if(currentProduct['image'].includes("../resources/")){
            document.getElementById("tfProductImage").value = "";
        }else{
            document.getElementById("tfProductImage").value = currentProduct['image']
        }
        document.getElementById("tfDescription").value = currentProduct['description'];
        document.getElementById("tfStartPrice").value = currentProduct['startPrice'];
        document.getElementById("tfBuyNow").value = currentProduct['buyNowPrice'];

        $image.append(imageString);
    }

    function checkResult(result) {
        if(result == "OK"){
            location.href="../webcontent/index.html";
        }else{
            alert(result)
        }
    }

    function updateProduct() {
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            url: rootURL + '/products/' + currentProductID,
            data: formToJSON(),
            success: function (data, textStatus, jgXHR) {
                console.log("success");
                checkResult(data);
                sessionStorage.removeItem("productToEdit");

            },
            error: function(jgXHR, textStatus, errorThrown) {
                console.log("editProduct error: " + textStatus);
            }
        });
    }



    function formToJSON() {
        var newImage;
        if(document.getElementById('imageOptionUrl').checked){
            newImage = document.getElementById("tfProductImage").value;
        }else{
            newImage = $("#selectImage option:selected").val();
        }
        var product = JSON.stringify({

            "category" : $( "#selectCategory option:selected" ).val(),
            "title": $('#tfProductTitle').val(),
            "image": newImage,
            "description": $('#tfDescription').val(),
            "startPrice": $('#tfStartPrice').val(),
            "buyNowPrice": $('#tfBuyNow').val(),

        });
        console.log(product);
        return product;
    }

    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.href="../webcontent/index.html";
    });
});
