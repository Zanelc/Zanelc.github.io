(function mouseClickAN() {
    let $html = document.getElementsByTagName("html")[0];
    let $body = document.getElementsByTagName("body")[0];
    let emojIcon = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😫', '😖', '🥺', '😤', '😭', '😢', '😡', '😠', '🥵', '🤯', '😳', '🥶', '😶‍🌫️', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😮‍💨', '😵', '😵‍💫', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤕', '🤑', '🤠', '😈', '👿', '🤡', '👻', '💀', '☠️', '👽', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👀', '🧚‍♀️', '🧚‍♀️', '🐶', '🐱', '🐭', '🐹', '🦊', '🐻', '🐼', '🐻', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦅', '🦉', '🐺', '🦄', '🐝', '🦋', '🌈', '💫', '🌟', '✨', '⭐️', '💥', '🔥', '🌪'];
    $html.onclick = function (e) {
        let $elem = document.createElement("b");
        $elem.style.color = "#E94F06";
        $elem.style.zIndex = 9999;
        $elem.style.position = "absolute";
        $elem.style.select = "none";
        let x = e.pageX;
        let y = e.pageY;
        $elem.style.left = (x - 10) + "px";
        $elem.style.top = (y - 20) + "px";
        clearInterval(anim);
        $elem.innerText = emojIcon[Math.floor(Math.random() * emojIcon.length)];
        $elem.style.fontSize = Math.random() * 10 + 14 + "px";
        var increase = 0;
        var anim;
        setTimeout(function () {
            anim = setInterval(function () {
                if (++increase == 150) {
                    clearInterval(anim);
                    $body.removeChild($elem);
                }
                $elem.style.top = y - 20 - increase + "px";
                $elem.style.opacity = (150 - increase) / 120;
            }, 8);
        }, 70);
        $body.appendChild($elem);
    };
})()