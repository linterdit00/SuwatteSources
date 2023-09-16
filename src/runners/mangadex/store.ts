import { getURLSuffixFor } from "./utils";
export const PREF_KEYS = {
  lang: "_lang",
  dataSaver: "_data_saver",
  coverQuality: "_cover_quality",
  exploreCR: "_explore_content_rating",
  showSeasonal: "_show_seasonal",
  mimasEnabled: "_mimas_enabled",
  mimasLimit: "_mimas_limit",
  mimasTargets: "_mimas_targets",
};
export class MDStore {
  private store = ObjectStore;

  async getSeasonal() {
    const value = await this.store.boolean(PREF_KEYS.showSeasonal);
    if (!value) return true;
    return !!value;
  }
  async setSeasonal(v: boolean) {
    return this.store.set(PREF_KEYS.showSeasonal, v);
  }
  async getContentRatings(): Promise<string[]> {
    const DEFAULT = ["safe", "suggestive", "erotica"];
    const ratings = await this.store.stringArray(PREF_KEYS.exploreCR);

    if (!ratings) return DEFAULT;
    return ratings;
  }

  async setContentRatings(v: string[]) {
    return this.store.set(PREF_KEYS.exploreCR, v);
  }
  async getDSMode(): Promise<boolean> {
    const value = await this.store.boolean(PREF_KEYS.dataSaver);
    return !!value;
  }

  async setDSMode(v: boolean) {
    return this.store.set(PREF_KEYS.dataSaver, v);
  }

  async getCQ() {
    const value = await this.store.string(PREF_KEYS.coverQuality);
    if (!value) return "medium";

    return value;
  }
  async getCoverQuality() {
    const value = await this.store.string(PREF_KEYS.coverQuality);
    if (!value) return getURLSuffixFor("medium");

    return getURLSuffixFor(value);
  }

  async setCoverQuality(v: string) {
    return this.store.set(PREF_KEYS.coverQuality, v);
  }

  async getLanguages(): Promise<string[]> {
    const DEFAULT = ["en"];
    const value = await this.store.stringArray(PREF_KEYS.lang);
    if (!value) return DEFAULT;
    return value;
  }

  async setLanguages(value: string[]) {
    return this.store.set(PREF_KEYS.lang, value);
  }

  // Recommendations
  async getMimasEnabled() {
    const value = await this.store.boolean(PREF_KEYS.mimasEnabled);
    return !!value;
  }

  async setMimasEnabled(v: boolean) {
    return this.store.set(PREF_KEYS.mimasEnabled, v);
  }
  async getMimasTargets(): Promise<string[]> {
    const value = await this.store.stringArray(PREF_KEYS.mimasTargets);
    if (!value) return [];
    return value;
  }

  async getMimasLimit() {
    const value = await this.store.number(PREF_KEYS.mimasLimit);

    if (!value) return 5;
    return value;
  }

  async setMimasLimit(v: number) {
    return this.store.set(PREF_KEYS.mimasLimit, v);
  }

  async saveToMimasTargets(id: string) {
    const limit = await this.getMimasLimit();
    const targets = await this.getMimasTargets();
    targets.push(id);
    const newTargets = Array.from(new Set(targets))
      .filter((v) => !!v.trim())
      .slice(-limit);
    await this.store.set(PREF_KEYS.mimasTargets, newTargets);
  }

  async clearMimasTargets() {
    await this.store.remove(PREF_KEYS.mimasTargets);
  }
}
