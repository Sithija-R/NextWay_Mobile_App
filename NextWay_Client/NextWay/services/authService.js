import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig/firebaseConfiguration";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const registerUser = async (email, password, username) => {
  try {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", response?.user?.uid), {
      username,
      role: "student",
      userId: response?.user?.uid,
      email: email,
    });

    await sendEmailVerification(response?.user);
    return { success: true, data: response?.user };
  } catch (error) {
    let msg = error.message;
    if (msg.includes("(auth/invalid-email)")) msg = "Invalid Email";
    if (msg.includes("(auth/email-already-in-use)"))
      msg = "Email already exist!";
    return { success: false, msg };
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    let msg = error.message;
    if (msg.includes("(auth/invalid-credential)"))
      msg = "Invalid email or password";

    return { success: false, msg };
  }
};

const getUserRole = async (uid) => {
  try {
  } catch (error) {}
};

const sendPwResetEmail = async (email) => {
  try {
    const res = await sendPasswordResetEmail(auth, email);

    return { success: true, msg: "Password reset email sent successfully" };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

const logoutUser = async (email, password) => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, msg: error.message, error: error };
  }
};

const updateUserProfile = async (uid, updatedData) => {
  try {
    const userDocRef = doc(db, "users", uid);

    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const currentData = docSnap.data();

      const newFields = {
        username: updatedData.username || currentData.username || "", 
        age:
          updatedData.age !== undefined
            ? updatedData.age
            : currentData.age || null, 
        phoneNumber: updatedData.phoneNumber || currentData.phoneNumber || "", 
        profileImage:
          updatedData.profileImage || currentData.profileImage || "", 
        role: updatedData.role || currentData.role || "",
      };

      await updateDoc(userDocRef, newFields);
      return { success: true, msg: "Profile updated successfully" };
    } else {
      return { success: false, msg: "User document does not exist" };
    }
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

export {
  registerUser,
  loginUser,
  getUserRole,
  logoutUser,
  sendPwResetEmail,
  updateUserProfile,
};
