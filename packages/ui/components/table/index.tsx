import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
  FlatList,
} from "react-native";
import { Text } from "ui/components/text";
import { View } from "ui/components/view";
import { RadioButton } from "ui/components/radioButton";
import {
  Search,
  ChevronLeft,
  ChevronRight as RightIcon,
  ChevronsLeft,
  ChevronsRight,
  Check,
} from "lucide-react-native";
import { useGlobalStore } from "state/index";
import { colors } from "ui/theme";
import { TableColumn, CellProps } from "./types";
if (Platform.OS !== "web" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TableRowProps<T> {
  row: T;
  rowId: number;
  visibleColumns: TableColumn<T>[];
  isExpanded: boolean;
  isSelected: boolean;
  showCheckboxes: boolean;
  getColumnWidth: (col: TableColumn<T>) => StyleProp<ViewStyle>;
  toggleExpand: (rowId: number) => void;
  handleRowSelect: (rowId: number) => void;
  renderRowSubComponent?: (args: { row: T }) => React.ReactNode;
}

function TableRowComponent<T extends Record<string, any>>({
  row,
  rowId,
  visibleColumns,
  isExpanded,
  isSelected,
  showCheckboxes,
  getColumnWidth,
  toggleExpand,
  handleRowSelect,
  renderRowSubComponent,
}: TableRowProps<T>) {
  const [isHovered, setIsHovered] = useState(false);
  const animationValueRef = useRef(new Animated.Value(isExpanded ? 1 : 0));

  useEffect(() => {
    Animated.timing(animationValueRef.current, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const animatedHeight = animationValueRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View className="border-b border-[#eaedf1]">
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onPress={() => handleRowSelect(rowId)}
      >
        <View
          className={`flex-row py-3 transition-colors duration-150 ${
            isExpanded
              ? "bg-blue-50/30"
              : isHovered
                ? "bg-[#e9e9e9dc] dark:bg-blue-500/20"
                : isSelected
                  ? "bg-blue-50 dark:bg-blue-500/10"
                  : "bg-surface dark:bg-black"
          }`}
        >
          {showCheckboxes && (
            <View
              style={{ width: 60 }}
              className="justify-center items-start px-2"
            >
              <View style={{ padding: 8 }}>
                <RadioButton
                  selected={isSelected}
                  onPress={() => handleRowSelect(rowId)}
                />
              </View>
            </View>
          )}

          {visibleColumns.map((col, colIndex) => (
            <View
              key={`col-${colIndex}-${rowId}`}
              style={getColumnWidth(col)}
              className="justify-center items-start px-3 overflow-hidden"
            >
              {col.Cell ? (
                <View style={{ width: "100%" }}>
                  {col.Cell({
                    row,
                    value: row[col.accessor as keyof T],
                    toggleExpand: () => toggleExpand(rowId),
                    isExpanded,
                  })}
                </View>
              ) : (
                <Text
                  style={styles.cellText}
                  className="text-[#5d7186] text-sm text-left"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {String(row[col.accessor as keyof T] ?? "-")}
                </Text>
              )}
            </View>
          ))}
        </View>

        {isExpanded && renderRowSubComponent && (
          <Animated.View
            style={{ height: animatedHeight }}
            className="overflow-hidden bg-gray-50"
          >
            <View className="p-4 border-t border-gray-100">
              {renderRowSubComponent({ row })}
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const MemoizedTableRow = React.memo(
  TableRowComponent,
) as typeof TableRowComponent;

export function UniversalTable<T extends Record<string, any>>({
  columns,
  data,
  renderRowSubComponent,
  showCheckboxes = false,
  allowSingleSelect = false,
  pageSize = 10,
  hideFilter = false,
  hiddenColumns = [],
  loading: externalLoading,
  onSelectionChange,
}: {
  columns: TableColumn<T>[];
  data: T[];
  renderRowSubComponent?: (args: { row: T }) => React.ReactNode;
  showCheckboxes?: boolean;
  allowSingleSelect?: boolean;
  pageSize?: number;
  hideFilter?: boolean;
  hiddenColumns?: string[];
  loading?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
}) {
  const COLUMN_MIN_WIDTH = 120;
  const COLUMN_MAX_WIDTH = 400;
  const CHECKBOX_WIDTH = 60;
  const PADDING = 16;

  const { width: screenWidth } = useWindowDimensions();

  const [filterValue, setFilterValue] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});
  const [page, setPage] = useState(0);
  const [internalLoading, setInternalLoading] = useState(true);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [tableKey, setTableKey] = useState(0);

  const tableIdRef = useRef(`table-${Math.random().toString(36).substr(2, 9)}`);
  const columnWidthsCalculatedRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const loading =
    externalLoading !== undefined ? externalLoading : internalLoading;

  const measureTextWidth = useCallback((text: string) => {
    if (Platform.OS === "web") {
      const averageCharWidth = 7;
      const lines = text.split("\n");
      const maxLineLength = Math.max(...lines.map((line) => line.length));
      return maxLineLength * averageCharWidth;
    } else {
      const averageCharWidth = 8;
      return text.length * averageCharWidth;
    }
  }, []);

  useLayoutEffect(() => {
    if (loading || data.length === 0 || columnWidthsCalculatedRef.current)
      return;

    const calculateColumnWidths = () => {
      const newWidths: Record<string, number> = {};
      const visibleCols = columns.filter(
        (col) => !hiddenColumns.includes(col.accessor as string),
      );

      visibleCols.forEach((col) => {
        const accessor = col.accessor as string;
        let maxWidth = COLUMN_MIN_WIDTH;

        const headerText =
          typeof col.Header === "function" ? col.Header() : col.Header;
        const headerWidth = measureTextWidth(String(headerText));
        maxWidth = Math.max(maxWidth, headerWidth + PADDING * 2);

        const sampleData = data.slice(0, Math.min(10, data.length));
        sampleData.forEach((row) => {
          if (col.Cell) {
            maxWidth = Math.max(
              maxWidth,
              col.minWidth || col.width || COLUMN_MIN_WIDTH,
            );
          } else {
            const cellValue = String(row[col.accessor as keyof T] ?? "-");
            const cellWidth = measureTextWidth(cellValue);
            maxWidth = Math.max(maxWidth, cellWidth + PADDING * 2);
          }
        });

        newWidths[accessor] = Math.min(
          Math.max(maxWidth, col.minWidth || COLUMN_MIN_WIDTH),
          col.maxWidth || COLUMN_MAX_WIDTH,
        );
      });

      setColumnWidths(newWidths);
      columnWidthsCalculatedRef.current = true;
      setTimeout(() => setTableKey((prev) => prev + 1), 100);
    };

    calculateColumnWidths();
  }, [data, columns, hiddenColumns, loading, measureTextWidth]);

  useEffect(() => {
    columnWidthsCalculatedRef.current = false;
    setColumnWidths({});
    setExpandedRows({});
    setSelectedRows({});
  }, [data.length]);

  const visibleColumns = useMemo(
    () =>
      columns.filter((col) => !hiddenColumns.includes(col.accessor as string)),
    [columns, hiddenColumns],
  );

  const totalTableWidth = useMemo(() => {
    let width = visibleColumns.reduce((sum, col) => {
      const colWidth =
        columnWidths[col.accessor as string] || col.width || COLUMN_MIN_WIDTH;
      return sum + colWidth;
    }, 0);
    if (showCheckboxes) width += CHECKBOX_WIDTH;
    return width;
  }, [visibleColumns, columnWidths, showCheckboxes]);

  const isOpen = useGlobalStore((s) => s.sidebar.isOpen);
  const shouldScrollHorizontally =
    totalTableWidth > screenWidth - (isOpen ? 300 : 0);

  const filteredData = useMemo(() => {
    if (!filterValue) return data;
    return data.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
    );
  }, [filterValue, data]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = useMemo(
    () => filteredData.slice(page * pageSize, (page + 1) * pageSize),
    [filteredData, page, pageSize],
  );

  const toggleExpand = (rowIndex: number) => {
    if (Platform.OS !== "web")
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRows((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }));
  };

  useEffect(() => {
    if (externalLoading === undefined) {
      setInternalLoading(true);
      const timer = setTimeout(() => {
        setInternalLoading(false);
        columnWidthsCalculatedRef.current = false;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [data, externalLoading]);

  const handleRowSelect = useCallback(
    (rowIndex: number) => {
      setSelectedRows((prev) => {
        let newSelection: Record<number, boolean>;
        if (allowSingleSelect) {
          newSelection = prev[rowIndex] ? {} : { [rowIndex]: true };
        } else {
          newSelection = { ...prev, [rowIndex]: !prev[rowIndex] };
        }

        if (onSelectionChange) {
          const selectedItems = data.filter((item) => newSelection[item.id]);
          onSelectionChange(selectedItems);
        }
        return newSelection;
      });
    },
    [allowSingleSelect, data, onSelectionChange],
  );

  const getColumnWidth = (col: TableColumn<T>): StyleProp<ViewStyle> => {
    const width =
      columnWidths[col.accessor as string] || col.width || COLUMN_MIN_WIDTH;
    if (shouldScrollHorizontally) return { width };
    return { flex: 1, minWidth: width };
  };

  const renderRow = useCallback(
    ({ item: row, index }: { item: T; index: number }) => {
      const rowId = row.id;
      return (
        <MemoizedTableRow
          row={row}
          rowId={rowId}
          visibleColumns={visibleColumns}
          isExpanded={!!expandedRows[rowId]}
          isSelected={!!selectedRows[rowId]}
          showCheckboxes={showCheckboxes}
          getColumnWidth={getColumnWidth}
          toggleExpand={toggleExpand}
          handleRowSelect={handleRowSelect}
          renderRowSubComponent={renderRowSubComponent}
        />
      );
    },
    [
      expandedRows,
      selectedRows,
      showCheckboxes,
      visibleColumns,
      getColumnWidth,
      toggleExpand,
      handleRowSelect,
      renderRowSubComponent,
    ],
  );
  return (
    <View key={`table-container-${tableIdRef.current}`} className="w-full px-2">
      {!hideFilter && (
        <View className="mb-4">
          <View className="flex-row items-center bg-surface dark:bg-black border border-[#eaedf1] px-4 h-12">
            <Search size={18} color="#999" />
            <TextInput
              className="flex-1 mx-2 text-base text-gray-700 dark:text-white"
              style={{
                textAlign: "left",
                writingDirection: "ltr",
              }}
              placeholder="Search"
              placeholderTextColor="#bbb"
              value={filterValue}
              onChangeText={setFilterValue}
            />
          </View>
        </View>
      )}

      <View className="border border-[#eaedf1] border-b-0 bg-surface dark:bg-black overflow-hidden">
        <ScrollView
          ref={scrollViewRef}
          horizontal={shouldScrollHorizontally}
          showsHorizontalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={Platform.OS !== "web"}
        >
          <View
            style={{
              minWidth: "100%",
              width: shouldScrollHorizontally ? totalTableWidth : "100%",
            }}
          >
            {/* Header */}
            <View className="flex-row py-4 border-b border-[#eaedf1] bg-gray-50">
              {showCheckboxes && (
                <View
                  style={{ width: 60 }}
                  className="justify-center items-start px-2"
                >
                  <Check size={18} className="mx-2" color={colors.brand} />
                </View>
              )}
              {visibleColumns.map((col, index) => (
                <View
                  key={`header-${index}`}
                  style={getColumnWidth(col)}
                  className="justify-center px-3"
                >
                  <Text
                    className="text-[#686868] font-semibold text-sm text-left"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {typeof col.Header === "function"
                      ? col.Header()
                      : col.Header}
                  </Text>
                </View>
              ))}
            </View>

            {loading ? (
              <View className="py-20 items-center justify-center">
                <ActivityIndicator color={colors.brand} size="large" />
              </View>
            ) : pageData.length === 0 ? (
              <View className="py-12 items-center justify-center">
                <Text className="text-gray-500">No data available</Text>
              </View>
            ) : (
              <FlatList
                data={pageData}
                renderItem={renderRow}
                extraData={selectedRows}
                keyExtractor={(item, index) => String(index)}
                scrollEnabled={false}
                initialNumToRender={10}
                maxToRenderPerBatch={15}
                windowSize={10}
                removeClippedSubviews={Platform.OS !== "web"}
              />
            )}
          </View>
        </ScrollView>
      </View>

      {/* Pagination */}
      {totalPages > 1 && (
        <View className="flex-row justify-center items-center mt-6 gap-2">
          <PaginationBtn
            icon={<ChevronsLeft size={18} />}
            disabled={page === 0}
            onPress={() => setPage(0)}
          />
          <PaginationBtn
            icon={<ChevronLeft size={18} />}
            disabled={page === 0}
            onPress={() => setPage((p) => Math.max(0, p - 1))}
          />
          <Text className="px-4 ">
            Page{" "}
            <Text className="font-bold text-brand dark:text-brand">
              {page + 1}
            </Text>{" "}
            of {totalPages}
          </Text>
          <PaginationBtn
            icon={<RightIcon size={18} />}
            disabled={page === totalPages - 1}
            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
          <PaginationBtn
            icon={<ChevronsRight size={18} />}
            disabled={page === totalPages - 1}
            onPress={() => setPage(totalPages - 1)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cellText: {
    width: "100%",
    flexWrap: "wrap" as const,
    // @ts-ignore
    wordBreak: Platform.OS === "web" ? "break-word" : undefined,
    overflow: "hidden" as const,
  },
});

interface PaginationBtnProps {
  icon: React.ReactElement<IconProps>;
  disabled: boolean;
  onPress: () => void;
}

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  [key: string]: any;
}

const PaginationBtn = ({ icon, disabled, onPress }: PaginationBtnProps) => {
  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress();
  }, [disabled, onPress]);

  const clonedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<IconProps>, {
        color: disabled ? "#ccc" : colors.brand,
        size: 18,
      })
    : icon;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`w-10 h-10 items-center justify-center rounded-lg border mx-1 ${
        disabled ? "border-gray" : "border-brand"
      }`}
    >
      {clonedIcon}
    </Pressable>
  );
};

export type { TableColumn, CellProps };
