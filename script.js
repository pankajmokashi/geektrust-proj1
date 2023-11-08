const search = document.getElementById("search");
const userRows = document.getElementById("user-rows");
const selectAll = document.getElementById("select-all");
const pagiationbtns = document.getElementById("pagination-btn");
const deleteSelected = document.getElementById("delete-selected");
const first = document.getElementById("first");
const last = document.getElementById("last");
const increment = document.getElementById("increment");
const decrement = document.getElementById("decrement");

const mainBox = document.getElementById("main-box");
const editBox = document.getElementById("edit-box");
const close = document.getElementById("close");
const save = document.getElementById("save");
const name = document.getElementById("name");
const email = document.getElementById("email");
const role = document.getElementById("role");

const url =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
const usersPerPage = 10;
const maxVisiblePages = 5;
let currentPage = 1;
var searchVal = "";
let data = [];

async function fetchUsers(url) {
  const response = await fetch(url);
  data = await response.json();
  searchUser(data, searchVal);
}

fetchUsers(url);

function searchUser(userData, searchVal) {
  selectAll.checked = false;
  let filteredData = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchVal) ||
      user.email.includes(searchVal) ||
      user.role.toLowerCase().includes(searchVal)
  );

  pagination(filteredData);
  filteredData = filteredData.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  
  addUserRow(filteredData);
}

function addUserRow(userData) {

  userRows.innerHTML = "";
  userData.forEach((user) => {
    const tr = document.createElement("tr");
    tr.id = user.id;
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "selectedUser";
    input.id = user.id;
    td.appendChild(input);
    tr.appendChild(td);
    tr.innerHTML =
      tr.innerHTML +
      `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td class="hide">${user.role}</td>
    `;
    const icon = document.createElement("td");
    const edit = document.createElement("i");
    edit.classList = "fa-solid fa-pen-to-square";
    edit.id = "edit-data";
    edit.addEventListener("click", () => {
      mainBox.style.display = "none";
      editBox.style.display = "flex";
      displayEditBox(user);
    });
    const iDelete = document.createElement("i");
    iDelete.classList = "fa-solid fa-trash red";
    iDelete.addEventListener("click", directDelete);
    icon.appendChild(edit);
    icon.appendChild(iDelete);
    tr.appendChild(icon);
    userRows.appendChild(tr);
  });
}

search.addEventListener("keyup", (e) => {
  searchVal = e.target.value.trim().toLowerCase();
  searchUser(data, searchVal);
});

function pagination(users) {
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (currentPage == 1) {
    first.disabled = true;
    decrement.disabled = true;
  } else {
    first.disabled = false;
    decrement.disabled = false;
  }

  if (currentPage == totalPages) {
    last.disabled = true;
    increment.disabled = true;
  } else {
    last.disabled = false;
    increment.disabled = false;
  }

  pagiationbtns.innerHTML = "";

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = i === currentPage ? "active" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      searchUser(data, searchVal, i);
    });
    pagiationbtns.appendChild(btn);
  }
}

function handleDelete() {
  const selected = document.getElementsByClassName("selectedUser");
  for (let i = 0; i < 10; i++) {
    if (selected[i] && selected[i].checked) {
      data = data.filter(
        (user) => user.id != selected[i].parentElement.parentElement.id
      );
    }
  }
  if (selectAll.checked == true) {
    currentPage = 1;
  }
  searchUser(data, searchVal);
}
deleteSelected.addEventListener("click", handleDelete);

function deleteAll(e) {
  const selected = document.getElementsByClassName("selectedUser");
  if (e.target.checked) {
    for (let i = 0; i < 10; i++) {
      selected[i].checked = true;
    }
  } else {
    for (let i = 0; i < 10; i++) {
      selected[i].checked = false;
    }
  }
}
selectAll.addEventListener("change", deleteAll);

function directDelete(e) {
  let element = e.target.parentElement.parentElement;
  data = data.filter((user) => user.id != element.id);
  searchUser(data, searchVal);
}

function firstPage() {
  currentPage = 1;
  searchUser(data, searchVal);
}

function lastpage() {
  currentPage = Math.ceil(data.length / usersPerPage);
  searchUser(data, searchVal);
}

function decrementPage() {
  if (currentPage > 1) {
    currentPage = currentPage - 1;
  }
  searchUser(data, searchVal);
}

function incrementPage() {
  if (currentPage < Math.ceil(data.length / usersPerPage)) {
    currentPage = currentPage + 1;
  }
  searchUser(data, searchVal);
}

function displayEditBox(user) {
  name.value = user.name;
  email.value = user.email;
  role.value = user.role;

  save.addEventListener("click", () => {
    data.map((item) => {
      if(item.id == user.id){
        item.name = name.value;
        item.email = email.value;
        item.role = role.value;
      }
    })
    mainBox.style.display = "block";
    editBox.style.display = "none";
    search.value = "";
    searchUser(data, "");
  });
}

close.addEventListener("click", () => {
  mainBox.style.display = "block";
  editBox.style.display = "none";
});
