// How to load in modules
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Diagnostics = require('Diagnostics');
const Materials = require('Materials');
const TouchGestures = require('TouchGestures');




async function addPlane() {

  const nullObj = await Scene.root.findFirst("nullObject0");
  const camPos = await Scene.root.findFirst("camPosition");
  const circleMaterial = await Materials.findFirst("circleMaterial");


  const dynamicPlane =  await Scene.create("Plane", {
        "name": "Plane",
        "width": 0.1,
        "height": 0.1,
        "hidden": false,
    });
  // set its material

  dynamicPlane.material = circleMaterial;

  dynamicPlane.transform.x = camPos.worldTransform.x.pinLastValue();
  dynamicPlane.transform.y = camPos.worldTransform.y.pinLastValue();
  dynamicPlane.transform.z = camPos.worldTransform.z.pinLastValue();

  dynamicPlane.transform.rotationX = camPos.worldTransform.rotationX.pinLastValue();
  dynamicPlane.transform.rotationY = camPos.worldTransform.rotationY.pinLastValue();
  dynamicPlane.transform.rotationZ = camPos.worldTransform.rotationZ.pinLastValue();


  nullObj.addChild(dynamicPlane);
}


(async function () {  // Enables async/await in JS [part 1]



  TouchGestures.onTap().subscribe(async function (gesture) { // cycle visibility for assets on event
    Diagnostics.log("tap");


addPlane();


  });


})();
