const apiKey = process.env.API_KEY;

document.querySelector('#button-date').addEventListener('click', getFetch);

async function getFetch() {
    const choice = document.querySelector('#input-date').value;
    console.log(choice);

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${choice}`;
    const earthUrl = `https://api.nasa.gov/EPIC/api/natural/date/${choice}?api_key=${apiKey}`

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        displayMedia(data)
        
        const earthRes = await fetch(earthUrl); // Fetch data for the second API
        const earthData = await earthRes.json();
        console.log(earthData);
        displayEarth(earthData);
        
    } catch (err) {
        console.log(`error ${err}`);
    }
}

function displayEarth(data) {
    document.querySelector('.chosen-date').innerText = data[0].date;
    
    const setInnerHTML = (selector, coords) => {
        // Add CSS to remove bullet points
        document.querySelector(selector).innerHTML = `<ul style="list-style-type: none;">${coords.map(c => `<li>${c}</li>`).join('')}</ul>`;
    };

    setInnerHTML('#centroid-coordinates', [
        `Latitude: ${data[0].centroid_coordinates.lat}`,
        `Longitude: ${data[0].centroid_coordinates.lon}`
    ]);
    ['dscovr', 'lunar', 'sun'].forEach(key => 
        setInnerHTML(`#${key}`, ['x', 'y', 'z'].map(coord => `${coord.toUpperCase()}: ${data[0][`${key}_j2000_position`][coord]}`))
    );
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