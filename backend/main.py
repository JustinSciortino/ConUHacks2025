from fastapi import FastAPI, Query, HTTPException
from typing import Optional
from utils.get_comments import fetch_youtube_comments

app = FastAPI()


@app.get("/comments")
def fetch_comments(link: str = Query(..., description="Youtube URL")):
    try:
        data = fetch_youtube_comments(link)
        return data 
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)