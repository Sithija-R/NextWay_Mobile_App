import {
    View,
    Text,
    Pressable,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    StyleSheet,
    ScrollView,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AntDesign from "@expo/vector-icons/AntDesign";
  import { StatusBar } from "expo-status-bar";
  import { useTranslation } from "react-i18next";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { useRouter } from "expo-router";
  import { deleteCourseById } from "../../../../services/fetchingService";
  import { deleteUser, fetchUsers, searchUser } from "../../../../services/adminService";
  import { Avatar } from "@rneui/themed";
  import Loading from "../../../../components/Loading/Loading";
  import MaterialIcons from '@expo/vector-icons/MaterialIcons';
  
  export default function RoleManagement() {
    const router = useRouter();
    const { t } = useTranslation();
    const [keyword, setKeyword] = useState("");
    const [user, setUser] = useState([]);
    const [alluser, setAllUser] = useState([]);
    const [loading, setLoading] = useState(false);
  
  
    useEffect(() => {
      const fetchall = async () => {
        try {
          const response = await fetchUsers();
          if (response && response.success) {
            setAllUser(response.data);
          } else {
            console.log("No users found");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchall();
    }, []); 
  
    useEffect(() => {
      if (keyword === "") {
        setUser([]); 
      }
    }, [keyword]);
  
  
    const handleSearch = async () => {
      if (!keyword) {
        Alert.alert("Please enter email or name");
        return;
      }
      setLoading(true);
      const response = await searchUser(keyword.trim());
      setLoading(false);
  
      if (response.success && response.data.length > 0) {
        setUser(response.data);
      } else {
        Alert.alert("No User Found!");
      }
    };
  
    
    const handleDeleteUser = async (id) => {
      Alert.alert("Delete User", "Are you sure you want to delete this user?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
       
            const response = await deleteUser(id);
            
            if (response.success) {
              Alert.alert("Success", response.msg);
              
              
              setUser(prevUsers => prevUsers.filter(user => user.id !== id));
              setAllUser(prevUsers => prevUsers.filter(user => user.id !== id));
            
            } else {
              Alert.alert("Error", response.msg);
            }
          },
        },
      ]);
    };
    
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Pressable
            onPress={() => router.back()}
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
            <AntDesign name="left" size={hp(3)} color="black" />
            <Text style={{ fontSize: wp(5), paddingLeft: wp(5), fontWeight: 600 }}>
              {t("Delete Users")}
            </Text>
          </Pressable>
  
          <Image
            style={{ width: hp(27), height: hp(20) }}
            resizeMode="stretch"
            source={require("../../../../assets/images/elipses.png")}
          />
        </View>
  
        <View style={{ alignItems: "center", flex: 7, justifyContent: "space-between", flexWrap: "wrap" }}>
          <View style={{ flexWrap: "wrap", padding: wp(6) }}>
            <Text style={{ fontSize: hp(2.5), fontWeight: "600", textAlign: "left" }}>
              {t("Search Users")}
            </Text>
            <View style={{ marginTop: hp(2), flexDirection: "row", alignItems: "center", width: "100%", padding: hp(1), justifyContent: "space-between" }}>
              <TextInput
                style={{
                  width: "60%",
                  borderWidth: 2,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 10,
                  fontSize: hp(2.5),
                  paddingHorizontal: wp(3),
                  paddingVertical: hp(1),
                  flex: 1,
                  marginRight: wp(2),
                }}
                placeholder={t("email or name")}
                onChangeText={setKeyword}
                autoCapitalize="none"
              />
  
              {loading ? (
                <View style={{ flexDirection: "row", paddingHorizontal: wp(6) }}>
                  <Loading size={hp(6)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSearch}
                  style={{
                    backgroundColor: "#149BC6",
                    padding: hp(1),
                    paddingHorizontal: wp(2),
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
                    {t("Search")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
  
          <View style={styles.container}>
            <ScrollView>
              {user.length > 0 ? (
                user.map((user, index) => (
                  <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    width: wp(90),
                    maxHeight: hp(67),
                    backgroundColor: "rgba(128, 128, 128, 0.2)",
                    padding: hp(1),
                    paddingVertical: hp(2),
                    borderRadius: 15,
                    marginBottom: hp(2),
                    position: "relative",
                  }}
                >
                  <Avatar
                    size={hp(10)}
                    rounded
                    source={{
                      uri:
                        user?.profileImage ||
                        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
                    }}
                    containerStyle={{
                      borderWidth: 2,
                      borderColor: "#149BC6",
                    }}
                  />
                  <View style={{ paddingLeft: wp(3) }}>
                    <Text style={{ fontSize: hp(2.1), fontWeight: "bold" }}>
                      {user?.username}
                    </Text>
                    <Text style={{ fontSize: hp(2), color: "#149BC6" }}>
                      {user?.email}
                    </Text>
                    <Text style={{ fontSize: hp(2) }}>{user?.role}</Text>
                  </View>
  
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(user?.id)} 
                    style={{
                      position: "absolute",
                      right: wp(2),
                      top: "70%",
                      transform: [{ translateY: -18 }],
                    }}
                  >
                    <MaterialIcons name="delete-forever" size={40} color="red" />
                  </TouchableOpacity>
                </View>
                ))
              ) : alluser.length > 0 ? (
                alluser.map((user, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      width: wp(90),
                      maxHeight: hp(67),
                      backgroundColor: "rgba(128, 128, 128, 0.2)",
                      padding: hp(1),
                      paddingVertical: hp(2),
                      borderRadius: 15,
                      marginBottom: hp(2),
                      position: "relative",
                    }}
                  >
                    <Avatar
                      size={hp(10)}
                      rounded
                      source={{
                        uri:
                          user?.profileImage ||
                          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
                      }}
                      containerStyle={{
                        borderWidth: 2,
                        borderColor: "#149BC6",
                      }}
                    />
                    <View style={{ paddingLeft: wp(3) }}>
                      <Text style={{ fontSize: hp(2.1), fontWeight: "bold" }}>
                        {user?.username}
                      </Text>
                      <Text style={{ fontSize: hp(2), color: "#149BC6" }}>
                        {user?.email}
                      </Text>
                      <Text style={{ fontSize: hp(2) }}>{user?.role}</Text>
                    </View>
  
                    <TouchableOpacity
                      onPress={() => handleDeleteUser(user?.id)} 
                      style={{
                        position: "absolute",
                        right: wp(2),
                        top: "70%",
                        transform: [{ translateY: -18 }],
                      }}
                    >
                      <MaterialIcons name="delete-forever" size={40} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>No Users Found</Text>
              )}
            </ScrollView>
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
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    detailHeader: {
      fontSize: 18,
      marginBottom: 8,
      fontWeight: "bold",
    },
    details: {
      fontSize: 18,
      marginBottom: 8,
      fontWeight: "normal",
    },
    text: {
      marginBottom: hp(2),
    },
  });
  