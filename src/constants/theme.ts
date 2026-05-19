export type ColorScheme = {
  background: string;
  backgroundSoft: string;
  backgroundAccent: string;
  text: string;
  helperText: string;
  link: string;
  activeTint: string;
  inactiveTint: string;
  border: string;
};
export type BaseScheme = {
  smallSpacing: number;
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
  white: "rgb(242, 242, 247)",
  whiteDeep: "rgb(229, 229, 234)",

  gray: "rgb(142, 142, 147)",

  blackLight: "rgb(44, 44, 46)",
  black: "rgb(28, 28, 30)",
  blackDeep: "#000000",

  red: "#D70015",
  blue: "#007AFF",
  yellow: "#ffcc00",
};

export const Theme: ThemeScheme = {
  light: {
    text: Colors.black,
    helperText: Colors.gray,
    link: Colors.blue,
    background: Colors.whiteLight,
    backgroundSoft: Colors.white,
    backgroundAccent: Colors.whiteDeep,
    activeTint: Colors.blackLight,
    inactiveTint: Colors.gray,
    border: Colors.gray,
  },
  dark: {
    text: Colors.white,
    helperText: Colors.gray,
    link: Colors.blue,
    background: Colors.blackDeep,
    backgroundSoft: Colors.black,
    backgroundAccent: Colors.blackLight,
    activeTint: Colors.white,
    inactiveTint: Colors.gray,
    border: Colors.gray,
  },
  base: {
    smallSpacing: 8,
    largeSpacing: 16,
    borderRadius: 8,
    textSize: 16,
  },
};
