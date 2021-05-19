function NewHero(HERO="Hero", Name="Hero", HeroType="Hero", Experience="None", HitPoints=220.0, Power=10.0, Dodge=0.0, Block=10.0, Special="None", Attr=[]) {
    Hero[HERO] = {};
    Hero[HERO].Name = Name;
    Hero[HERO].HeroType = HeroType;
    Hero[HERO].Experience = Experience;
    Hero[HERO].HP = HitPoints;
    Hero[HERO].FullHP = HitPoints;
    Hero[HERO].Power = Power;
    Hero[HERO].Dodge = Dodge;
    Hero[HERO].Block = Block;
    Hero[HERO].Special = Special;
    var addHero = document.createElement("option");
    addHero.setAttribute("value",HERO);
    addHero.innerHTML = `${Name}, the ${Experience} ${HeroType}`;
    heroList.appendChild(addHero);
}

function NewEnemy(ENEMY="Enemy", Name="Enemy", EnemyType="Enemy", Experience="None", HitPoints=100.0, Power=10.0, Dodge=0.0, Block=10.0, Special="None") {
    Enemy[ENEMY] = {};
    Enemy[ENEMY].Name = Name;
    Enemy[ENEMY].EnemyType = EnemyType;
    Enemy[ENEMY].HP = HitPoints;
    Enemy[ENEMY].FullHP = HitPoints;
    Enemy[ENEMY].Power = Power;
    Enemy[ENEMY].Dodge = Dodge;
    Enemy[ENEMY].Block = Block;
    Enemy[ENEMY].Special = Special;
    var addEnemy = document.createElement("option");
    addEnemy.setAttribute("value",ENEMY);
    addEnemy.innerHTML = `${Name}, the ${Experience} ${EnemyType}`;
    enemyList.appendChild(addEnemy);
}