"use client";

import { Link } from "next-view-transitions";
import { useState } from "react";

export default function StartButton() {
  const [started, setStarted] = useState(false);

  function handleStart() {
    setStarted(true);
  }

  return (
    <Link href="/create" className="start-link">
      Start Your Adventure
    </Link>
  );
}
