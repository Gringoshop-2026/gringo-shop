import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
export class JsonRepository {
  constructor(file) { this.file = file }
  async read() { try { return JSON.parse(await readFile(this.file, 'utf8')) } catch { const empty={products:[],quotes:[],orders:[]}; await mkdir(path.dirname(this.file), {recursive:true}); await this.write(empty); return empty } }
  async write(data) { await writeFile(this.file, JSON.stringify(data, null, 2)); return data }
  async save(product) { const data=await this.read(); data.products.push(product); await this.write(data); return product }
  async addOrder(order) { const data=await this.read(); data.orders.push(order); await this.write(data); return order }
  async addQuote(quote) { const data=await this.read(); data.quotes.push(quote); await this.write(data); return quote }
}
