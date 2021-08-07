let video = document.querySelector('video');
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector('#capture');
let body = document.querySelector("body");

let mediaRecorder;
let chunks = [];
let isRecording = false;

let allFilters = document.querySelectorAll('.filter')
let filter = ""

let galleryBtn = document.querySelector("#gallery");

let zoomIn = document.querySelector('.in');
let zoomOut = document.querySelector('.out');
let currZoom = 1;       // this is for zoom level min-val = 1, and it's max-value = 3

zoomIn.addEventListener("click", function(){
    currZoom += 0.1;

    if(currZoom > 3){
        currZoom = 3;
    }

    video.style.transform = `scale(${currZoom})`;
})

zoomOut.addEventListener("click", function(){
    currZoom -= 0.1;

    if(currZoom < 1){
        currZoom = 1;
    }

    video.style.transform = `scale(${currZoom})`;
})

galleryBtn.addEventListener("click", function(){
    location.assign("gallery.html");
})

for(let i = 0; i < allFilters.length; i++){

    allFilters[i].addEventListener("click", function(ev){
        let color = ev.currentTarget.style.backgroundColor; //get the color of the filter
        filter = color;

        let prevfilterDiv = document.querySelector('.filter-div'); // checking if filter is already exist

        if(prevfilterDiv) prevfilterDiv.remove();
        
        let filterDiv = document.createElement("div");      //create filterDiv
        filterDiv.classList.add("filter-div");              //give the class
        filterDiv.style.backgroundColor = color;            //set the color
        body.append(filterDiv);                             //append it in the body

    })
}

//on clicking the capture button we are creating a canvas and draw the particular frame from video at time of clicked on capture btn.
captureBtn.addEventListener("click", function(){

    let captureCircle = captureBtn.querySelector('span');
    captureCircle.classList.add("capture-animation");

    setTimeout(function(){
        captureCircle.classList.remove("capture-animation");
    },1000)

    let canvas = document.createElement("canvas"); 

    //for captured image to be in exact size as video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");

    tool.translate(canvas.width / 2, canvas.height / 2) // this will bring the origin on center.
    tool.scale(currZoom, currZoom) // this will scale up to the current zoom level in x and y direction.
    tool.translate(-canvas.width / 2, -canvas.height / 2) // this will bring back the origin to the top-left corner of the canvas.

    tool.drawImage(video, 0, 0);

    if(filter != ""){
        tool.fillStyle = filter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let imageURL = canvas.toDataURL();
    canvas.remove();

    saveMedia(imageURL);

// ---------------as we are saving the image data url in indexedDB, there is no need to create an anchor tag for download image --------
    // let a = document.createElement('a');
    // a.href = imageURL;
    // a.download = "image.png";
    // a.click();
    // a.remove();
})

recordBtn.addEventListener("click", function(){
    let recordCircle = recordBtn.querySelector('span');
    let prevfilterDiv = document.querySelector('.filter-div'); // checking if filter is already exist
    if(prevfilterDiv) prevfilterDiv.remove();
    filter = "";

    if(isRecording){
        recordCircle.classList.remove("record-animation")
        mediaRecorder.stop();
        isRecording = false;
    }
    else{
        recordCircle.classList.add("record-animation")
        currZoom = 1;
        video.style.transform = `scale(${currZoom})`;
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

        saveMedia(blob);

// ---------------as we are saving the blob of the video in indexedDB, there is no need to create an anchor tag for download video --------
        // let link = URL.createObjectURL(blob);

        // let a = document.createElement('a');
        // a.href = link;
        // a.download = "video.mp4";
        // a.click();
        // a.remove();
    })
    // console.log("user has given the access");
})

promise.catch(function(){
    console.log("user has denied the access");
})