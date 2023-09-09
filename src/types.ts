import { FirebaseApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { User } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

type Diary = {
  startDate: string;
  name: string;
};

type Settings = {
  diaries: Diary[];
}

type Field = {
  label?: string,
  value: string | number,
  type: string
};

type Entry = {
  date: string,
  fields: Field[]
};

type Annual = {
  label: string,
  color: string,
  endDate?: string
}

export { FirebaseApp, User, Diary, Settings, Entry, Annual };