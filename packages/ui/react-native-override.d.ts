import "react-native";
declare module "react-native" {
  interface PressableProps {
    className?: string;
  }
}

// Allow importing images (webpack/Next will turn these into URLs on web; RN packs them natively)
declare module "*.png" {
  const value: string | number | { src?: string; default?: string };
  export default value;
}
