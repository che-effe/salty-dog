import document from "document";
import { geolocation } from "geolocation";
import clock from "clock";
import * as util from "./utils.js";

clock.granularity = "minutes";

// Get a handle on the <text> element
let chron = document.getElementById("chron");
var main = document.getElementById("main");
var dirContainer = document.getElementById("dirContainer");
let sogUnitOfMeasure = "knots"
// Update the <text> element with the current time
function updateClock() {
  let today = new Date();
  let year = today.getFullYear();
  let month = (today.getMonth())+1;
  let day = today.getDate();
  let hours = util.standardTime(today.getHours());
  let mins = util.zeroPad(today.getMinutes());
  let meridian = "am";
  if (today.getHours() > 12) {
    meridian = "pm";
  }
  
  chron.text = `${hours}:${mins}`;
}

// Update the clock every tick event
clock.ontick = () => updateClock();

let sogData = document.getElementById("sog-data");
let sogLabel = document.getElementById("sog-label");
let headingData = document.getElementById("heading-data");

function getKnots(vertComp) {
  return (vertComp/0.5144456334).toFixed(1);
}
function getMph(vertComp) {
  return (vertComp/0.447039259).toFixed(1);
}

function getWeatherInfo(lat,lon) {
  let cityKey;
  console.log("lat",lat);
  // fetch("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+utils.ACWstring+"&q=+"lat+ ","+lon + "HTTP/1.1").then(
  // function(response) {
  //   console.log(response.json());
  //   cityKey = response.json().Key;
  //   }
  // )
}


main.onclick = function(e){
  console.log("click");
  if (sogUnitOfMeasure === "knots"){
    sogUnitOfMeasure = "mph";
    sogLabel.text = "mph"
    sogData.groupTransform.x = 100;

  } else {
    sogUnitOfMeasure = "knots";
    sogLabel.text = "kts"
    sogData.groupTransform.x = 86;

  }
};
geolocation.watchPosition(function(position) {
  let data = {
    knots: {
      value: position.coords.speed ? getKnots(position.coords.speed) : 0,
      label: "kts"
    },
    mph: {
      value: position.coords.speed ? getMph(position.coords.speed) : 0,
      label: "mph"
    },
    heading: {
      value: position.coords.heading ? position.coords.heading.toFixed(2) : 0
    }
  };
  // getWeatherInfo(position.coords.latitude, position.coords.longitude);
 sogData.text = data[sogUnitOfMeasure].value + " " + data[sogUnitOfMeasure].label;
  headingData.text = data.heading.value + "°"; 
  dirContainer.groupTransform.rotate.angle = parseInt(data.heading.value);
})


