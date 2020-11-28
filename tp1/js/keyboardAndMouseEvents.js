class KeyboardAndMouseEvents {
    constructor() {
        this.previousClientX = 0;
        this.previousClientY = 0;
        this.radio = 5;
        this.alfa = 0;
        this.beta = Math.PI/2;
        this.factorVelocidad = 0.01;

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
            this.alfa = this.alfa + deltaX * this.factorVelocidad;
            this.beta = this.beta + deltaY * this.factorVelocidad;

            if (this.beta <= 0) this.beta = 0.01;
            if (this.beta > Math.PI) this.beta = Math.PI;

            camera.setPosition(
                vec3.fromValues(
                    this.radio * Math.sin(this.alfa) * Math.sin(this.beta),
                    this.radio * Math.cos(this.beta),
                    this.radio * Math.cos(this.alfa) * Math.sin(this.beta)
                )
            );
        }
    }
}
