document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".todo-input");
  const addButton = document.querySelector(".add-button");
  const todosHtml = document.querySelector(".todos");
  const emptyImage = document.querySelector(".empty-image");
  const deleteAllButton = document.querySelector(".delete-all");
  const filters = document.querySelectorAll(".filter");

  let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
  let filter = '';

  showTodos();

  function getTodoHtml(todo, index) {
    if (filter && filter !== todo.status) return '';
    
    const checked = todo.status === "completed" ? "checked" : "";
    
    return /* html */ `
      <li class="todo">
        <label>
          <input type="checkbox" ${checked} data-index="${index}">
          <span class="${checked}">${todo.name}</span>
        </label>
        <button class="edit-btn" data-index="${index}"><i class="fa fa-edit"></i></button>
        <button class="delete-btn" data-index="${index}"><i class="fa fa-times"></i></button>
      </li>
    `;
  }

  function showTodos() {
    todosHtml.innerHTML = todosJson.length
      ? todosJson.map(getTodoHtml).join('')
      : '';
      
    emptyImage.style.display = todosJson.length ? 'none' : 'block';
  }

  function addTodo(todo) {
    todosJson.unshift({ name: todo, status: "pending" });
    updateTodos();
    input.value = "";
  }

  function updateTodos() {
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }

  input.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      let todo = input.value.trim();
      if (todo) {
        addTodo(todo);
      } else {
        showToast("Task cannot be empty!", "error");
      }
    }
  });

  addButton.addEventListener("click", () => {
    let todo = input.value.trim();
    if (todo) {
      addTodo(todo);
    } else {
      showToast("Task cannot be empty!", "error");
    }
  });

  todosHtml.addEventListener("click", (e) => {
    if (e.target.closest(".delete-btn")) {
      const index = e.target.closest(".delete-btn").dataset.index;
      removeTodoByIndex(index);
    } else if (e.target.closest(".edit-btn")) {
      const index = e.target.closest(".edit-btn").dataset.index;
      editTodoByIndex(index);
    } else if (e.target.type === "checkbox") {
      const index = e.target.dataset.index;
      toggleTodoStatus(index);
    }
  });

  function removeTodoByIndex(index) {
    todosJson.splice(index, 1);
    updateTodos();
    showToast("Task removed successfully", "success");
  }

  function editTodoByIndex(index) {
    const newTask = prompt("Edit your task:", todosJson[index].name);
    if (newTask && newTask.trim()) {
      todosJson[index].name = newTask.trim();
      updateTodos();
      showToast("Task updated successfully", "success");
    } else {
      showToast("Task cannot be empty!", "error");
    }
  }

  function toggleTodoStatus(index) {
    todosJson[index].status = todosJson[index].status === "completed" ? "pending" : "completed";
    updateTodos();
  }

  filters.forEach(filterElement => {
    filterElement.addEventListener("click", () => {
      if (filterElement.classList.contains('active')) {
        filterElement.classList.remove('active');
        filter = '';
      } else {
        filters.forEach(f => f.classList.remove('active'));
        filterElement.classList.add('active');
        filter = filterElement.dataset.filter;
      }
      showTodos();
    });
  });

  deleteAllButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      todosJson = [];
      updateTodos();
      showToast("All tasks deleted", "info");
    }
  });

  function showToast(message, type = "info") {
    // Optionally, add a toast notification system to show feedback
    // This can be a simple div that shows messages for a few seconds.
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
});
