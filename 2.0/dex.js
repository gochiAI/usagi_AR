var CONSTRAINTS = {
    audio: false,
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
      facingMode: null,
    },
  };

  App.controller("home", function (page) {
    $(page).on("appShow", function () {
      // ボタン要素を取得
      const button = document.getElementById("button");

      // モーダル要素とスクリーンショット表示用のimg要素を取得
      const modal = document.getElementById("modal");
      const screenshotImg = document.getElementById("screenshot");

      // ボタンがクリックされたときのイベントリスナーを追加
      button.addEventListener("click", function () {
        const windowWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        const windowHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;

        // ブラウザウィンドウの表示領域全体をスクリーンショットとして取得
        html2canvas(document.querySelector(".app-content"), {
          width: windowWidth,
          height: windowHeight,
          ignoreElements: (element) => {
            // 除外する要素の条件を指定
            const excludedClasses = ["app-button"]; // 除外したいクラス名を指定

            // クラス名やIDが一致する要素を除外
            if (element.classList) {
              for (let className of excludedClasses) {
                if (element.classList.contains(className)) {
                  return true;
                }
              }
            }

            return false;
          },
          foreignObjectRendering: true,
        }).then(function (canvas) {
          // スクリーンショットをBase64エンコードされたJPG形式のデータURLに変換
          const dataURL = canvas.toDataURL("image/jpeg");

          // スクリーンショットをモーダル内のimg要素に表示
          screenshotImg.src = dataURL;

          // モーダルを表示
          modal.style.display = "block";
        });
      });

      const canvas = document.getElementById("canvas");
      var curSTREAM = null;
      const video = document.getElementById("video");
      const ctx = canvas.getContext("2d");

      // localStorageからclickedListの値を取得
      const clickedList = JSON.parse(localStorage.getItem("clickedList"));

      function resizeVideo() {
        canvas.width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        canvas.height =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
        video.style.width = "100%";
        video.style.height = "100%";
      }
      window.addEventListener("resize", resizeVideo);
      resizeVideo();

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
            console.log("drag");
          }
        }

        // ドラッグ終了時の処理
        function endDrag(event) {
          event.preventDefault();
          isMouseDown = false;
          activeIndex = -1;

          drawImages();
          console.log("End");
        }
        // ピンチインアウトイベント処理
canvas.addEventListener("gesturestart", startPinch);
canvas.addEventListener("gesturechange", pinchImage);
canvas.addEventListener("gestureend", stopPinch);

var initialDistance = 0;
var initialWidth = 0;
var initialHeight = 0;

// ピンチインアウト開始処理
function startPinch(event) {
  initialDistance = getDistance(event.touches[0], event.touches[1]);
  initialWidth = imageWidth;
  initialHeight = imageHeight;
}

// ピンチインアウト処理
function pinchImage(event) {
  var currentDistance = getDistance(event.touches[0], event.touches[1]);
  var scale = currentDistance / initialDistance;
  for (var i = 0; i < images.length; i++) {
    var img = images[i];
    img.width = initialWidth * scale;
    img.height = initialHeight * scale;
  }
  drawImages();  // 画像を再描画する
}

// ピンチインアウト終了処理
function stopPinch() {
  initialDistance = 0;
}

// 2つのタッチポイントの距離を計算する関数
function getDistance(touch1, touch2) {
  var deltaX = touch1.clientX - touch2.clientX;
  var deltaY = touch1.clientY - touch2.clientY;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
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

      let useFront = true;
      syncCamera(video, useFront);
      document
        .getElementById("camera-toggle")
        .addEventListener("click", () => {
          useFront = !useFront;
          syncCamera(video, useFront);
        });
      function syncCamera(video, is_front = true) {
        CONSTRAINTS.video.facingMode = is_front
          ? "user"
          : { exact: "environment" };

        if (curSTREAM !== null) {
          curSTREAM.getVideoTracks().forEach((camera) => {
            camera.stop();
          });
        }

        navigator.mediaDevices
          .getUserMedia(CONSTRAINTS)
          .then((stream) => {
            curSTREAM = stream; // 前後の切り替え用に保持

            // <video>とStremaを接続
            video.srcObject = stream;
            video.onloadedmetadata = (e) => {
              video.play();
            };
          })
          .catch((err) => {
            console.log(`${err.name}: ${err.message}`);
            alert("カメラとの接続時にエラーが発生しました");
          });
      }
    });
  });

  App.controller("setting", function (page) {
    var boolSet = JSON.parse(localStorage.getItem("boolSet")) || {
      show_date: false,
      show_logo: false,
    };
    function switchbool(item) {
      boolSet[item] = !boolSet[item];
      localStorage.setItem("boolSet", JSON.stringify(boolSet));
    }

    // Assign the switchbool function to the global scope for accessibility
    window.switchbool = switchbool;
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
      <img src="../${imagePath.replace("full", "face")}">
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
        const index = clickedList.indexOf(imagePath);

        if (index === -1) {
          // リストに追加
          clickedList.push(imagePath);
          if (clickedList.length > 5) {
            // リストの長さが5を超える場合、先頭の要素を削除
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
      const imageElements = document.querySelectorAll(
        ".character-images img"
      );
      imageElements.forEach((image) => {
        image.addEventListener("click", () => {
          handleImageClick(
            image.getAttribute("src").replace("face", "full")
          );
          updateImageDisplay();
        });
      });

      // 画像の表示を更新する関数
      function updateImageDisplay() {
        // リスト内の画像を強調するためのスタイルを追加
        imageElements.forEach((image) => {
          const imagePath = image
            .getAttribute("src")
            .replace("face", "full");
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