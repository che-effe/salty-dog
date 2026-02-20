import document from "document";
import { geolocation } from "geolocation";
import clock from "clock";
import { display } from "display";
import * as util from "./utils.js";

clock.granularity = "minutes";
let wave1 = document.getElementById("wave1");
let waveImage = document.getElementById("waveImage");
let Xdirection = 'in'
let Ydirection = 'down'

// Interval references for battery optimization
let waveXInterval = null;
let waveYInterval = null;

// ===========================================
// VIEW MANAGEMENT
// ===========================================
let currentView = 0; // 0 = main view, 1 = stats view
const view1 = document.getElementById("view1");
const view2 = document.getElementById("view2");
const navLeft = document.getElementById("navLeft");
const navRight = document.getElementById("navRight");

function switchToView(viewIndex) {
  currentView = viewIndex;
  
  if (viewIndex === 0) {
    view1.style.display = "inline";
    view2.style.display = "none";
    startAnimationIntervals();
  } else {
    view1.style.display = "none";
    view2.style.display = "inline";
    stopAnimationIntervals();
    updateStatsView();
  }
}

// Navigation chevron click handlers
if (navLeft) {
  navLeft.onclick = function() {
    if (currentView === 1) {
      switchToView(0);
    }
  };
}

if (navRight) {
  navRight.onclick = function() {
    if (currentView === 0) {
      switchToView(1);
    }
  };
}

// ===========================================
// SESSION STATS TRACKING
// ===========================================
let sessionData = {
  topSpeed: 0,           // in m/s (raw)
  topSpeedKnots: 0,
  topSpeedMph: 0,
  topSpeedKph: 0,
  totalDistance: 0,      // in nautical miles
  trackPoints: [],       // array of {lat, lon} for path
  lastPosition: null
};

// View 2 elements
const topspeedValue = document.getElementById("topspeed-value");
const topspeedUnit = document.getElementById("topspeed-unit");
const distanceValue = document.getElementById("distance-value");
const startMarker = document.getElementById("startMarker");
const currentMarker = document.getElementById("currentMarker");
const pathGroup = document.getElementById("pathGroup");
const resetBtn = document.getElementById("resetBtn");
const trackContainer = document.getElementById("trackContainer");

// Track map dimensions
const TRACK_WIDTH = 290;
const TRACK_HEIGHT = 115;
const TRACK_PADDING = 10;

function updateStatsView() {
  // Update top speed display based on current unit preference
  if (sogUnitOfMeasure === "knots") {
    topspeedValue.text = sessionData.topSpeedKnots.toFixed(1);
    topspeedUnit.text = "kts";
  } else if (sogUnitOfMeasure === "mph") {
    topspeedValue.text = sessionData.topSpeedMph.toFixed(1);
    topspeedUnit.text = "mph";
  } else {
    topspeedValue.text = sessionData.topSpeedKph.toFixed(1);
    topspeedUnit.text = "kph";
  }
  
  distanceValue.text = sessionData.totalDistance.toFixed(2) + " nm";
  
  // Update track visualization
  drawTrack();
}

function drawTrack() {
  if (sessionData.trackPoints.length < 2) {
    startMarker.style.display = "none";
    currentMarker.style.display = "none";
    return;
  }
  
  // Calculate bounds of track
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;
  
  for (let point of sessionData.trackPoints) {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLon = Math.min(minLon, point.lon);
    maxLon = Math.max(maxLon, point.lon);
  }
  
  // Add padding to bounds
  const latRange = maxLat - minLat || 0.001;
  const lonRange = maxLon - minLon || 0.001;
  
  // Scale points to fit in track display area
  const scaleX = (TRACK_WIDTH - 2 * TRACK_PADDING) / lonRange;
  const scaleY = (TRACK_HEIGHT - 2 * TRACK_PADDING) / latRange;
  const scale = Math.min(scaleX, scaleY);
  
  // Convert GPS to screen coords
  function toScreenCoords(lat, lon) {
    const x = TRACK_PADDING + (lon - minLon) * scale;
    const y = TRACK_HEIGHT - TRACK_PADDING - (lat - minLat) * scale;
    return { x, y };
  }
  
  // Position start marker
  const startCoords = toScreenCoords(sessionData.trackPoints[0].lat, sessionData.trackPoints[0].lon);
  startMarker.cx = startCoords.x;
  startMarker.cy = startCoords.y;
  startMarker.style.display = "inline";
  
  // Position current marker
  const lastPoint = sessionData.trackPoints[sessionData.trackPoints.length - 1];
  const currentCoords = toScreenCoords(lastPoint.lat, lastPoint.lon);
  currentMarker.cx = currentCoords.x;
  currentMarker.cy = currentCoords.y;
  currentMarker.style.display = "inline";
}

// Calculate distance between two GPS points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function resetSession() {
  sessionData = {
    topSpeed: 0,
    topSpeedKnots: 0,
    topSpeedMph: 0,
    topSpeedKph: 0,
    totalDistance: 0,
    trackPoints: [],
    lastPosition: null
  };
  updateStatsView();
  console.log("Session reset");
}

// Reset button handler
if (resetBtn) {
  resetBtn.onclick = function() {
    resetSession();
  };
}

// ===========================================
// ANIMATION INTERVALS
// ===========================================
function startAnimationIntervals() {
  if (!waveXInterval) {
    waveXInterval = setInterval(() => {
      if (Xdirection === 'out') {
        Xdirection = 'in';
        wave1.animate("load");
      } else {
        Xdirection = 'out';
        wave1.animate("collapse");
      }
    }, 10000);
  }
  
  if (!waveYInterval) {
    waveYInterval = setInterval(() => {
      if (Ydirection === 'up') {
        Ydirection = 'down';
        wave1.animate("enable");
      } else {
        Ydirection = 'up';
        wave1.animate("disable");
      }
    }, 1000);
  }
}

function stopAnimationIntervals() {
  if (waveXInterval) {
    clearInterval(waveXInterval);
    waveXInterval = null;
  }
  if (waveYInterval) {
    clearInterval(waveYInterval);
    waveYInterval = null;
  }
}

// Handle display on/off for battery optimization
display.addEventListener("change", () => {
  if (display.on) {
    if (currentView === 0) {
      startAnimationIntervals();
    }
  } else {
    stopAnimationIntervals();
  }
});

// Start intervals on app launch
startAnimationIntervals();

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
function getKph(vertComp) {
  return (vertComp*3.6).toFixed(1);
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

  } else if (sogUnitOfMeasure === "mph") {
    sogUnitOfMeasure = "kph";
    sogLabel.text = "kph"
    sogData.groupTransform.x = 100;

  } else if (sogUnitOfMeasure === "kph") {
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
    kph: {
      value: position.coords.speed ? getKph(position.coords.speed) : 0,
      label: "kph"
    },
    heading: {
      value: position.coords.heading ? parseInt(position.coords.heading) : 0
    }
  };
  
  // Update main view display
  sogData.text = data[sogUnitOfMeasure].value;
  headingData.text = data.heading.value + "°"; 
  dirContainer.groupTransform.rotate.angle = parseInt(data.heading.value);
  
  // ===========================================
  // SESSION TRACKING - Top Speed & Path
  // ===========================================
  const currentSpeed = position.coords.speed || 0;
  
  // Update top speed if current speed is higher
  if (currentSpeed > sessionData.topSpeed) {
    sessionData.topSpeed = currentSpeed;
    sessionData.topSpeedKnots = parseFloat(getKnots(currentSpeed));
    sessionData.topSpeedMph = parseFloat(getMph(currentSpeed));
    sessionData.topSpeedKph = parseFloat(getKph(currentSpeed));
  }
  
  // Record GPS track point (throttle to prevent too many points)
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  
  if (lat && lon) {
    const currentPosition = { lat, lon };
    
    // Calculate distance from last position
    if (sessionData.lastPosition) {
      const dist = calculateDistance(
        sessionData.lastPosition.lat,
        sessionData.lastPosition.lon,
        lat,
        lon
      );
      
      // Only add point if moved more than 0.001 nm (about 6 feet) to reduce noise
      if (dist > 0.001) {
        sessionData.totalDistance += dist;
        sessionData.trackPoints.push(currentPosition);
        
        // Limit track points to prevent memory issues (keep last 500 points)
        if (sessionData.trackPoints.length > 500) {
          sessionData.trackPoints.shift();
        }
      }
    } else {
      // First point - add to track
      sessionData.trackPoints.push(currentPosition);
    }
    
    sessionData.lastPosition = currentPosition;
  }
  
  // Update stats view if currently visible
  if (currentView === 1) {
    updateStatsView();
  }
})


