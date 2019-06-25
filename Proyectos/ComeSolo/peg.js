const hamCycle = require('./hamilton')

/*  Defino una array 7 x 7 que representa mi tablero Zenku (Peg)
    
    *  Los numeros 2 son posiciones que no podemos operar
    *  Los numeros 1 son posiciones que estan ocupadas
    *  Los numeros 0 son posiciones que estan vacias
*/
let array = [
    [2, 2, 1, 1, 1, 2, 2],
    [2, 2, 1, 1, 1, 2, 2],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [2, 2, 1, 1, 1, 2, 2],
    [2, 2, 1, 1, 1, 2, 2]
]

function printArray() {
    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
    }
    console.log("\n")
}

function cleanBottom() {
    printArray()

    if (array[6][4] === 1) {
        if (array[4][4] === 1) {
            if (array[4][3] === 1) {
                if (array[3][3] === 0) {
                    jumpTo([5,3],[3,3]) // Arriba
                    cleanBottom()
                } else {
                    jumpTo([3,4],[5,4]) // Abajo
                    cleanBottom()
                }
            } else {
                jumpTo([4,5],[4,3]) // Izquierda
                cleanBottom()
            }
        } else {
            jumpTo([6,4],[4,4]) // Arriba
            cleanBottom()
        }
    } else if (array[6][2] === 1 && array[6][4] === 0) {
        jumpTo([6,2],[6,4]) // Derecha

        cleanBottom()
    }

}

function rotateRightMatrix() {
    console.log("Rotamos la matriz");

    // Declaro una matriz auxiliar
    let aux = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]

    // Calculamos la transpuesta
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            aux[j][i] = array[i][j]
        }
    }

    // Hacemos reverse a los elementos de cada fila
    for (let i = 0; i < array.length; i++) {
        aux[i].reverse()
    }
    array = aux
}

function cleanAllSides() {
    // Si hay por lo mens un 1 en la parte inferior central de la matriz
    if (array[6][2] === 1 || array[6][3] === 1 || array[6][4] === 1) {
        cleanBottom() // Limpiamos la zona inferior
        rotateRightMatrix() // Rotamos la matriz a la derecha
        cleanAllSides() // Volvemos a llamar a la funcion
    }
}

function jumpTo(yx1, yx2) {
    const [y1, x1] = yx1
    const [y2, x2] = yx2

    array[y1][x1] = 0 // Posicion a desocupar
    array[y2][x2] = 1 // Posicion a ocupar

    // Posicion intermedia entre ambas coordenadas que se va a eliminar 
    // solo si esa posicion tiene un 1 como valor
    if (y1 === y2 && x2 < x1 && array[y1][x1 - 1] === 1) array[y1][x1 - 1] = 0 // Izquierda

    else if (y1 === y2 && x2 > x1 && array[y1][x1 + 1] === 1) array[y1][x1 + 1] = 0 // Derecha

    else if (y1 < y2 && x1 === x2 && array[y1 + 1][x1] === 1) array[y1 + 1][x1] = 0 // Abajo

    else if (array[y1 - 1][x1] === 1) array[y1 - 1][x1] = 0 // Arriba
}

function trackPath(coordenadas, ruta) {
    for (let i = 0; i < ruta.length - 1; i++) {
        printArray()

        let yx1 = coordenadas[ruta[i]]
        let yx2 = coordenadas[ruta[i + 1]]

        jumpTo(yx1, yx2)
    }
}

function cleanT() {
    printArray()

    if (array[3][3] === 1) {
        if (array[3][1] === 1) {
            jumpTo([3,4],[3,2]) // izquierda
            cleanT()

        } else {
            jumpTo([3,3],[3,1]) // izquierda
            cleanT()
        }

    } else if (array[1][3] === 1) {
        jumpTo([1,3],[3,3]) // abajo
        cleanT()

    } else jumpTo([3,1],[3,3]) // derecha
}


function main() {
    cleanAllSides() // Limpia todas las extremidades


    /* Tenemos el siguiente grafo
        (1)--(0)--(5)  
         |    |    |
		 |    |    |
        (2)--(3)--(4)

        Abajo tenemos nuestra matriz con las coordenadas de cada vertice
        y abajo de esa matriz tenemos la de adyacencia correspondiente al grafo
    */

    let coordenadas = [
        [2, 3],
        [2, 1],
        [4, 1],
        [4, 3],
        [4, 5],
        [2, 5]
    ]

    let grapho = [
        [0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0]
    ];


    let path = hamCycle(grapho, 0) // Calculamos la ruta solucion
    trackPath(coordenadas, path)

    cleanT()

    printArray()

}

main() // Ejecutamos la funcion principal
