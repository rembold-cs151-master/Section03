/*
 * File: MysteryTrace.js
 * ---------------------
 * This file traces the Mystery problem from section.
 */

"use strict";

function MysteryDemo() {
    new MysteryTrace();
}

class MysteryTrace extends CodeTrace {

    constructor() {
        super("MysteryTrace");
        this.reset();
    }

    setParameters() {
        this.setMaxStackDepth(1);
        this.setFrameHeight(MysteryTrace.FRAME_HEIGHT);
        this.setFrameDeltas(MysteryTrace.FRAME_DX, MysteryTrace.FRAME_DY);
        this.keepLastFrame(true);
    }

    defineFunctions() {
        this.defineFunction("mystery", new Mystery());
    }

    reset() {
        let console = document.getElementById("MysteryConsole");
        console.innerHTML = ("<span class='prompt'>&gt;&gt;&gt;</span> " +
                             "mystery(77, 42)<br />");
        super.reset();
    }

    run() {
        this.call("mystery", 77, 42);
    }

}

MysteryTrace.FRAME_HEIGHT = 360;
MysteryTrace.FRAME_DX = 16;
MysteryTrace.FRAME_DY = 62;
MysteryTrace.VAR_WIDTH = 160;
MysteryTrace.VAR_HEIGHT = 50;

class Mystery extends CTFunction {

    constructor() {
        super(Mystery.HTML);
    }

    createFrame(ct) {
        let cf = new CTStackFrame(ct, this);
        cf.addVariable("x", MysteryTrace.VAR_WIDTH, MysteryTrace.VAR_HEIGHT);
        cf.addVariable("y", MysteryTrace.VAR_WIDTH, MysteryTrace.VAR_HEIGHT);
        cf.layoutVariables();
        cf.set("y", ct.pop());
        cf.set("x", ct.pop());
        return cf;
    }

    async run(ct) {
        let cf = ct.getCurrentFrame();
        let x = cf.get("x");
        let y = cf.get("y");
        await ct.traceStep("#1", () => undefined);
        while (await ct.traceStep("#1a", () => (x !== 0 && y !== 0))) {
            if (await ct.traceStep("#2", () => x > y)) {
                await ct.traceStep("#3", () => cf.set("x", x -= y));
            } else {
                await ct.traceStep("#4", () => cf.set("y", y -= x));
            }
        }
        await ct.traceStep("#5", () => print(Math.max(x, y) + "<br />" +
                           "<span class='prompt'>&gt;&gt;&gt;</span>"));
    
        function print(s) {
            let stdout = document.getElementById("MysteryConsole");
            stdout.innerHTML += s + "<br />";
            stdout.scrollTop = stdout.scrollHeight;
        }

    }

}

Mystery.HTML =
    "<span class='skeyword'>def</span> <span class='funcname'>mystery</span>(<span class='params'>x, y</span>):\n" +
    "    <span class='#1'><span class='keyword'>while</span> " +
         "<span class='#1a'>x != 0 <span class='keyword'>and</span> " +
         "y != 0</span>:</span>\n" +
    "        <span class='#2'><span class='keyword'>if</span> " +
         "x > y:</span>\n" +
    "            <span class='#3'>x -= y</span>\n" +
    "        <span class='keyword'>else</span>:\n" +
    "            <span class='#4'>y -= x</span>\n" +
    "    <span class='#5'><span class='keyword'>return</span> " +
         "<span class='builtin'>max</span>(x, y)</span></span>\n";
