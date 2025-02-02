from fastapi import FastAPI, Query, HTTPException
from typing import Optional
from utils.get_comments import fetch_youtube_comments, fetch_video_details
from transformers import BertForSequenceClassification, BertTokenizer
import torch
import re
from typing import List, Dict
from censorAI import analyze_comments  # Import the function

app = FastAPI()

MODEL_PATH = "trained_model"

loaded_model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
loaded_tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
loaded_model.config.problem_type = "multi_label_classification"
loaded_model.eval()  

max_length = 128  
label_cols = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]  

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
    if not yt_comments:
        return {"message": "No comments found"}

    positive_count = 0
    negative_count = 0

    negative_dict = {i: [] for i in range(1, 13)}
    positive_list = []

    for comment in yt_comments:
        classification, labels = classify_comment(comment)

        if classification == "Positive":
            positive_count += 1

            if len(positive_list) < 10:
                positive_list.append(comment)

        else:
            negative_count += 1
            negative_dict[len(labels)].append(comment)

    sorted_negative_dict_keys = sorted(negative_dict.keys(), reverse=True)
    negative_comments = []

    for key in sorted_negative_dict_keys:
        negative_comments.extend(negative_dict[key])
        if len(negative_comments) >= 10:
            break

    return {
        "total_comments": len(yt_comments),
        "num_positive_comments": positive_count,
        "num_negative_comments": negative_count,
        "positive_comments": positive_list,
        "negative_comments": negative_comments
    }

def clean_text(text: str) -> str:
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
    text = re.sub(r'\W', ' ', text)  
    text = re.sub(r'\s+', ' ', text).strip()  
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
    

@app.get("/video-info")
def fetch_comments(link: str = Query(..., description="Youtube URL")):
    try:
        yt_info = fetch_video_details(link)  
        return yt_info
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    from fastapi import FastAPI, Query, HTTPException
from typing import List

app = FastAPI()

@app.post("/analyze-comments")
def analyze_video_comments(comments: List[str]):
    try:
        analysis = analyze_comments(comments)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)