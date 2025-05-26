from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from pathlib import Path

app = FastAPI(title="Readable Research API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Readable Research API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/papers/{paper_id}")
async def get_paper(paper_id: str):
    # Construct the path to the JSON file
    json_path = Path(__file__).parent / "papers" / f"{paper_id}.json"
    
    print(json_path)

    try:
        # Try to read and parse the JSON file
        with open(json_path, 'r') as f:
            paper_data = json.load(f)
        return {"status": "success", "code": 200, "paper": paper_data}
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Paper with ID {paper_id} not found"
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing paper data for ID {paper_id}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True) 