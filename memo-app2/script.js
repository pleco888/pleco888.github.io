
<!-- app.js -->
// ================================
// 変数とデータ読み込み
// ================================
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentIndex = null;

const memoGrid = document.getElementById("memoGrid");
const titleList = document.getElementById("titleList");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const editTitle = document.getElementById("editTitle");
const editBody = document.getElementById("editBody");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

// ================================
// 保存
// ================================
function saveNotes() {
localStorage.setItem("notes", JSON.stringify(notes));
}

// ================================
// メイン画面にメモを描画（3カラム）
// ================================
function renderGrid(list = notes) {
memoGrid.innerHTML = "";
list.forEach((note, index) => {
const div = document.createElement("div");
div.className = "memo";
div.innerHTML = `
<div class="memo-title">${note.title}</div>
<div class="memo-body">${note.body.substring(0, 120)}</div>
`;
div.addEventListener("click", () => openModal(index));
memoGrid.appendChild(div);
});
}

// ================================
// サイドバーのタイトル一覧
// ================================
function renderTitles(list = notes) {
titleList.innerHTML = "";
list.forEach((note, index) => {
const li = document.createElement("li");
li.textContent = note.title;
li.addEventListener("click", () => scrollToMemo(index));
titleList.appendChild(li);
});
}

// ================================
// メモクリック → モーダル表示
// ================================
function openModal(index) {
currentIndex = index;
const note = notes[index];
editTitle.value = note.title;
editBody.value = note.body;

overlay.classList.remove("hidden");
modal.classList.remove("hidden");
}




renderGrid();
renderTitles();
closeModal();
});

// ================================
// 削除ボタン
// ================================
deleteBtn.addEventListener("click", () => {
if (currentIndex === null) return;
if (!confirm("削除しますか？")) return;

notes.splice(currentIndex, 1);
saveNotes();
renderGrid();
renderTitles();
closeModal();
});

// ================================
// 新規追加
// ================================
addBtn.addEventListener("click", () => {
const title = prompt("タイトルを入力してください");
if (!title) return;

const body = prompt("本文を入力してください");
notes.push({ title, body });

saveNotes();
renderGrid();
renderTitles();
});

// ================================
// メモ検索機能
// ================================
searchInput.addEventListener("input", () => {
const keyword = searchInput.value.toLowerCase();
const filtered = notes.filter(note =>
note.title.toLowerCase().includes(keyword) ||
note.body.toLowerCase().includes(keyword)
);

renderGrid(filtered);
renderTitles(filtered);
});

// ================================
// タイトルを押す → 該当メモへスクロール
// ================================
function scrollToMemo(index) {
const memoItems = document.querySelectorAll(".memo");
if (memoItems[index]) {
memoItems[index].scrollIntoView({ behavior: "smooth" });
}
}

// 初期描画
renderGrid();
renderTitles();


// ================================
// ダークモード
// ================================
const themeToggle = document.getElementById("themeToggle");

// 前回の設定を反映
if (localStorage.getItem("theme") === "dark") {
  enableDark();
}

themeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    disableDark();
  } else {
    enableDark();
  }
});

function enableDark() {
  document.body.classList.add("dark");
  document.querySelector(".sidebar").classList.add("dark");
  document.getElementById("overlay").classList.add("dark");
  document.getElementById("modal").classList.add("dark");
  document.getElementById("editTitle").classList.add("dark");
  document.getElementById("editBody").classList.add("dark");

  // メモ
  document.querySelectorAll(".memo").forEach(m => m.classList.add("dark"));
  document.querySelectorAll("#titleList li").forEach(li => li.classList.add("dark"));

  localStorage.setItem("theme", "dark");
}

function disableDark() {
  document.body.classList.remove("dark");
  document.querySelector(".sidebar").classList.remove("dark");
  document.getElementById("overlay").classList.remove("dark");
  document.getElementById("modal").classList.remove("dark");
  document.getElementById("editTitle").classList.remove("dark");
  document.getElementById("editBody").classList.remove("dark");

  document.querySelectorAll(".memo").forEach(m => m.classList.remove("dark"));
  document.querySelectorAll("#titleList li").forEach(li => li.classList.remove("dark"));

  localStorage.setItem("theme", "light");
}


// オープンモーダル

function openModal(index) {
  currentIndex = index;
  const note = notes[index];
  editTitle.value = note.title;
  editBody.value = note.body;

  overlay.classList.remove("hidden");

  modal.classList.remove("hidden");
  modal.classList.remove("modal-close");
  modal.classList.add("modal-open");
}

// クローズモーダル

function closeModal() {
  modal.classList.remove("modal-open");
  modal.classList.add("modal-close");

  setTimeout(() => {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
  }, 180); // アニメーション時間と合わせる
}
