import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

interface CreateStylePayload {
    name: string;
    type: 'typography' | 'effect' | 'grid';
    value?: string;
}

export class CreateStyleCapability implements ICapability<CreateStylePayload> {
    readonly id = 'create-style-v1';
    readonly commandId = 'CREATE_STYLE';
    readonly description = 'Creates a new Figma style (Typography, Effect, or Grid).';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: CreateStylePayload, _context: AgentContext): Promise<Result<any>> {
        try {
            const { name, type, value } = payload;
            let newStyle: BaseStyle | null = null;

            if (type === 'typography') {
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const style = figma.createTextStyle();
                style.name = name;
                style.fontName = { family: "Inter", style: "Regular" };
                style.fontSize = 16;
                newStyle = style;
            }
            else if (type === 'effect') {
                const style = figma.createEffectStyle();
                style.name = name;
                style.effects = [{
                    type: 'DROP_SHADOW',
                    color: { r: 0, g: 0, b: 0, a: 0.25 },
                    offset: { x: 0, y: 4 },
                    radius: 4,
                    visible: true,
                    blendMode: 'NORMAL'
                }];
                newStyle = style;
            }
            else if (type === 'grid') {
                const style = figma.createGridStyle();
                style.name = name;
                style.layoutGrids = [{
                    pattern: 'ROWS',
                    alignment: 'STRETCH',
                    gutterSize: 20,
                    count: 4,
                    sectionSize: 1,
                    visible: true,
                    color: { r: 1, g: 0, b: 0, a: 0.1 }
                }];
                newStyle = style;
            }

            if (newStyle) {
                newStyle.description = value || '';
                return Result.ok({ success: true, name, id: newStyle.id });
            } else {
                return Result.fail(`Unsupported style type: ${type}`);
            }

        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
