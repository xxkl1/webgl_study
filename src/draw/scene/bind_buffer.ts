import { mat4 } from 'gl-matrix'
import { Buffers, ProgramInfo } from './type'

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
const setPositionAttribute = function (
    gl: WebGLRenderingContext,
    buffers: Buffers,
    programInfo: ProgramInfo,
) {
    const numComponents = 3 // pull out 3 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)

    /**
     * 对于gl.ARRAY_BUFFER，这个存放顶点数据的缓冲区，需要固定使用vertexAttribPointer进sharder属性绑定
     * enableVertexAttribArray进行sharder属性绑定开启，下面那个顶点颜色也是这样
     * 对于gl.ELEMENT_ARRAY_BUFFER 索引数据的缓冲区，就不是这样了，直接gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
     * 然后，调用gl.drawElements绘制就行，没有所谓的绑定sharder属性，因为索引没有对应的sharder属性
     */

    // 该函数的作用是 作用是将缓冲区中的数据与顶点属性关联起来
    // 通俗地将，就是将缓存区的数据，传递给顶点着色器中的变量，缓存区现在有上面的[1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]数据

    // 画一个正方体，需要绘制36个顶点，
    // eg. 对于索引缓冲区，第一个顶点索引是0，那么读取position的第一组数据，根据numComponents === 3，我们读取0 - 2 数据块
    // 第二个顶点是1，那么读取position的第二组数据，即3 - 5
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition, // programInfo.attribLocations.vertexPosition存放的是，sharder程序顶点着色器，顶点的数据变量的索引
        numComponents, // 每个顶点数据分量数，这里是3维，即xyz，每次从缓冲区里面，需要三个三个地进行读取
        type, // 数据类型
        normalize, // 是否需要归一化，这里是否，归一化理解先跳过
        stride, //  每个数据项的字节跨度，通常是 0 表示数据是紧密排列的
        offset, // 数据项的偏移量，即从缓冲区的起始位置开始的字节偏移。
    )
    // 启用顶点属性数组，这里是启用了顶点着色器的vertexPosition变量
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

const setUniformMatrix = function (
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    cubeRotation: number = 0,
) {
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    // 创键透视变换矩阵，用于将三维物体投影到2维上

    const canvas = gl.canvas as HTMLCanvasElement
    // fov角度是45度，fov角度代表视野角度，视野角度越大，物体投影占据视野范围的大小比例就越小，导致物体看起来越小
    const fieldOfView = (45 * Math.PI) / 180 // in radians
    // aspect是视角的宽高比
    // 视角的宽高比，会影响到看到的物体的宽高比
    // 如果把aspect改成1，那么看到的物体就是和canvas一样的宽高比
    // 如果采用和canvas一样的宽高比，那么看到的物体就是正方形
    // 采用和canvas一样的宽高比的原因是，使得渲染中保持物体的原始宽高比，确保透视投影矩阵的视野宽高比与屏幕的宽高比一致
    // 对于顶点数据看，渲染出来的图形，应该是正方形，边长是2
    const aspect = canvas.clientWidth / canvas.clientHeight
    // 注意，这个矩阵，是指相机位置固定，调整zNear是改变视角的范围的距离，但是不会改变相机位置
    // 所以，当zNear，zFar同时增加的时候，会看到物体的背面就是这个原因，例如zNear = 5.1, zFar = 105.0, 物体的正面就在视线范围外面
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
    ) // axis to rotate around (Z)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.7, // amount to rotate in radians
        [0, 1, 0],
    ) // axis to rotate around (Y)
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation * 0.3, // amount to rotate in radians
        [1, 0, 0],
    ) // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    // 应用透视矩阵
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    )
    // 应用坐标转换矩阵
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    )
}

const setIndexBuffer = function (gl: WebGLRenderingContext, buffers: Buffers) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)
}

// 告诉 WebGL 如何从缓冲区中提取纹理坐标
const setTextureAttribute = function (
    gl: WebGLRenderingContext,
    buffers: Buffers,
    programInfo: ProgramInfo,
    texture: WebGLTexture,
) {
    const num = 2 // 每个坐标由 2 个值组成
    const type = gl.FLOAT // 缓冲区中的数据为 32 位浮点数
    const normalize = false // 不做标准化处理
    const stride = 0 // 从一个坐标到下一个坐标要获取多少字节
    const offset = 0 // 从缓冲区内的第几个字节开始获取数据
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset,
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0)

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0)
}

const bindSceneBuffers = function (
    gl: WebGLRenderingContext,
    programInfo: ProgramInfo,
    buffers: Buffers,
    cubeRotation: number = 0,
    texture: WebGLTexture,
) {
    // 将缓冲区绑定到顶点属性，并启用顶点属性
    setPositionAttribute(gl, buffers, programInfo)
    setTextureAttribute(gl, buffers, programInfo, texture)
    setIndexBuffer(gl, buffers)
    setUniformMatrix(gl, programInfo, cubeRotation)
}

export { bindSceneBuffers }
