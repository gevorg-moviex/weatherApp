// form
const locationInput = document.getElementById("search-input");
const weatherAppForm = document.getElementById("weather-app-form");
const searchBtn = document.getElementById("search-btn")
// info container
const infoContainer = document.getElementById("info-container");
const locationTag = document.getElementById("location");
const temperatureTag = document.getElementById("temperature");
const descriptionTag = document.getElementById("description");
const iconTag = document.getElementById("icon");
// error container
const errorMessageTag = document.getElementById("error-message");
// loading container
const loadingContainer = document.getElementById("loading-container");

const mainDiv = document.getElementById("info")
const title = document.getElementById("title")
const inputsDiv = document.getElementById("inputs")




async function request(url, options, onsuccess, onerror) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        onsuccess(data);
      } else {
        onerror({ statusCode: data.cod, message: data.message });
      }
    } catch (error) {
      onerror({ error, message: "Request is not sent" });
    }
   }
   
const HOST = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "aa175c67e404abb33a543ef63f6b8b3a"

weatherAppForm.addEventListener("submit", function(event){
    event.preventDefault(); 

    let inputVal = locationInput.value;
    console.log(inputVal);

    const url = `${HOST}?q=${inputVal}&appid=${API_KEY}&units=metric`

    setLoading(true);

    request(url, null, result => {
    displayInfo(result)
 
     console.log(result);
     let obj = {
        name: inputVal
     }

     localStorage.setItem("name", JSON.stringify(obj))
     setLoading(false);
    
    }, (error) => {
     displayError(`Error: Nothing to geocode`)
     setLoading(false);
     console.log(`Error: ${error.message}`);
    
    });
});
   
document.addEventListener("DOMContentLoaded", function() {
    let storedObj = localStorage.getItem("name");
    if (storedObj) {
        let { name } = JSON.parse(storedObj);

        const url = `${HOST}?q=${name}&appid=${API_KEY}&units=metric`;

        setLoading(true);

        request(url, null, result => {
            console.log(result);
            displayInfo(result);
            setLoading(false);
        }, error => {
            console.log(`Error: ${error.message}`);
            setLoading(false);
        });
    }
});


function displayInfo(data){
    errorMessageTag.style.display = "none";
    title.style.display = "block"
    inputsDiv.style.display = "flex"
    infoContainer.style.display = "flex";
    locationTag.textContent = data.name + "," + " " + data.sys.country;
    temperatureTag.textContent = `${data.main.temp} °C`;
    descriptionTag.textContent = data.weather[0].description;
    iconTag.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
}


function displayError(message) {
  title.style.display = "block"
  inputsDiv.style.display = "flex"
  errorMessageTag.textContent = message;
  errorMessageTag.style.display = "block";
  infoContainer.style.display = "none";
}

function setLoading(isLoading) {
  loadingContainer.style.display = isLoading ? "block" : "none";
  if (isLoading) {
      infoContainer.style.display = "none";
      errorMessageTag.style.display = "none";
      title.style.display = "none"
      inputsDiv.style.display = "none"
  }
}