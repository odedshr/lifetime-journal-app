import { render } from 'nano-jsx';
import { exportDiary, selectFileForUpload, uploadJSON, validateDiaryContent } from './diary-utils.js';
import { Element as SaveDiaryDialog, ShowModalDelegate } from './diary-save-dialog.html.js';
import { Diary, DiaryContent, ElementType } from '../types.js';

type Props = {
  diaries: Diary[],
  selected: number,
  onRequestGetDiaryContent: (diary: Diary) => Promise<DiaryContent>,
  onRequestSetDiaryContent: (diaryContent: DiaryContent, method: 'replace' | 'merge') => Promise<Diary[]>,
  onRequestDeleteDiary: (diaryIndex: number) => Promise<Diary[]>,
  onSelectDiary: (diaryIndex: number) => Promise<void>
};

const Element: ElementType<Props> = (props: Props) => {
  let diaryList: HTMLUListElement;
  let showModalDialog: ShowModalDelegate;
  let draftDiary: DiaryContent;

  function refreshList() {
    while (diaryList.children.length) { diaryList.removeChild(diaryList.children[0]); }
    render(props.diaries.map((diary, i) => getDiaryItem(diary, i, i === props.selected)), diaryList);
  }

  async function requestDownload(diary: Diary) {
    exportDiary(await props.onRequestGetDiaryContent(diary));
  }

  async function selectDiary(diaryIndex: number) {
    await props.onSelectDiary(diaryIndex)
    props.selected = diaryIndex;
    refreshList();
  }

  async function requestDelete(diaryIndex: number) {
    if (confirm(`Delete Diary "${props.diaries[diaryIndex].name}"?`)) {
      props.diaries = await props.onRequestDeleteDiary(diaryIndex);
      refreshList();
    }
  }

  const onFileSelected = async (file: File) => {
    draftDiary = await uploadJSON<DiaryContent>(file);
    const errorMessages = validateDiaryContent(draftDiary);
    if (errorMessages.length) {
      console.log(errorMessages);
    } else {
      showModalDialog(draftDiary.settings);
    }
  };

  async function onSave(settings: Diary) {
    props.diaries = await props.onRequestSetDiaryContent({ ...draftDiary, settings }, 'replace');
    refreshList();
    return [] as Error[];
  }

  const getDiaryItem = (diary: Diary, index: number, selected: boolean) => <li {...(selected ? { 'data-selected': true } : {})}>
    <a href={`#set=${diary.uri}`} onClick={(selectDiary.bind({}, index))}>{diary.name}</a>
    &nbsp;<a href={`#delete=${diary.uri}`} class="btn-delete" onClick={requestDelete.bind({}, index)}>Delete</a>
    &nbsp;<a href={`#download=${diary.uri}`} class="btn-download" onClick={requestDownload.bind({}, diary)}>Download</a>
  </li>;

  const onDelegatorProvided = (delegate: ShowModalDelegate) => { showModalDialog = delegate; }
  const onImportClicked = async () => onFileSelected(await selectFileForUpload(document.createElement('input')));

  return (<main class="overview">
    <header>Diaries</header>
    <article>
      <ul ref={(el: HTMLUListElement) => diaryList = el} class="diaries">
        {props.diaries.map((diary, i) => getDiaryItem(diary, i, i === props.selected))}
      </ul>
    </article>
    <SaveDiaryDialog
      onDelegatorProvided={onDelegatorProvided}
      onSaveRequest={onSave} />
    <footer>
      <a href="#" id="import" class="btn" onClick={onImportClicked}><span>Import</span></a>
    </footer>
  </main>);
}

function appendChild(parent: HTMLElement, props: Props) {

  render(<Element {...props} />, parent);
}

export { appendChild, Element };