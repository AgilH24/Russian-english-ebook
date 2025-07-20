const storyText = "Мальчик увидел собаку и побежал к ней.";
const storyEl = document.getElementById("story");
const popup = document.getElementById("popup");

function renderStory(text) {
    const words = text.split(" ").map(word => {
        const clean = word.replace(/[.,!?]/g, '');
        return `<span class="word" data-word="\${clean}">\${word}</span>`;
    });
    storyEl.innerHTML = words.join(" ");
}

storyEl.addEventListener("click", e => {
    if (e.target.classList.contains("word")) {
        const word = e.target.dataset.word;
        const entry = dictionary[word];
        if (entry) {
            popup.innerHTML = `<b>\${word}</b><br>\${entry.translation}<br><i>\${entry.grammar}</i>`;
            popup.style.left = e.pageX + "px";
            popup.style.top = e.pageY + "px";
            popup.classList.remove("hidden");
        }
    } else {
        popup.classList.add("hidden");
    }
});

renderStory(storyText);