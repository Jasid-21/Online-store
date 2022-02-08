function makeVisible(element){
    var myOpacity = 0;
    var opacityElem = element;
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
            element.perentNode.parentNode.removeChild(element);
            clearInterval(opacityInterval);
        }else{
            myOpacity -= 0.05;
            opacityElem.style.opacity = myOpacity;
            opacityElem.style.filter = `alpha(opacity = ${myOpacity*100})`;
        }
    }
}

function emergent_done(message){
    const masterContainer = document.getElementById("masterContainer");
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "0px";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.zIndex = "1000";
    container.setAttribute("class", "container-fluid");

    const message_container = document.createElement("div");
    message_container.setAttribute("class", "emergent-message emergent-done");
    message_container.innerHTML = message;
    message_container.style.display = "flex";

    container.appendChild(message_container);
    masterContainer.appendChild(container);

    makeVisible(message_container);
}