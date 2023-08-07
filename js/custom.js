// 雪花下落效果
const createSnowFlake = () => {
    const snowflake = document.createElement("span");
    snowflake.classList.add("material-symbols-outlined");
    snowflake.textContent = "*";
    snowflake.classList.add(`snowflake`);
    let bannerHeight = document.getElementsByClassName("banner")[0].offsetHeight

    document.body.appendChild(snowflake);

    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    let FallHeight = (bannerHeight / winHeight) * 100 + "vh";
    let randomLeft = getRandomNumber(0, winWidth);
    let randomOpacity = getRandomNumber(0, 1);
    let randomSize = getRandomNumber(0.6, 2);

    snowflake.style.left = randomLeft + "px";
    snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
    snowflake.style.opacity = randomOpacity;
    snowflake.style.fontSize = randomSize + "rem";
    document.documentElement.style.setProperty('--fall-height', FallHeight);
    setTimeout(() => {
        // remove snowflake after 5s
        snowflake.remove();
    }, 5000);
};
const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
};
setInterval(createSnowFlake, 40); // Create snowflake every 50ms (lower interval more snowflakes)
// 隐藏页面滚动条，雪花会增加一个横向滚动条
document.documentElement.style.overflowX = 'hidden';

// 添加一站到底效果
function scrollbottom() {
    drop_style = '\
    <li class="nav-item" id="scroll-bottom-button">  \
    <a class="nav-link"><i class="iconfont icon-arrowdown"></i>   \
    <span>一站到底</span></a>  \
    </li>   \
    '

    var nav = document.getElementsByClassName("navbar-nav");
    nav[0].insertAdjacentHTML('beforeend', drop_style);
    let scrollToBottomButton = document.getElementById("scroll-bottom-button");
    scrollToBottomButton.addEventListener('click', function () {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
            duration: 500
        });
    });
};
scrollbottom();
