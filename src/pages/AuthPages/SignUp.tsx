import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Inscription — StockFlow Tunisia"
        description="Créer un compte — StockFlow Tunisia"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
