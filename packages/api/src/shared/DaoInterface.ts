import { Maybe, ThrowableMaybe } from "./CustomTypes";

interface Dao<T> {
  find(id: number): Promise<T>;
  findAll(): Promise<Array<T>>;
  save(payload: T): Promise<number>;
  update(id: number, payload: T): Promise<T>;
  delete(id: number): Promise<number>;
}
export default Dao;
