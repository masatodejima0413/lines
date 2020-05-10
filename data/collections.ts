import { db } from '../libs/firebase';

export const Items = db.collection('items');
export const Views = db.collection('views');
