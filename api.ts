import { Application, Context, Router, Status } from "oak";
import { IMedalRepository, MedalInterface } from "./medal.ts";

/**
 * handles listing all the medals in the api.
 * @param ctx oak context
 * @param medalRepository repository to query for medals
 */
export function listAllMedals(ctx: Context, medalRepository: IMedalRepository) {
  console.debug("listing all medals");
  ctx.response.body = JSON.stringify(medalRepository.all());
}

/**
 * handles creating a new medal in the api.
 * @param ctx oak context
 * @param medalRepository repository to add medals into
 * @returns a copy of the medal that was created
 */
export async function addAMedal(
  ctx: Context,
  medalRepository: IMedalRepository,
) {
  console.debug("adding a medal");
  const content = ctx.request.body();
  if (content.type != "json") {
    ctx.response.status = Status.BadRequest;
    return;
  }

  const medal = await content.value as MedalInterface;
  const createdMedal = medalRepository.add(medal);
  ctx.response.status = Status.Created;
  ctx.response.body = JSON.stringify(createdMedal);
}

/**
 * setups an Oak application to serves the Medal API routes.
 * @param param0 the state for initializing the api.
 * @returns an Oak app ready to run
 */
export function createMedalApi(
  medalRepository: IMedalRepository,
  app: Application = new Application(),
) {
  const router = new Router();
  router
    .post("/medal", (ctx) => addAMedal(ctx, medalRepository))
    .get("/medal", (ctx) => listAllMedals(ctx, medalRepository));
  app
    .use(router.routes())
    .use(router.allowedMethods());
  return app;
}
