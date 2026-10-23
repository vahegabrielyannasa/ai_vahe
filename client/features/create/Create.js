"use client";

import { useState } from "react";
import "./create.css";
import Form from "./sections/Form";
import Header from "./sections/Header";
import Intro from "./sections/Intro";
import Result from "./sections/Result";
import Sky from "./sections/Sky";

export default function Create() {
	const [story, setStory] = useState(null);

	return (
		<main className="creation-page">
			<Sky />
			<Header />
			<section className="creation-content" aria-labelledby="creation-title">
				<Intro />
				<Form onStoryCreated={setStory} />
				<Result story={story} />
			</section>
			<footer className="creation-footer">
				A little magic goes a long way <span aria-hidden="true">✦</span>
			</footer>
		</main>
	);
}
