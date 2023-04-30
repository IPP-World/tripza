import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from collections import Counter

nlp = spacy.load('en_core_web_sm')

def summarize_hotels(text):
    # Tokenize the text using spaCy
    doc = nlp(text)

    # Get all the nouns and adjectives from the text
    words = [token.text for token in doc if not token.is_stop and (token.pos_ == 'NOUN' or token.pos_ == 'ADJ')]

    # Count the frequency of each word
    word_freq = Counter(words)

    # Get the 5 most frequent words
    most_freq_words = word_freq.most_common(5)

    # Join the most frequent words into a summary
    summary = ', '.join(word[0] for word in most_freq_words)

    return summary


text = "Conveniently located on Pokhara’s prominent place “Lakeside”, Hotel Barahi boasts some stunning views of the Annapurna & Machapuchare Himalayans, Phewa Lake as well as easy access to the thriving lake street. We are 3 KMS away from Pokhara domestic airport. We offer 85 deluxe and suite rooms, fusion fine dining restaurant with every evening authentic live cultural dance show, cake shop, swimming pool, public bar, meeting rooms, and SPA decorated with comfort and elegance in mind. We are also the home for contemporary business facilities with three conference rooms & lawn to satisfy every one of your requirements."
summary = summarize_hotels(text)

print(summary)