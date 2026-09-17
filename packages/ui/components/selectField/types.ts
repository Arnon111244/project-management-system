export type SelectLayout = "stacked" | "horizontal";
export type SelectOption = { label: string; value: string };

export interface SelectProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  layout?: SelectLayout;
  labelWidthClassName?: string;
  inputWrapperClassName?: string;
  className?: string;
  placeholder?: string;
  selectedValue?: string | null;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  maxDropdownHeight?: number;
}
