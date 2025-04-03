import { useEffect, useRef, useState } from "react";
import {
  FormButton,
  FormCard,
  FormContainer,
  FormTextField,
  FormTitle,
} from "../components/StyledComponents";
import { Link, Navigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import AlertTitle from "@mui/material/AlertTitle";
import {
  Alert,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Skeleton,
} from "@mui/material";
import { useStateContext } from "../context/contextprovider";
import DarkModeButton from "./../components/darkmodeButton";

export default function Register() {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const confirmPasswordRef = useRef();

  const [err, setErr] = useState(null);
  const [redirectToOTP, setRedirectToOTP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isButtonloading, setIsButtonLoading] = useState(false);
  const [affiliation, setAffiliation] = useState(null);
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const { setMessage } = useStateContext();
  const [affiliationData, setAffiliationData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/affiliation")
      .then(({ data }) => {
        setAffiliationData(data.affiliations);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setRoleData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if (affiliation) {
      console.log(affiliation);
      axiosClient
        .get(`/departments/${affiliation}`)
        .then(({ data }) => {
          console.log(data);
          setDepartmentData(data.departments);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Affiliation is not yet available.");
    }
  }, [affiliation, setDepartmentData]);

  if (loading) {
    return (
      <FormContainer>
        <Skeleton variant="rounded" width={720} height={526} />
      </FormContainer>
    );
  }

  const submit = (ev) => {
    ev.preventDefault();
    setIsButtonLoading(true);
    setErr("");
    if (passwordRef.current.value == confirmPasswordRef.current.value) {
      const payload = {
        first_name: firstnameRef.current.value,
        last_name: lastnameRef.current.value,
        email: emailRef.current.value,
        phone_number: `${phoneRef.current.value}`,
        password: passwordRef.current.value,
        roleId: role,
        affiliationId: affiliation,
        departmentId: department,
      };
      axiosClient
        .post("/users/register", payload)
        .then(({ data }) => {
          if (data.message === "OTP sent. Please verify to complete login.") {
            setMessage(data.message);
            setRedirectToOTP(true);
          }
        })
        .catch((err) => {
          console.log(payload);
          const response = err.response;
          console.log(err);
          if (response) {
            setErr(response.data.message);
          }
        })
        .finally(() => setIsButtonLoading(false));
    } else {
      setErr("Passwords do not match.");
      setIsButtonLoading(false);
      console.log(err);
    }
  };

  const handleAffiliationChange = (event) => {
    setAffiliation(event.target.value);
  };
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  if (redirectToOTP) {
    return <Navigate to="/otp" />;
  }
  return (
    <FormContainer sx={{ display: "flex", flexDirection: "column" }}>
      <FormCard variant={"register"} className="form">
        {err && (
          <Alert severity="error" sx={{ marginBottom: "1rem" }}>
            <AlertTitle>Error</AlertTitle>
            {err}
          </Alert>
        )}
        <form onSubmit={submit}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <Box sx={{ width: "50%" }}>
              <FormTitle variant="h1" className="title">
                Personal Information
              </FormTitle>
              <FormTextField
                inputRef={firstnameRef}
                type="name"
                name=""
                id="standard-basic"
                label="First Name"
                variant="standard"
                required
              />
              <FormTextField
                inputRef={lastnameRef}
                type="name"
                name=""
                id="standard-basic"
                label="Last Name"
                variant="standard"
                required
              />
              <FormTextField
                inputRef={emailRef}
                type="email"
                name=""
                id="standard-basic"
                label="Email"
                variant="standard"
                required
              />
              <FormTextField
                inputRef={phoneRef}
                type="text"
                name=""
                id="standard-basic"
                label="Phone"
                variant="standard"
                required
              />
              <FormTextField
                inputRef={passwordRef}
                type="password"
                name=""
                id="standard-basic"
                label="Password"
                variant="standard"
                required
              />
              <FormTextField
                inputRef={confirmPasswordRef}
                type="password"
                name=""
                id="standard-basic"
                label="Confirm Password"
                variant="standard"
                required
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <FormTitle variant="h1" className="title">
                Professional Details
              </FormTitle>
              <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Affiliations
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={affiliation}
                  onChange={handleAffiliationChange}
                  label="Affiliation"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {affiliationData.map((affiliation) => (
                    <MenuItem key={affiliation.id} value={affiliation.id}>
                      {affiliation.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: "100%", marginTop: "1rem" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Departments
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={department}
                  onChange={handleDepartmentChange}
                  label="Department"
                  disabled={departmentData.length === 0}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {departmentData.length > 0 ? (
                    departmentData.map((department) => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem></MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: "100%", marginTop: "1rem" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Roles
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={role}
                  onChange={handleRoleChange}
                  label="Department"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {roleData.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <FormButton
            variant="contained"
            className="btn btn-black"
            type="submit"
            loading={isButtonloading}
          >
            Sign-Up
          </FormButton>
        </form>
        <Typography
          variant="body2"
          className="message"
          sx={{ marginTop: "1rem", textAlign: "center" }}
        >
          Already Have An Account? <Link to="/login">Login</Link>
        </Typography>
      </FormCard>
      <DarkModeButton></DarkModeButton>
    </FormContainer>
  );
}
