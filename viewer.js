// 望遠鏡 3D 模型檢視器（three.js）
// 修改後請重新打包：npx esbuild viewer.js --bundle --minify --format=iife --outfile=viewer.bundle.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const box = document.getElementById('viewer3d');
const status = box.querySelector('.viewer-status');
let started = false;

function start() {
  if (started) return;
  started = true;
  status.textContent = '載入 3D 模型中…';

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  box.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 1, 20000);

  scene.add(new THREE.HemisphereLight(0xe8e4ff, 0x1a1640, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(1200, 1600, 1400);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb18cff, 1.2);
  rim.position.set(-1500, 400, -1200);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.enablePan = false;
  controls.addEventListener('start', () => (controls.autoRotate = false));

  let home = null;
  function onModel(gltf) {
    const model = gltf.scene;
    model.rotation.x = -Math.PI / 2; // CAD 的 Z 軸朝上 → three.js 的 Y 軸朝上
    model.traverse(o => {
      if (o.isMesh) {
        o.material = new THREE.MeshStandardMaterial({
          color: 0xc9cbd6, metalness: 0.55, roughness: 0.38, flatShading: true
        });
      }
    });
    scene.add(model);

    model.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(model);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    model.position.sub(center);
    // 依視角與畫面比例算出能完整放入整支鏡筒的距離
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const fitH = (size.y / 2) / Math.tan(vFov / 2);
    const fitW = (Math.max(size.x, size.z) / 2) / (Math.tan(vFov / 2) * camera.aspect);
    const dist = Math.max(fitH, fitW) * 1.12 + Math.max(size.x, size.z) / 2;
    const dir = new THREE.Vector3(0.6, 0.18, 0.78).normalize();
    camera.position.copy(dir.multiplyScalar(dist));
    controls.target.set(0, 0, 0);
    controls.minDistance = size.y * 0.35;
    controls.maxDistance = size.y * 3;
    home = camera.position.clone();
    controls.update();
    box.classList.add('ready');
  }

  // 用 <script> 載入內嵌的模型（base64），這樣直接雙擊 index.html 也能看到
  const tag = document.createElement('script');
  tag.src = 'model/ota.js';
  tag.onload = () => {
    try {
      const bin = atob(window.OTA_GLB);
      const buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      new GLTFLoader().parse(buf.buffer, '', onModel, fail);
    } catch (e) { fail(e); }
  };
  tag.onerror = fail;
  document.head.appendChild(tag);

  function fail(e) {
    console.error(e);
    status.textContent = '3D 模型載入失敗';
  }

  function resize() {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);
  resize();

  box.querySelector('.viewer-reset').addEventListener('click', () => {
    if (!home) return;
    camera.position.copy(home);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
  });

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
}

// 捲動到附近才載入，避免一開頁就下載 3 MB
new IntersectionObserver((entries, obs) => {
  if (entries.some(e => e.isIntersecting)) { start(); obs.disconnect(); }
}, { rootMargin: '300px' }).observe(box);
