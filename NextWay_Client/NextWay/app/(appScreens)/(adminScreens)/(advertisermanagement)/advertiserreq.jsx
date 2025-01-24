import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  Touchable,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {  useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";
import {
  acceptAdRequest,
  declineAdRequest,
  getAdRequest,
} from "../../../../services/adminService";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AdvertiserReq() {
  const router = useRouter();
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [reloadAds, setReloadAds] = useState(false);


  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdRequest();
        if (res.success && res.data.length > 0) {
          // Filter ads where 'pending' is true
          const pendingAds = res.data.filter(ad => ad.pending === true);
          
          // Set only the ads that have pending === true
          setAds(pendingAds);
        } else {
          console.log("No ads found");
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAds();
  }, [reloadAds]);

  const openModal = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  const handleAccept = async (id) => {
    Alert.alert(
      "Confirm Accept",
      `Are you sure you want to accept the advertiser request?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await acceptAdRequest(id);
            alert("Advertiser request accepted");
            closeModal();
            setReloadAds(prev => !prev);
          },
        },
      ]
    );

  };

  const handleDecline = (id) => {
    Alert.alert(
      "Confirm Decline",
      "Are you sure you want to decline the advertiser request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await declineAdRequest(id);
            alert("Advertiser request declined");
            closeModal();
            setReloadAds(prev => !prev);
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
            {t("New Advertiser Requests")}
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
        <CustomKeyboardView>
          {ads.length > 0 ? (
            ads.map((ad, index) =>
              ad.pending ? (
                <Pressable key={index} onPress={() => openModal(ad)}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: wp(90),
                      maxHeight: hp(67),
                      backgroundColor: "rgba(128, 128, 128, 0.2)",
                      padding: hp(1),
                      paddingVertical: hp(2),
                      borderRadius: 15,
                      marginBottom: hp(2),
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: hp(2.1),
                          fontWeight: "600",
                          marginVertical: hp(0.4),
                        }}
                      >
                        Business name:{" "}
                        <Text style={{ fontSize: hp(2), color: "#149BC6" }}>
                          {ad.businessName}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: hp(2.1),
                          fontWeight: "600",
                          marginVertical: hp(0.4),
                        }}
                      >
                        Username:{" "}
                        <Text style={{ fontSize: hp(2), color: "#149BC6" }}>
                          {ad.username}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: hp(2.1),
                          fontWeight: "600",
                          marginVertical: hp(0.4),
                        }}
                      >
                        Email:{" "}
                        <Text style={{ fontSize: hp(2), color: "#149BC6" }}>
                          {ad.email}
                        </Text>
                      </Text>
                    </View>

                    <AntDesign name="right" size={26} color="#149BC6" />
                  </View>
                </Pressable>
              ) : null
            )
          ) : (
            <Text>No new advertiser requests found</Text>
          )}
        </CustomKeyboardView>
      </View>

      {selectedAd && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedAd}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Pressable
                onPress={closeModal}
                style={{
                  position: "absolute",
                  top: hp(1),
                  right: hp(1),
                  zIndex: 5,
                }}
              >
                <AntDesign name="close" size={29} color="red" />
              </Pressable>

              <ScrollView>
                <View style={{ marginVertical: hp(2) }}>
                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: "600",
                      marginVertical: hp(0.4),
                      color: "#149BC6",
                    }}
                  >
                    Business Name: {"\n"}
                    <Text style={{ fontSize: hp(2), color: "black" }}>
                      {selectedAd.businessName}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: "600",
                      marginVertical: hp(0.4),
                      color: "#149BC6",
                    }}
                  >
                    Username: {"\n"}
                    <Text style={{ fontSize: hp(2), color: "black" }}>
                      {selectedAd.username}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: "600",
                      marginVertical: hp(0.4),
                      color: "#149BC6",
                    }}
                  >
                    Email: {"\n"}
                    <Text style={{ fontSize: hp(2), color: "black" }}>
                      {selectedAd.email}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: "600",
                      marginVertical: hp(0.4),
                      color: "#149BC6",
                    }}
                  >
                    Business Type: {"\n"}
                    <Text style={{ fontSize: hp(2), color: "black" }}>
                      {selectedAd.businessType}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: "600",
                      marginVertical: hp(0.4),
                      color: "#149BC6",
                    }}
                  >
                    Contact: {"\n"}
                    <Text style={{ fontSize: hp(2), color: "black" }}>
                      {selectedAd.contact}
                    </Text>
                  </Text>

                  <Text
                    style={{
                      fontSize: hp(2.3),
                      fontWeight: "600",
                      marginVertical: hp(0.4),
                      color: "#149BC6",
                    }}
                  >
                    Description: {"\n"}
                    <Text style={{ fontSize: hp(2), color: "black" }}>
                      {selectedAd.description}
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDecline(selectedAd.docid)}
                  style={{
                    backgroundColor: "#f53131",
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(10),
                    borderRadius: 10,
                    marginBottom: hp(1),
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
                    {t("Decline")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAccept(selectedAd.docid)}
                  style={{
                    backgroundColor: "#149BC6",
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(10),
                    borderRadius: 10,
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
                    {t("Accept")}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: wp(90),
    maxHeight: hp(85),
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
});
