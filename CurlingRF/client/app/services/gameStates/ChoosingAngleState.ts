import { IGameState } from './GameState';
import { ShootingState } from './ShootingState';
import { GameController } from '../gameController.service';
import { SceneBuilder } from '../sceneBuilder.service';
import { GameEngine } from '../gameEngine.service';
import { CurlingStone } from '../../entities/curlingStone';


export class ChoosingAngleState implements IGameState {

    private static instance: ChoosingAngleState = new ChoosingAngleState();
    private gameController: GameController;
    private curve: THREE.Line;
    private mouse: THREE.Vector2;
    private waiting: boolean;
    private angle: number;
    private totalTranslateOffset = 0;

    public static getInstance(): ChoosingAngleState {
        return ChoosingAngleState.instance;
    }

    public init(gameController: GameController): void {
        this.gameController = gameController;
        this.mouse = new THREE.Vector2();
        this.angle = null;
    }

    private constructor() {
        if (ChoosingAngleState.instance) {
            throw new Error("Error: ChoosingAngleState " +
                "is a singleton class, use ChoosingAngleState.getInstance() instead of new.");
        }
        ChoosingAngleState.instance = this;
    }

    public onMouseDown(event: any): void {
        // Do nothing
    }

    public onMouseUp(event: any): void {
        if (this.angle !== null) {
            this.gameController.getGameData().curveAngle = this.angle;
            this.gameController.getGameData().state = this.nextState();
        }
    }

    public onMouseMove(event: any): void {
        if (!this.waiting) {
            this.setMouse(event);
            let angle = this.calculateAngle(this.mouse);

            if (angle !== null) {
                this.updateDirectionCurve(this.angle - angle);
                this.angle = angle;
            }

            this.waiting = true;
            setTimeout(() => {
                this.waiting = false;
            }, 10);
        }
    }

    public onKeyboardDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public update(delta: number): void {
        const curveData = SceneBuilder.getInstance().getCurveData();
        const lines = SceneBuilder.getInstance().getRinkData().lines;
        const gameData = this.gameController.getGameData();

        const scalarOffset = curveData.translateOffset * delta;
        this.totalTranslateOffset += scalarOffset;

        this.curve.translateX(scalarOffset * Math.sin(gameData.curveAngle));
        this.curve.translateZ(scalarOffset * Math.cos(gameData.curveAngle));

        if (this.totalTranslateOffset > curveData.dashSize * 2) {
            this.curve.position.x = 0;
            this.curve.position.z = lines.start;
            this.totalTranslateOffset = 0;
        }
    }

    public enterState(): ChoosingAngleState {
        document.body.style.cursor = "none";
        let self = this;
        SceneBuilder.getInstance().buildAngleCurve()
            .then((curve) => {
                self.curve = curve;
                GameEngine.getInstance().addToScene(self.curve);
                this.updateDirectionCurve(0);
            });
        return this;
    }

    public nextState(): ShootingState {
        return ShootingState.getInstance().enterState();
    }

    private setMouse(event: any): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    private calculateAngle(mouse: THREE.Vector2): number {
        const rinkDims = SceneBuilder.getInstance().getRinkData().rink.getDimensions();
        let gameData = this.gameController.getGameData();

        let intersects = GameEngine.getInstance().checkIntersect(mouse);
        if (intersects.length > 0) {
            let intersectionPoint = intersects[0].point;
            let distance = intersectionPoint.x;
            let angle = distance / (rinkDims.width / 2) * SceneBuilder.getInstance().getCurveData().maxAngle;
            gameData.curveAngle = THREE.Math.degToRad(angle);
            return angle;
        }
        return null;
    }

    // Update the aiming line visually
    private updateDirectionCurve(angleDifference: number): void {
        this.curve.geometry.rotateY(THREE.Math.degToRad(angleDifference));
        // Update end point of the directional line
        (<THREE.Geometry>this.curve.geometry).vertices[1] = this.getFurthestCollisionPoint();
    }

    // Used for determining the length of the dashed line when aiming (where the line stops)
    private getFurthestCollisionPoint(): THREE.Vector3 {
        let x = 0, z = 0;
        let gameData = this.gameController.getGameData();
        const rinkDims = SceneBuilder.getInstance().getRinkData().rink.getDimensions();
        const lines = SceneBuilder.getInstance().getRinkData().lines;

        // Rink border
        if (gameData.curveAngle !== 0) {
            x = Math.sign(gameData.curveAngle) * rinkDims.width / 2;
            z = x / Math.tan(gameData.curveAngle);
        }

        // Rink end
        if (z > rinkDims.length - lines.start) {
            z = rinkDims.length - lines.start;
            x = z * Math.tan(gameData.curveAngle);
        }

        // Other curling stones
        let shortestDistance = rinkDims.length - lines.start;

        GameEngine.getInstance().getStones().forEach(curlingStone => {
            let angle = -Math.atan(curlingStone.position.x / curlingStone.position.z);
            let distance = curlingStone.position.distanceTo(GameEngine.getInstance().getActiveStone().position);
            let error = Math.asin(CurlingStone.MAX_RADIUS / distance);

            if (distance <= shortestDistance &&
                gameData.curveAngle < angle + error &&
                gameData.curveAngle > angle - error) {
                shortestDistance = distance;
                z = curlingStone.position.z - Math.cos(gameData.curveAngle) * lines.back / 2;
                x = -z * Math.tan(gameData.curveAngle);
            }
        });
        return new THREE.Vector3(x, 0, z);
    }
}
