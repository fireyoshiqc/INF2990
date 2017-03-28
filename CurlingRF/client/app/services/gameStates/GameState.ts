export interface IGameState {
    onMouseDown(event: any): void;
    onMouseUp(event: any): void;
    onMouseMove(event: any): void;
    onKeyboardDown(event: KeyboardEvent): void;
    update(delta: number): void;
}
