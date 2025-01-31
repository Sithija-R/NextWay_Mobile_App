import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader/customheader";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNotification } from "../../../../services/fetchingService";
import { auth } from "../../../../firebaseConfig/firebaseConfiguration";
import { Ionicons } from "@expo/vector-icons";
import { getAdevertisements } from "../../../../services/advertiseService";
import Carousel from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Home() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(0);
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const currentLan = i18n.language;

  const closeModal = () => {
    setSelectedAd(null);
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotification();
        if (response.success && response.data.length > 0) {
          const notifi = response.data.filter(
            (noti) =>
              noti.userId === auth?.currentUser?.uid || noti.userId === "all"
          );
          const unread = notifi.filter((noti) => noti.read === false).length;
          setNotifications(unread);
        } else {
          console.log("No notifications found");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    getNotifications();
    const interval = setInterval(getNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage) {
          i18next.changeLanguage(savedLanguage);
        }
      } catch (e) {
        console.error("Failed to load language", e);
      }
    };

    loadSavedLanguage();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdevertisements();
        if (res.success) {
          const allowedAds = res.data.filter(
            (ad) => ad.pending === false && ad.accepted === true
          );
          setAds(allowedAds);
        } else {
          console.error("Error fetching advertisements:", res.msg);
        }
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      }
    };
    fetchAds();
    const interval = setInterval(fetchAds, 30000);
    return () => clearInterval(interval);
  }, []);

  const carouselRef = useRef(null);

  const data = [
    { title: "Slide 1", image: "https://via.placeholder.com/350" },
    { title: "Slide 2", image: "https://via.placeholder.com/350" },
    { title: "Slide 3", image: "https://via.placeholder.com/350" },
  ];

  const { width: screenWidth } = Dimensions.get("window");

  const renderItem = ({ item }) => (
    <Pressable style={styles.container} onPress={() => setSelectedAd(item)}>
      <ImageBackground source={{ uri: item.image }} style={styles.image}>
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
          style={styles.gradient}
        >
          <Text style={styles.title}>{item[`title_${currentLan}`]}</Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <Pressable
          style={{ position: "absolute", top: hp(5), left: wp(2), zIndex: 5 }}
        >
          <CustomHeader />
        </Pressable>
        <Pressable
          onPress={() => router.push("notifications")}
          style={{
            position: "absolute",
            top: hp(5),
            right: wp(4),
            marginTop: hp(2),
            zIndex: 5,
          }}
        >
          <Ionicons name="notifications" size={hp(4)} color="#141414" />
          {notifications > 0 && (
            <View
              style={{
                position: "absolute",
                top: 1,
                right: 0,
                width: 10,
                height: 10,
                borderRadius: 4,
                backgroundColor: "red",
                marginLeft: 6,
              }}
            />
          )}
        </Pressable>

        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>

      <View style={{ alignItems: "center", flex: 10 }}>
        <Image
          style={{ height: hp(20) }}
          resizeMode="contain"
          source={require("../../../../assets/images/Logo.png")}
        />

        <Text
          style={{ fontSize: hp(4), fontWeight: "600", textAlign: "center" }}
        >
          {t("welcome")}
          {"\n"}
          <Text
            style={{
              fontSize: hp(4),
              fontWeight: "600",
              textAlign: "center",
              color: "#EC7117",
            }}
          >
            Nextway
          </Text>
        </Text>

        <View style={styles.container}>
          <Carousel
            ref={carouselRef}
            data={ads ? ads : data}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.6}
            layout="default"
            autoplay={true}
            autoplayDelay={3000}
            loop={true}
          />
        </View>

        <View style={{ alignItems: "center", marginTop: hp(1) }}>
          <TouchableOpacity
           onPress={() => router.push("(courseSelectScreens)")}

            style={{
              backgroundColor: "#149BC6",
              padding: hp(2),
              borderRadius: 40,
              width: wp(80),
            }}
          >
            <Text
              style={{
                fontSize: hp(3),
                fontWeight: "600",
                textAlign: "center",
                color: "white",
              }}
            >
              {t("find-course")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        style={{
          width: hp(15),
          height: hp(14),
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        resizeMode="stretch"
        source={require("../../../../assets/images/bottomEllipse.png")}
      />

      {selectedAd && (
        <Modal
          visible={!!selectedAd}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FontAwesome
                onPress={() => closeModal()}
                name="close"
                size={24}
                color="black"
                style={{ position: "absolute", top: hp(1), right: hp(2) }}
              />

              <ScrollView style={{ marginTop: hp(2) }}>
                <Text style={styles.modalTitle}>
                  {selectedAd[`title_${currentLan}`]}
                </Text>

                <Image
                  style={styles.modalImage}
                  source={{ uri: selectedAd.image }}
                />

                <Text style={styles.modalText}>{t("description")}:</Text>
                <Text style={styles.modalDescription}>
                  {selectedAd[`description_${currentLan}`]}
                </Text>

                <Text style={styles.modalText}>{t("contact")}:</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${selectedAd.contact}`)}
                >
                  <Text
                    style={[
                      styles.modalDescription,
                      { color: "blue", textDecorationLine: "underline" },
                    ]}
                  >
                    {selectedAd.contact}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.modalText}>Website:</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`https://${selectedAd.web}`)}
                >
                  <Text style={styles.modalLink}>{selectedAd.web}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  

    justifyContent: "center",
    alignItems: "center",
    minHeight: hp(30),
    maxHeight: hp(40),
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background dimming
  },
  modalContent: {
    width: wp(90),
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "flex-start",
    maxHeight: hp(90),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 8,
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 20,
  },
  modalLink: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
});
