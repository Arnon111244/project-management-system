import { Modal, Pressable, Platform, View } from "react-native";

interface NativeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function NativeDialog({ isOpen, onClose, children }: NativeDialogProps) {
  if (Platform.OS === "web") return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <Pressable
        className="flex-1 "
        onPress={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <View
          className="flex-1 justify-end"
          style={{ pointerEvents: "box-none" }}
        >
          <Pressable
            className="mt-auto rounded-t-2xl p-4 pb-10 bg-surface dark:bg-black border-t border-border dark:border-border-dark"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-3">
              <View
                style={{
                  width: 80,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: "gray",
                  opacity: 0.6,
                }}
              />
            </View>
            {children}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}
