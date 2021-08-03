import Blocks from 'Blocks';
import CANNON from 'cannon';
import Diagnostics from 'Diagnostics';
import Reactive from 'Reactive';
import Scene from 'Scene';
import Time from 'Time';
import TouchGestures from 'TouchGestures';

let counter = 0;
let ground;
let lastTime;
let planeTracker;
let spheres = [];
let world;

function resetGround() {
  if (ground) world.removeBody(ground);
  ground = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: new CANNON.Plane(),
  });
  const xAxis = new CANNON.Vec3(1, 0, 0);
  ground.quaternion.setFromAxisAngle(xAxis, -Math.PI / 2);
  world.addBody(ground);
}

function removeSphere() {
  if (spheres.length === 0) return;
  const { instance, body } = spheres.shift();
  world.removeBody(body);
  Scene.destroy(instance);
}

async function onLongPressCallback(gesture) {
  planeTracker.trackPoint(gesture.location, gesture.state);
  while (spheres.length > 0) removeSphere();
  resetGround();
}

async function onTapCallback(gesture) {
  while (spheres.length > 64) {
    removeSphere();
  }

  counter += 0.5;
  const x = Math.sin(counter) * 0.075;
  const y = 0.5;
  const z = Math.cos(counter) * 0.075;

  const instance = await Blocks.instantiate('sphereBlock');
  instance.transform.x = x;
  instance.transform.y = y;
  instance.transform.z = z;

  Time.setTimeoutWithSnapshot(
    {
      x: instance.transform.x,
      y: instance.transform.y,
      z: instance.transform.z,
    },
    () => {
      planeTracker.addChild(instance);
      let body;
      body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(x, y, z),
        shape: new CANNON.Sphere(0.04),
      });
      world.addBody(body);
      const created = Date.now();
      spheres.push({ instance, body, created });
    },
    0
  );
}

function onTimeCallback(time) {
  for (let i = 0; i < spheres.length; i += 1) {
    const { instance, body } = spheres[i];
    instance.transform.x = body.position.x;
    instance.transform.y = body.position.y;
    instance.transform.z = body.position.z;
    const quaternion = Reactive.quaternion(
      body.quaternion.w,
      body.quaternion.x,
      body.quaternion.y,
      body.quaternion.z
    );
    instance.transform.rotation = quaternion;
  }
  world.step(1 / 20);
}

function onTimeCleanupCallback() {
  while (spheres.length > 0 && Date.now() - spheres[0].created > 10000) {
    removeSphere();
  }
}

function initPhysics() {
  world = new CANNON.World();
  world.gravity.set(0, -2, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 5;
  world.defaultContactMaterial.contactEquationStiffness = 5e6;
  world.quatNormalizeFast = true;
  world.quatNormalizeSkip = 3;

  resetGround();
  Time.setInterval(onTimeCallback, 1000 / 20);
  Time.setInterval(onTimeCleanupCallback, 250);
}

async function start() {
  planeTracker = await Scene.root.findFirst('planeTracker0');
  TouchGestures.onLongPress().subscribe(onLongPressCallback);
  TouchGestures.onTap().subscribe(onTapCallback);
  initPhysics();
  Diagnostics.log('initiated.');
}

start();
