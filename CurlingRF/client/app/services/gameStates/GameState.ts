import { GameEngine } from '../gameEngine.service';

export interface IGameState {
    init(gameEngine: GameEngine): void;
    onMouseDown(event: any): void;
    onMouseUp(event: any): void;
    onMouseMove(event: any): void;
    onKeyboardDown(event: KeyboardEvent): void;
    update(delta: number): void;
    enterState(): IGameState;
}
