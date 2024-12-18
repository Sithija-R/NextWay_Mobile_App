import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";



export const uploadCourseData = async (dataToUpload) => {
   
    try {
      const docRef = await addDoc(collection(db, 'coursetest'), dataToUpload);
      console.log("Document written with ID: ", docRef.id);
      return { success: true, msg: 'Course data uploaded successfully' };
    } catch (error) {
      console.error("Error adding document: ", error);
      return { success: false, msg: error.message };
    }
  };
  
  