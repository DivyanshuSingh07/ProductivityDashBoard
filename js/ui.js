/* ==========================
        UI HELPERS
========================== */

/* ==========================
        TOAST
========================== */

function showToast(message, type = "success") {

    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    let icon = "ri-information-line";

    if (type === "success") {

        icon = "ri-checkbox-circle-fill";

    }

    else if (type === "error") {

        icon = "ri-error-warning-fill";

    }

    toast.innerHTML = `

        <i class="${icon}"></i>

        <span>${message}</span>

    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

/* ==========================
        MODAL
========================== */

function openTaskModal() {

    const modal = document.getElementById("task-modal");

    if (!modal) return;

    modal.classList.remove("hidden");

}

function closeTaskModal() {

    const modal = document.getElementById("task-modal");

    if (!modal) return;

    modal.classList.add("hidden");

    document.getElementById("task-form").reset();

    document.getElementById("task-id").value = "";

    document.getElementById("modal-title").textContent = "Add New Task";

}

/* ==========================
        INITIALIZE MODAL
========================== */

function initializeModal() {

    const addTaskBtn = document.getElementById("add-task-btn");

    const closeBtn = document.getElementById("close-modal");

    const cancelBtn = document.getElementById("cancel-task");

    const overlay = document.getElementById("task-modal");

    if(addTaskBtn){

        addTaskBtn.addEventListener("click", openTaskModal);

    }

    if(closeBtn){

        closeBtn.addEventListener("click", closeTaskModal);

    }

    if(cancelBtn){

        cancelBtn.addEventListener("click", closeTaskModal);

    }

    if(overlay){

        overlay.addEventListener("click",(event)=>{

            if(event.target===overlay){

                closeTaskModal();

            }

        });

    }

}