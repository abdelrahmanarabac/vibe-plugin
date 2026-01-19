// src/main.tsx
import { showUI, on } from "@create-figma-plugin/utilities";

export default function () {
    // افتح شاشة صغيرة للـ Plugin
    figma.showUI(__html__, { width: 300, height: 400 });

    // لما يجيلك أمر اسمه 'CREATE_TOKENS' نفذ الآتي:
    figma.ui.onmessage = async (msg) => {
        if (msg.type === 'CREATE_TOKENS') {

            // 1. اعمل Collection جديدة اسمها Vibe System
            const collection = figma.variables.createVariableCollection("Vibe System");

            // 2. اصنع لون تجريبي (Primary)
            const colorVar = figma.variables.createVariable("primary.main", collection.id, "COLOR");

            // 3. حط القيمة (أزرق مثلاً)
            // فيجما بياخد الألوان من 0 لـ 1، مش 0 لـ 255
            colorVar.setValueForMode(collection.defaultModeId, { r: 0, g: 0.5, b: 1 });

            figma.notify("✅ تم إنشاء التوكنز بنجاح!");
        }
    };
}
