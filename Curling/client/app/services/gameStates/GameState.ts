import { GameController } from '../gameController.service';

export interface IGameState {
    init(gameController: GameController): void;
    onMouseDown(event: MouseEvent): void;
    onMouseUp(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    onKeyboardDown(event: KeyboardEvent): void;
    update(delta: number): void;
    enterState(): IGameState;
    nextState(): IGameState;
}
