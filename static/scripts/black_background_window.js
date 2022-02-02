const black_window = document.getElementById("black_background-window");

function clear_black_window(){
    const childs = black_window.children;
    console.log(childs);
    if(childs.length > 0){
        for(var child of childs){
            child.style.display = "none";
        }
    }
}

const close_buttons = document.getElementsByClassName("close_button");
for(button of close_buttons){
    button.addEventListener('click', function(e){
        const parent = this.parentNode.parentNode;
            parent.style.display = "none";
            black_window.style.display = "none";
    });
}