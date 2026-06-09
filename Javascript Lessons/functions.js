function addTwo(number){
    return number + 2;
}
const finalAnswer =addTwo(5);
console.log(finalAnswer);

function greet(firstName, lastName,honorific, greeting){
    return `${greeting} ${honorific} ${firstName} ${lastName}! I'm extremely pleased you could join us, ${firstName}! I hope you enjoy your stay, ${honorific} ${lastName}.`;
}
console.log(greet("Thanlwin", "Aung", "Mr.", "Salutations"));
console.log(greet("Jack", "Sparrow", "Captain", "Ahoy"));

const myHomeCity = "Yangon";
const myHomeState="Yangon Region";
const myHomeCountry = "Myanmar";
function logOutYourHometown(city, state, country){
    console.log(`I am from ${city}, ${state}, ${country}.`);
}
logOutYourHometown(myHomeCity, myHomeState, myHomeCountry);


function bark(){
    console.log("Woof!");
}
const meow = function(){
    console.log("Meow!");
}
// the ==> is just => put together, the font just combines them to one glyph

const chirp = () => {
    console.log("Chirp!");
}
bark();
meow();
chirp();