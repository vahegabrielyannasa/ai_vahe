"use client";

import { useState } from "react";
import { createStory } from "@/services/api";
import { genres, initialStory, worlds } from "../data";

export default function Form({ onStoryCreated }) {

    const [storyDetails, setStoryDetails] = useState(initialStory);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        setError("");
        try {
            const storyData = {
                characterName: storyDetails.characterName,
                genre: storyDetails.genre,
                steps: storyDetails.steps,
                world: storyDetails.world,
                description: storyDetails.description,
            };
            const generated = await createStory(storyData);
            const book = {
                id: crypto.randomUUID(),
                title: generated.title,
                pages: generated.pages,
            }
            saveBook(book);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
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

            <button className="creation-submit" type="submit" disabled={loading}>
                <span>{loading ? "Weaving your story..." : "Create my adventure"}</span>
                <span className="creation-submit__icon" aria-hidden="true">
                    {loading ? "✦" : "→"}
                </span>
            </button>
            <p className="creation-form__note">Made of wonder, guided by your imagination</p>
        </form>
    );

}