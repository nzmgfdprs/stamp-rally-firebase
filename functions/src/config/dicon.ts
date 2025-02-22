import 'reflect-metadata'
import { Container } from 'inversify/lib/container/container'
import { Firestore } from 'firebase-admin/firestore'
import * as admin from 'firebase-admin'
import { User } from '../firestore-collection/user/entity/user'
import { userConverter } from '../firestore-collection/user/userConverter'
import { UserRepository } from '../firestore-collection/user/userRepository'

/**
 * DI コンテナー
 */
export const container = new Container()

/**************************************************************************
 * プロバイダー名の定義
 **************************************************************************/

export const providers = {
  /**
   * Firestore
   */
  firestoreDb: Symbol.for(`firestoreDb`),

  /**
   * User
   */
  userRef: Symbol.for(`userRef`),
  userRepository: Symbol.for(`userRepository`),
}

/**************************************************************************
 * DI の登録
 **************************************************************************/

/**
 * Firestore
 */
container
  .bind<Firestore>(providers.firestoreDb)
  .toDynamicValue(() => {
    const db = admin.firestore()
    /** undefined なプロパティを無視するよう設定する */
    db.settings({ ignoreUndefinedProperties: true })
    return db
  })
  .inSingletonScope()

/**
 * User
 */
container
  .bind<FirebaseFirestore.CollectionReference<User>>(providers.userRef)
  .toDynamicValue((context) => {
    const db = context.container.get<Firestore>(providers.firestoreDb)
    return db.collection(`user`).withConverter<User>(userConverter)
  })
  .inSingletonScope()
container.bind<UserRepository>(providers.userRepository).to(UserRepository)
