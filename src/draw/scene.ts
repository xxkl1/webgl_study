import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../utils/shader'
import { log } from '../utils'

type ProgramInfo = {
    program: WebGLProgram
    attribLocations: {
        vertexPosition: number
        vertexColor: number
    }
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation
        modelViewMatrix: WebGLUniformLocation
    }
}

type Buffers = {
    position: WebGLBuffer
    color: WebGLBuffer
    indices: WebGLBuffer
}

const getProgramInfo = function (gl: WebGLRenderingContext): ProgramInfo {
    /**
     * vec4: 四维向量，mat4：4维矩阵
     * 这里定义了一个属性，和两个 Uniform
     * 属性需要从缓冲区进行值的读取
     * uniform类似于 JavaScript 全局变量
     */
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `

    // 白色
    const fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
            gl_FragColor = vColor;
        }
    `

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!

    // gl.getAttribLocation: 用于获取顶点着色器中顶点属性变量的位置（索引）的函数
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(
                shaderProgram,
                'aVertexPosition',
            ),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(
                shaderProgram,
                'uProjectionMatrix',
            )!,
            modelViewMatrix: gl.getUniformLocation(
                shaderProgram,
                'uModelViewMatrix',
            )!,
        },
    }

    return programInfo
}

const initPositionBuffer = function (gl: WebGLRenderingContext) {
    // 套路写法
    const positionBuffer = gl.createBuffer()
    // 将ARRAY_BUFFER绑定到positionBuffer，后面读取positionBuffer就相当于读取gl.ARRAY_BUFFER
    // 想要操作gl.ARRAY_BUFFER，不能直接操作positionBuffer，要使用vertexAttribPointer等函数进行操作

    // bindBuffer起到绑定webgl缓冲区上下文的作用
    // 看起来，如果positionBuffer是一个空的buffer，那么会把当前ARRAY_BUFFER的索引绑定到positionBuffer上
    // 如果positionBuffer不是一个空的buffer，会给ARRAY_BUFFER设置索引的起始
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // 定义一个正方形，四个顶点，每个顶点两个值
    // const positions = [0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5]
    const positions = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return positionBuffer
}

const initColorBuffer = function (gl: WebGLRenderingContext) {
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0], // Left face: purple
      ];

      // Convert the array of colors into a table for all the vertices.
      let colors : number[] = [];

      for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    return colorBuffer
}

const initIndexBuffer = function (gl: WebGLRenderingContext) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    const indices = [
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ];
    // Now send the element array to GL
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );
    return indexBuffer;
}

const initBuffers = function (gl: WebGLRenderingContext): Buffers {
    return {
        position: initPositionBuffer(gl)!,
        color: initColorBuffer(gl)!,
        indices: initIndexBuffer(gl)!,
    }
}

const drawScene = function (
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: Buffers,
    cubeRotation: number = 0,
) {
    const canvas = gl.canvas as HTMLCanvasElement
    gl.clearColor(0.0, 0.0, 0.0, 1.0) // Clear to black, fully opaque
    gl.clearDepth(1.0) // Clear everything
    gl.enable(gl.DEPTH_TEST) // Enable depth testing
    gl.depthFunc(gl.LEQUAL) // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    // 创键透视变换矩阵，用于将三维物体投影到2维上

    // fov角度是45度，fov角度代表视野角度，视野角度越大，物体投影占据视野范围的大小比例就越小，导致物体看起来越小
    const fieldOfView = (45 * Math.PI) / 180 // in radians
    // aspect是视角的宽高比
    // 视角的宽高比，会影响到看到的物体的宽高比
    // 如果把aspect改成1，那么看到的物体就是和canvas一样的宽高比
    // 如果采用和canvas一样的宽高比，那么看到的物体就是正方形
    // 采用和canvas一样的宽高比的原因是，使得渲染中保持物体的原始宽高比，确保透视投影矩阵的视野宽高比与屏幕的宽高比一致
    // 对于顶点数据看，渲染出来的图形，应该是正方形，边长是2
    const aspect = canvas.clientWidth / canvas.clientHeight
    // 近剪裁面的距离
    /**
     * 近剪裁面: 与相机的距离小于这个值的物体都不会被渲染
     */
    const zNear = 0.1
    // 远剪裁面的距离
    /**
     * 远剪裁面: 与相机的距离大于这个值的物体都不会被渲染
     */
    /**
     * 近剪裁面和远剪裁面用于限制物体渲染的范围
     * 一般用于减少了需要在屏幕上渲染的物体数量，优化性能
     * 同时控制物体是否进入视野，控制物体可见性
     */
    const zFar = 100.0
    const projectionMatrix = mat4.create()

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    // 创键透视矩阵
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create()

    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    // 将modelViewMatrix进行平移，只平移z抽，平移的量是6
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0], // x, y, z, z轴的正坐标是，从屏幕垂直射出，负坐标是垂直射入屏幕，所以z越小，离屏幕越远，画出的图像会越小
    ) // amount to translate

    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation, // amount to rotate in radians
        [0, 0, 1],
      ); // axis to rotate around (Z)
      mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.7, // amount to rotate in radians
        [0, 1, 0],
      ); // axis to rotate around (Y)
      mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.3, // amount to rotate in radians
        [1, 0, 0],
      ); // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    // 将缓冲区绑定到顶点属性，并启用顶点属性
    setPositionAttribute(gl, buffers, programInfo)
    setColorAttribute(gl, buffers, programInfo)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program)

    // Set the shader uniforms
    // uniformMatrix4fv用于向顶点着色器中传递 4x4 矩阵数据的函数
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    )
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    )

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
const setPositionAttribute = function (
    gl: WebGLRenderingContext,
    buffers: Buffers,
    programInfo: ProgramInfo,
) {
    const numComponents = 3 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    // TODO: 理解webgl缓冲区的设计
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)

    // 该函数的作用是 作用是将缓冲区中的数据与顶点属性关联起来
    // 通俗地将，就是将缓存区的数据，传递给顶点着色器中的变量，缓存区现在有上面的[1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]数据
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition, // programInfo.attribLocations.vertexPosition存放的是，sharder程序顶点着色器，顶点的数据变量的索引
        numComponents, // 每个顶点数据分量数，这里是2维
        type, // 数据类型
        normalize, // 是否需要归一化，这里是否，归一化理解先跳过
        stride, //  每个数据项的字节跨度，通常是 0 表示数据是紧密排列的
        offset, // 数据项的偏移量，即从缓冲区的起始位置开始的字节偏移。
    )
    // 启用顶点属性数组，这里是启用了顶点着色器的vertexPosition变量
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
const setColorAttribute = function (
    gl: WebGLRenderingContext,
    buffers: Buffers,
    programInfo: ProgramInfo,
) {
    const numComponents = 4
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
}

// 绘制静态的正方形
const drawSceneStatic = function (gl: WebGLRenderingContext) {
    const programInfo = getProgramInfo(gl)
    const buffers = initBuffers(gl)
    drawScene(gl, programInfo, buffers, 30)
}

// 绘制旋转的正方形
const drawSceneRotate = function (gl: WebGLRenderingContext) {
    const programInfo = getProgramInfo(gl)
    const buffers = initBuffers(gl)
    drawScene(gl, programInfo, buffers, 30)

    let then = 0

    let cubeRotation = 0.0;
    let deltaTime = 0

    // Draw the scene repeatedly
    function render(now: number) {
        now *= 0.001 // convert to seconds
        deltaTime = now - then
        then = now

        drawScene(gl, programInfo, buffers, cubeRotation)
        cubeRotation += deltaTime;

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

export { drawSceneStatic, drawSceneRotate }
