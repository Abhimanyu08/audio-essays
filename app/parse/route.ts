import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const resp = await fetch(url);
	const html = await resp.text();

	return new NextResponse(html, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
