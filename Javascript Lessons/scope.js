function addFive(number){
    const someVariable ="You can't see me outside this function!";
    return number + 5;
}
addFive(10);
console.log(someVariable); // this will throw an error because someVariable is not defined in this scope, it's only defined inside the addFive function.

let friendsAtYourParty = 0;
for (let i = 0; i < 10; i++) {
    friendsAtYourParty++;
}
console.log(i);

