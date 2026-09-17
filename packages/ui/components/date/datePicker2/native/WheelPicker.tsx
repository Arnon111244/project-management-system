import React, { memo, useMemo, useCallback, useEffect, useRef } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Text } from "ui/components/text";
import { cn } from "ui/utils/cn";

export const WheelPicker = memo(function WheelPicker({
  items,
  selectedValue,
  onValueChange,
  theme,
  rippleConfig,
}: any) {
  const textColor = theme === "dark" ? "#FFFFFF" : "#0B0B0C";
  const mutedColor = theme === "dark" ? "#AFAFAF" : "#6B7280";
  const borderColor = theme === "dark" ? "#404040" : "#E5E5E5";
  const flatListRef = useRef<FlatList>(null);

  const selectedIndex = useMemo(
    () => items.findIndex((i: any) => i.value === selectedValue),
    [items, selectedValue],
  );

  useEffect(() => {
    if (flatListRef.current && selectedIndex >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: selectedIndex,
          animated: false,
        });
      }, 100);
    }
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (value: number) => {
      onValueChange(value);
    },
    [onValueChange],
  );

  const getItemLayout = useCallback((_: any, index: number) => {
    return { length: 44, offset: 44 * index, index };
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const isSelected = index === selectedIndex;
      const distanceFromCenter = Math.abs(index - selectedIndex);

      let opacity = 1;
      if (distanceFromCenter === 1) {
        opacity = 0.7;
      } else if (distanceFromCenter === 2) {
        opacity = 0.5;
      } else if (distanceFromCenter > 2) {
        opacity = 0.3;
      }

      return (
        <Pressable
          onPress={() => handleSelect(item.value)}
          className={cn(
            "h-[44px] justify-center items-center",
            isSelected && "border-t border-b",
          )}
          style={[
            isSelected && {
              borderTopColor: borderColor,
              borderBottomColor: borderColor,
              backgroundColor: isSelected
                ? theme === "dark"
                  ? "#FFFFFF1A"
                  : "#0000000D"
                : "transparent",
            },
          ]}
          android_ripple={rippleConfig}
        >
          <Text
            className={cn(
              "text-center text-sm",
              isSelected ? "font-semibold" : "font-normal",
            )}
            style={{
              color: isSelected ? textColor : mutedColor,
              opacity,
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    },
    [
      selectedIndex,
      textColor,
      mutedColor,
      theme,
      handleSelect,
      rippleConfig,
      borderColor,
    ],
  );

  return (
    <View className="h-[220px] w-[100px] rounded-[12px] overflow-hidden bg-white dark:bg-black">
      <View
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 44,
          marginTop: -22,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: borderColor,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <FlatList
        ref={flatListRef}
        data={items}
        keyExtractor={(item) => item.value.toString()}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        snapToInterval={44}
        decelerationRate={0.1}
        onMomentumScrollEnd={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const index = Math.round(offsetY / 44);
          if (items[index]) {
            handleSelect(items[index].value);
          }
        }}
        initialScrollIndex={selectedIndex}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
            });
          });
        }}
        contentContainerStyle={{
          paddingVertical: 88,
        }}
      />
    </View>
  );
});
