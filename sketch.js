var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood,feed;
var foodObj;

//create feed and lastFed variable here
var feed,lastfeed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('comida');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed=createButton("Alimentar o cão");
  feed.position(300,95);
  feed.mousePressed(feedDog);
  addFood=createButton("Adicionar comida");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  feedtime = database.ref("horariorefeicao");
  feedtime.on("value",function (data){
    lastfeed = data.val()
  })
 fill("white")
  //write code to display text lastFed time here
  if(lastfeed>=12){
    text("Ultima Refeição:"+lastfeed+"Da Tarde/Noite",500,95)
  }
  else if(lastfeed == 0){
    text("Ultima Refeição:12am",800,95)
  }
  else if(lastfeed<12){
    text("Ultima Refeição:"+lastfeed+"Da Manhã",500,95)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var foodStockVal = foodObj.getFoodStock()
  if (foodStockVal <= 0){
    foodObj.updateFoodStock(foodStockVal*0)
  }
  else{
    foodObj.deductFood()
  }
  database.ref("/").update({
    horariorefeicao:hour(),
    comida:foodObj.getFoodStock()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    comida:foodS
  })
}
