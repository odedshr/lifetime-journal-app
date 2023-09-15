import { FirebaseApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { User } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

type Diary = {
  startDate: string;
  name: string;
  color: string;
  defaultFields: FieldTemplate[];
};

type Settings = {
  diaries: Diary[];
}

type FieldType = 'text' | 'number' | 'emoji';

type FieldTemplate = {
  label?: string,
  type: FieldType,
  unit?: string
}
type Field<T> = FieldTemplate & { value: T };

type Entry = {
  date: string,
  fields: Field<any>[]
};

type Annual = {
  label: string,
  color: string,
  endDate?: string
}

export { FirebaseApp, User, Diary, Settings, Entry, Field, FieldTemplate, Annual };