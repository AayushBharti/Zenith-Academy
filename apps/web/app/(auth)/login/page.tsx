import Template from "@/components/auth/auth-template"
import OpenRoute from "@/components/auth/open-route"

const Login: React.FC = () => {
  return (
    <OpenRoute>
      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image="/Images/login.webp"
        formType="login"
      />
    </OpenRoute>
  )
}

export default Login
