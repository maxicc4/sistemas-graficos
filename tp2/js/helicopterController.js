class HelicopterController {
    constructor(helicopterContainer) {
        this.helicopterContainer = helicopterContainer;

        this.xArrow=0;
        this.yArrow=0;
        this.zArrow=0;
        this.upArm=false;  // para subir y bajar los brazos

        this.altitudeInertia=0.01;
        this.speedInertia=0.1;
        this.angleInertia=0.02;

        this.deltaAltitude=1;
        this.deltaSpeed=0.01;
        this.deltaAngle=0.03;
        this.deltaArmAngle=0.01;

        this.maxSpeed=1;
        this.maxAltitude=CABIN_HEIGHT*120;
        this.minAltitude=3.8;

        this.position = vec3.fromValues(100,this.minAltitude,-120);
        this.helicopterContainer.setPosition(this.position);

        this.speed=0;
        this.altitude=this.minAltitude;
        this.angle=0;

        this.pitch=0;
        this.roll=0;

        this.angleTarget=0;
        this.altitudeTarget=this.minAltitude;
        this.speedTarget=0;
        this.armAngle = 0;

        let body = $("body");

        body.keydown(function(e){
            let handled = true;
            switch(e.key.toUpperCase()){
                case "W":
                    this.xArrow=1;
                    break;
                case "S":
                    this.xArrow=-1;
                    break;
                case "A":
                    this.zArrow=1;
                    break;
                case "D":
                    this.zArrow=-1;
                    break;
                case "E":
                    this.yArrow=1;
                    break;
                case "Q":
                    this.yArrow=-1;
                    break;
                case "H":
                    this.upArm=!this.upArm;
                    break;
                default:
                    handled = false;
            }
            if (handled) {
                e.preventDefault();
            }
        }.bind(this));

        body.keyup(function(e){
            let handled = true;
            switch(e.key.toUpperCase()){
                case "W":
                case "S":
                    this.xArrow=0;
                    break;
                case "A":
                case "D":
                    this.zArrow=0;
                    break;
                case "E":
                case "Q":
                    this.yArrow=0;
                    break;
                case "H":
                default:
                    handled = false;
            }
            if (handled) {
                e.preventDefault();
            }
        }.bind(this));
    }



    update() {
        if (this.xArrow!==0) {
            this.speedTarget+=this.xArrow*this.deltaSpeed;
        } else {
            this.speedTarget+=(0-this.speedTarget)*this.deltaSpeed;
        }

        this.speedTarget=Math.max(-this.maxAltitude,Math.min(this.maxSpeed,this.speedTarget));

        let speedSign=1;
        if (this.speed<0) speedSign=-1

        if (this.zArrow!==0) {
            this.angleTarget+=this.zArrow*this.deltaAngle*speedSign;
        }        
        let angleRotationBlades = 0;
        if (this.yArrow!==0) {
            this.altitudeTarget+=this.yArrow*this.deltaAltitude;
            this.altitudeTarget=Math.max(this.minAltitude,Math.min(this.maxAltitude,this.altitudeTarget));
            angleRotationBlades += 0.128;
        }

        this.roll=-(this.angleTarget-this.angle)*0.4;
        this.pitch=-Math.max(-0.5,Math.min(0.5,this.speed));

        this.speed+=(this.speedTarget-this.speed)*this.speedInertia;
        this.altitude+=(this.altitudeTarget-this.altitude)*this.altitudeInertia;
        this.angle+=(this.angleTarget-this.angle)*this.angleInertia;


        let directionX=Math.cos(-this.angle)*this.speed;
        let directionZ=Math.sin(-this.angle)*this.speed;

        this.position[0] += directionX;
        this.position[2] += directionZ;
        this.position[1] = this.altitude;

        // se actualizan las posiciones y las rotaciones de helicopterContainer
        this.helicopterContainer.setYaw(this.getYaw());
        this.helicopterContainer.setPitch(this.getPitch());
        this.helicopterContainer.setRoll(this.getRoll());

        let p = this.getPosition();
        this.helicopterContainer.setPosition(p);

        angleRotationBlades += 0.6*this.speed;
        this.helicopterContainer.setBladeRotation(angleRotationBlades);
        this.helicopterContainer.setPropellerRotation(0.5*Math.PI*this.speed);
        
        if (this.upArm) {
            this.armAngle += this.deltaArmAngle;
            if (this.armAngle > Math.PI*0.5) {
                this.armAngle = Math.PI*0.5;
            }
        } else {
            this.armAngle -= this.deltaArmAngle;
            if (this.armAngle < 0) {
                this.armAngle = 0;
            }
        }
        this.helicopterContainer.setArmAngle(this.armAngle);
    }

    getPosition() {
        return this.position;
    }

    setPosition(p) {
        this.position = p;
        this.helicopterContainer.setPosition(p);
    }

    getYaw() {
        return this.angle;
    }

    getRoll() {
        return this.roll;
    }

    getPitch() {
        return this.pitch;
    }

    getSpeed() {
        return this.speed;
    }

    getInfo() {

        let out="";

        out+=   " speedTarget: "+this.speedTarget.toFixed(2)+"<br>";
        out+=   " altitudeTarget: "+this.altitudeTarget.toFixed(2)+"<br>";
        out+=   " angleTarget: "+this.angleTarget.toFixed(2)+"<br><br>";

        out+=   " speed: "+this.speed.toFixed(2)+"<br>";
        out+=   " altitude: "+this.altitude.toFixed(2)+"<br><br>";


        out+=   " xArrow: "+this.xArrow.toFixed(2)+"<br>";
        out+=   " yArrow: "+this.yArrow.toFixed(2)+"<br>";
        out+=   " zArrow: "+this.zArrow.toFixed(2)+"<br><br>";

        out+=   " yaw: "+this.angle.toFixed(2)+"<br>";
        out+=   " pitch: "+this.pitch.toFixed(2)+"<br>";
        out+=   " roll: "+this.roll.toFixed(2)+"<br>";


        return out;
    }
}