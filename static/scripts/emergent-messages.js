function makeVisible(elem_id){
    var myOpacity = 0;
    var opacityElem = document.getElementById(elem_id);

    var opacityInterval = setInterval(moreVisible, 25);

    function moreVisible(){
        if(myOpacity >= 1){
            var myOpacity = 1;
            var opacityInterval = setInterval(lessVisible, 25);
            clearInterval(opacityInterval);
        }else{
            myOpacity += 0.05;
            opacityElem.style.opacity = myOpacity;
            opacityElem.style.filter = `alpha(opacity = ${myOpacity*100})`;
        }
    }

    function lessVisible(){
        if(myOpacity <= 0){
            opacityElem.style.visibility = "hidden";
            clearInterval(opacityInterval);
        }else{
            myOpacity -= 0.05;
            opacityElem.style.opacity = myOpacity;
            opacityElem.style.filter = `alpha(opacity = ${myOpacity*100})`;
        }
    }
}