import Prompt from 'lib/domain/prompt';

export function createPromptFromModel({ id, fields }) {
  return new Prompt({
    id: id,
    supportingInformation: fields['Supporting information'],
    prompt: fields.Prompt,
    promptTags: fields.Tags
  });
}
