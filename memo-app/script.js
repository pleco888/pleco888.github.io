// =============================
// メモアプリ JS（完全分割版）
// =============================

// ---- 要素取得 ----
const memoForm = document.getElementById('memo-form');
const memoTitle = document.getElementById('memo-title');
const memoContent = document.getElementById('memo-content');
const memoGrid = document.getElementById('memo-grid');
const searchInput = document.getElementById('search-input');
const titleList = document.getElementById('title-list');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalSave = document.getElementById('modal-save');
const modalDelete = document.getElementById('modal-delete');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");


// ---- メモ配列 ----
let memos = JSON.parse(localStorage.getItem('memos')) || [];
let currentEditId = null;

// =============================
// 新規メモフォーム送信
// =============================
  memoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = memoTitle.value.trim();
  const content = memoContent.value.trim();
  if (!title) return;

  const newMemo = {
    id: Date.now(),
    title,
    content
  };

  memos.push(newMemo);
  saveMemos();
  renderGrid();
  renderTitles();

  memoTitle.value = "";
  memoContent.value = "";
}); 

// =============================
// メモカード表示（メイン3カラム）
// =============================
function renderGrid() {
  memoGrid.innerHTML = "";

  const keyword = (searchInput.value || "").toLowerCase();

  memos
  //.filter(m => m.title.toLowerCase().includes(keyword))
    .filter((m) => m.title && m.title.toLowerCase().includes(keyword))
    .forEach((memo) => {
      const card = document.createElement('div');
      card.className = 'memo-card fade-in';
      card.innerHTML = `
        <h3>${memo.title}</h3>
        <p>${(memo.content || "").substring(0, 50)}...</p>
      `;

      card.addEventListener('click', () => openModal(memo.id));

      memoGrid.appendChild(card);
    });
}

// =============================
// サイドバー：メモタイトル一覧
// =============================
function renderTitles() {
  titleList.innerHTML = "";

  const keyword = (searchInput.value || "").toLowerCase();

  memos
  //.filter(m => m.title.toLowerCase().includes(keyword))
    .filter((m) => m.title && m.title.toLowerCase().includes(keyword))
    .forEach((memo) => {
      const li = document.createElement('li');
      li.textContent = memo.title;
      li.className = 'title-item fade-in';

      li.addEventListener('click', () => openModal(memo.id));

      titleList.appendChild(li);
    });
}

// =============================
// モーダル開く (新規＆編集)
// =============================

addBtn.addEventListener('click', () => {
openModal(null);
});

function openModal(id = null) {
  // サイドバーを閉じる
    sidebar.classList.remove("open");

  const memo = memos.find((m) => m.id === id);
  currentEditId = id;

  // 新規モード
  if (!memo) {
  modalTitle.value = "";
  modalBody.value = "";
  } else {
  modalTitle.value = memo.title;
  modalBody.value = memo.content;
  }

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// =============================
// モーダル閉じる（背景クリック）
// =============================
/* modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('open');
  }
});  */
overlay.addEventListener("click", closeModal);

  function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  }

// =============================
// メモ保存（編集or新規）
// =============================
modalSave.addEventListener("click", () => {
  let title = modalTitle.value.trim();
  const content = modalBody.value.trim();

  // 自動タイトル
  if (!title) title = "タイトル";

  if (currentEditId === null) {
    memos.push({
      id: Date.now(),
      title,
      content,
    });
  } else {
    const memo = memos.find((m) => m.id === currentEditId);
    memo.title = title;
    memo.content = content;
  }

  saveMemos();
  renderGrid();
  renderTitles();
  closeModal();
});


// =============================
// メモ削除
// =============================
modalDelete.addEventListener("click", () => {
if (currentEditId === null) return;
  memos = memos.filter((m) => m.id !== currentEditId);
saveMemos();
renderGrid();
renderTitles();
modal.classList.remove('open');	closeModal();
});

// =============================
// ローカルストレージ保存
// =============================
function saveMemos() {
  localStorage.setItem('memos', JSON.stringify(memos));
}


// =============================
// サイドメニュー（スマホ）
// =============================
menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.remove("hidden");
});

overlay.addEventListener("click", () => {
  //sidebar.classList.remove("open");
  closeModal();
});

const sideAddBtn = document.getElementById("sideAddBtn");
sideAddBtn.addEventListener("click", () => openModal(null));

// =============================
// 検索
// =============================
searchInput.addEventListener('input', () => {
  renderGrid();
  renderTitles();
});

// =============================
// ダークモード切り替え
// =============================
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// =============================
// 初期表示
// =============================
renderGrid();
renderTitles();

