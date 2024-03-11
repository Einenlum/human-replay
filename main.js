import './style.css'
import '@fontsource/coming-soon';
import '@fontsource/staatliches';
import '@fontsource/licorice';
import Alpine from 'alpinejs'
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/nord.css';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

window.Alpine = Alpine

Alpine.start()


window.onload = function() {
    const text = document.getElementById('text');
    const previewButton = document.getElementById('preview-button');
    const replayButton = document.getElementById('replay-button');
    const generateButton = document.getElementById('generate');
    const resetButton = document.getElementById('reset');
    const codeWrapper = document.getElementById('code-wrapper');
    const vanillaCode = document.getElementById('vanilla-code');
    const webComponentCode = document.getElementById('web-component-code');
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

            switch (value.op) {
                case 'a':
                    element.textContent = element.textContent + value.v;
                    break;
                case 'd':
                    element.textContent = element.textContent.slice(0, -1);
                    break;
                default:
                    element.textContent = value.v;
            }
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
        interval = replayText(preview, compressedData);
    });

    replayButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (interval) {
            clearInterval(interval);
        }
        const compressedData = compressData(values);
        interval = replayText(preview, compressedData);
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
        vanillaCode.textContent = '';
        webComponentCode.textContent = '';
        codeWrapper.classList.add('hidden');
        delete vanillaCode.dataset.highlighted;
        delete webComponentCode.dataset.highlighted;
    };

    resetButton.addEventListener('click', (event) => {
        event.preventDefault();
        reset();
    });

    const generateSimpleJSCode = () => {
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

        switch (value.op) {
            case 'a':
                element.textContent = element.textContent + value.v;
                break;
            case 'd':
                element.textContent = element.textContent.slice(0, -1);
                break;
            default:
                element.textContent = value.v;
        }
    }, 20);

    return localInterval;
}

const values = ${JSON.stringify(compressData(values))};

// const myElement = document.getElementById('your-element-id');
replayText(myElement, values);
`
    };

    const generateWebComponentCode = () => {
        return `/*
 * This code was generated by Human Replay (https://einenlum.github.io/human-replay/)
 */
class HumanReplay extends HTMLElement {
    constructor() {
        super();

        this.values = ${JSON.stringify(compressData(values))};
        this.interval = null;
    }

    connectedCallback() {
        const printingStart = new Date();

        this.interval = setInterval(() => {
            const timePassed = new Date() - printingStart;

            const value = this.values.shift();

            if (!value) {
                clearInterval(this.interval);

                return;
            }

            if (value.t > timePassed) {
                this.values.unshift(value);

                return;
            }


            switch (value.op) {
                case 'a':
                    this.textContent = this.textContent + value.v;
                    break;
                case 'd':
                    this.textContent = this.textContent.slice(0, -1);
                    break;
                default:
                    this.textContent = value.v;
            }
        }, 20);
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }
}

customElements.define('human-replay', HumanReplay);

// in HTML, use it like this:
// <human-replay></human-replay>
`
    };

    generateButton.addEventListener('click', (event) => {
        event.preventDefault();
        delete vanillaCode.dataset.highlighted;
        delete webComponentCode.dataset.highlighted;

        generateButton.classList.add('hidden');

        vanillaCode.textContent = generateSimpleJSCode();
        webComponentCode.textContent = generateWebComponentCode();
        codeWrapper.classList.remove('hidden');
        hljs.highlightAll();
    });

    window.copyCode = (selector) => {
        const code = document.querySelector(selector);
        navigator.clipboard.writeText(code.textContent);
    }

    const humanIsTheNewBlackValues = [{ "op": "a", "v": "H", "t": 0 }, { "op": "a", "v": "u", "t": 354 }, { "op": "a", "v": "m", "t": 464 }, { "op": "a", "v": "a", "t": 594 }, { "op": "a", "v": "n", "t": 711 }, { "op": "a", "v": " ", "t": 808 }, { "op": "a", "v": "i", "t": 1176 }, { "op": "a", "v": "s", "t": 1466 }, { "op": "d", "t": 1942 }, { "op": "a", "v": "s", "t": 2323 }, { "op": "a", "v": " ", "t": 2548 }, { "op": "a", "v": "t", "t": 2905 }, { "op": "a", "v": "h", "t": 2977 }, { "op": "a", "v": "e", "t": 3069 }, { "op": "a", "v": " ", "t": 3172 }, { "op": "a", "v": "n", "t": 3459 }, { "op": "a", "v": "e", "t": 3556 }, { "op": "a", "v": "w", "t": 3672 }, { "op": "a", "v": " ", "t": 3772 }, { "op": "a", "v": "B", "t": 4078 }, { "op": "d", "t": 4772 }, { "op": "a", "v": "b", "t": 5001 }, { "op": "a", "v": "l", "t": 5079 }, { "op": "a", "v": "a", "t": 5165 }, { "op": "a", "v": "c", "t": 5267 }, { "op": "a", "v": "k", "t": 5422 }, { "op": "a", "v": ".", "t": 5504 }];

    setTimeout(() => {
        replayText(humanIsTheNewBlack, humanIsTheNewBlackValues);
    }, 700);
};
