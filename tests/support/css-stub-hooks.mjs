const STYLESHEET = /\.(css|scss|sass|less)$/;

export async function resolve(specifier, context, nextResolve) {
  if (STYLESHEET.test(specifier)) {
    return {
      url: `data:text/javascript,${encodeURIComponent("export default {};")}`,
      shortCircuit: true,
    };
  }

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const resolved = await nextResolve(specifier, context);
    if (STYLESHEET.test(resolved.url)) {
      return {
        url: `data:text/javascript,${encodeURIComponent("export default {};")}`,
        shortCircuit: true,
      };
    }
    return resolved;
  }

  return nextResolve(specifier, context);
}