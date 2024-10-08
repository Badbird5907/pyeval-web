const AppVersion = () => {
  const env = import.meta.env;
  return (
    <div className={"float-right ml-auto pr-2 text-gray-500"}>
      {env.VITE_VERCEL_ENV ? (
        <a
          className={"text-gray-500 no-underline"}
          target={"_blank"}
          href={`https://github.com/${env.VITE_VERCEL_GIT_REPO_OWNER}/${env.VITE_VERCEL_GIT_REPO_SLUG}/commit/${env.VITE_VERCEL_GIT_COMMIT_SHA}`}
          rel="noreferrer"
        >
          {env.VITE_VERCEL_ENV}:vercel:{env.VITE_VERCEL_GIT_PROVIDER}:
          {env.VITE_VERCEL_GIT_COMMIT_REF}/
          {env.VITE_VERCEL_GIT_COMMIT_SHA.toString().substring(0, 7)}
        </a>
      ) : (
        <span className={"text-gray-500"}>Development</span>
      )}
    </div>
  );
};

export default AppVersion;
