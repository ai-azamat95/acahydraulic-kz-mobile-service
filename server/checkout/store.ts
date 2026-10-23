import { createRequire } from "node:module";
// Vite 5 (used by Vitest 2) predates node:sqlite; load the native module through Node.
const { DatabaseSync } = createRequire(import.meta.url)(
  "node:sqlite"
) as typeof import("node:sqlite");
import { chmodSync } from "node:fs";
import { createHash, timingSafeEqual } from "node:crypto";
import type {
  EpaySession,
  OrderConfirmation,
  OrderRequest,
  OrderStatus,
} from "../../shared/checkout";
import { CheckoutError } from "./errors";

export type StoredOrder = {
  id: string;
  request: OrderRequest;
  requestHash: string;
  accessHash: string;
  status: OrderStatus;
  createdAt: string;
  confirmation?: OrderConfirmation;
  attempt?: {
    invoiceId: string;
    secretHash: string;
    terminalId: string;
    session?: EpaySession;
    transactionId?: string;
  };
};
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function secretEquals(a: string, b: string) {
  return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b)));
}

/** Sandbox single-host storage. All mutations are synchronous SQLite transactions.
 * Never substitute an in-memory Map in a deployed payment service. */
export class OrderStore {
  private db: InstanceType<typeof DatabaseSync>;
  constructor(filename: string) {
    this.db = new DatabaseSync(filename);
    if (filename !== ":memory:") chmodSync(filename, 0o600);
    this.db.exec(`PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, access_hash TEXT UNIQUE NOT NULL, data TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS invoices (number INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT UNIQUE NOT NULL);
      CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, order_id TEXT NOT NULL, action TEXT NOT NULL, actor TEXT NOT NULL, at TEXT NOT NULL);`);
  }
  close() {
    this.db.close();
  }
  get(id: string): StoredOrder {
    const row = this.db
      .prepare("SELECT data FROM orders WHERE id = ?")
      .get(id) as { data: string } | undefined;
    if (!row) throw new CheckoutError("ORDER_NOT_FOUND", 404);
    return JSON.parse(row.data);
  }
  findByAccessHash(accessHash: string): StoredOrder | undefined {
    const row = this.db
      .prepare("SELECT data FROM orders WHERE access_hash = ?")
      .get(accessHash) as { data: string } | undefined;
    return row ? JSON.parse(row.data) : undefined;
  }
  findByInvoice(invoiceId: string): StoredOrder | undefined {
    const number = Number(invoiceId) - 100000;
    const row = this.db
      .prepare("SELECT order_id FROM invoices WHERE number = ?")
      .get(number) as { order_id: string } | undefined;
    if (!row) return undefined;
    const order = this.get(row.order_id);
    return order.attempt?.invoiceId === invoiceId ? order : undefined;
  }
  list(): StoredOrder[] {
    return (
      this.db
        .prepare("SELECT data FROM orders ORDER BY rowid DESC LIMIT 100")
        .all() as { data: string }[]
    ).map(row => JSON.parse(row.data));
  }
  insert(order: StoredOrder) {
    this.db
      .prepare("INSERT INTO orders (id, access_hash, data) VALUES (?, ?, ?)")
      .run(order.id, order.accessHash, JSON.stringify(order));
  }
  save(order: StoredOrder) {
    this.db
      .prepare("UPDATE orders SET data = ? WHERE id = ?")
      .run(JSON.stringify(order), order.id);
  }
  transaction<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  allocateInvoice(orderId: string) {
    const result = this.db
      .prepare("INSERT INTO invoices (order_id) VALUES (?)")
      .run(orderId);
    // Exactly six digits: suffix uniqueness follows from the durable sequence.
    const number = Number(result.lastInsertRowid);
    if (number > 899999)
      throw new CheckoutError("INVOICE_RANGE_EXHAUSTED", 503);
    return String(100000 + number);
  }
  audit(orderId: string, action: string, actor: string, at: string) {
    this.db
      .prepare(
        "INSERT INTO audit (order_id, action, actor, at) VALUES (?, ?, ?, ?)"
      )
      .run(orderId, action, actor, at);
  }
}
