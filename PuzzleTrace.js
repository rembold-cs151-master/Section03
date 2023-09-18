/*
 * File: PuzzleTrace.js
 * --------------------
 * This file traces the Puzzle problem from section.
 */

"use strict";

function PuzzleDemo() {
    new PuzzleTrace();
}

class PuzzleTrace extends CodeTrace {

    constructor() {
        super("PuzzleTrace");
        this.reset();
    }

    setParameters() {
        this.setMaxStackDepth(1);
        this.setFrameHeight(PuzzleTrace.FRAME_HEIGHT);
        this.setFrameDeltas(PuzzleTrace.FRAME_DX, PuzzleTrace.FRAME_DY);
        this.keepLastFrame(true);
    }

    defineFunctions() {
        this.defineFunction("puzzle", new Puzzle());
    }

    reset() {
        let console = document.getElementById("PuzzleConsole");
        console.innerHTML = ("<span class='prompt'>&gt;&gt;&gt;</span> " +
                             "puzzle(8)<br />");
        super.reset();
    }

    run() {
        this.call("puzzle", 8);
    }

}

PuzzleTrace.FRAME_HEIGHT = 360;
PuzzleTrace.FRAME_DX = 16;
PuzzleTrace.FRAME_DY = 62;
PuzzleTrace.VAR_WIDTH = 160;
PuzzleTrace.VAR_HEIGHT = 50;

class Puzzle extends CTFunction {

    constructor() {
        super(Puzzle.HTML);
    }

    createFrame(ct) {
        let cf = new CTStackFrame(ct, this);
        cf.addVariable("n", PuzzleTrace.VAR_WIDTH, PuzzleTrace.VAR_HEIGHT);
        cf.addVariable("i", PuzzleTrace.VAR_WIDTH, PuzzleTrace.VAR_HEIGHT);
        cf.addVariable("s", PuzzleTrace.VAR_WIDTH, PuzzleTrace.VAR_HEIGHT);
        cf.layoutVariables();
        cf.set("n", ct.pop());
        return cf;
    }

    async run(ct) {
        let cf = ct.getCurrentFrame();
        let n = cf.get("n");
        let i = -1;
        let s = 0;
        await ct.traceStep("#1", () => cf.set("s", s = 0));
        await ct.traceStep("#2", () => undefined);
        while (await ct.traceStep("#2a", function() {
                                             if (i + 2 < 2 * n) {
                                                 cf.set("i", i += 2);
                                                 return true;
                                             }
                                             return false;
                                         })) {
            await ct.traceStep("#3", () => cf.set("s", s += i));
        }
        await ct.traceStep("#4", () => print(s + "<br />" +
                           "<span class='prompt'>&gt;&gt;&gt;</span>"));
    
        function print(s) {
            let stdout = document.getElementById("PuzzleConsole");
            stdout.innerHTML += s + "<br />";
            stdout.scrollTop = stdout.scrollHeight;
        }

    }

}

Puzzle.HTML =
    "<span class='skeyword'>def</span> <span class='funcname'>puzzle</span>(<span class='params'>n</span>):\n" +
    "    <span class='#1'>s = 0</span>\n" +
    "    <span class='#2'><span class='keyword'>for</span> " +
         "<span class='#2a'>i <span class='keyword'>in</span> " +
         "<span class='builtin'>range</span>(1, 2 * n, 2)</span>:</span>\n" +
    "        <span class='#3'>s += i</span>\n" +
    "    <span class='#4'><span class='keyword'>return</span> s</span>\n";
