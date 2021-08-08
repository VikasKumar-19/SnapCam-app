let req = indexedDB.open("Gallery", 1);
let database;

req.addEventListener("success", function(){
    database = req.result;
})

req.addEventListener("upgradeneeded", function(){
    let db = req.result;
    db.createObjectStore("media", {keyPath: "mId"})
})

req.addEventListener("error", function(){

})

function saveMedia(media){

    if(!database){
        return;
    }

    let data = {
        mId: Date.now(),
        mediaData: media
    }

    let txn = database.transaction("media", "readwrite");
    let mediaObjectStore = txn.objectStore("media");
    mediaObjectStore.add(data)

}

function viewMedia(){
    console.log("hi");
    if(!database){
        return;
    }

    let galleryContainer = document.querySelector('.gallery-container');

    let txn = database.transaction("media", "readonly");
    let mediaObjectStore = txn.objectStore("media");
    
    let req = mediaObjectStore.openCursor();

    req.addEventListener("success",function(){

        let cursor = req.result;

        if(cursor){
            
            let mediaCard = document.createElement('div');
            mediaCard.classList.add('media-card');
            mediaCard.innerHTML = `<div class="actual-media"></div>
            <div class="media-buttons">
                <button class="media-download">Download</button>
                <button class="media-delete">Delete</button>
            </div>`

            let data = cursor.value.mediaData;

            let actualMediaDiv = mediaCard.querySelector('.actual-media');
            
            if(typeof data == "string"){
                let image = document.createElement("img");
                image.src = data;
                actualMediaDiv.append(image);
            }
            else if(typeof data == "object"){
                let video = document.createElement('video');
                video.autoplay = true;
                video.loop = true;
                video.controls = true;
                video.muted = true;
                let url = URL.createObjectURL(data);
                video.src = url;
                actualMediaDiv.append(video);
            }

            galleryContainer.append(mediaCard);
            cursor.continue();
        }
    })
}