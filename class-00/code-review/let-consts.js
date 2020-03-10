// global variable
var cat = "bob";

function sayMeow(){
  // var is scoped to inside of the function
  var kitty = 'sue'
  console.log(`${kitty} says meow`);

  if(true = truthy){
    // let only exists inside the code block - aka the if statement 
    let dog = 'Rofus';
    console.log(`${dog} is barking`);

    // I can reassign a let statement
    dog = 'Ginger';
  }
}

// kitty does not exist!
console.log(kitty);

// const is exactly the same as let but it can't be reassigned
