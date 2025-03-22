"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test-recall.ts
var recallActions_1 = require("./src/lib/recallActions");
(0, recallActions_1.fullRecallFlow)().then(function () {
    console.log("✅ Flow completed");
}).catch(console.error);
