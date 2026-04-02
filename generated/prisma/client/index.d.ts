
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model HistoryFile
 * 
 */
export type HistoryFile = $Result.DefaultSelection<Prisma.$HistoryFilePayload>
/**
 * Model SharedFile
 * 
 */
export type SharedFile = $Result.DefaultSelection<Prisma.$SharedFilePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.historyFile`: Exposes CRUD operations for the **HistoryFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HistoryFiles
    * const historyFiles = await prisma.historyFile.findMany()
    * ```
    */
  get historyFile(): Prisma.HistoryFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sharedFile`: Exposes CRUD operations for the **SharedFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SharedFiles
    * const sharedFiles = await prisma.sharedFile.findMany()
    * ```
    */
  get sharedFile(): Prisma.SharedFileDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    HistoryFile: 'HistoryFile',
    SharedFile: 'SharedFile'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "historyFile" | "sharedFile"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      HistoryFile: {
        payload: Prisma.$HistoryFilePayload<ExtArgs>
        fields: Prisma.HistoryFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HistoryFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HistoryFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>
          }
          findFirst: {
            args: Prisma.HistoryFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HistoryFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>
          }
          findMany: {
            args: Prisma.HistoryFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>[]
          }
          create: {
            args: Prisma.HistoryFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>
          }
          createMany: {
            args: Prisma.HistoryFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HistoryFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>[]
          }
          delete: {
            args: Prisma.HistoryFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>
          }
          update: {
            args: Prisma.HistoryFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>
          }
          deleteMany: {
            args: Prisma.HistoryFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HistoryFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HistoryFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>[]
          }
          upsert: {
            args: Prisma.HistoryFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HistoryFilePayload>
          }
          aggregate: {
            args: Prisma.HistoryFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHistoryFile>
          }
          groupBy: {
            args: Prisma.HistoryFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<HistoryFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.HistoryFileCountArgs<ExtArgs>
            result: $Utils.Optional<HistoryFileCountAggregateOutputType> | number
          }
        }
      }
      SharedFile: {
        payload: Prisma.$SharedFilePayload<ExtArgs>
        fields: Prisma.SharedFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SharedFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SharedFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>
          }
          findFirst: {
            args: Prisma.SharedFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SharedFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>
          }
          findMany: {
            args: Prisma.SharedFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>[]
          }
          create: {
            args: Prisma.SharedFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>
          }
          createMany: {
            args: Prisma.SharedFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SharedFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>[]
          }
          delete: {
            args: Prisma.SharedFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>
          }
          update: {
            args: Prisma.SharedFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>
          }
          deleteMany: {
            args: Prisma.SharedFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SharedFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SharedFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>[]
          }
          upsert: {
            args: Prisma.SharedFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SharedFilePayload>
          }
          aggregate: {
            args: Prisma.SharedFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSharedFile>
          }
          groupBy: {
            args: Prisma.SharedFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<SharedFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.SharedFileCountArgs<ExtArgs>
            result: $Utils.Optional<SharedFileCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    historyFile?: HistoryFileOmit
    sharedFile?: SharedFileOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    historyFiles: number
    filesOwned: number
    filesShared: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    historyFiles?: boolean | UserCountOutputTypeCountHistoryFilesArgs
    filesOwned?: boolean | UserCountOutputTypeCountFilesOwnedArgs
    filesShared?: boolean | UserCountOutputTypeCountFilesSharedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountHistoryFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistoryFileWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFilesOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedFileWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFilesSharedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedFileWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    historyFiles?: boolean | User$historyFilesArgs<ExtArgs>
    filesOwned?: boolean | User$filesOwnedArgs<ExtArgs>
    filesShared?: boolean | User$filesSharedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    historyFiles?: boolean | User$historyFilesArgs<ExtArgs>
    filesOwned?: boolean | User$filesOwnedArgs<ExtArgs>
    filesShared?: boolean | User$filesSharedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      historyFiles: Prisma.$HistoryFilePayload<ExtArgs>[]
      filesOwned: Prisma.$SharedFilePayload<ExtArgs>[]
      filesShared: Prisma.$SharedFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    historyFiles<T extends User$historyFilesArgs<ExtArgs> = {}>(args?: Subset<T, User$historyFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    filesOwned<T extends User$filesOwnedArgs<ExtArgs> = {}>(args?: Subset<T, User$filesOwnedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    filesShared<T extends User$filesSharedArgs<ExtArgs> = {}>(args?: Subset<T, User$filesSharedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.historyFiles
   */
  export type User$historyFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    where?: HistoryFileWhereInput
    orderBy?: HistoryFileOrderByWithRelationInput | HistoryFileOrderByWithRelationInput[]
    cursor?: HistoryFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HistoryFileScalarFieldEnum | HistoryFileScalarFieldEnum[]
  }

  /**
   * User.filesOwned
   */
  export type User$filesOwnedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    where?: SharedFileWhereInput
    orderBy?: SharedFileOrderByWithRelationInput | SharedFileOrderByWithRelationInput[]
    cursor?: SharedFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SharedFileScalarFieldEnum | SharedFileScalarFieldEnum[]
  }

  /**
   * User.filesShared
   */
  export type User$filesSharedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    where?: SharedFileWhereInput
    orderBy?: SharedFileOrderByWithRelationInput | SharedFileOrderByWithRelationInput[]
    cursor?: SharedFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SharedFileScalarFieldEnum | SharedFileScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model HistoryFile
   */

  export type AggregateHistoryFile = {
    _count: HistoryFileCountAggregateOutputType | null
    _min: HistoryFileMinAggregateOutputType | null
    _max: HistoryFileMaxAggregateOutputType | null
  }

  export type HistoryFileMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    storagePath: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type HistoryFileMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    storagePath: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type HistoryFileCountAggregateOutputType = {
    id: number
    fileName: number
    storagePath: number
    userId: number
    createdAt: number
    _all: number
  }


  export type HistoryFileMinAggregateInputType = {
    id?: true
    fileName?: true
    storagePath?: true
    userId?: true
    createdAt?: true
  }

  export type HistoryFileMaxAggregateInputType = {
    id?: true
    fileName?: true
    storagePath?: true
    userId?: true
    createdAt?: true
  }

  export type HistoryFileCountAggregateInputType = {
    id?: true
    fileName?: true
    storagePath?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type HistoryFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistoryFile to aggregate.
     */
    where?: HistoryFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoryFiles to fetch.
     */
    orderBy?: HistoryFileOrderByWithRelationInput | HistoryFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HistoryFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoryFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoryFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HistoryFiles
    **/
    _count?: true | HistoryFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HistoryFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HistoryFileMaxAggregateInputType
  }

  export type GetHistoryFileAggregateType<T extends HistoryFileAggregateArgs> = {
        [P in keyof T & keyof AggregateHistoryFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHistoryFile[P]>
      : GetScalarType<T[P], AggregateHistoryFile[P]>
  }




  export type HistoryFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HistoryFileWhereInput
    orderBy?: HistoryFileOrderByWithAggregationInput | HistoryFileOrderByWithAggregationInput[]
    by: HistoryFileScalarFieldEnum[] | HistoryFileScalarFieldEnum
    having?: HistoryFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HistoryFileCountAggregateInputType | true
    _min?: HistoryFileMinAggregateInputType
    _max?: HistoryFileMaxAggregateInputType
  }

  export type HistoryFileGroupByOutputType = {
    id: string
    fileName: string
    storagePath: string
    userId: string
    createdAt: Date
    _count: HistoryFileCountAggregateOutputType | null
    _min: HistoryFileMinAggregateOutputType | null
    _max: HistoryFileMaxAggregateOutputType | null
  }

  type GetHistoryFileGroupByPayload<T extends HistoryFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HistoryFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HistoryFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HistoryFileGroupByOutputType[P]>
            : GetScalarType<T[P], HistoryFileGroupByOutputType[P]>
        }
      >
    >


  export type HistoryFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historyFile"]>

  export type HistoryFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historyFile"]>

  export type HistoryFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["historyFile"]>

  export type HistoryFileSelectScalar = {
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type HistoryFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileName" | "storagePath" | "userId" | "createdAt", ExtArgs["result"]["historyFile"]>
  export type HistoryFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HistoryFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type HistoryFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $HistoryFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HistoryFile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      storagePath: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["historyFile"]>
    composites: {}
  }

  type HistoryFileGetPayload<S extends boolean | null | undefined | HistoryFileDefaultArgs> = $Result.GetResult<Prisma.$HistoryFilePayload, S>

  type HistoryFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HistoryFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HistoryFileCountAggregateInputType | true
    }

  export interface HistoryFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HistoryFile'], meta: { name: 'HistoryFile' } }
    /**
     * Find zero or one HistoryFile that matches the filter.
     * @param {HistoryFileFindUniqueArgs} args - Arguments to find a HistoryFile
     * @example
     * // Get one HistoryFile
     * const historyFile = await prisma.historyFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HistoryFileFindUniqueArgs>(args: SelectSubset<T, HistoryFileFindUniqueArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HistoryFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HistoryFileFindUniqueOrThrowArgs} args - Arguments to find a HistoryFile
     * @example
     * // Get one HistoryFile
     * const historyFile = await prisma.historyFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HistoryFileFindUniqueOrThrowArgs>(args: SelectSubset<T, HistoryFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HistoryFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileFindFirstArgs} args - Arguments to find a HistoryFile
     * @example
     * // Get one HistoryFile
     * const historyFile = await prisma.historyFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HistoryFileFindFirstArgs>(args?: SelectSubset<T, HistoryFileFindFirstArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HistoryFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileFindFirstOrThrowArgs} args - Arguments to find a HistoryFile
     * @example
     * // Get one HistoryFile
     * const historyFile = await prisma.historyFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HistoryFileFindFirstOrThrowArgs>(args?: SelectSubset<T, HistoryFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HistoryFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HistoryFiles
     * const historyFiles = await prisma.historyFile.findMany()
     * 
     * // Get first 10 HistoryFiles
     * const historyFiles = await prisma.historyFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const historyFileWithIdOnly = await prisma.historyFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HistoryFileFindManyArgs>(args?: SelectSubset<T, HistoryFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HistoryFile.
     * @param {HistoryFileCreateArgs} args - Arguments to create a HistoryFile.
     * @example
     * // Create one HistoryFile
     * const HistoryFile = await prisma.historyFile.create({
     *   data: {
     *     // ... data to create a HistoryFile
     *   }
     * })
     * 
     */
    create<T extends HistoryFileCreateArgs>(args: SelectSubset<T, HistoryFileCreateArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HistoryFiles.
     * @param {HistoryFileCreateManyArgs} args - Arguments to create many HistoryFiles.
     * @example
     * // Create many HistoryFiles
     * const historyFile = await prisma.historyFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HistoryFileCreateManyArgs>(args?: SelectSubset<T, HistoryFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many HistoryFiles and returns the data saved in the database.
     * @param {HistoryFileCreateManyAndReturnArgs} args - Arguments to create many HistoryFiles.
     * @example
     * // Create many HistoryFiles
     * const historyFile = await prisma.historyFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many HistoryFiles and only return the `id`
     * const historyFileWithIdOnly = await prisma.historyFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HistoryFileCreateManyAndReturnArgs>(args?: SelectSubset<T, HistoryFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a HistoryFile.
     * @param {HistoryFileDeleteArgs} args - Arguments to delete one HistoryFile.
     * @example
     * // Delete one HistoryFile
     * const HistoryFile = await prisma.historyFile.delete({
     *   where: {
     *     // ... filter to delete one HistoryFile
     *   }
     * })
     * 
     */
    delete<T extends HistoryFileDeleteArgs>(args: SelectSubset<T, HistoryFileDeleteArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HistoryFile.
     * @param {HistoryFileUpdateArgs} args - Arguments to update one HistoryFile.
     * @example
     * // Update one HistoryFile
     * const historyFile = await prisma.historyFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HistoryFileUpdateArgs>(args: SelectSubset<T, HistoryFileUpdateArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HistoryFiles.
     * @param {HistoryFileDeleteManyArgs} args - Arguments to filter HistoryFiles to delete.
     * @example
     * // Delete a few HistoryFiles
     * const { count } = await prisma.historyFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HistoryFileDeleteManyArgs>(args?: SelectSubset<T, HistoryFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistoryFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HistoryFiles
     * const historyFile = await prisma.historyFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HistoryFileUpdateManyArgs>(args: SelectSubset<T, HistoryFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HistoryFiles and returns the data updated in the database.
     * @param {HistoryFileUpdateManyAndReturnArgs} args - Arguments to update many HistoryFiles.
     * @example
     * // Update many HistoryFiles
     * const historyFile = await prisma.historyFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more HistoryFiles and only return the `id`
     * const historyFileWithIdOnly = await prisma.historyFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HistoryFileUpdateManyAndReturnArgs>(args: SelectSubset<T, HistoryFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one HistoryFile.
     * @param {HistoryFileUpsertArgs} args - Arguments to update or create a HistoryFile.
     * @example
     * // Update or create a HistoryFile
     * const historyFile = await prisma.historyFile.upsert({
     *   create: {
     *     // ... data to create a HistoryFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HistoryFile we want to update
     *   }
     * })
     */
    upsert<T extends HistoryFileUpsertArgs>(args: SelectSubset<T, HistoryFileUpsertArgs<ExtArgs>>): Prisma__HistoryFileClient<$Result.GetResult<Prisma.$HistoryFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HistoryFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileCountArgs} args - Arguments to filter HistoryFiles to count.
     * @example
     * // Count the number of HistoryFiles
     * const count = await prisma.historyFile.count({
     *   where: {
     *     // ... the filter for the HistoryFiles we want to count
     *   }
     * })
    **/
    count<T extends HistoryFileCountArgs>(
      args?: Subset<T, HistoryFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HistoryFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HistoryFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HistoryFileAggregateArgs>(args: Subset<T, HistoryFileAggregateArgs>): Prisma.PrismaPromise<GetHistoryFileAggregateType<T>>

    /**
     * Group by HistoryFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HistoryFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HistoryFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HistoryFileGroupByArgs['orderBy'] }
        : { orderBy?: HistoryFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HistoryFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHistoryFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HistoryFile model
   */
  readonly fields: HistoryFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HistoryFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HistoryFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HistoryFile model
   */
  interface HistoryFileFieldRefs {
    readonly id: FieldRef<"HistoryFile", 'String'>
    readonly fileName: FieldRef<"HistoryFile", 'String'>
    readonly storagePath: FieldRef<"HistoryFile", 'String'>
    readonly userId: FieldRef<"HistoryFile", 'String'>
    readonly createdAt: FieldRef<"HistoryFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HistoryFile findUnique
   */
  export type HistoryFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * Filter, which HistoryFile to fetch.
     */
    where: HistoryFileWhereUniqueInput
  }

  /**
   * HistoryFile findUniqueOrThrow
   */
  export type HistoryFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * Filter, which HistoryFile to fetch.
     */
    where: HistoryFileWhereUniqueInput
  }

  /**
   * HistoryFile findFirst
   */
  export type HistoryFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * Filter, which HistoryFile to fetch.
     */
    where?: HistoryFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoryFiles to fetch.
     */
    orderBy?: HistoryFileOrderByWithRelationInput | HistoryFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistoryFiles.
     */
    cursor?: HistoryFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoryFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoryFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoryFiles.
     */
    distinct?: HistoryFileScalarFieldEnum | HistoryFileScalarFieldEnum[]
  }

  /**
   * HistoryFile findFirstOrThrow
   */
  export type HistoryFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * Filter, which HistoryFile to fetch.
     */
    where?: HistoryFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoryFiles to fetch.
     */
    orderBy?: HistoryFileOrderByWithRelationInput | HistoryFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HistoryFiles.
     */
    cursor?: HistoryFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoryFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoryFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoryFiles.
     */
    distinct?: HistoryFileScalarFieldEnum | HistoryFileScalarFieldEnum[]
  }

  /**
   * HistoryFile findMany
   */
  export type HistoryFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * Filter, which HistoryFiles to fetch.
     */
    where?: HistoryFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HistoryFiles to fetch.
     */
    orderBy?: HistoryFileOrderByWithRelationInput | HistoryFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HistoryFiles.
     */
    cursor?: HistoryFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HistoryFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HistoryFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HistoryFiles.
     */
    distinct?: HistoryFileScalarFieldEnum | HistoryFileScalarFieldEnum[]
  }

  /**
   * HistoryFile create
   */
  export type HistoryFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * The data needed to create a HistoryFile.
     */
    data: XOR<HistoryFileCreateInput, HistoryFileUncheckedCreateInput>
  }

  /**
   * HistoryFile createMany
   */
  export type HistoryFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HistoryFiles.
     */
    data: HistoryFileCreateManyInput | HistoryFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HistoryFile createManyAndReturn
   */
  export type HistoryFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * The data used to create many HistoryFiles.
     */
    data: HistoryFileCreateManyInput | HistoryFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistoryFile update
   */
  export type HistoryFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * The data needed to update a HistoryFile.
     */
    data: XOR<HistoryFileUpdateInput, HistoryFileUncheckedUpdateInput>
    /**
     * Choose, which HistoryFile to update.
     */
    where: HistoryFileWhereUniqueInput
  }

  /**
   * HistoryFile updateMany
   */
  export type HistoryFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HistoryFiles.
     */
    data: XOR<HistoryFileUpdateManyMutationInput, HistoryFileUncheckedUpdateManyInput>
    /**
     * Filter which HistoryFiles to update
     */
    where?: HistoryFileWhereInput
    /**
     * Limit how many HistoryFiles to update.
     */
    limit?: number
  }

  /**
   * HistoryFile updateManyAndReturn
   */
  export type HistoryFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * The data used to update HistoryFiles.
     */
    data: XOR<HistoryFileUpdateManyMutationInput, HistoryFileUncheckedUpdateManyInput>
    /**
     * Filter which HistoryFiles to update
     */
    where?: HistoryFileWhereInput
    /**
     * Limit how many HistoryFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * HistoryFile upsert
   */
  export type HistoryFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * The filter to search for the HistoryFile to update in case it exists.
     */
    where: HistoryFileWhereUniqueInput
    /**
     * In case the HistoryFile found by the `where` argument doesn't exist, create a new HistoryFile with this data.
     */
    create: XOR<HistoryFileCreateInput, HistoryFileUncheckedCreateInput>
    /**
     * In case the HistoryFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HistoryFileUpdateInput, HistoryFileUncheckedUpdateInput>
  }

  /**
   * HistoryFile delete
   */
  export type HistoryFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
    /**
     * Filter which HistoryFile to delete.
     */
    where: HistoryFileWhereUniqueInput
  }

  /**
   * HistoryFile deleteMany
   */
  export type HistoryFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HistoryFiles to delete
     */
    where?: HistoryFileWhereInput
    /**
     * Limit how many HistoryFiles to delete.
     */
    limit?: number
  }

  /**
   * HistoryFile without action
   */
  export type HistoryFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HistoryFile
     */
    select?: HistoryFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HistoryFile
     */
    omit?: HistoryFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HistoryFileInclude<ExtArgs> | null
  }


  /**
   * Model SharedFile
   */

  export type AggregateSharedFile = {
    _count: SharedFileCountAggregateOutputType | null
    _min: SharedFileMinAggregateOutputType | null
    _max: SharedFileMaxAggregateOutputType | null
  }

  export type SharedFileMinAggregateOutputType = {
    id: string | null
    fileName: string | null
    storagePath: string | null
    ownerId: string | null
    sharedWithId: string | null
    createdAt: Date | null
  }

  export type SharedFileMaxAggregateOutputType = {
    id: string | null
    fileName: string | null
    storagePath: string | null
    ownerId: string | null
    sharedWithId: string | null
    createdAt: Date | null
  }

  export type SharedFileCountAggregateOutputType = {
    id: number
    fileName: number
    storagePath: number
    ownerId: number
    sharedWithId: number
    createdAt: number
    _all: number
  }


  export type SharedFileMinAggregateInputType = {
    id?: true
    fileName?: true
    storagePath?: true
    ownerId?: true
    sharedWithId?: true
    createdAt?: true
  }

  export type SharedFileMaxAggregateInputType = {
    id?: true
    fileName?: true
    storagePath?: true
    ownerId?: true
    sharedWithId?: true
    createdAt?: true
  }

  export type SharedFileCountAggregateInputType = {
    id?: true
    fileName?: true
    storagePath?: true
    ownerId?: true
    sharedWithId?: true
    createdAt?: true
    _all?: true
  }

  export type SharedFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedFile to aggregate.
     */
    where?: SharedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedFiles to fetch.
     */
    orderBy?: SharedFileOrderByWithRelationInput | SharedFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SharedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SharedFiles
    **/
    _count?: true | SharedFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SharedFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SharedFileMaxAggregateInputType
  }

  export type GetSharedFileAggregateType<T extends SharedFileAggregateArgs> = {
        [P in keyof T & keyof AggregateSharedFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSharedFile[P]>
      : GetScalarType<T[P], AggregateSharedFile[P]>
  }




  export type SharedFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SharedFileWhereInput
    orderBy?: SharedFileOrderByWithAggregationInput | SharedFileOrderByWithAggregationInput[]
    by: SharedFileScalarFieldEnum[] | SharedFileScalarFieldEnum
    having?: SharedFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SharedFileCountAggregateInputType | true
    _min?: SharedFileMinAggregateInputType
    _max?: SharedFileMaxAggregateInputType
  }

  export type SharedFileGroupByOutputType = {
    id: string
    fileName: string
    storagePath: string
    ownerId: string
    sharedWithId: string
    createdAt: Date
    _count: SharedFileCountAggregateOutputType | null
    _min: SharedFileMinAggregateOutputType | null
    _max: SharedFileMaxAggregateOutputType | null
  }

  type GetSharedFileGroupByPayload<T extends SharedFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SharedFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SharedFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SharedFileGroupByOutputType[P]>
            : GetScalarType<T[P], SharedFileGroupByOutputType[P]>
        }
      >
    >


  export type SharedFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedFile"]>

  export type SharedFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedFile"]>

  export type SharedFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    createdAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sharedFile"]>

  export type SharedFileSelectScalar = {
    id?: boolean
    fileName?: boolean
    storagePath?: boolean
    ownerId?: boolean
    sharedWithId?: boolean
    createdAt?: boolean
  }

  export type SharedFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileName" | "storagePath" | "ownerId" | "sharedWithId" | "createdAt", ExtArgs["result"]["sharedFile"]>
  export type SharedFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SharedFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SharedFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    sharedWith?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SharedFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SharedFile"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      sharedWith: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fileName: string
      storagePath: string
      ownerId: string
      sharedWithId: string
      createdAt: Date
    }, ExtArgs["result"]["sharedFile"]>
    composites: {}
  }

  type SharedFileGetPayload<S extends boolean | null | undefined | SharedFileDefaultArgs> = $Result.GetResult<Prisma.$SharedFilePayload, S>

  type SharedFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SharedFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SharedFileCountAggregateInputType | true
    }

  export interface SharedFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SharedFile'], meta: { name: 'SharedFile' } }
    /**
     * Find zero or one SharedFile that matches the filter.
     * @param {SharedFileFindUniqueArgs} args - Arguments to find a SharedFile
     * @example
     * // Get one SharedFile
     * const sharedFile = await prisma.sharedFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SharedFileFindUniqueArgs>(args: SelectSubset<T, SharedFileFindUniqueArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SharedFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SharedFileFindUniqueOrThrowArgs} args - Arguments to find a SharedFile
     * @example
     * // Get one SharedFile
     * const sharedFile = await prisma.sharedFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SharedFileFindUniqueOrThrowArgs>(args: SelectSubset<T, SharedFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SharedFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileFindFirstArgs} args - Arguments to find a SharedFile
     * @example
     * // Get one SharedFile
     * const sharedFile = await prisma.sharedFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SharedFileFindFirstArgs>(args?: SelectSubset<T, SharedFileFindFirstArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SharedFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileFindFirstOrThrowArgs} args - Arguments to find a SharedFile
     * @example
     * // Get one SharedFile
     * const sharedFile = await prisma.sharedFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SharedFileFindFirstOrThrowArgs>(args?: SelectSubset<T, SharedFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SharedFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SharedFiles
     * const sharedFiles = await prisma.sharedFile.findMany()
     * 
     * // Get first 10 SharedFiles
     * const sharedFiles = await prisma.sharedFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sharedFileWithIdOnly = await prisma.sharedFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SharedFileFindManyArgs>(args?: SelectSubset<T, SharedFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SharedFile.
     * @param {SharedFileCreateArgs} args - Arguments to create a SharedFile.
     * @example
     * // Create one SharedFile
     * const SharedFile = await prisma.sharedFile.create({
     *   data: {
     *     // ... data to create a SharedFile
     *   }
     * })
     * 
     */
    create<T extends SharedFileCreateArgs>(args: SelectSubset<T, SharedFileCreateArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SharedFiles.
     * @param {SharedFileCreateManyArgs} args - Arguments to create many SharedFiles.
     * @example
     * // Create many SharedFiles
     * const sharedFile = await prisma.sharedFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SharedFileCreateManyArgs>(args?: SelectSubset<T, SharedFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SharedFiles and returns the data saved in the database.
     * @param {SharedFileCreateManyAndReturnArgs} args - Arguments to create many SharedFiles.
     * @example
     * // Create many SharedFiles
     * const sharedFile = await prisma.sharedFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SharedFiles and only return the `id`
     * const sharedFileWithIdOnly = await prisma.sharedFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SharedFileCreateManyAndReturnArgs>(args?: SelectSubset<T, SharedFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SharedFile.
     * @param {SharedFileDeleteArgs} args - Arguments to delete one SharedFile.
     * @example
     * // Delete one SharedFile
     * const SharedFile = await prisma.sharedFile.delete({
     *   where: {
     *     // ... filter to delete one SharedFile
     *   }
     * })
     * 
     */
    delete<T extends SharedFileDeleteArgs>(args: SelectSubset<T, SharedFileDeleteArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SharedFile.
     * @param {SharedFileUpdateArgs} args - Arguments to update one SharedFile.
     * @example
     * // Update one SharedFile
     * const sharedFile = await prisma.sharedFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SharedFileUpdateArgs>(args: SelectSubset<T, SharedFileUpdateArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SharedFiles.
     * @param {SharedFileDeleteManyArgs} args - Arguments to filter SharedFiles to delete.
     * @example
     * // Delete a few SharedFiles
     * const { count } = await prisma.sharedFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SharedFileDeleteManyArgs>(args?: SelectSubset<T, SharedFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SharedFiles
     * const sharedFile = await prisma.sharedFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SharedFileUpdateManyArgs>(args: SelectSubset<T, SharedFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SharedFiles and returns the data updated in the database.
     * @param {SharedFileUpdateManyAndReturnArgs} args - Arguments to update many SharedFiles.
     * @example
     * // Update many SharedFiles
     * const sharedFile = await prisma.sharedFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SharedFiles and only return the `id`
     * const sharedFileWithIdOnly = await prisma.sharedFile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SharedFileUpdateManyAndReturnArgs>(args: SelectSubset<T, SharedFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SharedFile.
     * @param {SharedFileUpsertArgs} args - Arguments to update or create a SharedFile.
     * @example
     * // Update or create a SharedFile
     * const sharedFile = await prisma.sharedFile.upsert({
     *   create: {
     *     // ... data to create a SharedFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SharedFile we want to update
     *   }
     * })
     */
    upsert<T extends SharedFileUpsertArgs>(args: SelectSubset<T, SharedFileUpsertArgs<ExtArgs>>): Prisma__SharedFileClient<$Result.GetResult<Prisma.$SharedFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SharedFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileCountArgs} args - Arguments to filter SharedFiles to count.
     * @example
     * // Count the number of SharedFiles
     * const count = await prisma.sharedFile.count({
     *   where: {
     *     // ... the filter for the SharedFiles we want to count
     *   }
     * })
    **/
    count<T extends SharedFileCountArgs>(
      args?: Subset<T, SharedFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SharedFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SharedFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SharedFileAggregateArgs>(args: Subset<T, SharedFileAggregateArgs>): Prisma.PrismaPromise<GetSharedFileAggregateType<T>>

    /**
     * Group by SharedFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SharedFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SharedFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SharedFileGroupByArgs['orderBy'] }
        : { orderBy?: SharedFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SharedFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSharedFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SharedFile model
   */
  readonly fields: SharedFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SharedFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SharedFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sharedWith<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SharedFile model
   */
  interface SharedFileFieldRefs {
    readonly id: FieldRef<"SharedFile", 'String'>
    readonly fileName: FieldRef<"SharedFile", 'String'>
    readonly storagePath: FieldRef<"SharedFile", 'String'>
    readonly ownerId: FieldRef<"SharedFile", 'String'>
    readonly sharedWithId: FieldRef<"SharedFile", 'String'>
    readonly createdAt: FieldRef<"SharedFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SharedFile findUnique
   */
  export type SharedFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * Filter, which SharedFile to fetch.
     */
    where: SharedFileWhereUniqueInput
  }

  /**
   * SharedFile findUniqueOrThrow
   */
  export type SharedFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * Filter, which SharedFile to fetch.
     */
    where: SharedFileWhereUniqueInput
  }

  /**
   * SharedFile findFirst
   */
  export type SharedFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * Filter, which SharedFile to fetch.
     */
    where?: SharedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedFiles to fetch.
     */
    orderBy?: SharedFileOrderByWithRelationInput | SharedFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedFiles.
     */
    cursor?: SharedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedFiles.
     */
    distinct?: SharedFileScalarFieldEnum | SharedFileScalarFieldEnum[]
  }

  /**
   * SharedFile findFirstOrThrow
   */
  export type SharedFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * Filter, which SharedFile to fetch.
     */
    where?: SharedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedFiles to fetch.
     */
    orderBy?: SharedFileOrderByWithRelationInput | SharedFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SharedFiles.
     */
    cursor?: SharedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedFiles.
     */
    distinct?: SharedFileScalarFieldEnum | SharedFileScalarFieldEnum[]
  }

  /**
   * SharedFile findMany
   */
  export type SharedFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * Filter, which SharedFiles to fetch.
     */
    where?: SharedFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SharedFiles to fetch.
     */
    orderBy?: SharedFileOrderByWithRelationInput | SharedFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SharedFiles.
     */
    cursor?: SharedFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SharedFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SharedFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SharedFiles.
     */
    distinct?: SharedFileScalarFieldEnum | SharedFileScalarFieldEnum[]
  }

  /**
   * SharedFile create
   */
  export type SharedFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * The data needed to create a SharedFile.
     */
    data: XOR<SharedFileCreateInput, SharedFileUncheckedCreateInput>
  }

  /**
   * SharedFile createMany
   */
  export type SharedFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SharedFiles.
     */
    data: SharedFileCreateManyInput | SharedFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SharedFile createManyAndReturn
   */
  export type SharedFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * The data used to create many SharedFiles.
     */
    data: SharedFileCreateManyInput | SharedFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SharedFile update
   */
  export type SharedFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * The data needed to update a SharedFile.
     */
    data: XOR<SharedFileUpdateInput, SharedFileUncheckedUpdateInput>
    /**
     * Choose, which SharedFile to update.
     */
    where: SharedFileWhereUniqueInput
  }

  /**
   * SharedFile updateMany
   */
  export type SharedFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SharedFiles.
     */
    data: XOR<SharedFileUpdateManyMutationInput, SharedFileUncheckedUpdateManyInput>
    /**
     * Filter which SharedFiles to update
     */
    where?: SharedFileWhereInput
    /**
     * Limit how many SharedFiles to update.
     */
    limit?: number
  }

  /**
   * SharedFile updateManyAndReturn
   */
  export type SharedFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * The data used to update SharedFiles.
     */
    data: XOR<SharedFileUpdateManyMutationInput, SharedFileUncheckedUpdateManyInput>
    /**
     * Filter which SharedFiles to update
     */
    where?: SharedFileWhereInput
    /**
     * Limit how many SharedFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SharedFile upsert
   */
  export type SharedFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * The filter to search for the SharedFile to update in case it exists.
     */
    where: SharedFileWhereUniqueInput
    /**
     * In case the SharedFile found by the `where` argument doesn't exist, create a new SharedFile with this data.
     */
    create: XOR<SharedFileCreateInput, SharedFileUncheckedCreateInput>
    /**
     * In case the SharedFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SharedFileUpdateInput, SharedFileUncheckedUpdateInput>
  }

  /**
   * SharedFile delete
   */
  export type SharedFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
    /**
     * Filter which SharedFile to delete.
     */
    where: SharedFileWhereUniqueInput
  }

  /**
   * SharedFile deleteMany
   */
  export type SharedFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SharedFiles to delete
     */
    where?: SharedFileWhereInput
    /**
     * Limit how many SharedFiles to delete.
     */
    limit?: number
  }

  /**
   * SharedFile without action
   */
  export type SharedFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SharedFile
     */
    select?: SharedFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SharedFile
     */
    omit?: SharedFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SharedFileInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const HistoryFileScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    storagePath: 'storagePath',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type HistoryFileScalarFieldEnum = (typeof HistoryFileScalarFieldEnum)[keyof typeof HistoryFileScalarFieldEnum]


  export const SharedFileScalarFieldEnum: {
    id: 'id',
    fileName: 'fileName',
    storagePath: 'storagePath',
    ownerId: 'ownerId',
    sharedWithId: 'sharedWithId',
    createdAt: 'createdAt'
  };

  export type SharedFileScalarFieldEnum = (typeof SharedFileScalarFieldEnum)[keyof typeof SharedFileScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    historyFiles?: HistoryFileListRelationFilter
    filesOwned?: SharedFileListRelationFilter
    filesShared?: SharedFileListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    historyFiles?: HistoryFileOrderByRelationAggregateInput
    filesOwned?: SharedFileOrderByRelationAggregateInput
    filesShared?: SharedFileOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    historyFiles?: HistoryFileListRelationFilter
    filesOwned?: SharedFileListRelationFilter
    filesShared?: SharedFileListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type HistoryFileWhereInput = {
    AND?: HistoryFileWhereInput | HistoryFileWhereInput[]
    OR?: HistoryFileWhereInput[]
    NOT?: HistoryFileWhereInput | HistoryFileWhereInput[]
    id?: StringFilter<"HistoryFile"> | string
    fileName?: StringFilter<"HistoryFile"> | string
    storagePath?: StringFilter<"HistoryFile"> | string
    userId?: StringFilter<"HistoryFile"> | string
    createdAt?: DateTimeFilter<"HistoryFile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type HistoryFileOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type HistoryFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HistoryFileWhereInput | HistoryFileWhereInput[]
    OR?: HistoryFileWhereInput[]
    NOT?: HistoryFileWhereInput | HistoryFileWhereInput[]
    fileName?: StringFilter<"HistoryFile"> | string
    storagePath?: StringFilter<"HistoryFile"> | string
    userId?: StringFilter<"HistoryFile"> | string
    createdAt?: DateTimeFilter<"HistoryFile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type HistoryFileOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: HistoryFileCountOrderByAggregateInput
    _max?: HistoryFileMaxOrderByAggregateInput
    _min?: HistoryFileMinOrderByAggregateInput
  }

  export type HistoryFileScalarWhereWithAggregatesInput = {
    AND?: HistoryFileScalarWhereWithAggregatesInput | HistoryFileScalarWhereWithAggregatesInput[]
    OR?: HistoryFileScalarWhereWithAggregatesInput[]
    NOT?: HistoryFileScalarWhereWithAggregatesInput | HistoryFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HistoryFile"> | string
    fileName?: StringWithAggregatesFilter<"HistoryFile"> | string
    storagePath?: StringWithAggregatesFilter<"HistoryFile"> | string
    userId?: StringWithAggregatesFilter<"HistoryFile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"HistoryFile"> | Date | string
  }

  export type SharedFileWhereInput = {
    AND?: SharedFileWhereInput | SharedFileWhereInput[]
    OR?: SharedFileWhereInput[]
    NOT?: SharedFileWhereInput | SharedFileWhereInput[]
    id?: StringFilter<"SharedFile"> | string
    fileName?: StringFilter<"SharedFile"> | string
    storagePath?: StringFilter<"SharedFile"> | string
    ownerId?: StringFilter<"SharedFile"> | string
    sharedWithId?: StringFilter<"SharedFile"> | string
    createdAt?: DateTimeFilter<"SharedFile"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    sharedWith?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SharedFileOrderByWithRelationInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    createdAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    sharedWith?: UserOrderByWithRelationInput
  }

  export type SharedFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SharedFileWhereInput | SharedFileWhereInput[]
    OR?: SharedFileWhereInput[]
    NOT?: SharedFileWhereInput | SharedFileWhereInput[]
    fileName?: StringFilter<"SharedFile"> | string
    storagePath?: StringFilter<"SharedFile"> | string
    ownerId?: StringFilter<"SharedFile"> | string
    sharedWithId?: StringFilter<"SharedFile"> | string
    createdAt?: DateTimeFilter<"SharedFile"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    sharedWith?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SharedFileOrderByWithAggregationInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    createdAt?: SortOrder
    _count?: SharedFileCountOrderByAggregateInput
    _max?: SharedFileMaxOrderByAggregateInput
    _min?: SharedFileMinOrderByAggregateInput
  }

  export type SharedFileScalarWhereWithAggregatesInput = {
    AND?: SharedFileScalarWhereWithAggregatesInput | SharedFileScalarWhereWithAggregatesInput[]
    OR?: SharedFileScalarWhereWithAggregatesInput[]
    NOT?: SharedFileScalarWhereWithAggregatesInput | SharedFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SharedFile"> | string
    fileName?: StringWithAggregatesFilter<"SharedFile"> | string
    storagePath?: StringWithAggregatesFilter<"SharedFile"> | string
    ownerId?: StringWithAggregatesFilter<"SharedFile"> | string
    sharedWithId?: StringWithAggregatesFilter<"SharedFile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SharedFile"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    historyFiles?: HistoryFileCreateNestedManyWithoutUserInput
    filesOwned?: SharedFileCreateNestedManyWithoutOwnerInput
    filesShared?: SharedFileCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    historyFiles?: HistoryFileUncheckedCreateNestedManyWithoutUserInput
    filesOwned?: SharedFileUncheckedCreateNestedManyWithoutOwnerInput
    filesShared?: SharedFileUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    historyFiles?: HistoryFileUpdateManyWithoutUserNestedInput
    filesOwned?: SharedFileUpdateManyWithoutOwnerNestedInput
    filesShared?: SharedFileUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    historyFiles?: HistoryFileUncheckedUpdateManyWithoutUserNestedInput
    filesOwned?: SharedFileUncheckedUpdateManyWithoutOwnerNestedInput
    filesShared?: SharedFileUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoryFileCreateInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutHistoryFilesInput
  }

  export type HistoryFileUncheckedCreateInput = {
    id?: string
    fileName: string
    storagePath: string
    userId: string
    createdAt?: Date | string
  }

  export type HistoryFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutHistoryFilesNestedInput
  }

  export type HistoryFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoryFileCreateManyInput = {
    id?: string
    fileName: string
    storagePath: string
    userId: string
    createdAt?: Date | string
  }

  export type HistoryFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoryFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileCreateInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutFilesOwnedInput
    sharedWith: UserCreateNestedOneWithoutFilesSharedInput
  }

  export type SharedFileUncheckedCreateInput = {
    id?: string
    fileName: string
    storagePath: string
    ownerId: string
    sharedWithId: string
    createdAt?: Date | string
  }

  export type SharedFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutFilesOwnedNestedInput
    sharedWith?: UserUpdateOneRequiredWithoutFilesSharedNestedInput
  }

  export type SharedFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileCreateManyInput = {
    id?: string
    fileName: string
    storagePath: string
    ownerId: string
    sharedWithId: string
    createdAt?: Date | string
  }

  export type SharedFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type HistoryFileListRelationFilter = {
    every?: HistoryFileWhereInput
    some?: HistoryFileWhereInput
    none?: HistoryFileWhereInput
  }

  export type SharedFileListRelationFilter = {
    every?: SharedFileWhereInput
    some?: SharedFileWhereInput
    none?: SharedFileWhereInput
  }

  export type HistoryFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SharedFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type HistoryFileCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type HistoryFileMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type HistoryFileMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type SharedFileCountOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    createdAt?: SortOrder
  }

  export type SharedFileMaxOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    createdAt?: SortOrder
  }

  export type SharedFileMinOrderByAggregateInput = {
    id?: SortOrder
    fileName?: SortOrder
    storagePath?: SortOrder
    ownerId?: SortOrder
    sharedWithId?: SortOrder
    createdAt?: SortOrder
  }

  export type HistoryFileCreateNestedManyWithoutUserInput = {
    create?: XOR<HistoryFileCreateWithoutUserInput, HistoryFileUncheckedCreateWithoutUserInput> | HistoryFileCreateWithoutUserInput[] | HistoryFileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: HistoryFileCreateOrConnectWithoutUserInput | HistoryFileCreateOrConnectWithoutUserInput[]
    createMany?: HistoryFileCreateManyUserInputEnvelope
    connect?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
  }

  export type SharedFileCreateNestedManyWithoutOwnerInput = {
    create?: XOR<SharedFileCreateWithoutOwnerInput, SharedFileUncheckedCreateWithoutOwnerInput> | SharedFileCreateWithoutOwnerInput[] | SharedFileUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutOwnerInput | SharedFileCreateOrConnectWithoutOwnerInput[]
    createMany?: SharedFileCreateManyOwnerInputEnvelope
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
  }

  export type SharedFileCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<SharedFileCreateWithoutSharedWithInput, SharedFileUncheckedCreateWithoutSharedWithInput> | SharedFileCreateWithoutSharedWithInput[] | SharedFileUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutSharedWithInput | SharedFileCreateOrConnectWithoutSharedWithInput[]
    createMany?: SharedFileCreateManySharedWithInputEnvelope
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
  }

  export type HistoryFileUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<HistoryFileCreateWithoutUserInput, HistoryFileUncheckedCreateWithoutUserInput> | HistoryFileCreateWithoutUserInput[] | HistoryFileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: HistoryFileCreateOrConnectWithoutUserInput | HistoryFileCreateOrConnectWithoutUserInput[]
    createMany?: HistoryFileCreateManyUserInputEnvelope
    connect?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
  }

  export type SharedFileUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<SharedFileCreateWithoutOwnerInput, SharedFileUncheckedCreateWithoutOwnerInput> | SharedFileCreateWithoutOwnerInput[] | SharedFileUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutOwnerInput | SharedFileCreateOrConnectWithoutOwnerInput[]
    createMany?: SharedFileCreateManyOwnerInputEnvelope
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
  }

  export type SharedFileUncheckedCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<SharedFileCreateWithoutSharedWithInput, SharedFileUncheckedCreateWithoutSharedWithInput> | SharedFileCreateWithoutSharedWithInput[] | SharedFileUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutSharedWithInput | SharedFileCreateOrConnectWithoutSharedWithInput[]
    createMany?: SharedFileCreateManySharedWithInputEnvelope
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type HistoryFileUpdateManyWithoutUserNestedInput = {
    create?: XOR<HistoryFileCreateWithoutUserInput, HistoryFileUncheckedCreateWithoutUserInput> | HistoryFileCreateWithoutUserInput[] | HistoryFileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: HistoryFileCreateOrConnectWithoutUserInput | HistoryFileCreateOrConnectWithoutUserInput[]
    upsert?: HistoryFileUpsertWithWhereUniqueWithoutUserInput | HistoryFileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: HistoryFileCreateManyUserInputEnvelope
    set?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    disconnect?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    delete?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    connect?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    update?: HistoryFileUpdateWithWhereUniqueWithoutUserInput | HistoryFileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: HistoryFileUpdateManyWithWhereWithoutUserInput | HistoryFileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: HistoryFileScalarWhereInput | HistoryFileScalarWhereInput[]
  }

  export type SharedFileUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<SharedFileCreateWithoutOwnerInput, SharedFileUncheckedCreateWithoutOwnerInput> | SharedFileCreateWithoutOwnerInput[] | SharedFileUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutOwnerInput | SharedFileCreateOrConnectWithoutOwnerInput[]
    upsert?: SharedFileUpsertWithWhereUniqueWithoutOwnerInput | SharedFileUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: SharedFileCreateManyOwnerInputEnvelope
    set?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    disconnect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    delete?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    update?: SharedFileUpdateWithWhereUniqueWithoutOwnerInput | SharedFileUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: SharedFileUpdateManyWithWhereWithoutOwnerInput | SharedFileUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: SharedFileScalarWhereInput | SharedFileScalarWhereInput[]
  }

  export type SharedFileUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<SharedFileCreateWithoutSharedWithInput, SharedFileUncheckedCreateWithoutSharedWithInput> | SharedFileCreateWithoutSharedWithInput[] | SharedFileUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutSharedWithInput | SharedFileCreateOrConnectWithoutSharedWithInput[]
    upsert?: SharedFileUpsertWithWhereUniqueWithoutSharedWithInput | SharedFileUpsertWithWhereUniqueWithoutSharedWithInput[]
    createMany?: SharedFileCreateManySharedWithInputEnvelope
    set?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    disconnect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    delete?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    update?: SharedFileUpdateWithWhereUniqueWithoutSharedWithInput | SharedFileUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: SharedFileUpdateManyWithWhereWithoutSharedWithInput | SharedFileUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: SharedFileScalarWhereInput | SharedFileScalarWhereInput[]
  }

  export type HistoryFileUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<HistoryFileCreateWithoutUserInput, HistoryFileUncheckedCreateWithoutUserInput> | HistoryFileCreateWithoutUserInput[] | HistoryFileUncheckedCreateWithoutUserInput[]
    connectOrCreate?: HistoryFileCreateOrConnectWithoutUserInput | HistoryFileCreateOrConnectWithoutUserInput[]
    upsert?: HistoryFileUpsertWithWhereUniqueWithoutUserInput | HistoryFileUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: HistoryFileCreateManyUserInputEnvelope
    set?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    disconnect?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    delete?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    connect?: HistoryFileWhereUniqueInput | HistoryFileWhereUniqueInput[]
    update?: HistoryFileUpdateWithWhereUniqueWithoutUserInput | HistoryFileUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: HistoryFileUpdateManyWithWhereWithoutUserInput | HistoryFileUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: HistoryFileScalarWhereInput | HistoryFileScalarWhereInput[]
  }

  export type SharedFileUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<SharedFileCreateWithoutOwnerInput, SharedFileUncheckedCreateWithoutOwnerInput> | SharedFileCreateWithoutOwnerInput[] | SharedFileUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutOwnerInput | SharedFileCreateOrConnectWithoutOwnerInput[]
    upsert?: SharedFileUpsertWithWhereUniqueWithoutOwnerInput | SharedFileUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: SharedFileCreateManyOwnerInputEnvelope
    set?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    disconnect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    delete?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    update?: SharedFileUpdateWithWhereUniqueWithoutOwnerInput | SharedFileUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: SharedFileUpdateManyWithWhereWithoutOwnerInput | SharedFileUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: SharedFileScalarWhereInput | SharedFileScalarWhereInput[]
  }

  export type SharedFileUncheckedUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<SharedFileCreateWithoutSharedWithInput, SharedFileUncheckedCreateWithoutSharedWithInput> | SharedFileCreateWithoutSharedWithInput[] | SharedFileUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: SharedFileCreateOrConnectWithoutSharedWithInput | SharedFileCreateOrConnectWithoutSharedWithInput[]
    upsert?: SharedFileUpsertWithWhereUniqueWithoutSharedWithInput | SharedFileUpsertWithWhereUniqueWithoutSharedWithInput[]
    createMany?: SharedFileCreateManySharedWithInputEnvelope
    set?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    disconnect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    delete?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    connect?: SharedFileWhereUniqueInput | SharedFileWhereUniqueInput[]
    update?: SharedFileUpdateWithWhereUniqueWithoutSharedWithInput | SharedFileUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: SharedFileUpdateManyWithWhereWithoutSharedWithInput | SharedFileUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: SharedFileScalarWhereInput | SharedFileScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutHistoryFilesInput = {
    create?: XOR<UserCreateWithoutHistoryFilesInput, UserUncheckedCreateWithoutHistoryFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHistoryFilesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutHistoryFilesNestedInput = {
    create?: XOR<UserCreateWithoutHistoryFilesInput, UserUncheckedCreateWithoutHistoryFilesInput>
    connectOrCreate?: UserCreateOrConnectWithoutHistoryFilesInput
    upsert?: UserUpsertWithoutHistoryFilesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutHistoryFilesInput, UserUpdateWithoutHistoryFilesInput>, UserUncheckedUpdateWithoutHistoryFilesInput>
  }

  export type UserCreateNestedOneWithoutFilesOwnedInput = {
    create?: XOR<UserCreateWithoutFilesOwnedInput, UserUncheckedCreateWithoutFilesOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesOwnedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutFilesSharedInput = {
    create?: XOR<UserCreateWithoutFilesSharedInput, UserUncheckedCreateWithoutFilesSharedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesSharedInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFilesOwnedNestedInput = {
    create?: XOR<UserCreateWithoutFilesOwnedInput, UserUncheckedCreateWithoutFilesOwnedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesOwnedInput
    upsert?: UserUpsertWithoutFilesOwnedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFilesOwnedInput, UserUpdateWithoutFilesOwnedInput>, UserUncheckedUpdateWithoutFilesOwnedInput>
  }

  export type UserUpdateOneRequiredWithoutFilesSharedNestedInput = {
    create?: XOR<UserCreateWithoutFilesSharedInput, UserUncheckedCreateWithoutFilesSharedInput>
    connectOrCreate?: UserCreateOrConnectWithoutFilesSharedInput
    upsert?: UserUpsertWithoutFilesSharedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFilesSharedInput, UserUpdateWithoutFilesSharedInput>, UserUncheckedUpdateWithoutFilesSharedInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type HistoryFileCreateWithoutUserInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
  }

  export type HistoryFileUncheckedCreateWithoutUserInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
  }

  export type HistoryFileCreateOrConnectWithoutUserInput = {
    where: HistoryFileWhereUniqueInput
    create: XOR<HistoryFileCreateWithoutUserInput, HistoryFileUncheckedCreateWithoutUserInput>
  }

  export type HistoryFileCreateManyUserInputEnvelope = {
    data: HistoryFileCreateManyUserInput | HistoryFileCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SharedFileCreateWithoutOwnerInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
    sharedWith: UserCreateNestedOneWithoutFilesSharedInput
  }

  export type SharedFileUncheckedCreateWithoutOwnerInput = {
    id?: string
    fileName: string
    storagePath: string
    sharedWithId: string
    createdAt?: Date | string
  }

  export type SharedFileCreateOrConnectWithoutOwnerInput = {
    where: SharedFileWhereUniqueInput
    create: XOR<SharedFileCreateWithoutOwnerInput, SharedFileUncheckedCreateWithoutOwnerInput>
  }

  export type SharedFileCreateManyOwnerInputEnvelope = {
    data: SharedFileCreateManyOwnerInput | SharedFileCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type SharedFileCreateWithoutSharedWithInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
    owner: UserCreateNestedOneWithoutFilesOwnedInput
  }

  export type SharedFileUncheckedCreateWithoutSharedWithInput = {
    id?: string
    fileName: string
    storagePath: string
    ownerId: string
    createdAt?: Date | string
  }

  export type SharedFileCreateOrConnectWithoutSharedWithInput = {
    where: SharedFileWhereUniqueInput
    create: XOR<SharedFileCreateWithoutSharedWithInput, SharedFileUncheckedCreateWithoutSharedWithInput>
  }

  export type SharedFileCreateManySharedWithInputEnvelope = {
    data: SharedFileCreateManySharedWithInput | SharedFileCreateManySharedWithInput[]
    skipDuplicates?: boolean
  }

  export type HistoryFileUpsertWithWhereUniqueWithoutUserInput = {
    where: HistoryFileWhereUniqueInput
    update: XOR<HistoryFileUpdateWithoutUserInput, HistoryFileUncheckedUpdateWithoutUserInput>
    create: XOR<HistoryFileCreateWithoutUserInput, HistoryFileUncheckedCreateWithoutUserInput>
  }

  export type HistoryFileUpdateWithWhereUniqueWithoutUserInput = {
    where: HistoryFileWhereUniqueInput
    data: XOR<HistoryFileUpdateWithoutUserInput, HistoryFileUncheckedUpdateWithoutUserInput>
  }

  export type HistoryFileUpdateManyWithWhereWithoutUserInput = {
    where: HistoryFileScalarWhereInput
    data: XOR<HistoryFileUpdateManyMutationInput, HistoryFileUncheckedUpdateManyWithoutUserInput>
  }

  export type HistoryFileScalarWhereInput = {
    AND?: HistoryFileScalarWhereInput | HistoryFileScalarWhereInput[]
    OR?: HistoryFileScalarWhereInput[]
    NOT?: HistoryFileScalarWhereInput | HistoryFileScalarWhereInput[]
    id?: StringFilter<"HistoryFile"> | string
    fileName?: StringFilter<"HistoryFile"> | string
    storagePath?: StringFilter<"HistoryFile"> | string
    userId?: StringFilter<"HistoryFile"> | string
    createdAt?: DateTimeFilter<"HistoryFile"> | Date | string
  }

  export type SharedFileUpsertWithWhereUniqueWithoutOwnerInput = {
    where: SharedFileWhereUniqueInput
    update: XOR<SharedFileUpdateWithoutOwnerInput, SharedFileUncheckedUpdateWithoutOwnerInput>
    create: XOR<SharedFileCreateWithoutOwnerInput, SharedFileUncheckedCreateWithoutOwnerInput>
  }

  export type SharedFileUpdateWithWhereUniqueWithoutOwnerInput = {
    where: SharedFileWhereUniqueInput
    data: XOR<SharedFileUpdateWithoutOwnerInput, SharedFileUncheckedUpdateWithoutOwnerInput>
  }

  export type SharedFileUpdateManyWithWhereWithoutOwnerInput = {
    where: SharedFileScalarWhereInput
    data: XOR<SharedFileUpdateManyMutationInput, SharedFileUncheckedUpdateManyWithoutOwnerInput>
  }

  export type SharedFileScalarWhereInput = {
    AND?: SharedFileScalarWhereInput | SharedFileScalarWhereInput[]
    OR?: SharedFileScalarWhereInput[]
    NOT?: SharedFileScalarWhereInput | SharedFileScalarWhereInput[]
    id?: StringFilter<"SharedFile"> | string
    fileName?: StringFilter<"SharedFile"> | string
    storagePath?: StringFilter<"SharedFile"> | string
    ownerId?: StringFilter<"SharedFile"> | string
    sharedWithId?: StringFilter<"SharedFile"> | string
    createdAt?: DateTimeFilter<"SharedFile"> | Date | string
  }

  export type SharedFileUpsertWithWhereUniqueWithoutSharedWithInput = {
    where: SharedFileWhereUniqueInput
    update: XOR<SharedFileUpdateWithoutSharedWithInput, SharedFileUncheckedUpdateWithoutSharedWithInput>
    create: XOR<SharedFileCreateWithoutSharedWithInput, SharedFileUncheckedCreateWithoutSharedWithInput>
  }

  export type SharedFileUpdateWithWhereUniqueWithoutSharedWithInput = {
    where: SharedFileWhereUniqueInput
    data: XOR<SharedFileUpdateWithoutSharedWithInput, SharedFileUncheckedUpdateWithoutSharedWithInput>
  }

  export type SharedFileUpdateManyWithWhereWithoutSharedWithInput = {
    where: SharedFileScalarWhereInput
    data: XOR<SharedFileUpdateManyMutationInput, SharedFileUncheckedUpdateManyWithoutSharedWithInput>
  }

  export type UserCreateWithoutHistoryFilesInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    filesOwned?: SharedFileCreateNestedManyWithoutOwnerInput
    filesShared?: SharedFileCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateWithoutHistoryFilesInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    filesOwned?: SharedFileUncheckedCreateNestedManyWithoutOwnerInput
    filesShared?: SharedFileUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserCreateOrConnectWithoutHistoryFilesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHistoryFilesInput, UserUncheckedCreateWithoutHistoryFilesInput>
  }

  export type UserUpsertWithoutHistoryFilesInput = {
    update: XOR<UserUpdateWithoutHistoryFilesInput, UserUncheckedUpdateWithoutHistoryFilesInput>
    create: XOR<UserCreateWithoutHistoryFilesInput, UserUncheckedCreateWithoutHistoryFilesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutHistoryFilesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutHistoryFilesInput, UserUncheckedUpdateWithoutHistoryFilesInput>
  }

  export type UserUpdateWithoutHistoryFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    filesOwned?: SharedFileUpdateManyWithoutOwnerNestedInput
    filesShared?: SharedFileUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateWithoutHistoryFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    filesOwned?: SharedFileUncheckedUpdateManyWithoutOwnerNestedInput
    filesShared?: SharedFileUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserCreateWithoutFilesOwnedInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    historyFiles?: HistoryFileCreateNestedManyWithoutUserInput
    filesShared?: SharedFileCreateNestedManyWithoutSharedWithInput
  }

  export type UserUncheckedCreateWithoutFilesOwnedInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    historyFiles?: HistoryFileUncheckedCreateNestedManyWithoutUserInput
    filesShared?: SharedFileUncheckedCreateNestedManyWithoutSharedWithInput
  }

  export type UserCreateOrConnectWithoutFilesOwnedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFilesOwnedInput, UserUncheckedCreateWithoutFilesOwnedInput>
  }

  export type UserCreateWithoutFilesSharedInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    historyFiles?: HistoryFileCreateNestedManyWithoutUserInput
    filesOwned?: SharedFileCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutFilesSharedInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    historyFiles?: HistoryFileUncheckedCreateNestedManyWithoutUserInput
    filesOwned?: SharedFileUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutFilesSharedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFilesSharedInput, UserUncheckedCreateWithoutFilesSharedInput>
  }

  export type UserUpsertWithoutFilesOwnedInput = {
    update: XOR<UserUpdateWithoutFilesOwnedInput, UserUncheckedUpdateWithoutFilesOwnedInput>
    create: XOR<UserCreateWithoutFilesOwnedInput, UserUncheckedCreateWithoutFilesOwnedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFilesOwnedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFilesOwnedInput, UserUncheckedUpdateWithoutFilesOwnedInput>
  }

  export type UserUpdateWithoutFilesOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    historyFiles?: HistoryFileUpdateManyWithoutUserNestedInput
    filesShared?: SharedFileUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUncheckedUpdateWithoutFilesOwnedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    historyFiles?: HistoryFileUncheckedUpdateManyWithoutUserNestedInput
    filesShared?: SharedFileUncheckedUpdateManyWithoutSharedWithNestedInput
  }

  export type UserUpsertWithoutFilesSharedInput = {
    update: XOR<UserUpdateWithoutFilesSharedInput, UserUncheckedUpdateWithoutFilesSharedInput>
    create: XOR<UserCreateWithoutFilesSharedInput, UserUncheckedCreateWithoutFilesSharedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFilesSharedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFilesSharedInput, UserUncheckedUpdateWithoutFilesSharedInput>
  }

  export type UserUpdateWithoutFilesSharedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    historyFiles?: HistoryFileUpdateManyWithoutUserNestedInput
    filesOwned?: SharedFileUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutFilesSharedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    historyFiles?: HistoryFileUncheckedUpdateManyWithoutUserNestedInput
    filesOwned?: SharedFileUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type HistoryFileCreateManyUserInput = {
    id?: string
    fileName: string
    storagePath: string
    createdAt?: Date | string
  }

  export type SharedFileCreateManyOwnerInput = {
    id?: string
    fileName: string
    storagePath: string
    sharedWithId: string
    createdAt?: Date | string
  }

  export type SharedFileCreateManySharedWithInput = {
    id?: string
    fileName: string
    storagePath: string
    ownerId: string
    createdAt?: Date | string
  }

  export type HistoryFileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoryFileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HistoryFileUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedWith?: UserUpdateOneRequiredWithoutFilesSharedNestedInput
  }

  export type SharedFileUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    sharedWithId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutFilesOwnedNestedInput
  }

  export type SharedFileUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SharedFileUncheckedUpdateManyWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}