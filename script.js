const buttonAdd = document.querySelector(".button-add-task");
const modalCentral = document.querySelector(".central");

const tasks = [];

const modalAdd = document.querySelector(".add-task-modal");


const cancelAddButton = document.querySelector(".add-cancel");

cancelAddButton.addEventListener("click", desativarModais);



const addTaskButton = document.querySelector(".add-task");

addTaskButton.addEventListener("click", () => {
    const task = document.querySelector(".campo-add");

    tasks.push(task.value);

    task.value = "";
    
    desativarModais();
    renderizarListaDeTarefas();
});


const modalDel = document.querySelector(".delete-task-modal");







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
}

function ativarModalAdd() {
    desativarModais();
    const modais = [modalCentral, modalAdd];

    modais.forEach(mod => mod.removeAttribute("id"));
}

function ativarModalDel() {
    desativarModais();
    const modais = [modalCentral, modalDel];

    modais.forEach(mod => mod.removeAttribute("id"));
}

