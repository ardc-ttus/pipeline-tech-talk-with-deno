FROM denoland/deno:alpine
EXPOSE 8888

WORKDIR /app
USER deno

# copy only dependencies and lockfiles
COPY deps.ts .
COPY deno.json .
COPY deno.lock .

# check the cache and hydrate local dependencies
RUN deno cache --reload --lock=deno.lock deps.ts

# copying the rest
COPY . .

# checking if linter and fmt are hapy
RUN deno fmt --check
RUN deno lint

# running tests
RUN deno test -A

# running the API itself
CMD ["deno", "run" , "--allow-net", "--lock=deno.lock", "--cached-only", "main.ts"]
