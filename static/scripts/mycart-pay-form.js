const pay_info_form = document.getElementById("pay-info-form");

pay_info_form.addEventListener("submit", function(e){
    e.preventDefault();

    const formData = new FormData(this);
    var http = new XMLHttpRequest();
    http.open("POST", "payCart");
    http.onreadystatechange = function(){
        if(http.readyState==4 && http.status==200){
            var resp = http.responseText;
            resp = JSON.parse(resp);

            if(resp.status == 1){
                alert("Thanks for your purchase! Please continue using our Online Store!");
                main_content.innerHTML = "";
            }else{
                alert(resp.message);
            }
        }else{
            console.log(`readyState: ${http.readyState}`);
            console.log(`status: ${http.status}`);
        }
    }
    http.send(formData);
});