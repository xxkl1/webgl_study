const loadShader = function (gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!

    // 将glsl代码传递给shader对象
    gl.shaderSource(shader, source)

    // 编译glsl
    gl.compileShader(shader)

    // 检查shader是否编译成功
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            'An error occurred compiling the shaders: ' +
                gl.getShaderInfoLog(shader),
        )
        gl.deleteShader(shader)
        return null
    }

    return shader
}

/**
 * 初始化着色器程序，让 WebGL 知道如何绘制我们的数据
 * @param gl webgl上下文
 * @param vsSource 顶点着色器代码
 * @param fsSource 片元着色器代码
 * @returns
 */
const initShaderProgram = function (gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!

    // 创建着色器程序
    const shaderProgram = gl.createProgram()!
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    // 如果创建失败，alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(
            'Unable to initialize the shader program: ' +
                gl.getProgramInfoLog(shaderProgram),
        )
        return null
    }

    return shaderProgram
}

export {
    initShaderProgram,
}
