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

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Platform, Pressable, Animated } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { cn } from "ui/utils/cn";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { colors } from "ui/theme";

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

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

interface WebDatePickerProps {
  selectedDate: DateDetails;
  onDateChange: (date: DateDetails) => void;
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

  const [draftDate, setDraftDate] = useState(selectedDate);
  const [isYearMonthPickerOpen, setIsYearMonthPickerOpen] = useState(false);
  const [yearView, setYearView] = useState(false);

  const initialCalendarDate = new Date(
    draftDate.year,
    draftDate.month - 1,
    draftDate.day,
  );
  const [calendarDate, setCalendarDate] = useState(initialCalendarDate);

  useEffect(() => {
    const calendarMonth = calendarDate.getMonth() + 1;
    const calendarYear = calendarDate.getFullYear();

    if (draftDate.month !== calendarMonth || draftDate.year !== calendarYear) {
      setCalendarDate(
        new Date(draftDate.year, draftDate.month - 1, draftDate.day),
      );
    }
  }, [draftDate, calendarDate]);

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
  };

  const handleCloseAnimated = (confirmed = false) => {
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
      if (confirmed) {
        onDateChange(draftDate);
      }
      onClose();
    });
  };

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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  try {
    const ReactDOM: any = require("react-dom");

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
          <Pressable
            style={{ flex: 1 }}
            onPress={() => handleCloseAnimated(false)}
          />
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
          <View className="rounded-lg overflow-hidden border border-border dark:border-border-dark bg-surface dark:bg-black w-80 shadow-2xl">
            <View className="flex-row justify-between items-center p-3 border-b border-border dark:border-border-dark">
              <Pressable
                onPress={() => handleYearNav(-1)}
                className="p-1"
                disabled={currentDisplayYear <= minYear}
              >
                <ChevronLeft
                  size={20}
                  color={colors.brand}
                  className={cn(
                    "dark:text-fg-dark/70",
                    currentDisplayYear <= minYear
                      ? "opacity-30"
                      : "opacity-100",
                  )}
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
                  color={colors.brand}
                  className={cn(
                    "dark:text-fg-dark/70",
                    currentDisplayYear <= minYear && currentDisplayMonth === 0
                      ? "opacity-30"
                      : "opacity-100",
                  )}
                />
              </Pressable>

              <Pressable
                onPress={() => setIsYearMonthPickerOpen(!isYearMonthPickerOpen)}
                className="flex-row items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Text className="text-base font-medium text-fg dark:text-fg-dark mr-1">
                  {currentDisplayMonthName} {currentDisplayYear}
                </Text>
                {isYearMonthPickerOpen ? (
                  <ChevronUp
                    size={16}
                    className="dark:text-fg-dark/70"
                    color={colors.brand}
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="dark:text-fg-dark/70"
                    color={colors.brand}
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
                  color={colors.brand}
                  className={cn(
                    "dark:text-fg-dark/70",
                    currentDisplayYear >= maxYear && currentDisplayMonth === 11
                      ? "opacity-30"
                      : "opacity-100",
                  )}
                />
              </Pressable>

              <Pressable
                onPress={() => handleYearNav(1)}
                className="p-1"
                disabled={currentDisplayYear >= maxYear}
              >
                <ChevronRight
                  size={20}
                  color={colors.brand}
                  className={cn(
                    "dark:text-fg-dark/70",
                    currentDisplayYear >= maxYear
                      ? "opacity-30"
                      : "opacity-100",
                  )}
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
                    }}
                    className="px-3 py-1.5 rounded-md bg-brand/10"
                  >
                    <Text className="text-sm text-brand font-bold">Today</Text>
                  </Pressable>
                </View>

                <View className="max-h-48 overflow-y-auto">
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
                </View>
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
                            "w-full h-full rounded-full justify-center items-center relative",
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

            <View className="flex-row justify-between items-center p-3 border-t border-border dark:border-border-dark mt-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-fg/70 dark:text-fg-dark/70 min-w-[140px]">
                  Selected: {draftDate.day}/{draftDate.month}/{draftDate.year}
                </Text>
                <View>
                  <Button
                    label="Set Date"
                    onPress={() => handleCloseAnimated(true)}
                    className="bg-brand h-8 px-4 rounded-md w-[140px]"
                    textClassName="text-white text-sm font-bold"
                  />
                </View>
              </View>
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
