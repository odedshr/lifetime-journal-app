import { FirebaseApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { User } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

type Diary = {
  startDate: string;
  name: string;
};

type Settings = {
  diaries: Diary[];
}

type FieldType = "text" | "number";

type Field<T> = {
  label?: string,
  value: T,
  type: FieldType,
  unit?: string
};

type Entry = {
  date: string,
  fields: Field<any>[]
};

type Annual = {
  label: string,
  color: string,
  endDate?: string
}

export { FirebaseApp, User, Diary, Settings, Entry, Field, Annual };