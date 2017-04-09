/**
 * Created by Steffen Meifort on 2017-04-09.
 */

"use strict";

$(function () {
    createGraphic();
});

function createGraphic() {

    const canvas = document.getElementById("canvas");
    const gl = initWebGL(canvas);

    if (gl) {
        // setup
        gl.clearColor(0.764, 0.925, 0.917, 1);  // Clear background default color
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // compile vertex shader
        const vsSource = 'attribute vec2 pos;' +
            'void main(){gl_Position = vec4(pos * 1.75, 0, 1); }';
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsSource);
        gl.compileShader(vs);

        // compile fragment shader
        const fsSouce = 'void main() { gl_FragColor = vec4(0.2, 0.2, 0.2, 1); }';
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSouce);
        gl.compileShader(fs);

        // link program
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const shutterOutside = new Float32Array([
            0.5, 0, 0.4, 0.3, 0.2, 0.45,
            0, 0.5, -0.2, 0.45, -0.4, 0.3,
            -0.5, 0, -0.4, -0.3, -0.2, -0.45,
            0, -0.5, 0.2, -0.45, 0.4, -0.3
        ]);

        const shutterBlade = new Float32Array([
            0.05, -0.1, 0.4, 0.1, 0.45, 0, 0.4, -0.1
        ]);

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, shutterOutside, gl.STATIC_DRAW);

        const posAttrib = gl.getAttribLocation(prog, 'pos');
        gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINE_LOOP, 0, 12);

        const shutterBladeCount = 12;

        // radians conversion + difference between each shutterBlade
        const rotationDegrees = (Math.PI / 180) * (360 / shutterBladeCount);

        let nextShutterBlade = shutterBlade;
        for (let i = 0; i < shutterBladeCount; i++) {
            gl.bufferData(gl.ARRAY_BUFFER, nextShutterBlade, gl.STATIC_DRAW);
            gl.drawArrays(gl.LINE_LOOP, 0, 4);

            nextShutterBlade = rotate(nextShutterBlade, rotationDegrees);
        }
    }

    /**
     * Rotates the given Float32Array counterclockwise around the center (0,0).
     * @param {Float32Array} toBeRotated
     * @param {number} degrees
     * @returns {Float32Array} rotated array
     */
    function rotate(toBeRotated, degrees) {
        let rotated = new Float32Array(toBeRotated.length);

        for (let i = 0; i < toBeRotated.length; i = i + 2) {
            const x = toBeRotated[i];
            const y = toBeRotated[i+1];

            rotated[i] = x*Math.cos(degrees) - y*Math.sin(degrees);
            rotated[i+1] = y*Math.cos(degrees) + x*Math.sin(degrees);
        }

        return rotated;
    }

    /**
     * Tries to create a WebGL context on the given canvas.
     * @param {HTMLCanvasElement} canvas - Canvas on which the context will be created
     * @returns {WebGLRenderingContext} Either a context or null
     */
    function initWebGL(canvas) {
        let context = null;

        try {
            context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {
        }

        if (!context) {
            alert("WebGL konnte nicht initialisiert werden.");
            context = null;
        }

        return context;
    }
}