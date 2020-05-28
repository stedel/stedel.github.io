const surfaceFunctions = {
    waveTorus: {
        x: (R,r,a,u,v) => { return (R + (r + a * Math.sin(5 * u)) * Math.cos(v)) * Math.cos(u); },
        y: (R,r,a,u,v) => { return (R + (r + a * Math.sin(5 * u)) * Math.cos(v)) * Math.sin(u); },
        z: (R,r,a,u,v) => { return -1 * (r + a * Math.sin(5 * u)) * Math.sin(v); }
    },
    turnedEightTorus: {
        x: (R,r,a,u,v) => { return (R + r * (Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v))) * Math.cos(u); },
        y: (R,r,a,u,v) => { return (R + r * (Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v))) * Math.sin(u); },
        z: (R,r,a,u,v) => { return r * (Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v)); }
    },
    cresent: {
        x: (a,b,c,u,v) => { return (a + Math.sin(b * Math.PI * u) * Math.sin(b * Math.PI * v)) * Math.sin(c * Math.PI * v); },
        y: (a,b,c,u,v) => { return (a + Math.sin(b * Math.PI * u) * Math.sin(b * Math.PI * v)) * Math.cos(c * Math.PI * v); },
        z: (a,b,c,u,v) => { return Math.cos(b * Math.PI * u) * Math.sin(b * Math.PI * v) + 4 * v - 2  }
    },
    custom: {
        x: (R,r,a,u,v) => { return (R + (r + a * Math.sin(5 * u)) * Math.cos(v)) * Math.cos(u); },
        y: (R,r,a,u,v) => { return (R + (-r + a * Math.sin(5 * u)) * Math.cos(v)) * Math.sin(u * 2); },
        z: (R,r,a,u,v) => { return (r + a * Math.sin(5 * u)) * Math.sin(v); }
    }
};

const colors = {
    front: {
        r: 0.764,
        g: 0.925,
        b: 0.917,
        a: 1
    },
    back: {
        r: 0.6,
        g: 0.25,
        b: 0.25,
        a: 1
    },
    black: {
        r: 1,
        g: 1,
        b: 1,
        a: 1
    }
};

$(document).ready(function() {
    initCanvas("wavetorus1", {
        m: 35,
        n: 100,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 25,
        b: 4,
        c: 3,
        scale: 0.03,
        surface: surfaceFunctions.waveTorus
    });

    initCanvas("wavetorus2", {
        m: 35,
        n: 100,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 25,
        b: 4,
        c: 3,
        scale: 0.03,
        fill: true,
        colorFront: colors.black,
        colorBack: colors.black,
        surface: surfaceFunctions.waveTorus

    });

    initCanvas("wavetorus3", {
        m: 35,
        n: 100,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 25,
        b: 4,
        c: 3,
        scale: 0.03,
        fill: true,
        colorFront: colors.front,
        colorBack: colors.back,
        surface: surfaceFunctions.waveTorus
    });

    initCanvas("achttorus1", {
        m: 80,
        n: 50,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 2,
        b: 1.5,
        c: 1.5,
        scale: .25,
        surface: surfaceFunctions.turnedEightTorus
    });

    initCanvas("achttorus2", {
        m: 80,
        n: 50,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 2,
        b: 1.5,
        c: 1.5,
        scale: .25,
        fill: true,
        colorFront: colors.black,
        colorBack: colors.black,
        surface: surfaceFunctions.turnedEightTorus
    });

    initCanvas("achttorus3", {
        m: 80,
        n: 50,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 2,
        b: 1.5,
        c: 1.5,
        scale: .25,
        fill: true,
        colorFront: colors.front,
        colorBack: colors.back,
        surface: surfaceFunctions.turnedEightTorus
    });

    initCanvas("cresent1", {
        m: 80,
        n: 60,
        uMin: 0,
        uMax: 1,
        vMin: 0,
        vMax: 1,
        a: 2,
        b: 3,
        c: 2,
        scale: 0.3,
        surface: surfaceFunctions.cresent
    });

    initCanvas("cresent2", {
        m: 80,
        n: 60,
        uMin: 0,
        uMax: 1,
        vMin: 0,
        vMax: 1,
        a: 2,
        b: 3,
        c: 2,
        scale: 0.3,
        fill: true,
        colorFront: colors.black,
        colorBack: colors.black,
        surface: surfaceFunctions.cresent
    });

    initCanvas("cresent3", {
        m: 80,
        n: 60,
        uMin: 0,
        uMax: 1,
        vMin: 0,
        vMax: 1,
        a: 2,
        b: 3,
        c: 2,
        scale: 0.3,
        fill: true,
        colorFront: colors.front,
        colorBack: colors.back,
        surface: surfaceFunctions.cresent
    });

    initCanvas("custom1", {
        m: 20,
        n: 80,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 25,
        b: 4,
        c: 3,
        scale: 0.03,
        surface: surfaceFunctions.custom
    });

    initCanvas("custom2", {
        m: 20,
        n: 80,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 25,
        b: 4,
        c: 3,
        scale: 0.03,
        fill: true,
        colorFront: colors.black,
        colorBack: colors.black,
        surface: surfaceFunctions.custom
    });
    
    initCanvas("custom3", {
        m: 20,
        n: 80,
        uMin: 0,
        uMax: 2*Math.PI,
        vMin: 0,
        vMax: 2*Math.PI,
        a: 25,
        b: 4,
        c: 3,
        scale: 0.03,
        fill: true,
        colorFront: colors.front,
        colorBack: colors.back,
        surface: surfaceFunctions.custom
    });
});

/**
 * Lookup canvas and initialize rendering with values from params.
 * 
 * @param {string} canvasName Canvas to be initialized
 * @param {Object} params Function parameters to generate each Object
 */
function initCanvas(canvasId, params) {
    let canvas = document.getElementById(canvasId);

    let gl = initWebGL(canvas);

    if (gl) {
        // setup
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Backface culling.
        gl.frontFace(gl.CCW);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK); // or gl.FRONT

        // Compile vertex shader.
        const vsSource = "" +
            "attribute vec3 pos;" +
            "attribute vec4 col;" +
            "varying vec4 color;" +
            "void main(){" + "color = col;" +
            "gl_Position = vec4(pos, 1);" +
            "}";
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsSource);
        gl.compileShader(vs);

        // Compile fragment shader.
        const fsSource = "precision mediump float;" +
            "varying vec4 color;" +
            "void main() {" +
            "gl_FragColor = color;" +
            "}";
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fsSource);
        gl.compileShader(fs);

        // Link shader together into a program.
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, "pos");
        gl.linkProgram(prog);
        gl.useProgram(prog);

        // Fill the data arrays.
        const resultData = createVertexData(params);

        // Setup position vertex buffer object.
        const vboPos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
        gl.bufferData(gl.ARRAY_BUFFER,
            resultData.vertices, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        const posAttrib = gl.getAttribLocation(prog, "pos");
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);

        // Setup constant color.
        const colAttrib = gl.getAttribLocation(prog, "col");

        // Setup lines index buffer object.
        const iboLines = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, resultData.indices, gl.STATIC_DRAW);
        iboLines.numberOfElements = resultData.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        //gl.clear(gl.COLOR_BUFFER_BIT);
        if(params.fill) {
            // Setup tris index buffer object.
            var iboTris = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, resultData.indicesTris, gl.STATIC_DRAW);
            iboTris.numberOfElements = resultData.indicesTris.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Clear framebuffer and render primitives.
        }

        // Setup rendering tris.
        if(params.fill) {
            gl.cullFace(gl.FRONT);
            gl.vertexAttrib4f(colAttrib, params.colorFront.r, params.colorFront.g, params.colorFront.b, params.colorFront.a);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.drawElements(gl.TRIANGLES, iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

            gl.cullFace(gl.BACK);
            gl.vertexAttrib4f(colAttrib, params.colorBack.r, params.colorBack.g, params.colorBack.b, params.colorBack.a);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.drawElements(gl.TRIANGLES, iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }

        // Setup rendering lines.
        gl.vertexAttrib4f(colAttrib, 0, 0, 0, 0.75);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
        gl.drawElements(gl.LINES, iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

    }
}

/**
 * Create vertex data for given params.
 *
 * params.m First detail scale
 * params.n Second detail scale
 * params.uMin Start value for u
 * params.uMax End value for u
 * params.vMin Start value for v
 * params.vMax End value for v
 * params.a Factor A
 * params.b Factor B
 * params.c Factor C
 * params.scale Scale factor for whole vertex array
 * params.surface.x Function to get the X value
 * params.surface.y Function to get the Y value
 * params.surface.z Function to get the Z value
 *
 * @param params Object containing mentioned parameters 
 *
 * @returns {{vertices: Float32Array, indices: Uint16Array, indicesTris: Uint16Array}}
 */
function createVertexData(params) {
    var resultData = {
        vertices: new Float32Array(3 * (params.n + 1) * (params.m + 1)),
        indices: new Uint16Array(2 * 2 * params.n * params.m),
        indicesTris: new Uint16Array(3 * 2 * params.n * params.m)
    };

    var du = params.uMax/params.n;
    var dv = params.vMax/params.m;

    // Counter for entries in index array.
    var iLines  = 0;
    var iTris = 0;

    // Loop angle u.
    for(var i = 0, u = params.uMin; i <= params.n; i++, u += du) {
        // Loop radius v.
        for(var j = 0, v = params.vMin; j <= params.m; j++, v += dv){
            var iVertex = i * (params.m + 1) + j;

            var scale = params.scale === undefined ? 1 : params.scale;
            var x = scale * params.surface.x(params.a, params.b, params.c, u, v);
            var y = scale * params.surface.y(params.a, params.b, params.c, u, v);
            var z = scale * params.surface.z(params.a, params.b, params.c, u, v);

            // Set vertex positions.
            resultData.vertices[iVertex * 3] = x;
            resultData.vertices[iVertex * 3 + 1] = y;
            resultData.vertices[iVertex * 3 + 2] = z;
            // Set index.
            // Line on beam.
            if(j > 0 && i > 0){
                resultData.indices[iLines++] = iVertex - 1;
                resultData.indices[iLines++] = iVertex;
            }
            // Line on ring.
            if(j > 0 && i > 0){
                resultData.indices[iLines++] = iVertex-(params.m+1);
                resultData.indices[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j > 0 && i > 0 && params.fill) {
                resultData.indicesTris[iTris++] = iVertex;
                resultData.indicesTris[iTris++] = iVertex - 1;
                resultData.indicesTris[iTris++] = iVertex - (params.m + 1);
                resultData.indicesTris[iTris++] = iVertex - 1;
                resultData.indicesTris[iTris++] = iVertex - (params.m + 1) - 1;
                resultData.indicesTris[iTris++] = iVertex - (params.m + 1);
            }
        }
    }
    return resultData;
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
    } catch (e) {}

    if (!context) {
        alert("WebGL konnte nicht initialisiert werden.");
        context = null;
    }

    return context;
}