import { FirebaseApp } from "@firebase/app";
import { User } from "@firebase/auth";

type ElementType<P> = (props: P) => HTMLElement;

type Diary = {
  uri: string;
  startDate: string;
  name: string;
  color: string;
  defaultFields: FieldTemplate[];
};

type DiaryContent = {
  settings: Diary;
  entries: { [key: string]: Entry };
  annuals: { [key: string]: Annual };
  periods: { [key: string]: Period };
};

type Settings = {
  diaries: Diary[];
  currentDiaryIndex: number;
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
  endYear?: number,
  color?: string,
}

type Period = {
  id?: string,
  label: string,
  startDate: Date,
  endDate?: Date,
  color?: string,
}

export {
  FirebaseApp,
  User,
  Diary,
  DiaryContent,
  Settings,
  Entry,
  ElementType,
  NumberField,
  Field,
  FieldTemplate,
  Annual,
  Period
};