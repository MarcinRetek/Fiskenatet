var rootURL ='http://localhost:8091/api';
var sellerid;
var currentUserName;

CheckIfLoggedIn();
function CheckIfLoggedIn() {
    sellerid = sessionStorage.getItem("currentUser");
    currentUserName = sessionStorage.getItem('currentUserName');
    if(sellerid == null){
        location.href="../webcontent/index.html";
    }
}

$(document).ready(function () {

    
    imageOptions();


    setUp();


    function setUp() {
            document.getElementById("lnkProfile").style.display = "inline-block";
            document.getElementById("lnkLogOut").style.display = "inline-block";
            document.getElementById('lnkProfileUserName').innerHTML = "Inloggad som: " + currentUserName;

    }

    $(document).on("click", "#lnkProfile", function () {
        location.href="../webcontent/userProfile.html";
    });


    $(document).on("click", "#imageDiv", function () {
        imageOptions();
    });

    function imageOptions() {

        if(document.getElementById('imageOptionUrl').checked){
            document.getElementById("txtImgUrl").style.display = "inline-block";
            document.getElementById("selectImage").style.display = "none";
        }else if(document.getElementById('imgOptionSelect').checked){
            document.getElementById("txtImgUrl").style.display = "none";
            document.getElementById("selectImage").style.display = "inline-block";
        }
    }

    $('#btnAddProduct').click(function () {
        console.log("klick!");
        addProduct();
    });


    $(document).on("click", "#lnkLogOut", function () {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUserName');
        location.href="../webcontent/index.html";
    });


    function checkResult(result) {
        if(result == "OK"){
            location.href="../webcontent/index.html";
        }else{
            alert(result)
        }

    }

    function addProduct(){
        console.log("in addProd");
        $.ajax({
            type: 'POST',
            contentType:'application/json',
            url: rootURL + '/products',
            data: formToJSON(),
            success: function (data, textStatus, jgXHR) {
                checkResult(data);
                console.log("GREAT SUCCESS!");
            },
            error: function (jgXHR, textStatus, errorThrown) {
                console.log("send Error " +textStatus + "  " + errorThrown);
            },
        })
        
    }
    
    function formToJSON() {
        console.log("i form to json");
        var startDate = new Date();
        var endDate = new Date();
        var image;


        /*
        * Sätter sluttiden för auktionen till 16:00 samma dag om nya produkten läggs till före kl15:00.
        * Om den nya produkten skapas efter kl15:00 sätts sluttiden till 16:00 nästa dag.
        */
        if(startDate.getHours() < 15) {
            endDate.setDate(startDate.getDate());
            endDate.setHours(16);
            endDate.setMinutes(0);
            endDate.setSeconds(0);
        } else {
            endDate.setDate(startDate.getDate() +1);
            endDate.setHours(16);
            endDate.setMinutes(0);
            endDate.setSeconds(0);
        }


        if(document.getElementById('imageOptionUrl').checked){
            image = document.getElementById("txtImgUrl").value;
        }else{
            image = $("#selectImage option:selected").val();
        }

        console.log("startdate: " + startDate.toLocaleString() + " enddate: " + endDate.toLocaleString());
        var product = JSON.stringify({

            "category" : $( "#selectCategory option:selected" ).val(),
            "title": $('#txtProductTitle').val(),
            "image": image,
            "description": $('#txtDescription').val(),
            "startPrice": $('#txtStartPrice').val(),
            "buyNowPrice": $('#txtBuyNow').val(),
            "owner": {'id' : sellerid},
            "startDate": startDate,
            "endDate": endDate
        });
        console.log(product);
        return product;
    }
});

