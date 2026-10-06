import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync(new URL("./YouTubeOptInPlayer.tsx", import.meta.url), "utf8");
const resourcesPage = readFileSync(new URL("../pages/ResourcesPromptsPage.tsx", import.meta.url), "utf8");

test("YouTube player waits for an explicit per-video action and unloads on close", () => {
  assert.match(component, /useState\(false\)/);
  assert.match(component, /Playing loads YouTube and may set cookies\./);
  assert.match(component, /Load and play video/);
  assert.match(component, /onClick=\{\(\) => setIsLoaded\(true\)\}/);
  assert.match(component, /youtube-nocookie\.com\/embed\/\$\{encodeURIComponent\(youtubeId\)\}/);
  assert.match(component, /onClick=\{\(\) => setIsLoaded\(false\)\}/);
  assert.match(component, /Close and unload \$\{title\} video/);
  assert.doesNotMatch(component, /i\.ytimg\.com|youtube\.com\/embed|preconnect/);
});

test("both resources video collections use the opt-in player and retain outbound links and downloads", () => {
  assert.equal((resourcesPage.match(/<YouTubeOptInPlayer/g) ?? []).length, 2);
  assert.doesNotMatch(resourcesPage, /<iframe/);
  assert.match(resourcesPage, /Watch on YouTube/);
  assert.match(resourcesPage, /download-science-\$\{video\.id\}/);
});
