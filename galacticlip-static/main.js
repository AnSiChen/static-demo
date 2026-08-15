(() => {
  const media = window.GALACTICLIP_MEDIA || [];
  const defaults = {
    userName: "Guest",
    profile: "profile1.png",
    darkMode: false,
    language: "English",
    font: "Roboto",
    fontSize: 16,
    background: "Default",
    bookmarks: ["orion-nebula", "earth-orbit"],
  };

  const read = (key, fallback) => {
    const value = localStorage.getItem(`galacticlip:${key}`);
    if (value === null) return fallback;
    try { return JSON.parse(value); } catch { return value; }
  };
  const write = (key, value) => localStorage.setItem(`galacticlip:${key}`, JSON.stringify(value));
  const state = {
    userName: read("userName", defaults.userName),
    profile: read("profile", defaults.profile),
    darkMode: read("darkMode", defaults.darkMode),
    language: read("language", defaults.language),
    font: read("font", defaults.font),
    fontSize: Number(read("fontSize", defaults.fontSize)),
    background: read("background", defaults.background),
    bookmarks: read("bookmarks", defaults.bookmarks),
  };

  function persistState() {
    Object.entries(state).forEach(([key, value]) => write(key, value));
  }

  function applySettings() {
    document.body.classList.toggle("dark", !!state.darkMode);
    document.body.classList.remove("bg-default", "bg-galaxy", "bg-space");
    document.body.classList.add(`bg-${String(state.background).toLowerCase()}`);
    document.documentElement.style.setProperty("--font", `"${state.font}", Arial, sans-serif`);
    document.documentElement.style.setProperty("--font-size", `${state.fontSize}px`);
    document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = state.userName || "Guest");
    document.querySelectorAll("[data-profile-img]").forEach(img => {
      img.src = `assets/images/${state.profile}`;
      img.onerror = () => img.classList.add("is-missing");
      img.onload = () => img.classList.remove("is-missing");
    });
  }

  function imageTag(item, className = "media-image") {
    return `<img class="${className}" src="${item.image}" alt="${escapeHtml(item.title)}" onerror="this.classList.add('is-missing')">`;
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  function detailHref(item, from = "index.html") {
    return `media-detail.html?id=${encodeURIComponent(item.id)}&from=${encodeURIComponent(from)}`;
  }

  function isBookmarked(id) { return state.bookmarks.includes(id); }
  function toggleBookmark(id) {
    state.bookmarks = isBookmarked(id) ? state.bookmarks.filter(x => x !== id) : [...state.bookmarks, id];
    write("bookmarks", state.bookmarks);
  }

  let toastTimer;
  function toast(message) {
    const el = document.querySelector(".toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
  }

  function renderHome() {
    const feed = document.querySelector("[data-home-feed]");
    if (!feed) return;
    feed.innerHTML = media.slice(0, 7).map(item => `
      <article class="media-card" data-media-id="${item.id}">
        <div class="media-image-wrap">
          <a class="card-open" href="${detailHref(item, "index.html")}" aria-label="Open ${escapeHtml(item.title)}">
            ${imageTag(item)}
          </a>
          <button class="bookmark-btn" type="button" data-bookmark="${item.id}" aria-label="${isBookmarked(item.id) ? "Remove bookmark" : "Add bookmark"}">
            <img src="assets/icons/${isBookmarked(item.id) ? "bookmark_true_icon.png" : "bookmark_false_icon.png"}" alt="">
          </button>
        </div>
        <a class="card-open" href="${detailHref(item, "index.html")}">
          <div class="media-details">
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </a>
      </article>`).join("");

    feed.addEventListener("click", event => {
      const btn = event.target.closest("[data-bookmark]");
      if (!btn) return;
      event.preventDefault(); event.stopPropagation();
      const id = btn.dataset.bookmark;
      toggleBookmark(id);
      const img = btn.querySelector("img");
      img.src = `assets/icons/${isBookmarked(id) ? "bookmark_true_icon.png" : "bookmark_false_icon.png"}`;
      btn.setAttribute("aria-label", isBookmarked(id) ? "Remove bookmark" : "Add bookmark");
      toast(isBookmarked(id) ? "Added to bookmarks" : "Removed from bookmarks");
    });
  }

  function renderSearch(query = "") {
    const grid = document.querySelector("[data-search-grid]");
    if (!grid) return;
    const q = query.trim().toLowerCase();
    const items = !q ? media : media.filter(item => [item.title,item.description,item.keywords].join(" ").toLowerCase().includes(q));
    grid.innerHTML = items.length ? items.map(item => `
      <div class="search-tile">
        <a href="${detailHref(item, "search.html")}" aria-label="Open ${escapeHtml(item.title)}">
          ${imageTag(item, "")}
        </a>
      </div>`).join("") : `<div class="search-empty">No representative media matched “${escapeHtml(query)}”.</div>`;
  }

  function renderBookmarks(query = "") {
    const list = document.querySelector("[data-bookmark-list]");
    if (!list) return;
    const q = query.trim().toLowerCase();
    let items = media.filter(item => isBookmarked(item.id));
    if (q) items = items.filter(item => [item.title,item.description,item.keywords].join(" ").toLowerCase().includes(q));
    if (!items.length) {
      list.innerHTML = `<div class="empty-bookmarks"><strong>You currently have no bookmarked media.</strong><span>Try adding some from your home page or search page.</span></div>`;
      return;
    }
    list.innerHTML = items.map(item => `
      <article class="bookmark-item">
        <div class="bookmark-thumb">${imageTag(item, "")}</div>
        <a class="bookmark-main" href="${detailHref(item, "bookmarks.html")}">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.description)}</span>
          <small>${escapeHtml(item.date)}</small>
        </a>
        <button class="remove-bookmark" type="button" data-remove-bookmark="${item.id}">Remove</button>
      </article>`).join("");
  }

  function setupBookmarks() {
    const input = document.querySelector("[data-bookmark-search]");
    const list = document.querySelector("[data-bookmark-list]");
    if (!list) return;
    renderBookmarks("");
    input?.addEventListener("input", () => renderBookmarks(input.value));
    list.addEventListener("click", event => {
      const button = event.target.closest("[data-remove-bookmark]");
      if (!button) return;
      state.bookmarks = state.bookmarks.filter(id => id !== button.dataset.removeBookmark);
      write("bookmarks", state.bookmarks);
      renderBookmarks(input?.value || "");
      toast("Bookmark removed");
    });
  }

  function setupSettings() {
    const form = document.querySelector("[data-settings-form]");
    if (!form) return;
    const name = form.querySelector("[name=userName]");
    const profile = form.querySelector("[name=profile]");
    const dark = form.querySelector("[name=darkMode]");
    const language = form.querySelector("[name=language]");
    const font = form.querySelector("[name=font]");
    const fontSize = form.querySelector("[name=fontSize]");
    const background = form.querySelector("[name=background]");
    name.value = state.userName;
    profile.value = ({"profile1.png":"Star Explorer","profile2.png":"Cosmic Voyager","profile3.png":"Galaxy Dreamer"})[state.profile] || "Star Explorer";
    dark.checked = !!state.darkMode;
    language.value = state.language;
    font.value = state.font;
    fontSize.value = state.fontSize;
    background.value = state.background;

    function sync() {
      state.userName = name.value || "Guest";
      state.profile = ({"Star Explorer":"profile1.png","Cosmic Voyager":"profile2.png","Galaxy Dreamer":"profile3.png"})[profile.value] || "profile1.png";
      state.darkMode = dark.checked;
      state.language = language.value;
      state.font = font.value;
      state.fontSize = Number(fontSize.value);
      state.background = background.value;
      persistState();
      applySettings();
    }
    form.addEventListener("input", sync);
    form.addEventListener("change", sync);

    document.querySelector("[data-clear-bookmarks]")?.addEventListener("click", () => {
      state.bookmarks = [];
      write("bookmarks", state.bookmarks);
      toast("All bookmarks have been cleared.");
    });
  }

  function setupDetail() {
    const root = document.querySelector("[data-detail-root]");
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const item = media.find(x => x.id === params.get("id")) || media[0];
    const from = params.get("from") || "index.html";
    root.innerHTML = `
      <div class="detail-image-wrap">${imageTag(item, "detail-image")}</div>
      <h1>${escapeHtml(item.title)}</h1>
      <div class="detail-meta">${escapeHtml(item.date)} · ${escapeHtml(item.photographer)}<br>${escapeHtml(item.keywords)}</div>
      <div class="detail-description">${escapeHtml(item.description)} ${escapeHtml(item.description)}</div>
      <label for="personal-note">Personal Note:</label>
      <textarea id="personal-note" placeholder="Add a personal note..."></textarea>
      <button class="primary-button" type="button" data-close-detail>Close</button>`;
    const note = root.querySelector("#personal-note");
    const noteKey = `note:${item.id}`;
    note.value = read(noteKey, "");
    note.addEventListener("input", () => write(noteKey, note.value));
    root.querySelector("[data-close-detail]").addEventListener("click", () => location.href = from);
  }

  function setupSearch() {
    const input = document.querySelector("[data-search-input]");
    if (!input) return;
    renderSearch("");
    input.addEventListener("input", () => renderSearch(input.value));
    input.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); renderSearch(input.value); }});
  }

  document.addEventListener("DOMContentLoaded", () => {
    applySettings();
    renderHome();
    setupSearch();
    setupBookmarks();
    setupSettings();
    setupDetail();
  });
})();
