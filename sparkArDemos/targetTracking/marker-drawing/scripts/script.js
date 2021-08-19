import Animation from 'Animation';
import Diagnostics from 'Diagnostics';
import Scene from 'Scene';

async function start() {
  const emitters = await Promise.all([
    Scene.root.findFirst('redTrackerEmitter'),
    Scene.root.findFirst('redEmitter'),
    Scene.root.findFirst('greenTrackerEmitter'),
    Scene.root.findFirst('greenEmitter'),
    Scene.root.findFirst('blueTrackerEmitter'),
    Scene.root.findFirst('blueEmitter'),
  ]);

  const alphaSampler = Animation.samplers.HSVA([
    Animation.samplers.constant(1),
    Animation.samplers.constant(2),
    Animation.samplers.constant(3),
    Animation.samplers.easeOutSine(1, 0),
  ]);

  for (let emitter of emitters) {
    emitter.hsvaColorModulationModifier = alphaSampler;
  }
}

start();
