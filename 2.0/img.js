
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