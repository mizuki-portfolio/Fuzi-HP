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

  // 定休日カレンダー（今月のみ・日曜定休を表示）
  const calendarEl = document.getElementById("closed-calendar");
  if (calendarEl) {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();

    const monthWrap = document.createElement("div");
    monthWrap.className = "closed-calendar-month";
    monthWrap.innerHTML = `<h4>${year}年${monthNames[month]}</h4>`;
    const weekdaysRow = document.createElement("div");
    weekdaysRow.className = "closed-calendar-weekdays";
    weekdaysRow.innerHTML = weekdays.map((w) => `<span>${w}</span>`).join("");
    monthWrap.appendChild(weekdaysRow);

    const daysRow = document.createElement("div");
    daysRow.className = "closed-calendar-days";
    for (let i = 0; i < firstWeekday; i++) {
      const empty = document.createElement("span");
      empty.className = "closed-calendar-day empty";
      empty.textContent = " ";
      daysRow.appendChild(empty);
    }
    const todayDate = d.getDate();
    for (let day = 1; day <= lastDay; day++) {
      const span = document.createElement("span");
      const isSunday = (firstWeekday + day - 1) % 7 === 0;
      const isToday = day === todayDate;
      let cls = "closed-calendar-day";
      if (isSunday) cls += " off";
      if (isToday) cls += " today";
      span.className = cls;
      span.textContent = isSunday ? "休" : day;
      daysRow.appendChild(span);
    }
    monthWrap.appendChild(daysRow);
    calendarEl.appendChild(monthWrap);
  }

  // ホームページの画像：画面に入ったときに右からフェードイン
  if (document.querySelector("#home")) {
    const fadeTargets = document.querySelectorAll(
      "main .section-image img"
    );

    fadeTargets.forEach((el) => el.classList.add("fade-in-right"));

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      fadeTargets.forEach((el) => observer.observe(el));
    } else {
      // IntersectionObserver 非対応ブラウザ向け：常に表示
      fadeTargets.forEach((el) => el.classList.add("is-visible"));
    }
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

