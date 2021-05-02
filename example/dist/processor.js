/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../dist/audio-player-service-processor.js":
/*!****************************************************!*\
  !*** ../../dist/audio-player-service-processor.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AudioPlayerServiceProcessor\": () => (/* binding */ AudioPlayerServiceProcessor)\n/* harmony export */ });\nfunction _concatWaves(a, b) {\n    const res = new Float32Array(a.length + b.length);\n    res.set(a, 0);\n    res.set(b, a.length);\n    return res;\n}\nclass AudioPlayerServiceProcessor extends AudioWorkletProcessor {\n    constructor(options) {\n        super(options);\n        this._buffers = [new Float32Array(sampleRate * 600), new Float32Array(sampleRate * 600)];\n        this._rp = 0;\n        this._wp = 0;\n        this._end = false;\n        this.port.onmessage = (e) => {\n            if (e.data.type === 'wave') {\n                this.put(e.data.waves);\n            }\n            else if (e.data.type === 'end') {\n                this._end = true;\n            }\n        };\n        this.put(this.calcSilent());\n    }\n    static get parameterDescriptors() { return []; }\n    ;\n    calcSilent() {\n        const length = sampleRate >> 1; // 500ms\n        const data = new Float32Array(length);\n        for (let i = 0; i < length; i++) {\n            data[i] = 0;\n        }\n        return [data, data];\n    }\n    process(inputs, outputs, parameters) {\n        const output = outputs[0];\n        output.forEach((channel, ch) => {\n            const buf = this._buffers[ch];\n            if (buf && buf.length > sampleRate) {\n                for (let i = 0; i < channel.length; i++) {\n                    if (this._rp + i < this._wp) {\n                        channel[i] = buf[this._rp + i];\n                    }\n                }\n            }\n        });\n        this._rp += output[0].length;\n        if (this._rp >= this._wp && this._end) {\n            return false;\n        }\n        return true;\n    }\n    put(waves) {\n        for (let i = 0; i < waves.length; i++) {\n            const wav = waves[i];\n            for (let j = 0; j < wav.length; j++) {\n                this._buffers[i][this._wp + j] = wav[j];\n            }\n        }\n        this._wp += waves[0].length;\n    }\n    seek(frame) {\n        if (frame < this._buffers[0].length) {\n            this._rp = frame;\n            return true;\n        }\n        return false;\n    }\n}\n\n\n//# sourceURL=webpack:///../../dist/audio-player-service-processor.js?");

/***/ }),

/***/ "../../dist/index.js":
/*!***************************!*\
  !*** ../../dist/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AudioPlayerServiceProcessor\": () => (/* reexport safe */ _audio_player_service_processor__WEBPACK_IMPORTED_MODULE_0__.AudioPlayerServiceProcessor)\n/* harmony export */ });\n/* harmony import */ var _audio_player_service_processor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio-player-service-processor */ \"../../dist/audio-player-service-processor.js\");\n\n\n\n//# sourceURL=webpack:///../../dist/index.js?");

/***/ }),

/***/ "./processor.js":
/*!**********************!*\
  !*** ./processor.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var audio_player_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! audio-player-service */ \"../../dist/index.js\");\n\nregisterProcessor('audio-player', audio_player_service__WEBPACK_IMPORTED_MODULE_0__.AudioPlayerServiceProcessor);\n\n//# sourceURL=webpack:///./processor.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./processor.js");
/******/ 	
/******/ })()
;