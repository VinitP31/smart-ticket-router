"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Priority } from "@/lib/types";

const PRIO_HEX: Record<Priority, number> = {
  High: 0xa6362a,
  Medium: 0xa6771e,
  Low: 0x3e6b4a,
};

const REST_POS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(-0.8, 0.6, -0.3),
  new THREE.Vector3(0.65, -0.55, -0.2),
];

function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}

export default function RoutingRig({
  priorities,
  routing,
}: {
  priorities: Priority[];
  routing: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shardsRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>[]>([]);
  const reduceMotionRef = useRef(false);

  // one-time scene setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const rigEl = canvas?.parentElement;
    if (!canvas || !rigEl) return;

    reduceMotionRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setClearColor(0x0c0a07, 1);

    function sizeRig() {
      if (!rigEl) return;
      const r = rigEl.getBoundingClientRect();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height || 1;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", sizeRig);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.PointLight(0xffdec2, 3.2, 22);
    keyLight.position.set(4, 3, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xb5402a, 2.2, 20);
    rimLight.position.set(-4, -2, 4);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(0x8fae94, 1.4, 18);
    fillLight.position.set(0, -4, -2);
    scene.add(fillLight);

    // The glass transmission material needs something behind it to refract —
    // without a backdrop, tinted shards render as flat matte blobs.
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 256;
    bgCanvas.height = 256;
    const bctx = bgCanvas.getContext("2d")!;
    const bgrad = bctx.createLinearGradient(0, 0, 256, 256);
    bgrad.addColorStop(0, "#3a2f22");
    bgrad.addColorStop(0.5, "#8a5a3a");
    bgrad.addColorStop(1, "#c98a4a");
    bctx.fillStyle = bgrad;
    bctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 5; i++) {
      bctx.beginPath();
      bctx.arc(Math.random() * 256, Math.random() * 256, 30 + Math.random() * 50, 0, Math.PI * 2);
      bctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.06})`;
      bctx.fill();
    }
    const bgPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(bgCanvas) }),
    );
    bgPlane.position.z = -4;
    scene.add(bgPlane);

    function glassMat(hex: number) {
      return new THREE.MeshPhysicalMaterial({
        color: hex,
        metalness: 0,
        roughness: 0.06,
        transmission: 1,
        thickness: 1.6,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.1,
      });
    }
    const shards = [0, 1, 2].map((i) => {
      const geo: THREE.BufferGeometry =
        i === 0
          ? new THREE.IcosahedronGeometry(1.0, 1)
          : new THREE.OctahedronGeometry(0.6, 2);
      const mesh = new THREE.Mesh(geo, glassMat(0xffffff));
      scene.add(mesh);
      return mesh;
    });
    shardsRef.current = shards;

    let raf = 0;
    let t0: number | null = null;
    function frame(ts: number) {
      if (t0 === null) t0 = ts;
      const t = reduceMotionRef.current ? 0 : (ts - t0) / 1000;
      shards.forEach((m, i) => {
        m.rotation.x = t * (0.18 + i * 0.05);
        m.rotation.y = t * (0.24 + i * 0.04);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    sizeRig();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeRig);
      shards.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      bgPlane.geometry.dispose();
      bgPlane.material.map?.dispose();
      bgPlane.material.dispose();
      renderer.dispose();
    };
  }, []);

  // tween shard layout + tint whenever the routing result changes
  useEffect(() => {
    const shards = shardsRef.current;
    const count = routing ? 1 : Math.max(1, Math.min(priorities.length, shards.length));
    shards.forEach((m, i) => {
      const active = i < count;
      const targetScale = active ? (i === 0 ? 1 : 0.72) : 0.001;
      const targetPos = active ? REST_POS[i] : REST_POS[i].clone().multiplyScalar(2);
      const targetColor = routing || !priorities[i] ? 0xffffff : PRIO_HEX[priorities[i]];

      if (reduceMotionRef.current) {
        m.scale.setScalar(targetScale);
        m.position.copy(targetPos);
        m.material.color.setHex(targetColor);
        return;
      }
      tween(m.scale, { x: targetScale, y: targetScale, z: targetScale }, 700);
      tween(m.position, { x: targetPos.x, y: targetPos.y, z: targetPos.z }, 700);
      m.material.color.setHex(targetColor);
    });
  }, [priorities, routing]);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}

function tween(
  obj: THREE.Vector3,
  target: { x: number; y: number; z: number },
  duration: number,
) {
  const start = obj.clone();
  const startT = performance.now();
  function step(now: number) {
    const p = Math.min(1, (now - startT) / duration);
    const e = easeOutCubic(p);
    obj.set(
      start.x + (target.x - start.x) * e,
      start.y + (target.y - start.y) * e,
      start.z + (target.z - start.z) * e,
    );
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
