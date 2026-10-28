import * as THREE from 'three';
import { TitisEmotion } from '../types';

export class TitisCharacter {
  public group: THREE.Group;
  private bodyMesh: THREE.Mesh;
  private leftEye: THREE.Group;
  private rightEye: THREE.Group;
  private mouthMesh: THREE.Mesh;
  private leftBlush: THREE.Mesh;
  private rightBlush: THREE.Mesh;
  private leftHand: THREE.Mesh;
  private rightHand: THREE.Mesh;
  private bubblesGroup: THREE.Group;
  private tearDropsGroup: THREE.Group;

  private currentEmotion: TitisEmotion = 'happy';
  private blinkTimer: number = 0;
  private blinkProgress: number = 0;
  private isBlinking: boolean = false;
  private floatTime: number = 0;

  // Mouth geometries for different emotions
  private mouthHappyGeo: THREE.BufferGeometry;
  private mouthSadGeo: THREE.BufferGeometry;
  private mouthWorriedGeo: THREE.BufferGeometry;
  private mouthHopefulGeo: THREE.BufferGeometry;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Character_Titis';

    // 1. Water droplet body (Teardrop shape using LatheGeometry)
    const points: THREE.Vector2[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments; // 0 (bottom) to 1 (top tip)
      const y = (t - 0.3) * 2.2;
      // Teardrop profile equation: fat rounded bottom, tapering smoothly to top point
      let r = Math.sin(t * Math.PI) * (1 - 0.45 * t);
      if (t > 0.85) {
        // slender tip at top
        r = (1 - t) * 1.8;
      }
      points.push(new THREE.Vector2(Math.max(0.01, r * 0.95), y));
    }
    const bodyGeo = new THREE.LatheGeometry(points, 36);

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92,
      ior: 1.333, // water refractive index
      transmission: 0.35,
    });
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // 2. Big Expressive Cartoon Eyes
    const createEye = (isLeft: boolean) => {
      const eyeGroup = new THREE.Group();

      // Sclera (White)
      const scleraGeo = new THREE.SphereGeometry(0.24, 24, 24);
      scleraGeo.scale(1, 1.25, 0.45);
      const scleraMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
      });
      const sclera = new THREE.Mesh(scleraGeo, scleraMat);
      eyeGroup.add(sclera);

      // Iris (Cyan ring)
      const irisGeo = new THREE.SphereGeometry(0.16, 20, 20);
      irisGeo.scale(1, 1.15, 0.3);
      const irisMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.3,
      });
      const iris = new THREE.Mesh(irisGeo, irisMat);
      iris.position.z = 0.08;
      eyeGroup.add(iris);

      // Pupil (Deep Black)
      const pupilGeo = new THREE.SphereGeometry(0.12, 18, 18);
      pupilGeo.scale(1, 1.1, 0.3);
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.z = 0.11;
      eyeGroup.add(pupil);

      // Specular Highlight glint (Top-right white spark)
      const glintGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const glint1 = new THREE.Mesh(glintGeo, glintMat);
      glint1.position.set(0.045, 0.065, 0.15);
      eyeGroup.add(glint1);

      // Secondary smaller highlight
      const glint2 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), glintMat);
      glint2.position.set(-0.035, -0.04, 0.14);
      eyeGroup.add(glint2);

      return eyeGroup;
    };

    this.leftEye = createEye(true);
    this.leftEye.position.set(-0.34, 0.32, 0.72);
    this.leftEye.rotation.y = -0.15;
    this.group.add(this.leftEye);

    this.rightEye = createEye(false);
    this.rightEye.position.set(0.34, 0.32, 0.72);
    this.rightEye.rotation.y = 0.15;
    this.group.add(this.rightEye);

    // 3. Cute Blush Cheeks
    const blushGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.02, 16);
    blushGeo.rotateX(Math.PI / 2);
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.65,
    });
    this.leftBlush = new THREE.Mesh(blushGeo, blushMat);
    this.leftBlush.position.set(-0.52, 0.08, 0.65);
    this.leftBlush.rotation.y = -0.35;
    this.group.add(this.leftBlush);

    this.rightBlush = new THREE.Mesh(blushGeo, blushMat);
    this.rightBlush.position.set(0.52, 0.08, 0.65);
    this.rightBlush.rotation.y = 0.35;
    this.group.add(this.rightBlush);

    // 4. Dynamic Mouth Geometries
    this.mouthHappyGeo = new THREE.TorusGeometry(0.18, 0.035, 12, 24, Math.PI);
    this.mouthSadGeo = new THREE.TorusGeometry(0.18, 0.035, 12, 24, Math.PI);
    this.mouthSadGeo.rotateZ(Math.PI); // flipped upside down for sad frown
    this.mouthWorriedGeo = new THREE.TorusGeometry(0.12, 0.035, 12, 24, Math.PI * 0.7);
    this.mouthWorriedGeo.rotateZ(Math.PI * 0.9);
    this.mouthHopefulGeo = new THREE.TorusGeometry(0.22, 0.04, 12, 24, Math.PI * 1.1);

    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    this.mouthMesh = new THREE.Mesh(this.mouthHappyGeo, mouthMat);
    this.mouthMesh.position.set(0, -0.05, 0.78);
    this.group.add(this.mouthMesh);

    // 5. Cute Floating Droplet Hands
    const handGeo = new THREE.SphereGeometry(0.14, 16, 16);
    handGeo.scale(0.8, 1.2, 0.8);
    const handMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.9,
    });
    this.leftHand = new THREE.Mesh(handGeo, handMat);
    this.leftHand.position.set(-0.95, -0.1, 0.2);
    this.group.add(this.leftHand);

    this.rightHand = new THREE.Mesh(handGeo, handMat);
    this.rightHand.position.set(0.95, -0.1, 0.2);
    this.group.add(this.rightHand);

    // 6. Floating Sparkle Bubbles Halo
    this.bubblesGroup = new THREE.Group();
    const bubbleGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    for (let i = 0; i < 9; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      const angle = (i / 9) * Math.PI * 2;
      const radius = 1.1 + (i % 3) * 0.2;
      bubble.position.set(
        Math.cos(angle) * radius,
        -0.4 + (i * 0.22),
        Math.sin(angle) * radius
      );
      this.bubblesGroup.add(bubble);
    }
    this.group.add(this.bubblesGroup);

    // 7. Tear drops group for sad/worried scenes
    this.tearDropsGroup = new THREE.Group();
    const tearGeo = new THREE.SphereGeometry(0.05, 12, 12);
    tearGeo.scale(0.7, 1.3, 0.7);
    const tearMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
    const leftTear = new THREE.Mesh(tearGeo, tearMat);
    leftTear.position.set(-0.35, 0.05, 0.74);
    const rightTear = new THREE.Mesh(tearGeo, tearMat);
    rightTear.position.set(0.35, 0.05, 0.74);
    this.tearDropsGroup.add(leftTear);
    this.tearDropsGroup.add(rightTear);
    this.tearDropsGroup.visible = false;
    this.group.add(this.tearDropsGroup);

    // Initial scale and pivot setup
    this.group.scale.setScalar(1.0);
    this.setEmotion('happy');
  }

  public setEmotion(emotion: TitisEmotion) {
    this.currentEmotion = emotion;

    switch (emotion) {
      case 'happy':
        this.mouthMesh.geometry = this.mouthHappyGeo;
        this.mouthMesh.position.set(0, -0.05, 0.78);
        this.leftBlush.visible = true;
        this.rightBlush.visible = true;
        this.tearDropsGroup.visible = false;
        (this.bodyMesh.material as THREE.MeshPhysicalMaterial).color.setHex(0x38bdf8);
        break;

      case 'sad':
        this.mouthMesh.geometry = this.mouthSadGeo;
        this.mouthMesh.position.set(0, -0.15, 0.78);
        this.leftBlush.visible = false;
        this.rightBlush.visible = false;
        this.tearDropsGroup.visible = true;
        // slightly paler water color when dried/sad
        (this.bodyMesh.material as THREE.MeshPhysicalMaterial).color.setHex(0x67e8f9);
        break;

      case 'worried':
      case 'serious':
        this.mouthMesh.geometry = this.mouthWorriedGeo;
        this.mouthMesh.position.set(0, -0.1, 0.78);
        this.leftBlush.visible = false;
        this.rightBlush.visible = false;
        this.tearDropsGroup.visible = false;
        (this.bodyMesh.material as THREE.MeshPhysicalMaterial).color.setHex(0x38bdf8);
        break;

      case 'hopeful':
        this.mouthMesh.geometry = this.mouthHopefulGeo;
        this.mouthMesh.position.set(0, -0.02, 0.78);
        this.leftBlush.visible = true;
        this.rightBlush.visible = true;
        this.tearDropsGroup.visible = false;
        (this.bodyMesh.material as THREE.MeshPhysicalMaterial).color.setHex(0x06b6d4);
        break;

      default:
        this.mouthMesh.geometry = this.mouthHappyGeo;
        this.leftBlush.visible = true;
        this.rightBlush.visible = true;
        this.tearDropsGroup.visible = false;
        break;
    }
  }

  public update(delta: number, elapsedTime: number) {
    this.floatTime += delta;

    // 1. Gentle floating / bobbing animation
    const bobOffset = Math.sin(this.floatTime * 2.2) * 0.12;
    const swayOffset = Math.cos(this.floatTime * 1.5) * 0.05;
    this.group.position.y = 1.8 + bobOffset;
    this.group.rotation.z = swayOffset * 0.4;
    this.group.rotation.y = Math.sin(this.floatTime * 0.8) * 0.15;

    // 2. Hand waving / gesturing
    if (this.currentEmotion === 'happy' || this.currentEmotion === 'hopeful') {
      // Waving right hand cheerfully
      this.rightHand.position.y = -0.1 + Math.sin(this.floatTime * 5.0) * 0.18;
      this.rightHand.position.x = 0.95 + Math.cos(this.floatTime * 5.0) * 0.08;
      this.leftHand.position.y = -0.1 + Math.sin(this.floatTime * 2.0) * 0.05;
    } else if (this.currentEmotion === 'sad') {
      // Drooping hands
      this.leftHand.position.y = -0.35;
      this.rightHand.position.y = -0.35;
      this.group.rotation.x = 0.15; // looking slightly downward
    } else {
      // Worried hands near cheeks
      this.leftHand.position.set(-0.7, 0.1 + Math.sin(this.floatTime * 3.0) * 0.04, 0.5);
      this.rightHand.position.set(0.7, 0.1 + Math.sin(this.floatTime * 3.0) * 0.04, 0.5);
    }

    // 3. Eye Blinking Logic
    this.blinkTimer += delta;
    if (!this.isBlinking && this.blinkTimer > 3.2 + Math.random() * 2) {
      this.isBlinking = true;
      this.blinkProgress = 0;
      this.blinkTimer = 0;
    }

    if (this.isBlinking) {
      this.blinkProgress += delta * 12; // quick blink
      const scaleY = Math.max(0.08, Math.sin(this.blinkProgress * Math.PI));
      this.leftEye.scale.y = 1 - (1 - 0.1) * scaleY;
      this.rightEye.scale.y = 1 - (1 - 0.1) * scaleY;
      if (this.blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.leftEye.scale.y = 1;
        this.rightEye.scale.y = 1;
      }
    }

    // 4. Floating bubbles orbit around Titis
    this.bubblesGroup.rotation.y += delta * 0.6;
    this.bubblesGroup.children.forEach((bubble, idx) => {
      bubble.position.y += Math.sin(this.floatTime * 2 + idx) * 0.002;
    });

    // 5. Tear drops animation if crying
    if (this.tearDropsGroup.visible) {
      const tearY = 0.05 - ((this.floatTime * 0.8) % 0.4);
      this.tearDropsGroup.children.forEach(tear => {
        tear.position.y = tearY;
      });
    }
  }

  public dispose() {
    this.bodyMesh.geometry.dispose();
    this.mouthHappyGeo.dispose();
    this.mouthSadGeo.dispose();
    this.mouthWorriedGeo.dispose();
    this.mouthHopefulGeo.dispose();
  }
}
