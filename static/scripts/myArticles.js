const myArticles_close_button = document.getElementById("myArticles-close-button");

myArticles_close_button.addEventListener('click', function(e){
    e.preventDefault();

    const maxParent = this.parentNode.parentNode;
    maxParent.style.display = "none";
    black_window.style.display = "none";
});