// src/controller.ts
figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = (msg) => {
    if (msg.type === 'CREATE_TOKENS') {
        const collection = figma.variables.createVariableCollection("Vibe System");
        const colorVar = figma.variables.createVariable("primary.main", collection.id, "COLOR");
        // Figma uses 0-1 for RGB
        colorVar.setValueForMode(collection.defaultModeId, { r: 0, g: 0.5, b: 1 });

        figma.notify("✅ Vibe Magic: Tokens Generated!");
    }
};
