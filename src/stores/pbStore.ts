import { defineStore } from "pinia";
import PocketBase, { RecordAuthResponse, Record, Admin } from "pocketbase";

export interface IDBStore {
  client: PocketBase | null;
  userData: RecordAuthResponse | undefined;
  currentUser: Record | Admin | null;
}

export const usePBStore = defineStore("pbStore", {
  state: () =>
    ({
      client: null,
      currentUser: null
    } as IDBStore),
  getters: {
  },
  actions: {
    async init() {
      const client = new PocketBase(process.env.POCKETBASE_URL);
      this.client = client;

      client.authStore.onChange(() => {
        this.currentUser = client.authStore.model;
      }, true);
    },
    async logout() {
      this.client?.authStore.clear();
    },
    async createDocument() {
      const data = {
        foo: "bar",
      };
      const record = await this.client?.collection("demo").create(data);
    },
  },
});
