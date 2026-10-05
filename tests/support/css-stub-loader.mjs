import { register } from "node:module";
import { pathToFileURL } from "node:url";

/**
 * Allows the Node-based specs to import TSX components that pull in stylesheets.
 * Node cannot parse `.css`, so those imports resolve to an empty module here.
 */
register("./css-stub-hooks.mjs", pathToFileURL(import.meta.filename));