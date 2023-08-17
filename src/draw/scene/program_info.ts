import { initShaderProgram } from '../../utils/shader'
import { ProgramInfo } from './type'

/**
 * 获取着色器程序，并且还有sharder中，各个变量在内存中的索引，使得后期对sharder中的变量进行赋值成为可能
 *
 * @param gl
 * @returns
 * {
 *  program: 着色器程序，包含链接好的顶点着色器和片元着色器
 *  attribLocations: 存放的是，属性变量在内存中的位置
 *  uniformLocations: 存放的是，矩阵变量在内存中的位置
 * }
 * 对于attribLocations，后面会使用gl.vertexAttribPointer配置，sharder如何从缓冲区读取数据
 * 对于uniformLocations，会使用gl.uniformMatrix4fv对，对sharder中的矩阵变量进行赋值，注意，这里赋值不会从缓冲区赋值，而是直接使用js变量，mat4类型进行赋值
 */
const getProgramInfo = function (gl: WebGLRenderingContext): ProgramInfo {
    /**
     * vec4: 四维向量，mat4：4维矩阵
     * 这里定义了一个属性，和两个 Uniform
     * 属性需要从缓冲区进行值的读取
     * uniform类似于 JavaScript 全局变量
     */
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;

        void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
        }
    `

    // gl_FragColor是着色器最终的颜色
    // vColor的意思是，使用顶点着色器传递过来的颜色vColor
    const fsSource = `
        varying highp vec2 vTextureCoord;

        uniform sampler2D uSampler;

        void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
    `

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!

    // gl.getAttribLocation: 用于获取顶点着色器中顶点属性变量的位置（索引）的函数
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition")!,
          textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord")!,
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix")!,
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")!,
          uSampler: gl.getUniformLocation(shaderProgram, "uSampler")!,
        },
    }

    return programInfo
}

const useSharderProgram = function (gl: WebGLRenderingContext, programInfo: ProgramInfo) {
    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program)
}

export {
    getProgramInfo,
    useSharderProgram,
}