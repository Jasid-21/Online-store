const username_value = document.getElementById("username_value");
const search_form = document.getElementById("search-form");
const search_refresh = document.querySelector(".search-refresh");

search_form.addEventListener('submit', function(e){
    e.preventDefault();

    const formData = new FormData(search_form);
    var http = new XMLHttpRequest();
    http.open("POST", "/searchArticle");
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                if(resp.data.length > 0){
                    main_content.innerHTML = "";
                    createHomeElements(resp.data);
                }else{
                    alert("There are no items that match with this query  :(");
                }
            }else{
                alert(resp.message);
            }
        }else{
            handle_pre_http(http);
        }
    }
    http.send(formData);
});

search_refresh.addEventListener('click', function(e){
    e.preventDefault();

    const inputs = search_form.querySelectorAll(".input-value");
    for(var input of inputs){
        input.value = "";
    }
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
                clear_black_window();
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
            handle_pre_http(http);
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
                clear_black_window();
                emergent_done("Article added to your cart!");
            }else{
                alert(resp.message);
            }
        }else{
            handle_pre_http(http);
        }
    }
    http.send(null);
}