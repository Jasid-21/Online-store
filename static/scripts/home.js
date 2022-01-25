const username_value = document.getElementById("username_value");
const search_form = document.getElementById("search-form");

search_form.addEventListener('submit', function(e){
    e.preventDefault();

    const formData = new FormData(search_form);
    var http = new XMLHttpRequest();
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            alert("Done!");
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    http.send(formData);
});


//FNCTIONS.
function more_info(button){
    const id = button.parentNode.parentNode.getAttribute("data-article_id");
    window.location.replace("/moreInfo?article_id=" + id);
}

function addToCart(button){
    const id = button.parentNode.parentNode.getAttribute("data-article_id");
    var http = new XMLHttpRequest();
    http.open("POST", "/mycart?article_id=" + id);
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                makeVisible("my-done-message");
            }else{
                alert(resp.message);
            }
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    http.send(null);
}