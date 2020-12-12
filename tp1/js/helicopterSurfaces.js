class Cabin extends Surface {
    constructor(length, height, width) {
        super();
        this.length = length;
        this.height = height;
        this.width = width;
    }

    getPosition(u, v) {
        let position;
        let bezierCurve;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.2) {                       // curva de bezier nro 1
            p0 = {x: -this.length/2, y: -this.height/4};
            p1 = {x: -this.length*(31/64), y: this.height*(3/16)};
            p2 = {x: -this.length/4, y: this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: -this.length*(3/16), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition(u/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.2 && u <= 0.4) {               // curva de bezier nro 2
            p0 = {x: -this.length*(3/16), y: this.height*(13/32)};
            p1 = {x: -this.length/8, y: this.height*(7/16)};         // simetrico junto con p2 del tramo anterior
            p2 = {x: this.length*(7/32), y: this.height*(9/16)};
            p3 = {x: this.length*(29/64), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.2)/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.4 && u <= 0.5) {               // curva de bezier nro 3
            p0 = {x: this.length*(29/64), y: this.height*(13/32)};
            p1 = {x: this.length*0.4625, y: this.height*(3/8)};      // esta dentro del segmento p0-p3
            p2 = {x: this.length*0.490625, y: this.height*(9/32)};   // esta dentro del segmento p0-p3
            p3 = {x: this.length/2, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.4)/0.1);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.5 && u <= 0.7) {               // curva de bezier nro 4
            p0 = {x: this.length/2, y: this.height/4};
            p1 = {x: this.length*(15/32), y: -this.height*(7/32)};
            p2 = {x: this.length/4, y: -this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: this.length*(3/16), y: -this.height*(7/16)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.5)/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.7 && u <= 0.9) {               // curva de bezier nro 5
            p0 = {x: this.length*(3/16), y: -this.height*(7/16)};
            p1 = {x: this.length/8, y: -this.height/2};              // simetrico junto con p2 del tramo anterior
            p2 = {x: -this.length*0.2265625, y: -this.height*(19/32)};
            p3 = {x: -this.length*(7/16), y: -this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.7)/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.9 && u <= 1) {                 // curva de bezier nro 6
            p0 = {x: -this.length*(7/16), y: -this.height*(13/32)};
            p1 = {x: -this.length*0.45, y: -this.height*0.375};      // esta dentro del segmento p0-p3
            p2 = {x: -this.length*0.4875, y: -this.height*0.28125};  // esta dentro del segmento p0-p3
            p3 = {x: -this.length/2, y: -this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.9)/0.1);
            position[2] = (v - 0.5) * this.width;
        }
        position = this.scalePosition(position, v);
        return position;
    }

    scalePosition(position, v) {
        let vAbs = Math.abs(v-0.5);
        let newPosition = vec3.clone(position);
        if (vAbs >= 0.25) {
            newPosition[0] = newPosition[0]*((-0.09375)*vAbs+1);
            newPosition[1] = newPosition[1]*((-0.25)*vAbs+1.015625);
        } else {
            newPosition[0] = newPosition[0]*((-0.09375)*vAbs+1);
            newPosition[1] = newPosition[1]*((-0.1875)*vAbs+1);
        }
        return newPosition;
    }

    getNormal(u, v) {
        let vecTangBezierCurve;
        let vecTangV = vec3.create();
        let bezierCurve;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.2) {                       // curva de bezier nro 1
            p0 = {x: -this.length/2, y: -this.height/4};
            p1 = {x: -this.length*(31/64), y: this.height*(3/16)};
            p2 = {x: -this.length/4, y: this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: -this.length*(3/16), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent(u/0.2);
        } else if (u > 0.2 && u <= 0.4) {               // curva de bezier nro 2
            p0 = {x: -this.length*(3/16), y: this.height*(13/32)};
            p1 = {x: -this.length/8, y: this.height*(7/16)};         // simetrico junto con p2 del tramo anterior
            p2 = {x: this.length*(7/32), y: this.height*(9/16)};
            p3 = {x: this.length*(29/64), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.2)/0.2);
        } else if (u > 0.4 && u <= 0.5) {               // curva de bezier nro 3
            p0 = {x: this.length*(29/64), y: this.height*(13/32)};
            p1 = {x: this.length*0.4625, y: this.height*(3/8)};      // esta dentro del segmento p0-p3
            p2 = {x: this.length*0.490625, y: this.height*(9/32)};   // esta dentro del segmento p0-p3
            p3 = {x: this.length/2, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.4)/0.1);
        } else if (u > 0.5 && u <= 0.7) {               // curva de bezier nro 4
            p0 = {x: this.length/2, y: this.height/4};
            p1 = {x: this.length*(15/32), y: -this.height*(7/32)};
            p2 = {x: this.length/4, y: -this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: this.length*(3/16), y: -this.height*(7/16)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.5)/0.2);
        } else if (u > 0.7 && u <= 0.9) {               // curva de bezier nro 5
            p0 = {x: this.length*(3/16), y: -this.height*(7/16)};
            p1 = {x: this.length/8, y: -this.height/2};              // simetrico junto con p2 del tramo anterior
            p2 = {x: -this.length*0.2265625, y: -this.height*(19/32)};
            p3 = {x: -this.length*(7/16), y: -this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.7)/0.2);
        } else if (u > 0.9 && u <= 1) {                 // curva de bezier nro 6
            p0 = {x: -this.length*(7/16), y: -this.height*(13/32)};
            p1 = {x: -this.length*0.45, y: -this.height*0.375};      // esta dentro del segmento p0-p3
            p2 = {x: -this.length*0.4875, y: -this.height*0.28125};  // esta dentro del segmento p0-p3
            p3 = {x: -this.length/2, y: -this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.9)/0.1);
        }

        if (v === 0) {
            vec3.subtract(vecTangV, this.getPosition(u, v), this.getPosition(u, v+0.01));
        } else if (v === 1) {
            vec3.subtract(vecTangV, this.getPosition(u, v-0.01), this.getPosition(u, v));
        } else {
            vec3.subtract(vecTangV, this.getPosition(u, v - 0.01), this.getPosition(u, v + 0.01));
        }
        vec3.normalize(vecTangV, vecTangV);

        let vecNormal = vec3.create();
        vec3.cross(vecNormal, vecTangBezierCurve, vecTangV);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    haveCaps() {
        return true;
    }

    // v deberia ser 0 o 1
    getCapPosition(v) {
        return [0, 0, (v - 0.5) * this.width];
    }

    // v deberia ser 0 o 1
    getCapNormal(v) {
        let vecNormal;
        vecNormal = vec3.fromValues(0, 0, v - 0.5);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    getCapTextureCoordinates(u, v) {
        return [u, v];
    }
}

class ArmSurface extends Surface {
    constructor(length, initialWidth, finalWidth) {
        super();
        this.length = length;
        this.initialWidth = initialWidth;
        this.finalWidth = finalWidth;
    }

    getPosition(u, v) {
        let position;
        let bezierCurve;
        let width = this.initialWidth + (this.finalWidth - this.initialWidth)*v;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.25) {                       // curva de bezier nro 1
            p0 = {x: -width/2, y: 0};
            p1 = {x: -width/2, y: width/10};
            p2 = {x: -width/10, y: width/2};
            p3 = {x: 0, y: width/2};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition(u/0.25);
        } else if (u > 0.25 && u <= 0.5) {               // curva de bezier nro 2
            p0 = {x: 0, y: width/2};
            p1 = {x: width/10, y: width/2};
            p2 = {x: width/2, y: width/10};
            p3 = {x: width/2, y: 0};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.25)/0.25);
        } else if (u > 0.5 && u <= 0.75) {               // curva de bezier nro 3
            p0 = {x: width/2, y: 0};
            p1 = {x: width/2, y: -width/10};
            p2 = {x: width/10, y: -width/2};
            p3 = {x: 0, y: -width/2};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.5)/0.25);
        } else if (u > 0.75 && u <= 1) {                // curva de bezier nro 4
            p0 = {x: 0, y: -width/2};
            p1 = {x: -width/10, y: -width/2};
            p2 = {x: -width/2, y: -width/10};
            p3 = {x: -width/2, y: 0};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.75)/0.25);
        }
        position[2] = v*this.length;

        return position;
    }
}

class BladeSurface extends Surface {
    constructor(initialWidth, finalWidth, length) {
        super();
        this.initialWidth = initialWidth;
        this.finalWidth = finalWidth;
        this.length = length;
    }

    getPosition(u, v) {
        let width = this.initialWidth + (this.finalWidth - this.initialWidth)*v;
        let position;
        if (u >=0 && u <=0.5) {
            position = vec3.fromValues((u - 0.25) * width * 2, v * this.length, 0.0001);
        } else if (u >0.5 && u <=1) {
            position = vec3.fromValues(-(u - 0.75) * width * 2, v * this.length, -0.0001);
        }
        return position;
    }

    getNormal(u, v) {
        if (u >=0 && u <=0.5) {
            return vec3.fromValues(0, 0, 1);
        } else if (u >0.5 && u <=1) {
            return vec3.fromValues(0, 0, -1);
        }
    }
}

class TailTieRodSurface extends Surface {
    constructor(initialWidth, finalWidth, length, thickness) {
        super();
        this.initialWidth = initialWidth;
        this.finalWidth = finalWidth;
        this.length = length;
        this.thickness = thickness;
    }

    getPosition(u, v) {
        let width = this.initialWidth + (this.finalWidth - this.initialWidth)*u;
        let position;
        if (v >=0 && v <=0.25) {
            position = vec3.fromValues(
                u * this.length,
                -(v/0.25) * width,
                this.thickness/2
            );
        } else if (v >0.25 && v <=0.5) {
            position = vec3.fromValues(
                u * this.length,
                -width,
                -((v-0.25)/0.25)*this.thickness + this.thickness/2
            );
        } else if (v >0.5 && v <=0.75) {
            position = vec3.fromValues(
                u * this.length,
                ((v-0.5)/0.25) * width - width,
                -this.thickness/2
            );
        } else if (v >0.75 && v <=1) {
            position = vec3.fromValues(
                u * this.length,
                0,
                ((v-0.75)/0.25)*this.thickness - this.thickness/2
            );
        }
        return position;
    }
}

class FinSurface extends Surface {
    constructor(width, height, thickness) {
        super();
        this.width = width;
        this.height = height;
        this.thickness = thickness;
    }

    getPosition(u, v) {
        let position;
        let bezierCurve;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.125) {                                 // curva de bezier nro 1
            p0 = {x: -this.width*0.35, y: -this.height*0.45};
            p1 = {x: -this.width*0.35, y: -this.height*0.425};
            p2 = {x: this.width*0.35, y: this.height*0.425};
            p3 = {x: this.width*0.4, y: this.height*0.45};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition(u/0.125);
        } else if (u > 0.125 && u <= 0.25) {                        // curva de bezier nro 2
            p0 = {x: this.width*0.4, y: this.height*0.45};
            p1 = {x: this.width*0.45, y: this.height*0.475};
            p2 = {x: this.width*0.55, y: this.height*0.5};
            p3 = {x: this.width*0.6, y: this.height*0.5};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.125)/0.125);
        } else if (u > 0.25 && u <= 0.375) {                        // curva de bezier nro 3
            p0 = {x: this.width*0.6, y: this.height*0.5};
            p1 = {x: this.width*0.65, y: this.height*0.5};
            p2 = {x: this.width*1.25, y: this.height*0.5};
            p3 = {x: this.width*1.3, y: this.height*0.5};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.25)/0.125);
        } else if (u > 0.375 && u <= 0.5) {                        // curva de bezier nro 4
            p0 = {x: this.width*1.3, y: this.height*0.5};
            p1 = {x: this.width*1.35, y: this.height*0.5};
            p2 = {x: this.width*1.4, y: this.height*0.5};
            p3 = {x: this.width*1.4, y: this.height*0.45};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.375)/0.125);
        } else if (u > 0.5 && u <= 0.625) {                        // curva de bezier nro 5
            p0 = {x: this.width*1.4, y: this.height*0.45};
            p1 = {x: this.width*1.4, y: this.height*0.425};
            p2 = {x: this.width*0.65, y: -this.height*0.425};
            p3 = {x: this.width*0.6, y: -this.height*0.45};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.5)/0.125);
        } else if (u > 0.625 && u <= 0.75) {                        // curva de bezier nro 6
            p0 = {x: this.width*0.6, y: -this.height*0.45};
            p1 = {x: this.width*0.55, y: -this.height*0.475};
            p2 = {x: this.width*0.45, y: -this.height*0.5};
            p3 = {x: this.width*0.4, y: -this.height*0.5};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.625)/0.125);
        } else if (u > 0.75 && u <= 0.875) {                        // curva de bezier nro 7
            p0 = {x: this.width*0.4, y: -this.height*0.5};
            p1 = {x: this.width*0.35, y: -this.height*0.5};
            p2 = {x: -this.width*0.2, y: -this.height*0.5};
            p3 = {x: -this.width*0.25, y: -this.height*0.5};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.75)/0.125);
        } else if (u > 0.875 && u <= 1) {                           // curva de bezier nro 8
            p0 = {x: -this.width*0.25, y: -this.height*0.5};
            p1 = {x: -this.width*0.3, y: -this.height*0.5};
            p2 = {x: -this.width*0.35, y: -this.height*0.5};
            p3 = {x: -this.width*0.35, y: -this.height*0.45};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.875)/0.125);
        }
        position[2] = (v - 0.5) * this.thickness;

        return position;
    }

    haveCaps() {
        return true;
    }

    // v deberia ser 0 o 1
    getCapPosition(v) {
        return [this.width/2, 0, (v - 0.5) * this.thickness];
    }

    // v deberia ser 0 o 1
    getCapNormal(v) {
        let vecNormal;
        vecNormal = vec3.fromValues(0, 0, v - 0.5);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    getCapTextureCoordinates(u, v) {
        return [u, v];
    }
}

class SkidSurface extends Surface {
    constructor(length, radius) {
        super();
        this.length = length;
        this.radius = radius;
    }

    getPosition(u, v) {
        let position;
        let trajectory;
        let bezierCurve;
        let p0, p1, p2, p3;

        if (v>=0 && v<=0.333) {
            p0 = {x: -this.length*0.0625, y: -this.length*0.5};
            p1 = {x: 0, y: -this.length*0.5};
            p2 = {x: 0, y: -this.length*0.4375};
            p3 = {x: 0, y: -this.length*0.375};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            trajectory = bezierCurve.getPosition(v/0.333);

            position = vec3.fromValues(
                this.radius * Math.cos(2 * Math.PI * u) + trajectory[0],
                trajectory[1],
                this.radius * Math.sin(2 * Math.PI * u)
            );
        } else if (v>0.333 && v<=0.666) {
            p0 = {x: 0, y: -this.length*0.375};
            p1 = {x: 0, y: -this.length*0.1};
            p2 = {x: 0, y: this.length*0.1};
            p3 = {x: 0, y: this.length*0.375};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            trajectory = bezierCurve.getPosition((v-0.333)/0.333);

            position = vec3.fromValues(
                this.radius * Math.cos(2 * Math.PI * u),
                trajectory[1],
                this.radius * Math.sin(2 * Math.PI * u)
            );
        }  else if (v>0.666 && v<=1) {
            p0 = {x: 0, y: this.length*0.375};
            p1 = {x: 0, y: this.length*0.4375};
            p2 = {x: 0, y: this.length*0.5};
            p3 = {x: -this.length*0.0625, y: this.length*0.5};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            trajectory = bezierCurve.getPosition((v-0.666)/0.333);

            position = vec3.fromValues(
                this.radius * Math.cos(2 * Math.PI * u) + trajectory[0],
                trajectory[1],
                this.radius * Math.sin(2 * Math.PI * u)
            );
        }
        return position;
    }

    haveCaps() {
        return true;
    }

    // v deberia ser 0 o 1
    getCapPosition(v) {
        if (v === 0) {
            return vec3.fromValues(-this.length*0.0625, -this.length*0.5, 0);
        } else if (v === 1) {
            return vec3.fromValues(-this.length*0.0625, this.length*0.5, 0);
        }
    }

    // v deberia ser 0 o 1
    getCapNormal(v) {
        let vecNormal;
        let trajectory;
        let bezierCurve;
        let p0, p1, p2, p3;
        if (v === 0) {
            p0 = {x: -this.length*0.0625, y: -this.length*0.5};
            p1 = {x: 0, y: -this.length*0.5};
            p2 = {x: 0, y: -this.length*0.4375};
            p3 = {x: 0, y: -this.length*0.375};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecNormal = bezierCurve.getTangent(v);      // la tangente a la trayectoria al inicio es opuesta a la normal
            vec3.negate(vecNormal, vecNormal);
        } else if (v === 1) {
            p0 = {x: 0, y: this.length*0.375};
            p1 = {x: 0, y: this.length*0.4375};
            p2 = {x: 0, y: this.length*0.5};
            p3 = {x: -this.length*0.0625, y: this.length*0.5};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecNormal = bezierCurve.getTangent(v);      // la tangente a la trayectoria en el inicio es igual a la normal
        }
        vec3.normalize(vecNormal, vecNormal);
        console.log(vecNormal);
        return vecNormal;
    }

    getCapTextureCoordinates(u, v) {
        return [u, v];
    }
}