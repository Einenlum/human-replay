import './style.css'
import '@fontsource/coming-soon';
import '@fontsource/staatliches';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);


window.onload = function() {
    const text = document.getElementById('text');
    const previewButton = document.getElementById('preview-button');
    const generateButton = document.getElementById('generate');
    const resetButton = document.getElementById('reset');

    let values = [];
    let start = null;

    const setValues = (newValues) => {
        values = newValues;
        if (values.length > 0) {
            generateButton.classList.remove('hidden');
        } else {
            generateButton.classList.add('hidden');
        }
    };

    text.addEventListener('input', () => {
        if (!start) {
            start = new Date();
        }

        setValues([
            ...values,
            {
                value: text.value,
                time: new Date() - start,
            },
        ])
        previewButton.classList.remove('hidden');
    });

    const reproduceText = (element) => {
        element.textContent = '';
        const printingStart = new Date();

        setInterval(() => {
            const timePassed = new Date() - printingStart;

            const value = values.filter((value) => value.time < timePassed).pop();

            if (value) {
                element.textContent = value.value;
            }
        }, 50);
    };

    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const preview = document.getElementById('preview');
        preview.classList.remove('invisible');
        reproduceText(preview);
    });

    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('preview').textContent = '';
        setValues([]);
        start = null;
        text.value = '';
    });

    const generateCode = () => {
        return `
const reproduceText = (element, values) => {
    const printingStart = new Date();

    setInterval(() => {
        const timePassed = new Date() - printingStart;

        const value = values.filter((value) => value.time < timePassed).pop();

        if (value) {
            element.textContent = value.value;
        }
    }, 50);
};

const values = ${JSON.stringify(values)};
reproduceText(myElement, values);
`
    };

    generateButton.addEventListener('click', (event) => {
        event.preventDefault();

        const code = document.getElementById('code');
        code.textContent = generateCode();
        hljs.highlightAll();
    });

    document.getElementById('copy').addEventListener('click', (event) => {
        event.preventDefault();
        const code = document.getElementById('code');
        navigator.clipboard.writeText(code.textContent);
    });

    const setHumanIsTheNewBlack = (element, values) => {
        const printingStart = new Date();

        setInterval(() => {
            const timePassed = new Date() - printingStart;

            const value = values.filter((value) => value.time < timePassed).pop();

            if (value) {
                element.textContent = value.value;
            }
        }, 50);
    };

    const humanIsTheNewBlackValues = [{ "value": "H", "time": 0 }, { "value": "Hu", "time": 183 }, { "value": "Hum", "time": 286 }, { "value": "Huma", "time": 376 }, { "value": "Human", "time": 516 }, { "value": "Human ", "time": 669 }, { "value": "Human i", "time": 1016 }, { "value": "Human is", "time": 1371 }, { "value": "Human i", "time": 1703 }, { "value": "Human is", "time": 2087 }, { "value": "Human is ", "time": 2262 }, { "value": "Human is t", "time": 2359 }, { "value": "Human is th", "time": 2422 }, { "value": "Human is the", "time": 2472 }, { "value": "Human is the ", "time": 2562 }, { "value": "Human is the n", "time": 3025 }, { "value": "Human is the ne", "time": 3107 }, { "value": "Human is the new", "time": 3203 }, { "value": "Human is the new ", "time": 3295 }, { "value": "Human is the new b", "time": 3652 }, { "value": "Human is the new bl", "time": 3886 }, { "value": "Human is the new bla", "time": 3961 }, { "value": "Human is the new blac", "time": 4059 }, { "value": "Human is the new black", "time": 4213 }, { "value": "Human is the new black.", "time": 4280 }];

    setHumanIsTheNewBlack(document.getElementById('human-is-the-new-black'), humanIsTheNewBlackValues);
};
