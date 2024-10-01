let localStream;
let screenStream;
let isScreenSharing = false;
let isBrowserSourceVisible = false;

const localVideo = document.getElementById('localVideo');
const browserSource = document.getElementById('browserSource');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleScreenShareButton = document.getElementById('toggleScreenShareButton');
const toggleBrowserSourceButton = document.getElementById('toggleBrowserSourceButton');
const rtmpUrlInput = document.getElementById('rtmpUrl');
const browserSourceUrlInput = document.getElementById('browserSourceUrl');

startButton.addEventListener('click', startStream);
stopButton.addEventListener('click', stopStream);
toggleCameraButton.addEventListener('click', toggleCamera);
toggleScreenShareButton.addEventListener('click', toggleScreenShare);
toggleBrowserSourceButton.addEventListener('click', toggleBrowserSource);

async function startStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        // Here you would typically connect to your streaming server
        // and start pushing the stream to the RTMP URL
        console.log('Starting stream to:', rtmpUrlInput.value);
    } catch (error) {
        console.error('Error starting stream:', error);
    }
}

function stopStream() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
    }
    localVideo.srcObject = null;
    console.log('Stream stopped');
}

async function toggleCamera() {
    if (localStream) {
        localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }
}

async function toggleScreenShare() {
    if (!isScreenSharing) {
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            localVideo.srcObject = screenStream;
            isScreenSharing = true;
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    } else {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        localVideo.srcObject = localStream;
        isScreenSharing = false;
    }
}

function toggleBrowserSource() {
    isBrowserSourceVisible = !isBrowserSourceVisible;
    browserSource.style.display = isBrowserSourceVisible ? 'block' : 'none';
    if (isBrowserSourceVisible) {
        browserSource.innerHTML = `<iframe src="${browserSourceUrlInput.value}" width="100%" height="100%" frameborder="0"></iframe>`;
    } else {
        browserSource.innerHTML = '';
    }
}

// You would typically implement WebSocket or Socket.IO connection here
// to communicate with your streaming server
const socket = io('https://your-streaming-server-url');

socket.on('connect', () => {
    console.log('Connected to streaming server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from streaming server');
});
