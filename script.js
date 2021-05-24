var Hero = {};
var Enemy = {};
var Boss = {};
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


function DisplayClear() {
    eventText.innerHTML = "";
}

function BlockDamage(attack,defense) {
    return (attack+1)/(defense+1);
}

function EvadeDamage(attack,dodge,health) {
    let chance = dodge/100;
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

function HeroAction(hero = Hero["Knight"],enemy = Enemy["Average Joe"]) {
    let rand = Math.random();
    let chance = hero.Dodge/100;
    let badChance = 1 - chance * (1 + (1-chance) + (1-chance)**2)
    let heroHPP = hero.HP/hero.DEFAULT.HP;
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
    let enemyHPP = enemy.HP/enemy.DEFAULT.HP;
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
    let chargeChance = enemyHPP/10;
    let evadeChance = ((evadeGain/evadeLoss < 1)*evadeGain/evadeLoss)**(1.5+rand) + ((evadeLoss/evadeGain <= 1)*evadeLoss/evadeGain)**(rand/3);
    if (Math.random() < evadeChance) {
        return "dodge"
    }
    if (Math.random() < blockChance) {
        return "block"
    }
    else if (Math.random() < surrenderChance) {
        return "surrender"
    }
    else if (Math.random() < chargeChance) {
        return "charge"
    }
    else {
        return "attack"
    }
}

function Action(hero = Hero["Knight"], enemy = Enemy["Average Joe"]) {
    console.clear();
    if (hero == "") {
        hero = Hero["Knight"];
    }
    if (enemy == "") {
        enemy = Enemy["Average Joe"];
    }
    heroAction = HeroAction(hero,enemy);
    enemyAction = EnemyAction(enemy,hero);
    let damage = 0;
    switch (heroAction) {
        case "run":
            console.log("the hero gave up and ran away");
            ReturnToDefaults(hero);
            ReturnToDefaults(enemy);
            return
        case "taunt":
            enemy.Power *= 2;
            hero.HP += hero.DEFAULT.HP / 10;
            DisplayEvent(`${hero.Name} taunts ${enemy.Name}`,`${enemy.Name} increases their attack`);
            break;
        case "attack":
            DisplayEvent(`${hero.Name} attacks ${enemy.Name}...`);
            switch (enemyAction) {
                case "dodge":
                    DisplayEvent(`${enemy.Name} tries to dodge...`)
                    enemy.HP += enemy.DEFAULT.HP / 10;
                    damage = EvadeDamage(hero.Power,enemy.Dodge,enemy.DEFAULT.HP);
                    enemy.HP -= damage;
                    if (damage == 0) {
                        DisplayEvent(`${enemy.Name} successfully dodges taking no damage`,`${enemy.Name} is at ${enemy.HP} health`)
                    }
                    else if (damage < hero.Power) {
                        DisplayEvent(`${enemy.Name} gets caught by the attack and takes ${damage} damage`,`${enemy.Name} is at ${enemy.HP} health`)
                    }
                    else {
                        DisplayEvent(`${enemy.Name} dodges into the attack and takes ${damage} damage`,`${enemy.Name} is at ${enemy.HP} health`)
                    }
                    break;
                case "block":
                    DisplayEvent(`${enemy.Name} is blocking...`)
                    enemy.Power *= 1.1;
                    damage = BlockDamage(hero.Power,enemy.Block);
                    enemy.HP -= damage;
                    DisplayEvent(`${enemy.Name} takes ${damage} damage`,`${enemy.Name} is at ${enemy.HP} health`)
                    break;
                default:
                    DisplayEvent(`${enemy.Name} does nothing`)
                    enemy.Power *= 1.2;
                    enemy.HP -= hero.Power;
                    DisplayEvent(`${enemy.Name} takes ${hero.Power} damage`,`${enemy.Name} is at ${enemy.HP} health`)
                    break;
            }
            hero.Power = hero.DEFAULT.Power;
            if (enemy.HP <= 0) {
                console.log("enemy died");
                ReturnToDefaults(hero);
                ReturnToDefaults(enemy);
                DisplayEvent(`${enemy.Name} dies to the attack`);
                return;
            }
            break;
    }
    switch (enemyAction) {
        case "surrender":
            console.log("the enemy has surrendered");
            ReturnToDefaults(hero);
            ReturnToDefaults(enemy);
            return
        case "charge":
            enemy.Power *= 3;
            break;
        case "attack":
            DisplayEvent(`${enemy.Name} attacks ${hero.Name}...`)
            switch (heroAction) {
                case "dodge":
                    DisplayEvent(`${hero.Name} tries to dodge...`)
                    hero.HP += hero.DEFAULT.HP / 10;
                    damage = EvadeDamage(enemy.Power,hero.Dodge,hero.DEFAULT.HP);
                    hero.HP -= damage;
                    if (damage == 0) {
                        DisplayEvent(`${hero.Name} successfully dodges taking no damage`,`${hero.Name} is at ${hero.HP} health`)
                    }
                    else if (damage < enemy.Power) {
                        DisplayEvent(`${hero.Name} gets caught by the attack and takes ${damage} damage`,`${hero.Name} is at ${hero.HP} health`)
                    }
                    else {
                        DisplayEvent(`${hero.Name} dodges into the attack and takes ${damage} damage`,`${hero.Name} is at ${hero.HP} health`)
                    }
                case "block":
                    DisplayEvent(`${hero.Name} is blocking...`)
                    hero.Power *= 1.1;
                    damage = BlockDamage(enemy.Power,hero.Block);
                    hero.HP -= damage;
                    DisplayEvent(`${hero.Name} takes ${damage} damage`,`${hero.Name} is at ${hero.HP} health`)
                    break;
                default:
                    DisplayEvent(`${hero.Name} does nothing`)
                    hero.Power *= 1.2;
                    hero.HP -= enemy.Power;
                    DisplayEvent(`${hero.Name} takes ${enemy.Power} damage`,`${hero.Name} is at ${hero.HP} health`)
                    break;
            }
            enemy.Power = enemy.DEFAULT.Power;
            if (hero.HP <= 0) {
                console.log("hero died");
                ReturnToDefaults(hero);
                ReturnToDefaults(enemy);
                return;
            }
            break;
    }
    console.table({Hero: {"HP": hero.HP,"Power": hero.Power,"Action": heroAction},Enemy: {"HP": enemy.HP, "Power": enemy.Power,"Action": enemyAction}});
}

function ReturnToDefaults(...entities) {
    let i = entities.length;
    while(i--) {
        entities[i].Power = entities[i].DEFAULT.Power;
        entities[i].HP = entities[i].DEFAULT.HP;
    }
}

function ResetAll(elm) {
    for (hero in Hero) {
        for (properties in Hero[hero]) {
            if (properties == "DEFAULT") {
                break;
            }
            Hero[hero][properties] = Hero[hero].DEFAULT[properties];
        }
    }
    for (enemy in Enemy) {
        for (properties in Enemy[enemy]) {
            if (properties == "DEFAULT") {
                break;
            }
            Enemy[enemy][properties] = Enemy[enemy].DEFAULT[properties];
        }
    }
    elm.placeholder = elm.value;
    elm.value = "";
}
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