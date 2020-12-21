class Surface {
    getPosition(u, v) {
        return vec3.fromValues(0,0,0);
    }

    getNormal(u, v) {
        let vecTangU = vec3.create();
        let vecTangV = vec3.create();
        if (u === 0) {
            vec3.subtract(vecTangU, this.getPosition(u, v), this.getPosition(u+0.01, v));
        } else if (u === 1) {
            vec3.subtract(vecTangU, this.getPosition(u-0.01, v), this.getPosition(u, v));
        } else {
            vec3.subtract(vecTangU, this.getPosition(u-0.01, v), this.getPosition(u+0.01, v));
        }
        vec3.normalize(vecTangU, vecTangU);

        if (v === 0) {
            vec3.subtract(vecTangV, this.getPosition(u, v), this.getPosition(u, v+0.01));
        } else if (v === 1) {
            vec3.subtract(vecTangV, this.getPosition(u, v-0.01), this.getPosition(u, v));
        } else {
            vec3.subtract(vecTangV, this.getPosition(u, v - 0.01), this.getPosition(u, v + 0.01));
        }
        vec3.normalize(vecTangV, vecTangV);

        let vecNormal = vec3.create();
        vec3.cross(vecNormal, vecTangV, vecTangU);
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

class Plane extends Surface{
    constructor(width, length) {
        super();
        this.width = width;
        this.length = length;
    }

    getPosition(u, v) {
        let x = (u - 0.5) * this.width;
        let z = (v - 0.5) * this.length;
        return [x, 0, z];
    }

    getNormal(u, v) {
        return [0, 1, 0];
    }
}

class SphereSurface extends Surface {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    getPosition(u, v) {
        let x = Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u) * this.radius;
        let y = Math.cos(Math.PI * v) * this.radius;
        let z = Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u) * this.radius;
        return [x, y, z];
    }

    getNormal(u, v) {
        let x = Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u);
        let y = Math.cos(Math.PI * v);
        let z = Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }
}

class SineTube extends Surface {
    constructor(waveAmplitude, wavelength, radius, height) {
        super();
        this.waveAmplitude = waveAmplitude;
        this.wavelength = wavelength;
        this.radius = radius;
        this.height = height;
    }

    getPosition(u, v) {
        let x = (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radius) * Math.cos(2 * Math.PI * u);
        let y = (v - 0.5) * this.height;
        let z = (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radius) * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }

    getNormal(u, v) {
        let tangU = vec3.fromValues(
            (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radius) * Math.sin(2 * Math.PI * u) * (-2 * Math.PI),
            0,
            (this.waveAmplitude * Math.sin((2 * Math.PI / this.wavelength) * v + Math.PI) + this.radius) * Math.cos(2 * Math.PI * u) * 2 * Math.PI
        );
        let tangV = vec3.fromValues(
            (this.waveAmplitude * Math.cos((2 * Math.PI / this.wavelength) * v + Math.PI) * (2 * Math.PI / this.wavelength) + this.radius) * Math.cos(2 * Math.PI * u),
            this.height,
            (this.waveAmplitude * Math.cos((2 * Math.PI / this.wavelength) * v + Math.PI) * (2 * Math.PI / this.wavelength) + this.radius) * Math.sin(2 * Math.PI * u)
        );
        let vecNormal = vec3.create();
        vec3.cross(vecNormal, tangV, tangU);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }
}

class Ring extends Surface {
    constructor(innerRadius, outerRadius, height) {
        super();
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.height = height;
    }

    getPosition(u, v) {
        let position;
        let bezierCurve;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.2) {                               // curva de bezier nro 1
            p0 = {x: this.innerRadius, y: -this.height/4};
            p1 = {x: this.innerRadius, y: -this.height/8};
            p2 = {x: this.innerRadius, y: this.height/8};
            p3 = {x: this.innerRadius, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition(u/0.2);
            position[2] = position[0];
        } else if (u > 0.2 && u <= 0.35) {                      // curva de bezier nro 2
            p0 = {x: this.innerRadius, y: this.height/4};
            p1 = {x: this.innerRadius, y: this.height*(3/8)};
            p2 = {x: this.innerRadius, y: this.height/2};
            p3 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: this.height/2};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.2)/0.15);
            position[2] = position[0];
        } else if (u > 0.35 && u <= 0.5) {                      // curva de bezier nro 3
            p0 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: this.height/2};
            p1 = {x: this.outerRadius, y: this.height/2};
            p2 = {x: this.outerRadius, y: this.height*(3/8)};
            p3 = {x: this.outerRadius, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.35)/0.15);
            position[2] = position[0];
        } else if (u > 0.5 && u <= 0.7) {                       // curva de bezier nro 4
            p0 = {x: this.outerRadius, y: this.height/4};
            p1 = {x: this.outerRadius, y: this.height/8};
            p2 = {x: this.outerRadius, y: -this.height/8};
            p3 = {x: this.outerRadius, y: -this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.5)/0.2);
            position[2] = position[0];
        } else if (u > 0.7 && u <= 0.85) {                      // curva de bezier nro 5
            p0 = {x: this.outerRadius, y: -this.height/4};
            p1 = {x: this.outerRadius, y: -this.height*(3/8)};
            p2 = {x: this.outerRadius, y: -this.height/2};
            p3 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: -this.height/2};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.7)/0.15);
            position[2] = position[0];
        } else if (u > 0.85 && u <= 1) {                        // curva de bezier nro 6
            p0 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: -this.height/2};
            p1 = {x: this.innerRadius, y: -this.height/2};
            p2 = {x: this.innerRadius, y: -this.height*(3/8)};
            p3 = {x: this.innerRadius, y: -this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            position = bezierCurve.getPosition((u-0.85)/0.15);
            position[2] = position[0];
        }
        position[0] = position[0]*Math.cos(2*Math.PI*v);
        position[2] = position[2]*Math.sin(2*Math.PI*v);

        return position;
    }

    getNormal(u, v) {
        let vecTangBezierCurve;
        let vecTangV = vec3.create();
        let bezierCurve;
        let p0, p1, p2, p3;
        if (u >= 0 && u <= 0.2) {                               // curva de bezier nro 1
            p0 = {x: this.innerRadius, y: -this.height/4};
            p1 = {x: this.innerRadius, y: -this.height/8};
            p2 = {x: this.innerRadius, y: this.height/8};
            p3 = {x: this.innerRadius, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent(u/0.2);
            vecTangBezierCurve[2] = vecTangBezierCurve[0];
        } else if (u > 0.2 && u <= 0.35) {                      // curva de bezier nro 2
            p0 = {x: this.innerRadius, y: this.height/4};
            p1 = {x: this.innerRadius, y: this.height*(3/8)};
            p2 = {x: this.innerRadius, y: this.height/2};
            p3 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: this.height/2};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.2)/0.15);
            vecTangBezierCurve[2] = vecTangBezierCurve[0];
        } else if (u > 0.35 && u <= 0.5) {                      // curva de bezier nro 3
            p0 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: this.height/2};
            p1 = {x: this.outerRadius, y: this.height/2};
            p2 = {x: this.outerRadius, y: this.height*(3/8)};
            p3 = {x: this.outerRadius, y: this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.35)/0.15);
            vecTangBezierCurve[2] = vecTangBezierCurve[0];
        } else if (u > 0.5 && u <= 0.7) {                       // curva de bezier nro 4
            p0 = {x: this.outerRadius, y: this.height/4};
            p1 = {x: this.outerRadius, y: this.height/8};
            p2 = {x: this.outerRadius, y: -this.height/8};
            p3 = {x: this.outerRadius, y: -this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.5)/0.2);
            vecTangBezierCurve[2] = vecTangBezierCurve[0];
        } else if (u > 0.7 && u <= 0.85) {                      // curva de bezier nro 5
            p0 = {x: this.outerRadius, y: -this.height/4};
            p1 = {x: this.outerRadius, y: -this.height*(3/8)};
            p2 = {x: this.outerRadius, y: -this.height/2};
            p3 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: -this.height/2};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.7)/0.15);
            vecTangBezierCurve[2] = vecTangBezierCurve[0];
        } else if (u > 0.85 && u <= 1) {                        // curva de bezier nro 6
            p0 = {x: (this.innerRadius+(this.outerRadius-this.innerRadius)/2), y: -this.height/2};
            p1 = {x: this.innerRadius, y: -this.height/2};
            p2 = {x: this.innerRadius, y: -this.height*(3/8)};
            p3 = {x: this.innerRadius, y: -this.height/4};
            bezierCurve = new BezierCurve(p0, p1, p2, p3);
            vecTangBezierCurve = bezierCurve.getTangent((u-0.85)/0.15);
            vecTangBezierCurve[2] = vecTangBezierCurve[0];
        }
        vecTangBezierCurve[0] = vecTangBezierCurve[0]*Math.cos(2*Math.PI*v);
        vecTangBezierCurve[2] = vecTangBezierCurve[2]*Math.sin(2*Math.PI*v);

        vec3.subtract(vecTangV, this.getPosition(u, v - 0.01), this.getPosition(u, v + 0.01));

        let vecNormal = vec3.create();
        vec3.cross(vecNormal, vecTangBezierCurve, vecTangV);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }
}

class Cylinder extends Surface {
    constructor(radius, height, caps) {
        super();
        this.radius = radius;
        this.height = height;
        this.caps = caps;   // boolean
    }

    getPosition(u, v) {
        let x = this.radius * Math.cos(2 * Math.PI * u);
        let y = (v - 0.5) * this.height;
        let z = this.radius * Math.sin(2 * Math.PI * u);
        return [x, y, z];
    }

    getNormal(u, v) {
        let tangU = vec3.fromValues(
            this.radius * Math.sin(2 * Math.PI * u) * (-2 * Math.PI),
            0,
            this.radius * Math.cos(2 * Math.PI * u) * 2 * Math.PI
        );
        let tangV = vec3.fromValues(0, 1, 0);
        let vecNormal = vec3.create();
        vec3.cross(vecNormal, tangV, tangU);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    haveCaps() {
        return this.caps;
    }

    // v deberia ser 0 o 1
    getCapPosition(v) {
        return [0, (v - 0.5) * this.height, 0];
    }

    // v deberia ser 0 o 1
    getCapNormal(v) {
        let vecNormal;
        vecNormal = vec3.fromValues(0, v - 0.5, 0);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    getCapTextureCoordinates(u, v) {
        return [u, v];
    }
}

class BoxSurface extends Surface {
    constructor(width, height, length) {
        super();
        this.width = width;
        this.height = height;
        this.length = length;
    }

    getPosition(u, v) {
        let position;
        let p0, p1;
        if (u >= 0 && u <= 0.25) {
            p0 = {x: -this.width/2, y: -this.height/2};
            p1 = {x: -this.width/2, y: this.height/2};
            position = vec3.fromValues(
                (1-u/0.25)*p0.x + (u/0.25)*p1.x,
                v*this.length,
                (1-u/0.25)*p0.y + (u/0.25)*p1.y
            );
        } else if (u > 0.25 && u <= 0.5) {
            p0 = {x: -this.width/2, y: this.height/2};
            p1 = {x: this.width/2, y: this.height/2};
            position = vec3.fromValues(
                (1-(u-0.25)/0.25)*p0.x + ((u-0.25)/0.25)*p1.x,
                v*this.length,
                (1-(u-0.25)/0.25)*p0.y + ((u-0.25)/0.25)*p1.y
            );
        } else if (u > 0.5 && u <= 0.75) {
            p0 = {x: this.width/2, y: this.height/2};
            p1 = {x: this.width/2, y: -this.height/2};
            position = vec3.fromValues(
                (1-(u-0.5)/0.25)*p0.x + ((u-0.5)/0.25)*p1.x,
                v*this.length,
                (1-(u-0.5)/0.25)*p0.y + ((u-0.5)/0.25)*p1.y
            );
        } else if (u > 0.75 && u <= 1) {
            p0 = {x: this.width/2, y: -this.height/2};
            p1 = {x: -this.width/2, y: -this.height/2};
            position = vec3.fromValues(
                (1-(u-0.75)/0.25)*p0.x + ((u-0.75)/0.25)*p1.x,
                v*this.length,
                (1-(u-0.75)/0.25)*p0.y + ((u-0.75)/0.25)*p1.y
            );
        }

        return position;
    }

    getNormal(u, v) {
        if (u >= 0 && u <= 0.25) {
            return vec3.fromValues(-1,0,0);
        } else if (u > 0.25 && u <= 0.5) {
            return vec3.fromValues(0,0,1);
        } else if (u > 0.5 && u <= 0.75) {
            return vec3.fromValues(1,0,0);
        } else if (u > 0.75 && u <= 1) {
            return vec3.fromValues(0,0,-1);
        }
    }

    haveCaps() {
        return true;
    }

    // v deberia ser 0 o 1
    getCapPosition(v) {
        return [0, v * this.length, 0];
    }

    // v deberia ser 0 o 1
    getCapNormal(v) {
        let vecNormal;
        vecNormal = vec3.fromValues(0, v - 0.5, 0);
        vec3.normalize(vecNormal, vecNormal);
        return vecNormal;
    }

    getCapTextureCoordinates(u, v) {
        return [u, v];
    }
}