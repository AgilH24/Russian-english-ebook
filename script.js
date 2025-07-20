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

// Data.js içindeki global appData'dan yükle
let stories = window.appData.stories;
let dictionary = window.appData.dictionary;

let currentStoryIndex = 0;

// Fonksiyonlar

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatGrammar(grammar) {
    if (!grammar) return "";

    if (typeof grammar === "object") {
        let html = "<ul>";
        for (const key in grammar) {
            html += `<li><b>${capitalize(key)}:</b> ${grammar[key]}</li>`;
        }
        html += "</ul>";
        return html;
    }

    return grammar;
}

function renderStory(text, dictionary) {
    const words = text.split(" ").map(word => {
        const clean = word.replace(/[.,!?]/g, '');
        return `<span class="word" data-word="${clean}">${word}</span>`;
    });
    storyEl.innerHTML = words.join(" ");
    popup.classList.add("hidden");

    storyEl.onclick = (e) => {
        if (e.target.classList.contains("word")) {
            const word = e.target.dataset.word;
            const entry = dictionary[word];
            if (entry) {
                popupContent.innerHTML = `
                    <b>${word}</b><br>
                    <b>Translation:</b> ${entry.translation}<br>
                    <b>Grammar:</b> ${formatGrammar(entry.grammar)}
                `;
                //popup.style.left = e.pageX + "px";
                //popup.style.top = e.pageY + "px";
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
        if (index === currentStoryIndex) {
            li.classList.add("selected");
        }
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
    renderStory(story.text, dictionary);
    renderStoryList();
}

// Popup kapatma
popupCloseBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// Yeni hikaye ekleme form göster/gizle
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

// Yeni hikaye ekle
loadStoryBtn.addEventListener("click", () => {
    const title = storyTitleInput.value.trim();
    const newStory = storyInput.value.trim();
    if (!title) {
        alert("Lütfen hikaye başlığını girin.");
        return;
    }
    if (!newStory) {
        alert("Lütfen hikaye metnini girin.");
        return;
    }
    let newDict = {};
    try {
        newDict = JSON.parse(dictInput.value);
    } catch (e) {
        alert("Sözlük JSON formatı geçersiz.");
        return;
    }

    // Yeni kelimeleri ortak sözlüğe ekle, varsa ekleme
    Object.keys(newDict).forEach(word => {
        if (!dictionary[word]) {
            dictionary[word] = newDict[word];
        }
    });

    stories.push({
        title: title,
        text: newStory,
        dictionary: newDict
    });

    currentStoryIndex = stories.length - 1;

    storyTitleInput.value = "";
    storyInput.value = "";
    dictInput.value = "";

    addStoryForm.style.display = "none";
    showAddStoryBtn.style.display = "inline-block";

    loadCurrentStory();
});

// Sayfa ilk açıldığında ilk hikayeyi yükle
loadCurrentStory();
