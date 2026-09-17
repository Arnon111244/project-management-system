import React, { memo, useMemo, useCallback } from "react";
import { Modal, Pressable, Platform, View } from "react-native";
import { Text } from "ui/components/text";
import { WheelPicker } from "./WheelPicker";
import { Button } from "ui/components/button";
import { daysInMonth } from "../utils/dateUtils";

interface NativeDatePickerModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: { day: number; month: number; year: number };
  onDateChange: (date: { day: number; month: number; year: number }) => void;
  minYear?: number;
  maxYear?: number;
  isRTL?: boolean;
  rippleConfig?: any;
  theme?: any;
}

export const NativeDatePickerModal = memo(function NativeDatePickerModal({
  open,
  onClose,
  selectedDate,
  onDateChange,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
  isRTL,
  rippleConfig,
  theme,
}: NativeDatePickerModalProps) {
  if (Platform.OS === "web") return null;

  const { day, month, year } = selectedDate;

  const dayCount = useMemo(() => daysInMonth(year, month), [year, month]);

  const dayOptions = useMemo(
    () =>
      Array.from({ length: dayCount }, (_, i) => ({
        label: String(i + 1),
        value: i + 1,
      })),
    [dayCount],
  );

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        label: String(i + 1),
        value: i + 1,
      })),
    [],
  );

  const yearOptions = useMemo(
    () =>
      Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
        label: String(minYear + i),
        value: minYear + i,
      })),
    [minYear, maxYear],
  );

  const handleDayChange = useCallback(
    (newDay: number) => {
      onDateChange({ day: newDay, month, year });
    },
    [day, month, year, onDateChange],
  );

  const handleMonthChange = useCallback(
    (newMonth: number) => {
      const newDayCount = daysInMonth(year, newMonth);
      const newDay = day > newDayCount ? newDayCount : day;
      onDateChange({ day: newDay, month: newMonth, year });
    },
    [day, month, year, onDateChange],
  );

  const handleYearChange = useCallback(
    (newYear: number) => {
      const newDayCount = daysInMonth(newYear, month);
      const newDay = day > newDayCount ? newDayCount : day;
      onDateChange({ day: newDay, month, year: newYear });
    },
    [day, month, year, onDateChange],
  );

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        onPress={onClose}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ pointerEvents: "box-none" }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="max-w-[400px] rounded-[28px] py-[25px] px-[20px] bg-white dark:bg-black mb-2"
          >
            <View className="flex-row justify-around items-center gap-2">
              <PickerColumn
                title="Day"
                items={dayOptions}
                selected={day}
                onChange={handleDayChange}
                isRTL={isRTL}
                theme={theme}
                rippleConfig={rippleConfig}
              />

              <PickerColumn
                title="Month"
                items={monthOptions}
                selected={month}
                onChange={handleMonthChange}
                isRTL={isRTL}
                theme={theme}
                rippleConfig={rippleConfig}
              />

              <PickerColumn
                title="Year"
                items={yearOptions}
                selected={year}
                onChange={handleYearChange}
                isRTL={isRTL}
                theme={theme}
                rippleConfig={rippleConfig}
              />
            </View>

            <View className="flex-row justify-center mt-4">
              <Button
                variant="primary"
                textClassName="text-white font-bold text-sm"
                className="flex-1 max-w-[120px] mx-3"
                label="Done"
                onPress={onClose}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
});

const PickerColumn = memo(function PickerColumn({
  title,
  items,
  selected,
  onChange,
  isRTL,
  theme,
  rippleConfig,
}: any) {
  return (
    <View className="items-center">
      <Text className="text-[14px] text-dark dark:text-white mb-4">
        {title}
      </Text>
      <WheelPicker
        items={items}
        selectedValue={selected}
        onValueChange={onChange}
        isRTL={isRTL}
        theme={theme}
        rippleConfig={rippleConfig}
      />
    </View>
  );
});
