import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useLocalSearchParams , useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";


import CustomKeyboardView from "../../../../components/keyboardView/CustomKeyboardView";
import { uploadOrUpdateCourseData } from "../../../../services/adminService";
import Loading from "../../../../components/Loading/Loading";

export default function EditCourse() {


  const [loading, setLoading] = useState(false);

  const { course} = useLocalSearchParams();

  const router = useRouter();
const{t}= useTranslation();

  const parsedCourse = course ? JSON.parse(course) : null;


  const districts = t("districts", { returnObjects: true });

  const [courseDetails, setCourseDetails] = useState({
    COURSE_eng: parsedCourse?.COURSE_eng || "",
    COURSE_sin: parsedCourse?.COURSE_sin || "",
    COURSE_tam: parsedCourse?.COURSE_tam || "",
    UNIVERSITY_eng: parsedCourse?.UNIVERSITY_eng || "",
    UNIVERSITY_sin: parsedCourse?.UNIVERSITY_sin || "",
    UNIVERSITY_tam: parsedCourse?.UNIVERSITY_tam || "",
    UNICODE: parsedCourse?.UNICODE || "",
    DURATION_eng: parsedCourse?.DURATION || "",
    DESCRIPTION_eng: parsedCourse?.DESCRIPTION || "",
    DESCRIPTION_sin: parsedCourse?.DESCRIPTION_sin || "",
    DESCRIPTION_tam: parsedCourse?.DESCRIPTION_tam || "",
    STREAM: parsedCourse?.STREAM || "",
    INTEREST: parsedCourse?.INTEREST || [],
    JOB_ROLES_eng: parsedCourse?.JOB_ROLES_eng || [],
    JOB_ROLES_sin: parsedCourse?.JOB_ROLES_sin || [],
    JOB_ROLES_tam: parsedCourse?.JOB_ROLES_tam || [],
  });

  const [interests, setInterests] = useState({
    eng: parsedCourse?.INTEREST || [],
    sin: parsedCourse?.INTEREST_sin || [],
    tam: parsedCourse?.INTEREST_tam || [],
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
  

  const [subjectGrades, setSubjectGrades] = useState(() => {

    if (parsedCourse?.MINIMUM_QUALIFICATIONS?.RequiredGrades) {
      return Object.entries(parsedCourse.MINIMUM_QUALIFICATIONS.RequiredGrades).map(
        ([subject, grade]) => ({
          subject,
          grade,
        })
      );
    }
    return [{ subject: "", grade: "" }];
  });

  
  // Handle changes in subject or grade
  const handleSubjectGradeChange = (index, field, value) => {
    const updatedSubjectGrades = [...subjectGrades];
    updatedSubjectGrades[index][field] = value;
    setSubjectGrades(updatedSubjectGrades);
  };

  // Add a new subject-grade pair
  const addNewSubjectGrade = () => {
    setSubjectGrades([...subjectGrades, { subject: "", grade: "" }]);
  };


const removeSubjectGrade = (index) => {
  const updatedSubjectGrades = subjectGrades.filter((_, i) => i !== index);
  setSubjectGrades(updatedSubjectGrades); // Update local state
};



  const [zScore, setZScore] = useState(() => {
    return districts.reduce((acc, district) => {
      acc[district.value] = parsedCourse?.Z_SCORE[district.value] || null; // Set the Z-score or null if not found
      return acc;
    }, {});
  });



  const handleZScoreChange = (district, value) => {
    setZScore((prevScores) => ({
      ...prevScores,
      [district]: value, 
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



  const handleUpload = async () => { 
    try {
      if (
        !courseDetails.UNICODE ||
        !courseDetails.COURSE_eng ||
        !courseDetails.STREAM ||
        !courseDetails.UNIVERSITY_eng
      ) {
        alert("Please fill in all required fields.");
        return;
      }
  
      const formattedZScore = Object.fromEntries(
        Object.entries(zScore).map(([key, value]) => [
          key,
          value || "NotQualified",
        ])
      );
  
      const dataToUpload = {
        ...courseDetails,
        MINIMUM_QUALIFICATIONS: {
          RequiredGrades: subjectGrades.reduce((acc, item) => {
            if (item.subject && item.grade) {
              acc[item.subject] = item.grade;
            }
            return acc;
          }, {}),
          OtherQualifications: {}, // Assuming OtherQualifications is empty or passed with data
        },
        Z_SCORE: formattedZScore,
        SUBJECTS: subjectGrades
          .map((item) => item.subject)
          .filter((subject) => subject !== ""),
      };
    

      const requiredGradesCount = Object.keys(
       
        dataToUpload.MINIMUM_QUALIFICATIONS.RequiredGrades
      ).length;
      if (requiredGradesCount < 3) {
        alert("Please provide at least three subjects with grades.");
        return;
      }
  
      setLoading(true)
      const uploadResult = await uploadOrUpdateCourseData(parsedCourse.id, dataToUpload);
      setLoading(false)

      if (uploadResult.success) {
        alert(uploadResult.msg); 
        router.push('viewcourses')
      } else {
        alert(uploadResult.msg); 
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
            {t("Edit course")}
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
            value={interests.eng.join(", ")}  
            onChangeText={(value) => handleInterestArrayChange("eng", value)}
          />

          <Text style={styles.text}>Interests (Sinhala):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter interests in Sinhala (comma-separated)"
            value={interests.sin.join(", ")} 
            onChangeText={(value) => handleInterestArrayChange("sin", value)}
          />

          <Text style={styles.text}>Interests (Tamil):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter interests in Tamil (comma-separated)"
            value={interests.tam.join(", ")} 
            onChangeText={(value) => handleInterestArrayChange("tam", value)}
          />

          <Text style={styles.text}>Job Roles (English):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter job roles in English (comma-separated)"
            value={courseDetails.JOB_ROLES_eng.join(", ")} 
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
                    Save Changes
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
