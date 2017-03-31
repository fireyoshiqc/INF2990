/**
 * curlingStone.ts - Implements a curling stone
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../utils/textureCacher.util";

export enum Team {
    Player,
    AI
}

export enum SpinOrientation {
    CLOCKWISE = -1,
    COUNTER_CLOCKWISE = 1
}

export class CurlingStone extends THREE.Group {

    private static playerStoneColor = "#488957";
    private static aiStoneColor = "#FF6060";

    public static readonly MAX_RADIUS = 0.145; // External radius of the stone
    private readonly RADIUS = 0.145 / 2; // Radius of stone (torus)
    private readonly HEIGHT = 0.290 / 2; // Height of stone (base).
    private readonly SFACES = 25; // Amount of faces for stone rendering.
    private readonly HRADIUS = 0.025 / 2; // Radius of handle tube.
    private readonly HFACES = 6; // Amount of faces for handle rendering.
    private readonly COVER_CONE = 0.0275; // By how much the cover should extend from the inner radius of the stone.
    private readonly HANDLE_HEIGHT = 0.04; // Height of the handle.
    private readonly HANDLE_SHIFT = 0.025; // By how much the handle is tilting towards the center.
    private readonly HANDLE_LENGTH = 0.13; // How long the top part of the handle is.
    private readonly HANDLE_MELD = 0.005; // By how much the handle sinks into the cover.

    private stoneColor: string;
    private velocity: THREE.Vector3 = new THREE.Vector3();
    private beingPlayed = false;
    private hasBeenShot = false;
    private spinOrientation: SpinOrientation;
    private team: Team;

    // Must be set before init()
    public static setPlayerStoneColor(aColor: string): void {
        let regex = new RegExp('#[0-9a-fA-F]{6}');

        if (regex.test(aColor)) {
            CurlingStone.playerStoneColor = aColor;
        }
    }

    constructor(team: Team, velocity?: THREE.Vector3, position?: THREE.Vector3) {
        super();

        this.team = team;

        this.stoneColor = (this.team === Team.Player) ? CurlingStone.playerStoneColor : CurlingStone.aiStoneColor;

        if (velocity) {
            this.velocity.set(velocity.x, velocity.y, velocity.z);
        }
        if (position) {
            this.position.set(position.x, position.y, position.z);
        }
        this.spinOrientation = SpinOrientation.CLOCKWISE;
        this.beingPlayed = true;
        this.init();
    }

    public update(delta: number): void {
        this.position.add(this.velocity.clone().multiplyScalar(delta));
    }

    public getTeam(): Team {
        return this.team;
    }

    public getColor(): string {
        return this.stoneColor;
    }

    public getVelocity(): THREE.Vector3 {
        return this.velocity;
    }

    public setVelocity(velocity: THREE.Vector3): void {
        this.velocity.set(velocity.x, velocity.y, velocity.z);
    }

    // This function builds the whole curling stone model.
    private init(): void {
        /*-------------------- CURLING BASE ------------------------------------------*/
        // Stone base
        let torusGeometry: THREE.TorusGeometry;
        torusGeometry = new THREE.TorusGeometry(this.RADIUS, this.RADIUS, this.SFACES, this.SFACES);
        let cylinderGeometry: THREE.CylinderGeometry;
        cylinderGeometry = new THREE.CylinderGeometry(this.RADIUS, this.RADIUS,
            this.HEIGHT, this.SFACES);

        let torus: THREE.Mesh = new THREE.Mesh(torusGeometry);
        let cylinder: THREE.Mesh = new THREE.Mesh(cylinderGeometry);
        cylinder.rotation.x = Math.PI / 2;

        // Merge base geometry
        let stoneGeometry: THREE.Geometry = new THREE.Geometry();

        torus.updateMatrix();
        stoneGeometry.merge(<THREE.Geometry>torus.geometry, torus.matrix);
        cylinder.updateMatrix();
        stoneGeometry.merge(<THREE.Geometry>cylinder.geometry, cylinder.matrix);

        // Material for stone base
        let material: THREE.MeshStandardMaterial;
        let texture: THREE.Texture;
        texture = TextureCacher.load('/assets/textures/granite.jpg');

        material = new THREE.MeshStandardMaterial({
            metalness: 0.0,
            roughness: 0.2,
            map: texture,
            transparent: true
        });

        let stoneMesh: THREE.Mesh = new THREE.Mesh(stoneGeometry, material);
        /*-------------------- END CURLING BASE ------------------------------------------*/

        /*-------------------- CURLING HANDLE ------------------------------------------*/
        // Material for cover and tube
        let handleMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.5,
            roughness: 0.2,
            color: this.stoneColor,
            transparent: true
        });

        // Cover
        let coverGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
            this.RADIUS, this.RADIUS + this.COVER_CONE, 0.01, this.SFACES);
        let cover: THREE.Mesh = new THREE.Mesh(coverGeometry);
        cover.position.y = this.RADIUS;

        // Curve for handle, 3D Spline curve
        let curve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(this.HANDLE_SHIFT, this.HANDLE_HEIGHT, 0),
            new THREE.Vector3(this.HANDLE_LENGTH, this.HANDLE_HEIGHT, 0)
        ]);

        // Tube
        let tubeGeometry: THREE.TubeGeometry = new THREE.TubeGeometry(curve, 10, this.HRADIUS, this.HFACES, false);
        let tube: THREE.Mesh = new THREE.Mesh(tubeGeometry);
        tube.position.y = this.RADIUS - this.HANDLE_MELD;
        tube.position.x = -this.RADIUS;

        // End of tube
        let sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(this.HRADIUS, this.HFACES, this.HFACES);
        let sphere: THREE.Mesh = new THREE.Mesh(sphereGeometry);
        sphere.position.y = this.RADIUS + this.HANDLE_HEIGHT - this.HANDLE_MELD;
        sphere.position.x = -this.RADIUS + this.HANDLE_LENGTH;

        // Merge handle geometry
        let handleGeometry: THREE.Geometry = new THREE.Geometry();

        cover.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>cover.geometry, cover.matrix);
        tube.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>tube.geometry, tube.matrix);
        sphere.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>sphere.geometry, sphere.matrix);

        let handleMesh: THREE.Mesh = new THREE.Mesh(handleGeometry, handleMaterial);

        stoneMesh.rotation.x = Math.PI / 2;

        stoneMesh.castShadow = true;
        stoneMesh.receiveShadow = true;
        handleMesh.castShadow = true;
        handleMesh.receiveShadow = true;
        this.add(stoneMesh);
        this.add(handleMesh);
    }

    public fadeOut(delta: number): boolean {
        (<THREE.Mesh>this.children[0]).material.opacity -= delta;
        (<THREE.Mesh>this.children[1]).material.opacity -= delta;

        // If the stone has completely faded out, return true so it can get removed from the scene.
        if ((<THREE.Mesh>this.children[0]).material.opacity < 0
            || (<THREE.Mesh>this.children[1]).material.opacity < 0) {
            return true;
        }
        return false;

    }

    public highlightOn(): void {
        let outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide });

        // Highlight stone
        let stoneMesh = <THREE.Mesh>this.children[0];
        let stoneGeometry = <THREE.Geometry>(stoneMesh.geometry);
        let outlineStoneMesh = new THREE.Mesh(stoneGeometry, outlineMaterial);
        outlineStoneMesh.scale.multiplyScalar(1.10);
        stoneMesh.add(outlineStoneMesh);

        // Highlight handle
        let handleMesh = <THREE.Mesh>this.children[1];
        let handleGeometry = <THREE.Geometry>(handleMesh.geometry);
        let outlineHandleMesh = new THREE.Mesh(handleGeometry, outlineMaterial);
        outlineHandleMesh.scale.multiplyScalar(1.10);
        handleMesh.add(outlineHandleMesh);
    }

    public highlightOff(): void {
        // Remove stone highlight
        let stoneMesh = <THREE.Mesh>this.children[0];
        let outlineStoneMesh = stoneMesh.children[0];
        stoneMesh.remove(outlineStoneMesh);

        // Remove handle highlight
        let handleMesh = <THREE.Mesh>this.children[1];
        let outlineHandleMesh = handleMesh.children[0];
        handleMesh.remove(outlineHandleMesh);
    }

    public isBeingPlayed(): boolean {
        return this.beingPlayed;
    }

    public getHasBeenShot(): boolean {
        return this.hasBeenShot;
    }

    public setHasBeenShot(): void {
        this.hasBeenShot = true;
    }

    public setSpinOrientation(orientation: SpinOrientation): void {
        this.spinOrientation = orientation;
    }

    public getSpinOrientation(): SpinOrientation {
        return this.spinOrientation;
    }
}
