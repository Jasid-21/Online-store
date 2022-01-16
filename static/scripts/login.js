const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', function(e){
    e.preventDefault();

    const formData = new FormData(loginForm);
    var http = new XMLHttpRequest();
    http.open("POST", "/login");
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var response = http.responseText;
            response = JSON.parse(response);

            if(response.status == 1){
                console.log("You are inside!");
                console.log(response.sessionObject);
                localStorage.setItem("STR_session_object", JSON.stringify(response.sessionObject));
                window.location.replace("/");
            }else{
                console.log(response.message);
            }
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    http.send(formData);
});

document.addEventListener('DOMContentLoaded', function(){
    var sessionObject = localStorage.getItem("STR_session_object");

    var http = new XMLHttpRequest();
    http.open("GET", "/login?verifying=1&session=" + sessionObject);
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var response = http.responseText;
            response = JSON.parse(response);

            if(response.status == 1){
                console.log("Session alredy found!");
                window.location.replace("/");
            }
        }else{
            console.log(`readyState: ${http.readyState}`)
            console.log(`status: ${http.status}`);
        }
    }
    http.send(null);
});