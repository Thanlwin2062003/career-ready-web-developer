let string = 'hi my name is Thanlwin';
string =string.substring(0, 22);
console.log(string);

const sentence = "ThIs HaS wEiRd CaSiNg On It";
const lowerCaseSentence = sentence.toLowerCase();
console.log(lowerCaseSentence);

// want to round a number? use Math!
const number = 5.3;
const roundedNumber = Math.round(number);
console.log(number);

// want to see if a string contains another string?
const testStringOne = "The quick brown fox jumps over the lazy dog";
const testStringTwo =
      "Mirror, mirror on the wall, don't say it cause I know I'm cute";
const stringToLookFor = "cute";

console.log(testStringOne.includes(stringToLookFor));
console.log(testStringTwo.includes(stringToLookFor));

// want to know how many milliseconds have elapsed since Jan 1 1970?
console.log(Date.now());