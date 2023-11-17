const { readFile } = require('fs/promises');
const path = require('path');
const { fileURLToPath } = require('url');

class ProfanityCheck {
  constructor(config) {
    this.language = config && config.language ? config.language : 'all';
    this.terms = [];
    this.localFilePath = '';
  }

  async initialize() {
    this.localFilePath = await this.getLanguageFile(this.language);
    try {
      const fileContent = await this.readFileAndSplit(this.localFilePath);
      this.terms = fileContent;
    } catch (err) {
      this.terms = [];
    }
  }

  async all() {
    if (this.terms.length === 0) {
      await this.initialize();
    }

    return this.terms;
  }

  async search(term) {
    if (this.terms.length === 0) {
      await this.initialize();
    }

    return this.terms.includes(term);
  }

  async getLanguageFile(language) {
    const dataFolderPath = `${__dirname}/data`
    const languageFilePath = path.join(dataFolderPath, `${language}.txt`);
    const doesFileExists = await this.doesFileExists(languageFilePath);

    if (!doesFileExists) {
      return path.join(dataFolderPath, 'en.txt');
    }

    return languageFilePath;
  }

  async doesFileExists(localFilePath) {
    try {
      await readFile(localFilePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  async readFileAndSplit(localFilePath) {
    try {
      const fileContent = await readFile(localFilePath, 'utf8');
      return fileContent.split('\n');
    } catch (err) {
      return [];
    }
  }

  async hasBadWords(sentence) {
    if (this.terms.length === 0) {
      await this.initialize();
    }

    const wordsInSentence = sentence.split(/\s+/);
    const lowerCasedTerms = this.terms.map((term) => term.toLowerCase());

    for (const word of wordsInSentence) {
      const lowerCasedWord = word.toLowerCase();
      if (lowerCasedTerms.includes(lowerCasedWord)) {
        return true;
      }
    }

    return false;
  }
}

module.exports = ProfanityCheck