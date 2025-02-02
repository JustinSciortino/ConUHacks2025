import os
import openai
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_comments(comments):
    """
    Takes a list of comments and generates an analysis summarizing overall sentiment and key themes.
    """
    if not comments:
        return "No comments to analyze."
    
    prompt = (
        "Analyze the following YouTube comments and provide a summary of the overall sentiment, "
        "common themes, and key takeaways. Indicate whether the feedback is generally positive, negative, or mixed.\n\n"
        "Comments:\n" + "\n".join(comments[:3])  # Only analyze up to 3 comments
    )
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content

# Example usage:
comments = [
    "This video is really informative, I learned a lot!",
    "I don't think the explanation was clear enough, it was confusing at times.",
    "Amazing content! Very well explained and engaging."
]

analysis = analyze_comments(comments)
print("Comment Analysis:", analysis)
