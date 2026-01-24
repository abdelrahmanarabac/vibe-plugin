import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import namesPlugin from 'colord/plugins/names';

// Extend colord with necessary plugins
extend([a11yPlugin, namesPlugin]);

// biome-ignore lint/complexity/noStaticOnlyClass: Utility pattern
export class ColorUtils {
  /**
   * Converts a Hex color to space-separated RGB channels.
   * Required for Tailwind CSS variable opacity support.
   * @example "#3B82F6" -> "59 130 246"
   */
  static toRgbChannels(hex: string): string {
    const { r, g, b } = colord(hex).toRgb();
    return `${r} ${g} ${b}`;
  }

  /**
   * Returns either black or white based on which has better contrast against the background.
   * Uses WCAG contrast guidelines.
   */
  static getContrastColor(bgHex: string): '#FFFFFF' | '#000000' {
    return colord(bgHex).isDark() ? '#FFFFFF' : '#000000';
  }

  /**
   * Clamps a color to the sRGB gamut to prevent clipping artifacts.
   * (Basic implementation relies on colord's inherent clamping during conversion,
   * but explicit check prevents INVALID inputs).
   */
  static ensureValid(color: string): string {
    const c = colord(color);
    return c.isValid() ? c.toHex() : '#000000';
  }

  /**
   * Gets a human-readable name for the color family.
   * Resolves the "Gray vs Blue" ambiguity by checking saturation.
   */
  static getColorFamily(hex: string): string {
    const c = colord(hex);
    const { s, l } = c.toHsl();

    // Handling "Gray is Blue" bug: Low saturation is NEUTRAL, not Blue.
    if (s < 10) {
      // Threshold for gray
      if (l > 90) {
        return 'white';
      }
      if (l < 10) {
        return 'black';
      }
      return 'gray';
    }

    // Use Hue Buckets for consistent generic naming
    const h = c.toHsl().h;
    if (h >= 0 && h < 15) {
      return 'red';
    }
    if (h >= 15 && h < 45) {
      return 'orange';
    }
    if (h >= 45 && h < 70) {
      return 'yellow';
    }
    if (h >= 70 && h < 165) {
      return 'green'; // Covers Lime & Green
    }
    if (h >= 165 && h < 200) {
      return 'cyan'; // Teal/Cyan
    }
    if (h >= 200 && h < 260) {
      return 'blue';
    }
    if (h >= 260 && h <= 300) {
      return 'purple';
    }
    if (h > 300 && h < 340) {
      return 'pink';
    }
    return 'red'; // 340-360
  }

  /**
   * Gets a human-readable name for the color using the Supabase Cloud Engine.
   * Hybrid approach: fast spatial query + local high precision.
   */
  static async getColorName(hex: string): Promise<string> {
    try {
      // 1. Check local generic families first for quick feedback if needed
      // (Optional: can be skipped if direct cloud naming is preferred)

      // 2. Query Cloud Engine
      const { CloudColorNamer } = await import('./CloudColorNamer');
      return await CloudColorNamer.findColor(hex);
    } catch (error) {
      console.error('[ColorUtils] Cloud Naming Failed, falling back to family:', error);
      return this.getColorFamily(hex);
    }
  }

  /**
   * Generates a Hex string from RGB channels.
   * Useful for reverse engineering variables if needed.
   */
  static fromRgbChannels(channels: string): string {
    const [r, g, b] = channels.split(' ').map(Number);
    return colord({ r, g, b }).toHex();
  }
}
