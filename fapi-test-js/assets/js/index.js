const cam = document.getElementById('cam')
var descriptionOfPerson = []
var person = []
var idMatcher = []
var countPeople = 0
const startVideo = () => {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        if (Array.isArray(devices)) {
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    if (device.label.includes('C920')) {
                        navigator.getUserMedia(
                            { video: {
                                deviceId: device.deviceId
                            }},
                            stream => cam.srcObject = stream,
                            error => console.error(error)
                        )
                    }
                }
            })
        }
    })
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./assets/lib/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./assets/lib/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./assets/lib/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./assets/lib/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('./assets/lib/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/lib/face-api/models'),
]).then(startVideo)

cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }

    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)

    setInterval(async () => {
        
        const detections = await faceapi
        .detectAllFaces(cam, new faceapi
            .TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptors()

        if(detections.length){
            detections.forEach(readFaces)
        }
    }, 250)
})

async function readFaces(item,i,arr){
    
    arr[i] = item
    var arrs = []
    for(j=0;j<=127;j++){
        arrs[j] = arr[i].descriptor[j]
    }
    var arrObj = { 
        timestamp:          moment().unix(),
        detectionScore:     arr[i].detection.score, 
        landmarks:          arr[i].landmarks, 
        alignedRect:        arr[i].alignedRect,
        expressions:        arr[i].expressions,
        gender:             arr[i].gender,
        genderProbability:  arr[i].genderProbability,
        age:                parseInt(arr[i].age, 10),
        descriptors:        arrs
    };
    var arrJSON = JSON.stringify(arrObj);

    console.dir(arrJSON)
}

// async function sendMensage(){
//     var form;
//     form.onsubmit = function (e) {
//     // stop the regular form submission
//     e.preventDefault();

//     // collect the form data while iterating over the inputs
//     var data = {};
//     for (var i = 0, ii = form.length; i < ii; ++i) {
//         var input = form[i];
//         if (input.name) {
//             data[input.name] = input.value;
//         }
//     }
//     // construct an HTTP request
//     var xhr = new XMLHttpRequest();
//     xhr.open(form.method, form.action, true);
//     xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

//     // send the collected data as JSON
//     xhr.send(JSON.stringify(data));

//     xhr.onloadend = function () {
//         // done
//     };
//     };
// }
