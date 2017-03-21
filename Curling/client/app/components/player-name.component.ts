import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'player-name',
    template: `
    <div *ngIf="getPlayer()">
      <label>name: </label>
      <input [(ngModel)]="getPlayer().name" placeholder="name"/>
      <button md-button color="primary" type="button" (click)="validatePlayerName()">Valider</button>
    </div>
  `
})

export class PlayerNameComponent implements OnInit {
    private player: IPlayer;

    public ngOnInit(): void {
        this.player = { name: "", score: 0 };
    }

    public getPlayer(): IPlayer {
        return this.player;
    }

    public validatePlayerName(): boolean {
        if (this.player.name === "") {
            return false;
        }
        return true;
    }
}

export interface IPlayer {
    name: string;
    score: number;
}
