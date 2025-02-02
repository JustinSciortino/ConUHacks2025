import os
import openai
import json
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_comments(pos_comments_list, neg_comments_list):
    """
    Takes a list of comments and generates an analysis summarizing overall sentiment and key themes.
    """

    #if not comments:
    #    return "No comments to analyze."
    
    if not pos_comments_list and not neg_comments_list:
        return [], []

    prompt = (
        "Your job is to analyze the following comments. The first set of comments are labeled as positive, "
        "and you need to verify if they are truly positive. If they are positive, return them in an array called 'pos_comments'. "
        "The second set of comments are labeled as negative, and you need to verify if they are truly negative. "
        "If they are negative, return them in an array called 'neg_comments' and if they contain any vulgar or racist words, replace those specific words with stars '*'. "
        "Your response should be a valid JSON object like this: "
        "{ \"pos_comments\": [\"comment1\", \"comment2\"], \"neg_comments\": [\"comment3\", \"comment4\"] }"
        "\n\nPositive comments:\n" + "\n".join(pos_comments_list[:5]) +  # Up to 5 comments
        "\n\nNegative comments:\n" + "\n".join(neg_comments_list[:5])     # Up to 5 comments
    )

    #prompt = (
    #    "Analyze the following YouTube comments and provide a summary of the overall sentiment, "
    #    "common themes, and key takeaways. Indicate whether the feedback is generally positive, negative, or mixed.\n\n"
    #    "Comments:\n" + "\n".join(comments[:3])  # Only analyze up to 3 comments
    #)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    
    #return response.choices[0].message.content
    try:
        # Parse the response as JSON
        result = json.loads(response.choices[0].message.content)
        pos_comments = result.get("pos_comments", [])
        neg_comments = result.get("neg_comments", [])
    except json.JSONDecodeError:
        print("Error: Unable to parse response as JSON.")
        pos_comments, neg_comments = [], []

    return pos_comments, neg_comments  # Return two lists of verified comments

# Example usage:
comments = [
    "This video is really informative, I learned a lot!",
    "I don't think the explanation was clear enough, it was confusing at times.",
    "Amazing content! Very well explained and engaging."
]

analysis = analyze_comments(comments)
print("Comment Analysis:", analysis)
