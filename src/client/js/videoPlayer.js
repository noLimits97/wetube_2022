const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume-range");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("full-screen");
const videoContainer = document.getElementById("video-container");
const videoController = document.getElementById("video-controller");

let controllerTimeOut = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const muteOn = () => {
  video.muted = true;
  muteBtn.innerText = "Mute Off";
};
const muteOff = () => {
  video.muted = false;
  muteBtn.innerText = "Mute";
};
const formatTime = (seconds) => {
  if (Number(seconds) < 3600) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  } else {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
};

// video와 audio는 MediaElement의 method를 상속한다.

const handlePlayBtn = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMuteBtn = () => {
  if (video.muted) {
    muteOff();
    if (Number(volumeValue) === 0) {
      volumeValue = 0.5;
    }
    video.volume = volumeValue;
  } else {
    muteOn();
  }
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  if (Number(value) === 0) {
    muteOn();
  } else {
    muteOff();
  }
  volumeValue = value;
  video.volume = volumeValue;
};

const handleCurrentTime = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTotalTime = () => {
  const videoDuration = video.duration;
  totalTime.innerText = formatTime(Math.floor(videoDuration));
  timeline.max = Math.floor(videoDuration);
  if (Number(videoDuration) < 3600) {
    currentTime.innerText = "00:00";
  } else {
    currentTime.innerText = "00:00:00";
  }
};

const handelVideoEnd = async () => {
  const { id } = videoContainer.dataset;
  await fetch(`api/video/${id}/view`, { method: "POST" });
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleTimelineMouseDown = () => {
  video.pause();
};
const handleTimelineMouseUp = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

const handleFullScreenBtn = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    fullScreenBtn.innerText = "Deactivate Full Screen";
  } else {
    fullScreenBtn.innerText = "ctivate Full Screen";
  }
};

const handleShowController = () => {
  videoController.classList.add("showing");
  if (controllerTimeOut) {
    clearTimeout(controllerTimeOut);
  }
  controllerTimeOut = setTimeout(() => {
    videoController.classList.remove("showing");
  }, 3000);
};

const handleHideController = () => {
  controllerTimeOut = setTimeout(() => {
    videoController.classList.remove("showing");
  }, 3000);
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
// what is the difference between event "change" and "input"?
volumeRange.addEventListener("input", handleVolumeRange);
// video의 event를 다뤄야 함에 주의!
video.addEventListener("durationchange", handleTotalTime);
video.addEventListener("timeupdate", handleCurrentTime);
video.addEventListener("ended", handelVideoEnd);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("mousedown", handleTimelineMouseDown);
timeline.addEventListener("mouseup", handleTimelineMouseUp);
fullScreenBtn.addEventListener("click", handleFullScreenBtn);
videoContainer.addEventListener("fullscreenchange", handleFullScreen);
videoContainer.addEventListener("mousemove", handleShowController);
videoContainer.addEventListener("mouseleave", handleHideController);
