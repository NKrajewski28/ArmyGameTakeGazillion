import * as THREE from 'three';
import { Unit, Faction } from '../models/Unit';
import { InfantrySquad } from '../models/InfantrySquad';
import { GameEngine } from './GameEngine';
import { BehaviorManager } from './BehaviorManager';

// Enum for unit states based on AI Behavior Overview
export enum UnitState {
  Idle = 'Idle',
  Moving = 'Moving',
  Attacking = 'Attacking',
  Defending = 'Defending',
  UsingSpecial = 'UsingSpecial',
  Retreating = 'Retreating',
  Reloading = 'Reloading',
  SeekingCover = 'SeekingCover',
  AssessingThreat = 'AssessingThreat',
  Rallying = 'Rallying'
}

// Order types that can be given to units
export enum OrderType {
  Move = 'Move',
  Attack = 'Attack',
  Defend = 'Defend',
  Special = 'Special'
}

export class UnitManager {
  private gameEngine: GameEngine;
  private scene: THREE.Scene;
  private units: Map<string, Unit> = new Map();
  private selectedUnits: Set<string> = new Set();
  private behaviorManager: BehaviorManager;
  
  // Raycaster for unit selection
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  
  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
    this.scene = gameEngine.getScene();
    
    // Initialize behavior manager
    this.behaviorManager = new BehaviorManager();
    
    // Initialize raycaster for selection
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Set up event listeners for unit selection
    this.setupSelectionEvents();
  }
  
  private setupSelectionEvents(): void {
    // Add click event listener to the renderer's DOM element
    const renderer = this.gameEngine.getRenderer();
    
    if (renderer && renderer.domElement) {
      renderer.domElement.addEventListener('click', this.handleClick.bind(this));
      renderer.domElement.addEventListener('contextmenu', this.handleRightClick.bind(this));
    }
  }
  
  private handleClick(event: MouseEvent): void {
    // Get mouse position
    const renderer = this.gameEngine.getRenderer();
    const canvas = renderer.domElement;
    
    this.mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.gameEngine.getCamera());
    
    // Get all unit models
    const unitModels: THREE.Object3D[] = [];
    this.units.forEach(unit => {
      const model = unit.getModel();
      if (model) {
        unitModels.push(model);
      }
    });
    
    // Check for intersections
    const intersects = this.raycaster.intersectObjects(unitModels, true);
    
    if (intersects.length > 0) {
      // Find which unit was clicked
      const clickedObject = intersects[0].object;
      let clickedUnit: Unit | null = null;
      
      this.units.forEach(unit => {
        const model = unit.getModel();
        if (model && (model === clickedObject || model.children.includes(clickedObject))) {
          clickedUnit = unit;
        }
      });
      
      if (clickedUnit) {
        // Handle shift key for multi-select
        if (!event.shiftKey) {
          // Deselect all units
          this.clearSelection();
        }
        
        // Select this unit
        this.selectUnit(clickedUnit.getId());
      } else {
        // Clicked on something else, deselect all units
        this.clearSelection();
      }
    } else {
      // Clicked on nothing, deselect all units
      this.clearSelection();
    }
  }
  
  private handleRightClick(event: MouseEvent): void {
    event.preventDefault();
    
    if (this.selectedUnits.size === 0) return;
    
    // Get ground point where clicked
    const renderer = this.gameEngine.getRenderer();
    const canvas = renderer.domElement;
    
    this.mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
    
    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.gameEngine.getCamera());
    
    // Create a ground plane for raycasting
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3();
    
    // Find intersection with ground plane
    this.raycaster.ray.intersectPlane(groundPlane, target);
    
    // Issue move order to all selected units
    this.issueOrder(OrderType.Move, target);
  }
  
  public createInfantrySquad(faction: Faction, position: THREE.Vector3): Unit {
    // Generate a unique ID
    const id = `infantry_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create the unit
    const unit = new InfantrySquad(id, faction, position);
    
    // Load the model
    unit.loadModel().then(() => {
      // Add the model to the scene
      const model = unit.getModel();
      if (model) {
        this.scene.add(model);
      }
    });
    
    // Initialize behavior state
    this.behaviorManager.initializeUnitState(unit);
    
    // Store the unit
    this.units.set(id, unit);
    
    return unit;
  }
  
  public selectUnit(id: string): void {
    const unit = this.units.get(id);
    if (unit) {
      this.selectedUnits.add(id);
      unit.select();
      
      // Update UI manager with selection
      const selectedUnits = Array.from(this.selectedUnits).map(id => this.units.get(id)!);
      // In a real implementation, this would update the UI
      console.log(`Selected units: ${selectedUnits.map(u => u.getName()).join(', ')}`);
    }
  }
  
  public deselectUnit(id: string): void {
    const unit = this.units.get(id);
    if (unit) {
      this.selectedUnits.delete(id);
      unit.deselect();
      
      // Update UI manager with selection
      const selectedUnits = Array.from(this.selectedUnits).map(id => this.units.get(id)!);
      // In a real implementation, this would update the UI
      console.log(`Selected units: ${selectedUnits.map(u => u.getName()).join(', ')}`);
    }
  }
  
  public clearSelection(): void {
    this.selectedUnits.forEach(id => {
      const unit = this.units.get(id);
      if (unit) {
        unit.deselect();
      }
    });
    
    this.selectedUnits.clear();
    
    // Update UI manager with empty selection
    // In a real implementation, this would update the UI
    console.log('No units selected');
  }
  
  public issueOrder(orderType: OrderType, target: THREE.Vector3 | Unit): void {
    this.selectedUnits.forEach(id => {
      const unit = this.units.get(id);
      if (unit) {
        switch (orderType) {
          case OrderType.Move:
            if (target instanceof THREE.Vector3) {
              unit.moveTo(target);
              console.log(`${unit.getName()} moving to (${target.x.toFixed(1)}, ${target.y.toFixed(1)}, ${target.z.toFixed(1)})`);
              // Update unit state for behavior system
              this.behaviorManager.updateUnitState(unit, UnitState.Moving);
            }
            break;
            
          case OrderType.Attack:
            if (target instanceof Unit) {
              // In a real implementation, this would check range, etc.
              unit.attack(target);
              console.log(`${unit.getName()} attacking ${target.getName()}`);
              // Update unit state for behavior system
              this.behaviorManager.updateUnitState(unit, UnitState.Attacking);
            }
            break;
            
          case OrderType.Defend:
            // In a real implementation, this would have defense logic
            console.log(`${unit.getName()} defending`);
            // Update unit state for behavior system
            this.behaviorManager.updateUnitState(unit, UnitState.Defending);
            break;
            
          case OrderType.Special:
            // Use the unit's special ability
            const success = unit.useSpecial();
            console.log(`${unit.getName()} using special ability: ${success ? 'success' : 'failed'}`);
            // Update unit state for behavior system if successful
            if (success) {
              this.behaviorManager.updateUnitState(unit, UnitState.UsingSpecial);
            }
            break;
        }
      }
    });
  }
  
  public update(delta: number): void {
    // Get all units as an array for nearby calculations
    const unitsArray = Array.from(this.units.values());
    
    // Update all units
    this.units.forEach(unit => {
      // Update unit movement, etc.
      unit.update(delta);
      
      // Run AI behavior for this unit
      this.behaviorManager.executeBehaviorTree(unit, delta, unitsArray);
    });
  }
  
  // Methods for unit types (for quick creation during development/testing)
  public spawnTestUnits(): void {
    // Create a few test units
    this.createInfantrySquad(Faction.Allied, new THREE.Vector3(-5, 0, -5));
    this.createInfantrySquad(Faction.Allied, new THREE.Vector3(5, 0, -5));
    this.createInfantrySquad(Faction.Coalition, new THREE.Vector3(0, 0, 5));
  }
} 