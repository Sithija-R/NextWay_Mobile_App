import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  acceptAd,
 
  declineAd,
 
} from "../../../../services/adminService";

import { getAdevertisements } from "../../../../services/advertiseService";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function AdvertisementHistory() {
  const router = useRouter();
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [reloadAds, setReloadAds] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdevertisements();
        if (res.success) {
          setAds(res.data);
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
  }, [reloadAds]);

  const openModal = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  const handleAccept = async (id, uid) => {
    Alert.alert(
      "Confirm Accept",
      `Are you sure you want to accept the advertisement?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await acceptAd(id, uid);
            alert("Advertisement accepted");
            closeModal();
            setReloadAds((prev) => !prev);
          },
        },
      ]
    );
  };

  const handleDecline = (id, uid) => {
    Alert.alert(
      "Confirm Decline",
      "Are you sure you want to decline the advertisement ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await declineAd(id, uid);
            alert("Advertisement declined");
            closeModal();
            setReloadAds((prev) => !prev);
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Pressable
          style={{
            position: "absolute",
            top: hp(5),
            left: wp(2),
            zIndex: 5,
            flexDirection: "row",
            marginTop: hp(1),
            alignItems: "center",
            width: "85%",
          }}
        >
          <Ionicons
            onPress={() => router.back()}
            name="arrow-back"
            size={hp(3.5)}
            color="black"
          />
          <Text
            style={{ fontSize: wp(5), paddingLeft: wp(5), fontWeight: "600" }}
          >
            {t("Advertisements History")}
          </Text>
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

      <View style={{ flex: 6, alignItems: "center" }}>
        <ScrollView style={{ marginBottom: hp(1) }}>
          {ads.length > 0 ? (
            ads.map((ad) => (
              <Pressable key={ad.id} onPress={() => openModal(ad)}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: ad.image }} />

                  <LinearGradient
                    colors={["transparent", "rgba(0, 0, 0, 0.5)"]}
                    style={styles.topGradientOverlay}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  >
                    <Text style={styles.title}>{ad.title_en}</Text>
                    {ad.pending ? (
                      <Text
                        style={{
                          position: "absolute",
                          top: hp(1),
                          right: wp(2),
                          color: "#ffa012",
                          fontWeight: "bold",
                          fontSize: hp(1.9),
                        }}
                      >
                        Pending
                      </Text>
                    ) : ad.accepted ? (
                      <Text
                        style={{
                          position: "absolute",
                          top: hp(1),
                          right: wp(2),
                          color: "#28ed35",
                          fontWeight: "bold",
                          fontSize: hp(1.9),
                        }}
                      >
                        Accepted
                      </Text>
                    ) : (
                      <Text
                        style={{
                          position: "absolute",
                          top: hp(1),
                          right: wp(2),
                          color: "red",
                          fontWeight: "bold",
                          fontSize: hp(1.9),
                        }}
                      >
                        Declined
                      </Text>
                    )}
                  </LinearGradient>

                  <LinearGradient
                    colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
                    style={styles.bottomGradientOverlay}
                  >
                    <Text style={styles.content}>
                      {ad.description_en?.slice(0, 150)}...
                    </Text>
                  </LinearGradient>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={{ fontSize: hp(2) }}>{t("no_ads")}</Text>
          )}
        </ScrollView>
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
                <Text style={styles.modalTitle}>{selectedAd.title_en}</Text>

                <Image
                  style={styles.modalImage}
                  source={{ uri: selectedAd.image }}
                />
                <Text style={styles.modalText}>{t("User Id")}:</Text>
                <Text style={styles.modalDescription}>{selectedAd.userId}</Text>
                <Text style={styles.modalText}>{t("Status")}:</Text>
                <Text style={styles.modalDescription}>
                  {" "}
                  {selectedAd.pending ? (
                    <Text
                      style={{
                        position: "absolute",
                        top: hp(1),
                        right: wp(2),
                        color: "#ffa012",
                        fontWeight: "bold",
                        fontSize: hp(1.9),
                      }}
                    >
                      Pending
                    </Text>
                  ) : selectedAd.accepted ? (
                    <Text
                      style={{
                        position: "absolute",
                        top: hp(1),
                        right: wp(2),
                        color: "#28ed35",
                        fontWeight: "bold",
                        fontSize: hp(1.9),
                      }}
                    >
                      Accepted
                    </Text>
                  ) : (
                    <Text
                      style={{
                        position: "absolute",
                        top: hp(1),
                        right: wp(2),
                        color: "red",
                        fontWeight: "bold",
                        fontSize: hp(1.9),
                      }}
                    >
                      Declined
                    </Text>
                  )}
                </Text>
                <Text style={styles.modalText}>
                  {t("description english")}:
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedAd.description_en}
                </Text>
                <Text style={styles.modalText}>
                  {t("description sinhala")}:
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedAd.description_sin}
                </Text>
                <Text style={styles.modalText}>{t("description tamil")}:</Text>
                <Text style={styles.modalDescription}>
                  {selectedAd.description_tam}
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

                <Text style={styles.modalText}>{t("website")}:</Text>
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
  imageContainer: {
    position: "relative",
    width: wp(90),
    height: hp(50),
    borderRadius: 16,
    overflow: "hidden",
    marginTop: hp(2),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  topGradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "25%", // Adjust as needed
    justifyContent: "flex-start",
    padding: 16,
  },
  bottomGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%", // Adjust as needed
    justifyContent: "flex-end",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    color: "#fff",
    fontSize: 14,
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
