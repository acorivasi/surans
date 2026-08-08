// Accent 3D în hero — o "piatră" facetată care se rotește lent, cu paralaxă la mouse.
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

  const geometry = new THREE.IcosahedronGeometry(1.6, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xe8b8c4,
    flatShading: true,
    metalness: 0.4,
    roughness: 0.3,
    emissive: 0xcf9a5c,
    emissiveIntensity: 0.12,
  });
  const gem = new THREE.Mesh(geometry, material);
  scene.add(gem);

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
    gem.rotation.y = t * (prefersReduced ? 0.05 : 0.25) + targetX;
    gem.rotation.x = Math.sin(t * 0.4) * 0.15 + targetY;
    gem.position.y = prefersReduced ? 0 : Math.sin(t * 0.8) * 0.08;
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
