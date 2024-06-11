const url = 'https://opentdb.com/api.php?amount=10';
const quiz = document.querySelector('.quiz');
let options = [];
let results = [];
let index = 0;
let respuestas = [];
let fecha = new Date().toDateString() //Fecha para puntuacion

quiz.addEventListener('click', (ev)=>{
    ev.preventDefault()

    if(ev.target.tagName === 'BUTTON'){
        const valueOption = ev.target.value
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
    const pregunta = document.createElement('H3')
    pregunta.textContent = results[i].question;
    quiz.append(pregunta)

    options.forEach((opc, index) => {
        const buttonOption = document.createElement('BUTTON')
        buttonOption.textContent = opc;
        buttonOption.setAttribute('id', `option${index+1}`)
        buttonOption.classList.add(`option${index+1}`)
        buttonOption.value = opc
        quiz.append(buttonOption)
    });
    const buttonNext = document.createElement('INPUT')
    buttonNext.setAttribute('type', 'submit')
    buttonNext.value= 'Siguiente'
    buttonNext.setAttribute('id', 'siguiente')
    buttonNext.disabled = true;
    quiz.append(buttonNext)

    if(index === 9){
        printResults(respuestas)
    }
};

const validateResponse = (value, button)=>{
    const buttons = document.querySelectorAll('button')
    if(value === results[index].correct_answer){
        button.classList.add('styleOptionActive')
        respuestas.push(1);
    }else{
        respuestas.push(0);
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
    document.getElementById('siguiente').disabled = false;
    
}

const printResults = (respuestas) => {
    quiz.innerHTML='';

    const puntuacion = respuestas.reduce((acc, sum) => acc += sum, 0);

    const divPuntuacion = document.createElement('DIV')
    divPuntuacion.classList.add('divPuntuacion')
    const pResultado = document.createElement('P')
    const textoResultado = document.createElement('P')
    textoResultado.textContent = 'Este ha sido tu resultado'
    pResultado.textContent = `${puntuacion} / 10`
    pResultado.classList.add('stylePuntuacion')
    divPuntuacion.append(pResultado, )
    quiz.append(textoResultado, divPuntuacion)
}

getData()

//animacion tiempo
//animacion botones
//Guardar en firebase y LocalStorage
//Crear Usuarios Login y Resistro

const logearPlayer = (email, password) => {
firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let player = userCredential.user;
            console.log(`se ha logado ${player.email} ID:${player.uid}`)
            alert(`se ha logado ${player.email} ID:${player.uid}`)
            console.log("USER", player);
            //AQUI LLAMARIAMOS A LA FUNCION PARA IR A LA PANTALLA  DE INICIO
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)

        });

};

const salirPlayer = () => {
    let player = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + player.nombreJugador)
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
    location.reload()
}

const darDeAlta = (nombreJugador, email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let player = userCredential.user;
            console.log(`se ha registrado ${player.email} ID:${player.uid}`)
            alert(`se ha registrado ${player.nombreUsuario}`)
            // Guardamos el usuario en firebase
            crearUsuario({
                id: player.uid,
                email: player.email,
                Puntuaciones: [],
                nombreJugador: nombreJugador
            });
            //pintarLogin(); aqui iria la funcion para ir a la pantalla de logearse
        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });

};

const crearPlayer = (players) => {
    db.collection("players")
        .doc(players.email)
        .set(players)
        .then(() => console.log(`usuario guardado correctamente con id: ${players.email}`))
        .catch((error) => console.error("Error adding document: ", error));
};

