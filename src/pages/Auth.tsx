import LoginForm from "@/components/auth/Login";
import RegisterForm from "@/components/auth/Register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AuthPageProps = {
  type: "login" | "register";
};

const AuthPage = ({ type }: AuthPageProps) => {
  return (
    <Tabs defaultValue={type}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthPage;
