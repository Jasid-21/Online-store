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
                const cookieName = response.cookieName,
                cookieValue = response.cookieValue,
                cookieTime = response.cookieTime;
                const newCookie = `${cookieName}=${cookieValue}; expires = ${cookieTime}`;

                document.cookie = newCookie;
                localStorage.setItem("STR_session_object", JSON.stringify({
                    user_id: response.user_id,
                    username: response.username
                }));
                window.location.replace("/");
            }else{
                alert(response.message);
            }
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    http.send(formData);
});