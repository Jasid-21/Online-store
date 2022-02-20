const form = document.getElementById("signup-form");

form.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(form);

    var http = new XMLHttpRequest();
    http.open("POST", "/signup");
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var response = http.responseText;
            response = JSON.parse(response);

            if(response.status == 1){
                localStorage.setItem("STR_session_object", JSON.stringify(response.session));
                window.location.replace("/");
            }else{
                alert(response.message);
            }
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    console.log(formData.get("password"));
    http.send(formData);
});