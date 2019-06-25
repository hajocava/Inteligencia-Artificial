// Define el numero de vertices en el grafo
const V = 6


/* Una función de utilidad para comprobar si
El vértice v se puede agregar en el índice 'pos'
en el ciclo hamiltoniano construido
hasta ahora (almacenado en 'ruta []') */
function isSafe(v, graph, path, pos) {
    /* Comprueba si este vertice es adyacente al vertice
	previamente agregado */
    if (graph[path[pos - 1]][v] == 0)
        return false;

    /* Compruebe si el vértice ya ha sido incluido.
    Este paso se puede optimizar creando
    una matriz de tamaño V */
    for (let i = 0; i < pos; i++)
        if (path[i] == v)
            return false;

    return true;
}

/* Una función recursiva.
para resolver el problema del ciclo hamiltoniano */
function hamCycleUtil(graph, path, pos) {
    /* caso base: si todos los vértices estan
    incluido en el ciclo hamiltoniano, como definimos
	arriba que teniamos 5 vertices, entonces verifica
	si en la posicion en la que estamos ya es la ultima, osea
	que el ciclo esta lleno y tenemos una solucion */
    if (pos == V) {
        // Y si hay un borde del  
        // Último vértice incluido al primer vértice
        // Osea que preguntamos si el ciclo se cierra con el origen 
        if (graph[path[pos - 1]][path[0]] == 1)
            return true;
        else
            return false;
    }

    // Prueba diferentes vertices como proximo candidato  
    // en el ciclo hamiltoniano. No intentamos para 0 como  
    // nosotros incluimos 0 como punto de partida en hamCycle()  
    for (let v = 0; v < V; v++) {
        /* Compruebe si este vértice se puede agregar
         al ciclo hamiltoniano */
        if (isSafe(v, graph, path, pos)) {
            path[pos] = v;

            /* recurrir para construir el resto del camino */
            if (hamCycleUtil(graph, path, pos + 1) == true)
                return true;

            /* Si agregando el vértice v no conduce a una solución,
            entonces retíralo */
            path[pos] = -1;
        }
    }

    /* Si no se puede agregar ningun vertice al cilco
	hamiltoniano construido hasta el momento entonces
	devuelve falso */
    return false;
}

/* 
Esta función resuelve el problema del ciclo hamiltoniano.
utilizando Backtracking. Utiliza principalmente hamCycleUtil () para
resolver el problema. Devuelve falso si no hay
Ciclo hamiltoniano posible, de lo contrario, devuelve verdadero.
e imprime el camino. Tenga en cuenta que puede haber
Más de una solución, esta función imprime una.
de las soluciones factibles. */
function hamCycle(graph, s) {
    let path = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < V; i++)
        path[i] = -1;

    /* 
	Pongamos el vértice 0 como el primer vértice en el camino.
    Si hay un ciclo hamiltoniano, entonces el camino puede ser
    comenzó desde cualquier punto del ciclo ya que la gráfica no está dirigida */
    path[0] = s;
    if (hamCycleUtil(graph, path, 1) == false) return false;

    path.push(path[0])
    return path;
}

module.exports = hamCycle