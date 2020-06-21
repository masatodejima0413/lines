import firebase from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
import { Views, Sets, Items } from '../collections';

export default class Set {
  id: string;
  userId: string;
  itemIds: string[];
  createdAt: firebase.firestore.Timestamp;

  constructor({
    id = uuidv4(),
    userId = firebase.auth().currentUser.uid,
    itemIds = [],
    createdAt = firebase.firestore.Timestamp.now(),
  }: {
    id?: string;
    userId?: string;
    itemIds?: string[];
    createdAt?: firebase.firestore.Timestamp;
  }) {
    this.id = id;
    this.userId = userId;
    this.itemIds = itemIds;
    this.createdAt = createdAt;
  }

  save() {
    Sets.doc(this.id)
      .set(setConverter.toFirestore(this))
      .then(() => console.log('Success: save set'))
      .catch(() => console.error('Error: save set'));
  }

  addItem(itemId: string) {
    this.itemIds.push(itemId);
    Sets.doc(this.id)
      .update({
        itemIds: this.itemIds,
      })
      .then(() => console.log('Success: add itemId to set'))
      .catch(() => console.error('Error: add itemId to set'));
    return this;
  }

  update(itemIds: string[]) {
    this.itemIds = itemIds;
    Sets.doc(this.id)
      .update({ itemIds })
      .then(() => console.log('Success: update itemIds in set'))
      .catch(() => console.error('Error: update itemIds in set'));
    return this;
  }

  delete(viewId) {
    Sets.doc(this.id)
      .delete()
      .then(() => console.log('Success: delete set'))
      .catch(() => console.error('Error: delete set'));
    Views.doc(viewId).update({
      setIds: firebase.firestore.FieldValue.arrayRemove(this.id),
    });
    this.itemIds.forEach((itemId) => {
      Items.doc(itemId)
        .delete()
        .then(() => console.log('Success: delete item'))
        .catch(() => console.error('Error: delete item'));
    });
  }
}

// Firestore data converter
export const setConverter = {
  toFirestore(set: Set) {
    return {
      id: set.id,
      userId: set.userId,
      itemIds: set.itemIds,
      createdAt: set.createdAt,
    };
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return new Set({
      id: data.id,
      userId: data.userId,
      itemIds: data.itemIds,
      createdAt: data.createdAt,
    });
  },
};
