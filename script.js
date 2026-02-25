document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
      });
    });
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", () => {
      alert("これはデモ用フォームです。実際の送信処理はサーバー側が必要です。");
    });
  }
});

// ローディング画面：初回訪問時のみ表示、メニューから戻ったときは出さない
const LOADING_MIN_MS = 2000;
const LOADING_SEEN_KEY = "gyutan-fuji-loading-seen";
const loadStart = Date.now();

// メニューページを開いた時点で「訪問済み」にする（メニュー→ホームでローディングを出さないため）
if (document.querySelector(".menu-page") || window.location.pathname.includes("menu")) {
  sessionStorage.setItem(LOADING_SEEN_KEY, "1");
}

function hideLoader(loader) {
  loader.classList.add("hidden");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
}

window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  if (!loader) return;

  // すでにこのセッションで訪問済みなら即非表示（トップ初回のみローディング表示）
  if (sessionStorage.getItem(LOADING_SEEN_KEY)) {
    hideLoader(loader);
    return;
  }

  sessionStorage.setItem(LOADING_SEEN_KEY, "1");

  const elapsed = Date.now() - loadStart;
  const wait = Math.max(0, LOADING_MIN_MS - elapsed);

  if (wait > 0) {
    setTimeout(() => hideLoader(loader), wait);
  } else {
    hideLoader(loader);
  }
});

