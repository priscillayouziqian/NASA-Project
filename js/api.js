// require('dotenv').config(); // Load environment variables from .env file
const apiKey = process.env.API_KEY;
let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`

async function fetchImage() {
    try {
        const response = await fetch(url); 
        const data = await response.json();
        console.log(data); 
    } catch (error) { 
        console.error(error); 
    }
}
fetchImage();
