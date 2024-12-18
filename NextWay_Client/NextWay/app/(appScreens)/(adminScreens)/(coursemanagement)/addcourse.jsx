import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// Adjust the path accordingly
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";
import { uploadCourseData } from "../../../../services/adminService";
import Loading from "../../../../components/Loading/Loading";
export default function AddCourse() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const districts = t("districts", { returnObjects: true });

  const [courseDetails, setCourseDetails] = useState({
    COURSE_eng: "",
    COURSE_sin: "",
    COURSE_tam: "",
    UNIVERSITY_eng: "",
    UNIVERSITY_sin: "",
    UNIVERSITY_tam: "",
    UNICODE: "",
    DURATION_eng: "",
    DESCRIPTION_eng: "",
    DESCRIPTION_sin: "",
    DESCRIPTION_tam: "",
    STREAM: "",
    INTEREST: [],
    JOB_ROLES_eng: [],
    JOB_ROLES_sin: [],
    JOB_ROLES_tam: [],
  });

  const [interests, setInterests] = useState({
    eng: [],
    sin: [],
    tam: [],
  });

  const handleInterestArrayChange = (field, value) => {
    const arrayValue = value.split(",").map((item) => item.trim()); // Split input into an array

    // Update the specific interest field
    setInterests((prevState) => {
      const newState = {
        ...prevState,
        [field]: arrayValue,
      };

      // Merge interests and update courseDetails
      mergeInterests(newState);
      return newState;
    });
  };

  // Function to merge interests into the courseDetails
  const mergeInterests = (interests) => {
    const mergedInterests = [
      ...interests.eng,
      ...interests.sin,
      ...interests.tam,
    ].filter((item) => item.trim() !== ""); // Filter out empty strings

    // Update the INTEREST field in courseDetails
    setCourseDetails((prevState) => ({
      ...prevState,
      INTEREST: mergedInterests,
    }));
  };

  const [subjectGrades, setSubjectGrades] = useState([
    { subject: "", grade: "" },
  ]);
  const [zScore, setZScore] = useState(
    districts.reduce((acc, district) => {
      acc[district.value] = null; // Set each district's Z-Score to null
      return acc;
    }, {})
  );

  const handleZScoreChange = (district, value) => {
    setZScore((prevScores) => ({
      ...prevScores,
      [district]: value, // Update the specific district's Z-Score
    }));
  };

  const handleChange = (field, value) => {
    setCourseDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    const newArray = value.split(",").map((item) => item.trim()); // Split input string into an array
    setCourseDetails((prevState) => ({
      ...prevState,
      [field]: newArray,
    }));
  };

  const handleSubjectGradeChange = (index, field, value) => {
    const updatedSubjectGrades = [...subjectGrades];
    updatedSubjectGrades[index][field] = value;
    setSubjectGrades(updatedSubjectGrades);
  };

  const addNewSubjectGrade = () => {
    setSubjectGrades([...subjectGrades, { subject: "", grade: "" }]);
  };

  const removeSubjectGrade = (index) => {
    const updatedSubjectGrades = subjectGrades.filter((_, i) => i !== index);
    setSubjectGrades(updatedSubjectGrades);
  };

  const handleUpload = async () => {
    try {
      // Ensure required fields are not empty
      if (
        !courseDetails.UNICODE ||
        !courseDetails.COURSE_eng ||
        !courseDetails.STREAM ||
        !courseDetails.UNIVERSITY_eng
      ) {
        alert("Please fill in all required fields.");
        return; // Exit the function if any required field is empty
      }

      // Prepare the Z_SCORE with "NotQualified" for any null values
      const formattedZScore = Object.fromEntries(
        Object.entries(zScore).map(([key, value]) => [
          key,
          value || "NotQualified",
        ])
      );

      // Prepare the data to be uploaded
      const dataToUpload = {
        ...courseDetails,
        MINIMUM_QUALIFICATIONS: {
          RequiredGrades: subjectGrades.reduce((acc, item) => {
            if (item.subject && item.grade) {
              acc[item.subject] = item.grade; // Map subjects to grades
            }
            return acc;
          }, {}),
          OtherQualifications: {}, // If you have any other qualifications, add them here
        },
        Z_SCORE: formattedZScore,
        SUBJECTS: subjectGrades
          .map((item) => item.subject)
          .filter((subject) => subject !== ""), // Filter out empty subjects
      };

      // Check if there are at least 3 subjects with grades
      const requiredGradesCount = Object.keys(
        dataToUpload.MINIMUM_QUALIFICATIONS.RequiredGrades
      ).length;
      if (requiredGradesCount < 3) {
        alert("Please provide at least three subjects with grades.");
        return; // Exit the function if less than 3 required grades
      }

      // Call the upload function with the prepared data
      const uploadResult = await uploadCourseData(dataToUpload);
      if (uploadResult.success) {
        // Optionally, reset input fields or navigate away after successful upload
        // Example: router.push('/nextPage');
      } else {
        alert(uploadResult.msg); // Show error message if upload fails
      }
    } catch (e) {
      console.error("Error in handleUpload: ", e);
    }
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
          <Text
            style={{ fontSize: wp(5), paddingLeft: wp(5), fontWeight: 600 }}
          >
            {t("New course")}
          </Text>
        </Pressable>

        <Image
          style={{ width: hp(27), height: hp(20) }}
          resizeMode="stretch"
          source={require("../../../../assets/images/elipses.png")}
        />
      </View>

      <View
        style={{
          alignItems: "left",
          flex: 4,
          paddingHorizontal: wp(5),
          transform: [{ translateY: -hp(5) }],
        }}
      >
        <CustomKeyboardView>
          <Text style={styles.text}>UNICODE:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course unicode"
            value={courseDetails.UNICODE}
            onChangeText={(value) => handleChange("UNICODE", value)}
          />

          <Text style={styles.text}>Course Name (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course name in English"
            value={courseDetails.COURSE_eng}
            onChangeText={(value) => handleChange("COURSE_eng", value)}
          />

          <Text style={styles.text}>Course Name (Sinhala):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course name in Sinhala"
            value={courseDetails.COURSE_sin}
            onChangeText={(value) => handleChange("COURSE_sin", value)}
          />

          <Text style={styles.text}>Course Name (Tamil):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course name in Tamil"
            value={courseDetails.COURSE_tam}
            onChangeText={(value) => handleChange("COURSE_tam", value)}
          />

          <Text style={styles.text}>University (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter university name in English"
            value={courseDetails.UNIVERSITY_eng}
            onChangeText={(value) => handleChange("UNIVERSITY_eng", value)}
          />

          <Text style={styles.text}>University (Sinhala):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter university name in Sinhala"
            value={courseDetails.UNIVERSITY_sin}
            onChangeText={(value) => handleChange("UNIVERSITY_sin", value)}
          />

          <Text style={styles.text}>University (Tamil):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter university name in Tamil"
            value={courseDetails.UNIVERSITY_tam}
            onChangeText={(value) => handleChange("UNIVERSITY_tam", value)}
          />

          <Text style={styles.text}>Stream:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course stream"
            value={courseDetails.STREAM}
            onChangeText={(value) => handleChange("STREAM", value)}
          />

          <Text style={styles.text}>Description (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course description in English"
            value={courseDetails.DESCRIPTION_eng}
            onChangeText={(value) => handleChange("DESCRIPTION_eng", value)}
          />

          <Text style={styles.text}>Description (Sinhala):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course description in Sinhala"
            value={courseDetails.DESCRIPTION_sin}
            onChangeText={(value) => handleChange("DESCRIPTION_sin", value)}
          />

          <Text style={styles.text}>Description (Tamil):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course description in Tamil"
            value={courseDetails.DESCRIPTION_tam}
            onChangeText={(value) => handleChange("DESCRIPTION_tam", value)}
          />

          <Text style={styles.text}>Duration (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter course duration in English"
            value={courseDetails.DURATION_eng}
            onChangeText={(value) => handleChange("DURATION_eng", value)}
          />

          <Text style={styles.text}>Interests (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter interests in English (comma-separated)"
            value={interests.eng.join(", ")} // Join array into a string for display
            onChangeText={(value) => handleInterestArrayChange("eng", value)}
          />

          <Text style={styles.text}>Interests (Sinhala):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter interests in Sinhala (comma-separated)"
            value={interests.sin.join(", ")} // Join array into a string for display
            onChangeText={(value) => handleInterestArrayChange("sin", value)}
          />

          <Text style={styles.text}>Interests (Tamil):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter interests in Tamil (comma-separated)"
            value={interests.tam.join(", ")} // Join array into a string for display
            onChangeText={(value) => handleInterestArrayChange("tam", value)}
          />

          <Text style={styles.text}>Job Roles (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter job roles in English (comma-separated)"
            value={courseDetails.JOB_ROLES_eng.join(", ")} // Join array into a string for display
            onChangeText={(value) => handleArrayChange("JOB_ROLES_eng", value)}
          />

          <Text style={styles.text}>Job Roles (Sinhala):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter job roles in Sinhala (comma-separated)"
            value={courseDetails.JOB_ROLES_sin.join(", ")}
            onChangeText={(value) => handleArrayChange("JOB_ROLES_sin", value)}
          />

          <Text style={styles.text}>Job Roles (Tamil):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter job roles in Tamil (comma-separated)"
            value={courseDetails.JOB_ROLES_tam.join(", ")}
            onChangeText={(value) => handleArrayChange("JOB_ROLES_tam", value)}
          />

          <Text style={styles.text}>Minimum Qualifications:</Text>
          {subjectGrades.map((subjectGrade, index) => (
            <View key={index} style={styles.subjectGradeContainer}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 10,marginBottom:0  }]}
                placeholder="Subject"
                value={subjectGrade.subject}
                onChangeText={(value) =>
                  handleSubjectGradeChange(index, "subject", value)
                }
              />
              <TextInput
                style={[styles.input,{ flex: 0.8, marginRight: 10,marginBottom:0 }]}
                placeholder="Grade"
                value={subjectGrade.grade}
                onChangeText={(value) =>
                  handleSubjectGradeChange(index, "grade", value)
                }
              />
              <TouchableOpacity onPress={() => removeSubjectGrade(index)} style={{alignItems:'center'}}>
                <MaterialCommunityIcons name="delete" size={40} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          
                <TouchableOpacity style={{ backgroundColor: "#149BC6", padding:hp(1),alignItems:'center'}} onPress={addNewSubjectGrade}>
                    <Text style={{color:'white',fontSize:hp(2)}}>Add Subject</Text>
                </TouchableOpacity>
          <Text style={[styles.text,{marginTop:hp(2)}]}>Z-Scores:</Text>
          {districts.map((district) => (
            <View key={district.value} style={styles.zScoreContainer}>
              <Text style={styles.zScoreText}>{district.label}</Text>
              <TextInput
                    style={[styles.input,{marginBottom:0}]}
                placeholder="Enter Z-Score"
                keyboardType="numeric"
                value={zScore[district.value]?.toString() || ""}
                onChangeText={(value) =>
                  handleZScoreChange(district.value, value)
                }
              />
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'center',marginTop:hp(1) }}>

                {loading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Loading size={hp(10)} />
                </View>
              ) : (
                <TouchableOpacity
                onPress={handleUpload}
                  style={{
                    backgroundColor: "#149BC6", padding: hp(2), borderRadius: 40,width:wp(60)
                  }}
                >
                  <Text style={{ fontSize: hp(3), fontWeight: "600", textAlign: "center", color: "white", }}
                  >
                    Add Course
                  </Text>
                </TouchableOpacity>
              )}
          </View>

         
        </CustomKeyboardView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: wp(4.5),
    marginBottom: hp(1),
  },
  input: {
    height: hp(6),
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: hp(2),
  },
  subjectGradeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  zScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2),
    paddingHorizontal:wp(10)
  },
  zScoreText: {
    flex: 1,
    fontSize:hp(2)
  },
});
