/**
 * gameAudio.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/03/12
 */

import { GameCamera } from './gameCamera.service';

export class GameAudio {

    private static instance = new GameAudio();

    private camera: THREE.Camera;
    private listener: THREE.AudioListener;
    private collisionSound: THREE.PositionalAudio;
    private slidingSound: THREE.PositionalAudio;
    private sweepingSound: THREE.PositionalAudio;

    public static getInstance(): GameAudio {
        return GameAudio.instance;
    }

    private constructor() {
        if (GameAudio.instance) {
            throw new Error("Error: GameAudio is a singleton class, use GameAudio.getInstance() instead of new.");
        }
        GameAudio.instance = this;
    }

    public init(gameCamera: GameCamera): void {
        this.camera = gameCamera.getCamera();
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        this.collisionSound = new THREE.PositionalAudio(this.listener);
        this.slidingSound = new THREE.PositionalAudio(this.listener);
        this.sweepingSound = new THREE.PositionalAudio(this.listener);
        this.loadSounds();
    }

    private loadSounds(): void {
        const audioLoader = new THREE.AudioLoader();
        const self = this;
        audioLoader.load(
            // URL du son de collision
            '../assets/sounds/collision.ogg',
            // Function when resource is loaded
            (audioBuffer: any) => {
                // Set the audio object buffer to the loaded object
                self.collisionSound.setBuffer(audioBuffer);
                self.collisionSound.name = "collisionSound";
            },
            // Function called when download progresses
            (xhr: any) => {
                // Do nothing
            },
            // Function called when download errors
            (xhr: any) => {
                console.log('Error loading sounds');
            }
        );
        audioLoader.load(
            // URL du son de glissement
            '../assets/sounds/sliding.ogg',
            // Function when resource is loaded
            (audioBuffer: any) => {
                // Set the audio object buffer to the loaded object
                self.slidingSound.setBuffer(audioBuffer);
                self.slidingSound.name = "slidingSound";
            },
            // Function called when download progresses
            (xhr: any) => {
                // Do nothing
            },
            // Function called when download errors
            (xhr: any) => {
                console.log('Error loading sounds');
            }
        );
        audioLoader.load(
            // URL du son de collision
            '../assets/sounds/sweeping.ogg',
            // Function when resource is loaded
            (audioBuffer: any) => {
                // Set the audio object buffer to the loaded object
                self.sweepingSound.setBuffer(audioBuffer);
                self.sweepingSound.name = "sweepingSound";
            },
            // Function called when download progresses
            (xhr: any) => {
                // Do nothing
            },
            // Function called when download errors
            (xhr: any) => {
                console.log('Error loading sounds');
            }
        );
    }

    public getCollisionSound(): THREE.PositionalAudio {
        return this.collisionSound;
    }

    public getSlidingSound(): THREE.PositionalAudio {
        return this.slidingSound;
    }

    public getSweepingSound(): THREE.PositionalAudio {
        return this.sweepingSound;
    }
}
