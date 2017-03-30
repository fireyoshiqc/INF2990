import { GameController } from '../gameController.service';

export interface IGameState {
    init(gameController: GameController): void;
    onMouseDown(event: any): void;
    onMouseUp(event: any): void;
    onMouseMove(event: any): void;
    onKeyboardDown(event: KeyboardEvent): void;
    update(delta: number): void;
    enterState(): IGameState;
    nextState(): IGameState;
}
