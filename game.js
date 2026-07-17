// ============================================================
// PULAU KATA — 3D Island Word Quest
// Complete Game Engine
// ============================================================

import * as THREE from 'three';

// ============================================================
// SECTION 1: CONFIGURATION
// ============================================================

const CONFIG = {
    // World
    ISLAND_SIZE: 200,
    ISLAND_SEGMENTS: 100,
    ISLAND_RADIUS: 80,
    MAX_HEIGHT: 18,
    WATER_LEVEL: 0.3,

    // Player
    PLAYER_SPEED: 8,
    PLAYER_RUN_SPEED: 14,
    PLAYER_JUMP_FORCE: 12,
    GRAVITY: 25,
    MOUSE_SENSITIVITY: 0.002,
    TOUCH_SENSITIVITY: 0.004,

    // Camera
    CAM_DISTANCE: 8,
    CAM_HEIGHT: 4,
    CAM_LERP: 0.08,

    // Letters
    LETTER_FLOAT_HEIGHT: 2.0,
    LETTER_BOB_SPEED: 2,
    LETTER_BOB_AMOUNT: 0.3,
    LETTER_SPIN_SPEED: 1.5,
    LETTER_COLLECT_DIST: 3.0,
    EXTRA_LETTERS_COUNT: 5,

    // Building
    BUILD_GRID_SIZE: 2,

    // Save
    SAVE_KEY: 'pulau_kata_save',
    AUTO_SAVE_INTERVAL: 30000,

    // Colors
    COLORS: {
        ocean: 0x0077B6,
        oceanDeep: 0x023E8A,
        oceanLight: 0x48CAE4,
        sand: 0xF4D35E,
        sandDark: 0xD4B34E,
        grass: 0x2D6A4F,
        grassLight: 0x52B788,
        rock: 0x6c757d,
        rockDark: 0x495057,
        snow: 0xECF0F1,
        letterGlow: 0xFFD60A,
        sky: 0x87CEEB,
        fog: 0x87CEEB,
        water: 0x0096C7,
        trunk: 0x8B6914,
        leaves: 0x228B22,
    }
};

// ============================================================
// SECTION 2: PUZZLE DATA
// ============================================================

const PUZZLES = [
    { word: 'PULAU', clue: 'Tanah yang dikelilingi air 🌊', category: '🌍 Geografi', reward: { id: 'palm', name: 'Pokok Kelapa', icon: '🌴', count: 3, cat: 'nature' } },
    { word: 'BUNGA', clue: 'Bahagian tumbuhan yang cantik dan berwarna 🌺', category: '🌿 Alam', reward: { id: 'flower', name: 'Bunga', icon: '🌺', count: 5, cat: 'nature' } },
    { word: 'RUMAH', clue: 'Tempat kita tinggal 🏠', category: '🏗️ Bangunan', reward: { id: 'hut', name: 'Pondok', icon: '🏠', count: 1, cat: 'structure' } },
    { word: 'IKAN', clue: 'Haiwan yang hidup dalam air 🐟', category: '🐾 Haiwan', reward: { id: 'pond', name: 'Kolam', icon: '🐟', count: 2, cat: 'decoration' } },
    { word: 'BINTANG', clue: 'Cahaya di langit malam ⭐', category: '🌌 Angkasa', reward: { id: 'lamp', name: 'Lampu', icon: '💡', count: 3, cat: 'decoration' } },
    { word: 'PELANGI', clue: 'Lengkungan warna selepas hujan 🌈', category: '🌿 Alam', reward: { id: 'garden', name: 'Taman', icon: '🌳', count: 1, cat: 'nature' } },
    { word: 'JAMBATAN', clue: 'Struktur merentasi sungai 🌉', category: '🏗️ Bangunan', reward: { id: 'bridge', name: 'Jambatan', icon: '🌉', count: 1, cat: 'structure' } },
    { word: 'MERCUSUAR', clue: 'Menara cahaya panduan untuk kapal 🗼', category: '🏗️ Bangunan', reward: { id: 'lighthouse', name: 'Mercusuar', icon: '🗼', count: 1, cat: 'structure' } },
    { word: 'LAUTAN', clue: 'Perairan yang sangat luas', category: '🌍 Geografi', reward: { id: 'dock', name: 'Jeti', icon: '⚓', count: 1, cat: 'structure' } },
    { word: 'HUTAN', clue: 'Kawasan dengan banyak pokok 🌳', category: '🌿 Alam', reward: { id: 'tree', name: 'Pokok', icon: '🌲', count: 5, cat: 'nature' } },
    { word: 'BURUNG', clue: 'Haiwan berbulu yang boleh terbang 🐦', category: '🐾 Haiwan', reward: { id: 'nest', name: 'Sarang', icon: '🐦', count: 2, cat: 'decoration' } },
    { word: 'PANTAI', clue: 'Kawasan berpasir di tepi laut 🏖️', category: '🌍 Geografi', reward: { id: 'umbrella', name: 'Payung Pantai', icon: '⛱️', count: 3, cat: 'decoration' } },
    { word: 'GERBANG', clue: 'Pintu masuk yang besar dan megah', category: '🏗️ Bangunan', reward: { id: 'gate', name: 'Gerbang', icon: '🚪', count: 1, cat: 'structure' } },
    { word: 'KHAZANAH', clue: 'Harta yang tersembunyi 💎', category: '🔮 Misteri', reward: { id: 'chest', name: 'Peti Harta', icon: '💎', count: 1, cat: 'special' } },
    { word: 'PERAHU', clue: 'Kenderaan di atas air ⛵', category: '🚗 Kenderaan', reward: { id: 'boat', name: 'Perahu', icon: '⛵', count: 1, cat: 'special' } },
    { word: 'GUNUNG', clue: 'Tanah tinggi yang menjulang 🏔️', category: '🌍 Geografi', reward: { id: 'rocks', name: 'Batu Besar', icon: '🪨', count: 3, cat: 'nature' } },
    { word: 'MAHKOTA', clue: 'Hiasan kepala raja atau ratu 👑', category: '👑 Diraja', reward: { id: 'statue', name: 'Patung', icon: '🗿', count: 1, cat: 'special' } },
    { word: 'TELAGA', clue: 'Lubang dalam tanah berisi air', category: '🌿 Alam', reward: { id: 'well', name: 'Perigi', icon: '🪣', count: 1, cat: 'structure' } },
    { word: 'BENTENG', clue: 'Kubu pertahanan yang kukuh 🏰', category: '🏗️ Bangunan', reward: { id: 'fort', name: 'Benteng', icon: '🏰', count: 1, cat: 'structure' } },
    { word: 'PERMATA', clue: 'Batu berharga yang berkilau 💎', category: '⭐ Khas', reward: { id: 'fountain', name: 'Air Pancut', icon: '⛲', count: 1, cat: 'special' } },
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ============================================================
// SECTION 3: EQUIPMENT DATA
// ============================================================

const EQUIPMENT_DATA = {
    // Hats
    topi_pancing: { name: 'Topi Pancing', slot: 'hat', build: (c) => {
        const g = new THREE.Group();
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.06, 16), new THREE.MeshLambertMaterial({ color: c || 0x8B6914 }));
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.35, 16), new THREE.MeshLambertMaterial({ color: c || 0x8B6914 }));
        top.position.y = 0.2;
        g.add(brim, top);
        return g;
    }},
    songkok: { name: 'Songkok', slot: 'hat', build: (c) => {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.5, 16), new THREE.MeshLambertMaterial({ color: c || 0x1a1a1a }));
        body.position.y = 0.25;
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.4, 0.06, 16), new THREE.MeshLambertMaterial({ color: c || 0x2a2a2a }));
        g.add(body, rim);
        return g;
    }},
    mahkota: { name: 'Mahkota', slot: 'hat', build: () => {
        const g = new THREE.Group();
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.2, 16, 1, true), new THREE.MeshLambertMaterial({ color: 0xFFD700, side: THREE.DoubleSide }));
        band.position.y = 0.1;
        g.add(band);
        for (let i = 0; i < 5; i++) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 4), new THREE.MeshLambertMaterial({ color: 0xFFD700 }));
            const angle = (i / 5) * Math.PI * 2;
            spike.position.set(Math.cos(angle) * 0.35, 0.3, Math.sin(angle) * 0.35);
            g.add(spike);
        }
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
        gem.position.set(0, 0.15, 0.4);
        g.add(gem);
        return g;
    }},
    topi_kait: { name: 'Topi Kait', slot: 'hat', build: () => {
        const g = new THREE.Group();
        const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
        dome.position.y = 0.05;
        const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 16, 1, false, 0, Math.PI), new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
        brim.rotation.y = Math.PI;
        g.add(dome, brim);
        return g;
    }},
    // Face
    cermin_mata: { name: 'Cermin Mata', slot: 'face', build: () => {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.02), mat);
        bridge.position.z = 0.02;
        const l = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), mat);
        l.position.set(-0.15, 0, 0.02);
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), mat);
        r.position.set(0.15, 0, 0.02);
        const lens1 = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), new THREE.MeshLambertMaterial({ color: 0xaaddff, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
        lens1.position.set(-0.15, 0, 0.03);
        const lens2 = lens1.clone();
        lens2.position.set(0.15, 0, 0.03);
        g.add(bridge, l, r, lens1, lens2);
        return g;
    }},
    cermin_hitam: { name: 'Cermin Mata Hitam', slot: 'face', build: () => {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.03), mat);
        frame.position.z = 0.02;
        const lens1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.02), new THREE.MeshLambertMaterial({ color: 0x111111 }));
        lens1.position.set(-0.13, 0, 0.04);
        const lens2 = lens1.clone();
        lens2.position.set(0.13, 0, 0.04);
        g.add(frame, lens1, lens2);
        return g;
    }},
    // Back
    beg_galas: { name: 'Beg Galas', slot: 'back', build: () => {
        const g = new THREE.Group();
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.25), new THREE.MeshLambertMaterial({ color: 0xc0392b }));
        const flap = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.15, 0.02), new THREE.MeshLambertMaterial({ color: 0xa93226 }));
        flap.position.set(0, 0.25, -0.12);
        const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.03), new THREE.MeshLambertMaterial({ color: 0xFFD700 }));
        buckle.position.set(0, 0.18, -0.14);
        g.add(bag, flap, buckle);
        return g;
    }},
    jubah: { name: 'Jubah', slot: 'back', build: () => {
        const g = new THREE.Group();
        const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.2), new THREE.MeshLambertMaterial({ color: 0x9b59b6, side: THREE.DoubleSide }));
        cape.position.set(0, -0.3, 0);
        g.add(cape);
        return g;
    }},
    sayap: { name: 'Sayap', slot: 'back', build: () => {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0xecf0f1, side: THREE.DoubleSide });
        const lw = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), mat);
        lw.position.set(-0.5, 0.1, 0);
        lw.rotation.y = -0.3;
        const rw = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), mat);
        rw.position.set(0.5, 0.1, 0);
        rw.rotation.y = 0.3;
        g.add(lw, rw);
        return g;
    }},
    // Right Hand
    pedang: { name: 'Pedang', slot: 'rightHand', build: () => {
        const g = new THREE.Group();
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.02), new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }));
        blade.position.y = 0.3;
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.04), new THREE.MeshLambertMaterial({ color: 0xFFD700 }));
        guard.position.y = -0.1;
        const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.04), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        hilt.position.y = -0.2;
        g.add(blade, guard, hilt);
        return g;
    }},
    kapak: { name: 'Kapak', slot: 'rightHand', build: () => {
        const g = new THREE.Group();
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.04), new THREE.MeshLambertMaterial({ color: 0x95a5a6 }));
        head.position.y = 0.35;
        head.position.x = 0.08;
        g.add(handle, head);
        return g;
    }},
    obor: { name: 'Obor', slot: 'rightHand', build: () => {
        const g = new THREE.Group();
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.6, 8), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        const fire = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.15, 8), new THREE.MeshLambertMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.8 }));
        fire.position.y = 0.38;
        g.add(stick, fire);
        return g;
    }},
    // Left Hand
    perisai: { name: 'Perisai', slot: 'leftHand', build: () => {
        const g = new THREE.Group();
        const shield = new THREE.Mesh(new THREE.CircleGeometry(0.25, 6), new THREE.MeshLambertMaterial({ color: 0x2980b9, side: THREE.DoubleSide }));
        const boss = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshLambertMaterial({ color: 0xFFD700 }));
        boss.position.z = 0.03;
        g.add(shield, boss);
        return g;
    }},
    lentera: { name: 'Lentera', slot: 'leftHand', build: () => {
        const g = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.12), new THREE.MeshLambertMaterial({ color: 0x333333, transparent: true, opacity: 0.5 }));
        const light = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshLambertMaterial({ color: 0xFFD60A, emissive: 0xFFD60A, emissiveIntensity: 1 }));
        const hook = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 6, 12, Math.PI), new THREE.MeshLambertMaterial({ color: 0x333333 }));
        hook.position.y = 0.12;
        hook.rotation.x = Math.PI;
        g.add(frame, light, hook);
        return g;
    }},
};

// ============================================================
// SECTION 4: NOISE GENERATOR
// ============================================================

function createNoise(seed) {
    function hash(x, y) {
        let h = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
        return h - Math.floor(h);
    }
    function lerp(a, b, t) { return a + t * (b - a); }
    function smooth(t) { return t * t * (3 - 2 * t); }

    return function noise2D(x, y) {
        const ix = Math.floor(x), iy = Math.floor(y);
        const fx = smooth(x - ix), fy = smooth(y - iy);
        return lerp(
            lerp(hash(ix, iy), hash(ix + 1, iy), fx),
            lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx),
            fy
        ) * 2 - 1;
    };
}

function fbm(noise, x, y, octaves = 6) {
    let val = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < octaves; i++) {
        val += amp * noise(x * freq, y * freq);
        amp *= 0.5;
        freq *= 2.0;
    }
    return val;
}

// ============================================================
// SECTION 5: PLAYER MODEL
// ============================================================

class PlayerModel {
    constructor() {
        this.group = new THREE.Group();
        this.parts = {};
        this.equipmentMeshes = {};
        this.animTime = 0;
        this.isMoving = false;
        this.isJumping = false;

        this.colors = {
            skin: '#e0ac69',
            hair: '#2c1b0e',
            shirt: '#4a90d9',
            pants: '#2d4a7a',
            shoes: '#3d3d3d',
        };

        this.equipment = { hat: '', face: '', back: '', rightHand: '', leftHand: '' };
        this.pivots = {};

        this._buildBody();
    }

    _mat(hex) {
        return new THREE.MeshLambertMaterial({ color: hex });
    }

    _buildBody() {
        // Head
        this.parts.head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), this._mat(this.colors.skin));
        this.parts.head.position.y = 2.05;
        this.parts.head.castShadow = true;

        // Hair
        this.parts.hair = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.25, 0.78), this._mat(this.colors.hair));
        this.parts.hair.position.y = 2.5;

        // Eyes
        const eyeMat = this._mat('#ffffff');
        const pupilMat = this._mat('#1a1a2e');
        this.parts.eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.04), eyeMat);
        this.parts.eyeL.position.set(-0.15, 2.1, 0.39);
        this.parts.eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.04), eyeMat);
        this.parts.eyeR.position.set(0.15, 2.1, 0.39);
        this.parts.pupilL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), pupilMat);
        this.parts.pupilL.position.set(-0.15, 2.08, 0.42);
        this.parts.pupilR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), pupilMat);
        this.parts.pupilR.position.set(0.15, 2.08, 0.42);

        // Mouth
        this.parts.mouth = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.02), this._mat('#c0392b'));
        this.parts.mouth.position.set(0, 1.85, 0.39);

        // Torso
        this.parts.torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.45), this._mat(this.colors.shirt));
        this.parts.torso.position.y = 1.2;
        this.parts.torso.castShadow = true;

        // Arms with pivot for animation
        // Left Arm
        this.pivots.leftArm = new THREE.Group();
        this.pivots.leftArm.position.set(-0.55, 1.65, 0);
        this.parts.leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.85, 0.3), this._mat(this.colors.shirt));
        this.parts.leftArm.position.y = -0.42;
        this.parts.leftArm.castShadow = true;
        // Left hand (skin colored end of arm)
        this.parts.leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.25), this._mat(this.colors.skin));
        this.parts.leftHand.position.y = -0.85;
        this.pivots.leftArm.add(this.parts.leftArm, this.parts.leftHand);

        // Right Arm
        this.pivots.rightArm = new THREE.Group();
        this.pivots.rightArm.position.set(0.55, 1.65, 0);
        this.parts.rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.85, 0.3), this._mat(this.colors.shirt));
        this.parts.rightArm.position.y = -0.42;
        this.parts.rightArm.castShadow = true;
        this.parts.rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.25), this._mat(this.colors.skin));
        this.parts.rightHand.position.y = -0.85;
        this.pivots.rightArm.add(this.parts.rightArm, this.parts.rightHand);

        // Legs with pivot
        // Left Leg
        this.pivots.leftLeg = new THREE.Group();
        this.pivots.leftLeg.position.set(-0.2, 0.75, 0);
        this.parts.leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.75, 0.35), this._mat(this.colors.pants));
        this.parts.leftLeg.position.y = -0.37;
        this.parts.leftLeg.castShadow = true;
        this.parts.leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.4), this._mat(this.colors.shoes));
        this.parts.leftShoe.position.set(0, -0.75, 0.03);
        this.pivots.leftLeg.add(this.parts.leftLeg, this.parts.leftShoe);

        // Right Leg
        this.pivots.rightLeg = new THREE.Group();
        this.pivots.rightLeg.position.set(0.2, 0.75, 0);
        this.parts.rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.75, 0.35), this._mat(this.colors.pants));
        this.parts.rightLeg.position.y = -0.37;
        this.parts.rightLeg.castShadow = true;
        this.parts.rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.4), this._mat(this.colors.shoes));
        this.parts.rightShoe.position.set(0, -0.75, 0.03);
        this.pivots.rightLeg.add(this.parts.rightLeg, this.parts.rightShoe);

        // Assemble
        this.group.add(
            this.parts.head, this.parts.hair,
            this.parts.eyeL, this.parts.eyeR,
            this.parts.pupilL, this.parts.pupilR,
            this.parts.mouth,
            this.parts.torso,
            this.pivots.leftArm, this.pivots.rightArm,
            this.pivots.leftLeg, this.pivots.rightLeg
        );

        this.group.traverse(c => { if (c.isMesh) c.castShadow = true; });
    }

    setColors(newColors) {
        Object.assign(this.colors, newColors);
        // Update materials
        this.parts.head.material.color.set(this.colors.skin);
        this.parts.hair.material.color.set(this.colors.hair);
        this.parts.torso.material.color.set(this.colors.shirt);
        this.parts.leftArm.material.color.set(this.colors.shirt);
        this.parts.rightArm.material.color.set(this.colors.shirt);
        this.parts.leftHand.material.color.set(this.colors.skin);
        this.parts.rightHand.material.color.set(this.colors.skin);
        this.parts.leftLeg.material.color.set(this.colors.pants);
        this.parts.rightLeg.material.color.set(this.colors.pants);
        this.parts.leftShoe.material.color.set(this.colors.shoes);
        this.parts.rightShoe.material.color.set(this.colors.shoes);
        this.parts.eyeL.material.color.set('#ffffff');
        this.parts.eyeR.material.color.set('#ffffff');
    }

    equipItem(slotId, itemId) {
        this.unequipItem(slotId);
        if (!itemId || !EQUIPMENT_DATA[itemId]) return;

        const data = EQUIPMENT_DATA[itemId];
        const mesh = data.build();
        mesh.name = 'equip_' + slotId;

        // Position based on slot
        switch (slotId) {
            case 'hat':
                mesh.position.set(0, 2.5, 0);
                this.group.add(mesh);
                break;
            case 'face':
                mesh.position.set(0, 2.1, 0.38);
                this.group.add(mesh);
                break;
            case 'back':
                mesh.position.set(0, 1.4, -0.35);
                this.group.add(mesh);
                break;
            case 'rightHand':
                mesh.position.set(0, -0.6, 0);
                this.pivots.rightArm.add(mesh);
                break;
            case 'leftHand':
                mesh.position.set(0, -0.6, 0);
                this.pivots.leftArm.add(mesh);
                break;
        }

        this.equipmentMeshes[slotId] = mesh;
        this.equipment[slotId] = itemId;
    }

    unequipItem(slotId) {
        if (this.equipmentMeshes[slotId]) {
            const mesh = this.equipmentMeshes[slotId];
            if (mesh.parent) mesh.parent.remove(mesh);
            mesh.traverse(c => { if (c.isMesh) { c.geometry.dispose(); c.material.dispose(); } });
            delete this.equipmentMeshes[slotId];
        }
        this.equipment[slotId] = '';
    }

    animate(dt, isMoving, isRunning) {
        this.animTime += dt;
        this.isMoving = isMoving;

        if (isMoving) {
            const speed = isRunning ? 12 : 8;
            const swing = Math.sin(this.animTime * speed) * 0.5;
            this.pivots.leftArm.rotation.x = swing;
            this.pivots.rightArm.rotation.x = -swing;
            this.pivots.leftLeg.rotation.x = -swing * 0.7;
            this.pivots.rightLeg.rotation.x = swing * 0.7;
        } else {
            // Idle breathing
            const breathe = Math.sin(this.animTime * 1.5) * 0.02;
            this.pivots.leftArm.rotation.x = THREE.MathUtils.lerp(this.pivots.leftArm.rotation.x, 0, 0.1);
            this.pivots.rightArm.rotation.x = THREE.MathUtils.lerp(this.pivots.rightArm.rotation.x, 0, 0.1);
            this.pivots.leftLeg.rotation.x = THREE.MathUtils.lerp(this.pivots.leftLeg.rotation.x, 0, 0.1);
            this.pivots.rightLeg.rotation.x = THREE.MathUtils.lerp(this.pivots.rightLeg.rotation.x, 0, 0.1);
            this.parts.torso.position.y = 1.2 + breathe;
            this.parts.head.position.y = 2.05 + breathe;
            this.parts.hair.position.y = 2.5 + breathe;
        }
    }

    getSerializable() {
        return { colors: { ...this.colors }, equipment: { ...this.equipment } };
    }

    loadFromData(data) {
        if (data.colors) this.setColors(data.colors);
        if (data.equipment) {
            for (const [slot, item] of Object.entries(data.equipment)) {
                if (item) this.equipItem(slot, item);
            }
        }
    }
}

// ============================================================
// SECTION 6: ISLAND GENERATOR
// ============================================================

class IslandGenerator {
    constructor(scene) {
        this.scene = scene;
        this.noise = createNoise(42);
        this.terrainMesh = null;
        this.waterMesh = null;
        this.heightData = [];
    }

    generate() {
        this._createSky();
        this._createTerrain();
        this._createWater();
        this._createVegetation();
        this._createLights();
    }

    _createSky() {
        const skyGeo = new THREE.SphereGeometry(500, 32, 32);
        const skyMat = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            uniforms: {
                topColor: { value: new THREE.Color(0x48CAE4) },
                bottomColor: { value: new THREE.Color(0x023E8A) },
                offset: { value: 20 },
                exponent: { value: 0.4 },
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPos.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
        });
        this.scene.add(new THREE.Mesh(skyGeo, skyMat));
    }

    _createTerrain() {
        const size = CONFIG.ISLAND_SIZE;
        const segs = CONFIG.ISLAND_SEGMENTS;
        const geo = new THREE.PlaneGeometry(size, size, segs, segs);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        this.heightData = new Array(pos.count);

        const half = size / 2;
        const maxR = CONFIG.ISLAND_RADIUS;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const dist = Math.sqrt(x * x + z * z);

            // Island falloff
            let falloff = Math.max(0, 1 - dist / maxR);
            falloff = Math.pow(falloff, 1.8);

            // Noise
            const n = fbm(this.noise, x * 0.015, z * 0.015, 5);
            const detail = fbm(this.noise, x * 0.05, z * 0.05, 3) * 0.3;
            let height = (n + detail) * CONFIG.MAX_HEIGHT * falloff;

            // Flatten near center for spawn area
            const spawnDist = Math.sqrt(x * x + z * z);
            if (spawnDist < 12) {
                const blend = Math.max(0, 1 - spawnDist / 12);
                height = THREE.MathUtils.lerp(height, 1.5, blend * blend);
            }

            height = Math.max(height, -0.5);
            pos.setY(i, height);
            this.heightData[i] = height;

            // Color by height
            const color = new THREE.Color();
            const h = height / CONFIG.MAX_HEIGHT;
            if (height < 0.2) {
                color.set(CONFIG.COLORS.sand);
            } else if (h < 0.08) {
                color.set(CONFIG.COLORS.sandDark);
            } else if (h < 0.2) {
                color.lerpColors(new THREE.Color(CONFIG.COLORS.sandDark), new THREE.Color(CONFIG.COLORS.grassLight), (h - 0.08) / 0.12);
            } else if (h < 0.5) {
                color.lerpColors(new THREE.Color(CONFIG.COLORS.grassLight), new THREE.Color(CONFIG.COLORS.grass), (h - 0.2) / 0.3);
            } else if (h < 0.75) {
                color.lerpColors(new THREE.Color(CONFIG.COLORS.grass), new THREE.Color(CONFIG.COLORS.rock), (h - 0.5) / 0.25);
            } else {
                color.lerpColors(new THREE.Color(CONFIG.COLORS.rock), new THREE.Color(CONFIG.COLORS.rockDark), (h - 0.75) / 0.25);
            }
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();

        const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
        this.terrainMesh = new THREE.Mesh(geo, mat);
        this.terrainMesh.receiveShadow = true;
        this.scene.add(this.terrainMesh);
    }

    _createWater() {
        const geo = new THREE.PlaneGeometry(CONFIG.ISLAND_SIZE * 3, CONFIG.ISLAND_SIZE * 3, 60, 60);
        geo.rotateX(-Math.PI / 2);
        const mat = new THREE.MeshPhongMaterial({
            color: CONFIG.COLORS.water,
            transparent: true,
            opacity: 0.75,
            shininess: 100,
            specular: 0x48CAE4,
        });
        this.waterMesh = new THREE.Mesh(geo, mat);
        this.waterMesh.position.y = CONFIG.WATER_LEVEL;
        this.waterMesh.receiveShadow = true;
        this.scene.add(this.waterMesh);
    }

    _createVegetation() {
        const treeCount = 80;
        const rockCount = 40;
        const flowerCount = 50;

        for (let i = 0; i < treeCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 10 + Math.random() * (CONFIG.ISLAND_RADIUS - 15);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const h = this.getTerrainHeight(x, z);
            if (h > 1.0 && h < 12) {
                this._addTree(x, h, z);
            }
        }

        for (let i = 0; i < rockCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * (CONFIG.ISLAND_RADIUS - 5);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const h = this.getTerrainHeight(x, z);
            if (h > 0.3) {
                this._addRock(x, h, z);
            }
        }

        for (let i = 0; i < flowerCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 8 + Math.random() * (CONFIG.ISLAND_RADIUS - 20);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const h = this.getTerrainHeight(x, z);
            if (h > 1.0 && h < 8) {
                this._addFlower(x, h, z);
            }
        }
    }

    _addTree(x, y, z) {
        const g = new THREE.Group();
        const trunkH = 1.5 + Math.random() * 2;
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.2, trunkH, 6),
            new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.trunk })
        );
        trunk.position.y = trunkH / 2;
        trunk.castShadow = true;

        // Palm-style: cone + sphere combo
        const isPalm = Math.random() > 0.4;
        if (isPalm) {
            // Curved trunk
            trunk.rotation.z = (Math.random() - 0.5) * 0.3;
            const leaves = new THREE.Mesh(
                new THREE.SphereGeometry(1.2 + Math.random() * 0.5, 6, 4),
                new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.leaves })
            );
            leaves.scale.y = 0.5;
            leaves.position.y = trunkH + 0.3;
            leaves.castShadow = true;
            g.add(trunk, leaves);
        } else {
            // Pine-style
            for (let layer = 0; layer < 3; layer++) {
                const coneR = 0.8 - layer * 0.2;
                const coneH = 1.2;
                const cone = new THREE.Mesh(
                    new THREE.ConeGeometry(coneR, coneH, 6),
                    new THREE.MeshLambertMaterial({ color: THREE.MathUtils.lerp(0x228B22, 0x1a6b1a, layer / 3) })
                );
                cone.position.y = trunkH + layer * 0.7;
                cone.castShadow = true;
                g.add(cone);
            }
            g.add(trunk);
        }

        g.position.set(x, y, z);
        g.rotation.y = Math.random() * Math.PI * 2;
        const s = 0.8 + Math.random() * 0.5;
        g.scale.set(s, s, s);
        this.scene.add(g);
    }

    _addRock(x, y, z) {
        const s = 0.3 + Math.random() * 0.8;
        const rock = new THREE.Mesh(
            new THREE.DodecahedronGeometry(s, 0),
            new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.rock })
        );
        rock.position.set(x, y + s * 0.3, z);
        rock.rotation.set(Math.random(), Math.random(), Math.random());
        rock.castShadow = true;
        this.scene.add(rock);
    }

    _addFlower(x, y, z) {
        const g = new THREE.Group();
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4),
            new THREE.MeshLambertMaterial({ color: 0x228B22 })
        );
        stem.position.y = 0.15;
        const flowerColors = [0xFF6B6B, 0xF4D35E, 0x9b59b6, 0xFF8C42, 0xE91E63, 0x00BCD4];
        const petal = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 6, 6),
            new THREE.MeshLambertMaterial({ color: flowerColors[Math.floor(Math.random() * flowerColors.length)] })
        );
        petal.position.y = 0.35;
        g.add(stem, petal);
        g.position.set(x, y, z);
        this.scene.add(g);
    }

    _createLights() {
        const hemi = new THREE.HemisphereLight(0x87CEEB, 0x2D6A4F, 0.6);
        this.scene.add(hemi);

        const sun = new THREE.DirectionalLight(0xfff4e6, 1.2);
        sun.position.set(50, 80, 30);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = -60;
        sun.shadow.camera.right = 60;
        sun.shadow.camera.top = 60;
        sun.shadow.camera.bottom = -60;
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 200;
        sun.shadow.bias = -0.001;
        this.scene.add(sun);

        const ambient = new THREE.AmbientLight(0x404060, 0.3);
        this.scene.add(ambient);
    }

    getTerrainHeight(x, z) {
        if (!this.terrainMesh) return 0;
        const ray = new THREE.Raycaster(
            new THREE.Vector3(x, 100, z),
            new THREE.Vector3(0, -1, 0)
        );
        const hits = ray.intersectObject(this.terrainMesh);
        return hits.length > 0 ? hits[0].point.y : 0;
    }

    animateWater(time) {
        if (!this.waterMesh) return;
        const pos = this.waterMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            pos.setY(i, Math.sin(x * 0.05 + time) * 0.3 + Math.cos(z * 0.05 + time * 0.7) * 0.2 + CONFIG.WATER_LEVEL);
        }
        pos.needsUpdate = true;
    }
}

// ============================================================
// SECTION 7: LETTER SYSTEM
// ============================================================

class LetterSystem {
    constructor(scene) {
        this.scene = scene;
        this.letters = []; // { mesh, letter, collected }
    }

    spawnLetters(word, getHeight) {
        this.clearAll();

        const allLetters = word.split('');
        // Add decoy letters
        const decoys = [];
        for (let i = 0; i < CONFIG.EXTRA_LETTERS_COUNT; i++) {
            let c;
            do { c = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]; }
            while (allLetters.includes(c) && decoys.includes(c));
            decoys.push(c);
        }

        const combined = [...allLetters, ...decoys];
        // Shuffle
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }

        combined.forEach((letter, idx) => {
            const angle = (idx / combined.length) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 15 + Math.random() * 45;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = getHeight(x, z) + CONFIG.LETTER_FLOAT_HEIGHT;

            if (y < 1) return; // Skip if underwater

            const mesh = this._createLetterMesh(letter);
            mesh.position.set(x, Math.max(y, 2.5), z);
            mesh.userData = { letter, baseY: Math.max(y, 2.5), idx };
            this.scene.add(mesh);

            // Glow light
            const light = new THREE.PointLight(CONFIG.COLORS.letterGlow, 0.6, 6);
            light.position.copy(mesh.position);
            this.scene.add(light);

            this.letters.push({ mesh, light, letter, collected: false });
        });
    }

    _createLetterMesh(letter) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Background glow
        const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(255, 214, 10, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 214, 10, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);

        // Letter
        ctx.fillStyle = '#FFD60A';
        ctx.font = 'bold 90px Outfit, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#FFD60A';
        ctx.shadowBlur = 15;
        ctx.fillText(letter, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshStandardMaterial({
            map: texture,
            emissive: CONFIG.COLORS.letterGlow,
            emissiveIntensity: 0.4,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
        });

        // Use a box for 3D feel
        const geo = new THREE.BoxGeometry(1.2, 1.2, 0.15);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        return mesh;
    }

    animate(time) {
        for (const entry of this.letters) {
            if (entry.collected) continue;
            const m = entry.mesh;
            m.position.y = m.userData.baseY + Math.sin(time * CONFIG.LETTER_BOB_SPEED + m.userData.idx) * CONFIG.LETTER_BOB_AMOUNT;
            m.rotation.y = time * CONFIG.LETTER_SPIN_SPEED;
            entry.light.position.copy(m.position);
        }
    }

    checkCollection(playerPos) {
        for (const entry of this.letters) {
            if (entry.collected) continue;
            const dist = playerPos.distanceTo(entry.mesh.position);
            if (dist < CONFIG.LETTER_COLLECT_DIST) {
                entry.collected = true;
                entry.mesh.visible = false;
                entry.light.visible = false;
                return entry.letter;
            }
        }
        return null;
    }

    getNearestDistance(playerPos) {
        let minDist = Infinity;
        for (const entry of this.letters) {
            if (entry.collected) continue;
            const dist = playerPos.distanceTo(entry.mesh.position);
            if (dist < minDist) minDist = dist;
        }
        return minDist;
    }

    clearAll() {
        for (const entry of this.letters) {
            this.scene.remove(entry.mesh);
            this.scene.remove(entry.light);
            entry.mesh.geometry.dispose();
            entry.mesh.material.dispose();
        }
        this.letters = [];
    }
}

// ============================================================
// SECTION 8: PARTICLE SYSTEM
// ============================================================

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    burst(position, color = 0xFFD60A, count = 20) {
        for (let i = 0; i < count; i++) {
            const geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.08, 4, 4);
            const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(position);

            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 6,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 6
            );

            this.scene.add(mesh);
            this.particles.push({ mesh, vel, life: 1.0, decay: 1.5 + Math.random() });
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vel.y -= 9.8 * dt;
            p.mesh.position.add(p.vel.clone().multiplyScalar(dt));
            p.life -= dt * p.decay;
            p.mesh.material.opacity = Math.max(0, p.life);
            p.mesh.scale.setScalar(Math.max(0.1, p.life));

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }
}

// ============================================================
// SECTION 9: BUILDING SYSTEM
// ============================================================

const BUILDING_BLUEPRINTS = {
    palm: { name: 'Pokok Kelapa', icon: '🌴', cat: 'nature', build: (s) => {
        const g = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 3, 6), new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.trunk }));
        trunk.position.y = 1.5; trunk.castShadow = true;
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.2, 6, 4), new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.leaves }));
        leaves.scale.y = 0.5; leaves.position.y = 3.3; leaves.castShadow = true;
        g.add(trunk, leaves); return g;
    }},
    flower: { name: 'Bunga', icon: '🌺', cat: 'nature', build: () => {
        const g = new THREE.Group();
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4), new THREE.MeshLambertMaterial({ color: 0x228B22 }));
        stem.position.y = 0.2;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), new THREE.MeshLambertMaterial({ color: 0xFF6B6B }));
        head.position.y = 0.45;
        g.add(stem, head); return g;
    }},
    hut: { name: 'Pondok', icon: '🏠', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 2), new THREE.MeshLambertMaterial({ color: 0xDEB887 }));
        base.position.y = 0.75; base.castShadow = true;
        const roof = new THREE.Mesh(new THREE.ConeGeometry(2, 1.2, 4), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        roof.position.y = 2.1; roof.rotation.y = Math.PI / 4; roof.castShadow = true;
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), new THREE.MeshLambertMaterial({ color: 0x654321 }));
        door.position.set(0, 0.4, 1.01);
        g.add(base, roof, door); return g;
    }},
    pond: { name: 'Kolam', icon: '🐟', cat: 'decoration', build: () => {
        const g = new THREE.Group();
        const water = new THREE.Mesh(new THREE.CircleGeometry(1, 16), new THREE.MeshPhongMaterial({ color: 0x0096C7, transparent: true, opacity: 0.7 }));
        water.rotation.x = -Math.PI / 2; water.position.y = 0.05;
        const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 8, 16), new THREE.MeshLambertMaterial({ color: 0x6c757d }));
        rim.rotation.x = -Math.PI / 2; rim.position.y = 0.1;
        g.add(water, rim); return g;
    }},
    lamp: { name: 'Lampu', icon: '💡', cat: 'decoration', build: () => {
        const g = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 6), new THREE.MeshLambertMaterial({ color: 0x333333 }));
        pole.position.y = 1;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD60A, emissive: 0xFFD60A, emissiveIntensity: 0.8 }));
        bulb.position.y = 2.1;
        const light = new THREE.PointLight(0xFFD60A, 0.5, 8);
        light.position.y = 2.1;
        g.add(pole, bulb, light); return g;
    }},
    garden: { name: 'Taman', icon: '🌳', cat: 'nature', build: () => {
        const g = new THREE.Group();
        for (let i = 0; i < 5; i++) {
            const bush = new THREE.Mesh(new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 6, 6), new THREE.MeshLambertMaterial({ color: 0x228B22 }));
            bush.position.set((Math.random() - 0.5) * 2, 0.3, (Math.random() - 0.5) * 2);
            bush.castShadow = true; g.add(bush);
        }
        return g;
    }},
    bridge: { name: 'Jambatan', icon: '🌉', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const deck = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 1.5), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        deck.position.y = 0.5; deck.castShadow = true;
        for (let i = 0; i < 5; i++) {
            const plank = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 1.5), new THREE.MeshLambertMaterial({ color: 0x654321 }));
            plank.position.set(-1.6 + i * 0.8, 0.8, 0); g.add(plank);
        }
        const rail1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 0.05), new THREE.MeshLambertMaterial({ color: 0x654321 }));
        rail1.position.set(0, 1.1, 0.7);
        const rail2 = rail1.clone(); rail2.position.z = -0.7;
        g.add(deck, rail1, rail2); return g;
    }},
    lighthouse: { name: 'Mercusuar', icon: '🗼', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 5, 8), new THREE.MeshLambertMaterial({ color: 0xecf0f1 }));
        tower.position.y = 2.5; tower.castShadow = true;
        const top = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 0.8, 8), new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
        top.position.y = 5.4;
        const light = new THREE.PointLight(0xFFD60A, 1, 20);
        light.position.y = 5.5;
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshStandardMaterial({ color: 0xFFD60A, emissive: 0xFFD60A, emissiveIntensity: 1 }));
        lamp.position.y = 5.5;
        g.add(tower, top, light, lamp); return g;
    }},
    dock: { name: 'Jeti', icon: '⚓', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const deck = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 2), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        deck.position.y = 0.8; deck.castShadow = true;
        for (let i = 0; i < 4; i++) {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6), new THREE.MeshLambertMaterial({ color: 0x654321 }));
            post.position.set(-1.8 + i * 1.2, 0.2, 0.9); g.add(post);
        }
        g.add(deck); return g;
    }},
    tree: { name: 'Pokok', icon: '🌲', cat: 'nature', build: () => {
        const g = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2, 6), new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.trunk }));
        trunk.position.y = 1; trunk.castShadow = true;
        for (let l = 0; l < 3; l++) {
            const cone = new THREE.Mesh(new THREE.ConeGeometry(0.7 - l * 0.15, 1, 6), new THREE.MeshLambertMaterial({ color: 0x228B22 }));
            cone.position.y = 2 + l * 0.6; cone.castShadow = true; g.add(cone);
        }
        g.add(trunk); return g;
    }},
    nest: { name: 'Sarang', icon: '🐦', cat: 'decoration', build: () => {
        const g = new THREE.Group();
        const nest = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 6, 12), new THREE.MeshLambertMaterial({ color: 0x8B6914 }));
        nest.rotation.x = -Math.PI / 2; nest.position.y = 0.1;
        const egg = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshLambertMaterial({ color: 0xecf0f1 }));
        egg.position.y = 0.15; egg.scale.y = 1.3;
        g.add(nest, egg); return g;
    }},
    umbrella: { name: 'Payung Pantai', icon: '⛱️', cat: 'decoration', build: () => {
        const g = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.5, 6), new THREE.MeshLambertMaterial({ color: 0xecf0f1 }));
        pole.position.y = 1.25;
        const top = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.5, 8), new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
        top.position.y = 2.5;
        g.add(pole, top); return g;
    }},
    gate: { name: 'Gerbang', icon: '🚪', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x6c757d });
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3, 0.4), mat);
        l.position.set(-1.2, 1.5, 0); l.castShadow = true;
        const r = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3, 0.4), mat);
        r.position.set(1.2, 1.5, 0); r.castShadow = true;
        const top = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.4), mat);
        top.position.y = 3.2; top.castShadow = true;
        g.add(l, r, top); return g;
    }},
    chest: { name: 'Peti Harta', icon: '💎', cat: 'special', build: () => {
        const g = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        base.position.y = 0.2;
        const lid = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.15, 0.52), new THREE.MeshLambertMaterial({ color: 0x654321 }));
        lid.position.y = 0.47;
        const lock = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), new THREE.MeshLambertMaterial({ color: 0xFFD700 }));
        lock.position.set(0, 0.35, 0.28);
        g.add(base, lid, lock); return g;
    }},
    boat: { name: 'Perahu', icon: '⛵', cat: 'special', build: () => {
        const g = new THREE.Group();
        const hull = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.8), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        hull.position.y = 0.2;
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2, 6), new THREE.MeshLambertMaterial({ color: 0x654321 }));
        mast.position.y = 1.4;
        const sail = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.5), new THREE.MeshLambertMaterial({ color: 0xecf0f1, side: THREE.DoubleSide }));
        sail.position.set(0.3, 1.5, 0);
        g.add(hull, mast, sail); return g;
    }},
    rocks: { name: 'Batu Besar', icon: '🪨', cat: 'nature', build: () => {
        const g = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.4, 0), new THREE.MeshLambertMaterial({ color: CONFIG.COLORS.rock }));
            r.position.set((Math.random() - 0.5) * 1, 0.3, (Math.random() - 0.5) * 1);
            r.rotation.set(Math.random(), Math.random(), Math.random());
            r.castShadow = true; g.add(r);
        }
        return g;
    }},
    statue: { name: 'Patung', icon: '🗿', cat: 'special', build: () => {
        const g = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), new THREE.MeshLambertMaterial({ color: 0x6c757d }));
        base.position.y = 0.15;
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.5, 8), new THREE.MeshLambertMaterial({ color: 0x95a5a6 }));
        body.position.y = 1.05;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshLambertMaterial({ color: 0x95a5a6 }));
        head.position.y = 2.05;
        g.add(base, body, head); return g;
    }},
    well: { name: 'Perigi', icon: '🪣', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 12, 1, true), new THREE.MeshLambertMaterial({ color: 0x6c757d, side: THREE.DoubleSide }));
        wall.position.y = 0.4;
        const water = new THREE.Mesh(new THREE.CircleGeometry(0.55, 12), new THREE.MeshPhongMaterial({ color: 0x0096C7, transparent: true, opacity: 0.6 }));
        water.rotation.x = -Math.PI / 2; water.position.y = 0.3;
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.6, 4), new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
        roof.position.y = 1.6; roof.rotation.y = Math.PI / 4;
        g.add(wall, water, roof); return g;
    }},
    fort: { name: 'Benteng', icon: '🏰', cat: 'structure', build: () => {
        const g = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x6c757d });
        // Walls
        const wall1 = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.3), mat);
        wall1.position.set(0, 1, 1.5); wall1.castShadow = true;
        const wall2 = wall1.clone(); wall2.position.z = -1.5;
        const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2, 3), mat);
        wall3.position.set(1.5, 1, 0); wall3.castShadow = true;
        const wall4 = wall3.clone(); wall4.position.x = -1.5;
        // Towers
        for (const [tx, tz] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) {
            const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 2.5, 8), mat);
            tower.position.set(tx, 1.25, tz); tower.castShadow = true; g.add(tower);
        }
        g.add(wall1, wall2, wall3, wall4); return g;
    }},
    fountain: { name: 'Air Pancut', icon: '⛲', cat: 'special', build: () => {
        const g = new THREE.Group();
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 0.4, 12), new THREE.MeshLambertMaterial({ color: 0x95a5a6 }));
        basin.position.y = 0.2;
        const water = new THREE.Mesh(new THREE.CircleGeometry(0.9, 12), new THREE.MeshPhongMaterial({ color: 0x0096C7, transparent: true, opacity: 0.6 }));
        water.rotation.x = -Math.PI / 2; water.position.y = 0.42;
        const center = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.2, 8), new THREE.MeshLambertMaterial({ color: 0x95a5a6 }));
        center.position.y = 1;
        const spout = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x48CAE4, transparent: true, opacity: 0.5 }));
        spout.position.y = 1.8;
        g.add(basin, water, center, spout); return g;
    }},
};

class BuildingSystem {
    constructor(scene, getHeight) {
        this.scene = scene;
        this.getHeight = getHeight;
        this.placedBuildings = []; // { id, x, z, rotation, mesh }
        this.previewMesh = null;
        this.selectedItem = null;
        this.rotation = 0;
        this.active = false;
    }

    setActive(active) {
        this.active = active;
        if (!active) this.clearPreview();
    }

    selectItem(itemId) {
        this.selectedItem = itemId;
        this.clearPreview();
    }

    clearPreview() {
        if (this.previewMesh) {
            this.scene.remove(this.previewMesh);
            this.previewMesh.traverse(c => { if (c.isMesh) { c.geometry.dispose(); c.material.dispose(); } });
            this.previewMesh = null;
        }
    }

    updatePreview(worldPos) {
        if (!this.active || !this.selectedItem) return;

        // Snap to grid
        const gridSize = CONFIG.BUILD_GRID_SIZE;
        const sx = Math.round(worldPos.x / gridSize) * gridSize;
        const sz = Math.round(worldPos.z / gridSize) * gridSize;
        const sy = this.getHeight(sx, sz);

        if (sy < 0.5) return; // Don't build in water

        this.clearPreview();

        const bp = BUILDING_BLUEPRINTS[this.selectedItem];
        if (!bp) return;

        this.previewMesh = bp.build();
        this.previewMesh.position.set(sx, sy, sz);
        this.previewMesh.rotation.y = this.rotation;
        this.previewMesh.traverse(c => {
            if (c.isMesh) {
                c.material = c.material.clone();
                c.material.transparent = true;
                c.material.opacity = 0.5;
            }
        });
        this.scene.add(this.previewMesh);
    }

    place(inventory) {
        if (!this.active || !this.selectedItem || !this.previewMesh) return false;

        // Check inventory
        const invItem = inventory.find(i => i.id === this.selectedItem && i.count > 0);
        if (!invItem) return false;

        const bp = BUILDING_BLUEPRINTS[this.selectedItem];
        const mesh = bp.build();
        mesh.position.copy(this.previewMesh.position);
        mesh.rotation.y = this.rotation;
        this.scene.add(mesh);

        this.placedBuildings.push({
            id: this.selectedItem,
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z,
            rotation: this.rotation,
            mesh
        });

        invItem.count--;
        this.clearPreview();
        return true;
    }

    rotate() {
        this.rotation += Math.PI / 4;
    }

    deleteNearest(playerPos) {
        let minDist = 5;
        let nearest = -1;
        for (let i = 0; i < this.placedBuildings.length; i++) {
            const b = this.placedBuildings[i];
            const dist = new THREE.Vector3(b.x, b.y, b.z).distanceTo(playerPos);
            if (dist < minDist) {
                minDist = dist;
                nearest = i;
            }
        }
        if (nearest >= 0) {
            const b = this.placedBuildings[nearest];
            this.scene.remove(b.mesh);
            b.mesh.traverse(c => { if (c.isMesh) { c.geometry.dispose(); c.material.dispose(); } });
            this.placedBuildings.splice(nearest, 1);
            return b.id;
        }
        return null;
    }

    loadBuildings(data) {
        for (const d of data) {
            const bp = BUILDING_BLUEPRINTS[d.id];
            if (!bp) continue;
            const mesh = bp.build();
            mesh.position.set(d.x, d.y, d.z);
            mesh.rotation.y = d.rotation || 0;
            this.scene.add(mesh);
            this.placedBuildings.push({ ...d, mesh });
        }
    }

    getSerializable() {
        return this.placedBuildings.map(b => ({ id: b.id, x: b.x, y: b.y, z: b.z, rotation: b.rotation }));
    }
}

// ============================================================
// SECTION 10: MOBILE CONTROLS
// ============================================================

class MobileControls {
    constructor() {
        this.isMobile = this._detectMobile();
        this.moveX = 0;
        this.moveY = 0;
        this.cameraX = 0;
        this.cameraY = 0;
        this.jumping = false;
        this.interacting = false;
        this._joystickActive = false;
        this._joystickId = null;
        this._cameraId = null;
        this._lastCameraPos = { x: 0, y: 0 };

        if (this.isMobile) this._setup();
    }

    _detectMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            ('ontouchstart' in window && window.innerWidth < 1200);
    }

    _setup() {
        document.getElementById('mobile-controls').style.display = 'block';

        // Try lock landscape
        try { screen.orientation?.lock?.('landscape').catch(() => {}); } catch (e) {}

        this._checkOrientation();
        window.addEventListener('resize', () => this._checkOrientation());
        window.addEventListener('orientationchange', () => setTimeout(() => this._checkOrientation(), 200));

        // Joystick
        const zone = document.getElementById('joystick-zone');
        const thumb = document.getElementById('joystick-thumb');
        const base = document.getElementById('joystick-base');

        zone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this._joystickActive = true;
            this._joystickId = touch.identifier;
            this._updateJoystick(touch, base, thumb);
        }, { passive: false });

        zone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.identifier === this._joystickId) {
                    this._updateJoystick(touch, base, thumb);
                }
            }
        }, { passive: false });

        const endJoystick = (e) => {
            for (const touch of e.changedTouches) {
                if (touch.identifier === this._joystickId) {
                    this._joystickActive = false;
                    this._joystickId = null;
                    this.moveX = 0;
                    this.moveY = 0;
                    thumb.style.transform = 'translate(0, 0)';
                }
            }
        };
        zone.addEventListener('touchend', endJoystick);
        zone.addEventListener('touchcancel', endJoystick);

        // Camera zone
        const cameraZone = document.getElementById('camera-zone');
        cameraZone.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this._cameraId = touch.identifier;
            this._lastCameraPos = { x: touch.clientX, y: touch.clientY };
        }, { passive: false });

        cameraZone.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.identifier === this._cameraId) {
                    this.cameraX = (touch.clientX - this._lastCameraPos.x) * CONFIG.TOUCH_SENSITIVITY;
                    this.cameraY = (touch.clientY - this._lastCameraPos.y) * CONFIG.TOUCH_SENSITIVITY;
                    this._lastCameraPos = { x: touch.clientX, y: touch.clientY };
                }
            }
        }, { passive: false });

        const endCamera = (e) => {
            for (const touch of e.changedTouches) {
                if (touch.identifier === this._cameraId) {
                    this._cameraId = null;
                    this.cameraX = 0;
                    this.cameraY = 0;
                }
            }
        };
        cameraZone.addEventListener('touchend', endCamera);
        cameraZone.addEventListener('touchcancel', endCamera);

        // Buttons
        const jumpBtn = document.getElementById('mobile-jump');
        jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.jumping = true; });
        jumpBtn.addEventListener('touchend', () => { this.jumping = false; });

        const interactBtn = document.getElementById('mobile-interact');
        interactBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.interacting = true; });
        interactBtn.addEventListener('touchend', () => { this.interacting = false; });

        // Top buttons
        document.getElementById('mobile-lookback').addEventListener('touchstart', (e) => {
            e.preventDefault();
            document.dispatchEvent(new CustomEvent('toggle-lookbehind'));
        });
        document.getElementById('mobile-build').addEventListener('touchstart', (e) => {
            e.preventDefault();
            document.dispatchEvent(new CustomEvent('toggle-build'));
        });
        document.getElementById('mobile-inventory').addEventListener('touchstart', (e) => {
            e.preventDefault();
            document.dispatchEvent(new CustomEvent('toggle-inventory'));
        });
    }

    _updateJoystick(touch, base, thumb) {
        const rect = base.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = touch.clientX - cx;
        let dy = touch.clientY - cy;
        const maxR = rect.width / 2 - 10;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxR) {
            dx = dx / dist * maxR;
            dy = dy / dist * maxR;
        }
        thumb.style.transform = `translate(${dx}px, ${dy}px)`;
        this.moveX = dx / maxR;
        this.moveY = -dy / maxR; // Invert Y
    }

    _checkOrientation() {
        const rotateMsg = document.getElementById('rotate-message');
        if (this.isMobile && window.innerHeight > window.innerWidth) {
            rotateMsg.style.display = 'flex';
        } else {
            rotateMsg.style.display = 'none';
        }
    }

    resetFrame() {
        this.cameraX = 0;
        this.cameraY = 0;
        this.interacting = false;
    }
}

// ============================================================
// SECTION 11: UI MANAGER
// ============================================================

class UIManager {
    constructor() {
        this.toastTimeout = null;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    updateScore(score) {
        document.getElementById('stat-score').textContent = score;
    }

    updateLetterCount(count) {
        document.getElementById('stat-letters').textContent = count;
    }

    updateBuildingCount(count) {
        document.getElementById('stat-buildings').textContent = count;
    }

    updateClue(puzzle, currentIndex, total) {
        document.getElementById('clue-category').textContent = puzzle.category;
        document.getElementById('clue-text').textContent = puzzle.clue;
        document.getElementById('clue-progress').textContent = `Perkataan ${currentIndex + 1} / ${total}`;
    }

    renderWordSlots(word, placedLetters) {
        const container = document.getElementById('word-slots');
        container.innerHTML = '';
        for (let i = 0; i < word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'word-slot' + (placedLetters[i] ? ' filled' : '');
            slot.textContent = placedLetters[i] || '';
            slot.dataset.index = i;
            slot.addEventListener('click', () => {
                if (placedLetters[i]) {
                    document.dispatchEvent(new CustomEvent('remove-letter', { detail: { index: i } }));
                }
            });
            container.appendChild(slot);
        }
    }

    renderCollectedLetters(letters) {
        const container = document.getElementById('collected-letters');
        container.innerHTML = '';
        letters.forEach((letter, idx) => {
            const el = document.createElement('div');
            el.className = 'collected-letter';
            el.textContent = letter;
            el.addEventListener('click', () => {
                document.dispatchEvent(new CustomEvent('place-letter', { detail: { letter, idx } }));
            });
            container.appendChild(el);
        });
    }

    showPuzzleComplete(puzzle, stars) {
        document.getElementById('complete-word').textContent = puzzle.word;
        document.getElementById('complete-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        document.getElementById('reward-item').textContent = `${puzzle.reward.icon} ${puzzle.reward.count}x ${puzzle.reward.name}`;
        document.getElementById('puzzle-complete').style.display = 'flex';
    }

    hidePuzzleComplete() {
        document.getElementById('puzzle-complete').style.display = 'none';
    }

    renderBuildItems(inventory, category) {
        const container = document.getElementById('build-items');
        container.innerHTML = '';
        const filtered = inventory.filter(i => {
            const bp = BUILDING_BLUEPRINTS[i.id];
            return bp && bp.cat === category && i.count > 0;
        });
        if (filtered.length === 0) {
            container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);font-size:0.8rem;">Tiada item</p>';
            return;
        }
        filtered.forEach(item => {
            const bp = BUILDING_BLUEPRINTS[item.id];
            const el = document.createElement('div');
            el.className = 'build-item';
            el.innerHTML = `
                <div class="build-item-icon">${bp.icon}</div>
                <div class="build-item-name">${bp.name}</div>
                <div class="build-item-count">x${item.count}</div>
            `;
            el.addEventListener('click', () => {
                container.querySelectorAll('.build-item').forEach(e => e.classList.remove('selected'));
                el.classList.add('selected');
                document.dispatchEvent(new CustomEvent('select-build-item', { detail: { id: item.id } }));
            });
            container.appendChild(el);
        });
    }

    renderInventory(inventory) {
        const container = document.getElementById('inventory-grid');
        container.innerHTML = '';
        const withItems = inventory.filter(i => i.count > 0);
        if (withItems.length === 0) {
            container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.4);">Inventori kosong</p>';
            return;
        }
        withItems.forEach(item => {
            const bp = BUILDING_BLUEPRINTS[item.id];
            if (!bp) return;
            const el = document.createElement('div');
            el.className = 'inventory-item';
            el.innerHTML = `
                <div class="inventory-item-icon">${bp.icon}</div>
                <div class="inventory-item-name">${bp.name}</div>
                <div class="inventory-item-count">x${item.count}</div>
            `;
            container.appendChild(el);
        });
    }

    setInteractPrompt(visible) {
        document.getElementById('interact-prompt').style.display = visible ? 'block' : 'none';
    }
}

// ============================================================
// SECTION 12: MAIN GAME
// ============================================================

class Game {
    constructor() {
        // Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Systems
        this.island = null;
        this.player = null;
        this.letterSystem = null;
        this.particles = null;
        this.building = null;
        this.mobile = null;
        this.ui = new UIManager();

        // State
        this.playerPos = new THREE.Vector3(0, 5, 0);
        this.playerVelocity = new THREE.Vector3();
        this.yaw = 0;
        this.pitch = 0;
        this.isOnGround = false;
        this.keys = {};
        this.isPointerLocked = false;

        // Game state
        this.score = 0;
        this.currentPuzzleIndex = 0;
        this.collectedLetters = [];
        this.placedLetters = [];
        this.inventory = [];
        this.completedPuzzles = [];
        this.puzzleStartTime = 0;
        this.buildMode = false;
        this.buildCategory = 'nature';
        this.lookBehind = false;

        // Raycaster for building
        this.raycaster = new THREE.Raycaster();
        this.mouseNDC = new THREE.Vector2();
    }

    async init() {
        this._updateLoadingBar(10, 'Menyediakan paparan 3D...');

        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(CONFIG.COLORS.fog, 60, 200);

        // Camera
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Renderer
        const canvas = document.getElementById('game-canvas');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        this._updateLoadingBar(30, 'Menjana pulau...');
        await this._delay(100);

        // Island
        this.island = new IslandGenerator(this.scene);
        this.island.generate();

        this._updateLoadingBar(60, 'Membina watak...');
        await this._delay(100);

        // Player
        this.player = new PlayerModel();
        this.scene.add(this.player.group);

        // Systems
        this.letterSystem = new LetterSystem(this.scene);
        this.particles = new ParticleSystem(this.scene);
        this.building = new BuildingSystem(this.scene, (x, z) => this.island.getTerrainHeight(x, z));
        this.mobile = new MobileControls();

        this._updateLoadingBar(80, 'Menyediakan teka-teki...');
        await this._delay(100);

        // Load save
        this._loadGame();

        // Init puzzle
        this._initPuzzle();

        // Init inventory if empty
        if (this.inventory.length === 0) {
            Object.keys(BUILDING_BLUEPRINTS).forEach(id => {
                this.inventory.push({ id, count: 0 });
            });
        }

        this._updateLoadingBar(100, 'Sedia!');
        await this._delay(400);

        // Setup events
        this._setupEvents();
        this._setupCustomizeUI();

        // Hide loading, show start screen
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'flex';
        this._createStartParticles();

        // Start render loop (runs behind start screen)
        this._gameLoop();

        // Auto-save
        setInterval(() => this._saveGame(), CONFIG.AUTO_SAVE_INTERVAL);
    }

    _delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    _updateLoadingBar(percent, text) {
        document.getElementById('loading-bar').style.width = percent + '%';
        document.getElementById('loading-text').textContent = text;
    }

    _createStartParticles() {
        const container = document.getElementById('start-particles');
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'start-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
            p.style.setProperty('--delay', (Math.random() * 4) + 's');
            container.appendChild(p);
        }
    }

    _setupEvents() {
        // Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyB') this._toggleBuildMode();
            if (e.code === 'KeyV') this._toggleLookBehind();
            if (e.code === 'Tab') { e.preventDefault(); this._toggleInventory(); }
            if (e.code === 'KeyR' && this.buildMode) this.building.rotate();
            if (e.code === 'KeyX' && this.buildMode) this._deleteBuild();
        });
        window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });

        // Mouse
        const canvas = document.getElementById('game-canvas');
        canvas.addEventListener('click', () => {
            if (!this.mobile.isMobile && !this.isPointerLocked) {
                canvas.requestPointerLock();
            }
            if (this.buildMode && this.isPointerLocked) {
                this._placeBuild();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === canvas;
            document.getElementById('crosshair').style.display = this.isPointerLocked ? 'block' : 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.yaw -= e.movementX * CONFIG.MOUSE_SENSITIVITY;
                this.pitch -= e.movementY * CONFIG.MOUSE_SENSITIVITY;
                this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch));
            }
        });

        document.addEventListener('wheel', (e) => {
            CONFIG.CAM_DISTANCE = Math.max(3, Math.min(15, CONFIG.CAM_DISTANCE + e.deltaY * 0.01));
        });

        // Mouse position for building
        window.addEventListener('mousemove', (e) => {
            this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Start button
        document.getElementById('btn-play').addEventListener('click', () => this._startGame());
        document.getElementById('btn-customize').addEventListener('click', () => {
            document.getElementById('customize-modal').style.display = 'flex';
        });
        document.getElementById('btn-how-to').addEventListener('click', () => {
            document.getElementById('how-to-modal').style.display = 'flex';
        });

        // Close modals
        document.getElementById('close-customize').addEventListener('click', () => {
            document.getElementById('customize-modal').style.display = 'none';
        });
        document.getElementById('close-inventory').addEventListener('click', () => {
            document.getElementById('inventory-modal').style.display = 'none';
        });

        // Puzzle complete
        document.getElementById('btn-next-puzzle').addEventListener('click', () => {
            this.ui.hidePuzzleComplete();
            this.currentPuzzleIndex++;
            if (this.currentPuzzleIndex >= PUZZLES.length) {
                this.currentPuzzleIndex = 0;
                this.ui.showToast('🎉 Semua teka-teki selesai! Bermula semula.', 'success');
            }
            this._initPuzzle();
        });

        // Hint
        document.getElementById('btn-hint').addEventListener('click', () => this._useHint());
        document.getElementById('btn-clear').addEventListener('click', () => this._clearPlaced());

        // Place / remove letter events
        document.addEventListener('place-letter', (e) => this._placeLetter(e.detail.letter, e.detail.idx));
        document.addEventListener('remove-letter', (e) => this._removePlacedLetter(e.detail.index));

        // Build events
        document.addEventListener('toggle-build', () => this._toggleBuildMode());
        document.addEventListener('toggle-inventory', () => this._toggleInventory());
        document.addEventListener('toggle-lookbehind', () => this._toggleLookBehind());
        document.addEventListener('select-build-item', (e) => {
            this.building.selectItem(e.detail.id);
        });

        // Build tabs
        document.querySelectorAll('.build-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.build-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.buildCategory = tab.dataset.cat;
                this.ui.renderBuildItems(this.inventory, this.buildCategory);
            });
        });

        // HUD buttons
        document.getElementById('hud-btn-build').addEventListener('click', () => this._toggleBuildMode());
        document.getElementById('hud-btn-inventory').addEventListener('click', () => this._toggleInventory());
        document.getElementById('hud-btn-lookback').addEventListener('click', () => this._toggleLookBehind());
        document.getElementById('hud-btn-customize').addEventListener('click', () => {
            document.getElementById('customize-modal').style.display = 'flex';
        });
    }

    _setupCustomizeUI() {
        // Color palettes
        const palettes = {
            'skin-colors': 'skin',
            'hair-colors': 'hair',
            'shirt-colors': 'shirt',
            'pants-colors': 'pants',
        };

        for (const [paletteId, colorKey] of Object.entries(palettes)) {
            const container = document.getElementById(paletteId);
            if (!container) continue;
            container.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.addEventListener('click', () => {
                    container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    const newColors = {};
                    newColors[colorKey] = swatch.dataset.color;
                    this.player.setColors(newColors);
                });
            });
        }

        // Equipment selects
        for (const slot of ['hat', 'face', 'back', 'rightHand', 'leftHand']) {
            const select = document.getElementById('equip-' + slot);
            if (!select) continue;
            select.addEventListener('change', () => {
                const val = select.value;
                if (val) {
                    this.player.equipItem(slot, val);
                } else {
                    this.player.unequipItem(slot);
                }
            });
        }
    }

    _startGame() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-hud').style.display = 'block';

        // Place player at spawn
        const spawnHeight = this.island.getTerrainHeight(0, 0);
        this.playerPos.set(0, spawnHeight + 2, 0);

        this.puzzleStartTime = Date.now();
        this.ui.showToast('🏝️ Selamat datang ke Pulau Kata!', 'info');
    }

    _initPuzzle() {
        const puzzle = PUZZLES[this.currentPuzzleIndex];
        this.collectedLetters = [];
        this.placedLetters = new Array(puzzle.word.length).fill('');
        this.puzzleStartTime = Date.now();

        this.ui.updateClue(puzzle, this.currentPuzzleIndex, PUZZLES.length);
        this.ui.renderWordSlots(puzzle.word, this.placedLetters);
        this.ui.renderCollectedLetters(this.collectedLetters);

        this.letterSystem.spawnLetters(puzzle.word, (x, z) => this.island.getTerrainHeight(x, z));
    }

    _collectLetter(letter) {
        this.collectedLetters.push(letter);
        this.ui.renderCollectedLetters(this.collectedLetters);
        this.ui.updateLetterCount(this.collectedLetters.length);
        this.ui.showToast(`🔤 Huruf "${letter}" dikutip!`, 'success');
        this.score += 10;
        this.ui.updateScore(this.score);

        // Particles
        this.particles.burst(this.playerPos.clone().add(new THREE.Vector3(0, 2, 0)), 0xFFD60A);
    }

    _placeLetter(letter, idx) {
        const puzzle = PUZZLES[this.currentPuzzleIndex];
        // Find first empty slot
        const emptySlot = this.placedLetters.indexOf('');
        if (emptySlot === -1) return;

        this.placedLetters[emptySlot] = letter;
        this.collectedLetters.splice(idx, 1);

        this.ui.renderWordSlots(puzzle.word, this.placedLetters);
        this.ui.renderCollectedLetters(this.collectedLetters);

        // Check if word complete
        if (!this.placedLetters.includes('')) {
            this._checkWord();
        }
    }

    _removePlacedLetter(index) {
        const letter = this.placedLetters[index];
        if (!letter) return;
        this.placedLetters[index] = '';
        this.collectedLetters.push(letter);

        const puzzle = PUZZLES[this.currentPuzzleIndex];
        this.ui.renderWordSlots(puzzle.word, this.placedLetters);
        this.ui.renderCollectedLetters(this.collectedLetters);
    }

    _clearPlaced() {
        const puzzle = PUZZLES[this.currentPuzzleIndex];
        for (let i = 0; i < this.placedLetters.length; i++) {
            if (this.placedLetters[i]) {
                this.collectedLetters.push(this.placedLetters[i]);
                this.placedLetters[i] = '';
            }
        }
        this.ui.renderWordSlots(puzzle.word, this.placedLetters);
        this.ui.renderCollectedLetters(this.collectedLetters);
    }

    _checkWord() {
        const puzzle = PUZZLES[this.currentPuzzleIndex];
        const attempt = this.placedLetters.join('');

        if (attempt === puzzle.word) {
            // Correct!
            const elapsed = (Date.now() - this.puzzleStartTime) / 1000;
            let stars = 3;
            if (elapsed > 120) stars = 1;
            else if (elapsed > 60) stars = 2;

            this.score += stars * 100;
            this.ui.updateScore(this.score);

            // Add reward to inventory
            const rewardId = puzzle.reward.id;
            const invItem = this.inventory.find(i => i.id === rewardId);
            if (invItem) {
                invItem.count += puzzle.reward.count;
            } else {
                this.inventory.push({ id: rewardId, count: puzzle.reward.count });
            }

            this.completedPuzzles.push(this.currentPuzzleIndex);

            // Celebration particles
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.particles.burst(
                        this.playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 3, (Math.random() - 0.5) * 4)),
                        [0xFFD60A, 0xFF6B6B, 0x2ecc71, 0x9b59b6][Math.floor(Math.random() * 4)],
                        30
                    );
                }, i * 200);
            }

            // Show complete modal
            setTimeout(() => {
                this.ui.showPuzzleComplete(puzzle, stars);
            }, 500);

            this.ui.showToast(`🎉 Betul! "${puzzle.word}" — +${stars * 100} mata!`, 'success');
            this._saveGame();
        } else {
            // Wrong
            this.ui.showToast('❌ Tidak betul, cuba lagi!', 'warning');
            // Shake animation
            document.querySelectorAll('.word-slot').forEach(s => {
                s.classList.add('wrong');
                setTimeout(() => s.classList.remove('wrong'), 500);
            });
        }
    }

    _useHint() {
        const puzzle = PUZZLES[this.currentPuzzleIndex];
        // Find first empty slot and reveal the correct letter
        for (let i = 0; i < puzzle.word.length; i++) {
            if (!this.placedLetters[i]) {
                const needed = puzzle.word[i];
                // Check if we have this letter collected
                const idx = this.collectedLetters.indexOf(needed);
                if (idx >= 0) {
                    this._placeLetter(needed, idx);
                } else {
                    // Just show hint
                    this.ui.showToast(`💡 Pembayang: Huruf ke-${i + 1} ialah "${needed}"`, 'info');
                }
                return;
            }
        }
    }

    _toggleBuildMode() {
        this.buildMode = !this.buildMode;
        this.building.setActive(this.buildMode);
        document.getElementById('build-panel').style.display = this.buildMode ? 'block' : 'none';
        if (this.buildMode) {
            this.ui.renderBuildItems(this.inventory, this.buildCategory);
            this.ui.showToast('🔨 Mod Pembinaan aktif', 'info');
        } else {
            this.ui.showToast('🔨 Mod Pembinaan ditutup', 'info');
        }
    }

    _toggleInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        } else {
            this.ui.renderInventory(this.inventory);
            modal.style.display = 'flex';
        }
    }

    _toggleLookBehind() {
        this.lookBehind = !this.lookBehind;
        this.ui.showToast(this.lookBehind ? '👁️ Pandangan belakang aktif' : '👁️ Pandangan depan aktif', 'info');
    }

    _placeBuild() {
        if (!this.buildMode) return;
        const placed = this.building.place(this.inventory);
        if (placed) {
            this.particles.burst(this.building.placedBuildings.at(-1).mesh.position.clone().add(new THREE.Vector3(0, 1, 0)), 0x2ecc71, 15);
            this.ui.showToast('✅ Item diletakkan!', 'success');
            this.ui.updateBuildingCount(this.building.placedBuildings.length);
            this.ui.renderBuildItems(this.inventory, this.buildCategory);
            this._saveGame();
        }
    }

    _deleteBuild() {
        const deleted = this.building.deleteNearest(this.playerPos);
        if (deleted) {
            const invItem = this.inventory.find(i => i.id === deleted);
            if (invItem) invItem.count++;
            this.ui.showToast('🗑️ Item dipadam', 'warning');
            this.ui.updateBuildingCount(this.building.placedBuildings.length);
            this.ui.renderBuildItems(this.inventory, this.buildCategory);
        }
    }

    // ====== GAME LOOP ======

    _gameLoop() {
        requestAnimationFrame(() => this._gameLoop());

        const dt = Math.min(this.clock.getDelta(), 0.05);
        const time = this.clock.elapsedTime;

        // Only update game if HUD is visible (game started)
        if (document.getElementById('game-hud').style.display !== 'none') {
            this._updateInput(dt);
            this._updatePlayer(dt);
            this._updateCamera();
            this._updateLetters(time);
            this._updateBuildPreview();
        }

        this.particles.update(dt);
        this.island.animateWater(time);
        this.player.animate(dt, this._isPlayerMoving(), this.keys['ShiftLeft']);

        this.renderer.render(this.scene, this.camera);
    }

    _isPlayerMoving() {
        if (this.mobile.isMobile) {
            return Math.abs(this.mobile.moveX) > 0.1 || Math.abs(this.mobile.moveY) > 0.1;
        }
        return this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD'] ||
               this.keys['ArrowUp'] || this.keys['ArrowDown'] || this.keys['ArrowLeft'] || this.keys['ArrowRight'];
    }

    _updateInput(dt) {
        // Mobile camera
        if (this.mobile.isMobile) {
            this.yaw -= this.mobile.cameraX;
            this.pitch -= this.mobile.cameraY;
            this.pitch = Math.max(-1.2, Math.min(1.2, this.pitch));
            this.mobile.resetFrame();
        }

        // Movement direction
        let moveX = 0, moveZ = 0;

        if (this.mobile.isMobile) {
            moveX = -this.mobile.moveX;
            moveZ = this.mobile.moveY;
        } else {
            if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ = 1;
            if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ = -1;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX = 1;
            if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX = -1;
        }

        // Calculate world direction
        const speed = (this.keys['ShiftLeft'] ? CONFIG.PLAYER_RUN_SPEED : CONFIG.PLAYER_SPEED);
        const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
        const right = new THREE.Vector3(-Math.cos(this.yaw), 0, Math.sin(this.yaw));

        const moveDir = new THREE.Vector3();
        moveDir.addScaledVector(forward, moveZ);
        moveDir.addScaledVector(right, moveX);
        if (moveDir.length() > 0) moveDir.normalize();

        this.playerVelocity.x = moveDir.x * speed;
        this.playerVelocity.z = moveDir.z * speed;

        // Jump
        const wantJump = this.keys['Space'] || this.mobile.jumping;
        if (wantJump && this.isOnGround) {
            this.playerVelocity.y = CONFIG.PLAYER_JUMP_FORCE;
            this.isOnGround = false;
        }

        // Interact (collect letter)
        const wantInteract = this.keys['KeyE'] || this.mobile.interacting;
        if (wantInteract) {
            const letter = this.letterSystem.checkCollection(this.playerPos);
            if (letter) {
                this._collectLetter(letter);
            }
        }
    }

    _updatePlayer(dt) {
        // Gravity
        this.playerVelocity.y -= CONFIG.GRAVITY * dt;

        // Move
        this.playerPos.x += this.playerVelocity.x * dt;
        this.playerPos.y += this.playerVelocity.y * dt;
        this.playerPos.z += this.playerVelocity.z * dt;

        // Terrain collision
        const terrainH = this.island.getTerrainHeight(this.playerPos.x, this.playerPos.z);
        const playerFeet = terrainH + 0.01;

        if (this.playerPos.y <= playerFeet) {
            this.playerPos.y = playerFeet;
            this.playerVelocity.y = 0;
            this.isOnGround = true;
        }

        // Keep within bounds
        const maxDist = CONFIG.ISLAND_SIZE * 0.45;
        const dist = Math.sqrt(this.playerPos.x ** 2 + this.playerPos.z ** 2);
        if (dist > maxDist) {
            this.playerPos.x *= maxDist / dist;
            this.playerPos.z *= maxDist / dist;
        }

        // Water check — push up if in water
        if (this.playerPos.y < CONFIG.WATER_LEVEL + 0.3) {
            this.playerPos.y = CONFIG.WATER_LEVEL + 0.3;
            this.playerVelocity.y = Math.max(0, this.playerVelocity.y);
            this.isOnGround = true;
        }

        // Update player model
        this.player.group.position.copy(this.playerPos);
        this.player.group.rotation.y = this.yaw + Math.PI;

        // Auto-collect letters on proximity
        const letter = this.letterSystem.checkCollection(this.playerPos);
        if (letter) this._collectLetter(letter);

        // Show interact prompt
        const nearDist = this.letterSystem.getNearestDistance(this.playerPos);
        this.ui.setInteractPrompt(nearDist < CONFIG.LETTER_COLLECT_DIST + 2);
    }

    _updateCamera() {
        const camYaw = this.lookBehind ? this.yaw + Math.PI : this.yaw;
        const offset = new THREE.Vector3(0, 0, 0);
        offset.x = Math.sin(camYaw) * Math.cos(this.pitch) * CONFIG.CAM_DISTANCE;
        offset.y = Math.sin(this.pitch) * CONFIG.CAM_DISTANCE + CONFIG.CAM_HEIGHT;
        offset.z = Math.cos(camYaw) * Math.cos(this.pitch) * CONFIG.CAM_DISTANCE;

        const targetPos = this.playerPos.clone().add(offset);

        // Ensure camera doesn't go below terrain
        const camTerrainH = this.island.getTerrainHeight(targetPos.x, targetPos.z);
        if (targetPos.y < camTerrainH + 1) {
            targetPos.y = camTerrainH + 1;
        }

        this.camera.position.lerp(targetPos, CONFIG.CAM_LERP + 0.05);

        const lookTarget = this.playerPos.clone();
        lookTarget.y += 2;
        this.camera.lookAt(lookTarget);
    }

    _updateLetters(time) {
        this.letterSystem.animate(time);
    }

    _updateBuildPreview() {
        if (!this.buildMode || !this.building.selectedItem) return;

        this.raycaster.setFromCamera(this.mouseNDC, this.camera);
        const hits = this.raycaster.intersectObject(this.island.terrainMesh);
        if (hits.length > 0) {
            this.building.updatePreview(hits[0].point);
        }
    }

    // ====== SAVE / LOAD ======

    _saveGame() {
        const data = {
            score: this.score,
            currentPuzzleIndex: this.currentPuzzleIndex,
            completedPuzzles: this.completedPuzzles,
            inventory: this.inventory,
            buildings: this.building.getSerializable(),
            playerPos: { x: this.playerPos.x, y: this.playerPos.y, z: this.playerPos.z },
            playerModel: this.player.getSerializable(),
        };
        try {
            localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Save failed:', e);
        }
    }

    _loadGame() {
        try {
            const raw = localStorage.getItem(CONFIG.SAVE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);

            this.score = data.score || 0;
            this.currentPuzzleIndex = data.currentPuzzleIndex || 0;
            this.completedPuzzles = data.completedPuzzles || [];
            this.inventory = data.inventory || [];
            if (data.playerPos) {
                this.playerPos.set(data.playerPos.x, data.playerPos.y, data.playerPos.z);
            }
            if (data.playerModel) {
                this.player.loadFromData(data.playerModel);
                // Sync UI
                this._syncCustomizeUI(data.playerModel);
            }
            if (data.buildings) {
                this.building.loadBuildings(data.buildings);
            }

            this.ui.updateScore(this.score);
            this.ui.updateBuildingCount(this.building.placedBuildings.length);
        } catch (e) {
            console.warn('Load failed:', e);
        }
    }

    _syncCustomizeUI(modelData) {
        // Sync color swatches
        if (modelData.colors) {
            for (const [key, paletteId] of [['skin', 'skin-colors'], ['hair', 'hair-colors'], ['shirt', 'shirt-colors'], ['pants', 'pants-colors']]) {
                const container = document.getElementById(paletteId);
                if (!container) continue;
                container.querySelectorAll('.color-swatch').forEach(s => {
                    s.classList.toggle('active', s.dataset.color === modelData.colors[key]);
                });
            }
        }
        // Sync equipment selects
        if (modelData.equipment) {
            for (const [slot, val] of Object.entries(modelData.equipment)) {
                const select = document.getElementById('equip-' + slot);
                if (select) select.value = val || '';
            }
        }
    }
}

// ============================================================
// SECTION 13: BOOTSTRAP
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init().catch(err => {
        console.error('Game init failed:', err);
        document.getElementById('loading-text').textContent = 'Ralat: ' + err.message;
    });
});
