const apiKey = process.env.API_KEY;

document.querySelector('#button-date').addEventListener('click', getFetch);

async function getFetch() {
    const choice = document.querySelector('#input-date').value;
    console.log(choice);

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${choice}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        displayMedia(data)
        
    } catch (err) {
        console.log(`error ${err}`);
    }
}

function displayMedia(data){
    // Reset both sections to ensure they are hidden initially
    document.querySelector('#img-nasa').style.display = "none"; // Hide the image element
    document.querySelector('#video-section-nasa').style.display = "none"; // Hide video section

    if (data.media_type === 'image') {
        document.querySelector('#img-nasa').src = data.hdurl;
        document.querySelector('#img-nasa').style.display = "block"; // Show the image element
    } else if (data.media_type === 'video') {
        const iframe = document.querySelector('#iframe-nasa');
        iframe.setAttribute('src', data.url); // Set src attribute first
        iframe.style.display = "block"; // Ensure iframe is displayed
        
        // Show video section
        document.querySelector('#video-section-nasa').style.display = "block"; // Show video section
        
        // Auto-scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top smoothly
    }
    
    document.querySelector('#title-nasa').innerText = data.title;
    document.querySelector('#explain').innerText = data.explanation;
}
