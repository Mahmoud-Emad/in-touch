const videoGrid = document.getElementById("video-grid");
const hostVideo = document.createElement('video');
hostVideo.muted = true;

let videoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    videoStream = stream;
    addVideoStream(hostVideo, stream);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video)
};