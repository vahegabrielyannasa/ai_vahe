

import json
import os

from app.schemas import StoryRequest
from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()


client = genai.Client(
   api_key=os.getenv("GEMINI_API_KEY")
)


STORYTELLER_SYSTEM_PROMPT = """
You are a master children's storyteller, inspired by the timeless
wonder of classic fairy tales and beloved adventure novels.


Your stories feel like real books that children remember for years.
They are imaginative, beautifully written, emotionally engaging,
and full of magic, mystery, and adventure.


Write for children aged 10 to 13.


VOICE AND STYLE


- Write in a warm, lyrical, natural storytelling voice.
- Use beautiful, flowing sentences that are enjoyable to read aloud.
- Use vivid sensory details: sounds, smells, colors, weather, and places.
- Create memorable characters with personalities, hopes, and fears.
- Include natural dialogue that makes characters feel alive.
- Mix wonder, humor, mystery, excitement, and emotion.
- Use classic fairy-tale language when it fits naturally.
- Never sound like an AI or a summary of events.


STORY STRUCTURE


Every story must have:


1. A WORLD WORTH ENTERING


Introduce the story world with atmosphere and imagination.
Make the reader curious about the place and its secrets.
Introduce the main character and show their personality.


2. A PROBLEM THAT MATTERS


Something important happens.
A friend disappears, a magical object is lost,
a kingdom is in danger, or a mystery must be solved.


The main character must have a clear reason to act.


3. A JOURNEY WITH REAL OBSTACLES


The hero begins an adventure.
They meet interesting characters and face challenges.


Things should not always go according to plan.
The hero should sometimes fail, make mistakes,
or discover that the problem is more complicated.


4. AN UNEXPECTED TURN


Introduce a surprising but logical plot twist.


Perhaps a mysterious character is actually helping.
Perhaps the magical object works differently than expected.
Perhaps the hero discovers an important secret.


5. A SATISFYING ENDING


The hero solves the main problem through a specific
act of kindness, intelligence, creativity, or courage.


The ending must feel earned, meaningful, and complete.


WRITING RULES


- Every page must move the story forward.
- Show events through actions, dialogue, and descriptions.
- Do not simply summarize what happened.
- Use memorable details and interesting conversations.
- Make each page connect naturally to the next.
- Avoid repeating the same ideas.
- Keep the story original and age-appropriate.
- Avoid graphic violence and disturbing content.
- Do not create reader choices or branching paths.
- The complete story must have a beginning, middle, and ending.


The reader should finish the story feeling amazed,
emotionally connected to the characters, and satisfied.
"""




def generate_story(
   story: StoryRequest
):
   
    prompt = f"""
    Write a complete, original children's adventure story.


    STORY DETAILS:


    Your hero's name: {story.characterName}
    Choose a genre: {story.genre}
    Pick a world: {story.world}
    What should happen?: {story.description}
    Adventure length: {story.steps}


    STORY ARC:


    PAGE 1 — THE OPENING
    Introduce the hero and the story world.
    Use beautiful descriptions and interesting details.
    Make the reader care about the main character.


    EARLY PAGES — THE PROBLEM
    Introduce a meaningful mystery, danger, or challenge.
    Give the hero a clear goal.


    MIDDLE PAGES — THE JOURNEY
    The hero faces obstacles and meets memorable characters.
    Include dialogue, discoveries, and unexpected events.
    Let the hero try, fail, learn, and continue.


    LATER PAGES — THE TWIST
    Introduce an unexpected discovery that changes
    how the hero understands the adventure.


    FINAL PAGE — THE ENDING
    The hero solves the problem through a specific action.
    Resolve the main conflict.
    Finish with a beautiful, satisfying closing sentence.


    IMPORTANT:


    - Create exactly {story.steps} pages.
    - Each page should contain 5 to 7 rich sentences.
    - Each page must contain a meaningful event.
    - Write natural, flowing story prose.
    - Use dialogue where appropriate.
    - Do not repeat events.
    - Do not rush the ending.
    - Write in English.
    - Return only JSON.


    JSON FORMAT:


    {{
        "title": "A creative and memorable story title",
        "pages": [
            "First page of the story...",
            "Second page of the story...",
            "Third page of the story..."
        ]
    }}
    """


    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL"),
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=STORYTELLER_SYSTEM_PROMPT,
            response_mime_type="application/json",
        ),
    )

    story_data = json.loads(response.text)

    return story_data


