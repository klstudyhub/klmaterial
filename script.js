// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyDUcVpkiBMd_53FHD4j77pN-MuNuPAv6aU",
  authDomain: "klmaterials.firebaseapp.com",
  projectId: "klmaterials",
  storageBucket: "klmaterials.firebasestorage.app",
  messagingSenderId: "772530551582",
  appId: "1:772530551582:web:ba87999d6602b49787a70f",
  measurementId: "G-JFPKCY2715"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// DOM Elements
const materialsList = document.getElementById("materials-list");
const searchBar = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-search");
const filterButtons = document.querySelectorAll(".filter-pill");
const filterContainer = document.querySelector('.filter-pills-container');
const storageRef = ref(storage);

// Subject mapping (file name keywords → subject titles)
const subjects = {
  "BEEC": "Basic Electrical & Electronic Circuits (BEEC)",
  "DM": "Discrete Mathematics (DM)",
  "PSC": "Problem Solving Through C",
  "DSD": "Digital System Design (DSD)"
};

let allMaterials = {}; // Store all materials for search
let activeCategory = "all"; // Track active filter

// Filter button functionality
if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Get category and filter
      activeCategory = btn.dataset.category;
      if (searchBar) searchBar.value = "";
      if (clearBtn) clearBtn.style.display = "none";

      if (activeCategory === "all") {
        displayMaterials(allMaterials);
      } else {
        const filtered = {};
        for (const subject in allMaterials) {
          if (subject.includes(activeCategory)) {
            filtered[subject] = allMaterials[subject];
          }
        }
        displayMaterials(filtered);
      }
    });
  });
}

// Search functionality
// Debounced search input
let searchDebounceId = null;
if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const queryRaw = e.target.value;
    const query = queryRaw.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";

    if (searchDebounceId) {
      clearTimeout(searchDebounceId);
    }
    searchDebounceId = setTimeout(() => {
      // Reset category filter when searching
      if (query && filterButtons.length > 0) {
        filterButtons.forEach(b => b.classList.remove("active"));
        filterButtons[0].classList.add("active");
        activeCategory = "all";
      }
      filterMaterials(query);
    }, 200);
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    searchBar.value = "";
    clearBtn.style.display = "none";
    filterMaterials("");
  });
}

function filterMaterials(query) {
  if (!query) {
    // Show materials based on active category
    if (activeCategory === "all") {
      displayMaterials(allMaterials);
    } else {
      const filtered = {};
      for (const subject in allMaterials) {
        if (subject.includes(activeCategory)) {
          filtered[subject] = allMaterials[subject];
        }
      }
      displayMaterials(filtered);
    }
    return;
  }

  const filtered = {};
  for (const subject in allMaterials) {
    const matchingItems = allMaterials[subject].filter(item => {
      const fileName = item.name.replace(/_/g, " ").toLowerCase();
      const subjectName = subject.toLowerCase();
      return fileName.includes(query) || subjectName.includes(query);
    });

    if (matchingItems.length > 0) {
      filtered[subject] = matchingItems;
    }
  }

  if (Object.keys(filtered).length === 0) {
    materialsList.innerHTML = `<p class="no-results">🔍 No materials found for "${query}"</p>`;
  } else {
    displayMaterials(filtered);
  }
}

function displayMaterials(grouped) {
  if (!materialsList) return;
  materialsList.innerHTML = "";

  for (const subject in grouped) {
    // Subject Card wrapper
    const subjectCard = document.createElement("div");
    subjectCard.className = "subject-card";

    // Header
    const header = document.createElement("div");
    header.className = "subject-header";
    const subjectIcon = getSubjectIcon(subject);
    header.innerHTML = `
      <div class="subject-title-wrap">
        <span class="subject-icon">${subjectIcon}</span>
        <h2 class="subject-title">${subject}</h2>
      </div>
      <div class="subject-meta">
        <span class="files-count">${grouped[subject].length} files</span>
      </div>
    `;

    // Body (materials grid)
    const body = document.createElement("div");
    body.className = "subject-body";
    const grid = document.createElement("div");
    grid.className = "materials-cards-grid";

    grouped[subject].forEach((itemRef) => {
      getDownloadURL(itemRef).then((url) => {
        const name = itemRef.name.replace(/_/g, " ");
        const fileExt = name.split('.').pop().toUpperCase();

        const card = document.createElement("div");
        card.className = "material-card";
        card.innerHTML = `
          <div class="card-header">
            <span class="file-icon">${getFileIcon(fileExt)}</span>
            <span class="file-type-badge">${fileExt}</span>
          </div>
          <div class="card-body">
            <h3 class="material-name">${name}</h3>
          </div>
          <div class="card-footer">
            <a href="${url}" target="_blank" class="download-link">
              <span class="download-icon">⬇</span>
              <span>Download</span>
            </a>
            <a href="${url}" target="_blank" class="view-link">
              <span>👁 View</span>
            </a>
          </div>
        `;
        grid.appendChild(card);
      });
    });
    body.appendChild(grid);

    // Assemble card
    subjectCard.appendChild(header);
    subjectCard.appendChild(body);

    materialsList.appendChild(subjectCard);
  }
}

// Helper function to get subject icon
function getSubjectIcon(subject) {
  if (subject.includes('BEEC')) return '⚡';
  if (subject.includes('DM') || subject.includes('Discrete')) return '🔢';
  if (subject.includes('PSC') || subject.includes('Problem')) return '💻';
  if (subject.includes('DSD') || subject.includes('Digital')) return '🔌';
  return '📚';
}

// Helper function to get file icon
function getFileIcon(ext) {
  const icons = {
    'PDF': '📄',
    'DOC': '📝',
    'DOCX': '📝',
    'PPT': '📊',
    'PPTX': '📊',
    'ZIP': '📦',
    'RAR': '📦',
    'TXT': '📃'
  };
  return icons[ext] || '📄';
}

// Fetch and display files
if (materialsList) {
  listAll(storageRef)
    .then((res) => {
      const grouped = {};

      res.items.forEach((itemRef) => {
        const name = itemRef.name;
        const matchKey = Object.keys(subjects).find(key => name.toUpperCase().includes(key));
        const subject = matchKey ? subjects[matchKey] : "Other Materials";
        if (!grouped[subject]) grouped[subject] = [];
        grouped[subject].push(itemRef);
      });

      allMaterials = grouped; // Store for search
      displayMaterials(grouped);
    })
    .catch((error) => {
      console.error(error);
      materialsList.innerHTML = `<p class="no-results">⚠️ Error loading materials. Check Firebase config or rules.</p>`;
    });
}
