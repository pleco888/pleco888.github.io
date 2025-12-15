// =============================
// メモアプリ JS（完全分割版）
// =============================
// このファイルは以下を担当
// ・メモの作成／編集／削除
// ・モーダル制御
// ・サイドバー制御（スマホ対応）
// ・検索／ダークモード
// ・localStorage保存
// =============================


// =============================
// DOM要素取得
// =============================

const memoForm = document.getElementById('memo-form');      // 新規メモフォーム
const memoTitle = document.getElementById('memo-title');   // 新規メモタイトル入力
const memoContent = document.getElementById('memo-content'); // 新規メモ本文入力
const memoGrid = document.getElementById('memo-grid');     // メモカード表示エリア
const searchInput = document.getElementById('search-input'); // 検索入力
const titleList = document.getElementById('title-list');   // サイドバーのタイトル一覧

const addBtn = document.getElementById('addBtn');          // 「＋メモ追加」ボタン
const modal = document.getElementById('modal');            // モーダル全体
const modalTitle = document.getElementById('modal-title'); // モーダル内タイトル
const modalBody = document.getElementById('modal-body');   // モーダル内本文
const modalSave = document.getElementById('modal-save');   // 保存ボタン
const modalDelete = document.getElementById('modal-delete'); // 削除ボタン

const darkModeToggle = document.getElementById('dark-mode-toggle'); // ダークモード切替
const overlay = document.getElementById("overlay");        // 背景オーバーレイ
const menuBtn = document.getElementById("menuBtn");        // サイドバー開くボタン
const sidebar = document.querySelector(".sidebar");        // サイドバー本体


// =============================
// メモデータ管理
// =============================
// localStorage に保存されているメモを読み込む
// なければ空配列を使う
let memos = JSON.parse(localStorage.getItem('memos')) || [];

// 現在編集中のメモID
// ・null → 新規作成
// ・数値 → 編集モード
let currentEditId = null;


// =============================
// 新規メモフォーム送信処理
// =============================
// 「フォーム送信」＝ Enterキー or 送信ボタン
memoForm.addEventListener('submit', (e) => {

  // フォームのデフォルト送信（ページリロード）を止める
  e.preventDefault();

  // 入力値を取得（前後の空白は削除）
  const title = memoTitle.value.trim();
  const content = memoContent.value.trim();

  // タイトルが空なら何もしない
  if (!title) return;

  // 新しいメモオブジェクトを作成
  const newMemo = {
    id: Date.now(), // 一意なIDとして現在時刻を使用
    title,
    content
  };

  // メモ配列に追加
  memos.push(newMemo);

  // 保存 → 再描画
  saveMemos();
  renderGrid();
  renderTitles();

  // フォームを空に戻す
  memoTitle.value = "";
  memoContent.value = "";
});


// =============================
// メモカード表示（メイン3カラム）
// =============================
// memoGrid（中央エリア）にカード形式で表示する
function renderGrid() {

  // 一度すべて消す（再描画のため）
  memoGrid.innerHTML = "";

  // 検索キーワード（小文字化して比較用）
  const keyword = (searchInput.value || "").toLowerCase();

  memos
    // タイトルが存在し、検索ワードを含むものだけ
    .filter((m) => m.title && m.title.toLowerCase().includes(keyword))

    // フィルタ後のメモを1件ずつ処理
    .forEach((memo) => {

      // カード要素作成
      const card = document.createElement('div');
      card.className = 'memo-card fade-in';

      // カード内HTML
      card.innerHTML = `
        <h3>${memo.title}</h3>
        <p>${(memo.content || "").substring(0, 50)}...</p>
      `;

      // クリックすると編集モーダルを開く
      card.addEventListener('click', () => openModal(memo.id));

      // 画面に追加
      memoGrid.appendChild(card);
    });
}


// =============================
// サイドバー：メモタイトル一覧
// =============================
// スマホ・PC共通で使うタイトルリスト
function renderTitles() {

  // 一度リセット
  titleList.innerHTML = "";

  const keyword = (searchInput.value || "").toLowerCase();

  memos
    .filter((m) => m.title && m.title.toLowerCase().includes(keyword))
    .forEach((memo) => {

      const li = document.createElement('li');
      li.textContent = memo.title;
      li.className = 'title-item fade-in';

      // タイトルクリック → 編集モーダル
      li.addEventListener('click', () => openModal(memo.id));

      titleList.appendChild(li);
    });
}


// =============================
// モーダル開く（新規＆編集）
// =============================

// 「＋メモ追加」ボタン
addBtn.addEventListener('click', () => {
  openModal(null); // null = 新規作成
});

// モーダルを開く共通関数
function openModal(id = null) {

  // スマホ時：サイドバーを閉じる
  sidebar.classList.remove("open");

  // 編集対象のメモを取得
  const memo = memos.find((m) => m.id === id);
  currentEditId = id;

  // 新規作成モード
  if (!memo) {
    modalTitle.value = "";
    modalBody.value = "";
  } 
  // 編集モード
  else {
    modalTitle.value = memo.title;
    modalBody.value = memo.content;
  }

  // モーダルと背景を表示
  modal.classList.remove("hidden");
  modal.classList.add("show");
  overlay.classList.remove("hidden");
}


// =============================
// モーダルを閉じる処理
// =============================

// モーダル背景クリック
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// オーバーレイクリックでモーダルを閉じる
overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  closeModal();
});

// 共通クローズ関数
function closeModal() {
  modal.classList.remove("show");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}


// =============================
// メモ保存（新規 or 編集）
// =============================
modalSave.addEventListener("click", () => {

  let title = modalTitle.value.trim();
  const content = modalBody.value.trim();

  // タイトル未入力時の保険
  if (!title) title = "タイトル";

  // 新規作成
  if (currentEditId === null) {
    memos.push({
      id: Date.now(),
      title,
      content,
    });
  } 
  // 編集更新
  else {
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

  // 新規作成中は削除不可
  if (currentEditId === null) return;

  // 指定ID以外だけ残す
  memos = memos.filter((m) => m.id !== currentEditId);

  saveMemos();
  renderGrid();
  renderTitles();
  closeModal();
});


// =============================
// localStorage 保存
// =============================
function saveMemos() {
  localStorage.setItem('memos', JSON.stringify(memos));
}


// =============================
// サイドバー（スマホ）操作
// =============================

// メニューを開く
menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  //overlay.classList.remove("hidden");
});

// サイドバー内「＋」ボタン
const sideAddBtn = document.getElementById("sideAddBtn");
sideAddBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
  openModal(null);
});

// ×ボタンで閉じる
const sideCloseBtn = document.getElementById("sideCloseBtn");
sideCloseBtn.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.add("hidden");
});


// =============================
// 検索処理
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
// ページ読み込み時に保存済みメモを表示
renderGrid();
renderTitles();
