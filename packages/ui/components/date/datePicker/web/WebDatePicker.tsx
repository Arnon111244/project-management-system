import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, FlatList, Animated } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { daysInMonth } from "../utils/dateUtils";

interface WebDatePickerProps {
  selectedDate: { day: number; month: number; year: number };
  onDateChange: (date: { day: number; month: number; year: number }) => void;
  onClose: () => void;
  minYear?: number;
  maxYear?: number;
}

export function WebDatePicker({
  selectedDate,
  onDateChange,
  onClose,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
}: WebDatePickerProps) {
  if (Platform.OS !== "web") return null;
  const { day, month, year } = selectedDate;

  const dayCount = daysInMonth(year, month);
  const dayOptions = Array.from({ length: dayCount }, (_, i) => i + 1);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearOptions = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  const handleDayChange = (newDay: number) =>
    onDateChange({ day: newDay, month, year });
  const handleMonthChange = (newMonth: number) => {
    const newDay = Math.min(day, daysInMonth(year, newMonth));
    onDateChange({ day: newDay, month: newMonth, year });
  };
  const handleYearChange = (newYear: number) => {
    const newDay = Math.min(day, daysInMonth(newYear, month));
    onDateChange({ day: newDay, month, year: newYear });
  };

  const dayRef = useRef<FlatList<number> | null>(null);
  const monthRef = useRef<FlatList<number> | null>(null);
  const yearRef = useRef<FlatList<number> | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const rowHeight = 40;
  const listHeight = 110;

  const scrollToMiddle = (
    ref: React.RefObject<FlatList<number> | null>,
    index: number,
    maxIndex: number,
  ) => {
    if (!ref.current) return false;
    const safeIndex = Math.min(Math.max(index, 0), maxIndex);
    const visibleItemsCount = Math.floor(listHeight / rowHeight);
    const middleIndex = Math.floor(visibleItemsCount / 2);
    let targetOffset = safeIndex * rowHeight;

    if (maxIndex >= visibleItemsCount) {
      targetOffset = safeIndex * rowHeight - middleIndex * rowHeight;
      const maxOffset =
        maxIndex * rowHeight - (visibleItemsCount - 1) * rowHeight;
      targetOffset = Math.max(0, Math.min(targetOffset, maxOffset));
    }

    try {
      ref.current.scrollToOffset({
        offset: targetOffset,
        animated: true,
      });
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (isInitialized) return;
    const initializeScroll = () => {
      const dayIndex = dayOptions.indexOf(day);
      const monthIndex = monthOptions.indexOf(month);
      const yearIndex = yearOptions.indexOf(year);

      const daySuccess = scrollToMiddle(
        dayRef,
        dayIndex,
        dayOptions.length - 1,
      );
      const monthSuccess = scrollToMiddle(
        monthRef,
        monthIndex,
        monthOptions.length - 1,
      );
      const yearSuccess = scrollToMiddle(
        yearRef,
        yearIndex,
        yearOptions.length - 1,
      );

      if (daySuccess && monthSuccess && yearSuccess) {
        setIsInitialized(true);
      } else {
        setTimeout(initializeScroll, 50);
      }
    };
    const timeoutId = setTimeout(initializeScroll, 150);
    return () => clearTimeout(timeoutId);
  }, [day, month, year, dayOptions, monthOptions, yearOptions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    const dayIndex = dayOptions.indexOf(day);
    const monthIndex = monthOptions.indexOf(month);
    const yearIndex = yearOptions.indexOf(year);
    scrollToMiddle(dayRef, dayIndex, dayOptions.length - 1);
    scrollToMiddle(monthRef, monthIndex, monthOptions.length - 1);
    scrollToMiddle(yearRef, yearIndex, yearOptions.length - 1);
  }, [day, month, year, dayOptions, monthOptions, yearOptions, isInitialized]);

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCloseAnimated = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  try {
    const ReactDOM: any = require("react-dom");

    const renderList = (
      options: number[],
      selected: number,
      onSelect: (val: number) => void,
      ref: React.RefObject<FlatList<number> | null>,
    ) => {
      const selectedIndex = options.indexOf(selected);
      return (
        <FlatList
          ref={ref}
          data={options}
          className="h-[110px]"
          keyExtractor={(item) => String(item)}
          getItemLayout={(data, index) => ({
            length: rowHeight,
            offset: rowHeight * index,
            index,
          })}
          initialScrollIndex={Math.max(
            0,
            Math.min(selectedIndex, options.length - 1),
          )}
          onLayout={() => {
            if (!isInitialized) {
              setTimeout(() => {
                const index = options.indexOf(selected);
                scrollToMiddle(ref, index, options.length - 1);
              }, 50);
            }
          }}
          onScrollToIndexFailed={() => {
            setTimeout(() => {
              const index = options.indexOf(selected);
              scrollToMiddle(ref, index, options.length - 1);
            }, 100);
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              className={`py-2 px-3 border-b border-border dark:border-border-dark ${
                item === selected ? "bg-[#E0E0E036]" : ""
              }`}
              style={{ height: rowHeight }}
            >
              <Text
                className={`text-center ${
                  item === selected
                    ? "text-black font-bold"
                    : "text-gray dark:text-fg-dark"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      );
    };

    return ReactDOM.createPortal(
      <>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 100,
            opacity: opacityAnim,
            ...(Platform.OS === "web" && {
              position: "fixed" as any,
            }),
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={handleCloseAnimated} />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [
              { translateX: "-50%" },
              { translateY: "-50%" },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim,
            zIndex: 101,
            pointerEvents: "auto",
            ...(Platform.OS === "web" && {
              position: "fixed" as any,
            }),
          }}
        >
          <View className="rounded-lg overflow-hidden border border-border dark:border-border-dark bg-surface dark:bg-black p-4 w-96">
            <View className="flex-row gap-3 items-start justify-center">
              <View className="flex-1">
                <Text className="text-xs text-fg/60 dark:text-fg-dark/60 mb-1 text-center ms-[-15px]">
                  Day
                </Text>
                {renderList(dayOptions, day, handleDayChange, dayRef)}
              </View>

              <View className="flex-1">
                <Text className="text-xs text-fg/60 dark:text-fg-dark/60 mb-1 text-center ms-[-15px]">
                  Month
                </Text>
                {renderList(monthOptions, month, handleMonthChange, monthRef)}
              </View>

              <View className="flex-1">
                <Text className="text-xs text-fg/60 dark:text-fg-dark/60 mb-1 text-center ms-[-15px]">
                  Year
                </Text>
                {renderList(yearOptions, year, handleYearChange, yearRef)}
              </View>
            </View>

            <View className="flex-row justify-center mt-4">
              <Button
                variant="primary"
                textClassName="text-white dark:text-white text-sm font-medium"
                className="flex-1 max-w-[120px] mx-3"
                label="Done"
                onPress={handleCloseAnimated}
              />
            </View>
          </View>
        </Animated.View>
      </>,
      (globalThis as any).document?.body,
    );
  } catch {
    return null;
  }
}
