class CameraController {
    constructor(camera) {
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.isMouseDown = false;
        this.mouse = {x: 0, y: 0};
        this.camera = camera;

        let body = $("body");
        body.mousemove(function(e){
            this.mouse.x = e.clientX || e.pageX;
            this.mouse.y = e.clientY || e.pageY
        }.bind(this));

        body.mousedown(function(event){
            this.isMouseDown = true;
        }.bind(this));

        body.mouseup(function(event){
            this.isMouseDown = false;
            this.previousClientX = 0;
            this.previousClientY = 0;
        }.bind(this));

        body.on('wheel mousewheel', function(event){
            if(event.originalEvent.deltaY < 0){
                this.camera.zoomIn();
            }
            else {
                this.camera.zoomOut();
            }
        }.bind(this));
    }

    update() {
        if(this.isMouseDown) this.rotateCamera();
    };

    rotateCamera() {
        let deltaX=0;
        let deltaY=0;
        if (this.previousClientX) deltaX = this.mouse.x - this.previousClientX;
        if (this.previousClientY) deltaY = this.mouse.y - this.previousClientY;

        this.previousClientX = this.mouse.x;
        this.previousClientY = this.mouse.y;

        if (deltaX !== 0 || deltaY !== 0) {
            this.camera.increaseAlpha(deltaX);
            this.camera.increaseBeta(deltaY);
        }
    }
}
