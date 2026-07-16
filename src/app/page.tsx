import { redirect } from "next/navigation";

// A raiz só decide para onde mandar o usuário.
// A ligação real de "logado -> /dashboard, deslogado -> /login" já é
// garantida pelo middleware; isto aqui é só o atalho da home "/".
export default function Home() {
  redirect("/dashboard");
}
