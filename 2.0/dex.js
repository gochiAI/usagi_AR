/*gochi_AI
support by chatgpt
don't copy
*/

let windowWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
let windowHeight =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

var camera_Width = windowWidth;
var camera_Height = windowHeight;

var isMobile = /(iPhone|Android|Mobile)/i.test(navigator.userAgent);

if (isMobile) {
  if (screen.orientation) {
    switch (screen.orientation.type) {
      case "landscape-primary":
        camera_Width = windowWidth;
        camera_Height = windowHeight;
        break;
      case "portrait-primary":
        camera_Width = windowHeight;
        camera_Height = windowWidth;
        break;
    }
  }
}

var CONSTRAINTS = {
  audio: false,
  video: {
    width: { ideal: camera_Width },
    height: { ideal: camera_Height },
    aspectRatio: { ideal: 999 },
    facingMode: null,
  },
};

App.controller("home", function (page) {
  $(page).on("appShow", function () {
  
    // ボタン要素を取得
    const button = document.getElementById("shutter");

    // モーダル要素とスクリーンショット表示用のimg要素を取得
    const modal = document.getElementById("modal");

    const download_shot = document.getElementById("download_shot");
    const screenshotImg = document.getElementById("screenshot");
    const video = document.getElementById("video");

    const canvas = document.getElementById("canvas");
    canvas.width = windowWidth;
    canvas.height = windowHeight;
    var curSTREAM = null;
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    video.style.display = "block";

    function butotnClick() {
      canvas.style.display = "none";
      video.style.display = "none";

      const combine = document.createElement("canvas");
      const ctx = combine.getContext("2d");
      combine.width = windowWidth;
      combine.height = windowHeight;
      // カメラの映像とdocument.getElementById("canvas");の状態を組み合わせて画像を作成する
      ctx.drawImage(video, 0, 0, windowWidth, windowHeight);
      ctx.drawImage(canvas, 0, 0, windowWidth, windowHeight);

      /*var savedStates = localStorage.getItem("toggleStates");
if (savedStates) {
  var states = JSON.parse(savedStates);
  if(states.isShowLogo){
    const image =  document.createElement('img');
    image.src  = "/aws.gochiusa.com/img/closta_icon.png"
    image.width = 100;
    image.height = 100;
    ctx.drawImage(image,0,0,100,100)
  }}*/

      const canvasState = combine.toDataURL();
      screenshotImg.src = canvasState;
      // ダウンロードリンクの設定
      let d = new Date();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      let hour = d.getHours();
      let minute = d.getMinutes();
      let second = d.getSeconds();
      download_shot.download = `${month}月${day}日_${hour}時${minute}分${second}秒.png`;
      download_shot.href = canvasState;
      // 画像をモーダルで開く
      modal.style.display = "flex";}
    // ボタンがクリックされたときのイベントリスナーを追加
    button.addEventListener("click",butotnClick);

    // localStorageからclickedListの値を取得
    const clickedList = JSON.parse(localStorage.getItem("clickedList"));

    function loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function () {
          resolve(img);
        };
        img.onerror = function () {
          reject(new Error("Failed to load image: " + url));
        };
        img.src = url;
      });
    }

    async function loadImages(urls) {
      const images = [];
      for (const url of urls) {
        try {
          const image = await loadImage(url);
          images.push(image);
        } catch (error) {
          console.error(error);
        }
      }
      return images;
    }
    async function drawImagesOnCanvas(images) {
      const positions = [];
      let startX = -100;
      let startY = 50;

      for (const image of images) {
        startX += 100;
        const position = { x: startX, y: startY };
        positions.push(position);
        await drawImage(image, position);
      }

      var isMouseDown = false;
      var activeIndex = -1; // アクティブな画像のインデックス

      canvas.addEventListener("mousedown", startDrag);
      canvas.addEventListener("mousemove", drag);
      canvas.addEventListener("mouseup", endDrag);

      canvas.addEventListener("touchstart", startDrag);
      canvas.addEventListener("touchmove", drag);
      canvas.addEventListener("touchend", endDrag);
      // ドラッグ開始時の処理
      function startDrag(event) {
        isMouseDown = true;
        event.preventDefault();

        const rect = canvas.getBoundingClientRect();
        let offsetX, offsetY;
        if (event.touches) {
          offsetX = event.touches[0].clientX - rect.left;
          offsetY = event.touches[0].clientY - rect.top;
        } else {
          offsetX = event.clientX - rect.left;
          offsetY = event.clientY - rect.top;
        }

        // クリック位置に画像があるかを判定
        activeIndex = positions.findIndex((position, index) => {
          return (
            offsetX >= position.x &&
            offsetX <= position.x + images[index].width &&
            offsetY >= position.y &&
            offsetY <= position.y + images[index].height
          );
        });
      }
      function drag(event) {
        if (isMouseDown && activeIndex !== -1) {
          event.preventDefault();
          const rect = canvas.getBoundingClientRect();
          let offsetX, offsetY;
          if (event.touches) {
            offsetX = event.touches[0].clientX - rect.left;
            offsetY = event.touches[0].clientY - rect.top;
          } else {
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
          }

          const position = positions[activeIndex];
          position.x = offsetX - images[activeIndex].width / 2;
          position.y = offsetY - images[activeIndex].height / 2;

          drawImages();
        }
      }

      // ドラッグ終了時の処理
      function endDrag(event) {
        event.preventDefault();
        isMouseDown = false;
        activeIndex = -1;

        drawImages();
      }

      // すべての画像を描画する関数
      function drawImages() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const position = positions[i];
          ctx.drawImage(image, position.x, position.y);
        }
      }

      // 画像を描画する関数
      function drawImage(image, position) {
        return new Promise((resolve) => {
          ctx.drawImage(image, position.x, position.y);
          resolve();
        });
      }
    }

    loadImages(clickedList)
      .then((images) => {
        drawImagesOnCanvas(images);
      })
      .catch((error) => {
        console.error(error);
      });

    let useFront = localStorage.getItem("useFront") === "true" ? true : false;

    syncCamera(video, useFront);

    document.getElementById("camera-toggle").addEventListener("click", () => {
      useFront = !useFront;
      localStorage.setItem("useFront", useFront);
      syncCamera(video, useFront);
    });

    function syncCamera(video, is_front = false) {
      CONSTRAINTS.video.facingMode = is_front
        ? "user"
        : { exact: "environment" };

      if (curSTREAM !== null) {
        curSTREAM.getVideoTracks().forEach((camera) => {
          camera.stop();
        });
      }


        function initializeCamera() {
          navigator.mediaDevices
          .getUserMedia(CONSTRAINTS)
          .then((stream) => {
            curSTREAM = stream; // 前後の切り替え用に保持
            const [track] = stream.getVideoTracks();
            const settings = track.getSettings();
            const { width, height } = settings; // <4>
            console.log(width, height);
            // <video>とStremaを接続
            video.srcObject = stream;
            video.onloadedmetadata = (e) => {
              video.play();
            };
          })
            .catch((err) => {
              if (err.name === 'NotReadableError') {
                // カメラが読み取れないエラーが発生した場合、再接続を試みる
                initializeCamera();
                window.location.reload()
              } else if (err.name === 'NotAllowedError') {
                alert('カメラの接続権限がありません\n');
                window.location.href = '../';
              } else if (err.name === 'OverconstrainedError') {
                alert('カメラがありません\n');
                useFront = !useFront;
                localStorage.setItem('useFront', useFront);
                syncCamera(video, useFront);
              } else {
                console.log(`${err.name}: ${err.message}`);
                alert(`${err.name}: ${err.message}`);
              }
            });
        }
        
        // 初回カメラ初期化を実行
        initializeCamera();
        
    }
  });
});

App.controller("setting", function (page) {
  $(page).on("appShow", function (page) {
    var show_date = document.querySelector("#is_show_date");
    var show_logo = document.querySelector("#is_show_logo");

/*
    // Initialize Switchery for show_date toggle
    var switchery_date = new Switchery(show_date);

    // Initialize Switchery for show_logo toggle
    var switchery_logo = new Switchery(show_logo);

    // Load and apply saved toggle states from localStorage
    var savedStates = localStorage.getItem("toggleStates");
    if (savedStates) {
      var states = JSON.parse(savedStates);
      if (states.isShowDate) {
        switchery_date.setPosition(true);
      }
      if (states.isShowLogo) {
        switchery_logo.setPosition(true);
      }
    }

    // Listen for changes in toggle states
    show_date.addEventListener("change", function () {
      var newState = show_date.checked;
      var states = JSON.parse(localStorage.getItem("toggleStates")) || {};
      states.isShowDate = newState;
      localStorage.setItem("toggleStates", JSON.stringify(states));
    });

    show_logo.addEventListener("change", function () {
      var newState = show_logo.checked;
      var states = JSON.parse(localStorage.getItem("toggleStates")) || {};
      states.isShowLogo = newState;
      localStorage.setItem("toggleStates", JSON.stringify(states));
    });*/
  });
});

App.controller("summon", function (page) {
  $(page).on("appShow", function () {
    var Items = localStorage.getItem("selectedImage") || [];
    function generateHTML() {
      let html = "";

      for (const group in CharacterDatas) {
        html += `<details>
<summary>${group}</summary>`;

        for (const character in CharacterDatas[group]) {
          html += `<details>
    <summary>${character}</summary>
    <div class="character-images">`;

          CharacterDatas[group][character].forEach((expression) => {
            const expressionName = Object.keys(expression)[0];
            const imagePath = expression[expressionName];
            html += `<div>
      <img src="../${imagePath}">
    </div>`;
          });

          html += `</details>`;
        }

        html += `</details>`;
      }

      return html;
    }

    const generatedHTML = generateHTML();
    document.getElementById("chara").innerHTML = generateHTML();
    // クリックした画像のリストを保持する変数
    let clickedList = [];

    // localStorageからクリックした画像のリストを取得
    const storedList = localStorage.getItem("clickedList");
    if (storedList) {
      clickedList = JSON.parse(storedList);
    }

    // 画像クリック時の処理
    function handleImageClick(imagePath) {
      imagePath = imagePath.replace("_thumb", "");
      const index = clickedList.indexOf(imagePath);

      if (index === -1) {
        // リストに追加
        clickedList.push(imagePath);
        if (clickedList.length > 3) {
          // リストの長さが3を超える場合、先頭の要素を削除
          clickedList.shift();
        }
      } else {
        // リストから削除
        clickedList.splice(index, 1);
      }

      // リストをlocalStorageに保存
      localStorage.setItem("clickedList", JSON.stringify(clickedList));
    }

    // 画像要素にクリックイベントを追加
    const imageElements = document.querySelectorAll(".character-images img");
    imageElements.forEach((image) => {
      image.addEventListener("click", () => {
        handleImageClick(image.getAttribute("src"));
        updateImageDisplay();
      });
    });

    // 画像の表示を更新する関数
    function updateImageDisplay() {
      // リスト内の画像を強調するためのスタイルを追加
      imageElements.forEach((image) => {
        let imagePath = image.getAttribute("src");
        imagePath = imagePath.replace("_thumb", "");
        if (clickedList.includes(imagePath)) {
          image.classList.add("selected");
        } else {
          image.classList.remove("selected");
        }
      });
    }

    // 初期表示時に画像の表示を更新
    updateImageDisplay();
  });
});

try {
  App.restore();
} catch (err) {
  App.load("home");
  
}
