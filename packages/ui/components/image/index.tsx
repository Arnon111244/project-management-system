import * as React from "react";
import {
  Platform,
  Image as RNImage,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Text } from "ui/components/text";

type ImageProps = {
  source?: any;
  src?: any;
  width?: number;
  height?: number;
  alt?: string;
  style?: StyleProp<ViewStyle | ImageStyle> | React.CSSProperties;
  resizeMode?: "contain" | "cover" | "stretch";
  fallback?: React.ReactNode;
  onError?: () => void;
  className?: string; // web only
  [key: string]: any;
};

function resolveSource(src: any): { uri?: string } | null {
  if (!src) return null;
  if (typeof src === "number") return src as any;
  if (typeof src === "string") return { uri: src };
  if (typeof src === "object") {
    if (typeof src.uri === "string") return { uri: src.uri };
    if (typeof src.default === "string") return { uri: src.default };
    if (typeof src.src === "string") return { uri: src.src };
  }
  return null;
}

// ----------------- Web -----------------
function WebImage(props: ImageProps) {
  const {
    source,
    src,
    width,
    height,
    alt,
    style,
    resizeMode = "contain",
    fallback,
    onError,
    className,
    ...rest
  } = props;

  const [failed, setFailed] = React.useState(false);
  const input = source ?? src;
  const resolved = React.useMemo(() => resolveSource(input), [input]);

  const imgSrc =
    (resolved && resolved.uri) ||
    (typeof input === "string" ? input : input?.src);

  if (!imgSrc || failed) return fallback ?? <Text>📷</Text>;

  const mergedStyle: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    objectFit: resizeMode === "contain" ? "contain" : "cover",
    ...(style as React.CSSProperties),
  };

  return (
    <img
      src={imgSrc}
      alt={alt ?? "image"}
      className={className}
      style={mergedStyle}
      onError={() => {
        setFailed(true);
        onError?.();
      }}
      {...rest}
    />
  );
}

// ----------------- React Native -----------------
function NativeImage(props: ImageProps) {
  const {
    source,
    src,
    width,
    height,
    alt,
    style,
    resizeMode = "contain",
    fallback,
    onError,
    ...rest
  } = props;

  const [failed, setFailed] = React.useState(false);
  const input = source ?? src;
  const resolved = React.useMemo(() => resolveSource(input), [input]);

  if (failed || !resolved)
    return fallback ?? <Text style={{ fontSize: 24 }}>📱</Text>;

  const imageStyle: StyleProp<ImageStyle> = [
    width || height ? { width, height } : null,
    style as StyleProp<ImageStyle>,
  ];

  return (
    <RNImage
      source={resolved as any}
      style={imageStyle}
      resizeMode={resizeMode}
      accessibilityLabel={alt}
      onError={() => {
        setFailed(true);
        onError?.();
      }}
      {...rest}
    />
  );
}

// ----------------- Wrapper -----------------
export function ImageComponent(props: ImageProps) {
  if (Platform.OS === "web") {
    return <WebImage {...props} />;
  }
  return <NativeImage {...props} />;
}

export const Image = React.memo(ImageComponent);
Image.displayName = "Image";
