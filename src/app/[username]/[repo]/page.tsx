import Home from "../../page";

interface RepoPageProps {
  params: Promise<{ username: string; repo: string }>;
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { username, repo } = await params;
  
  return <Home initialUsername={username} initialRepo={repo} />;
}
