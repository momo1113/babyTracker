/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  background: '#FAF9F6',
  surface: '#FFFFFF',
  primary: '#D9E4DD',         // soft sage green
  accent: '#A0C4B8',          // muted mint
  textPrimary: '#333333',     // strong neutral text
  textSecondary: '#7D7D7D',   // gentle gray
  border: '#DADADA',
  infoBg: '#EEF3F1',          // subtle info box background
};
