import {
  IMedalRepository,
  Medal,
  MedalInterface,
  MedalRepository,
} from "./medal.ts";
import { describe, it } from "std-bdd";
import { assertEquals, assertNotEquals } from "std-asserts";

describe("Medal", () => {
  describe("Interface", () => {
    const wellKnownAwarder = "rodolpho";
    const wellKnownDate = new Date();
    const subject: MedalInterface = {
      awardedBy: wellKnownAwarder,
      awardedOn: wellKnownDate,
    };

    it("should be awarded by someone", () => {
      assertEquals(subject.awardedBy, wellKnownAwarder);
    });

    it("should be awarded on a date", () => {
      assertEquals(subject.awardedOn, wellKnownDate);
    });

    it("should allow for a pictureUrl to be added", () => {
      assertEquals(subject.pictureUrl, undefined);
      const wellKnownUrl = "https://google.com";
      const newMedal: MedalInterface = { ...subject, pictureUrl: wellKnownUrl };
      assertEquals(newMedal.pictureUrl, wellKnownUrl);
    });
  });

  describe("Class", () => {
    const wellKnownAwarder = "rodolpho";
    const wellKnownDate = new Date();
    const wellKnownUrl = "https://google.com";
    const origin: MedalInterface = {
      awardedBy: wellKnownAwarder,
      awardedOn: wellKnownDate,
      pictureUrl: wellKnownUrl,
    };

    it("should have a constructor with all the parameters", () => {
      const subject = new Medal(wellKnownAwarder, wellKnownDate, wellKnownUrl);
      assertNotEquals(subject, undefined);
      assertNotEquals(subject, null);
    });

    it("should be creatable from the interface", () => {
      const subject = Medal.fromInterface(origin);
      const got: MedalInterface = { ...subject };
      assertEquals(got, origin);
    });

    it("should allow casting to the interface", () => {
      const subject = new Medal(wellKnownAwarder, wellKnownDate, wellKnownUrl);
      const got = subject.toInterface();
      assertEquals(got, {
        awardedBy: wellKnownAwarder,
        awardedOn: wellKnownDate,
        pictureUrl: wellKnownUrl,
      });
    });
  });

  describe("Repository", () => {
    const wellKnownMedal: MedalInterface = {
      awardedBy: "fulano",
      awardedOn: new Date(),
    };
    it("should have an optional seed constructor", () => {
      const medals: MedalInterface[] = [wellKnownMedal];
      const gotWithSeed = new MedalRepository(medals);
      assertNotEquals(gotWithSeed, null);
      const gotWithoutSeed = new MedalRepository();
      assertNotEquals(gotWithoutSeed, null);
      assertNotEquals(gotWithoutSeed, gotWithSeed);
    });

    describe("should have a method to fetch all medals", () => {
      it("when no medals are present an empty list is return", () => {
        const subject: IMedalRepository = new MedalRepository();
        const got: MedalInterface[] = subject.all();
        assertEquals(got, []);
      });

      it("when medals are present a list of medals is returned", () => {
        const subject: IMedalRepository = new MedalRepository([wellKnownMedal]);
        const got: MedalInterface[] = subject.all();
        assertEquals(got, [wellKnownMedal]);
      });
    });

    describe("should have a method to add into the repository", () => {
      it("when no medals are present then the new one is stored", () => {
        const subject: IMedalRepository = new MedalRepository();
        const got = subject.add(wellKnownMedal);
        assertEquals(got, wellKnownMedal);
        assertEquals(subject.all(), [wellKnownMedal]);
      });

      it("when medals are present then the new one is stored", () => {
        const anotherMedal: MedalInterface = {
          awardedBy: "someone else",
          awardedOn: new Date(),
        };
        const subject: IMedalRepository = new MedalRepository([wellKnownMedal]);
        const got = subject.add(anotherMedal);
        assertEquals(got, anotherMedal);
        assertNotEquals(subject.all(), [wellKnownMedal]);
      });

      it("when medals are present then the new one is stored even if duplicate", () => {
        const subject: IMedalRepository = new MedalRepository([wellKnownMedal]);
        const got = subject.add(wellKnownMedal);
        assertEquals(got, wellKnownMedal);
        assertNotEquals(subject.all(), [wellKnownMedal]);
      });
    });
  });
});
