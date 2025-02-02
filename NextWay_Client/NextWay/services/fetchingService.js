import {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";

// Fetch all courses
const fetchCourses = async () => {
  try {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);

    // Map over the documents and include the document id
    const coursesList = coursesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: coursesList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

//Fetch Cousre by UNICODE
const fetchCourseByUNICODE = async (unicode) => {
  try {
    const q = query(collection(db, "courses"), where("UNICODE", "==", unicode));
    const snapshot = await getDocs(q);

    const coursesList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(coursesList);

    if (coursesList.length > 0) {
      return { success: true, data: coursesList };
    }

    return { success: false, msg: "Course not found with the given UNICODE" };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

// Fetch a single course by ID
const fetchCourseById = async (courseId) => {
  try {
    const courseDoc = doc(db, "courses", courseId);
    const courseSnapshot = await getDoc(courseDoc);
    if (courseSnapshot.exists()) {
      return { success: true, data: courseSnapshot.data() };
    } else {
      return { success: false, msg: "Course not found" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

// Fetch courses by stream
const fetchCoursesByStream = async (stream) => {
  try {
    const coursesCollection = collection(db, "courses");
    const q = query(coursesCollection, where("Stream", "==", stream));
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map((doc) => doc.data());
    return { success: true, data: coursesList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

//fetch by name

const fetchCoursesByName = async (name) => {
  try {
    // Ensure the keyword is in uppercase
    const processedName = name.trim().toUpperCase();

    // Fetch all courses from Firestore
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);

    // Map Firestore documents to course data
    const coursesList = coursesSnapshot.docs.map((doc) => doc.data());

    // Filter courses to find matches (check if COURSE field exists)
    const filteredCourses = coursesList.filter(
      (course) => course.COURSE_eng && course.COURSE_eng.includes(processedName)
    );

    // Return results
    if (filteredCourses.length > 0) {
      return { success: true, data: filteredCourses };
    } else {
      return { success: false, msg: "No courses found matching the keyword!" };
    }
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    return { success: false, msg: error.message };
  }
};

// Fetch courses by subject grade
const fetchCoursesBySubjectGrade = async (subject, grade) => {
  try {
    const coursesCollection = collection(db, "courses");
    const q = query(
      coursesCollection,
      where(`MinimumQualifications.RequiredGrades.${subject}`, "==", grade)
    );
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map((doc) => doc.data());
    return { success: true, data: coursesList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

// Fetch courses by university
const fetchCoursesByUniversity = async (university) => {
  try {
    const coursesCollection = collection(db, "courses");
    const q = query(coursesCollection, where("University", "==", university));
    const coursesSnapshot = await getDocs(q);
    const coursesList = coursesSnapshot.docs.map((doc) => doc.data());
    return { success: true, data: coursesList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

// const fetchCoursesByCriteria = async (
//   stream,
//   subjectsJson,
//   resultsJson,
//   zScore,
//   interest,
//   district
// ) => {
//   try {

//     console.log(`Interest: ${interest}`);

//     // Parse JSON data
//     const subjects = JSON.parse(subjectsJson);
//     const results = JSON.parse(resultsJson);

//     const subjectGrades = {};
//     results.forEach((result, index) => {
//       subjectGrades[subjects[index]] = result;
//     });

//     // Fetch courses from the database
//     const coursesCollection = collection(db, "courses");
//     const q = query(coursesCollection, where("STREAM", "==", stream));
//     const coursesSnapshot = await getDocs(q);

//     const courses = coursesSnapshot.docs.map((doc) => {
//       const data = doc.data();
//       return data;
//     });

//     const gradeOrder = { A: 1, B: 2, C: 3, S: 4 };

//     const doesMatchGrades = (requiredGrades, subjectGrades) => {
//       const allSubjectsPresent = Object.keys(subjectGrades).every(
//         (subject) => requiredGrades.hasOwnProperty(subject)
//       );

//       if (!allSubjectsPresent) {
//         console.log("Not all required subjects are present.");
//         return false;
//       }

//       return Object.entries(subjectGrades).every(([subject, enteredGrade]) => {
//         const requiredGrade = requiredGrades[subject];
//         const enteredGradeValue = gradeOrder[enteredGrade];
//         const requiredGradeValue = gradeOrder[requiredGrade];

//         return enteredGradeValue <= requiredGradeValue;
//       });
//     };

//     const filteredCourses = courses.filter((course) => {
//       const requiredGrades = course.MINIMUM_QUALIFICATIONS.RequiredGrades || {};

//       const matchGrades = doesMatchGrades(requiredGrades, subjectGrades);

//       // Retrieve the Z-Score specific to the district
//       const districtZScore = course.Z_SCORE[district];
//       const isZScoreValid = !zScore || (districtZScore && districtZScore <= parseFloat(zScore));

//       // Check interest if provided
//       const interestMatches = !interest ||
//         (course.INTEREST && course.INTEREST.some(keyword =>
//           interest.toLowerCase().includes(keyword.toLowerCase())
//         ));

//       console.log(`Course: ${course.COURSE} - Interest Matches: ${interestMatches}`);

//       return matchGrades && isZScoreValid && interestMatches;
//     });

//     return { success: true, data: filteredCourses };
//   } catch (error) {
//     console.error("Error fetching courses by criteria:", error);
//     return { success: false, msg: error.message };
//   }
// };

const fetchCoursesByCriteria = async (
  stream,
  subjectsJson,
  resultsJson,
  zScore,
  interest,
  district
) => {
  try {
   

    // Normalize and parse the interest parameter
    const normalizedInterestArray = (interest || "")
      .split(",")
      .map((term) => normalizeText(term.trim()));

    // Parse JSON data
    const subjects = JSON.parse(subjectsJson);
    const results = JSON.parse(resultsJson);

    const subjectGrades = {};
    results.forEach((result, index) => {
      subjectGrades[subjects[index]] = result;
    });

    // Fetch courses from the database
    const coursesCollection = collection(db, "courses");
    const q = query(coursesCollection, where("STREAM", "==", stream));
    const coursesSnapshot = await getDocs(q);

    const courses = coursesSnapshot.docs.map((doc) => {
      return doc.data();
    });

    const gradeOrder = { A: 1, B: 2, C: 3, S: 4 };

    const doesMatchGrades = (requiredGrades, subjectGrades) => {
      // If "Any_three_subjects" exists in requiredGrades, return true immediately
      if (requiredGrades.hasOwnProperty("Any_three_subjects")) {
        return true;
      }
    
      // Check if all required subjects are present in subjectGrades
      const allSubjectsPresent = Object.keys(subjectGrades).every((subject) =>
        requiredGrades.hasOwnProperty(subject)
      );
    
      if (!allSubjectsPresent) {
        console.log("Not all required subjects are present.");
        return false;
      }
    
      // Check if entered grades meet or exceed required grades
      return Object.entries(subjectGrades).every(([subject, enteredGrade]) => {
        const requiredGrade = requiredGrades[subject];
        const enteredGradeValue = gradeOrder[enteredGrade];
        const requiredGradeValue = gradeOrder[requiredGrade];
    
        return enteredGradeValue <= requiredGradeValue;
      });
    };
    

    const filteredCourses = courses.filter((course) => {
      const requiredGrades = course.MINIMUM_QUALIFICATIONS.RequiredGrades || {};

      const matchGrades = doesMatchGrades(requiredGrades, subjectGrades);

      // Retrieve the Z-Score specific to the district
      const districtZScore = course.Z_SCORE[district];
      const isZScoreValid =
        !zScore || (districtZScore && districtZScore <= parseFloat(zScore));

      // Normalize and check interest if provided
      const normalizedCourseInterests = course.INTEREST.map(normalizeText);

      // Handle both Sinhala and English text
      const interestMatches =
        !normalizedInterestArray.length ||
        normalizedCourseInterests.some((keyword) =>
          normalizedInterestArray.some(
            (interest) =>
              interest.includes(keyword) ||
              keyword.toLowerCase().includes(interest.toLowerCase())
          )
        );

     

      return matchGrades && isZScoreValid && interestMatches;
    });

    return { success: true, data: filteredCourses };
  } catch (error) {
    console.error("Error fetching courses by criteria:", error);
    return { success: false, msg: error.message };
  }
};

const normalizeText = (text) => {
  return text.normalize("NFC"); // Choose the normalization form as needed
};

const deleteCourseById = async (courseId) => {
  try {
    const courseDoc = doc(db, "courses", courseId);
    await deleteDoc(courseDoc); // Attempt to delete the document
    return { success: true, msg: "Course deleted successfully" };
  } catch (error) {
    return { success: false, msg: error.message }; // Return error message if deletion fails
  }
};

const fetchNotification = async () => {
  try {
    const notificationCollection = collection(db, "notifications");
    const notificationSnapshot = await getDocs(notificationCollection);
    const notificationList = notificationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: notificationList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

const viewNotification = async (id) => {
  try {
    const notificationDoc = doc(db, "notifications", id);
    const notificationSnapshot = await getDoc(notificationDoc);
    if (notificationSnapshot.exists()) {
      const newData = {
        read: true,
      };
      await updateDoc(notificationDoc, newData);

      return { success: true, msg: "Notification read successfully" };
    } else {
      return { success: false, msg: "Notification not found" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

export {
  fetchCourses,
  fetchCoursesByStream,
  fetchCoursesBySubjectGrade,
  fetchCoursesByUniversity,
  fetchCourseById,
  fetchCoursesByCriteria,
  fetchCourseByUNICODE,
  deleteCourseById,
  fetchCoursesByName,
  fetchNotification,
  viewNotification,
};
