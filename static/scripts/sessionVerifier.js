document.addEventListener('DOMContentLoaded', function(){
    var session = localStorage.getItem('STR_session_object');
    
    if(session){
        var http = new XMLHttpRequest();
        http.open('GET');
    }else{
        window.location.replace("/createSession");
    }
});