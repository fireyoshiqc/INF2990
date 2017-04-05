/**
 * rack.component.ts
 *
 * @authors Félix Boulet, Pierre To
 * @date 2017/02/06
 */

import { Component } from '@angular/core';
import { RackManager } from '../services/rackManager.service';

@Component({
    moduleId: module.id,
    selector: 'rack-comp',
    templateUrl: '/assets/templates/rack.component.html',
    providers: [RackManager]
})

export class RackComponent {
    private active: boolean;

    constructor(private rackManager: RackManager) {
        this.rackManager = rackManager;
        this.active = false;
    }

    public isActive(): boolean {
        return this.active;
    }

    public keyboardInput(event: KeyboardEvent): void {
        this.rackManager.handleInput(event);
    }

    public updateRack(letters: string[]): void {
        this.rackManager.updateRack(letters);
    }

    public deselectLetter(): void {
        this.rackManager.deselectLetter();
    }

    public toggleActiveState(): void {
        this.active = !this.active;
    }
}
