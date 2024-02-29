import './style.css'
import '@fontsource/coming-soon';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

window.onload = function() {
    const text = document.getElementById('text');

    let values = [];
    let start = null;

    text.addEventListener('input', () => {
        if (!start) {
            start = new Date();
        }

        values.push({
            value: text.value,
            time: new Date() - start,
        });
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

        const results = document.getElementById('results');
        reproduceText(results);
    });

    document.getElementById('reset').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('results').textContent = '';
        values = [];
        start = null;
        text.value = '';
    });

    const generateCode = () => {
        return `
const reproduceText = (element) => {
    const values = ${JSON.stringify(values)};
    const printingStart = new Date();

    setInterval(() => {
        const timePassed = new Date() - printingStart;

        const value = values.filter((value) => value.time < timePassed).pop();

        if (value) {
            element.textContent = value.value;
        }
    }, 50);
};
`
    };

    document.getElementById('generate').addEventListener('click', (event) => {
        event.preventDefault();

        const copyText = document.getElementById('copy');
        copyText.classList.remove('hidden');
        const code = document.getElementById('code');
        code.textContent = generateCode();
        hljs.highlightAll();
    });

    document.getElementById('copy').addEventListener('click', (event) => {
        event.preventDefault();
        const code = document.getElementById('code');
        navigator.clipboard.writeText(code.textContent);
    });
};
