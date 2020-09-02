class Prompt {
  constructor({ id, supportingInformation, prompt, promptTags = [] }) {
    this.id = id;
    this.supportingInformation = supportingInformation;
    this.prompt = prompt;
    this.promptTags = promptTags;
  }
}

export default Prompt;
