import 'dotenv/config';
import mongoose from 'mongoose';
import { Contact } from './src/db/contact.js';

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

await mongoose.connect(uri);
await Contact.deleteMany({});
await Contact.insertMany([
  { name: "Yulia Shevchenko", phoneNumber: "+380000000001", email: "oleh1@example.com", isFavourite: false, contactType: "personal" },
  { name: "Dmytro Boyko", phoneNumber: "+380000000002", isFavourite: false, contactType: "personal" },
  { name: "Andriy Pavlenko", phoneNumber: "+380000000003", email: "dmytro3@example.com", isFavourite: false, contactType: "home" },
  { name: "Yulia Shevchenko", phoneNumber: "+380000000004", isFavourite: false, contactType: "personal" },
  { name: "Kateryna Povalenko", phoneNumber: "+380000000005", email: "ivan5@example.com", isFavourite: false, contactType: "personal" },
  { name: "Anna Kovalenko", phoneNumber: "+380000000006", isFavourite: false, contactType: "home" },
  { name: "Oleh Tkachuk", phoneNumber: "+380000000007", email: "andriy7@example.com", isFavourite: false, contactType: "personal" },
  { name: "Maria Petrenko", phoneNumber: "+380000000008", isFavourite: false, contactType: "personal" },
  { name: "Ivan Ivanenko", phoneNumber: "+380000000009", email: "vasyl9@example.com", isFavourite: false, contactType: "home" },
  { name: "Kateryna Kovalchuk", phoneNumber: "+3800000000010", isFavourite: false, contactType: "personal" },
]);
console.log('Done!');
await mongoose.disconnect();
