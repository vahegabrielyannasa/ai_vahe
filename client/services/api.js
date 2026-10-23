const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createStory(data) {
    const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        let message = `Story generation failed ${response.status}`;
        try {
            const result = await response.json();
            if (typeof result.detail === "string") {
                message = result.detail;
            }
        } catch { }
        throw new Error(message);
    }
    return response.json();
}