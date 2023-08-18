//A スクロールの禁止とイベントリスナ
const area = document.getElementById("area");
const fu = document.getElementById("fu");

let options = {

threshold:1
}

let observer = new IntersectionObserver(callback,options);
observer.observe(area);

function callback(entries) {

if(entries[0].isIntersecting) {
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel",wheel);
      window.addEventListener("touchmove",move);
} else {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel",wheel);
      window.removeEventListener("touchmove",move);
      }
}



//B ユーザのスクロール量を検知
let sum = 0;

let maemove = 0;
let atomove = 0;
let maestamp = 0;
let atostamp = 0;

function move(e) {

let imamove = e.touches[0].clientY;
let imastamp = e.timeStamp;

if(maestamp == 0) {
      maestamp = imastamp;
} else {
atostamp = imastamp;
if(atostamp - maestamp >100) {

maemove = 0;
}

maestamp = imastamp;
}

if(maemove == 0) {
      maemove = imamove;
} else {
      atomove = imamove;
      sum = sum + (maemove-atomove);
      kaiten();
      maemove = imamove;
      }
}


function wheel(e) {

sum = sum+e.deltaY;
kaiten();
}



//C スクロール量に合わせてアニメーション
function kaiten() {

if(sum>0 && sum < 2000) {
      fu.style.transform = `rotate(${360*sum/2000}deg)`;
      document.body.style.overflow = "hidden";
} else if(sum >= 2000) {
      sum = 2000;
      fu.style.transform = "rotate(360deg)";
      document.body.style.overflow = "auto";
} else if(sum <= 0) {
      sum = 0;
      fu.style.transform = "rotate(0deg)";
      document.body.style.overflow = "auto";
}
}