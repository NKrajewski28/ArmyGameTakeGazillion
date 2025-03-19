import * as THREE from 'three';

// Enum for unit factions
export enum Faction {
  Allied = 'Allied',
  Coalition = 'Coalition'
}

// Base class for all units
export class Unit {
  // Core properties
  protected id: string;
  protected name: string;
  protected faction: Faction;
  protected model: THREE.Group | null = null;
  protected selected: boolean = false;
  
  // Position and movement
  protected position: THREE.Vector3;
  protected targetPosition: THREE.Vector3 | null = null;
  protected speed: number; // m/s
  
  // Stats
  protected health: number;
  protected maxHealth: number;
  protected damage: number;
  protected range: number; // m
  protected vpValue: number;
  
  // Ammo and reload
  protected ammo: number;
  protected maxAmmo: number;
  protected reloadTime: number; // seconds
  protected reloadProgress: number = 0;
  
  // Special ability
  protected specialName: string | null = null;
  protected specialCost: number = 0;
  protected specialCooldown: number = 0; // seconds
  protected specialCooldownRemaining: number = 0;
  
  // Morale
  protected morale: number = 100;
  
  constructor(id: string, name: string, faction: Faction, position: THREE.Vector3, stats: {
    health: number,
    damage: number,
    range: number,
    speed: number,
    vpValue: number,
    ammo: number,
    reloadTime: number,
    special?: {
      name: string,
      cost: number,
      cooldown: number
    }
  }) {
    this.id = id;
    this.name = name;
    this.faction = faction;
    this.position = position.clone();
    
    // Set stats
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.damage = stats.damage;
    this.range = stats.range;
    this.speed = stats.speed;
    this.vpValue = stats.vpValue;
    
    // Set ammo
    this.ammo = stats.ammo;
    this.maxAmmo = stats.ammo;
    this.reloadTime = stats.reloadTime;
    
    // Set special ability if provided
    if (stats.special) {
      this.specialName = stats.special.name;
      this.specialCost = stats.special.cost;
      this.specialCooldown = stats.special.cooldown;
    }
  }
  
  // Load the 3D model
  public async loadModel(modelPath: string): Promise<void> {
    // In a real implementation, this would load the actual model
    // For now, we'll create a simple cube placeholder
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
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
  
  // Movement methods
  public moveTo(target: THREE.Vector3): void {
    this.targetPosition = target.clone();
  }
  
  public stopMoving(): void {
    this.targetPosition = null;
  }
  
  // Combat methods
  public attack(target: Unit): void {
    if (this.canAttack() && this.isInRange(target)) {
      target.takeDamage(this.damage);
      this.ammo--;
    }
  }
  
  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    
    // Morale impact - lose morale when damaged
    this.adjustMorale(-10);
    
    if (this.health === 0) {
      this.onDeath();
    }
  }
  
  public canAttack(): boolean {
    return this.ammo > 0;
  }
  
  public isInRange(target: Unit): boolean {
    const distance = this.position.distanceTo(target.getPosition());
    return distance <= this.range;
  }
  
  public reload(): void {
    if (this.ammo < this.maxAmmo) {
      this.reloadProgress += 1; // This would be delta time in real implementation
      
      if (this.reloadProgress >= this.reloadTime) {
        this.ammo = this.maxAmmo;
        this.reloadProgress = 0;
      }
    }
  }
  
  // Special ability method
  public useSpecial(): boolean {
    if (this.specialName && this.specialCooldownRemaining === 0) {
      // Special ability effect would be implemented here
      this.specialCooldownRemaining = this.specialCooldown;
      return true;
    }
    return false;
  }
  
  // Morale methods
  protected adjustMorale(amount: number): void {
    this.morale = Math.max(0, Math.min(100, this.morale + amount));
    
    // Low morale effects would be implemented here
  }
  
  // Update method - called every frame
  public update(delta: number): void {
    // Update position if moving
    if (this.targetPosition) {
      const direction = new THREE.Vector3()
        .subVectors(this.targetPosition, this.position)
        .normalize();
      
      const moveDistance = this.speed * delta;
      const distanceToTarget = this.position.distanceTo(this.targetPosition);
      
      if (distanceToTarget > moveDistance) {
        // Move towards target
        this.position.add(direction.multiplyScalar(moveDistance));
      } else {
        // Reached target
        this.position.copy(this.targetPosition);
        this.targetPosition = null;
      }
      
      // Update model position
      if (this.model) {
        this.model.position.copy(this.position);
      }
    }
    
    // Update reload cooldown
    if (this.ammo < this.maxAmmo) {
      this.reloadProgress += delta;
      if (this.reloadProgress >= this.reloadTime) {
        this.ammo = this.maxAmmo;
        this.reloadProgress = 0;
      }
    }
    
    // Update special ability cooldown
    if (this.specialCooldownRemaining > 0) {
      this.specialCooldownRemaining = Math.max(0, this.specialCooldownRemaining - delta);
    }
  }
  
  // Selection methods
  public select(): void {
    this.selected = true;
    if (this.model) {
      // Add selection indicator - in a real game, this would be a selection circle or highlight
      const selectionRing = new THREE.Mesh(
        new THREE.RingGeometry(1.2, 1.3, 32),
        new THREE.MeshBasicMaterial({
          color: 0xFFFF00,
          side: THREE.DoubleSide
        })
      );
      selectionRing.rotation.x = -Math.PI / 2; // Lay flat
      selectionRing.position.y = 0.1; // Slightly above ground
      selectionRing.name = 'selectionIndicator';
      this.model.add(selectionRing);
    }
  }
  
  public deselect(): void {
    this.selected = false;
    if (this.model) {
      // Remove selection indicator
      const selectionIndicator = this.model.getObjectByName('selectionIndicator');
      if (selectionIndicator) {
        this.model.remove(selectionIndicator);
      }
    }
  }
  
  // Getters
  public getId(): string {
    return this.id;
  }
  
  public getName(): string {
    return this.name;
  }
  
  public getFaction(): Faction {
    return this.faction;
  }
  
  public getHealth(): number {
    return this.health;
  }
  
  public getMaxHealth(): number {
    return this.maxHealth;
  }
  
  public getDamage(): number {
    return this.damage;
  }
  
  public getRange(): number {
    return this.range;
  }
  
  public getSpeed(): number {
    return this.speed;
  }
  
  public getPosition(): THREE.Vector3 {
    return this.position.clone();
  }
  
  public getVPValue(): number {
    return this.vpValue;
  }
  
  public getAmmo(): number {
    return this.ammo;
  }
  
  public getMaxAmmo(): number {
    return this.maxAmmo;
  }
  
  public getMorale(): number {
    return this.morale;
  }
  
  public getModel(): THREE.Group | null {
    return this.model;
  }
  
  public isSelected(): boolean {
    return this.selected;
  }
  
  // Cleanup
  public dispose(): void {
    // Clean up THREE.js objects to prevent memory leaks
    if (this.model) {
      // In a real implementation, this would properly dispose of geometries and materials
    }
  }
  
  // Event handlers
  protected onDeath(): void {
    // Handle unit death - in a real game, this would trigger death animation, VP award, etc.
    console.log(`${this.name} has been eliminated!`);
    
    // Remove model from scene
    if (this.model && this.model.parent) {
      this.model.parent.remove(this.model);
    }
  }
} 