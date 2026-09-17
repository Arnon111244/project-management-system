const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Platform, Pressable, Animated } from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { cn } from "ui/utils/cn";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react-native";
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

interface YearMonthQuickPickerProps {
  initialMonth: number;
  initialYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
  minYear: number;
  maxYear: number;
}

const YearMonthQuickPicker: React.FC<YearMonthQuickPickerProps> = ({
  initialMonth,
  initialYear,
  onSelect,
  onClose,
  minYear,
  maxYear,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    [],
  );

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }
    return years;
  }, [minYear, maxYear]);

  const ListContainer = (
    <View className="flex-row justify-center p-4 h-60">
      <View className="w-1/2 p-2 overflow-y-scroll border-r border-border dark:border-border-dark">
        {monthOptions.map((m) => {
          const isDisabled =
            (selectedYear === maxYear && m > 12) ||
            (selectedYear === minYear && m < 1);

          return (
            <Pressable
              key={`month-${m}`}
              onPress={() => !isDisabled && setSelectedMonth(m)}
              className={cn(
                "py-2 text-center",
                m === selectedMonth
                  ? "bg-primary/10 dark:bg-primary-dark/10"
                  : "",
                isDisabled ? "opacity-50" : "",
              )}
              disabled={isDisabled}
            >
              <Text
                className={cn(
                  "text-center text-base",
                  m === selectedMonth
                    ? "text-brand dark:text-brand font-bold"
                    : isDisabled
                      ? "text-fg/40 dark:text-fg-dark/40"
                      : "text-fg dark:text-fg-dark",
                )}
              >
                {m}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="w-1/2 p-2 overflow-y-scroll">
        {yearOptions.map((y) => {
          const isDisabled = y > maxYear || y < minYear;

          return (
            <Pressable
              key={`year-${y}`}
              onPress={() => !isDisabled && setSelectedYear(y)}
              className={cn(
                "py-2 text-center",
                y === selectedYear
                  ? "bg-primary/10 dark:bg-primary-dark/10"
                  : "",
                isDisabled ? "opacity-50" : "",
              )}
              disabled={isDisabled}
            >
              <Text
                className={cn(
                  "text-center text-base",
                  y === selectedYear
                    ? "text-brand dark:text-brand font-bold"
                    : isDisabled
                      ? "text-fg/40 dark:text-fg-dark/40"
                      : "text-fg dark:text-fg-dark",
                )}
              >
                {y}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 101,

          ...(Platform.OS === "web" && {
            position: "fixed" as any,
          }),
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 101,
          pointerEvents: "auto",
          ...(Platform.OS === "web" && {
            position: "fixed" as any,
          }),
        }}
      >
        <View className="rounded-lg bg-surface dark:bg-black w-64 shadow-2xl">
          {ListContainer}

          <View className="flex-row justify-center p-2 border-t border-border dark:border-border-dark">
            <Button
              label="OK"
              onPress={() => onSelect(selectedMonth, selectedYear)}
              textClassName="text-white dark:text-white text-sm font-medium"
              className="mx-2 bg-brand h-8 px-4 rounded-md"
              disabled={selectedYear > maxYear || selectedYear < minYear}
            />
          </View>
        </View>
      </Animated.View>
    </>
  );
};

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
  }, [draftDate]);

  const currentDisplayMonth = calendarDate.getMonth();
  const currentDisplayYear = calendarDate.getFullYear();
  const currentDisplayMonthName = new Date(
    currentDisplayYear,
    currentDisplayMonth,
    1,
  ).toLocaleString("en-US", { month: "long" });

  const dayGrid: DayItem[] = useMemo(() => {
    const date = new Date(currentDisplayYear, currentDisplayMonth, 1);
    const days: DayItem[] = [];

    const startDay = date.getDay();
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

  const handleDaySelect = (dayObj: DayItem) => {
    const newDate = new Date(dayObj.date);

    if (newDate.getFullYear() > maxYear) {
      return;
    }

    if (newDate.getFullYear() < minYear) {
      return;
    }

    const isDayInCurrentDisplayMonth =
      dayObj.date.getMonth() === currentDisplayMonth &&
      dayObj.date.getFullYear() === currentDisplayYear;

    if (isDayInCurrentDisplayMonth) {
      setDraftDate({
        day: dayObj.value,
        month: currentDisplayMonth + 1,
        year: currentDisplayYear,
      });
    } else {
      setCalendarDate(newDate);
      setDraftDate({
        day: dayObj.value,
        month: newDate.getMonth() + 1,
        year: newDate.getFullYear(),
      });
    }
  };

  const handleYearMonthSelect = (newMonth: number, newYear: number) => {
    if (newYear > maxYear || newYear < minYear) {
      return;
    }

    if (newYear === maxYear && newMonth > 12) {
      return;
    }

    if (newYear === minYear && newMonth < 1) {
      return;
    }

    setCalendarDate(new Date(newYear, newMonth - 1, 1));

    const currentDay = draftDate.day;
    const daysInNewMonth = daysInMonth(newYear, newMonth);

    setDraftDate((prevDraft) => ({
      day: Math.min(currentDay, daysInNewMonth),
      month: newMonth,
      year: newYear,
    }));

    setIsYearMonthPickerOpen(false);
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

  const headerDisplayDateObject = new Date(
    draftDate.year,
    draftDate.month - 1,
    draftDate.day,
  );
  const headerDisplayDate = headerDisplayDateObject.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  );

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
            <View className="bg-brand p-4 pt-3 text-white">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-2xl font-medium">
                  {headerDisplayDate}
                </Text>
              </View>
            </View>

            <View className="p-3">
              <View className="flex-row justify-between items-center px-2 mb-2">
                <Pressable
                  onPress={() => setIsYearMonthPickerOpen(true)}
                  className="flex-row items-center p-2 rounded-md active:bg-gray-100 dark:active:bg-charcoal"
                >
                  <Text className="text-base font-medium text-fg dark:text-fg-dark me-2">
                    {currentDisplayMonthName} {currentDisplayYear}
                  </Text>
                  <ChevronDown
                    size={16}
                    color={colors.brand}
                    className="dark:text-fg-dark"
                  />
                </Pressable>

                <View className="flex-row">
                  <Pressable
                    onPress={() => handleMonthNav(-1)}
                    className="p-2"
                    disabled={
                      currentDisplayYear <= minYear && currentDisplayMonth === 0
                    }
                  >
                    <ChevronLeft
                      size={24}
                      color={colors.brand}
                      className={cn(
                        "dark:text-fg-dark",
                        currentDisplayYear <= minYear &&
                          currentDisplayMonth === 0
                          ? "opacity-30"
                          : "",
                      )}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleMonthNav(1)}
                    className="p-2"
                    disabled={
                      currentDisplayYear >= maxYear &&
                      currentDisplayMonth === 11
                    }
                  >
                    <ChevronRight
                      size={24}
                      color={colors.brand}
                      className={cn(
                        "dark:text-fg-dark",
                        currentDisplayYear >= maxYear &&
                          currentDisplayMonth === 11
                          ? "opacity-30"
                          : "",
                      )}
                    />
                  </Pressable>
                </View>
              </View>

              <View className="px-2">
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

                    const isToday =
                      dayItem.date.toDateString() === new Date().toDateString();

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
                                ? "border border-black/50 dark:border-white/50"
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

            <View className="flex-row justify-end p-2 pe-4">
              <Button
                label="Set Date"
                onPress={() => handleCloseAnimated(true)}
                textClassName="text-white dark:text-white text-sm font-medium"
              />
            </View>
          </View>
        </Animated.View>

        {isYearMonthPickerOpen && (
          <YearMonthQuickPicker
            initialMonth={currentDisplayMonth + 1}
            initialYear={currentDisplayYear}
            onClose={() => setIsYearMonthPickerOpen(false)}
            onSelect={handleYearMonthSelect}
            minYear={minYear}
            maxYear={maxYear}
          />
        )}
      </>,
      (globalThis as any).document?.body,
    );
  } catch {
    return null;
  }
}
