import { GameEngine } from './GameEngine';

export class UIManager {
  private gameEngine: GameEngine;
  
  // UI Elements
  private miniMap: HTMLElement | null;
  private unitQueue: HTMLElement | null;
  private supportButtons: HTMLElement | null;
  private unitControl: HTMLElement | null;
  
  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
    
    // Initialize UI references
    this.miniMap = document.getElementById('mini-map');
    this.unitQueue = document.getElementById('unit-queue');
    this.supportButtons = document.getElementById('support-buttons');
    this.unitControl = document.getElementById('unit-control');
    
    // Initialize UI components
    this.initMiniMap();
    this.initUnitQueue();
    this.initSupportButtons();
    this.initUnitControl();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  private initMiniMap(): void {
    if (!this.miniMap) return;
    
    // Create a simple mini-map with a placeholder
    this.miniMap.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <span>Mini-Map (Placeholder)</span>
      </div>
    `;
  }
  
  private initUnitQueue(): void {
    if (!this.unitQueue) return;
    
    // Empty unit queue initially
    this.unitQueue.innerHTML = '<span>No units in queue</span>';
  }
  
  private initSupportButtons(): void {
    if (!this.supportButtons) return;
    
    // Create support buttons based on available support systems
    // This is a placeholder that will be replaced with actual support system data
    const supportSystems = [
      { id: 'smoke', name: 'Smoke Screen', cost: 20 },
      { id: 'emp', name: 'EMP Pulse', cost: 60 },
      { id: 'airstrike', name: 'A-10 Strike', cost: 50 }
    ];
    
    // Create buttons for each support system
    const buttonsHTML = supportSystems.map(support => {
      return `
        <div class="support-button" data-id="${support.id}" data-cost="${support.cost}">
          <div class="support-icon">${support.name.charAt(0)}</div>
          <div class="support-cost">${support.cost} TP</div>
        </div>
      `;
    }).join('');
    
    this.supportButtons.innerHTML = buttonsHTML;
    
    // Add click event listeners to support buttons
    const buttons = this.supportButtons.querySelectorAll('.support-button');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const supportId = target.getAttribute('data-id');
        const supportCost = parseInt(target.getAttribute('data-cost') || '0');
        
        // Check if player has enough tactical points
        if (this.gameEngine.getTacticalPoints() >= supportCost) {
          console.log(`Activating support: ${supportId}`);
          // Would call the appropriate method in the GameEngine to activate the support
          // This is a placeholder for now
          this.gameEngine.spendTacticalPoints(supportCost);
        } else {
          console.log('Not enough tactical points!');
          // Visual feedback for not enough points could be added here
        }
      });
    });
  }
  
  private initUnitControl(): void {
    if (!this.unitControl) return;
    
    // Create a placeholder for unit control panel
    this.unitControl.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <div>No units selected</div>
        <div>Select a unit to view controls</div>
      </div>
    `;
  }
  
  private setupEventListeners(): void {
    // Add keyboard controls
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'm':
        case 'M':
          // Toggle mini-map
          if (this.miniMap) {
            this.miniMap.style.display = 
              this.miniMap.style.display === 'none' ? 'block' : 'none';
          }
          break;
          
        case 'Space':
        case ' ':
          // Pause game (single player only)
          console.log('Game paused/resumed');
          break;
          
        default:
          break;
      }
    });
  }
  
  // Method to update unit selection UI
  public updateUnitSelection(units: any[]): void {
    if (!this.unitControl) return;
    
    if (units.length === 0) {
      // No units selected
      this.unitControl.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <div>No units selected</div>
          <div>Select a unit to view controls</div>
        </div>
      `;
    } else {
      // Units selected - this is a placeholder for now
      const unitControlsHTML = `
        <div style="padding: 20px; display: flex; align-items: center;">
          <div style="width: 60px; height: 60px; background-color: #2196F3; display: flex; justify-content: center; align-items: center; margin-right: 20px;">
            ${units.length}
          </div>
          <div>
            <div>Units Selected: ${units.length}</div>
            <div>
              <button style="margin: 5px; padding: 5px 10px;">Move</button>
              <button style="margin: 5px; padding: 5px 10px;">Attack</button>
              <button style="margin: 5px; padding: 5px 10px;">Defend</button>
            </div>
          </div>
        </div>
      `;
      
      this.unitControl.innerHTML = unitControlsHTML;
    }
  }
  
  // Method to add a unit to the queue
  public addUnitToQueue(unitType: string, buildTime: number): void {
    if (!this.unitQueue) return;
    
    // Clear the "No units in queue" message if it exists
    if (this.unitQueue.innerHTML.includes('No units in queue')) {
      this.unitQueue.innerHTML = '';
    }
    
    // Create a unit queue item
    const queueItem = document.createElement('div');
    queueItem.classList.add('queue-item');
    queueItem.innerHTML = `
      <div class="queue-icon">${unitType.charAt(0)}</div>
      <div class="queue-progress">
        <div class="queue-progress-bar" style="width: 0%;"></div>
      </div>
    `;
    
    this.unitQueue.appendChild(queueItem);
    
    // Simulate progress with a simple animation
    // In a real game, this would be tied to the actual build progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 100 / (buildTime * 10); // Assuming buildTime is in seconds and we update every 100ms
      
      const progressBar = queueItem.querySelector('.queue-progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        // Remove the item from the queue after a short delay
        setTimeout(() => {
          queueItem.remove();
          
          // If queue is empty, show the "No units in queue" message
          if (this.unitQueue && this.unitQueue.children.length === 0) {
            this.unitQueue.innerHTML = '<span>No units in queue</span>';
          }
        }, 500);
      }
    }, 100);
  }
} 