import { defineStore } from "pinia";
import PocketBase, { RecordAuthResponse } from "pocketbase";

export interface IDBStore {
  client: PocketBase | null;
  userData: RecordAuthResponse | undefined;
}

export const usePBStore = defineStore("pbStore", {
  state: () =>
    ({
      client: null,
      userData: undefined
    } as IDBStore),
  getters: {
    signedIn: (state): boolean => state.client?.authStore.isValid || false,
  },
  actions: {
    async init() {

      const client = new PocketBase(process.env.POCKETBASE_URL);
      this.client = client;

      client.authStore.onChange(() => {
        console.log("Auth Store Change");
        console.log(client.authStore.model);
      });
    },
    async createDocument() {
      const data = {
        foo: "baar",
      };
      const record = await this.client?.collection("demo").create(data);
    },
  },
});
