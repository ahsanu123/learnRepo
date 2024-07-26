import { BrandVariants, createDarkTheme, createLightTheme, Theme } from "@fluentui/react-components";

export const reddish: BrandVariants = {
  10: "#060203",
  20: "#261018",
  30: "#411528",
  40: "#581935",
  50: "#6E1C41",
  60: "#85204F",
  70: "#9C255C",
  80: "#B22C69",
  90: "#C63877",
  100: "#D54B84",
  110: "#E06091",
  120: "#E9759F",
  130: "#F08AAC",
  140: "#F69FBA",
  150: "#FBB4C9",
  160: "#FEC9D8"
};

export const reddishThemeLight: Theme = {
  ...createLightTheme(reddish),
};

export const reddishThemeDark: Theme = {
  ...createDarkTheme(reddish),
};


reddishThemeDark.colorBrandForeground1 = reddish[110];
reddishThemeDark.colorBrandForeground2 = reddish[120];
