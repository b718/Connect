## Connect

I wanted to build something for my teachers, which was the inspiration for Connect. It's meant to act as a platform where teachers are able to upload tests so that it can be automatically graded via some LLM provider.

My assumptions for this project are as follows. I believe test-taking falls under the 80/20 principle, where 80% of students are most likely going to get the answer right and 20% require manual intervention. This perspective might be a bit biased, as I've gotten lucky with my educational journey, as I've only received education from top teachers and institutions throughout my academic career.

Ultimately, it was a fun project, and I thought it would be cool to find a way to save the teacher time and stress and give them more time back to, well, teach!

## Architecture

COMMING SOON!

## Tech Stack

### Front-End

- React (I'm most familar with it so it allows me to iterate fast)
- Next.js (I liked the additonial features it offers and its something I wanted to learn)

### Back-End

- TypeScript + Express + Prisma ORM (Super familar with it and it allows me to iterate fast)

### Database

- Prisma (I wanted to save on costs and the Prisma Postgres free-tier was enough to cover this)
- S3 (Needed a bucket to store static assets such as images as well as the export data ie markdown, text files)

### Deployment

- CloudFlare (Super easy and allows me to deploy the front-end in minutes)
- AWS + AWS CDK (Super familar with it, so I can iterate fast and it has extremely detailed documentation)

### Access Today

COMMING SOON!

### Local Development

To get this running locally do the following.

1. Make sure you have Docker desktop installed.
2. Make sure you have mprocs installed.
3. To start both the front and back end(s), type `mprocs` in the terminal.
