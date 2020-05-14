import { Maybe, ThrowableMaybe } from "./CustomTypes";

interface Dao<T> {
  get(id: number): ThrowableMaybe<T>;
  findAll(): ThrowableMaybe<Array<T>>;
  save(payload: T): Promise<number>;
  update(payload: T): ThrowableMaybe<T>;
  delete(id: number): ThrowableMaybe<string>;
}
export default Dao;
