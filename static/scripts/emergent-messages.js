function makeVisible(elem_id){
    var myOpacity = 0;
    var opacityElem = document.getElementById(elem_id);
    opacityElem.style.display = "flex";

    var opacityInterval = setInterval(moreVisible, 25);

    function moreVisible(){
        if(myOpacity >= 1){
            myOpacity = 1;
            opacityInterval = setInterval(lessVisible, 25);
        }else{
            myOpacity += 0.05;
            opacityElem.style.opacity = myOpacity;
            opacityElem.style.filter = `alpha(opacity = ${myOpacity*100})`;
        }
    }

    function lessVisible(){
        if(myOpacity <= 0){
            opacityElem.style.display = "none";
            clearInterval(opacityInterval);
        }else{
            myOpacity -= 0.05;
            opacityElem.style.opacity = myOpacity;
            opacityElem.style.filter = `alpha(opacity = ${myOpacity*100})`;
        }
    }
}