import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebaseConfiguration";

export const uploadCourseData = async (dataToUpload) => {
  try {
    const docRef = await addDoc(collection(db, "coursetest"), dataToUpload);
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

    console.log("Updating document with ID: ", id);

    const courseDocRef = doc(db, "coursetest", id);
    await setDoc(courseDocRef, dataToUpload, { merge: true });

    console.log("Document written/updated with ID: ", id);
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
    const filteredUsers = userSnapshot.docs.map((doc) => ({
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

export const deleteUser = async (id) =>{
try {
  const userDoc = doc(db, "users",id)
  await deleteDoc(userDoc)
  return { success: true, msg: "user deleted successfully" };
} catch (error) {
  return { success: false, msg: error.message }; 
}



}