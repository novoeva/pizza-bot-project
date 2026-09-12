# Lovable prompt: the flow board illustration

> Copy everything below the line into Lovable. Attach the screenshot of the board at 12 / 12 as the reference image.

---

On the Workshop screen, replace the robot illustration with a **flow board**. Keep everything else on the screen as it is: the header, the intro text, the board panel with its pegboard background, the status readout, the term list. Only the picture inside the panel changes. Same props as the robot: it takes the list of completed term ids and draws the state.

## What the picture is

The bot drawn as a workflow, the way n8n draws an AI agent: boxes connected by wires. Each of the 12 terms is a box on the flow, or a setting chip inside "the model" box. A term that isn't learned yet is a **shadow**: dashed outline, its number, a "?". A learned term is a **solid chunky box** with an icon and its name. A wire turns solid once both of its ends are built. At 12 / 12 the agent gets a soft mint glow and the wires get a slow animated dash.

The attached screenshot is the structure. **Keep the structure exactly**: same boxes, same positions, same wires, same numbers 1 to 12 as badges on every term. Do not add, remove, rename or reorder anything. Nothing is locked.

Main row: Customer → Prompt (5) → Agent (6, the hero, four ports on its bottom edge) → Guardrails (12) → Reply.
Hanging from the agent's ports: The model (with chips Token 1, Temperature 2, Context window 3, Hallucination 4), Memory (7), Skill (8), Tool use (9).
Below Tool use: MCP (10) fanning out to Menu, Kitchen, Delivery. RAG (11) connecting to Recipe binder.

## Make it more graphic

The screenshot is a diagram. I want an **illustration**, in the app's existing style: light, bold, chunky, playful, thick navy outlines, hard offset shadows, the existing palette, the existing fonts and Material Symbols icons. No new colours, no gradients, no 3D, no emoji.

- **Scenery boxes** (Customer, Reply, Menu, Kitchen, Delivery, Recipe binder) become little flat illustrations instead of icons in circles: a speech bubble with a slice in it, a menu card, a pizza oven, a delivery scooter, a ring binder. Two or three colours each.
- **The agent** is the hero. Slightly bigger box, a friendly bot face or the pizza guy peeking out, the four ports drawn like real sockets.
- **The model** reads as a control panel: the four chips are a token counter, a temperature dial, a window gauge and a warning light, not four identical buttons. Hallucination is a warning light, not a part.
- **Wires** look like cables: rounded corners, some thickness, a plug where a cable meets a port. Clean, never messy.
- **Shadows** stay quiet: dashed, muted, number and "?" only, a small "tap to build". The built boxes should feel like they were snapped onto the board.

## Rules

- Inline SVG, scales with the panel. No diagram libraries, no external images.
- Desktop: the panel is about 560 px wide next to the term list, and every name must fit inside its box. Grow the box, never shrink the text.
- Phone: one column top to bottom (Customer, Prompt, Agent, The model, Memory, Skill, Tool use, MCP and RAG side by side, the three systems in a row, Guardrails, Reply), port wires as a dashed rail down the left.
- Every term is a link to its game, as the term list is today. Hover on a shadow shows the term name.
- Counter under the board: "N / 12 wired in".
- Show me the 0 / 12, 6 / 12 and 12 / 12 states.
