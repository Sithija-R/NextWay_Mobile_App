import { addDoc, collection, doc, setDoc } from "firebase/firestore";
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
  
  export const uploadOrUpdateCourseData = async (id, dataToUpload) => {
    try {
      if (!id) {
        throw new Error("Document ID is required for updating the course.");
      }
  
      console.log("Updating document with ID: ", id);
    
      const courseDocRef = doc(db, 'coursetest', id);
      await setDoc(courseDocRef, dataToUpload, { merge: true }); 
  
      console.log("Document written/updated with ID: ", id);
      return { success: true, msg: 'Course data updated successfully' };
    } catch (error) {
      console.error("Error updating document: ", error);
      return { success: false, msg: error.message };
    }
  };