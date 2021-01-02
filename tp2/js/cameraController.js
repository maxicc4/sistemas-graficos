class CameraController {
    constructor(camera) {
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.isMouseDown = false;
        this.mouse = {x: 0, y: 0};
        this.camera = camera;
        this.initialRadiusCamera = this.camera.getRadius();

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

        body.keydown(function(e){
            let handled = true;
            switch(e.key.toUpperCase()){
                case "1":
                    this.camera = new OrbitalCamera(this.initialRadiusCamera, this.camera.getTarget());
                    break;
                case "2":
                    this.camera = new RearTrackingCamera(this.initialRadiusCamera, this.camera.getTarget());
                    break;
                case "3":
                    this.camera = new SideTrackingCamera(this.initialRadiusCamera, this.camera.getTarget());
                    break;
                case "4":
                    this.camera = new UpperTrackingCamera(this.initialRadiusCamera, this.camera.getTarget());
                    break;
                default:
                    handled = false;
            }
            if (handled) {
                e.preventDefault();
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

    getCamera() {
        return this.camera;
    }
}
