// Accent 3D în hero — mașinuță low-poly cu bule de apă în jur, temă clară pentru spălătorie auto.
// Notă cost: Three.js adaugă ~670KB doar pentru acest efect — vezi README pentru context.
import * as THREE from "./vendor/three.module.min.js";

const canvas = document.getElementById("hero3d");

if (canvas && window.WebGLRenderingContext) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1.4, 0.1, 100);
  camera.position.set(2.4, 1.6, 5.2);
  camera.lookAt(0, 0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  // ---- Mașinuță din primitive geometrice ----
  const car = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0a66ff,
    metalness: 0.65,
    roughness: 0.2,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xbfe6ff,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.75,
  });
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    metalness: 0.3,
    roughness: 0.6,
  });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 1), bodyMat);
  chassis.position.y = 0.35;
  car.add(chassis);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.45, 0.92), glassMat);
  cabin.position.set(-0.1, 0.75, 0);
  car.add(cabin);

  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 16);
  const wheelPositions = [
    [0.75, 0.1, 0.55],
    [0.75, 0.1, -0.55],
    [-0.75, 0.1, 0.55],
    [-0.75, 0.1, -0.55],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    car.add(wheel);
  });

  car.position.y = -0.2;
  scene.add(car);

  // ---- Bule de apă/spumă ----
  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0xdff6ff,
    transparent: true,
    opacity: 0.55,
    metalness: 0.1,
    roughness: 0.05,
  });
  const bubbles = [];
  const bubbleCount = 9;
  for (let i = 0; i < bubbleCount; i++) {
    const scale = 0.06 + Math.random() * 0.12;
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(scale, 12, 12), bubbleMat);
    bubble.position.set((Math.random() - 0.5) * 2.6, -0.6 + Math.random() * 1.6, (Math.random() - 0.5) * 1.6);
    bubble.userData.speed = 0.15 + Math.random() * 0.25;
    bubble.userData.drift = Math.random() * Math.PI * 2;
    bubble.userData.baseX = bubble.position.x;
    scene.add(bubble);
    bubbles.push(bubble);
  }

  // ---- Lumini ----
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x00c2ff, 1.1);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  scene.add(new THREE.AmbientLight(0xcfe8ff, 0.55));

  function resize() {
    const w = canvas.clientWidth || 300;
    const h = canvas.clientHeight || Math.round(w / 1.4);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let targetX = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
  });

  const clock = new THREE.Clock();
  let raf = null;

  function tick() {
    const t = clock.getElapsedTime();

    car.rotation.y = Math.sin(t * 0.3) * 0.35 + targetX;
    car.position.y = -0.2 + Math.sin(t * 0.9) * 0.04;

    bubbles.forEach((b) => {
      if (!prefersReduced) {
        b.position.y += b.userData.speed * 0.012;
        b.position.x = b.userData.baseX + Math.sin(t * 1.5 + b.userData.drift) * 0.08;
        if (b.position.y > 1.1) {
          b.position.y = -0.7;
        }
      }
    });

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!raf) {
      tick();
    }
  });
}
