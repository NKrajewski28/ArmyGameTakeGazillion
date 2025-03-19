import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { UnitManager } from './UnitManager';

export class GameEngine {
  // Scene objects
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private stats: Stats;
  
  // Game systems
  private unitManager: UnitManager;
  
  // Game state
  private tacticalPoints: number = 50;
  private victoryPoints: number = 0;
  private maxTacticalPoints: number = 500;
  
  // Game clock
  private clock: THREE.Clock;
  private gameTime: number = 0;
  private maxGameTime: number = 30 * 60; // 30 minutes in seconds
  
  constructor() {
    // Initialize Three.js components
    this.initThreeJS();
    
    // Setup game world
    this.setupWorld();
    
    // Initialize game systems
    this.unitManager = new UnitManager(this);
    
    // Initialize the clock
    this.clock = new THREE.Clock();
    
    // Create some test units
    this.unitManager.spawnTestUnits();
  }
  
  private initThreeJS(): void {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      70, // FOV
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near plane
      5000 // Far plane
    );
    this.camera.position.set(0, 100, 100);
    this.camera.lookAt(0, 0, 0);
    
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add renderer to DOM
    const container = document.getElementById('game-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    } else {
      document.body.appendChild(this.renderer.domElement);
    }
    
    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 200;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
    
    // Add stats for development
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    
    // Add event listener for window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  private setupWorld(): void {
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    directionalLight.castShadow = true;
    
    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    
    const d = 200;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    
    this.scene.add(directionalLight);
    
    // Create a ground plane (temporary flat terrain)
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // Brown color for dirt
      roughness: 0.8,
      metalness: 0.2,
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Add simple grid for reference
    const grid = new THREE.GridHelper(1000, 100, 0x000000, 0x444444);
    grid.position.y = 0.1; // Slightly above ground to prevent z-fighting
    this.scene.add(grid);
  }
  
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  private update(): void {
    const delta = this.clock.getDelta();
    this.gameTime += delta;
    
    // Update controls
    this.controls.update();
    
    // Update stats
    this.stats.update();
    
    // Update game systems
    this.unitManager.update(delta);
    
    // Update UI elements
    this.updateUI();
  }
  
  private updateUI(): void {
    // Update game clock display
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = Math.floor(this.gameTime % 60);
    const totalMinutes = Math.floor(this.maxGameTime / 60);
    
    const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}/${totalMinutes}:00`;
    const clockElement = document.getElementById('game-clock');
    if (clockElement) {
      clockElement.textContent = timeDisplay;
    }
    
    // Update tactical points display
    const tpElement = document.getElementById('tactical-points');
    if (tpElement) {
      tpElement.textContent = this.tacticalPoints.toString();
    }
    
    // Update victory points display
    const vpElement = document.getElementById('victory-points');
    if (vpElement) {
      vpElement.textContent = this.victoryPoints.toString();
    }
  }
  
  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
  
  /**
   * The main game loop
   */
  public start(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      this.update();
      this.render();
    };
    
    animate();
  }
  
  // Public getters for game state
  public getScene(): THREE.Scene {
    return this.scene;
  }
  
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  
  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }
  
  public getTacticalPoints(): number {
    return this.tacticalPoints;
  }
  
  public getVictoryPoints(): number {
    return this.victoryPoints;
  }
  
  // Public methods to modify game state
  public addTacticalPoints(amount: number): void {
    this.tacticalPoints = Math.min(this.tacticalPoints + amount, this.maxTacticalPoints);
  }
  
  public spendTacticalPoints(amount: number): boolean {
    if (this.tacticalPoints >= amount) {
      this.tacticalPoints -= amount;
      return true;
    }
    return false;
  }
  
  public addVictoryPoints(amount: number): void {
    this.victoryPoints += amount;
  }
} 