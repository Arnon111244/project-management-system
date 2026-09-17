import React, { useState, useMemo, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { colors } from "ui/theme";
import { Bell, ArrowRight, BellOff } from "lucide-react-native";
import { BrandLogoMark } from "ui/components/brandLogoMark";

import { useTheme } from "ui/theme/themeProvider";
import { View, View as RNView } from "ui/components/view";
import { Text } from "ui/components/text";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const useLocalizeField = () => {
  return (field: any) => {
    if (typeof field === "string") return field;
    return field?.en ?? "";
  };
};
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: {
      en: "Request Received",
      ar: "تم استلام الطلب",
      fr: "Demande reçue",
    },
    description: {
      en: "Your service request has been received. We'll review it and update you soon.",
      ar: "تم استلام طلب الخدمة الخاص بك. سنقوم بمراجعته وإبلاغك قريبًا.",
      fr: "Votre demande de service a été reçue. Nous l'examinerons et vous informerons bientôt.",
    },
    time: {
      en: "16m",
      ar: "16 دقيقة",
      fr: "16 min",
    },
    isRead: false,
  },
  {
    id: "2",
    title: {
      en: "Session Reminder",
      ar: "تذكير بالجلسة",
      fr: "Rappel de session",
    },
    description: {
      en: "Your Coffee Session starts soon — don't miss the conversation!",
      ar: "جلسة القهوة الخاصة بك ستبدأ قريبًا — لا تفوت المحادثة!",
      fr: "Votre session Coffee commence bientôt — ne manquez pas la conversation !",
    },
    time: {
      en: "2h",
      ar: "ساعتان",
      fr: "2 h",
    },
    isRead: false,
  },
  {
    id: "6",
    title: {
      en: "Follow-up",
      ar: "متابعة",
      fr: "Suivi",
    },
    description: {
      en: "Thanks for joining the Coffee Session! Continue the discussion in the community.",
      ar: "شكرًا لانضمامك إلى جلسة القهوة! واصل النقاش في المجتمع.",
      fr: "Merci d'avoir rejoint la session Coffee ! Continuez la discussion dans la communauté.",
    },
    time: {
      en: "Yesterday • 3:48 PM",
      ar: "أمس • 3:48 م",
      fr: "Hier • 15:48",
    },
    isRead: true,
  },
];

const useDirection = () =>
  useMemo(
    () => ({
      row: "flex-row",
      absolute: (offset: number) => ({ right: offset }),
      chevronRotation: "0deg",
    }),
    [],
  );

export const NotificationsDropdown = () => {
  const localizeField = useLocalizeField();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const direction = useDirection();

  const { effective } = useTheme();

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return activeTab === "unread"
      ? MOCK_NOTIFICATIONS.filter((n) => !n.isRead)
      : MOCK_NOTIFICATIONS;
  }, [activeTab]);

  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = isVisible ? "hidden" : "auto";
    }

    return () => {
      if (Platform.OS === "web") {
        document.body.style.overflow = "auto";
      }
    };
  }, [isVisible]);

  return (
    <View>
      <Pressable
        onPress={() => setIsVisible(true)}
        className="p-2 rounded-full"
      >
        <Bell size={24} color={effective === "dark" ? "#fff" : "#000"} />
        {unreadCount > 0 && (
          <View className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-[8px] text-white font-bold">
              {unreadCount}
            </Text>
          </View>
        )}
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onPress={() => setIsVisible(false)}
        />

        <View
          style={{
            position: "absolute",
            top: Platform.OS != "android" ? 60 : 25,
            ...direction.absolute(0),
            marginHorizontal: 10,
            maxWidth: Math.min(SCREEN_WIDTH - 15, 380),
            maxHeight: 500,
          }}
          className="bg-white dark:bg-[#121212] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl"
        >
          <View
            className={`bg-white dark:bg-black px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-row justify-between`}
          >
            <Text className="text-lg font-bold">Notifications</Text>
            <Pressable>
              <Text className="text-brand text-sm font-semibold">
                Mark All as Read
              </Text>
            </Pressable>
          </View>

          <View className="p-3 bg-white dark:bg-black">
            <RNView className={`flex-row bg-slate-100 rounded-xl p-1`}>
              <TabButton
                label="All"
                active={activeTab === "all"}
                onPress={() => setActiveTab("all")}
              />
              <TabButton
                label={` Unread (${unreadCount})`}
                active={activeTab === "unread"}
                onPress={() => setActiveTab("unread")}
              />
            </RNView>
          </View>

          <ScrollView
            className="max-h-[380px] bg-white dark:bg-black"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-3 pb-3">
              {filteredNotifications.length ? (
                filteredNotifications.map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    localizeField={localizeField}
                  />
                ))
              ) : (
                <View className="py-12 items-center">
                  <BellOff size={28} color={colors.danger} />
                  <Text className="mt-3 text-slate-500">
                    No new notifications
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <Pressable className="bg-white dark:bg-black py-4 items-center border-t border-slate-100 dark:border-slate-800">
            <View className={`flex-row items-center `}>
              <Text className="text-slate-600 dark:text-slate-300 font-semibold mr-2">
                View History
              </Text>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const TabButton = ({ label, active, onPress }: any) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 py-2 rounded-xl items-center ${
      active ? "bg-brand" : ""
    }`}
  >
    <Text
      className={`${
        active ? "text-white font-bold" : "text-slate-500 dark:text-slate-500"
      }`}
    >
      {label}
    </Text>
  </Pressable>
);

const NotificationItem = ({ item, localizeField }: any) => (
  <View className="my-1 mt-2">
    <View
      className={`
        p-4 rounded-xl border
        ${
          item.isRead
            ? "bg-white dark:bg-[#14181F] border-slate-100 dark:border-[#1E293B]"
            : "bg-emerald-50 dark:bg-[#0F2F26] border-emerald-100 dark:border-[#145A46]"
        }
      `}
    >
      <View className={`flex-row`}>
        <BrandLogoMark
          className="h-12 w-12 rounded-full"
          textClassName="text-xl"
        />
        <View className="flex-1 mx-3">
          <View className={`flex-row justify-between`}>
            <Text className="font-bold text-black dark:text-[#F1F5F9]">
              {localizeField(item.title)}
            </Text>
            <Text className="text-xs text-slate-400 dark:text-[#64748B]">
              {localizeField(item.time)}
            </Text>
          </View>
          <Text className="text-slate-600 dark:text-[#CBD5E1] mt-1">
            {localizeField(item.description)}
          </Text>
        </View>
      </View>
    </View>
  </View>
);
