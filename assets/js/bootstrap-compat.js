(function () {
  const state = {
    activeTooltip: null,
    activePopover: null,
  };

  const createFloating = (className) => {
    const el = document.createElement("div");
    el.className = className;
    el.hidden = true;
    document.body.appendChild(el);
    return el;
  };

  const placeFloating = (trigger, bubble) => {
    const rect = trigger.getBoundingClientRect();
    const top = rect.top - bubble.offsetHeight - 8;
    const left = rect.left + rect.width / 2 - bubble.offsetWidth / 2;
    const maxLeft = window.innerWidth - bubble.offsetWidth - 8;

    bubble.style.top = `${Math.max(top, 8)}px`;
    bubble.style.left = `${Math.min(Math.max(left, 8), Math.max(maxLeft, 8))}px`;
  };

  const initTooltips = (root) => {
    root.querySelectorAll('[data-toggle="tooltip"]').forEach((el) => {
      if (el.dataset.afTooltipBound === "true") {
        return;
      }
      el.dataset.afTooltipBound = "true";

      const show = () => {
        const content = el.getAttribute("title") || el.getAttribute("data-original-title") || "";
        if (!content) {
          return;
        }

        if (!state.activeTooltip) {
          state.activeTooltip = createFloating("af-tooltip");
        }

        state.activeTooltip.textContent = content;
        state.activeTooltip.hidden = false;
        placeFloating(el, state.activeTooltip);
      };

      const hide = () => {
        if (state.activeTooltip) {
          state.activeTooltip.hidden = true;
        }
      };

      el.addEventListener("mouseenter", show);
      el.addEventListener("focus", show);
      el.addEventListener("mouseleave", hide);
      el.addEventListener("blur", hide);
    });
  };

  const initPopovers = (root) => {
    root.querySelectorAll('[data-toggle="popover"]').forEach((el) => {
      if (el.dataset.afPopoverBound === "true") {
        return;
      }
      el.dataset.afPopoverBound = "true";

      const show = () => {
        const title = el.getAttribute("title") || "";
        const body = el.getAttribute("data-content") || "";
        const content = [title, body].filter(Boolean).join("\n");
        if (!content) {
          return;
        }

        if (!state.activePopover) {
          state.activePopover = createFloating("af-popover");
        }

        state.activePopover.textContent = content;
        state.activePopover.hidden = false;
        placeFloating(el, state.activePopover);
      };

      const hide = () => {
        if (state.activePopover) {
          state.activePopover.hidden = true;
        }
      };

      el.addEventListener("mouseenter", show);
      el.addEventListener("focus", show);
      el.addEventListener("mouseleave", hide);
      el.addEventListener("blur", hide);
    });
  };

  const initLegacyCollapse = (root) => {
    root.querySelectorAll('[data-toggle="collapse"]').forEach((el) => {
      if (el.dataset.afCollapseBound === "true") {
        return;
      }
      el.dataset.afCollapseBound = "true";

      el.addEventListener("click", (event) => {
        event.preventDefault();
        const selector = el.getAttribute("data-target") || el.getAttribute("href");
        if (!selector || !selector.startsWith("#")) {
          return;
        }

        const target = document.querySelector(selector);
        if (!target) {
          return;
        }

        const shouldOpen = !target.classList.contains("show");
        target.classList.toggle("show", shouldOpen);
        el.setAttribute("aria-expanded", String(shouldOpen));
      });
    });
  };

  const initLegacyDropdowns = (root) => {
    const toggles = Array.from(root.querySelectorAll('[data-toggle="dropdown"]'));

    const closeAll = (except) => {
      toggles.forEach((toggle) => {
        if (except && toggle === except) {
          return;
        }
        const menu = toggle.parentElement?.querySelector(".dropdown-menu");
        if (!menu) {
          return;
        }

        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      });
    };

    toggles.forEach((toggle) => {
      if (toggle.dataset.afDropdownBound === "true") {
        return;
      }
      toggle.dataset.afDropdownBound = "true";

      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const menu = toggle.parentElement?.querySelector(".dropdown-menu");
        if (!menu) {
          return;
        }

        const shouldOpen = !menu.classList.contains("show");
        closeAll(toggle);
        menu.classList.toggle("show", shouldOpen);
        toggle.setAttribute("aria-expanded", String(shouldOpen));
      });
    });

    document.addEventListener("click", () => closeAll());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAll();
      }
    });
  };

  const init = (root = document) => {
    initLegacyCollapse(root);
    initLegacyDropdowns(root);
    initTooltips(root);
    initPopovers(root);
  };

  window.AlFolioCompat = {
    init,
    initTooltips,
    initPopovers,
  };

  document.addEventListener("DOMContentLoaded", () => init(document));
})();
