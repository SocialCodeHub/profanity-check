import ProfanityCheck from './index.js';

const profanity = new ProfanityCheck();
const sentence = 'asshole';
const hasBadWords = profanity.hasBadWords(sentence).then(result => {
    console.log("result", result);
});