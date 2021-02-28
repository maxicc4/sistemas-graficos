//const HELICOPTER_LENGTH = 2.5;
//const HELICOPTER_HEIGHT = 1;
const CABIN_LENGTH = 1.5;
const CABIN_WIDTH = 0.6;
const CABIN_HEIGHT = 0.65;
const NUMBER_OF_BLADES = 12;

const NUM_ROWS_GRID_TERRAIN = 200;
const NUM_COLS_GRID_TERRAIN = 200;
const PLOT_SIZE_TERRAIN = 150;

class Object3D {
    constructor(m, grid3D, children) {
        this.grid3D = grid3D;
        this.children = children;
        this.m = m;   // Matriz de modelado
        this.textures = [];
    }

    draw() {
        updateModelMatrix(this.m);
        setupVertexShaderMatrix();

        for (let ii = 0; ii < this.textures.length; ++ii) {
            gl.activeTexture(gl.TEXTURE0 + ii);
            gl.bindTexture(this.textures[ii].getTextureType(), this.textures[ii].getWebGLTexture());
            gl.uniform1i(gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "uSampler"+ii), ii);
        }

        if (this.grid3D != null) {
            this.grid3D.drawGeometry();
        }
        for (let i=0; i < this.children.length; i++) {
            this.children[i].draw();
        }
    }

    setM(m) {
        this.m = m;
    }

    addColor(color) {
        this.textures.push(Texture.createTextureFromColor(color));
    }

    addTexture(url) {
        this.textures.push(Texture.createTextureFromUrl(url));
    }

    addCubeMap(faceInfos) {
        this.textures.push(new CubeMap(faceInfos));
    }

    setPosition(p) {
        let m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, m, p);
        this.setM(m);
    }

    getPosition() {
        let pos = vec3.create();
        vec3.zero(pos);
        vec3.transformMat4(pos, pos, this.m);
        return pos;
    }

    translate(vec) {
        let newM = mat4.create();
        mat4.translate(newM, this.m, vec);
        this.setM(newM);
    }
}

class HelicopterContainer extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Helicopter(m));
        children.push(new SkySphere(m));
        super(m, null, children);
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.setM(m);
        this.addColor([235,217,204,255]);
    }

    setM(m) {
        let mHelicopterController = mat4.create();
        mat4.rotate(mHelicopterController, m, this.yaw, [0, 1, 0]);
        super.setM(mHelicopterController);

        let mHelicopter = mat4.create();
        mat4.rotate(mHelicopter, mHelicopterController, this.pitch, [0, 0, 1]);
        mat4.rotate(mHelicopter, mHelicopter, this.roll, [1, 0, 0]);
        this.children[0].setM(mHelicopter);

        // Para que la esfera no se levante
        let pos = this.getPosition();
        pos[1] = 0;
        this.children[1].setPosition(pos);
    }

    setYaw(yaw) {
        this.yaw = yaw;
    }

    setPitch(pitch) {
        this.pitch = pitch;
    }

    setRoll(roll) {
        this.roll = roll;
        this.children[0].setRoll(roll);
    }

    getDirection(direction) {
        let pos;
        switch (direction) {
            case 'rear':
                pos = vec3.fromValues(-1, 0, 0);
                break;
            case 'rightSide':
                pos = vec3.fromValues(0, 0, 1);
                break;
            case 'upper':
                pos = vec3.fromValues(0, 1, 0);
                break;
        }
        vec3.transformMat4(pos, pos, this.m);
        vec3.subtract(pos, pos, this.getPosition());
        vec3.normalize(pos, pos);
        return pos;
    }

    setBladeRotation(rotation) {
        this.children[0].setBladeRotation(rotation);
    }

    setPropellerRotation(rotation) {
        this.children[0].setPropellerRotation(rotation);
    }

    setArmAngle(angle) {
        this.children[0].setArmAngle(angle);
    }
}

class Helicopter extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new RotorArm(m));
        children.push(new RotorArm(m));
        children.push(new RotorArm(m));
        children.push(new RotorArm(m));
        children.push(new Tail(m));
        children.push(new Skid(m));
        children.push(new Skid(m));
        super(m, new Grid3D(new Cabin(CABIN_LENGTH, CABIN_HEIGHT, CABIN_WIDTH), 20, 40), children);
        this.setM(m);
        this.armAngle = 0;
        this.addTexture("img/cabina.png");
    }

    setM(m) {
        let mHelicopter = mat4.create();
        // lo roto para que coincida en orientacion con los movimientos (en helicopterController)
        mat4.rotate(mHelicopter, m, Math.PI, [0,1,0]);
        super.setM(mHelicopter);
        let mRotorArm1 = mat4.create();
        mat4.translate(mRotorArm1, mHelicopter, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm1, mRotorArm1, this.armAngle, [-1,0,0]);
        this.children[0].setM(mRotorArm1);
        let mRotorArm2 = mat4.create();
        mat4.translate(mRotorArm2, mHelicopter, [CABIN_LENGTH/4,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm2, mRotorArm2, this.armAngle, [-1,0,0]);
        this.children[1].setM(mRotorArm2);
        let mRotorArm3 = mat4.create();
        mat4.translate(mRotorArm3, mHelicopter, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),-CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm3, mRotorArm3, Math.PI, [0,1,0]);
        mat4.rotate(mRotorArm3, mRotorArm3, this.armAngle, [-1,0,0]);
        this.children[2].setM(mRotorArm3);
        let mRotorArm4 = mat4.create();
        mat4.translate(mRotorArm4, mHelicopter, [CABIN_LENGTH/4,(CABIN_HEIGHT/3),-CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm4, mRotorArm4, Math.PI, [0,1,0]);
        mat4.rotate(mRotorArm4, mRotorArm4, this.armAngle, [-1,0,0]);
        this.children[3].setM(mRotorArm4);

        let mTail = mat4.create();
        mat4.translate(mTail, mHelicopter, [CABIN_LENGTH*0.45,CABIN_HEIGHT/4,0]);
        this.children[4].setM(mTail);

        let mSkid1 = mat4.create();
        mat4.translate(mSkid1, mHelicopter, [-CABIN_LENGTH*0.09,-CABIN_HEIGHT*0.75,CABIN_WIDTH*0.4]);
        mat4.rotate(mSkid1, mSkid1, Math.PI/2, [0,0,-1]);
        this.children[5].setM(mSkid1);
        let mSkid2 = mat4.create();
        mat4.translate(mSkid2, mHelicopter, [-CABIN_LENGTH*0.09,-CABIN_HEIGHT*0.75,-CABIN_WIDTH*0.4]);
        mat4.rotate(mSkid2, mSkid2, Math.PI, [0,1,0]);
        mat4.rotate(mSkid2, mSkid2, Math.PI/2, [0,0,-1]);
        this.children[6].setM(mSkid2);
    }

    setRoll(roll) {
        this.children[4].setRoll(roll);
    }

    setBladeRotation(rotation) {
        for (let i=0; i<4; i++) {
            this.children[i].setBladeRotation(rotation);
        }
    }

    setPropellerRotation(rotation) {
        this.children[0].setPropellerRotation(rotation);
        this.children[1].setPropellerRotation(rotation);
        this.children[2].setPropellerRotation(-rotation);
        this.children[3].setPropellerRotation(- rotation);
    }

    setArmAngle(angle) {
        this.armAngle = angle;
    }
}

class RotorArm extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Arm(m));
        // cilindro que forma el rotor
        super(m, new Grid3D(new Cylinder(CABIN_WIDTH*0.13, CABIN_LENGTH/5, true), 16, 20), children);
        this.setM(m);
        this.addColor([51,51,51,255]);
    }

    setM(m) {
        let m1 = mat4.create();
        mat4.rotate(m1, m, -Math.PI/2, [0,0,1]);
        super.setM(m1);
        this.children[0].setM(m1);
    }

    setBladeRotation(rotation) {
        this.children[0].setBladeRotation(rotation);
    }

    setPropellerRotation(rotation) {
        this.children[0].setPropellerRotation(rotation);
    }
}

class Arm extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Propeller(m));
        super(m, new Grid3D(new ArmSurface(CABIN_WIDTH*0.67, CABIN_LENGTH*0.09, CABIN_LENGTH*0.045), 16, 20), children);
        this.setM(m);
        this.addColor([235,217,204,255]);
    }

    setM(m) {
        super.setM(m);
        let mPropeller = mat4.create();
        mat4.translate(mPropeller, m, [0,0,CABIN_WIDTH*0.97]);
        mat4.rotate(mPropeller, mPropeller, Math.PI/2, [0,0,1]);
        this.children[0].setM(mPropeller);
    }

    setBladeRotation(rotation) {
        this.children[0].setBladeRotation(rotation);
    }

    setPropellerRotation(rotation) {
        this.children[0].setPropellerRotation(rotation);
    }
}

class Propeller extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new PropellerShaft(m));
        super(m, new Grid3D(new Ring(CABIN_WIDTH*0.3, CABIN_WIDTH*0.375, CABIN_WIDTH*0.2), 16, 20), children);
        this.setM(m);
        this.addColor([204,59,41,255]);
        this.propellerRotation = 0;
    }

    setM(m) {
        let mPropeller = mat4.create();
        mat4.rotate(mPropeller, m, this.propellerRotation, [0,0,1]);
        super.setM(mPropeller);
        this.children[0].setM(mPropeller);
    }

    setBladeRotation(rotation) {
        this.children[0].setBladeRotation(rotation);
    }

    setPropellerRotation(rotation) {
        this.propellerRotation = rotation;
        while (this.propellerRotation > 0.5*Math.PI) {
            this.propellerRotation = 0.5*Math.PI;
        }
        while (this.propellerRotation < -0.5*Math.PI) {
            this.propellerRotation = -0.5*Math.PI;
        }
    }
}

class PropellerShaft extends Object3D {
    constructor(m) {
        let children = [];
        for (let i=0; i<NUMBER_OF_BLADES; i++) {
            children.push(new Blade(m));
        }
        super(m, new Grid3D(new Cylinder(CABIN_LENGTH*0.025, CABIN_WIDTH*0.24, true), 16, 20), children);
        this.setM(m);
        this.bladeRotation = 0;
        this.addColor([235,217,204,255]);
    }

    setM(m) {
        let mRotationBlades = mat4.create();
        mat4.rotate(mRotationBlades, m, this.bladeRotation, [0,1,0]);
        super.setM(mRotationBlades);
        let mBlade = mat4.create();
        let rad = 2*Math.PI/NUMBER_OF_BLADES;
        for (let i=0; i<NUMBER_OF_BLADES; i++) {
            mat4.rotate(mBlade, mRotationBlades, rad*i, [0,1,0]);
            this.children[i].setM(mBlade);
        }
    }

    setBladeRotation(rotation) {
        this.bladeRotation += rotation;
        while (this.bladeRotation >= 2*Math.PI) {
            this.bladeRotation -= 2*Math.PI;
        }
        while (this.bladeRotation <= -2*Math.PI) {
            this.bladeRotation += 2*Math.PI;
        }
    }
}

class Blade extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new BladeSurface(CABIN_WIDTH*0.025, CABIN_WIDTH*0.2, CABIN_WIDTH*0.3), 16, 20), children);
        this.setM(m);
        this.addColor([153,153,153,255]);
    }

    setM(m) {
        let m1 = mat4.create();
        mat4.rotate(m1, m, Math.PI/2, [1,0,0]);
        mat4.rotate(m1, m1, Math.PI/4, [0,1,0]);
        super.setM(m1);
    }
}

class Tail extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new TailTieRod(m));
        children.push(new TailTieRod(m));
        children.push(new TailCylinder(m));
        super(m, null, children);
        this.setM(m);
        this.addColor([235,217,204,255]);
    }

    setM(m) {
        super.setM(m);
        let mTailTieRod1 = mat4.create();
        mat4.translate(mTailTieRod1, m, [0,0,CABIN_WIDTH/5]);
        this.children[0].setM(mTailTieRod1);
        let mTailTieRod2 = mat4.create();
        mat4.translate(mTailTieRod2, m, [0,0,-CABIN_WIDTH/5]);
        this.children[1].setM(mTailTieRod2);
        let mTailCylinder = mat4.create();
        mat4.translate(mTailCylinder, m, [CABIN_LENGTH/2,-CABIN_HEIGHT/32,0]);
        mat4.rotate(mTailCylinder, mTailCylinder, Math.PI/2, [1,0,0]);
        this.children[2].setM(mTailCylinder);
    }

    setRoll(roll) {
        this.children[2].setRoll(roll);
    }
}

class TailTieRod extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new TailTieRodSurface(CABIN_HEIGHT/4, CABIN_HEIGHT/16, CABIN_LENGTH/2, CABIN_WIDTH/32), 16, 20), children);
        this.setM(m);
        this.addColor([235,217,204,255]);
    }

    setM(m) {
        super.setM(m);
    }
}

class TailCylinder extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Fin(m));
        children.push(new Fin(m));
        super(m, new Grid3D(new Cylinder(CABIN_LENGTH*0.015, CABIN_WIDTH*0.6, true), 16, 20), children);
        this.setM(m);
        this.roll = 0;
        this.addColor([235,217,204,255]);
    }

    setM(m) {
        super.setM(m);
        let mFin1 = mat4.create();
        mat4.translate(mFin1, m, [-CABIN_LENGTH*0.015,CABIN_WIDTH*0.3,0]);
        mat4.rotate(mFin1, mFin1, this.roll, [0,0,1]);
        mat4.rotate(mFin1, mFin1, Math.PI/2, [-1,0,0]);
        this.children[0].setM(mFin1);
        let mFin2 = mat4.create();
        mat4.translate(mFin2, m, [-CABIN_LENGTH*0.015,-CABIN_WIDTH*0.3,0]);
        mat4.rotate(mFin2, mFin2, this.roll, [0,0,1]);
        mat4.rotate(mFin2, mFin2, Math.PI/2, [-1,0,0]);
        this.children[1].setM(mFin2);
    }

    setRoll(roll) {
        this.roll = roll*0.8;
    }
}

// aleta de la cola
class Fin extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new FinSurface(CABIN_WIDTH*0.48, CABIN_HEIGHT, CABIN_WIDTH/32), 16, 20), children);
        this.setM(m);
        this.addColor([204,59,41,255]);
    }

    setM(m) {
        super.setM(m);
    }
}

class Skid extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new SkidCylinder(m));
        children.push(new SkidCylinder(m));
        super(m, new Grid3D(new SkidSurface(CABIN_LENGTH*0.6, CABIN_LENGTH*0.015), 16, 20), children);
        this.setM(m);
        this.addColor([127,127,127,255]);
    }

    setM(m) {
        super.setM(m);
        let mSkidCylinder1 = mat4.create();
        mat4.translate(mSkidCylinder1, m, [-CABIN_HEIGHT/6,-CABIN_HEIGHT*0.28,-Math.cos(Math.PI*0.4)*CABIN_HEIGHT/6]);
        mat4.rotate(mSkidCylinder1, mSkidCylinder1, Math.PI*0.1, [0,-1,0]);
        mat4.rotate(mSkidCylinder1, mSkidCylinder1, Math.PI/2, [0,0,1]);
        this.children[0].setM(mSkidCylinder1);

        let mSkidCylinder2 = mat4.create();
        mat4.translate(mSkidCylinder2, m, [-CABIN_HEIGHT/6,CABIN_HEIGHT*0.33,-Math.cos(Math.PI*0.4)*CABIN_HEIGHT/6]);
        mat4.rotate(mSkidCylinder2, mSkidCylinder2, Math.PI*0.1, [0,-1,0]);
        mat4.rotate(mSkidCylinder2, mSkidCylinder2, Math.PI/2, [0,0,1]);
        this.children[1].setM(mSkidCylinder2);
    }
}

class SkidCylinder extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new Cylinder(CABIN_LENGTH*0.015, CABIN_HEIGHT/3, false), 16, 20), children);
        this.setM(m);
        this.addColor([51,51,51,255]);
    }
}

class Terrain extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new WaterPlane(m));
        super(
            m,
            new Grid3D(
                new Plane(PLOT_SIZE_TERRAIN*3, PLOT_SIZE_TERRAIN*3),
                NUM_ROWS_GRID_TERRAIN,
                NUM_COLS_GRID_TERRAIN
            ),
            children
        );
        this.setM(m);
        this.offsetUV = vec2.fromValues(0.625,0.375);
        this.addTexture("img/heightmap.png");
        this.addTexture("img/arena.jpg");
        this.addTexture("img/pasto.jpg");
        this.addTexture("img/tierra1.jpg");
        this.addTexture("img/tierra2.jpg");
        this.addTexture("img/tierra3.jpg");
        this.addTexture("img/roca.jpg");
        this.addTexture("img/musgo.jpg");
        this.calculateScaleUV();
    }

    draw() {
        gl.useProgram(glProgramTerrain);
        gl.uniform2fv(gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "uOffsetUV"), this.offsetUV);
        gl.uniform1f(gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "uScaleUV"), this.scaleUV);
        super.draw();
        gl.useProgram(glProgram);
    }

    calculateScaleUV() {
        this.numberOfPlots = 16;
        this.plotSizeUV = 1 / this.numberOfPlots;
        this.scaleUV = this.plotSizeUV * 3;
    }

    getPlotSizeInWorld() {
        return PLOT_SIZE_TERRAIN;
    }

    increaseOffsetU() {
        this.offsetUV[0] = this.offsetUV[0] + this.plotSizeUV;
        if (this.offsetUV[0] >= 1) {
            this.offsetUV[0] = 0;
        }
        this.children[0].increaseOffsetU();
        console.log(this.offsetUV);
    }
    decreaseOffsetU() {
        this.offsetUV[0] = this.offsetUV[0] - this.plotSizeUV;
        if (this.offsetUV[0] < 0) {
            this.offsetUV[0] = 1;
        }
        this.children[0].decreaseOffsetU();
        console.log(this.offsetUV);
    }
    increaseOffsetV() {
        this.offsetUV[1] = this.offsetUV[1] + this.plotSizeUV;
        if (this.offsetUV[1] >= 1) {
            this.offsetUV[1] = 0;
        }
        this.children[0].increaseOffsetV();
        console.log(this.offsetUV);
    }
    decreaseOffsetV() {
        this.offsetUV[1] = this.offsetUV[1] - this.plotSizeUV;
        if (this.offsetUV[1] < 0) {
            this.offsetUV[1] = 1;
        }
        this.children[0].decreaseOffsetV();
        console.log(this.offsetUV);
    }

    setM(m) {
        super.setM(m);
        let mWaterPlane = mat4.create();
        mat4.translate(mWaterPlane, m, [0, 0.8, 0]);
        this.children[0].setM(mWaterPlane);
    }
}

class SkySphere extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new SphereSurface(PLOT_SIZE_TERRAIN), 50, 50), children);
        this.setM(m);
        this.addTexture('img/cielo.jpg');
    }

    draw() {
        gl.useProgram(glProgramSky);
        super.draw();
        gl.useProgram(glProgram);
    }
}

class Heliport extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new BoxSurface(CABIN_LENGTH*4, CABIN_LENGTH*4, CABIN_WIDTH*0.2), 8, 4), children);
        this.setM(m);
        this.addTexture("img/helipad.jpg");
    }
}

class WaterPlane extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new Plane(PLOT_SIZE_TERRAIN*3, PLOT_SIZE_TERRAIN*3), 20,20), children);
        this.setM(m);
        this.addTexture("img/agua.jpg");
        this.offsetUV = vec2.fromValues(0.0,0.0);
    }

    draw() {
        gl.useProgram(glProgramWater);
        gl.uniform2fv(gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "uOffsetUV"), this.offsetUV);
        super.draw();
        gl.useProgram(glProgramTerrain);
    }

    increaseOffsetU() {
        this.offsetUV[0] = this.offsetUV[0] + 0.333;
        if (this.offsetUV[0] >= 0.999) {
            this.offsetUV[0] = 0;
        }
    }
    decreaseOffsetU() {
        this.offsetUV[0] = this.offsetUV[0] - 0.333;
        if (this.offsetUV[0] < 0) {
            this.offsetUV[0] = 1;
        }
    }
    increaseOffsetV() {
        this.offsetUV[1] = this.offsetUV[1] + 0.333;
        if (this.offsetUV[1] >= 0.999) {
            this.offsetUV[1] = 0;
        }
    }
    decreaseOffsetV() {
        this.offsetUV[1] = this.offsetUV[1] - 0.333;
        if (this.offsetUV[1] < 0) {
            this.offsetUV[1] = 1;
        }
    }
}