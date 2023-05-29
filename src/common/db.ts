import { IDBPDatabase, openDB, DBSchema } from 'idb/with-async-ittr';

export type CollapseType = 'collapse' | 'expand' | 'nothing';

type StoreItemKey = 'startUpCollapse';

interface StoreItem {
  readonly name: StoreItemKey;
  value: string;
}

interface StoreDB extends DBSchema {
  store: {
    key: string;
    value: StoreItem;
  };
}

abstract class BasicDB<T extends DBSchema> {
  protected name: string;
  protected version?: number;
  protected db: IDBPDatabase<T> | null;

  constructor(name: string, version?: number) {
    this.name = name;
    this.version = version;
    this.db = null;
  }
}

export class UserStoreDB extends BasicDB<StoreDB> {
  constructor(name = 'UserStore', version?: number) {
    super(name, version);
  }

  async init(): Promise<UserStoreDB> {
    this.db = await openDB<StoreDB>(this.name, this.version, {
      upgrade(db) {
        db.createObjectStore('store', { keyPath: 'name' });
      },
    });
    return this;
  }

  async readStore(): Promise<StoreItem[]> {
    if (this.db) {
      return await this.db.getAll('store');
    }
    return [];
  }

  async getStoreItemValue(name: StoreItemKey): Promise<string | undefined> {
    if (this.db) {
      const data = await this.db.get('store', name);
      return data?.value;
    }
    return undefined;
  }

  async setStoreItemValue(name: StoreItemKey, value: string): Promise<void> {
    if (this.db) {
      this.db.put('store', {
        name,
        value,
      });
    }
  }
}

function toCollapseType(value?: string): CollapseType {
  switch (value) {
    case 'collapse':
      return 'collapse';
    case 'expand':
      return 'expand';
    default:
      return 'nothing';
  }
}

export async function getCollapse(): Promise<CollapseType> {
  const db = await new UserStoreDB().init();
  const suc = await db.getStoreItemValue('startUpCollapse');
  return toCollapseType(suc);
}

export async function setCollapse(value: string): Promise<CollapseType> {
  const db = await new UserStoreDB().init();
  const val = toCollapseType(value);
  await db.setStoreItemValue('startUpCollapse', val);
  return val;
}
