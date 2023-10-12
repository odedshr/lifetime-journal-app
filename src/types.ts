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

type FieldType = 'text' | 'number' | 'emoji' | 'color';

type FieldTemplate = {
  label?: string,
  type: FieldType
}
type Field<T> = FieldTemplate & { value: T };

type NumberField = Field<number> & {
  unit?: string,
  max?: number,
  min?: number,
  step?: number
}

type Entry = {
  date: string,
  fields: Field<any>[]
};

type Annual = {
  label: string,
  startYear: number,
  endYear?: number
  color?: string,
}

export {
  FirebaseApp,
  User,
  Diary,
  Settings,
  Entry,
  NumberField,
  Field,
  FieldTemplate,
  Annual
};