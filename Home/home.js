function updateDateTime() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();

    const dayName = days[now.getDay()];
    const date = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    document.getElementById("day-name").textContent = dayName;
    document.getElementById("date-time").textContent = `${date}, ${time}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();
const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
const months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
const renderCalendar = () => {
let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), 
lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), 
lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), 
lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); 
let liTag = "";
for (let i = firstDayofMonth; i > 0; i--) { 
liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
}
for (let i = 1; i <= lastDateofMonth; i++) {
let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
             && currYear === new Date().getFullYear() ? "active" : "";
liTag += `<li class="${isToday}">${i}</li>`;
}
for (let i = lastDayofMonth; i < 6; i++) { 
liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
}
currentDate.innerText = `${months[currMonth]} ${currYear}`; 
daysTag.innerHTML = liTag;
}
renderCalendar();
prevNextIcon.forEach(icon => { 
icon.addEventListener("click", () => { 
currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
if(currMonth < 0 || currMonth > 11) { 
    date = new Date(currYear, currMonth, new Date().getDate());
    currYear = date.getFullYear(); 
    currMonth = date.getMonth(); 
} else {
    date = new Date(); 
}
renderCalendar(); 
});
});

async function generateQuote() {
    const apiUrl = "https://api.adviceslip.com/advice"; 

    try {
        console.log("Fetching quote...");
        let quoteText = "";
        
        while (true) {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log("API Data:", data);

            quoteText = data.slip.advice;
            const wordCount = quoteText.split(" ").length; 

            if (wordCount >= 10 && wordCount <= 15) {
                break; 
            }
        }

        document.getElementById("quote").textContent = `"${quoteText}"`;
        document.getElementById("author").textContent = `- Bengali Baba`;
    } 
    catch (error) {
        console.error("Error fetching quote:", error);
        document.getElementById("quote").textContent = "⚠️ Unable to load a quote. Please try again!";
        document.getElementById("author").textContent = "";
    }
}

generateQuote();

let id = '9505fd1df737e20152fbd78cdb289b6a';
let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + id;
let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');
form.addEventListener("submit", (e) => {
    e.preventDefault();  
    if(valueSearch.value != ''){
        searchWeather();
    }
});
const searchWeather = () => {
    fetch(url+'&q='+ valueSearch.value)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.cod == 200){
                city.querySelector('figcaption').innerHTML = data.name;
                city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                temperature.querySelector('span').innerText = data.main.temp;
                description.innerText = data.weather[0].description;

                clouds.innerText = data.clouds.all;
                humidity.innerText = data.main.humidity;
                pressure.innerText = data.main.pressure;
            }else{
                main.classList.add('error');
                setTimeout(() => {
                    main.classList.remove('error');
                }, 1000);
            }
            valueSearch.value = '';
        })
}

const initApp = () => {
    valueSearch.value = 'Washington';
    searchWeather();
}
initApp();

let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({ text: newTask, disabled: false });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
    `;
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoList.appendChild(p);
  });
  todoCount.textContent = todo.length;
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}


