import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";




const newAdvertiserReq = async (payload) => {
    try {
        
      const docRef = await addDoc(collection(db, "advertiser_req"), payload);
      console.log("Document written with ID: ", docRef.id);
      return { success: true, msg: "Course data uploaded successfully" };
    } catch (error) {
      console.error("Error adding document: ", error);
      return { success: false, msg: error.message };
    }
  };



  export{
    newAdvertiserReq
  }