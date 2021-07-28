let video = document.querySelector('video');
let recordBtn = document.querySelector("#record");
let captureBtn = document.querySelector('#capture');
let body = document.querySelector("body");

let mediaRecorder;
let chunks = [];
let isRecording = false;

let allFilters = document.querySelectorAll('.filter')
let filter = ""

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
    // canvas.height = window.innerHeight; 
    // canvas.width = window.innerWidth;

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let tool = canvas.getContext("2d");

    tool.drawImage(video, 0, 0);

    if(filter != ""){
        tool.fillStyle = filter;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }

    let imageURL = canvas.toDataURL();
    canvas.remove();

    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "image.png";
    a.click();
    a.remove();
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