import GitHub from 'next-auth/providers/github';

const githubProvider = GitHub({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
});

export default githubProvider;
