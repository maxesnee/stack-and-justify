import { hbjs } from './harfbuzzjs/hbjs.js';
import { Filters } from '../Filters.js';

let hbResolve;
let hbReady = new Promise((resolve) => {
    hbResolve = resolve;
});

WebAssembly.instantiateStreaming(fetch('harfbuzzjs/hb.wasm'), {})
    .then(instantiatedModule => {
        const hb = hbjs(instantiatedModule.instance);
        hb.exports = instantiatedModule.instance.exports;
        hbResolve(hb);
    });
 
// Handle incoming messages
self.addEventListener('message', function(e) {
    hbReady.then(hb => {
        const fontBuffer = e.data[0];
        const dictionary = e.data[1];
        const blob = hb.createBlob(fontBuffer);
        const face = hb.createFace(blob, 0);
        const font = hb.createFont(face);

        const measured = measureWords(hb, dictionary, font, 100);
        postMessage(measured);
    });
}, false);


function measureWords(hb, dictionary, font, size) {
    const measures = new Array(dictionary.length);

     for (let i = 0; i < dictionary.length; i++) {
        measures[i] = measureText(dictionary[i], font, size);
    }

    function measureText(str, font, size) {
        const buffer = hb.createBuffer();
        buffer.addText(str);
        buffer.guessSegmentProperties();
        hb.shape(font, buffer);
        const result =  buffer.json();
        buffer.destroy();
        return (result.reduce((acc, curr) => acc + curr.ax, 0)/1000)*size;
    }

    return measures;
}