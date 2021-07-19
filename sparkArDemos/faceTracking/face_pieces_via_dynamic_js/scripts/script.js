/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Diagnostics = require('Diagnostics');
const Materials = require('Materials');


(async function () {  // Enables async/await in JS [part 1]

  var face = FaceTracking.face(0);
  let leftEye = face.leftEye.center;

  const triMaterial = await Materials.findFirst('triangleMaterial');
  const nullObj = await Scene.root.findFirst("nullObject0");

  for (let i = 0; i < 10; i++){
    // make a dynamic plane
    const dynamicPlane = await Scene.create("Plane", {
          "name": "Plane" + i,
          "width": 0.1,
          "height": 0.1,
          "hidden": false,
      });
    // set its material
    dynamicPlane.material = triMaterial;

    dynamicPlane.transform.x = leftEye.x;
    dynamicPlane.transform.y = leftEye.y;
    dynamicPlane.transform.z = i*0.03;
    dynamicPlane.transform.rotationZ = (i*10.1);

    // add it to the null object
    nullObj.addChild(dynamicPlane);
  }



})(); // Enables async/await in JS [part 2]
