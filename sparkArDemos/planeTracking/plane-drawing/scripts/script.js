import Blocks from 'Blocks';
import Diagnostics from 'Diagnostics';
import Reactive from 'Reactive';
import Scene from 'Scene';
import Time from 'Time';
import TouchGestures from 'TouchGestures';

const spheres = [];
let lastPoint = null;
let nullObj;
let timer;
let zIndex;

function removeSphere() {
  const sphere = spheres.shift();
  Scene.destroy(sphere);
}

async function onLongPressCallback(gesture) {
  while (spheres.length > 0) removeSphere();
}

function onTimerCallback(sphere) {
  nullObj.addChild(sphere);
  spheres.push(sphere);
  while (spheres.length > 1024) removeSphere();
}

async function onIntervalCallback(_time, data) {
  const { x, y, z, state } = data;

  if (state === 'ENDED') {
    Time.clearInterval(timer);
    return;
  }

  zIndex += 0.0001;
  const thisPoint = Reactive.point(x, y, z + zIndex);
  if (lastPoint !== null) {
    const distance = Reactive.distance(lastPoint, thisPoint).pinLastValue();
    if (distance > 0.001) {
      lastPoint = thisPoint;
    } else return;
  } else {
    lastPoint = thisPoint;
  }

  const sphere = await Blocks.instantiate('sphereBlock');
  sphere.transform.position = thisPoint;
  sphere.transform.scale = Reactive.point(0.5, 0.5, 0.5);
  sphere.inputs.setScalar('colorOffset', x + y + z);
  Time.setTimeoutWithSnapshot(
    {
      x: sphere.transform.x,
      y: sphere.transform.y,
      z: sphere.transform.z,
    },
    onTimerCallback.bind(null, sphere),
    0
  );
}

function onPanCallback(gesture) {
  zIndex = 0;
  const gestureTransform = Scene.unprojectToFocalPlane(gesture.location);
  timer = Time.setIntervalWithSnapshot(
    {
      x: gestureTransform.x,
      y: gestureTransform.y,
      z: gestureTransform.z,
      state: gesture.state,
    },
    onIntervalCallback,
    1000 / 30
  );
}

async function start() {
  nullObj = await Scene.root.findFirst('nullObject0');
  TouchGestures.onLongPress().subscribe(onLongPressCallback);
  TouchGestures.onPan().subscribe(onPanCallback);
  Diagnostics.log('initiated');
}

start();
