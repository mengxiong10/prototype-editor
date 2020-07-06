export function matchesSelectorAndParentsTo(
  el: Element,
  selector: string,
  baseNode?: Element
): boolean {
  let node: Element | null = el;
  while (node) {
    if (node.matches(selector)) return true;
    if (node === baseNode) return false;
    node = node.parentElement;
  }
  return false;
}

export function closestUntil(node: HTMLElement, s: string, until: HTMLElement = document.body) {
  let el: HTMLElement | null = node;
  while (el !== null && el !== until) {
    if (el.matches(s)) return el;
    el = el.parentElement;
  }
  return null;
}
