import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyCoYuHntV2bH2zqh0omNqoaZhYS_hThUQc',
  authDomain: 'lines-27f96.firebaseapp.com',
  databaseURL: 'https://lines-27f96.firebaseio.com',
  projectId: 'lines-27f96',
  storageBucket: 'lines-27f96.appspot.com',
  messagingSenderId: '350255136192',
  appId: '1:350255136192:web:efc421ccd714cd74e91c25',
};

export default firebase.apps[0] || firebase.initializeApp(config);

export const db = firebase.firestore();
