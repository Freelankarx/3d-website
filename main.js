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
    // This serves as your 3D placeholder scene. 
    // In production, replace this block with a GLTFLoader to load your external .glb file.
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
    const wallsMat = new THREE.MeshPhysicalMaterial({
      color: '#444444',
      roughness: 0.4,
      metalness: 0.1,
      transmission: 0.0, // Swapped programmatically inside scroll matrices
      transparent: true,
      opacity: 1.0
    });
    const wallsMesh = new THREE.Mesh(wallsGeo, wallsMat);
    wallsMesh.castShadow = true;
    wallsMesh.receiveShadow = true;
    this.coreStructure.add(wallsMesh);
    this.mainWallsMaterial = wallsMat; // Retain material pointer reference for GSAP access

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
      // Dynamic internal buffer sizing adjustments matching responsive state changes
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  setupScrollTimeline() {
    // Generate Master Timeline with ScrollTrigger integration tracking the container height
    const globalTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // High scrub delay creates that luxurious, heavy, high-end Lusion kinetic drag
      }
    });

    // --- PHASE 1: Reveal HTML Header Cover & Deconstruct Roof ---
    globalTimeline.to('#section-1 .content-card', { opacity: 1, y: 0, duration: 1 }, 0)
                  .to(this.roofMesh.position, { y: 5, duration: 3, ease: 'power2.inOut' }, 0)
                  .to(this.camera.position, { x: 4, y: 6, z: 12, duration: 3 }, 0)
                  .to('#section-1 .content-card', { opacity: 0, y: -40, duration: 1 }, 2);

    // --- PHASE 2: Dive Camera Into Interior Space & Adapt Lights ---
    globalTimeline.to('#section-2 .content-card', { opacity: 1, y: 0, duration: 1 }, 3)
                  .to(this.camera.position, { x: 0, y: 0.2, z: 4, duration: 4, ease: 'power1.inOut' }, 3)
                  .to(this.mainWallsMaterial, { opacity: 0.15, transmission: 0.6, duration: 3 }, 3)
                  .to(this.directionalLight, { intensity: 0.3, duration: 3 }, 3)
                  .to(this.interiorPointLight, { intensity: 4, duration: 3 }, 4)
                  .to('#section-2 .content-card', { opacity: 0, y: -40, duration: 1 }, 6);

    // --- PHASE 3: Rotate View Frame & Inspect Geometry Detail ---
    globalTimeline.to('#section-3 .content-card', { opacity: 1, y: 0, duration: 1 }, 7)
                  .to(this.camera.position, { x: -3, y: 1, z: 2, duration: 4, ease: 'power2.inOut' }, 7)
                  .to(this.coreStructure.rotation, { y: Math.PI * 0.5, duration: 4 }, 7)
                  .to('#section-3 .content-card', { opacity: 0, y: -40, duration: 1 }, 10);

    // --- PHASE 4: Extract View to Wide Flyout Perspective ---
    globalTimeline.to('#section-4 .content-card', { opacity: 1, y: 0, duration: 1 }, 11)
                  .to(this.camera.position, { x: 0, y: 12, z: 16, duration: 4, ease: 'zoom.out' }, 11)
                  .to(this.mainWallsMaterial, { opacity: 1.0, transmission: 0.0, duration: 3 }, 11)
                  .to(this.directionalLight, { intensity: 2.5, duration: 3 }, 11)
                  .to(this.interiorPointLight, { intensity: 0, duration: 2 }, 11)
                  .to(this.roofMesh.position, { y: 1.2, duration: 4 }, 11);
  }

  tick() {
    // The render loop keeps calculating variations running independent of core monitor frames
    const elapsedTime = this.clock.getElapsedTime();

    // Inject automated background idle movements to keep scene looking organic
    if (this.coreStructure && !ScrollTrigger.isScrolling) {
      this.coreStructure.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;
    }

    // Process and repaint actual structural canvas changes via GPU
    this.renderer.render(this.scene, this.camera);

    // Recursively handle following frame processing loops natively
    window.requestAnimationFrame(() => this.tick());
  }
}

// Instantiate core runtime engine immediately upon document completion
window.addEventListener('DOMContentLoaded', () => {
  new WebGLEngine();
});
