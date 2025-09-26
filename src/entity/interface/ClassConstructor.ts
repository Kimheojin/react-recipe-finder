export default interface ClassConstructor<T> {
  new (...args: any[]): T;
}
