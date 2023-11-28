import { jest } from '@jest/globals';
import { appendChild } from '../../public/js/annuals/annuals.html.js';

jest.useFakeTimers();

describe('Annuals', () => {
  describe('appendChild', () => {
    const onDayChanged = jest.fn();
    const onAnnualChanged = jest.fn();
    const onExitPage = jest.fn();
    const onAnnualEditRequest = jest.fn();
    const onDeleteAnnualRequested = jest.fn();

    it('renders Element', () => {
      const parent = document.createElement('div');

      appendChild(parent, '2000-01-01', [], [], onDayChanged, onAnnualChanged, onExitPage, onAnnualEditRequest, onDeleteAnnualRequested);

      expect(parent.querySelector(".annuals")).not.toBeNull();
      expect(parent.querySelector(".date-selector")).not.toBeNull();
    });

    it("signals when annual has changed", async () => {
      const parent = document.createElement('div');
      const annuals = [{ "color": "#000000", "label": "a", "startYear": 2023 }, { "color": "#000000", "label": "b", "startYear": 2023 }];

      onAnnualChanged.mockReturnValue(true);

      appendChild(parent,
        '2000-01-01',
        annuals,
        [],
        onDayChanged,
        onAnnualChanged,
        onAnnualEditRequest,
        onDeleteAnnualRequested,
        onExitPage);
      parent.querySelector("#annual-label").value = "c";
      await parent.querySelector('form.annual-edit-form').submit();

      expect(onAnnualChanged).toHaveBeenCalledWith([{ "color": "#000000", "label": "a", "startYear": 2023 }, { "color": "#000000", "label": "b", "startYear": 2023 }, { "color": "#000000", "label": "c", "startYear": 2023 }]);
      expect(onExitPage).toHaveBeenCalled();
    });

    it("updates an existing annual", () => {
      const parent = document.createElement('div');
      const annuals = [{ "color": "#000000", "label": "a", "startYear": 2023 }, { "color": "#000000", "label": "b", "startYear": 2023 }];

      appendChild(parent, '2000-01-01', annuals, [], onDayChanged, onAnnualChanged, onExitPage, onAnnualEditRequest, onDeleteAnnualRequested, 1);
      parent.querySelector("#annual-label").value = "d";
      parent.querySelector('form.annual-edit-form').submit();
      expect(onAnnualChanged).toHaveBeenCalledWith([{ "color": "#000000", "label": "a", "startYear": 2023 }, { "color": "#000000", "label": "d", "startYear": 2023 }])
    });

  })
});