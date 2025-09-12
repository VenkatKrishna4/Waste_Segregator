const URL = "./Model/";

const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

let model, maxPredictions;

const fileInput = document.getElementById("file-input");
const imagePreview = document.getElementById("image-preview");
const resultText = document.getElementById("result-text");
const loadingText = document.getElementById("loading-text");    

async function loadModel() {
    try{
        console.log('Loading model...');
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log('Model loaded successfully.');
    }
    catch(error){
        console.error('Failed to load model:', error);
        alert('Failed to load the AI model. Please check the file path.');
    }

}

async function classify() {
    loadingText.style.display = 'block';
    resultText.style.display = 'none';

    const prediction = await model.predict(imagePreview);

    loadingText.style.display = 'none';
    resultText.style.display = 'block';     

    let maxProb = 0;
    let predictionClass = "";

    for(let i =0; i<maxPredictions; i++){
        if (prediction[i].probability > maxProb){
            maxProb = prediction[i].probability;
            predictionClass = prediction[i].className;
        }
    }
    resultText.className = ''; 
    

    if (predictionClass === "Recyclable") {
        resultText.classList.add('result-recyclable');
    } else if (predictionClass === "Organic") {
        resultText.classList.add('result-organic');
    } else if (predictionClass === "Hazardous") {
        resultText.classList.add('result-hazardous');
    } else if (predictionClass === "General Waste") {
        resultText.classList.add('result-general');
    }


    resultText.innerHTML = `This is <b>${predictionClass}</b>.`;
}

fileInput.addEventListener("change", function (event){

    resultText.innerHTML = "";
    resultText.className = ''; 
    imagePreview.style.display = 'none';

    const file = event.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function (e){
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';

            imagePreview.onload = async function imageWait(){
                await classify();
            };
        };
        reader.readAsDataURL(file);
    }
});

loadModel();