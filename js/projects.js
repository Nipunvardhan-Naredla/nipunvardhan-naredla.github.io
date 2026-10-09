/* ============================================================
   WORK — card rendering, type/category filter, search, sort
   ------------------------------------------------------------
   Used by the homepage (featured + categories + certifications
   + experience) and the unified work page (everything with
   filtering).
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function arrowIcon() {
    return (
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<path d="M1 8h13M9 3l5 5-5 5"/></svg>'
    );
  }

  function externalIcon() {
    return (
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<path d="M6 3H3v10h10v-3M9 2h5v5M14 2L7 9"/></svg>'
    );
  }

  /* ---------- Card templates ---------- */

  function projectCardHTML(item) {
    return (
      '<a class="project-card" href="' +
      escapeHtml(item.url) +
      '" aria-label="' +
      escapeHtml(item.title) +
      '">' +
      '<div class="project-card__media">' +
      '<img src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.title) +
      ' thumbnail" loading="lazy" decoding="async">' +
      "</div>" +
      '<div class="project-card__body">' +
      '<div class="project-card__meta">' +
      '<span class="project-card__category">' +
      escapeHtml(item.category) +
      "</span>" +
      '<span class="project-card__date">' +
      escapeHtml(item.date) +
      "</span>" +
      "</div>" +
      '<h3 class="project-card__title">' +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="project-card__description">' +
      escapeHtml(item.description) +
      "</p>" +
      '<span class="project-card__arrow">View project ' +
      arrowIcon() +
      "</span>" +
      "</div>" +
      "</a>"
    );
  }

  function certificationCardHTML(item) {
    return (
      '<a class="project-card" href="' +
      escapeHtml(item.url) +
      '" aria-label="' +
      escapeHtml(item.title) +
      '">' +
      '<div class="project-card__media">' +
      '<img src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.title) +
      ' thumbnail" loading="lazy" decoding="async">' +
      "</div>" +
      '<div class="project-card__body">' +
      '<div class="project-card__meta">' +
      '<span class="project-card__category">' +
      escapeHtml(item.category) +
      "</span>" +
      '<span class="project-card__date">' +
      escapeHtml(item.date) +
      "</span>" +
      "</div>" +
      '<h3 class="project-card__title">' +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="project-card__description">' +
      escapeHtml(item.description) +
      "</p>" +
      '<p class="project-card__sub">' +
      escapeHtml(item.issuer || "") +
      "</p>" +
      '<span class="project-card__arrow">View credential ' +
      externalIcon() +
      "</span>" +
      "</div>" +
      "</a>"
    );
  }

  function experienceCardHTML(item) {
    return (
      '<a class="project-card" href="' +
      escapeHtml(item.url) +
      '" aria-label="' +
      escapeHtml(item.title) +
      '">' +
      '<div class="project-card__media">' +
      '<img src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.title) +
      ' thumbnail" loading="lazy" decoding="async">' +
      "</div>" +
      '<div class="project-card__body">' +
      '<div class="project-card__meta">' +
      '<span class="project-card__category">' +
      escapeHtml(item.category) +
      "</span>" +
      '<span class="project-card__date">' +
      escapeHtml(item.date) +
      "</span>" +
      "</div>" +
      '<h3 class="project-card__title">' +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="project-card__description">' +
      escapeHtml(item.description) +
      "</p>" +
      '<p class="project-card__sub">' +
      escapeHtml(item.organization || "") +
      "</p>" +
      '<span class="project-card__arrow">View role ' +
      arrowIcon() +
      "</span>" +
      "</div>" +
      "</a>"
    );
  }

  function otherCardHTML(item) {
    return (
      '<a class="project-card" href="' +
      escapeHtml(item.url) +
      '" aria-label="' +
      escapeHtml(item.title) +
      '">' +
      '<div class="project-card__media">' +
      '<img src="' +
      escapeHtml(item.image) +
      '" alt="' +
      escapeHtml(item.title) +
      ' thumbnail" loading="lazy" decoding="async">' +
      "</div>" +
      '<div class="project-card__body">' +
      '<div class="project-card__meta">' +
      '<span class="project-card__category">' +
      escapeHtml(item.category) +
      "</span>" +
      '<span class="project-card__date">' +
      escapeHtml(item.date) +
      "</span>" +
      "</div>" +
      '<h3 class="project-card__title">' +
      escapeHtml(item.title) +
      "</h3>" +
      '<p class="project-card__description">' +
      escapeHtml(item.description) +
      "</p>" +
      '<span class="project-card__arrow">View ' +
      arrowIcon() +
      "</span>" +
      "</div>" +
      "</a>"
    );
  }

  function cardHTML(item) {
    if (item.type === "certification") return certificationCardHTML(item);
    if (item.type === "experience") return experienceCardHTML(item);
    if (item.type === "other") return otherCardHTML(item);
    return projectCardHTML(item);
  }

  /* ---------- Render featured projects (homepage) ---------- */

  function renderFeatured(container) {
    if (!container) return;
    const featured = workItems.filter(function (item) {
      return item.type === "project" && item.featured;
    });
    container.innerHTML = featured.map(projectCardHTML).join("");
  }

  /* ---------- Render certifications (homepage) ---------- */

  function renderCertifications(container) {
    if (!container) return;
    const certs = workItems.filter(function (item) {
      return item.type === "certification";
    });
    container.innerHTML = certs.map(certificationCardHTML).join("");
  }

  /* ---------- Render experience (homepage) ---------- */

  function renderExperience(container) {
    if (!container) return;
    const roles = workItems.filter(function (item) {
      return item.type === "experience";
    });
    container.innerHTML = roles.map(experienceCardHTML).join("");
  }

  /* ---------- Render other (homepage) ---------- */

  function renderOther(container) {
    if (!container) return;
    const others = workItems.filter(function (item) {
      return item.type === "other";
    });
    container.innerHTML = others.map(otherCardHTML).join("");
  }

  /* ---------- Render category links (homepage) ---------- */

  function renderCategories(container) {
    if (!container) return;

    const counts = {};
    workItems.forEach(function (item) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    const categories = Object.keys(counts).sort();

    container.innerHTML = categories
      .map(function (cat) {
        return (
          '<a class="category-link" href="projects.html?category=' +
          encodeURIComponent(cat) +
          '">' +
          escapeHtml(cat) +
          '<span class="category-link__count">' +
          counts[cat] +
          "</span>" +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Work page: type/category filter, search, sort ---------- */

  function initWorkPage() {
    const grid = document.getElementById("work-grid");
    if (!grid) return;

    const filterBar = document.getElementById("filter-bar");
    const typeBar = document.getElementById("type-bar");
    const searchInput = document.getElementById("work-search");
    const sortSelect = document.getElementById("work-sort");
    const resultsMeta = document.getElementById("results-meta");
    const emptyState = document.getElementById("empty-state");

    let activeType = "ALL";
    let activeCategory = "ALL";
    let searchTerm = "";
    let sortMode = "newest";

    /* Read ?category= from URL (e.g. homepage category links) */
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");
    if (urlCategory) {
      activeCategory = urlCategory.toUpperCase();
    }

    /* Build type filter buttons */
    const types = ["ALL", "PROJECT", "CERTIFICATION", "EXPERIENCE", "OTHER"];

    if (typeBar) {
      typeBar.innerHTML =
        '<span class="filter-bar__label">Type</span>' +
        types
          .map(function (type) {
            return (
              '<button class="filter-btn' +
              (type === activeType ? " is-active" : "") +
              '" data-type="' +
              type +
              '" aria-pressed="' +
              (type === activeType ? "true" : "false") +
              '">' +
              type.charAt(0) + type.slice(1).toLowerCase() +
              "</button>"
            );
          })
          .join("");
    }

    /* Build category filter buttons from data — nothing hard-coded */
    const categories = ["ALL"].concat(
      workItems
        .map(function (item) {
          return item.category;
        })
        .filter(function (cat, i, arr) {
          return arr.indexOf(cat) === i;
        })
        .sort()
    );

    filterBar.innerHTML =
      '<span class="filter-bar__label">Category</span>' +
      categories
        .map(function (cat) {
          return (
            '<button class="filter-btn' +
            (cat === activeCategory ? " is-active" : "") +
            '" data-category="' +
            escapeHtml(cat) +
            '" aria-pressed="' +
            (cat === activeCategory ? "true" : "false") +
            '">' +
            escapeHtml(cat) +
            "</button>"
          );
        })
        .join("");

    /* ---------- Filtering ---------- */

    function getFilteredItems() {
      let list = workItems.slice();

      if (activeType !== "ALL") {
        list = list.filter(function (item) {
          return item.type.toUpperCase() === activeType;
        });
      }

      if (activeCategory !== "ALL") {
        list = list.filter(function (item) {
          return item.category === activeCategory;
        });
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        list = list.filter(function (item) {
          return (
            item.title.toLowerCase().indexOf(term) !== -1 ||
            item.description.toLowerCase().indexOf(term) !== -1 ||
            item.category.toLowerCase().indexOf(term) !== -1 ||
            (item.issuer || "").toLowerCase().indexOf(term) !== -1 ||
            (item.organization || "").toLowerCase().indexOf(term) !== -1
          );
        });
      }

      list.sort(function (a, b) {
        if (sortMode === "oldest") {
          return a.date.localeCompare(b.date);
        }
        return b.date.localeCompare(a.date);
      });

      return list;
    }

    function render() {
      const list = getFilteredItems();

      if (list.length === 0) {
        grid.innerHTML = "";
        grid.style.display = "none";
        emptyState.hidden = false;
        resultsMeta.textContent = "0 items";
        return;
      }

      grid.style.display = "";
      emptyState.hidden = true;
      grid.innerHTML = list.map(cardHTML).join("");
      resultsMeta.textContent =
        list.length + (list.length === 1 ? " item" : " items");
    }

    /* ---------- Events ---------- */

    if (typeBar) {
      typeBar.addEventListener("click", function (e) {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;

        activeType = btn.dataset.type;

        typeBar.querySelectorAll(".filter-btn").forEach(function (b) {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });

        render();
      });
    }

    filterBar.addEventListener("click", function (e) {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      activeCategory = btn.dataset.category;

      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });

      render();
    });

    searchInput.addEventListener("input", function () {
      searchTerm = searchInput.value.trim();
      render();
    });

    sortSelect.addEventListener("change", function () {
      sortMode = sortSelect.value;
      render();
    });

    render();
  }

  /* ---------- Init ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderFeatured(document.getElementById("featured-grid"));
    renderCertifications(document.getElementById("certifications-grid"));
    renderExperience(document.getElementById("experience-grid"));
    renderOther(document.getElementById("other-grid"));
    renderCategories(document.getElementById("category-list"));
    initWorkPage();
  });
})();