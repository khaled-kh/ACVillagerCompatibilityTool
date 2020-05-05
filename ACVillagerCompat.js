
function getElemIndex(s)
{
    if(s==='Aries'||s==='Leo'||s==='Sagittarius')return 1;
    if(s==='Taurus'||s==='Virgo'||s==='Capricorn')return 2;
    if(s==='Gemini'||s==='Libra'||s==='Aquarius')return 3;
    if(s==='Cancer'||s==='Scorpio'||s==='Pisces')return 4;
    return 0;
}

function getElement(s)
{
    return['','Fire','Earth','Water','Air'][getElemIndex(s)];
}

function getSignCompat(a,b)
{
    i = getElemIndex(a);
    j = getElemIndex(b);
    if (i == 0 || j == 0) return '?';
    if (i == j) return '♥';
    if (i%2 == j%2) return '×';
    return '♦';
}

function getSpeciesCompat(a,b)
{
    if (a === b) return '♦';
    if ((a==='Bull' && b==='Cow')||(b==='Bull' && a==='Cow')) return '♥';
    if ((a==='Bear' && b==='Cub')||(b==='Bear' && a==='Cub')) return '♥';
    if ((a==='Cat' && b==='Tiger')||(b==='Cat' && a==='Tiger')) return '♥';
    if ((a==='Dog' && b==='Wolf')||(b==='Dog' && a==='Wolf')) return '♥';
    if ((a==='Goat' && b==='Sheep')||(b==='Goat' && a==='Sheep')) return '♥';
    if ((a==='Kangaroo' && b==='Koala')||(b==='Kangaroo' && a==='Koala')) return '♥';
    if ((a==='Deer' && b==='Horse')||(b==='Deer' && a==='Horse')) return '♦';
    if ((a==='Hamster' && b==='Squirrel')||(b==='Hamster' && a==='Squirrel')) return '♦';
    if ((a==='Hamster' && b==='Mouse')||(b==='Hamster' && a==='Mouse')) return '♦';
    if ((a==='Mouse' && b==='Squirrel')||(b==='Mouse' && a==='Squirrel')) return '♦';
    if ((a==='Cat' && b==='Mouse')||(b==='Cat' && a==='Mouse')) return '×';
    if ((a==='Cat' && b==='Hamster')||(b==='Cat' && a==='Hamster')) return '×';
    if ((a==='Dog' && b==='Gorilla')||(b==='Dog' && a==='Gorilla')) return '×';
    if ((a==='Dog' && b==='Monkey')||(b==='Dog' && a==='Monkey')) return '×';
    if ((a==='Sheep' && b==='Wolf')||(b==='Sheep' && a==='Wolf')) return '×';
    return '♣';
}

personalityIndex = {'Normal':0,'Lazy':1,'Peppy':2,
'Jock':3,'Snooty':4,'Cranky':5,'Smug':6,'Sisterly':7};

personalityMatrix = [
['♣','×','×','♦','♥','♣','♥','♦'],
['×','♥','♦','×','♣','♦','♣','♥'],
['×','♦','♥','♥','♦','×','♣','♣'],
['♦','×','♥','♥','×','♣','♦','♣'],
['♥','♣','♦','×','♣','♥','♦','×'],
['♣','♦','×','♣','♥','♥','×','♦'],
['♥','♣','♣','♦','♦','×','♥','×'],
['♦','♥','♣','♣','×','♦','×','♥']];

function getPersonalityCompat(a,b)
{
    i = personalityIndex[a];
    j = personalityIndex[b];
    return personalityMatrix[i][j];
}

function getCompatibility(a,b)
{
    return [getSignCompat(a['Sign'],b['Sign']),
    getSpeciesCompat(a['Species'],b['Species']),
    getPersonalityCompat(a['Personality'],b['Personality'])];
}

function count(list,val)
{
    var occurences = 0;
    for (var i=0; i<list.length; i++)
    if (list[i] === val) occurences++;
    return occurences;
}

function getConsensus(r)
{
    if (count(r,'♥') > 1) return 'Good';
    if (count(r,'♥') == 1 && count(r,'♦') > 0 
    && count(r,'×') == 0) return 'Good';
    if (count(r,'×') > 1) return 'Bad';
    return 'Average';
}

// range: ♥♥♥ 15 > ♦♦♦ 9 > ♣♣♣ 3 > ××× -6
scoring = { '♥': 5, '♦': 3, '♣': 1, '×': -2 };

function getScore(r)
{
    s = 0;
    for (var i=0; i<r.length; i++)
        s += scoring[ r[i] ];
    return s;
}

function getVillager(name)
{
    for (i = 0; i < data.length; i++)
    if (data[i]['Name'].toLowerCase() === name.toLowerCase())
        return data[i];
    return null;
}

function findTop(a,rating)
{
    var l = [], min=-6, max=15;
    if (rating === 'Best') min = 8;
    if (rating === 'Worst') max = -1;
    if (rating === 'Average'){ min = 0; max = 7;}

    for (var i = 0; i < data.length; i++)
    if (data[i].Name != a.Name)
    {
        var r = getCompatibility(a,data[i]);
        var s = getScore(r);
        if(s >= min && s <= max)
            l.push(data[i].Name
            +": "+getConsensus(r)+" "+s);
    }
    l.sort(function(a,b)
    { return parseInt(b.substr(b.length-2))
            > parseInt(a.substr(a.length-2)) ? 1 
            : ((parseInt(a.substr(a.length-2))
                > parseInt(b.substr(b.length-2)))
                ? -1 : 0); });
    return l;
}

function orderAlpha()
{
    data.sort(function(a,b)
    { return (a.Name > b.Name) ? 1 
        : ( (b.Name > a.Name) ? -1 : 0); });
}

var data = [{"Name":"Gaston", "Personality":"Cranky", "Species":"Rabbit", "Birthday":"Jan 1", "Sign":"Capricorn", "Catchphrase":"pthhhpth"},
{"Name":"Limberg", "Personality":"Cranky", "Species":"Mouse", "Birthday":"Jan 2", "Sign":"Capricorn", "Catchphrase":"li'l bear"},
{"Name":"Bonbon", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Jan 3", "Sign":"Capricorn", "Catchphrase":"bleeeeeck"},
{"Name":"Pate", "Personality":"Peppy", "Species":"Duck", "Birthday":"Jan 4", "Sign":"Capricorn", "Catchphrase":"no doy"},
{"Name":"Boomer", "Personality":"Lazy", "Species":"Penguin", "Birthday":"Jan 5", "Sign":"Capricorn", "Catchphrase":"b-b-buddy"},
{"Name":"Tammy", "Personality":"Sisterly", "Species":"Cub", "Birthday":"Jan 6", "Sign":"Capricorn", "Catchphrase":"nougat"},
{"Name":"Reneigh", "Personality":"Sisterly", "Species":"Horse", "Birthday":"Jan 7", "Sign":"Capricorn", "Catchphrase":"beach bum"},
{"Name":"Mott", "Personality":"Jock", "Species":"Lion", "Birthday":"Jan 8", "Sign":"Capricorn", "Catchphrase":"hawkeye"},
{"Name":"Huck", "Personality":"Smug", "Species":"Frog", "Birthday":"Jan 9", "Sign":"Capricorn", "Catchphrase":"bun bun"},
{"Name":"Curlos", "Personality":"Smug", "Species":"Sheep", "Birthday":"Jan 10", "Sign":"Capricorn", "Catchphrase":"haaay"},
{"Name":"Punchy", "Personality":"Lazy", "Species":"Cat", "Birthday":"Jan 11", "Sign":"Capricorn", "Catchphrase":"yippee"},
{"Name":"Francine", "Personality":"Snooty", "Species":"Rabbit", "Birthday":"Jan 12", "Sign":"Capricorn", "Catchphrase":"myawn"},
{"Name":"Moe", "Personality":"Lazy", "Species":"Cat", "Birthday":"Jan 13", "Sign":"Capricorn", "Catchphrase":"splish"},
{"Name":"Ketchup", "Personality":"Peppy", "Species":"Duck", "Birthday":"Jan 14", "Sign":"Capricorn", "Catchphrase":"blih"},
{"Name":"Boris", "Personality":"Cranky", "Species":"Pig", "Birthday":"Jan 14", "Sign":"Capricorn", "Catchphrase":"woo-oo"},
{"Name":"Twiggy", "Personality":"Peppy", "Species":"Bird", "Birthday":"Jan 15", "Sign":"Capricorn", "Catchphrase":"stretch"},
{"Name":"Cookie", "Personality":"Peppy", "Species":"Dog", "Birthday":"Jan 16", "Sign":"Capricorn", "Catchphrase":"grooomph"},
{"Name":"Julian", "Personality":"Smug", "Species":"Horse", "Birthday":"Jan 17", "Sign":"Capricorn", "Catchphrase":"squee"},
{"Name":"Sprinkle", "Personality":"Peppy", "Species":"Penguin", "Birthday":"Jan 18", "Sign":"Capricorn", "Catchphrase":"bawwww"},
{"Name":"Rhonda", "Personality":"Normal", "Species":"Rhino", "Birthday":"Jan 19", "Sign":"Capricorn", "Catchphrase":"zzzook"},
{"Name":"Mallary", "Personality":"Snooty", "Species":"Duck", "Birthday":"Jan 20", "Sign":"Aquarius", "Catchphrase":"snoot"},
{"Name":"Sprocket", "Personality":"Jock", "Species":"Ostrich", "Birthday":"Jan 21", "Sign":"Aquarius", "Catchphrase":"mochi"},
{"Name":"Jambette", "Personality":"Normal", "Species":"Frog", "Birthday":"Jan 22", "Sign":"Aquarius", "Catchphrase":"karat"},
{"Name":"Ellie", "Personality":"Normal", "Species":"Elephant", "Birthday":"Jan 23", "Sign":"Aquarius", "Catchphrase":"h-h-hon"},
{"Name":"Bob", "Personality":"Lazy", "Species":"Cat", "Birthday":"Jan 24", "Sign":"Aquarius", "Catchphrase":"bigfoot"},
{"Name":"Anchovy", "Personality":"Lazy", "Species":"Bird", "Birthday":"Jan 25", "Sign":"Aquarius", "Catchphrase":"y'all"},
{"Name":"Nan", "Personality":"Normal", "Species":"Goat", "Birthday":"Jan 26", "Sign":"Aquarius", "Catchphrase":"piffle"},
{"Name":"Coach", "Personality":"Jock", "Species":"Bull", "Birthday":"Jan 27", "Sign":"Aquarius", "Catchphrase":"b-b-baby"},
{"Name":"Soleil", "Personality":"Snooty", "Species":"Hamster", "Birthday":"Jan 27", "Sign":"Aquarius", "Catchphrase":"aye aye"},
{"Name":"Klaus", "Personality":"Smug", "Species":"Bear", "Birthday":"Jan 28", "Sign":"Aquarius", "Catchphrase":"tootie"},
{"Name":"Snake", "Personality":"Jock", "Species":"Rabbit", "Birthday":"Jan 29", "Sign":"Aquarius", "Catchphrase":"d-d-dude"},
{"Name":"Tutu", "Personality":"Peppy", "Species":"Bear", "Birthday":"Jan 30", "Sign":"Aquarius", "Catchphrase":"powderpuff"},
{"Name":"Kody", "Personality":"Jock", "Species":"Cub", "Birthday":"Jan 31", "Sign":"Aquarius", "Catchphrase":"hay-OK"},
{"Name":"Flip", "Personality":"Jock", "Species":"Monkey", "Birthday":"Feb 1", "Sign":"Aquarius", "Catchphrase":"quacko"},
{"Name":"Tammi", "Personality":"Peppy", "Species":"Monkey", "Birthday":"Feb 2", "Sign":"Aquarius", "Catchphrase":"bzzert"},
{"Name":"Keaton", "Personality":"Smug", "Species":"Eagle", "Birthday":"Feb 3", "Sign":"Aquarius", "Catchphrase":"purrr"},
{"Name":"Paula", "Personality":"Sisterly", "Species":"Bear", "Birthday":"Feb 4", "Sign":"Aquarius", "Catchphrase":"toady"},
{"Name":"Patty", "Personality":"Peppy", "Species":"Cow", "Birthday":"Feb 5", "Sign":"Aquarius", "Catchphrase":"oh bow"},
{"Name":"Alli", "Personality":"Snooty", "Species":"Alligator", "Birthday":"Feb 6", "Sign":"Aquarius", "Catchphrase":"gumdrop"},
{"Name":"Vesta", "Personality":"Normal", "Species":"Sheep", "Birthday":"Feb 7", "Sign":"Aquarius", "Catchphrase":"human"},
{"Name":"Rory", "Personality":"Jock", "Species":"Lion", "Birthday":"Feb 8", "Sign":"Aquarius", "Catchphrase":"fribbit"},
{"Name":"Norma", "Personality":"Normal", "Species":"Cow", "Birthday":"Feb 9", "Sign":"Aquarius", "Catchphrase":"pinky"},
{"Name":"Gigi", "Personality":"Snooty", "Species":"Frog", "Birthday":"Feb 9", "Sign":"Aquarius", "Catchphrase":"sugar"},
{"Name":"Ruby", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Feb 10", "Sign":"Aquarius", "Catchphrase":"stuffin'"},
{"Name":"Rudy", "Personality":"Jock", "Species":"Cat", "Birthday":"Feb 11", "Sign":"Aquarius", "Catchphrase":"rah rah"},
{"Name":"Doc", "Personality":"Lazy", "Species":"Rabbit", "Birthday":"Feb 12", "Sign":"Aquarius", "Catchphrase":"burrrn"},
{"Name":"Elvis", "Personality":"Cranky", "Species":"Lion", "Birthday":"Feb 13", "Sign":"Aquarius", "Catchphrase":"zzrrbbitt"},
{"Name":"Joey", "Personality":"Lazy", "Species":"Duck", "Birthday":"Feb 14", "Sign":"Aquarius", "Catchphrase":"nightshade"},
{"Name":"Sterling", "Personality":"Jock", "Species":"Eagle", "Birthday":"Feb 15", "Sign":"Aquarius", "Catchphrase":"mrowrr"},
{"Name":"Tom", "Personality":"Cranky", "Species":"Cat", "Birthday":"Feb 16", "Sign":"Aquarius", "Catchphrase":"snorty"},
{"Name":"Eugene", "Personality":"Smug", "Species":"Koala", "Birthday":"Feb 17", "Sign":"Aquarius", "Catchphrase":"ohmmm"},
{"Name":"Piper", "Personality":"Peppy", "Species":"Bird", "Birthday":"Feb 18", "Sign":"Aquarius", "Catchphrase":"squeaky"},
{"Name":"Purrl", "Personality":"Snooty", "Species":"Cat", "Birthday":"Feb 19", "Sign":"Pisces", "Catchphrase":"ducky"},
{"Name":"Vladimir", "Personality":"Cranky", "Species":"Cub", "Birthday":"Feb 20", "Sign":"Pisces", "Catchphrase":"frappe"},
{"Name":"Wendy", "Personality":"Peppy", "Species":"Sheep", "Birthday":"Feb 21", "Sign":"Pisces", "Catchphrase":"brrrrrrrrr"},
{"Name":"Peewee", "Personality":"Cranky", "Species":"Gorilla", "Birthday":"Feb 22", "Sign":"Pisces", "Catchphrase":"skree-haw"},
{"Name":"Rosie", "Personality":"Peppy", "Species":"Cat", "Birthday":"Feb 23", "Sign":"Pisces", "Catchphrase":"quackle"},
{"Name":"Bluebear", "Personality":"Peppy", "Species":"Cub", "Birthday":"Feb 24", "Sign":"Pisces", "Catchphrase":"cannoli"},
{"Name":"Savannah", "Personality":"Normal", "Species":"Horse", "Birthday":"Feb 25", "Sign":"Pisces", "Catchphrase":"snort"},
{"Name":"Iggly", "Personality":"Jock", "Species":"Penguin", "Birthday":"Feb 26", "Sign":"Pisces", "Catchphrase":"cardio"},
{"Name":"Egbert", "Personality":"Lazy", "Species":"Chicken", "Birthday":"Feb 27", "Sign":"Pisces", "Catchphrase":"silly"},
{"Name":"Big Top", "Personality":"Lazy", "Species":"Elephant", "Birthday":"Feb 28", "Sign":"Pisces", "Catchphrase":"moolah"},
{"Name":"Vic", "Personality":"Cranky", "Species":"Bull", "Birthday":"Mar 1", "Sign":"Pisces", "Catchphrase":"doyoing"},
{"Name":"Pippy", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Mar 2", "Sign":"Pisces", "Catchphrase":"cubby"},
{"Name":"Pudge", "Personality":"Lazy", "Species":"Cub", "Birthday":"Mar 3", "Sign":"Pisces", "Catchphrase":"deelish"},
{"Name":"Coco", "Personality":"Normal", "Species":"Rabbit", "Birthday":"Mar 4", "Sign":"Pisces", "Catchphrase":"chuurp"},
{"Name":"Rodeo", "Personality":"Lazy", "Species":"Bull", "Birthday":"Mar 5", "Sign":"Pisces", "Catchphrase":"snortie"},
{"Name":"Pinky", "Personality":"Peppy", "Species":"Bear", "Birthday":"Mar 6", "Sign":"Pisces", "Catchphrase":"la baa"},
{"Name":"Monique", "Personality":"Snooty", "Species":"Cat", "Birthday":"Mar 6", "Sign":"Pisces", "Catchphrase":"flap flap"},
{"Name":"Grizzly", "Personality":"Cranky", "Species":"Bear", "Birthday":"Mar 7", "Sign":"Pisces", "Catchphrase":"quackidee"},
{"Name":"Hornsby", "Personality":"Lazy", "Species":"Rhino", "Birthday":"Mar 8", "Sign":"Pisces", "Catchphrase":"bloop"},
{"Name":"Bertha", "Personality":"Normal", "Species":"Hippo", "Birthday":"Mar 9", "Sign":"Pisces", "Catchphrase":"ah-CHOO"},
{"Name":"Dizzy", "Personality":"Lazy", "Species":"Elephant", "Birthday":"Mar 10", "Sign":"Pisces", "Catchphrase":"myohmy"},
{"Name":"Agent S", "Personality":"Peppy", "Species":"Squirrel", "Birthday":"Mar 11", "Sign":"Pisces", "Catchphrase":"thumper"},
{"Name":"Del", "Personality":"Cranky", "Species":"Alligator", "Birthday":"Mar 12", "Sign":"Pisces", "Catchphrase":"tweedledee"},
{"Name":"Boots", "Personality":"Jock", "Species":"Alligator", "Birthday":"Mar 13", "Sign":"Pisces", "Catchphrase":"sundae"},
{"Name":"Olive", "Personality":"Normal", "Species":"Cub", "Birthday":"Mar 14", "Sign":"Pisces", "Catchphrase":"wee one"},
{"Name":"Rolf", "Personality":"Cranky", "Species":"Tiger", "Birthday":"Mar 15", "Sign":"Pisces", "Catchphrase":"glitter"},
{"Name":"Muffy", "Personality":"Sisterly", "Species":"Sheep", "Birthday":"Mar 16", "Sign":"Pisces", "Catchphrase":"ol' bunny"},
{"Name":"Plucky", "Personality":"Sisterly", "Species":"Chicken", "Birthday":"Mar 17", "Sign":"Pisces", "Catchphrase":"tralala"},
{"Name":"Friga", "Personality":"Snooty", "Species":"Penguin", "Birthday":"Mar 18", "Sign":"Pisces", "Catchphrase":"indeedaroo"},
{"Name":"Ankha", "Personality":"Snooty", "Species":"Cat", "Birthday":"Mar 19", "Sign":"Pisces", "Catchphrase":"shortcake"},
{"Name":"Eunice", "Personality":"Normal", "Species":"Sheep", "Birthday":"Mar 20", "Sign":"Pisces", "Catchphrase":"schnozzle"},
{"Name":"Paolo", "Personality":"Lazy", "Species":"Elephant", "Birthday":"Mar 21", "Sign":"Aries", "Catchphrase":"puh-lease"},
{"Name":"Goldie", "Personality":"Normal", "Species":"Dog", "Birthday":"Mar 22", "Sign":"Aries", "Catchphrase":"yodelay"},
{"Name":"Lionel", "Personality":"Smug", "Species":"Lion", "Birthday":"Mar 23", "Sign":"Aries", "Catchphrase":"WHONK"},
{"Name":"Mitzi", "Personality":"Normal", "Species":"Cat", "Birthday":"Mar 24", "Sign":"Aries", "Catchphrase":"airmail"},
{"Name":"Groucho", "Personality":"Cranky", "Species":"Bear", "Birthday":"Mar 25", "Sign":"Aries", "Catchphrase":"feathers"},
{"Name":"Sydney", "Personality":"Normal", "Species":"Koala", "Birthday":"Mar 25", "Sign":"Aries", "Catchphrase":"dagnaabit"},
{"Name":"Snooty", "Personality":"Snooty", "Species":"Anteater", "Birthday":"Mar 26", "Sign":"Aries", "Catchphrase":"dearie"},
{"Name":"Phil", "Personality":"Smug", "Species":"Ostrich", "Birthday":"Mar 26", "Sign":"Aries", "Catchphrase":"hoo hoo ha"},
{"Name":"Gayle", "Personality":"Normal", "Species":"Alligator", "Birthday":"Mar 27", "Sign":"Aries", "Catchphrase":"bonbon"},
{"Name":"Tad", "Personality":"Jock", "Species":"Frog", "Birthday":"Mar 28", "Sign":"Aries", "Catchphrase":"daahling"},
{"Name":"Gladys", "Personality":"Normal", "Species":"Ostrich", "Birthday":"Mar 29", "Sign":"Aries", "Catchphrase":"squirt"},
{"Name":"Ken", "Personality":"Smug", "Species":"Chicken", "Birthday":"Mar 30", "Sign":"Aries", "Catchphrase":"mimimi"},
{"Name":"Ricky", "Personality":"Cranky", "Species":"Squirrel", "Birthday":"Mar 31", "Sign":"Aries", "Catchphrase":"strudel"},
{"Name":"Tipper", "Personality":"Snooty", "Species":"Cow", "Birthday":"Apr 2", "Sign":"Aries", "Catchphrase":"chimpy"},
{"Name":"Ribbot", "Personality":"Jock", "Species":"Frog", "Birthday":"Apr 2", "Sign":"Aries", "Catchphrase":"baaaby"},
{"Name":"Felicity", "Personality":"Peppy", "Species":"Cat", "Birthday":"Apr 3", "Sign":"Aries", "Catchphrase":"lambchop"},
{"Name":"Flora", "Personality":"Peppy", "Species":"Ostrich", "Birthday":"Apr 4", "Sign":"Aries", "Catchphrase":"pardner"},
{"Name":"Pancetti", "Personality":"Snooty", "Species":"Pig", "Birthday":"Apr 5", "Sign":"Aries", "Catchphrase":"saltlick"},
{"Name":"Colton", "Personality":"Smug", "Species":"Horse", "Birthday":"Apr 6", "Sign":"Aries", "Catchphrase":"slushie"},
{"Name":"Sylvia", "Personality":"Sisterly", "Species":"Kangaroo", "Birthday":"Apr 7", "Sign":"Aries", "Catchphrase":"swine"},
{"Name":"Quillson", "Personality":"Smug", "Species":"Duck", "Birthday":"Apr 8", "Sign":"Aries", "Catchphrase":"duckling"},
{"Name":"Kabuki", "Personality":"Cranky", "Species":"Cat", "Birthday":"Apr 9", "Sign":"Aries", "Catchphrase":"baa-dabing"},
{"Name":"Marcel", "Personality":"Lazy", "Species":"Dog", "Birthday":"Apr 10", "Sign":"Aries", "Catchphrase":"cheeky"},
{"Name":"Gabi", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Apr 11", "Sign":"Aries", "Catchphrase":"mrmpht"},
{"Name":"Lucha", "Personality":"Smug", "Species":"Bird", "Birthday":"Apr 12", "Sign":"Aries", "Catchphrase":"toasty"},
{"Name":"Cheri", "Personality":"Peppy", "Species":"Cub", "Birthday":"Apr 13", "Sign":"Aries", "Catchphrase":"sweetie"},
{"Name":"Portia", "Personality":"Snooty", "Species":"Dog", "Birthday":"Apr 14", "Sign":"Aries", "Catchphrase":"vroom"},
{"Name":"Katt", "Personality":"Sisterly", "Species":"Cat", "Birthday":"Apr 16", "Sign":"Aries", "Catchphrase":"baaaffo"},
{"Name":"Daisy", "Personality":"Normal", "Species":"Dog", "Birthday":"Apr 17", "Sign":"Aries", "Catchphrase":"urgh"},
{"Name":"Tangy", "Personality":"Peppy", "Species":"Cat", "Birthday":"Apr 18", "Sign":"Aries", "Catchphrase":"chickadee"},
{"Name":"Whitney", "Personality":"Snooty", "Species":"Wolf", "Birthday":"Apr 19", "Sign":"Aries", "Catchphrase":"honk honk"},
{"Name":"Carmen", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Apr 20", "Sign":"Taurus", "Catchphrase":"moo-dude"},
{"Name":"Drake", "Personality":"Lazy", "Species":"Duck", "Birthday":"Apr 21", "Sign":"Taurus", "Catchphrase":"snuffle"},
{"Name":"Maddie", "Personality":"Peppy", "Species":"Dog", "Birthday":"Apr 22", "Sign":"Taurus", "Catchphrase":"sparky"},
{"Name":"Weber", "Personality":"Lazy", "Species":"Duck", "Birthday":"Apr 23", "Sign":"Taurus", "Catchphrase":"quackulous"},
{"Name":"Astrid", "Personality":"Snooty", "Species":"Kangaroo", "Birthday":"Apr 24", "Sign":"Taurus", "Catchphrase":"pockets"},
{"Name":"Ursala", "Personality":"Sisterly", "Species":"Bear", "Birthday":"Apr 25", "Sign":"Taurus", "Catchphrase":"bloop"},
{"Name":"Flo", "Personality":"Sisterly", "Species":"Penguin", "Birthday":"Apr 26", "Sign":"Taurus", "Catchphrase":"weeweewee"},
{"Name":"Cherry", "Personality":"Sisterly", "Species":"Dog", "Birthday":"Apr 27", "Sign":"Taurus", "Catchphrase":"purrty"},
{"Name":"Anabelle", "Personality":"Peppy", "Species":"Anteater", "Birthday":"Apr 28", "Sign":"Taurus", "Catchphrase":"beaker"},
{"Name":"Nana", "Personality":"Normal", "Species":"Monkey", "Birthday":"Apr 29", "Sign":"Taurus", "Catchphrase":"stubble"},
{"Name":"Rodney", "Personality":"Smug", "Species":"Hamster", "Birthday":"Apr 30", "Sign":"Taurus", "Catchphrase":"macmoo"},
{"Name":"Tank", "Personality":"Jock", "Species":"Rhino", "Birthday":"May 1", "Sign":"Taurus", "Catchphrase":"clip-clawp"},
{"Name":"Chevre", "Personality":"Normal", "Species":"Goat", "Birthday":"May 2", "Sign":"Taurus", "Catchphrase":"ahhhhhh"},
{"Name":"Walker", "Personality":"Lazy", "Species":"Dog", "Birthday":"May 3", "Sign":"Taurus", "Catchphrase":"boing"},
{"Name":"Bones", "Personality":"Lazy", "Species":"Dog", "Birthday":"May 4", "Sign":"Taurus", "Catchphrase":"whatevs"},
{"Name":"Curly", "Personality":"Jock", "Species":"Pig", "Birthday":"May 5", "Sign":"Taurus", "Catchphrase":"pal"},
{"Name":"Queenie", "Personality":"Snooty", "Species":"Ostrich", "Birthday":"May 6", "Sign":"Taurus", "Catchphrase":"kerPOW"},
{"Name":"Dom", "Personality":"Jock", "Species":"Sheep", "Birthday":"May 7", "Sign":"Taurus", "Catchphrase":"ol' bear"},
{"Name":"Vivian", "Personality":"Snooty", "Species":"Wolf", "Birthday":"May 8", "Sign":"Taurus", "Catchphrase":"shearly"},
{"Name":"Stitches", "Personality":"Lazy", "Species":"Cub", "Birthday":"May 9", "Sign":"Taurus", "Catchphrase":"tee-hee"},
{"Name":"Knox", "Personality":"Cranky", "Species":"Chicken", "Birthday":"May 10", "Sign":"Taurus", "Catchphrase":"how-now"},
{"Name":"Benjamin", "Personality":"Lazy", "Species":"Dog", "Birthday":"May 11", "Sign":"Taurus", "Catchphrase":"what what"},
{"Name":"Ike", "Personality":"Cranky", "Species":"Bear", "Birthday":"May 12", "Sign":"Taurus", "Catchphrase":"li'l one"},
{"Name":"Kevin", "Personality":"Jock", "Species":"Pig", "Birthday":"May 13", "Sign":"Taurus", "Catchphrase":"dog"},
{"Name":"Bill", "Personality":"Jock", "Species":"Duck", "Birthday":"May 14", "Sign":"Taurus", "Catchphrase":"nuh uh"},
{"Name":"Hopper", "Personality":"Cranky", "Species":"Penguin", "Birthday":"May 15", "Sign":"Taurus", "Catchphrase":"flexin"},
{"Name":"Bubbles", "Personality":"Peppy", "Species":"Hippo", "Birthday":"May 16", "Sign":"Taurus", "Catchphrase":"roadie"},
{"Name":"Alfonso", "Personality":"Lazy", "Species":"Alligator", "Birthday":"May 17", "Sign":"Taurus", "Catchphrase":"snacky"},
{"Name":"Cyrano", "Personality":"Cranky", "Species":"Anteater", "Birthday":"May 18", "Sign":"Taurus", "Catchphrase":"bud"},
{"Name":"Sheldon", "Personality":"Jock", "Species":"Squirrel", "Birthday":"May 19", "Sign":"Taurus", "Catchphrase":"whiffa"},
{"Name":"Hamphrey", "Personality":"Cranky", "Species":"Hamster", "Birthday":"May 20", "Sign":"Taurus", "Catchphrase":"moocher"},
{"Name":"Antonio", "Personality":"Jock", "Species":"Anteater", "Birthday":"May 21", "Sign":"Gemini", "Catchphrase":"rainbow"},
{"Name":"Dobie", "Personality":"Cranky", "Species":"Wolf", "Birthday":"May 22", "Sign":"Gemini", "Catchphrase":"check it"},
{"Name":"Bam", "Personality":"Jock", "Species":"Deer", "Birthday":"May 23", "Sign":"Gemini", "Catchphrase":"shweetie"},
{"Name":"Renée", "Personality":"Sisterly", "Species":"Rhino", "Birthday":"May 24", "Sign":"Gemini", "Catchphrase":"monch"},
{"Name":"Rasher", "Personality":"Cranky", "Species":"Pig", "Birthday":"May 25", "Sign":"Gemini", "Catchphrase":"derrrrr"},
{"Name":"Clay", "Personality":"Lazy", "Species":"Hamster", "Birthday":"May 26", "Sign":"Gemini", "Catchphrase":"gruff"},
{"Name":"Biff", "Personality":"Jock", "Species":"Hippo", "Birthday":"May 27", "Sign":"Gemini", "Catchphrase":"gronk"},
{"Name":"Deena", "Personality":"Normal", "Species":"Duck", "Birthday":"May 28", "Sign":"Gemini", "Catchphrase":"yo yo yo"},
{"Name":"Frank", "Personality":"Cranky", "Species":"Eagle", "Birthday":"May 29", "Sign":"Gemini", "Catchphrase":"kitten"},
{"Name":"Julia", "Personality":"Snooty", "Species":"Ostrich", "Birthday":"May 30", "Sign":"Gemini", "Catchphrase":"hammie"},
{"Name":"Jay", "Personality":"Jock", "Species":"Bird", "Birthday":"May 31", "Sign":"Gemini", "Catchphrase":"pouches"},
{"Name":"Pecan", "Personality":"Snooty", "Species":"Squirrel", "Birthday":"Jun 1", "Sign":"Gemini", "Catchphrase":"wingo"},
{"Name":"Stu", "Personality":"Lazy", "Species":"Bull", "Birthday":"Jun 2", "Sign":"Gemini", "Catchphrase":"snoooink"},
{"Name":"Blaire", "Personality":"Snooty", "Species":"Squirrel", "Birthday":"Jun 3", "Sign":"Gemini", "Catchphrase":"bucko"},
{"Name":"Shep", "Personality":"Smug", "Species":"Dog", "Birthday":"Jun 4", "Sign":"Gemini", "Catchphrase":"ayup, yup"},
{"Name":"Boyd", "Personality":"Cranky", "Species":"Gorilla", "Birthday":"Jun 5", "Sign":"Gemini", "Catchphrase":"ten-hut"},
{"Name":"Wade", "Personality":"Lazy", "Species":"Penguin", "Birthday":"Jun 6", "Sign":"Gemini", "Catchphrase":"aaach-"},
{"Name":"Mint", "Personality":"Snooty", "Species":"Squirrel", "Birthday":"Jun 7", "Sign":"Gemini", "Catchphrase":"pronk"},
{"Name":"Deirdre", "Personality":"Sisterly", "Species":"Deer", "Birthday":"Jun 8", "Sign":"Gemini", "Catchphrase":"slacker"},
{"Name":"Louie", "Personality":"Jock", "Species":"Gorilla", "Birthday":"Jun 9", "Sign":"Gemini", "Catchphrase":"rockin'"},
{"Name":"Cole", "Personality":"Lazy", "Species":"Rabbit", "Birthday":"Jun 9", "Sign":"Gemini", "Catchphrase":"it'sa me"},
{"Name":"Truffles", "Personality":"Peppy", "Species":"Pig", "Birthday":"Jun 10", "Sign":"Gemini", "Catchphrase":"wuh"},
{"Name":"Mira", "Personality":"Sisterly", "Species":"Rabbit", "Birthday":"Jun 11", "Sign":"Gemini", "Catchphrase":"pudgy"},
{"Name":"Robin", "Personality":"Snooty", "Species":"Bird", "Birthday":"Jun 12", "Sign":"Gemini", "Catchphrase":"eekers"},
{"Name":"Monty", "Personality":"Cranky", "Species":"Monkey", "Birthday":"Jun 13", "Sign":"Gemini", "Catchphrase":"zip zoom"},
{"Name":"Murphy", "Personality":"Cranky", "Species":"Cub", "Birthday":"Jun 14", "Sign":"Gemini", "Catchphrase":"li'l hare"},
{"Name":"Pango", "Personality":"Peppy", "Species":"Anteater", "Birthday":"Jun 15", "Sign":"Gemini", "Catchphrase":"honey"},
{"Name":"Victoria", "Personality":"Peppy", "Species":"Horse", "Birthday":"Jun 16", "Sign":"Gemini", "Catchphrase":"nay"},
{"Name":"Broffina", "Personality":"Snooty", "Species":"Chicken", "Birthday":"Jun 17", "Sign":"Gemini", "Catchphrase":"reeeeOWR"},
{"Name":"Kitt", "Personality":"Normal", "Species":"Kangaroo", "Birthday":"Jun 17", "Sign":"Gemini", "Catchphrase":"punk"},
{"Name":"Olivia", "Personality":"Snooty", "Species":"Cat", "Birthday":"Jun 18", "Sign":"Gemini", "Catchphrase":"arfer"},
{"Name":"Lolly", "Personality":"Normal", "Species":"Cat", "Birthday":"Jun 19", "Sign":"Gemini", "Catchphrase":"nutmeg"},
{"Name":"Tybalt", "Personality":"Jock", "Species":"Tiger", "Birthday":"Jun 20", "Sign":"Gemini", "Catchphrase":"indeed"},
{"Name":"Midge", "Personality":"Normal", "Species":"Bird", "Birthday":"Jun 21", "Sign":"Cancer", "Catchphrase":"sunshine"},
{"Name":"Sally", "Personality":"Normal", "Species":"Squirrel", "Birthday":"Jun 22", "Sign":"Cancer", "Catchphrase":"zut alors"},
{"Name":"Butch", "Personality":"Cranky", "Species":"Dog", "Birthday":"Jun 23", "Sign":"Cancer", "Catchphrase":"ya heard"},
{"Name":"Naomi", "Personality":"Snooty", "Species":"Cow", "Birthday":"Jun 24", "Sign":"Cancer", "Catchphrase":"peach"},
{"Name":"Peggy", "Personality":"Peppy", "Species":"Pig", "Birthday":"Jun 25", "Sign":"Cancer", "Catchphrase":"quacko"},
{"Name":"Sparro", "Personality":"Jock", "Species":"Bird", "Birthday":"Jun 26", "Sign":"Cancer", "Catchphrase":"blurp"},
{"Name":"Curt", "Personality":"Cranky", "Species":"Bear", "Birthday":"Jun 27", "Sign":"Cancer", "Catchphrase":"woowoo"},
{"Name":"Caroline", "Personality":"Normal", "Species":"Squirrel", "Birthday":"Jun 28", "Sign":"Cancer", "Catchphrase":"wut"},
{"Name":"Goose", "Personality":"Jock", "Species":"Chicken", "Birthday":"Jun 29", "Sign":"Cancer", "Catchphrase":"mweee"},
{"Name":"Bunnie", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Jun 30", "Sign":"Cancer", "Catchphrase":"quaa"},
{"Name":"Spike", "Personality":"Cranky", "Species":"Rhino", "Birthday":"Jun 30", "Sign":"Cancer", "Catchphrase":"eat it"},
{"Name":"Bitty", "Personality":"Snooty", "Species":"Hippo", "Birthday":"Jul 1", "Sign":"Cancer", "Catchphrase":"fuzzball"},
{"Name":"Diana", "Personality":"Snooty", "Species":"Deer", "Birthday":"Jul 2", "Sign":"Cancer", "Catchphrase":"sidekick"},
{"Name":"Raddle", "Personality":"Lazy", "Species":"Frog", "Birthday":"Jul 3", "Sign":"Cancer", "Catchphrase":"nutlet"},
{"Name":"Graham", "Personality":"Smug", "Species":"Hamster", "Birthday":"Jul 4", "Sign":"Cancer", "Catchphrase":"pah"},
{"Name":"Samson", "Personality":"Jock", "Species":"Mouse", "Birthday":"Jul 5", "Sign":"Cancer", "Catchphrase":"pipsqueak"},
{"Name":"Derwin", "Personality":"Lazy", "Species":"Duck", "Birthday":"Jul 6", "Sign":"Cancer", "Catchphrase":"cottontail"},
{"Name":"Camofrog", "Personality":"Cranky", "Species":"Frog", "Birthday":"Jul 7", "Sign":"Cancer", "Catchphrase":"cheeseball"},
{"Name":"Chops", "Personality":"Smug", "Species":"Pig", "Birthday":"Jul 8", "Sign":"Cancer", "Catchphrase":"nee-deep"},
{"Name":"Walt", "Personality":"Cranky", "Species":"Kangaroo", "Birthday":"Jul 9", "Sign":"Cancer", "Catchphrase":"krzzt"},
{"Name":"Hazel", "Personality":"Sisterly", "Species":"Squirrel", "Birthday":"Jul 9", "Sign":"Cancer", "Catchphrase":"hopper"},
{"Name":"Cranston", "Personality":"Lazy", "Species":"Ostrich", "Birthday":"Jul 10", "Sign":"Cancer", "Catchphrase":"cagey"},
{"Name":"June", "Personality":"Normal", "Species":"Cub", "Birthday":"Jul 11", "Sign":"Cancer", "Catchphrase":"sugar cube"},
{"Name":"Olaf", "Personality":"Smug", "Species":"Anteater", "Birthday":"Jul 12", "Sign":"Cancer", "Catchphrase":"sweet pea"},
{"Name":"Stinky", "Personality":"Jock", "Species":"Cat", "Birthday":"Jul 13", "Sign":"Cancer", "Catchphrase":"cheepers"},
{"Name":"Kid Cat", "Personality":"Jock", "Species":"Cat", "Birthday":"Jul 15", "Sign":"Cancer", "Catchphrase":"hulaaaa"},
{"Name":"Gloria", "Personality":"Snooty", "Species":"Duck", "Birthday":"Jul 16", "Sign":"Cancer", "Catchphrase":"oh ewe"},
{"Name":"Bella", "Personality":"Peppy", "Species":"Mouse", "Birthday":"Jul 17", "Sign":"Cancer", "Catchphrase":"heeeeeyy"},
{"Name":"Boone", "Personality":"Jock", "Species":"Gorilla", "Birthday":"Jul 18", "Sign":"Cancer", "Catchphrase":"as if"},
{"Name":"Bruce", "Personality":"Cranky", "Species":"Deer", "Birthday":"Jul 19", "Sign":"Cancer", "Catchphrase":"niblet"},
{"Name":"Tia", "Personality":"Normal", "Species":"Elephant", "Birthday":"Jul 20", "Sign":"Cancer", "Catchphrase":"tsk tsk"},
{"Name":"Tex", "Personality":"Smug", "Species":"Penguin", "Birthday":"Jul 21", "Sign":"Cancer", "Catchphrase":"burrup"},
{"Name":"Rocco", "Personality":"Cranky", "Species":"Hippo", "Birthday":"Jul 22", "Sign":"Cancer", "Catchphrase":"aiya"},
{"Name":"Papi", "Personality":"Lazy", "Species":"Horse", "Birthday":"Jul 23", "Sign":"Leo", "Catchphrase":"unh-hunh"},
{"Name":"Merengue", "Personality":"Normal", "Species":"Rhino", "Birthday":"Jul 24", "Sign":"Leo", "Catchphrase":"cool cat"},
{"Name":"Freya", "Personality":"Snooty", "Species":"Wolf", "Birthday":"Jul 24", "Sign":"Leo", "Catchphrase":"amigo"},
{"Name":"Shari", "Personality":"Sisterly", "Species":"Monkey", "Birthday":"Jul 25", "Sign":"Leo", "Catchphrase":"crunch"},
{"Name":"Aurora", "Personality":"Normal", "Species":"Penguin", "Birthday":"Jul 26", "Sign":"Leo", "Catchphrase":"nyoink"},
{"Name":"Raymond", "Personality":"Smug", "Species":"Cat", "Birthday":"Jul 27", "Sign":"Leo", "Catchphrase":"bitty"},
{"Name":"Maggie", "Personality":"Normal", "Species":"Pig", "Birthday":"Jul 27", "Sign":"Leo", "Catchphrase":"chow down"},
{"Name":"Beau", "Personality":"Lazy", "Species":"Deer", "Birthday":"Jul 28", "Sign":"Leo", "Catchphrase":"snoutie"},
{"Name":"Claudia", "Personality":"Snooty", "Species":"Tiger", "Birthday":"Jul 29", "Sign":"Leo", "Catchphrase":"precisely"},
{"Name":"Flurry", "Personality":"Normal", "Species":"Hamster", "Birthday":"Jul 30", "Sign":"Leo", "Catchphrase":"crushy"},
{"Name":"Opal", "Personality":"Snooty", "Species":"Elephant", "Birthday":"Jul 31", "Sign":"Leo", "Catchphrase":"dahling"},
{"Name":"Hippeux", "Personality":"Smug", "Species":"Hippo", "Birthday":"Jul 31", "Sign":"Leo", "Catchphrase":"grrr..."},
{"Name":"Greta", "Personality":"Snooty", "Species":"Mouse", "Birthday":"Aug 1", "Sign":"Leo", "Catchphrase":"psst"},
{"Name":"Apple", "Personality":"Peppy", "Species":"Hamster", "Birthday":"Aug 2", "Sign":"Leo", "Catchphrase":"nyet"},
{"Name":"Leopold", "Personality":"Smug", "Species":"Lion", "Birthday":"Aug 3", "Sign":"Leo", "Catchphrase":"sluuuurp"},
{"Name":"Lucy", "Personality":"Normal", "Species":"Pig", "Birthday":"Aug 3", "Sign":"Leo", "Catchphrase":"alrighty"},
{"Name":"Hugh", "Personality":"Lazy", "Species":"Pig", "Birthday":"Aug 4", "Sign":"Leo", "Catchphrase":"yip yip"},
{"Name":"Kitty", "Personality":"Snooty", "Species":"Cat", "Birthday":"Aug 5", "Sign":"Leo", "Catchphrase":"nutty"},
{"Name":"O'Hare", "Personality":"Smug", "Species":"Rabbit", "Birthday":"Aug 6", "Sign":"Leo", "Catchphrase":"rookie"},
{"Name":"Broccolo", "Personality":"Lazy", "Species":"Mouse", "Birthday":"Aug 7", "Sign":"Leo", "Catchphrase":"munchie"},
{"Name":"Zucker", "Personality":"Lazy", "Species":"Octopus", "Birthday":"Aug 7", "Sign":"Leo", "Catchphrase":"capital"},
{"Name":"Blanche", "Personality":"Snooty", "Species":"Ostrich", "Birthday":"Aug 8", "Sign":"Leo", "Catchphrase":"maaan"},
{"Name":"Drift", "Personality":"Jock", "Species":"Frog", "Birthday":"Aug 9", "Sign":"Leo", "Catchphrase":"tarnation"},
{"Name":"Frita", "Personality":"Sisterly", "Species":"Sheep", "Birthday":"Aug 10", "Sign":"Leo", "Catchphrase":"duuude"},
{"Name":"Miranda", "Personality":"Snooty", "Species":"Duck", "Birthday":"Aug 11", "Sign":"Leo", "Catchphrase":"ribette"},
{"Name":"Pompom", "Personality":"Peppy", "Species":"Duck", "Birthday":"Aug 12", "Sign":"Leo", "Catchphrase":"quacker"},
{"Name":"Benedict", "Personality":"Lazy", "Species":"Chicken", "Birthday":"Aug 13", "Sign":"Leo", "Catchphrase":"me-WOW"},
{"Name":"Rod", "Personality":"Jock", "Species":"Mouse", "Birthday":"Aug 14", "Sign":"Leo", "Catchphrase":"ace"},
{"Name":"Leonardo", "Personality":"Jock", "Species":"Tiger", "Birthday":"Aug 14", "Sign":"Leo", "Catchphrase":"lion cub"},
{"Name":"Erik", "Personality":"Lazy", "Species":"Deer", "Birthday":"Aug 15", "Sign":"Leo", "Catchphrase":"lambkins"},
{"Name":"Dotty", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Aug 16", "Sign":"Leo", "Catchphrase":"yawwwn"},
{"Name":"Chadder", "Personality":"Smug", "Species":"Mouse", "Birthday":"Aug 17", "Sign":"Leo", "Catchphrase":"GAHHHH"},
{"Name":"Roscoe", "Personality":"Cranky", "Species":"Horse", "Birthday":"Aug 18", "Sign":"Leo", "Catchphrase":"hippie"},
{"Name":"Jitters", "Personality":"Jock", "Species":"Bird", "Birthday":"Aug 19", "Sign":"Leo", "Catchphrase":"guvnor"},
{"Name":"Puck", "Personality":"Lazy", "Species":"Penguin", "Birthday":"Aug 19", "Sign":"Leo", "Catchphrase":"grrRAH"},
{"Name":"Marshal", "Personality":"Smug", "Species":"Squirrel", "Birthday":"Aug 20", "Sign":"Leo", "Catchphrase":"buckaroo"},
{"Name":"Cesar", "Personality":"Cranky", "Species":"Gorilla", "Birthday":"Aug 21", "Sign":"Leo", "Catchphrase":"grr-ribbit"},
{"Name":"Canberra", "Personality":"Sisterly", "Species":"Koala", "Birthday":"Aug 22", "Sign":"Leo", "Catchphrase":"grrrolf"},
{"Name":"Peck", "Personality":"Jock", "Species":"Bird", "Birthday":"Aug 23", "Sign":"Virgo", "Catchphrase":"po po"},
{"Name":"Teddy", "Personality":"Jock", "Species":"Bear", "Birthday":"Aug 24", "Sign":"Virgo", "Catchphrase":"kid"},
{"Name":"Buzz", "Personality":"Cranky", "Species":"Eagle", "Birthday":"Aug 24", "Sign":"Virgo", "Catchphrase":"snifffff"},
{"Name":"Claude", "Personality":"Lazy", "Species":"Rabbit", "Birthday":"Aug 24", "Sign":"Virgo", "Catchphrase":"chuuuuurp"},
{"Name":"Axel", "Personality":"Jock", "Species":"Elephant", "Birthday":"Aug 25", "Sign":"Virgo", "Catchphrase":"pushy"},
{"Name":"Gwen", "Personality":"Snooty", "Species":"Penguin", "Birthday":"Aug 26", "Sign":"Virgo", "Catchphrase":"mango"},
{"Name":"Fauna", "Personality":"Normal", "Species":"Deer", "Birthday":"Aug 27", "Sign":"Virgo", "Catchphrase":"growf"},
{"Name":"Poncho", "Personality":"Jock", "Species":"Cub", "Birthday":"Aug 28", "Sign":"Virgo", "Catchphrase":"sparkles"},
{"Name":"Hans", "Personality":"Smug", "Species":"Gorilla", "Birthday":"Aug 29", "Sign":"Virgo", "Catchphrase":"bleh eh eh"},
{"Name":"Freckles", "Personality":"Peppy", "Species":"Duck", "Birthday":"Aug 30", "Sign":"Virgo", "Catchphrase":"uni-wow"},
{"Name":"Lopez", "Personality":"Smug", "Species":"Deer", "Birthday":"Aug 31", "Sign":"Virgo", "Catchphrase":"Foxtrot"},
{"Name":"Diva", "Personality":"Sisterly", "Species":"Frog", "Birthday":"Sep 1", "Sign":"Virgo", "Catchphrase":"sweetie"},
{"Name":"Mac", "Personality":"Jock", "Species":"Dog", "Birthday":"Sep 2", "Sign":"Virgo", "Catchphrase":"cha"},
{"Name":"T-Bone", "Personality":"Cranky", "Species":"Bull", "Birthday":"Sep 3", "Sign":"Virgo", "Catchphrase":"schep"},
{"Name":"Willow", "Personality":"Snooty", "Species":"Sheep", "Birthday":"Sep 3", "Sign":"Virgo", "Catchphrase":"snork"},
{"Name":"Kiki", "Personality":"Normal", "Species":"Cat", "Birthday":"Sep 4", "Sign":"Virgo", "Catchphrase":"WHEE"},
{"Name":"Tucker", "Personality":"Lazy", "Species":"Elephant", "Birthday":"Sep 5", "Sign":"Virgo", "Catchphrase":"yelp"},
{"Name":"Velma", "Personality":"Snooty", "Species":"Goat", "Birthday":"Sep 6", "Sign":"Virgo", "Catchphrase":"highness"},
{"Name":"Cobb", "Personality":"Jock", "Species":"Pig", "Birthday":"Sep 7", "Sign":"Virgo", "Catchphrase":"fuzzers"},
{"Name":"Frobert", "Personality":"Jock", "Species":"Frog", "Birthday":"Sep 8", "Sign":"Virgo", "Catchphrase":"my pet"},
{"Name":"Becky", "Personality":"Snooty", "Species":"Chicken", "Birthday":"Sep 9", "Sign":"Virgo", "Catchphrase":"wah"},
{"Name":"Prince", "Personality":"Lazy", "Species":"Frog", "Birthday":"Sep 10", "Sign":"Virgo", "Catchphrase":"chipmunk"},
{"Name":"Sherb", "Personality":"Lazy", "Species":"Goat", "Birthday":"Sep 11", "Sign":"Virgo", "Catchphrase":"li'l dude"},
{"Name":"Ozzie", "Personality":"Lazy", "Species":"Koala", "Birthday":"Sep 12", "Sign":"Virgo", "Catchphrase":"baboom"},
{"Name":"Marina", "Personality":"Normal", "Species":"Octopus", "Birthday":"Sep 13", "Sign":"Virgo", "Catchphrase":"shorty"},
{"Name":"Marcie", "Personality":"Normal", "Species":"Kangaroo]]", "Birthday":"Sep 14", "Sign":"Virgo", "Catchphrase":"nutcase"},
{"Name":"Rowan", "Personality":"Jock", "Species":"Tiger", "Birthday":"Sep 16", "Sign":"Virgo", "Catchphrase":"greenhorn"},
{"Name":"Pashmina", "Personality":"Sisterly", "Species":"Goat", "Birthday":"Sep 17", "Sign":"Virgo", "Catchphrase":"snappy"},
{"Name":"Chester", "Personality":"Lazy", "Species":"Cub", "Birthday":"Sep 18", "Sign":"Virgo", "Catchphrase":"hipster"},
{"Name":"Biskit", "Personality":"Lazy", "Species":"Dog", "Birthday":"Sep 19", "Sign":"Virgo", "Catchphrase":"precious"},
{"Name":"Annalisa", "Personality":"Normal", "Species":"Anteater", "Birthday":"Sep 20", "Sign":"Virgo", "Catchphrase":"hoof hoo"},
{"Name":"Elmer", "Personality":"Lazy", "Species":"Horse", "Birthday":"Sep 20", "Sign":"Virgo", "Catchphrase":"sucker"},
{"Name":"Filbert", "Personality":"Lazy", "Species":"Squirrel", "Birthday":"Sep 21", "Sign":"Virgo", "Catchphrase":"snoozit"},
{"Name":"Pierce", "Personality":"Jock", "Species":"Eagle", "Birthday":"Sep 22", "Sign":"Virgo", "Catchphrase":"me meow"},
{"Name":"Tiffany", "Personality":"Snooty", "Species":"Rabbit", "Birthday":"Sep 23", "Sign":"Libra", "Catchphrase":"sweatband"},
{"Name":"Judy", "Personality":"Snooty", "Species":"Cub", "Birthday":"Sep 24", "Sign":"Libra", "Catchphrase":"cheekers"},
{"Name":"Sly", "Personality":"Jock", "Species":"Alligator", "Birthday":"Sep 25", "Sign":"Libra", "Catchphrase":"mew"},
{"Name":"Anicotti", "Personality":"Peppy", "Species":"Mouse", "Birthday":"Sep 26", "Sign":"Libra", "Catchphrase":"grooof"},
{"Name":"Static", "Personality":"Cranky", "Species":"Squirrel", "Birthday":"Sep 27", "Sign":"Libra", "Catchphrase":"whiskers"},
{"Name":"Moose", "Personality":"Jock", "Species":"Mouse", "Birthday":"Sep 28", "Sign":"Libra", "Catchphrase":"grah-grah"},
{"Name":"Skye", "Personality":"Normal", "Species":"Wolf", "Birthday":"Sep 29", "Sign":"Libra", "Catchphrase":"sulky"},
{"Name":"Celia", "Personality":"Normal", "Species":"Eagle", "Birthday":"Sep 30", "Sign":"Libra", "Catchphrase":"pffffft"},
{"Name":"Al", "Personality":"Lazy", "Species":"Gorilla", "Birthday":"Oct 1", "Sign":"Libra", "Catchphrase":"uh-oh"},
{"Name":"Tasha", "Personality":"Snooty", "Species":"Squirrel", "Birthday":"Oct 1", "Sign":"Libra", "Catchphrase":"crisp"},
{"Name":"Bea", "Personality":"Normal", "Species":"Dog", "Birthday":"Oct 2", "Sign":"Libra", "Catchphrase":"ya know"},
{"Name":"Agnes", "Personality":"Sisterly", "Species":"Pig", "Birthday":"Oct 3", "Sign":"Libra", "Catchphrase":"villain"},
{"Name":"Candi", "Personality":"Peppy", "Species":"Mouse", "Birthday":"Oct 4", "Sign":"Libra", "Catchphrase":"buh-kay"},
{"Name":"Baabara", "Personality":"Snooty", "Species":"Sheep", "Birthday":"Oct 5", "Sign":"Libra", "Catchphrase":"tenderfoot"},
{"Name":"Croque", "Personality":"Cranky", "Species":"Frog", "Birthday":"Oct 6", "Sign":"Libra", "Catchphrase":"my dear"},
{"Name":"Kyle", "Personality":"Smug", "Species":"Wolf", "Birthday":"Oct 6", "Sign":"Libra", "Catchphrase":"picante"},
{"Name":"Cube", "Personality":"Lazy", "Species":"Penguin", "Birthday":"Oct 7", "Sign":"Libra", "Catchphrase":"hot dog"},
{"Name":"Drago", "Personality":"Lazy", "Species":"Alligator", "Birthday":"Oct 8", "Sign":"Libra", "Catchphrase":"kitty cat"},
{"Name":"Bud", "Personality":"Jock", "Species":"Lion", "Birthday":"Oct 9", "Sign":"Libra", "Catchphrase":"brah"},
{"Name":"Genji", "Personality":"Jock", "Species":"Rabbit", "Birthday":"Oct 10", "Sign":"Libra", "Catchphrase":"uh-hoo"},
{"Name":"Jacques", "Personality":"Smug", "Species":"Bird", "Birthday":"Oct 11", "Sign":"Libra", "Catchphrase":"child"},
{"Name":"Lucky", "Personality":"Lazy", "Species":"Dog", "Birthday":"Oct 12", "Sign":"Libra", "Catchphrase":"chicky-poo"},
{"Name":"Phoebe", "Personality":"Sisterly", "Species":"Ostrich", "Birthday":"Oct 12", "Sign":"Libra", "Catchphrase":"chips"},
{"Name":"Winnie", "Personality":"Peppy", "Species":"Horse", "Birthday":"Oct 13", "Sign":"Libra", "Catchphrase":"mate"},
{"Name":"Lobo", "Personality":"Cranky", "Species":"Wolf", "Birthday":"Oct 13", "Sign":"Libra", "Catchphrase":"zoink"},
{"Name":"Hopkins", "Personality":"Lazy", "Species":"Rabbit", "Birthday":"Oct 14", "Sign":"Libra", "Catchphrase":"doodle-duh"},
{"Name":"Chow", "Personality":"Cranky", "Species":"Bear", "Birthday":"Oct 15", "Sign":"Libra", "Catchphrase":"bingo"},
{"Name":"Chief", "Personality":"Cranky", "Species":"Wolf", "Birthday":"Oct 15", "Sign":"Libra", "Catchphrase":"natch"},
{"Name":"Jeremiah", "Personality":"Lazy", "Species":"Frog", "Birthday":"Oct 16", "Sign":"Libra", "Catchphrase":"brrmph"},
{"Name":"Ed", "Personality":"Smug", "Species":"Horse", "Birthday":"Oct 17", "Sign":"Libra", "Catchphrase":"squinky"},
{"Name":"Roald", "Personality":"Jock", "Species":"Penguin", "Birthday":"Oct 18", "Sign":"Libra", "Catchphrase":"Ayyeeee"},
{"Name":"Cashmere", "Personality":"Snooty", "Species":"Sheep", "Birthday":"Oct 19", "Sign":"Libra", "Catchphrase":"thump"},
{"Name":"Bree", "Personality":"Snooty", "Species":"Mouse", "Birthday":"Oct 20", "Sign":"Libra", "Catchphrase":"honk"},
{"Name":"Angus", "Personality":"Cranky", "Species":"Bull", "Birthday":"Oct 21", "Sign":"Libra", "Catchphrase":"speedy"},
{"Name":"Wart Jr.", "Personality":"Cranky", "Species":"Frog", "Birthday":"Oct 21", "Sign":"Libra", "Catchphrase":"pine nut"},
{"Name":"Merry", "Personality":"Peppy", "Species":"Cat", "Birthday":"Oct 22", "Sign":"Libra", "Catchphrase":"hubbub"},
{"Name":"Harry", "Personality":"Cranky", "Species":"Hippo", "Birthday":"Oct 23", "Sign":"Scorpio", "Catchphrase":"grumble"},
{"Name":"Cyd", "Personality":"Cranky", "Species":"Elephant", "Birthday":"Oct 24", "Sign":"Scorpio", "Catchphrase":"cluckadoo"},
{"Name":"Molly", "Personality":"Normal", "Species":"Duck", "Birthday":"Oct 25", "Sign":"Scorpio", "Catchphrase":"ruffian"},
{"Name":"Fang", "Personality":"Cranky", "Species":"Wolf", "Birthday":"Oct 26", "Sign":"Scorpio", "Catchphrase":"yeah buddy"},
{"Name":"Nate", "Personality":"Lazy", "Species":"Bear", "Birthday":"Oct 27", "Sign":"Scorpio", "Catchphrase":"croak-kay"},
{"Name":"Mathilda", "Personality":"Snooty", "Species":"Kangaroo", "Birthday":"Oct 28", "Sign":"Scorpio", "Catchphrase":"mon chou"},
{"Name":"Chrissy", "Personality":"Peppy", "Species":"Rabbit", "Birthday":"Oct 29", "Sign":"Scorpio", "Catchphrase":"chaps"},
{"Name":"Stella", "Personality":"Normal", "Species":"Sheep", "Birthday":"Oct 30", "Sign":"Scorpio", "Catchphrase":"so it goes"},
{"Name":"Violet", "Personality":"Snooty", "Species":"Gorilla", "Birthday":"Nov 1", "Sign":"Scorpio", "Catchphrase":"ROOOOOWF"},
{"Name":"Penelope", "Personality":"Peppy", "Species":"Mouse", "Birthday":"Nov 2", "Sign":"Scorpio", "Catchphrase":"waddler"},
{"Name":"Sandy", "Personality":"Normal", "Species":"Ostrich", "Birthday":"Nov 3", "Sign":"Scorpio", "Catchphrase":"bunyip"},
{"Name":"Gala", "Personality":"Normal", "Species":"Pig", "Birthday":"Nov 4", "Sign":"Scorpio", "Catchphrase":"rrr-owch"},
{"Name":"Gonzo", "Personality":"Cranky", "Species":"Koala", "Birthday":"Nov 5", "Sign":"Scorpio", "Catchphrase":"ah-rooooo"},
{"Name":"Rooney", "Personality":"Cranky", "Species":"Kangaroo", "Birthday":"Nov 6", "Sign":"Scorpio", "Catchphrase":"schnort"},
{"Name":"Elise", "Personality":"Snooty", "Species":"Monkey", "Birthday":"Nov 7", "Sign":"Scorpio", "Catchphrase":"boosh"},
{"Name":"Avery", "Personality":"Cranky", "Species":"Eagle", "Birthday":"Nov 8", "Sign":"Scorpio", "Catchphrase":"graaagh"},
{"Name":"Ava", "Personality":"Normal", "Species":"Chicken", "Birthday":"Nov 9", "Sign":"Scorpio", "Catchphrase":"snooooof"},
{"Name":"Audie", "Personality":"Peppy", "Species":"Wolf", "Birthday":"Nov 10", "Sign":"Scorpio", "Catchphrase":"le ham"},
{"Name":"Deli", "Personality":"Lazy", "Species":"Monkey", "Birthday":"Nov 11", "Sign":"Scorpio", "Catchphrase":"woo woof"},
{"Name":"Henry", "Personality":"Smug", "Species":"Frog", "Birthday":"Nov 12", "Sign":"Scorpio", "Catchphrase":"wee baby"},
{"Name":"Eloise", "Personality":"Snooty", "Species":"Elephant", "Birthday":"Nov 13", "Sign":"Scorpio", "Catchphrase":"chicken"},
{"Name":"Lily", "Personality":"Normal", "Species":"Frog", "Birthday":"Nov 14", "Sign":"Scorpio", "Catchphrase":"sooey"},
{"Name":"Tabby", "Personality":"Peppy", "Species":"Cat", "Birthday":"Nov 15", "Sign":"Scorpio", "Catchphrase":"twinkles"},
{"Name":"Bettina", "Personality":"Normal", "Species":"Mouse", "Birthday":"Nov 15", "Sign":"Scorpio", "Catchphrase":"hoo-rah"},
{"Name":"Charlise", "Personality":"Sisterly", "Species":"Bear", "Birthday":"Nov 16", "Sign":"Scorpio", "Catchphrase":"bow-WOW"},
{"Name":"Scoot", "Personality":"Jock", "Species":"Duck", "Birthday":"Nov 17", "Sign":"Scorpio", "Catchphrase":"quackpth"},
{"Name":"Megan", "Personality":"Normal", "Species":"Bear", "Birthday":"Nov 18", "Sign":"Scorpio", "Catchphrase":"teacup"},
{"Name":"Amelia", "Personality":"Snooty", "Species":"Eagle", "Birthday":"Nov 19", "Sign":"Scorpio", "Catchphrase":"cuz"},
{"Name":"Simon", "Personality":"Lazy", "Species":"Monkey", "Birthday":"Nov 20", "Sign":"Scorpio", "Catchphrase":"like whoa"},
{"Name":"Octavian", "Personality":"Cranky", "Species":"Octopus", "Birthday":"Nov 21", "Sign":"Scorpio", "Catchphrase":"rerack"},
{"Name":"Billy", "Personality":"Jock", "Species":"Goat", "Birthday":"Nov 22", "Sign":"Sagittarius", "Catchphrase":"ooh la la"},
{"Name":"Cleo", "Personality":"Snooty", "Species":"Horse", "Birthday":"Nov 23", "Sign":"Sagittarius", "Catchphrase":"cluckling"},
{"Name":"Nibbles", "Personality":"Peppy", "Species":"Squirrel", "Birthday":"Nov 24", "Sign":"Sagittarius", "Catchphrase":"baaa man"},
{"Name":"Melba", "Personality":"Normal", "Species":"Koala", "Birthday":"Nov 25", "Sign":"Sagittarius", "Catchphrase":"snarrrl"},
{"Name":"Puddles", "Personality":"Peppy", "Species":"Frog", "Birthday":"Nov 26", "Sign":"Sagittarius", "Catchphrase":"bo peep"},
{"Name":"Bangle", "Personality":"Peppy", "Species":"Tiger", "Birthday":"Nov 27", "Sign":"Sagittarius", "Catchphrase":"hurk"},
{"Name":"Admiral", "Personality":"Cranky", "Species":"Bird", "Birthday":"Nov 28", "Sign":"Sagittarius", "Catchphrase":"neighbor"},
{"Name":"Buck", "Personality":"Jock", "Species":"Horse", "Birthday":"Nov 29", "Sign":"Sagittarius", "Catchphrase":"meooo-OH"},
{"Name":"Gruff", "Personality":"Cranky", "Species":"Goat", "Birthday":"Nov 30", "Sign":"Sagittarius", "Catchphrase":"nice nice"},
{"Name":"Carrie", "Personality":"Normal", "Species":"Kangaroo", "Birthday":"Dec 1", "Sign":"Sagittarius", "Catchphrase":"punches"},
{"Name":"Rizzo", "Personality":"Cranky", "Species":"Mouse", "Birthday":"Dec 1", "Sign":"Sagittarius", "Catchphrase":"zort"},
{"Name":"Cousteau", "Personality":"Jock", "Species":"Frog", "Birthday":"Dec 2", "Sign":"Sagittarius", "Catchphrase":"nipper"},
{"Name":"Pietro", "Personality":"Smug", "Species":"Sheep", "Birthday":"Dec 3", "Sign":"Sagittarius", "Catchphrase":"hopalong"},
{"Name":"Apollo", "Personality":"Cranky", "Species":"Eagle", "Birthday":"Dec 4", "Sign":"Sagittarius", "Catchphrase":"la-di-da"},
{"Name":"Jacob", "Personality":"Lazy", "Species":"Bird", "Birthday":"Dec 5", "Sign":"Sagittarius", "Catchphrase":"little one"},
{"Name":"Cally", "Personality":"Normal", "Species":"Squirrel", "Birthday":"Dec 5", "Sign":"Sagittarius", "Catchphrase":"groovy"},
{"Name":"Wolfgang", "Personality":"Cranky", "Species":"Wolf", "Birthday":"Dec 6", "Sign":"Sagittarius", "Catchphrase":"alpha"},
{"Name":"Rocket", "Personality":"Sisterly", "Species":"Gorilla", "Birthday":"Dec 7", "Sign":"Sagittarius", "Catchphrase":"captain"},
{"Name":"Peaches", "Personality":"Normal", "Species":"Horse", "Birthday":"Dec 7", "Sign":"Sagittarius", "Catchphrase":"g'tang"},
{"Name":"Maelle", "Personality":"Snooty", "Species":"Duck", "Birthday":"Dec 8", "Sign":"Sagittarius", "Catchphrase":"tooooot"},
{"Name":"Chai", "Personality":"Peppy", "Species":"Elephant", "Birthday":"Dec 9", "Sign":"Sagittarius", "Catchphrase":"chicklet"},
{"Name":"Annalise", "Personality":"Snooty", "Species":"Horse", "Birthday":"Dec 10", "Sign":"Sagittarius", "Catchphrase":"me-YOWZA"},
{"Name":"Rex", "Personality":"Lazy", "Species":"Lion", "Birthday":"Dec 11", "Sign":"Sagittarius", "Catchphrase":"skraaaaw"},
{"Name":"Poppy", "Personality":"Normal", "Species":"Squirrel", "Birthday":"Dec 12", "Sign":"Sagittarius", "Catchphrase":"cacaw"},
{"Name":"Fuchsia", "Personality":"Sisterly", "Species":"Deer", "Birthday":"Dec 13", "Sign":"Sagittarius", "Catchphrase":"glimmer"},
{"Name":"Kidd", "Personality":"Smug", "Species":"Goat", "Birthday":"Dec 14", "Sign":"Sagittarius", "Catchphrase":"uff da"},
{"Name":"Bianca", "Personality":"Peppy", "Species":"Tiger", "Birthday":"Dec 15", "Sign":"Sagittarius", "Catchphrase":"fromage"},
{"Name":"Pekoe", "Personality":"Normal", "Species":"Cub", "Birthday":"Dec 16", "Sign":"Sagittarius", "Catchphrase":"honeybun"},
{"Name":"Yuka", "Personality":"Snooty", "Species":"Koala", "Birthday":"Dec 17", "Sign":"Sagittarius", "Catchphrase":"oui oui"},
{"Name":"Alice", "Personality":"Normal", "Species":"Koala", "Birthday":"Dec 18", "Sign":"Sagittarius", "Catchphrase":"cha-chomp"},
{"Name":"Lyman", "Personality":"Jock", "Species":"Koala", "Birthday":"Dec 19", "Sign":"Sagittarius", "Catchphrase":"harrumph"},
{"Name":"Dora", "Personality":"Normal", "Species":"Mouse", "Birthday":"Dec 20", "Sign":"Sagittarius", "Catchphrase":"mush"},
{"Name":"Margie", "Personality":"Normal", "Species":"Elephant", "Birthday":"Dec 21", "Sign":"Sagittarius", "Catchphrase":"quite so"},
{"Name":"Peanut", "Personality":"Peppy", "Species":"Squirrel", "Birthday":"Dec 22", "Sign":"Capricorn", "Catchphrase":"ridukulous"},
{"Name":"Sylvana", "Personality":"Normal", "Species":"Squirrel", "Birthday":"Dec 23", "Sign":"Capricorn", "Catchphrase":"no doubt"},
{"Name":"Maple", "Personality":"Normal", "Species":"Cub", "Birthday":"Dec 25", "Sign":"Capricorn", "Catchphrase":"li'l ears"},
{"Name":"Zell", "Personality":"Smug", "Species":"Deer", "Birthday":"Dec 26", "Sign":"Capricorn", "Catchphrase":"kidders"},
{"Name":"Beardo", "Personality":"Smug", "Species":"Bear", "Birthday":"Dec 27", "Sign":"Capricorn", "Catchphrase":"woof"},
{"Name":"Barold", "Personality":"Lazy", "Species":"Cub", "Birthday":"Dec 28", "Sign":"Capricorn", "Catchphrase":"eeks"},
{"Name":"Hamlet", "Personality":"Jock", "Species":"Hamster", "Birthday":"Dec 29", "Sign":"Capricorn", "Catchphrase":"cud"},
{"Name":"Clyde", "Personality":"Lazy", "Species":"Horse", "Birthday":"Dec 29", "Sign":"Capricorn", "Catchphrase":"laddie"},
{"Name":"Timbra", "Personality":"Snooty", "Species":"Sheep", "Birthday":"Dec 30", "Sign":"Capricorn", "Catchphrase":"snortle"},
{"Name":"Spork/Crackle", "Personality":"Lazy", "Species":"Pig", "Birthday":"Dec 31", "Sign":"Capricorn", "Catchphrase":"non"}];