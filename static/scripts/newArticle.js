const submitBtn = document.getElementById("new_article_submit");
const imageSelector = document.querySelector(".newArticle-img-selector");
const newArticleForm = document.getElementById("new_article-form");
var imageObject;
var imageName;

newArticleForm.addEventListener('submit', function(e){
    e.preventDefault();
    var formData = new FormData(newArticleForm);
    console.log(formData);
    const session_object = localStorage.getItem("STR_session_object");
    var user_id = JSON.parse(session_object).user_id;

    var http = new XMLHttpRequest();
    http.open('POST', "/newArticle?user_id=" + user_id);
    http.onreadystatechange = function(){
        if(http.readyState==4 & http.status==200){
            var response = http.responseText;
            response = JSON.parse(response);
            
            if(response.status == 1){
                console.log("Post: Done!");
                const fields = newArticleForm.querySelectorAll("input");
                const textArea = newArticleForm.querySelector("textarea");
                const image = newArticleForm.querySelector(".newArticle-img");
                textArea.value = "";
                image.setAttribute("src", "");
                for(var field of fields){
                    if(!field.classList.contains("newArticle-author")){
                        field.value = "";
                    }
                }
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
