let d = 0;
let paused = false;

function rand(list) {
    return list[Math.floor(Math.random()*list.length)];
}

function getSeed() {
    return window.location.search;
}

function randRange(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randYear() {
    return randRange(1800, 2010);
}

function blurb(person) {
    return `${person.name} was a ${person.profession} who lived in ${person.place} in the year ${person.year}`;
}

function generatePerson() {
    const place = rand(PLACES);
    const person = {
        name: rand(NAMES),
        profession: rand(PROFESSIONS),
        place: `${place.name}, ${place.country}`,
        year: randYear(),
    };
    person.blurb = blurb(person);
    return person;
}

function getOptStyle(i, total) {
    const r = 150;
    const w = 100;
    const h = 100;
    const y = window.innerHeight/2 + Math.sin(d*0.005 + 2*Math.PI*i/total) * r - h/2;
    const x = window.innerWidth/2 + Math.cos(d*0.005 + 2*Math.PI*i/total) * r - w/2;
    return `top: ${y}px; left: ${x}px; width: ${w}px; height: ${h}px;`;
}

const getOptId = i => `opt-${i}`;

function init(el) {
    Math.seedrandom(getSeed());
    const amt = 5;
    const people = [];

    // setup
    for (let i = 0; i < amt; i++) people.push(generatePerson());

    const options = [];
    people.forEach((person, i) => {
        options.push(
            `<div class="option" id="${getOptId(i)}"><span>${person.blurb}</span></div>`
        );
    });
    el.innerHTML = options.join('');
    
    options.forEach((_, i) => {
        const opt = document.querySelector('#' + getOptId(i));
        opt.addEventListener('mouseenter', () => paused = true);
        opt.addEventListener('mouseleave', () => paused = false);
    });

    // game loop
    function loop() {
        options.forEach((_, i) => {
            document.querySelector('#' + getOptId(i)).style = getOptStyle(i, people.length);
        });
        if (!paused) d++;
        requestAnimationFrame(loop);
    }
    loop();
}

init(document.querySelector('#app'));