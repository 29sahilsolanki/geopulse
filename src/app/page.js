import LoginNav from "@/components/common/LoginNav";
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  return (
    <>
      <LoginNav />
      <div className="min-h-screen">
        {" "}
        {session ? (
          <>
            <p>Logged in as {session.user.email}</p>
            <pre>{JSON.stringify(session.user, null, 2)}</pre>
          </>
        ) : (
          <a href="/auth/login">Login</a>
        )}
      </div>
    </>
  );
}
