import * as React from "react";
import { memo, useState, useRef, useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  View as RNView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { View } from "ui/components/view";
import { Text } from "ui/components/text";
import { Button } from "ui/components/button";
import { BrandLogoMark } from "ui/components/brandLogoMark";
import { cn } from "ui/utils/cn";

import { ScrollWheel } from "shared_mono_app/utils/HorizontalScrollWheel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "ui/components/card";

export type CardsListItem = {
  id: string | number;
  title: string;
  description: string;
  image: any;
  action: string;
};

type Props = {
  items: CardsListItem[];
  onPressItem?: (id: string | number) => void;
  className?: string;
};

export function CardsListComponents({ items, onPressItem, className }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardWidth = 300 + 16;
  const isWeb = Platform.OS === "web";

  const duplicatedItems = items;

  const renderCard = (op: CardsListItem) => (
    <Pressable onPress={() => onPressItem?.(op.id)}>
      <Card className="max-w-[300px] mx-auto py-0 px-0 overflow-hidden">
        <CardHeader className="flex justify-center border-b border-gray items-center py-6">
          <BrandLogoMark
            className="w-[120px] h-[120px] rounded-xl"
            textClassName="text-5xl"
          />
        </CardHeader>

        <CardHeader className="px-4">
          <CardTitle>{op.title}</CardTitle>
        </CardHeader>

        <CardContent className="mx-6">
          <Text className="text-base text-fg dark:text-fg-dark">
            {op.description}
          </Text>
        </CardContent>

        <CardFooter className="pb-6">
          <CardAction>
            <Button>Click here</Button>
          </CardAction>
        </CardFooter>
      </Card>
    </Pressable>
  );

  useEffect(() => {
    if (isWeb || !isAutoScroll || items.length <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= duplicatedItems.length) {
        nextIndex = 0;
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      } else {
        scrollRef.current?.scrollTo({
          x: nextIndex * cardWidth,
          animated: true,
        });
      }

      setCurrentIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoScroll, items.length]);

  const handleScrollBeginDrag = () => setIsAutoScroll(false);

  const handleScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / cardWidth);

    setCurrentIndex(index);
    setIsAutoScroll(true);
  };

  return (
    <View className={cn("w-full", className)}>
      {isWeb ? (
        <ScrollWheel
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingStart: 16,
            paddingEnd: 16,
            paddingBottom: 16,
            flexDirection: "row",
          }}
        >
          {duplicatedItems.map((op, index) => (
            <RNView key={index} className="mx-1 w-[300px]">
              {renderCard(op)}
            </RNView>
          ))}
        </ScrollWheel>
      ) : (
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingEnd: 16,
            paddingBottom: 16,
            flexDirection: "row",
          }}
          decelerationRate={Platform.OS === "ios" ? 0 : "fast"}
          snapToAlignment="start"
          disableIntervalMomentum
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
        >
          {duplicatedItems.map((op, index) => (
            <RNView key={index} className="mx-3 max-w-[300px]">
              {renderCard(op)}
            </RNView>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export const CardsList = memo(CardsListComponents);
CardsList.displayName = "CardsList";
