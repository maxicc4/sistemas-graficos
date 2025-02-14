var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;
var vec2=glMatrix.vec2;

var gl = null,
    canvas = null,
    glProgram = null,
    glProgramTerrain = null,
    glProgramWater = null,
    glProgramSky = null,
    lighting = true;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexNormalAttribute = null,
    trianglesNormalBuffer = null,
    trianglesIndexBuffer = null;

var modelMatrix = mat4.create();
var cameraControllerInstance = null;
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;

var helicopterContainer, terrain, heliport;

var helicopterControllerInstance;


function initWebGL(){
    canvas = document.getElementById("my-canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    try{
        gl = canvas.getContext("webgl");
    }catch(e){
        alert(  "Error: Your browser does not appear to support WebGL.");
    }

    if(gl) {
        setupWebGL();
        initShaders();
        createObjects3D();
        setupVertexShaderMatrix();
        tick();
    }else{
        alert(  "Error: Your browser does not appear to support WebGL.");
    }
}

function setupWebGL(){
    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    gl.clearColor(0.1, 0.1, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva
    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 900.0);

    mat4.identity(modelMatrix);
}

function initShaders() {
    //compile shaders
    let vertexShader = makeShader($("#vertex-shader").text(), gl.VERTEX_SHADER);
    let vertexShaderTerrain = makeShader($("#vertex-shader-terrain").text(), gl.VERTEX_SHADER);
    let vertexShaderSky = makeShader($("#vertex-shader-sky").text(), gl.VERTEX_SHADER);
    let fragmentShader = makeShader($("#fragment-shader").text(), gl.FRAGMENT_SHADER);
    let fragmentShaderTerrain = makeShader($("#fragment-shader-terrain").text(), gl.FRAGMENT_SHADER);
    let fragmentShaderWater = makeShader($("#fragment-shader-water").text(), gl.FRAGMENT_SHADER);
    let fragmentShaderSky = makeShader($("#fragment-shader-sky").text(), gl.FRAGMENT_SHADER);

    //create program
    glProgram = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader glProgram.");
    }
    gl.useProgram(glProgram);
    glProgram.vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);
    glProgram.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
    gl.enableVertexAttribArray(glProgram.vertexNormalAttribute);
    glProgram.vertexUVAttribute = gl.getAttribLocation(glProgram, "aUV");
    gl.enableVertexAttribArray(glProgram.vertexUVAttribute);


    glProgramTerrain = gl.createProgram();
    gl.attachShader(glProgramTerrain, vertexShaderTerrain);
    gl.attachShader(glProgramTerrain, fragmentShaderTerrain);
    gl.linkProgram(glProgramTerrain);
    if (!gl.getProgramParameter(glProgramTerrain, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader glProgramTerrain.");
    }
    gl.useProgram(glProgramTerrain);
    glProgramTerrain.vertexPositionAttribute = gl.getAttribLocation(glProgramTerrain, "aVertexPosition");
    gl.enableVertexAttribArray(glProgramTerrain.vertexPositionAttribute);
    glProgramTerrain.vertexUVAttribute = gl.getAttribLocation(glProgramTerrain, "aUV");
    gl.enableVertexAttribArray(glProgramTerrain.vertexUVAttribute);

    glProgramWater = gl.createProgram();
    gl.attachShader(glProgramWater, vertexShader);
    gl.attachShader(glProgramWater, fragmentShaderWater);
    gl.linkProgram(glProgramWater);
    if (!gl.getProgramParameter(glProgramWater, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader glProgramWater.");
    }
    gl.useProgram(glProgramWater);
    glProgramWater.vertexPositionAttribute = gl.getAttribLocation(glProgramWater, "aVertexPosition");
    gl.enableVertexAttribArray(glProgramWater.vertexPositionAttribute);
    glProgramWater.vertexNormalAttribute = gl.getAttribLocation(glProgramWater, "aVertexNormal");
    gl.enableVertexAttribArray(glProgramWater.vertexNormalAttribute);
    glProgramWater.vertexUVAttribute = gl.getAttribLocation(glProgramWater, "aUV");
    gl.enableVertexAttribArray(glProgramWater.vertexUVAttribute);

    glProgramSky = gl.createProgram();
    gl.attachShader(glProgramSky, vertexShaderSky);
    gl.attachShader(glProgramSky, fragmentShaderSky);
    gl.linkProgram(glProgramSky);
    if (!gl.getProgramParameter(glProgramSky, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader glProgramSky.");
    }
    gl.useProgram(glProgramSky);
    glProgramSky.vertexPositionAttribute = gl.getAttribLocation(glProgramSky, "aVertexPosition");
    gl.enableVertexAttribArray(glProgramSky.vertexPositionAttribute);
    glProgramSky.vertexUVAttribute = gl.getAttribLocation(glProgramSky, "aUV");
    gl.enableVertexAttribArray(glProgramSky.vertexUVAttribute);

    gl.useProgram(glProgram);
}

function makeShader(src, type){
    //compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function setupVertexShaderMatrix(){
    var modelMatrixUniform = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "normalMatrix");
    var cameraPositionUniform = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "uCameraPosition");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, cameraControllerInstance.getCamera().getViewMatrix());
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
    gl.uniform3fv(cameraPositionUniform, cameraControllerInstance.getCamera().getPosition());
}

function drawScene(){
    //setupVertexShaderMatrix();
    helicopterContainer.draw();
    terrain.draw();
    heliport.draw();
}

function animate(){
    helicopterControllerInstance.update();
    cameraControllerInstance.update();

    let posTerrain = terrain.getPosition();
    let posHelicopter = helicopterContainer.getPosition();
    let sizePlot = terrain.getPlotSizeInWorld();
    let halfSizePlot = sizePlot/2;
    if ( posTerrain[0]-posHelicopter[0] > halfSizePlot ) {
        posHelicopter[0] = posHelicopter[0] + sizePlot;
        helicopterControllerInstance.setPosition(posHelicopter);
        terrain.decreaseOffsetU();
        heliport.translate(vec3.fromValues(0,0,sizePlot));
    } else if(posTerrain[0]-posHelicopter[0] < -halfSizePlot) {
        posHelicopter[0] = posHelicopter[0] - sizePlot;
        helicopterControllerInstance.setPosition(posHelicopter);
        terrain.increaseOffsetU();
        heliport.translate(vec3.fromValues(0,0,-sizePlot));
    }
    if ( posTerrain[2]-posHelicopter[2] > halfSizePlot ) {
        posHelicopter[2] = posHelicopter[2] + sizePlot;
        helicopterControllerInstance.setPosition(posHelicopter);
        terrain.decreaseOffsetV();
        heliport.translate(vec3.fromValues(-sizePlot,0,0));
    } else if(posTerrain[2]-posHelicopter[2] < -halfSizePlot) {
        posHelicopter[2] = posHelicopter[2] - sizePlot;
        helicopterControllerInstance.setPosition(posHelicopter);
        terrain.increaseOffsetV();
        heliport.translate(vec3.fromValues(sizePlot,0,0));
    }

    /*let newModelMatrix = mat4.create();
    mat4.identity(newModelMatrix);
    helicopterContainer.setM(newModelMatrix);
    updateModelMatrix(newModelMatrix);*/
}

function tick(){
    requestAnimationFrame(tick);
    drawScene();
    animate();
}

function createObjects3D() {
    helicopterContainer = new HelicopterContainer(modelMatrix);
    helicopterControllerInstance = new HelicopterController(helicopterContainer);
    let mTerrain = mat4.create();
    mat4.translate(mTerrain, modelMatrix, [0, -CABIN_HEIGHT, 0]);
    terrain = new Terrain(mTerrain);
    let mHeliport = mat4.create();
    let initialPosHeliport = helicopterControllerInstance.getPosition();
    initialPosHeliport[1] -= 0.76;
    mat4.translate(mHeliport, mTerrain, initialPosHeliport);
    mat4.rotate(mHeliport, mHeliport, Math.PI/2, [0, 1, 0]);
    heliport = new Heliport(mHeliport);

    cameraControllerInstance = new CameraController( new OrbitalCamera(5, helicopterContainer) );
}

function updateModelMatrix(newModelMatriz) {
    modelMatrix = newModelMatriz;

    // se actualiza la matriz de normales
    let viewMatrix = cameraControllerInstance.getCamera().getViewMatrix();
    mat4.identity(normalMatrix);
    //mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, modelMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
}
