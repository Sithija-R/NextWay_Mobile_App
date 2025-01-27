import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../../../../firebaseConfig/firebaseConfiguration";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  createAdvertisement,
  deleteAdvertisement,
  editAdvertisement,
  getAdevertisements,
} from "../../../../../services/advertiseService";
import Loading from "../../../../../components/Loading/Loading";
import { useAuth } from "../../../../../context/authContext";

export default function Advertisements() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLan = i18n.language;

  const [ads, setAds] = useState([]);
  const [usersAds, setUsersAds] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editModelVisible, setEditModelVisible] = useState(false);
  const [flag, setFlag] = useState(false);

  const initialState = {
    title_en: "",
    title_sin: "",
    title_tam: "",
    web: "",
    contact: "",
    description_en: "",
    description_sin: "",
    description_tam: "",
    userId: auth.currentUser?.uid || "",
    accepted: false,
    pending: true,
  };

  const [newAdData, setNewAdData] = useState(initialState);
  const handleInputChange = (field, value) => {
    setNewAdData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const [editImage, setEditImage] = useState(null);
  const [editAdData, seteditAdData] = useState({
    title_en: "",
    title_sin: "",
    title_tam: "",
    web: "",
    contact: "",
    description_en: "",
    description_sin: "",
    description_tam: "",
    userId: auth.currentUser?.uid,
    accepted: false,
    pending: true,
  });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await getAdevertisements();
        if (res.success) {
          const allowedAds = res.data.filter(
            (ad) => ad.pending === false && ad.accepted === true
          );

          setAds(allowedAds);

          const usersAds = res.data.filter(
            (ad) => ad.userId === auth?.currentUser?.uid
          );
          setUsersAds(usersAds);
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
  }, [flag]);

  const openModal = (ad) => {
    setSelectedAd(ad);
  };

  const closeModal = () => {
    setSelectedAd(null);
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (editModelVisible) {
        setEditImage(result.assets[0].uri);
      } else {
        setSelectedImage(result.assets[0].uri);
      }
    }
  };

  const handleCreate = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log("User is not authenticated");
        return;
      }
      setLoading(true);
      let imageUrl =
        "https://adaptcommunitynetwork.org/wp-content/uploads/2022/01/ef3-placeholder-image.jpg";

      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const filename = selectedImage.substring(
          selectedImage.lastIndexOf("/") + 1
        );
        const storage = getStorage();
        const imageref = ref(storage, `advertisementImages/${uid}/${filename}`);

        await uploadBytes(imageref, blob);
        imageUrl = await getDownloadURL(imageref);
      }
      const res = await createAdvertisement({ ...newAdData, image: imageUrl });
      setLoading(false);

      if (res.success) {
        Alert.alert(
          "Success",
          "Your advertisement has been sent for review.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error",
          "An error occurred while creating the advertisement.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }

      setCreateModalVisible(false);
      setNewAdData(initialState);
      setSelectedImage(null);
      setSelectedAd(null);
      setFlag(!flag);
    } catch (error) {
      console.error("Error creating advertisement:", error);
      Alert.alert(
        "Error",
        "An error occurred while creating the advertisement.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      Alert.alert(
        "Delete Confirmation",
        "Are you sure you want to delete this item?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Delete action canceled"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                const res = await deleteAdvertisement(id);
                if (res.success) {
                  Alert.alert(
                    "Success",
                    "Your advertisement has been deleted.",
                    [{ text: "OK" }],
                    { cancelable: false }
                  );
                  setSelectedAd(null);
                  setFlag(!flag);
                }
              } catch (error) {
                console.error("Error deleting item:", error);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = async (ad) => {
    seteditAdData({
      title_en: ad.title_en || "",
      title_sin: ad.title_sin || "",
      title_tam: ad.title_tam || "",
      web: ad.web || "",
      contact: ad.contact || "",
      description_en: ad.description_en || "",
      description_sin: ad.description_sin || "",
      description_tam: ad.description_tam || "",
      userId: auth.currentUser?.uid,
      accepted: false,
      pending: true,
      image: ad.image || "",
      id: ad.id,
    });
    setEditModelVisible(true);
  };

  const handleEditSave = async (docid) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log("User is not authenticated");
        return;
      }
      setLoading(true);
      let imageUrl = editAdData?.image || "";

      if (editImage) {
        const response = await fetch(editImage);
        const blob = await response.blob();

        const filename = editImage.substring(editImage.lastIndexOf("/") + 1);
        const storage = getStorage();
        const imageref = ref(storage, `advertisementImages/${uid}/${filename}`);

        await uploadBytes(imageref, blob);
        imageUrl = await getDownloadURL(imageref);
      }
      const { id, ...restOfAdData } = editAdData;

      const res = await editAdvertisement(
        { ...restOfAdData, image: imageUrl },
        docid
      );
      setLoading(false);

      if (res.success) {
        Alert.alert(
          "Success",
          "Your advertisement has been sent for review.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Error",
          "An error occurred while editing the advertisement.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }

      setEditModelVisible(false);
      seteditAdData(null);
      setEditImage(null);
      setFlag(!flag);
      setSelectedAd(null);
    } catch (error) {
      console.error("Error creating advertisement:", error);
      Alert.alert(
        "Error",
        "An error occurred while creating the advertisement.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      setLoading(false);
    }
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
            {t("advertisement")}
          </Text>
        </Pressable>

        <Image
          style={{
            width: hp(27),
            height: hp(20),
          }}
          resizeMode="stretch"
          source={require("../../../../../assets/images/elipses.png")}
        />
      </View>

      <View style={{ flex: 7, alignItems: "center", zIndex: 2 }}>
        {user?.isAdvertiser ? (
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            style={{
              width: wp(90),
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#149BC6",
              padding: hp(2),
              marginBottom: hp(1),
              borderRadius: 10,
            }}
          >
            <MaterialIcons name="library-add" size={28} color="white" />
            <Text
              style={{
                position: "absolute",
                top: "50%",
                left: "33%",
                color: "white",
                fontSize: hp(2.5),
                fontWeight: "bold",
              }}
            >
              {t("create_ad")}
            </Text>
          </Pressable>
        ) : null}

        <ScrollView style={{ marginBottom: hp(1) }}>
          {user?.isAdvertiser && usersAds.length > 0 ? (
            usersAds?.map((ad) => (
              <Pressable key={ad.id} onPress={() => openModal(ad)}>
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: ad.image }} />

                  <LinearGradient
                    colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
                    style={styles.topGradientOverlay}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  >
                    <Text style={styles.title}>
                      {ad[`title_${currentLan}`]}
                    </Text>
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
                      {ad[`description_${currentLan}`]?.slice(0, 150)}...
                    </Text>
                  </LinearGradient>
                </View>
              </Pressable>
            ))
          ) : ads.length > 0 ? (
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
                    <Text style={styles.title}>
                      {ad[`title_${currentLan}`]}
                    </Text>
                  </LinearGradient>

                  <LinearGradient
                    colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
                    style={styles.bottomGradientOverlay}
                  >
                    <Text style={styles.content}>
                      {ad[`description_${currentLan}`]?.slice(0, 150)}...
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
        source={require("../../../../../assets/images/bottomEllipse.png")}
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

                <Text style={styles.modalText}>{t("website")}:</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`https://${selectedAd.web}`)}
                >
                  <Text style={styles.modalLink}>{selectedAd.web}</Text>
                </TouchableOpacity>
                {user?.isAdvertiser ? (
                  <View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#149BC6",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: hp(1),
                        borderRadius: 10,
                      }}
                      onPress={() => handleEdit(selectedAd)}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: hp(2.5),
                          fontWeight: "bold",
                          alignItems: "center",
                        }}
                      >
                        {t("edit")}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#e04343",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: hp(1),
                        borderRadius: 10,
                        marginTop: hp(1),
                      }}
                      onPress={() => handleDelete(selectedAd.id)}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: hp(2.5),
                          fontWeight: "bold",
                          alignItems: "center",
                        }}
                      >
                        {t("delete")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome
              onPress={() => setCreateModalVisible(false)}
              name="close"
              size={24}
              color="black"
              style={{ position: "absolute", top: hp(1), right: hp(2) }}
            />

            <ScrollView style={{ marginTop: hp(2), width: "100%" }}>
              <View>
                <Image
                  style={[
                    styles.modalImage,
                    selectedImage
                      ? {}
                      : {
                          backgroundColor: "#f0f0f0",
                          resizeMode: "contain",
                          padding: 20,
                          opacity: 0.5,
                        },
                  ]}
                  source={
                    selectedImage
                      ? { uri: selectedImage }
                      : require("../../../../../assets/images/placeholder.png")
                  }
                />
                <Pressable
                  onPress={handleImagePick}
                  style={{ position: "absolute", top: hp(25), right: hp(0) }}
                >
                  <MaterialCommunityIcons
                    name="file-image-plus"
                    size={36}
                    color="#149BC6"
                  />
                </Pressable>
              </View>
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  width: "100%",
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Title (English)"
                value={newAdData?.title_en} // Correct value assignment
                onChangeText={(text) => handleInputChange("title_en", text)} // Use handleInputChange
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  width: "100%",
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Title (Sinhala)"
                value={newAdData?.title_sin} // Correct value assignment
                onChangeText={(text) => handleInputChange("title_sin", text)} // Use handleInputChange
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  width: "100%",
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Title (Tamil)"
                value={newAdData?.title_tam} // Correct value assignment
                onChangeText={(text) => handleInputChange("title_tam", text)} // Use handleInputChange
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Description (English)"
                value={newAdData?.description_en}
                multiline={true}
                onChangeText={(text) =>
                  handleInputChange("description_en", text)
                } // Use handleInputChange
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Description (Sinhala)"
                value={newAdData?.description_sin}
                multiline={true}
                onChangeText={(text) =>
                  handleInputChange("description_sin", text)
                } // Use handleInputChange
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Description (Tamil)"
                value={newAdData?.description_tam}
                multiline={true}
                onChangeText={(text) =>
                  handleInputChange("description_tam", text)
                } // Use handleInputChange
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Contact"
                value={newAdData?.contact}
                onChangeText={(text) => handleInputChange("contact", text)} // Use handleInputChange
              />

              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1, // Gray border
                  borderColor: "#ccc", // Gray color for the border
                  borderRadius: 8, // Optional: rounded corners
                  marginBottom: hp(2), // Gap between inputs
                }}
                placeholder="Website"
                value={newAdData?.web}
                autoCapitalize="none" // Corrected autoCapitalize to "none"
                onChangeText={(text) => handleInputChange("web", text)} // Use handleInputChange
              />

              {loading ? (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Loading size={hp(7)} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#149BC6",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: hp(1),
                    borderRadius: 10,
                  }}
                  onPress={() => handleCreate()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: hp(2.5),
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    {t("create")}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModelVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FontAwesome
              onPress={() => setEditModelVisible(false)}
              name="close"
              size={24}
              color="black"
              style={{ position: "absolute", top: hp(1), right: hp(2) }}
            />

            <ScrollView style={{ marginTop: hp(2), width: "100%" }}>
              <View>
                <Image
                  style={[
                    styles.modalImage,
                    editAdData?.image
                      ? {}
                      : {
                          backgroundColor: "#f0f0f0",
                          resizeMode: "contain",
                          padding: 20,
                          opacity: 0.5,
                        },
                  ]}
                  source={
                    editImage ? { uri: editImage } : { uri: editAdData?.image }
                  }
                />
                <Pressable
                  onPress={handleImagePick}
                  style={{ position: "absolute", top: hp(25), right: hp(0) }}
                >
                  <MaterialCommunityIcons
                    name="file-image-plus"
                    size={36}
                    color="#149BC6"
                  />
                </Pressable>
              </View>
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Title (English)"
                value={editAdData?.title_en}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, title_en: text })
                }
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Title (Sinhala)"
                value={editAdData?.title_sin}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, title_sin: text })
                }
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  width: "100%",
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Title (Tamil)"
                value={editAdData?.title_tam}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, title_tam: text })
                }
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Description (English)"
                value={editAdData?.description_en}
                multiline={true}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, description_en: text })
                }
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Description (Sinhala)"
                value={editAdData?.description_sin}
                multiline={true}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, description_sin: text })
                }
              />
              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Description (Tamil)"
                value={editAdData?.description_tam}
                multiline={true}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, description_tam: text })
                }
              />

              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Contact"
                value={editAdData?.contact}
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, contact: text })
                }
              />

              <TextInput
                style={{
                  fontSize: hp(2),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  marginBottom: hp(2),
                }}
                placeholder="Website"
                value={editAdData?.web}
                autoCapitalize="none"
                onChangeText={(text) =>
                  seteditAdData({ ...editAdData, web: text })
                }
              />
              {loading ? (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Loading size={hp(7)} />
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#149BC6",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: hp(1),
                    borderRadius: 10,
                  }}
                  onPress={() => handleEditSave(editAdData.id)} // Save edited ad data
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: hp(2.5),
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    {t("save_changes")}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
