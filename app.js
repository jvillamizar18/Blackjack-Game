
/*For the <head> of the html I coppied the information
such as charset="UTF-8" from a youtube tutorial
https://www.youtube.com/watch?v=NxRwIZWjLtE&t=267s 
*/

var mySum = 0;
var dealerSum = 0;
var myAceCount = 0; 
var dealerAceCount = 0;
var hidden; 
var deck;
var canHit = true; 


window.onload = function() {
    buildTheDeck(); 
    shuffleTheDeck(); 
    game();


    $("#hit").click(hit); 
    $("#stay").click(stay); 
    $("#restart").click(restart);
}


function buildTheDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["T", "D", "C", "P"]; //Trebol, Diamante, Corazon, Picas
    
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        } 8
    }
    
}

function shuffleTheDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function game() {
    hidden = deck.pop();

    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let cardImg = $("<img>");
    let card = deck.pop();
    cardImg.attr("src",  "./cartas/" + card + ".png")
    dealerSum += getValue(card); 
    dealerAceCount += checkAce(card);
    cardImg.appendTo("#dealer-cards")

    for (let i = 0; i < 2; i++) {
        let cardImg = $("<img>");
        let card = deck.pop();
        cardImg.attr("src",  "./cartas/" + card + ".png")
        mySum += getValue(card);
        myAceCount += checkAce(card); 
        cardImg.appendTo("#my-cards")
    }
}


function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = $("<img>");
    let carta = deck.pop();
    cardImg.attr("src",  "./cartas/" + carta + ".png")
    mySum += getValue(carta); 
    myAceCount += checkAce(carta);
    cardImg.appendTo("#my-cards")

    if (reduceAce(mySum, myAceCount) > 21) { 
        stay()
    }
}

function stay() {
    canHit = false;
    $("#hidden")[0].src= "./cartas/" + hidden + ".png";
    
    while(reduceAce(dealerSum, dealerAceCount) <= 17) {
        console.log(dealerAceCount)
        let cardImg = $("<img>");
        let card = deck.pop();
        cardImg.attr("src",  "./cartas/" + card + ".png")
        dealerSum += getValue(card); 
        dealerAceCount += checkAce(card);
        cardImg.appendTo("#dealer-cards")
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    mySum = reduceAce(mySum, myAceCount);


    let message = "";
    if (mySum > 21) {
        message = "Thats bad, you busted! Dealer wins!";
    }
    else if (dealerSum > 21) {
        message = "Nice job, you win!";
    }
    else if (mySum == dealerSum) {
        message = "Tie! Keep going!";
    }
    else if (mySum < dealerSum) {
        message = "Thats bad, you lost! Dealer wins!";
    }
    else if (mySum > dealerSum) {
        message = "Nice job, you win!";
    }

    $("#dealer-sum").text(dealerSum);
    $("#my-sum").text(mySum);
    $("#results").text(message); //+ ", game will restart in 5 seconds.");


    //setTimeout(restart, 5000)
}

function restart(){
    mySum = 0;
    dealerSum = 0;
    myAceCount = 0; 
    dealerAceCount = 0;
    hidden = undefined 
    deck = undefined
    canHit = true; 

    buildTheDeck()
    shuffleTheDeck();


    $("#dealer-cards")[0].innerHTML = ""

    let hiddenCard = $("<img>");
    hiddenCard.attr("src",  "./cartas/Atras.png")
    hiddenCard.attr("id", "hidden")
    hiddenCard.appendTo("#dealers-cards")


    $("#dealer-cards").append(hiddenCard)

    $("#my-cards")[0].innerHTML =""
    $("#dealer-sum").text("");
    $("#my-sum").text("");
    $("#results").text("");

    game()
}

/*Code below helped by youtube video tutorial 
- https://www.youtube.com/watch?v=bMYCWccL-3U&t=1323s
*/

function getValue(card) {
    let data = card.split("-"); 
    let value = data[0];

    if (isNaN(value)) { 
        if (value == "A") {
            return 11; 
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

