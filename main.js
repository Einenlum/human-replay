import './style.css'
import '@fontsource/coming-soon';
import '@fontsource/staatliches';
import '@fontsource/licorice';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/nord.css';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);


window.onload = function() {
    const text = document.getElementById('text');
    const previewButton = document.getElementById('preview-button');
    const replayButton = document.getElementById('replay-button');
    const generateButton = document.getElementById('generate');
    const resetButton = document.getElementById('reset');
    const codeWrapper = document.getElementById('code-wrapper');
    const code = document.getElementById('code');
    const copyCodeButton = document.getElementById('copy-code');
    const preview = document.getElementById('preview');
    const humanIsTheNewBlack = document.getElementById('human-is-the-new-black');
    let interval = null;

    let values = [];
    let start = null;

    const setValues = (newValues) => {
        values = newValues;
        if (values.length > 0) {
            generateButton.classList.remove('hidden');
            resetButton.classList.remove('hidden');
            previewButton.classList.remove('hidden');
        } else {
            generateButton.classList.add('hidden');
            resetButton.classList.add('hidden');
            previewButton.classList.add('hidden');
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
    });

    const compressData = (values) => {
        const toCompressedItem = (lastValue, item) => {
            if (lastValue.length === item.value.length) {
                return null;
            }

            if (lastValue === item.value.slice(0, -1)) {
                return { op: 'a', v: item.value.slice(-1), t: item.time };
            }

            if (lastValue.length - 1 === item.value.length && lastValue.slice(0, -1) === item.value) {
                return { op: 'd', t: item.time };
            }

            return { op: 'r', v: item.value, t: item.time };
        }

        const compressed = [];
        let lastValue = '';

        for (let i = 0; i < values.length; i++) {
            let item = values[i];
            let compressedItem = toCompressedItem(lastValue, item);

            if (compressedItem) {
                compressed.push(compressedItem);
                lastValue = item.value;
            }
        }

        return compressed;
    };

    window.replayCompressedText = (element, values) => {
        element.textContent = '';
        const printingStart = new Date();

        let localInterval = setInterval(() => {
            const timePassed = new Date() - printingStart;

            const value = values.shift();

            if (!value) {
                clearInterval(localInterval);

                return;
            }

            if (value.t > timePassed) {
                values.unshift(value);

                return;
            }

            if (value.op === 'a') {
                element.textContent = element.textContent + value.v;

                return;
            }

            if (value.op === 'd') {
                element.textContent = element.textContent.slice(0, -1);

                return;
            }

            element.textContent = value.v;
        }, 20);

        return localInterval;
    }

    previewButton.addEventListener('click', (e) => {
        e.preventDefault();

        previewButton.classList.add('hidden');
        replayButton.classList.remove('hidden');
        preview.classList.remove('hidden');
        text.setAttribute('disabled', 'disabled');

        const compressedData = compressData(values);
        interval = replayCompressedText(preview, compressedData);
    });

    replayButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (interval) {
            clearInterval(interval);
        }
        const compressedData = compressData(values);
        interval = replayCompressedText(preview, compressedData);
    });

    const reset = () => {
        previewButton.classList.add('hidden');
        preview.classList.add('hidden');
        replayButton.classList.add('hidden');
        preview.textContent = '';
        text.removeAttribute('disabled');
        setValues([]);
        start = null;
        text.value = '';
        if (interval) {
            clearInterval(interval);
        }
        interval = null;
        code.textContent = '';
        codeWrapper.classList.add('hidden');
        delete code.dataset.highlighted;
    };

    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        reset();
    });

    const generateCode = () => {
        return `/*
 * This code was generated by Human Replay (https://einenlum.github.io/human-replay/)
 */
const replayText = (element, values) => {
    element.textContent = '';
    const printingStart = new Date();

    let localInterval = setInterval(() => {
        const timePassed = new Date() - printingStart;

        const value = values.shift();

        if (!value) {
            clearInterval(localInterval);

            return;
        }

        if (value.t > timePassed) {
            values.unshift(value);

            return;
        }

        if (value.op === 'a') {
            element.textContent = element.textContent + value.v;

            return;
        }

        if (value.op === 'd') {
            element.textContent = element.textContent.slice(0, -1);

            return;
        }

        element.textContent = value.v;
    }, 20);

    return localInterval;
}

const values = ${JSON.stringify(compressData(values))};

// const myElement = document.getElementById('your-element-id');
replayText(myElement, values);
`
    };

    generateButton.addEventListener('click', (event) => {
        event.preventDefault();
        delete code.dataset.highlighted;

        generateButton.classList.add('hidden');

        code.textContent = generateCode();
        codeWrapper.classList.remove('hidden');
        hljs.highlightAll();
    });

    copyCodeButton.addEventListener('click', (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(code.textContent);
    });

    const humanIsTheNewBlackValues = [{ "op": "a", "v": "H", "t": 0 }, { "op": "a", "v": "u", "t": 354 }, { "op": "a", "v": "m", "t": 464 }, { "op": "a", "v": "a", "t": 594 }, { "op": "a", "v": "n", "t": 711 }, { "op": "a", "v": " ", "t": 808 }, { "op": "a", "v": "i", "t": 1176 }, { "op": "a", "v": "s", "t": 1466 }, { "op": "d", "t": 1942 }, { "op": "a", "v": "s", "t": 2323 }, { "op": "a", "v": " ", "t": 2548 }, { "op": "a", "v": "t", "t": 2905 }, { "op": "a", "v": "h", "t": 2977 }, { "op": "a", "v": "e", "t": 3069 }, { "op": "a", "v": " ", "t": 3172 }, { "op": "a", "v": "n", "t": 3459 }, { "op": "a", "v": "e", "t": 3556 }, { "op": "a", "v": "w", "t": 3672 }, { "op": "a", "v": " ", "t": 3772 }, { "op": "a", "v": "B", "t": 4078 }, { "op": "d", "t": 4772 }, { "op": "a", "v": "b", "t": 5001 }, { "op": "a", "v": "l", "t": 5079 }, { "op": "a", "v": "a", "t": 5165 }, { "op": "a", "v": "c", "t": 5267 }, { "op": "a", "v": "k", "t": 5422 }, { "op": "a", "v": ".", "t": 5504 }];

    setTimeout(() => {
        replayCompressedText(humanIsTheNewBlack, humanIsTheNewBlackValues);
    }, 700);
};
