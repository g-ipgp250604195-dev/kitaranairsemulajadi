import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { TitisCharacter } from '../three/characterTitis';
import { EnvironmentBuilder } from '../three/environmentBuilder';
import { SCENES } from '../data/scenesData';
import { Hotspot } from '../types';

interface ThreeCanvasProps {
  currentSceneIndex: number;
  isExploreMode: boolean;
  onHotspotClick: (hotspot: Hotspot) => void;
  onTitisClick: () => void;
}

interface ProjectedHotspot extends Hotspot {
  screenX: number;
  screenY: number;
  visible: boolean;
}

// Camera presets for the 8 scenes: [posX, posY, posZ, lookX, lookY, lookZ]
const CAMERA_PRESETS: [number, number, number, number, number, number][] = [
  [0, 2.4, 5.6, 0, 1.4, 0],       // Babak 1: Friendly greeting
  [1.4, 1.9, 4.4, 0.2, 1.0, 0],   // Babak 2: Heat & drought
  [0, 4.0, 7.8, 0, 1.2, -1],      // Babak 3: Rain & residential flood
  [-0.6, 2.5, 3.8, -0.2, 1.8, 0],  // Babak 4: Metallic tap & dry dam
  [1.2, 2.2, 4.6, 0, 0.8, 0],      // Babak 5: Farmland & crops
  [-0.6, 1.5, 4.0, 0, 0.4, 0],     // Babak 6: Puddle & wildlife
  [0, 2.6, 6.2, 0, 1.8, 0],       // Babak 7: Planetary balance
  [0, 3.0, 6.8, 0, 2.0, 0],       // Babak 8: Grand finale & banner
];

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentSceneIndex,
  isExploreMode,
  onHotspotClick,
  onTitisClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);

  // Refs for three.js components across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const titisRef = useRef<TitisCharacter | null>(null);
  const envBuilderRef = useRef<EnvironmentBuilder | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Target camera coordinates for smooth damping
  const targetCamPos = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].slice(0, 3) as [number, number, number]));
  const targetCamLook = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].slice(3, 6) as [number, number, number]));
  const currentCamLook = useRef(new THREE.Vector3(...CAMERA_PRESETS[0].slice(3, 6) as [number, number, number]));

  // Active scene index stored in ref for loop access
  const activeIndexRef = useRef(currentSceneIndex);
  activeIndexRef.current = currentSceneIndex;

  const isExploreRef = useRef(isExploreMode);
  isExploreRef.current = isExploreMode;

  // Update scene when currentSceneIndex changes
  useEffect(() => {
    const sceneData = SCENES[currentSceneIndex];
    if (!sceneData) return;

    // Update Titis emotion
    if (titisRef.current) {
      titisRef.current.setEmotion(sceneData.titisEmotion);
    }

    // Update 3D environment visibility
    if (envBuilderRef.current) {
      envBuilderRef.current.showScene(currentSceneIndex);
    }

    // Update target camera unless in manual explore mode
    if (!isExploreRef.current && cameraRef.current) {
      const preset = CAMERA_PRESETS[currentSceneIndex] || CAMERA_PRESETS[0];
      targetCamPos.current.set(preset[0], preset[1], preset[2]);
      targetCamLook.current.set(preset[3], preset[4], preset[5]);
    }

    // Update scene fog & lighting tone
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.FogExp2(
        sceneData.environmentStyle.fogColor,
        sceneData.environmentStyle.fogDensity
      );
    }
    if (dirLightRef.current) {
      dirLightRef.current.color.set(sceneData.environmentStyle.lightColor);
      dirLightRef.current.position.set(...sceneData.environmentStyle.sunPosition);
    }
  }, [currentSceneIndex]);

  // Handle Explore Mode toggle (OrbitControls)
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = isExploreMode;
      if (isExploreMode) {
        controlsRef.current.target.copy(currentCamLook.current);
      }
    }
  }, [isExploreMode]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Probe
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 540;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENES[0].environmentStyle.skyColor);
    scene.fog = new THREE.FogExp2(SCENES[0].environmentStyle.fogColor, SCENES[0].environmentStyle.fogDensity);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    const initialCam = CAMERA_PRESETS[0];
    camera.position.set(initialCam[0], initialCam[1], initialCam[2]);
    camera.lookAt(initialCam[3], initialCam[4], initialCam[5]);
    cameraRef.current = camera;

    // 4. Studio Environment Lighting (RoomEnvironment PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio 3-point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.7);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    dirLight.position.set(8, 12, 6);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.shadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 30;
      dirLight.shadow.camera.left = -10;
      dirLight.shadow.camera.right = 10;
      dirLight.shadow.camera.top = 10;
      dirLight.shadow.camera.bottom = -10;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 6. Build Titis Character
    const titis = new TitisCharacter();
    scene.add(titis.group);
    titisRef.current = titis;

    // 7. Build Procedural Scene Environments
    const envBuilder = new EnvironmentBuilder();
    envBuilder.sceneRoots.forEach(root => scene.add(root));
    envBuilder.showScene(0);
    envBuilderRef.current = envBuilder;

    // 8. OrbitControls for Explore Mode
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent going below ground
    controls.minDistance = 2.0;
    controls.maxDistance = 14.0;
    controls.enabled = false;
    controlsRef.current = controls;

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop with Paced Software Guard
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const _tempVec3 = new THREE.Vector3();

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Animate character
      titis.update(delta, elapsed);

      // Animate active environment
      envBuilder.update(delta, elapsed, activeIndexRef.current);

      // Smooth camera interpolation in Cinematic Mode
      if (!isExploreRef.current) {
        camera.position.lerp(targetCamPos.current, 0.04);
        currentCamLook.current.lerp(targetCamLook.current, 0.04);
        camera.lookAt(currentCamLook.current);
      } else {
        controls.update();
      }

      // Project hotspots to 2D screen coordinates
      const currentScene = SCENES[activeIndexRef.current];
      if (currentScene && currentScene.hotspots.length > 0) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const projected = currentScene.hotspots.map(hs => {
          _tempVec3.set(...hs.position3D);
          _tempVec3.project(camera);

          // Check if hotspot is in front of camera frustum
          const visible = _tempVec3.z < 1.0;
          const screenX = _tempVec3.x * halfWidth + halfWidth;
          const screenY = -_tempVec3.y * halfHeight + halfHeight;

          return {
            ...hs,
            screenX,
            screenY,
            visible,
          };
        });
        setProjectedHotspots(projected);
      } else {
        setProjectedHotspots([]);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      titis.dispose();
      envBuilder.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Raycaster for clicking Titis
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    if (titisRef.current) {
      const intersects = raycaster.intersectObject(titisRef.current.group, true);
      if (intersects.length > 0) {
        onTitisClick();
      }
    }
  }, [onTitisClick]);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onClick={handleCanvasClick}
    >
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* 2D Projected Hotspots */}
      {projectedHotspots.map(hs => {
        if (!hs.visible) return null;
        return (
          <button
            key={hs.id}
            style={{
              left: `${hs.screenX}px`,
              top: `${hs.screenY}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onHotspotClick(hs);
            }}
            className="absolute z-10 flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/90 hover:bg-cyan-600 text-white text-xs font-bold rounded-full shadow-lg border border-cyan-400/60 transition-transform hover:scale-110 active:scale-95 group cursor-pointer"
            title={hs.title}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span className="truncate max-w-[130px] font-heading">{hs.title}</span>
          </button>
        );
      })}

      {/* 3D Free-Look Badge in Explore Mode */}
      {isExploreMode && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-sky-950/80 backdrop-blur-none text-sky-200 text-xs font-semibold rounded-lg border border-sky-500/30 flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>Mod Teroka 3D: Seret & Putar Kamera 360°</span>
        </div>
      )}
    </div>
  );
};
