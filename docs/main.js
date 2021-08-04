import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let canvas, renderer, scene, camera;

function init() {
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({ canvas });
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
}

function addCamera() {
  camera = new THREE.PerspectiveCamera(45, 800 / 600, 0.1, 100);
  camera.position.set(0, 0, -10);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();
}

function addLight() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1.5, 0);
  scene.add(light);
}

function addObject() {
  const geometry_inner = new THREE.CylinderGeometry(1, 1, 5, 20, 25, true);
  const geometry_outer = new THREE.CylinderGeometry(1.01, 1.01, 5, 20, 25, true);

  const geometry_dammy = new THREE.BoxGeometry(1, 1);

  const material_inner = new THREE.MeshPhongMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  const material_outer = new THREE.MeshPhongMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  const mat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  const cylinder_inner = new THREE.Mesh(geometry_inner, material_inner);
  const cylinder_outer = new THREE.Mesh(geometry_outer, material_outer);
  const box_dammy_left = new THREE.Mesh(geometry_dammy, mat);
  const box_dammy_right = new THREE.Mesh(geometry_dammy, mat);

  cylinder_outer.rotateX(3.14 / 2);
  cylinder_inner.rotateX(3.14 / 2);
  box_dammy_left.position.set(3, 0, 0);
  box_dammy_right.position.set(-3, 0, 0);

  //important!
  cylinder_outer.renderOrder = -1;

  scene.add(cylinder_inner);
  scene.add(cylinder_outer);
  scene.add(box_dammy_left);
  scene.add(box_dammy_right);
}

function update() {
  requestAnimationFrame(update);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

(function () {
  init();
  addCamera();
  addLight();
  addObject();
  update();
})();
