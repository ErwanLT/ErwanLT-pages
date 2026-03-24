(() => {
  const normalize = (value) => {
    if (!value) return "";
    return value
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  };

  const debounce = (fn, delay = 150) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("site-search");
    const results = document.getElementById("search-results");
    if (!input || !results) return;

    const base = (window.__BASEURL__ || "").replace(/\/$/, "");
    const searchUrl = `${base}/search.json`;
    let index = [];
    let loaded = false;

    const show = () => results.classList.remove("hidden");
    const hide = () => {
      results.classList.add("hidden");
      results.innerHTML = "";
    };

    const render = (items) => {
      if (!items.length) {
        results.innerHTML =
          '<div class="px-3 py-2 text-sm text-slate-500">Aucun résultat.</div>';
        show();
        return;
      }

      const html = items.slice(0, 20).map((item) => {
        const tagHtml = Array.isArray(item.tags)
          ? item.tags
              .slice(0, 4)
              .map(
                (tag) =>
                  `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${tag}</span>`
              )
              .join("")
          : "";

        return `
          <a href="${item.url}" class="block px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
            <div class="text-sm font-semibold text-slate-900">${item.title || "Sans titre"}</div>
            <div class="mt-1 text-xs text-slate-500">${item.excerpt || ""}</div>
            ${tagHtml ? `<div class="mt-2 flex flex-wrap gap-1">${tagHtml}</div>` : ""}
          </a>
        `;
      });

      results.innerHTML = html.join("");
      show();
    };

    const loadIndex = async () => {
      if (loaded) return;
      try {
        const response = await fetch(searchUrl, { cache: "force-cache" });
        if (!response.ok) throw new Error("Search index not found");
        index = await response.json();
        index = index.map((item) => ({
          ...item,
          _title: normalize(item.title),
          _content: normalize(item.content),
          _tags: normalize(Array.isArray(item.tags) ? item.tags.join(" ") : ""),
          excerpt: (item.content || "").trim().slice(0, 140) + "…",
        }));
        loaded = true;
      } catch (error) {
        results.innerHTML =
          '<div class="px-3 py-2 text-sm text-rose-600">Impossible de charger la recherche.</div>';
        show();
      }
    };

    const handleSearch = debounce(async () => {
      const query = input.value.trim();
      if (!query) {
        hide();
        return;
      }

      await loadIndex();
      const normalized = normalize(query);
      const matches = index.filter((item) => {
        return (
          item._title.includes(normalized) ||
          item._content.includes(normalized) ||
          item._tags.includes(normalized)
        );
      });
      render(matches);
    }, 120);

    input.addEventListener("input", handleSearch);
    input.addEventListener("focus", () => {
      if (input.value.trim() && results.innerHTML) show();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide();
    });

    document.addEventListener("click", (event) => {
      if (event.target === input || results.contains(event.target)) return;
      hide();
    });
  });
})();