import { initShaderProgram } from './utils/shader'

const drawLine = function (gl: WebGLRenderingContext) {
    // 定义顶点着色器代码
    const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
    `

    // 定义片元着色器代码
    const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 红色
            }
    `

    const program = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource)!
    gl.useProgram(program)

    /**
     * 获取顶点着色器中的a_position变量的地址，上面的glsl中有进行定义
     */
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')

    // 创建缓冲区并传递顶点数据
    const positionBuffer = gl.createBuffer()
    // 绑定缓存区，后序对positionBuffer的操作，相当于操作ARRAY_BUFFER
    // 但是后面没有用到positionBuffer，十分奇怪
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // 这里的0,0代表画布的中心点，0.5代表坐标轴长度的0.5
    const positions = [
        0,
        0, // 起点坐标
        0.5,
        0.5, // 终点坐标
    ]
    // WebGL 中用于将数据加载到缓冲区对象中的操作
    // gl.bufferData(target, data, usage),用于向指定的缓冲区目标（target）中加载数据（data）。第三个参数 usage 表示数据的使用方式，即数据将如何在应用程序中被使用
    // gl.STATIC_DRAW 表示数据将会被传递给 GPU 并且不会经常变化，这对于顶点数据是很常见的使用方式
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)


    // 打算在渲染时使用指定的顶点属性数组，需要先启用它
    gl.enableVertexAttribArray(positionAttributeLocation)
    // 用于配置顶点属性数组的参数，以指定如何解释传递给顶点着色器的顶点数据
    // size: 2, 2 表示每个顶点属性是由两个浮点数（例如 x 和 y 坐标）组成
    // type: 表示数据类型
    // normalized: 布尔值，指示是否应该将非浮点数数据标准化到 [0, 1] 或 [-1, 1] 范围内。通常在颜色数据中使用。
    // stride：整数，表示连续两个顶点之间的字节数。如果顶点属性紧密排列，可以设置为 0。
    // offset：整数，表示顶点数据的起始偏移量，通常设置为 0。
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
    /**
     * 在您的示例中，gl.drawArrays(gl.LINES, 0, 2) 表示要绘制两个顶点之间的线段。gl.LINES 是绘制模式，表示要绘制独立的线段，0 是起始顶点的索引，2 是要绘制的顶点数量。
     * 0代表就是positions[0]里面的0,2就是代表绘制positions[0]和positions[1]
     */
    gl.drawArrays(gl.LINES, 0, 2) // 绘制直线
}

const getGl = function () {
    const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')
    return gl
}

const reset = function (gl: WebGLRenderingContext) {
    // 使用完全不透明的黑色清除所有图像
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT)
}

const main = function () {
    const gl = getGl()
    if (gl) {
        reset(gl)
        drawLine(gl)
    }
}

main()
