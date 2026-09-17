import * as React from "react";
import { View, Pressable } from "react-native";
import { Text } from "ui/components/text";
import { TextField } from "ui/components/textfield";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { cn } from "ui/utils/cn";
import { Select } from "ui/components/selectField";
import { DatePicker3 } from "ui/components/date/datePicker3";
import { DatePicker2 } from "ui/components/date/datePicker2";
import { DatePicker } from "../date/datePicker";
import { TextArea } from "../TextArea";
import { Checkbox } from "../checkbox";
import { RadioButton } from "../radioButton";
import { SwitchButton } from "../switchButton";
import { colors } from "ui/theme";

type FieldType =
  | "text"
  | "date"
  | "select"
  | "checkbox"
  | "textarea"
  | "radio"
  | "switch"
  | "number";
type DateValue = {
  day: number;
  month: number;
  year: number;
};

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  className?: string;
  containerStyle?: object;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  onValueChange?: (value: any) => void;
  description?: string;
  initialDate?: DateValue;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required,
  options = [],
  secureTextEntry,
  minYear,
  maxYear,
  disabled = false,
  keyboardType = "default",
  className = "",
  rules,
  onValueChange,
  initialDate,
  containerStyle,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...(required ? { required: `${label} required` } : {}),
        ...rules,
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const handleChange = (newValue: any) => {
          if (type === "date") {
            const dateValue =
              typeof newValue === "object" &&
              newValue !== null &&
              "day" in newValue &&
              "month" in newValue &&
              "year" in newValue
                ? newValue
                : convertToDateObject(newValue);
            onChange(dateValue);
            onValueChange?.(dateValue);
          } else {
            onChange(newValue);
            onValueChange?.(newValue);
          }
        };

        const convertToDateObject = (input: any): DateValue | null => {
          if (!input) return null;

          const isValidNumber = (num: any): num is number => {
            return typeof num === "number" && !isNaN(num) && isFinite(num);
          };

          const safeParseInt = (str: string): number | null => {
            const num = Number(str);
            return isValidNumber(num) ? num : null;
          };

          if (typeof input === "string" && input.includes("/")) {
            const parts = input.split("/");
            if (parts.length === 3) {
              const day = safeParseInt(parts[0] as string);
              const month = safeParseInt(parts[1] as string);
              const year = safeParseInt(parts[2] as string);

              if (day !== null && month !== null && year !== null) {
                return { day, month, year };
              }
            }
          }

          if (typeof input === "string" && input.includes("-")) {
            const parts = input.split("-");
            if (parts.length === 3) {
              const year = safeParseInt(parts[0] as string);
              const month = safeParseInt(parts[1] as string);
              const day = safeParseInt(parts[2] as string);

              if (year !== null && month !== null && day !== null) {
                return { day, month, year };
              }
            }
          }

          if (input instanceof Date && !isNaN(input.getTime())) {
            return {
              day: input.getDate(),
              month: input.getMonth() + 1,
              year: input.getFullYear(),
            };
          }

          if (typeof input === "object" && input !== null) {
            const { day, month, year } = input as any;

            const dayNum = typeof day === "string" ? safeParseInt(day) : day;
            const monthNum =
              typeof month === "string" ? safeParseInt(month) : month;
            const yearNum =
              typeof year === "string" ? safeParseInt(year) : year;

            if (
              isValidNumber(dayNum) &&
              isValidNumber(monthNum) &&
              isValidNumber(yearNum)
            ) {
              return { day: dayNum, month: monthNum, year: yearNum };
            }
          }

          return null;
        };

        const getDefaultDateValue = () => {
          if (value) return value;
          if (initialDate) return initialDate;
          return {
            day: 1,
            month: 1,
            year: 2026,
          };
        };

        const renderContent = () => (
          <>
            {type === "text" && (
              <TextField
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={value || ""}
                onChangeText={handleChange}
                secureTextEntry={secureTextEntry}
                editable={!disabled}
                hasError={!!error}
                error={error?.message}
                className={cn(
                  "bg-white dark:bg-black",
                  error && "border-red-500 dark:border-red-500",
                  disabled && "opacity-50",
                  className,
                )}
              />
            )}

            {type === "number" && (
              <TextField
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={(value ?? "").toString().replace(/[^0-9]/g, "")}
                onChangeText={(e) => {
                  const c = e.replace(/[^0-9]/g, "");
                  handleChange(c);
                }}
                secureTextEntry={secureTextEntry}
                editable={!disabled}
                hasError={!!error}
                error={error?.message}
                className={cn(
                  "bg-white dark:bg-black",
                  error && "border-red-500 dark:border-red-500",
                  disabled && "opacity-50",
                  className,
                )}
              />
            )}

            {type === "date" && (
              <DatePicker2
                placeholder={placeholder || "DD/MM/YYYY"}
                selectedDate={getDefaultDateValue()}
                onDateChange={handleChange}
                minYear={minYear}
                maxYear={maxYear}
                disabled={disabled}
                error={error?.message}
                className={cn(
                  error && "border-red-500 dark:border-red-500",
                  disabled && "opacity-50",
                  className,
                )}
              />
            )}

            {type === "select" && (
              <Select
                placeholder={placeholder || "..."}
                selectedValue={value}
                onValueChange={handleChange}
                options={options}
                disabled={disabled}
                error={error?.message}
                className={cn(
                  error && "border-red-500 dark:border-red-500",
                  disabled && "opacity-50",
                  className,
                )}
              />
            )}

            {type === "textarea" && (
              <TextArea
                placeholder={placeholder}
                value={value || ""}
                onChangeText={handleChange}
                editable={!disabled}
                hasError={!!error}
                error={error?.message}
                className={cn(
                  error && "border-red-500 dark:border-red-500",
                  disabled && "opacity-50",
                  className,
                )}
              />
            )}

            {type === "checkbox" && (
              <Checkbox
                isChecked={!!value}
                setIsChecked={(newValue) => handleChange(newValue)}
                label={label}
                disabled={disabled}
              />
            )}

            {type === "radio" && (
              <View className="flex-row flex-wrap gap-3">
                {options.map((option) => (
                  <RadioButton
                    key={option.value}
                    label={option.label}
                    selected={value === option.value}
                    disabled={disabled}
                    onPress={() => handleChange(option.value)}
                  />
                ))}
              </View>
            )}
            {type === "switch" && (
              <SwitchButton
                color={colors.brand}
                selected={!!value}
                disabled={disabled}
                onToggleOff={() => handleChange(!value)}
              />
            )}
          </>
        );

        return (
          <View style={containerStyle}>
            {type !== "checkbox" && type !== "switch" ? (
              <Text className="text-sm font-medium mb-1">
                {label}
                {required && <Text className="text-red-500"> *</Text>}
              </Text>
            ) : (
              <View className="h-[22px]" />
            )}

            {renderContent()}
          </View>
        );
      }}
    />
  );
}
