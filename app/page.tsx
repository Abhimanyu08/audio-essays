"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Home() {
	const [url, setUrl] = useState("");
	const onTranscribe = async () => {
		const fetchConfig: RequestInit = {
			method: "GET",
			mode: "no-cors",
		};
		const resp = await fetch(url, fetchConfig);
		const body = await resp.text();
		console.log(body);
	};
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="flex gap-2 items-center">
				<Label htmlFor="url">Enter a url: </Label>
				<Input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					className="w-64"
					id="url"
				/>
				<Button onClick={onTranscribe}>Transcribe</Button>
			</div>
		</main>
	);
}
