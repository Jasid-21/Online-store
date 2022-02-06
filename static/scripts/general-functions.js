function handle_pre_http(request){
    console.log(`readyState: ${request.readyState}`);
    console.log(`readyState: ${request.status}`);
}

function create_myArticle_items(items){
    console.log(items);
    const myArticles_container = document.querySelector(".myArticles-container");
    myArticles_container.innerHTML = "";
    for(var item of items){
        const container = document.createElement("div");
        container.setAttribute("class", "myArticles-article-container container-fluid");
        var temp = `
            <div class="myArticles-image-container">
                <img src="${item.url}" class="myArticles-image">
            </div>
            <div class="myArticles-info-container container-fluid">
                <div class="myArticles-info-field">
                    <div class="myArticles-info-key">Name:&nbsp</div>
                    <div class="myArticles-info-value">${item.name}</div>
                </div>
                <div class="myArticles-info-field">
                    <div class="myArticles-info-key">Price:&nbsp</div>
                    <div class="myArticles-info-value">${item.price}</div>
                </div>
                <div class="myArticles-info-field">
                    <div class="myArticles-info-key">Amount:&nbsp</div>
                    <div class="myArticles-info-value">${item.amount}</div>
                </div>
                <div class="myArticles-info-field">
                    <div class="myArticles-info-key">Date:&nbsp</div>
                    <div class="myArticles-info-value">${item.updatedAt}</div>
                </div>
            </div>
        `;
        container.innerHTML = temp;
        myArticles_container.appendChild(container);
    }
}