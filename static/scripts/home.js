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
    const parent = button.parentNode.parentNode;
    const article_id = parent.getAttribute("data-article_id");
    console.log(article_id);

    var http = new XMLHttpRequest();
    http.open("GET", "/moreInfo?article_id=" + article_id);
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                const article_info = resp.article_info;
                console.log(article_info);
                const info_displayer = document.getElementById("article-info-displayer");
                const article_info_info = document.getElementById("article-info-info");
                const article_image = document.getElementById("article-info-image");
                const article_name = document.getElementById("name_article_value");
                const article_author = document.getElementById("author_article_value");
                const article_price = document.getElementById("price_article_value");
                const article_amount = document.getElementById("amount_article_value");
                const article_desc = document.getElementById("desc_article_value");

                article_info_info.setAttribute("data-article_id", article_info._id);
                article_image.setAttribute("src", article_info.url);
                article_name.innerHTML = article_info.name;
                article_author.innerHTML = article_info.author;
                article_price.innerHTML = article_info.price;
                article_amount.innerHTML = article_info.amount;
                article_desc.innerHTML = article_info.description;

                const home_black_window = document.getElementById("black_background-window");
                home_black_window.style.display = "flex";
                info_displayer.style.display = "block";
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

function addToCart(button){
    const id = button.parentNode.parentNode.getAttribute("data-article_id");
    var http = new XMLHttpRequest();
    http.open("POST", "/mycart?article_id=" + id);
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                const info_displayer = document.getElementById("article-info-displayer");
                const home_black_window = document.getElementById("black_background-window");
                info_displayer.style.display = "none";
                home_black_window.style.display = "none";
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