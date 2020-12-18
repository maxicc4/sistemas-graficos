//const HELICOPTER_LENGTH = 2.5;
//const HELICOPTER_HEIGHT = 1;
const CABIN_LENGTH = 1.5;
const CABIN_WIDTH = 0.6;
const CABIN_HEIGHT = 0.65;
const NUMBER_OF_BLADES = 12;

class Object3D {
    constructor(m, grid3D, children) {
        this.grid3D = grid3D;
        this.children = children;
        this.m = m;   // Matriz de modelado
        this.color = [0.92,0.85,0.80];
    }

    draw() {
        updateModelMatrix(this.m);
        setupVertexShaderMatrix();
        let colorUniform  = gl.getUniformLocation(glProgram, "uColor");
        gl.uniform3fv(colorUniform, this.color);
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

    setColor(color) {
        this.color = color;
    }

    setPosition(p) {
        let m = mat4.create();
        mat4.identity(m);
        mat4.translate(m, m, p);
        this.setM(m);
    }

    getPosition() {
        let pos = vec3.create();
        vec3.transformMat4(pos, vec3.fromValues(0,0,0), this.m);
        return pos;
    }
}

class HelicopterContainer extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Helicopter(m));
        super(m, null, children);
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.setM(m);
    }

    setM(m) {
        let mHelicopterController = mat4.create();
        mat4.rotate(mHelicopterController, m, this.yaw, [0, 1, 0]);
        super.setM(mHelicopterController);

        let mHelicopter = mat4.create();
        mat4.rotate(mHelicopter, mHelicopterController, this.pitch, [0, 0, 1]);
        mat4.rotate(mHelicopter, mHelicopter, this.roll, [1, 0, 0]);
        this.children[0].setM(mHelicopter);
        console.log(this.yaw);
        console.log(this.pitch);
        console.log(this.roll);
    }

    setYaw(yaw) {
        this.yaw = yaw;
    }

    setPitch(pitch) {
        this.pitch = pitch;
    }

    setRoll(roll) {
        this.roll = roll;
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
    }

    setM(m) {
        let mHelicopter = mat4.create();
        // lo roto para que coincida en orientacion con los movimientos (en helicopterController)
        mat4.rotate(mHelicopter, m, Math.PI, [0,1,0]);
        super.setM(mHelicopter);
        let mRotorArm1 = mat4.create();
        mat4.translate(mRotorArm1, mHelicopter, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        this.children[0].setM(mRotorArm1);
        let mRotorArm2 = mat4.create();
        mat4.translate(mRotorArm2, mHelicopter, [CABIN_LENGTH/4,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        this.children[1].setM(mRotorArm2);
        let mRotorArm3 = mat4.create();
        mat4.translate(mRotorArm3, mHelicopter, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),-CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm3, mRotorArm3, Math.PI, [0,1,0]);
        this.children[2].setM(mRotorArm3);
        let mRotorArm4 = mat4.create();
        mat4.translate(mRotorArm4, mHelicopter, [CABIN_LENGTH/4,(CABIN_HEIGHT/3),-CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm4, mRotorArm4, Math.PI, [0,1,0]);
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
}

class RotorArm extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Arm(m));
        // cilindro que forma el rotor
        super(m, new Grid3D(new Cylinder(CABIN_WIDTH*0.13, CABIN_LENGTH/5, true), 16, 20), children);
        this.setM(m);
        this.setColor([0.2,0.2,0.2]);
    }

    setM(m) {
        let m1 = mat4.create();
        mat4.rotate(m1, m, -Math.PI/2, [0,0,1]);
        super.setM(m1);
        let mArm = mat4.create();
        //mat4.translate(mArm, m1, [0,0,CABIN_WIDTH/2]);
        //mat4.scale(m1, m1, [0.25,0.25,0.25]);
        this.children[0].setM(m1);
    }
}

class Arm extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new Propeller(m));
        super(m, new Grid3D(new ArmSurface(CABIN_WIDTH*0.67, CABIN_LENGTH*0.09, CABIN_LENGTH*0.045), 16, 20), children);
        this.setM(m);
    }

    setM(m) {
        super.setM(m);
        let mPropeller = mat4.create();
        mat4.translate(mPropeller, m, [0,0,CABIN_WIDTH*0.97]);
        mat4.rotate(mPropeller, mPropeller, Math.PI/2, [0,0,1]);
        this.children[0].setM(mPropeller);
    }
}

class Propeller extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new PropellerShaft(m));
        super(m, new Grid3D(new Ring(CABIN_WIDTH*0.3, CABIN_WIDTH*0.375, CABIN_WIDTH*0.2), 16, 20), children);
        this.setM(m);
        this.setColor([0.8,0.23,0.16]);
    }

    setM(m) {
        super.setM(m);
        this.children[0].setM(m);
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
    }

    setM(m) {
        super.setM(m);
        let mBlade = mat4.create();
        let rad = 2*Math.PI/NUMBER_OF_BLADES;
        for (let i=0; i<NUMBER_OF_BLADES; i++) {
            mat4.rotate(mBlade, m, rad*i, [0,1,0]);
            this.children[i].setM(mBlade);
        }
    }
}

class Blade extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new BladeSurface(CABIN_WIDTH*0.025, CABIN_WIDTH*0.2, CABIN_WIDTH*0.3), 16, 20), children);
        this.setM(m);
        this.setColor([0.6,0.6,0.6]);
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
}

class TailTieRod extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new TailTieRodSurface(CABIN_HEIGHT/4, CABIN_HEIGHT/16, CABIN_LENGTH/2, CABIN_WIDTH/32), 16, 20), children);
        this.setM(m);
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
    }

    setM(m) {
        super.setM(m);
        let mFin1 = mat4.create();
        mat4.translate(mFin1, m, [-CABIN_LENGTH*0.015,CABIN_WIDTH*0.3,0]);
        mat4.rotate(mFin1, mFin1, Math.PI/2, [-1,0,0]);
        this.children[0].setM(mFin1);
        let mFin2 = mat4.create();
        mat4.translate(mFin2, m, [-CABIN_LENGTH*0.015,-CABIN_WIDTH*0.3,0]);
        mat4.rotate(mFin2, mFin2, Math.PI/2, [-1,0,0]);
        this.children[1].setM(mFin2);
    }
}

// aleta de la cola
class Fin extends Object3D {
    constructor(m) {
        let children = [];
        super(m, new Grid3D(new FinSurface(CABIN_WIDTH*0.48, CABIN_HEIGHT, CABIN_WIDTH/32), 16, 20), children);
        this.setM(m);
        this.setColor([0.8,0.23,0.16]);
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
        this.setColor([0.5,0.5,0.5]);
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
        this.setColor([0.2,0.2,0.2]);
    }
}