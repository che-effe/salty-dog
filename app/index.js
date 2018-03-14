import document from "document";
import { geolocation } from "geolocation";
import clock from "clock";
import * as util from "utils";
import { fetch } from "fetch"
clock.granularity = "minutes";

// Get a handle on the <text> element
let chron = document.getElementById("chron");
var main = document.getElementById("main");
var dirInd = document.getElementById("DirectionIndicator");
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

// let windData = {
//   speed: {
//     value: 0
//   },
//   direction: {
//     value: 180
//   }
// }
let sogData = document.getElementById("sog-data");
let sogLabel = document.getElementById("sog-label");
let headingData = document.getElementById("heading-data");

function getKnots(vertComp) {
  return (vertComp/0.5144456334).toFixed(1);
}
function getMph(vertComp) {
  return (vertComp/0.447039259).toFixed(1);
}

// function getWeatherInfo(lat,lon) {
//   let cityKey;
//   fetch("https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=zxJFDALUQ9kI9yyWWCy1AjAeh9fzhxpx&q=+"+ lat + ","+ lon + "HTTP/1.1").then(
//   function(response) {
//     console.log(response.json());
//     cityKey = response.json().Key;
//     }
//   )
// }

getWeatherInfo
main.onclick = function(e){
  console.log("click");
  if (sogUnitOfMeasure === "knots"){
    sogUnitOfMeasure = "mph";
    sogLabel.text = "mph";
    sogData.x = 100;

  } else {
    sogUnitOfMeasure = "knots";
    sogLabel.text = "kts";
    sogData.x = 86;
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
  
  /*
  This block here looks at the value of a variable called sogUnitOfMeasure (Speed over ground unit of measure). This value toggles between `mph` and `knots` on tap of the screen so the user can switch back and forth easily.
  */
  if (sogUnitOfMeasure === 'knots'){
      sogData.text = data.knots.value;
      sogData.x = 86;
      sogLabel.text = data.knots.label;
  } else {
      sogData.text = data.mph.value;
      sogData.x = 100;
      sogLabel.text = data.mph.label;
  }
  headingData.text = data.heading.value + "°"; 
  dirContainer.groupTransform.rotate.angle = (parseInt(data.heading.value) - 360);
})


