import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  FormHelperText,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "/logo.png";
import { loginSchema, LoginSchema } from "../validators/auth-validators";
import forklift from "/forklift.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik<LoginSchema>({
    initialValues: { email: "", password: "" },
    onSubmit: (values) => {
      axios.post("https://react-nest-inventory-management-production.up.railway.app/auth/login", values, { withCredentials: true }).then((res) => {
        if (res.data.message) {
          toast.success(res.data.message)
          navigate("/");
        }
      }).catch(err => {toast.error(err.response?.data.message ?? err.message)})
    },
    validationSchema: loginSchema,
  });

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1, // Bring the content to the front
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "white",
        mr: 30,
      }}
    >
      <Box
        display="flex"
        sx={{ flexDirection: "column", alignItems: "center", gap: 8 }}
      >
        <Box sx={{ oveflow: "hidden", height: 350, transform: "scale(-1, 1)" }}>
          <img width="700" height="auto" src={forklift} />
        </Box>
        <Box
          display="flex"
          sx={{
            background: "#FFAE00",
            overflow: "hidden",
            height: 100,
            alignItems: "center",
            ml: 14,
          }}
        >
          <img width="300" height="auto" src={logo} />
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "5px",
          p: 8,
          minWidth: "21rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "black",
        }}
      >
        <Box>
          <img
            width="300"
            height="auto"
            src={logo}
            style={{ marginLeft: "2rem" }}
          />
          <Typography sx={{ fontStyle: "italic" }}>
            "Streamline Your Inventory, Simplify Your Success."
          </Typography>
          <Typography
            sx={{ fontWeight: "bold", fontSize: ".8rem", textAlign: "end" }}
          >
            -Someone who is into inventories probably
          </Typography>

          <form onSubmit={formik.handleSubmit} style={{ marginTop: "2rem" }}>
            <Box display="flex" sx={{ flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                  onChange={formik.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText
                  error={Boolean(
                    formik.touched.password && formik.errors.password
                  )}
                >
                  {formik.touched.password && formik.errors.password}
                </FormHelperText>
              </FormControl>
              <Box display="flex" sx={{ gap: 1, justifyContent: "center" }}>
                <Button variant="contained" color="success" type="submit">
                  Login
                </Button>
                <Link to="/register">
                  <Button variant="contained">Register</Button>
                </Link>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
