const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const hostVideo = document.createElement('video');
hostVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '8080',

});

let videoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    videoStream = stream;
    addVideoStream(hostVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        });
    })

    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
    });

    let text = $('input');
    $('html').keydown((e) => {
        if (e.which == 13 && text.val() !== 0){
            socket.emit('message', text.val());
            text.val('');
        }
    })

    socket.on('createMessage', message => {
        $('ul').append(
            `
                <li class="message">
                    <b>user</b>
                    <br/>
                    ${message}
                </li>
            `
        )
        scrollToBottom()
    })
});

peer.on('open', id => {
    socket.emit("join-room", ROOM_ID, id);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
};

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
};

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


