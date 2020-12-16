
class OrbitalCamera {
    constructor(radius, target) {
        this.initialRadius = radius;
        this.radius = radius;
        this.target = target;
        // valores iniciales
        this.alpha = 0;
        this.beta = Math.PI/2;
        // factor con el que se mueve la camara
        this.speedFactor = 0.01;
    }

    getViewMatrix() {
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.getPosition(), this.target, vec3.fromValues(0,1,0));
        return viewMatrix;
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
        return vec3.fromValues(
            this.radius * Math.sin(this.alpha) * Math.sin(this.beta),
            this.radius * Math.cos(this.beta),
            this.radius * Math.cos(this.alpha) * Math.sin(this.beta)
        )
    }

    zoomIn() {
        this.radius = Math.min(Math.max(this.initialRadius*0.5, this.radius - this.initialRadius*0.1), this.initialRadius*2);
    }

    zoomOut() {
        this.radius = Math.min(Math.max(this.initialRadius*0.5, this.radius + this.initialRadius*0.1), this.initialRadius*2);
    }
}