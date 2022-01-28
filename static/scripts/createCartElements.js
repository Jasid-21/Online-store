for(var item of items){
    const item_container = document.createElement("div");
    item_container.setAttribute("class", "mycart-item-container container-fluid");
    item_container.setAttribute("data-article_id", `${item._id}`);

    const image_container = document.createElement("div");
    image_container.setAttribute("class", "image-container");

    const item_image = document.createElement("img");
    item_image.setAttribute("class", "item-image");
    item_image.setAttribute("src", item.url);

    image_container.appendChild(item_image);
    item_container.appendChild(image_container);

    const info_container = document.createElement("div");
    info_container.setAttribute("class", "item-info-container");

    info_container.appendChild(createArticleField("name", "Name", item.name));
    info_container.appendChild(createArticleField("author", "Author", item.author));
    info_container.appendChild(createArticleField("price", "Price", item.price));
    info_container.appendChild(createArticleField("description", "Description", item.description));

    const buttons_container = document.createElement("div");
    buttons_container.setAttribute("class", "buttons-container container");

    const remove_button = document.createElement("button");
    remove_button.setAttribute("class", "remove-button");
    remove_button.setAttribute("onclick", "remove_cart_item(this)");
    remove_button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
    `;

    buttons_container.appendChild(remove_button);
    info_container.appendChild(buttons_container);

    item_container.appendChild(info_container);

    main_content.appendChild(item_container);
    const br = document.createElement("br");
    main_content.appendChild(br);
}

function createArticleField(differ, key_name, value){
    const article_name_field = document.createElement("div");
    article_name_field.setAttribute("class", `article-${differ}-field article-field container`);
    const article_name_key = document.createElement("h6");
    article_name_key.setAttribute("class", `article-${differ}-key article-key h5`);
    article_name_key.innerHTML = key_name + ":&nbsp";

    article_name_field.appendChild(article_name_key);

    const article_name_value = document.createElement("p");
    article_name_value.setAttribute("class", `article-${differ}-value article-value p`);
    article_name_value.innerHTML = value;

    article_name_field.appendChild(article_name_value);

    return article_name_field;
}

function remove_cart_item(button){
    const parent = button.parentNode.parentNode.parentNode;
    const item_id = parent.getAttribute("data-article_id");
    var http = new XMLHttpRequest();
    http.open("DELETE", "/mycart?article_id=" + item_id);
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                const mainContent = parent.parentNode;
                mainContent.removeChild(parent);
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