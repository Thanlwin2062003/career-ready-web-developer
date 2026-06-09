const button = document.getElementById("button");
const input = document.getElementById("input");
const output = document.getElementById("output");
button.addEventListener("click", () => {
    let count = Number(input.value);
    let cats="🐱";
    for (let i = 0; i < count; i++) {
        cats = cats + "🐱";
    }
    output.textContent = cats;  
});