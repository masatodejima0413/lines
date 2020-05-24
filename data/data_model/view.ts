import firebase from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { Views } from '../collections';

export default class View {
  id: string;
  userId: string;
  setIds: string[];
  createdAt: firebase.firestore.Timestamp;

  constructor({
    id = uuidv4(),
    userId = firebase.auth().currentUser.uid,
    setIds = [],
    createdAt = firebase.firestore.Timestamp.now(),
  }: {
    id?: string;
    userId?: string;
    setIds?: string[];
    createdAt?: firebase.firestore.Timestamp;
  }) {
    this.id = id;
    this.userId = userId;
    this.setIds = setIds;
    this.createdAt = createdAt;
  }

  save() {
    Views.doc(this.id)
      .set(viewConverter.toFirestore(this))
      .then(() => console.log('Success: save view'))
      .catch(() => console.error('Error: save view'));
  }

  addSet(setId: string) {
    this.setIds.push(setId);
    Views.doc(this.id)
      .update({
        setIds: this.setIds,
      })
      .then(() => console.log('Success: addSet to view.'))
      .catch(() => console.error('Error: addSet to view'));
    return this;
  }

  update(setIds: string[]) {
    this.setIds = setIds;
    Views.doc(this.id)
      .update({ setIds })
      .then(() => console.log('Success: update setIds in view'))
      .catch(() => console.error('Error: update setIds in view'));
    return this;
  }
}

// Firestore data converter
export const viewConverter = {
  toFirestore(view: View) {
    return {
      id: view.id,
      userId: view.userId,
      setIds: view.setIds,
      createdAt: view.createdAt,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return new View({
      id: data.id,
      userId: data.userId,
      setIds: data.setIds,
      createdAt: data.createdAt,
    });
  },
};
