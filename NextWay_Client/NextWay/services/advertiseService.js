import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";




const newAdvertiserReq = async (payload) => {
    try {
        
      const docRef = await addDoc(collection(db, "advertiser_req"), payload);
     
      return { success: true, msg: "Course data uploaded successfully" };
    } catch (error) {
      console.error("Error adding document: ", error);
      return { success: false, msg: error.message };
    }
  };

const createAdvertisement= async (payload) => {
  try {
      
    const docRef = await addDoc(collection(db, "advertisements"), payload);
   
    return { success: true, msg: "Course data uploaded successfully" };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, msg: error.message };
  }
}

const editAdvertisement= async (payload,docId) => {
  try {
    
    const docref = doc(db,"advertisements",docId);
    await setDoc(docref,payload,{merge:true});
    return {success:true, msg:"Advertisement updated successfully"}

  } catch (error) {
    return {success:false, msg:error.message}
  }

}

const deleteAdvertisement= async (docId) => {
  try {
    
    const docref = doc(db,"advertisements",docId);
    await deleteDoc(docref);
    return {success:true, msg:"Advertisement deleted successfully"}

  } catch (error) {
    return {success:false, msg:error.message}
  }

}

const getAdevertisements = async () => {
 
  try {
    const adDocRef = collection(db,"advertisements");
    const adDocSnapshots = await getDocs(adDocRef);
    const adData = adDocSnapshots.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))
    return  {success:true, data:adData}
  } catch (error) {
    return {success:false, msg:error.message}
  }
}

  export{
    newAdvertiserReq,
    createAdvertisement,
getAdevertisements,
editAdvertisement,
deleteAdvertisement

  }