
import * as messaging from "messaging";

messaging.peerSocket.onmessage = event => {
  const { url, guid } = event.data;
  fetch(url).then(res => res.json()).then(json => {    
    messaging.peerSocket.send({ url, guid, json });
  }).catch(e => console.log(e));
}