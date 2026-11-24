// ---------- Grab elements from the DOM ----------
const cards = document.querySelectorAll(".card");
const billingToggle = document.getElementById("billing-toggle");
const labelMonthly = document.getElementById("label-monthly");
const labelYearly = document.getElementById("label-yearly");
const filterButtons = document.querySelectorAll(".filter-btn");
const toast = document.getElementById("toast");

// ---------- State ----------
let billing = "monthly"; // "monthly" or "yearly"
let toastTimer;

// ---------- Update prices when billing changes ----------
function updatePrices() {
  cards.forEach((card) => {
    const amountEl = card.querySelector(".price-amount");
    const periodEl = card.querySelector(".price-period");
    const saveNoteEl = card.querySelector(".save-note");

    const monthly = Number(card.dataset.monthly);
    const yearly = Number(card.dataset.yearly);

    // Show the right price and period
    amountEl.textContent = billing === "monthly" ? monthly : yearly;
    periodEl.textContent = billing === "monthly" ? "/month" : "/year";

    // Show how much is saved when paying yearly
    if (billing === "yearly") {
      const saved = monthly * 12 - yearly;
      saveNoteEl.textContent = `You save $${saved} per year`;
    } else {
      saveNoteEl.textContent = "";
    }

    // Restart the small "pop" animation on the price
    amountEl.classList.remove("pop");
    void amountEl.offsetWidth; // forces the browser to reset the animation
    amountEl.classList.add("pop");
  });
}

// ---------- Monthly / Yearly toggle ----------
billingToggle.addEventListener("click", () => {
  billing = billing === "monthly" ? "yearly" : "monthly";

  const isYearly = billing === "yearly";
  billingToggle.setAttribute("aria-checked", isYearly);
  labelMonthly.classList.toggle("is-active", !isYearly);
  labelYearly.classList.toggle("is-active", isYearly);

  updatePrices();
});

// ---------- Filter buttons ----------
function filterCards(filter) {
  cards.forEach((card) => {
    const matches = filter === "all" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !matches);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Move the "active" style to the clicked button
    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    filterCards(button.dataset.filter);
  });
});

// ---------- Plan buttons show a short message ----------
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

cards.forEach((card) => {
  card.querySelector(".btn").addEventListener("click", () => {
    const name = card.dataset.name;
    const price = card.dataset[billing];
    const period = billing === "monthly" ? "month" : "year";
    showToast(`${name} plan selected: $${price}/${period}`);
  });
});

// ---------- Initial render ----------
updatePrices();