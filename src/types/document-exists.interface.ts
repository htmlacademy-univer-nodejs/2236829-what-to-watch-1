export interface DocumentExistsInterface<Id> {
  exists(documentId: Id): Promise<boolean>;
}
