# 🔌 Token Export System - Usage Guide

## Overview
Zero-dependency, graph-aware token export engine using the Adapter Pattern.
Optimized for Figma's sandbox environment with strict TypeScript enforcement.

---

## Quick Start

### 1️⃣ Basic Usage

```typescript
import { TokenExportService, DTCGAdapter, CSSAdapter } from '@/modules/export';
import type { TokenEntity } from '@/core/types';

// Initialize service
const exportService = TokenExportService.getInstance();

// Register adapters
exportService
  .registerAdapter(new DTCGAdapter())
  .registerAdapter(new CSSAdapter());

// Export to CSS
const tokens: TokenEntity[] = [...]; // Your token array
const cssResult = await exportService.exportAll(tokens, 'css');

console.log(cssResult.filename); // "tokens.css"
console.log(cssResult.content);  // ":root { --color-primary: #FF0000; }"
console.log(cssResult.mimeType);  // "text/css"
```

---

## Available Adapters

### 📄 DTCG Adapter (W3C Compliance)

**Format ID:** `dtcg`  
**Output:** JSON following W3C Design Tokens Format  
**Use Case:** Interoperability with Figma Tokens Studio, Supernova, etc.

**Example Output:**
```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#FF5733",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

### 🎨 CSS Adapter

**Format ID:** `css`  
**Output:** CSS Custom Properties  
**Use Case:** Direct stylesheet inclusion

**Example Output:**
```css
:root {
  --color-primary-500: #FF5733;
  --spacing-base: 8px;
  --font-family-heading: "Inter";
  --duration-fast: 200ms;
}
```

**Features:**
- ✅ Kebab-case naming (`primary/500` → `--primary-500`)
- ✅ Auto-unit injection (`8` → `8px` for dimensions)
- ✅ Alias resolution (`{color/primary}` → `var(--color-primary)`)
- ✅ Font family quoting (spaces → quoted)

---

## Advanced Usage

### 🔄 Batch Export

Export to multiple formats concurrently:

```typescript
const results = await exportService.exportMultiple(tokens, ['css', 'dtcg']);

results.forEach(result => {
  if (result.success) {
    downloadFile(result.data.filename, result.data.content);
  } else {
    console.error(`Export failed: ${result.error}`);
  }
});
```

### 📋 List Available Formats

```typescript
const formats = exportService.getAvailableFormats();
console.log(formats); // ["css", "dtcg"]

const info = exportService.getAdapterInfo();
console.log(info);
// [
//   { formatId: "css", description: "CSS Custom Properties (Variables)" },
//   { formatId: "dtcg", description: "W3C Design Tokens..." }
// ]
```

### 🔧 Custom Adapter

Create your own export format:

```typescript
import type { ITokenAdapter, TokenExportResult } from '@/modules/export';
import type { TokenEntity } from '@/core/types';

class TypeScriptAdapter implements ITokenAdapter {
  public readonly formatId = 'typescript';
  public readonly description = 'TypeScript Const Exports';

  async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
    const declarations = tokens
      .map(t => `export const ${t.name} = '${t.$value}';`)
      .join('\n');

    return {
      filename: 'tokens.ts',
      content: declarations,
      mimeType: 'text/typescript',
      format: this.formatId
    };
  }
}

// Register your adapter
exportService.registerAdapter(new TypeScriptAdapter());
```

---

## Integration Examples

### 📤 Download in UI

```typescript
async function downloadTokens(tokens: TokenEntity[], format: string) {
  const result = await exportService.exportAll(tokens, format);

  const blob = new Blob([result.content], { type: result.mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  link.click();

  URL.revokeObjectURL(url);
}
```

### 💾 Save via Figma Plugin API

```typescript
async function saveToClientStorage(tokens: TokenEntity[], format: string) {
  const result = await exportService.exportAll(tokens, format);

  await figma.clientStorage.setAsync(`exported_tokens_${format}`, result.content);
  figma.notify(`✅ Tokens saved as ${format}`);
}
```

### 🔁 Sync with DTCG File

```typescript
async function syncWithDTCG(tokens: TokenEntity[]) {
  const dtcgResult = await exportService.exportAll(tokens, 'dtcg');
  const dtcgData = JSON.parse(dtcgResult.content);

  // Send to external API or save to file system
  await fetch('/api/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dtcgData)
  });
}
```

---

## Error Handling

```typescript
try {
  const result = await exportService.exportAll(tokens, 'invalid-format');
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // "❌ Export format "invalid-format" is not registered. Available formats: css, dtcg"
  }
}
```

---

## Architecture Benefits

### ✅ Zero Dependencies
- No `style-dictionary` or external libraries
- Lightweight bundle size
- Full control over transformation logic

### ✅ Type Safety
- Strict TypeScript enforcement
- No `any` types
- Compile-time validation

### ✅ Extensibility
- Add new formats via Adapter Pattern
- No modification to core service
- Open/Closed Principle compliance

### ✅ Performance
- O(1) adapter lookup (Map-based registry)
- Parallel batch exports
- Optimized for Figma sandbox

---

## Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TokenExportService, CSSAdapter } from '@/modules/export';

describe('TokenExportService', () => {
  let service: TokenExportService;

  beforeEach(() => {
    TokenExportService.resetInstance();
    service = TokenExportService.getInstance();
    service.registerAdapter(new CSSAdapter());
  });

  it('should export to CSS format', async () => {
    const tokens = [
      {
        id: '1',
        name: 'primary',
        path: ['color'],
        $value: '#FF0000',
        $type: 'color',
        $extensions: { figma: {...} },
        dependencies: [],
        dependents: []
      }
    ];

    const result = await service.exportAll(tokens, 'css');

    expect(result.content).toContain('--color-primary: #FF0000');
    expect(result.mimeType).toBe('text/css');
  });
});
```

---

## Roadmap

Future adapter implementations:

- [ ] **SCSS Adapter** - Sass variables and mixins
- [ ] **TypeScript Adapter** - Const exports with type definitions
- [ ] **Tailwind Adapter** - `tailwind.config.js` format
- [ ] **iOS Adapter** - Swift color assets
- [ ] **Android Adapter** - XML resources
- [ ] **JSON Adapter** - Generic key-value pairs

---

## Reference

- **W3C DTCG Spec:** https://tr.designtokens.org/format/
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Adapter Pattern:** https://refactoring.guru/design-patterns/adapter
