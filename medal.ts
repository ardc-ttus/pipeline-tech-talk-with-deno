/**
 * Contract of all the data in a Medal.
 */
export interface MedalInterface {
  readonly awardedBy: string;
  readonly awardedOn: Date;
  readonly pictureUrl?: string;
}

/**
 * Blueprint of a Medal.
 */
export class Medal implements MedalInterface {
  constructor(
    public awardedBy: string,
    public awardedOn: Date,
    public pictureUrl?: string,
  ) {
  }

  /**
   * creates a new Medal from Medal Interface.
   * @returns a new Medal instance copied from the interface's data.
   */
  public static fromInterface(origin: MedalInterface): Medal {
    return new Medal(origin.awardedBy, origin.awardedOn, origin.pictureUrl);
  }

  /**
   * creates a new MedalInterface from a Medal.
   * @returns a new MedalInterface instance copied from the class' data.
   */
  public toInterface(): MedalInterface {
    return {
      awardedBy: this.awardedBy,
      awardedOn: this.awardedOn,
      pictureUrl: this.pictureUrl,
    };
  }
}

export interface IMedalRepository {
  add(medal: MedalInterface): MedalInterface;
  all(): MedalInterface[];
}

/**
 * Repository to store medals.
 */
export class MedalRepository implements IMedalRepository {
  /** */
  constructor(private medals: MedalInterface[] = []) {}

  /**
   * adds a new medal into the repository.
   * @param medal a medal that should be stored
   * @returns the medal which has been stored
   */
  add(medal: MedalInterface): MedalInterface {
    this.medals.push(medal);
    return medal;
  }

  /**
   * fetches all the medals in this repository.
   * @returns all medals in the repository
   */
  public all(): MedalInterface[] {
    return this.medals;
  }
}
