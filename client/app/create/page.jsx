"use client";

import { Link } from "next-view-transitions";
import { useState } from "react";
import "./create.css";

const initialStory = {
  characterName: "",
  genre: "Fantasy",
  steps: 5,
  world: "Enchanted kingdom",
  description: "",
};

const genres = ["Fantasy", "Mystery", "Science fiction", "Adventure", "Fairytale"];
const worlds = [
  "Enchanted kingdom",
  "Forgotten forest",
  "Floating islands",
  "Underwater city",
  "Distant galaxy",
];

function StoryResult({ story }) {
  let parsedStory;
  try {
    parsedStory = JSON.parse(story);
  } catch {
    parsedStory = null;
  }

  if (!parsedStory || !Array.isArray(parsedStory.scenes)) {
    return <p className="creation-result__raw">{story}</p>;
  }

  return (
    <>
      <h2 className="creation-result__title">
        {parsedStory.title || "Your adventure"}
      </h2>
      <div className="creation-result__scenes">
        {parsedStory.scenes.map((scene, index) => (
          <article className="story-scene" key={`${index}-${scene.text}`}>
            <span className="story-scene__number">
              Scene {String(index + 1).padStart(2, "0")}
            </span>
            <p>{scene.text}</p>
            {Array.isArray(scene.choices) && scene.choices.length > 0 && (
              <ul>
                {scene.choices.map((choice) => (
                  <li key={choice}>{choice}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

export default function CreatePage() {
  const [storyDetails, setStoryDetails] = useState(initialStory);
  const [generatedStory, setGeneratedStory] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  function updateStoryDetails(event) {
    const { name, value } = event.target;
    setStoryDetails((current) => ({
      ...current,
      [name]: name === "steps" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsCreating(true);
    setError("");
    setGeneratedStory("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyDetails),
      });

      if (!response.ok) {
        throw new Error(`The story service responded with ${response.status}.`);
      }

      const result = await response.json();
      if (typeof result.story !== "string" || !result.story.trim()) {
        throw new Error("The story service returned an empty story.");
      }
      setGeneratedStory(result.story);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while creating your story.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="creation-page">
      <div className="creation-sky" aria-hidden="true">
        <span className="creation-sky__moon" />
        <span className="creation-sky__star creation-sky__star--one">✦</span>
        <span className="creation-sky__star creation-sky__star--two">✧</span>
        <span className="creation-sky__star creation-sky__star--three">✦</span>
        <span className="creation-sky__island creation-sky__island--one" />
        <span className="creation-sky__island creation-sky__island--two" />
      </div>

      <header className="creation-header">
        <Link className="creation-brand" href="/">
          <span className="creation-brand__mark" aria-hidden="true">✦</span>
          <span>AI Adventure World</span>
        </Link>
        <Link className="creation-back" href="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
      </header>

      <section className="creation-content" aria-labelledby="creation-title">
        <div className="creation-intro">
          <p className="creation-eyebrow"><span /> Your story begins here</p>
          <h1 id="creation-title">
            Dream up your
            <br />
            <em>next adventure</em>
          </h1>
          <p className="creation-intro__copy">
            Choose a hero, a world, and a little bit of wonder. We&apos;ll turn
            your ideas into a story that&apos;s yours to explore.
          </p>
        </div>

        <form className="creation-form" onSubmit={handleSubmit}>
          <div className="creation-form__heading">
            <div>
              <span className="creation-form__step">THE STORY BLUEPRINT</span>
              <h2>Set the scene</h2>
            </div>
            <span className="creation-form__ornament" aria-hidden="true">✧</span>
          </div>

          <div className="creation-fields">
            <label className="creation-field creation-field--full" htmlFor="characterName">
              <span className="creation-field__label">Your hero&apos;s name</span>
              <input
                id="characterName"
                name="characterName"
                type="text"
                placeholder="e.g. Aria the brave"
                value={storyDetails.characterName}
                onChange={updateStoryDetails}
                maxLength={60}
                required
              />
            </label>

            <label className="creation-field" htmlFor="genre">
              <span className="creation-field__label">Choose a genre</span>
              <span className="creation-select">
                <select id="genre" name="genre" value={storyDetails.genre} onChange={updateStoryDetails}>
                  {genres.map((genre) => <option key={genre}>{genre}</option>)}
                </select>
                <span aria-hidden="true">⌄</span>
              </span>
            </label>

            <label className="creation-field" htmlFor="world">
              <span className="creation-field__label">Pick a world</span>
              <span className="creation-select">
                <select id="world" name="world" value={storyDetails.world} onChange={updateStoryDetails}>
                  {worlds.map((world) => <option key={world}>{world}</option>)}
                </select>
                <span aria-hidden="true">⌄</span>
              </span>
            </label>

            <label className="creation-field creation-field--full" htmlFor="description">
              <span className="creation-field__label">What should happen?</span>
              <textarea
                id="description"
                name="description"
                placeholder="A mysterious map, a lost dragon, a secret waiting to be found..."
                value={storyDetails.description}
                onChange={updateStoryDetails}
                maxLength={500}
                rows={3}
                required
              />
              <span className="creation-field__hint">
                {storyDetails.description.length}/500 · A few details make the best adventures
              </span>
            </label>

            <div className="creation-field creation-field--full creation-length">
              <div className="creation-length__top">
                <label className="creation-field__label" htmlFor="steps">Adventure length</label>
                <span className="creation-length__count">
                  {storyDetails.steps} <span>{storyDetails.steps === 1 ? "scene" : "scenes"}</span>
                </span>
              </div>
              <input
                className="creation-slider"
                id="steps"
                name="steps"
                type="range"
                min="3"
                max="10"
                value={storyDetails.steps}
                onChange={updateStoryDetails}
                style={{ "--range-progress": `${((storyDetails.steps - 3) / 7) * 100}%` }}
              />
              <div className="creation-length__range" aria-hidden="true">
                <span>A short tale</span><span>An epic journey</span>
              </div>
            </div>
          </div>

          {error && <p className="creation-error" role="alert">{error}</p>}

          <button className="creation-submit" type="submit" disabled={isCreating}>
            <span>{isCreating ? "Weaving your story..." : "Create my adventure"}</span>
            <span className="creation-submit__icon" aria-hidden="true">
              {isCreating ? "✦" : "→"}
            </span>
          </button>
          <p className="creation-form__note">Made of wonder, guided by your imagination</p>
        </form>

        {generatedStory && (
          <section className="creation-result" aria-live="polite" aria-labelledby="story-title">
            <p className="creation-eyebrow"><span /> Fresh from the storybook</p>
            <div className="creation-result__body">
              <h2 id="story-title" className="creation-result__sr-title">Your generated adventure</h2>
              <StoryResult story={generatedStory} />
            </div>
          </section>
        )}
      </section>
      <footer className="creation-footer">A little magic goes a long way <span aria-hidden="true">✦</span></footer>
    </main>
  );
}
