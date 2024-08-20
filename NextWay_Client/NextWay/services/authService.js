import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig/firebaseConfiguration";
import { doc, setDoc } from "firebase/firestore";

const registerUser = async (email, password,username) => {
  try {

    const response = await createUserWithEmailAndPassword(auth, email,password);

     await setDoc(doc(db,"users", response?.user?.uid),{
        username,
        role:'student',
        userId:response?.user?.uid
     });

     await sendEmailVerification(response?.user);
     return {success:true, data:response?.user};

  } catch (error) {
    let msg = error.message;
    if(msg.includes('(auth/invalid-email)') ) msg='Invalid Email'
    if(msg.includes('(auth/email-already-in-use)')) msg='Email already exist!'
    return {success:false, msg};

  }
};

const loginUser = async (email, password) => {
 try {

  const response = await signInWithEmailAndPassword(auth,email,password);
  return {success:true}
    
 } catch (error) {
  let msg = error.message;
  if(msg.includes('(auth/invalid-credential)') ) msg='Invalid email or password'
 
  return {success:false, msg};

 }
};

const getUserRole = async (uid) => {
 try {
    
 } catch (error) {
    
 }
};

 const sendPwResetEmail = async (email) => {
  
  try {
    const res = await sendPasswordResetEmail(auth, email);
   
    return { success: true, msg: 'Password reset email sent successfully' };
  } catch (error) {
    return { success: false, msg: error.message };
  }
};

const logoutUser = async (email, password) => {
    try {
      await signOut(auth);
      return {success:true}
       
    } catch (error) {
      return {success:false, msg:error.message, error:error}
    }
   };

export { registerUser, loginUser, getUserRole, logoutUser, sendPwResetEmail };


