window.addEventListener("keydown", function(e) {
        const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
        const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
        if(!audio) return;
        audio.currentTime = 0; //rewinds audio back to the start to be able to play over and over again in quick sucession
        audio.play();
        key.classList.add("playing");
});

function removeTransition(e) {
        if (e.propertyName !== "transform") return;//skip it if it's not a transform
        e.target.classList.remove("playing");
}

window.addEventListener("transitionend", removeTransition);