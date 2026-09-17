import React, { memo, useMemo, useState, useEffect, useRef } from "react";
import {
  Modal,
  Pressable,
  Platform,
  View,
  ScrollView,
  Animated,
} from "react-native";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { daysInMonth } from "../utils/dateUtils";
import { cn } from "ui/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { colors } from "ui/theme";

interface DateDetails {
  day: number;
  month: number;
  year: number;
}

interface DayItem {
  value: number;
  isCurrentMonth: boolean;
  date: Date;
}

interface NativeDatePickerModalProps {
  open: boolean;
  onClose: () => void;
  selectedDate: DateDetails;
  onDateChange: (date: DateDetails) => void;
  minYear?: number;
  maxYear?: number;
  isRTL?: boolean;
  rippleConfig?: any;
  theme?: any;
}

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  const [draftDate, setDraftDate] = useState(selectedDate);
  const [isYearMonthPickerOpen, setIsYearMonthPickerOpen] = useState(false);
  const [yearView, setYearView] = useState(false);

  const [calendarDate, setCalendarDate] = useState(
    new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day),
  );

  useEffect(() => {
    setDraftDate(selectedDate);
    setCalendarDate(
      new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day),
    );
  }, [selectedDate]);

  const currentDisplayMonth = calendarDate.getMonth();
  const currentDisplayYear = calendarDate.getFullYear();
  const currentDisplayMonthName = MONTHS[currentDisplayMonth];

  const yearList: number[] = useMemo<number[]>(() => {
    const years: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  }, [minYear, maxYear]);

  const dayGrid: DayItem[] = useMemo(() => {
    const date = new Date(currentDisplayYear, currentDisplayMonth, 1);
    const days: DayItem[] = [];

    let startDay = date.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const currentMonthDays = daysInMonth(
      currentDisplayYear,
      currentDisplayMonth + 1,
    );
    const prevMonthDays = daysInMonth(currentDisplayYear, currentDisplayMonth);

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        value: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(
          currentDisplayYear,
          currentDisplayMonth - 1,
          prevMonthDays - i,
        ),
      });
    }

    for (let i = 1; i <= currentMonthDays; i++) {
      days.push({
        value: i,
        isCurrentMonth: true,
        date: new Date(currentDisplayYear, currentDisplayMonth, i),
      });
    }

    const totalSlots = 42;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        value: i,
        isCurrentMonth: false,
        date: new Date(currentDisplayYear, currentDisplayMonth + 1, i),
      });
    }

    return days.slice(0, 42);
  }, [currentDisplayMonth, currentDisplayYear]);

  const handleMonthNav = (direction: -1 | 1) => {
    setCalendarDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);

      if (newDate.getFullYear() > maxYear) {
        const lastDate = new Date(maxYear, 11, 1);
        const daysInLastMonth = daysInMonth(maxYear, 12);
        const newDay = Math.min(draftDate.day, daysInLastMonth);

        setDraftDate({
          day: newDay,
          month: 12,
          year: maxYear,
        });

        return lastDate;
      }

      if (newDate.getFullYear() < minYear) {
        const firstDate = new Date(minYear, 0, 1);
        const daysInFirstMonth = daysInMonth(minYear, 1);
        const newDay = Math.min(draftDate.day, daysInFirstMonth);

        setDraftDate({
          day: newDay,
          month: 1,
          year: minYear,
        });

        return firstDate;
      }

      const newMonth = newDate.getMonth() + 1;
      const newYear = newDate.getFullYear();
      const currentDay = draftDate.day;
      const daysInNewMonth = daysInMonth(newYear, newMonth);

      setDraftDate((prevDraft) => ({
        day: Math.min(currentDay, daysInNewMonth),
        month: newMonth,
        year: newYear,
      }));

      return newDate;
    });
  };

  const handleYearNav = (direction: -1 | 1) => {
    setCalendarDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(prevDate.getFullYear() + direction);

      if (newDate.getFullYear() > maxYear) {
        const lastDate = new Date(maxYear, calendarDate.getMonth(), 1);
        const daysInMonthForMaxYear = daysInMonth(
          maxYear,
          calendarDate.getMonth() + 1,
        );
        const newDay = Math.min(draftDate.day, daysInMonthForMaxYear);

        setDraftDate({
          day: newDay,
          month: calendarDate.getMonth() + 1,
          year: maxYear,
        });

        return lastDate;
      }

      if (newDate.getFullYear() < minYear) {
        const firstDate = new Date(minYear, calendarDate.getMonth(), 1);
        const daysInMonthForMinYear = daysInMonth(
          minYear,
          calendarDate.getMonth() + 1,
        );
        const newDay = Math.min(draftDate.day, daysInMonthForMinYear);

        setDraftDate({
          day: newDay,
          month: calendarDate.getMonth() + 1,
          year: minYear,
        });

        return firstDate;
      }

      const newMonth = newDate.getMonth() + 1;
      const newYear = newDate.getFullYear();
      const currentDay = draftDate.day;
      const daysInNewMonth = daysInMonth(newYear, newMonth);

      setDraftDate((prevDraft) => ({
        day: Math.min(currentDay, daysInNewMonth),
        month: newMonth,
        year: newYear,
      }));

      return newDate;
    });
  };

  const handleDaySelect = (dayObj: DayItem) => {
    const newDate = new Date(dayObj.date);

    if (newDate.getFullYear() > maxYear) {
      return;
    }

    if (newDate.getFullYear() < minYear) {
      return;
    }

    setCalendarDate(newDate);
    setDraftDate({
      day: dayObj.value,
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    });
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (calendarDate.getFullYear() > maxYear) {
      return;
    }

    if (calendarDate.getFullYear() === maxYear && monthIndex > 11) {
      return;
    }

    if (calendarDate.getFullYear() < minYear) {
      return;
    }

    setCalendarDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);

      const daysInNewMonth = daysInMonth(newDate.getFullYear(), monthIndex + 1);
      const newDay = Math.min(draftDate.day, daysInNewMonth);

      setDraftDate({
        day: newDay,
        month: monthIndex + 1,
        year: newDate.getFullYear(),
      });

      return newDate;
    });
    setIsYearMonthPickerOpen(false);
  };

  const handleYearSelect = (year: number) => {
    if (year > maxYear) {
      return;
    }

    if (year < minYear) {
      return;
    }

    setCalendarDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);

      const daysInNewMonth = daysInMonth(year, newDate.getMonth() + 1);
      const newDay = Math.min(draftDate.day, daysInNewMonth);

      setDraftDate({
        day: newDay,
        month: newDate.getMonth() + 1,
        year: year,
      });

      return newDate;
    });
    setYearView(false);
    setIsYearMonthPickerOpen(false);
  };

  const handleFinalOK = () => {
    onDateChange(draftDate);
    onClose();
  };

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (open) {
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
    }
  }, [open]);

  const modalAnimationStyle = {
    opacity: opacityAnim,
    transform: [{ scale: scaleAnim }],
  };

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-[rgba(0,0,0,0.3)] justify-center items-center"
        onPress={onClose}
      >
        <Animated.View
          style={modalAnimationStyle}
          className="w-80 rounded-lg overflow-hidden bg-white dark:bg-black shadow-2xl"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="flex-row justify-between items-center p-3 border-b border-border dark:border-border-dark">
              <Pressable
                onPress={() => handleYearNav(-1)}
                className="p-1"
                disabled={currentDisplayYear <= minYear}
              >
                <ChevronLeft
                  size={20}
                  color={
                    currentDisplayYear <= minYear
                      ? colors.mediumGray
                      : colors.brand
                  }
                  className={cn("dark:text-fg-dark/70")}
                />
              </Pressable>

              <Pressable
                onPress={() => handleMonthNav(-1)}
                className="p-1"
                disabled={
                  currentDisplayYear <= minYear && currentDisplayMonth === 0
                }
              >
                <ChevronLeft
                  size={20}
                  color={
                    currentDisplayYear <= minYear
                      ? colors.mediumGray
                      : colors.brand
                  }
                  className={cn("dark:text-fg-dark/70")}
                />
              </Pressable>

              <Pressable
                onPress={() => setIsYearMonthPickerOpen(!isYearMonthPickerOpen)}
                className="flex-row items-center px-2 py-1 rounded active:bg-gray-100 dark:active:bg-gray-800"
              >
                <Text className="text-base font-medium text-fg dark:text-fg-dark mr-1">
                  {currentDisplayMonthName} {currentDisplayYear}
                </Text>
                {isYearMonthPickerOpen ? (
                  <ChevronUp
                    color={colors.brand}
                    size={16}
                    className="dark:text-fg-dark/70"
                  />
                ) : (
                  <ChevronDown
                    color={colors.brand}
                    size={16}
                    className="dark:text-fg-dark/70"
                  />
                )}
              </Pressable>

              <Pressable
                onPress={() => handleMonthNav(1)}
                className="p-1"
                disabled={
                  currentDisplayYear >= maxYear && currentDisplayMonth === 11
                }
              >
                <ChevronRight
                  size={20}
                  color={
                    currentDisplayYear >= maxYear && currentDisplayMonth === 11
                      ? colors.mediumGray
                      : colors.brand
                  }
                  className={cn("dark:text-fg-dark/70")}
                />
              </Pressable>

              <Pressable
                onPress={() => handleYearNav(1)}
                className="p-1"
                disabled={currentDisplayYear >= maxYear}
              >
                <ChevronRight
                  size={20}
                  color={
                    currentDisplayYear >= maxYear && currentDisplayMonth === 11
                      ? colors.mediumGray
                      : colors.brand
                  }
                  className={cn("dark:text-fg-dark/70")}
                />
              </Pressable>
            </View>

            {isYearMonthPickerOpen && (
              <View className="border-b border-border dark:border-border-dark p-3 bg-gray-50 dark:bg-gray-900">
                <View className="flex-row justify-between items-center mb-2">
                  <Pressable
                    onPress={() => setYearView(!yearView)}
                    className="px-3 py-1.5 rounded-md bg-brand dark:bg-brand"
                  >
                    <Text className="text-sm text-white dark:text-white font-bold">
                      {yearView ? "Show Months" : "Show Years"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      const today = new Date();
                      if (today.getFullYear() > maxYear) {
                        const lastDayOfMaxYear = new Date(maxYear, 11, 31);
                        setCalendarDate(lastDayOfMaxYear);
                        setDraftDate({
                          day: 31,
                          month: 12,
                          year: maxYear,
                        });
                      } else {
                        setCalendarDate(today);
                        setDraftDate({
                          day: today.getDate(),
                          month: today.getMonth() + 1,
                          year: today.getFullYear(),
                        });
                      }
                      setIsYearMonthPickerOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-md bg-brand/10"
                  >
                    <Text className="text-sm text-brand font-bold">Today</Text>
                  </Pressable>
                </View>

                <ScrollView style={{ maxHeight: 192 }}>
                  {yearView ? (
                    <View className="flex-row flex-wrap">
                      {yearList.map((year) => (
                        <Pressable
                          key={year}
                          onPress={() => handleYearSelect(year)}
                          className={cn(
                            "w-1/4 p-2 items-center justify-center",
                            year === currentDisplayYear
                              ? "bg-brand rounded-md"
                              : "",
                          )}
                          disabled={year > maxYear || year < minYear}
                        >
                          <Text
                            className={cn(
                              "text-sm",
                              year === currentDisplayYear
                                ? "text-white font-bold"
                                : year > maxYear || year < minYear
                                  ? "text-fg/40 dark:text-fg-dark/40"
                                  : "text-fg dark:text-fg-dark",
                            )}
                          >
                            {year}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <View className="flex-row flex-wrap">
                      {MONTHS.map((month, index) => {
                        const isDisabled =
                          (currentDisplayYear === maxYear && index > 11) ||
                          (currentDisplayYear === minYear && index < 0) ||
                          currentDisplayYear > maxYear ||
                          currentDisplayYear < minYear;

                        return (
                          <Pressable
                            key={month}
                            onPress={() =>
                              !isDisabled && handleMonthSelect(index)
                            }
                            className={cn(
                              "w-1/3 p-2 items-center justify-center",
                              index === currentDisplayMonth &&
                                calendarDate.getFullYear() ===
                                  currentDisplayYear
                                ? "bg-brand rounded-md"
                                : "",
                              isDisabled ? "opacity-50" : "",
                            )}
                            disabled={isDisabled}
                          >
                            <Text
                              className={cn(
                                "text-sm",
                                index === currentDisplayMonth &&
                                  calendarDate.getFullYear() ===
                                    currentDisplayYear
                                  ? "text-white font-bold"
                                  : isDisabled
                                    ? "text-fg/40 dark:text-fg-dark/40"
                                    : "text-fg dark:text-fg-dark",
                              )}
                            >
                              {month}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            <View className="p-3">
              <View className="px-1">
                <View className="flex-row mb-1">
                  {WEEK_DAYS.map((d, index) => (
                    <View key={`${d}-${index}`} className="flex-1 items-center">
                      <Text className="text-sm font-medium text-fg/70 dark:text-fg-dark/70">
                        {d}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="flex-row flex-wrap">
                  {dayGrid.map((dayItem: DayItem, index) => {
                    const isSelected =
                      dayItem.isCurrentMonth &&
                      dayItem.value === draftDate.day &&
                      dayItem.date.getMonth() === draftDate.month - 1 &&
                      dayItem.date.getFullYear() === draftDate.year;

                    const isToday = (() => {
                      const today = new Date();
                      return (
                        dayItem.isCurrentMonth &&
                        dayItem.value === today.getDate() &&
                        dayItem.date.getMonth() === today.getMonth() &&
                        dayItem.date.getFullYear() === today.getFullYear()
                      );
                    })();

                    const isDisabled =
                      dayItem.date.getFullYear() > maxYear ||
                      dayItem.date.getFullYear() < minYear ||
                      (dayItem.date.getFullYear() === maxYear &&
                        dayItem.date.getMonth() > 11) ||
                      (dayItem.date.getFullYear() === minYear &&
                        dayItem.date.getMonth() < 0);

                    return (
                      <View
                        key={index}
                        className="w-[14.28%] aspect-square p-0.5"
                      >
                        <Pressable
                          onPress={() =>
                            !isDisabled && handleDaySelect(dayItem)
                          }
                          className={cn(
                            "w-full h-full rounded-full justify-center items-center",
                            isSelected
                              ? "bg-brand"
                              : isToday && !isDisabled
                                ? "border border-brand"
                                : "",
                            isDisabled ? "opacity-40" : "",
                          )}
                          disabled={isDisabled}
                        >
                          <Text
                            className={cn(
                              "text-center",
                              isSelected
                                ? "text-white font-bold"
                                : dayItem.isCurrentMonth && !isDisabled
                                  ? "text-fg dark:text-fg-dark"
                                  : "text-fg/50 dark:text-fg-dark/50",
                              isToday && !isSelected && !isDisabled
                                ? "text-brand font-medium"
                                : "",
                              isDisabled
                                ? "text-fg/30 dark:text-fg-dark/30"
                                : "",
                            )}
                          >
                            {dayItem.value}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-between items-center p-3 border-t border-border dark:border-border-dark mt-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-fg/70 dark:text-fg-dark/70 min-w-[140px]">
                  Selected: {draftDate.day}/{draftDate.month}/{draftDate.year}
                </Text>
                <View>
                  <Button
                    label="Set Date"
                    onPress={handleFinalOK}
                    className="bg-brand h-8 px-4 rounded-md w-[110px]"
                    textClassName="text-white text-sm font-bold"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});
