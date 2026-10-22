import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import StoryRequest
from app.services.gemini import generate_story

app = FastAPI()

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
frontend_origin = os.getenv("FRONTEND_ORIGIN")
if frontend_origin:
    allowed_origins.append(frontend_origin.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.get("/")
def root():
    return {"message": "AI Adventure API is running!"}

@app.post("/create")
def create_story(story: StoryRequest):
    generated_story = generate_story(
        characterName=story.characterName,
        genre=story.genre,
        steps=story.steps,
        world=story.world,
        description=story.description
    )
    return {
        "story": generated_story
    }