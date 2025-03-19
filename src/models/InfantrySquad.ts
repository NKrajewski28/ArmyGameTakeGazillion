import * as THREE from 'three';
import { Unit, Faction } from './Unit';

export class InfantrySquad extends Unit {
  constructor(id: string, faction: Faction, position: THREE.Vector3) {
    // Infantry Squad stats from Mechanics Tracker
    super(id, 'Infantry Squad', faction, position, {
      health: 60,
      damage: 12,
      range: 50,
      speed: 8,
      vpValue: 5,
      ammo: 40,
      reloadTime: 1.2,
      special: {
        name: 'Dig In',
        cost: 10,
        cooldown: 30
      }
    });
  }
  
  // Override the loadModel method to use Infantry-specific model
  public async loadModel(modelPath: string = ''): Promise<void> {
    // For now, we'll create a simple soldier placeholder
    // In a real implementation, this would load the Infantry Squad model from Simple Military
    const geometry = new THREE.BoxGeometry(1, 2, 1); // Taller than wide to resemble a person
    
    // Use different colors based on faction
    const material = new THREE.MeshStandardMaterial({
      color: this.faction === Faction.Allied ? 0x2196F3 : 0xFF5252
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    this.model = new THREE.Group();
    this.model.add(mesh);
    this.model.position.copy(this.position);
    
    // Add name label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.fillStyle = '#ffffff';
      context.font = 'Bold 20px Arial';
      context.fillText(this.name, 10, 30);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });
      
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(0, 1.5, 0);
      label.scale.set(4, 1, 1);
      
      this.model.add(label);
    }
  }
  
  // Override the useSpecial method to implement the Dig In ability
  public useSpecial(): boolean {
    if (super.useSpecial()) {
      console.log(`${this.name} digs in for +30% defense for 30 seconds!`);
      // In a real implementation, this would adjust the unit's defense stats
      // and possibly change its appearance to show entrenchment
      
      // Reset after 30 seconds
      setTimeout(() => {
        console.log(`${this.name} is no longer entrenched.`);
        // Reset defense stats
      }, 30000);
      
      return true;
    }
    return false;
  }
  
  // Infantry-specific behavior methods could be added here
  public spreadOut(radius: number = 5): void {
    // In a real implementation, this would spread the squad over a 5m radius
    console.log(`${this.name} spreads out over ${radius}m radius`);
  }
  
  public seekCover(): void {
    // In a real implementation, this would find nearby cover (Sandbags, etc.)
    // and move the squad to it
    console.log(`${this.name} seeks cover`);
  }
} 