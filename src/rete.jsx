import React from "react"
import Rete from "rete"
import ConnectionPlugin from "rete-connection-plugin"
import ReactRenderPlugin from "rete-react-render-plugin"
import AreaPlugin from "rete-area-plugin";
import {TestNode} from "./TestNode"

var textSocket = new Rete.Socket("Text value");

class TextControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="String"
      value={value}
      ref={ref => {
        ref && ref.addEventListener("pointerdown", e => e.stopPropagation());
      }}
      onChange={e => onChange(+e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = TextControl.component;

    const initial = node.data[key] || "None";

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: v => {
        this.setValue(v);
        this.emitter.trigger("process");
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class TextComponent extends Rete.Component {
  constructor() {
    super("Text");
  }

  builder(node) {
    var out1 = new Rete.Output("num", "String", textSocket);
    var ctrl = new TextControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

class AppendComponent extends Rete.Component {
  constructor() {
    super("Append");
    this.data.component = TestNode; // optional
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "First String", textSocket);
    var inp2 = new Rete.Input("num2", "Second String", textSocket);
    var out = new Rete.Output("num", "Out String", textSocket);

    inp1.addControl(new TextControl(this.editor, "num1", node));
    inp2.addControl(new TextControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new TextControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var appended = n1 + n2;

    this.editor.nodes
      .find(n => n.id === node.id)
      .controls.get("preview")
      .setValue(appended);
    outputs["num"] = appended;
  }
}

export async function createEditor(container){
    var editor = new Rete.NodeEditor("demo@0.1.0", container);
    var components = [new TextComponent(), new AppendComponent
    ()];

    editor.use(ConnectionPlugin);
    editor.use(ReactRenderPlugin);

    var engine = new Rete.Engine("demo@0.1.0");

    components.forEach(c => {
        editor.register(c)
        engine.register(c)
    });

    var n1 = await components[0].createNode({ num: "Hello " });
    var n2 = await components[0].createNode({ num: "World!" });
    var add = await components[1].createNode();

    n1.position = [80, 200];
    n2.position = [80, 400];
    add.position = [500, 240];

    editor.addNode(n1);
    editor.addNode(n2);
    editor.addNode(add);

    editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
    editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

    editor.on(
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
        console.log("process");
        await engine.abort();
        await engine.process(editor.toJSON());
        }
    );

    editor.view.resize();
    editor.trigger("process");
    AreaPlugin.zoomAt(editor, editor.nodes);
}