import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger extension natively with the GSAP core
gsap.registerPlugin(ScrollTrigger);

class WebGLEngine {
  constructor() {
    this.canvas = document.querySelector('#webgl-canvas');
    
    // Core Engine Storage Modules
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    
    // Target 3D Structural References
    this.roofMesh = null;
    this.coreStructure = null;
    this.directionalLight = null;
    this.interiorPointLight = null;
    this.mainWallsMaterial = null;

    this.init();
  }

  init() {
    // 1. Scene Workspace Instantiation
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0b0b0b');
    // Implement structural atmospheric fog for cinematic depth scaling
    this.scene.fog = new THREE.FogExp2('#0b0b0b', 0.05);

    // 2. Camera Configuration Optimization
    this.camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      100
    );
    // Position camera far back to overview the entire initial layout
    this.camera.position.set(0, 5, 15);

    // 3. Hardware-Accelerated Renderer Construction
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // High-fidelity cinematic color configuration profiles
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Execute Immediate Setup Subroutines
    this.setupLighting();
    this.buildStructuralPlaceholders();
    this.setupResizeListener();
    this.setupScrollTimeline();
    
    // Launch Render Loop execution
    this.tick();
  }

  setupLighting() {
    // Ambient light provides uniform structural base filling illumination
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2);
    this.scene.add(ambientLight);

    // Primary Directional Light simulating clean structural sun rays
    this.directionalLight = new THREE.DirectionalLight('#ffffff', 2.5);
    this.directionalLight.position.set(10, 12, 8);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 25;
    this.directionalLight.shadow.bias = -0.0005;
    this.scene.add(this.directionalLight);

    // Interior specific point lighting for atmospheric phase changes
    this.interiorPointLight = new THREE.PointLight('#ff9d00', 0, 10);
    this.interiorPointLight.position.set(0, 0.5, 0);
    this.interiorPointLight.castShadow = true;
    this.scene.add(this.interiorPointLight);
  }

  buildStructuralPlaceholders() {
    this.coreStructure = new THREE.Group();

    // Architectural Ground / Foundation Plate Mesh
    const floorGeo = new THREE.BoxGeometry(8, 0.2, 8);
    const floorMat = new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.7 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1;
    floorMesh.receiveShadow = true;
    this.coreStructure.add(floorMesh);

    // Primary Room Core Wall Meshes
    const wallsGeo = new THREE.BoxGeometry(6, 2, 6);
    this.mainWallsMaterial = new THREE.MeshPhysicalMaterial({
      color: '#444444',
      roughness: 0.4,
      metalness: 0.1,
      transmission: 0.0,
      transparent: true,
      opacity: 1.0
    });
    const wallsMesh = new THREE.Mesh(wallsGeo, this.mainWallsMaterial);
    wallsMesh.castShadow = true;
    wallsMesh.receiveShadow = true;
    this.coreStructure.add(wallsMesh);

    // Removable Architectural Roof Assembly Mesh
    const roofGeo = new THREE.BoxGeometry(6.4, 0.4, 6.4);
    const roofMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.5 });
    this.roofMesh = new THREE.Mesh(roofGeo, roofMat);
    this.roofMesh.position.y = 1.2;
    this.roofMesh.castShadow = true;
    this.scene.add(this.roofMesh);

    // Add nested assets straight to central viewing matrix
    this.scene.add(this.coreStructure);
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  setupScrollTimeline() {
    const globalTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    // --- PHASE 1 ---
    globalTimeline.to('#section-1 .content-card', { opacity: 1, y: 0, duration: 1 }, 0)
                  .to(this.roofMesh.position, { y: 5, duration: 3, ease: 'power2.inOut' }, 0)
                  .to(this.camera.position, { x: 4, y: 6, z: 12, duration: 3 }, 0)
                  .to('#section-1 .content-card', { opacity: 0, y: -40, duration: 1 }, 2);

    // --- PHASE 2 ---
    globalTimeline.to('#section-2 .content-card', { opacity: 1, y: 0, duration: 1 }, 3)
                  .to(this.camera.position, { x: 0, y: 0.2, z: 4, duration: 4, ease: 'power1.inOut' }, 3)
                  .to(this.mainWallsMaterial, { opacity: 0.15, transmission: 0.6, duration: 3 }, 3)
                  .to(this.directionalLight, { intensity: 0.3, duration: 3 }, 3)
                  .to(this.interiorPointLight, { intensity: 4, duration: 3 }, 4)
                  .to('#section-2 .content-card', { opacity: 0, y: -40, duration: 1 }, 6);

    // --- PHASE 3 ---
    globalTimeline.to('#section-3 .content-card', { opacity: 1, y: 0, duration: 1 }, 7)
                  .to(this.camera.position, { x: -3, y: 1, z: 2, duration: 4, ease: 'power2.inOut' }, 7)
                  .to(this.coreStructure.rotation, { y: Math.PI * 0.5, duration: 4 }, 7)
                  .to('#section-3 .content-card', { opacity: 0, y: -40, duration: 1 }, 10);

    // --- PHASE 4 ---
    globalTimeline.to('#section-4 .content-card', { opacity: 1, y: 0, duration: 1 }, 11)
                  .to(this.camera.position, { x: 0, y: 12, z: 16, duration: 4, ease: 'zoom.out' }, 11)
                  .to(this.mainWallsMaterial, { opacity: 1.0, transmission: 0.0, duration: 3 }, 11)
                  .to(this.directionalLight, { intensity: 2.5, duration: 3 }, 11)
                  .to(this.interiorPointLight, { intensity: 0, duration: 2 }, 11)
                  .to(this.roofMesh.position, { y: 1.2, duration: 4 }, 11);
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime();

    // Inject automated background idle movements
    if (this.coreStructure && !ScrollTrigger.isScrolling) {
      this.coreStructure.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;
    }

    // Fixed rendering statement execution syntax loop
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.tick());
  }
}

// Instantiate engine initialization execution when DOM builds completely
window.addEventListener('DOMContentLoaded', () => {
  new WebGLEngine();
});
