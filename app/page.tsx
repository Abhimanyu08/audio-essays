"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractTextFromNode } from "@/lib/extractText";
import { useEffect, useState } from "react";

export default function Home() {
	const [url, setUrl] = useState("");
	const [text, setText] = useState("");
	const [articleChildren, setArticleChildren] = useState<HTMLElement[]>([]);
	const [audioBlob, setAudioBlob] = useState<Blob | null>();
	const onTranscribe = async () => {
		const resp = await fetch("/parse", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify({
				url,
			}),
		});
		const html = await resp.text();

		const parser = new DOMParser();

		const doc = parser.parseFromString(html, "text/html");

		let text = "";
		const pTags = Array.from(doc.body.getElementsByTagName("p"));
		const children = [];
		for (let ptag of pTags) {
			text += extractTextFromNode(ptag);
			children.push(ptag);
		}

		setText(text);
		setArticleChildren(children);
	};

	useEffect(() => {
		const articleElem = document.getElementById("article");
		for (let child of articleChildren) {
			articleElem?.appendChild(child);
		}
	}, [articleChildren]);

	const onGenerateAudio = async () => {
		if (!text) return;
		try {
			const response = await fetch("/tts", {
				method: "POST",
				body: text,
			}); // Replace with your actual endpoint
			const blob = await response.blob();
			setAudioBlob(blob);
		} catch (error) {
			console.error("Error generating audio:", error);
		}
	};
	return (
		<main className="flex h-screen gap-2 items-center justify-between p-24">
			<div className="flex gap-2 items-center">
				<Label htmlFor="url">Enter a url: </Label>
				<Input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					className="w-64"
					id="url"
				/>
				<Button onClick={onTranscribe}>Scrape</Button>
			</div>
			{audioBlob ? (
				<audio controls>
					<source
						src={URL.createObjectURL(
							new Blob([audioBlob], { type: "audio/mp3" })
						)}
					/>
				</audio>
			) : (
				<Button onClick={onGenerateAudio}>Generate Audio</Button>
			)}
			<audio src=""></audio>
			{articleChildren.length > 0 && (
				<article
					id="article"
					className="prose p-20 h-full overflow-auto bg-gray-200"
				></article>
			)}
		</main>
	);
}
