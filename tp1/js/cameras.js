// clase abstracta
class Camera {
    constructor(radius, target) {
        this.initialRadius = radius;
        this.radius = radius;
        this.target = target;       //es un objeto que tiene un metodo getPosition
        this.vectorUp = vec3.fromValues(0,1,0);
    }

    getViewMatrix() {
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.getPosition(), this.target.getPosition(), this.vectorUp);
        return viewMatrix;
    }

    // es la posicion de la camara en las coordenadas de mundo, debe implementarse en cada tipo de camara
    // devuelve un vec3
    getPosition() {
        throw new Error("Method 'getPosition()' must be implemented.");
    }

    zoomIn() {
        this.radius = Math.min(Math.max(this.initialRadius*0.5, this.radius - this.initialRadius*0.1), this.initialRadius*2);
    }

    zoomOut() {
        this.radius = Math.min(Math.max(this.initialRadius*0.5, this.radius + this.initialRadius*0.1), this.initialRadius*2);
    }

    getRadius() {
        return this.radius;
    }

    // target es un objeto que tiene un metodo getPosition
    getTarget() {
        return this.target;
    }
}

class OrbitalCamera extends Camera {
    constructor(radius, target) {
        super(radius, target);
        // valores iniciales
        this.alpha = 0;
        this.beta = Math.PI/2;
        // factor con el que se mueve la camara
        this.speedFactor = 0.01;
    }

    increaseAlpha(deltaX) {
        this.alpha = this.alpha + deltaX * this.speedFactor;
    }

    increaseBeta(deltaY) {
        this.beta = this.beta + deltaY * this.speedFactor;
        if (this.beta <= 0) this.beta = 0.01;
        if (this.beta > Math.PI) this.beta = Math.PI;
    }

    getPosition() {
        let origin = this.target.getPosition();
        return vec3.fromValues(
            this.radius * Math.sin(this.alpha) * Math.sin(this.beta) + origin[0],
            this.radius * Math.cos(this.beta) + origin[1],
            this.radius * Math.cos(this.alpha) * Math.sin(this.beta) + origin[2]
        )
    }
}

// clase abstracta
class TrackingCamera extends Camera {
    constructor(radius, target) {
        super(radius, target);
        this.direction = null;
    }

    getPosition() {
        let position = this.target.getPosition();
        vec3.scaleAndAdd(position, position, this.target.getDirection(this.direction), this.radius);
        return position;
    }
}

class RearTrackingCamera extends TrackingCamera {
    constructor(radius, target) {
        super(radius, target);
        this.direction = 'rear';
    }
}

class SideTrackingCamera extends TrackingCamera {
    constructor(radius, target) {
        super(radius, target);
        this.direction = 'rightSide';
    }
}

class UpperTrackingCamera extends TrackingCamera {
    constructor(radius, target) {
        super(radius, target);
        this.direction = 'upper';
        this.vectorUp = vec3.fromValues(1,0,0);
    }
}