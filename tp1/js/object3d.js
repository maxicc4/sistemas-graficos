
class Object3D {
    constructor(m, grid3D, children) {
        this.grid3D = grid3D;
        this.children = children;
        this.m = m;   // Matriz de modelado
    }

    draw() {
        updateModelMatrix(this.m);
        setupVertexShaderMatrix();
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
}

class Helicopter extends Object3D{
    constructor(m) {
        let children = [];
        //children.push(new Sphere(m));
        //children.push(new Sphere(m));
        super(m, new Grid3D(new Cabin(1.25, 0.6, 0.45)), children);
        this.setM(m);
    }

    setM(m) {
        super.setM(m);
        /*let m1 = mat4.create();
        mat4.translate(m1, m, [0,0.1,0.25]);
        mat4.scale(m1, m1, [0.25,0.25,0.25]);
        this.children[0].setM(m1);
        let m2 = mat4.create();
        mat4.translate(m2, m, [0,0.1,-0.25]);
        mat4.scale(m2, m2, [0.25,0.25,0.25]);
        this.children[1].setM(m2);*/
    }
}

class Sphere extends Object3D{
    constructor(m) {
        super(m, new Grid3D(new SphereSurface(0.5)), []);
    }
}