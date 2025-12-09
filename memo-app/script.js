// DOM 要素
const memoInput = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const memoList = document.getElementById("memoList");
const themeToggle = document.getElementById("themeToggle");

// LocalStorage 操作
function loadMemos() {
  return JSON.parse(localStorage.getItem("memos") || "[]");
}
// LocalStorage にメモを保存
function saveMemos(memos) {
  localStorage.setItem("memos", JSON.stringify(memos));
}

// ダークモード読み込み
function loadTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark", theme === "dark");
}
loadTheme();

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// メモ表示
function render() {
  const memos = loadMemos();
  memoList.innerHTML = "";

  memos.forEach(memo => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${memo.text}</span>
      <div class="btn-group">
        <button class="edit" data-id="${memo.id}">編集</button>
        <button class="delete" data-id="${memo.id}">削除</button>
      </div>
    `;

    memoList.appendChild(li);
  });
}

// メモ追加
addBtn.addEventListener("click", () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const memos = loadMemos();
  memos.push({ id: Date.now(), text });
  saveMemos(memos);

  memoInput.value = "";
  render();
});

// 編集・削除
memoList.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const memos = loadMemos();

  if (e.target.classList.contains("delete")) {
    const newMemos = memos.filter(m => m.id !== id);
    saveMemos(newMemos);
    render();
    return;
  }

  if (e.target.classList.contains("edit")) {
    const memo = memos.find(m => m.id === id);
    const newText = prompt("編集内容を入力：", memo.text);

    if (newText !== null && newText.trim() !== "") {
      memo.text = newText;
      saveMemos(memos);
      render();
    }
  }
});

render();
