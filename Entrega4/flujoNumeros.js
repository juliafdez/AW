/*
Julia Fernández Reyes
Ágata Sánchez Andreu
*/
class FlujoNumeros {
    constructor() {
        this.numeros = [6, 1, 4, 3, 10, 9, 8];
    }
    
    siguienteNumero(f) {
        setTimeout(() => {
          let result = this.numeros.shift();
          f(result);
        }, 100);
    }
}


/**
 * Imprime la suma de los dos primeros números del flujo pasado como parámetro.
 */
function sumaDosLog(flujo) {
    /* Implementar */ 
    let sum = 0;
    flujo.siguienteNumero(num1 => { 
        flujo.siguienteNumero(num2 => {
             sum = num1 + num2;console.log(sum);});
        
    });
}

/**
 * Llama a la función f con la suma de los dos primeros números del flujo pasado como parámetro.
 */
function sumaDos(flujo, f) {
    /* Implementar */
    let sum = 0;
    flujo.siguienteNumero(num1 => { 
        flujo.siguienteNumero(num2 => {
             sum = num1 + num2;
             f(sum);
            }
        );
        
    });
}

/**
 * Llama a la función f con la suma de todos los números del flujo pasado como parámetro
 */
function sumaTodo(flujo, f) {
    /* Implementar */   
 recursiva(flujo, 0, f);
}

function recursiva(flujo, suma, f){
    flujo.siguienteNumero(num1 => {
        if(num1 !== undefined){
            suma += num1;
            recursiva(flujo, suma, f);
        }   
        else f(suma);
    });
    
}

sumaDosLog(new FlujoNumeros());
sumaDos(new FlujoNumeros(), suma => console.log(suma));
sumaTodo(new FlujoNumeros(), suma => {
    console.log(suma);
});


/* NO MODIFICAR A PARTIR DE AQUÍ */

module.exports = {
    FlujoNumeros: FlujoNumeros,
    sumaDosLog: sumaDosLog,
    sumaDos: sumaDos,
    sumaTodo: sumaTodo
}