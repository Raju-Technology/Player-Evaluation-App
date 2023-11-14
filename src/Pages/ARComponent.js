// ARComponent.js

import React, { useRef } from 'react';
import 'aframe';

function ARComponent() {
  const cameraRef = useRef();

  const captureImage = () => {
    const canvas = cameraRef.current.components.screenshot.getCanvas('perspective');
    const imageDataURL = canvas.toDataURL('image/png');
    console.log(imageDataURL); 
  };

  return (
    <a-scene>
      <a-camera ref={cameraRef} position="0 1.6 0"></a-camera>
      <a-box position="0 0.5 -3" rotation="0 45 0" color="red"></a-box>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-entity id="button" visible="true" geometry="primitive: plane; width: 1; height: 0.3" position="0 0 -5" event-set__click="_target: #imageCapture; visible: true" onClick={captureImage}></a-entity>
      <a-entity position="0 0.1 0" rotation="-90 0 0" event-set__click="_target: #imageCapture; visible: true" geometry="primitive: plane; width: 1; height: 1"></a-entity>
      <a-entity id="imageCapture" visible="false" event-set__click="_target: #imageCapture; visible: false" position="0 0 0" screenshot="width: 1024; height: 1024" capture-mouse></a-entity>
    </a-scene>
  );
}

export default ARComponent;
