let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = 'cb5e9b93-481f-45c5-97b6-7de8ab963654'
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');



searchBtn.addEventListener('click', function (e) {
    e.preventDefault();

    //clear old data
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    //Get input data
    let word = input.value;

    //call API
    if (word === '') {
        alert('Word is required');
        return;
    }
    getData(word);
})


async function getData(word) {

    loading.style.display = 'block';
    //API call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`)

    const data = await response.json();
    console.log(data);
    
    //if empty result
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = ' No result found';
        return;
    }

    //if result is suggestions
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?'
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggetion = document.createElement('span')
            suggetion.classList.add('suggested');
            suggetion.innerText = element;
            notFound.appendChild(suggetion);
        })
        return;
    }

    //Result found
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defBox.innerText = defination;

    //sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        rendersound(soundName);
    }
    console.log(data);
}

function rendersound(soundName) {
    // https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundsrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundsrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}