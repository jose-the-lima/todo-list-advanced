const buttonAdd = document.querySelector(".button-add-task");
let dataAtual;
let actualTaskDay;

// Essa vai ser inicialização do programa, ele já vai armazenar a chave "days" na variável localAllTasks quando o programa iniciar, e caso não tenha ele vai setar a chave pela primeira vez, e já vai adicionar logo e já vai atribuir logo em seguida para o localAllTasks o item que acabou de ser registrado.

let localAllTasks = JSON.parse(localStorage.getItem("days"));

if(localAllTasks === null) {
    console.log(`O local-all-tasks está vazio ou seja ${localAllTasks}`);
    
    localStorage.setItem("days", JSON.stringify([]));
    localAllTasks = JSON.parse(localStorage.getItem("days"));
}

console.log(`localAllTasks agora: ${localAllTasks}`);

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


// Modais:
const modalCentral = document.querySelector(".central");
const modalAdd = document.querySelector(".add-task-modal");
const modalDel = document.querySelector(".delete-task-modal");

// Funções relacionadas ao modal:

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