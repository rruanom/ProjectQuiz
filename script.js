const url = 'https://opentdb.com/api.php?amount=10';
const quiz = document.querySelector('.quiz');
let options = [];
let results = [];
let index = 0;
let respuestas = [];
let fecha = new Date().toDateString() //Fecha para puntuacion
console.log(fecha)


quiz.addEventListener('click', (ev)=>{
    ev.preventDefault()

    if(ev.target.tagName === 'BUTTON'){
        const valueOption = ev.target.value
        console.log(valueOption)
        validateResponse(valueOption, ev.target)
    }
    if (ev.target.id === 'siguiente') {
        index++;
        printQuiz(results, index)
    }
})

const getData = async () => {
    try {
        const resp = await fetch(url);
        if (resp.ok) {
            const data = await resp.json();
            results = data.results;
            printQuiz(results, index);
            console.log(results);
        } else {
            throw new Error('Error al obtener los datos');
        }
    } catch (error) {
        console.error(error);
    }
}

const printQuiz = (results, i) => {
    quiz.innerHTML = '';
    options = [...results[i].incorrect_answers, results[i].correct_answer];
    console.log(options);
    const pregunta = document.createElement('H3')
    pregunta.textContent = results[i].question;
    quiz.append(pregunta)

    options.forEach((opc, index) => {
        const buttonOption = document.createElement('BUTTON')
        buttonOption.textContent = opc;
        buttonOption.setAttribute('id', `option${index+1}`)
        buttonOption.classList.add(`option${index+1}`)
        buttonOption.value = opc
        console.log(buttonOption)
        quiz.append(buttonOption)
    });
    const buttonNext = document.createElement('INPUT')
    buttonNext.setAttribute('type', 'submit')
    buttonNext.value= 'Siguiente'
    buttonNext.setAttribute('id', 'siguiente')
    quiz.append(buttonNext)
};

const validateResponse = (value, button)=>{
    const buttons = document.querySelectorAll('button')
    if(value === results[index].correct_answer){
        button.classList.add('styleOptionActive')
        respuestas.push('Correcta');
    }else{
        respuestas.push('Incorrecta');
        button.classList.add('styleOptionInactive')
       
        const botonCorrecto = [...buttons].find((element)=> element.value === results[index].correct_answer)
        if(botonCorrecto){
            botonCorrecto.classList.add('styleOptionActive')
        }
    }

    const botones = document.querySelectorAll('button');
    botones.forEach(boton => {
        boton.disabled = true;
    });
    printResults()
    return respuestas;
}

const printResults = () => {
    console.log(respuestas);//Utilizar para graficas y resultado final Almacenar local
}

getData()

//animacion tiempo
//animacion botones

