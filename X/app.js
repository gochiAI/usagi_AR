var CONSTRAINTS = {
	audio: false,
	video: {
	  width: 640,
	  height: 480,
	  facingMode: null  // どのカメラを利用するか
  
	  // facingModeには最終的に以下のいずれかの値を入れる
	  //   facingMode: "user"                    // フロントカメラを利用する
	  //   facingMode: { exact: "environment" }  // リアカメラを利用する
	}
  };
  
  // 現在のStream
  var curSTREAM = null;
  
  //---------------------------------------------
  // [event] ページ読み込み完了
  //---------------------------------------------
  window.onload = () => {
	const video = document.getElementById("video");
	let useFront = true;     // フロントカメラ:true, バックカメラ:false
  
	// 縦横の解像度を調整
	adjustCameraSize(video, 640, 480);
  
	// カメラと同期開始
	syncCamera(video, useFront);
	useFront = !useFront;         // boolean値を反転
  
	//-------------------------------
	// [event] 切り替えボタン押下
	//-------------------------------
	document.getElementById("camera-toggle").addEventListener("click", ()=>{
	  syncCamera(video, useFront);
	  useFront = !useFront;      // boolean値を反転
	});
  };
  
  /**
   * カメラを<video>と同期
   *
   * @param {object} video
   * @param {boolean} [is_front=true]
   */
  function syncCamera(video, is_front=true){
	// 前後カメラの設定
	CONSTRAINTS.video.facingMode = (is_front)?  "user":{ exact: "environment" };
  
	// すでにカメラと接続していたら停止
	if( curSTREAM !== null ){
	  curSTREAM.getVideoTracks().forEach( (camera) => {
		camera.stop();
	  });
	}
  
	// カメラと接続する
	navigator.mediaDevices.getUserMedia(CONSTRAINTS)
	  .then( (stream) => {
		curSTREAM = stream;   // 前後の切り替え用に保持
  
		// <video>とStremaを接続
		video.srcObject = stream;
		video.onloadedmetadata = (e) => {
		  video.play();
		};
	  })
	  .catch( (err) => {
		console.log(`${err.name}: ${err.message}`);
		alert("カメラとの接続時にエラーが発生しました");
	  });
  }
  
  /**
   * 解像度に合わせて<video>サイズを調整する
   *
   * @param {object}  video
   * @param {integer} longside   長辺のピクセル数
   * @param {integer} shortside  短辺のピクセル数
   **/
  function adjustCameraSize(video, longside, shortside){
	if( window.innerWidth < window.innerHeight ){
	  // getUserMediaに食わせる値
	  CONSTRAINTS.video.width  = shortside;
	  CONSTRAINTS.video.height = longside;
	  // videoタグのサイズ
	  video.style.width  = shortside;
	  video.style.height = longside;
	}
  }