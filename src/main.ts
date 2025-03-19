import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GameEngine } from './systems/GameEngine';
import { UIManager } from './systems/UIManager';

// Initialize the main game class
const gameEngine = new GameEngine();
const uiManager = new UIManager(gameEngine);

// Start the game loop
gameEngine.start(); 