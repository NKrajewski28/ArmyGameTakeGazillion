import * as THREE from 'three';
import { Unit, Faction } from '../models/Unit';
import { UnitState } from './UnitManager';

// Implements the behavior tree concept from the AI Behavior Overview
export class BehaviorManager {
  private unitStateMap: Map<string, UnitState> = new Map();
  private threatAssessmentInterval: number = 1000; // 1 second in ms
  
  constructor() {
    // Initialize threat assessment loop
    setInterval(() => this.assessThreats(), this.threatAssessmentInterval);
  }
  
  // Set the initial state for a unit
  public initializeUnitState(unit: Unit): void {
    this.unitStateMap.set(unit.getId(), UnitState.Idle);
  }
  
  // Update the state of a unit
  public updateUnitState(unit: Unit, state: UnitState): void {
    this.unitStateMap.set(unit.getId(), state);
    
    // In a real implementation, this would trigger state-specific animations
    // For example, switching to "AutoSingleShot" animation for Attacking state
    console.log(`${unit.getName()} state changed to ${state}`);
  }
  
  // Get the current state of a unit
  public getUnitState(unit: Unit): UnitState {
    return this.unitStateMap.get(unit.getId()) || UnitState.Idle;
  }
  
  // Main behavior tree execution method
  public executeBehaviorTree(unit: Unit, delta: number, nearbyUnits: Unit[]): void {
    const currentState = this.getUnitState(unit);
    
    // Execute behavior based on current state
    switch (currentState) {
      case UnitState.Idle:
        this.executeIdleBehavior(unit, nearbyUnits);
        break;
        
      case UnitState.Moving:
        this.executeMovingBehavior(unit);
        break;
        
      case UnitState.Attacking:
        this.executeAttackingBehavior(unit, nearbyUnits);
        break;
        
      case UnitState.Defending:
        this.executeDefendingBehavior(unit, nearbyUnits);
        break;
        
      case UnitState.Retreating:
        this.executeRetreatingBehavior(unit);
        break;
        
      case UnitState.Reloading:
        this.executeReloadingBehavior(unit);
        break;
        
      case UnitState.SeekingCover:
        this.executeSeekingCoverBehavior(unit);
        break;
        
      case UnitState.AssessingThreat:
        this.executeAssessingThreatBehavior(unit, nearbyUnits);
        break;
        
      case UnitState.UsingSpecial:
        this.executeUsingSpecialBehavior(unit);
        break;
        
      case UnitState.Rallying:
        this.executeRallyingBehavior(unit, nearbyUnits);
        break;
    }
  }
  
  // Assess threats for all units (called on interval)
  private assessThreats(): void {
    // In a real implementation, this would iterate through all units
    // and assess threats based on the threat assessment criteria in the AI Behavior Overview
    console.log('Assessing threats for all units');
  }
  
  // Individual behavior implementations
  
  private executeIdleBehavior(unit: Unit, nearbyUnits: Unit[]): void {
    // Check for enemies in range
    const enemies = this.findEnemiesInRange(unit, nearbyUnits, unit.getRange());
    
    if (enemies.length > 0) {
      // Found enemies, transition to Assessing Threat
      this.updateUnitState(unit, UnitState.AssessingThreat);
    }
    
    // In a real implementation, this would handle scanning and other idle behaviors
  }
  
  private executeMovingBehavior(unit: Unit): void {
    // Check if unit has reached its destination
    if (!unit.isMoving()) {
      // Reached destination, transition to Idle
      this.updateUnitState(unit, UnitState.Idle);
    }
    
    // In a real implementation, this would handle pathfinding and movement behaviors
  }
  
  private executeAttackingBehavior(unit: Unit, nearbyUnits: Unit[]): void {
    // Check ammo
    if (unit.getAmmo() <= 0) {
      // Out of ammo, transition to Reloading
      this.updateUnitState(unit, UnitState.Reloading);
      return;
    }
    
    // Check health for retreat condition
    if (unit.getHealth() < unit.getMaxHealth() * 0.2) {
      // Health low, transition to Retreating
      this.updateUnitState(unit, UnitState.Retreating);
      return;
    }
    
    // Check if targets are still in range
    const enemies = this.findEnemiesInRange(unit, nearbyUnits, unit.getRange());
    if (enemies.length === 0) {
      // No enemies in range, transition to Idle
      this.updateUnitState(unit, UnitState.Idle);
      return;
    }
    
    // Attack highest threat enemy
    // In a real implementation, this would select the target based on threat assessment
    const target = enemies[0];
    unit.attack(target);
  }
  
  private executeDefendingBehavior(unit: Unit, nearbyUnits: Unit[]): void {
    // Check for enemies in range
    const enemies = this.findEnemiesInRange(unit, nearbyUnits, unit.getRange());
    
    if (enemies.length > 0 && unit.getAmmo() > 0) {
      // Attack while defending position
      unit.attack(enemies[0]);
    }
    
    // In a real implementation, this would handle defensive positioning and behavior
  }
  
  private executeRetreatingBehavior(unit: Unit): void {
    // Check if unit has retreated far enough
    // In a real implementation, this would calculate a retreat position and move there
    
    // For now, just transition back to Idle after "retreating"
    this.updateUnitState(unit, UnitState.Idle);
  }
  
  private executeReloadingBehavior(unit: Unit): void {
    // In a real implementation, this would handle the reload animation and timing
    
    // For now, just reload the unit and transition back to previous state
    unit.reload();
    
    if (unit.getAmmo() === unit.getMaxAmmo()) {
      // Reloaded, transition back to Idle
      this.updateUnitState(unit, UnitState.Idle);
    }
  }
  
  private executeSeekingCoverBehavior(unit: Unit): void {
    // In a real implementation, this would find cover and move there
    
    // For now, just transition back to Idle after "finding cover"
    this.updateUnitState(unit, UnitState.Idle);
  }
  
  private executeAssessingThreatBehavior(unit: Unit, nearbyUnits: Unit[]): void {
    // In a real implementation, this would evaluate threats and choose an appropriate action
    
    // For now, just transition to Attacking if enemies are present
    const enemies = this.findEnemiesInRange(unit, nearbyUnits, unit.getRange());
    
    if (enemies.length > 0) {
      this.updateUnitState(unit, UnitState.Attacking);
    } else {
      this.updateUnitState(unit, UnitState.Idle);
    }
  }
  
  private executeUsingSpecialBehavior(unit: Unit): void {
    // In a real implementation, this would handle the special ability animation and effects
    
    // For now, just transition back to Idle after "using special"
    this.updateUnitState(unit, UnitState.Idle);
  }
  
  private executeRallyingBehavior(unit: Unit, nearbyUnits: Unit[]): void {
    // In a real implementation, this would handle rallying behavior
    
    // For now, just transition back to Idle after "rallying"
    this.updateUnitState(unit, UnitState.Idle);
  }
  
  // Helper methods
  
  private findEnemiesInRange(unit: Unit, nearbyUnits: Unit[], range: number): Unit[] {
    const unitFaction = unit.getFaction();
    const unitPosition = unit.getPosition();
    
    return nearbyUnits.filter(nearbyUnit => {
      // Check faction (different faction = enemy)
      if (nearbyUnit.getFaction() === unitFaction) {
        return false;
      }
      
      // Check range
      const distance = unitPosition.distanceTo(nearbyUnit.getPosition());
      return distance <= range;
    });
  }
  
  private findFriendliesInRange(unit: Unit, nearbyUnits: Unit[], range: number): Unit[] {
    const unitFaction = unit.getFaction();
    const unitPosition = unit.getPosition();
    
    return nearbyUnits.filter(nearbyUnit => {
      // Check faction (same faction = friendly)
      if (nearbyUnit.getFaction() !== unitFaction) {
        return false;
      }
      
      // Don't include self
      if (nearbyUnit.getId() === unit.getId()) {
        return false;
      }
      
      // Check range
      const distance = unitPosition.distanceTo(nearbyUnit.getPosition());
      return distance <= range;
    });
  }
} 