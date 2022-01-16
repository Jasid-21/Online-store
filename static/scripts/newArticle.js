const submitBtn = document.getElementById("new_article_submit");
const imageSelector = document.querySelector(".newArticle-img-selector");
const newArticleForm = document.getElementById("new_article-form");
var imageObject;
var imageName;

newArticleForm.addEventListener('submit', function(e){
    e.preventDefault();
    var formData = new FormData(newArticleForm);
    console.log(formData);

    var http = new XMLHttpRequest();
    http.open('POST', "/newArticle?user_id="+"0001");
    http.onreadystatechange = function(){
        if(http.readyState==4 & http.status==200){
            var response = http.responseText;
            response = JSON.parse(response);
            
            if(response.status == 1){
                console.log("Post done!")
            }else{
                alert(response.message);
            }
        }else{
            console.log("readyState: ", http.readyState);
            console.log("status: ", http.status);
        }
    }
    http.send(formData);
});
imageSelector.addEventListener('change', function(){
    const imageContainer = document.querySelector(".newArticle-img");
    const files = this.files[0];
    if(files){
        imageObject = files;
        imageName = files.name;
        var myUrl = URL.createObjectURL(files);
        imageContainer.setAttribute('src', myUrl);
    }
});

function upload_img(){
    var uploadFileTag = document.querySelector(".newArticle-img-selector");
    uploadFileTag.click();
}


document.addEventListener('DOMContentLoaded', function(){
    var session = localStorage.getItem('STR_session_object');
    if(session){
        var http = new XMLHttpRequest();
        http.open('GET', '/newArticle?verifying=1&session=' + session);
        http.onreadystatechange = function(){
            if(http.readyState==4 && http.status==200){
                var response = http.responseText;
                response = JSON.parse(response);
                if(response.status == 1){
                    console.log("new article: Done...");
                }else{
                    window.location.replace("/createSession");
                }
            }else{
                console.log("readyState: ", http.readyState);
                console.log("sattus: ", http.status);
            }
        }
        http.send(null);
    }else{
        window.location.replace("/createSession");
    }
});

