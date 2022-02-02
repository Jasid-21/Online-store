function createHomeElements(items){
    for(var i=0; i<items.length/4; i++){
        const articlesRow = document.createElement("div");
        articlesRow.setAttribute("class", "articles-row");
    
        const br = document.createElement("br");
        for(var j=0; j<4; j++){
            var item = items[i*3 + j];
            if(item){
                const article_col = document.createElement("div");
                article_col.setAttribute("class", "article-col");
    
                const article_item = document.createElement("div");
                article_item.setAttribute("class", "article-item-container");
                article_item.setAttribute("data-article_id", `${item._id}`);
    
                const image_container = document.createElement("div");
                image_container.setAttribute("class", "image-container container-fluid");
    
                const image = document.createElement("img");
                image.setAttribute("class", "item-image");
                image.setAttribute("src", item.url);
    
                image_container.appendChild(image);
                article_item.appendChild(image_container);
    
                const article_title = document.createElement("h6");
                article_title.setAttribute("class", "item-title container");
                article_title.innerHTML = item.name;
    
                article_item.appendChild(article_title)
    
                const article_price = document.createElement("h6");
                article_price.setAttribute("class", "h3 item-price container-fluid");
                article_price.innerHTML = `$${item.price}`;
    
                article_item.appendChild(article_price);
    
                const buttons_container = document.createElement("div");
                buttons_container.setAttribute("class", "buttons-container container-fluid");
    
                const more_button = document.createElement("button");
                more_button.setAttribute("class", "item-button more-button");
                more_button.setAttribute("onclick", "more_info(this)");
                more_button.innerHTML = "Info";
    
                buttons_container.appendChild(more_button);
    
                const buy_button = document.createElement("button");
                buy_button.setAttribute("class", "item-button buy-button");
                buy_button.setAttribute("onclick", "addToCart(this)");
                buy_button.innerHTML = "Add!";
    
                buttons_container.appendChild(buy_button);
                article_item.appendChild(buttons_container);
    
                article_col.appendChild(article_item);
                articlesRow.appendChild(article_col);
            }
        }
        main_content.appendChild(articlesRow);
        main_content.appendChild(br);
    }
}