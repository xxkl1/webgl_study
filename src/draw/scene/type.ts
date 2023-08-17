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

export type {
    ProgramInfo,
    Buffers,
}