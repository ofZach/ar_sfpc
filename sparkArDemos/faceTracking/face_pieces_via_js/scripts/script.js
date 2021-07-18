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
// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

(async function () {  // Enables async/await in JS [part 1]

  var face = FaceTracking.face(0);
  let leftEye = face.leftEye.center;

  for (let i = 0; i < 6; i++){
    const plane = await Scene.root.findFirst('tri' + i);
    plane.transform.x = leftEye.x;
    plane.transform.y = leftEye.y;
    plane.transform.z = i*0.03;
    plane.transform.rotationZ = (i*10.1);
  }



})(); // Enables async/await in JS [part 2]
