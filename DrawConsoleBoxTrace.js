/*
 * File: DrawConsoleBoxTrace.js
 * ----------------------------
 * This file traces the DrawConsoleBox problem from section.
 */

"use strict";

function DrawConsoleBoxDemo() {
    new DrawConsoleBoxTrace();
}

class DrawConsoleBoxTrace extends CodeTrace {

    constructor() {
        super("DrawConsoleBoxTrace");
        this.reset();
    }

    setParameters() {
        this.setMaxStackDepth(1);
        this.setFrameHeight(DrawConsoleBoxTrace.FRAME_HEIGHT);
        this.setFrameDeltas(DrawConsoleBoxTrace.FRAME_DX,
                            DrawConsoleBoxTrace.FRAME_DY);
        this.keepLastFrame(true);
    }

    defineFunctions() {
        //this.defineFunction("main", new DrawConsoleBoxMain());
        this.defineFunction("draw_console_box", new DrawConsoleBox());
    }

    reset() {
        let console = document.getElementById("DrawConsoleConsole");
        console.innerHTML = ("<span class='prompt'>&gt;&gt;&gt;</span> " +
        "<span class='#1'>draw<span class='u'>_</span>" +
            "console<span class='u'>_</span>box(7, 4)</span><br/>");
        super.reset();
        //let cf = this.getCurrentFrame();
        //cf.setVisible("#2", false);
    }

    run() {
        //this.call("main");
        this.call("draw_console_box");
    }

}

DrawConsoleBoxTrace.FRAME_HEIGHT = 700;
DrawConsoleBoxTrace.FRAME_DX = 14;
DrawConsoleBoxTrace.FRAME_DY = 52;
DrawConsoleBoxTrace.LINE_WIDTH = 250;
DrawConsoleBoxTrace.VAR_WIDTH = 160;
DrawConsoleBoxTrace.VAR_HEIGHT = 50;

class DrawConsoleBoxMain extends CTFunction {

    constructor() {
        super(DrawConsoleBoxMain.HTML);
    }

    createFrame(ct) {
        return new CTStackFrame(ct, this);
    }
    
    async run(ct) {
        let cf = ct.getCurrentFrame();
        await ct.traceStep("#1",
                           function() {
                               cf.highlight(null);
                               return ct.call("draw_console_box", 7, 4);
                           });
        await cf.setVisible("#2", true);
    }

}

DrawConsoleBoxMain.HTML =
    "<span class='prompt'>&gt;&gt;&gt;</span> " +
        "<span class='#1'>draw<span class='u'>_</span>" +
        "console<span class='u'>_</span>box(7, 4)</span>\n" +
    "<span class='#2'>+-----+\n|     |\n|     |\n+-----+\n</span>";

class DrawConsoleBox extends CTFunction {

    constructor() {
        super(DrawConsoleBox.HTML);
    }

    createFrame(ct) {
        let cf = new CTStackFrame(ct, this);
        cf.addVariable("width", DrawConsoleBoxTrace.VAR_WIDTH,
                                DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.addVariable("height", DrawConsoleBoxTrace.VAR_WIDTH,
                                DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.addVariable("i", DrawConsoleBoxTrace.VAR_WIDTH,
                            DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.addVariable("j", DrawConsoleBoxTrace.VAR_WIDTH,
                            DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.addVariable("endc", DrawConsoleBoxTrace.VAR_WIDTH,
                               DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.addVariable("midc", DrawConsoleBoxTrace.VAR_WIDTH,
                               DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.addVariable("line", DrawConsoleBoxTrace.LINE_WIDTH,
                               DrawConsoleBoxTrace.VAR_HEIGHT);
        cf.getVariable("endc").setQuoteFlag(true);
        cf.getVariable("midc").setQuoteFlag(true);
        cf.getVariable("line").setQuoteFlag(true);
        cf.layoutVariables();
        cf.set("height", 4);
        cf.set("width", 7);
        return cf;
    }
    
    async run(ct) {
        let cf = ct.getCurrentFrame();
        let width = cf.get("width");
        let height = cf.get("height");
        let midc = "";
        let endc = "";
        let line = "";
        let i = -1;
        let j = -1;
        await ct.traceStep("#1", () => undefined);
        while (await ct.traceStep("#1a", function() {
                                             cf.set("i", ++i);
                                             return i < height;
                                         })) {
            if (await ct.traceStep("#2", () => i === 0 || i === height - 1)) {
                await ct.traceStep("#3", () => cf.set("endc", endc = "+"));
                await ct.traceStep("#4", () => cf.set("midc", midc = "-"));
            } else {
                await ct.traceStep("#5", () => cf.set("endc", endc = "|"));
                await ct.traceStep("#6", () => cf.set("midc", midc = " "));
            }
            await ct.traceStep("#7", () => cf.set("line", line = ""));
            j = -1;
            while (await ct.traceStep("#8a", function() {
                                                 j++;
                                                 if (j < width - 2) {
                                                     cf.set("j", j);
                                                     return true;
                                                 }
                                                 return false;
                                             })) {
                await ct.traceStep("#9", () => cf.set("line", line += midc));
            }
            await ct.traceStep("#10", () => print(endc + line + endc));
        }

        function print(s) {
            let stdout = document.getElementById("DrawConsoleConsole");
            // Needs to swap out the spaces for nbsp else HTML collapses them
            stdout.innerHTML += s.replace(/ /g, "&nbsp;") + "<br />";
            stdout.scrollTop = stdout.scrollHeight;
        }
    }

}

DrawConsoleBox.HTML =
    "<span class='skeyword'>def</span> <span class='funcname'>draw<span class='u'>_</span>" +
    "console<span class='u'>_</span>box</span>(<span class='params'>width, height</span>):\n" +
    "    <span class='#1'><span class='keyword'>for</span> " +
         "<span class='#1a'>i <span class='keyword'>in</span> " +
         "<span class='builtin'>range</span>(height)</span>:</span>\n" +
    "        <span class='#2'><span class='keyword'>if</span> " +
         "i == 0 <span class='keyword'>or</span> i == height - 1:</span>\n" +
    "            <span class='#3'>endc = \"+\"</span>\n" +
    "            <span class='#4'>midc = \"-\"</span>\n" +
    "        <span class='keyword'>else</span>:\n" +
    "            <span class='#5'>endc = \"|\"</span>\n" +
    "            <span class='#6'>midc = \" \"</span>\n" +
    "        <span class='#7'>line = \"\"</span>\n" +
    "        <span class='#8'><span class='keyword'>for</span> " +
         "<span class='#8a'>j <span class='keyword'>in</span> " +
         "<span class='builtin'>range</span>(width - 2)</span>:</span>\n" +
    "            <span class='#9'>line += midc</span>\n" +
    "        <span class='#10'><span class='builtin'>print</span>" +
         "(endc + line + endc)</span>\n";
