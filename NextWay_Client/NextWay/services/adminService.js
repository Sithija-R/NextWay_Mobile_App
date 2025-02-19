import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";

export const uploadCourseData = async (dataToUpload) => {
  try {
    const docRef = await addDoc(collection(db, "courses"), dataToUpload);
    console.log("Document written with ID: ", docRef.id);
    return { success: true, msg: "Course data uploaded successfully" };
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
    const courseDocRef = doc(db, "courses", id);
    await setDoc(courseDocRef, dataToUpload, { merge: true });

    return { success: true, msg: "Course data updated successfully" };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, msg: error.message };
  }
};

export const fetchUsers = async () => {
  try {
    const userCollection = collection(db, "users");
    const userSnapshot = await getDocs(userCollection);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: userList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

export const searchUser = async (keyword) => {
  try {
    const lowercasedKeyword = keyword.toLowerCase();

    const userCollection = collection(db, "users");
    const userSnapshot = await getDocs(userCollection);
    const filteredUsers = userSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (user) =>
          user.username?.toLowerCase().includes(lowercasedKeyword) ||
          user.email?.toLowerCase().includes(lowercasedKeyword)
      );

    return { success: true, data: filteredUsers };
  } catch (error) {
    console.error("Error searching users:", error);
    return { success: false, msg: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    return { success: true, msg: "user deleted successfully" };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

export const getAdRequest = async () => {
  try {
    const adCollection = collection(db, "advertiser_req");
    const adSnapshot = await getDocs(adCollection);

    // Map over the documents and include the document id
    const adList = adSnapshot.docs.map((doc) => ({
      docid: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: adList };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

export const acceptAdRequest = async (id,email,uid) => {
  try {
    const adDocref = doc(db, "advertiser_req", id);
    const adDoc = await getDoc(adDocref);

    if (adDoc.exists()) {
      const newfields = {
        accepted: true,
        pending: false,
      };
      await updateDoc(adDocref, newfields);

      const userDocref = doc(db, "users", uid);
      const userDoc = await getDoc(userDocref);

      if (userDoc.exists()) {
        const userFields = {
          isAdvertiser: true,
        };
        await updateDoc(userDocref, userFields);
        
      }else{
        return { success: false, msg: "User does not exist" };
      }

      await createNotification({
        type: "ad_request_accepted",
        title:"Advertiser Request Accepted",
        message: `Advertiser profile request with Email: ${email} has been accepted.`,
        userId: uid, 
      });

      return { success: true, msg: "Advertiser request accepted" };
    } else {
      return { success: false, msg: "Document does not exist" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }
};


export const declineAdRequest = async (id,email,uid) => {

  try {
    const adDocref = doc(db, "advertiser_req", id);
    const adDoc = await getDoc(adDocref);

    if (adDoc.exists()) {
      const newfields = {
        accepted: false,
        pending: false,
      };
      await updateDoc(adDocref, newfields);

      await createNotification({
        type: "ad_request_declined",
        title:"Advertiser Request Declined",
        message: `Advertiser profile request with Email: ${email} has been declined.`,
        userId: uid, 
      });

      return { success: true, msg: "Advertiser request accepted" };
    } else {
      return { success: false, msg: "Document does not exist" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }

};

export const acceptAd = async (id,uid) => {

  try {
    const adDocref = doc(db, "advertisements", id);
    const adDoc = await getDoc(adDocref);

    if (adDoc.exists()) {
      const newfields = {
        accepted: true,
        pending: false,
      };
      await updateDoc(adDocref, newfields);


      await createNotification({
        type: "ad_accepted",
        title:"Advertisement Accepted",
        message: `Your advertisement has been accepted.`,
        userId: uid, 
      });

      return { success: true, msg: "Advertisment accepted" };
    } else {
      return { success: false, msg: "Document does not exist" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }
};


export const declineAd = async (id,uid) => {

  try {
    const adDocref = doc(db, "advertisements", id);
    const adDoc = await getDoc(adDocref);

    if (adDoc.exists()) {
      const newfields = {
        accepted: false,
        pending: false,
      };
      await updateDoc(adDocref, newfields);

  
      await createNotification({
        type: "ad_declined",
        title:"Advertisement Declined",
        message: `Your advertisement has been declined.`,
        userId: uid, 
      });

      return { success: true, msg: "Advertisement accepted" };
    } else {
      return { success: false, msg: "Document does not exist" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }

};


export const createNotification = async ({ type, message, userId ,title}) => {
  try {
    const notification = {
      type,
      title,
      message,
      userId, 
      read: false, 
      timestamp: new Date(),
    };

    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, notification);

    return { success: true, msg: "Notification created successfully" };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};