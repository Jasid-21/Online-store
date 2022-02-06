const logout = document.getElementById("logout");
const newArticle_link = document.getElementById("newArticle");
const newArticle_form = document.getElementById("new_article-form");
const myArticles = document.getElementById("myArticles");

logout.addEventListener('click', function(e){
    e.preventDefault();

    const sessionObject = localStorage.getItem("STR_session_object");
    var http = new XMLHttpRequest();
    http.open("GET", "/logout?session=" + sessionObject);
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var response = http.responseText;
            response = JSON.parse(response);

            if(response.status == 1){
                console.log("Loging out...");
                localStorage.removeItem("STR_session_object");
                document.cookie = "session_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.replace("/login");
            }else{
                alert(response.message);
            }
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    http.send(null);
});

document.addEventListener('DOMContentLoaded', function(){
    var session_object = localStorage.getItem("STR_session_object");
    if(session_object){
        session_object = JSON.parse(session_object);
        const username_field = document.getElementById("username_value");

        username_field.innerHTML = session_object.username;
    }else{
        console.log("Session object not found...");
    }
});

newArticle_link.addEventListener('click', function(e){
    e.preventDefault();

    clear_black_window();
    black_window.style.display = "flex";
    newArticle_form.style.display = "block";
});

myArticles.addEventListener('click', function(e){
    e.preventDefault();

    var http = new XMLHttpRequest();
    http.open("GET", "/myArticles");
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                clear_black_window();
                black_window.style.display = "flex";
                document.querySelector(".myArticles-general-container").style.display = "block";
                create_myArticle_items(resp.data);
            }
        }else{
            handle_pre_http(http);
        }
    }
    http.send(null);
});