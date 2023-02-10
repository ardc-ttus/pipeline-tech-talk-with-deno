# DVIR-Pipeline-Tech-Talk

This repository contains all the samples for the DVIR tech talk regarding the
basics of a pipeline and what is CI / CD.

Code in this repository is written using [Deno](https://deno.land/) since
Typescript is a bit simpler to understand than goLang, C# or Kotlin.

## What is a pipeline

A "pipeline" is a series of steps one may take to compile, validate and run
their application (be it an API, frontend SPA or an Android Application).

In a nutshell you'll have the following steps:

1. Verify that your code matches the desired standards (e.g.`deno fmt` and
   `deno lint`)
2. Compile / build your code (e.g. `deno bundle main.ts`)
3. Automatically test your code (e.g. `deno test -A`)
4. Deploy (run) your code somewhere (e.g. `deno run -A main.ts`)
   1. _implicit here is that in case it's not a local environment you might need
      to do a `ssh` into a server_

Those steps are usually validated (and discovered!) by running and testing your
application locally thru a CLI (Command Line Interface).

Depending on which framework / programming language you're using the steps may
change a bit (sometimes for better, sometimes for worse) but **the algorithm
remains**.

The biggest takeaway is: **everything in here is executable locally**, as far as
you have access to a terminal/shell you're good to go. **Those steps are done
seamlessly everything you're working within an IDE** and this is why usually we
don't get used to the command lines needed to make this by ourselves.

### Automating the pipeline (CI/CD)

Now that you're aware of what's a pipeline you might be wondering how that
connects to the buzz-talk of "CI/CD" or "DevOps Culture".

![CICD diagram](https://www.xenonstack.com/hubfs/xenonstack-continuous-integration-and-continuous-delivery.png)

**CI/CD is making your pipeline run remotely and automatically**, usually this
is achieved by using an orchestrator such as _Jenkins_, _GitHub Actions_,
_Travis CI_ along with a VCS (_Version Control System_) such as _Git_.

**Such orchestrator tools allow you to set standards and settings** based on
"where" code is being pushed, "how" it'll be released and "when".

The [CI-CD](./cicd/) folder contains samples on how to automate those steps
locally and expanding from ["old-school"](./cicd/oldSchool.sh) means (hacking
away on shellscript) into mode modern standards running (such as
[docker-compose](docker-compose.yml) to shift away from command line parameters
and into file based configurations).

#### CI - Continuous Integration

**Continuous Integration allows you to guarantee that every increment done to a
system takes it from a stable state into a different stable state**. In more
pragmatic terms this means that every time a developer pushes new code to its
team's VCS (_Version Control System_) its increment will be:

1. Validated against style rules (e.g. `.editorconfig`, `android-lint`,
   `deno lint`)
2. Built / Compiled (e.g. _building a dll for an API, creating an unsigned
   Android AAB, creating a javascript bundle for a SPA_)
3. Automatically tested (e.g. `unit tests`, `integration tests` and
   `instrumented tests` for Android apps)

In order to ensure stability and speed it's important to keep in mind that CI
should focus on validating small incremental changes and what needs to be tested
to ensure those are ok. For big changes we can rely pre-condition steps of our
CD phase (undermentioned).

For this repository we're using _GitHub Actions_ as our CICD orchestrator. The
_CI_ flow can be seen on the [ci.yml file](.github/workflows/ci.yml) - note that
it is only executed for `pull requests` that target the `master` branch. That's
deliberate to ensure we're no spending resources on this demo but in a real
scenario you'd probably want it to run on every `push` for all branches.

#### CD - Continuous Delivery

**Continuous Delivery allows you to automatically deploy (deliver) software
increments and assess their state**. In more pragmatic terms this means that
every time you deem (based on a condition) that code in the team's VCS (_Version
Control System_) is ready for a release _somewhere_ you automate that leg of the
step. **Usually, for CD, we assume that CI has been executed beforehand and thus
the code is stable**.

This is usually reflected by having one branch (usually `master`, `main` or
`develop`) that automatically deploys to `lowers` (dev/qa) environment on every
commit and upon certain manual steps (be it _GitOps_ or _manual prompts and
triggers_).

In order to plan for CD you'll need to:

1. Figure out the _pre-conditions_ for your deployment to happen
   1. Where you'll be deploying
   2. Track dependencies (infrastructure, PaaS and SaaS you rely on)
2. Handle any pre-conditions that aren't code-based
   1. e.g. use `IaC` (_Infrastructure as Code_) to update Infrastructure, PaaS
      or SaaS as needed
   2. e.g. using `ssh` keys to connect to a server
3. Grab artifacts from the _CI_ cycle and deploy them (upload + run)
4. Use Monitors to assess if the deployment was successful
   1. e.g. `Datadog` monitors, `Splunk`, `Azure Application Insights`, et cetera

#### State of the Art CI/CD

The biggest things to keep in mind when trying to achieve state of the Art CI/CD
is to:

1. _Test early and often_
   1. unit tests and integration tests in the CI cycle
   2. api / ui tests in the beginning of a CD cycle
2. _Deploy often_
   1. use techniques such as _Feature Flagging_ to allow features to be toggled
      at win
   2. don't hold back on partial versions
   3. the longer you take to deploy the bigger your risk of breaking things
3. _Be able to mimic your environments_
   1. use tools such as _Docker_, _Docker Compose_ and _Kubernetes_ as part of
      your development lifecycle
   2. make your environments that aren't development add into those settings
   3. use _Infrastructure as Code_ to make it easier to track dependencies
      1. there are tools such as _Terraform_ available but any _IaC_ is better
         than no _IaC_
4. _Monitor, Assess and Make decisions_
   1. have good logging statements and use structured logging whenever it's
      possible
   2. ingest those logs into a single place - if you have 3 different tools with
      different logs you'll make it harder to access your deployments
   3. have dashboards, monitors and run-books readily available
