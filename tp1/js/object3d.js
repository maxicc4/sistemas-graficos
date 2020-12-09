//const HELICOPTER_LENGTH = 2.5;
//const HELICOPTER_HEIGHT = 1;
const CABIN_LENGTH = 1.25;
const CABIN_WIDTH = 0.45;
const CABIN_HEIGHT = 0.6;

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

class Helicopter extends Object3D{
    constructor(m) {
        let children = [];
        children.push(new HelicopterArm(m));
        //children.push(new Sphere(m));
        super(m, new Grid3D(new Cabin(CABIN_LENGTH, CABIN_HEIGHT, CABIN_WIDTH), 20, 40), children);
        this.setM(m);
    }

    setM(m) {
        super.setM(m);
        let m1 = mat4.create();
        mat4.translate(m1, m, [-CABIN_LENGTH/7,(CABIN_HEIGHT/3),CABIN_WIDTH/2]);
        //mat4.scale(m1, m1, [0.25,0.25,0.25]);
        this.children[0].setM(m1);
        /*let m2 = mat4.create();
        mat4.translate(m2, m, [0,0.1,-0.25]);
        mat4.scale(m2, m2, [0.25,0.25,0.25]);
        this.children[1].setM(m2);*/
    }
}

class HelicopterArm extends Object3D{
    constructor(m) {
        super(m, new Grid3D(new Cylinder(CABIN_WIDTH/10, CABIN_LENGTH/5, true), 16, 20), []);
        this.setM(m);
        this.setColor([0.2,0.2,0.2]);
    }

    setM(m) {
        let m1 = mat4.create();
        mat4.rotate(m1, m, -Math.PI/2, [0,0,1]);
        super.setM(m1);
    }
}