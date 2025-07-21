const storyEl = document.getElementById("story");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const popupCloseBtn = popup.querySelector(".close-btn");

const storyInput = document.getElementById("storyInput");
const dictInput = document.getElementById("dictInput");
const loadStoryBtn = document.getElementById("loadStoryBtn");
const storyListEl = document.getElementById("storyList");
const storyTitleInput = document.getElementById("storyTitleInput");
const currentStoryTitle = document.getElementById("currentStoryTitle");

const showAddStoryBtn = document.getElementById("showAddStoryBtn");
const addStoryForm = document.getElementById("addStoryForm");
const cancelAddStoryBtn = document.getElementById("cancelAddStoryBtn");

let stories = window.appData.stories;
let dictionary = window.appData.dictionary;
let currentStoryIndex = 0;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createPopupContent(word, entry) {
  let html = `<strong>${word}</strong><br><br>`;

  if (entry.translation) html += `<b>Translation:</b> ${entry.translation}<br>`;
  if (entry.base) html += `<b>Base:</b> ${entry.base}<br>`;

  const type = entry.type || entry.grammar?.partOfSpeech;
  if (type) html += `<b>Type:</b> ${type}<br>`;

  const wordCase = entry.case || entry.grammar?.case;
  if (wordCase) html += `<b>Case:</b> ${wordCase}<br>`;

  if (entry.example) html += `<b>Example:</b> <em>${entry.example}</em><br>`;

  if (entry.grammar && typeof entry.grammar === "object") {
    html += `<details><summary>Grammar Details</summary><ul>`;
    for (const key in entry.grammar) {
      if (!["partOfSpeech", "case", "tense"].includes(key)) {
        html += `<li><b>${capitalize(key)}:</b> ${entry.grammar[key]}</li>`;
      }
    }
    html += `</ul></details>`;
  }

  return html;
}

function renderStory(text, storyDict) {
  const words = text.split(" ").map(word => {
    const clean = word.replace(/[.,!?;:()«»"'”“]/g, "");
    return `<span class="word" data-word="${clean}">${word}</span>`;
  });
  storyEl.innerHTML = words.join(" ");
  popup.classList.add("hidden");

  storyEl.onclick = (e) => {
    if (e.target.classList.contains("word")) {
      const word = e.target.dataset.word;
      const entry = storyDict[word] || dictionary[word];
      if (!entry) {
            entry = dictionary[rawWord.toLowerCase()];
        }
      if (entry) {
        popupContent.innerHTML = createPopupContent(word, entry);
        popup.classList.remove("hidden");
      } else {
        popup.classList.add("hidden");
      }
    } else {
      popup.classList.add("hidden");
    }
  };
}

function renderStoryList() {
  storyListEl.innerHTML = "";
  stories.forEach((story, index) => {
    const li = document.createElement("li");
    li.textContent = story.title;
    if (index === currentStoryIndex) li.classList.add("selected");
    li.addEventListener("click", () => {
      currentStoryIndex = index;
      loadCurrentStory();
    });
    storyListEl.appendChild(li);
  });
}

function loadCurrentStory() {
  const story = stories[currentStoryIndex];
  currentStoryTitle.textContent = story.title;
  const combinedDict = { ...dictionary, ...(story.dictionary || {}) };
  renderStory(story.text, combinedDict);
  renderStoryList();
}

popupCloseBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

showAddStoryBtn.addEventListener("click", () => {
  addStoryForm.style.display = "block";
  showAddStoryBtn.style.display = "none";
});

cancelAddStoryBtn.addEventListener("click", () => {
  addStoryForm.style.display = "none";
  showAddStoryBtn.style.display = "inline-block";
  storyTitleInput.value = "";
  storyInput.value = "";
  dictInput.value = "";
});

loadStoryBtn.addEventListener("click", () => {
  const title = storyTitleInput.value.trim();
  const newStory = storyInput.value.trim();
  if (!title || !newStory) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  let newDict = {};
  try {
    newDict = JSON.parse(dictInput.value);
  } catch {
    alert("Sözlük JSON formatı geçersiz.");
    return;
  }

  Object.keys(newDict).forEach(word => {
    if (!dictionary[word]) {
      dictionary[word] = newDict[word];
    }
  });

  stories.push({ title: title, text: newStory, dictionary: newDict });
  currentStoryIndex = stories.length - 1;

  storyTitleInput.value = "";
  storyInput.value = "";
  dictInput.value = "";

  addStoryForm.style.display = "none";
  showAddStoryBtn.style.display = "inline-block";

  loadCurrentStory();
});

loadCurrentStory();
