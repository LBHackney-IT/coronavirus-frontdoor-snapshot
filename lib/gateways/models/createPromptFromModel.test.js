import { createPromptFromModel } from './createPromptFromModel';
describe('createPromptFromModel', () => {
  it('maps properties from an Airtable record with prompts', () => {
    const record = {
      id: 'dakjhksd8283',
      fields: {
        'Supporting information': 'supporting info',
        Prompt: 'How is your health at the moment?'
      },
      Tags: ['Health']
    };
    const prompt = createPromptFromModel(record);
    expect(prompt.id).toEqual(record.id);
    expect(prompt.supportingInformation).toEqual('supporting info');
  });
});
