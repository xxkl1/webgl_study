import { mat4 } from 'gl-matrix'
import { initShaderProgram } from '../utils/shader'

type ProgramInfo = {
    program: WebGLProgram
    attribLocations: {
        vertexPosition: number
    }
    uniformLocations: {
        projectionMatrix: WebGLUniformLocation
        modelViewMatrix: WebGLUniformLocation
    }
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

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `

    // 白色
    const fsSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(
                shaderProgram,
                'aVertexPosition',
            ),
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

const initBuffers = function (gl: WebGLRenderingContext) {
    const positionBuffer = initPositionBuffer(gl)

    return {
        position: positionBuffer,
    }
}

const initPositionBuffer = function (gl: WebGLRenderingContext) {
    // 套路写法
    const positionBuffer = gl.createBuffer()
    // 将ARRAY_BUFFER绑定到positionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    return positionBuffer
}

const drawScene = function (gl: WebGLRenderingContext) {
    const canvas = gl.canvas as HTMLCanvasElement
    const programInfo = getProgramInfo(gl)
    const buffers = initBuffers(gl)
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

    const fieldOfView = (45 * Math.PI) / 180 // in radians
    const aspect = canvas.clientWidth / canvas.clientHeight
    const zNear = 0.1
    const zFar = 100.0
    const projectionMatrix = mat4.create()

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create()

    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0],
    ) // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    setPositionAttribute(gl, buffers, programInfo)

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program)

    // Set the shader uniforms
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
        const offset = 0
        const vertexCount = 4
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
const setPositionAttribute = function (
    gl: WebGLRenderingContext,
    buffers: WebGLBuffer,
    programInfo: ProgramInfo,
) {
    const numComponents = 2 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

export { initBuffers, drawScene }
