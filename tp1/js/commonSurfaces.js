class Plane {
    constructor(width, long) {
        this.width = width;
        this.long = long;
    }

    getPosition(u, v) {
        let x = (u - 0.5) * this.width;
        let z = (v - 0.5) * this.long;
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
    constructor(radius) {
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

    getTextureCoordinates(u, v) {
        return [u, v];
    }

    haveCaps() {
        return false;
    }
}

class SineTube {
    constructor(waveAmplitude, wavelength, radius, height) {
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

    getTextureCoordinates(u, v) {
        return [u, v];
    }

    haveCaps() {
        return false;
    }
}

class Ring {
    constructor(innerRadius, outerRadius, height) {
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

    getTextureCoordinates(u, v) {
        return [u, v];
    }

    haveCaps() {
        return false;
    }
}