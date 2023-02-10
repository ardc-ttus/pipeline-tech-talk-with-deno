import { beforeEach, describe, it } from "std-bdd";
import { BodyJson, Status, testing } from "oak";
import { assertEquals, assertNotEquals } from "std-asserts";
import { IMedalRepository, MedalInterface, MedalRepository } from "./medal.ts";
import { addAMedal, createMedalApi, listAllMedals } from "./api.ts";

describe("Medal API", () => {
  const wellKnownMedal: MedalInterface = {
    awardedBy: "fulano",
    awardedOn: new Date(),
  };
  let medalRepo: IMedalRepository;

  beforeEach(() => {
    medalRepo = new MedalRepository();
  });

  describe("List all medals", () => {
    it("should return an empty list when nothing is available", () => {
      const mockedContext = testing.createMockContext();
      listAllMedals(mockedContext, medalRepo);
      assertEquals(mockedContext.response.body, JSON.stringify([]));
    });

    it("should return a list of medals when they are available", () => {
      medalRepo.add(wellKnownMedal);
      const mockedContext = testing.createMockContext();
      listAllMedals(mockedContext, medalRepo);
      assertEquals(
        mockedContext.response.body,
        JSON.stringify([wellKnownMedal]),
      );
    });
  });

  describe("Create medals", () => {
    it("should add a medal into the repository if the request is valid", async () => {
      const mockedContext = testing.createMockContext();
      const mockedBody: BodyJson = {
        type: "json",
        value: Promise.resolve(wellKnownMedal),
      };
      // HACK: the below is a hack to allow me to mock the internals of request.body
      // deno-lint-ignore no-explicit-any
      (mockedContext.request.body as any) = () => mockedBody;
      await addAMedal(mockedContext, medalRepo);
      assertEquals(mockedContext.response.status, Status.Created);
      assertEquals(medalRepo.all(), [wellKnownMedal]);
    });

    it("should not add a medal into the repository if the request is invalid", async () => {
      const mockedContext = testing.createMockContext();
      const mockedBody = {
        type: "notJson",
        value: Promise.resolve(wellKnownMedal),
      };
      // HACK: the below is a hack to allow me to mock the internals of request.body
      // deno-lint-ignore no-explicit-any
      (mockedContext.request.body as any) = () => mockedBody;
      await addAMedal(mockedContext, medalRepo);
      assertEquals(mockedContext.response.status, Status.BadRequest);
      assertNotEquals(medalRepo.all(), [wellKnownMedal]);
    });
  });

  it("should be configurable by createMedalApi", () => {
    const got = createMedalApi(new MedalRepository());
    assertNotEquals(got, testing.createMockApp());
  });
});
