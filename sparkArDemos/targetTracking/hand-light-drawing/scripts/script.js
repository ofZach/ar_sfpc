import Animation from 'Animation';
import Diagnostics from 'Diagnostics';
import Scene from 'Scene';

let emitter0;
let emitter1;

async function start() {
  [emitter0, emitter1] = await Promise.all([
    Scene.root.findFirst('emitter0'),
    Scene.root.findFirst('emitter1'),
  ]);

  const alphaSampler = Animation.samplers.HSVA([
    Animation.samplers.constant(1),
    Animation.samplers.constant(2),
    Animation.samplers.constant(3),
    Animation.samplers.easeOutSine(1, 0),
  ]);

  const sizeSampler = Animation.samplers.linear(0.015, 0.0);

  emitter0.hsvaColorModulationModifier = alphaSampler;
  emitter1.hsvaColorModulationModifier = alphaSampler;
  emitter0.sizeModifier = sizeSampler;
  emitter1.sizeModifier = sizeSampler;
}

start();
