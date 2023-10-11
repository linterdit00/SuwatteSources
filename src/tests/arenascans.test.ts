import emulate from "@suwatte/emulator";
import { Target } from "../runners/arenascans";
import {
  ChapterDataSchema,
  ChapterSchema,
  ContentSchema,
  PagedResultSchema,
} from "@suwatte/validate";
describe("Arena Scans Tests", () => {
  const source = emulate(Target);

  describe("Template Test", () => {
    test("Popular", async () => {
      const data = await source.getDirectory({
        page: 1,
        sort: { id: "popular" },
      });
      expect(PagedResultSchema.parse(data)).toEqual(expect.any(Object));
      expect(data.results.length).toBeGreaterThan(1);
    });
    test("Query", async () => {
      const data = await source.getDirectory({
        page: 1,
        query: "emperor",
      });
      expect(PagedResultSchema.parse(data)).toEqual(expect.any(Object));
      expect(data.results.length).toBeGreaterThan(1);
    });
    test("Latest", async () => {
      const data = await source.getDirectory({
        page: 1,
        sort: { id: "latest" },
      });
      expect(PagedResultSchema.parse(data)).toEqual(expect.any(Object));
      expect(data.results.length).toBeGreaterThan(1);
    });
  });

  describe("Single Profile", () => {
    const id = "/manga/i-will-fall-with-the-emperor/";

    test("Details", async () => {
      const content = await source.getContent(id);
      expect(ContentSchema.parse(content)).toEqual(expect.any(Object));
    });

    test("Chapters", async () => {
      const chapters = await source.getChapters(id);
      expect(ChapterSchema.array().parse(chapters)).toEqual(expect.any(Array));
    });
  });
  test("Reader", async () => {
    const contentId = "/manga/i-will-fall-with-the-emperor/";
    const chapterId = "/5359466655-i-will-fall-with-the-emperor-45/";
    const data = await source.getChapterData(contentId, chapterId);
    expect(ChapterDataSchema.parse(data)).toEqual(expect.any(Object));
  });
});
