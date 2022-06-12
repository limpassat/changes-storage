import { ChangesSpace } from "./ChangesSpace";


type SpaceIdent = string;

export class ChangesStorage {

  private spacesMap = new Map<SpaceIdent, ChangesSpace>();

  getSpace(ident: SpaceIdent): ChangesSpace {
    if (!this.spacesMap.has(ident)) {
      this.spacesMap.set(ident, new ChangesSpace());
    }
    return this.spacesMap.get(ident);
  }

  get haveChanges(): boolean {
    const spacesIdents = Array.from(this.spacesMap.keys());
    return spacesIdents
    .map(ident => this.getSpace(ident).haveChanges)
    .some(val => !val);
  }

}