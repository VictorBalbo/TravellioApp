export type ColorScheme = {
  background: string;
  backgroundSoft: string;
  backgroundAccent: string;

  text: string;
  caption: string;
  placeholder: string;
  divider: string;
  border: string;
  link: string;

  activeTint: string;
  inactiveTint: string;
};
export type BaseScheme = {
  smallSpacing: number;
  mediumSpacing: number;
  largeSpacing: number;
  borderRadius: number;
  textSize: number;
};
export type ThemeScheme = {
  light: ColorScheme;
  dark: ColorScheme;
  base: BaseScheme;
};

export const Colors = {
  whiteLight: "#ffffff",
  white: "#F2F2F7",
  whiteDeep: "#e5e5ea",

  gray: "#8e8e93",
  gray2: "#AEAEB2",
  gray3: "#C7C7CC",
  gray4: "#D1D1D6",
  gray5: "#E5E5EA",
  gray6: "#F2F2F7",

  blackLight: "#2C2C2E",
  black: "#1C1C1E",
  blackDeep: "#121214",

  red: "#FF453A",
  green: "#30D158",
  blue: "#007AFF",
  yellow: "#FF9F0A",
};

export const Theme: ThemeScheme = {
  light: {
    background: Colors.whiteLight,
    backgroundSoft: Colors.white,
    backgroundAccent: Colors.whiteDeep,

    text: Colors.black,
    caption: "#8A8A8E",
    placeholder: "#C5C5C7",
    divider: "#E8E8E9",
    border: "#C6C6C8",
    link: Colors.blue,

    activeTint: Colors.blackLight,
    inactiveTint: Colors.gray,
  },
  dark: {
    background: Colors.blackDeep,
    backgroundSoft: Colors.black,
    backgroundAccent: Colors.blackLight,

    text: Colors.white,
    caption: "#98989F",
    placeholder: "#5A5A5F",
    divider: "#3B3B3E",
    border: "#38383A",
    link: Colors.blue,

    activeTint: Colors.white,
    inactiveTint: Colors.gray,
  },
  base: {
    smallSpacing: 4,
    mediumSpacing: 8,
    largeSpacing: 16,
    borderRadius: 16,
    textSize: 16,
  },
} as const;

export const spacing = {
  smallExtra: 4,
  small: 8,
  medium: 12,
  large: 16,
  largeExtra: 32,
} as const;

export const radius = {
  small: 8,
  medium: 16,
  large: 32,
  full: 9999,
} as const;

export const fontSize = {
  medium: 16,
} as const;
