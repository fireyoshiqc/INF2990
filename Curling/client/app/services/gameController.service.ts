/**
 * gameController.service.ts
 *
 * @authors Vincent Chassé et Pierre To
 * @date 2017/02/24
 */

import { Injectable } from '@angular/core';

import { CurlingStone, Team } from '../entities/curlingStone';
import { GameRenderer } from './gameRenderer';
import { Rink } from '../entities/rink';

@Injectable()
export class GameController {
    private gameRenderer: GameRenderer;
    private curlingStones: CurlingStone[] = [];
    readonly RINGS_CENTER = new THREE.Vector3(0, 0, -Rink.RINK_LENGTH / 2 - Rink.RINGS_OFFSET);
    private playerScore = 0;
    private aiScore = 0;

    public init(container?: HTMLElement): void {
        this.gameRenderer = new GameRenderer();

        this.gameRenderer.init(container);

        CurlingStone.setPlayerStoneColor("#FFFFFF");

        // TODO : Lancement des pierres de curling
        this.addStone(Team.Player, new THREE.Vector3(0, 0, 0));

        this.gameRenderer.render();
    }

    addStone(team: Team, position: THREE.Vector3) {
        let stone = new CurlingStone(team, new THREE.Vector3(0, 0, 0), position);

        stone.init();
        this.curlingStones.push(stone);

        this.gameRenderer.addStone(stone);
    }

    getCurlingStones(): CurlingStone[] {
        return this.curlingStones;
    }

    getGameRenderer(): GameRenderer {
        return this.gameRenderer;
    }

    getPlayerScore(): number {
        return this.playerScore;
    }

    getAiScore(): number {
        return this.aiScore;
    }

    onResize(event: any): void {
        this.gameRenderer.onResize(event);
    }

    switchCamera(): void {
        this.gameRenderer.switchCamera();
    }

    sortStonesByDistance(): CurlingStone[] {
        // deep copy
        let sortStones = this.curlingStones.slice();

        return sortStones.sort((stone1: CurlingStone, stone2: CurlingStone) => {
            // if stone1 is closer to the rings than stone 2, it should be placed before stone 2
            return stone1.position.distanceTo(this.RINGS_CENTER) - stone2.position.distanceTo(this.RINGS_CENTER);
        });
    }

    updateScore(): void {
        let sortStones = this.sortStonesByDistance();

        let teamClosestStone = sortStones[0].getTeam();
        let index = 0;
        let score = 0;

        // add points to the closest team for each stone that is inside of the rings
        // and closer to the closest stone from the opposing team (in respect to the curling rules)
        while (sortStones[index].getTeam() === teamClosestStone &&
               sortStones[index].position.distanceTo(this.RINGS_CENTER) < Rink.OUTER_RADIUS) {
            score++;
            index++;
        }

        // update score of closest team
        if (teamClosestStone === Team.Player) {
            this.playerScore += score;
        } else {
            this.aiScore += score;
        }
    }


    /******************** TEST HELPER *******************/

    setStonesForScoringTests(): void {
        this.addStone(Team.Player,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 3));
        this.addStone(Team.Player,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 2.5));
        this.addStone(Team.Player,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 2));
        this.addStone(Team.Player,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 1));
        this.addStone(Team.AI,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 3.5));
        this.addStone(Team.AI,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 1.5));
        this.addStone(Team.AI,
            new THREE.Vector3(this.RINGS_CENTER.x, this.RINGS_CENTER.y, this.RINGS_CENTER.z + 0.5));
        this.addStone(Team.AI, this.RINGS_CENTER);
    }

    resetStones(): void {
        this.curlingStones = this.curlingStones.slice(0, 1);
    }

    /***************** END TEST HELPER *******************/
}
