// Accent 3D în hero — o sticluță de ojă (corp de sticlă + lichid + capac/pensulă),
// care se rotește lent, cu paralaxă la mouse.
// Notă cost: Three.js adaugă ~150-600KB (în funcție de build) doar pentru acest efect —
// pe un site altfel foarte ușor, e un compromis conștient, nu "gratuit" ca restul paginii.
import * as THREE from "./vendor/three.module.min.js";

const canvas = document.getElementById("hero3d");

if (canvas && window.WebGLRenderingContext) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  // ---- Sticluță de ojă din primitive geometrice ----
  const bottle = new THREE.Group();

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
    metalness: 0.1,
    roughness: 0.05,
  });
  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0xc9758c,
    metalness: 0.3,
    roughness: 0.2,
    emissive: 0xa85268,
    emissiveIntensity: 0.15,
  });
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xcf9a5c,
    metalness: 0.7,
    roughness: 0.25,
  });
  const brushMat = new THREE.MeshStandardMaterial({
    color: 0x3d2c2e,
    metalness: 0.4,
    roughness: 0.4,
  });

  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.95, 24), liquidMat);
  liquid.position.y = -0.15;
  bottle.add(liquid);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 1.15, 24), glassMat);
  body.position.y = -0.1;
  bottle.add(body);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 20), glassMat);
  neck.position.y = 0.58;
  bottle.add(neck);

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.6, 20), capMat);
  cap.position.y = 1.0;
  bottle.add(cap);

  const brush = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.5, 10), brushMat);
  brush.position.y = 0.55;
  bottle.add(brush);

  bottle.scale.setScalar(1.05);
  scene.add(bottle);

  const key = new THREE.DirectionalLight(0xfff3e6, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xf4b731, 1.2);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const fill = new THREE.PointLight(0xfff8f0, 0.9);
  fill.position.set(0, 0, 6);
  scene.add(fill);

  scene.add(new THREE.AmbientLight(0xfff0e8, 0.65));

  function resize() {
    const size = canvas.clientWidth || 260;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let targetX = 0;
  let targetY = 0;
  window.addEventListener("pointermove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  });

  const clock = new THREE.Clock();
  let raf = null;

  function tick() {
    const t = clock.getElapsedTime();
    bottle.rotation.y = t * (prefersReduced ? 0.05 : 0.3) + targetX;
    bottle.rotation.z = Math.sin(t * 0.4) * 0.06 + targetY * 0.3;
    bottle.position.y = prefersReduced ? 0 : Math.sin(t * 0.8) * 0.08;
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
