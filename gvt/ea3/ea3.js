/**
 * Created by Steffen Meifort on 2017-05-03.
 */

'use strict';

$(function () {
  createGraphic();
});

function createGraphic() {
  const canvas = document.getElementById('canvas');
  const gl = initWebGL(canvas);

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

    // Compile vertex shader.
    const vsSource =
      'attribute vec3 pos;' +
      'attribute vec4 col;' +
      'varying vec4 color;' +
      'void main(){' +
      'color = col;' +
      'gl_Position = vec4(pos * 1.75, 1);' +
      '}';
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    // Compile fragment shader.
    const fsSource =
      'precision mediump float;' +
      'varying vec4 color;' +
      'void main() {' +
      'gl_FragColor = color;' +
      '}';
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    // Link shader together into a program.
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const hexagonVertices = new Float32Array([
      -0.25,
      -0.125,
      0,
      0,
      -0.25,
      0,
      0.25,
      -0.125,
      0,
      0.25,
      0.125,
      0,
      -0,
      0.25,
      0,
      -0.25,
      0.125,
      0,
    ]);

    const hexagonIndices = new Uint16Array([
      0,
      1,
      2,
      1,
      2,
      3,
      2,
      3,
      4,
      3,
      4,
      5,
      4,
      5,
      0,
      5,
      0,
      1,
    ]);

    const hexagonColors = new Float32Array([
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      1,
      1,
    ]);

    const vertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
    gl.bufferData(gl.ARRAY_BUFFER, hexagonVertices, gl.STATIC_DRAW);

    const posAttrib = gl.getAttribLocation(prog, 'pos');
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    const colors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colors);
    gl.bufferData(gl.ARRAY_BUFFER, hexagonColors, gl.STATIC_DRAW);

    const colAttrib = gl.getAttribLocation(prog, 'col');
    gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colAttrib);

    const indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, hexagonIndices, gl.STATIC_DRAW);
    indices.numberOfIndices = hexagonIndices.length;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(
      gl.TRIANGLE_STRIP,
      indices.numberOfIndices,
      gl.UNSIGNED_SHORT,
      0,
    );
  }

  /**
   * Tries to create a WebGL context on the given canvas.
   * @param {HTMLCanvasElement} canvas - Canvas on which the context will be created
   * @returns {WebGLRenderingContext} Either a context or null
   */
  function initWebGL(canvas) {
    let context = null;

    try {
      context =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {}

    if (!context) {
      alert('WebGL konnte nicht initialisiert werden.');
      context = null;
    }

    return context;
  }
}
