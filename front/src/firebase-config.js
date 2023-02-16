import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { v4 } from 'uuid';

// TODO: Replace the following with your app's Firebase project configuration
// TODO: LAS CREE COMO VARIABLES DE ENTORNO PARA QUE NO SE SEPAN LOS ENTRYS 
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app)

export default auth;
export {storage};

export async function subirArchivo(file){
  const storageRef = ref(storage, v4())
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  console.log(url)
  return url
}
