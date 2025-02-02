from fastapi import FastAPI, Query, HTTPException
from typing import Optional
from utils.get_comments import fetch_youtube_comments
from transformers import BertForSequenceClassification, BertTokenizer
import torch
import re
from typing import List, Dict

app = FastAPI()

# Model Paths
MODEL_PATH = "trained_model"

# Load model and tokenizer globally (to avoid reloading on each request)
loaded_model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
loaded_tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
loaded_model.config.problem_type = "multi_label_classification"
loaded_model.eval()  # Set model to evaluation mode

# Define max_length and label_cols (ensure these are correct for your model)
max_length = 128  # Adjust based on training config
label_cols = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]  # Adjust based on your model

def classify_comment(text: str, threshold=0.5):
    cleaned = clean_text(text)
    inputs = loaded_tokenizer(cleaned, truncation=True, padding='max_length', max_length=max_length, return_tensors="pt")

    with torch.no_grad():
        outputs = loaded_model(**inputs)
    
    logits = outputs.logits[0]
    probs = torch.sigmoid(logits).detach().numpy()

    triggered_labels = [label_cols[i] for i, p in enumerate(probs) if p >= threshold]

    if not triggered_labels:
        return "Positive", None
    else:
        return "Negative", triggered_labels

def classify_comments(yt_comments: List[str]) -> Dict:
    """
    Classifies a list of YouTube comments and returns statistics.
    """
    if not yt_comments:
        return {"message": "No comments found"}

    positive_count = 0
    negative_count = 0

    for comment in yt_comments:
        classification, labels = classify_comment(comment)

        if classification == "Positive":
            positive_count += 1
        else:
            negative_count += 1

    return {
        "total_comments": len(yt_comments),
        "positive_comments": positive_count,
        "negative_comments": negative_count,
    }

def clean_text(text: str) -> str:
    """Preprocess text: Lowercase, remove punctuation, special characters, and extra spaces."""
    text = text.lower()
    text = re.sub(r"what's", "what is ", text)
    text = re.sub(r"\'s", " ", text)
    text = re.sub(r"\'ve", " have ", text)
    text = re.sub(r"can't", "cannot ", text)
    text = re.sub(r"n't", " not ", text)
    text = re.sub(r"i'm", "i am ", text)
    text = re.sub(r"\'re", " are ", text)
    text = re.sub(r"\'d", " would ", text)
    text = re.sub(r"\'ll", " will ", text)
    text = re.sub(r"\'scuse", " excuse ", text)
    text = re.sub(r'\W', ' ', text)  # Remove non-word characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text


@app.get("/comments")
def fetch_comments(link: str = Query(..., description="Youtube URL")):
    try:
        yt_comments = fetch_youtube_comments(link)
        try:
            return classify_comments(yt_comments)
        except RuntimeError as e:
            raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)