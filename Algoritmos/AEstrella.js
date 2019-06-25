const filas = 5, columnas = 5, obstaculos = ['H', 'M', 'R']

// Variables para controlar mis estados
let listaAbierta = [], listaCerrada = [], listaSolucion = [], agregados = [],
    posActual = [], posInicial = [], posFinal = [2, 4]

// Defino todas las propiedades de mi matriz
let mapa = [],
    idAscii = 65, // ID del objeto, comenzamos por la 'A'
    contador = 0 // Modificador de id

// Creo mi mapa con sus ID y obstaculos
for (let i = 0; i < filas; i++) {
    mapa.push([])

    for (let j = 0; j < columnas; j++) {
        let id = String.fromCharCode(idAscii + contador)
        let obstaculo = obstaculos.includes(id)
        let g = 0
        let f = 0
        let h = 0

        mapa[i].push({ id, obstaculo, g, f, h })

        contador++
    }
}

function calcHueristica(y1, x1) {
    const [y2, x2] = posFinal
    let movimientos = 0

    // Numero de movimientos en y para igualarse
    movimientos += y1 > y2 ? y1 - y2 : y2 - y1
    // Numero de movimientos en x para igualarse
    movimientos += x1 > x2 ? x1 - x2 : x2 - x1

    return movimientos * 10
}

function calcCostoG(y1, x1) {
    const [y2, x2] = posActual // En este momento es la posicion padre
    let g = 0;

    if (y1 === y2 && x1 === x2) return g

    if (y1 < y2) {
        if (x1 === x2) g = mapa[y2][x2].g + 10 // Arriba
        else g = mapa[y2][x2].g + 14 // Diagonal Noreste o Noroeste

    } else if (y1 === y2) {
        g = mapa[y2][x2].g + 10 // Izquierda o Derecha
    } else {
        if (x1 === x2) g = mapa[y2][x2].g + 10 // Abajo
        else g = mapa[y2][x2].g + 14 // Diagonal Sureste o Suroeste
    }
    
    return g
}

function FGHAgregados() {
    for (let i = 0; i < agregados.length; i++) {
        const [y, x] = agregados[i]
        calcFGH(y, x)
    }
    agregados = [] // Vacio el arreglo
    searchFLess()
}

function calcFGH(y, x) {
    const g = calcCostoG(y, x)
    const h = calcHueristica(y, x)
    const f = g + h

    mapa[y][x].g = g
    mapa[y][x].h = h
    mapa[y][x].f = f
}

function searchFLess() {
    // Si ya no tenemos elementos en la lista abirta, entonces
    // No hay manera de llegar a las coordenadas de puntoFinal
    if(listaAbierta.length === 0) return false

    // El primer elemento sera el menor para iniciar la busqueda
    let [y, x] = listaAbierta[0]
    let menor = mapa[y][x].f
    let posicionMenor = 0

    // Empezamos en i = 1 ya que ya sacamos anteriormente ese valor como el menor
    for (let i = 1; i < listaAbierta.length; i++) {
        [y, x] = listaAbierta[i]
        const f = mapa[y][x].f

        if (f < menor) {
            menor = f
            posicionMenor = i
        }
    }
    // Saco las coordenadas de la posicion menor en el mapa
    [y, x] = listaAbierta[posicionMenor]

    // Elimino esa posicion de mi listaAbierta
    let newList = listaAbierta.filter((punto, index) => index !== posicionMenor)
    listaAbierta = newList
    
    // Agrego las coordenadas a la lista cerrada
    listaCerrada.push([y, x])

    // Actualizamos nuestra posicion actual
    posActual = [y, x]
    
    return asterisco()
}

function calcSolution() {
    const [y1, x1] = posInicial
    const [y2, x2] = listaSolucion[listaSolucion.length - 1]

    // Pregunto si las coordenadas de mi ultima posicion de mi 
    // listaSolucion es igual a mis coordenadas del puntoInicial
    if (y1 === y2 && x1 === x2) {
        // Invertimos el orden de la solucion para empezar 
        // desde el punto inicial.
        listaSolucion.reverse()

        console.log(listaSolucion)
        
    } else {
        // Obtengo las coordenadas del padre 
        // en mi posicion actual de mi listaSolucion
        let yxPadre = mapa[y2][x2].padre

        // Agrego las coordenadas a la solucion
        listaSolucion.push(yxPadre)

        // Vuelvo a llamar recursivamente a la funcion
        calcSolution()
    }
}

function inList(y, x, lista) {
    for (let i = 0; i < lista.length; i++) {
        const [yLista, xLista] = lista[i]

        // Pregunto si las coordenadas coinciden con la de
        // Alguna coordenada en mi lista
        if (y === yLista && x === xLista)  return true
    }

    return false
}

function searchNeighbors() {
    const [y1, x1] = posActual
    
    for (let y = -1; y < y1 + 2; y++) {
        for (let x = -1; x < x1 + 2; x++) {

            let yVecino = y + y1
            let xVecino = x + x1

            // Si mis coordenadas estan dentro del area de mi mapa
            if(yVecino >= 0 && yVecino < y1 + 2 && yVecino < filas && xVecino >= 0 && xVecino < x1 + 2 && xVecino < columnas) {
                
                let obstaculo = mapa[yVecino][xVecino].obstaculo
                let inLA = inList(yVecino, xVecino, listaAbierta)
                let inLC = inList(yVecino, xVecino, listaCerrada)
                // Si no es un obstaculo, no esta en la listaAbierta y listaCerrada
                if(!obstaculo && !inLA && !inLC) {
                    agregados.push([yVecino, xVecino])
                    
                    // Agrego las coordenadas del vecino a mi listaAbierta
                    listaAbierta.push([yVecino, xVecino])
                    // Actualizo el padre de mi vecino apuntando a mi posicionActual
                    mapa[yVecino][xVecino].padre = [y1, x1]
                }
            }
        }
    }

    FGHAgregados()
}

function gIsBetter() {
    let flag = false
    const [y1, x1] = posActual

    for (let y = -1; y < y1 + 1; y++) {
        for (let x = -1; x < x1 + 1; x++) {

            let yVecino = y + y1
            let xVecino = x + x1
            
            // Si estas coordenadas estan en la listaAbierta
            if (inList(yVecino, xVecino, listaAbierta)) {
                const gActual = mapa[yVecino][xVecino].g
                const newG = calcCostoG(yVecino, xVecino)

                // Es mejor mi nueva g?
                if (newG < gActual) {
                    // Indicamos que si hubo una mejora en g
                    flag = true
                    // Recalculamos FGH
                    calcFGH(yVecino, xVecino)
                    // Actualizamos el padre a posicion actual
                    mapa[yVecino][xVecino].padre = [y1, x1]
                }
            }

        }
    }

    if(flag) searchFLess()
    else searchNeighbors()
}

function getSolutionId() {
    let arrSolutionId = []

    listaSolucion.forEach(coordenadas => {
        const[y, x] = coordenadas
        const id = mapa[y][x].id

        arrSolutionId.push(id)
    });

    console.log(arrSolutionId)
    return arrSolutionId
}

function asterisco() {
    const [y1, x1] = posActual
    const [y2, x2] = posFinal

    // Preguntamos si poscionActual es igual a posicionFinal
    if (y1 === y2 && x1 === x2) {
        listaSolucion.push(posActual)

        calcSolution()
        getSolutionId()

        return true

    } else gIsBetter()
}

function main() {
    posInicial = [2,0]
    listaAbierta.push(posInicial)
    searchFLess()
}

main()