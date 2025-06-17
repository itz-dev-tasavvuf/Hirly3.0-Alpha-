var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// plugins/visual-editor/vite-plugin-react-inline-editor.js
var vite_plugin_react_inline_editor_exports = {};
__export(vite_plugin_react_inline_editor_exports, {
  default: () => inlineEditPlugin
});
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/node_modules/@babel/parser/lib/index.js";
import traverseBabel from "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/node_modules/@babel/traverse/lib/index.js";
import generate from "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/node_modules/@babel/generator/lib/index.js";
import * as t from "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/node_modules/@babel/types/lib/index.js";
import fs from "fs";
function parseEditId(editId) {
  const parts = editId.split(":");
  if (parts.length < 3) {
    return null;
  }
  const column = parseInt(parts.at(-1), 10);
  const line = parseInt(parts.at(-2), 10);
  const filePath = parts.slice(0, -2).join(":");
  if (!filePath || isNaN(line) || isNaN(column)) {
    return null;
  }
  return { filePath, line, column };
}
function checkTagNameEditable(openingElementNode, editableTagsList) {
  if (!openingElementNode || !openingElementNode.name)
    return false;
  const nameNode = openingElementNode.name;
  if (nameNode.type === "JSXIdentifier" && editableTagsList.includes(nameNode.name)) {
    return true;
  }
  if (nameNode.type === "JSXMemberExpression" && nameNode.property && nameNode.property.type === "JSXIdentifier" && editableTagsList.includes(nameNode.property.name)) {
    return true;
  }
  return false;
}
function inlineEditPlugin() {
  return {
    name: "vite-inline-edit-plugin",
    enforce: "pre",
    transform(code, id) {
      if (!/\.(jsx|tsx)$/.test(id) || !id.startsWith(VITE_PROJECT_ROOT) || id.includes("node_modules")) {
        return null;
      }
      const relativeFilePath = path.relative(VITE_PROJECT_ROOT, id);
      const webRelativeFilePath = relativeFilePath.split(path.sep).join("/");
      try {
        const babelAst = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
          errorRecovery: true
        });
        let attributesAdded = 0;
        traverseBabel.default(babelAst, {
          enter(path3) {
            if (path3.isJSXOpeningElement()) {
              const openingNode = path3.node;
              const elementNode = path3.parentPath.node;
              if (!openingNode.loc) {
                return;
              }
              const alreadyHasId = openingNode.attributes.some(
                (attr) => t.isJSXAttribute(attr) && attr.name.name === "data-edit-id"
              );
              if (alreadyHasId) {
                return;
              }
              const isCurrentElementEditable = checkTagNameEditable(openingNode, EDITABLE_HTML_TAGS);
              if (!isCurrentElementEditable) {
                return;
              }
              let shouldBeDisabledDueToChildren = false;
              if (t.isJSXElement(elementNode) && elementNode.children) {
                const hasPropsSpread = openingNode.attributes.some(
                  (attr) => t.isJSXSpreadAttribute(attr) && attr.argument && t.isIdentifier(attr.argument) && attr.argument.name === "props"
                );
                const hasDynamicChild = elementNode.children.some(
                  (child) => t.isJSXExpressionContainer(child)
                );
                if (hasDynamicChild || hasPropsSpread) {
                  shouldBeDisabledDueToChildren = true;
                }
              }
              if (!shouldBeDisabledDueToChildren && t.isJSXElement(elementNode) && elementNode.children) {
                const hasEditableJsxChild = elementNode.children.some((child) => {
                  if (t.isJSXElement(child)) {
                    return checkTagNameEditable(child.openingElement, EDITABLE_HTML_TAGS);
                  }
                  return false;
                });
                if (hasEditableJsxChild) {
                  shouldBeDisabledDueToChildren = true;
                }
              }
              if (shouldBeDisabledDueToChildren) {
                const disabledAttribute = t.jsxAttribute(
                  t.jsxIdentifier("data-edit-disabled"),
                  t.stringLiteral("true")
                );
                openingNode.attributes.push(disabledAttribute);
                attributesAdded++;
                return;
              }
              if (t.isJSXElement(elementNode) && elementNode.children && elementNode.children.length > 0) {
                let hasNonEditableJsxChild = false;
                for (const child of elementNode.children) {
                  if (t.isJSXElement(child)) {
                    if (!checkTagNameEditable(child.openingElement, EDITABLE_HTML_TAGS)) {
                      hasNonEditableJsxChild = true;
                      break;
                    }
                  }
                }
                if (hasNonEditableJsxChild) {
                  const disabledAttribute = t.jsxAttribute(
                    t.jsxIdentifier("data-edit-disabled"),
                    t.stringLiteral("true")
                  );
                  openingNode.attributes.push(disabledAttribute);
                  attributesAdded++;
                  return;
                }
              }
              let currentAncestorCandidatePath = path3.parentPath.parentPath;
              while (currentAncestorCandidatePath) {
                const ancestorJsxElementPath = currentAncestorCandidatePath.isJSXElement() ? currentAncestorCandidatePath : currentAncestorCandidatePath.findParent((p) => p.isJSXElement());
                if (!ancestorJsxElementPath) {
                  break;
                }
                if (checkTagNameEditable(ancestorJsxElementPath.node.openingElement, EDITABLE_HTML_TAGS)) {
                  return;
                }
                currentAncestorCandidatePath = ancestorJsxElementPath.parentPath;
              }
              const line = openingNode.loc.start.line;
              const column = openingNode.loc.start.column + 1;
              const editId = `${webRelativeFilePath}:${line}:${column}`;
              const idAttribute = t.jsxAttribute(
                t.jsxIdentifier("data-edit-id"),
                t.stringLiteral(editId)
              );
              openingNode.attributes.push(idAttribute);
              attributesAdded++;
            }
          }
        });
        if (attributesAdded > 0) {
          const generateFunction = generate.default || generate;
          const output = generateFunction(babelAst, {
            sourceMaps: true,
            sourceFileName: webRelativeFilePath
          }, code);
          return { code: output.code, map: output.map };
        }
        return null;
      } catch (error) {
        console.error(`[vite][visual-editor] Error transforming ${id}:`, error);
        return null;
      }
    },
    // Updates source code based on the changes received from the client
    configureServer(server) {
      server.middlewares.use("/api/apply-edit", async (req, res, next) => {
        if (req.method !== "POST")
          return next();
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          var _a;
          let absoluteFilePath = "";
          try {
            const { editId, newFullText } = JSON.parse(body);
            if (!editId || typeof newFullText === "undefined") {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Missing editId or newFullText" }));
            }
            const parsedId = parseEditId(editId);
            if (!parsedId) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid editId format (filePath:line:column)" }));
            }
            const { filePath, line, column } = parsedId;
            absoluteFilePath = path.resolve(VITE_PROJECT_ROOT, filePath);
            if (filePath.includes("..") || !absoluteFilePath.startsWith(VITE_PROJECT_ROOT) || absoluteFilePath.includes("node_modules")) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid path" }));
            }
            const originalContent = fs.readFileSync(absoluteFilePath, "utf-8");
            const babelAst = parse(originalContent, {
              sourceType: "module",
              plugins: ["jsx", "typescript"],
              errorRecovery: true
            });
            let targetNodePath = null;
            const visitor = {
              JSXOpeningElement(path3) {
                const node = path3.node;
                if (node.loc && node.loc.start.line === line && node.loc.start.column + 1 === column) {
                  targetNodePath = path3;
                  path3.stop();
                }
              }
            };
            traverseBabel.default(babelAst, visitor);
            if (!targetNodePath) {
              res.writeHead(404, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Target node not found by line/column", editId }));
            }
            const generateFunction = generate.default || generate;
            const parentElementNode = (_a = targetNodePath.parentPath) == null ? void 0 : _a.node;
            let beforeCode = "";
            if (parentElementNode && t.isJSXElement(parentElementNode)) {
              const beforeOutput = generateFunction(parentElementNode, {});
              beforeCode = beforeOutput.code;
            }
            let modified = false;
            if (parentElementNode && t.isJSXElement(parentElementNode)) {
              parentElementNode.children = [];
              if (newFullText && newFullText.trim() !== "") {
                const newTextNode = t.jsxText(newFullText);
                parentElementNode.children.push(newTextNode);
              }
              modified = true;
            }
            if (!modified) {
              res.writeHead(409, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Could not apply changes to AST." }));
            }
            let afterCode = "";
            if (parentElementNode && t.isJSXElement(parentElementNode)) {
              const afterOutput = generateFunction(parentElementNode, {});
              afterCode = afterOutput.code;
            }
            const output = generateFunction(babelAst, {});
            const newContent = output.code;
            try {
              fs.writeFileSync(absoluteFilePath, newContent, "utf-8");
            } catch (writeError) {
              console.error(`[vite][visual-editor] Error during direct write for ${filePath}:`, writeError);
              throw writeError;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              success: true,
              newFileContent: newContent,
              beforeCode,
              afterCode
            }));
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error during edit application." }));
          }
        });
      });
    }
  };
}
var __vite_injected_original_import_meta_url, __filename, __dirname2, VITE_PROJECT_ROOT, EDITABLE_HTML_TAGS;
var init_vite_plugin_react_inline_editor = __esm({
  "plugins/visual-editor/vite-plugin-react-inline-editor.js"() {
    __vite_injected_original_import_meta_url = "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/plugins/visual-editor/vite-plugin-react-inline-editor.js";
    __filename = fileURLToPath(__vite_injected_original_import_meta_url);
    __dirname2 = path.dirname(__filename);
    VITE_PROJECT_ROOT = path.resolve(__dirname2, "../..");
    EDITABLE_HTML_TAGS = ["a", "Button", "button", "p", "span", "h1", "h2", "h3", "h4"];
  }
});

// plugins/visual-editor/visual-editor-config.js
var EDIT_MODE_STYLES;
var init_visual_editor_config = __esm({
  "plugins/visual-editor/visual-editor-config.js"() {
    EDIT_MODE_STYLES = `
  #root[data-edit-mode-enabled="true"] [data-edit-id] {
    cursor: pointer; 
    outline: 1px dashed #357DF9; 
    outline-offset: 2px;
    min-height: 1em;
  }
  #root[data-edit-mode-enabled="true"] {
    cursor: pointer;
  }
  #root[data-edit-mode-enabled="true"] [data-edit-id]:hover {
    background-color: #357DF933;
    outline-color: #357DF9; 
  }

  @keyframes fadeInTooltip {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  #inline-editor-disabled-tooltip {
    display: none; 
    opacity: 0; 
    position: absolute;
    background-color: #1D1E20;
    color: white;
    padding: 4px 8px;
    border-radius: 8px;
    z-index: 10001;
    font-size: 14px;
    border: 1px solid #3B3D4A;
    max-width: 184px;
    text-align: center;
  }

  #inline-editor-disabled-tooltip.tooltip-active {
    display: block;
    animation: fadeInTooltip 0.2s ease-out forwards;
  }
`;
  }
});

// plugins/visual-editor/vite-plugin-edit-mode.js
var vite_plugin_edit_mode_exports = {};
__export(vite_plugin_edit_mode_exports, {
  default: () => inlineEditDevPlugin
});
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
function inlineEditDevPlugin() {
  return {
    name: "vite:inline-edit-dev",
    apply: "serve",
    transformIndexHtml() {
      const scriptPath = resolve(__dirname3, "edit-mode-script.js");
      const scriptContent = readFileSync(scriptPath, "utf-8");
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: scriptContent,
          injectTo: "body"
        },
        {
          tag: "style",
          children: EDIT_MODE_STYLES,
          injectTo: "head"
        }
      ];
    }
  };
}
var __vite_injected_original_import_meta_url2, __filename2, __dirname3;
var init_vite_plugin_edit_mode = __esm({
  "plugins/visual-editor/vite-plugin-edit-mode.js"() {
    init_visual_editor_config();
    __vite_injected_original_import_meta_url2 = "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/plugins/visual-editor/vite-plugin-edit-mode.js";
    __filename2 = fileURLToPath2(__vite_injected_original_import_meta_url2);
    __dirname3 = resolve(__filename2, "..");
  }
});

// vite.config.js
import path2 from "node:path";
import react from "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { createLogger, defineConfig } from "file:///C:/Users/Reggie/Hirly3.0-Alpha-/project/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Reggie\\Hirly3.0-Alpha-\\project";
var isDev = process.env.NODE_ENV !== "production";
var inlineEditPlugin2;
var editModeDevPlugin;
if (isDev) {
  inlineEditPlugin2 = (await Promise.resolve().then(() => (init_vite_plugin_react_inline_editor(), vite_plugin_react_inline_editor_exports))).default;
  editModeDevPlugin = (await Promise.resolve().then(() => (init_vite_plugin_edit_mode(), vite_plugin_edit_mode_exports))).default;
}
var configHorizonsViteErrorHandler = `
const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const addedNode of mutation.addedNodes) {
			if (
				addedNode.nodeType === Node.ELEMENT_NODE &&
				(
					addedNode.tagName?.toLowerCase() === 'vite-error-overlay' ||
					addedNode.classList?.contains('backdrop')
				)
			) {
				handleViteOverlay(addedNode);
			}
		}
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});

function handleViteOverlay(node) {
	if (!node.shadowRoot) {
		return;
	}

	const backdrop = node.shadowRoot.querySelector('.backdrop');

	if (backdrop) {
		const overlayHtml = backdrop.outerHTML;
		const parser = new DOMParser();
		const doc = parser.parseFromString(overlayHtml, 'text/html');
		const messageBodyElement = doc.querySelector('.message-body');
		const fileElement = doc.querySelector('.file');
		const messageText = messageBodyElement ? messageBodyElement.textContent.trim() : '';
		const fileText = fileElement ? fileElement.textContent.trim() : '';
		const error = messageText + (fileText ? ' File:' + fileText : '');

		window.parent.postMessage({
			type: 'horizons-vite-error',
			error,
		}, '*');
	}
}
`;
var configHorizonsRuntimeErrorHandler = `
window.onerror = (message, source, lineno, colno, errorObj) => {
	const errorDetails = errorObj ? JSON.stringify({
		name: errorObj.name,
		message: errorObj.message,
		stack: errorObj.stack,
		source,
		lineno,
		colno,
	}) : null;

	window.parent.postMessage({
		type: 'horizons-runtime-error',
		message,
		error: errorDetails
	}, '*');
};
`;
var configHorizonsConsoleErrroHandler = `
const originalConsoleError = console.error;
console.error = function(...args) {
	originalConsoleError.apply(console, args);

	let errorString = '';

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg instanceof Error) {
			errorString = arg.stack || \`\${arg.name}: \${arg.message}\`;
			break;
		}
	}

	if (!errorString) {
		errorString = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
	}

	window.parent.postMessage({
		type: 'horizons-console-error',
		error: errorString
	}, '*');
};
`;
var configWindowFetchMonkeyPatch = `
const originalFetch = window.fetch;

window.fetch = function(...args) {
	const url = args[0] instanceof Request ? args[0].url : args[0];

	// Skip WebSocket URLs
	if (url.startsWith('ws:') || url.startsWith('wss:')) {
		return originalFetch.apply(this, args);
	}

	return originalFetch.apply(this, args)
		.then(async response => {
			const contentType = response.headers.get('Content-Type') || '';

			// Exclude HTML document responses
			const isDocumentResponse =
				contentType.includes('text/html') ||
				contentType.includes('application/xhtml+xml');

			if (!response.ok && !isDocumentResponse) {
					const responseClone = response.clone();
					const errorFromRes = await responseClone.text();
					const requestUrl = response.url;
					console.error(\`Fetch error from \${requestUrl}: \${errorFromRes}\`);
			}

			return response;
		})
		.catch(error => {
			if (!url.match(/.html?$/i)) {
				console.error(error);
			}

			throw error;
		});
};
`;
var addTransformIndexHtml = {
  name: "add-transform-index-html",
  transformIndexHtml(html) {
    return {
      html,
      tags: [
        {
          tag: "script",
          attrs: { type: "module" },
          children: configHorizonsRuntimeErrorHandler,
          injectTo: "head"
        },
        {
          tag: "script",
          attrs: { type: "module" },
          children: configHorizonsViteErrorHandler,
          injectTo: "head"
        },
        {
          tag: "script",
          attrs: { type: "module" },
          children: configHorizonsConsoleErrroHandler,
          injectTo: "head"
        },
        {
          tag: "script",
          attrs: { type: "module" },
          children: configWindowFetchMonkeyPatch,
          injectTo: "head"
        }
      ]
    };
  }
};
console.warn = () => {
};
var logger = createLogger();
var loggerError = logger.error;
logger.error = (msg, options) => {
  var _a;
  if ((_a = options == null ? void 0 : options.error) == null ? void 0 : _a.toString().includes("CssSyntaxError: [postcss]")) {
    return;
  }
  loggerError(msg, options);
};
var vite_config_default = defineConfig({
  customLogger: logger,
  plugins: [
    ...isDev ? [inlineEditPlugin2(), editModeDevPlugin()] : [],
    react(),
    addTransformIndexHtml
  ],
  server: {
    cors: true,
    proxy: {
      "/api": "http://localhost:3001"
    },
    headers: {
      "Cross-Origin-Embedder-Policy": "credentialless"
    },
    allowedHosts: true
  },
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    alias: {
      "@": path2.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      external: [
        "@babel/parser",
        "@babel/traverse",
        "@babel/generator",
        "@babel/types"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGx1Z2lucy92aXN1YWwtZWRpdG9yL3ZpdGUtcGx1Z2luLXJlYWN0LWlubGluZS1lZGl0b3IuanMiLCAicGx1Z2lucy92aXN1YWwtZWRpdG9yL3Zpc3VhbC1lZGl0b3ItY29uZmlnLmpzIiwgInBsdWdpbnMvdmlzdWFsLWVkaXRvci92aXRlLXBsdWdpbi1lZGl0LW1vZGUuanMiLCAidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSZWdnaWVcXFxcSGlybHkzLjAtQWxwaGEtXFxcXHByb2plY3RcXFxccGx1Z2luc1xcXFx2aXN1YWwtZWRpdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSZWdnaWVcXFxcSGlybHkzLjAtQWxwaGEtXFxcXHByb2plY3RcXFxccGx1Z2luc1xcXFx2aXN1YWwtZWRpdG9yXFxcXHZpdGUtcGx1Z2luLXJlYWN0LWlubGluZS1lZGl0b3IuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1JlZ2dpZS9IaXJseTMuMC1BbHBoYS0vcHJvamVjdC9wbHVnaW5zL3Zpc3VhbC1lZGl0b3Ivdml0ZS1wbHVnaW4tcmVhY3QtaW5saW5lLWVkaXRvci5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcclxuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdAYmFiZWwvcGFyc2VyJztcclxuaW1wb3J0IHRyYXZlcnNlQmFiZWwgZnJvbSAnQGJhYmVsL3RyYXZlcnNlJztcclxuaW1wb3J0IGdlbmVyYXRlIGZyb20gJ0BiYWJlbC9nZW5lcmF0b3InO1xyXG5pbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XHJcbmNvbnN0IFZJVEVfUFJPSkVDVF9ST09UID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uJyk7XHJcbmNvbnN0IEVESVRBQkxFX0hUTUxfVEFHUyA9IFtcImFcIiwgXCJCdXR0b25cIiwgXCJidXR0b25cIiwgXCJwXCIsIFwic3BhblwiLCBcImgxXCIsIFwiaDJcIiwgXCJoM1wiLCBcImg0XCJdO1xyXG5cclxuZnVuY3Rpb24gcGFyc2VFZGl0SWQoZWRpdElkKSB7XHJcbiAgY29uc3QgcGFydHMgPSBlZGl0SWQuc3BsaXQoJzonKTtcclxuXHJcbiAgaWYgKHBhcnRzLmxlbmd0aCA8IDMpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY29sdW1uID0gcGFyc2VJbnQocGFydHMuYXQoLTEpLCAxMCk7XHJcbiAgY29uc3QgbGluZSA9IHBhcnNlSW50KHBhcnRzLmF0KC0yKSwgMTApO1xyXG4gIGNvbnN0IGZpbGVQYXRoID0gcGFydHMuc2xpY2UoMCwgLTIpLmpvaW4oJzonKTtcclxuXHJcbiAgaWYgKCFmaWxlUGF0aCB8fCBpc05hTihsaW5lKSB8fCBpc05hTihjb2x1bW4pKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHsgZmlsZVBhdGgsIGxpbmUsIGNvbHVtbiB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja1RhZ05hbWVFZGl0YWJsZShvcGVuaW5nRWxlbWVudE5vZGUsIGVkaXRhYmxlVGFnc0xpc3QpIHtcclxuICAgIGlmICghb3BlbmluZ0VsZW1lbnROb2RlIHx8ICFvcGVuaW5nRWxlbWVudE5vZGUubmFtZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgY29uc3QgbmFtZU5vZGUgPSBvcGVuaW5nRWxlbWVudE5vZGUubmFtZTtcclxuXHJcbiAgICAvLyBDaGVjayAxOiBEaXJlY3QgbmFtZSAoZm9yIDxwPiwgPEJ1dHRvbj4pXHJcbiAgICBpZiAobmFtZU5vZGUudHlwZSA9PT0gJ0pTWElkZW50aWZpZXInICYmIGVkaXRhYmxlVGFnc0xpc3QuaW5jbHVkZXMobmFtZU5vZGUubmFtZSkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayAyOiBQcm9wZXJ0eSBuYW1lIG9mIGEgbWVtYmVyIGV4cHJlc3Npb24gKGZvciA8bW90aW9uLmgxPiwgY2hlY2sgaWYgXCJoMVwiIGlzIGluIGVkaXRhYmxlVGFnc0xpc3QpXHJcbiAgICBpZiAobmFtZU5vZGUudHlwZSA9PT0gJ0pTWE1lbWJlckV4cHJlc3Npb24nICYmIG5hbWVOb2RlLnByb3BlcnR5ICYmIG5hbWVOb2RlLnByb3BlcnR5LnR5cGUgPT09ICdKU1hJZGVudGlmaWVyJyAmJiBlZGl0YWJsZVRhZ3NMaXN0LmluY2x1ZGVzKG5hbWVOb2RlLnByb3BlcnR5Lm5hbWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbmxpbmVFZGl0UGx1Z2luKCkgeyAgXHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6ICd2aXRlLWlubGluZS1lZGl0LXBsdWdpbicsXHJcbiAgICBlbmZvcmNlOiAncHJlJyxcclxuXHJcbiAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcclxuICAgICAgaWYgKCEvXFwuKGpzeHx0c3gpJC8udGVzdChpZCkgfHwgIWlkLnN0YXJ0c1dpdGgoVklURV9QUk9KRUNUX1JPT1QpIHx8IGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZWxhdGl2ZUZpbGVQYXRoID0gcGF0aC5yZWxhdGl2ZShWSVRFX1BST0pFQ1RfUk9PVCwgaWQpO1xyXG4gICAgICBjb25zdCB3ZWJSZWxhdGl2ZUZpbGVQYXRoID0gcmVsYXRpdmVGaWxlUGF0aC5zcGxpdChwYXRoLnNlcCkuam9pbignLycpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBiYWJlbEFzdCA9IHBhcnNlKGNvZGUsIHtcclxuICAgICAgICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxyXG4gICAgICAgICAgcGx1Z2luczogWydqc3gnLCAndHlwZXNjcmlwdCddLFxyXG4gICAgICAgICAgZXJyb3JSZWNvdmVyeTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgYXR0cmlidXRlc0FkZGVkID0gMDtcclxuXHJcbiAgICAgICAgdHJhdmVyc2VCYWJlbC5kZWZhdWx0KGJhYmVsQXN0LCB7XHJcbiAgICAgICAgICBlbnRlcihwYXRoKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXRoLmlzSlNYT3BlbmluZ0VsZW1lbnQoKSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IG9wZW5pbmdOb2RlID0gcGF0aC5ub2RlO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnROb2RlID0gcGF0aC5wYXJlbnRQYXRoLm5vZGU7IC8vIFRoZSBKU1hFbGVtZW50IGl0c2VsZlxyXG5cclxuICAgICAgICAgICAgICBpZiAoIW9wZW5pbmdOb2RlLmxvYykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgYWxyZWFkeUhhc0lkID0gb3BlbmluZ05vZGUuYXR0cmlidXRlcy5zb21lKFxyXG4gICAgICAgICAgICAgICAgKGF0dHIpID0+IHQuaXNKU1hBdHRyaWJ1dGUoYXR0cikgJiYgYXR0ci5uYW1lLm5hbWUgPT09ICdkYXRhLWVkaXQtaWQnXHJcbiAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGFscmVhZHlIYXNJZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29uZGl0aW9uIDE6IElzIHRoZSBjdXJyZW50IGVsZW1lbnQgdGFnIHR5cGUgZWRpdGFibGU/XHJcbiAgICAgICAgICAgICAgY29uc3QgaXNDdXJyZW50RWxlbWVudEVkaXRhYmxlID0gY2hlY2tUYWdOYW1lRWRpdGFibGUob3BlbmluZ05vZGUsIEVESVRBQkxFX0hUTUxfVEFHUyk7XHJcbiAgICAgICAgICAgICAgaWYgKCFpc0N1cnJlbnRFbGVtZW50RWRpdGFibGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGxldCBzaG91bGRCZURpc2FibGVkRHVlVG9DaGlsZHJlbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAvLyBDb25kaXRpb24gMjogRG9lcyB0aGUgZWxlbWVudCBoYXZlIGR5bmFtaWMgb3IgZWRpdGFibGUgY2hpbGRyZW5cclxuICAgICAgICAgICAgICBpZiAodC5pc0pTWEVsZW1lbnQoZWxlbWVudE5vZGUpICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGhhcyB7Li4ucHJvcHN9IHNwcmVhZCBhdHRyaWJ1dGUgLSBkaXNhYmxlIGVkaXRpbmcgaWYgaXQgZG9lc1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFzUHJvcHNTcHJlYWQgPSBvcGVuaW5nTm9kZS5hdHRyaWJ1dGVzLnNvbWUoYXR0ciA9PiB0LmlzSlNYU3ByZWFkQXR0cmlidXRlKGF0dHIpIFxyXG4gICAgICAgICAgICAgICAgJiYgYXR0ci5hcmd1bWVudCAgXHJcbiAgICAgICAgICAgICAgICAmJiB0LmlzSWRlbnRpZmllcihhdHRyLmFyZ3VtZW50KSBcclxuICAgICAgICAgICAgICAgICYmIGF0dHIuYXJndW1lbnQubmFtZSA9PT0gJ3Byb3BzJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNEeW5hbWljQ2hpbGQgPSBlbGVtZW50Tm9kZS5jaGlsZHJlbi5zb21lKGNoaWxkID0+XHJcbiAgICAgICAgICAgICAgICAgIHQuaXNKU1hFeHByZXNzaW9uQ29udGFpbmVyKGNoaWxkKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaGFzRHluYW1pY0NoaWxkIHx8IGhhc1Byb3BzU3ByZWFkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3VsZEJlRGlzYWJsZWREdWVUb0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmICghc2hvdWxkQmVEaXNhYmxlZER1ZVRvQ2hpbGRyZW4gJiYgdC5pc0pTWEVsZW1lbnQoZWxlbWVudE5vZGUpICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNFZGl0YWJsZUpzeENoaWxkID0gZWxlbWVudE5vZGUuY2hpbGRyZW4uc29tZShjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0LmlzSlNYRWxlbWVudChjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hlY2tUYWdOYW1lRWRpdGFibGUoY2hpbGQub3BlbmluZ0VsZW1lbnQsIEVESVRBQkxFX0hUTUxfVEFHUyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChoYXNFZGl0YWJsZUpzeENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgIHNob3VsZEJlRGlzYWJsZWREdWVUb0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGlmIChzaG91bGRCZURpc2FibGVkRHVlVG9DaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzYWJsZWRBdHRyaWJ1dGUgPSB0LmpzeEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgICAgICAgdC5qc3hJZGVudGlmaWVyKCdkYXRhLWVkaXQtZGlzYWJsZWQnKSxcclxuICAgICAgICAgICAgICAgICAgdC5zdHJpbmdMaXRlcmFsKCd0cnVlJylcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgb3BlbmluZ05vZGUuYXR0cmlidXRlcy5wdXNoKGRpc2FibGVkQXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNBZGRlZCsrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gQ29uZGl0aW9uIDM6IFBhcmVudCBpcyBub24tZWRpdGFibGUgaWYgQVQgTEVBU1QgT05FIGNoaWxkIEpTWEVsZW1lbnQgaXMgYSBub24tZWRpdGFibGUgdHlwZS5cclxuICAgICAgICAgICAgICBpZiAodC5pc0pTWEVsZW1lbnQoZWxlbWVudE5vZGUpICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuICYmIGVsZW1lbnROb2RlLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IGhhc05vbkVkaXRhYmxlSnN4Q2hpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBlbGVtZW50Tm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHQuaXNKU1hFbGVtZW50KGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hlY2tUYWdOYW1lRWRpdGFibGUoY2hpbGQub3BlbmluZ0VsZW1lbnQsIEVESVRBQkxFX0hUTUxfVEFHUykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzTm9uRWRpdGFibGVKc3hDaGlsZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBpZiAoaGFzTm9uRWRpdGFibGVKc3hDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzYWJsZWRBdHRyaWJ1dGUgPSB0LmpzeEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC5qc3hJZGVudGlmaWVyKCdkYXRhLWVkaXQtZGlzYWJsZWQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC5zdHJpbmdMaXRlcmFsKFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgIG9wZW5pbmdOb2RlLmF0dHJpYnV0ZXMucHVzaChkaXNhYmxlZEF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzQWRkZWQrKztcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIENvbmRpdGlvbiA0OiBJcyBhbnkgYW5jZXN0b3IgSlNYRWxlbWVudCBhbHNvIGVkaXRhYmxlP1xyXG4gICAgICAgICAgICAgIGxldCBjdXJyZW50QW5jZXN0b3JDYW5kaWRhdGVQYXRoID0gcGF0aC5wYXJlbnRQYXRoLnBhcmVudFBhdGg7XHJcbiAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRBbmNlc3RvckNhbmRpZGF0ZVBhdGgpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgYW5jZXN0b3JKc3hFbGVtZW50UGF0aCA9IGN1cnJlbnRBbmNlc3RvckNhbmRpZGF0ZVBhdGguaXNKU1hFbGVtZW50KClcclxuICAgICAgICAgICAgICAgICAgICAgID8gY3VycmVudEFuY2VzdG9yQ2FuZGlkYXRlUGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgOiBjdXJyZW50QW5jZXN0b3JDYW5kaWRhdGVQYXRoLmZpbmRQYXJlbnQocCA9PiBwLmlzSlNYRWxlbWVudCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmICghYW5jZXN0b3JKc3hFbGVtZW50UGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmIChjaGVja1RhZ05hbWVFZGl0YWJsZShhbmNlc3RvckpzeEVsZW1lbnRQYXRoLm5vZGUub3BlbmluZ0VsZW1lbnQsIEVESVRBQkxFX0hUTUxfVEFHUykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjdXJyZW50QW5jZXN0b3JDYW5kaWRhdGVQYXRoID0gYW5jZXN0b3JKc3hFbGVtZW50UGF0aC5wYXJlbnRQYXRoO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICBjb25zdCBsaW5lID0gb3BlbmluZ05vZGUubG9jLnN0YXJ0LmxpbmU7XHJcbiAgICAgICAgICAgICAgY29uc3QgY29sdW1uID0gb3BlbmluZ05vZGUubG9jLnN0YXJ0LmNvbHVtbiArIDE7XHJcbiAgICAgICAgICAgICAgY29uc3QgZWRpdElkID0gYCR7d2ViUmVsYXRpdmVGaWxlUGF0aH06JHtsaW5lfToke2NvbHVtbn1gO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGNvbnN0IGlkQXR0cmlidXRlID0gdC5qc3hBdHRyaWJ1dGUoXHJcbiAgICAgICAgICAgICAgICB0LmpzeElkZW50aWZpZXIoJ2RhdGEtZWRpdC1pZCcpLFxyXG4gICAgICAgICAgICAgICAgdC5zdHJpbmdMaXRlcmFsKGVkaXRJZClcclxuICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICBvcGVuaW5nTm9kZS5hdHRyaWJ1dGVzLnB1c2goaWRBdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZXNBZGRlZCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzQWRkZWQgPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCBnZW5lcmF0ZUZ1bmN0aW9uID0gZ2VuZXJhdGUuZGVmYXVsdCB8fCBnZW5lcmF0ZTtcclxuICAgICAgICAgIGNvbnN0IG91dHB1dCA9IGdlbmVyYXRlRnVuY3Rpb24oYmFiZWxBc3QsIHtcclxuICAgICAgICAgICAgc291cmNlTWFwczogdHJ1ZSxcclxuICAgICAgICAgICAgc291cmNlRmlsZU5hbWU6IHdlYlJlbGF0aXZlRmlsZVBhdGhcclxuICAgICAgICAgIH0sIGNvZGUpO1xyXG5cclxuICAgICAgICAgIHJldHVybiB7IGNvZGU6IG91dHB1dC5jb2RlLCBtYXA6IG91dHB1dC5tYXAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFt2aXRlXVt2aXN1YWwtZWRpdG9yXSBFcnJvciB0cmFuc2Zvcm1pbmcgJHtpZH06YCwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvLyBVcGRhdGVzIHNvdXJjZSBjb2RlIGJhc2VkIG9uIHRoZSBjaGFuZ2VzIHJlY2VpdmVkIGZyb20gdGhlIGNsaWVudFxyXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL2FwcGx5LWVkaXQnLCBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBpZiAocmVxLm1ldGhvZCAhPT0gJ1BPU1QnKSByZXR1cm4gbmV4dCgpO1xyXG5cclxuICAgICAgICBsZXQgYm9keSA9ICcnO1xyXG4gICAgICAgIHJlcS5vbignZGF0YScsIGNodW5rID0+IHsgYm9keSArPSBjaHVuay50b1N0cmluZygpOyB9KTtcclxuXHJcbiAgICAgICAgcmVxLm9uKCdlbmQnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICBsZXQgYWJzb2x1dGVGaWxlUGF0aCA9ICcnO1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgeyBlZGl0SWQsIG5ld0Z1bGxUZXh0IH0gPSBKU09OLnBhcnNlKGJvZHkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFlZGl0SWQgfHwgdHlwZW9mIG5ld0Z1bGxUZXh0ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ01pc3NpbmcgZWRpdElkIG9yIG5ld0Z1bGxUZXh0JyB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZElkID0gcGFyc2VFZGl0SWQoZWRpdElkKTtcclxuICAgICAgICAgICAgaWYgKCFwYXJzZWRJZCkge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludmFsaWQgZWRpdElkIGZvcm1hdCAoZmlsZVBhdGg6bGluZTpjb2x1bW4pJyB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHsgZmlsZVBhdGgsIGxpbmUsIGNvbHVtbiB9ID0gcGFyc2VkSWQ7XHJcblxyXG4gICAgICAgICAgICBhYnNvbHV0ZUZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKFZJVEVfUFJPSkVDVF9ST09ULCBmaWxlUGF0aCk7XHJcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aC5pbmNsdWRlcygnLi4nKSB8fCAhYWJzb2x1dGVGaWxlUGF0aC5zdGFydHNXaXRoKFZJVEVfUFJPSkVDVF9ST09UKSB8fCBhYnNvbHV0ZUZpbGVQYXRoLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ludmFsaWQgcGF0aCcgfSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbENvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoYWJzb2x1dGVGaWxlUGF0aCwgJ3V0Zi04Jyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBiYWJlbEFzdCA9IHBhcnNlKG9yaWdpbmFsQ29udGVudCwge1xyXG4gICAgICAgICAgICAgIHNvdXJjZVR5cGU6ICdtb2R1bGUnLFxyXG4gICAgICAgICAgICAgIHBsdWdpbnM6IFsnanN4JywgJ3R5cGVzY3JpcHQnXSxcclxuICAgICAgICAgICAgICBlcnJvclJlY292ZXJ5OiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV0IHRhcmdldE5vZGVQYXRoID0gbnVsbDtcclxuICAgICAgICAgICAgY29uc3QgdmlzaXRvciA9IHtcclxuICAgICAgICAgICAgICBKU1hPcGVuaW5nRWxlbWVudChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gcGF0aC5ub2RlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubG9jICYmIG5vZGUubG9jLnN0YXJ0LmxpbmUgPT09IGxpbmUgJiYgbm9kZS5sb2Muc3RhcnQuY29sdW1uICsgMSA9PT0gY29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRhcmdldE5vZGVQYXRoID0gcGF0aDtcclxuICAgICAgICAgICAgICAgICAgcGF0aC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0cmF2ZXJzZUJhYmVsLmRlZmF1bHQoYmFiZWxBc3QsIHZpc2l0b3IpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0YXJnZXROb2RlUGF0aCkge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDA0LCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1RhcmdldCBub2RlIG5vdCBmb3VuZCBieSBsaW5lL2NvbHVtbicsIGVkaXRJZCB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdlbmVyYXRlRnVuY3Rpb24gPSBnZW5lcmF0ZS5kZWZhdWx0IHx8IGdlbmVyYXRlO1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRFbGVtZW50Tm9kZSA9IHRhcmdldE5vZGVQYXRoLnBhcmVudFBhdGg/Lm5vZGU7XHJcbiAgICAgICAgICAgIGxldCBiZWZvcmVDb2RlID0gJyc7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAocGFyZW50RWxlbWVudE5vZGUgJiYgdC5pc0pTWEVsZW1lbnQocGFyZW50RWxlbWVudE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgYmVmb3JlT3V0cHV0ID0gZ2VuZXJhdGVGdW5jdGlvbihwYXJlbnRFbGVtZW50Tm9kZSwge30pO1xyXG4gICAgICAgICAgICAgIGJlZm9yZUNvZGUgPSBiZWZvcmVPdXRwdXQuY29kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG1vZGlmaWVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFyZW50RWxlbWVudE5vZGUgJiYgdC5pc0pTWEVsZW1lbnQocGFyZW50RWxlbWVudE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgcGFyZW50RWxlbWVudE5vZGUuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICAgICAgICBpZiAobmV3RnVsbFRleHQgJiYgbmV3RnVsbFRleHQudHJpbSgpICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VGV4dE5vZGUgPSB0LmpzeFRleHQobmV3RnVsbFRleHQpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50RWxlbWVudE5vZGUuY2hpbGRyZW4ucHVzaChuZXdUZXh0Tm9kZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIG1vZGlmaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFtb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoNDA5LCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0NvdWxkIG5vdCBhcHBseSBjaGFuZ2VzIHRvIEFTVC4nIH0pKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGFmdGVyQ29kZSA9ICcnO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50RWxlbWVudE5vZGUgJiYgdC5pc0pTWEVsZW1lbnQocGFyZW50RWxlbWVudE5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgYWZ0ZXJPdXRwdXQgPSBnZW5lcmF0ZUZ1bmN0aW9uKHBhcmVudEVsZW1lbnROb2RlLCB7fSk7XHJcbiAgICAgICAgICAgICAgYWZ0ZXJDb2RlID0gYWZ0ZXJPdXRwdXQuY29kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gZ2VuZXJhdGVGdW5jdGlvbihiYWJlbEFzdCwge30pO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdDb250ZW50ID0gb3V0cHV0LmNvZGU7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoYWJzb2x1dGVGaWxlUGF0aCwgbmV3Q29udGVudCwgJ3V0Zi04Jyk7IFxyXG4gICAgICAgICAgICB9IGNhdGNoICh3cml0ZUVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW3ZpdGVdW3Zpc3VhbC1lZGl0b3JdIEVycm9yIGR1cmluZyBkaXJlY3Qgd3JpdGUgZm9yICR7ZmlsZVBhdGh9OmAsIHdyaXRlRXJyb3IpO1xyXG4gICAgICAgICAgICAgIHRocm93IHdyaXRlRXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJlcy53cml0ZUhlYWQoMjAwLCB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsIFxyXG4gICAgICAgICAgICAgICAgbmV3RmlsZUNvbnRlbnQ6IG5ld0NvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVDb2RlLFxyXG4gICAgICAgICAgICAgICAgYWZ0ZXJDb2RlLFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCg1MDAsIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcclxuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yIGR1cmluZyBlZGl0IGFwcGxpY2F0aW9uLicgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59ICIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmVnZ2llXFxcXEhpcmx5My4wLUFscGhhLVxcXFxwcm9qZWN0XFxcXHBsdWdpbnNcXFxcdmlzdWFsLWVkaXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmVnZ2llXFxcXEhpcmx5My4wLUFscGhhLVxcXFxwcm9qZWN0XFxcXHBsdWdpbnNcXFxcdmlzdWFsLWVkaXRvclxcXFx2aXN1YWwtZWRpdG9yLWNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvUmVnZ2llL0hpcmx5My4wLUFscGhhLS9wcm9qZWN0L3BsdWdpbnMvdmlzdWFsLWVkaXRvci92aXN1YWwtZWRpdG9yLWNvbmZpZy5qc1wiO2V4cG9ydCBjb25zdCBQT1BVUF9TVFlMRVMgPSBgXHJcbiNpbmxpbmUtZWRpdG9yLXBvcHVwIHtcclxuICB3aWR0aDogMzYwcHg7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHotaW5kZXg6IDEwMDAwO1xyXG4gIGJhY2tncm91bmQ6ICMxNjE3MTg7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICM0YTU1Njg7XHJcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcclxuICBwYWRkaW5nOiA4cHg7XHJcbiAgYm94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDAsMCwwLDAuMik7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDEwcHg7XHJcbiAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XHJcbiAgI2lubGluZS1lZGl0b3ItcG9wdXAge1xyXG4gICAgd2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpO1xyXG4gIH1cclxufVxyXG5cclxuI2lubGluZS1lZGl0b3ItcG9wdXAuaXMtYWN0aXZlIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIHRvcDogNTAlO1xyXG4gIGxlZnQ6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxufVxyXG5cclxuI2lubGluZS1lZGl0b3ItcG9wdXAuaXMtZGlzYWJsZWQtdmlldyB7XHJcbiAgcGFkZGluZzogMTBweCAxNXB4O1xyXG59XHJcblxyXG4jaW5saW5lLWVkaXRvci1wb3B1cCB0ZXh0YXJlYSB7XHJcbiAgaGVpZ2h0OiAxMDBweDtcclxuICBwYWRkaW5nOiA0cHggOHB4O1xyXG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBmb250LWZhbWlseTogaW5oZXJpdDtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjQyO1xyXG4gIHJlc2l6ZTogbm9uZTtcclxuICBvdXRsaW5lOiBub25lO1xyXG59XHJcblxyXG4jaW5saW5lLWVkaXRvci1wb3B1cCAuYnV0dG9uLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xyXG4gIGdhcDogMTBweDtcclxufVxyXG5cclxuI2lubGluZS1lZGl0b3ItcG9wdXAgLnBvcHVwLWJ1dHRvbiB7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIHBhZGRpbmc6IDZweCAxNnB4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XHJcbiAgaGVpZ2h0OiAzNHB4O1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbn1cclxuXHJcbiNpbmxpbmUtZWRpdG9yLXBvcHVwIC5zYXZlLWJ1dHRvbiB7XHJcbiAgYmFja2dyb3VuZDogIzY3M2RlNjtcclxuICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbiNpbmxpbmUtZWRpdG9yLXBvcHVwIC5jYW5jZWwtYnV0dG9uIHtcclxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjM2IzZDRhO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuXHJcbiAgJjpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kOiM0NzQ5NTg7XHJcbiAgfVxyXG59XHJcbmA7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9wdXBIVE1MVGVtcGxhdGUoc2F2ZUxhYmVsLCBjYW5jZWxMYWJlbCkge1xyXG4gIHJldHVybiBgXHJcbiAgICA8dGV4dGFyZWE+PC90ZXh0YXJlYT5cclxuICAgIDxkaXYgY2xhc3M9XCJidXR0b24tY29udGFpbmVyXCI+XHJcbiAgICAgIDxidXR0b24gY2xhc3M9XCJwb3B1cC1idXR0b24gY2FuY2VsLWJ1dHRvblwiPiR7Y2FuY2VsTGFiZWx9PC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gY2xhc3M9XCJwb3B1cC1idXR0b24gc2F2ZS1idXR0b25cIj4ke3NhdmVMYWJlbH08L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIGA7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgRURJVF9NT0RFX1NUWUxFUyA9IGBcclxuICAjcm9vdFtkYXRhLWVkaXQtbW9kZS1lbmFibGVkPVwidHJ1ZVwiXSBbZGF0YS1lZGl0LWlkXSB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7IFxyXG4gICAgb3V0bGluZTogMXB4IGRhc2hlZCAjMzU3REY5OyBcclxuICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7XHJcbiAgICBtaW4taGVpZ2h0OiAxZW07XHJcbiAgfVxyXG4gICNyb290W2RhdGEtZWRpdC1tb2RlLWVuYWJsZWQ9XCJ0cnVlXCJdIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICB9XHJcbiAgI3Jvb3RbZGF0YS1lZGl0LW1vZGUtZW5hYmxlZD1cInRydWVcIl0gW2RhdGEtZWRpdC1pZF06aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzM1N0RGOTMzO1xyXG4gICAgb3V0bGluZS1jb2xvcjogIzM1N0RGOTsgXHJcbiAgfVxyXG5cclxuICBAa2V5ZnJhbWVzIGZhZGVJblRvb2x0aXAge1xyXG4gICAgZnJvbSB7XHJcbiAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSg1cHgpO1xyXG4gICAgfVxyXG4gICAgdG8ge1xyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAjaW5saW5lLWVkaXRvci1kaXNhYmxlZC10b29sdGlwIHtcclxuICAgIGRpc3BsYXk6IG5vbmU7IFxyXG4gICAgb3BhY2l0eTogMDsgXHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMUQxRTIwO1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gICAgcGFkZGluZzogNHB4IDhweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcclxuICAgIHotaW5kZXg6IDEwMDAxO1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzNCM0Q0QTtcclxuICAgIG1heC13aWR0aDogMTg0cHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgfVxyXG5cclxuICAjaW5saW5lLWVkaXRvci1kaXNhYmxlZC10b29sdGlwLnRvb2x0aXAtYWN0aXZlIHtcclxuICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgYW5pbWF0aW9uOiBmYWRlSW5Ub29sdGlwIDAuMnMgZWFzZS1vdXQgZm9yd2FyZHM7XHJcbiAgfVxyXG5gOyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmVnZ2llXFxcXEhpcmx5My4wLUFscGhhLVxcXFxwcm9qZWN0XFxcXHBsdWdpbnNcXFxcdmlzdWFsLWVkaXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmVnZ2llXFxcXEhpcmx5My4wLUFscGhhLVxcXFxwcm9qZWN0XFxcXHBsdWdpbnNcXFxcdmlzdWFsLWVkaXRvclxcXFx2aXRlLXBsdWdpbi1lZGl0LW1vZGUuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1JlZ2dpZS9IaXJseTMuMC1BbHBoYS0vcHJvamVjdC9wbHVnaW5zL3Zpc3VhbC1lZGl0b3Ivdml0ZS1wbHVnaW4tZWRpdC1tb2RlLmpzXCI7aW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xyXG5pbXBvcnQgeyBFRElUX01PREVfU1RZTEVTIH0gZnJvbSAnLi92aXN1YWwtZWRpdG9yLWNvbmZpZyc7XHJcblxyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSByZXNvbHZlKF9fZmlsZW5hbWUsICcuLicpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5saW5lRWRpdERldlBsdWdpbigpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZTogJ3ZpdGU6aW5saW5lLWVkaXQtZGV2JyxcclxuICAgIGFwcGx5OiAnc2VydmUnLFxyXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKCkge1xyXG4gICAgICBjb25zdCBzY3JpcHRQYXRoID0gcmVzb2x2ZShfX2Rpcm5hbWUsICdlZGl0LW1vZGUtc2NyaXB0LmpzJyk7XHJcbiAgICAgIGNvbnN0IHNjcmlwdENvbnRlbnQgPSByZWFkRmlsZVN5bmMoc2NyaXB0UGF0aCwgJ3V0Zi04Jyk7XHJcblxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXHJcbiAgICAgICAgICBhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG4gICAgICAgICAgY2hpbGRyZW46IHNjcmlwdENvbnRlbnQsXHJcbiAgICAgICAgICBpbmplY3RUbzogJ2JvZHknXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0YWc6ICdzdHlsZScsXHJcbiAgICAgICAgICBjaGlsZHJlbjogRURJVF9NT0RFX1NUWUxFUyxcclxuICAgICAgICAgIGluamVjdFRvOiAnaGVhZCdcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFJlZ2dpZVxcXFxIaXJseTMuMC1BbHBoYS1cXFxccHJvamVjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUmVnZ2llXFxcXEhpcmx5My4wLUFscGhhLVxcXFxwcm9qZWN0XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9SZWdnaWUvSGlybHkzLjAtQWxwaGEtL3Byb2plY3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgeyBjcmVhdGVMb2dnZXIsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nO1xyXG5sZXQgaW5saW5lRWRpdFBsdWdpbiwgZWRpdE1vZGVEZXZQbHVnaW47XHJcblxyXG5pZiAoaXNEZXYpIHtcclxuXHRpbmxpbmVFZGl0UGx1Z2luID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW5zL3Zpc3VhbC1lZGl0b3Ivdml0ZS1wbHVnaW4tcmVhY3QtaW5saW5lLWVkaXRvci5qcycpKS5kZWZhdWx0O1xyXG5cdGVkaXRNb2RlRGV2UGx1Z2luID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW5zL3Zpc3VhbC1lZGl0b3Ivdml0ZS1wbHVnaW4tZWRpdC1tb2RlLmpzJykpLmRlZmF1bHQ7XHJcbn1cclxuXHJcbmNvbnN0IGNvbmZpZ0hvcml6b25zVml0ZUVycm9ySGFuZGxlciA9IGBcclxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XHJcblx0Zm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMpIHtcclxuXHRcdGZvciAoY29uc3QgYWRkZWROb2RlIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpIHtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdGFkZGVkTm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiZcclxuXHRcdFx0XHQoXHJcblx0XHRcdFx0XHRhZGRlZE5vZGUudGFnTmFtZT8udG9Mb3dlckNhc2UoKSA9PT0gJ3ZpdGUtZXJyb3Itb3ZlcmxheScgfHxcclxuXHRcdFx0XHRcdGFkZGVkTm9kZS5jbGFzc0xpc3Q/LmNvbnRhaW5zKCdiYWNrZHJvcCcpXHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRoYW5kbGVWaXRlT3ZlcmxheShhZGRlZE5vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XHJcblx0Y2hpbGRMaXN0OiB0cnVlLFxyXG5cdHN1YnRyZWU6IHRydWVcclxufSk7XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVWaXRlT3ZlcmxheShub2RlKSB7XHJcblx0aWYgKCFub2RlLnNoYWRvd1Jvb3QpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGJhY2tkcm9wID0gbm9kZS5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJy5iYWNrZHJvcCcpO1xyXG5cclxuXHRpZiAoYmFja2Ryb3ApIHtcclxuXHRcdGNvbnN0IG92ZXJsYXlIdG1sID0gYmFja2Ryb3Aub3V0ZXJIVE1MO1xyXG5cdFx0Y29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0Y29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhvdmVybGF5SHRtbCwgJ3RleHQvaHRtbCcpO1xyXG5cdFx0Y29uc3QgbWVzc2FnZUJvZHlFbGVtZW50ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5tZXNzYWdlLWJvZHknKTtcclxuXHRcdGNvbnN0IGZpbGVFbGVtZW50ID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5maWxlJyk7XHJcblx0XHRjb25zdCBtZXNzYWdlVGV4dCA9IG1lc3NhZ2VCb2R5RWxlbWVudCA/IG1lc3NhZ2VCb2R5RWxlbWVudC50ZXh0Q29udGVudC50cmltKCkgOiAnJztcclxuXHRcdGNvbnN0IGZpbGVUZXh0ID0gZmlsZUVsZW1lbnQgPyBmaWxlRWxlbWVudC50ZXh0Q29udGVudC50cmltKCkgOiAnJztcclxuXHRcdGNvbnN0IGVycm9yID0gbWVzc2FnZVRleHQgKyAoZmlsZVRleHQgPyAnIEZpbGU6JyArIGZpbGVUZXh0IDogJycpO1xyXG5cclxuXHRcdHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0XHR0eXBlOiAnaG9yaXpvbnMtdml0ZS1lcnJvcicsXHJcblx0XHRcdGVycm9yLFxyXG5cdFx0fSwgJyonKTtcclxuXHR9XHJcbn1cclxuYDtcclxuXHJcbmNvbnN0IGNvbmZpZ0hvcml6b25zUnVudGltZUVycm9ySGFuZGxlciA9IGBcclxud2luZG93Lm9uZXJyb3IgPSAobWVzc2FnZSwgc291cmNlLCBsaW5lbm8sIGNvbG5vLCBlcnJvck9iaikgPT4ge1xyXG5cdGNvbnN0IGVycm9yRGV0YWlscyA9IGVycm9yT2JqID8gSlNPTi5zdHJpbmdpZnkoe1xyXG5cdFx0bmFtZTogZXJyb3JPYmoubmFtZSxcclxuXHRcdG1lc3NhZ2U6IGVycm9yT2JqLm1lc3NhZ2UsXHJcblx0XHRzdGFjazogZXJyb3JPYmouc3RhY2ssXHJcblx0XHRzb3VyY2UsXHJcblx0XHRsaW5lbm8sXHJcblx0XHRjb2xubyxcclxuXHR9KSA6IG51bGw7XHJcblxyXG5cdHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2Uoe1xyXG5cdFx0dHlwZTogJ2hvcml6b25zLXJ1bnRpbWUtZXJyb3InLFxyXG5cdFx0bWVzc2FnZSxcclxuXHRcdGVycm9yOiBlcnJvckRldGFpbHNcclxuXHR9LCAnKicpO1xyXG59O1xyXG5gO1xyXG5cclxuY29uc3QgY29uZmlnSG9yaXpvbnNDb25zb2xlRXJycm9IYW5kbGVyID0gYFxyXG5jb25zdCBvcmlnaW5hbENvbnNvbGVFcnJvciA9IGNvbnNvbGUuZXJyb3I7XHJcbmNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiguLi5hcmdzKSB7XHJcblx0b3JpZ2luYWxDb25zb2xlRXJyb3IuYXBwbHkoY29uc29sZSwgYXJncyk7XHJcblxyXG5cdGxldCBlcnJvclN0cmluZyA9ICcnO1xyXG5cclxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNvbnN0IGFyZyA9IGFyZ3NbaV07XHJcblx0XHRpZiAoYXJnIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuXHRcdFx0ZXJyb3JTdHJpbmcgPSBhcmcuc3RhY2sgfHwgXFxgXFwke2FyZy5uYW1lfTogXFwke2FyZy5tZXNzYWdlfVxcYDtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZiAoIWVycm9yU3RyaW5nKSB7XHJcblx0XHRlcnJvclN0cmluZyA9IGFyZ3MubWFwKGFyZyA9PiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KGFyZykgOiBTdHJpbmcoYXJnKSkuam9pbignICcpO1xyXG5cdH1cclxuXHJcblx0d2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7XHJcblx0XHR0eXBlOiAnaG9yaXpvbnMtY29uc29sZS1lcnJvcicsXHJcblx0XHRlcnJvcjogZXJyb3JTdHJpbmdcclxuXHR9LCAnKicpO1xyXG59O1xyXG5gO1xyXG5cclxuY29uc3QgY29uZmlnV2luZG93RmV0Y2hNb25rZXlQYXRjaCA9IGBcclxuY29uc3Qgb3JpZ2luYWxGZXRjaCA9IHdpbmRvdy5mZXRjaDtcclxuXHJcbndpbmRvdy5mZXRjaCA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcclxuXHRjb25zdCB1cmwgPSBhcmdzWzBdIGluc3RhbmNlb2YgUmVxdWVzdCA/IGFyZ3NbMF0udXJsIDogYXJnc1swXTtcclxuXHJcblx0Ly8gU2tpcCBXZWJTb2NrZXQgVVJMc1xyXG5cdGlmICh1cmwuc3RhcnRzV2l0aCgnd3M6JykgfHwgdXJsLnN0YXJ0c1dpdGgoJ3dzczonKSkge1xyXG5cdFx0cmV0dXJuIG9yaWdpbmFsRmV0Y2guYXBwbHkodGhpcywgYXJncyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gb3JpZ2luYWxGZXRjaC5hcHBseSh0aGlzLCBhcmdzKVxyXG5cdFx0LnRoZW4oYXN5bmMgcmVzcG9uc2UgPT4ge1xyXG5cdFx0XHRjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSB8fCAnJztcclxuXHJcblx0XHRcdC8vIEV4Y2x1ZGUgSFRNTCBkb2N1bWVudCByZXNwb25zZXNcclxuXHRcdFx0Y29uc3QgaXNEb2N1bWVudFJlc3BvbnNlID1cclxuXHRcdFx0XHRjb250ZW50VHlwZS5pbmNsdWRlcygndGV4dC9odG1sJykgfHxcclxuXHRcdFx0XHRjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24veGh0bWwreG1sJyk7XHJcblxyXG5cdFx0XHRpZiAoIXJlc3BvbnNlLm9rICYmICFpc0RvY3VtZW50UmVzcG9uc2UpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHJlc3BvbnNlQ2xvbmUgPSByZXNwb25zZS5jbG9uZSgpO1xyXG5cdFx0XHRcdFx0Y29uc3QgZXJyb3JGcm9tUmVzID0gYXdhaXQgcmVzcG9uc2VDbG9uZS50ZXh0KCk7XHJcblx0XHRcdFx0XHRjb25zdCByZXF1ZXN0VXJsID0gcmVzcG9uc2UudXJsO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcXGBGZXRjaCBlcnJvciBmcm9tIFxcJHtyZXF1ZXN0VXJsfTogXFwke2Vycm9yRnJvbVJlc31cXGApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2U7XHJcblx0XHR9KVxyXG5cdFx0LmNhdGNoKGVycm9yID0+IHtcclxuXHRcdFx0aWYgKCF1cmwubWF0Y2goL1xcLmh0bWw/JC9pKSkge1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aHJvdyBlcnJvcjtcclxuXHRcdH0pO1xyXG59O1xyXG5gO1xyXG5cclxuY29uc3QgYWRkVHJhbnNmb3JtSW5kZXhIdG1sID0ge1xyXG5cdG5hbWU6ICdhZGQtdHJhbnNmb3JtLWluZGV4LWh0bWwnLFxyXG5cdHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRodG1sLFxyXG5cdFx0XHR0YWdzOiBbXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGFnOiAnc2NyaXB0JyxcclxuXHRcdFx0XHRcdGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnIH0sXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogY29uZmlnSG9yaXpvbnNSdW50aW1lRXJyb3JIYW5kbGVyLFxyXG5cdFx0XHRcdFx0aW5qZWN0VG86ICdoZWFkJyxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRhZzogJ3NjcmlwdCcsXHJcblx0XHRcdFx0XHRhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IGNvbmZpZ0hvcml6b25zVml0ZUVycm9ySGFuZGxlcixcclxuXHRcdFx0XHRcdGluamVjdFRvOiAnaGVhZCcsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0YWc6ICdzY3JpcHQnLFxyXG5cdFx0XHRcdFx0YXR0cnM6IHt0eXBlOiAnbW9kdWxlJ30sXHJcblx0XHRcdFx0XHRjaGlsZHJlbjogY29uZmlnSG9yaXpvbnNDb25zb2xlRXJycm9IYW5kbGVyLFxyXG5cdFx0XHRcdFx0aW5qZWN0VG86ICdoZWFkJyxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRhZzogJ3NjcmlwdCcsXHJcblx0XHRcdFx0XHRhdHRyczogeyB0eXBlOiAnbW9kdWxlJyB9LFxyXG5cdFx0XHRcdFx0Y2hpbGRyZW46IGNvbmZpZ1dpbmRvd0ZldGNoTW9ua2V5UGF0Y2gsXHJcblx0XHRcdFx0XHRpbmplY3RUbzogJ2hlYWQnLFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdF0sXHJcblx0XHR9O1xyXG5cdH0sXHJcbn07XHJcblxyXG5jb25zb2xlLndhcm4gPSAoKSA9PiB7fTtcclxuXHJcbmNvbnN0IGxvZ2dlciA9IGNyZWF0ZUxvZ2dlcigpXHJcbmNvbnN0IGxvZ2dlckVycm9yID0gbG9nZ2VyLmVycm9yXHJcblxyXG5sb2dnZXIuZXJyb3IgPSAobXNnLCBvcHRpb25zKSA9PiB7XHJcblx0aWYgKG9wdGlvbnM/LmVycm9yPy50b1N0cmluZygpLmluY2x1ZGVzKCdDc3NTeW50YXhFcnJvcjogW3Bvc3Rjc3NdJykpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGxvZ2dlckVycm9yKG1zZywgb3B0aW9ucyk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcblx0Y3VzdG9tTG9nZ2VyOiBsb2dnZXIsXHJcblx0cGx1Z2luczogW1xyXG5cdFx0Li4uKGlzRGV2ID8gW2lubGluZUVkaXRQbHVnaW4oKSwgZWRpdE1vZGVEZXZQbHVnaW4oKV0gOiBbXSksXHJcblx0XHRyZWFjdCgpLFxyXG5cdFx0YWRkVHJhbnNmb3JtSW5kZXhIdG1sXHJcblx0XSxcclxuXHRzZXJ2ZXI6IHtcclxuXHRcdGNvcnM6IHRydWUsXHJcblx0XHRwcm94eToge1xyXG5cdFx0XHQnL2FwaSc6ICdodHRwOi8vbG9jYWxob3N0OjMwMDEnXHJcblx0XHR9LFxyXG5cdFx0aGVhZGVyczoge1xyXG5cdFx0XHQnQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeSc6ICdjcmVkZW50aWFsbGVzcycsXHJcblx0XHR9LFxyXG5cdFx0YWxsb3dlZEhvc3RzOiB0cnVlLFxyXG5cdH0sXHJcblx0cmVzb2x2ZToge1xyXG5cdFx0ZXh0ZW5zaW9uczogWycuanN4JywgJy5qcycsICcudHN4JywgJy50cycsICcuanNvbicsIF0sXHJcblx0XHRhbGlhczoge1xyXG5cdFx0XHQnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxyXG5cdFx0fSxcclxuXHR9LFxyXG5cdGJ1aWxkOiB7XHJcblx0XHRyb2xsdXBPcHRpb25zOiB7XHJcblx0XHRcdGV4dGVybmFsOiBbXHJcblx0XHRcdFx0J0BiYWJlbC9wYXJzZXInLFxyXG5cdFx0XHRcdCdAYmFiZWwvdHJhdmVyc2UnLFxyXG5cdFx0XHRcdCdAYmFiZWwvZ2VuZXJhdG9yJyxcclxuXHRcdFx0XHQnQGJhYmVsL3R5cGVzJ1xyXG5cdFx0XHRdXHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUErWixPQUFPLFVBQVU7QUFDaGIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxhQUFhO0FBQ3RCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sY0FBYztBQUNyQixZQUFZLE9BQU87QUFDbkIsT0FBTyxRQUFRO0FBT2YsU0FBUyxZQUFZLFFBQVE7QUFDM0IsUUFBTSxRQUFRLE9BQU8sTUFBTSxHQUFHO0FBRTlCLE1BQUksTUFBTSxTQUFTLEdBQUc7QUFDcEIsV0FBTztBQUFBLEVBQ1Q7QUFFQSxRQUFNLFNBQVMsU0FBUyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDeEMsUUFBTSxPQUFPLFNBQVMsTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ3RDLFFBQU0sV0FBVyxNQUFNLE1BQU0sR0FBRyxFQUFFLEVBQUUsS0FBSyxHQUFHO0FBRTVDLE1BQUksQ0FBQyxZQUFZLE1BQU0sSUFBSSxLQUFLLE1BQU0sTUFBTSxHQUFHO0FBQzdDLFdBQU87QUFBQSxFQUNUO0FBRUEsU0FBTyxFQUFFLFVBQVUsTUFBTSxPQUFPO0FBQ2xDO0FBRUEsU0FBUyxxQkFBcUIsb0JBQW9CLGtCQUFrQjtBQUNoRSxNQUFJLENBQUMsc0JBQXNCLENBQUMsbUJBQW1CO0FBQU0sV0FBTztBQUM1RCxRQUFNLFdBQVcsbUJBQW1CO0FBR3BDLE1BQUksU0FBUyxTQUFTLG1CQUFtQixpQkFBaUIsU0FBUyxTQUFTLElBQUksR0FBRztBQUMvRSxXQUFPO0FBQUEsRUFDWDtBQUdBLE1BQUksU0FBUyxTQUFTLHlCQUF5QixTQUFTLFlBQVksU0FBUyxTQUFTLFNBQVMsbUJBQW1CLGlCQUFpQixTQUFTLFNBQVMsU0FBUyxJQUFJLEdBQUc7QUFDakssV0FBTztBQUFBLEVBQ1g7QUFFQSxTQUFPO0FBQ1g7QUFFZSxTQUFSLG1CQUFvQztBQUN6QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFFVCxVQUFVLE1BQU0sSUFBSTtBQUNsQixVQUFJLENBQUMsZUFBZSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsV0FBVyxpQkFBaUIsS0FBSyxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQ2hHLGVBQU87QUFBQSxNQUNUO0FBRUEsWUFBTSxtQkFBbUIsS0FBSyxTQUFTLG1CQUFtQixFQUFFO0FBQzVELFlBQU0sc0JBQXNCLGlCQUFpQixNQUFNLEtBQUssR0FBRyxFQUFFLEtBQUssR0FBRztBQUVyRSxVQUFJO0FBQ0YsY0FBTSxXQUFXLE1BQU0sTUFBTTtBQUFBLFVBQzNCLFlBQVk7QUFBQSxVQUNaLFNBQVMsQ0FBQyxPQUFPLFlBQVk7QUFBQSxVQUM3QixlQUFlO0FBQUEsUUFDakIsQ0FBQztBQUVELFlBQUksa0JBQWtCO0FBRXRCLHNCQUFjLFFBQVEsVUFBVTtBQUFBLFVBQzlCLE1BQU1BLE9BQU07QUFDVixnQkFBSUEsTUFBSyxvQkFBb0IsR0FBRztBQUM5QixvQkFBTSxjQUFjQSxNQUFLO0FBQ3pCLG9CQUFNLGNBQWNBLE1BQUssV0FBVztBQUVwQyxrQkFBSSxDQUFDLFlBQVksS0FBSztBQUNwQjtBQUFBLGNBQ0Y7QUFFQSxvQkFBTSxlQUFlLFlBQVksV0FBVztBQUFBLGdCQUMxQyxDQUFDLFNBQVcsaUJBQWUsSUFBSSxLQUFLLEtBQUssS0FBSyxTQUFTO0FBQUEsY0FDekQ7QUFFQSxrQkFBSSxjQUFjO0FBQ2hCO0FBQUEsY0FDRjtBQUdBLG9CQUFNLDJCQUEyQixxQkFBcUIsYUFBYSxrQkFBa0I7QUFDckYsa0JBQUksQ0FBQywwQkFBMEI7QUFDN0I7QUFBQSxjQUNGO0FBRUEsa0JBQUksZ0NBQWdDO0FBR3BDLGtCQUFNLGVBQWEsV0FBVyxLQUFLLFlBQVksVUFBVTtBQUV2RCxzQkFBTSxpQkFBaUIsWUFBWSxXQUFXO0FBQUEsa0JBQUssVUFBVSx1QkFBcUIsSUFBSSxLQUNuRixLQUFLLFlBQ0gsZUFBYSxLQUFLLFFBQVEsS0FDNUIsS0FBSyxTQUFTLFNBQVM7QUFBQSxnQkFDMUI7QUFFQSxzQkFBTSxrQkFBa0IsWUFBWSxTQUFTO0FBQUEsa0JBQUssV0FDOUMsMkJBQXlCLEtBQUs7QUFBQSxnQkFDbEM7QUFFQSxvQkFBSSxtQkFBbUIsZ0JBQWdCO0FBQ3JDLGtEQUFnQztBQUFBLGdCQUNsQztBQUFBLGNBQ0Y7QUFFQSxrQkFBSSxDQUFDLGlDQUFtQyxlQUFhLFdBQVcsS0FBSyxZQUFZLFVBQVU7QUFDekYsc0JBQU0sc0JBQXNCLFlBQVksU0FBUyxLQUFLLFdBQVM7QUFDN0Qsc0JBQU0sZUFBYSxLQUFLLEdBQUc7QUFDekIsMkJBQU8scUJBQXFCLE1BQU0sZ0JBQWdCLGtCQUFrQjtBQUFBLGtCQUN0RTtBQUVBLHlCQUFPO0FBQUEsZ0JBQ1QsQ0FBQztBQUVELG9CQUFJLHFCQUFxQjtBQUN2QixrREFBZ0M7QUFBQSxnQkFDbEM7QUFBQSxjQUNGO0FBRUEsa0JBQUksK0JBQStCO0FBQ2pDLHNCQUFNLG9CQUFzQjtBQUFBLGtCQUN4QixnQkFBYyxvQkFBb0I7QUFBQSxrQkFDbEMsZ0JBQWMsTUFBTTtBQUFBLGdCQUN4QjtBQUVBLDRCQUFZLFdBQVcsS0FBSyxpQkFBaUI7QUFDN0M7QUFDQTtBQUFBLGNBQ0Y7QUFHQSxrQkFBTSxlQUFhLFdBQVcsS0FBSyxZQUFZLFlBQVksWUFBWSxTQUFTLFNBQVMsR0FBRztBQUN4RixvQkFBSSx5QkFBeUI7QUFDN0IsMkJBQVcsU0FBUyxZQUFZLFVBQVU7QUFDdEMsc0JBQU0sZUFBYSxLQUFLLEdBQUc7QUFDdkIsd0JBQUksQ0FBQyxxQkFBcUIsTUFBTSxnQkFBZ0Isa0JBQWtCLEdBQUc7QUFDakUsK0NBQXlCO0FBQ3pCO0FBQUEsb0JBQ0o7QUFBQSxrQkFDSjtBQUFBLGdCQUNKO0FBQ0Esb0JBQUksd0JBQXdCO0FBQ3hCLHdCQUFNLG9CQUFzQjtBQUFBLG9CQUN4QixnQkFBYyxvQkFBb0I7QUFBQSxvQkFDbEMsZ0JBQWMsTUFBTTtBQUFBLGtCQUN4QjtBQUNBLDhCQUFZLFdBQVcsS0FBSyxpQkFBaUI7QUFDN0M7QUFDQTtBQUFBLGdCQUNKO0FBQUEsY0FDSjtBQUdBLGtCQUFJLCtCQUErQkEsTUFBSyxXQUFXO0FBQ25ELHFCQUFPLDhCQUE4QjtBQUNqQyxzQkFBTSx5QkFBeUIsNkJBQTZCLGFBQWEsSUFDbkUsK0JBQ0EsNkJBQTZCLFdBQVcsT0FBSyxFQUFFLGFBQWEsQ0FBQztBQUVuRSxvQkFBSSxDQUFDLHdCQUF3QjtBQUN6QjtBQUFBLGdCQUNKO0FBRUEsb0JBQUkscUJBQXFCLHVCQUF1QixLQUFLLGdCQUFnQixrQkFBa0IsR0FBRztBQUN0RjtBQUFBLGdCQUNKO0FBQ0EsK0NBQStCLHVCQUF1QjtBQUFBLGNBQzFEO0FBRUEsb0JBQU0sT0FBTyxZQUFZLElBQUksTUFBTTtBQUNuQyxvQkFBTSxTQUFTLFlBQVksSUFBSSxNQUFNLFNBQVM7QUFDOUMsb0JBQU0sU0FBUyxHQUFHLG1CQUFtQixJQUFJLElBQUksSUFBSSxNQUFNO0FBRXZELG9CQUFNLGNBQWdCO0FBQUEsZ0JBQ2xCLGdCQUFjLGNBQWM7QUFBQSxnQkFDNUIsZ0JBQWMsTUFBTTtBQUFBLGNBQ3hCO0FBRUEsMEJBQVksV0FBVyxLQUFLLFdBQVc7QUFDdkM7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQztBQUVELFlBQUksa0JBQWtCLEdBQUc7QUFDdkIsZ0JBQU0sbUJBQW1CLFNBQVMsV0FBVztBQUM3QyxnQkFBTSxTQUFTLGlCQUFpQixVQUFVO0FBQUEsWUFDeEMsWUFBWTtBQUFBLFlBQ1osZ0JBQWdCO0FBQUEsVUFDbEIsR0FBRyxJQUFJO0FBRVAsaUJBQU8sRUFBRSxNQUFNLE9BQU8sTUFBTSxLQUFLLE9BQU8sSUFBSTtBQUFBLFFBQzlDO0FBRUEsZUFBTztBQUFBLE1BQ1QsU0FBUyxPQUFPO0FBQ2QsZ0JBQVEsTUFBTSw0Q0FBNEMsRUFBRSxLQUFLLEtBQUs7QUFDdEUsZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUlBLGdCQUFnQixRQUFRO0FBQ3RCLGFBQU8sWUFBWSxJQUFJLG1CQUFtQixPQUFPLEtBQUssS0FBSyxTQUFTO0FBQ2xFLFlBQUksSUFBSSxXQUFXO0FBQVEsaUJBQU8sS0FBSztBQUV2QyxZQUFJLE9BQU87QUFDWCxZQUFJLEdBQUcsUUFBUSxXQUFTO0FBQUUsa0JBQVEsTUFBTSxTQUFTO0FBQUEsUUFBRyxDQUFDO0FBRXJELFlBQUksR0FBRyxPQUFPLFlBQVk7QUEzTmxDO0FBNE5VLGNBQUksbUJBQW1CO0FBQ3ZCLGNBQUk7QUFDRixrQkFBTSxFQUFFLFFBQVEsWUFBWSxJQUFJLEtBQUssTUFBTSxJQUFJO0FBRS9DLGdCQUFJLENBQUMsVUFBVSxPQUFPLGdCQUFnQixhQUFhO0FBQ2pELGtCQUFJLFVBQVUsS0FBSyxFQUFFLGdCQUFnQixtQkFBbUIsQ0FBQztBQUN6RCxxQkFBTyxJQUFJLElBQUksS0FBSyxVQUFVLEVBQUUsT0FBTyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQUEsWUFDM0U7QUFFQSxrQkFBTSxXQUFXLFlBQVksTUFBTTtBQUNuQyxnQkFBSSxDQUFDLFVBQVU7QUFDYixrQkFBSSxVQUFVLEtBQUssRUFBRSxnQkFBZ0IsbUJBQW1CLENBQUM7QUFDekQscUJBQU8sSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLE9BQU8sK0NBQStDLENBQUMsQ0FBQztBQUFBLFlBQzFGO0FBRUEsa0JBQU0sRUFBRSxVQUFVLE1BQU0sT0FBTyxJQUFJO0FBRW5DLCtCQUFtQixLQUFLLFFBQVEsbUJBQW1CLFFBQVE7QUFDM0QsZ0JBQUksU0FBUyxTQUFTLElBQUksS0FBSyxDQUFDLGlCQUFpQixXQUFXLGlCQUFpQixLQUFLLGlCQUFpQixTQUFTLGNBQWMsR0FBRztBQUMzSCxrQkFBSSxVQUFVLEtBQUssRUFBRSxnQkFBZ0IsbUJBQW1CLENBQUM7QUFDekQscUJBQU8sSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLE9BQU8sZUFBZSxDQUFDLENBQUM7QUFBQSxZQUMxRDtBQUVBLGtCQUFNLGtCQUFrQixHQUFHLGFBQWEsa0JBQWtCLE9BQU87QUFFakUsa0JBQU0sV0FBVyxNQUFNLGlCQUFpQjtBQUFBLGNBQ3RDLFlBQVk7QUFBQSxjQUNaLFNBQVMsQ0FBQyxPQUFPLFlBQVk7QUFBQSxjQUM3QixlQUFlO0FBQUEsWUFDakIsQ0FBQztBQUVELGdCQUFJLGlCQUFpQjtBQUNyQixrQkFBTSxVQUFVO0FBQUEsY0FDZCxrQkFBa0JBLE9BQU07QUFDdEIsc0JBQU0sT0FBT0EsTUFBSztBQUNsQixvQkFBSSxLQUFLLE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxRQUFRLEtBQUssSUFBSSxNQUFNLFNBQVMsTUFBTSxRQUFRO0FBQ3BGLG1DQUFpQkE7QUFDakIsa0JBQUFBLE1BQUssS0FBSztBQUFBLGdCQUNaO0FBQUEsY0FDRjtBQUFBLFlBQ0Y7QUFDQSwwQkFBYyxRQUFRLFVBQVUsT0FBTztBQUV2QyxnQkFBSSxDQUFDLGdCQUFnQjtBQUNuQixrQkFBSSxVQUFVLEtBQUssRUFBRSxnQkFBZ0IsbUJBQW1CLENBQUM7QUFDekQscUJBQU8sSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLE9BQU8sd0NBQXdDLE9BQU8sQ0FBQyxDQUFDO0FBQUEsWUFDMUY7QUFFQSxrQkFBTSxtQkFBbUIsU0FBUyxXQUFXO0FBQzdDLGtCQUFNLHFCQUFvQixvQkFBZSxlQUFmLG1CQUEyQjtBQUNyRCxnQkFBSSxhQUFhO0FBRWpCLGdCQUFJLHFCQUF1QixlQUFhLGlCQUFpQixHQUFHO0FBQzFELG9CQUFNLGVBQWUsaUJBQWlCLG1CQUFtQixDQUFDLENBQUM7QUFDM0QsMkJBQWEsYUFBYTtBQUFBLFlBQzVCO0FBRUEsZ0JBQUksV0FBVztBQUVmLGdCQUFJLHFCQUF1QixlQUFhLGlCQUFpQixHQUFHO0FBQzFELGdDQUFrQixXQUFXLENBQUM7QUFDOUIsa0JBQUksZUFBZSxZQUFZLEtBQUssTUFBTSxJQUFJO0FBQzVDLHNCQUFNLGNBQWdCLFVBQVEsV0FBVztBQUN6QyxrQ0FBa0IsU0FBUyxLQUFLLFdBQVc7QUFBQSxjQUM3QztBQUNBLHlCQUFXO0FBQUEsWUFDYjtBQUVBLGdCQUFJLENBQUMsVUFBVTtBQUNiLGtCQUFJLFVBQVUsS0FBSyxFQUFFLGdCQUFnQixtQkFBbUIsQ0FBQztBQUN6RCxxQkFBTyxJQUFJLElBQUksS0FBSyxVQUFVLEVBQUUsT0FBTyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQUEsWUFDN0U7QUFFQSxnQkFBSSxZQUFZO0FBQ2hCLGdCQUFJLHFCQUF1QixlQUFhLGlCQUFpQixHQUFHO0FBQzFELG9CQUFNLGNBQWMsaUJBQWlCLG1CQUFtQixDQUFDLENBQUM7QUFDMUQsMEJBQVksWUFBWTtBQUFBLFlBQzFCO0FBRUEsa0JBQU0sU0FBUyxpQkFBaUIsVUFBVSxDQUFDLENBQUM7QUFDNUMsa0JBQU0sYUFBYSxPQUFPO0FBRTFCLGdCQUFJO0FBQ0YsaUJBQUcsY0FBYyxrQkFBa0IsWUFBWSxPQUFPO0FBQUEsWUFDeEQsU0FBUyxZQUFZO0FBQ25CLHNCQUFRLE1BQU0sdURBQXVELFFBQVEsS0FBSyxVQUFVO0FBQzVGLG9CQUFNO0FBQUEsWUFDUjtBQUVBLGdCQUFJLFVBQVUsS0FBSyxFQUFFLGdCQUFnQixtQkFBbUIsQ0FBQztBQUN6RCxnQkFBSSxJQUFJLEtBQUssVUFBVTtBQUFBLGNBQ25CLFNBQVM7QUFBQSxjQUNULGdCQUFnQjtBQUFBLGNBQ2hCO0FBQUEsY0FDQTtBQUFBLFlBQ0osQ0FBQyxDQUFDO0FBQUEsVUFFSixTQUFTLE9BQU87QUFDZCxnQkFBSSxVQUFVLEtBQUssRUFBRSxnQkFBZ0IsbUJBQW1CLENBQUM7QUFDekQsZ0JBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPLGlEQUFpRCxDQUFDLENBQUM7QUFBQSxVQUNyRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0gsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQ0Y7QUFyVUEsSUFBeVEsMENBUW5RLFlBQ0FDLFlBQ0EsbUJBQ0E7QUFYTjtBQUFBO0FBQW1RLElBQU0sMkNBQTJDO0FBUXBULElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU1BLGFBQVksS0FBSyxRQUFRLFVBQVU7QUFDekMsSUFBTSxvQkFBb0IsS0FBSyxRQUFRQSxZQUFXLE9BQU87QUFDekQsSUFBTSxxQkFBcUIsQ0FBQyxLQUFLLFVBQVUsVUFBVSxLQUFLLFFBQVEsTUFBTSxNQUFNLE1BQU0sSUFBSTtBQUFBO0FBQUE7OztBQ1h4RixJQXdGYTtBQXhGYjtBQUFBO0FBd0ZPLElBQU0sbUJBQW1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7O0FDeEZoQztBQUFBO0FBQUE7QUFBQTtBQUEyWSxTQUFTLG9CQUFvQjtBQUN4YSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxpQkFBQUMsc0JBQXFCO0FBTWYsU0FBUixzQkFBdUM7QUFDNUMsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AscUJBQXFCO0FBQ25CLFlBQU0sYUFBYSxRQUFRQyxZQUFXLHFCQUFxQjtBQUMzRCxZQUFNLGdCQUFnQixhQUFhLFlBQVksT0FBTztBQUV0RCxhQUFPO0FBQUEsUUFDTDtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsT0FBTyxFQUFFLE1BQU0sU0FBUztBQUFBLFVBQ3hCLFVBQVU7QUFBQSxVQUNWLFVBQVU7QUFBQSxRQUNaO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1o7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQS9CQSxJQUErUEMsMkNBS3pQQyxhQUNBRjtBQU5OO0FBQUE7QUFHQTtBQUh5UCxJQUFNQyw0Q0FBMkM7QUFLMVMsSUFBTUMsY0FBYUgsZUFBY0UseUNBQWU7QUFDaEQsSUFBTUQsYUFBWSxRQUFRRSxhQUFZLElBQUk7QUFBQTtBQUFBOzs7QUNOdVEsT0FBT0MsV0FBVTtBQUNsVSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxjQUFjLG9CQUFvQjtBQUYzQyxJQUFNLG1DQUFtQztBQUl6QyxJQUFNLFFBQVEsUUFBUSxJQUFJLGFBQWE7QUFDdkMsSUFBSUM7QUFBSixJQUFzQjtBQUV0QixJQUFJLE9BQU87QUFDVixFQUFBQSxxQkFBb0IsTUFBTSxpSEFBc0U7QUFDaEcsdUJBQXFCLE1BQU0sNkZBQTREO0FBQ3hGO0FBRUEsSUFBTSxpQ0FBaUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUErQ3ZDLElBQU0sb0NBQW9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW1CMUMsSUFBTSxvQ0FBb0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQjFDLElBQU0sK0JBQStCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF1Q3JDLElBQU0sd0JBQXdCO0FBQUEsRUFDN0IsTUFBTTtBQUFBLEVBQ04sbUJBQW1CLE1BQU07QUFDeEIsV0FBTztBQUFBLE1BQ047QUFBQSxNQUNBLE1BQU07QUFBQSxRQUNMO0FBQUEsVUFDQyxLQUFLO0FBQUEsVUFDTCxPQUFPLEVBQUUsTUFBTSxTQUFTO0FBQUEsVUFDeEIsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1g7QUFBQSxRQUNBO0FBQUEsVUFDQyxLQUFLO0FBQUEsVUFDTCxPQUFPLEVBQUUsTUFBTSxTQUFTO0FBQUEsVUFDeEIsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1g7QUFBQSxRQUNBO0FBQUEsVUFDQyxLQUFLO0FBQUEsVUFDTCxPQUFPLEVBQUMsTUFBTSxTQUFRO0FBQUEsVUFDdEIsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1g7QUFBQSxRQUNBO0FBQUEsVUFDQyxLQUFLO0FBQUEsVUFDTCxPQUFPLEVBQUUsTUFBTSxTQUFTO0FBQUEsVUFDeEIsVUFBVTtBQUFBLFVBQ1YsVUFBVTtBQUFBLFFBQ1g7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRDtBQUVBLFFBQVEsT0FBTyxNQUFNO0FBQUM7QUFFdEIsSUFBTSxTQUFTLGFBQWE7QUFDNUIsSUFBTSxjQUFjLE9BQU87QUFFM0IsT0FBTyxRQUFRLENBQUMsS0FBSyxZQUFZO0FBdkxqQztBQXdMQyxPQUFJLHdDQUFTLFVBQVQsbUJBQWdCLFdBQVcsU0FBUyw4QkFBOEI7QUFDckU7QUFBQSxFQUNEO0FBRUEsY0FBWSxLQUFLLE9BQU87QUFDekI7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixjQUFjO0FBQUEsRUFDZCxTQUFTO0FBQUEsSUFDUixHQUFJLFFBQVEsQ0FBQ0Esa0JBQWlCLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDO0FBQUEsSUFDekQsTUFBTTtBQUFBLElBQ047QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTixRQUFRO0FBQUEsSUFDVDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsZ0NBQWdDO0FBQUEsSUFDakM7QUFBQSxJQUNBLGNBQWM7QUFBQSxFQUNmO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixZQUFZLENBQUMsUUFBUSxPQUFPLFFBQVEsT0FBTyxPQUFTO0FBQUEsSUFDcEQsT0FBTztBQUFBLE1BQ04sS0FBS0MsTUFBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUNyQztBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNOLGVBQWU7QUFBQSxNQUNkLFVBQVU7QUFBQSxRQUNUO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCIsICJfX2Rpcm5hbWUiLCAiZmlsZVVSTFRvUGF0aCIsICJfX2Rpcm5hbWUiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJfX2ZpbGVuYW1lIiwgInBhdGgiLCAiaW5saW5lRWRpdFBsdWdpbiIsICJwYXRoIl0KfQo=
