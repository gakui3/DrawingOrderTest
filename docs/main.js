/*
重要な部分はaddObject関数内の処理になります。
内側の実際に描画される用のcylinder_inner,cylinder_middleオブジェクトと外側のマスク用のcylinder_outerオブジェクトで構成されています。

重要なポイント
描画順が大切です。outer→inner,middleのオブジェクトの順番に描画することで、outerのオブジェクトが透明で描画されていないが、
depthは書き込まれているのでinner,middleのオブジェクトが描画される際に、depthtestが走り、外側は描画されないという仕組みになっています。

120 : cylinder_outer.renderOrder = -1;

上記の処理をすることで明示的にouterオブジェクトをinnerオブジェクトの前に描画するようにしています。


また、inner,middle用のマテリアルは不透明の場合でも
85,92 : transparent: true,
86,93 : opacity: 1,
は記述してください。これがないと、outerのrenderOrderを変更しても描画順がouter→innerの順になりません。
*/

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
  const geometry_innerMask = new THREE.CylinderGeometry(0.59, 0.59, 5, 20, 25, true, 0, 3.14);
  const geometry_inner = new THREE.CylinderGeometry(0.6, 0.6, 5, 20, 25, true, 0, 3.14);
  const geometry_outerMask = new THREE.CylinderGeometry(1.01, 1.01, 5, 20, 25, true, 0, 3.14);
  const geometry_outer = new THREE.CylinderGeometry(1.0, 1.0, 5, 20, 25, true, 0, 3.14);
  const geometry_dammy = new THREE.BoxGeometry(1, 1);

  const material_inner = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });

  const material_innerMask = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });

  const material_outer = new THREE.MeshPhongMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });

  const material_outerMask = new THREE.MeshPhongMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0,
  });

  const mat = new THREE.MeshPhongMaterial({
    color: 0xff0000,
  });

  const cylinder_inner = new THREE.Mesh(geometry_inner, material_inner);
  const cylinder_innerMask = new THREE.Mesh(geometry_innerMask, material_innerMask);
  const cylinder_outer = new THREE.Mesh(geometry_outer, material_outer);
  const cylinder_outerMask = new THREE.Mesh(geometry_outerMask, material_outerMask);
  const box_dammy_left = new THREE.Mesh(geometry_dammy, mat);
  const box_dammy_right = new THREE.Mesh(geometry_dammy, mat);

  cylinder_inner.rotateX(3.14 / 2);
  cylinder_innerMask.rotateX(3.14 / 2);
  cylinder_outer.rotateX(3.14 / 2);
  cylinder_outerMask.rotateX(3.14 / 2);
  cylinder_inner.rotateY(3.14 / 2);
  cylinder_innerMask.rotateY(3.14 / 2);
  cylinder_outer.rotateY(3.14 / 2);
  cylinder_outerMask.rotateY(3.14 / 2);

  box_dammy_left.position.set(3, 0, 0);
  box_dammy_right.position.set(-3, 0, 0);

  //重要！
  cylinder_outerMask.renderOrder = -1;
  cylinder_innerMask.renderOrder = -2;

  scene.add(cylinder_outerMask);
  scene.add(cylinder_innerMask);
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
