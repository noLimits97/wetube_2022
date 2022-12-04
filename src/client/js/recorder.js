/*
    #13.0  ~ 13.5 Recoder Setup
    (1) client/js에 recorder.js 생성 
    (2) webpack.config.js에 recorder.js 경로 추가
    (3) main.js에서 regeneratorRuntime import하기

    #14.0 Webassemblyt Video Transcode
    (10)
*/
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("record-btn");
const downloadBtn = document.getElementById("download-btn");
const inputVideo = document.getElementById("input-video");
const outputVideo = document.getElementById("output-video");

let stream;
let recorder;
let videoUrl;

const files = {
  input: "recording.webm",
  output: "_recording.mp4",
  thumbnail: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

// 프론트 엔드에서 asnyc / await 함수를 사용하려면 regeneratorRuntime을 설치할 필요가 있다.
const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 720, height: 480 },
  });
  // srcObject는 video에게 줄 수 있는 Something! src attribute와는 다르다.
  inputVideo.srcObject = stream;
  inputVideo.play();
};

// stream이 생성되기까지 시간이 걸린다.
init();

const handleStartRecord = () => {
  recordBtn.innerText = "Stop Recording";
  recordBtn.removeEventListener("click", handleStartRecord);
  recordBtn.addEventListener("click", handleStopRecord);
  recorder = new window.MediaRecorder(stream);
  // recorder.stop()에 응하여 event가 발생한다.
  recorder.ondataavailable = (event) => {
    // 브라우저의 메모리에 저장된 blob을 가리키는 주소를 반환한다.
    // blob은 file-like object로, binary data를 담고 있다.
    videoUrl = URL.createObjectURL(event.data);
    inputVideo.srcObject = null;
    outputVideo.src = videoUrl;
    outputVideo.loop = true;
    outputVideo.play();
  };
  recorder.start();
};

const handleStopRecord = () => {
  recorder.stop();
  recordBtn.innerText = "Start Recording";
  recordBtn.removeEventListener("click", handleStopRecord);
  recordBtn.addEventListener("click", handleStartRecord);
};

const handleDownloadRecord = async () => {
  // console을 통해 진행되는 과정을 알기 위해
  const ffmpeg = createFFmpeg({ log: true });
  // load()는 브라우저에서 사용될 ffmpeg api를 생성
  await ffmpeg.load();
  // "writeFile"로 ffmpeg에 "recording.webm"을 input 하고, 처리한 뒤 "_recording.mp4" 생성
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoUrl));
  // ."mp4" Transcoding 중...
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumbnail
  );
  // ffmpeg는 array의 형태로 data를 저장한다. File 형태로 접근하기 위해서는 binary data buffer로 받아야 한다.
  const vid = ffmpeg.FS("readFile", files.output);
  const thumb = ffmpeg.FS("readFile", files.thumbnail);
  const vidBlob = new Blob([vid.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumb.buffer], { type: "image/jpg" });
  const vidUrl = URL.createObjectURL(vidBlob);
  const thumbUrl = URL.createObjectURL(thumbBlob);
  downloadFile(vidUrl, "vid.mp4");
  downloadFile(thumbUrl, "thumb.jpg");
};

recordBtn.addEventListener("click", handleStartRecord);
downloadBtn.addEventListener("click", handleDownloadRecord);
