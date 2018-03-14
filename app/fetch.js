import Promise from 'promise';
import * as messaging from "messaging";

const OPEN = messaging.peerSocket.OPEN;

// Helpful to check whether we are connected or not.
// setInterval(() => {
//   const readyState = messaging.peerSocket.readyState;
//   console.log(`App running - Connectivity status=${readyState} 
//     Connected? ${readyState === OPEN ? 'YES' : 'no'}`);
// }, 3000);

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

let guid = 0;
const promises = {};
const queue = [];

function send(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    queue.push(data);
  }
}

messaging.peerSocket.onopen = () => {
  // give it a moment
  setTimeout(() => {
    for (let i = 0; i < queue.length; i++) {
      send(queue[i]);
    }

    queue.length = 0; // ditch memory    
  }, 100);
}

export const fetch = url => {
  return new Promise((resolve, reject) => {
    guid++;
    
    promises[guid] = {
      resolve, reject, url
    };
    send({ url, guid });
  });  
}


// Listen for the onmessage event
messaging.peerSocket.onmessage = event => {
  // Output the message to the console
  const { guid, url, json } = event.data;
  promises[guid].resolve(json)
}