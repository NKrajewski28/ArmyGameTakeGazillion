import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Unit, Faction } from '../../src/models/Unit';

// Mock subclass for testing
class TestUnit extends Unit {
  constructor(id: string, faction: Faction, position: THREE.Vector3) {
    super(id, 'Test Unit', faction, position, {
      health: 100,
      damage: 10,
      range: 50,
      speed: 5,
      vpValue: 10,
      ammo: 30,
      reloadTime: 2,
      special: {
        name: 'Test Special',
        cost: 10,
        cooldown: 30
      }
    });
  }
}

describe('Unit', () => {
  it('should initialize with correct properties', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const unit = new TestUnit('test-1', Faction.Allied, position);
    
    expect(unit.getId()).toBe('test-1');
    expect(unit.getName()).toBe('Test Unit');
    expect(unit.getFaction()).toBe(Faction.Allied);
    expect(unit.getHealth()).toBe(100);
    expect(unit.getDamage()).toBe(10);
    expect(unit.getRange()).toBe(50);
    expect(unit.getSpeed()).toBe(5);
    expect(unit.getAmmo()).toBe(30);
  });
  
  it('should take damage correctly', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const unit = new TestUnit('test-1', Faction.Allied, position);
    
    unit.takeDamage(30);
    expect(unit.getHealth()).toBe(70);
    
    unit.takeDamage(100);
    expect(unit.getHealth()).toBe(0);
  });
  
  it('should handle movement correctly', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const unit = new TestUnit('test-1', Faction.Allied, position);
    
    expect(unit.isMoving()).toBe(false);
    
    const target = new THREE.Vector3(10, 0, 10);
    unit.moveTo(target);
    
    expect(unit.isMoving()).toBe(true);
  });
}); 