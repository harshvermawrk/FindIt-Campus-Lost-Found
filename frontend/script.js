
const formPanel = document.querySelector("#formPanel");
const form = document.querySelector("#itemForm");
const formTitle = document.querySelector("#formTitle");
const itemsGrid = document.querySelector("#itemsGrid");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const emptyMessage = document.querySelector("#emptyMessage");
const itemCount = document.querySelector("#itemCount");

let selectedStatus = "lost";

let items = [
  {
    id: 1,
    item_name: "Blue Water Bottle",
    description: "A blue bottle left near the library.",
    location: "College library",
    contact: "Demo contact: student@example.com",
    status: "lost"
  },
  {
    id: 2,
    item_name: "Black Notebook",
    description: "Notebook found on a classroom desk.",
    location: "Room 204",
    contact: "Ask at the department office",
    status: "found"
  }
];

document.querySelector("#lostBtn").addEventListener("click", () => {
  openForm("lost");
});

document.querySelector("#foundBtn").addEventListener("click", () => {
  openForm("found");
});

function openForm(status) {
  selectedStatus = status;
  formTitle.textContent = `Report a ${status} item`;
  formPanel.hidden = false;
  document.querySelector("#itemName").focus();
  formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("#cancelBtn").addEventListener("click", () => {
  form.reset();
  formPanel.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  items.unshift({
    id: Date.now(),
    item_name: data.get("itemName").trim(),
    description: data.get("description").trim(),
    location: data.get("location").trim(),
    contact: data.get("contact").trim(),
    status: selectedStatus
  });

  form.reset();
  formPanel.hidden = true;
  renderItems();
});

searchInput.addEventListener("input", renderItems);
statusFilter.addEventListener("change", renderItems);

function renderItems() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = statusFilter.value;

  const filtered = items.filter((item) => {
    const matchesSearch = [
      item.item_name,
      item.description,
      item.location
    ].some((value) => value.toLowerCase().includes(query));

    return matchesSearch &&
      (filter === "all" || item.status === filter);
  });

  itemsGrid.replaceChildren();

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "item-card";

    const badge = document.createElement("span");
    badge.className = `status ${item.status}`;
    badge.textContent = item.status.toUpperCase();

    const title = document.createElement("h3");
    title.textContent = item.item_name;

    const description = document.createElement("p");
    description.textContent = item.description;

    const location = document.createElement("p");
    location.textContent = `Location: ${item.location}`;

    const contact = document.createElement("p");
    contact.textContent = `Recovery: ${item.contact}`;

    card.append(badge, title, description, location, contact);
    itemsGrid.append(card);
  });

  itemCount.textContent =
    `${filtered.length} report${filtered.length === 1 ? "" : "s"}`;

  emptyMessage.hidden = filtered.length !== 0;
}

renderItems();
