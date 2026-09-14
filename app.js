(function () {
  "use strict";

  /* ---------------- state ---------------- */
  let activeCat = "everyday";
  let searchQuery = "";
  let cart = loadCart();

  /* ---------------- helpers ---------------- */
  function loadCart() {
    try {
      const raw = localStorage.getItem("dailyprep_cart");
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveCart() {
    try { localStorage.setItem("dailyprep_cart", JSON.stringify(cart)); } catch (e) {}
  }
  function money(n) { return "₹" + n.toLocaleString("en-IN"); }
  function findProduct(id) { return PRODUCTS.find((p) => p.id === id); }

  function chipMarkup(chips, size) {
    return chips.map((c) => `<span style="background:${c}"></span>`).join("");
  }

  /* ---------------- rendering: product grid ---------------- */
  const grid = document.getElementById("product-grid");
  const noResults = document.getElementById("no-results");
  const tabCaption = document.getElementById("tab-caption");

  function renderGrid() {
    const q = searchQuery.trim().toLowerCase();
    let list = q
      ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q))
      : PRODUCTS.filter((p) => p.cat === activeCat);

    grid.innerHTML = "";
    if (list.length === 0) {
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;

    const frag = document.createDocumentFragment();
    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="chip-visual">${chipMarkup(p.chips)}</div>
        <div class="product-info">
          <span class="product-name">${p.name}</span>
          <span class="product-weight">${p.weight}</span>
          <div class="product-row">
            <span class="product-price">${money(p.price)}</span>
            <div class="qty-add" data-id="${p.id}"></div>
          </div>
        </div>
      `;
      frag.appendChild(card);
      renderQtyControl(card.querySelector(".qty-add"), p.id);
    });
    grid.appendChild(frag);
  }

  function renderQtyControl(container, id) {
    const qty = cart[id] || 0;
    if (qty === 0) {
      container.innerHTML = `<button class="add-btn" data-add="${id}">Add</button>`;
    } else {
      container.innerHTML = `
        <div class="qty-stepper">
          <button data-dec="${id}" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button data-inc="${id}" aria-label="Increase quantity">+</button>
        </div>`;
    }
  }

  grid.addEventListener("click", (e) => {
    const addId = e.target.getAttribute("data-add");
    const incId = e.target.getAttribute("data-inc");
    const decId = e.target.getAttribute("data-dec");
    if (addId) changeQty(addId, 1);
    else if (incId) changeQty(incId, 1);
    else if (decId) changeQty(decId, -1);
  });

  function changeQty(id, delta) {
    const next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id];
    else cart[id] = next;
    saveCart();
    // update just this control + cart UI, avoid full re-render for smoothness
    const container = grid.querySelector(`.qty-add[data-id="${id}"]`);
    if (container) renderQtyControl(container, id);
    renderCart();
  }

  /* ---------------- tabs ---------------- */
  const tabsEl = document.getElementById("category-tabs");
  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    setCategory(btn.dataset.cat);
  });

  function setCategory(cat) {
    activeCat = cat;
    searchQuery = "";
    searchInput.value = "";
    [...tabsEl.querySelectorAll(".tab")].forEach((t) => {
      const on = t.dataset.cat === cat;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    tabCaption.textContent = CATEGORY_META[cat].caption;
    renderGrid();
  }

  document.querySelectorAll("[data-cat-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      setCategory(a.dataset.catLink);
      document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------------- search ---------------- */
  const searchToggle = document.getElementById("search-toggle");
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");

  searchToggle.addEventListener("click", () => {
    const willShow = searchBar.hidden;
    searchBar.hidden = !willShow;
    searchToggle.setAttribute("aria-expanded", String(willShow));
    if (willShow) searchInput.focus();
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    if (searchQuery.trim()) {
      [...tabsEl.querySelectorAll(".tab")].forEach((t) => t.classList.remove("active"));
      tabCaption.textContent = "Search results";
    } else {
      setCategory(activeCat);
    }
    renderGrid();
  });

  /* ---------------- mobile nav ---------------- */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  menuToggle.addEventListener("click", () => {
    const willShow = mobileNav.hidden;
    mobileNav.hidden = !willShow;
    menuToggle.setAttribute("aria-expanded", String(willShow));
  });
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => { mobileNav.hidden = true; menuToggle.setAttribute("aria-expanded", "false"); })
  );

  /* ---------------- cart drawer ---------------- */
  const cartToggle = document.getElementById("cart-toggle");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartClose = document.getElementById("cart-close");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const cartCount = document.getElementById("cart-count");
  const cartItemsEl = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const cartFooterEl = document.getElementById("cart-footer");
  const cartSubtotalAmt = document.getElementById("cart-subtotal-amt");

  function openDrawer() {
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    drawerOverlay.hidden = false;
  }
  function closeDrawer() {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    drawerOverlay.hidden = true;
  }
  cartToggle.addEventListener("click", openDrawer);
  cartClose.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", () => { closeDrawer(); closeCheckout(); });

  function cartTotals() {
    let count = 0, subtotal = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const p = findProduct(id);
      if (!p) return;
      count += qty;
      subtotal += p.price * qty;
    });
    return { count, subtotal };
  }

  function renderCart() {
    const { count, subtotal } = cartTotals();
    cartCount.textContent = count;
    cartCount.setAttribute("data-empty", count === 0 ? "true" : "false");

    const ids = Object.keys(cart);
    if (ids.length === 0) {
      cartEmptyEl.hidden = false;
      cartItemsEl.innerHTML = "";
      cartFooterEl.hidden = true;
      return;
    }
    cartEmptyEl.hidden = true;
    cartFooterEl.hidden = false;
    cartSubtotalAmt.textContent = money(subtotal);

    cartItemsEl.innerHTML = ids.map((id) => {
      const p = findProduct(id);
      if (!p) return "";
      const qty = cart[id];
      return `
        <li class="cart-item">
          <div class="cart-chip-swatch">${chipMarkup(p.chips.slice(0, 4))}</div>
          <div>
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-meta">${p.weight} · ${money(p.price)} each</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button data-dec="${id}" aria-label="Decrease quantity">−</button>
              <span>${qty}</span>
              <button data-inc="${id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item-remove" data-remove="${id}">Remove</button>
          </div>
        </li>`;
    }).join("");
  }

  cartItemsEl.addEventListener("click", (e) => {
    const inc = e.target.getAttribute("data-inc");
    const dec = e.target.getAttribute("data-dec");
    const rem = e.target.getAttribute("data-remove");
    if (inc) changeQty(inc, 1);
    else if (dec) changeQty(dec, -1);
    else if (rem) { delete cart[rem]; saveCart(); renderCart(); renderGrid(); }
  });

  /* ---------------- checkout modal ---------------- */
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutOverlay = document.getElementById("checkout-overlay");
  const checkoutClose = document.getElementById("checkout-close");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutFormWrap = document.getElementById("checkout-form-wrap");
  const checkoutConfirm = document.getElementById("checkout-confirm");
  const modalTotalAmt = document.getElementById("modal-total-amt");
  const confirmDetail = document.getElementById("confirm-detail");
  const confirmCloseBtn = document.getElementById("confirm-close");

  checkoutBtn.addEventListener("click", () => {
    const { subtotal } = cartTotals();
    modalTotalAmt.textContent = money(subtotal);
    checkoutFormWrap.hidden = false;
    checkoutConfirm.hidden = true;
    checkoutOverlay.hidden = false;
  });
  function closeCheckout() { checkoutOverlay.hidden = true; }
  checkoutClose.addEventListener("click", closeCheckout);

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("co-name").value.trim();
    const slot = document.getElementById("co-slot").value;
    confirmDetail.textContent = `Thanks, ${name.split(" ")[0]}! Your order is scheduled for ${slot}. We'll call to confirm before packing begins.`;
    checkoutFormWrap.hidden = true;
    checkoutConfirm.hidden = false;
  });

  confirmCloseBtn.addEventListener("click", () => {
    cart = {};
    saveCart();
    renderCart();
    renderGrid();
    closeCheckout();
    closeDrawer();
    checkoutForm.reset();
  });

  /* ---------------- lead form (hero CTA band) ---------------- */
  const leadForm = document.getElementById("lead-form");
  const leadNote = document.getElementById("lead-note");
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("lead-name").value.trim();
    leadNote.textContent = `Thanks${name ? ", " + name.split(" ")[0] : ""} — we'll text you shortly to confirm delivery to your area.`;
    leadForm.reset();
  });

  /* ---------------- decorative floating chips in hero ---------------- */
  function renderHeroChips() {
    const host = document.getElementById("hero-chips");
    const colors = ["#D6491F", "#E8A33D", "#4E8A44", "#B98BB0", "#2F6B3E"];
    const positions = [
      { top: "6%", left: "4%", size: 26, rot: -12 },
      { top: "14%", right: "2%", size: 20, rot: 18 },
      { bottom: "10%", left: "0%", size: 22, rot: 10 },
      { bottom: "4%", right: "8%", size: 28, rot: -8 },
      { top: "48%", left: "-4%", size: 18, rot: 22 },
    ];
    host.innerHTML = positions.map((pos, i) => {
      const style = Object.entries(pos)
        .map(([k, v]) => `${k}:${typeof v === "number" ? v + "px" : v}`)
        .filter((s) => !s.startsWith("size") && !s.startsWith("rot"))
        .join(";");
      return `<span class="float-chip" style="${style};width:${pos.size}px;height:${pos.size}px;background:${colors[i % colors.length]};transform:rotate(${pos.rot}deg)"></span>`;
    }).join("");
  }

  function renderWhyChips() {
    const host = document.getElementById("why-chips");
    const colors = ["#D6491F","#E8A33D","#4E8A44","#2F6B3E","#B98BB0","#F4EDD8"];
    let out = "";
    for (let i = 0; i < 25; i++) out += `<span style="background:${colors[i % colors.length]}"></span>`;
    host.innerHTML = out;
  }

  /* ---------------- init ---------------- */
  setCategory("everyday");
  renderCart();
  renderHeroChips();
  renderWhyChips();
})();
