/*
Julia Fernandez Reyes
Agata Sánchez Andreu
*/

let listaTareas=[
        {text: "Preparar práctica PDAP", tags:["pdap", "práctica"]},
        {text: "Mirar fechas congreso", done:true, tags:[]},
        {text: "Ir al supermercado", tags:["personal"]},
        {text: "Mudanza", done:false, tags:["personal"]},
    ];
    function getToDoTasks(tasks){
      let a=tasks.filter(n=>(n.done===false || n.done===undefined));
      let dev= a.map(n=> n.text);
      return dev;
    }
    
    function findByTag(tasks, tag){
        let dev=tasks.filter(n=>(n.tags.indexOf(tag)!==-1));
        return dev;
    }
    
    function findByTags(tasks, tags){
        let dev=tasks.filter(n => n.tags.some(a => tags.indexOf(a) !== -1));
        return dev;
    }
    
    function countDone(tasks){
    return tasks.reduce((acum, n) => {
      if(n.done && n.done !==undefined) {
         acum ++;
      } 
        return acum;
      }, 0);
    }
    
    function createTasks(texto){
    
     let et = /@/g;
     let frase;
     let array = et.exec(texto);
   
     let indice=array.index;//Nos da la posicion donde ha encontrado el primer @
     let etiquetas=texto.slice(indice);  
     let pal = etiquetas.replace(et, "");
     let etiquetasfinal=pal.split(" ");
     frase= texto.slice(0, indice-1);//Aqui guardamos todo el texto hasta el @
     let listaTareas=[{text: frase, tags:etiquetasfinal}];
    
     return listaTareas;
    }
    
    console.log(getToDoTasks(listaTareas));
    console.log(findByTag(listaTareas,"personal"));
    console.log(findByTags(listaTareas,["personal", "pdap"]));
    console.log(countDone(listaTareas));
    console.log(createTasks("Esto es una cadena @de @texto"));
    console.log(createTasks("Y por aqui va otra @personal"));
    
    module.exports ={
      getToDoTasks: getToDoTasks,
      findByTag: findByTag,
      findByTags: findByTags,
      countDone: countDone,
      createTasks: createTasks
    }