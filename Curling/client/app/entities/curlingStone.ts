/**
 * curlingStone.ts - Implements a curling stone
 *
 * @authors Félix Boulet et Yawen Hou
 * @date 2017/01/20
 */

import { TextureCacher } from "../services/textureCacher";

export enum Team {
    Player,
    AI
}

export class CurlingStone extends THREE.Group {

    private static playerStoneColor = "#66B2FF";
    private static aiStoneColor = "#FF6666";

    static readonly MAX_RADIUS = 0.145; //* 2; //External radius of the stone
    private readonly RADIUS = 0.145 / 2; //Radius of stone (torus)
    private readonly HEIGHT = 0.290 / 2; //Height of stone (base).
    private readonly SFACES = 25; //Amount of faces for stone rendering.
    private readonly HRADIUS = 0.025 / 2; //Radius of handle tube.
    private readonly HFACES = 6; //Amount of faces for handle rendering.
    private readonly COVER_CONE = 0.0275; //By how much the cover should extend from the inner radius of the stone.
    private readonly HANDLE_HEIGHT = 0.04; //Height of the handle.
    private readonly HANDLE_SHIFT = 0.025; //By how much the handle is tilting towards the center.
    private readonly HANDLE_LENGTH = 0.13; //How long the top part of the handle is.
    private readonly HANDLE_MELD = 0.005; //By how much the handle sinks into the cover.

    private texLoader: THREE.TextureLoader;
    stoneColor: string;
    velocity: THREE.Vector3;
    isBeingPlayed = false;
    private team: Team;

    // must be set before init()
    static setPlayerStoneColor(aColor: string) {
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
            this.velocity = velocity;
        }
        if (position) {
            this.position.set(position.x, position.y, position.z);
        }
    }

    getTeam(): Team {
        return this.team;
    }

    //Function for random stone color
    getRandomColor(): string {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    init(): void {
        this.texLoader = new THREE.TextureLoader();

        //Stone base
        let torusGeometry: THREE.TorusGeometry;
        torusGeometry = new THREE.TorusGeometry(this.RADIUS, this.RADIUS, this.SFACES, this.SFACES);
        let cylinderGeometry: THREE.CylinderGeometry;
        cylinderGeometry = new THREE.CylinderGeometry(this.RADIUS, this.RADIUS,
            this.HEIGHT, this.SFACES);

        let torus: THREE.Mesh = new THREE.Mesh(torusGeometry);
        let cylinder: THREE.Mesh = new THREE.Mesh(cylinderGeometry);
        cylinder.rotation.x = Math.PI / 2;

        //Merge base geometry
        let curlingGeometry: THREE.Geometry = new THREE.Geometry();

        torus.updateMatrix();
        curlingGeometry.merge(<THREE.Geometry>torus.geometry, torus.matrix);
        cylinder.updateMatrix();
        curlingGeometry.merge(<THREE.Geometry>cylinder.geometry, cylinder.matrix);

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

        let curlingMesh: THREE.Mesh = new THREE.Mesh(curlingGeometry, material);
        //-------------------- END CURLING BASE------------------------------------------ //

        /*-------------------- CURLING HANDLE------------------------------------------ */
        // Material for cover and tube
        let handleMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.5,
            roughness: 0.2,
            color: this.stoneColor,
            transparent: true
        });

        //Cover
        let coverGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
            this.RADIUS, this.RADIUS + this.COVER_CONE, 0.01, this.SFACES);
        let cover: THREE.Mesh = new THREE.Mesh(coverGeometry);
        cover.position.y = this.RADIUS;

        //Curve for handle, 3D Spline curve
        let curve: THREE.CatmullRomCurve3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(this.HANDLE_SHIFT, this.HANDLE_HEIGHT, 0),
            new THREE.Vector3(this.HANDLE_LENGTH, this.HANDLE_HEIGHT, 0)
        ]);

        //Tube
        let tubeGeometry: THREE.TubeGeometry = new THREE.TubeGeometry(curve, 10, this.HRADIUS, this.HFACES, false);
        let tube: THREE.Mesh = new THREE.Mesh(tubeGeometry);
        tube.position.y = this.RADIUS - this.HANDLE_MELD;
        tube.position.x = -this.RADIUS;

        //End of tube
        let sphereGeometry: THREE.SphereGeometry = new THREE.SphereGeometry(this.HRADIUS, this.HFACES, this.HFACES);
        let sphere: THREE.Mesh = new THREE.Mesh(sphereGeometry);
        sphere.position.y = this.RADIUS + this.HANDLE_HEIGHT - this.HANDLE_MELD;
        sphere.position.x = -this.RADIUS + this.HANDLE_LENGTH;

        //Merge handle geometry
        let handleGeometry: THREE.Geometry = new THREE.Geometry();

        cover.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>cover.geometry, cover.matrix);
        tube.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>tube.geometry, tube.matrix);
        sphere.updateMatrix();
        handleGeometry.merge(<THREE.Geometry>sphere.geometry, sphere.matrix);

        let handleMesh: THREE.Mesh = new THREE.Mesh(handleGeometry, handleMaterial);

        curlingMesh.rotation.x = Math.PI / 2;
        this.add(curlingMesh);
        this.add(handleMesh);
    }

    // TODO: Fix timing (currently not 1 sec)
    fadeOut(): void {
        let x = 0;
        let stone = this;

        let intervalID = window.setInterval(function () {
            (<THREE.Mesh>stone.children[0]).material.opacity -= 0.05;
            (<THREE.Mesh>stone.children[1]).material.opacity -= 0.05;

            if (++x === 20) {
                window.clearInterval(intervalID);
            }
        }, 50);
    }
}
