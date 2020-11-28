var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;

var gl = null,
    canvas = null,
    glProgram = null,
    fragmentShader = null,
    vertexShader = null,
    vertexShaderSource = null,
    fragmentShaderSource = null;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexNormalAttribute = null,
    trianglesNormalBuffer = null,
    trianglesIndexBuffer = null;

var modelMatrix = mat4.create();
var camera = null;
var keyboardAndMouseEvents = null;
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotate_angle = -1.57078;

var helicopter, esfera;


function initWebGL(){
    canvas = document.getElementById("my-canvas");
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
    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 100.0);

    mat4.identity(modelMatrix);

    camera = new OrbitalCamera(5, vec3.fromValues(0, 0, 0));
    keyboardAndMouseEvents = new KeyboardAndMouseEvents();
}

function loadShadersAndInitWebGL(){
    $.when(loadVS(), loadFS()).done(function(res1,res2){
        initWebGL();
    });

    function loadVS() {
        return  $.ajax({
            url: "shaders/vertex-shader.glsl",
            success: function(result){
                console.log('vertex shader load');
                vertexShaderSource=result;
            }
        });
    }

    function loadFS() {
        return  $.ajax({
            url: "shaders/fragment-shader.glsl",
            success: function(result){
                console.log('fragment shader load');
                fragmentShaderSource=result;
            }
        });
    }
}

function initShaders() {
    //compile shaders
    vertexShader = makeShader(vertexShaderSource, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    //create program
    glProgram = gl.createProgram();

    //attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    //use program
    gl.useProgram(glProgram);

    glProgram.vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(glProgram.vertexPositionAttribute);
    glProgram.vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
    gl.enableVertexAttribArray(glProgram.vertexNormalAttribute);
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
    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, camera.getViewMatrix());
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function drawScene(){
    //setupVertexShaderMatrix();
    helicopter.draw();
    //mat4.translate(modelMatrix, modelMatrix, [2.0, 0.0, 0.0]);
    //setupVertexShaderMatrix();
    //esfera.draw();
    /*
    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
    gl.enableVertexAttribArray(vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesNormalBuffer);
    gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesIndexBuffer);
    gl.drawElements( gl.TRIANGLE_STRIP, trianglesIndexBuffer.number_vertex_point, gl.UNSIGNED_SHORT, 0);*/
}

function animate(){
    keyboardAndMouseEvents.handler();
    let viewMatrix = camera.getViewMatrix();

    mat4.identity(modelMatrix);
    helicopter.setM(modelMatrix);

    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
}

function tick(){
    requestAnimationFrame(tick);
    drawScene();
    animate();
}

function createObjects3D() {
    helicopter = new Helicopter(modelMatrix);
    //esfera = new Sphere(modelMatrix);
}

function updateModelMatrix(newModelMatriz) {
    modelMatrix = newModelMatriz;
}