
class OrbitalCamera {
    constructor(radio, target) {
        this.radio = radio;
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
            this.radio * Math.sin(this.alpha) * Math.sin(this.beta),
            this.radio * Math.cos(this.beta),
            this.radio * Math.cos(this.alpha) * Math.sin(this.beta)
        )
    }
}