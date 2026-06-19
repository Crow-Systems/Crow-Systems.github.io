const ALLOWED_TAGS = new Set(["br", "em", "strong", "span", "b", "i"]);
const ALLOWED_ATTRS = new Set(["class"]);

export function sanitizeHtml(input: string): string {
  return input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*on\w+\s*=[^>]*>/gi, "")
    .replace(/<(\/?)(\w+)([^>]*)>/g, (_match, slash, tag, attrs) => {
      const lowerTag = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(lowerTag)) return "";
      const safeAttrs = attrs.replace(/(\w+)\s*=\s*["'][^"']*["']/g, (am: string, an: string) => {
        if (ALLOWED_ATTRS.has(an.toLowerCase())) return am;
        return "";
      });
      return `<${slash}${tag}${safeAttrs}>`;
    });
}
