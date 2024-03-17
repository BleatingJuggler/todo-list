// Get the input elements

const titleInput = document.getElementById("taskTitle");
const descriptionInput = document.getElementById("taskDescription");

// Add event listeners to input fields
titleInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    descriptionInput.focus(); // Move focus to description input
  }
});

descriptionInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask(); // Call the addTask function
  }
});

function addTask() {
  function responseBody(jsonBody) {
    console.log(jsonBody);
  }

  function callbackFn(response) {
    response.json().then(responseBody);
  }

  fetch("http://localhost:3000/todos", {
    method: "GET",
  }).then(callbackFn);

  // fetch("http://localhost:3000/todos", {
  //   method: "POST",
  //   body : JSON.stringify({
  //     title : "something",
  //     description : "some description" 
  //   }),
  //   headers : {
  //     "Content-Type" : "application/json"
  //   }
  // }).then(callbackFn);

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (title !== "") {
    const li = document.createElement("li");
    const titleElem = document.createElement("h3");
    titleElem.textContent = title;
    const descriptionElem = document.createElement("p");
    descriptionElem.textContent = description;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      li.remove();
    });

    li.appendChild(titleElem);
    li.appendChild(descriptionElem);
    li.appendChild(deleteBtn);

    const taskList = document.getElementById("taskList");
    taskList.appendChild(li);

    // Clear inputs
    titleInput.value = "";
    descriptionInput.value = "";
    titleInput.focus(); // Move focus back to title input
  } else {
    alert("Please enter a title for the task.");
  }
}
