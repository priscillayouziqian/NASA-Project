const apiKey = process.env.API_KEY;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#button-date').addEventListener('click', getFetch);
});

async function getFetch() {
    const choice = document.querySelector('#input-date').value;
    console.log(choice);

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${choice}`;
    const earthUrl = `https://api.nasa.gov/EPIC/api/natural/date/${choice}?api_key=${apiKey}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        displayMedia(data)
        
        const earthRes = await fetch(earthUrl); // Fetch data for the second API
        const earthData = await earthRes.json();
        console.log(earthData);
        displayEarth(earthData);

        
        fetchAllMarsPhotos(); 
        
    } catch (err) {
        console.log(`error ${err}`);
    }
}

const getMarsPhotos = async (camera) => {
    const marsUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&camera=${camera}&api_key=${apiKey}`;
    
    try {
        const marsRes = await fetch(marsUrl); // Fetch data for the specified camera
        const marsData = await marsRes.json();
        console.log(marsData);
        return marsData; // Return the data for further processing if needed
    } catch (err) {
        console.log(`error ${err}`);
    }
};

// Call all cameras at the same time
const cameras = ['fhaz', 'rhaz', 'chemcam'];
const fetchAllMarsPhotos = async () => {
    const results = await Promise.all(cameras.map(camera => getMarsPhotos(camera)));
    console.log(results); // Log all results from the different cameras

    // Update the image sources for mars-img1, mars-img2, and mars-img3
    document.getElementById('mars-img1').src = results[0].photos[0].img_src; // First camera
    document.getElementById('mars-img2').src = results[1].photos[0].img_src; // Second camera
    document.getElementById('mars-img3').src = results[2].photos[0].img_src; // Third camera

    document.getElementById('mars-section').style.display = "block"; // Hide
};


function displayEarth(data) {
    try {
        if (data.length === 0) {
            document.getElementById('warning-section').style.display = "block";

            // Clean dynamic content
            document.querySelector('.chosen-date').innerText = ''; // Clear chosen date
            document.getElementById('centroid-coordinates').innerHTML = ''; // Clear centroid coordinates
            ['dscovr', 'lunar', 'sun'].forEach(key => 
                document.querySelector(`#${key}`).innerHTML = '' // Clear each section
            );

            throw new Error("No EPIC data available for the selected date.");
        }
        document.getElementById('warning-section').style.display = "none"; 
        
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
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

function displayMedia(data){
    // Reset both sections to ensure they are hidden initially
    document.querySelector('#img-nasa').style.display = "none"; // Hide the image element
    document.querySelector('#video-section-nasa').style.display = "none"; // Hide video section
    document.querySelector('#img-video-on-top').style.display = "none"; 

    if (data.media_type === 'image') {
        document.querySelector('#img-nasa').src = data.hdurl;
        document.querySelector('#img-nasa').style.display = "block"; // Show the image element
    } else if (data.media_type === 'video') {
        const iframe = document.querySelector('#iframe-nasa');
        iframe.setAttribute('src', data.url); // Set src attribute first
        iframe.style.display = "block"; // Ensure iframe is displayed
        
        // Show video section
        document.querySelector('#video-section-nasa').style.display = "block"; // Show video section
        
        document.querySelector('#img-video-on-top').style.display = "block"; 
        // Auto-scroll to the top
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top smoothly

        
    }
    
    document.querySelector('#title-nasa').innerText = data.title;
    document.querySelector('#explain').innerText = data.explanation;
}
