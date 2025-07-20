const storyEl = document.getElementById("story");
const popup = document.getElementById("popup");
const storyInput = document.getElementById("storyInput");
const dictInput = document.getElementById("dictInput");
const loadStoryBtn = document.getElementById("loadStoryBtn");
const storyListEl = document.getElementById("storyList");
const storyTitleInput = document.getElementById("storyTitleInput");
const currentStoryTitle = document.getElementById("currentStoryTitle");

// data.js içindeki global appData'yı kullanıyoruz
let stories = window.appData.stories;
let dictionary = window.appData.dictionary;

let currentStoryIndex = 0;

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
                popup.innerHTML = `<b>${word}</b><br>${entry.translation}<br><i>${entry.grammar}</i>`;
                popup.style.left = e.pageX + "px";
                popup.style.top = e.pageY + "px";
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
    renderStory(story.text, story.dictionary);
    renderStoryList();
}

// Yeni hikaye ekleme
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

    // Var olan sözlüğe yeni kelimeleri ekle, varsa ekleme (overwrite yapma)
    Object.keys(newDict).forEach(word => {
        if (!dictionary[word]) {
            dictionary[word] = newDict[word];
        }
    });

    // Yeni hikayeyi ekle (dictionary kısmı zaten global sözlük ile uyumlu)
    stories.push({
        title: title,
        text: newStory,
        dictionary: newDict
    });

    currentStoryIndex = stories.length -1;

    // Formu temizle
    storyTitleInput.value = "";
    storyInput.value = "";
    dictInput.value = "";

    loadCurrentStory();
});

// Sayfa açıldığında ilk hikayeyi göster
loadCurrentStory();
