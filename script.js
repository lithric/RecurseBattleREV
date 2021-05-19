var Hero = {};
var Enemy = {};
var Boss = {};
var heroList = document.getElementById("Heroes");
var enemyList = document.getElementById("Enemys");
var eventText = document.getElementById("events");

NewHero("Knight","Sir Regretable","Knight","Advanced", 325.0, 44.62, 23.0, 3.0,"Parry");
NewHero("Patrick's Rock", "Rock", "Rock", "Omniscient", 1500.0, 2.88, 0.0, 11.2,"it is true, Therefore, it is true");
NewHero("Old Guy In A Chair","Turkey","Human","Vietnam", 33.0, 9.71, 5.0, 0.4,"You See, Back In My Day...");

NewEnemy("Average Joe","Bob","Human","Normal", 100, 20.0, 16.0, 1.0,"None");

function DisplayEvent(event = "") {
    let i = arguments.length+1;
    while(--i) {
        let text = document.createElement("h1");
        text.innerHTML = arguments[arguments.length - i];
        eventText.appendChild(text);
    }
}

function BlockDamage(attack,defense) {
    return (attack+1)/(defense+1);
}

function EvadeDamage(attack,dodge,health) {
    let chance = dodge/100;
    let g2Chance = chance * (1 + (1-chance) + (1-chance)**2);
    let gain = (attack + (attack >= health/2) * (3*attack - health/2) + (attack >= health) * (5*attack - health+1))/3;
    let loss = attack - BlockDamage(attack,20) + attack*2*(1-g2Chance);
    console.log((gain/loss < 1)*gain/loss/3 + ((loss/gain <= 1)*loss/gain)**0.3);
    if (Math.random() < chance) {
        return 0;
    }
    else if (Math.random() < chance && attack >= health/2) {
        return health/2;
    }
    else if (Math.random() < chance && attack >= health) {
        return health-1;
    }
    else {
        return attack*2;
    }
}

console.log(EvadeDamage(21,20,21));

function HeroAction(hero = Hero["Knight"],enemy = Enemy["Average Joe"]) {
    let rand = Math.random();
    let chance = hero.Dodge/100;
    let badChance = 1 - chance * (1 + (1-chance) + (1-chance)**2)
    let heroHPP = hero.HP/hero.FullHP;
    let minAttacks = Math.ceil( enemy.HP/hero.Power );
    let maxAttacks = Math.ceil( enemy.HP/BlockDamage(hero.Power,enemy.Block) );
    let minBlocks = Math.ceil( hero.HP/enemy.Power );
    let maxBlocks = Math.ceil( hero.HP/BlockDamage(enemy.Power,hero.Block) );
    let evadeGain = ( enemy.Power + (enemy.Power >= hero.HP/2) * (3*enemy.Power - hero.HP/2) + (enemy.Power >= hero.HP) * (5*enemy.Power - hero.HP+1) )/3;
    let evadeLoss = enemy.Power - BlockDamage(enemy.Power,hero.Block) + enemy.Power*2*badChance;
    let weightBlocks = (1-rand)*minBlocks + rand*maxBlocks; // more blocks = better
    let weightAttacks = rand*minAttacks + (1-rand)*maxAttacks; // less attacks = better
    let blockChance = Math.min(Math.max(1-(weightBlocks/weightAttacks),0),1);
    let runChance = Math.min(Math.max(0.5 - heroHPP,0),1);
    let tauntChance = heroHPP/10;
    let evadeChance = ((evadeGain/evadeLoss < 1)*evadeGain/evadeLoss)**(1.5+rand) + ((evadeLoss/evadeGain <= 1)*evadeLoss/evadeGain)**(rand/3);
    if (Math.random() < evadeChance) {
        return "dodge"
    }
    else if (Math.random() < blockChance) {
        return "block"
    }
    else if (Math.random() < runChance) {
        return "run"
    }
    else if (Math.random() < tauntChance) {
        return "taunt"
    }
    else {
        return "attack"
    }
}

function EnemyAction(enemy = Enemy["Average Joe"],hero = Hero["Knight"]) {
    let rand = Math.random();
    let chance = enemy.Dodge/100;
    let badChance = 1 - chance * (1 + (1-chance) + (1-chance)**2)
    let enemyHPP = enemy.HP/enemy.FullHP;
    let minAttacks = Math.ceil( hero.HP/enemy.Power );
    let maxAttacks = Math.ceil( hero.HP/BlockDamage(enemy.Power,hero.Block) );
    let minBlocks = Math.ceil( enemy.HP/hero.Power );
    let maxBlocks = Math.ceil( enemy.HP/BlockDamage(hero.Power,enemy.Block) );
    let evadeGain = ( hero.Power + (hero.Power >= enemy.HP/2) * (3*hero.Power - enemy.HP/2) + (hero.Power >= enemy.HP) * (5*hero.Power - enemy.HP+1) )/3;
    let evadeLoss = hero.Power - BlockDamage(hero.Power,enemy.Block) + hero.Power*2*badChance;
    let weightBlocks = (1-rand)*minBlocks + rand*maxBlocks; // more blocks = better
    let weightAttacks = rand*minAttacks + (1-rand)*maxAttacks; // less attacks = better
    let blockChance = Math.min(Math.max(1-(weightBlocks/weightAttacks),0),1);
    let surrenderChance = Math.min(Math.max(0.5 - enemyHPP,0),1);
    let distractedChance = enemyHPP/10;
    let evadeChance = (evadeGain/evadeLoss < 1)*evadeGain/evadeLoss/(1 + 3*rand) + (evadeLoss/evadeGain <= 1)*evadeLoss/evadeGain/(2-rand);
    if (Math.random() < evadeChance) {
        return "dodge"
    }
    if (Math.random() < blockChance) {
        return "block"
    }
    else if (Math.random() < surrenderChance) {
        return "surrender"
    }
    else if (Math.random() < distractedChance) {
        return "distracted"
    }
    else {
        return "attack"
    }
}

function Action(hero = Hero["Knight"], enemy = Enemy["Average Joe"]) {
    let heroAction = HeroAction(hero,enemy);
}

console.log(HeroAction());
/*
turn options:
- enemy attack
- player attack

actions:
- attack
- block
- special (omitted)
- surrender
- do nothing

reactions:
- dodge
- block
- special (omitted)
- surrender
- do nothing

end conditions:
- enemy dies
- hero dies

end actions:
- display end text

{enemy name} has approached the hero,

hero's turn:
Given, enemyHP, heroHP, heroHPFull, enemyATK, heroATK, heroBlock, enemyBlock
var rand = Math.random()
heroHP/heroHPFull = heroHPP
Math.ceil( enemyHP/heroATK ) = minAttacks
Math.ceil( enemyHP/BlockDamage(heroATK,enemyBlock) ) = maxAttacks
Math.ceil( heroHP/enemyATK ) = minBlocks
Math.ceil( heroHP/BlockDamage(enemyATK,heroBlock) ) = maxBlocks
(1-rand)*minBlocks + rand*maxBlocks = weightBlocks
(1-rand)*minAttacks + rand*maxAttacks = weightAttacks
Math.min(Math.max(1-(weightBlocks/weightAttacks),0),1) = blockChance
Math.min(Math.max(0.5 - heroHPP,0),1) = surrenderChance
heroHPP/10 = tauntChance

if Math.random() < blockChance -> block else
if Math.random() < surrenderChance -> surrender else
if Math.random() < tauntChance -> taunt else
attack

- attack
- block ()
- special (omitted)
- surrender
- taunt


*/