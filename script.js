const buttonAdd = document.querySelector(".button-add-task");
const modalCentral = document.querySelector(".central");

let tarefaASerApagada = "";



const tasksArea = document.querySelector(".tasks");
const tasks = [];

const modalAdd = document.querySelector(".add-task-modal");


const cancelButton = document.querySelectorAll(".cancel");

cancelButton.forEach(bt => bt.addEventListener("click", desativarModais));



const addTaskButton = document.querySelector(".add-task");

addTaskButton.addEventListener("click", () => {
    const task = document.querySelector(".campo-add");

    tasks.push(task.value);

    task.value = "";
    
    desativarModais();
    renderizarListaDeTarefas();
});


const modalDel = document.querySelector(".delete-task-modal");

const deleteTaskButton = document.querySelector(".delete-task");


deleteTaskButton.addEventListener("click", () => {
    tasks.splice(tasks.indexOf(tarefaASerApagada), 1);

    renderizarListaDeTarefas();

    desativarModais();
})






buttonAdd.addEventListener("click", () => {
    ativarModalAdd();
})


function renderizarListaDeTarefas() {
    const tasksArea = document.querySelector(".tasks");

    tasksArea.innerHTML = "";

    tasks.forEach((task) => {
        tasksArea.innerHTML += `<div class="task">
        <input type="checkbox" class="check-task"/>
        <p>${task}</p>
        <button class="bt-trash">
            <img src="./assets/trash.png"/>
        </button>
    </div>`
    });
}


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

tasksArea.addEventListener("click", (event) => {
    const nameTag = event.target.tagName;
    
    if(nameTag === "INPUT") {
        const pai = event.target.parentNode;
        if(pai.hasAttribute("id")) {
            pai.removeAttribute("id");
        } else {
            pai.setAttribute("id", "checked");
        }
    } else if(nameTag === "IMG") {

        const contentOfTask = event.target.parentNode.previousElementSibling.innerHTML;

        ativarModalDel(contentOfTask);
    }
});