const buttonAdd = document.querySelector(".button-add-task");
let dataAtual;
let actualTaskDay;

// Essa vai ser inicialização do programa, ele já vai armazenar a chave "days" na variável localAllTasks quando o programa iniciar, e caso não tenha ele vai setar a chave pela primeira vez, e já vai adicionar logo e já vai atribuir logo em seguida para o localAllTasks o item que acabou de ser registrado.

let localAllTasks = JSON.parse(localStorage.getItem("days"));

if(localAllTasks === null) {
    localStorage.setItem("days", "[]");
    localAllTasks = JSON.parse(localStorage.getItem("days"));
}

localStorage.setItem("days", JSON.stringify(localAllTasks))

iniciarDiaSeEleJaExistir()

let tarefaASerApagada = "";

// Área responsável por criar o dia, e criar o objeto com os dados do dia.


const addDayButton = document.querySelector(".button-add");

addDayButton.addEventListener("click", () => {

    dataAtual = new Date().toLocaleDateString("pt-br");

    let dataJaExiste = verificaSeEssaDataExiste(dataAtual);

    if(!dataJaExiste) {
        actualTaskDay = {
            data: dataAtual,
            tasks: []
        };
    
        ativaDia(dataAtual);

        localAllTasks.push(actualTaskDay);

        localStorage.setItem("days", JSON.stringify(localAllTasks));

    } else {
        alert("Data já existe");
    }
});

function ativaDia(data) {
    document.querySelector(".main-content section h1").innerHTML = data;
    buttonAdd.removeAttribute("id");
}

// Funções do localStorage
function verificaSeEssaDataExiste(dataString) {
    let datasExistentes = localAllTasks.map(date => {
        return date.data;
    });

    console.log("Datas existentes ", datasExistentes);


    return datasExistentes.some(data => data === dataString);
}

function iniciarDiaSeEleJaExistir() {
    const currentDate = new Date().toLocaleDateString("pt-br");
    let lastDateRegistered;

    if(localAllTasks.length > 0) {
        lastDateRegistered = localAllTasks[localAllTasks.length - 1].data;
    }


    if(currentDate === lastDateRegistered) {
        lastDateRegistered = localAllTasks[localAllTasks.length - 1];
        ativaDia(currentDate);

        actualTaskDay = lastDateRegistered;
        renderizarListaDeTarefas();
    }
}


function salvarNoLocalStorage() {
    localAllTasks[localAllTasks.length - 1].tasks = actualTaskDay.tasks;

    localStorage.setItem("days", JSON.stringify(localAllTasks));
}

// Eventos na área de tarefas
const tasksArea = document.querySelector(".tasks");

tasksArea.addEventListener("click", (event) => {
    const nameTag = event.target.tagName;
    
    if(nameTag === "INPUT") {
        const pai = event.target.parentNode;
        if(pai.hasAttribute("id")) {
            pai.removeAttribute("id");
            getAllTasksAndRefresh();
        } else {
            pai.setAttribute("id", "checked");
            getAllTasksAndRefresh();
        }
    } else if(nameTag === "IMG") {
        const contentOfTask = event.target.parentNode.previousElementSibling.innerHTML;

        ativarModalDel(contentOfTask);
    }
});



// Renderização da lista de tarefas, e template html do modelo da tarefa

function renderizarListaDeTarefas() {
    const tasksArea = document.querySelector(".tasks");

    tasksArea.innerHTML = "";

    actualTaskDay.tasks.forEach((task) => {
        tasksArea.innerHTML += taskModel(task);
    });
}

function taskModel(task) {
    return `<div class="task" ${task[1] ? `id="checked"`:``}>
        <input type="checkbox" class="check-task" ${task[1] ? "checked":""}/>
        <p>${task[0]}</p>
        <button class="bt-trash">
            <img src="./assets/trash.png"/>
        </button>
    </div>`
}


// Modais básicos iniciais:
const modalCentral = document.querySelector(".central");
const modalAdd = document.querySelector(".add-task-modal");
const modalDel = document.querySelector(".delete-task-modal");

// Funções relacionadas aos modais básicos:

function desativarModais() {
    const modais = [modalCentral, modalAdd, modalDel];
    modais.forEach(mod => mod.setAttribute("id", "none"));

    tarefaASerApagada = "";
}

function ativarModalAdd() {
    desativarModais();
    const modais = [modalCentral, modalAdd];

    modais.forEach(mod => mod.removeAttribute("id"));
}

function ativarModalDel(task) {
    desativarModais();
    const modais = [modalCentral, modalDel];
    let delMessageArea = document.querySelector(".delete-text");
    delMessageArea.innerHTML = `Deseja apagar a tarefa: "${task}" ?`

    tarefaASerApagada = task;

    modais.forEach(mod => mod.removeAttribute("id"));
}

// Adição de tarefa a partir de eventos que liga o modal:

buttonAdd.addEventListener("click", () => {
    ativarModalAdd();
})

const addTaskButton = document.querySelector(".add-task");

addTaskButton.addEventListener("click", () => {
    const tasksModified = [];
    let tasksOfMoment = document.querySelectorAll(".task");

    tasksOfMoment.forEach((tas) => {
        tasksModified.push([tas.children[1].innerHTML, tas.getAttribute("id") != null ? true:false]);
    });

    const task = document.querySelector(".campo-add");

    actualTaskDay.tasks = [...tasksModified, [task.value, false]];

    salvarNoLocalStorage()

    task.value = "";
    
    desativarModais();
    renderizarListaDeTarefas();
});

// Essa função vai ser utilizada para pegar todas as tarefas e atualizar elas sempre de acordo com o id que elas possuem ou não, na hora de ativar ou desativar o checked
function getAllTasksAndRefresh() {
    const tasksModified = [];
    let tasksOfMoment = document.querySelectorAll(".task");

    tasksOfMoment.forEach((tas) => {
        tasksModified.push([tas.children[1].innerHTML, tas.getAttribute("id") != null ? true:false]);
    });

    actualTaskDay.tasks = tasksModified;

    salvarNoLocalStorage();
    renderizarListaDeTarefas();
}

// Deletar tarefa a partir do clique no botão de deletar do modal del

const deleteTaskButton = document.querySelector(".delete-task");


deleteTaskButton.addEventListener("click", () => {

    const tasksCurrent = document.querySelectorAll(".task"); 

    let tasksRemaining = [];

    tasksCurrent.forEach((task) => {
        const contentOfTask = task.children[1].innerHTML;
        const taskCompleteStatus = task.getAttribute("id") != null ? true : false;

        contentOfTask != tarefaASerApagada ? tasksRemaining.push([contentOfTask, taskCompleteStatus]):null;
    });

    actualTaskDay.tasks = tasksRemaining;

    salvarNoLocalStorage()

    renderizarListaDeTarefas();

    desativarModais();
})


// Fechamento de modais a partir do botão cancel

const cancelButton = document.querySelectorAll(".cancel");

cancelButton.forEach(bt => bt.addEventListener("click", desativarModais));



// Funções relacionadas aos modais de "ultimas tarefas" e "verificar a tarefa selecionada"

const lastTasksArea = document.querySelector(".last-days");
const buttonLastDays = document.querySelector(".button-last-days");
const lastTasksBox = document.querySelector(".days");
const sheetExclusiveForTaskSelected = document.querySelector(".visualize-task-selected-area");

buttonLastDays.addEventListener("click", activeModalLastTasks);

function activeModalLastTasks() {
    document.querySelector(".last-days").removeAttribute("id");

    rendersLastTasks();
}

// Função que vai renderizar cada ultima tarefa no modal de ultimas tarefas

function rendersLastTasks() {
    lastTasksBox.innerHTML = "";
    localAllTasks.forEach(ele => {
        const currentDate = new Date().toLocaleDateString("pt-br");
        if(ele.data != currentDate) {
            lastTasksBox.innerHTML += `<div class="day"  data-task-date="${ele.data}">
            <div class="date-of-tasks">${ele.data}</div>
                <div class="day-options">
                    <button class="see-task">Ver</button>
                    <button class="delete-task">Apagar</button>
                </div>
            </div>`
        }
    });
}


let dataASerDeletada;

// Evento no modal das tarefas anteriores inteiras, funcionando de acordo com o clique do usuário ele vai identificar, se for um botão, e qual é a classe daquele botão, e fazer efeitos diferentes de acordo com a informação obtida

lastTasksBox.addEventListener("click", function(e) {
    let tagName = e.target.tagName;

    if(tagName === "BUTTON" && e.target.getAttribute("class") === "see-task") {
        console.log("data selecionada foi " +e.target.parentNode.parentNode.getAttribute("data-task-date"));

        let dateSelected = e.target.parentNode.parentNode.getAttribute("data-task-date");

        let dateFound = localAllTasks.filter((day) => {
            if(day.data === dateSelected) {
                return true; 
            } else {
                return false;
            }
        });

        console.log("Tasks encontradas sobre o dia "+ dateSelected, dateFound);

        rendersLastTaskSelected(dateFound[0]);
    } else if (tagName === "BUTTON" && e.target.getAttribute("class") === "delete-task") {
        const pai = e.target.parentNode.parentNode.children;
        const dataSelecionada = pai[0].innerHTML;

        dataASerDeletada = dataSelecionada;

        confirmationDelete(dataSelecionada);
    }
})

// Função para ativar o modal de deleção de task no histórico selecionada.
function activeModalConfirmationDeletePreviousTask(message) {
    document.querySelector(".confirmation-area").removeAttribute("id");
    document.querySelector(".delete-text-confirmation").innerHTML = message;
}



const buttonConfirmationCancel = document.querySelector(".cancel-confirmation-modal");
const buttonConfirmationDelete = document.querySelector(".delete-task-confirmation");



buttonConfirmationCancel.addEventListener("click", cancelModalConfirmationDeletePreviousTask);

function confirmationDelete(data) {
    activeModalConfirmationDeletePreviousTask("Você deseja realmente apagar o histórico do dia "+data+" ?");
    
}

// Serve para fechar o modal de confirmação de deleção de determinada tarefa selecionada
function cancelModalConfirmationDeletePreviousTask() {
    document.querySelector(".confirmation-area").setAttribute("id", "none");
    dataASerDeletada = "";
}

buttonConfirmationDelete.addEventListener("click", () => {
    localAllTasks.forEach((task, index) => {
        if(task.data === dataASerDeletada) {
            localAllTasks.splice(index, 1);
        }
    });

    localStorage.setItem("days", JSON.stringify(localAllTasks));

    cancelModalConfirmationDeletePreviousTask()
    rendersLastTasks();
});

// Funções para ativar e desativar a folha da tarefa do histórico escolhido
function activeSheetOfTaskSelected() {
    sheetExclusiveForTaskSelected.removeAttribute("id");
}

function turnOffSheetOfTaskSelected() {
    sheetExclusiveForTaskSelected.setAttribute("id", "none");  
}


// Essa função vai costumizar a folha de task escolhida pelo histórico, e de acordo com a data, ele vai exibir as tarefas daquele dia, pondo tanto a data, quanto se ela foi concluída ou não a partir de um modelo.
function rendersLastTaskSelected(dataRecived) {
    const sheetTitleArea = document.querySelector(".date-of-task-selected");
    sheetTitleArea.innerHTML = "";
    sheetTitleArea.innerHTML = dataRecived.data;

    activeSheetOfTaskSelected();

    const sheetAreaTasks = document.querySelector(".tasks-of-day");
    sheetAreaTasks.innerHTML = "";

    dataRecived.tasks.forEach(task => {
        sheetAreaTasks.innerHTML += modelLastTaskSelected(task);
    });

}

function modelLastTaskSelected(task) {
    return `<div class="task-of-day-view" ${task[1]? 'id="checked""' : ""}>
        <input type="checkbox" checked disabled  id="${task[1] ? "complete":"incomplete"}"/>
        <div class="task-of-day-view-text">${task[0]}</div>
    </div>`;
}

// Funções de fechamento de modais de ultimas tarefas e tarefa selecionada nas ultimas tarefas

const closeTaskSelected = document.querySelector(".task-selected-close");
closeTaskSelected.addEventListener("click", turnOffSheetOfTaskSelected);

const lastDaysCloseButton = document.querySelector(".last-days-close");

function closeLastDays() {
    document.querySelector(".last-days").setAttribute("id", "none");
}

lastDaysCloseButton.addEventListener("click", closeLastDays);
