var app = (function () {
  let gl;

  // The shader program object is also used to
  // store attribute and uniform locations.
  let prog;

  // Array of model objects.
  const models = [];

  // Model that is target for user input.
  let torus;

  const camera = {
    // Initial position of the camera.
    eye: [0, 1, 4],
    // Point to look at.
    center: [0, 0, 0],
    // Roll and pitch of the camera.
    up: [0, 1, 0],
    // Opening angle given in radian.
    // radian = degree*2*PI/360.
    fovy: (60.0 * Math.PI) / 180,
    // Camera near plane dimensions:
    // value for left right top bottom in projection.
    lrtb: 2.0,
    // View matrix.
    vMatrix: mat4.create(),
    // Projection matrix.
    pMatrix: mat4.create(),
    // Projection types: ortho, perspective, frustum.
    projectionType: 'perspective',
    // Angle to Z-Axis for camera when orbiting the center
    // given in radian.
    zAngle: 0,
    // Distance in XZ-Plane from center when orbiting.
    distance: 4,

    u: 1,
  };

  function start() {
    init();
    render();
  }

  /**
   * Init ea6 models, camera, webgl context, and key-event handler.
   */
  function init() {
    initWebGL();
    initShaderProgram();
    initUniforms();
    initModels();
    initEventHandler();
    initPipline();
  }

  /**
   * Init WebGL context on canvas with id='ea6canvas' and set viewportWidth and -Height.
   */
  function initWebGL() {
    // Get canvas and WebGL context.
    const canvas = document.getElementById('ea6canvas');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  }

  /**
   * Init pipeline parameters that will not change again.
   * If projection or viewport change, their setup must
   * be in render function.
   */
  function initPipline() {
    // setup
    gl.clearColor(0.764, 0.925, 0.917, 1); // Clear background default color
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK); // or gl.FRONT

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.5, 0);

    // Set viewport.
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // Init camera.
    // Set projection aspect ratio.
    camera.aspect = gl.viewportWidth / gl.viewportHeight;
  }

  /**
   * Init vertex- and fragment shader with code in ea6.html
   * script elements with ids 'vertexshader' and 'fragmentshader'.
   */
  function initShaderProgram() {
    // Init vertex shader.
    const vs = initShader(gl.VERTEX_SHADER, 'vertexshader');
    // Init fragment shader.
    const fs = initShader(gl.FRAGMENT_SHADER, 'fragmentshader');
    // Link shader into a shader program.
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'aPosition');
    gl.linkProgram(prog);
    gl.useProgram(prog);
  }

  /**
   * Create and init shader from source.
   *
   * @parameter shaderType: openGL shader type.
   * @parameter SourceTagId: Id of HTML Tag with shader source.
   * @returns shader object.
   */
  function initShader(shaderType, SourceTagId) {
    const shader = gl.createShader(shaderType);
    const shaderSource = document.getElementById(SourceTagId).text;
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(SourceTagId + ': ' + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  /**
   * Set program projection- and model-view-matrix.
   */
  function initUniforms() {
    // Projection Matrix.
    prog.pMatrixUniform = gl.getUniformLocation(prog, 'uPMatrix');

    // Model-View-Matrix.
    prog.mvMatrixUniform = gl.getUniformLocation(prog, 'uMVMatrix');

    // Color Vec4.
    prog.colorUniform = gl.getUniformLocation(prog, 'uColor');
  }

  /**
   * Create plane, torus, and 4 spheres and fill models array.
   * Calculates position of spheres and torus for the first animation frame.
   */
  function initModels() {
    // fillstyle
    const fs = 'fillwireframe',
      ws = 'wireframe';

    // color names according to 335u.net
    const colors = {
      grey: [0, 0, 0, 0.4],
      black: [0, 0, 0, 1],
      white: [1, 1, 1, 1],
      ultramarine: [0.23, 0.46, 1, 1],
      rackley: [0.35, 0.63, 0.5, 1],
      icterine: [1, 1, 0.5, 1],
      malachite: [0, 1, 0.35, 1],
    };

    createModel('torus', fs, colors.white, [0, 0, 0], [0, 0, 0], [1, 1, 1], 0);
    createModel('plane', ws, colors.grey, [0, -0.8, 0], [0, 0, 0], [1, 1, 1]);
    createModel(
      'sphere',
      fs,
      colors.ultramarine,
      [0, 0, 0],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      45,
    );
    createModel(
      'sphere',
      fs,
      colors.rackley,
      [0, 0, 0],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      135,
    );
    createModel(
      'sphere',
      fs,
      colors.icterine,
      [0, 0, 0],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      225,
    );
    createModel(
      'sphere',
      fs,
      colors.malachite,
      [0, 0, 0],
      [0, 0, 0],
      [0.5, 0.5, 0.5],
      315,
    );

    // Select one model that can be manipulated interactively by user.
    torus = models[0];
    calculateSpherePositions();
    calculateTorusPosition();
  }

  function calculateSpherePositions() {
    for (let i = 2; i < models.length; i++) {
      const x = Math.cos((models[i].angle * Math.PI) / 180);
      const y = models[i].translate[1];
      const z = Math.sin((models[i].angle * Math.PI) / 180);
      models[i].translate = [x, y, z];
      models[i].rotate[1] = ((models[i].angle / -1) * Math.PI) / 180;
      models[i].angle += 15;
    }
  }

  function calculateTorusPosition() {
    const xt = 0;
    const yt = Math.cos((torus.angle * Math.PI) / 180);
    const zt = Math.sin((torus.angle * Math.PI) / 180);
    const xr = (torus.angle * Math.PI) / 180;
    const yr = 0;

    torus.translate = [xt, yt, zt];
    torus.rotate[0] = xr;
    torus.rotate[1] = yr;
    torus.angle += 30;
  }

  /**
   * Create model object, fill it and push it in models array.
   *
   * @parameter geometryname: string with name of geometry.
   * @parameter fillstyle: wireframe, fill, fillwireframe.
   */
  function createModel(
    geometryname,
    fillstyle,
    color,
    translate,
    rotate,
    scale,
    angle,
  ) {
    const model = {};
    model.fillstyle = fillstyle;
    model.color = color;
    initDataAndBuffers(model, geometryname);
    initTransformations(model, translate, rotate, scale);
    model.angle = angle;
    models.push(model);
  }

  /**
   * Set scale, rotation and transformation for model.
   */
  function initTransformations(model, translate, rotate, scale) {
    // Store transformation vectors.
    model.translate = translate;
    model.rotate = rotate;
    model.scale = scale;

    // Create and initialize Model-Matrix.
    model.mMatrix = mat4.create();

    // Create and initialize Model-View-Matrix.
    model.mvMatrix = mat4.create();
  }

  /**
   * Init data and buffers for model object.
   *
   * @parameter model: a model object to augment with data.
   * @parameter geometryname: string with name of geometry.
   */
  function initDataAndBuffers(model, geometryname) {
    // Provide model object with vertex data arrays.
    // Fill data arrays for Vertex-Positions, Normals, Index data:
    // vertices, normals, indicesLines, indicesTris;
    // Pointer this refers to the window.
    this[geometryname]['createVertexData'].apply(model);

    // Setup position vertex buffer object.
    model.vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
    // Bind vertex buffer to attribute variable.
    prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(prog.positionAttrib);

    // Setup normal vertex buffer object.
    model.vboNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
    gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
    // Bind buffer to attribute variable.
    prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
    gl.enableVertexAttribArray(prog.normalAttrib);

    // Setup lines index buffer object.
    model.iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines, gl.STATIC_DRAW);
    model.iboLines.numberOfElements = model.indicesLines.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup triangle index buffer object.
    model.iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris, gl.STATIC_DRAW);
    model.iboTris.numberOfElements = model.indicesTris.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  /**
   * Init a window.onkeydown function to handle keypresses to change
   * models and camera attributes.
   */
  function initEventHandler() {
    // Rotation step.
    const deltaRotate = Math.PI / 36;
    const deltaTranslate = 0.05;

    window.onkeydown = function (evt) {
      const key = evt.which ? evt.which : evt.keyCode;
      const c = String.fromCharCode(key);
      // console.log(evt);
      // Use shift key to change sign.
      const sign = evt.shiftKey ? -1 : 1;

      // Change projection of scene.
      switch (c) {
        case 'O':
          camera.projectionType = 'ortho';
          camera.lrtb = 2;
          break;
        case 'F':
          camera.projectionType = 'frustum';
          camera.lrtb = 1.2;
          break;
        case 'P':
          camera.projectionType = 'perspective';
          break;
      }
      // Camera move and orbit.
      switch (c) {
        case 'C':
          // Orbit camera.
          camera.zAngle += sign * deltaRotate;
          break;
        case 'H':
          // Move camera up and down.
          camera.eye[1] += sign * deltaTranslate;
          break;
        case 'D':
          // Camera distance to center.
          camera.distance += sign * deltaTranslate;
          break;
        case 'V':
          // Camera fovy in radian.
          camera.fovy += (sign * 5 * Math.PI) / 180;
          break;
        case 'B':
          // Camera near plane dimensions.
          camera.lrtb += sign * 0.1;
          break;
      }
      // Rotate interactive Model.
      switch (c) {
        case 'T':
          torus.rotate[0] += sign * deltaRotate;
          break;
        case 'Z':
          torus.rotate[1] += sign * deltaRotate;
          break;
        case 'U':
          torus.rotate[2] += sign * deltaRotate;
          break;
        case 'K':
          camera.u += 0.5;
          calculateSpherePositions();
          calculateTorusPosition();
          break;
      }
      // Render the scene again on any key pressed.
      render();
    };
  }

  /**
   * Run the rendering pipeline.
   */
  function render() {
    // Clear framebuffer and depth-/z-buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setProjection();

    calculateCameraOrbit();

    // Set view matrix depending on camera.
    mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

    // Loop over models.
    for (const model of models) {
      // Update modelview for model.
      updateTransformations(model);

      // Set uniforms for model.
      gl.uniform4fv(prog.colorUniform, model.color);
      gl.uniformMatrix4fv(prog.mvMatrixUniform, false, model.mvMatrix);

      draw(model);
    }
  }

  function calculateCameraOrbit() {
    // Calculate x,z position/eye of camera orbiting the center.
    const x = 0,
      z = 2;
    camera.eye[x] = camera.center[x];
    camera.eye[z] = camera.center[z];
    camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
    camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
  }

  function setProjection() {
    // Set projection Matrix.
    const v = camera.lrtb;
    switch (camera.projectionType) {
      case 'ortho':
        mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
        break;
      case 'frustum':
        mat4.frustum(camera.pMatrix, -v / 2, v / 2, -v / 2, v / 2, 1, 10);
        break;
      case 'perspective':
        mat4.perspective(camera.pMatrix, camera.fovy, camera.aspect, 1, 10);
        break;
    }
    // Set projection uniform.
    gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
  }

  /**
   * Update model-view matrix for model.
   */
  function updateTransformations(model) {
    // Use shortcut variables.
    let mMatrix = model.mMatrix;
    let mvMatrix = model.mvMatrix;

    //mat4.copy(mvMatrix, camera.vMatrix);
    // Reset matrices to identity.
    mat4.identity(mMatrix);
    mat4.identity(mvMatrix);

    // Translate.
    mat4.translate(mMatrix, mMatrix, model.translate);

    // Rotate.
    mat4.rotateX(mMatrix, mMatrix, model.rotate[0]);
    mat4.rotateY(mMatrix, mMatrix, model.rotate[1]);
    mat4.rotateZ(mMatrix, mMatrix, model.rotate[2]);

    // Scale
    mat4.scale(mMatrix, mMatrix, model.scale);

    // Combine view and model matrix
    // by matrix multiplication to mvMatrix.
    mat4.multiply(mvMatrix, camera.vMatrix, mMatrix);
  }

  function draw(model) {
    // Setup position VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
    gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // Setup normal VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
    gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

    // Setup rendering tris.
    const fill = model.fillstyle.search(/fill/) != -1;
    if (fill) {
      gl.enableVertexAttribArray(prog.normalAttrib);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
      gl.drawElements(
        gl.TRIANGLES,
        model.iboTris.numberOfElements,
        gl.UNSIGNED_SHORT,
        0,
      );
    }

    // Setup rendering lines.
    const wireframe = model.fillstyle.search(/wireframe/) != -1;
    if (wireframe) {
      gl.disableVertexAttribArray(prog.normalAttrib);
      gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
      gl.drawElements(
        gl.LINES,
        model.iboLines.numberOfElements,
        gl.UNSIGNED_SHORT,
        0,
      );
    }
  }

  // App interface.
  return {
    start: start,
  };
})();
