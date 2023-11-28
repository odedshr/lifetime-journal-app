import { jest } from '@jest/globals';
import { exportDiary, selectFileForUpload, uploadJSON, validateDiaryContent } from '../../public/js/diaries/diary-utils';

global.URL.createObjectURL = jest.fn(() => 'details');
global.URL.revokeObjectURL = jest.fn();

function iterator() {
  let i = 0
  const keys = Object.keys(this)
  return {
    next: () => {
      // The -1 is to account for our length property
      if (i >= Object.keys(this).length - 1) {
        i = 0
        return {
          value: undefined,
          done: true,
        }
      }
      const val = {
        value: this[keys[i]],
        done: false,
      }
      i += 1
      return val
    },
  }
}

describe("Diary Utils", () => {
  describe('exportDiary', () => {
    it('should generate Blob and link with correct properties', () => {
      HTMLAnchorElement.prototype.click = jest.fn();

      const diaryContent = {
        settings: {
          defaultFields: 'default',
          name: 'My Diary',
          startDate: '2023-01-01',
          uri: 'my-diary',
        },
        entries: {
          entry1: { date: '2023-01-01', fields: ['field1', 'field2'] },
          entry2: { date: '2023-01-02', fields: ['field3', 'field4'] },
        },
        annuals: true,
        periods: true,
      };

      const { blob, link } = exportDiary(diaryContent);
      // Check Blob properties
      expect(blob.type).toBe('application/json');
      // Check link properties
      expect(link.href).toBeDefined();
      expect(link.download).toBe('my-diary.json');
    });
  });

  // describe("selectFileForUpload", () => {
  //   it("should select a file", async () => {
  //     let list = [new File(["content"], "file1.json"), new File(["content"], "file2.json")]

  //     const mockedInput = document.createElement("input");
  //     mockedInput.type = "file";
  //     mockedInput.files = {
  //       length: list.length,
  //       item(index) {
  //         return list[index];
  //       }
  //     };
  //     mockedInput.addEventListener("click", () => mockedInput.dispatchEvent(new Event("change")))

  //     global.document.createElement = jest.fn((tag) => mockedInput);
  //     let file = undefined
  //     selectFileForUpload((imported) => { file = imported; });
  //     expect(file).toBeDefined();
  //   });
  // });

  describe("uploadJSON", () => {
    it('should resolve with parsed JSON when valid JSON file is provided', async () => {
      const validJSON = '{"name": "John", "age": 30}';
      const file = new File([validJSON], 'valid.json', { type: 'application/json' });

      const result = await uploadJSON(file);

      expect(result).toEqual({ name: 'John', age: 30 });
    });

    it('should reject with an error when an invalid JSON file is provided', async () => {
      const invalidJSON = '{"name": "John", "age": 30,}';
      const file = new File([invalidJSON], 'invalid.json', { type: 'application/json' });

      await expect(uploadJSON(file)).rejects.toThrow();
    });

    it('should reject with an error when a non-JSON file is provided', async () => {
      const plainTextFile = new File(['plain text'], 'text.txt', { type: 'text/plain' });

      await expect(uploadJSON(plainTextFile)).rejects.toThrow();
    });
  });
  describe("validateDiaryContent", () => {
    it("should validate a valid  diary content and return an empty array", () => {
      const validDiaryContent = {
        settings: {
          defaultFields: 'default',
          name: 'My Diary',
          startDate: '2023-01-01',
          uri: 'diary-uri',
        },
        entries: {
          entry1: { date: '2023-01-01', fields: ['field1', 'field2'] },
          entry2: { date: '2023-01-02', fields: ['field3', 'field4'] },
        },
        annuals: true,
        periods: true,
      };

      const result = validateDiaryContent(validDiaryContent);

      expect(result).toEqual([]);
    });

    it('should return an array with an error message if invalid settings', () => {
      const invalidDiaryContent = {
        settings: {
          defaultFields: 'default',
          name: 'My Diary',
          startDate: '2023-01-01',
          // uri is missing
        },
        entries: {
          entry1: { date: '2023-01-01', fields: ['field1', 'field2'] },
          entry2: { date: '2023-01-02', fields: ['field3', 'field4'] },
        }
      };

      const result = validateDiaryContent(invalidDiaryContent);

      expect(result).toContainEqual(new Error('Diary content is not valid (settings)'));
    });

    it('invalid entries should return an array with an error message', () => {
      const invalidDiaryContent = {
        settings: {
          defaultFields: 'default',
          name: 'My Diary',
          startDate: '2023-01-01',
          uri: 'diary-uri',
        },
        entries: {
          entry1: { date: '2023-01-01', fields: ['field1', 'field2'] },
          entry2: { date: '2023-01-02', fields: null }, // invalid fields
        },
        annuals: true,
        periods: true,
      };

      const result = validateDiaryContent(invalidDiaryContent);

      expect(result).toContainEqual(new Error('Diary content is not valid (entries)'));
    });

    it('missing annuals should return an array with an error message', () => {
      const invalidDiaryContent = {
        settings: {
          defaultFields: 'default',
          name: 'My Diary',
          startDate: '2023-01-01',
          uri: 'diary-uri',
        },
        entries: {
          entry1: { date: '2023-01-01', fields: ['field1', 'field2'] },
          entry2: { date: '2023-01-02', fields: ['field3', 'field4'] },
        },
        annuals: undefined, // missing annuals
        periods: true,
      };

      const result = validateDiaryContent(invalidDiaryContent);

      expect(result).toContainEqual(new Error('Diary content is not valid (annuals)'));
    });

    it('missing periods should return an array with an error message', () => {
      const invalidDiaryContent = {
        settings: {
          defaultFields: 'default',
          name: 'My Diary',
          startDate: '2023-01-01',
          uri: 'diary-uri',
        },
        entries: {
          entry1: { date: '2023-01-01', fields: ['field1', 'field2'] },
          entry2: { date: '2023-01-02', fields: ['field3', 'field4'] },
        },
        annuals: true,
        periods: null, // missing periods
      };

      const result = validateDiaryContent(invalidDiaryContent);

      expect(result).toContainEqual(new Error('Diary content is not valid (periods)'));
    });
  });

  describe('selectFileForUpload', () => {
    it('should reject when no file is selected', async () => {
      const fileInput = document.createElement('input');

      jest.spyOn(fileInput, 'click').mockImplementation(() => {
        fileInput.files = null;
        fileInput.dispatchEvent(new Event('change'));
      });

      let result = null;
      await selectFileForUpload(fileInput).catch(err => result = err);
      expect(result).toEqual('no file selected');
    });

    it('should resolve with the selected file', async () => {
      const fileInput = document.createElement('input');
      const file = new File(['{"key":"value"}'], 'test.json', { type: 'application/json' });
      const changeEvent = new Event('change');

      jest.spyOn(fileInput, 'click').mockImplementation(() => {
        Object.defineProperty(fileInput, 'files', {
          value: [file],
          writeable: false,
        })
        fileInput.dispatchEvent(changeEvent);
      });

      const selectedFile = await selectFileForUpload(fileInput);

      expect(selectedFile).toEqual(file);
    });
  });
});