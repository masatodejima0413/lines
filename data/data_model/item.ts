import firebase from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { Items } from '../collections';

export default class Item {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  text: string;
  userId: string;

  constructor({
    id = uuidv4(),
    createdAt = firebase.firestore.Timestamp.now(),
    updatedAt = firebase.firestore.Timestamp.now(),
    text = '',
    userId = firebase.auth().currentUser.uid,
  }: {
    id?: string;
    createdAt?: firebase.firestore.Timestamp;
    updatedAt?: firebase.firestore.Timestamp;
    text?: string;
    userId?: string;
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.text = text;
    this.userId = userId;
  }

  save() {
    Items.doc(this.id)
      .set(itemConverter.toFirestore(this))
      .then(() => console.log('Successfully added new item.'))
      .catch(() => console.error('Failed to add item.'));
  }

  update(text: string) {
    Items.doc(this.id).update({ text, updatedAt: firebase.firestore.Timestamp.now() });
  }

  delete() {
    Items.doc(this.id).delete();
  }
}

// Firestore data converter
export const itemConverter = {
  toFirestore(item: Item) {
    return {
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      text: item.text,
      userId: item.userId,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return new Item({
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      text: data.text,
      userId: data.userId,
    });
  },
};
