import { Component, OnInit } from '@angular/core';
import { Player } from '../classes/player';

@Component({
    selector: 'player-name',
    template: `
    <div *ngIf="player">
      <label>name: </label>
      <input [(ngModel)]="player.name" placeholder="name"/>
      <button md-button color="primary" type="button" (click)="validatePlayerName()">Valider</button>
    </div>
  `
})

export class PlayerNameComponent implements OnInit {
    private player: Player;

    public ngOnInit(): void {
        this.player = new Player();
        this.player.name = "";
    }

    public getPlayer(): Player {
        return this.player;
    }

    public validatePlayerName(): boolean {
        if (this.player.name === "") {
            return false;
        }
        return true;
    }
}
