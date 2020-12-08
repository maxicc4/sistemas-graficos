class Plane {
    constructor(width, long) {
        this.width = width;
        this.long = long;
    }

    getPosition(u, v) {
        var x = (u - 0.5) * this.width;
        var z = (v - 0.5) * this.long;
        return [x, 0, z];
    }

    getNormal(u, v) {
        return [0, 1, 0];
    }

    getTextureCoordinates(u, v) {
        return [u, v];
    }

    haveCaps() {
        return false;
    }
}

class SphereSurface {
    constructor(radio) {
        this.radio = radio;
    }

    getPosition(u, v) {
        var x = Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u) * this.radio;
        var y = Math.cos(Math.PI * v) * this.radio;
        var z = Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u) * this.radio;
        return [x, y, z];
    }

    getNormal(u, v) {
        var x = Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u);
        var y = Math.cos(Math.PI * v);
        var z = Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }

    getTextureCoordinates(u, v) {
        return [u, v];
    }

    haveCaps() {
        return false;
    }
}

class SineTube {
    constructor(waveAmplitude, wavelength, radio, height) {
        this.waveAmplitude = waveAmplitude;
        this.wavelength = wavelength;
        this.radio = radio;
        this.height = height;
    }

    getPosition(u, v) {
        var x = (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radio) * Math.cos(2 * Math.PI * u);
        var y = (v - 0.5) * this.height;
        var z = (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radio) * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }

    getNormal(u, v) {
        var tangU = vec3.fromValues(
            (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radio) * Math.sin(2 * Math.PI * u) * (-2 * Math.PI),
            0,
            (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radio) * Math.cos(2 * Math.PI * u) * 2 * Math.PI
        );
        var tangV = vec3.fromValues(
            (this.waveAmplitude * Math.cos((2 * Math.PI / this.wavelength) * v + Math.PI) * (2 * Math.PI / this.wavelength) + this.radio) * Math.cos(2 * Math.PI * u),
            this.height,
            (this.waveAmplitude * Math.cos((2 * Math.PI / this.wavelength) * v + Math.PI) * (2 * Math.PI / this.wavelength) + this.radio) * Math.sin(2 * Math.PI * u)
        );
        var vecNormal = vec3.create();
        vec3.cross(vecNormal, tangV, tangU);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    getTextureCoordinates(u, v) {
        return [u, v];
    }

    haveCaps() {
        return false;
    }
}

class Cabin {
    constructor(long, height, width) {
        this.long = long;
        this.height = height;
        this.width = width;
    }

    getPosition(u, v) {
        let position;
        let bezierCurve;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.2) {                       // curva de bezier nro 1
            p0 = {x: -this.long/2, y: -this.height/4};
            p1 = {x: -this.long*(31/64), y: this.height*(3/16)};
            p2 = {x: -this.long/4, y: this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: -this.long*(3/16), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition(u/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.2 && u <= 0.4) {               // curva de bezier nro 2
            p0 = {x: -this.long*(3/16), y: this.height*(13/32)};
            p1 = {x: -this.long/8, y: this.height*(7/16)};         // simetrico junto con p2 del tramo anterior
            p2 = {x: this.long*(7/32), y: this.height*(9/16)};
            p3 = {x: this.long*(29/64), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.2)/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.4 && u <= 0.5) {               // curva de bezier nro 3
            p0 = {x: this.long*(29/64), y: this.height*(13/32)};
            p1 = {x: this.long*0.4625, y: this.height*(3/8)};      // esta dentro del segmento p0-p3
            p2 = {x: this.long*0.490625, y: this.height*(9/32)};   // esta dentro del segmento p0-p3
            p3 = {x: this.long/2, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.4)/0.1);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.5 && u <= 0.7) {               // curva de bezier nro 4
            p0 = {x: this.long/2, y: this.height/4};
            p1 = {x: this.long*(15/32), y: -this.height*(7/32)};
            p2 = {x: this.long/4, y: -this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: this.long*(3/16), y: -this.height*(7/16)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.5)/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.7 && u <= 0.9) {               // curva de bezier nro 5
            p0 = {x: this.long*(3/16), y: -this.height*(7/16)};
            p1 = {x: this.long/8, y: -this.height/2};              // simetrico junto con p2 del tramo anterior
            p2 = {x: -this.long*0.2265625, y: -this.height*(19/32)};
            p3 = {x: -this.long*(7/16), y: -this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.7)/0.2);
            position[2] = (v - 0.5) * this.width;
        } else if (u > 0.9 && u <= 1) {                 // curva de bezier nro 6
            p0 = {x: -this.long*(7/16), y: -this.height*(13/32)};
            p1 = {x: -this.long*0.45, y: -this.height*0.375};      // esta dentro del segmento p0-p3
            p2 = {x: -this.long*0.4875, y: -this.height*0.28125};  // esta dentro del segmento p0-p3
            p3 = {x: -this.long/2, y: -this.height/4};
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
            p0 = {x: -this.long/2, y: -this.height/4};
            p1 = {x: -this.long*(31/64), y: this.height*(3/16)};
            p2 = {x: -this.long/4, y: this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: -this.long*(3/16), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent(u/0.2);
        } else if (u > 0.2 && u <= 0.4) {               // curva de bezier nro 2
            p0 = {x: -this.long*(3/16), y: this.height*(13/32)};
            p1 = {x: -this.long/8, y: this.height*(7/16)};         // simetrico junto con p2 del tramo anterior
            p2 = {x: this.long*(7/32), y: this.height*(9/16)};
            p3 = {x: this.long*(29/64), y: this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.2)/0.2);
        } else if (u > 0.4 && u <= 0.5) {               // curva de bezier nro 3
            p0 = {x: this.long*(29/64), y: this.height*(13/32)};
            p1 = {x: this.long*0.4625, y: this.height*(3/8)};      // esta dentro del segmento p0-p3
            p2 = {x: this.long*0.490625, y: this.height*(9/32)};   // esta dentro del segmento p0-p3
            p3 = {x: this.long/2, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.4)/0.1);
        } else if (u > 0.5 && u <= 0.7) {               // curva de bezier nro 4
            p0 = {x: this.long/2, y: this.height/4};
            p1 = {x: this.long*(15/32), y: -this.height*(7/32)};
            p2 = {x: this.long/4, y: -this.height*(3/8)};          // simetrico junto con p1 del tramo siguiente
            p3 = {x: this.long*(3/16), y: -this.height*(7/16)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.5)/0.2);
        } else if (u > 0.7 && u <= 0.9) {               // curva de bezier nro 5
            p0 = {x: this.long*(3/16), y: -this.height*(7/16)};
            p1 = {x: this.long/8, y: -this.height/2};              // simetrico junto con p2 del tramo anterior
            p2 = {x: -this.long*0.2265625, y: -this.height*(19/32)};
            p3 = {x: -this.long*(7/16), y: -this.height*(13/32)};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.7)/0.2);
        } else if (u > 0.9 && u <= 1) {                 // curva de bezier nro 6
            p0 = {x: -this.long*(7/16), y: -this.height*(13/32)};
            p1 = {x: -this.long*0.45, y: -this.height*0.375};      // esta dentro del segmento p0-p3
            p2 = {x: -this.long*0.4875, y: -this.height*0.28125};  // esta dentro del segmento p0-p3
            p3 = {x: -this.long/2, y: -this.height/4};
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

    getTextureCoordinates(u, v) {
        return [u, v];
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
        var vecNormal;
        vecNormal = vec3.fromValues(0, 0, v - 0.5);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    getCapTextureCoordinates(u, v) {
        return [u, v];
    }
}