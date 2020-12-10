//const HELICOPTER_LENGTH = 2.5;
//const HELICOPTER_HEIGHT = 1;
const CABIN_LENGTH = 1.5;
const CABIN_WIDTH = 0.6;
const CABIN_HEIGHT = 0.65;

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
}

class Helicopter extends Object3D {
    constructor(m) {
        let children = [];
        children.push(new RotorArm(m));
        children.push(new RotorArm(m));
        children.push(new RotorArm(m));
        children.push(new RotorArm(m));
        super(m, new Grid3D(new Cabin(CABIN_LENGTH, CABIN_HEIGHT, CABIN_WIDTH), 20, 40), children);
        this.setM(m);
    }

    setM(m) {
        super.setM(m);
        let mRotorArm1 = mat4.create();
        mat4.translate(mRotorArm1, m, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        this.children[0].setM(mRotorArm1);
        let mRotorArm2 = mat4.create();
        mat4.translate(mRotorArm2, m, [CABIN_LENGTH/4,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        this.children[1].setM(mRotorArm2);
        let mRotorArm3 = mat4.create();
        mat4.translate(mRotorArm3, m, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),-CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm3, mRotorArm3, Math.PI, [0,1,0]);
        this.children[2].setM(mRotorArm3);
        let mRotorArm4 = mat4.create();
        mat4.translate(mRotorArm4, m, [CABIN_LENGTH/4,(CABIN_HEIGHT/3),-CABIN_WIDTH/2]);
        mat4.rotate(mRotorArm4, mRotorArm4, Math.PI, [0,1,0]);
        this.children[3].setM(mRotorArm4);
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
        super(m, new Grid3D(new Ring(CABIN_WIDTH*0.3, CABIN_WIDTH*0.375, CABIN_WIDTH*0.2), 16, 20), children);
        this.setM(m);
        this.setColor([0.8,0.23,0.16]);
    }
}