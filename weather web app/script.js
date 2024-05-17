const userTab=document.querySelector('[data-user-weather]');
const searchTab=document.querySelector('[data-search-weather]');
const weatherContainer=document.querySelector('.weather-container');
const grantLocationContainer=document.querySelector('.grant-location-container');
const searchform=document.querySelector('[data-search-form]');
const loadingContainer=document.querySelector('.loading-container');
const searchInput=document.querySelector('[data-search-input]');
const searchButton=document.querySelector('[data-search-button]');
const userWeatherContainer=document.querySelector('.user-weather-container');
const weatherCity=document.querySelector('.weather-city');
const parameterContainer=document.querySelector('.parameter-container');
const grantAccessButton = document.querySelector('[data-grant-access]');
const APIkey="215c362b63b0c7431186539e2a6670bd"
let currentTab= userTab;
currentTab.classList.add('current-tab');
getFromSessionStorage();

//tab-swiching
userTab.addEventListener('click',() =>{
    //passed clicked tab as input parameter to switchtab fun
    switchTab(userTab);
});
searchTab.addEventListener('click',() =>{
    //passed clicked tab as input parameter to switchtab fun
    switchTab(searchTab);
});

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');
        if(!searchform.classList.contains('active')){
            grantLocationContainer.classList.remove('active');
            userWeatherContainer.classList.remove('active');
            searchform.classList.add('active');
        }
        else{
            searchform.classList.remove('active');
            //grantLocationContainer.classList.add('active');
            userWeatherContainer.classList.remove('active');
            //grantLocationContainer.classList.add('active');
            //now in im your weather...have to dispay weather 
            //if cp-ordinates stored alredy in local storage
           getFromSessionStorage();
        }
    }
}
//check if co-ordinates alredy present storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');//returns null if no item is stored
    //or retuns stored data as string
    if(!localCoordinates){
        grantLocationContainer.classList.add('active');
    }
    else{
        const coordinates =JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}
async function fetchWeatherInfo(coordinates){
    const {lat,lon}=coordinates; //destructuring assignment 
    grantLocationContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    //api call
    try{
        //console.log('111');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=215c362b63b0c7431186539e2a6670bd`);
        const data = await response.json();
        //console.log('111');
        loadingContainer.classList.remove('active');
        userWeatherContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        console.log(err);
    }
}

function renderWeatherInfo(data){
    //firstly we have to fetch all the elemenst
    const weatherCityName = document.querySelector('[data-weather-city]');
    const countryFlag = document.querySelector('[data-country-flag]');
    const weatherStatus = document.querySelector('[data-weather-status]');
    const weatherImage = document.querySelector('[data-weather-image]');
    const weatherTemperature = document.querySelector('[data-temperature]');
    const weatherWindspeed = document.querySelector('[data-windspeed]');
    const weatherHumidity = document.querySelector('[data-humidity]');
    const weatherClouds = document.querySelector('[data-clouds]');
    //
    weatherCityName.innerText = data?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    weatherStatus.innerText = data?.weather?.[0]?.description;
    weatherImage.src =`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`;
    weatherTemperature.innerText =`${data?.main?.temp} C`;
    weatherWindspeed.innerText = `${data?.wind?.speed} m/s`;
    weatherHumidity.innerText = `${data?.main?.humidity} %`;
    weatherClouds.innerText = `${data?.clouds?.all} %`;
}

grantAccessButton.addEventListener('click',getlocation);
//geolocation object has a method called getCurrentPosition
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
        //getCurrentPosition method returns a Position objec
    }
    else{
        alert('no geolocation support');
    }
}
function showPosition(position){
    const userCoordinates = {     //created location object
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    //stored in local browser storage and object is stored as json string
    //again it is parse into json object while using local stored coordinate 
    sessionStorage.setItem('user-coordinates',JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}
searchform.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(searchInput.value==="")
    return;
    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city){0
    grantLocationContainer.classList.remove('active');
    userWeatherContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);
        const data = await response.json();
        loadingContainer.classList.remove('active');
        userWeatherContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (err){
        console.log('search fetch error');
    }
    
}
