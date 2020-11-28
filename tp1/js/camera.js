
class Camera {
    constructor(position, target) {
        this.position = position;
        this.target = target;
    }

    getViewMatrix() {
        let viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.position, this.target, [0,1,0]);
        return viewMatrix;
    }

    setPosition(position) {
        this.position = position;
    }
}