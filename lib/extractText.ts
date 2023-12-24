export function extractTextFromNode(node: HTMLElement) {
	let text = "";
	for (let child of Array.from(node.childNodes)) {
		if (child.nodeType === 3) {
			text += child.textContent;
			continue;
		}
		text += extractTextFromNode(child as HTMLElement);
	}
	return text;
}
