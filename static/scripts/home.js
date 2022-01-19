const username_value = document.getElementById("username_value");

document.addEventListener('DOMContentLoaded', function(){
    var session = localStorage.getItem('STR_session_object');
    if(session){
        var http = new XMLHttpRequest();
        http.open('GET', '/?verifying=1&session=' + session);
        http.onreadystatechange = function(){
            if(http.readyState==4 && http.status==200){
                var response = http.responseText;
                response = JSON.parse(response);
                if(response.status == 1){
                    console.log("Home: Done...");

                    session = JSON.parse(session);
                    username_value.innerHTML = session.username;
                }else{
                    window.location.replace("/login");
                }
            }else{
                console.log("readyState: ", http.readyState);
                console.log("sattus: ", http.status);
            }
        }
        http.send(null);
    }else{
        window.location.replace("/login");
    }
});