var heroList = document.getElementById("Heroes");
var enemyList = document.getElementById("Enemys");

function NewHero(HERO="Hero", Name="Hero", Type="Hero", Experience="None", HitPoints=220.0, Power=10.0, Dodge=0.0, Block=10.0, Special="None", Attr=[]) {
    Hero[HERO] = {};
    Hero[HERO].Name = Name;
    Hero[HERO].Type = Type;
    Hero[HERO].Experience = Experience;
    Hero[HERO].HP = HitPoints;
    Hero[HERO].Power = Power;
    Hero[HERO].Dodge = Dodge;
    Hero[HERO].Block = Block;
    Hero[HERO].Special = Special;
    Hero[HERO].DEFAULT = {Name: Name,Type: Type,Experience: Experience,HP: HitPoints,Power: Power,Dodge: Dodge,Block: Block,Special: Special};
    var addHero = document.createElement("option");
    addHero.setAttribute("value",HERO);
    addHero.innerHTML = `${Name}, the ${Experience} ${Type}`;
    heroList.appendChild(addHero);
}

function NewEnemy(ENEMY="Enemy", Name="Enemy", Type="Enemy", Experience="None", HitPoints=100.0, Power=10.0, Dodge=0.0, Block=10.0, Special="None") {
    Enemy[ENEMY] = {};
    Enemy[ENEMY].Name = Name;
    Enemy[ENEMY].Type = Type;
    Enemy[ENEMY].Experience = Experience;
    Enemy[ENEMY].HP = HitPoints;
    Enemy[ENEMY].Power = Power;
    Enemy[ENEMY].Dodge = Dodge;
    Enemy[ENEMY].Block = Block;
    Enemy[ENEMY].Special = Special;
    Enemy[ENEMY].DEFAULT = {Name: Name,Type: Type,Experience: Experience, HP: HitPoints,Power: Power,Dodge: Dodge,Block: Block,Special: Special};
    var addEnemy = document.createElement("option");
    addEnemy.setAttribute("value",ENEMY);
    addEnemy.innerHTML = `${Name}, the ${Experience} ${Type}`;
    enemyList.appendChild(addEnemy);
}