let video = document.querySelector('video');
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector('#capture');
let body = document.querySelector("body");

let mediaRecorder;
let chunks = [];
let isRecording = false;

//on clicking the capture button we are creating a canvas and draw the particular frame from video at time of clicked on capture btn.
captureBtn.addEventListener("click", function(){
    let canvas = document.createElement("canvas"); 
    // canvas.height = window.innerHeight; 
    // canvas.width = window.innerWidth;

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let tool = canvas.getContext("2d");

    tool.drawImage(video, 0, 0);
    
    let imageURL = canvas.toDataURL();
    canvas.remove();

    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "image.png";
    a.click();
    a.remove();
})

recordBtn.addEventListener("click", function(){

    if(isRecording){
        mediaRecorder.stop();
        isRecording = false;
    }
    else{
        mediaRecorder.start();
        isRecording = true;
    }
})

let promise = navigator.mediaDevices.getUserMedia({video: true, audio: true});

promise.then(function(mediaStream){
    video.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);
    
    mediaRecorder.addEventListener("dataavailable", function(ev){
        chunks.push(ev.data);
    })

    mediaRecorder.addEventListener("stop", function(){
        let blob = new Blob(chunks, {type: "video/mp4"});
        chunks = [];

        let link = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = link;
        a.download = "video.mp4";
        a.click();
        a.remove();
    })
    // console.log("user has given the access");
})

promise.catch(function(){
    console.log("user has denied the access");
})