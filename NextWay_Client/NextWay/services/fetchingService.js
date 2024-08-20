import {
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";

// Fetch all courses
const fetchCourses = async () => {
  try {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map((doc) => doc.data());
    return { success: true, data: coursesList };
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


const fetchCoursesByCriteria = async (
  stream,
  subjectsJson,
  resultsJson,
  zScore
) => {
  try {
    // Parse the subjects and results JSON strings into arrays
    const subjects = JSON.parse(subjectsJson);
    const results = JSON.parse(resultsJson);

    console.log("Parsed Subjects:", subjects);
    console.log("Parsed Results:", results);

    // Create an object to map subjects to their corresponding grades
    const subjectGrades = {};
    results.forEach((result, index) => {
      // Store subject names in lowercase for case-insensitive comparison
      subjectGrades[subjects[index]] = result;
    });

    console.log("Subject Grades Mapping:", subjectGrades);

    // Query the Firestore collection for courses in the specified stream
    const coursesCollection = collection(db, "courses");
    const q = query(coursesCollection, where("STREAM", "==", stream));
    const coursesSnapshot = await getDocs(q);

    console.log("Courses Snapshot Size:", coursesSnapshot.size);

    // Map the retrieved course documents to an array of course data
    const courses = coursesSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Retrieved Course Data:", data);
      return data;
    });

    // Define the order of grades for comparison purposes
    const gradeOrder = { A: 1, B: 2, C: 3, S: 4 };

    // Function to check if the entered grades match or exceed the required grades
    const doesMatchGrades = (requiredGrades, subjectGrades) => {
      console.log("Required Grades:", requiredGrades);
      console.log("Subject Grades for Comparison:", subjectGrades);

      return Object.entries(subjectGrades).every(([subject, enteredGrade]) => {
        // Convert required subject names to lowercase for comparison
        const requiredGrade = requiredGrades[subject];

        // If the required grade for a subject isn't specified, skip this subject
        if (!requiredGrade) {
          console.log(`Subject: ${subject} not required`);
          return true;
        }

        // Compare the entered grade with the required grade
        const enteredGradeValue = gradeOrder[enteredGrade];
        const requiredGradeValue = gradeOrder[requiredGrade];

        console.log(
          `Comparing Grades for Subject: ${subject} | Entered: ${enteredGrade}, Required: ${requiredGrade}`
        );

        return enteredGradeValue <= requiredGradeValue;
      });
    };

    // Filter the courses based on matching grades and valid Z-Score
    const filteredCourses = courses.filter((course) => {
      const requiredGrades =
        course.MINIMUM_QUALIFICATIONS.RequiredGrades || {};

      // Check if the course matches the user's entered grades
      const matchGrades = doesMatchGrades(requiredGrades, subjectGrades);

      console.log(
        `Course: ${course.Course} | Matches Grades: ${matchGrades}`
      );

      // Check if the course's Z-Score is within the user's entered Z-Score
      const courseZScore = parseFloat(course.Z_SCORE);
      const isZScoreValid = courseZScore <= parseFloat(zScore);

      console.log(
        `Course: ${course.Course} | Course Z-Score: ${courseZScore}, User Z-Score: ${zScore} | Is Z-Score Valid: ${isZScoreValid}`
      );

      // Only return the course if it meets both criteria
      return matchGrades && isZScoreValid;
    });

    console.log("Filtered Courses:", filteredCourses);

    // Return the filtered courses if successful
    return { success: true, data: filteredCourses };
  } catch (error) {
    // Log and return the error if something goes wrong
    console.error("Error fetching courses by criteria:", error);
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
};
