import React, {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from "react";
import { View, Animated, StyleSheet, Platform, Modal } from "react-native";
import { Text } from "ui/components/text";
import { AlertCircle } from "lucide-react-native";

interface ToastMessageProps {
  message: string;
  className?: string;
  color?: string;
  duration?: number;
  onClose?: () => void;
  icon?: React.ReactNode;
  textColor?: string;
}

const ToastMessageComponent: React.FC<ToastMessageProps> = ({
  message,
  color = "#dc2626",
  className,
  duration = 2000,
  onClose,
  icon,
  textColor = "#000000",
}) => {
  const offScreenValue = -150;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(offScreenValue)).current;
  const [visible, setVisible] = useState(true);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateXAnim, {
        toValue: offScreenValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      if (onClose) onClose();
    });
  }, [fadeAnim, translateXAnim, onClose, offScreenValue]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateXAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [fadeAnim, translateXAnim, duration, handleClose]);

  const baseClasses = useMemo(() => {
    return `flex-row justify-start items-center min-w-[280px] max-w-[90vw] md:max-w-[500px] border-[1px] px-4 py-3 shadow-lg mx-3 ${className || ""}`;
  }, [className]);

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: color,
    }),
    [color],
  );

  const renderIcon = useMemo(() => {
    if (icon) {
      return icon;
    }

    return <AlertCircle color={color} width={20} height={20} />;
  }, [icon, color]);

  if (!visible) return null;

  const wrapperStyle = [
    styles.wrapper,
    {
      opacity: fadeAnim,
      transform: [{ translateX: translateXAnim }],
      top: Platform.OS === "android" ? 40 : 60,
    },
  ];

  return (
    <Modal transparent animationType="none" pointerEvents="box-none">
      <Animated.View style={wrapperStyle} pointerEvents="box-none">
        <View className={baseClasses} style={containerStyle}>
          {renderIcon}
          <Text
            className="text-sm mx-3 font-semibold flex-1"
            style={{ color: textColor }}
          >
            {message}
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    zIndex: 9999,
    ...Platform.select({
      web: {
        position: "fixed" as any,
        maxWidth: "100%",
      },
    }),
  },
});

export const ToastMessage = React.memo(ToastMessageComponent);
export default ToastMessage;
