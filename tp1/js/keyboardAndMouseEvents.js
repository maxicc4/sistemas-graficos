class KeyboardAndMouseEvents {
    constructor() {
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.isMouseDown = false;
        this.mouse = {x: 0, y: 0};

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

        body.on("keydown",function(event){
            console.log(event);

            if (event.keyCode===67){
                alert ("presionaron la tecla C !!!")
            }

        }.bind(this));
    }

    handler() {
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
            camera.increaseAlpha(deltaX);
            camera.increaseBeta(deltaY);
        }
    }
}
