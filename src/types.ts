import { FirebaseApp } from "@firebase/app";
import { User } from "@firebase/auth";

type Diary = {
  uri: string;
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