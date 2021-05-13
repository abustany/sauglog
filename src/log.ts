import { openDB } from 'idb'
import { onMounted, Ref, ref } from 'vue'

export enum Side {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum Position {
  CRADLE = 'CRADLE',
  CLUTCH = 'CLUTCH',
  LYING = 'LYING',
}

export interface Entry {
  startTimestamp: number;
  endTimestamp: number;
  side: Side;
  position?: Position;
}

export type AddEntry = (e: Entry) => Promise<void>

export interface EntryList {
  entries: Entry[];
  loading: boolean;
  error?: string;
}

const SCHEMA_VERSION = 1;

async function initDB() {
  const db = await openDB('log', SCHEMA_VERSION, {
    upgrade(database, _oldVersion, _newVersion, _transaction) {
      const objectStore = database.createObjectStore('log', { autoIncrement: true })
      objectStore.createIndex('startTimestamp', 'startTimestamp', { unique: false })
    }
  })

  return db
}

export default function useLog() {
  const entries: Ref<EntryList> = ref({ entries: [], loading: false });

  const db = initDB()

  const loadEntries = async () => {
    console.log('Reloading log entries')

    entries.value.loading = true

    try {
      let cursor = await (await db).transaction('log').store.index('startTimestamp').openCursor(null, 'prev')
      const res: Entry[] = []

      while (cursor) {
        res.push(cursor.value)
        cursor = await cursor.continue()
      }

      entries.value.entries = res

      console.log(`Loaded ${entries.value.entries.length} entries`)
    } catch (e) {
      entries.value.entries = []
      entries.value.error = `error loading entries: ${e}`
    } finally {
      entries.value.loading = false
    }
  }

  const addEntry: AddEntry = async (entry: Entry) => {
    await (await db).put('log', entry)
    loadEntries()
  }

  onMounted(loadEntries)

  return {
    addEntry,
    entries
  }
}
