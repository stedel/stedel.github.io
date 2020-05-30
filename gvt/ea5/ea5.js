$(document).ready(function () {
  let circle;
  let depth = 3;
  let mvMatrix = mat4.create();
  let pMatrix = mat4.create();
  let rPyramid = 0;
  let rotation = [0, 1, 0];
  let direction = { type: 'z' };
  let wireFrame = true;

  /**
   *
   * @type {{
   * eye: number[], Initial position of the camera
   * center: number[], Point to look at
   * up: number[], Roll and pitch of the camera
   * fovy: number, Opening angle given in radian. radian = degree*2*PI/360
   * lrtb: number, Camera near plane dimensions: value for left right top bottom in projection
   * vMatrix, View matrix
   * pMatrix, Projection matrix
   * projectionType: string, Projection types: ortho, perspective, frustum
   * zAngle: number, Angle to Z-Axis for camera when orbiting the center given in radian
   * xAngle: number,
   * yAngle: number,
   * distance: number Distance in XZ-Plane from center when orbiting
   * }}
   */
  let camera = {
    eye: [0, 1, 1],
    center: [0, 0, 0],
    up: [0, 1, 0],
    fovy: (60.0 * Math.PI) / 180,
    lrtb: 2.0,
    vMatrix: mat4.create(),
    pMatrix: mat4.create(),
    projectionType: 'ortho',
    zAngle: 0,
    xAngle: 0,
    yAngle: 0,
    distance: 4,
  };

  initGLCanvas('spherecanvas');

  /**
   * Initialisiert die Anwendung
   *
   * @param canvasName der Name des Canvas
   */
  function initGLCanvas(canvasName) {
    let canvas = document.getElementById(canvasName);

    initOnKeyDownEventHandler();

    initWebGL(canvas);
    if (gl) {
      // setup
      gl.clearColor(0.764, 0.925, 0.917, 1); // Clear background default color
      gl.clearDepth(1.0); // Clear everything
      gl.enable(gl.DEPTH_TEST); // Enable depth testing
      gl.depthFunc(gl.LEQUAL); // Near things obscure far things
      // Backface culling.
      gl.frontFace(gl.CCW);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK); // or gl.FRONT

      gl.enable(gl.DEPTH_TEST);
      //gl.depthFunc(gl.LESS);

      // Polygon offset of rastered Fragments.
      gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.polygonOffset(0.5, 0);

      // Set viewport.
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

      // Init camera.
      // Set projection aspect ratio.
      camera.aspect = gl.viewportWidth / gl.viewportHeight;

      // Compile vertex shader.
      const vsSource =
        '' +
        'attribute vec3 pos;' +
        'attribute vec4 color;' +
        'uniform mat4 uPMatrix;' +
        'uniform mat4 uMVMatrix;' +
        'varying vec4 vColor;' +
        'void main(){' +
        'gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);' +
        'vColor = color;' +
        '}';
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vsSource);
      gl.compileShader(vs);

      // Compile fragment shader.
      fsSouce =
        'precision mediump float;' +
        'varying vec4 vColor;' +
        'void main() {' +
        'gl_FragColor = vColor;' +
        '}';
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, fsSouce);
      gl.compileShader(fs);

      // Link shader together into a program.
      prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      prog.posAttrib = gl.getAttribLocation(prog, 'pos');
      gl.enableVertexAttribArray(prog.posAttrib);

      prog.colorAttrib = gl.getAttribLocation(prog, 'color');
      gl.enableVertexAttribArray(prog.colorAttrib);

      prog.pMatrixUniform = gl.getUniformLocation(prog, 'uPMatrix');
      prog.mvMatrixUniform = gl.getUniformLocation(prog, 'uMVMatrix');

      render();
    }
  }

  /**
   * Render current scene
   */
  function render() {
    circle = new Circle(depth);

    // Clear framebuffer and depth-/z-buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setProjection();
    calculateCameraOrbit();

    // Set view matrix depending on camera.
    mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
      45,
      gl.viewportWidth / gl.viewportHeight,
      0.1,
      100.0,
      pMatrix,
    );

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0, 0.0, -4.0]);
    mat4.rotate(mvMatrix, (rPyramid * Math.PI) / 180, rotation);

    gl.uniformMatrix4fv(prog.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(prog.mvMatrixUniform, false, mvMatrix);

    circle.draw(wireFrame, prog);

    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
  }

  /**
   * Initialize a window.onkeydown event listening function.
   */
  function initOnKeyDownEventHandler() {
    window.onkeydown = function (evt) {
      let rerender = true;

      // Change projection of scene.
      switch (evt.keyCode) {
        case 32: // space
          wireFrame = !wireFrame;
          break;
        case 187: // normal plus
        case 107: // numblock plus
          if (depth >= 9) {
            $('#recursionDepth').html(
              'Aktuelle Rekursionstiefe: ' +
                depth +
                '<br> Erhöhung nicht möglich, da ansonsten durch die aufwendigen Berechnungen Fehler auftreten können.',
            );
            rerender = false; // suppress rerender, as depth was not changed
          } else {
            depth++;
            $('#recursionDepth').html('Aktuelle Rekursionstiefe: ' + depth);
          }
          break;
        case 189: // normal minus
        case 109: // numblock minus
          if (depth > 1) {
            depth--;
            $('#recursionDepth').html('Aktuelle Rekursionstiefe: ' + depth);
          } else {
            rerender = false; // suppress rerender, as depth did not change
          }
          break;
        case 65: // A
          rPyramid += 15;
          rotation = [0, 1, 0];
          break;
        case 68: // D
          rPyramid -= 15;
          rotation = [0, 1, 0];
          break;
        case 87: // W
          rPyramid += 15;
          rotation = [1, 0, 0];
          break;
        case 83: // S
          rPyramid -= 15;
          rotation = [1, 0, 0];
          break;
      }

      // Rerender the scene only if something changed
      if (rerender) {
        render();
      }
    };
  }

  /**
   * Tries to create a WebGL context on the given canvas.
   * @param {HTMLCanvasElement} canvas - Canvas on which the context will be created
   * @returns {WebGLRenderingContext} Either a context or null
   */
  function initWebGL(canvas) {
    gl = null;

    try {
      gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) {}

    if (!gl) {
      alert('WebGL konnte nicht initialisiert werden.');
      gl = null;
    }
  }
  function calculateCameraOrbit() {
    // Calculate x,z position/eye of camera orbiting the center.
    const x = 0,
      y = 1,
      z = 2;
    camera.eye[x] = camera.center[x];
    camera.eye[y] = camera.center[y];
    camera.eye[z] = camera.center[z];

    switch (direction.type) {
      case 'x':
        camera.eye[z] += camera.distance * Math.sin(camera.xAngle);
        camera.eye[y] += camera.distance * Math.cos(camera.xAngle);
        break;
      case 'z':
        camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
        camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
        break;
    }
  }

  function setProjection() {
    // Set projection Matrix.
    switch (camera.projectionType) {
      case 'ortho':
        const v = camera.lrtb;
        mat4.ortho(-v, v, -v, v, -10, 10, camera.pMatrix);
        break;
    }
    // Set projection uniform.
    gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
  }
});

const Circle = function (recursionDepth) {
  this.recursionDepth = recursionDepth;

  // initial octadron vertices
  this.a = [1.0, 0.0, 1.0];
  this.b = [0.0, 1.0, 0.0];
  this.c = [-1.0, 0.0, -1.0];
  this.d = [-1.0, 0.0, 1.0];

  this.e = [1.0, 0.0, 1.0];
  this.f = [0.0, 1.0, 0.0];
  this.g = [-1.0, 0.0, -1.0];
  this.h = [1.0, 0.0, -1.0];

  this.i = [1.0, 0.0, 1.0];
  this.j = [0.0, -1.0, 0.0];
  this.k = [-1.0, 0.0, -1.0];
  this.l = [-1.0, 0.0, 1.0];

  this.m = [1.0, 0.0, 1.0];
  this.n = [0.0, -1.0, 0.0];
  this.o = [-1.0, 0.0, -1.0];
  this.p = [1.0, 0.0, -1.0];

  // normalize initial tetrahedron vertices
  this.a = vec3.normalize(this.a);
  this.b = vec3.normalize(this.b);
  this.c = vec3.normalize(this.c);
  this.d = vec3.normalize(this.d);

  this.e = vec3.normalize(this.e);
  this.f = vec3.normalize(this.f);
  this.g = vec3.normalize(this.g);
  this.h = vec3.normalize(this.h);

  this.i = vec3.normalize(this.i);
  this.j = vec3.normalize(this.j);
  this.k = vec3.normalize(this.k);
  this.l = vec3.normalize(this.l);

  this.m = vec3.normalize(this.m);
  this.n = vec3.normalize(this.n);
  this.o = vec3.normalize(this.o);
  this.p = vec3.normalize(this.p);

  // define buffers to store the spheres' vertex positions and colors
  this.vertices = [];
  this.vertexColors = [];

  // tesselate the tetrahedron triangle wise
  this.tessellateTriangle(this.a, this.b, this.c, this.recursionDepth);
  this.tessellateTriangle(this.a, this.b, this.d, this.recursionDepth);
  this.tessellateTriangle(this.a, this.c, this.d, this.recursionDepth);
  this.tessellateTriangle(this.b, this.c, this.d, this.recursionDepth);

  this.tessellateTriangle(this.e, this.g, this.f, this.recursionDepth);
  this.tessellateTriangle(this.e, this.h, this.f, this.recursionDepth);
  this.tessellateTriangle(this.e, this.h, this.g, this.recursionDepth);
  this.tessellateTriangle(this.f, this.h, this.g, this.recursionDepth);

  this.tessellateTriangle(this.i, this.k, this.j, this.recursionDepth);
  this.tessellateTriangle(this.i, this.l, this.j, this.recursionDepth);
  this.tessellateTriangle(this.i, this.l, this.k, this.recursionDepth);
  this.tessellateTriangle(this.j, this.l, this.k, this.recursionDepth);

  this.tessellateTriangle(this.m, this.n, this.p, this.recursionDepth);
  this.tessellateTriangle(this.m, this.n, this.o, this.recursionDepth);
  this.tessellateTriangle(this.m, this.o, this.p, this.recursionDepth);
  this.tessellateTriangle(this.n, this.o, this.p, this.recursionDepth);

  // create a vertex buffer and apply the previous calculated vertices
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  this.vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(this.vertices),
    gl.STATIC_DRAW,
  );
  this.vertexPositionBuffer.itemSize = 3;
  this.vertexPositionBuffer.numItems = this.vertices.length / 3;

  // create a buffer for each vertex color and fill it
  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);

  for (let i = 0; i < this.vertices.length; i += 3) {
    this.vertexColors.push(this.vertices[i] + 0.5); // r
    this.vertexColors.push(this.vertices[i + 1] + 0.5); // g
    this.vertexColors.push(this.vertices[i + 2] + 0.5); // b
    this.vertexColors.push(1); // a
  }
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(this.vertexColors),
    gl.STATIC_DRAW,
  );
  this.vertexColorBuffer.itemSize = 4;
  this.vertexColorBuffer.numItems = this.vertexColors.length / 4;
};

Circle.prototype.normalize = function (vec) {
  // the normalization function return the center (vector) of the median
  vec3.normalize(vec);
  const normalizedVector = [vec[0], vec[1], vec[2]];
  return normalizedVector;
};

Circle.prototype.tessellateTriangle = function (a, b, c, depth) {
  if (depth == 1) {
    // a recursion depth of 1 means to store the vertices and to break
    // the recursion
    this.vertices.push(a[0], a[1], a[2]);
    this.vertices.push(b[0], b[1], b[2]);
    this.vertices.push(c[0], c[1], c[2]);
  } else {
    // calculate the medians...
    const ab = this.calculateMedianVector(a, b);
    const ac = this.calculateMedianVector(a, c);
    const bc = this.calculateMedianVector(b, c);

    // ...and use them to span four new triangles which then gets tessellated again
    this.tessellateTriangle(a, ab, ac, depth - 1);
    this.tessellateTriangle(ac, bc, c, depth - 1);
    this.tessellateTriangle(ab, b, bc, depth - 1);
    this.tessellateTriangle(ab, bc, ac, depth - 1);
  }
};

Circle.prototype.calculateMedianVector = function (a, b) {
  // add the two vector to create a direction vector (median)
  const c = vec3.create();
  vec3.add(a, b, c);
  return this.normalize(c);
};

Circle.prototype.draw = function (wireFrame, prog) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  gl.vertexAttribPointer(
    prog.posAttrib,
    this.vertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.vertexAttribPointer(
    prog.colorAttrib,
    this.vertexColorBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0,
  );

  if (wireFrame)
    gl.drawArrays(gl.LINE_STRIP, 0, this.vertexPositionBuffer.numItems);
  //  -> wireframe
  else gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositionBuffer.numItems);
};
