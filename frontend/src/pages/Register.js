import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await axios.post("https://playstore-capstone.onrender.com/api/auth/register", {
        ...values,
      });

      alert("Registration successful");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <BackButton />

      <h2>Register</h2>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          role: "user",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name" placeholder="Name" />
            <ErrorMessage
              name="name"
              component="div"
              style={{ color: "red", fontSize: "12px" }}
            />

            <br />
            <br />

            <Field name="email" type="email" placeholder="Email" />
            <ErrorMessage
              name="email"
              component="div"
              style={{ color: "red", fontSize: "12px" }}
            />

            <br />
            <br />

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage
              name="password"
              component="div"
              style={{ color: "red", fontSize: "12px" }}
            />

            <br />
            <br />

            <Field as="select" name="role">
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </Field>

            <br />
            <br />

            <button type="submit" disabled={isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;