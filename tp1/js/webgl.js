var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;

var gl = null,
    canvas = null,
    glProgram = null,
    glProgramTerrain = null,
    vertexShaderSource = null,
    vertexShaderTerrainSource = null,
    fragmentShaderSource = null,
    fragmentShaderTextureSource = null;

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

var helicopterContainer, aleta, terrain;

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
        createAndLoadTextures();
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
}

function loadShadersAndInitWebGL(){
    $.when(loadVS(), loadVSTerrain(), loadFS(), loadFSTexture()).done(function(res1,res2){
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

    function loadVSTerrain() {
        return  $.ajax({
            url: "shaders/vertex-shader-terrain.glsl",
            success: function(result){
                console.log('vertex shader terrain load');
                vertexShaderTerrainSource=result;
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

    function loadFSTexture() {
        return  $.ajax({
            url: "shaders/fragment-shader-texture.glsl",
            success: function(result){
                console.log('fragment shader texture load');
                fragmentShaderTextureSource=result;
            }
        });
    }
}

function initShaders() {
    //compile shaders
    let vertexShader = makeShader(vertexShaderSource, gl.VERTEX_SHADER);
    let vertexShaderTerrain = makeShader(vertexShaderTerrainSource, gl.VERTEX_SHADER);
    let fragmentShader = makeShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    let fragmentShaderTexture = makeShader(fragmentShaderTextureSource, gl.FRAGMENT_SHADER);

    //create program
    glProgram = gl.createProgram();
    glProgramTerrain = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.attachShader(glProgramTerrain, vertexShaderTerrain);
    gl.attachShader(glProgramTerrain, fragmentShaderTexture);

    let programs = [glProgram, glProgramTerrain];

    for (let i=0; i < programs.length; i++) {
        gl.linkProgram(programs[i]);

        if (!gl.getProgramParameter(programs[i], gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program."+i);
        }

        gl.useProgram(programs[i]);
        programs[i].vertexPositionAttribute = gl.getAttribLocation(programs[i], "aVertexPosition");
        gl.enableVertexAttribArray(programs[i].vertexPositionAttribute);
        programs[i].vertexNormalAttribute = gl.getAttribLocation(programs[i], "aVertexNormal");
        gl.enableVertexAttribArray(programs[i].vertexNormalAttribute);
        programs[i].vertexUVAttribute = gl.getAttribLocation(programs[i], "aUV");
        gl.enableVertexAttribArray(programs[i].vertexUVAttribute);
    }

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

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, cameraControllerInstance.getCamera().getViewMatrix());
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
}

function drawScene(){
    //setupVertexShaderMatrix();
    helicopterContainer.draw();
    aleta.draw();
    gl.useProgram(glProgramTerrain);
    terrain.draw();
    gl.useProgram(glProgram);
}

function animate(){
    helicopterControllerInstance.update();
    cameraControllerInstance.update();

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

    cameraControllerInstance = new CameraController( new OrbitalCamera(5, helicopterContainer) );

    let mAleta = mat4.create();
    mat4.translate(mAleta, modelMatrix, [-2, 0, -5]);
    aleta = new Fin(mAleta);
}

function updateModelMatrix(newModelMatriz) {
    modelMatrix = newModelMatriz;

    // se actualiza la matriz de normales
    let viewMatrix = cameraControllerInstance.getCamera().getViewMatrix();
    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
}

function createAndLoadTextures() {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    let image = new Image();
    image.src = "img/heightmap2.png";
    image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        console.log('textura cargada');
    });
}