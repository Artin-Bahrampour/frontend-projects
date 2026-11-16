import "./styles.css";

type Rating = "again" | "hard" | "gotit";
type Card = { topic: string; prompt: string; answer: string };

const cards: Card[] = [
  { topic: "JavaScript", prompt: "What does Array.prototype.map return?", answer: "A new array containing the result of calling a function for every item." },
  { topic: "TypeScript", prompt: "Why use an interface?", answer: "It describes the shape of an object, helping TypeScript catch incorrect data early." },
  { topic: "React", prompt: "What should a component render list items with?", answer: "A stable, unique key so React can track each item efficiently." },
  { topic: "CSS", prompt: "What does display: grid help with?", answer: "Creating two-dimensional layouts with rows and columns." }
];

let index = 0;
let revealed = false;
const ratings: Rating[] = [];

const app = document.querySelector<HTMLDivElement>("#app")!;

function render(): void {
  if (index >= cards.length) {
    const gotIt = ratings.filter((rating) => rating === "gotit").length;
    app.innerHTML = `
      <main class="shell complete">
        <span class="eyebrow">SESSION COMPLETE</span>
        <h1>Nice focus session.</h1>
        <p>You reviewed ${cards.length} concepts and marked <strong>${gotIt}</strong> as confident.</p>
        <div class="score"><span>${gotIt}</span><small>cards mastered</small></div>
        <button id="restart" class="primary">Study again</button>
      </main>`;
    document.querySelector<HTMLButtonElement>("#restart")!.onclick = () => {
      index = 0; revealed = false; ratings.length = 0; render();
    };
    return;
  }

  const card = cards[index];
  const progress = Math.round((index / cards.length) * 100);
  app.innerHTML = `
    <main class="shell">
      <header>
        <a class="brand" href="#">clarity<span>cards</span></a>
        <span class="counter">${index + 1} / ${cards.length}</span>
      </header>
      <section class="intro"><span class="eyebrow">${card.topic}</span><h1>Build a sharper frontend memory.</h1></section>
      <div class="progress"><span style="width:${progress}%"></span></div>
      <article class="card ${revealed ? "is-revealed" : ""}">
        <p class="label">${revealed ? "ANSWER" : "QUESTION"}</p>
        <h2>${revealed ? card.answer : card.prompt}</h2>
        <button id="reveal" class="text-button">${revealed ? "Hide answer" : "Reveal answer"}</button>
      </article>
      ${revealed ? `<section class="rating"><p>How did that feel?</p><div><button data-rating="again">Again</button><button data-rating="hard">Hard</button><button data-rating="gotit" class="success">Got it</button></div></section>` : `<p class="hint">Tip: press Space to reveal the answer.</p>`}
    </main>`;

  document.querySelector<HTMLButtonElement>("#reveal")!.onclick = () => { revealed = !revealed; render(); };
  document.querySelectorAll<HTMLButtonElement>("[data-rating]").forEach((button) => {
    button.onclick = () => { ratings.push(button.dataset.rating as Rating); index++; revealed = false; render(); };
  });
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && index < cards.length) { event.preventDefault(); revealed = !revealed; render(); }
});

render();
