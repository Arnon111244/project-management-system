export type DatePickerLayout = "stacked" | "horizontal";

export interface DatePickerProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  layout?: DatePickerLayout;
  labelWidthClassName?: string;
  inputWrapperClassName?: string;
  className?: string;
  placeholder?: string;
  selectedDate: { day: number; month: number; year: number };
  onDateChange: (date: { day: number; month: number; year: number }) => void;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}
