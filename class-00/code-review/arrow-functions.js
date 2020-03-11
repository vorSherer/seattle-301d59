function sayMeow(words){
  let cat = 'Cedar';
  return console.log(`${cat} says ${words}`);
}
let cat = 'Cedar';

const sayMeow = (words) => {
  return console.log(`${cat} says ${words}`);
}

///////////////////////

let cats = [];

function Cat(name, hair, temper){
  this.name = name;
  this.hair = hair;
  this.temper = temper;

  cats.push(this);
}

let cedar = new Cat('Cedar', 'tortie', true);
let zoe = new Cat('Zoe', 'gray', 'neurotic');
let maka = new Cat('maka', 'golden', false);

Cat.prototype.sayMeow = function(){
  console.log(`${this.name} says meow`);
}