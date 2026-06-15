import { useState } from 'react';
import { Palette, Settings2 } from 'lucide-react';
import { Panel } from './Panel';
import { useThemeStore, themes, type ThemeName, type CustomThemeColors } from '../../stores/theme.store';

function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(hslStr: string): string {
  const parts = hslStr.match(/\d+/g);
  if (!parts || parts.length < 3) return '#000000';
  const h = parseInt(parts[0]) / 360;
  const s = parseInt(parts[1]) / 100;
  const l = parseInt(parts[2]) / 100;
  let r = l, g = l, b = l;
  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function ThemeSettings() {
  const { theme, setTheme, customThemeColors, setCustomColors } = useThemeStore();
  const [colors, setColors] = useState<CustomThemeColors>(customThemeColors);

  const handleColorChange = (key: keyof CustomThemeColors, hexValue: string) => {
    const hslValue = hexToHsl(hexValue);
    const updated = { ...colors, [key]: hslValue };
    setColors(updated);
    setCustomColors({ [key]: hslValue });
  };

  return (
    <Panel className="border border-primary/20 bg-background/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-primary/10 text-primary">
          <Palette size={20} />
        </span>
        <div>
          <h2 className="text-xl font-black">Dynamic Theme Engine</h2>
          <p className="text-sm text-foreground/60">Customize your portal experience in real time</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">Select Theme</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {themes.map((name) => (
              <button
                key={name}
                onClick={() => setTheme(name)}
                className={`rounded-md border p-2 text-left text-sm font-semibold capitalize transition ${
                  theme === name
                    ? 'border-primary bg-primary/10 text-primary shadow-glow'
                    : 'border-border bg-background/30 text-foreground/80 hover:bg-white/5'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {theme === 'custom' && (
          <div className="rounded-md border border-border bg-background/20 p-4">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase text-primary">
              <Settings2 size={16} />
              <span>JS Color Customizer</span>
            </div>
            <div className="space-y-3">
              {(['primary', 'accent', 'background', 'foreground', 'border'] as Array<keyof CustomThemeColors>).map((key) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold capitalize text-foreground/80">{key} color</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/40 font-mono">
                      {colors[key]}
                    </span>
                    <input
                      type="color"
                      value={hslToHex(colors[key])}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="size-7 cursor-pointer rounded border border-border bg-transparent p-0 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
