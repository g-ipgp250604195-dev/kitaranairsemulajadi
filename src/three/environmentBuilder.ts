import * as THREE from 'three';
import { SceneData } from '../types';

// Helper to create procedural cracked mud texture
function createCrackedMudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b45309';
  ctx.fillRect(0, 0, 512, 512);

  // Draw jagged cracked veins
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const drawCrack = (x: number, y: number, length: number, angle: number, depth: number) => {
    if (depth <= 0) return;
    const nx = x + Math.cos(angle) * length;
    const ny = y + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nx, ny);
    ctx.stroke();

    // branching
    drawCrack(nx, ny, length * 0.7, angle + 0.5 + (Math.random() - 0.5) * 0.4, depth - 1);
    if (Math.random() > 0.4) {
      drawCrack(nx, ny, length * 0.6, angle - 0.5 + (Math.random() - 0.5) * 0.4, depth - 1);
    }
  };

  for (let i = 0; i < 28; i++) {
    const startX = Math.random() * 512;
    const startY = Math.random() * 512;
    drawCrack(startX, startY, 40 + Math.random() * 40, Math.random() * Math.PI * 2, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Helper to create rainbow texture
function createRainbowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0.0, 'rgba(239, 68, 68, 0.85)');   // Red
  grad.addColorStop(0.2, 'rgba(249, 115, 22, 0.85)');  // Orange
  grad.addColorStop(0.4, 'rgba(234, 179, 8, 0.85)');   // Yellow
  grad.addColorStop(0.6, 'rgba(34, 197, 94, 0.85)');   // Green
  grad.addColorStop(0.8, 'rgba(6, 182, 212, 0.85)');   // Cyan
  grad.addColorStop(1.0, 'rgba(168, 85, 247, 0.85)');  // Violet

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Helper to create slogan text texture on banner
function createSloganTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background banner styling
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#0369a1');
  grad.addColorStop(0.5, '#0284c7');
  grad.addColorStop(1, '#0369a1');
  ctx.fillStyle = grad;
  ctx.roundRect(16, 16, 992, 224, 32);
  ctx.fill();

  // Golden border
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 10;
  ctx.stroke();

  // Title text: "JAGA AIR, JAGA KEHIDUPAN!"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Fredoka, Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 12;
  ctx.fillText('JAGA AIR, JAGA KEHIDUPAN!', 512, 110);

  // Subtext
  ctx.fillStyle = '#fde047';
  ctx.font = '600 28px Nunito, sans-serif';
  ctx.shadowBlur = 4;
  ctx.fillText('Lindungi Sumber Air • Selamatkan Bumi Kita', 512, 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class EnvironmentBuilder {
  public sceneRoots: THREE.Group[] = [];
  private rainParticles: THREE.Points | null = null;
  private animatedWaterSurfaces: THREE.Mesh[] = [];
  private sunMesh: THREE.Mesh | null = null;
  private jumpingFish: THREE.Group[] = [];
  private rotatingGlobe: THREE.Group | null = null;
  private tapDripDroplet: THREE.Mesh | null = null;

  constructor() {
    // 8 scene groups corresponding to Babak 1 through 8
    for (let i = 0; i < 8; i++) {
      const g = new THREE.Group();
      g.name = `Scene_Babak_${i + 1}`;
      g.visible = i === 0;
      this.sceneRoots.push(g);
    }

    this.buildBabak1();
    this.buildBabak2();
    this.buildBabak3();
    this.buildBabak4();
    this.buildBabak5();
    this.buildBabak6();
    this.buildBabak7();
    this.buildBabak8();
  }

  // --- Babak 1: Pengenalan (Lush, clear river, happy nature) ---
  private buildBabak1() {
    const root = this.sceneRoots[0];

    // Terrain: Rolling green hills
    const terrainGeo = new THREE.PlaneGeometry(36, 36, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // River trough along z-axis: river bed at x ~ 0 is lower
      const riverDist = Math.abs(x);
      let y = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 0.75;
      if (riverDist < 3.2) {
        y -= (3.2 - riverDist) * 0.45;
      }
      pos.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.85,
      metalness: 0.05,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    root.add(terrain);

    // Sparkling River
    const riverGeo = new THREE.PlaneGeometry(5.5, 36, 1, 32);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      transmission: 0.6,
      transparent: true,
      opacity: 0.88,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.position.y = -0.3;
    river.receiveShadow = true;
    root.add(river);
    this.animatedWaterSurfaces.push(river);

    // Procedural 3D Trees (Group with 4-5 parts: trunk, layered foliage, apples)
    for (let i = 0; i < 14; i++) {
      const tree = this.createProceduralTree(true);
      const angle = (i / 14) * Math.PI * 2;
      const dist = 4.5 + (i % 3) * 2.2;
      tree.position.set(Math.cos(angle) * dist, 0.1, Math.sin(angle) * dist);
      root.add(tree);
    }

    // Leaping little fish in the river
    const fishGroup = this.createFish();
    fishGroup.position.set(0, -0.2, 2);
    root.add(fishGroup);
    this.jumpingFish.push(fishGroup);
  }

  // --- Babak 2: Kemarau (Scorching sun, cracked earth, withered trees) ---
  private buildBabak2() {
    const root = this.sceneRoots[1];

    // Cracked ground
    const groundGeo = new THREE.PlaneGeometry(36, 36, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);
    const crackedTex = createCrackedMudTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      map: crackedTex,
      roughness: 0.95,
      metalness: 0.0,
      color: 0xd97706,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    root.add(ground);

    // Shrunk dried riverbed (dry cracked channel)
    const driedBedGeo = new THREE.PlaneGeometry(4.5, 36);
    driedBedGeo.rotateX(-Math.PI / 2);
    const driedBedMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.98,
    });
    const driedBed = new THREE.Mesh(driedBedGeo, driedBedMat);
    driedBed.position.y = -0.05;
    root.add(driedBed);

    // Scorching Blazing Sun in the sky
    const sunGroup = new THREE.Group();
    const sunCoreGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunGroup.add(sunCore);

    // Corona Discs
    const coronaGeo = new THREE.RingGeometry(1.7, 3.2, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    corona.rotation.x = Math.PI / 2;
    sunGroup.add(corona);

    sunGroup.position.set(0, 10, -6);
    root.add(sunGroup);
    this.sunMesh = sunCore;

    // Bare Withered Trees (no green leaves, drooping branches)
    for (let i = 0; i < 8; i++) {
      const deadTree = this.createWitheredTree();
      const x = -8 + (i % 4) * 5 + (Math.random() - 0.5) * 1.5;
      const z = -6 + Math.floor(i / 4) * 8;
      if (Math.abs(x) > 2) {
        deadTree.position.set(x, 0, z);
        root.add(deadTree);
      }
    }
  }

  // --- Babak 3: Banjir (Heavy rain, residential houses, rising water) ---
  private buildBabak3() {
    const root = this.sceneRoots[2];

    // Residential Ground (Road & yards)
    const groundGeo = new THREE.PlaneGeometry(36, 36);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.7,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    root.add(ground);

    // Rising Flood Water Surface
    const floodGeo = new THREE.PlaneGeometry(36, 36, 16, 16);
    floodGeo.rotateX(-Math.PI / 2);
    const floodMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.82,
    });
    const flood = new THREE.Mesh(floodGeo, floodMat);
    flood.position.y = 0.45;
    flood.receiveShadow = true;
    root.add(flood);
    this.animatedWaterSurfaces.push(flood);

    // Cute 3D Houses
    const house1 = this.createHouse(0x38bdf8, 0xef4444);
    house1.position.set(-4, 0, -3);
    root.add(house1);

    const house2 = this.createHouse(0xfacc15, 0x0284c7);
    house2.position.set(4, 0, -3);
    root.add(house2);

    const house3 = this.createHouse(0xa78bfa, 0x10b981);
    house3.position.set(0, 0, -7);
    root.add(house3);

    // Floating Lifebuoy / Safety Ring
    const buoyGeo = new THREE.TorusGeometry(0.5, 0.18, 16, 32);
    buoyGeo.rotateX(Math.PI / 2);
    const buoyMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
    });
    const buoy = new THREE.Mesh(buoyGeo, buoyMat);
    buoy.position.set(-1.5, 0.52, 1.5);
    root.add(buoy);

    // Rain Clouds overhead
    for (let c = 0; c < 5; c++) {
      const cloud = this.createStylizedCloud(true);
      cloud.position.set(-8 + c * 4, 8, -4 + (c % 2) * 3);
      root.add(cloud);
    }

    // Rain Particle System
    const rainCount = 800;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 30;
      rainPositions[i * 3 + 1] = Math.random() * 12;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
    });
    this.rainParticles = new THREE.Points(rainGeo, rainMat);
    root.add(this.rainParticles);
  }

  // --- Babak 4: Kekurangan Bekalan Air Bersih (Pili air menitis, empangan rendah, baldi) ---
  private buildBabak4() {
    const root = this.sceneRoots[3];

    // Dry concrete ground
    const groundGeo = new THREE.PlaneGeometry(36, 36);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x78716c,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    root.add(ground);

    // Hero 3D Metallic Water Tap (Pili Air)
    const tapGroup = new THREE.Group();

    // Vertical Stand Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 24);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2,
    });
    const pipe = new THREE.Mesh(pipeGeo, chromeMat);
    pipe.position.y = 1.6;
    tapGroup.add(pipe);

    // Curved Goose Neck / Spout
    const spoutCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 3.2, 0),
      new THREE.Vector3(0.8, 3.5, 0),
      new THREE.Vector3(1.1, 2.7, 0)
    );
    const spoutGeo = new THREE.TubeGeometry(spoutCurve, 20, 0.18, 16, false);
    const spout = new THREE.Mesh(spoutGeo, chromeMat);
    tapGroup.add(spout);

    // Rotating Cross Valve Handle
    const handleGeo = new THREE.BoxGeometry(0.8, 0.15, 0.15);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red handle for primary school visual clarity
      metalness: 0.3,
      roughness: 0.4,
    });
    const handle1 = new THREE.Mesh(handleGeo, handleMat);
    const handle2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.8), handleMat);
    const valveGroup = new THREE.Group();
    valveGroup.add(handle1);
    valveGroup.add(handle2);
    valveGroup.position.set(0, 3.35, 0);
    tapGroup.add(valveGroup);

    // The Last Water Droplet hanging from nozzle
    const dripGeo = new THREE.SphereGeometry(0.09, 16, 16);
    dripGeo.scale(0.8, 1.4, 0.8);
    const dripMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    this.tapDripDroplet = new THREE.Mesh(dripGeo, dripMat);
    this.tapDripDroplet.position.set(1.1, 2.5, 0);
    tapGroup.add(this.tapDripDroplet);

    tapGroup.position.set(-1.2, 0, 0);
    root.add(tapGroup);

    // Hydroelectric Dam Wall in background
    const damGroup = new THREE.Group();
    const damWallGeo = new THREE.BoxGeometry(16, 4.5, 2);
    const damMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.85,
    });
    const damWall = new THREE.Mesh(damWallGeo, damMat);
    damWall.position.set(0, 2.25, -7);
    damGroup.add(damWall);

    // Dam low-water line marker (Red critical mark)
    const lineGeo = new THREE.BoxGeometry(16.1, 0.15, 0.2);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const redLine = new THREE.Mesh(lineGeo, lineMat);
    redLine.position.set(0, 1.2, -5.9);
    damGroup.add(redLine);

    root.add(damGroup);

    // Empty Water Buckets & Jerrycans on ground
    const bucketColors = [0x3b82f6, 0xeab308, 0xef4444];
    for (let b = 0; b < 3; b++) {
      const bucket = this.createWaterBucket(bucketColors[b]);
      bucket.position.set(0.6 + b * 0.9, 0, 0.5 + (b % 2) * 0.4);
      root.add(bucket);
    }
  }

  // --- Babak 5: Tumbuhan Layu dan Hasil Pertanian Menurun (Farmland, withered crops, farmer hat) ---
  private buildBabak5() {
    const root = this.sceneRoots[4];

    // Agricultural furrow ridges
    const fieldGeo = new THREE.PlaneGeometry(36, 36, 36, 36);
    fieldGeo.rotateX(-Math.PI / 2);
    const pos = fieldGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // create repetitive plowed furrows
      const furrow = Math.sin(x * 2.0) * 0.18;
      pos.setY(i, furrow);
    }
    fieldGeo.computeVertexNormals();

    const fieldMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // dry parched agricultural soil
      roughness: 0.95,
    });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.receiveShadow = true;
    root.add(field);

    // Rows of Withered, bent crop stalks
    for (let r = -3; r <= 3; r++) {
      for (let c = -4; c <= 4; c++) {
        const crop = this.createWitheredCrop();
        crop.position.set(r * 1.5, 0.1, c * 1.5);
        crop.rotation.y = Math.random() * Math.PI;
        root.add(crop);
      }
    }

    // Stylized Asian Conical Farmer Straw Hat (Topi Petani)
    const hatGroup = new THREE.Group();
    const hatGeo = new THREE.ConeGeometry(0.7, 0.35, 24);
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.9,
    });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 1.35;
    hatGroup.add(hat);

    // Wooden post holding hat
    const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x92400e });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 0.7;
    hatGroup.add(post);

    hatGroup.position.set(-2.5, 0, 1.5);
    root.add(hatGroup);

    // Empty wicker harvest basket
    const basketGeo = new THREE.CylinderGeometry(0.5, 0.38, 0.45, 16);
    const basketMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.85,
    });
    const basket = new THREE.Mesh(basketGeo, basketMat);
    basket.position.set(2.2, 0.22, 1.8);
    basket.rotation.z = 0.3; // slightly tipped over
    root.add(basket);
  }

  // --- Babak 6: Haiwan Kehilangan Habitat (Dried riverbed, puddle, struggling fish, deer) ---
  private buildBabak6() {
    const root = this.sceneRoots[5];

    // Rocky riverbed
    const groundGeo = new THREE.PlaneGeometry(36, 36);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x713f12,
      roughness: 0.95,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    root.add(ground);

    // Isolated shallow puddle
    const puddleGeo = new THREE.CircleGeometry(2.4, 32);
    puddleGeo.rotateX(-Math.PI / 2);
    const puddleMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.75,
    });
    const puddle = new THREE.Mesh(puddleGeo, puddleMat);
    puddle.position.set(0, 0.04, 0);
    root.add(puddle);

    // River stones surrounding puddle
    for (let s = 0; s < 18; s++) {
      const stoneGeo = new THREE.DodecahedronGeometry(0.18 + (s % 3) * 0.12, 1);
      stoneGeo.scale(1.2, 0.6, 1);
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x78716c,
        roughness: 0.9,
      });
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      const angle = (s / 18) * Math.PI * 2;
      const radius = 2.4 + (Math.random() - 0.5) * 0.6;
      stone.position.set(Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius);
      stone.rotation.y = Math.random() * Math.PI;
      root.add(stone);
    }

    // Struggling fish inside shallow puddle
    const puddleFish = this.createFish();
    puddleFish.position.set(0.3, 0.05, 0.2);
    puddleFish.scale.setScalar(0.7);
    root.add(puddleFish);
    this.jumpingFish.push(puddleFish);

    // Cute Forest Deer standing near dry bank
    const deer = this.createDeer();
    deer.position.set(-3.2, 0, -1);
    root.add(deer);

    // Cute Little Rabbit
    const rabbit = this.createRabbit();
    rabbit.position.set(2.8, 0, 1.2);
    root.add(rabbit);
  }

  // --- Babak 7: Perubahan Cuaca dan Suhu (Earth globe, climate balance, thermometer) ---
  private buildBabak7() {
    const root = this.sceneRoots[6];

    // Dark starry space ground backdrop
    const groundGeo = new THREE.PlaneGeometry(36, 36);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -3;
    root.add(ground);

    // Stylized Earth Globe
    const globeGroup = new THREE.Group();
    const globeGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Ocean blue
      roughness: 0.4,
      metalness: 0.1,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globe);

    // Continents / Green patches
    for (let c = 0; c < 7; c++) {
      const patchGeo = new THREE.DodecahedronGeometry(0.7 + (c % 3) * 0.3, 2);
      const patchMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        roughness: 0.6,
      });
      const patch = new THREE.Mesh(patchGeo, patchMat);
      const angle = (c / 7) * Math.PI * 2;
      patch.position.set(
        Math.cos(angle) * 1.8,
        Math.sin(angle * 2) * 1.1,
        Math.sin(angle) * 1.8
      );
      globeGroup.add(patch);
    }

    // Atmospheric Glow Ring
    const atmoGeo = new THREE.TorusGeometry(2.45, 0.06, 16, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    atmo.rotation.x = Math.PI / 3;
    globeGroup.add(atmo);

    globeGroup.position.set(0, 1.8, -1);
    root.add(globeGroup);
    this.rotatingGlobe = globeGroup;

    // Climate Balance Symbols:
    // Left: Sun Disc
    const sunSymbol = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    sunSymbol.position.set(-4.2, 2.8, 0);
    root.add(sunSymbol);

    // Right: Raincloud Symbol
    const cloudSymbol = this.createStylizedCloud(false);
    cloudSymbol.scale.setScalar(0.7);
    cloudSymbol.position.set(4.2, 2.8, 0);
    root.add(cloudSymbol);

    // 3D Thermometer
    const thermo = this.createThermometer();
    thermo.position.set(0, 0.2, 2.2);
    root.add(thermo);
  }

  // --- Babak 8: Penutup dan Kesedaran (Paradise restored, tree planting, rainbow, banner) ---
  private buildBabak8() {
    const root = this.sceneRoots[7];

    // Lush Emerald Ground
    const groundGeo = new THREE.PlaneGeometry(36, 36, 32, 32);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x16a34a,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    root.add(ground);

    // Sparkling Clean River
    const riverGeo = new THREE.PlaneGeometry(5, 36, 1, 32);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.08,
      metalness: 0.05,
      clearcoat: 1.0,
      transmission: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.position.y = 0.02;
    river.receiveShadow = true;
    root.add(river);
    this.animatedWaterSurfaces.push(river);

    // Newly planted young saplings with wooden support stakes
    for (let p = 0; p < 6; p++) {
      const sapling = this.createSapling();
      const side = p % 2 === 0 ? -3.5 : 3.5;
      sapling.position.set(side, 0, -4 + p * 1.8);
      root.add(sapling);
    }

    // Lush mature trees on flanks
    for (let t = 0; t < 10; t++) {
      const tree = this.createProceduralTree(false);
      const angle = (t / 10) * Math.PI * 2;
      const dist = 6.5 + (t % 2) * 2;
      tree.position.set(Math.cos(angle) * dist, 0.1, Math.sin(angle) * dist);
      root.add(tree);
    }

    // Grand Arched Rainbow
    const rainbowGeo = new THREE.RingGeometry(9, 10.8, 48, 1, 0, Math.PI);
    const rainbowTex = createRainbowTexture();
    const rainbowMat = new THREE.MeshBasicMaterial({
      map: rainbowTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const rainbow = new THREE.Mesh(rainbowGeo, rainbowMat);
    rainbow.position.set(0, 0, -8);
    root.add(rainbow);

    // 3D Slogan Banner: "JAGA AIR, JAGA KEHIDUPAN!"
    const sloganTex = createSloganTexture();
    const bannerGeo = new THREE.PlaneGeometry(7.2, 1.8);
    const bannerMat = new THREE.MeshBasicMaterial({
      map: sloganTex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 4.4, -2.5);
    root.add(banner);
  }

  // --- Helper Methods for Procedural Props ---
  private createProceduralTree(hasApples: boolean): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.35, 2.2, 12);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.9,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.1;
    trunk.castShadow = true;
    tree.add(trunk);

    // Foliage crown (multi-layered spheres)
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.7,
    });
    const crown1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 2), crownMat);
    crown1.position.y = 2.8;
    crown1.castShadow = true;
    tree.add(crown1);

    const crown2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 2), crownMat);
    crown2.position.set(0.4, 2.4, 0.3);
    crown2.castShadow = true;
    tree.add(crown2);

    const crown3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 2), crownMat);
    crown3.position.set(-0.4, 2.3, -0.3);
    crown3.castShadow = true;
    tree.add(crown3);

    // Cute red apples
    if (hasApples) {
      const appleMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      for (let a = 0; a < 4; a++) {
        const apple = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), appleMat);
        const ang = (a / 4) * Math.PI * 2;
        apple.position.set(Math.cos(ang) * 0.9, 2.5 + (a % 2) * 0.3, Math.sin(ang) * 0.9);
        tree.add(apple);
      }
    }

    return tree;
  }

  private createWitheredTree(): THREE.Group {
    const tree = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.3, 2.4, 10);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x573215,
      roughness: 0.95,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.2;
    tree.add(trunk);

    // Bare branches
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8), branchMat);
    b1.position.set(0.4, 2.2, 0);
    b1.rotation.z = -0.6;
    tree.add(b1);

    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 1.0, 8), branchMat);
    b2.position.set(-0.35, 2.0, 0.2);
    b2.rotation.z = 0.7;
    tree.add(b2);

    return tree;
  }

  private createHouse(wallColor: number, roofColor: number): THREE.Group {
    const house = new THREE.Group();

    // Main wall body
    const wallGeo = new THREE.BoxGeometry(2.4, 1.8, 2.2);
    const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.6 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 0.9;
    wall.castShadow = true;
    house.add(wall);

    // Gabled Roof
    const roofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.4;
    roof.castShadow = true;
    house.add(roof);

    // Door
    const doorGeo = new THREE.PlaneGeometry(0.6, 1.1);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.55, 1.11);
    house.add(door);

    // Windows
    const winGeo = new THREE.PlaneGeometry(0.5, 0.5);
    const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const winL = new THREE.Mesh(winGeo, winMat);
    winL.position.set(-0.7, 1.1, 1.11);
    house.add(winL);

    const winR = new THREE.Mesh(winGeo, winMat);
    winR.position.set(0.7, 1.1, 1.11);
    house.add(winR);

    return house;
  }

  private createStylizedCloud(isDark: boolean): THREE.Group {
    const cloud = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x475569 : 0xffffff,
      roughness: 0.6,
      transparent: true,
      opacity: 0.88,
    });

    const puffs = [
      { r: 0.9, x: 0, y: 0, z: 0 },
      { r: 0.7, x: -0.7, y: -0.15, z: 0 },
      { r: 0.75, x: 0.7, y: -0.1, z: 0 },
      { r: 0.6, x: 0.3, y: 0.45, z: 0 },
    ];
    puffs.forEach(p => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 16, 16), cloudMat);
      mesh.position.set(p.x, p.y, p.z);
      cloud.add(mesh);
    });

    return cloud;
  }

  private createWaterBucket(color: number): THREE.Group {
    const bucket = new THREE.Group();
    const pailGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.65, 16);
    const pailMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
    const pail = new THREE.Mesh(pailGeo, pailMat);
    pail.position.y = 0.32;
    pail.castShadow = true;
    bucket.add(pail);

    // Metal handle
    const handleGeo = new THREE.TorusGeometry(0.34, 0.025, 8, 16, Math.PI);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = 0.65;
    bucket.add(handle);

    return bucket;
  }

  private createWitheredCrop(): THREE.Group {
    const crop = new THREE.Group();
    // Bent stalk
    const stalkCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.1, 0.4, 0),
      new THREE.Vector3(0.35, 0.55, 0) // drooping downwards
    );
    const stalkGeo = new THREE.TubeGeometry(stalkCurve, 10, 0.035, 8, false);
    const stalkMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.9 });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    crop.add(stalk);

    // Drooping dry yellow leaf
    const leafGeo = new THREE.ConeGeometry(0.12, 0.45, 4);
    leafGeo.rotateZ(1.2);
    const leaf = new THREE.Mesh(leafGeo, stalkMat);
    leaf.position.set(0.3, 0.5, 0);
    crop.add(leaf);

    return crop;
  }

  private createFish(): THREE.Group {
    const fish = new THREE.Group();
    const fishBodyGeo = new THREE.SphereGeometry(0.2, 14, 14);
    fishBodyGeo.scale(1.8, 1, 0.6);
    const fishMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
    const body = new THREE.Mesh(fishBodyGeo, fishMat);
    fish.add(body);

    // Tail fin
    const tailGeo = new THREE.ConeGeometry(0.15, 0.25, 4);
    tailGeo.rotateZ(Math.PI / 2);
    const tail = new THREE.Mesh(tailGeo, fishMat);
    tail.position.x = -0.38;
    fish.add(tail);

    return fish;
  }

  private createDeer(): THREE.Group {
    const deer = new THREE.Group();
    const deerMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.45), deerMat);
    body.position.y = 0.85;
    deer.add(body);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), deerMat);
    neck.position.set(0.45, 1.15, 0);
    neck.rotation.z = -0.3;
    deer.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.25), deerMat);
    head.position.set(0.65, 1.4, 0);
    deer.add(head);

    // 4 Legs
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.7, 8), deerMat);
      const x = i < 2 ? -0.3 : 0.3;
      const z = i % 2 === 0 ? -0.16 : 0.16;
      leg.position.set(x, 0.35, z);
      deer.add(leg);
    }

    return deer;
  }

  private createRabbit(): THREE.Group {
    const rabbit = new THREE.Group();
    const rabbitMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), rabbitMat);
    body.position.y = 0.25;
    rabbit.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), rabbitMat);
    head.position.set(0.18, 0.38, 0);
    rabbit.add(head);

    // Long ears
    const earGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.24, 8);
    const ear1 = new THREE.Mesh(earGeo, rabbitMat);
    ear1.position.set(0.15, 0.55, 0.06);
    rabbit.add(ear1);

    const ear2 = new THREE.Mesh(earGeo, rabbitMat);
    ear2.position.set(0.15, 0.55, -0.06);
    rabbit.add(ear2);

    return rabbit;
  }

  private createThermometer(): THREE.Group {
    const thermo = new THREE.Group();
    // Glass tube
    const tubeGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 16);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.8,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
    });
    const tube = new THREE.Mesh(tubeGeo, glassMat);
    tube.position.y = 1.1;
    thermo.add(tube);

    // Red liquid column inside
    const mercuryGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12);
    const mercuryMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const mercury = new THREE.Mesh(mercuryGeo, mercuryMat);
    mercury.position.y = 0.7;
    thermo.add(mercury);

    // Bottom bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), mercuryMat);
    bulb.position.y = 0.2;
    thermo.add(bulb);

    return thermo;
  }

  private createSapling(): THREE.Group {
    const sapling = new THREE.Group();
    // Thin trunk
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.05, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x854d0e })
    );
    stem.position.y = 0.6;
    sapling.add(stem);

    // Fresh green leaf bundle
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.6 })
    );
    leaf.position.y = 1.25;
    sapling.add(leaf);

    // Wooden support stake
    const stake = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.0, 6),
      new THREE.MeshStandardMaterial({ color: 0xa16207 })
    );
    stake.position.set(0.12, 0.5, 0);
    stake.rotation.z = -0.15;
    sapling.add(stake);

    return sapling;
  }

  // --- Scene Switching & Dynamic Update ---
  public showScene(sceneIndex: number) {
    this.sceneRoots.forEach((group, idx) => {
      group.visible = idx === sceneIndex;
    });
  }

  public update(delta: number, elapsedTime: number, activeSceneIndex: number) {
    // 1. Water waves animation
    this.animatedWaterSurfaces.forEach(mesh => {
      mesh.position.y += Math.sin(elapsedTime * 3) * 0.0008;
    });

    // 2. Jumping fish animation
    this.jumpingFish.forEach((fish, idx) => {
      const cycle = (elapsedTime * 2 + idx * 2.5) % (Math.PI * 2);
      if (cycle < Math.PI) {
        fish.position.y = 0.1 + Math.sin(cycle) * 0.6;
        fish.rotation.z = (cycle - Math.PI / 2) * -0.8;
      } else {
        fish.position.y = -0.2;
      }
    });

    // 3. Rain particle system falling (Babak 3)
    if (this.rainParticles && activeSceneIndex === 2) {
      const pos = this.rainParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - delta * 18;
        if (y < 0.4) y = 12;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 4. Tap drip droplet in Babak 4
    if (this.tapDripDroplet && activeSceneIndex === 3) {
      // Drips 3 times then stops completely
      const dripCycle = (elapsedTime * 1.5) % 3.0;
      if (dripCycle < 2.0) {
        this.tapDripDroplet.visible = true;
        this.tapDripDroplet.position.y = 2.5 - (dripCycle % 0.8) * 2.0;
      } else {
        this.tapDripDroplet.visible = false; // tap stopped dripping!
      }
    }

    // 5. Rotating globe in Babak 7
    if (this.rotatingGlobe && activeSceneIndex === 6) {
      this.rotatingGlobe.rotation.y += delta * 0.4;
    }
  }

  public dispose() {
    this.sceneRoots.forEach(root => {
      root.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
  }
}
